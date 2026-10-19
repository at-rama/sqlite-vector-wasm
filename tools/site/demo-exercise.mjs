import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { build, repository } from './build.mjs';
import { serveSite } from './server.mjs';
import { checkDemo } from './demo-check.mjs';
import { example } from './example.mjs';

export async function exerciseDemo() {
  await rm(join(repository, '.work/site/demo-results.json'), { force: true });
  const results = [], preview = { branch: 'demo-exercise', commit: '1234567890abcdef1234567890abcdef12345678' };
  let originalRuntime;
  for (const selectedPreview of [undefined, preview]) {
    const built = await build({ preview: selectedPreview });
    if (!selectedPreview) originalRuntime = built.runtime;
    else assert.deepEqual(built.runtime, originalRuntime);
    const server = await serveSite(built.output, built.base);
    try { results.push(await checkDemo(server.url, { root: repository, expectedPreview: selectedPreview,
      screenshot: join(repository, `.work/site/demo-${selectedPreview ? 'preview' : 'stable'}-mobile.png`), failurePaths: !selectedPreview })); }
    finally { await server.close(); }
  }
  const readme = join(repository, 'README.md'), original = await readFile(readme, 'utf8');
  try {
    await writeFile(readme, original + '\nDemo runtime preservation check.\n');
    if (process.env.SITE_CANDIDATE_BUNDLE) await example(repository);
    // The same explicit pin must survive an actual documentation-only rebuild.
    const rebuilt = await build({ allowDirtyDocumentation: true });
    assert.deepEqual(rebuilt.runtime, originalRuntime);
    results.push({ documentationUpdate: 'real runtime inventory unchanged', runtime: rebuilt.runtime });
  } finally {
    await writeFile(readme, original);
    if (process.env.SITE_CANDIDATE_BUNDLE) await example(repository);
    await build();
  }
  await writeFile(join(repository, '.work/site/demo-results.json'), JSON.stringify(results, null, 2) + '\n');
  return results;
}
