import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
export const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export async function download(url, get = fetch) {
  const response = await get(url, { signal: AbortSignal.timeout(60000) });
  assert.ok(response.ok, `Dependency unavailable: ${url} (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}
export async function pinnedFile(url, hash, path, get = fetch) {
  let bytes;
  try { bytes = await readFile(path); }
  catch (error) { if (error.code !== 'ENOENT') throw error; bytes = await download(url, get); }
  assert.equal(sha(bytes), hash, `Input digest mismatch: ${path}`);
  await writeFile(path, bytes);
  return bytes;
}
export function parseCorpus(bytes, descriptionText, { count, dimensions }) {
  let offset = bytes.indexOf(10);
  assert.ok(offset > 0, 'Missing word2vec header');
  assert.equal(bytes.subarray(0, offset).toString(), `${count} ${dimensions}`, 'Corpus dimensions/count mismatch');
  offset++;
  const descriptions = new Map();
  for (const line of descriptionText.trimEnd().split('\n')) {
    const parts = line.split('\t');
    assert.equal(parts.length, 2, 'Invalid description record');
    const [label, emoji] = parts;
    assert.ok(label && emoji, 'Empty description');
    if (!descriptions.has(emoji)) descriptions.set(emoji, []);
    if (!descriptions.get(emoji).includes(label)) descriptions.get(emoji).push(label);
  }
  const catalogue = [], seen = new Set();
  const floats = Buffer.alloc(count * dimensions * 4), bits = Buffer.alloc(count * Math.ceil(dimensions / 8));
  for (let id = 0; id < count; id++) {
    while (bytes[offset] === 10 || bytes[offset] === 32) offset++;
    const end = bytes.indexOf(32, offset);
    assert.ok(end > offset, 'Missing vector key');
    const emoji = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(offset, end));
    assert.ok(!seen.has(emoji), 'Duplicate vector identity'); seen.add(emoji);
    const words = descriptions.get(emoji);
    assert.ok(words?.length, `Missing descriptions: ${emoji}`);
    catalogue.push({ id, emoji, label: words[0], words });
    offset = end + 1;
    assert.ok(offset + dimensions * 4 <= bytes.length, 'Truncated vector');
    for (let component = 0; component < dimensions; component++) {
      const value = bytes.readFloatLE(offset + component * 4);
      assert.ok(Number.isFinite(value), 'Non-finite vector component');
      if (value > 0) bits[id * Math.ceil(dimensions / 8) + (component >> 3)] |= 1 << (component % 8);
    }
    bytes.copy(floats, id * dimensions * 4, offset, offset + dimensions * 4);
    offset += dimensions * 4;
  }
  assert.equal(bytes.subarray(offset).toString().trim(), '', 'Trailing vector data');
  assert.equal(descriptions.size, count, 'Description coverage mismatch');
  for (const emoji of descriptions.keys()) assert.ok(seen.has(emoji), `Unmatched description identity: ${emoji}`);
  return { catalogue, floats, bits };
}
export async function prepareData(root, destination, get = fetch, selected) {
  const selection = selected ?? JSON.parse(await readFile(join(root, 'tools/site/demo-data.json'), 'utf8'));
  const inputs = join(root, '.work/demo-input');
  await mkdir(inputs, { recursive: true }); await mkdir(destination, { recursive: true });
  const source = {};
  for (const [name, file] of Object.entries(selection.files)) {
    source[name] = await pinnedFile(`https://raw.githubusercontent.com/${selection.repository}/${selection.revision}/${file.path}`, file.sha256, join(inputs, name), get);
  }
  const result = parseCorpus(source['emoji2vec.bin'], source['emoji_joined.txt'].toString(), selection);
  const outputs = { 'catalogue.json': Buffer.from(JSON.stringify(result.catalogue) + '\n'),
    'binary.bin': result.bits, 'float32.bin': result.floats, 'LICENSE.txt': source.LICENSE };
  const manifest = { ...selection, binaryDimensions: 304, files: Object.fromEntries(Object.entries(outputs).map(([name, bytes]) => [name, { sha256: sha(bytes), size: bytes.length }])),
    credit: 'emoji2vec — UCL Machine Reading; descriptions from Unicode and iemoji.com',
    sourceFiles: selection.files, conversion: 'Original little-endian Float32; binary x > 0, low bit first, four zero padding bits.' };
  for (const [name, bytes] of Object.entries(outputs)) await writeFile(join(destination, name), bytes);
  await writeFile(join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
