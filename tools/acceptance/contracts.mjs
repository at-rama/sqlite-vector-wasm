import assert from 'node:assert/strict';
import { runtimeNames } from '../build/config.mjs';
import { selectedEngine } from '../build/build.mjs';
import { engineIdentity, hash } from '../package/package.mjs';

export const modes = ['vanilla', 'esm', 'bundler'];
export const vfsNames = ['opfs', 'opfs-wl', 'opfs-sahpool'];
export const productionStages = ['checkout', 'install', 'tools', 'deps', 'smoke', 'build', 'package', 'browser', 'bundle'];
export const browserCases = [
  ...modes.flatMap(mode => ['main', 'worker', 'worker1', 'promiser'].map(kind => `${mode}-${kind}`)),
  'baseline', 'fts5', 'float32', 'hamming', 'sql-negative-controls',
  ...vfsNames.map(name => `restart-${name}`), 'persistence-negative-control', 'final-hashes',
];

export const defaultLock = 'inputs/sqlite-vector.sources.lock.json';
export const vectorLock = 'inputs/sqlite-vector.sources.lock.json';

export function recordedSelection(bytes, sourceLockPath = defaultLock) {
  assert.ok([defaultLock, vectorLock].includes(sourceLockPath), 'Unsupported recorded acceptance lock');
  const sourceLock = JSON.parse(bytes), key = selectedEngine(sourceLock);
  assert.equal(sourceLockPath, vectorLock, 'Selected lock/engine mismatch');
  return { sourceLockPath, sourceLock, sourceLockSha256: hash(bytes),
    engine: {key, upstream: 'sqliteai/sqlite-vector', version: sourceLock[key].version} };
}

export function assertSelected(handoff, selection, acquired = false) {
  assert.deepEqual(engineIdentity(handoff), selection.engine, 'Selected engine mismatch');
  assert.equal(handoff.sourceLockPath || defaultLock, selection.sourceLockPath, 'Selected lock path mismatch');
  assert.deepEqual(handoff.lockDigest || handoff.inputs?.lockDigest,
    {algorithm:'sha256', value:selection.sourceLockSha256}, 'Package source lock mismatch');
  for (const key of ['sqlite', selection.engine.key]) {
    for (const field of ['version','digest']) assert.deepEqual(handoff.inputs[key][field],selection.sourceLock[key][field], `Selected ${key} ${field} mismatch`);
    if (handoff.sourceOrigins) for (const [field,value] of Object.entries(selection.sourceLock[key]))
      assert.deepEqual(handoff.sourceOrigins[key]?.[field],value, `Selected ${key} origin mismatch`);
  }
  if (acquired) {
    const inputs = handoff.inputs;
    for (const key of ['sqlite', selection.engine.key]) {
      assert.ok(inputs[key].sourcePath, 'Missing acquired source path');
      for (const [field,value] of Object.entries(selection.sourceLock[key])) assert.deepEqual(inputs[key][field],value, 'Acquired source identity mismatch');
    }
  }
}

export function assertSelectionEvidence(report, selection) {
  assert.deepEqual(report.engine, selection.engine, 'Evidence engine mismatch');
  assert.equal(report.sourceLockPath, selection.sourceLockPath, 'Evidence selected lock mismatch');
  assert.equal(report.sourceLockSha256, selection.sourceLockSha256, 'Evidence lock digest mismatch');
}

export function compareBaseline(expected, actual) {
  for (const [context, inventory] of Object.entries(expected)) {
    assert.ok(actual[context], `Missing baseline context: ${context}`);
    for (const key of ['capi', 'oo1', 'dbMethods', 'exports', 'vfs', 'options', 'functions']) {
      assert.ok(Array.isArray(actual[context][key]), `Missing inventory: ${context}/${key}`);
      assert.deepEqual(inventory[key].filter(value => !actual[context][key].includes(value)), [], `Missing baseline ${context}/${key}`);
    }
  }
  // Explicit baseline initialization installs the SAH pool before recording VFSes.
  const defaults = [...new Set(Object.values(expected).flatMap(i => i.vfs).filter(n => n.startsWith('opfs')))];
  assert.deepEqual(defaults.sort(), [...vfsNames].sort(), 'Reconcile changed upstream default OPFS VFS set; do not skip');
}

export function assertBrowserComplete(report) {
  assert.equal(report.schemaVersion, 1);
  assert.ok(typeof report.browser === 'string' && report.browser.length > 0, 'Missing real browser version');
  assert.ok(report.hosting?.secureContext && report.hosting?.crossOriginIsolated, 'Missing browser hosting prerequisites');
  for (const name of browserCases) assert.equal(report.cases[name]?.status, 'passed', `Incomplete browser case: ${name}`);
  assert.deepEqual(report.runtimeFiles.map(r => r.name).sort(), [...runtimeNames].sort());
}

export function assertApplicable(report, revision, archive) {
  assert.equal(report.schemaVersion, 1);
  assert.equal(report.verdict, 'passed');
  assert.match(revision, /^[0-9a-f]{40}$/);
  assert.equal(report.source?.commit, revision, 'Acceptance revision mismatch; merge ancestry is insufficient');
  assert.equal(report.source?.dirty, false, 'Dirty evaluated source');
  for (const name of productionStages) assert.equal(report.stages[name]?.status, 'passed', `Incomplete production stage: ${name}`);
  assert.deepEqual({ size: report.archive?.size, sha256: report.archive?.sha256 }, { size: archive?.size, sha256: archive?.sha256 }, 'Exact accepted archive mismatch');
  assert.match(archive.sha256, /^[0-9a-f]{64}$/);
  assert.ok(Number.isSafeInteger(archive.size) && archive.size > 0);
  assertBrowserComplete(report.browserResults);
  if (report.engine || report.sourceLockPath || report.browserResults.engine) assert.ok(report.sourceLock, 'Missing selected source lock');
  if (report.sourceLock) {
    const key = selectedEngine(report.sourceLock);
    const path = report.sourceLockPath || (vectorLock);
    const selection = {sourceLockPath:path, sourceLock:report.sourceLock, sourceLockSha256:report.sourceLockSha256,
      engine:{key,upstream:'sqliteai/sqlite-vector',version:report.sourceLock[key].version}};
    assert.equal(path,vectorLock,'Evidence source lock/engine mismatch');
    assert.match(selection.sourceLockSha256,/^[0-9a-f]{64}$/);
    if (report.engine || report.sourceLockPath) {
      assertSelectionEvidence(report,selection);
      assertSelectionEvidence(report.browserResults,selection);
    }
    if (report.browserResults.packaging) {
      const packaged = report.browserResults.packaging;
      assert.deepEqual(engineIdentity(packaged),selection.engine,'Browser packaging engine mismatch');
      for (const key of ['sqlite',selection.engine.key]) assert.deepEqual(packaged.inputs[key],
        {version:selection.sourceLock[key].version,digest:selection.sourceLock[key].digest},'Browser packaging input mismatch');
    }
  }
}
