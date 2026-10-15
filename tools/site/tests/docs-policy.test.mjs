import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { documentationResolver, canonical } from '../docs.mjs';

for (const base of ['/sqlite-vector-wasm/', '/sqlite-vector-wasm/preview/']) {
  test(`source-relative destinations, images, queries and anchors at ${base}`, async t => {
    const root = await mkdtemp(join(tmpdir(), 'docs-policy-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(join(root, 'docs'));
    for (const path of ['README.md', 'docs/usage.md', 'LICENSE', 'docs/picture.svg']) await writeFile(join(root, path), path);
    const source = join(root, 'output');
    const parsed = { 'README.md': { ids: ['same', 'same-1'] }, 'docs/usage.md': { ids: ['initialize'] } };
    const target = documentationResolver({ root, source, base, parsed, revision: 'a'.repeat(40) });
    assert.equal(await target('docs/usage.md?x=1#initialize', 'README.md'), base + 'usage/?x=1#initialize');
    assert.equal(await target('../README.md#same-1', 'docs/usage.md'), base + '#same-1');
    assert.equal(await target(canonical + 'usage/#initialize', 'README.md'), base + 'usage/#initialize');
    assert.equal(await target('#same-1', 'README.md'), '#same-1');
    assert.equal(await target('../LICENSE', 'docs/usage.md'), `https://github.com/at-rama/sqlite-vector-wasm/blob/${'a'.repeat(40)}/LICENSE`);
    for (const url of ['https://example.org/', canonical.replace('wasm/', 'wasm-other/'), 'mailto:a@example.org']) assert.equal(await target(url, 'README.md'), url);
    assert.equal(await target('picture.svg', 'docs/usage.md', true), base + 'docs-assets/docs/picture.svg');
    assert.equal(await readFile(join(source, 'public/docs-assets/docs/picture.svg'), 'utf8'), 'docs/picture.svg');
    for (const url of ['absent.md', 'docs/usage.md#missing', '#missing', canonical + 'absent/']) await assert.rejects(target(url, 'README.md'), /README.md:.*(?:missing|unmapped)/);
    await assert.rejects(target('../outside', 'README.md'), /README.md:/);
  });
}
