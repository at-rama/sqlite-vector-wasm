import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export const documentationSources = ['README.md', 'docs/usage.md'];
export const documentHash = value => createHash('sha256').update(value).digest('hex');
export const sourceCommit = root => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
export async function documentationHashes(root) {
  return Object.fromEntries(await Promise.all(documentationSources.map(async path => [path, documentHash(await readFile(join(root, path)))])));
}
export function dirtyDocumentation(root) {
  const result = spawnSync('git', ['diff', '--quiet', 'HEAD', '--', ...documentationSources], { cwd: root });
  assert.ok([0, 1].includes(result.status), 'Cannot inspect documentation revision');
  return result.status !== 0;
}
export function renderPublicDocument(text, context, { presentation = false } = {}) {
  if (!context) return text;
  assert.ok(['candidate', 'published'].includes(context.mode), 'Invalid documentation mode');
  assert.match(context.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.ok(context.upstreams.sqliteVector && !context.upstreams.sqliteVec, 'Current documentation requires SQLite-Vector');
  const engine = 'SQLite-Vector';
  const engineVersion = context.upstreams.sqliteVector;
  assert.ok(context.upstreams.sqlite && engineVersion, 'Missing documentation composition');
  const label = context.mode === 'candidate' ? 'Unpublished release candidate' : 'Published distribution';
  const status = `> Reproducibility — ${label} **${context.version}** · SQLite ${context.upstreams.sqlite} · ${engine} ${engineVersion}. ${context.mode === 'candidate' ? 'Use the supplied qualified archive; no npm availability is asserted.' : 'To reproduce this example, use the exact publication below.'}\n\n`;
  assert.ok(text.indexOf('\n') > 0, 'Missing documentation title');
  let rendered = text;
  // Accept earlier source syntax without requiring a release literal in current
  // Markdown. Latest badges are informational and never supply this context.
  const sourceVersion = text.match(/npm install @at-rama\/sqlite-vector-wasm@([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)/)?.[1];
  if (sourceVersion) {
    rendered = rendered.replaceAll(`@at-rama/sqlite-vector-wasm@${sourceVersion}`, `@at-rama/sqlite-vector-wasm@${context.version}`)
      .replaceAll('`' + sourceVersion + '`', '`' + context.version + '`');
  }
  const installation = /npm install @at-rama\/sqlite-vector-wasm(?:@[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)?(?![A-Za-z0-9@/.-])/g;
  if (context.mode === 'candidate') rendered = rendered.replaceAll(installation, 'npm install ./payload.tgz');
  else {
    rendered = rendered.replaceAll(installation, 'npm install @at-rama/sqlite-vector-wasm')
      .replaceAll('npm install ./payload.tgz', 'npm install @at-rama/sqlite-vector-wasm');
  }
  // Keep Presentation product-first; Usage carries the checked example identity.
  // Candidate Presentation still identifies the unpublished archive it installs.
  if (!presentation || context.mode === 'candidate') {
    const recipe = !presentation && context.mode === 'published'
      ? `\`\`\`sh\nnpm install @at-rama/sqlite-vector-wasm@${context.version}\n\`\`\`\n\n` : '';
    const installationBlock = /(```sh\nnpm install (?:@at-rama\/sqlite-vector-wasm|\.\/payload\.tgz)\n```)/;
    assert.match(rendered, installationBlock, 'Missing documentation installation');
    rendered = rendered.replace(installationBlock, `$1\n\n${status}${recipe}`.trimEnd());
  }
  return rendered;
}
export async function documentationSelection(root) {
  return JSON.parse(await readFile(process.env.SITE_DOCUMENTATION_SELECTION ?? join(root, 'tools/site/docs-example.json'), 'utf8'));
}
export async function checkedDocumentation(root, { allowDirtyDocumentation = false } = {}) {
  let selection;
  try { selection = await documentationSelection(root); }
  catch (error) { if (error.code === 'ENOENT' && !process.env.SITE_DOCUMENTATION_SELECTION) return null; throw error; }
  // Existing published selections without a profile retain their original source rendering.
  if (!selection.mode) return null;
  const evidence = JSON.parse(await readFile(join(root, '.work/docs-example/result.json'), 'utf8'));
  assert.equal(evidence.context.commit, sourceCommit(root), 'Stale documentation example revision');
  const currentHashes = await documentationHashes(root);
  if (allowDirtyDocumentation) {
    assert.equal(evidence.context.sourceHashes['docs/usage.md'], currentHashes['docs/usage.md'], 'Stale qualified usage guide');
    assert.ok(dirtyDocumentation(root), 'Editorial exercise requires a dirty documentation checkout');
  } else {
    assert.deepEqual(evidence.context.sourceHashes, currentHashes, 'Stale documentation example sources');
  }
  assert.equal(evidence.replayOnly, false, 'Historical example replay cannot authorize current documentation');
  if (!allowDirtyDocumentation) {
    assert.equal(evidence.context.sourceDirty, dirtyDocumentation(root), 'Documentation source state changed');
    assert.ok(!evidence.context.sourceDirty, 'Uncommitted candidate documentation');
  } else {
    assert.equal(evidence.context.sourceDirty, false, 'Editorial exercise requires previously clean qualified evidence');
  }
  assert.ok(evidence.unchangedRuntime && evidence.browser && evidence.result && evidence.workerResult, 'Missing real documentation example evidence');
  assert.match(evidence.context.archive.sha256, /^[a-f0-9]{64}$/);
  assert.ok(Number.isSafeInteger(evidence.context.archive.size) && evidence.context.archive.size > 0, 'Invalid example archive');
  assert.equal(evidence.context.archive.sha256, evidence.selection.archiveSha256, 'Example archive identity mismatch');
  assert.equal(evidence.context.version, evidence.selection.version, 'Example version mismatch');
  if (evidence.context.mode === 'candidate') {
    assert.equal(evidence.context.qualifiedCommit, evidence.context.commit, 'Wrong qualified example head');
    assert.equal(evidence.context.sourceLockPath, selection.sourceLockPath, 'Wrong documentation source lock');
    assert.equal(selection.sourceLockPath, 'inputs/sqlite-vector.sources.lock.json');
    assert.equal(documentHash(await readFile(join(root, selection.sourceLockPath))), evidence.context.sourceLockSha256, 'Stale documentation lock');
  }
  else {
    assert.equal(evidence.context.publicationCommit, evidence.selection.commit, 'Wrong published example revision');
    for (const key of ['version', 'commit', 'archiveSha256']) {
      assert.equal(evidence.selection[key], selection[key], `Wrong selected publication ${key}`);
    }
  }
  assert.equal(evidence.result.sqliteVersion, evidence.context.upstreams.sqlite, 'Wrong observed SQLite version');
  assert.equal(evidence.result.engineVersion.replace(/^v/, ''), evidence.context.upstreams[evidence.context.engine], 'Wrong observed engine version');
  assert.deepEqual(evidence.workerResult, evidence.result, 'Different Worker example result');
  assert.deepEqual(evidence.result.neighbors.map(row => row[0]), [1, 2], 'Missing native example results');
  assert.equal(evidence.context.engine, selection.engine, 'Wrong documentation engine');
  assert.equal(evidence.context.mode, selection.mode, 'Wrong documentation mode');
  return evidence.context;
}
