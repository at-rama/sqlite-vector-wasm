import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { digest, files } from './prepare.mjs';
import { build } from './build.mjs';

// Only this adopted static document can replace a historical stable demo.
// Candidate Markdown cannot select or modify the published documentation root.
export async function mainPlaceholder(readAt, commit) {
  const markdown = await readAt(commit, 'site/demo/index.md', true);
  if (!/^# Demo\s+The demonstration is being refactored for SQLite-Vector\.\s+\[Read the usage documentation\]\(\.\.\/usage\/\)\.\s*$/.test(markdown ?? '')) return null;
  return { sourceCommit: commit, sha256: digest(markdown), markdown };
}

export async function buildStablePlaceholder({ root, placeholder }) {
  const clear = async () => {
    await rm(join(root, '.work/site/dist'), {recursive:true,force:true});
    await rm(join(root, '.work/site/build.json'), {force:true});
  };
  await clear();
  let prepared;
  try {
    assert.match(placeholder?.sourceCommit ?? '', /^[a-f0-9]{40}$/);
    assert.deepEqual(await mainPlaceholder(async () => placeholder.markdown, placeholder.sourceCommit), placeholder, 'Invalid static placeholder handoff');
    const parent = join(root, '.work'); await mkdir(parent, { recursive: true });
    prepared = await mkdtemp(join(parent, 'stable-placeholder-'));
    await mkdir(join(prepared, 'demo'));
    await writeFile(join(prepared, 'demo/index.md'), placeholder.markdown);
    // The current builder has no abandoned-demo preparation. Its root remains
    // the independently eligible published documentation checkout.
    const result = await build({ root, prepared, docs: true });
    assert.equal(result.runtime, null, 'Placeholder cannot carry a demo runtime');
    assert.ok(!(await files(result.output)).some(path => /(?:^|\/)demo-(?:runtime|data)(?:\/|\.)|\.wasm$/.test(path)), 'Placeholder build contains demo assets');
    result.placeholder = { sourceCommit: placeholder.sourceCommit, sha256: placeholder.sha256 };
    await writeFile(join(root, '.work/site/build.json'), JSON.stringify(result, null, 2) + '\n');
    return result;
  } catch (error) { await clear(); throw error; }
  finally { if (prepared) await rm(prepared, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [root, path] = process.argv.slice(2);
  try {
    assert.ok(root && path);
    const selection = JSON.parse(await readFile(path, 'utf8'));
    assert.equal(selection.stablePlaceholder?.sourceCommit, selection.mainCommit);
    console.log(JSON.stringify(await buildStablePlaceholder({ root: resolve(root), placeholder: selection.stablePlaceholder })));
  } catch (error) { console.error(error); process.exitCode = 1; }
}
