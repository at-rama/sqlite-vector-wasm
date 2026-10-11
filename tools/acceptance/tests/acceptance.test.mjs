import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { hash, root } from '../../package/package.mjs';
import { runtimeNames } from '../../build/config.mjs';
import { production, options } from '../run.mjs';
import { browserCases, productionStages, vfsNames, assertBrowserComplete, assertApplicable, compareBaseline } from '../contracts.mjs';
import { checkRows, checkFixtures, expectedOrdinary, expectedFloats, expectedBits, floatTolerance } from '../oracles.mjs';
import { checkFinalPackage } from '../check.mjs';

const revision = 'a'.repeat(40);

test('acceptance accepts the supplied scoped distribution identity without changing its fixture default', () => {
  assert.deepEqual(options(['--name','@at-rama/sqlite-vector-wasm','--version','0.1.0']),
    {name:'@at-rama/sqlite-vector-wasm',version:'0.1.0'});
  assert.equal(options([]).name,'sqlite-vector-wasm-acceptance-fixture');
});
const browserResult = () => ({ schemaVersion: 1, verdict: 'passed', browser: 'real-browser-version',
  hosting: { secureContext: true, crossOriginIsolated: true }, runtimeFiles: runtimeNames.map(name => ({ name })),
  cases: Object.fromEntries(browserCases.map(n => [n, { status: 'passed' }])) });
const acceptance = () => ({ schemaVersion: 1, verdict: 'passed', source: { commit: revision, dirty: false },
  archive: { size: 3, sha256: hash('abc') }, browserResults: browserResult(),
  stages: Object.fromEntries(productionStages.map(n => [n, { status: 'passed' }])) });

test('publication applicability rejects revision/payload substitution and incomplete production', () => {
  const report = acceptance(); assertApplicable(report, revision, report.archive);
  assert.throws(() => assertApplicable(report, 'b'.repeat(40), report.archive));
  assert.throws(() => assertApplicable(report, revision, { ...report.archive, sha256: 'c'.repeat(64) }));
  assert.throws(() => assertApplicable({ ...report, source: { commit: revision, dirty: true } }, revision, report.archive));
  for (const name of productionStages) {
    const missing = structuredClone(report); delete missing.stages[name];
    assert.throws(() => assertApplicable(missing, revision, report.archive));
    missing.stages[name] = { status: 'not-executed' };
    assert.throws(() => assertApplicable(missing, revision, report.archive));
  }
});

test('every loading, SQL and persistence case is mandatory; prerequisites cannot be skipped', () => {
  for (const name of browserCases) for (const status of ['failed', 'skipped', 'not-executed']) {
    const report = browserResult(); report.cases[name].status = status;
    assert.throws(() => assertBrowserComplete(report), new RegExp(name));
  }
  const report = browserResult(); delete report.browser;
  assert.throws(() => assertBrowserComplete(report));
  report.browser = 'version'; report.hosting.crossOriginIsolated = false;
  assert.throws(() => assertBrowserComplete(report));
  report.hosting.crossOriginIsolated = true; report.runtimeFiles.pop();
  assert.throws(() => assertBrowserComplete(report));
});

test('baseline inclusion allows vec additions but rejects missing APIs and changed default VFS set', () => {
  const inventory = Object.fromEntries(['capi', 'oo1', 'dbMethods', 'exports', 'options', 'functions'].map(k => [k, ['baseline']]));
  inventory.vfs = [...vfsNames];
  const expected = { 'esm-worker': inventory };
  const actual = structuredClone(expected); actual['esm-worker'].functions.push('vec'); compareBaseline(expected, actual);
  actual['esm-worker'].capi = []; assert.throws(() => compareBaseline(expected, actual), /Missing baseline/);
  const unknown = structuredClone(expected); unknown['esm-worker'].vfs.push('opfs-new');
  assert.throws(() => compareBaseline(unknown, unknown), /Reconcile/);
});

test('independent arithmetic rejects wrong IDs/order/distances; Hamming has no float tolerance', () => {
  const value = { ordinary: expectedOrdinary, floats: expectedFloats, bits: expectedBits }; checkFixtures(value);
  assert.deepEqual(expectedBits.map(r => r[1]), [0, 1, 2, 3, 4]);
  assert.throws(() => checkFixtures({ ...value, ordinary: [] }));
  assert.throws(() => checkRows([...expectedBits].reverse(), expectedBits));
  assert.throws(() => checkRows([[1, 1e-7], ...expectedBits.slice(1)], expectedBits));
  checkRows([[1, 1e-7], ...expectedFloats.slice(1)], expectedFloats, floatTolerance);
  assert.throws(() => checkRows([[1, 1], ...expectedFloats.slice(1)], expectedFloats, floatTolerance));
});

test('each production failure retains a failed record and never runs downstream or reuses a pass', async () => {
  for (const failAt of productionStages.filter(n => !['checkout', 'bundle'].includes(n))) {
    const repo = await mkdtemp(join(tmpdir(), 'acceptance-test-'));
    try {
      await mkdir(join(repo, 'inputs')); await writeFile(join(repo, 'inputs/sources.lock.json'), '{}');
      const archive = join(repo, 'archive.tgz'); await writeFile(archive, 'abc');
      const commands = []; let browserPath;
      const run = async (cmd, args, { log }) => {
        commands.push(args);
        if (cmd === 'git') return args[0] === 'status' ? '' : revision;
        const stage = args[0] === 'tools/build.sh' ? 'build' : args[0] === 'tools/package.sh' ? 'package'
          : args[1] === 'exec' ? 'browser' : args[1] === 'check' ? 'tools' : args[1];
        if (stage === failAt) throw Error(`Injected ${stage} failure`);
        await writeFile(log, 'diagnostic');
        if (stage === 'build') return JSON.stringify({ build: {}, logPath: log });
        if (stage === 'package') return JSON.stringify({ package: options([]), archive: { path: archive, size: 3, sha256: hash('abc') }, runtimeFiles: [], logPath: log });
        if (stage === 'browser') { browserPath = args.at(-1); await writeFile(browserPath, JSON.stringify(browserResult())); }
        return '';
      };
      await assert.rejects(() => production({ repository: repo, run }), new RegExp(`Injected ${failAt}`));
      const dirs = await import('node:fs/promises').then(fs => fs.readdir(join(repo, '.work/acceptance')));
      const report = JSON.parse(await readFile(join(repo, '.work/acceptance', dirs[0], 'acceptance.json')));
      assert.equal(report.verdict, 'failed'); assert.equal(report.stages[failAt].status, 'failed');
      const i = productionStages.indexOf(failAt);
      for (const n of productionStages.slice(i + 1)) assert.equal(report.stages[n].status, 'not-executed');
      assert.ok(commands.length > 0); assert.equal(browserPath, undefined);
      await rm(report.toolsDirectory.replace(/\/tools$/, ''), { recursive: true, force: true });
    } finally { await rm(repo, { recursive: true, force: true }); }
  }
});

test('dirty source and pre-existing build state fail before SDK installation', async () => {
  for (const dirty of [true, false]) {
    const repo = await mkdtemp(join(tmpdir(), 'acceptance-checkout-test-'));
    try {
      await mkdir(join(repo, '.work/build'), { recursive: true }); await writeFile(join(repo, '.work/build/old'), 'old');
      const run = async (cmd, args) => { assert.equal(cmd, 'git'); return args[0] === 'status' ? dirty ? ' M source' : '' : revision; };
      await assert.rejects(() => production({ repository: repo, run }), dirty ? /clean checkout/ : /empty .work\/build/);
    } finally { await rm(repo, { recursive: true, force: true }); }
  }
});

test('invalid final-package identities produce a failure report before launching a browser', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'acceptance-package-test-'));
  try {
    const archive = join(dir, 'package.tgz'); await writeFile(archive, 'corrupt archive');
    const lockBytes = await readFile(join(root, 'inputs/sources.lock.json')); const lock = JSON.parse(lockBytes);
    const handoff = { schemaVersion: 1, lockDigest: { algorithm: 'sha256', value: hash(lockBytes) },
      inputs: Object.fromEntries(['sqlite', 'sqliteVec'].map(k => [k, { version: lock[k].version, digest: lock[k].digest }])),
      runtimeFiles: runtimeNames.map(name => ({ name })), archive: { path: archive, size: 15, sha256: '0'.repeat(64) } };
    const reportPath = join(dir, 'report.json');
    await assert.rejects(() => checkFinalPackage(handoff, reportPath));
    const report = JSON.parse(await readFile(reportPath)); assert.equal(report.verdict, 'failed');
    assert.ok(Object.values(report.cases).every(c => c.status === 'not-executed'));
    handoff.lockDigest.value = '1'.repeat(64);
    await assert.rejects(() => checkFinalPackage(handoff, reportPath), /source lock mismatch/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('acceptance metadata is explicit and rejects invalid or duplicate options', () => {
  assert.deepEqual(options([]), { name: 'sqlite-vector-wasm-acceptance-fixture', version: '0.0.0-test' });
  assert.deepEqual(options(['--name', 'sqlite-vector-wasm', '--version', '0.1.0']),
    { name: 'sqlite-vector-wasm', version: '0.1.0' });
  assert.deepEqual(options(['--version', '1.2.3', '--name', 'fixture']), { name: 'fixture', version: '1.2.3' });
  assert.throws(() => options(['--name', 'fixture']));
  assert.throws(() => options(['--name', 'fixture', '--name', 'other']));
  assert.throws(() => options(['--name', 'fixture', '--version', 'latest']));
});
