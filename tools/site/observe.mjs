import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { checkBrowser } from './browser.mjs';
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
  if (record.stablePresent) results.push(await checkBrowser(base.href, { requireDocs: !record.preview }));
  else assert.equal((await fetch(base)).status, 404, 'Bootstrap must not invent a stable root');
  if (record.preview) results.push(await checkBrowser(new URL('preview/', base).href, { preview: record.preview, requireDocs: true }));
  else assert.equal((await fetch(new URL('preview/', base))).status, 404, 'Main artifact must remove preview');
  await sameDeployment();
  await writeFile(resultPath, JSON.stringify({ publication: record, results }, null, 2) + '\n');
  console.log(JSON.stringify({ publication: record, results }));
} catch (error) {
  console.error(`Site observation: ${error.message}`);
  process.exitCode = 1;
} finally {
  await server?.close();
}
