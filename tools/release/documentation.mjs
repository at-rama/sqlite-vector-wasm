import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readFile, mkdir, cp } from 'node:fs/promises';
import { root, hash } from '../package/package.mjs';
import { assertApplicable } from '../acceptance/contracts.mjs';
import { candidateDocumentPaths, assertDocumentation, documentSnapshot, checkDocumentation } from '../updates/documentation.mjs';
import { documentationSources, renderPublicDocument } from '../site/documentation.mjs';
import { runArtifact, uniqueRecord } from './artifacts.mjs';
import { prepareDocs } from '../site/docs.mjs';

const successfulRun = (run, repository, path, event, { requireSuccess = true } = {}) => {
  assert.equal(run.repository?.full_name, repository, 'Unrelated evidence repository');
  assert.equal(run.path?.split('@')[0], path, 'Unrelated evidence workflow');
  assert.equal(run.event, event, 'Unrelated evidence event');
  assert.equal(run.status, 'completed');
  if (requireSuccess) assert.equal(run.conclusion, 'success', 'Unsuccessful evidence run');
  assert.ok(Number.isSafeInteger(run.run_attempt) && run.run_attempt > 0);
};
const apiJSON = async (get, url) => {
  const response = await get(url); assert.equal(response.status, 200, 'Documentation evidence unavailable'); return response.data;
};
export const reviewedRendererPaths = ['tools/site/documentation.mjs', 'tools/site/docs.mjs', 'tools/package/package.mjs'];

export async function assertObservedDocuments({ live, example, repository, pullRequest, head, readAt }) {
  assert.equal(live.publication?.repository, repository);
  assert.equal(live.publication.mode, 'preview'); assert.equal(live.publication.pullRequest, pullRequest);
  assert.equal(live.publication.preview?.commit, head, 'Observed preview head mismatch');
  const results = live.results?.filter(r => r.preview?.commit === head);
  assert.equal(results?.length, 1, 'Missing exact preview observation');
  const observed = results[0];
  const location = new URL(observed.url);
  assert.equal(location.protocol, 'http:'); assert.equal(location.hostname, '127.0.0.1');
  assert.equal(location.pathname, '/sqlite-vector-wasm/preview/', 'Incorrect assembled preview prefix');
  assert.deepEqual(observed.viewports, [1280, 390]); assert.ok(observed.browser);
  assert.equal(observed.destinations, 3); assert.equal(observed.directVisits, 6); assert.equal(observed.clientTransitions, 6);
  assert.deepEqual(observed.documentation, await Promise.all(documentationSources.map(async source => ({ source,
    sha256: hash(Buffer.from(renderPublicDocument(await readAt(head, source), example.context))) }))));
}

export async function reviewedDocumentation({ repository, pr, selected, readAt, get,
  siteRunId, directory = join(root, '.work/release/review'), artifact = runArtifact }) {
  const api = `https://api.github.com/repos/${repository}`;
  const head = pr.head?.sha;
  assert.match(head || '', /^[a-f0-9]{40}$/, 'Missing reviewed candidate head');
  assert.equal(pr.head.repo?.full_name, repository);
  const branch = new RegExp(`^candidate/run-${selected.preparation.runId}-([1-9][0-9]*)$`).exec(pr.head.ref || '');
  assert.ok(branch, 'Candidate branch/preparation mismatch');
  const attempt = Number(branch[1]);
  const sources = {}, renderers = {};
  for (const path of [...candidateDocumentPaths, ...reviewedRendererPaths, 'inputs/release.json', 'inputs/sqlite-vector.sources.lock.json']) {
    const before = await readAt(head, path), after = await readAt(pr.merge_commit_sha, path);
    assert.equal(after, before, `Unreviewed integrated document/input change: ${path}`);
    if (candidateDocumentPaths.includes(path)) sources[path] = hash(Buffer.from(before));
    if (reviewedRendererPaths.includes(path)) renderers[path] = hash(Buffer.from(before));
  }
  const preparation = await apiJSON(get, `${api}/actions/runs/${selected.preparation.runId}/attempts/${attempt}`);
  successfulRun(preparation, repository, '.github/workflows/updates.yml', 'workflow_dispatch');
  assert.equal(preparation.head_branch, 'main'); assert.equal(preparation.run_attempt, attempt);

  let run;
  if (siteRunId) run = await apiJSON(get, `${api}/actions/runs/${siteRunId}`);
  else {
    const listing = await apiJSON(get, `${api}/actions/runs?head_sha=${head}&event=pull_request&per_page=100`);
    assert.ok(Array.isArray(listing.workflow_runs));
    const matches = listing.workflow_runs.filter(r => r.head_sha === head && ['.github/workflows/site.yml','.github/workflows/acceptance.yml'].includes(r.path?.split('@')[0]));
    assert.ok(matches.length, 'Missing exact-head documentation preview');
    run = matches.sort((a,b) => b.id - a.id)[0];
  }
  // Required named jobs and their identity-bound local results establish Site
  // readiness, not an obsolete public observer's aggregate workflow verdict.
  const siteWorkflow = run.path?.split('@')[0];
  assert.ok(['.github/workflows/site.yml','.github/workflows/acceptance.yml'].includes(siteWorkflow), 'Unrelated Site workflow');
  successfulRun(run, repository, siteWorkflow, 'pull_request', {requireSuccess:false});
  assert.equal(run.head_sha, head, 'Stale documentation preview');
  const jobs = await apiJSON(get, `${api}/actions/runs/${run.id}/jobs?per_page=100`);
  assert.equal(jobs.total_count, jobs.jobs?.length, 'Truncated documentation jobs');
  for (const name of ['build','deploy']) {
    const matching = jobs.jobs.filter(j => j.name === (siteWorkflow === '.github/workflows/acceptance.yml' ? `site / ${name}` : name));
    assert.equal(matching.length, 1); assert.equal(matching[0].status, 'completed');
    assert.equal(matching[0].conclusion, 'success', `Required Site ${name} failed or missing`);
  }
  const inPR = siteWorkflow === '.github/workflows/acceptance.yml';
  const producer = inPR ? run : preparation;
  if (inPR) {
    const matching = jobs.jobs.filter(j => j.name === 'composition');
    assert.equal(matching.length, 1); assert.equal(matching[0].status, 'completed'); assert.equal(matching[0].conclusion, 'success', 'Candidate producer failed or missing');
  }
  const prepared = await artifact({ repository, run: producer, name: inPR ? `candidate-${run.id}-${run.run_attempt}` : `updates-${preparation.id}-${attempt}`, get, directory });
  const candidate = await uniqueRecord(prepared, 'candidate.json', c => c.commit === head);
  assert.equal(candidate.status, inPR ? 'qualified-in-pr' : 'candidate-ready', 'Candidate qualification did not complete');
  if (inPR) assert.deepEqual(candidate.qualification, {runId:run.id,attempt:run.run_attempt});
  else assert.equal(candidate.baseCommit, preparation.head_sha, 'Preparation base mismatch');
  assert.equal(candidate.pullRequest?.number, pr.number); assert.equal(candidate.pullRequest.head, head);
  assert.deepEqual(candidate.selection, selected.selection); assert.deepEqual(candidate.preparation, selected.preparation);
  assert.deepEqual(candidate.documentSources, sources, 'Reviewed source snapshot mismatch');
  if (!inPR) assertDocumentation(candidate.documentation?.example, { commit: head, selection: selected.selection,
    archive: candidate.archive, sourceHashes: sources, identity: candidate.identity });
  const accepted = await uniqueRecord(prepared, 'acceptance.json', r => r.source?.commit === head);
  assertApplicable(accepted, head, candidate.archive);
  const checks = await artifact({ repository, run, name: `site-checks-${run.id}`, get, directory });
  const input = await uniqueRecord(checks, 'handoff.json', h => h.artifactId === prepared.id);
  assert.equal(input.runId, producer.id); assert.equal(input.commit, head); assert.equal(input.artifactSha256, prepared.sha256);
  const example = await uniqueRecord(checks, 'result.json', r => r.context?.mode === 'candidate');
  assertDocumentation(example, { commit: head, selection: selected.selection, archive: candidate.archive, sourceHashes: sources, identity: candidate.identity });
  const live = await uniqueRecord(checks, 'assembled.json');
  assert.equal(live.publication?.preview?.branch, pr.head.ref, 'Observed preview branch mismatch');
  await assertObservedDocuments({ live, example, repository, pullRequest: pr.number, head, readAt });
  return { candidateCommit: head, forecast: candidate.identity.version, archive: candidate.archive, sourceHashes: sources, rendererHashes: renderers,
    preparation: { runId: preparation.id, attempt },
    qualification: { runId: producer.id, attempt: producer.run_attempt, artifactId: prepared.id, artifactSha256: prepared.sha256 },
    site: { runId: run.id, attempt: run.run_attempt, checksArtifactId: checks.id, checksSha256: checks.sha256 }, example };
}

export async function assertReviewedSources(context, repository) {
  const reviewed = context.documentation;
  assert.ok(reviewed?.site?.runId && reviewed.preparation?.runId, 'Missing reviewed documentation context');
  assert.match(reviewed.candidateCommit || '', /^[a-f0-9]{40}$/);
  assert.deepEqual(await documentSnapshot(repository), reviewed.sourceHashes, 'Substantive documentation changed after review');
  assert.deepEqual(Object.keys(reviewed.rendererHashes || {}).sort(), [...reviewedRendererPaths].sort(), 'Missing reviewed renderers');
  for (const path of reviewedRendererPaths) assert.equal(hash(await readFile(join(repository,path))), reviewed.rendererHashes[path], 'Documentation rendering changed after review');
  assert.equal(reviewed.preparation.runId, context.preparation?.runId);
  assertDocumentation(reviewed.example, { commit: reviewed.candidateCommit, selection: context.selection,
    archive: reviewed.archive, sourceHashes: reviewed.sourceHashes, identity: { version: reviewed.forecast } });
}

export function assertFinalDocumentation(context, identity, accepted, documentation) {
  assert.ok(documentation, 'Missing definitive documentation checks');
  assert.deepEqual(documentation.reviewed, context.documentation, 'Changed reviewed documentation context');
  assert.deepEqual(documentation.sourceHashes, context.documentation.sourceHashes);
  assertDocumentation(documentation.example, { commit: context.commit, selection: context.selection,
    archive: accepted.archive, sourceHashes: documentation.sourceHashes, identity });
  assert.deepEqual(documentation.packageDocuments, accepted.packaged.documents, 'Final package document mismatch');
  for (const record of documentation.packageDocuments) {
    assert.equal(record.sourceSha256, documentation.sourceHashes[record.source], 'Unreviewed package document');
  }
  assert.equal(documentation.links?.check, 'source-relative-targets-and-fragments');
  assert.deepEqual(documentation.links.context, documentation.example.context, 'Stale final link context');
  assert.deepEqual(documentation.links.pages.map(p => p.source), documentationSources);
  for (const page of documentation.links.pages) {
    assert.equal(page.sourceSha256, documentation.sourceHashes[page.source]);
    assert.match(page.sha256, /^[a-f0-9]{64}$/);
    assert.ok(Array.isArray(page.links) && Array.isArray(page.images));
  }
}

// This standalone link check needs the shell's actual Demo route, but no
// demo runtime acquisition or build. Missing routes/fragments still fail.
export async function prepareDocumentationLinks(repository, destination) {
  await mkdir(join(destination, 'demo'), { recursive: true });
  await cp(join(repository, 'site/demo/index.md'), join(destination, 'demo/index.md'));
  return prepareDocs(repository, destination, '/sqlite-vector-wasm/preview/');
}

export async function renewDocumentation({ repository, qualified, directory, run }) {
  const example = await checkDocumentation({ repository, qualified, directory, run });
  const report = JSON.parse(await readFile(join(qualified.bundle, 'acceptance.json'), 'utf8'));
  const destination = join(directory, 'documentation-links');
  await run('bash', ['tools/harness.sh', 'exec', 'node', '--input-type=module', '-e',
    "import {prepareDocumentationLinks} from './tools/release/documentation.mjs'; await prepareDocumentationLinks(process.cwd(),process.argv[1]);", destination],
  { cwd: repository, env: { ...process.env, HARNESS_STATE: report.toolsDirectory }, log: join(directory, 'documentation-links.log') });
  const manifest = JSON.parse(await readFile(join(destination, 'public/site-docs.json'), 'utf8'));
  return { example, links: { check: 'source-relative-targets-and-fragments', context: manifest.documentation,
    pages: manifest.pages.map(({ source, sourceSha256, sha256, links, images }) => ({ source, sourceSha256, sha256, links, images })) } };
}
