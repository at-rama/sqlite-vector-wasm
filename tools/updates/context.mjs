import assert from 'node:assert/strict';
import { channelFor, commitPattern } from '../release/policy.mjs';
import { repositoryName } from '../release/state.mjs';
import { descriptor } from '../release/context.mjs';

export function invocation({ event, environment, rehearsal = false }) {
  const repository = repositoryName(environment.GITHUB_REPOSITORY);
  assert.equal(event.repository?.full_name, repository, 'Dispatch repository mismatch');
  assert.equal(environment.GITHUB_ACTIONS, 'true', 'Hosted invocation required');
  if (rehearsal) {
    assert.equal(environment.GITHUB_EVENT_NAME, 'pull_request', 'Rehearsal requires a PR');
    assert.equal(event.pull_request?.base?.repo?.full_name, repository);
    assert.equal(event.pull_request?.head?.repo?.full_name, repository, 'No fork rehearsal');
    assert.equal(event.pull_request?.base?.ref, 'main');
  } else {
    assert.equal(environment.GITHUB_EVENT_NAME, 'workflow_dispatch', 'Human dispatch required');
    assert.equal(event.sender?.type, 'User', 'Human dispatch actor required');
    assert.equal(environment.GITHUB_REF, 'refs/heads/main', 'Dispatch must select main');
  }
  const input = event.inputs;
  assert.ok(input && typeof input === 'object' && !Array.isArray(input), 'Exact dispatch inputs required');
  const commentKeys = ['sqlite_comment', 'sqlite_vector_comment', 'misc_comment'];
  assert.deepEqual(Object.keys(input).filter(key => !commentKeys.includes(key)).sort(), ['sqlite_vector_version', 'sqlite_version']);
  const selection = { sqlite: input.sqlite_version, sqliteVector: input.sqlite_vector_version };
  channelFor(selection);
  for (const key of commentKeys) assert.ok(input[key] === undefined || typeof input[key] === 'string');
  const comment = commentKeys.map(key => (input[key] ?? '').trim()).filter(Boolean).join('\n\n');
  const runId = Number(environment.GITHUB_RUN_ID), attempt = Number(environment.GITHUB_RUN_ATTEMPT);
  assert.ok(Number.isSafeInteger(runId) && runId > 0 && /^[1-9][0-9]*$/.test(environment.GITHUB_RUN_ID || ''), 'Real preparation run required');
  assert.ok(Number.isSafeInteger(attempt) && attempt > 0 && /^[1-9][0-9]*$/.test(environment.GITHUB_RUN_ATTEMPT || ''), 'Run attempt required');
  const preparation = { runId, url: `https://github.com/${repository}/actions/runs/${runId}` };
  return { repository, selection, comment, preparation, attempt,
    branch: `candidate/run-${runId}-${attempt}`, rehearsal };
}

export function candidateDescriptor(context, lock) {
  const value = { schemaVersion: 2, sqlite: context.selection.sqlite, sqliteVector: context.selection.sqliteVector,
    releaseComment: context.comment, preparation: context.preparation };
  descriptor(value, lock);
  assert.ok(value.preparation.url.startsWith(`https://github.com/${context.repository}/actions/runs/`), 'Preparation repository mismatch');
  return value;
}

export function candidateBody(result) {
  assert.match(result.commit, commitPattern);
  assert.ok(result.documentation && result.documentation.integrationEligible === false, 'Missing pending documentation handoff');
  return `Prepared distribution candidate\n\nSQLite: ${result.selection.sqlite}\nSQLite-Vector: ${result.selection.sqliteVector}\nCandidate commit: ${result.commit}\nForecast: ${result.identity.version} (${result.identity.channel}); not reserved or published.\nArchive SHA-256: ${result.archive.sha256}\nPreparation: ${result.preparation.url} (attempt ${result.attempt})\nEvidence artifact: updates-${result.preparation.runId}-${result.attempt}\n\nProduct qualification and the exact-archive documentation example passed. This unpublished candidate is NOT yet eligible for integration: Site preview checks are pending.\n\n[Shared documentation preview](${result.documentation.previewUrl}) · [Exact-head checks](${result.documentation.checksUrl})\n\nApprove any pending PR workflow runs. Before deciding whether to merge, check that Site build/deploy/observe passed for this exact head and archive and that the shared preview identifies this commit; the URL alone is not evidence. Missing, failed, stale or mismatched mandatory checks leave the candidate ineligible. Publication recalculates and qualifies the definitive main revision and payload.\n${result.comment ? `\nRelease comment:\n${result.comment}\n` : ''}`;
}
