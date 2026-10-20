import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root, hash, assemble } from '../../package/package.mjs';
import { runtimeNames,targets,wasmOptions,hostOptions,configureOptions } from '../../build/config.mjs';
import { productionStages, browserCases } from '../../acceptance/contracts.mjs';

// Synthetic runtime/acceptance records exercise controls, never qualify a product.
export async function releaseFixture(t, { version = '0.1.0', name = '@at-rama/sqlite-vector-wasm', engine = 'sqliteVector' } = {}) {

  return vectorFixture(t, {version,name});
}

export function syntheticAttestation(evidence) {
  return {verificationMaterial:{synthetic:true},dsseEnvelope:{signatures:[{sig:'synthetic'}],payload:Buffer.from(JSON.stringify({predicateType:'https://slsa.dev/provenance/v1',subject:[{name:'payload.tgz',digest:{sha256:evidence.archive.sha256}}],predicate:{buildDefinition:{resolvedDependencies:[{digest:{gitCommit:evidence.commit}}]}}})).toString('base64')}};
}

async function vectorFixture(t,{version,name}) {
  const key='sqliteVector';
  const repository=await mkdtemp(join(tmpdir(),'package-composition-'));
  t.after(()=>rm(repository,{recursive:true,force:true}));
  for(const file of ['inputs','tools/package','tools/harness.sh','tools/build/config.mjs','tools/build/vector-extra-init.c.in','tools/harness/package-lock.json','LICENSE','docs']) {
    await mkdir(join(repository,file,'..'),{recursive:true});await cp(join(root,file),join(repository,file),{recursive:true});
  }
  const sourceLockPath='inputs/sqlite-vector.sources.lock.json';
  const lockBytes=await readFile(new URL('./vector-lock.json',import.meta.url)), lock=JSON.parse(lockBytes);
  await writeFile(join(repository,sourceLockPath),lockBytes);
  const noticesPath=join(repository,'tools/package/notices.json');
  const notices=JSON.parse(await readFile(noticesPath));
  for(const notice of notices.notices) {
    if(notice.project==='sqlite') notice.version=lock.sqlite.version;
    if(notice.project==='sqliteVector') {
      notice.version=lock.sqliteVector.version; notice.source.commit=lock.sqliteVector.commit;
      notice.origin=`https://github.com/sqliteai/sqlite-vector/blob/${lock.sqliteVector.commit}/LICENSE.md`;
    }
  }
  await writeFile(noticesPath,JSON.stringify(notices,null,2)+'\n');
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
  const constructed={schemaVersion:1,inputs,sourceLockPath,engine,build,runtimeDirectory,runtimeFiles};
  const packaged=await assemble({handoff:constructed,repository,name,version});
  const bundle=join(repository,'bundle');await mkdir(bundle);await cp(packaged.archive.path,join(bundle,'payload.tgz'));
  const commit='a'.repeat(40);
  const selected={engine,sourceLockPath,sourceLock:lock,sourceLockSha256:hash(lockBytes)};
  const report={schemaVersion:1,...selected,verdict:'passed',package:packaged.package,source:{commit,dirty:false},archive:packaged.archive,runtimeFiles,build,
    stages:Object.fromEntries(productionStages.map(n=>[n,{status:'passed'}])),
    browserResults:{schemaVersion:1,...selected,browser:'synthetic browser record',hosting:{secureContext:true,crossOriginIsolated:true},runtimeFiles,cases:Object.fromEntries(browserCases.map(n=>[n,{status:'passed'}])),packaging:packaged}};
  for(const [n,value] of [['acceptance',report],['package',packaged],['build',constructed]])await writeFile(join(bundle,n+'.json'),JSON.stringify(value,null,2)+'\n');
  return {repository,bundle,report,packaged,constructed,context:{commit,repository:'a/b',selection:{sqlite:lock.sqlite.version,sqliteVector:lock.sqliteVector.version},comment:'reviewed rollback explanation'}};

}
