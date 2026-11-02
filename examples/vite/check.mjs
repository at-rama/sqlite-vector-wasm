// Opt-in check of the built consumer example; not part of package acceptance.
import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { preview } from 'vite';
import { chromium } from 'playwright';

const report = { started: new Date().toISOString(), verdict: 'failed', checks: [], responses: [], errors: [] };
const check = (name, action) => { action(); report.checks.push(name); };
let server, browser;
try {
  const files = await readdir('dist/assets');
  server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
  const address = server.httpServer.address();
  const origin = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ headless: true });
  report.browser = browser.version();
  const context = await browser.newContext();
  context.on('response', response => report.responses.push({ url: response.url().replace(origin, ''), status: response.status() }));
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(origin + '/vite-example/');
  await page.waitForFunction(() => document.querySelector('#result').textContent !== 'Starting database Worker…');
  report.result = JSON.parse(await page.locator('#result').textContent());
  const result = report.result;
  check('SQLite version', () => assert.equal(result.sqlite, '3.54.1'));
  check('Vector version', () => assert.equal(result.vector.replace(/^v/, ''), '1.1.2'));
  check('Neighbor identifiers', () => assert.deepEqual(result.neighbors.map(row => row[0]), [1, 2]));
  check('Exact first distance', () => assert.equal(result.neighbors[0][1], 0));
  check('Independent second L2 distance', () => assert.ok(Math.abs(result.neighbors[1][1] - Math.SQRT2) < 1e-5));
  check('No browser error', () => assert.deepEqual(report.errors, []));
  check('HTTP responses succeed', () => assert.ok(report.responses.length && report.responses.every(response => response.status === 200)));
  check('Hashed Worker requested under base', () => assert.ok(report.responses.some(response => /^\/vite-example\/assets\/worker-.*\.js$/.test(response.url))));
  check('Hashed WASM requested under base', () => assert.ok(report.responses.some(response => /^\/vite-example\/assets\/sqlite3-.*\.wasm$/.test(response.url))));
  check('ESM Worker build', () => assert.ok(files.some(file => /^worker-.*\.js$/.test(file))));
  const wasm = await readFile('dist/assets/' + files.find(file => file.endsWith('.wasm')));
  check('Published WASM preserved', () => assert.equal(createHash('sha256').update(wasm).digest('hex'), '3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6'));
  report.conditions = await page.evaluate(() => ({ secureContext: isSecureContext, crossOriginIsolated }));
  check('Configured preview headers establish isolation', () => assert.equal(report.conditions.crossOriginIsolated, true));
  report.verdict = 'passed';
} catch (error) {
  report.error = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  report.finished = new Date().toISOString();
  await writeFile('check-result.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
}
