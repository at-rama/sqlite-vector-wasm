import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { repository } from '../build.mjs';
import { prepare } from '../prepare.mjs';

for (const preview of [undefined, { branch: 'docs-test', commit: 'a'.repeat(40) }]) {
  test(`real renderer tokens and independent doc edits (${preview ? 'preview' : 'stable'})`, async t => {
    const root = await mkdtemp(join(tmpdir(), 'site-docs-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    await cp(join(repository, 'site'), join(root, 'site'), { recursive: true });
    await mkdir(join(root, '.work/site'), { recursive: true });
    await symlink(join(repository, '.work/site/node_modules'), join(root, '.work/site/node_modules'));
    await symlink(join(repository, '.git'), join(root, '.git'));
    await mkdir(join(root, 'docs'));
    await writeFile(join(root, 'LICENSE'), 'license');
    await writeFile(join(root, 'docs/a.svg'), '<svg/>');
    const text = '# Presentation\n\n## Same\n\n## Same\n\n[usage][u] [demo](https://at-rama.github.io/sqlite-vector-wasm/demo/#demo) ![image][i] [license](LICENSE)\n\n[u]: docs/usage.md?q=1#start\n[i]: docs/a.svg\n\n```js\nconst value = "[untouched](absent.md) {{ x }} <script>";\n```\n';
    await writeFile(join(root, 'README.md'), text);
    await writeFile(join(root, 'docs/usage.md'), '# Usage\n\n## Start\n\n[home](../README.md#same-1)\n');
    const first = await prepare(root, undefined, { preview });
    const html = await readFile(join(first.source, 'index.md'), 'utf8');
    assert.ok(html.includes(`${first.base}usage/?q=1#start`));
    assert.ok(html.includes('/docs-assets/docs/a.svg'));
    assert.ok(!html.includes(`${first.base}docs-assets/docs/a.svg`), 'Vite applies the deployment base during compilation');
    assert.ok(html.includes('absent.md'));
    assert.ok(html.includes('{{ x }}'));
    assert.ok(html.includes('id="same-1"'));
    await writeFile(join(root, 'README.md'), text + '\nEdited source.\n');
    const next = await prepare(root, undefined, { preview });
    assert.match(await readFile(join(next.source, 'index.md'), 'utf8'), /Edited source/);
    assert.equal(next.runtime, null);
    await writeFile(join(root, 'docs/usage.md'), '# Usage\n\n[broken](missing.md)\n');
    await assert.rejects(prepare(root, undefined, { preview }), /missing (?:target|anchor)/);
    await assert.rejects(readFile(join(root, '.work/site/dist/index.html')), { code: 'ENOENT' });
  });
}
