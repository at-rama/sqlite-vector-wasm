import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { checkBrowser } from './browser.mjs';
import { checkDemo } from './demo-check.mjs';
import { prepareData } from './demo-data.mjs';
import { repository } from './build.mjs';
import { join, dirname } from 'node:path';
import { serveSite } from './server.mjs';

const [location, recordPath, resultPath] = process.argv.slice(2);
let server;
try {
  if (!location || !recordPath || !resultPath) throw Error('Usage: observe.mjs DIRECTORY_OR_URL RECORD RESULT');
  const record = JSON.parse(await readFile(recordPath, 'utf8'));
  server = /^https?:/.test(location) ? null : await serveSite(location);
  const base = new URL(server?.url ?? location);
  async function sameDeployment() {
    const response = await fetch(new URL('site-publication.json', base), { cache: 'no-store' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), record, 'The shared URL no longer serves the expected deployment');
  }
  await sameDeployment();
  const results = [];
  // A preview's stable root is independently built from main, whose navigation
  // may predate this candidate; the candidate always checks the new npm link.
  if (record.stablePresent) results.push(await checkBrowser(base.href, { requireDocs: !record.preview, requireNpm: !record.preview }));
  else assert.equal((await fetch(base)).status, 404, 'Bootstrap must not invent a stable root');
  if (record.preview) results.push(await checkBrowser(new URL('preview/', base).href, { preview: record.preview, requireDocs: true }));
  else assert.equal((await fetch(new URL('preview/', base))).status, 404, 'Main artifact must remove preview');
  // Candidate demo selection remains independent of the separately built stable root.
  const buildRecord = JSON.parse(await readFile(join(dirname(recordPath), '../site/build.json'), 'utf8'));
  if (buildRecord.runtime && Object.keys(buildRecord.runtime).some(p => p.endsWith('/sqlite3.wasm'))) {
    await prepareData(repository, join(repository, '.work/demo-reference-data'));
    const demoBase = record.preview ? new URL('preview/', base).href : base.href;
    const expectedSelection = (record.preview ? JSON.parse(await readFile(join(repository, 'tools/site/demo-runtime.json'), 'utf8')) : record.stableDocumentation?.demoSelection ?? JSON.parse(await readFile(join(repository, 'tools/site/demo-runtime.json'), 'utf8')));
    const actual = await (await fetch(new URL('demo-runtime.json', demoBase))).json();
    for (const [key, value] of Object.entries(expectedSelection)) assert.deepEqual(actual[key], value);
    results.push(await checkDemo(demoBase, { root: repository, expectedPreview: record.preview,
      expectedSelection: actual, runtimeInventory: buildRecord.runtime,
      screenshot: resultPath.replace(/\.json$/, '-demo-mobile.png') }));
  }
  await sameDeployment();
  await writeFile(resultPath, JSON.stringify({ publication: record, results }, null, 2) + '\n');
  console.log(JSON.stringify({ publication: record, results }));
} catch (error) {
  console.error(`Site observation: ${error.message}`);
  process.exitCode = 1;
} finally {
  await server?.close();
}
