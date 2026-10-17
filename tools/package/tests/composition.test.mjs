import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {root,hash,validateBuild,assemble,noticeInputs,documentInputs,documentMapping,engineIdentity} from '../package.mjs';
import {assertNativeResult} from '../check.mjs';
import {nativeProbeSql} from '../../build/browser-probe.mjs';
import {runtimeNames,targets,wasmOptions,hostOptions,configureOptions} from '../../build/config.mjs';

async function fixture(t,key='sqliteVector') {
  const repository=await mkdtemp(join(tmpdir(),'package-composition-'));
  t.after(()=>rm(repository,{recursive:true,force:true}));
  for(const file of ['inputs','tools/package','tools/harness.sh','tools/build/config.mjs','tools/build/extra-init.c.in','tools/build/vector-extra-init.c.in','tools/harness/package-lock.json','LICENSE','docs']) {
    await mkdir(join(repository,file,'..'),{recursive:true});await cp(join(root,file),join(repository,file),{recursive:true});
  }
  const sourceLockPath=key==='sqliteVec'?'inputs/sources.lock.json':'inputs/sqlite-vector.sources.lock.json';
  const lockBytes=await readFile(join(repository,sourceLockPath)), lock=JSON.parse(lockBytes);
  const inputs={lockDigest:{algorithm:'sha256',value:hash(lockBytes)}};
  for(const k of ['sqlite',key])inputs[k]={...lock[k],sourcePath:join(repository,'sources',k),archivePath:join(repository,k+'.zip')};
  const engine={key,version:lock[key].version,upstream:key==='sqliteVec'?'asg017/sqlite-vec':'sqliteai/sqlite-vector'};
  const buildDir=join(repository,'build');await mkdir(buildDir);
  const bridge=join(buildDir,'extra-init.c'),templatePath=key==='sqliteVec'?'tools/build/extra-init.c.in':'tools/build/vector-extra-init.c.in';
  const template=await readFile(join(repository,templatePath),'utf8');
  const bridgeBytes=template.replace(key==='sqliteVec'?'@SQLITE_VEC_SOURCE@':'@SQLITE_VECTOR_HEADER@',JSON.stringify(join(inputs[key].sourcePath,key==='sqliteVec'?'sqlite-vec.c':'src/sqlite-vector.h')));
  await writeFile(bridge,bridgeBytes);
  const build={tools:Object.fromEntries(['cc','make','emcc','wasm-strip','wasm-opt','node','npm'].map(k=>[k,({emcc:'emcc 4.0.23',node:'v24.19.0',npm:'11.17.0','wasm-strip':'1.0.42','wasm-opt':'wasm-opt version 125'})[k] || 'offline fixture'])),platform:'fixture',configure:['env',...hostOptions,'./configure',...configureOptions],amalgamation:['make','sqlite3.c'],commonWasmOptions:[...targets,...wasmOptions],wasm:['make',...targets,...wasmOptions,'sqlite3_wasm_extra_init.c='+bridge]};
  for(const [field,path] of [['harnessSha256','tools/harness.sh'],['configSha256','tools/build/config.mjs'],['templateSha256',templatePath],['dependencyLockSha256','tools/harness/package-lock.json']])build[field]=hash(await readFile(join(repository,path)));
  if(key==='sqliteVector') {
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
  return {repository,handoff:{schemaVersion:1,inputs,sourceLockPath,engine,build,runtimeDirectory,runtimeFiles},name:'sqlite-vector-wasm-fixture',version:'0.0.0-'+(key==='sqliteVec'?'vec':'vector')};
}

test('both annotated compositions retain exact compact fields, selected documents/notices and portable commands',async t=>{
  for(const key of ['sqliteVec','sqliteVector']){
    const f=await fixture(t,key), result=await assemble(f);
    const get=async name=>JSON.parse(await readFile(join(result.runtimeDirectory,name)));
    const m=await get('runtime.json'),p=await get('package.json'),origins=await get('licenses/origins.json');
    assert.deepEqual(Object.keys(m.inputs).sort(),['sqlite',key].sort());
    for(const k of ['sqlite',key])assert.deepEqual(m.inputs[k],{version:f.handoff.inputs[k].version,digest:f.handoff.inputs[k].digest});
    assert.deepEqual(m.engine,f.handoff.engine);assert.equal(m.sourceLockPath,f.handoff.sourceLockPath);
    assert.ok(!JSON.stringify(m).includes(f.repository));
    assert.ok(!p.scripts&&!p.dependencies);assert.match(p.description,key==='sqliteVec'?/sqlite-vec/:/SQLite-Vector/);
    assert.equal(origins.notices.length,10);
    assert.equal(origins.notices.some(n=>n.project===(key==='sqliteVec'?'sqliteVector':'sqliteVec')),false);
    assert.equal(origins.notices.some(n=>n.project==='fp16'),key==='sqliteVector');
    const mapping=documentMapping(f.handoff.engine);assert.equal(new Set(mapping.map(x=>x[1])).size,mapping.length);
    for(const [source,destination]of mapping)assert.equal(hash(await readFile(join(f.repository,source))),result.files.find(x=>x.name===destination).sha256);
    await rm(join(f.repository,'sources'),{recursive:true,force:true});await rm(join(f.repository,'build'),{recursive:true});
    for(const item of result.files)assert.equal(hash(await readFile(join(result.runtimeDirectory,item.name))),item.sha256);
  }
});

test('annotated selection rejects ambiguity, suffix/origin/lock/template/recipe/integration contradictions',async t=>{
 const f=await fixture(t);
 for(const mutate of [h=>delete h.engine,h=>delete h.sourceLockPath,h=>h.sourceLockPath='../inputs/x',h=>h.sourceLockPath='inputs/sources.lock.json',h=>h.engine.key='sqliteVec',h=>h.inputs.sqliteVec={version:'0.1.9'},h=>h.inputs.sqliteVector.version+='-pre',h=>h.inputs.sqliteVector.commit='0'.repeat(40),h=>h.inputs.sqlite.archiveUrl+='?other',h=>h.build.templateSha256='0'.repeat(64),h=>h.build.integration.bridgeSha256='0'.repeat(64),h=>h.build.extensionCommands.pop(),h=>h.build.extensionCommands[0][1]='-O3',h=>h.build.wasm.pop(),h=>h.build.configure.push('--extra'),h=>h.build.tools.emcc='4.0.230',h=>h.build.tools.node='v24.18.0',h=>h.build.tools.npm='other',h=>h.build.tools['wasm-strip']='wrong',h=>h.build.tools['wasm-opt']='wasm-opt version 126']){
  const h=structuredClone(f.handoff);mutate(h);await assert.rejects(validateBuild(h,f.repository));
 }
 const bridge=f.handoff.build.wasm.find(x=>x.startsWith('sqlite3_wasm_extra_init.c=')).split('=')[1];
 await writeFile(bridge,'wrong engine');await assert.rejects(validateBuild(f.handoff,f.repository));
});

test('selected dependency notices require exact immutable association, header identities and original text',async t=>{
 const f=await fixture(t),path=join(f.repository,'tools/package/notices.json'), original=JSON.parse(await readFile(path));
 for(const mutate of [d=>d.notices.pop(),d=>d.notices.find(n=>n.project==='fp16').source.commit='unestablished',d=>delete d.notices.find(n=>n.project==='fp16').incorporatedHeaders,d=>d.notices.find(n=>n.project==='sqliteVector').project='sqliteVec']){
  const d=structuredClone(original);mutate(d);await writeFile(path,JSON.stringify(d));await assert.rejects(noticeInputs(f.handoff,f.repository));
 }
 await writeFile(path,JSON.stringify(original));await writeFile(join(f.repository,'tools/package/notices/FP16-MIT.txt'),'altered');await assert.rejects(noticeInputs(f.handoff,f.repository));
 const vec=await fixture(t,'sqliteVec'),lock=JSON.parse(await readFile(join(vec.repository,'inputs/sources.lock.json')));
 assert.equal((await noticeInputs({inputs:lock},vec.repository)).has('licenses/FP16-MIT.txt'),false);
});

test('documentation rejects missing, wrong-engine, linked and broken source/output references without fallback',async t=>{
 for(const kind of ['missing','wrong-engine','symlink','parent-symlink','broken','unsafe','anchor']){
  const f=await fixture(t),path=join(f.repository,'docs/sqlite-vector/usage.md');
  if(kind==='missing')await rm(path);
  if(kind==='wrong-engine')await cp(join(f.repository,'docs/sqlite-vec/usage.md'),path);
  if(kind==='symlink'){await rm(path);await symlink(join(f.repository,'docs/sqlite-vec/usage.md'),path);}
  if(kind==='parent-symlink'){await rm(join(f.repository,'docs/sqlite-vector'),{recursive:true});await symlink(join(f.repository,'docs/sqlite-vec'),join(f.repository,'docs/sqlite-vector'));}
  if(['broken','unsafe','anchor'].includes(kind))await writeFile(path,(await readFile(path,'utf8'))+'\n[bad]('+({broken:'missing.md',unsafe:'../../../../outside',anchor:'#absent'}[kind])+')\n');
  await assert.rejects(documentInputs(f.handoff,f.repository));
 }
});

test('native Worker1/promiser assertions cover both engines, legacy caller and failure companions',()=>{
 for(const vector of ['0.1.9',{key:'sqliteVec',version:'0.1.9'},{key:'sqliteVector',version:'1.1.2'}]){
  const sql=nativeProbeSql(vector),r={versions:[['3.54.0',sql.expectedVersion,0]],neighbors:[[1,0],[2,Math.SQRT2]]};
  assertNativeResult(r,'3.54.0',vector);
  for(const mutate of [r=>r.versions[0][0]='wrong',r=>r.versions[0][1]+='-pre',r=>r.versions[0][2]=1,r=>r.neighbors.pop(),r=>r.neighbors.reverse(),r=>r.neighbors[1][1]=1]){const bad=structuredClone(r);mutate(bad);assert.throws(()=>assertNativeResult(bad,'3.54.0',vector));}
 }
 assert.throws(()=>nativeProbeSql({key:'unknown'}));
 assert.throws(()=>engineIdentity({inputs:{sqliteVec:{},sqliteVector:{}}}));
});
