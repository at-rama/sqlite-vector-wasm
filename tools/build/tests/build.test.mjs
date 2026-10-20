import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, copyFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, construct, generateBridge, runtimeInventory, buildEnvironment, cInclude, commandRunner, checkRecipe, checkRelease, parseBuildArguments, sourceSelection, selectedEngine, verifyAcquisition, compileVector } from '../build.mjs';
import { runtimeNames, targets, wasmOptions } from '../config.mjs';
import { reference, assertReference, assertNeighbors } from '../check.mjs';
import { nativeProbeSql } from '../browser-probe.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
async function fixture(t, { fail, absent, empty, extra, badIdentity, vecVersion, mutateHandoff, vector = true, objectFailure } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'sqlite-build-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sqlite = join(root, 'sources/sqlite');
  const vec = join(root, 'sources/vec');
  for (const directory of ['tools/build', 'tools/harness', 'inputs', 'sources/sqlite/ext/wasm/api', 'sources/vec']) {
    await mkdir(join(root, directory), { recursive: true });
  }
  for (const path of ['tools/build/config.mjs', 'tools/build/vector-extra-init.c.in', 'tools/harness.sh', 'tools/harness/package-lock.json', 'inputs/sqlite-vector.sources.lock.json']) {
    await copyFile(join(repositoryRoot, path), join(root, path));
  }
  const selectedLock = 'inputs/sqlite-vector.sources.lock.json';
  const engine = 'sqliteVector';
  const lockPath = join(root, selectedLock);
  const pins = JSON.parse(await readFile(lockPath));
  if (vecVersion) {
    const previous = pins[engine].version;
    for (const key of ['version', 'archiveUrl', 'releaseUrl', ...(vector ? ['tag', 'tagUrl'] : [])]) {
      pins[engine][key] = pins[engine][key].replace(previous, vecVersion);
    }
    await writeFile(lockPath, JSON.stringify(pins) + '\n');
  }
  const lock = await readFile(lockPath);
  await mkdir(join(vec,'src')); await mkdir(join(vec,'libs'));
  await writeFile(join(vec,'src/sqlite-vector.h'),'int sqlite3_vector_init(void);');
  for(const name of ['sqlite-vector', ...['cpu','avx2','avx512','neon','rvv','sse2'].map(x=>`distance-${x}`)]) await writeFile(join(vec,'src',`${name}.c`),'/* unchanged Vector unit */');
  await writeFile(join(sqlite, 'ext/wasm/GNUmakefile'), 'sqlite3-wasm.c.in =\nsqlite3_wasm_extra_init.c ?=\n-DSQLITE_ENABLE_FTS5\nemcc.WASM_BIGINT ?= 1\n' +
    ['kvvfs', 'opfs', 'opfs-sahpool', 'opfs-wl'].map(v=>`sqlite3-vfs-${v}.c-pp.js`).join('\n'));
  await writeFile(join(sqlite, 'ext/wasm/mkwasmbuilds.c'), '$(sqlite3-wasm.c.in)\n.vanilla =\n.esm =\n.bundler =\n');
  await writeFile(join(sqlite, 'ext/wasm/api/sqlite3-wasm.c'), 'SQLITE_WASM_EXTRA_INIT');
  const handoff = { workspace: join(root, 'sources'), lockDigest: { algorithm: 'sha256', value: digest(lock) } };
  for (const [key, path] of [['sqlite',sqlite],[engine,vec]]) handoff[key] = {
    ...pins[key], sourcePath: path, archivePath: `${path}.archive`, digest: { ...pins[key].digest },
  };
  if (badIdentity) handoff.sqlite.version = '0.0.0';
  if (mutateHandoff) mutateHandoff(handoff);
  const calls = [];
  const run = async (command, args, options) => {
    calls.push({ command, args, ...options });
    if (fail === command || fail === args[0]) throw new Error('injected failure');
    if (command === 'bash') return JSON.stringify(handoff);
    if(command==='emcc' && args.includes('-c')) {
      if(objectFailure==='compile') throw Error('extension compilation failed');
      if(objectFailure!=='missing') await writeFile(args.at(-1),objectFailure==='empty'?'':'object fixture');
    }
    if (command === 'make' && args[0] === 'sqlite3.c') {
      for (const name of ['sqlite3.c','sqlite3.h']) await writeFile(join(sqlite, name), `#define SQLITE_VERSION "${pins.sqlite.version}"`);
    }
    if (command === 'make' && args[0] === targets[0]) {
      const out = join(sqlite, 'ext/wasm/jswasm');
      await mkdir(out);
      for (const name of runtimeNames) if (name !== absent) await writeFile(join(out, name), name === empty ? '' : `runtime: ${name}`);
      if (extra) await writeFile(join(out, extra), 'extra');
    }
    return `${command} fixture-version`;
  };
  return { root, sqlite, vec, calls, run, pins, selectedLock, handoff };
}

for (const vecVersion of ['0.1.10-alpha.4', '0.1.10-beta.1', '0.1.10-rc.0']) {
  test(`published ${vecVersion} keeps exact frozen identity and build provenance`, async t => {
    const f = await fixture(t, { vecVersion });
    const lock = await readFile(join(f.root, 'inputs/sqlite-vector.sources.lock.json'));
    const result = await construct({ root: f.root, run: f.run });
    assert.equal(result.inputs.sqliteVector.version, vecVersion);
    assert.deepEqual(result.inputs.sqliteVector.digest, f.pins.sqliteVector.digest);
    assert.deepEqual(result.inputs.lockDigest, { algorithm: 'sha256', value: digest(lock) });
    assert.equal(await readFile(join(f.root, 'inputs/sqlite-vector.sources.lock.json'), 'utf8'), lock.toString());
    const acquisition = f.calls.filter(x => x.command === 'bash');
    assert.equal(acquisition.length, 1);
    assert.deepEqual(acquisition[0].args, [join(f.root, 'tools/inputs.sh'), 'acquire', '--lock', join(f.root, 'inputs/sqlite-vector.sources.lock.json')]);
    assert.deepEqual(result.build.configure, ['env', 'CC=cc', 'CC_FOR_BUILD=cc', 'CXX=/bin/false', './configure', '--enable-all']);
    assert.deepEqual(result.build.wasm.slice(0, 5), ['make', ...targets, ...wasmOptions]);
    assert.equal(result.runtimeFiles.length, runtimeNames.length);
    for (const file of result.runtimeFiles) {
      const bytes = await readFile(join(result.runtimeDirectory, file.name));
      assert.equal(file.size, bytes.length); assert.equal(file.sha256, digest(bytes));
    }
    assert.deepEqual(JSON.parse(await readFile(join(result.logPath, '../handoff.json'), 'utf8')), result);
    assert(!Object.hasOwn(result, 'channel'));
  });
}

for (const [label, mutateHandoff, message] of [
  ['stripped prerelease suffix', h => { h.sqliteVector.version = '0.1.10'; }, /Wrong acquired sqliteVector identity/],
  ['different prerelease', h => { h.sqliteVector.version = '0.1.10-alpha.3'; }, /Wrong acquired sqliteVector identity/],
  ['source digest bytes', h => { h.sqliteVector.digest.value = 'f'.repeat(64); }, /Wrong acquired sqliteVector identity/],
  ['source digest algorithm', h => { h.sqliteVector.digest.algorithm = 'sha3-256'; }, /Wrong acquired sqliteVector identity/],
  ['source lock bytes', h => { h.lockDigest.value = '0'.repeat(64); }, /Source lock changed/],
  ['source lock algorithm', h => { h.lockDigest.algorithm = 'sha3-256'; }, /Source lock changed/],
]) {
  test(`prerelease handoff refuses ${label} before generation or compilation`, async t => {
    const f = await fixture(t, { vecVersion: '0.1.10-alpha.4', mutateHandoff });
    await assert.rejects(construct({ root: f.root, run: f.run }), message);
    assert.equal(f.calls.filter(x => x.command === 'bash').length, 1);
    assert(!f.calls.some(x => x.command === 'env' || (x.command === 'make' && x.args[0] !== '--version')));
    const workspace = join(f.root, '.work/build', (await readdir(join(f.root, '.work/build')))[0]);
    assert.deepEqual(await readdir(workspace), ['build.log']);
  });
}

test('fresh acquisition, exact arguments, canonical flags and complete JSON/hashes', async t => {
  const f = await fixture(t);
  await mkdir(join(f.root,'.work/build/old-success'),{recursive:true});
  await writeFile(join(f.root,'.work/build/old-success/handoff.json'),'old');
  const result = await construct({ root:f.root,run:f.run,environment:{PATH:process.env.PATH,MAKEFLAGS:'-e',CPATH:'/untrusted',SQLITE_OPT:'omit',EMCC_CFLAGS:'-O0'} });
  assert.equal(result.schemaVersion,1);
  assert.equal(result.runtimeFiles.length,11);
  const acquire = f.calls.find(x=>x.command==='bash');
  assert.deepEqual(acquire.args,[join(f.root,'tools/inputs.sh'),'acquire','--lock',join(f.root,'inputs/sqlite-vector.sources.lock.json')]);
  assert.equal(f.calls.filter(x=>x.command==='bash').length,1);
  assert.deepEqual(f.calls.find(x=>x.command==='env').args,['CC=cc','CC_FOR_BUILD=cc','CXX=/bin/false','./configure','--enable-all']);
  const wasm = f.calls.find(x=>x.command==='make' && x.args[0]===targets[0]);
  assert.deepEqual(wasm.args.slice(0,4),[...targets,...wasmOptions]);
  assert.equal(wasm.args.length,9);
  assert(!('MAKEFLAGS' in wasm.env)); assert(!('CPATH' in wasm.env)); assert(!('SQLITE_OPT' in wasm.env));
  assert.deepEqual(result.build.wasm,['make',...wasm.args]);
  for (const file of result.runtimeFiles) {
    const bytes=await readFile(join(result.runtimeDirectory,file.name));
    assert.equal(file.sha256,digest(bytes)); assert.equal(file.size,bytes.length);
  }
  const bridge = wasm.args[4].split('=').slice(1).join('=');
  assert((await readFile(bridge,'utf8')).includes(`#include "${join(f.vec,'src/sqlite-vector.h')}"`));
  assert.deepEqual(JSON.parse(await readFile(join(bridge,'../handoff.json'),'utf8')),result);
  assert.equal(await readFile(join(f.root,'.work/build/old-success/handoff.json'),'utf8'),'old');
});

for (const stage of ['emcc','wasm-strip','bash','CC=cc','sqlite3.c','b-vanilla']) {
  test(`failure at ${stage} retains diagnostics and creates no success handoff`, async t=> {
    const f=await fixture(t,{fail:stage});
    await mkdir(join(f.root,'.work/build/old-success'),{recursive:true});
    await writeFile(join(f.root,'.work/build/old-success/handoff.json'),'old-success');
    await assert.rejects(construct({root:f.root,run:f.run}),/injected failure.*retained workspace/);
    assert.equal(await readFile(join(f.root,'.work/build/old-success/handoff.json'),'utf8'),'old-success');
    const runs=(await readdir(join(f.root,'.work/build'))).filter(name=>name!=='old-success');
    assert.equal(runs.length,1);
    assert(!(await readdir(join(f.root,'.work/build',runs[0]))).includes('handoff.json'));
    assert((await readFile(join(f.root,'.work/build',runs[0],'build.log'),'utf8')).includes('Build failed'));
  });
}
for (const name of ['sqlite3.js','sqlite3-worker1.mjs','sqlite3-opfs-async-proxy.js','sqlite3.wasm']) {
  test(`missing ${name} prevents success`,async t=> {
    const f=await fixture(t,{absent:name});
    await assert.rejects(construct({root:f.root,run:f.run}),/runtime inventory/);
  });
}
test('empty and additional runtime assets, wrong identity and atomic write failure are rejected',async t=> {
  for (const option of [{empty:'sqlite3.wasm'},{extra:'sqlite3-node.mjs'},{badIdentity:true}]) {
    const f=await fixture(t,option);
    await assert.rejects(construct({root:f.root,run:f.run}));
  }
  const f=await fixture(t);
  await assert.rejects(construct({root:f.root,run:f.run,saveHandoff:async()=>{throw Error('disk failure');}}),/disk failure/);
  const directory=join(f.root,'.work/build',(await readdir(join(f.root,'.work/build')))[0]);
  assert(!(await readdir(directory)).includes('handoff.json'));
});
test('unsupported paths are explicit failures and ambient flags are excluded',()=> {
  for(const path of ['/tmp/a b/vec.c','/tmp/a"b/vec.c','/tmp/a$b/vec.c','/tmp/a;b/vec.c','/tmp/a`b/vec.c','/tmp/a&b/vec.c','relative.c']) assert.throws(()=>cInclude(path),/Unsupported/);
  assert.deepEqual(buildEnvironment({PATH:'/tools',HOME:'/home',MAKEFLAGS:'-e',EMCC_CFLAGS:'-O0',CC:'wrong'}),{PATH:'/tools',HOME:'/home'});
});
test('a runtime symlink is not a regular output',async t=> {
  const f=await fixture(t);
  const result=await construct({root:f.root,run:f.run});
  await rm(join(result.runtimeDirectory,'sqlite3.wasm'));
  await symlink('sqlite3.js',join(result.runtimeDirectory,'sqlite3.wasm'));
  await assert.rejects(runtimeInventory(result.runtimeDirectory),/nonregular/);
});
test('real child execution reserves stdout for the caller and propagates failure',async t=> {
  const root=await mkdtemp(join(tmpdir(),'sqlite-build-child-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const log=join(root,'log'); await writeFile(log,'');
  assert.equal(await commandRunner(log)(process.execPath,['-e','process.stdout.write("captured")'],{capture:true}),'captured');
  await assert.rejects(commandRunner(log)(process.execPath,['-e','process.exit(7)']),/failed \(7\)/);
  await assert.rejects(commandRunner(log)('/absent-build-tool',[]),/ENOENT/);
});
test('entry point rejects arguments and missing or unqualified SDK state without result stdout',async t=> {
  const root=await mkdtemp(join(tmpdir(),'sqlite-build-wrapper-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  for(const args of [['unexpected'],[]]) {
    const result=spawnSync('bash',[join(repositoryRoot,'tools/build.sh'),...args],{
      encoding:'utf8',env:{...process.env,HARNESS_STATE:join(root,'missing')},
    });
    assert.notEqual(result.status,0);assert.equal(result.stdout,'');
    assert.match(result.stderr,args.length?/Usage:/ : /Run: bash tools\/harness.sh install/);
  }
  const state=join(root,'wrong-sdk');await mkdir(join(state,'emsdk'),{recursive:true});
  await writeFile(join(state,'emsdk/emsdk_env.sh'),'# deliberately unqualified fixture\n');
  const result=spawnSync('bash',[join(repositoryRoot,'tools/build.sh')],{
    encoding:'utf8',env:{...process.env,HARNESS_STATE:state},
  });
  assert.notEqual(result.status,0);assert.equal(result.stdout,'');assert.match(result.stderr,/Wrong emsdk installer commit/);
});

test('unsupported upstream recipe and mismatched generated header fail explicitly',async t=> {
  const f=await fixture(t);
  await writeFile(join(f.sqlite,'ext/wasm/mkwasmbuilds.c'),'.vanilla =\n');
  await assert.rejects(checkRecipe(f.sqlite),/canonical browser modes/);
  await writeFile(join(f.sqlite,'sqlite3.c'),'#define SQLITE_VERSION "3.53.4"');
  await writeFile(join(f.sqlite,'sqlite3.h'),'#define SQLITE_VERSION "0.0.0"');
  await assert.rejects(checkRelease(f.sqlite,'3.53.4'),/core\/header/);
});

test('bridge generation failure retains diagnostics without a success handoff',async t=> {
  const f=await fixture(t);
  await writeFile(join(f.root,'tools/build/vector-extra-init.c.in'),'invalid template');
  await assert.rejects(construct({root:f.root,run:f.run}),/Invalid extra-init template.*retained workspace/);
  const workspace=join(f.root,'.work/build',(await readdir(join(f.root,'.work/build')))[0]);
  assert.deepEqual(await readdir(workspace),['build.log']);
});

test('selection is explicit, repository-local and unambiguous',async t=> {
  assert.deepEqual(parseBuildArguments([]),{});
  assert.deepEqual(parseBuildArguments(['--lock','inputs/sqlite-vector.sources.lock.json']),{lockPath:'inputs/sqlite-vector.sources.lock.json'});
  for(const args of [['--engine','sqliteVector'],['--lock'],['--lock',''],['--lock','--other'],['--lock','a','--lock','b'],['a']]) assert.throws(()=>parseBuildArguments(args),/Usage/);
  for(const pins of [{schemaVersion:3},{schemaVersion:1,sqlite:{},sqliteVector:{},sqliteVector:{}},{schemaVersion:2,sqlite:{},sqliteVec:{}},{schemaVersion:1,sqlite:{}}]) assert.throws(()=>selectedEngine(pins),/ambiguous/);
  const f=await fixture(t);
  assert.equal((await sourceSelection(f.root)).engine,'sqliteVector');
  await assert.rejects(sourceSelection(f.root,'inputs/absent.json'),/ENOENT/);
  await symlink(join(repositoryRoot,'inputs/sqlite-vector.sources.lock.json'),join(f.root,'inputs/outside.json'));
  await assert.rejects(sourceSelection(f.root,'inputs/outside.json'),/inside this repository/);
});

test('Vector uses seven separate units, selected acquisition, immutable sources and recorded glue',async t=> {
  const f=await fixture(t,{vector:true});
  const result=await construct({root:f.root,run:f.run,lockPath:f.selectedLock});
  assert.equal(result.sourceLockPath,f.selectedLock); assert.equal(result.engine.key,'sqliteVector');
  assert(!result.inputs.sqliteVec);
  const acquisition=f.calls.find(x=>x.command==='bash');
  assert.equal(acquisition.args.at(-1),join(f.root,f.selectedLock));
  const compiles=f.calls.filter(x=>x.command==='emcc'&&x.args.includes('-c'));
  assert.equal(compiles.length,7);
  assert.deepEqual(result.build.extensionCommands,compiles.map(x=>['emcc',...x.args]));
  for(const call of compiles) {
    assert.deepEqual(call.args.slice(0,7),['-Oz','-std=c99','-fPIC','-DSQLITE_CORE','-DSQLITE_WASM_EXTRA_INIT','-include','strings.h']);
    assert(call.args.includes('-I'+f.sqlite));
    const input=call.args[call.args.indexOf('-c')+1];
    assert.equal(await readFile(input,'utf8'),'/* unchanged Vector unit */');
  }
  const wasm=f.calls.find(x=>x.command==='make'&&x.args[0]===targets[0]);
  assert.deepEqual(wasm.args.slice(-4,-1),['-f','GNUmakefile','-f']);
  const include=await readFile(wasm.args.at(-1));
  assert.equal(result.build.integration.makeIncludeSha256,digest(include));
  assert.equal((include.toString().match(/\.o/g)||[]).length,7);
  // Exercise GNU Make's lazy MAKEFILE_LIST directory calculation, not just text.
  const recipe=join(f.root,'GNUmakefile');
  await writeFile(recipe,'MAKEFILE = $(lastword $(MAKEFILE_LIST))\ndir.wasm = $(patsubst %/,%,$(dir $(MAKEFILE)))\nshow:\n\t@echo $(dir.wasm)\n');
  const make=spawnSync('make',['-f','GNUmakefile','-f',wasm.args.at(-1),'show'],{cwd:f.root,encoding:'utf8'});
  assert.equal(make.status,0,make.stderr); assert.equal(make.stdout.trim(),'.');
  const bridge=await readFile(join(result.logPath,'../extra-init.c'));
  assert.equal(result.build.integration.bridgeSha256,digest(bridge));
  assert.match(bridge.toString(),/sqlite3_auto_extension.*sqlite3_vector_init/);
  assert.deepEqual(result.build.commonWasmOptions,[...targets,...wasmOptions]);
  assert.equal(result.runtimeFiles.length,11);
});

for(const mutate of [h=>{h.sqliteVec=h.sqliteVector;},h=>{h.sqliteVector.commit='0'.repeat(40);},h=>{h.sqliteVector.archiveUrl+='changed';},h=>{h.sqliteVector.version+='-rc.1';},h=>{h.sqliteVector.digest.value='0'.repeat(64);}]) {
  test('Vector identity mismatch cannot fall back to the default engine',async t=> {
    const f=await fixture(t,{vector:true,mutateHandoff:mutate});
    await assert.rejects(construct({root:f.root,run:f.run,lockPath:f.selectedLock}),/acquisition handoff|Wrong acquired/);
    assert(!f.calls.some(x=>x.command==='env'));
  });
}

for(const objectFailure of ['compile','missing','empty']) test(`Vector ${objectFailure} object prevents a successful handoff`,async t=> {
  const f=await fixture(t,{vector:true,objectFailure});
  await assert.rejects(construct({root:f.root,run:f.run,lockPath:f.selectedLock}),/compilation failed|ENOENT|Missing\/nonregular/);
  const workspace=join(f.root,'.work/build',(await readdir(join(f.root,'.work/build')))[0]);
  assert(!(await readdir(workspace)).includes('handoff.json'));
});

test('Vector missing source and changed object hook fail before linking',async t=> {
  for(const fault of ['source','hook']) {
    const f=await fixture(t,{vector:true});
    if(fault==='source') await rm(join(f.vec,'src/distance-cpu.c'));
    else await writeFile(join(f.sqlite,'ext/wasm/mkwasmbuilds.c'),'.vanilla =\n.esm =\n.bundler =\n');
    await assert.rejects(construct({root:f.root,run:f.run,lockPath:f.selectedLock}),/source inventory|object inputs/);
    assert(!f.calls.some(x=>x.command==='make'&&x.args[0]===targets[0]));
  }
});

test('compiled Vector bridge returns registration failure without hiding it',async t=> {
  const f=await fixture(t,{vector:true});
  await writeFile(join(f.vec,'src/sqlite-vector.h'),'int sqlite3_vector_init(void); int sqlite3_auto_extension(void(*)(void));');
  const bridge=join(f.root,'bridge.c');
  await generateBridge(f.vec,bridge,join(repositoryRoot,'tools/build/vector-extra-init.c.in'),'sqliteVector');
  const main=join(f.root,'main.c'),binary=join(f.root,'fixture');
  await writeFile(main,'int sqlite3_vector_init(void){return 0;} int sqlite3_auto_extension(void(*p)(void)){(void)p;return 7;} int sqlite3_wasm_extra_init(const char*); int main(void){return sqlite3_wasm_extra_init(0)==7?0:1;}');
  const compiled=spawnSync('cc',[bridge,main,'-o',binary],{encoding:'utf8'});
  assert.equal(compiled.status,0,compiled.stderr); assert.equal(spawnSync(binary).status,0);
});

test('fresh selected-lock reference and identity/flag mismatches',async t=> {
  const f=await fixture(t,{vector:true});
  const candidate=await construct({root:f.root,run:f.run,lockPath:f.selectedLock});
  // The fixture returns the same paths; real acquisition creates a fresh tree.
  await rm(candidate.runtimeDirectory,{recursive:true});
  const baseline=await reference(f.root,f.selectedLock,{repository:f.root,run:f.run});
  assertReference(candidate,baseline);
  assert.equal(f.calls.filter(x=>x.command==='bash').length,2);
  assert.equal(f.calls.filter(x=>x.command==='bash').at(-1).args.at(-1),join(f.root,f.selectedLock));
  for(const mutate of [b=>{b.inputs.lockDigest.value='wrong';},b=>{b.inputs.sqlite.version='wrong';},b=>{b.inputs.sqlite.digest.value='wrong';},b=>{b.sourceLockPath='inputs/unsupported.lock.json';},b=>{b.build.commonWasmOptions.push('omit');},b=>{b.build.tools.emcc='wrong';},b=>{b.build.configure.push('--omit');}]) {
    const bad=structuredClone(baseline); mutate(bad); assert.throws(()=>assertReference(candidate,bad),/mismatch/);
  }
  const last=f.calls.filter(x=>x.command==='make'&&x.args[0]===targets[0]).at(-1);
  assert.deepEqual(last.args,[...targets,...wasmOptions]);
});

test('native probe branches retain obsolete caller rejection and reject wrong neighbors',()=> {
  assert.throws(()=>nativeProbeSql('0.1.9')); assert.throws(()=>nativeProbeSql({key:'sqliteVec',version:'0.1.9'}));
  const vector=nativeProbeSql({key:'sqliteVector',version:'1.1.2'});
  assert.equal(vector.expectedVersion,'1.1.2'); assert.match(vector.setup,/vector_init/); assert.match(vector.query,/vector_full_scan/);
  assert.equal(nativeProbeSql(false).versionSql,'select sqlite_version()');
  assert.throws(()=>nativeProbeSql({key:'unknown'}),/Unsupported/);
  assertNeighbors([[1,0],[2,Math.SQRT2]]);
  for(const rows of [[[2,0],[1,Math.SQRT2]],[[1,0],[2,1]],[[1,0]]]) assert.throws(()=>assertNeighbors(rows));
});

test('Vector prerelease suffix is retained exactly, without claiming real qualification',async t=> {
  const f=await fixture(t,{vector:true,vecVersion:'1.1.3-rc.1'});
  const result=await construct({root:f.root,run:f.run,lockPath:f.selectedLock});
  assert.equal(result.engine.version,'1.1.3-rc.1');
  assert.equal(result.inputs.sqliteVector.version,'1.1.3-rc.1');
});

test('Vector link, inventory and atomic-write failures retain diagnostics without success',async t=> {
  for(const option of [{fail:targets[0]},{absent:'sqlite3.wasm'},{empty:'sqlite3-worker1.mjs'},{extra:'sqlite3-node.mjs'},{}]) {
    const f=await fixture(t,{vector:true,...option});
    const options={root:f.root,run:f.run,lockPath:f.selectedLock};
    if(!Object.keys(option).length) options.saveHandoff=async()=>{throw Error('failed atomic handoff');};
    await assert.rejects(construct(options));
    const workspace=join(f.root,'.work/build',(await readdir(join(f.root,'.work/build')))[0]);
    assert(!(await readdir(workspace)).includes('handoff.json'));
    assert.match(await readFile(join(workspace,'build.log'),'utf8'),/Build failed/);
  }
});
