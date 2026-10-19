import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateExample, downloadExample } from '../example.mjs';
import { runtimeNames } from '../../build/config.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('explicit example version, publication and payload must agree; other releases have no effect', async () => {
  const bytes = Buffer.from('synthetic archive used only by policy tests');
  const selection = { version: '0.2.0', commit: 'a'.repeat(40), archiveSha256: hash(bytes) };
  const guide = 'published version **0.2.0**\nnpm install @at-rama/sqlite-vector-wasm@0.2.0';
  const publication = { version: '0.2.0', tag: 'dist/v0.2.0', channel: 'latest', commit: selection.commit,
    archive: { sha256: hash(bytes), size: bytes.length }, runtimeFiles: runtimeNames.map(name => ({ name })) };
  validateExample(selection, guide, publication, bytes);
  validateExample(selection, guide, { ...publication, unrelatedNewerRelease: '9.0.0' }, bytes);
  for (const mutate of [p => p.version = '0.3.0', p => p.archive.sha256 = '0'.repeat(64), p => p.runtimeFiles.pop(), p => p.commit = 'b'.repeat(40)]) {
    const changed = structuredClone(publication); mutate(changed);
    assert.throws(() => validateExample(selection, guide, changed, bytes));
  }
  assert.throws(() => validateExample(selection, guide.replaceAll('0.2.0', '0.3.0'), publication, bytes));
  assert.throws(() => validateExample(selection, guide, publication, Buffer.from('corrupt')));
  await assert.rejects(downloadExample(selection, async () => ({ ok: false, status: 404 })), /unavailable/);
  await assert.rejects(downloadExample(selection, async () => ({ ok: true, arrayBuffer: async () => Buffer.from('{}') })), /Publication digest/);
});

test('tracked example dependency is explicit and isolated from demo state', async () => {
  const selection = JSON.parse(await readFile(new URL('../docs-example.json', import.meta.url)));
  assert.deepEqual(selection, {mode:'candidate',engine:'sqliteVector',sourceLockPath:'inputs/sqlite-vector.sources.lock.json'});
});
