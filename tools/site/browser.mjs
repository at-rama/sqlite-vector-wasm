import assert from 'node:assert/strict';
import { launchBrowser } from '../harness/browser.mjs';

export async function checkBrowser(url, { screenshot, requireWideCode = false, demoFixture = false, preview = null } = {}) {
  const base = new URL(url);
  assert.ok(base.pathname.endsWith('/'), 'Site URL must end in /');
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    const errors = [];
    let wideCodeObserved = false;
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
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
        const response = await page.goto(target);
        assert.equal(response.status(), 200, target);
        await page.waitForFunction(() => Boolean(document.querySelector('#app')?.__vue_app__));
        await page.getByRole('heading', { name: new RegExp('^' + title) }).waitFor();
        if (demoFixture && path === 'demo/') {
          await page.locator('#runtime-fixture').filter({ hasText: demoFixture === true ? 'fixture-runtime-1' : demoFixture }).waitFor();
        }
        assert.equal(await page.locator('html').getAttribute('lang'), 'en');
        await identity();
        const menu = width < 768 ? '.VPNavScreenMenu' : '.VPNavBarMenu';
        if (width < 768) await page.getByRole('button', { name: 'mobile navigation' }).click();
        for (const [label, relative] of destinations) {
          const link = page.locator(menu).getByRole('link', { name: label, exact: true });
          assert.equal(await link.evaluate(a => a.href), new URL(relative, base).href);
        }
        assert.equal(await page.locator(menu).getByRole('link', { name: /GitHub/ }).getAttribute('href'),
          'https://github.com/at-rama/sqlite-vector-wasm');
        // A sentinel survives a client-side route transition, but not a document reload.
        await page.evaluate(() => { window.__shellNavigation = true; });
        const next = path === 'usage/' ? 'Demo' : 'Usage';
        await page.locator(menu).getByRole('link', { name: next, exact: true }).click();
        await page.getByRole('heading', { name: new RegExp('^' + next) }).waitFor();
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
      destinations: 3, directVisits: 6, clientTransitions: 6 };
  } finally {
    await browser.close();
  }
}
