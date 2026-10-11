import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm, symlink, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { root, hash, identity, argumentsFor, validateBuild, noticeInputs, assemble, inspectArchive, execute } from '../package.mjs';
import { runtimeNames } from '../../build/config.mjs';

async function fixture(t) {
  const repository = await mkdtemp(join(tmpdir(), 'package-fixture-'));
  t.after(() => rm(repository, { recursive: true, force: true }));
  for (const file of ['inputs/sources.lock.json', 'tools/harness.sh', 'tools/build/config.mjs',
    'tools/build/extra-init.c.in', 'tools/harness/package-lock.json', 'LICENSE', 'README.md', 'tools/package']) {
    await mkdir(join(repository, file, '..'), { recursive: true });
    await cp(join(root, file), join(repository, file), { recursive: true });
  }
  const runtimeDirectory = join(repository, 'runtime'); await mkdir(runtimeDirectory);
  const runtimeFiles = [];
  for (const name of runtimeNames) {
    const bytes = Buffer.from(`runtime fixture ${name}\n`); await writeFile(join(runtimeDirectory, name), bytes);
    runtimeFiles.push({ name, size: bytes.length, sha256: hash(bytes) });
  }
  const lockBytes = await readFile(join(repository, 'inputs/sources.lock.json')), lock = JSON.parse(lockBytes);
  const inputs = { lockDigest: { algorithm: 'sha256', value: hash(lockBytes) } };
  for (const key of ['sqlite', 'sqliteVec']) inputs[key] = { version: lock[key].version, digest: lock[key].digest };
  const build = { tools: { emcc: 'emcc (Emscripten) 4.0.23', node: process.version, cc:'cc fixture', make:'make fixture', 'wasm-strip':'WABT fixture', 'wasm-opt':'Binaryen fixture', npm:'npm fixture' }, platform: 'fixture Linux x86_64',
    amalgamation: ['make','sqlite3.c'], configure: ['env', 'CC=cc', './configure', '--enable-all'], wasm: ['make', 'b-esm', `sqlite3_wasm_extra_init.c=${repository}/bridge.c`] };
  for (const [field, path] of [['harnessSha256', 'tools/harness.sh'], ['configSha256', 'tools/build/config.mjs'],
    ['templateSha256', 'tools/build/extra-init.c.in'], ['dependencyLockSha256', 'tools/harness/package-lock.json']]) build[field] = hash(await readFile(join(repository, path)));
  return { repository, handoff: { schemaVersion: 1, inputs, build, runtimeDirectory, runtimeFiles }, name: 'sqlite-vector-wasm-fixture', version: '0.0.0-test' };
}

// The offline suite uses actual local npm packing but does not qualify production SDK identity.
test('complete handoff assembles one exact autonomous tarball and consumer subpaths', async t => {
  const options = await fixture(t);
  await writeFile(join(options.handoff.runtimeDirectory, 'demo.html'), 'not shipped');
  const result = await assemble(options);
  assert.deepEqual(JSON.parse(await readFile(join(result.workspace, 'handoff.json'))), result);
  assert.equal(hash(await readFile(result.archive.path)), result.archive.sha256);
  assert.deepEqual(result.runtimeFiles, options.handoff.runtimeFiles);
  const metadata = JSON.parse(await readFile(join(result.runtimeDirectory, 'package.json')));
  assert.equal(metadata.name, options.name); assert.equal(metadata.version, options.version);
  assert.equal(metadata.license, 'Apache-2.0');
  assert.equal(await readFile(join(result.runtimeDirectory, 'README.md'), 'utf8'),
    await readFile(join(options.repository, 'README.md'), 'utf8'));
  assert.equal(metadata.scripts, undefined); assert.equal(metadata.dependencies, undefined);
  assert.equal(metadata.exports['.'], undefined); assert.equal(metadata.sideEffects, undefined);
  for (const name of runtimeNames) assert.equal(metadata.exports[`./${name}`], `./${name}`);
  const portable = JSON.parse(await readFile(join(result.runtimeDirectory, 'runtime.json')));
  assert.deepEqual(portable.inputs, result.inputs);
  assert.equal(JSON.stringify(portable).includes(options.repository), false);
  await rm(options.handoff.runtimeDirectory, { recursive: true });
  const consumer = join(options.repository, 'consumer'); await mkdir(consumer);
  await writeFile(join(consumer, 'package.json'), '{"private":true}');
  await execute('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', result.archive.path], { cwd: consumer });
  const require = createRequire(join(consumer, 'probe.cjs'));
  for (const name of runtimeNames) assert.equal(hash(await readFile(require.resolve(`${options.name}/${name}`))), options.handoff.runtimeFiles.find(f => f.name === name).sha256);
  assert.equal((await readdir(consumer)).includes('package-lock.json'), false);
  assert.equal(result.files.some(f => f.name === 'demo.html'), false);
});

test('identity and argument parsing reject missing, duplicate and invalid metadata', () => {
  for (const args of [[], ['--name','x','--name','x','--version','1.0.0'], ['--unknown','x','--name','x','--version','1.0.0']]) assert.throws(() => argumentsFor(args));
  for (const name of ['../escape','Foo','node_modules','@scope/../x','', '.hidden']) assert.throws(() => identity(name,'1.0.0'));
  for (const version of ['latest','1','01.0.0','1.0.0-01','1.0.0-','1.0.0+']) assert.throws(() => identity('fixture',version));
  assert.deepEqual(identity('@fixture/engine','1.2.3-alpha.1+build'), {name:'@fixture/engine',version:'1.2.3-alpha.1+build'});
});

test('independent product versions preserve the same exact upstream composition', async t => {
  const options = await fixture(t);
  options.name = 'sqlite-vector-wasm';
  for (const version of ['0.1.0', '0.1.1', '0.2.0', '1.0.0']) {
    const result = await assemble({ ...options, version });
    const metadata = JSON.parse(await readFile(join(result.runtimeDirectory, 'package.json')));
    const runtime = JSON.parse(await readFile(join(result.runtimeDirectory, 'runtime.json')));
    assert.equal(metadata.name, 'sqlite-vector-wasm');
    assert.equal(metadata.version, version);
    assert.deepEqual(runtime.inputs, Object.fromEntries(['sqlite', 'sqliteVec'].map(key =>
      [key, { version: options.handoff.inputs[key].version, digest: options.handoff.inputs[key].digest }])));
    assert.equal(metadata.version.includes(runtime.inputs.sqlite.version), false);
    assert.equal(metadata.version.includes(runtime.inputs.sqliteVec.version), false);
  }
  // A composed upstream string can be syntactically valid prerelease SemVer.
  // Product release policy excludes it; the generic packaging validator does not select that policy.
  const composed = `${options.handoff.inputs.sqlite.version}-${options.handoff.inputs.sqliteVec.version}`;
  assert.equal(identity(options.name, composed).version, composed);
});

test('scoped package and SemVer build metadata survive real npm packing', async t => {
  const options=await fixture(t);
  options.name='@fixture/engine';options.version='1.2.3-alpha.1+build';
  const result=await assemble(options);
  const metadata=JSON.parse(await readFile(join(result.runtimeDirectory,'package.json')));
  assert.equal(metadata.name,options.name);assert.equal(metadata.version,options.version);
});

test('selected scoped distribution installs offline and resolves every runtime subpath', async t => {
  const options=await fixture(t);options.name='@at-rama/sqlite-vector-wasm';options.version='0.1.0';
  const result=await assemble(options);
  const consumer=join(options.repository,'scoped-consumer');await mkdir(consumer);
  await writeFile(join(consumer,'package.json'),'{"private":true}');
  await execute('npm',['install','--offline','--ignore-scripts','--no-audit','--no-fund','--package-lock=false',result.archive.path],{cwd:consumer});
  const require=createRequire(join(consumer,'probe.cjs'));
  const metadata=JSON.parse(await readFile(join(consumer,'node_modules/@at-rama/sqlite-vector-wasm/package.json')));
  assert.equal(metadata.name,'@at-rama/sqlite-vector-wasm');assert.equal(metadata.version,'0.1.0');
  for(const name of runtimeNames)assert.equal(hash(await readFile(require.resolve(`@at-rama/sqlite-vector-wasm/${name}`))),
    options.handoff.runtimeFiles.find(f=>f.name===name).sha256);
});

test('invalid schema, source identities, configuration and inventory fail before packing', async t => {
  const f = await fixture(t);
  const cases = [h => h.schemaVersion=2, h => h.inputs.lockDigest.value='0'.repeat(64), h => h.inputs.sqlite.version='0.0.0',
    h => h.inputs.sqliteVec.digest.value='0'.repeat(64), h => h.build.configSha256='0'.repeat(64),
    h => h.runtimeFiles.pop(), h => h.runtimeFiles.push(h.runtimeFiles[0]), h => h.runtimeFiles[0].name='../sqlite3.js',
    h => h.runtimeFiles[0].size=0, h => h.runtimeFiles[0].sha256='invalid', h => h.build.tools.emcc='4.0.22', h => delete h.build.amalgamation, h => delete h.build.tools.make];
  for (const mutate of cases) { const h=structuredClone(f.handoff); mutate(h); await assert.rejects(validateBuild(h,f.repository)); }
});

test('missing, empty, modified, symlink, directory and FIFO runtime files are rejected', async t => {
  for (const kind of ['missing','empty','changed','symlink','directory','fifo','unexpected']) {
    const f=await fixture(t), file=join(f.handoff.runtimeDirectory,'sqlite3.js');
    if (kind==='unexpected') await writeFile(join(f.handoff.runtimeDirectory,'extra.mjs'),'x');
    else {
      await rm(file);
      if(kind==='empty')await writeFile(file,'');
      if(kind==='changed')await writeFile(file,'different');
      if(kind==='symlink')await symlink(join(f.handoff.runtimeDirectory,'sqlite3.mjs'),file);
      if(kind==='directory')await mkdir(file);
      if(kind==='fifo')await execute('mkfifo',[file]);
    }
    await assert.rejects(validateBuild(f.handoff,f.repository));
  }
});

test('notice texts and exact version associations are mandatory', async t => {
  for (const kind of ['missing','changed','version','duplicate','association','wrong-project']) {
    const f=await fixture(t), path=join(f.repository,'tools/package/notices.json'), record=JSON.parse(await readFile(path));
    if(kind==='missing')await rm(join(f.repository,'tools/package/notices/sqlite-vec-MIT.txt'));
    if(kind==='changed')await writeFile(join(f.repository,'tools/package/notices/sqlite-vec-MIT.txt'),'altered');
    if(kind==='version')record.notices[0].version='0.0.0';
    if(kind==='duplicate')record.notices.push(record.notices[0]);
    if(kind==='association')record.notices.pop();
    if(kind==='wrong-project'){record.notices[0].project='sqliteVec';record.notices[0].version=f.handoff.inputs.sqliteVec.version;}
    await writeFile(path,JSON.stringify(record)); await assert.rejects(noticeInputs(f.handoff,f.repository));
  }
});

test('copy, pack, archive inspection and atomic-write failures retain diagnostics without old success', async t => {
  const f=await fixture(t); const success=await assemble(f);
  for (const kind of ['copy','pack','archive','save']) {
    const options={...f};
    if(kind==='copy')options.writeBytes=async()=>{throw Error('fixture copy failure');};
    if(kind==='save')options.save=async()=>{throw Error('fixture atomic failure');};
    if(kind==='pack'||kind==='archive')options.run=async(command,args,options)=>{
      if(command===(kind==='pack'?'npm':'python3'))throw Error(`fixture ${kind} failure`);
      return execute(command,args,options);
    };
    await assert.rejects(assemble(options), /retained workspace:/);
  }
  const runs=await readdir(join(f.repository,'.work/package'));
  assert.equal(runs.length,5);
  for(const run of runs) {
    const files=await readdir(join(f.repository,'.work/package',run));
    assert.equal(files.includes('handoff.json'),join(f.repository,'.work/package',run)===success.workspace);
    assert.ok(files.includes('package.log'));
  }
});

test('archive inspector rejects omitted, extra, duplicate, unsafe, linked and altered contents', async t => {
  const f=await fixture(t), r=await assemble(f);
  const script=`import sys,json,tarfile,io\nr=json.load(sys.stdin)\nwith tarfile.open(r['input'],'r:gz') as a, tarfile.open(r['output'],'w:gz') as b:\n for i,m in enumerate(a):\n  data=a.extractfile(m).read() if m.isfile() else None\n  if i==0:\n   if r['kind']=='missing':continue\n   if r['kind']=='unsafe':m.name='package/../outside'\n   if r['kind']=='linked':m.type=tarfile.SYMTYPE;m.linkname='/tmp/outside';data=None;m.size=0\n   if r['kind']=='changed' and data:data=bytes([data[0]^1])+data[1:]\n   if r['kind']=='duplicate':b.addfile(m,io.BytesIO(data) if data else None)\n  b.addfile(m,io.BytesIO(data) if data else None)\n if r['kind']=='extra':\n  m=tarfile.TarInfo('package/extra.txt');m.size=1;b.addfile(m,io.BytesIO(b'x'))\n`;
  for(const kind of ['missing','extra','duplicate','unsafe','linked','changed']) {
    const archive=join(f.repository,`${kind}.tgz`);
    await execute('python3',['-c',script],{input:JSON.stringify({input:r.archive.path,output:archive,kind})});
    await assert.rejects(inspectArchive(archive,r.files,join(f.repository,kind)));
  }
});

test('two successful invocations use distinct workspaces and retain exact bytes', async t => {
  const f=await fixture(t), first=await assemble(f), second=await assemble(f);
  assert.notEqual(first.workspace,second.workspace);assert.deepEqual(first.files,second.files);
});
