import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rename, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { root, noticeInputs, regularBytes } from '../package/package.mjs';
import { reconcileNotices, noticePaths } from './notices.mjs';
import { command } from '../acceptance/run.mjs';
import { calculate, commitPattern } from '../release/policy.mjs';
import { candidateDescriptor, candidateBody } from './context.mjs';
import { candidateDocumentPaths, prepareDocumentation, documentSnapshot } from './documentation.mjs';
import { pairKey } from '../watch/state.mjs';

const json = async path => JSON.parse(await readFile(path, 'utf8'));
const saveJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');

export async function resolveSources({ repository, directory, context, run = command }) {
  const lockPath = join(directory, 'sqlite-vector.sources.lock.json');
  let output;
  try {
    output = JSON.parse(await run('bash', ['tools/inputs.sh', 'resolve-vector',
      '--sqlite-version', context.selection.sqlite, '--vector-version', context.selection.sqliteVector,
      '--baseline-lock', 'inputs/sqlite-vector.sources.lock.json', '--output', lockPath], { cwd: repository }));
    assert.equal(output.lockPath, lockPath);
  } finally {
    // Keep failed resolution traces too, outside production's fresh inputs workspace.
    const inputs = join(repository, '.work/inputs');
    for (const name of await readdir(inputs).catch(error => { if (error.code === 'ENOENT') return []; throw error; })) {
      assert.match(name, /^resolve-[A-Za-z0-9_-]+$/, 'Unexpected earlier source state');
      await rename(join(inputs, name), join(directory, name));
    }
  }
  await run('bash', ['tools/inputs.sh', 'validate', lockPath], { cwd: repository });
  return json(lockPath);
}

export async function prepareCandidate({ context, readSnapshot, readCandidates, services, repository = root,
  resolve = resolveSources, reconcile = reconcileNotices,
  prepareDocuments = prepareDocumentation, run = command }) {
  await mkdir(join(repository, '.work/updates'), { recursive: true });
  const directory = await mkdtemp(join(repository, '.work/updates/run-'));
  const result = { schemaVersion: 1, status: 'in-progress', ...context, directory, integrationEligible: false, publicationCalls: 0, operations: [] };
  const path = join(directory, 'candidate.json');
  const save = () => saveJson(path, result);
  const step = async (name, action) => {
    let value;
    try { value = await action(); }
    catch (error) { result.operations.push({ name, status: error.completionUnknown ? 'unknown' : 'failed', diagnostic: error.message }); throw error; }
    result.operations.push({ name, status: 'passed' });
    try { await save(); } catch (error) { error.message = `Operation ${name} acknowledged; preparation journal persistence failed: ${error.message}`; throw error; }
    return value;
  };
  await save();
  try {
    result.baseCommit = await step('checkout', async () => {
      assert.equal(await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repository }), '', 'Clean preparation checkout required');
      const base = await run('git', ['rev-parse', 'HEAD'], { cwd: repository }); assert.match(base, commitPattern);
      // Detect earlier production state before resolution creates diagnostic files.
      for (const name of ['inputs', 'harness', 'js', 'npm-cache', 'build', 'package', 'package-check', 'build-check']) {
        const files = await readdir(join(repository, '.work', name)).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
        assert.equal(files.length, 0, `Fresh preparation requires empty .work/${name}`);
      }
      return base;
    });
    result.observedCandidates = await step('candidate-state', async () => {
      assert.equal(typeof readCandidates, 'function', 'Candidate inventory unavailable');
      const candidates = await readCandidates();
      assert.ok(Array.isArray(candidates), 'Malformed candidate inventory');
      return candidates.filter(candidate => pairKey(candidate.selection) === pairKey(context.selection) &&
        !(candidate.kind === 'run' && candidate.runId === context.preparation.runId && candidate.attempt === context.attempt));
    });
    if (result.observedCandidates.length) {
      result.status = 'existing-candidate'; result.integrationEligible = false; result.publicationCalls = 0;
      await save(); return { ...result, path };
    }
    const lock = await step('resolve-vector', () => resolve({ repository, directory, context, run }));
    const selected = candidateDescriptor(context, lock);
    result.preflightState = await step('state', readSnapshot);
    result.preflight = calculate({ selection: context.selection, snapshot: result.preflightState, comment: context.comment });
    result.noticeReport = join(directory, 'notices.json');
    const notices = await step('notices', () => reconcile({ repository, directory, lock, run }));
    result.documentSources = await step('documentation-preparation', () => prepareDocuments({ repository, lock, context }));
    result.commit = await step('commit', async () => {
      await run('git', ['switch', '-c', context.branch], { cwd: repository });
      const lockPath = join(repository, 'inputs/sqlite-vector.sources.lock.json');
      if (JSON.stringify(await json(lockPath)) !== JSON.stringify(lock)) await saveJson(lockPath, lock);
      await saveJson(join(repository, 'inputs/release.json'), selected);
      for (const path of noticePaths) {
        const data = await regularBytes(join(notices.prepared, path));
        if (!(await regularBytes(join(repository, path))).equals(data)) await writeFile(join(repository, path), data);
      }
      await noticeInputs({ inputs: lock }, repository);
      await run('git', ['add', '--', 'inputs/sqlite-vector.sources.lock.json', 'inputs/release.json', ...noticePaths, ...candidateDocumentPaths], { cwd: repository });
      await run('git', ['-c', 'user.name=sqlite-vector-wasm preparation', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
        'commit', '-m', 'chore: prepare distribution candidate'], { cwd: repository });
      const commit = await run('git', ['rev-parse', 'HEAD'], { cwd: repository }); assert.match(commit, commitPattern);
      assert.equal(await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repository }), '');
      // Retain the exact committed handoff even when the temporary checkout disappears.
      await writeFile(join(directory, 'release.json'), await regularBytes(join(repository, 'inputs/release.json')));
      return commit;
    });
    assert.deepEqual(await documentSnapshot(repository), result.documentSources, 'Prepared documentation changed before PR');
    await step('repository', async () => {
      await run('sh', ['tools/check-repository.sh'], { cwd: repository, log: join(directory, 'repository.log') });
    });
    // Full product qualification belongs to the exact-head PR producer.
    result.identity = result.preflight;
    result.documentation = { sourceHashes: result.documentSources, previewState: 'pending', integrationEligible: false,
      previewUrl: `https://${context.repository.split('/')[0]}.github.io/${context.repository.split('/')[1]}/preview/`,
      checksUrl: `https://github.com/${context.repository}/commit/${result.commit}/checks` };
    assert.equal(await run('git', ['rev-parse', 'HEAD'], { cwd: repository }), result.commit);
    assert.equal(await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repository }), '', 'Candidate changed during preparation');
    await save();
    if (context.rehearsal) {
      assert.equal(services, undefined, 'Rehearsal has no write adapter');
      result.status = 'prepared-without-pr'; result.publicationCalls = 0;
    } else {
      assert.ok(services, 'Candidate write authorization unavailable');
      result.branchResult = await step('push', async () => {
        const pushed = await services.push(context.branch, result.commit);
        assert.equal(pushed.branch, context.branch); assert.equal(pushed.head, result.commit, 'Pushed candidate head mismatch');
        return pushed;
      });
      await save();
      result.pullRequest = await step('pull-request', () => services.createPullRequest({ branch: context.branch,
        commit: result.commit, title: `chore: prepare ${result.identity.version} distribution`, body: candidateBody(result) }));
      assert.equal(result.pullRequest.head, result.commit, 'Created PR head mismatch');
      result.status = 'candidate-awaiting-qualification';
    }
    await save(); return { ...result, path };
  } catch (error) {
    result.status = 'failed'; result.diagnostic = error.message;
    try { await save(); } catch (retention) { error.message += `; preparation diagnostics could not be retained: ${retention.message}`; }
    throw new Error(`Candidate preparation failed; evidence: ${path}`, { cause: error });
  }
}
