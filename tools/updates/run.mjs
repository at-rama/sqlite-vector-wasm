import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rename, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { calculate, commitPattern } from '../release/policy.mjs';
import { qualify } from '../release/run.mjs';
import { candidateDescriptor, candidateBody } from './context.mjs';

const json = async path => JSON.parse(await readFile(path, 'utf8'));
const saveJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');

export async function resolveSources({ repository, directory, context, run = command }) {
  const lockPath = join(directory, 'sources.lock.json');
  let output;
  try {
    output = JSON.parse(await run('bash', ['tools/inputs.sh', 'resolve',
      '--sqlite-version', context.selection.sqlite, '--sqlite-vec-version', context.selection.sqliteVec,
      '--baseline-lock', 'inputs/sources.lock.json', '--output', lockPath], { cwd: repository }));
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

export async function prepareCandidate({ context, readSnapshot, services, repository = root,
  resolve = resolveSources, qualification = qualify, run = command }) {
  await mkdir(join(repository, '.work/updates'), { recursive: true });
  const directory = await mkdtemp(join(repository, '.work/updates/run-'));
  const result = { schemaVersion: 1, status: 'in-progress', ...context, directory, operations: [] };
  const path = join(directory, 'candidate.json');
  const save = () => saveJson(path, result);
  const step = async (name, action) => {
    try { const value = await action(); result.operations.push({ name, status: 'passed' }); await save(); return value; }
    catch (error) { result.operations.push({ name, status: 'failed', diagnostic: error.message }); throw error; }
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
    const lock = await step('resolve', () => resolve({ repository, directory, context, run }));
    const selected = candidateDescriptor(context, lock);
    result.preflightState = await step('state', readSnapshot);
    result.preflight = calculate({ selection: context.selection, snapshot: result.preflightState, comment: context.comment });
    result.commit = await step('commit', async () => {
      await run('git', ['switch', '-c', context.branch], { cwd: repository });
      const lockPath = join(repository, 'inputs/sources.lock.json');
      if (JSON.stringify(await json(lockPath)) !== JSON.stringify(lock)) await saveJson(lockPath, lock);
      await saveJson(join(repository, 'inputs/release.json'), selected);
      await run('git', ['add', '--', 'inputs/sources.lock.json', 'inputs/release.json'], { cwd: repository });
      await run('git', ['-c', 'user.name=sqlite-vector-wasm preparation', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
        'commit', '-m', 'chore: prepare distribution candidate'], { cwd: repository });
      const commit = await run('git', ['rev-parse', 'HEAD'], { cwd: repository }); assert.match(commit, commitPattern);
      assert.equal(await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repository }), '');
      return commit;
    });
    await step('repository', async () => {
      await run('sh', ['tools/check-repository.sh'], { cwd: repository, log: join(directory, 'repository.log') });
      await run('sh', ['tools/test-repository.sh'], { cwd: repository, log: join(directory, 'tests.log') });
    });
    const qualified = await step('qualification', () => qualification({ repository, run,
      context: { repository: context.repository, commit: result.commit, selection: context.selection,
        comment: context.comment, preparation: context.preparation },
      readSnapshot: async () => { result.qualificationState = await readSnapshot(); await save(); return result.qualificationState; } }));
    const expected = calculate({ selection: context.selection, snapshot: result.qualificationState, comment: context.comment });
    assert.deepEqual(qualified.identity, expected, 'Qualification forecast mismatch');
    const evidence = await json(qualified.evidencePath);
    assert.equal(evidence.commit, result.commit, 'Qualification revision mismatch');
    assert.deepEqual(evidence.upstreams, context.selection);
    assert.deepEqual(evidence.invocation.preparation, context.preparation);
    assert.equal(evidence.invocation.comment, context.comment);
    result.identity = qualified.identity; result.archive = evidence.archive; result.bundle = qualified.bundle;
    result.qualificationEvidence = qualified.evidencePath;
    result.forecastChanged = JSON.stringify(result.preflight) !== JSON.stringify(result.identity);
    assert.equal(await run('git', ['rev-parse', 'HEAD'], { cwd: repository }), result.commit);
    assert.equal(await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: repository }), '', 'Candidate changed after qualification');
    await save();
    if (context.rehearsal) {
      assert.equal(services, undefined, 'Rehearsal has no write adapter');
      result.status = 'qualified-without-pr'; result.publicationCalls = 0;
    } else {
      assert.ok(services, 'Candidate write authorization unavailable');
      result.branchResult = await step('push', () => services.push(context.branch, result.commit));
      await save();
      result.pullRequest = await step('pull-request', () => services.createPullRequest({ branch: context.branch,
        commit: result.commit, title: `chore: prepare ${result.identity.version} distribution`, body: candidateBody(result) }));
      assert.equal(result.pullRequest.head, result.commit, 'Created PR head mismatch');
      result.status = 'candidate-ready';
    }
    await save(); return { ...result, path };
  } catch (error) {
    result.status = 'failed'; result.diagnostic = error.message; await save();
    throw new Error(`Candidate preparation failed; evidence: ${path}`, { cause: error });
  }
}
