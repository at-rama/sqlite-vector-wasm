import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { open, readFile, writeFile, mkdir, mkdtemp, readdir, rename, appendFile, realpath } from 'node:fs/promises';
import { join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { selectedEngine, verifyAcquisition } from '../build/build.mjs';
import { runtimeNames, configureOptions, hostOptions, targets, wasmOptions } from '../build/config.mjs';

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

export function engineIdentity(handoff) {
  const key = 'sqliteVector';
  require(handoff.inputs?.[key] && !handoff.inputs.sqliteVec, 'Ambiguous engine');
  const engine = { key, upstream: 'sqliteai/sqlite-vector', version: handoff.inputs[key].version };
  if (handoff.engine) assert.deepEqual(handoff.engine, engine, 'Contradictory engine');
  return engine;
}

async function validateSelection(handoff, repository, checkGeneratedInputs) {
  const engine = engineIdentity(handoff), annotated = handoff.sourceLockPath !== undefined || handoff.engine !== undefined;
  require(annotated && handoff.engine && handoff.sourceLockPath, 'Vector requires complete annotated provenance');
  const path = handoff.sourceLockPath;
  require(path === 'inputs/sqlite-vector.sources.lock.json', 'Unsupported recorded lock');
  const lockBytes = await regularBytes(join(repository, path)), pins = JSON.parse(lockBytes);
  require(selectedEngine(pins) === engine.key, 'Wrong selected lock');
  assert.deepEqual(handoff.inputs.lockDigest, {algorithm:'sha256',value:hash(lockBytes)}, 'Source lock identity mismatch');
  for (const key of ['sqlite', engine.key]) {
    require(handoff.inputs[key].version === pins[key].version, `Wrong ${key} version`);
    assert.deepEqual(handoff.inputs[key].digest, pins[key].digest, `Wrong ${key} archive digest`);
  }
  {
    require(handoff.engine && handoff.sourceLockPath, 'Incomplete annotated selection');
    verifyAcquisition(handoff.inputs, lockBytes);
    require(handoff.build.tools?.node === 'v24.19.0' && handoff.build.tools?.npm === '11.17.0'
      && handoff.build.tools?.['wasm-strip'] === '1.0.42' && /^wasm-opt version 125(?: |$)/.test(handoff.build.tools?.['wasm-opt']), 'Wrong qualified tools');
    assert.deepEqual(handoff.build.configure, ['env', ...hostOptions, './configure', ...configureOptions], 'Wrong configure command');
    assert.deepEqual(handoff.build.amalgamation, ['make','sqlite3.c']);
    assert.deepEqual(handoff.build.commonWasmOptions, [...targets,...wasmOptions]);
    const bridgeArg = handoff.build.wasm[1 + targets.length + wasmOptions.length];
    require(bridgeArg?.startsWith('sqlite3_wasm_extra_init.c=/'), 'Missing generated bridge');
    const bridge = bridgeArg.slice('sqlite3_wasm_extra_init.c='.length);
    const template = await regularBytes(join(repository, 'tools/build', 'vector-extra-init.c.in'));
    const expected = template.toString().replace('@SQLITE_VECTOR_HEADER@',
      JSON.stringify(join(handoff.inputs[engine.key].sourcePath, 'src/sqlite-vector.h')));
    if (checkGeneratedInputs) require((await regularBytes(bridge)).toString() === expected, 'Wrong generated bridge');
    const expectedWasm = ['make',...targets,...wasmOptions,bridgeArg];
    {
      const commands = handoff.build.extensionCommands;
      require(Array.isArray(commands) && commands.length === 7, 'Incomplete extension commands');
      const names = ['sqlite-vector',...['cpu','avx2','avx512','neon','rvv','sse2'].map(n=>'distance-'+n)];
      const directory = resolve(bridge,'..');
      const objects = names.map(n=>join(directory,n+'.o'));
      for (const [i,name] of names.entries()) assert.deepEqual(commands[i], ['emcc','-Oz','-std=c99','-fPIC','-DSQLITE_CORE','-DSQLITE_WASM_EXTRA_INIT','-include','strings.h',
        '-I'+handoff.inputs.sqlite.sourcePath,'-I'+join(handoff.inputs.sqliteVector.sourcePath,'src'),'-I'+join(handoff.inputs.sqliteVector.sourcePath,'libs'),
        '-c',join(handoff.inputs.sqliteVector.sourcePath,'src',name+'.c'),'-o',objects[i]], 'Wrong extension command');
      const include = join(directory,'vector-inputs.mk');
      const includeBytes = Buffer.from('# Separate immutable extension inputs; upstream recipes remain intact.\nMAKEFILE := GNUmakefile\nsqlite3-wasm.c.in += '+objects.join(' ')+'\n');
      if (checkGeneratedInputs) assert.deepEqual(await regularBytes(include), includeBytes, 'Wrong object input list');
      assert.deepEqual(handoff.build.integration, {bridgeSha256:hash(Buffer.from(expected)),makeIncludeSha256:hash(includeBytes)}, 'Wrong integration hashes');
      expectedWasm.push('-f','GNUmakefile','-f',include);
    }
    assert.deepEqual(handoff.build.wasm, expectedWasm, 'Wrong WASM command');
  }
  return engine;
}

// First consumption must still inspect the actual generated integration files.
export async function validateBuild(handoff, repository = root) {
  return validateRuntime(handoff, repository, true);
}

// Already-consumed payloads retain provenance/recipe/runtime checks after cleanup.
// The caller must bind this raw handoff to the package's buildHandoffSha256.
export async function validatePackagedBuild(handoff, repository = root) {
  return validateRuntime(handoff, repository, false);
}

async function validateRuntime(handoff, repository, checkGeneratedInputs) {
  require(handoff && handoff.schemaVersion === 1 && handoff.inputs && handoff.build
    && isAbsolute(handoff.runtimeDirectory || '') && Array.isArray(handoff.runtimeFiles), 'Incomplete/unsupported build handoff');
  const engine = await validateSelection(handoff, repository, checkGeneratedInputs);
  for (const [field, path] of [
    ['harnessSha256', 'tools/harness.sh'], ['configSha256', 'tools/build/config.mjs'],
    ['templateSha256', 'tools/build/vector-extra-init.c.in'], ['dependencyLockSha256', 'tools/harness/package-lock.json'],
  ]) require(handoff.build[field] === hash(await regularBytes(join(repository, path))), `Stale build configuration: ${field}`);
  require(typeof handoff.build.tools?.emcc === 'string' && /(?:^|[^0-9])4\.0\.23(?:[^0-9]|$)/.test(handoff.build.tools.emcc)
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
  const required = ['SQLite-LICENSE.txt', 'SQLite-WASM-NOTICE.txt',
    'Emscripten-LICENSE.txt', 'musl-COPYRIGHT.txt', 'compiler-rt-LICENSE.txt',
    'llvm-libc-LICENSE.txt', 'libcxx-LICENSE.txt', 'libcxxabi-LICENSE.txt'];
  const allRequired = [...required, 'sqlite-vector-APACHE.txt', 'FP16-MIT.txt'];
  assert.deepEqual(records.notices.map(n => n.name).sort(), allRequired.sort(), 'Missing/duplicate/extra notice association');
  const noticeProject = name => name.startsWith('SQLite-') ? 'sqlite' : name === 'sqlite-vector-APACHE.txt' ? 'sqliteVector' : name === 'FP16-MIT.txt' ? 'fp16' : 'emscripten';
  for (const notice of records.notices) require(notice.project === noticeProject(notice.name), `Wrong notice association: ${notice.name}`);
  const engine = engineIdentity(handoff);
  const selected = records.notices;
  const versions = { sqlite: handoff.inputs.sqlite.version, sqliteVector: handoff.inputs.sqliteVector?.version, fp16: '98b0a46bce017382a6351a19577ec43a715b6835', emscripten: '4.0.23' };
  const bytes = new Map();
  for (const notice of selected) {
    const project = noticeProject(notice.name);
    require(notice.project === project && notice.version === versions[project] && typeof notice.origin === 'string'
      && notice.origin.length > 0 && digestPattern.test(notice.sha256), `Wrong notice association: ${notice.name}`);
    if (['sqliteVector','fp16'].includes(project)) {
      require(notice.source?.commit === (project === 'fp16' ? versions.fp16 : handoff.inputs.sqliteVector.commit) && notice.source?.sha256 === notice.sha256
        && notice.origin === `https://github.com/${project === 'fp16' ? 'Maratyszcza/FP16' : 'sqliteai/sqlite-vector'}/blob/${notice.source.commit}/${project === 'fp16' ? 'LICENSE' : 'LICENSE.md'}`, 'Unestablished dependency provenance');
      if (project === 'fp16') assert.deepEqual(notice.incorporatedHeaders, { 'fp16.h':'95fa0c2de8c0bbc76a0927304f20160737cb9f7b', 'bitcasts.h':'1de8d24297a0455f638f8ea552c236c4921d9f55', 'macros.h':'4018b0c9d0f87a29a7f2f4e7e40a29eb17103898' });
    }
    const data = await regularBytes(join(repository, 'tools/package/notices', notice.name));
    require(hash(data) === notice.sha256, `Notice digest mismatch: ${notice.name}`);
    bytes.set(`licenses/${notice.name}`, data);
  }
  bytes.set('licenses/origins.json', jsonBytes({schemaVersion:1,notices:selected}));
  bytes.set('LICENSE', await regularBytes(join(repository, 'LICENSE')));
  bytes.set('NOTICE', await regularBytes(join(repository, 'tools/package/NOTICE-vector.txt')));
  return bytes;
}

export function manifest(handoff) {
  const engine = engineIdentity(handoff);
  const inputs = Object.fromEntries(['sqlite', engine.key].map(key => [key,
    { version: handoff.inputs[key].version, digest: handoff.inputs[key].digest }]));
  const paths = ['sqlite',engine.key].filter(k=>handoff.inputs[k].sourcePath).map(k=>[handoff.inputs[k].sourcePath, '<'+k+'-source>']);
  const bridgeArg = handoff.build.wasm.find(a=>a.startsWith('sqlite3_wasm_extra_init.c='));
  if (bridgeArg) paths.push([resolve(bridgeArg.slice('sqlite3_wasm_extra_init.c='.length),'..'),'<build>']);
  paths.sort((a,b)=>b[0].length-a[0].length);
  const portable = value => Array.isArray(value) ? value.map(portable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,portable(v)])) : typeof value === 'string' ? paths.reduce((v,[from,to])=>v.replaceAll(from,to),value) : value;
  const sourceOrigins = Object.fromEntries(['sqlite',engine.key].map(key=>[key,Object.fromEntries(Object.entries(handoff.inputs[key]).filter(([k])=>!['sourcePath','archivePath'].includes(k)))]));
  return { schemaVersion:1, inputs, engine, sourceLockPath:handoff.sourceLockPath, sourceOrigins,
    lockDigest:handoff.inputs.lockDigest, build:portable(handoff.build), runtimeFiles:handoff.runtimeFiles };
}

export const documentMapping = engine => [
  ['docs/sqlite-vector/README.md', 'README.md'],
  ['docs/sqlite-vector/usage.md', 'docs/usage.md'],
  ['docs/common/browser.md','docs/browser.md'],
];

export function renderDocument(source, handoff, suppliedIdentity) {
  engineIdentity(handoff);
  const { name, version } = identity(suppliedIdentity?.name, suppliedIdentity?.version);
  const sqlite = handoff.inputs.sqlite.version, vector = handoff.inputs.sqliteVector.version;
  require([sqlite, vector].every(v => typeof v === 'string' && /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(v)), 'Invalid document composition');
  const text = source.toString();
  require(!/0\.0\.0-vector|has no published npm release/.test(text), 'Stale fixture-only document');
  const position = text.indexOf('\n');
  require(position > 0, 'Missing document title');
  const status = name === '@at-rama/sqlite-vector-wasm' ? 'Prepared archive' : 'Unpublished local package';
  const header = `\n\n${status}: \`${name}@${version}\`. SQLite **${sqlite}** with SQLite-Vector **${vector}**. Assembly identifies these enclosed bytes; registry availability is established separately by the matching publication record.`;
  return Buffer.from(text.slice(0, position) + header + text.slice(position));
}

export async function preparedDocuments(handoff, repository = root, suppliedIdentity) {
  const result = new Map(), records = [];
  for (const [source,destination] of documentMapping(engineIdentity(handoff))) {
    require(!result.has(destination), 'Duplicate document destination');
    const path = join(repository,source);
    require(await realpath(path) === resolve(path), 'Unsafe document source');
    const sourceBytes = await regularBytes(path);
    const rendered = source.startsWith('docs/sqlite-vector/') ? renderDocument(sourceBytes, handoff, suppliedIdentity) : sourceBytes;
    result.set(destination, rendered);
    records.push({ source, destination, sourceSha256: hash(sourceBytes), sha256: hash(rendered),
      ...(source.startsWith('docs/sqlite-vector/') ? { identity: identity(suppliedIdentity.name, suppliedIdentity.version),
        upstreams: { sqlite: handoff.inputs.sqlite.version, sqliteVector: handoff.inputs.sqliteVector.version } } : {}),
    });
  }
  const engine = engineIdentity(handoff);
  const title = 'SQLite-Vector';
  require(result.get('README.md').toString().startsWith('# SQLite WASM with '+title+'\n')
    && result.get('docs/usage.md').toString().startsWith('# Using '+title+'\n'), 'Wrong-engine documents');
  for (const [source,destination] of documentMapping(engine)) {
    const text = result.get(destination).toString();
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const link = match[1];
      const ownPrefix = 'https://github.com/at-rama/sqlite-vector-wasm/blob/main/';
      if (/^https?:\/\//.test(link) && !link.startsWith(ownPrefix)) continue;
      const [target,anchor] = link.split('#');
      const local = target.startsWith(ownPrefix) ? target.slice(ownPrefix.length) : null;
      for (const location of local !== null ? [join(repository,local)] : [resolve(repository,source,'..',target)]) {
        require(location.startsWith(resolve(repository)+'/'), 'Unsafe document link');
        const linked = await regularBytes(location);
        if (anchor) require(linked.toString().split('\n').filter(l=>/^#+ /.test(l)).some(l=>l.replace(/^#+ /,'').toLowerCase().replace(/[^a-z0-9 -]/g,'').replaceAll(' ','-')===anchor), 'Broken document anchor');
      }
      if (local === null) {
        const path = resolve('/',destination,'..',target).slice(1);
        require(result.has(path), 'Broken extracted document link');
      }
    }
  }
  return { documents: result, records };
}

export async function documentInputs(handoff, repository = root, suppliedIdentity) {
  return (await preparedDocuments(handoff, repository, suppliedIdentity)).documents;
}

export function packageMetadata(name, version, files, engine = {key:'sqliteVector'}) {
  return { ...identity(name, version), description: `SQLite browser/WASM with ${'SQLite-Vector'} statically integrated`,
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
    const { documents, records: documentRecords } = await preparedDocuments(handoff, repository, { name, version });
    for (const entry of documents) contents.set(...entry);
    contents.set('runtime.json', jsonBytes(manifest(handoff)));
    const names = [...contents.keys(), 'package.json'].sort();
    contents.set('package.json', jsonBytes(packageMetadata(name, version, names, engineIdentity(handoff))));
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
      lockDigest: handoff.inputs.lockDigest, engine:engineIdentity(handoff), sourceLockPath:manifest(handoff).sourceLockPath, sourceOrigins:manifest(handoff).sourceOrigins, build: handoff.build,
      buildHandoffSha256: hash(jsonBytes(handoff)), documents: documentRecords,
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
