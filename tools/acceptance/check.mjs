import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, copyFile, mkdtemp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { root, hash, regularBytes, fileInventory, inspectArchive } from '../package/package.mjs';
import { checkPackage } from '../package/check.mjs';
import { reference, fixture, inspect, assertReference } from '../build/check.mjs';
import { launchBrowser } from '../harness/browser.mjs';
import { serveAssets } from '../harness/server.mjs';
import { browserCases, modes, vfsNames, compareBaseline, assertBrowserComplete, defaultLock, vectorLock, recordedSelection, assertSelected } from './contracts.mjs';
import { checkFixtures, checkRows, expectedFloats, expectedBits, floatTolerance } from './oracles.mjs';

export async function checkFinalPackage(handoff, reportPath) {
  const report = { schemaVersion: 1, verdict: 'failed', archive: handoff.archive,
    runtimeFiles: handoff.runtimeFiles, cases: Object.fromEntries(browserCases.map(n => [n, { status: 'not-executed' }])) };
  const save = () => writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  const test = async (name, action) => {
    console.error(`Acceptance browser: ${name}`);
    try { const result = await action(); report.cases[name] = { status: 'passed', result }; await save(); return result; }
    catch (error) { report.cases[name] = { status: 'failed', error: error.message }; await save(); throw error; }
  };
  await save();
  let browser, server, context;
  try {
    assert.equal(handoff.schemaVersion, 1);
    const sourceLockPath = handoff.sourceLockPath || defaultLock;
    assert.ok([defaultLock,vectorLock].includes(sourceLockPath), 'Unsupported recorded acceptance lock');
    const selection = recordedSelection(await regularBytes(join(root,sourceLockPath)),sourceLockPath);
    assertSelected(handoff,selection);
    Object.assign(report,{engine:selection.engine,sourceLockPath,sourceLockSha256:selection.sourceLockSha256});
    const packaged = await checkPackage(handoff);
    report.packaging = JSON.parse(await readFile(packaged.checks, 'utf8'));
    report.browser = report.packaging.browser;
    for (const mode of modes) for (const kind of ['main', 'worker', 'worker1', 'promiser']) {
      await test(`${mode}-${kind}`, () => {
        const result = report.packaging.positive.results[`${mode}-${kind}`];
        assert.equal(result.version, handoff.inputs.sqlite.version);
        assert.equal(result.vecVersion, selection.engine.key === 'sqliteVec' ? `v${selection.engine.version}` : selection.engine.version);
        if (kind === 'main' || kind === 'worker') assert.equal(result.independentVersionsChecked, true);
        else {
          assert.equal(result.registrationRows[0][2],0);
          if (selection.engine.key === 'sqliteVec') assert.equal(result.sqlRows[0][2], 2);
          else assert.deepEqual(result.sqlRows,result.registrationRows);
        }
        return result;
      });
    }
    await mkdir(join(root, '.work/acceptance-browser'), { recursive: true });
    const workspace = await mkdtemp(join(root, '.work/acceptance-browser/run-'));
    report.workspace = workspace;
    browser = await launchBrowser();
    await test('baseline', async () => {
      const baseline = await reference(workspace,sourceLockPath);
      assertReference({inputs:handoff.sourceOrigins ? {...handoff.sourceOrigins,lockDigest:handoff.lockDigest} : handoff.inputs,sourceLockPath,build:handoff.build},baseline);
      const expected = await inspect(browser, await fixture(workspace, 'baseline', baseline), false, baseline.inputs.sqlite.version);
      compareBaseline(expected, Object.fromEntries(Object.entries(report.packaging.positive.results).filter(([k]) => k.endsWith('-main') || k.endsWith('-worker'))));
      report.baseline = { inputs: baseline.inputs, runtimeFiles: baseline.runtimeFiles, expected };
      return { defaultOpfs: vfsNames, retained: true };
    });
    const directory = join(workspace, 'packaged'); await mkdir(directory);
    await inspectArchive(handoff.archive.path, handoff.files, join(directory, 'runtime'));
    for (const name of ['fixtures.mjs', 'persistence-worker.mjs']) await copyFile(join(root, 'tools/acceptance', name), join(directory, name));
    await writeFile(join(directory, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Final-package acceptance</title>');
    server = await serveAssets(directory); context = await browser.newContext();
    const requests = [];
    context.on('response', r => { const url = new URL(r.url()); if (url.pathname.startsWith('/runtime/')) requests.push({ origin: url.origin, path: url.pathname, status: r.status() }); });
    const page = await context.newPage(); await page.goto(server.origin);
    report.hosting = { ...await page.evaluate(() => ({ secureContext: isSecureContext, crossOriginIsolated })),
      origin: server.origin, scheme: 'HTTP loopback', coop: 'same-origin', coep: 'require-corp', runtimeMount: '/runtime/' };
    assert.ok(report.hosting.secureContext && report.hosting.crossOriginIsolated);
    const worker = data => page.evaluate(data => new Promise((accept, reject) => {
      const w = new Worker('./persistence-worker.mjs?sqlite3.dir=/runtime', { type: 'module' });
      const timer = setTimeout(() => { w.terminate(); reject(Error('Fresh Worker timeout')); }, 60000);
      const finish = (error, value) => { clearTimeout(timer); w.terminate(); error ? reject(Error(error)) : accept({ ...value, workerTerminated: true }); };
      w.onerror = ev => finish(ev.message);
      w.onmessage = ev => finish(ev.data.error, ev.data);
      w.postMessage(data);
    }), {...data,engine:selection.engine.key});
    const sql = (await worker({ phase: 'sql' })).result;
    await test('fts5', () => { assert.deepEqual(sql.fts, [1, 3]); return sql.fts; });
    await test('float32', () => { checkRows(sql.floats, expectedFloats, floatTolerance); return sql.floats; });
    await test('hamming', () => { checkRows(sql.bits, expectedBits); return sql.bits; });
    await test('sql-negative-controls', () => {
      assert.throws(() => checkRows(sql.floats, [[99, 0], ...expectedFloats.slice(1)], floatTolerance));
      assert.throws(() => checkRows(sql.bits, [[1, 1], ...expectedBits.slice(1)]));
      assert.throws(() => checkRows([...sql.bits].reverse(), expectedBits));
      assert.throws(() => assert.deepEqual(sql.fts, [1, 2]));
      return { wrongIdentifier: true, wrongDistance: true, wrongOrder: true, wrongFts: true };
    });
    const id = randomUUID();
    const identities = vfsNames.map(vfs => ({ vfs, database: `/acceptance-${id}-${vfs}.db`, poolDirectory: `/acceptance-pool-${id}` }));
    for (const data of identities) await test(`restart-${data.vfs}`, async () => {
      const written = await worker({ ...data, phase: 'write' });
      assert.equal(written.closed, true); assert.equal(written.workerTerminated, true); checkFixtures(written.result);
      const reopened = await worker({ ...data, phase: 'read' });
      assert.equal(reopened.closed, true); assert.equal(reopened.workerTerminated, true); checkFixtures(reopened.result);
      assert.deepEqual(reopened.result.stored,written.result.stored, 'Committed schema/ordinary/vector bytes changed across restart');
      assert.equal(reopened.database, written.database); assert.equal(reopened.poolDirectory, written.poolDirectory);
      return { written, reopened, origin: server.origin, separateWorkerInvocations: true };
    });
    await test('persistence-negative-control', async () => {
      await worker({ ...identities[0], phase: 'corrupt' });
      await assert.rejects(() => worker({ ...identities[0], phase: 'read' }), /no such table.*ordinary/i);
      await worker({...identities[1],phase:'corrupt-vector'});
      await assert.rejects(() => worker({...identities[1],phase:'read'}), /no such table.*bits/i);
      return { missingTableRejectedWithoutRepair: true, missingVectorTableRejectedWithoutRepair:true };
    });
    await test('final-hashes', async () => {
      const bytes = await regularBytes(handoff.archive.path);
      assert.equal(bytes.length, handoff.archive.size); assert.equal(hash(bytes), handoff.archive.sha256);
      assert.deepEqual(await fileInventory(join(directory, 'runtime'), handoff.files.map(f => f.name)), handoff.files);
      assert.ok(requests.length > 0 && requests.every(r => r.origin === server.origin && r.path.startsWith('/runtime/') && r.status === 200));
      report.requests = requests; return { archiveUnchanged: true, extractedFilesUnchanged: true };
    });
    assertBrowserComplete(report); report.verdict = 'passed'; await save();
    return report;
  } catch (error) {
    report.error = error.message; await save(); throw error;
  } finally {
    if (context) await context.close(); if (server) await server.close(); if (browser) await browser.close();
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    assert.equal(process.argv.length, 4, 'Usage: harness exec node tools/acceptance/check.mjs PACKAGE_HANDOFF REPORT');
    await checkFinalPackage(JSON.parse(await readFile(process.argv[2], 'utf8')), resolve(process.argv[3]));
  } catch (error) { console.error(error); process.exitCode = 1; }
}
