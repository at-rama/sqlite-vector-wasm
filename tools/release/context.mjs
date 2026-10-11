import assert from 'node:assert/strict';
import { channelFor, commitPattern } from './policy.mjs';
import { pages, repositoryName } from './state.mjs';

export function descriptor(value, lock) {
  assert.deepEqual(Object.keys(value || {}).sort(), ['preparation', 'releaseComment', 'schemaVersion', 'sqlite', 'sqliteVec']);
  assert.equal(value.schemaVersion, 1, 'Unsupported candidate descriptor');
  channelFor({ sqlite: value.sqlite, sqliteVec: value.sqliteVec });
  assert.equal(value.sqlite, lock.sqlite.version); assert.equal(value.sqliteVec, lock.sqliteVec.version, 'Selection/source lock mismatch');
  assert.equal(typeof value.releaseComment, 'string');
  assert.ok(Number.isSafeInteger(value.preparation?.runId) && value.preparation.runId > 0);
  assert.match(value.preparation?.url || '', /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/actions\/runs\/[1-9][0-9]*$/);
  assert.ok(value.preparation.url.endsWith(`/runs/${value.preparation.runId}`), 'Preparation identity mismatch');
  return { selection: { sqlite: value.sqlite, sqliteVec: value.sqliteVec }, comment: value.releaseComment, preparation: value.preparation };
}

export async function integratedContext({ repository, event, get, readAt }) {
  repositoryName(repository);
  assert.equal(event.action, 'closed');
  assert.equal(event.repository?.full_name, repository);
  assert.ok(event.pull_request?.merged && event.pull_request.base?.ref === 'main', 'No authorized candidate integration');
  assert.equal(event.pull_request.base.repo.full_name, repository);
  const number = event.pull_request.number;
  assert.ok(Number.isSafeInteger(number) && number > 0);
  const response = await get(`https://api.github.com/repos/${repository}/pulls/${number}`);
  assert.equal(response.status, 200, 'Cannot establish integration context');
  const pr = response.data;
  assert.equal(pr.merged_by?.type, 'User', 'Integration must be human');
  assert.ok(pr.merged && pr.state === 'closed' && pr.base?.ref === 'main' && pr.base.repo.full_name === repository, 'Unmerged or unrelated PR');
  assert.equal(pr.merge_commit_sha, event.pull_request.merge_commit_sha, 'Integration revision changed');
  assert.match(pr.merge_commit_sha || '', commitPattern);
  const files = await pages(repository, `pulls/${number}/files`, get);
  assert.ok(pr.changed_files <= 3000 && files.length === pr.changed_files, 'Truncated candidate file list');
  assert.ok(files.some(file => file.filename === 'inputs/release.json' && ['added','modified'].includes(file.status)), 'Candidate descriptor was not introduced/updated');
  const lock = JSON.parse(await readAt(pr.merge_commit_sha, 'inputs/sources.lock.json'));
  const selected = descriptor(JSON.parse(await readAt(pr.merge_commit_sha, 'inputs/release.json')), lock);
  assert.ok(selected.preparation.url.startsWith(`https://github.com/${repository}/actions/runs/`), 'Preparation repository mismatch');
  return { ...selected, commit: pr.merge_commit_sha, repository, pullRequest: number };
}
