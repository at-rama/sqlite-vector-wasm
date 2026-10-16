import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpus, pinnedFile, sha } from '../demo-data.mjs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
function fixture(values = [1, -1, 0, 2, -2, 1, 0, -1, 3]) {
  const floats = Buffer.alloc(values.length * 4); values.forEach((v, i) => floats.writeFloatLE(v, i * 4));
  return Buffer.concat([Buffer.from(`1 ${values.length}\n😀 `), floats]);
}
const parse = (bytes = fixture(), labels = 'happy\t😀\nsmile\t😀\n') => parseCorpus(bytes, labels, { count: 1, dimensions: 9 });
test('preserves exact Float32 bytes, IDs, complete words and low-bit-first sign/padding', () => {
  const r = parse(); assert.deepEqual([...r.bits], [0x29, 1]);
  assert.equal(r.floats.readFloatLE(8), 0); assert.deepEqual(r.catalogue, [{ id: 0, emoji: '😀', label: 'happy', words: ['happy', 'smile'] }]);
  assert.deepEqual(parse(), r);
});
test('rejects malformed dimensions, truncated/nonfinite vectors and incomplete Unicode mappings', () => {
  assert.throws(() => parse(fixture().subarray(0, 12)), /Truncated/);
  assert.throws(() => parse(fixture([NaN])), /dimensions/);
  assert.throws(() => parse(fixture([NaN, 1, 1, 1, 1, 1, 1, 1, 1])), /Non-finite/);
  assert.throws(() => parse(fixture(), 'happy\t😀️\n'), /Missing descriptions/);
  assert.throws(() => parse(fixture(), 'happy\t😀\nother\t☀\n'), /coverage/);
  const two = Buffer.concat([Buffer.from('2 1\n😀 '), Buffer.alloc(4), Buffer.from('😀 '), Buffer.alloc(4)]);
  assert.throws(() => parseCorpus(two, 'happy\t😀\n', { count: 2, dimensions: 1 }), /Duplicate/);
});
test('pinned input never trusts a corrupt cache or response', async () => {
  const root = await mkdtemp(join(tmpdir(), 'demo-data-'));
  try {
    const path = join(root, 'source'); const get = async () => ({ ok: true, arrayBuffer: async () => Buffer.from('source') });
    await pinnedFile('https://example.test', sha('source'), path, get);
    await pinnedFile('https://example.test', sha('source'), path, () => { throw Error('No refresh'); });
    assert.equal((await readFile(path)).toString(), 'source');
    await assert.rejects(pinnedFile('url', '0'.repeat(64), path, get), /digest mismatch/);
    await assert.rejects(pinnedFile('url', '0'.repeat(64), join(root, 'other'), get), /digest mismatch/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
