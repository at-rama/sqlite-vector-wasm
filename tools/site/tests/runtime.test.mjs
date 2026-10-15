import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { prepare as prepareSite, checkOutput } from '../prepare.mjs';

const prepare = (root, prepared) => prepareSite(root, prepared, { docs: false });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const site = new URL('../../../site/', import.meta.url);

async function fixture(t, demo = false) {
  const root = await mkdtemp(join(tmpdir(), 'site-input-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(site, join(root, 'site'), { recursive: true });
  const selected = { productVersion: 'fixture-1', archive: 'fixture-only-not-a-release' };
  const selection = JSON.stringify(selected) + '\n';
  const asset = 'export const fixture = 1;\n';
  if (demo) {
    await mkdir(join(root, 'site/public/demo-runtime'), { recursive: true });
    await writeFile(join(root, 'site/demo-runtime.json'), selection);
    await writeFile(join(root, 'site/public/demo-runtime/fixture.mjs'), asset);
    await writeFile(join(root, 'site/demo-runtime.sha256'),
      `${hash(selection)}  demo-runtime.json\n${hash(asset)}  public/demo-runtime/fixture.mjs\n`);
  }
  return { root, selected, selection, asset };
}

test('shell-only and docs-only preparation work without a demo or acquisition', async t => {
  const { root } = await fixture(t);
  assert.equal((await prepare(root)).runtime, null);
  const docs = join(root, 'docs-prepared');
  await mkdir(join(docs, 'usage'), { recursive: true });
  await writeFile(join(docs, 'index.md'), '# Presentation\n\nDocs fixture.\n');
  await writeFile(join(docs, 'usage/index.md'), '# Usage\n\nOnly docs.\n');
  const result = await prepare(root, docs);
  assert.equal(result.runtime, null);
  assert.match(await readFile(join(result.source, 'index.md'), 'utf8'), /Docs fixture/);
  assert.match(await readFile(join(result.source, 'demo/index.md'), 'utf8'), /not available/);
});

test('demo-only preparation and emitted assets preserve opaque selection and fixed bytes', async t => {
  const { root, selection, asset } = await fixture(t, true);
  const result = await prepare(root);
  assert.equal(result.runtime['demo-runtime.json'], hash(selection));
  assert.equal(result.runtime['public/demo-runtime/fixture.mjs'], hash(asset));
  assert.match(await readFile(join(result.source, 'usage/index.md'), 'utf8'), /not available/);
  await cp(join(result.source, 'public'), result.output, { recursive: true });
  for (const page of ['', 'usage/', 'demo/']) {
    await mkdir(join(result.output, page), { recursive: true });
    await writeFile(join(result.output, page, 'index.html'), '<!doctype html>fixture');
  }
  assert.deepEqual((await checkOutput(result)).runtime, result.runtime);
  await writeFile(join(result.output, 'demo-runtime/fixture.mjs'), 'altered output');
  await assert.rejects(checkOutput(result), /Emitted runtime differs/);
});

test('documentation-only rebuild preserves selected identity despite a newer candidate', async t => {
  const { root } = await fixture(t, true);
  const first = await prepare(root);
  // A separate candidate is present but is not an explicit selection input.
  await writeFile(join(root, 'latest-candidate.json'), JSON.stringify({ productVersion: 'fixture-2' }));
  await writeFile(join(root, 'site/usage/index.md'), '# Usage\n\nEdited docs.\n');
  const second = await prepare(root);
  assert.deepEqual(second.runtime, first.runtime);
  assert.match(await readFile(join(second.source, 'usage/index.md'), 'utf8'), /Edited docs/);
});

test('an explicit coherent replacement selection is accepted without choosing a release', async t => {
  const { root } = await fixture(t, true);
  const first = await prepare(root);
  const selection = '{"productVersion":"fixture-2","archive":"synthetic-replacement"}\n';
  const asset = "export const fixture = 2;\n";
  await writeFile(join(root, 'site/demo-runtime.json'), selection);
  await writeFile(join(root, 'site/public/demo-runtime/fixture.mjs'), asset);
  await writeFile(join(root, 'site/demo-runtime.sha256'),
    `${hash(selection)}  demo-runtime.json\n${hash(asset)}  public/demo-runtime/fixture.mjs\n`);
  const second = await prepare(root);
  assert.notDeepEqual(second.runtime, first.runtime);
  assert.equal(second.runtime['demo-runtime.json'], hash(selection));
  assert.equal(second.runtime['public/demo-runtime/fixture.mjs'], hash(asset));
});

for (const [name, mutate, pattern] of [
  ['missing asset', root => rm(join(root, 'site/public/demo-runtime/fixture.mjs')), /supplied together/],
  ['altered asset', root => writeFile(join(root, 'site/public/demo-runtime/fixture.mjs'), 'corrupt'), /checksum mismatch/],
  ['altered selection', root => writeFile(join(root, 'site/demo-runtime.json'), '{"other":true}'), /checksum mismatch/],
  ['unlisted asset', root => writeFile(join(root, 'site/public/demo-runtime/extra.mjs'), 'extra'), /Incomplete/],
  ['missing manifest', root => rm(join(root, 'site/demo-runtime.sha256')), /supplied together/],
  ['unsafe manifest', root => writeFile(join(root, 'site/demo-runtime.sha256'), `${'0'.repeat(64)}  ../outside\n`), /Invalid/],
  ['duplicate manifest entry', async root => {
    const path = join(root, 'site/demo-runtime.sha256');
    const text = await readFile(path, 'utf8');
    await writeFile(path, text + text);
  }, /Invalid/],
]) {
  test(`${name} fails closed and clears stale generated output`, async t => {
    const { root } = await fixture(t, true);
    await mkdir(join(root, '.work/site/dist'), { recursive: true });
    await writeFile(join(root, '.work/site/dist/index.html'), 'stale');
    await mutate(root);
    await assert.rejects(prepare(root), pattern);
    await assert.rejects(access(join(root, '.work/site/dist')), { code: 'ENOENT' });
  });
}

test('symlink input and prepared directories inside disposable work are rejected', async t => {
  const { root } = await fixture(t);
  await assert.rejects(prepare(root, join(root, '.work/site/src')), /outside/);
  await symlink(join(root, 'site/index.md'), join(root, 'site/alias.md'));
  await assert.rejects(prepare(root), /regular file/);
});
