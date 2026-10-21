import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { digest } from './prepare.mjs';
import { build } from './build.mjs';
import { prepareDemo } from './demo-runtime.mjs';

const sourcePaths = ['site/demo/index.md', 'site/demo/EmojiDemo.vue', 'site/demo/demo-worker.mjs',
  'site/demo/discovery.mjs', 'tools/site/demo-runtime.json', 'tools/site/demo-data.json'];

// This overlay belongs to observed main, independently of the eligible
// documentation revision. A PR's proposed demo never replaces the stable root.
export async function mainDemo(readAt, commit) {
  const raw = await readAt(commit, 'tools/site/demo-runtime.json', true);
  if (raw === null) return null;
  const selection = JSON.parse(raw);
  assert.equal(selection.engine, 'sqliteVector', 'Current demo requires a native Vector selection');
  assert.match(selection.version, /^\d+\.\d+\.\d+$/);
  const sources = {};
  for (const path of sourcePaths) {
    const bytes = path === 'tools/site/demo-runtime.json' ? raw : await readAt(commit, path);
    assert.ok(typeof bytes === 'string' && bytes.length, `Missing current demo source: ${path}`);
    sources[path] = bytes;
  }
  assert.match(sources['site/demo/index.md'], /<EmojiDemo\s*\/>/);
  return { sourceCommit: commit, selection, dataSelection: JSON.parse(sources['tools/site/demo-data.json']),
    sourceHashes: Object.fromEntries(sourcePaths.map(path => [path, digest(sources[path])])) };
}

export async function buildStableDemo({ root, demo, readAt, get = fetch }) {
  await rm(join(root, '.work/site/dist'), { recursive:true, force:true });
  await rm(join(root, '.work/site/build.json'), { force:true });
  assert.match(demo?.sourceCommit ?? '', /^[a-f0-9]{40}$/);
  assert.deepEqual(await mainDemo(readAt, demo.sourceCommit), demo, 'Main demo source identity changed');
  const parent = join(root, '.work'); await mkdir(parent, { recursive: true });
  const prepared = await mkdtemp(join(parent, 'stable-demo-'));
  try {
    await prepareDemo(root, prepared, get, { selection: demo.selection, dataSelection: demo.dataSelection });
    for (const path of sourcePaths.filter(path => path.startsWith('site/'))) {
      const text = await readAt(demo.sourceCommit, path);
      assert.equal(digest(text), demo.sourceHashes[path]);
      const output = join(prepared, path.slice('site/'.length));
      await mkdir(join(output, '..'), { recursive: true }); await writeFile(output, text);
    }
    const result = await build({ root, prepared, docs: true });
    assert.ok(result.runtime, 'Qualified current demo must carry fixed runtime assets');
    result.demoSource = demo;
    await writeFile(join(root, '.work/site/build.json'), JSON.stringify(result, null, 2) + '\n');
    return result;
  } catch (error) {
    await rm(join(root, '.work/site/dist'), { recursive: true, force: true });
    await rm(join(root, '.work/site/build.json'), { force: true }); throw error;
  } finally { await rm(prepared, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [root, path] = process.argv.slice(2);
    const record = JSON.parse(await readFile(path, 'utf8'));
    assert.equal(record.stableDemo?.sourceCommit, record.mainCommit);
    const { sourceAt } = await import('./eligibility.mjs');
    const { httpReader } = await import('../release/state.mjs');
    const get = httpReader(process.env.GH_TOKEN);
    const readAt = (commit, path, optional = false) => sourceAt({ repository: record.repository, commit, path, optional, get, directory: resolve(root) });
    console.log(JSON.stringify(await buildStableDemo({ root: resolve(root), demo: record.stableDemo, readAt })));
  } catch (error) { console.error(error); process.exitCode = 1; }
}
