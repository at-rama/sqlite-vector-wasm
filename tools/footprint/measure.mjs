// Manual measurement tooling; no product build or publication is performed.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync, gunzipSync, constants } from 'node:zlib';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const legalComments = /@preserve|@license|@cc_on|copyright|license|author disclaims|public.domain|blessing/i;
const compactOptions = { module: true, compress: false, mangle: false, ecma: 2022,
  format: { beautify: false, comments: legalComments } };
const gzipOptions = { level: 9, windowBits: 15, memLevel: 8, strategy: constants.Z_DEFAULT_STRATEGY };
// Resolved from npm latest on 2026-11-02; defaults reproduce this recorded selection.
const recorded = [
  { version: '3.54.1-build1', sha256: '06aaad2dd0b58a46631000a31a4469afff4abeffbc383f37372b6590396d9bbd' },
  { version: '3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6', sha256: 'bd86fee5f3e463a86fca4eb594df0a0bc9ce5d718c08a8dc5844fddc181bb381' },
  { version: '0.3.2', sha256: '4288ed496f4298cb11c3e6effda6b4a06f9a34e7f755fc225b6ae347d059316d' },
];
const candidates = [
  { package: '@sqlite.org/sqlite-wasm', loader: 'dist/index.mjs', wasm: 'dist/sqlite3.wasm' },
  { package: '@sqliteai/sqlite-wasm', loader: 'sqlite-wasm/jswasm/sqlite3-bundler-friendly.mjs', wasm: 'sqlite-wasm/jswasm/sqlite3.wasm' },
  { package: '@at-rama/sqlite-vector-wasm', loader: 'sqlite3-bundler-friendly.mjs', wasm: 'sqlite3.wasm' },
];

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, `Download failed: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--latest') || (args.length === 2 && args[0] === '--snapshot'), 'Usage: node tools/footprint/measure.mjs [--latest | --snapshot REPORT.json]');
  const latest = args[0] === '--latest';
  const previous = args[0] === '--snapshot' ? JSON.parse(await readFile(resolve(args[1]), 'utf8')) : null;
  const manifest = JSON.parse(await readFile(join(root, 'tools/footprint/package.json'), 'utf8'));
  assert.equal(process.versions.node, manifest.engines.node, 'Use the recorded Node.js version');
  const lock = await readFile(join(root, 'tools/footprint/package-lock.json'));
  const installedRoot = join(root, '.work/footprint-tools');
  assert.deepEqual(await readFile(join(installedRoot, 'package-lock.json')), lock, 'Install from the current recorded lock');
  const installed = JSON.parse(await readFile(join(installedRoot, 'node_modules/terser/package.json'), 'utf8'));
  assert.equal(installed.version, manifest.dependencies.terser);
  const { minify } = await import(pathToFileURL(join(installedRoot, 'node_modules/terser/main.js')).href);
  const protocol = { version: 1, metric: 'direct browser ESM initializer plus unchanged WASM; local compacted bytes and independent per-file gzip',
    javascript: { module: true, compress: false, mangle: false, ecma: 2022, beautify: false, legalComments: legalComments.toString() },
    gzip: gzipOptions };
  const environment = { node: process.version, terser: installed.version, zlib: process.versions.zlib,
    toolingLockSha256: sha256(lock), scriptSha256: sha256(await readFile(fileURLToPath(import.meta.url))) };
  if (previous) {
    assert.equal(previous.schemaVersion, 1);
    assert.equal(previous.verdict, 'passed');
    assert.deepEqual(previous.protocol, protocol, 'Snapshot protocol differs');
    assert.deepEqual(previous.environment, environment, 'Snapshot tooling differs');
    assert.equal(previous.distributions.length, candidates.length);
  }
  const parent = join(root, '.work/footprint');
  await mkdir(parent, { recursive: true });
  const workspace = await mkdtemp(join(parent, 'run-'));
  const report = { schemaVersion: 1, verdict: 'passed', started: new Date().toISOString(),
    selection: previous ? { mode: 'snapshot', sourceReportSha256: sha256(await readFile(resolve(args[1]))) } : { mode: latest ? 'npm-latest' : 'recorded-2026-11-02' },
    protocol, environment, distributions: [] };
  for (const [index, candidate] of candidates.entries()) {
    const expected = previous?.distributions[index];
    if (expected) assert.equal(expected.package, candidate.package);
    const selectedUrl = 'https://registry.npmjs.org/' + candidate.package + '/' + (expected ? expected.version : latest ? 'latest' : recorded[index].version);
    const metadataBytes = await download(selectedUrl);
    const metadata = JSON.parse(metadataBytes.toString('utf8'));
    assert.equal(metadata.name, candidate.package);
    assert.ok(typeof metadata.version === 'string' && metadata.version.length);
    assert.equal(new URL(metadata.dist.tarball).origin, 'https://registry.npmjs.org');
    const archive = await download(metadata.dist.tarball);
    const [algorithm, integrity] = metadata.dist.integrity.split('-');
    assert.equal(algorithm, 'sha512');
    assert.equal(createHash('sha512').update(archive).digest('base64'), integrity, 'npm archive integrity mismatch');
    if (!latest && !previous) {
      assert.equal(metadata.version, recorded[index].version);
      assert.equal(sha256(archive), recorded[index].sha256, 'Recorded archive changed');
    }
    if (expected) {
      assert.equal(metadata.version, expected.version);
      assert.equal(metadata.dist.tarball, expected.archive.url);
      assert.equal(sha256(archive), expected.archive.sha256, 'Snapshot archive changed');
    }
    const archivePath = join(workspace, `${index}.tgz`);
    await writeFile(archivePath, archive);
    const members = execFileSync('tar', ['-tzf', archivePath], { encoding: 'utf8' }).trim().split('\n');
    const item = { package: candidate.package, version: metadata.version,
      resolved: { url: selectedUrl, at: new Date().toISOString(), metadataSha256: sha256(metadataBytes) },
      archive: { url: metadata.dist.tarball, sha256: sha256(archive), integrity: metadata.dist.integrity }, files: [] };
    for (const kind of ['loader', 'wasm']) {
      const path = candidate[kind];
      assert.equal(members.filter(name => name === 'package/' + path).length, 1, `Missing or duplicate archive member: ${path}`);
      const source = execFileSync('tar', ['-xzOf', archivePath, 'package/' + path], { maxBuffer: 20 * 1024 * 1024 });
      assert.ok(source.length, 'Empty archive member');
      let measured = source;
      if (kind === 'loader') {
        const result = await minify(source.toString('utf8'), compactOptions);
        assert.ok(result.code?.length);
        measured = Buffer.from(result.code, 'utf8');
        // Parse the transformed output again. This is syntax validation, not execution qualification.
        await minify(result.code, compactOptions);
      } else assert.deepEqual(source.subarray(0, 8), Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]));
      const compressed = gzipSync(measured, gzipOptions);
      assert.deepEqual(gunzipSync(compressed), measured, 'gzip round trip failed');
      const file = { kind, path, inputBytes: source.length, inputSha256: sha256(source),
        compactedBytes: measured.length, compactedSha256: sha256(measured),
        gzipBytes: compressed.length, gzipSha256: sha256(compressed) };
      if (expected) assert.deepEqual(file, expected.files.find(f => f.kind === kind), 'Snapshot measurement changed');
      item.files.push(file);
      await writeFile(join(workspace, `${index}-${kind}.${kind === 'loader' ? 'mjs' : 'wasm'}`), measured);
      await writeFile(join(workspace, `${index}-${kind}.gz`), compressed);
    }
    item.total = { compactedBytes: item.files.reduce((n, f) => n + f.compactedBytes, 0),
      gzipBytes: item.files.reduce((n, f) => n + f.gzipBytes, 0) };
    report.distributions.push(item);
  }
  report.finished = new Date().toISOString();
  const path = join(workspace, 'report.json');
  await writeFile(path, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ report: path, results: report.distributions.map(d => ({ package: d.package, version: d.version, ...d.total })) }, null, 2));
}

main().catch(error => { console.error(error.stack); process.exitCode = 1; });
