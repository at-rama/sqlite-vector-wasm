import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { launchBrowser } from '../harness/browser.mjs';
import { sha } from './demo-data.mjs';
export { checkNeighbors, cosineTolerance } from './demo-reference.mjs';
import { checkNeighbors } from './demo-reference.mjs';
export async function checkDemo(url, { root, screenshot, expectedSelection, failurePaths = false, expectedPreview, runtimeInventory } = {}) {
  const browser = await launchBrowser();
  const reports = [], discovery = [], requests = [], errors = [];
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
    const binary = await wait('binary');
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, 0);
    const selection = await (await page.request.get(new URL('demo-runtime.json', url).href)).json();
    if (expectedSelection) assert.deepEqual(selection, expectedSelection);
    assert.ok((await page.locator('.demo-identity').textContent()).includes(selection.version));
    assert.ok((await page.locator('.demo-identity').textContent()).includes(selection.upstreams.sqlite));
    assert.ok((await page.locator('.demo-identity').textContent()).includes('SQLite-Vector ' + selection.upstreams.sqliteVector));
    if (expectedPreview) assert.ok((await page.locator('body').textContent()).includes(expectedPreview.commit));
    const manifest = await (await page.request.get(new URL('demo-data/manifest.json', url).href)).json();
    const sourceSelection = JSON.parse(await readFile(join(root, 'tools/site/demo-data.json'), 'utf8'));
    assert.equal(manifest.revision, sourceSelection.revision);
    assert.deepEqual(manifest.sourceFiles, sourceSelection.files);
    const catalogue = await (await page.request.get(new URL('demo-data/catalogue.json', url).href)).json();
    assert.equal(catalogue.length, 1661);
    const cats = catalogue.filter(row => row.emoji === '🐱'); assert.equal(cats.length, 1);
    const initialId = cats[0].id;
    assert.equal(binary.id, initialId);
    assert.equal(await page.locator('.demo-large').textContent(), '🐱');
    assert.equal(await page.locator('#emoji-search').inputValue(), '');
    assert.match(await page.locator('.demo-controls [role="status"]').textContent(), /1661 matching emojis/);
    assert.equal(await page.locator('.neighbor-grid button').count(), 6);
    assert.equal(await page.locator('.demo-technical').getAttribute('open'), null);
    assert.equal(await page.locator('.demo-raw').getAttribute('open'), null);
    assert.equal(await page.locator('.demo-identity a').getAttribute('href'), selection.releaseUrl);
    assert.equal(await page.locator('.demo-attribution a').count(), 2);
    if (screenshot) for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.screenshot({ path: screenshot.replace(/-mobile\.png$/, `-initial-${width}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    // Literal memberships for the frozen corpus, without importing the production text policy.
    const catIds = [58, 63, 94, 175, 180, 183, 379, 526, 531, 664, 674, 773, 939, 970, 972];
    const faceIds = [58, 94, 379, 526, 531, 674, 773, 970, 972];
    const musicIds = [8, 57, 135, 245, 267, 332, 376, 409, 461, 479, 488, 624, 632, 740, 762, 802];
    for (const [text, expected] of [['cat', catIds], ['CAT', catIds], ['cat fac', faceIds], ['fac cat', faceIds],
      ['  CAT, fac! cat ', faceIds], ['mus', musicIds], ['mus cat', []], ['%', []], ['_', []], ['\\', []], ["' OR 1=1 --", []]]) {
      await page.locator('#emoji-search').fill(text);
      await page.waitForFunction(count => document.querySelector('.demo-controls [role="status"]')?.textContent.trim().startsWith(count + ' matching emojis'), expected.length);
      while (await page.getByRole('button', { name: /Show more/ }).count()) await page.getByRole('button', { name: /Show more/ }).click();
      const ids = await page.locator('.emoji-grid button').evaluateAll(buttons => buttons.map(el => Number(el.dataset.emojiId)));
      assert.deepEqual(ids, expected, `Text discovery mismatch: ${text}`);
      discovery.push({ text, ids });
    }
    assert.ok(musicIds.includes(632) && catalogue[632].label === 'musical');
    assert.ok(musicIds.some(id => !catalogue[id].label.startsWith('mus')), 'No non-title match checked');
    const source = join(root, '.work/demo-input/emoji2vec.bin');
    assert.equal(sha(await readFile(source)), manifest.sourceFiles['emoji2vec.bin'].sha256);
    const references = JSON.parse(execFileSync('python3', [join(root, 'tools/site/demo-reference.py'), source, '0', '1', '40', '100', String(initialId)], { encoding: 'utf8' }));
    checkNeighbors(binary, references.find(reference => reference.id === initialId));
    for (const mode of ['binary', 'float32']) {
      await page.locator(`input[value="${mode}"]`).check();
      for (const reference of references) {
        await page.locator('#emoji-search').fill(catalogue[reference.id].label);
        const target = page.locator(`.emoji-grid [data-emoji-id="${reference.id}"]`);
        await page.waitForFunction(() => document.querySelector('.emoji-grid button') !== null);
        for (let batch = 0; !await target.count() && batch < 140; batch++) {
          const more = page.getByRole('button', { name: /Show more/ }); if (!await more.count()) break;
          await more.click();
        }
        await target.waitFor(); await target.click();
        const result = await wait(mode, reference.id);
        reports.push({ ...result, reference: checkNeighbors(result, reference) });
      }
    }
    assert.ok(reports.filter(r => r.mode === 'binary').some(r => r.reference.boundaryTies > 1), 'No real boundary tie exercised');
    const floatLoads = requests.filter(u => u.endsWith('/float32.bin')).length;
    assert.equal(floatLoads, 1);
    await page.locator('input[value="binary"]').check(); await wait('binary', initialId);
    await page.locator('input[value="float32"]').check(); await wait('float32', initialId);
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, floatLoads);
    const firstNeighbor = (await read()).rows[0].id;
    await page.locator('.neighbor-grid button').first().focus(); await page.keyboard.press('Enter'); await wait('float32', firstNeighbor);
    await page.getByRole('button', { name: 'Copy emoji', exact: true }).focus(); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), catalogue[firstNeighbor].emoji);
    await page.locator('#emoji-search').fill('zz-no-such-emoji'); await page.getByText('No matching emojis.', { exact: false }).waitFor();
    await page.locator('#emoji-search').fill('%'); await page.getByText('No matching emojis.', { exact: false }).waitFor();
    await page.locator('#emoji-search').fill(''); await page.getByText('1661 matching emojis', { exact: false }).waitFor();
    await page.locator('.demo-catalogue > summary').click();
    await page.getByRole('button', { name: /Show more/ }).click(); assert.equal(await page.locator('.emoji-grid button').count(), 24);
    while (await page.locator('.emoji-grid button').count() < 48) await page.getByRole('button', { name: /Show more/ }).click();
    // Race two selections and mode changes without waiting for earlier responses.
    await page.locator('.emoji-grid [data-emoji-id="1"]').click();
    await page.locator('.emoji-grid [data-emoji-id="40"]').click();
    await page.locator('input[value="binary"]').check(); await wait('binary', 40);
    await page.locator('.demo-technical > summary').focus(); await page.keyboard.press('Enter');
    assert.match(await page.locator('.demo-diagnostics').textContent(), /SELECT rowid/);
    assert.equal(await page.locator('.demo-distances tbody tr').count(), 6);
    assert.match(await page.locator('.demo-sql').textContent(), /SELECT rowid/);
    assert.equal(await page.locator('.demo-raw').getAttribute('open'), null);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Demo overflows viewport');
      await page.locator('#emoji-search').focus(); assert.equal(await page.locator('#emoji-search').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.demo-catalogue > summary').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.emoji-grid button').first().evaluate(el => el === document.activeElement), true);
      assert.equal(await page.locator('.emoji-grid button').first().evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
      await page.keyboard.press('Enter'); await wait('binary', 0);
      await page.locator('input[value="binary"]').focus(); await page.keyboard.press('ArrowRight'); await wait('float32', 0);
      await page.keyboard.press('ArrowLeft'); await wait('binary', 0);
      if (width === 390 && screenshot) await page.screenshot({ path: screenshot, fullPage: true });
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    const workerClosed = page.waitForEvent('worker').catch(() => null); // Re-entry creates a new execution context.
    const workers = page.workers(); assert.equal(workers.length, 1);
    const closed = new Promise(resolve => workers[0].once('close', resolve));
    await page.getByRole('link', { name: 'Usage', exact: true }).first().click();
    await Promise.race([closed, new Promise((_, reject) => setTimeout(() => reject(Error('Worker did not close')), 10000))]);
    await page.getByRole('link', { name: 'Demo', exact: true }).first().click(); await workerClosed; await wait('binary', initialId);
    assert.equal(await page.locator('#emoji-search').inputValue(), '');
    assert.equal(await page.locator('.demo-technical').getAttribute('open'), null);
    assert.equal(requests.filter(u => u.endsWith('/float32.bin')).length, floatLoads);
    if (failurePaths) {
      await page.goto(new URL('usage/', url).href);
      await page.route('**/demo-data/binary.bin', route => route.abort());
      await page.goto(demoUrl); await page.getByRole('button', { name: 'Retry initialization' }).waitFor();
      await page.unroute('**/demo-data/binary.bin'); await page.getByRole('button', { name: 'Retry initialization' }).click(); await wait('binary', initialId);
      await page.route('**/demo-data/float32.bin', route => route.abort());
      await page.locator('input[value="float32"]').check(); await page.getByRole('button', { name: 'Continue in binary' }).waitFor();
      await page.getByRole('button', { name: 'Continue in binary' }).click(); await wait('binary', initialId);
      await page.unroute('**/demo-data/float32.bin'); await page.locator('input[value="float32"]').check(); await wait('float32', initialId);
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
    return { url, browser: browser.version(), selection, corpus: manifest.revision, discovery, initialEmoji: { id: initialId, emoji: cats[0].emoji }, reports, binaryInitial: binary, floatLoads,
      failurePaths, requests: requests.filter(u => /demo-(data|runtime)/.test(u)), errors };
  } finally { await browser.close(); }
}
