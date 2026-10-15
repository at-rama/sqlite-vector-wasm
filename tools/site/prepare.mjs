import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, sep } from 'node:path';

export const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await files(join(directory, entry.name), path + '/'));
    else if (entry.isFile()) result.push(path);
    else throw Error(`Site input must be a regular file: ${path}`);
  }
  return result.sort();
}

// The selection JSON is opaque to the shell. This standard checksum sidecar
// checks transport integrity without defining the demo's release/acquisition schema.
export async function runtimeInventory(source) {
  const inventory = await files(source);
  const assets = inventory.filter(path => path.startsWith('public/demo-runtime/'));
  const selection = inventory.includes('demo-runtime.json');
  const manifest = inventory.includes('demo-runtime.sha256');
  if (!selection && !manifest && !assets.length) return null;
  if (!selection || !manifest || !assets.length) throw Error('Demo selection, checksum sidecar and runtime assets must be supplied together.');
  const value = JSON.parse(await readFile(join(source, 'demo-runtime.json'), 'utf8'));
  if (!value || Array.isArray(value) || typeof value !== 'object') throw Error('Demo selection must be a JSON object.');
  const expected = new Set(['demo-runtime.json', ...assets]);
  const result = {};
  const text = await readFile(join(source, 'demo-runtime.sha256'), 'utf8');
  for (const line of text.trimEnd().split('\n')) {
    const match = /^([a-f0-9]{64})  (demo-runtime\.json|public\/demo-runtime\/[A-Za-z0-9_./-]+)$/.exec(line);
    if (!match || !expected.delete(match[2])) throw Error('Invalid, duplicate or unexpected demo checksum entry.');
    const [ , hash, path] = match;
    if (digest(await readFile(join(source, path))) !== hash) throw Error(`Demo checksum mismatch: ${path}`);
    result[path] = hash;
  }
  if (expected.size) throw Error('Incomplete demo checksum inventory.');
  return result;
}

export async function prepare(root, prepared) {
  const work = join(root, '.work/site');
  const source = join(work, 'src');
  const output = join(work, 'dist');
  if (prepared && (resolve(prepared) === resolve(work) || resolve(prepared).startsWith(resolve(work) + sep))) {
    throw Error('Prepared input must be outside .work/site/.');
  }
  // No previous generated site can survive a failed preparation/build.
  for (const path of [source, output, join(work, 'build.json')]) await rm(path, { recursive: true, force: true });
  await files(join(root, 'site'));
  await cp(join(root, 'site'), source, { recursive: true });
  if (prepared) {
    await files(resolve(prepared));
    await cp(resolve(prepared), source, { recursive: true });
  }
  const runtime = await runtimeInventory(source);
  if (runtime) {
    await mkdir(join(source, 'public'), { recursive: true });
    await cp(join(source, 'demo-runtime.json'), join(source, 'public/demo-runtime.json'));
  }
  return { source, output, runtime };
}

export async function checkOutput({ source, output, runtime }) {
  for (const name of ['index.html', 'usage/index.html', 'demo/index.html']) await readFile(join(output, name));
  if (runtime) {
    for (const [path, hash] of Object.entries(runtime)) {
      if (digest(await readFile(join(output, path.replace(/^public\//, '')))) !== hash) {
        throw Error(`Emitted runtime differs from supplied selection: ${path}`);
      }
    }
  }
  const result = { source, output, runtime };
  await writeFile(join(output, '../build.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}
