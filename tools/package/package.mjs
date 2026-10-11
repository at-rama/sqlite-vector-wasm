import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { open, readFile, writeFile, mkdir, mkdtemp, readdir, rename, appendFile } from 'node:fs/promises';
import { join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runtimeNames } from '../build/config.mjs';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const hash = data => createHash('sha256').update(data).digest('hex');
const digestPattern = /^[0-9a-f]{64}$/;
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const require = (value, message) => { if (!value) throw Error(message); };

export async function regularBytes(path) {
  const fd = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const info = await fd.stat();
    require(info.isFile() && info.size > 0, `Missing/nonregular/empty file: ${path}`);
    return await fd.readFile();
  } finally { await fd.close(); }
}

export function identity(name, version) {
  require(typeof name === 'string' && name.length <= 214
    && /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)
    && !['node_modules', 'favicon.ico'].includes(name), 'Invalid explicit package name');
  const n = '(?:0|[1-9][0-9]*)';
  const id = '(?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)';
  require(typeof version === 'string' && new RegExp(`^${n}\\.${n}\\.${n}(?:-${id}(?:\\.${id})*)?(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$`).test(version), 'Invalid explicit project version');
  return { name, version };
}

export async function validateBuild(handoff, repository = root) {
  require(handoff && handoff.schemaVersion === 1 && handoff.inputs && handoff.build
    && isAbsolute(handoff.runtimeDirectory || '') && Array.isArray(handoff.runtimeFiles), 'Incomplete/unsupported build handoff');
  const lockBytes = await regularBytes(join(repository, 'inputs/sources.lock.json'));
  const lock = JSON.parse(lockBytes);
  assert.deepEqual(handoff.inputs.lockDigest, { algorithm: 'sha256', value: hash(lockBytes) }, 'Source lock identity mismatch');
  for (const key of ['sqlite', 'sqliteVec']) {
    require(handoff.inputs[key]?.version === lock[key].version, `Wrong ${key} version`);
    assert.deepEqual(handoff.inputs[key]?.digest, lock[key].digest, `Wrong ${key} archive digest`);
  }
  for (const [field, path] of [
    ['harnessSha256', 'tools/harness.sh'], ['configSha256', 'tools/build/config.mjs'],
    ['templateSha256', 'tools/build/extra-init.c.in'], ['dependencyLockSha256', 'tools/harness/package-lock.json'],
  ]) require(handoff.build[field] === hash(await regularBytes(join(repository, path))), `Stale build configuration: ${field}`);
  require(typeof handoff.build.tools?.emcc === 'string' && handoff.build.tools.emcc.includes('4.0.23')
    && typeof handoff.build.platform === 'string' && Array.isArray(handoff.build.configure)
    && Array.isArray(handoff.build.wasm) && Array.isArray(handoff.build.amalgamation)
    && ['cc','make','emcc','wasm-strip','wasm-opt','node','npm'].every(key => typeof handoff.build.tools[key] === 'string' && handoff.build.tools[key].length > 0), 'Incomplete/unsupported build provenance');
  const names = handoff.runtimeFiles.map(file => file.name);
  assert.deepEqual([...names].sort(), [...runtimeNames].sort(), 'Unsupported/duplicate runtime inventory');
  const actual = (await readdir(handoff.runtimeDirectory)).filter(name => /\.(?:js|mjs|wasm)$/.test(name));
  assert.deepEqual(actual.sort(), [...runtimeNames].sort(), 'Unexpected runtime assets');
  const bytes = new Map();
  for (const file of handoff.runtimeFiles) {
    require(Number.isSafeInteger(file.size) && file.size > 0 && digestPattern.test(file.sha256), 'Invalid runtime identity');
    const data = await regularBytes(join(handoff.runtimeDirectory, file.name));
    require(data.length === file.size && hash(data) === file.sha256, `Runtime size/hash mismatch: ${file.name}`);
    bytes.set(file.name, data);
  }
  return bytes;
}

export async function noticeInputs(handoff, repository = root) {
  const records = JSON.parse(await regularBytes(join(repository, 'tools/package/notices.json')));
  require(records.schemaVersion === 1 && Array.isArray(records.notices), 'Unsupported notice manifest');
  const required = ['SQLite-LICENSE.txt', 'SQLite-WASM-NOTICE.txt', 'sqlite-vec-MIT.txt', 'sqlite-vec-APACHE.txt',
    'Emscripten-LICENSE.txt', 'musl-COPYRIGHT.txt', 'compiler-rt-LICENSE.txt',
    'llvm-libc-LICENSE.txt', 'libcxx-LICENSE.txt', 'libcxxabi-LICENSE.txt'];
  assert.deepEqual(records.notices.map(n => n.name).sort(), required.sort(), 'Missing/duplicate/extra notice association');
  const versions = { sqlite: handoff.inputs.sqlite.version, sqliteVec: handoff.inputs.sqliteVec.version, emscripten: '4.0.23' };
  const bytes = new Map();
  for (const notice of records.notices) {
    const project = notice.name.startsWith('SQLite-') ? 'sqlite' : notice.name.startsWith('sqlite-vec-') ? 'sqliteVec' : 'emscripten';
    require(notice.project === project && notice.version === versions[project] && typeof notice.origin === 'string'
      && notice.origin.length > 0 && digestPattern.test(notice.sha256), `Wrong notice association: ${notice.name}`);
    const data = await regularBytes(join(repository, 'tools/package/notices', notice.name));
    require(hash(data) === notice.sha256, `Notice digest mismatch: ${notice.name}`);
    bytes.set(`licenses/${notice.name}`, data);
  }
  bytes.set('licenses/origins.json', jsonBytes(records));
  bytes.set('LICENSE', await regularBytes(join(repository, 'LICENSE')));
  bytes.set('NOTICE', await regularBytes(join(repository, 'tools/package/NOTICE.txt')));
  return bytes;
}

export function manifest(handoff) {
  const inputs = Object.fromEntries(['sqlite', 'sqliteVec'].map(key => [key,
    { version: handoff.inputs[key].version, digest: handoff.inputs[key].digest }]));
  const build = { ...handoff.build, wasm: handoff.build.wasm.map(arg =>
    arg.startsWith('sqlite3_wasm_extra_init.c=') ? 'sqlite3_wasm_extra_init.c=<temporary generated bridge>' : arg) };
  return { schemaVersion: 1, inputs, lockDigest: handoff.inputs.lockDigest,
    build, runtimeFiles: handoff.runtimeFiles };
}

export function packageMetadata(name, version, files) {
  return { ...identity(name, version), description: 'SQLite browser/WASM with sqlite-vec statically integrated',
    license: 'Apache-2.0',
    exports: Object.fromEntries([...runtimeNames, 'package.json', 'runtime.json'].map(name => [`./${name}`, `./${name}`])),
    files, repository: { type: 'git', url: 'https://github.com/at-rama/sqlite-vector-wasm.git' } };
}

export function execute(command, args, { cwd, input, logPath, env = process.env } = {}) {
  return new Promise((accept, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '', diagnostic = '';
    child.stdout.on('data', bytes => { output += bytes; });
    child.stderr.on('data', bytes => { diagnostic += bytes; });
    child.once('error', reject);
    child.once('close', async (code, signal) => {
      try {
        if (logPath) await appendFile(logPath, JSON.stringify({ command, args, cwd, code, signal }) + '\n' + diagnostic + '\n');
        code === 0 ? accept(output.trim()) : reject(Error(`${command} failed (${signal || code}): ${diagnostic}`));
      } catch (error) { reject(error); }
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export async function inspectArchive(archive, files, destination, run = execute, logPath) {
  return JSON.parse(await run('python3', [join(root, 'tools/package/archive.py')],
    { input: JSON.stringify({ archive, files, destination }), logPath }));
}

export async function fileInventory(directory, names) {
  const result = [];
  for (const name of names) {
    const bytes = await regularBytes(join(directory, name));
    result.push({ name, size: bytes.length, sha256: hash(bytes) });
  }
  return result;
}

export async function assemble({ handoff, name, version, repository = root, run = execute, writeBytes = writeFile,
  save = async (path, value) => { await writeFile(`${path}.tmp`, jsonBytes(value), { flag: 'wx' }); await rename(`${path}.tmp`, path); } }) {
  identity(name, version);
  const parent = join(repository, '.work/package'); await mkdir(parent, { recursive: true });
  const workspace = await mkdtemp(join(parent, 'run-'));
  const logPath = join(workspace, 'package.log'); await writeFile(logPath, '');
  try {
    const runtime = await validateBuild(handoff, repository);
    const contents = await noticeInputs(handoff, repository);
    for (const entry of runtime) contents.set(...entry);
    contents.set('README.md', await regularBytes(join(repository, 'README.md')));
    contents.set('docs/usage.md', await regularBytes(join(repository, 'docs/usage.md')));
    contents.set('runtime.json', jsonBytes(manifest(handoff)));
    const names = [...contents.keys(), 'package.json'].sort();
    contents.set('package.json', jsonBytes(packageMetadata(name, version, names)));
    const directory = join(workspace, 'assembly'); await mkdir(directory);
    for (const [file, data] of contents) {
      await mkdir(resolve(directory, file, '..'), { recursive: true });
      await writeBytes(join(directory, file), data, { flag: 'wx' });
      require(hash(await regularBytes(join(directory, file))) === hash(data), `Copied file changed: ${file}`);
    }
    const files = await fileInventory(directory, names);
    const packs = JSON.parse(await run('npm', ['pack', '--ignore-scripts', '--json', '--workspaces=false', '--pack-destination', workspace],
      { cwd: directory, logPath, env: { ...process.env, npm_config_ignore_scripts: 'true' } }));
    require(Array.isArray(packs) && packs.length === 1 && typeof packs[0].filename === 'string'
      && /^[A-Za-z0-9._+-]+\.tgz$/.test(packs[0].filename), 'Invalid npm pack result');
    const archivePath = join(workspace, packs[0].filename);
    const archiveBytes = await regularBytes(archivePath);
    const extracted = await inspectArchive(archivePath, files, join(workspace, 'extracted'), run, logPath);
    require(hash(await regularBytes(archivePath)) === hash(archiveBytes), 'Archive changed during inspection');
    const result = { schemaVersion: 1, workspace, package: { name, version }, inputs: manifest(handoff).inputs,
      lockDigest: handoff.inputs.lockDigest, build: handoff.build,
      buildHandoffSha256: hash(jsonBytes(handoff)),
      runtimeDirectory: extracted.directory, runtimeFiles: handoff.runtimeFiles, files,
      archive: { path: archivePath, size: archiveBytes.length, sha256: hash(archiveBytes) }, logPath };
    await save(join(workspace, 'handoff.json'), result);
    return result;
  } catch (error) {
    await appendFile(logPath, `Packaging failed: ${error.message}\n`);
    error.message += `; retained workspace: ${workspace}`;
    throw error;
  }
}

export function argumentsFor(argv) {
  const result = {};
  require(argv.length === 6, 'Usage: package.sh --build-handoff PATH --name NAME --version VERSION');
  const keys = { '--build-handoff': 'path', '--name': 'name', '--version': 'version' };
  for (let i = 0; i < argv.length; i += 2) {
    const key = keys[argv[i]];
    require(key && !(key in result) && argv[i + 1], 'Invalid/duplicate packaging arguments');
    result[key] = argv[i + 1];
  }
  require(Object.keys(result).length === 3, 'Missing explicit packaging arguments');
  return result;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    require(process.version === 'v24.19.0', 'Use tools/package.sh with the qualified SDK');
    const options = argumentsFor(process.argv.slice(2));
    const handoff = JSON.parse(await regularBytes(resolve(options.path)));
    console.log(JSON.stringify(await assemble({ handoff, name: options.name, version: options.version })));
  } catch (error) { console.error(`Package: ${error.message}`); process.exitCode = 1; }
}
