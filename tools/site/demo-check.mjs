import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { launchBrowser } from '../harness/browser.mjs';
import { sha } from './demo-data.mjs';
export const cosineTolerance = 2e-6; // Scalar double reference vs a 300-component Float32 reduction.
export function checkNeighbors(result, reference) {
  const distances = reference[result.mode], tolerance = result.mode === 'binary' ? 0 : cosineTolerance;
  assert.equal(result.id, reference.id); assert.equal(result.rows.length, 6);
  assert.equal(new Set(result.rows.map(r => r.id)).size, 6);
  assert.ok(result.rows.every(r => r.id !== reference.id));
  const sorted = distances.map((distance, id) => ({ id, distance })).filter(r => r.id !== reference.id).sort((a, b) => a.distance - b.distance);
  const boundary = sorted[5].distance, actual = new Set(result.rows.map(r => r.id));
  for (const row of result.rows) {
    assert.ok(Number.isInteger(row.id) && row.id >= 0 && row.id < distances.length);
    assert.ok(Math.abs(row.distance - distances[row.id]) <= tolerance, `Distance mismatch for ${row.id}`);
    assert.ok(distances[row.id] <= boundary + tolerance, 'Returned a farther neighbor');
  }
  for (const row of sorted.filter(r => r.distance < boundary - tolerance)) assert.ok(actual.has(row.id), 'Missing a strictly closer neighbor');
  return { boundary, boundaryTies: sorted.filter(r => Math.abs(r.distance - boundary) <= tolerance).length };
}
export async function checkDemo(url, { root, screenshot, expectedSelection, failurePaths = false, expectedPreview, runtimeInventory } = {}) {
  const browser = await launchBrowser();
  const reports = [], requests = [], errors = [];
  try {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => requests.push(r.url()));
    const demoUrl = new URL('demo/', url).href;
    const read = async () => JSON.parse(await page.locator('.demo-diagnostics').textContent());
    const wait = async (mode, id) => {
      await page.waitForFunction(({ mode, id }) => {
        const el = document.querySelector('.demo-diagnostics');
        if (!el) return false;
        const r = JSON.parse(el.textContent); return r.mode === mode && (id === undefined || r.id === id);
      }, { mode, id }, { timeout: 60000 });
      return read();
    };
    await page.goto(url); await page.getByRole('link', { name: 'Usage', exact: true }).first().click();
    await page.locator('h1').waitFor();
    assert.equal(requests.filter(u => /demo-(runtime|data)\//.test(u)).length, 0, 'Another page started the demo');
    await page.getByRole('link', { name: 'Demo', exact: true }).first().click();
    const binary = await wait('binary', 0);
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, 0);
    const selection = await (await page.request.get(new URL('demo-runtime.json', url).href)).json();
    if (expectedSelection) assert.deepEqual(selection, expectedSelection);
    assert.ok((await page.locator('.demo-identity').textContent()).includes(selection.version));
    assert.ok((await page.locator('.demo-identity').textContent()).includes(selection.upstreams.sqlite));
    if (expectedPreview) assert.ok((await page.locator('body').textContent()).includes(expectedPreview.commit));
    const manifest = await (await page.request.get(new URL('demo-data/manifest.json', url).href)).json();
    const sourceSelection = JSON.parse(await readFile(join(root, 'tools/site/demo-data.json'), 'utf8'));
    assert.equal(manifest.revision, sourceSelection.revision);
    assert.deepEqual(manifest.sourceFiles, sourceSelection.files);
    const catalogue = await (await page.request.get(new URL('demo-data/catalogue.json', url).href)).json();
    assert.equal(catalogue.length, 1661);
    const source = join(root, '.work/demo-input/emoji2vec.bin');
    assert.equal(sha(await readFile(source)), manifest.sourceFiles['emoji2vec.bin'].sha256);
    const references = JSON.parse(execFileSync('python3', [join(root, 'tools/site/demo-reference.py'), source, '0', '1', '40', '100'], { encoding: 'utf8' }));
    for (const mode of ['binary', 'float32']) {
      await page.locator(`input[value="${mode}"]`).check();
      for (const reference of references) {
        await page.locator('#emoji-search').fill(catalogue[reference.id].label);
        const target = page.locator(`.emoji-grid [data-emoji-id="${reference.id}"]`);
        await target.waitFor(); await target.click();
        const result = await wait(mode, reference.id);
        reports.push({ ...result, reference: checkNeighbors(result, reference) });
      }
    }
    assert.ok(reports.filter(r => r.mode === 'binary').some(r => r.reference.boundaryTies > 1), 'No real boundary tie exercised');
    const floatLoads = requests.filter(u => u.endsWith('/float32.bin')).length;
    assert.equal(floatLoads, 1);
    await page.locator('input[value="binary"]').check(); await wait('binary', 100);
    await page.locator('input[value="float32"]').check(); await wait('float32', 100);
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, floatLoads);
    const firstNeighbor = (await read()).rows[0].id;
    await page.locator('.neighbor-grid button').first().click(); await wait('float32', firstNeighbor);
    await page.getByRole('button', { name: 'Copy emoji', exact: true }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), catalogue[firstNeighbor].emoji);
    await page.locator('#emoji-search').fill('zz-no-such-emoji'); await page.getByText('No matching emojis.', { exact: false }).waitFor();
    await page.locator('#emoji-search').fill('%'); await page.getByText('No matching emojis.', { exact: false }).waitFor();
    await page.locator('#emoji-search').fill(''); await page.getByText('1661 matching emojis', { exact: false }).waitFor();
    await page.getByRole('button', { name: /Show more/ }).click(); assert.equal(await page.locator('.emoji-grid button').count(), 120);
    // Race two selections and mode changes without waiting for earlier responses.
    await page.locator('.emoji-grid [data-emoji-id="1"]').click();
    await page.locator('.emoji-grid [data-emoji-id="40"]').click();
    await page.locator('input[value="binary"]').check(); await wait('binary', 40);
    await page.locator('.demo-technical summary').click();
    assert.match(await page.locator('.demo-diagnostics').textContent(), /SELECT rowid/);
    await page.locator('.demo-technical summary').click();
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Demo overflows viewport');
      await page.locator('#emoji-search').focus(); assert.equal(await page.locator('#emoji-search').evaluate(el => el === document.activeElement), true);
      if (width === 390 && screenshot) await page.screenshot({ path: screenshot, fullPage: true });
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    const workerClosed = page.waitForEvent('worker').catch(() => null); // Re-entry creates a new execution context.
    const workers = page.workers(); assert.equal(workers.length, 1);
    const closed = new Promise(resolve => workers[0].once('close', resolve));
    await page.getByRole('link', { name: 'Usage', exact: true }).first().click();
    await Promise.race([closed, new Promise((_, reject) => setTimeout(() => reject(Error('Worker did not close')), 10000))]);
    await page.getByRole('link', { name: 'Demo', exact: true }).first().click(); await workerClosed; await wait('binary', 0);
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, floatLoads);
    if (failurePaths) {
      await page.goto(new URL('usage/', url).href);
      await page.route('**/demo-data/binary.bin', route => route.abort());
      await page.goto(demoUrl); await page.getByRole('button', { name: 'Retry initialization' }).waitFor();
      await page.unroute('**/demo-data/binary.bin'); await page.getByRole('button', { name: 'Retry initialization' }).click(); await wait('binary', 0);
      await page.route('**/demo-data/float32.bin', route => route.abort());
      await page.locator('input[value="float32"]').check(); await page.getByRole('button', { name: 'Continue in binary' }).waitFor();
      await page.getByRole('button', { name: 'Continue in binary' }).click(); await wait('binary', 0);
      await page.unroute('**/demo-data/float32.bin'); await page.locator('input[value="float32"]').check(); await wait('float32', 0);
      await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw Error('Denied'); }; });
      await page.getByRole('button', { name: 'Copy emoji', exact: true }).click(); await page.getByText('Could not copy.', { exact: false }).waitFor();
    }
    // Verify every runtime file actually hosted for this build against its inventory.
    const hashes = runtimeInventory ?? JSON.parse(await readFile(join(root, '.work/site/build.json'), 'utf8')).runtime;
    for (const [path, hash] of Object.entries(hashes)) {
      const response = await page.request.get(new URL(path.replace(/^public\//, ''), url).href);
      assert.equal(response.status(), 200); assert.equal(sha(await response.body()), hash, 'Hosted runtime changed');
    }
    assert.deepEqual(errors, []);
    return { url, browser: browser.version(), selection, corpus: manifest.revision, reports, binaryInitial: binary, floatLoads,
      failurePaths, requests: requests.filter(u => /demo-(data|runtime)/.test(u)), errors };
  } finally { await browser.close(); }
}
