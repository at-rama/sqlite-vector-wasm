import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serveSite } from '../server.mjs';

test('Pages-like prefix server has real 404s, directory entries and no isolation headers', async t => {
  const root = await mkdtemp(join(tmpdir(), 'site-server-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'usage'));
  await writeFile(join(root, 'index.html'), 'home');
  await writeFile(join(root, 'usage/index.html'), 'usage');
  await writeFile(join(root, 'module.mjs'), 'export const value = 1;');
  const server = await serveSite(root);
  t.after(server.close);
  const home = await fetch(server.url);
  assert.equal(await home.text(), 'home');
  assert.equal(home.headers.get('cross-origin-opener-policy'), null);
  assert.equal(home.headers.get('cross-origin-embedder-policy'), null);
  assert.equal(await (await fetch(server.url + 'usage/?query=1')).text(), 'usage');
  assert.equal((await fetch(server.url + 'module.mjs')).headers.get('content-type'), 'text/javascript');
  assert.equal((await fetch(server.url + 'absent')).status, 404);
  assert.equal((await fetch(new URL('/', server.url))).status, 404);
});

test('standard theme retains three destinations and adjacent GitHub/npm access', async () => {
  const config = await readFile(new URL('../../../site/.vitepress/config.mts', import.meta.url), 'utf8');
  assert.match(config, /base: configuration.base/);
  for (const label of ['Presentation', 'Usage', 'Demo', 'GitHub']) assert.ok(config.includes(label));
  assert.match(config, /\{ text: 'GitHub', link: 'https:\/\/github\.com\/at-rama\/sqlite-vector-wasm' \},\s*\{ text: 'npm', link: 'https:\/\/www\.npmjs\.com\/package\/@at-rama\/sqlite-vector-wasm' \}/);
  assert.match(config, /sidebar: false/);
  assert.doesNotMatch(config, /search:|theme:\s*\{/);
});
