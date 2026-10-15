import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { repository, build } from './build.mjs';
import { checkBrowser } from './browser.mjs';
import { serveSite } from './server.mjs';
import { assemble } from './publication.mjs';

// Real compiler/browser checks with synthetic, explicitly non-product inputs.
export async function exercise() {
  await rm(join(repository, '.work/site/exercise.json'), { force: true });
  await rm(join(repository, '.work/site/mobile.png'), { force: true });
  const temporary = await mkdtemp(join(repository, '.work/site-exercise-'));
  const results = [];
  async function observe(name, prepared, options) {
    const result = await build({ prepared, preview: options?.preview });
    const server = await serveSite(result.output, result.base);
    try { results.push({ name, ...await checkBrowser(server.url, options), runtime: result.runtime }); }
    finally { await server.close(); }
    return result;
  }
  try {
    const docs = join(temporary, 'docs');
    await mkdir(join(docs, 'usage'), { recursive: true });
    await writeFile(join(docs, 'index.md'), '# Presentation\n\nDocumentation integration fixture.\n');
    await writeFile(join(docs, 'usage/index.md'), '# Usage\n\n```js\n' + 'example'.repeat(100) + '\n```\n');
    await observe('docs-only', docs, { requireWideCode: true });

    const demo = join(temporary, 'demo');
    await mkdir(join(demo, 'demo'), { recursive: true });
    await mkdir(join(demo, 'public/demo-runtime'), { recursive: true });
    await writeFile(join(demo, 'demo/index.md'), `# Demo

<script setup>
import { ref, onMounted } from 'vue';
const result = ref('loading fixture');
onMounted(async () => {
  const url = new URL(import.meta.env.BASE_URL + 'demo-runtime/fixture.mjs', location.origin).href;
  const module = await import(/* @vite-ignore */ url);
  result.value = module.identity;
});
</script>

This is an integration fixture, not the emoji demo.

<div id="runtime-fixture">{{ result }}</div>
`);
    const selection = JSON.stringify({ productVersion: 'fixture-1', archive: 'synthetic-only' }) + '\n';
    const asset = "export const identity = 'fixture-runtime-1';\n";
    const hash = bytes => createHash('sha256').update(bytes).digest('hex');
    await writeFile(join(demo, 'demo-runtime.json'), selection);
    await writeFile(join(demo, 'public/demo-runtime/fixture.mjs'), asset);
    await writeFile(join(demo, 'demo-runtime.sha256'),
      `${hash(selection)}  demo-runtime.json\n${hash(asset)}  public/demo-runtime/fixture.mjs\n`);
    const first = await observe('demo-only', demo, { demoFixture: true });

    // A newer candidate exists separately; a docs rebuild is not a refresh.
    await writeFile(join(temporary, 'latest-candidate.json'), JSON.stringify({ productVersion: 'fixture-2' }));
    await writeFile(join(demo, 'index.md'), '# Presentation\n\nEdited documentation fixture.\n');
    await mkdir(join(demo, 'usage'), { recursive: true });
    await writeFile(join(demo, 'usage/index.md'), await readFile(join(docs, 'usage/index.md')));
    const second = await observe('documentation-update', demo, { demoFixture: true, requireWideCode: true });
    assert.deepEqual(second.runtime, first.runtime);
    assert.equal(second.runtime['demo-runtime.json'], hash(selection));
    assert.equal(second.runtime['public/demo-runtime/fixture.mjs'], hash(asset));

    // Preserve the separately built stable side before constructing a different
    // candidate. No candidate source, selection or asset can replace this root.
    const stableRoot = join(temporary, 'stable');
    await cp(second.source, join(stableRoot, 'site'), { recursive: true });
    await mkdir(join(stableRoot, 'tools/site'), { recursive: true });
    for (const path of ['tools/site.sh', 'tools/site/package-lock.json']) {
      await cp(join(repository, path), join(stableRoot, path));
    }
    await mkdir(join(stableRoot, '.work/site'), { recursive: true });
    await cp(second.output, join(stableRoot, '.work/site/dist'), { recursive: true });
    await cp(join(repository, '.work/site/build.json'), join(stableRoot, '.work/site/build.json'));

    const preview = { branch: 'feature/preview<&', commit: '1234567890abcdef1234567890abcdef12345678' };
    const nextSelection = JSON.stringify({ productVersion: 'fixture-2', archive: 'synthetic-only-2' }) + '\n';
    const nextAsset = "export const identity = 'fixture-runtime-2';\n";
    await writeFile(join(demo, 'demo-runtime.json'), nextSelection);
    await writeFile(join(demo, 'public/demo-runtime/fixture.mjs'), nextAsset);
    await writeFile(join(demo, 'demo-runtime.sha256'),
      `${hash(nextSelection)}  demo-runtime.json\n${hash(nextAsset)}  public/demo-runtime/fixture.mjs\n`);
    const candidate = await observe('preview-demo', demo, { preview, demoFixture: 'fixture-runtime-2', requireWideCode: true,
      screenshot: join(repository, '.work/site/preview-mobile.png') });
    assert.notDeepEqual(candidate.runtime, second.runtime);
    const output = join(temporary, 'pages');
    const context = { mode: 'preview', repository: 'at-rama/sqlite-vector-wasm', mainCommit: 'a'.repeat(40), pullRequest: 57, preview };
    await assemble({ stableRoot, candidateRoot: repository, output, context });
    let server = await serveSite(output);
    try {
      results.push({ name: 'assembled-stable', ...await checkBrowser(server.url, { demoFixture: true }) });
      results.push({ name: 'assembled-preview', ...await checkBrowser(server.url + 'preview/', { preview, demoFixture: 'fixture-runtime-2' }) });
    } finally { await server.close(); }
    await assemble({ stableRoot: join(temporary, 'absent'), candidateRoot: repository, output, context });
    server = await serveSite(output);
    try {
      assert.equal((await fetch(server.url)).status, 404);
      results.push({ name: 'bootstrap-preview', ...await checkBrowser(server.url + 'preview/', { preview, demoFixture: 'fixture-runtime-2' }) });
    } finally { await server.close(); }
    await assemble({ stableRoot, output, context: { ...context, mode: 'stable', preview: null } });
    server = await serveSite(output);
    try {
      assert.equal((await fetch(server.url + 'preview/')).status, 404);
      results.push({ name: 'stable-only-removes-preview', ...await checkBrowser(server.url, { demoFixture: true }) });
    } finally { await server.close(); }

    await writeFile(join(demo, 'public/demo-runtime/fixture.mjs'), 'corrupt fixture');
    await assert.rejects(build({ prepared: demo }), /checksum mismatch/);
    await assert.rejects(readFile(join(repository, '.work/site/dist/index.html')), { code: 'ENOENT' });
    results.push({ name: 'corrupted-runtime', result: 'rejected; stale output removed' });

    await observe('shell-only', undefined, { screenshot: join(repository, '.work/site/mobile.png') });
    await writeFile(join(repository, '.work/site/exercise.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
