import assert from 'node:assert/strict';
import { channelFor, commitPattern } from './policy.mjs';
import { selectedEngine } from '../build/build.mjs';
import { vectorLock } from '../acceptance/contracts.mjs';
import { pages, repositoryName } from './state.mjs';
import { reviewedDocumentation } from './documentation.mjs';

export function descriptor(value, lock) {
  assert.equal(value?.schemaVersion, 2, 'Current candidate requires SQLite-Vector');
  const key = 'sqliteVector';
  assert.deepEqual(Object.keys(value || {}).sort(), ['preparation', 'releaseComment', 'schemaVersion', 'sqlite', key].sort());
  assert.equal(value.schemaVersion, 2, 'Unsupported candidate descriptor');
  channelFor({ sqlite: value.sqlite, [key]: value[key] });
  assert.equal(selectedEngine(lock), key, 'Wrong candidate lock engine');
  assert.equal(value.sqlite, lock.sqlite.version); assert.equal(value[key], lock[key]?.version, 'Selection/source lock mismatch');
  assert.equal(typeof value.releaseComment, 'string');
  assert.ok(Number.isSafeInteger(value.preparation?.runId) && value.preparation.runId > 0);
  assert.match(value.preparation?.url || '', /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/actions\/runs\/[1-9][0-9]*$/);
  assert.ok(value.preparation.url.endsWith(`/runs/${value.preparation.runId}`), 'Preparation identity mismatch');
  return { selection: { sqlite: value.sqlite, [key]: value[key] }, comment: value.releaseComment, preparation: value.preparation };
}

async function candidateFiles({ repository, pullRequest, get }) {
  assert.ok(Number.isSafeInteger(pullRequest?.number) && pullRequest.number > 0, 'Missing candidate PR identity');
  assert.ok(Number.isSafeInteger(pullRequest.changed_files) && pullRequest.changed_files >= 0 && pullRequest.changed_files <= 3000, 'Truncated candidate file list');
  const files = await pages(repository, `pulls/${pullRequest.number}/files`, get);
  assert.equal(files.length, pullRequest.changed_files, 'Truncated candidate file list');
  return files;
}
export async function candidateDescriptorChanged(input) {
  return (await candidateFiles(input)).some(file => file.filename === 'inputs/release.json' && ['added','modified'].includes(file.status));
}

export async function documentationQualificationNeeded({ repository, pullRequest, profile, candidate, get }) {
  if (profile.mode !== 'candidate') return false;
  const files = await candidateFiles({ repository, pullRequest, get });
  // Nominal release PRs already carry their exact Updates-qualified archive.
  if (candidate?.schemaVersion === 2 && /^candidate\/run-[1-9][0-9]*-[1-9][0-9]*$/.test(pullRequest.head?.ref || '') &&
      files.some(f => f.filename === 'inputs/release.json' && ['added','modified'].includes(f.status))) return false;
  return files.some(f => /^(?:README\.md$|docs\/(?:usage\.md$|sqlite-vector\/|common\/browser\.md$)|site\/|inputs\/|tools\/(?:site|release|updates|package|build|harness)(?:\/|\.sh$)|\.github\/workflows\/(?:site|release|updates)\.yml$)/.test(f.filename));
}
export async function integratedContext({ repository, event, get, readAt, siteRunId, review = reviewedDocumentation }) {
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
  assert.ok(await candidateDescriptorChanged({ repository, pullRequest: pr, get }), 'Candidate descriptor was not introduced/updated');
  const value = JSON.parse(await readAt(pr.merge_commit_sha, 'inputs/release.json'));
  assert.equal(value.schemaVersion, 2, 'New product publication requires a Vector descriptor');
  const lock = JSON.parse(await readAt(pr.merge_commit_sha, vectorLock));
  const selected = descriptor(value, lock);
  assert.ok(selected.preparation.url.startsWith(`https://github.com/${repository}/actions/runs/`), 'Preparation repository mismatch');
  const run = await get(`https://api.github.com/repos/${repository}/actions/runs/${selected.preparation.runId}`);
  assert.equal(run.status, 200, 'Preparation run unavailable');
  assert.equal(run.data?.id, selected.preparation.runId, 'Preparation run mismatch');
  assert.equal(run.data?.html_url, selected.preparation.url, 'Preparation run URL mismatch');
  assert.equal(run.data?.repository?.full_name, repository, 'Preparation run repository mismatch');
  const documentation = await review({ repository, pr, selected, readAt, get, siteRunId });
  return { ...selected, commit: pr.merge_commit_sha, repository, pullRequest: number, documentation };
}
