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

import {fixture} from './fixture.mjs';

test('the Vector composition retain exact compact fields, selected documents/notices and portable commands',async t=>{
  for(const key of ['sqliteVector']){
    const f=await fixture(t,key), result=await assemble(f);
    const get=async name=>JSON.parse(await readFile(join(result.runtimeDirectory,name)));
    const m=await get('runtime.json'),p=await get('package.json'),origins=await get('licenses/origins.json');
    assert.deepEqual(Object.keys(m.inputs).sort(),['sqlite',key].sort());
    for(const k of ['sqlite',key])assert.deepEqual(m.inputs[k],{version:f.handoff.inputs[k].version,digest:f.handoff.inputs[k].digest});
    assert.deepEqual(m.engine,f.handoff.engine);assert.equal(m.sourceLockPath,f.handoff.sourceLockPath);
    assert.ok(!JSON.stringify(m).includes(f.repository));
    assert.ok(!p.scripts&&!p.dependencies);assert.match(p.description,/SQLite-Vector/);
    assert.equal(origins.notices.length,10);
    assert.equal(origins.notices.some(n=>n.project==='sqliteVec'),false);
    assert.equal(origins.notices.some(n=>n.project==='fp16'),key==='sqliteVector');
    const mapping=documentMapping(f.handoff.engine);assert.equal(new Set(mapping.map(x=>x[1])).size,mapping.length);
    for(const [source,destination]of mapping){
      const record=result.documents.find(x=>x.source===source && x.destination===destination);
      assert.equal(record.sourceSha256,hash(await readFile(join(f.repository,source))));
      assert.equal(record.sha256,result.files.find(x=>x.name===destination).sha256);
      if(!source.startsWith('docs/sqlite-vector/'))assert.equal(record.sha256,record.sourceSha256);
      else {assert.notEqual(record.sha256,record.sourceSha256);assert.deepEqual(record.identity,result.package);}
    }
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
 await assert.rejects(noticeInputs({inputs:{sqliteVec:{version:'0.1.9'}}},f.repository));
});

test('documentation rejects missing, wrong-engine, linked and broken source/output references without fallback',async t=>{
 for(const kind of ['missing','wrong-engine','symlink','parent-symlink','broken','unsafe','anchor']){
  const f=await fixture(t),path=join(f.repository,'docs/sqlite-vector/usage.md');
  if(kind==='missing')await rm(path);
  if(kind==='wrong-engine')await writeFile(path,'# sqlite-vec usage\n');
  if(kind==='symlink'){await rm(path);await symlink(join(f.repository,'docs/common/browser.md'),path);}
  if(kind==='parent-symlink'){await rm(join(f.repository,'docs/sqlite-vector'),{recursive:true});await symlink(join(f.repository,'docs/common'),join(f.repository,'docs/sqlite-vector'));}
  if(['broken','unsafe','anchor'].includes(kind))await writeFile(path,(await readFile(path,'utf8'))+'\n[bad]('+({broken:'missing.md',unsafe:'../../../../outside',anchor:'#absent'}[kind])+')\n');
  await assert.rejects(documentInputs(f.handoff,f.repository,{name:f.name,version:f.version}));
 }
});

test('native Worker1/promiser assertions cover Vector and obsolete-caller rejection and failure companions',()=>{
 for(const vector of [{key:'sqliteVector',version:'1.1.2'}]){
  const sql=nativeProbeSql(vector),r={versions:[['3.54.0',sql.expectedVersion,0]],neighbors:[[1,0],[2,Math.SQRT2]]};
  assertNativeResult(r,'3.54.0',vector);
  for(const mutate of [r=>r.versions[0][0]='wrong',r=>r.versions[0][1]+='-pre',r=>r.versions[0][2]=1,r=>r.neighbors.pop(),r=>r.neighbors.reverse(),r=>r.neighbors[1][1]=1]){const bad=structuredClone(r);mutate(bad);assert.throws(()=>assertNativeResult(bad,'3.54.0',vector));}
 }
 assert.throws(()=>nativeProbeSql({key:'unknown'}));
 assert.throws(()=>engineIdentity({inputs:{sqliteVec:{},sqliteVector:{}}}));
});


test('consumed Vector archives remain independently verifiable after generated inputs are removed',async t=>{
 for(const key of ['sqliteVector']) {
  const f=await fixture(t,key), packaged=await assemble(f);
  const changed=await assemble({...f,name:f.name+'-renamed',version:'0.0.1-repair'});
  assert.notEqual(changed.workspace,packaged.workspace);
  assert.notEqual(changed.archive.sha256,packaged.archive.sha256);
  assert.deepEqual(changed.runtimeFiles,packaged.runtimeFiles);
  const bundle=join(f.repository,'bundle');await mkdir(bundle);
  await cp(packaged.archive.path,join(bundle,'payload.tgz'));
  const lock=await readFile(join(f.repository,f.handoff.sourceLockPath));
  const commit='a'.repeat(40);
  // Synthetic acceptance envelope isolates payload-consumption controls only.
  const report={schemaVersion:1,verdict:'passed',package:packaged.package,source:{commit,dirty:false},archive:packaged.archive,
   sourceLock:JSON.parse(lock),sourceLockSha256:hash(lock),runtimeFiles:f.handoff.runtimeFiles,build:f.handoff.build,
   stages:Object.fromEntries(productionStages.map(n=>[n,{status:'passed'}])),browserResults:{schemaVersion:1,browser:'synthetic control record',hosting:{secureContext:true,crossOriginIsolated:true},runtimeFiles:f.handoff.runtimeFiles,cases:Object.fromEntries(browserCases.map(n=>[n,{status:'passed'}]))}};
  for(const [name,value]of [['build',f.handoff],['package',packaged],['acceptance',report]])await writeFile(join(bundle,name+'.json'),JSON.stringify(value,null,2)+'\n');
  await rm(join(f.repository,'build'),{recursive:true});await rm(f.handoff.runtimeDirectory,{recursive:true});
  const retained={...f.handoff,runtimeDirectory:packaged.runtimeDirectory};
  await assert.rejects(validateBuild(retained,f.repository),e=>e.code==='ENOENT');
  assert.equal((await validatePackagedBuild(retained,f.repository)).size,runtimeNames.length);
  const verify=()=>acceptedPayload({bundle,identity:packaged.package,commit,repository:f.repository});
  assert.equal((await verify()).archive.sha256,packaged.archive.sha256);
  const badDocuments=structuredClone(packaged);badDocuments.documents[0].sourceSha256='0'.repeat(64);
  await writeFile(join(bundle,'package.json'),JSON.stringify(badDocuments));
  await assert.rejects(verify(),/Packaged document provenance mismatch/);
  await writeFile(join(bundle,'package.json'),JSON.stringify(packaged));
  const wrongEngine=structuredClone(packaged);wrongEngine.engine.key='contradictory';
  await writeFile(join(bundle,'package.json'),JSON.stringify(wrongEngine));
  await assert.rejects(verify(),/Packaged engine identity/);
  await writeFile(join(bundle,'package.json'),JSON.stringify(packaged));
  const tampered=structuredClone(f.handoff);tampered.build.platform='changed record';
  await writeFile(join(bundle,'build.json'),JSON.stringify(tampered));
  await assert.rejects(verify(),/Consumed build handoff identity/);
  await writeFile(join(bundle,'build.json'),JSON.stringify(f.handoff));
  const wrong=structuredClone(retained);wrong.inputs[key].version+='-changed';
  await assert.rejects(validatePackagedBuild(wrong,f.repository));
  if(key==='sqliteVector') {
   const bad=structuredClone(retained);bad.build.integration.makeIncludeSha256='0'.repeat(64);
   await assert.rejects(validatePackagedBuild(bad,f.repository),/Wrong integration hashes/);
  }
 }
});


test('Worker1/promiser reports use native Vector rows and reject obsolete callers',()=>{
 const vector={key:'sqliteVector',version:'1.1.2'},versions=[['3.54.0','1.1.2',0]];
 const observed={versions,sqlRows:versions,neighbors:[[1,0],[2,Math.SQRT2]]};
 assert.deepEqual(transportResult(observed,'3.54.0',vector).registrationRows,versions);
 for(const old of ['0.1.9',{key:'sqliteVec',version:'0.1.9'}]) assert.throws(()=>transportResult(observed,'3.54.0',old));
 const bad=structuredClone(observed);bad.versions[0][2]=1;
 assert.throws(()=>transportResult(bad,'3.54.0',vector));
});

test('Vector archive documents follow supplied identity and changed upstreams without invented publication', async t=>{
 const f=await fixture(t),first=await assemble({...f,name:'@at-rama/sqlite-vector-wasm',version:'0.3.0'});
 const second=await assemble({...f,name:'@at-rama/sqlite-vector-wasm',version:'0.3.1'});
 const get=async(p,n)=>readFile(join(p.runtimeDirectory,n),'utf8');
 assert.match(await get(first,'README.md'),/Prepared archive: `@at-rama\/sqlite-vector-wasm@0\.3\.0`/);
 assert.match(await get(second,'README.md'),/@0\.3\.1`/);
 assert.notEqual(first.archive.sha256,second.archive.sha256);assert.deepEqual(first.runtimeFiles,second.runtimeFiles);
 assert.match(await get(first,'docs/usage.md'),/vector_init.*vector_full_scan/s);
 assert.doesNotMatch(await get(first,'README.md'),/has no published npm release|0\.0\.0-vector/);
 const local=await assemble(f);assert.match(await get(local,'README.md'),/Unpublished local package/);
 const source=await readFile(join(f.repository,'docs/sqlite-vector/usage.md'));
 const next=structuredClone(f.handoff);next.inputs.sqlite.version='3.54.1';next.inputs.sqliteVector.version='1.1.3-alpha.1';next.engine.version=next.inputs.sqliteVector.version;
 const changed=renderDocument(source,next,{name:f.name,version:'0.4.0-alpha.1'}).toString();
 assert.match(changed,/SQLite \*\*3\.54\.1\*\* with SQLite-Vector \*\*1\.1\.3-alpha\.1\*\*/);
 assert.doesNotMatch(changed,/3\.54\.0|1\.1\.2/);
 await writeFile(join(f.repository,'docs/sqlite-vector/README.md'),'# SQLite WASM with SQLite-Vector\nThis composition has no published npm release.');
 await assert.rejects(assemble(f),/Stale fixture-only document/);
});
