import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, writeFile, readFile, copyFile, stat, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { root, hash, regularBytes, identity } from '../package/package.mjs';
import { productionStages, assertApplicable, assertBrowserComplete, defaultLock, vectorLock, recordedSelection, assertSelected, assertSelectionEvidence } from './contracts.mjs';

export function command(commandName, args, { cwd, env, log }) {
  return new Promise((accept, reject) => {
    const child = spawn(commandName, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    child.stdout.on('data', b => { out += b; });
    child.stderr.on('data', b => { err += b; });
    child.once('error', reject);
    child.once('close', async (code, signal) => {
      try {
        if (log) await writeFile(log, JSON.stringify({ command: commandName, args, code, signal }) + '\n' + out + '\n' + err);
        if (code !== 0) throw Error(`${commandName} failed (${signal || code}); see ${log || err}`);
        accept(out.trim());
      } catch (error) { reject(error); }
    });
  });
}

export function options(argv) {
  const result = { name: 'sqlite-vector-wasm-acceptance-fixture', version: '0.0.0-test' };
  assert.ok(argv.length % 2 === 0 && argv.length <= 6, 'Usage: acceptance.sh [--lock PATH] [--name NAME --version VERSION]');
  const seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = { '--name': 'name', '--version': 'version', '--lock': 'lockPath' }[argv[i]];
    assert.ok(key && !seen.has(key) && argv[i + 1], 'Invalid/duplicate acceptance arguments');
    seen.add(key); result[key] = argv[i + 1];
  }
  assert.equal(seen.has('name'),seen.has('version'), 'Supply both package name and version');
  if (result.lockPath) assert.ok([defaultLock,vectorLock].includes(result.lockPath), 'Unsupported recorded acceptance lock');
  identity(result.name, result.version);
  return result;
}

export async function production({ repository = root, metadata = options([]), run = command, environment = process.env, lockPath = metadata.lockPath || defaultLock } = {}) {
  metadata = identity(metadata.name,metadata.version);
  await mkdir(join(repository, '.work/acceptance'), { recursive: true });
  const workspace = await mkdtemp(join(repository, '.work/acceptance/run-'));
  const logs = join(workspace, 'logs'); await mkdir(logs);
  const toolsParent = await mkdtemp(join(tmpdir(), 'sqlite-vector-wasm-acceptance-'));
  const env = { ...environment, HARNESS_STATE: join(toolsParent, 'tools') };
  const report = { schemaVersion: 1, verdict: 'failed', started: new Date().toISOString(),
    package: metadata, workspace, toolsDirectory: env.HARNESS_STATE,
    ci: { repository: env.GITHUB_REPOSITORY || null, run: env.GITHUB_RUN_ID || null,
      attempt: env.GITHUB_RUN_ATTEMPT || null, event: env.GITHUB_EVENT_NAME || null, ref: env.GITHUB_REF || null },
    stages: Object.fromEntries(productionStages.map(n => [n, { status: 'not-executed' }])) };
  const reportPath = join(workspace, 'acceptance.json');
  const save = () => writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  const invoke = (cmd, args, label) => run(cmd, args, { cwd: repository, env, log: join(logs, `${label}.log`) });
  const stage = async (name, action) => {
    console.error(`Acceptance: ${name}`);
    try { const result = await action(); report.stages[name] = { status: 'passed' }; await save(); return result; }
    catch (error) { report.stages[name] = { status: 'failed', error: error.message }; await save(); throw error; }
  };
  await save();
  try {
    await stage('checkout', async () => {
      const commit = await invoke('git', ['rev-parse', 'HEAD'], 'commit');
      const tree = await invoke('git', ['rev-parse', 'HEAD^{tree}'], 'tree');
      const dirty = !!(await invoke('git', ['status', '--porcelain', '--untracked-files=all'], 'status'));
      report.source = { commit, tree, dirty };
      assert.match(commit, /^[0-9a-f]{40}$/); assert.equal(dirty, false, 'Acceptance requires a clean checkout');
      for (const name of ['harness', 'js', 'npm-cache', 'build', 'inputs', 'package', 'package-check', 'build-check']) {
        const entries = await readdir(join(repository, '.work', name)).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
        assert.equal(entries.length, 0, `Fresh production requires empty .work/${name}`);
      }
      assert.ok(!(await stat(env.HARNESS_STATE).catch(error => { if (error.code === 'ENOENT') return null; throw error; })), 'Fresh tools required');
      assert.ok([defaultLock,vectorLock].includes(lockPath), 'Unsupported recorded acceptance lock');
      Object.assign(report,recordedSelection(await regularBytes(join(repository,lockPath)),lockPath));
      report.bootstrapNode = process.version;
    });
    await stage('install', () => invoke('bash', ['tools/harness.sh', 'install'], 'install'));
    await stage('tools', () => invoke('bash', ['tools/harness.sh', 'check'], 'tools'));
    await stage('deps', () => invoke('bash', ['tools/harness.sh', 'deps'], 'deps'));
    await stage('smoke', () => invoke('bash', ['tools/harness.sh', 'smoke'], 'smoke'));
    const build = await stage('build', async () => {
      const result = JSON.parse(await invoke('bash', ['tools/build.sh', '--lock', lockPath], 'build'));
      assertSelected(result, report, true);
      await writeFile(join(workspace, 'build.json'), JSON.stringify(result, null, 2) + '\n');
      return result;
    });
    const packaged = await stage('package', async () => {
      const result = JSON.parse(await invoke('bash', ['tools/package.sh', '--build-handoff', join(workspace, 'build.json'), '--name', metadata.name, '--version', metadata.version], 'package'));
      assert.deepEqual(result.package, metadata);
      assertSelected(result,report);
      assert.equal(result.buildHandoffSha256,hash(Buffer.from(JSON.stringify(build,null,2)+'\n')), 'Raw build handoff mismatch');
      await writeFile(join(workspace, 'package.json'), JSON.stringify(result, null, 2) + '\n');
      report.archive = result.archive; report.runtimeFiles = result.runtimeFiles; report.build = build.build;
      return result;
    });
    const browserResults = await stage('browser', async () => {
      await invoke('bash', ['tools/harness.sh', 'exec', 'node', 'tools/acceptance/check.mjs', join(workspace, 'package.json'), join(workspace, 'browser.json')], 'browser');
      const result = JSON.parse(await readFile(join(workspace, 'browser.json'), 'utf8'));
      assertBrowserComplete(result); assertSelectionEvidence(result,report); return result;
    });
    report.browserResults = browserResults;
    await stage('bundle', async () => {
      const bytes = await regularBytes(packaged.archive.path);
      assert.equal(bytes.length, packaged.archive.size); assert.equal(hash(bytes), packaged.archive.sha256);
      await copyFile(packaged.archive.path, join(workspace, 'payload.tgz'));
      assert.equal(hash(await regularBytes(join(workspace, 'payload.tgz'))), packaged.archive.sha256);
      assert.equal(await invoke('git', ['rev-parse', 'HEAD'], 'final-commit'), report.source.commit);
      assert.equal(await invoke('git', ['status', '--porcelain', '--untracked-files=all'], 'final-status'), '', 'Source changed during acceptance');
      for (const [name, path] of [['construction.log', build.logPath], ['packaging.log', packaged.logPath]]) await copyFile(path, join(logs, name));
      report.archive = { ...packaged.archive, bundlePath: 'payload.tgz' };
      report.finished = new Date().toISOString();
    });
    assert.equal(hash(await regularBytes(join(repository,lockPath))),report.sourceLockSha256, 'Selected lock changed during acceptance');
    report.verdict = 'passed'; assertApplicable(report, report.source.commit, packaged.archive);
    await save();
    return { report: reportPath, bundle: workspace, archive: report.archive, checkedCommit: report.source.commit };
  } catch (error) {
    report.verdict = 'failed'; report.error = error.message; report.finished = new Date().toISOString();
    await save(); error.message += `; acceptance report: ${reportPath}`; throw error;
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { console.log(JSON.stringify(await production({ metadata: options(process.argv.slice(2)) }))); }
  catch (error) { console.error(`Acceptance failed: ${error.message}`); process.exitCode = 1; }
}
