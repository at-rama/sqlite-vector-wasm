import assert from 'node:assert/strict';
import { launchBrowser } from '../harness/browser.mjs';

export async function checkBrowser(url, { screenshot, requireWideCode = false, demoFixture = false, preview = null, requireDocs = false, requireNpm = true } = {}) {
  const base = new URL(url);
  assert.ok(base.pathname.endsWith('/'), 'Site URL must end in /');
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    const errors = [];
    let wideCodeObserved = false;
    const docsResponse = await page.request.get(new URL('site-docs.json', base).href);
    if (requireDocs) assert.equal(docsResponse.status(), 200, 'Integrated documentation manifest is required');
    const docs = docsResponse.ok() ? await docsResponse.json() : null;
    if (docs) assert.deepEqual(docs.pages.map(page => page.source), ['README.md', 'docs/usage.md']);
    const demoResponse = await page.request.get(new URL('demo-runtime.json', base).href);
    const actualDemo = demoResponse.ok() && Boolean((await demoResponse.json()).version);
    const heading = label => label === 'Demo' && actualDemo ? 'Emoji vector explorer' : label === 'Presentation' && docs ? docs.pages[0].headings[0] : label === 'Usage' && docs ? docs.pages[1].headings[0] : label;
    async function documentation(path) {
      const expected = docs?.pages.find(entry => entry.path === path);
      if (!expected) return;
      for (const id of expected.ids) assert.equal(await page.locator('.vp-doc').evaluate((el, id) => [...el.querySelectorAll('[id]')].some(node => node.id === id), id), true, `Missing heading ${id}`);
      const normalize = value => value.replace(/\s+/g, ' ').trim();
      const text = normalize(await page.locator('.vp-doc').innerText());
      for (const expectedText of expected.texts ?? []) assert.ok(text.includes(normalize(expectedText)), `Missing documentation text ${expectedText}`);
      const actualImages = await page.locator('.vp-doc img').evaluateAll(nodes => nodes.map(node => node.src));
      for (const src of expected.images) assert.ok(actualImages.includes(new URL(src, page.url()).href), `Missing documentation image ${src}`);
      const code = await page.locator('.vp-doc pre code').allTextContents();
      assert.deepEqual(code.map(value => value.trimEnd()), expected.code);
      const links = await page.locator('.vp-doc a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
      for (const href of expected.links) assert.ok(links.includes(href), `Missing documentation link ${href}`);
      for (const image of await page.locator('.vp-doc img').all()) {
        if (new URL(await image.getAttribute('src'), page.url()).origin !== base.origin) continue;
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(el => el.decode());
        assert.ok(await image.evaluate(el => el.naturalWidth > 0));
      }
      for (const href of expected.links.filter(href => href.startsWith('#') || href.startsWith(base.pathname))) {
        const destination = new URL(href, page.url());
        const response = await page.request.get(destination.href);
        assert.equal(response.status(), 200, destination.href);
        if (destination.hash) assert.ok((await response.text()).includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), `Missing emitted anchor ${destination.href}`);
      }
    }
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === base.origin) errors.push(`${response.status()} ${response.url()}`);
    });
    const destinations = [['Presentation', ''], ['Usage', 'usage/'], ['Demo', 'demo/']];
    async function identity() {
      const robots = page.locator('meta[name="robots"]');
      if (preview) {
        assert.equal(await robots.getAttribute('content'), 'noindex');
        assert.ok((await page.locator('.VPFooter').innerText()).includes(preview.branch));
        assert.ok((await page.locator('.VPFooter').innerText()).includes(preview.commit));
        assert.ok(await page.locator('.VPFooter').isVisible());
      } else {
        assert.equal(await robots.count(), 0);
        assert.equal(await page.locator('.VPFooter').count(), 0);
      }
    }
    if (preview) {
      const response = await page.request.get(new URL('site-revision.json', base).href);
      assert.equal(response.status(), 200);
      assert.deepEqual(await response.json(), preview);
    }
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [title, path] of destinations) {
        const target = new URL(path, base).href;
        const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200, target);
        await page.waitForFunction(() => Boolean(document.querySelector('#app')?.__vue_app__));
        await page.getByRole('heading', { name: new RegExp('^' + heading(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).waitFor();
        if (demoFixture && path === 'demo/') {
          await page.locator('#runtime-fixture').filter({ hasText: demoFixture === true ? 'fixture-runtime-1' : demoFixture }).waitFor();
        }
        assert.equal(await page.locator('html').getAttribute('lang'), 'en');
        await identity();
        await documentation(path);
        const menu = width < 768 ? '.VPNavScreenMenu' : '.VPNavBarMenu';
        if (width < 768) await page.getByRole('button', { name: 'mobile navigation' }).click();
        for (const [label, relative] of destinations) {
          const link = page.locator(menu).getByRole('link', { name: label, exact: true });
          assert.equal(await link.evaluate(a => a.href), new URL(relative, base).href);
        }
        assert.equal(await page.locator(menu).getByRole('link', { name: /GitHub/ }).getAttribute('href'),
          'https://github.com/at-rama/sqlite-vector-wasm');
        if (requireNpm) {
          const npm = page.locator(menu).getByRole('link', { name: 'npm', exact: true });
          assert.ok(await npm.isVisible(), 'npm must be visible in the opened navigation');
          assert.equal(await npm.getAttribute('href'), 'https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm');
          const links = await page.locator(menu).getByRole('link').evaluateAll(nodes => nodes.map(node => node.href));
          assert.equal(links.indexOf('https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm'),
            links.indexOf('https://github.com/at-rama/sqlite-vector-wasm') + 1, 'npm must immediately follow GitHub');
        }
        // A sentinel survives a client-side route transition, but not a document reload.
        await page.evaluate(() => { window.__shellNavigation = true; });
        const next = path === 'usage/' ? 'Demo' : 'Usage';
        await page.locator(menu).getByRole('link', { name: next, exact: true }).click();
        await page.getByRole('heading', { name: new RegExp('^' + heading(next).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).waitFor();
        if (width < 768) await page.locator('.VPNavScreen').waitFor({ state: 'hidden' });
        if (demoFixture && next === 'Demo') {
          await page.locator('#runtime-fixture').filter({ hasText: demoFixture === true ? 'fixture-runtime-1' : demoFixture }).waitFor();
        }
        assert.equal(await page.evaluate(() => window.__shellNavigation), true);
        await identity();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `Page overflow at ${width}px`);
        for (const pre of await page.locator('.vp-doc pre').all()) {
          if (await pre.evaluate(el => el.scrollWidth > el.clientWidth)) wideCodeObserved = true;
          assert.ok(await pre.evaluate(el => el.scrollWidth <= el.clientWidth ||
            ['auto', 'scroll'].includes(getComputedStyle(el).overflowX)), 'Wide code needs contained scrolling');
        }
      }
    }
    if (screenshot) await page.screenshot({ path: screenshot, fullPage: true });
    if (requireWideCode) assert.ok(wideCodeObserved, 'The fixture must exercise a wide code block');
    assert.deepEqual(errors, [], 'Browser resource or JavaScript errors');
    return { url: base.href, preview, browser: browser.version(), viewports: [1280, 390],
      documentation: docs?.pages.map(({ source, sha256 }) => ({ source, sha256 })) ?? null, npmNavigationChecked: requireNpm, destinations: 3, directVisits: 6, clientTransitions: 6 };
  } finally {
    await browser.close();
  }
}
