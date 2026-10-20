import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {root,hash,validateBuild,validatePackagedBuild,assemble,noticeInputs,documentInputs,documentMapping,engineIdentity,renderDocument} from '../package.mjs';
import {assertNativeResult,transportResult} from '../check.mjs';
import {acceptedPayload} from '../../release/run.mjs';
import {productionStages,browserCases} from '../../acceptance/contracts.mjs';
import {nativeProbeSql} from '../../build/browser-probe.mjs';
import {runtimeNames,targets,wasmOptions,hostOptions,configureOptions} from '../../build/config.mjs';

export async function fixture(t,key='sqliteVector') {
  assert.equal(key,'sqliteVector');
  const repository=await mkdtemp(join(tmpdir(),'package-composition-'));
  t.after(()=>rm(repository,{recursive:true,force:true}));
  for(const file of ['inputs','tools/package','tools/harness.sh','tools/build/config.mjs','tools/build/vector-extra-init.c.in','tools/harness/package-lock.json','LICENSE','docs']) {
    await mkdir(join(repository,file,'..'),{recursive:true});await cp(join(root,file),join(repository,file),{recursive:true});
  }
  const sourceLockPath='inputs/sqlite-vector.sources.lock.json';
  const lockBytes=await readFile(join(repository,sourceLockPath)), lock=JSON.parse(lockBytes);
  const inputs={lockDigest:{algorithm:'sha256',value:hash(lockBytes)}};
  for(const k of ['sqlite',key])inputs[k]={...lock[k],sourcePath:join(repository,'sources',k),archivePath:join(repository,k+'.zip')};
  const engine={key,version:lock[key].version,upstream:'sqliteai/sqlite-vector'};
  const buildDir=join(repository,'build');await mkdir(buildDir);
  const bridge=join(buildDir,'extra-init.c'),templatePath='tools/build/vector-extra-init.c.in';
  const template=await readFile(join(repository,templatePath),'utf8');
  const bridgeBytes=template.replace('@SQLITE_VECTOR_HEADER@',JSON.stringify(join(inputs[key].sourcePath,'src/sqlite-vector.h')));
  await writeFile(bridge,bridgeBytes);
  const build={tools:Object.fromEntries(['cc','make','emcc','wasm-strip','wasm-opt','node','npm'].map(k=>[k,({emcc:'emcc 4.0.23',node:'v24.19.0',npm:'11.17.0','wasm-strip':'1.0.42','wasm-opt':'wasm-opt version 125'})[k] || 'offline fixture'])),platform:'fixture',configure:['env',...hostOptions,'./configure',...configureOptions],amalgamation:['make','sqlite3.c'],commonWasmOptions:[...targets,...wasmOptions],wasm:['make',...targets,...wasmOptions,'sqlite3_wasm_extra_init.c='+bridge]};
  for(const [field,path] of [['harnessSha256','tools/harness.sh'],['configSha256','tools/build/config.mjs'],['templateSha256',templatePath],['dependencyLockSha256','tools/harness/package-lock.json']])build[field]=hash(await readFile(join(repository,path)));
  {
    const names=['sqlite-vector',...['cpu','avx2','avx512','neon','rvv','sse2'].map(n=>'distance-'+n)];
    const objects=names.map(n=>join(buildDir,n+'.o'));
    build.extensionCommands=names.map((n,i)=>['emcc','-Oz','-std=c99','-fPIC','-DSQLITE_CORE','-DSQLITE_WASM_EXTRA_INIT','-include','strings.h','-I'+inputs.sqlite.sourcePath,'-I'+join(inputs[key].sourcePath,'src'),'-I'+join(inputs[key].sourcePath,'libs'),'-c',join(inputs[key].sourcePath,'src',n+'.c'),'-o',objects[i]]);
    const include=join(buildDir,'vector-inputs.mk'),bytes='# Separate immutable extension inputs; upstream recipes remain intact.\nMAKEFILE := GNUmakefile\nsqlite3-wasm.c.in += '+objects.join(' ')+'\n';
    await writeFile(include,bytes);build.wasm.push('-f','GNUmakefile','-f',include);
    build.integration={bridgeSha256:hash(Buffer.from(bridgeBytes)),makeIncludeSha256:hash(Buffer.from(bytes))};
  }
  const runtimeDirectory=join(repository,'runtime');await mkdir(runtimeDirectory);
  const runtimeFiles=[];
  for(const name of runtimeNames){const bytes=Buffer.from('synthetic '+name);await writeFile(join(runtimeDirectory,name),bytes);runtimeFiles.push({name,size:bytes.length,sha256:hash(bytes)});}
  return {repository,handoff:{schemaVersion:1,inputs,sourceLockPath,engine,build,runtimeDirectory,runtimeFiles},name:'sqlite-vector-wasm-fixture',version:'0.0.0-'+('vector')};
}
