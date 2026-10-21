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
  if (record.stablePresent) results.push(await checkBrowser(base.href, { requireDocs: !record.preview, requireNpm: !record.preview, runningDemo: Boolean(record.stableDemo), historicalDemo: Boolean(!record.stableDemo && !record.stablePlaceholder && record.stableDocumentation?.demoSelection), requirePlaceholder: Boolean(record.stablePlaceholder) || (!record.stableDemo && !record.stableDocumentation?.demoSelection) }));
  else assert.equal((await fetch(base)).status, 404, 'Bootstrap must not invent a stable root');
  if (record.preview) results.push(await checkBrowser(new URL('preview/', base).href, { preview: record.preview, requireDocs: true, requirePlaceholder: !record.previewDemo, runningDemo: Boolean(record.previewDemo) }));
  else assert.equal((await fetch(new URL('preview/', base))).status, 404, 'Main artifact must remove preview');
  const demos = [];
  if (record.stableDemo) demos.push({url:base.href, selected:record.stableDemo.selection, preview:null});
  if (record.previewDemo) demos.push({url:new URL('preview/',base).href, selected:record.previewDemo.selection, preview:record.preview});
  for (const demo of demos) {
    // Acquire and integrity-check reference inputs; vector execution still uses
    // only the unchanged published bytes served by the identified deployment.
    await prepareData(repository, join(repository,'.work/demo-observation-data'));
    const selection = await (await fetch(new URL('demo-runtime.json',demo.url))).json();
    for (const [key,value] of Object.entries(demo.selected)) assert.deepEqual(selection[key],value,`Observed demo selection differs: ${key}`);
    const runtimeInventory = demo.preview ? record.previewDemo.runtime : record.stableDemoRuntime;
    results.push(await checkDemo(demo.url,{root:repository,expectedPreview:demo.preview,expectedSelection:selection,runtimeInventory}));
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
