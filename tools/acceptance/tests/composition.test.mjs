import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {root,hash} from '../../package/package.mjs';
import {transportResult} from '../../package/check.mjs';
import {options,production} from '../run.mjs';
import {defaultLock,vectorLock,recordedSelection,assertSelected,assertApplicable,browserCases,productionStages} from '../contracts.mjs';
import {runtimeNames} from '../../build/config.mjs';
import {fixtureEngine,readFixtures} from '../fixtures.mjs';

const selection = async path => recordedSelection(await readFile(join(root,path)),path);
const packaged = s => ({sourceLockPath:s.sourceLockPath,engine:s.engine,lockDigest:{algorithm:'sha256',value:s.sourceLockSha256},
  inputs:Object.fromEntries(['sqlite',s.engine.key].map(k=>[k,{version:s.sourceLock[k].version,digest:s.sourceLock[k].digest}]))});

test('recorded selectors retain default metadata and reject unsafe, unknown, duplicate and partial arguments',()=>{
 assert.deepEqual(options([]),{name:'sqlite-vector-wasm-acceptance-fixture',version:'0.0.0-test'});
 for(const path of [vectorLock]) assert.equal(options(['--lock',path]).lockPath,path);
 assert.deepEqual(options(['--lock',vectorLock,'--version','0.0.1-test','--name','fixture']),{name:'fixture',version:'0.0.1-test',lockPath:vectorLock});
 for(const args of [['--lock','../sources.json'],['--lock','/tmp/lock'],['--lock','unknown'],['--lock',defaultLock,'--lock',vectorLock],['--name','fixture'],['--version','1.0.0'],['--lock'],['--engine','sqliteVector']]) assert.throws(()=>options(args));
});

test('selected handoffs reject the other engine, changed pins/digests/origins and contradictory lock',async()=>{
 for(const path of [vectorLock]){
  const s=await selection(path),p=packaged(s);assertSelected(p,s);
  for(const change of [p=>p.engine.version='wrong',p=>p.sourceLockPath='inputs/unsupported.lock.json',p=>p.lockDigest.value='0'.repeat(64),p=>p.inputs.sqlite.digest.value='0'.repeat(64),p=>p.inputs[s.engine.key].version='wrong',p=>p.inputs[s.engine.key==='sqliteVec'?'sqliteVector':'sqliteVec']={version:'1.1.2'}]){
   const bad=structuredClone(p);change(bad);assert.throws(()=>assertSelected(bad,s));
  }
  const bad=structuredClone(p);bad.sourceOrigins={sqlite:{...s.sourceLock.sqlite,archiveUrl:'wrong'},[s.engine.key]:s.sourceLock[s.engine.key]};assert.throws(()=>assertSelected(bad,s),/origin mismatch/);
  assert.throws(()=>recordedSelection(JSON.stringify(s.sourceLock),'inputs/unsupported.lock.json'));
 }
});

test('both production selections record exact identities before installation and keep package metadata separate',async t=>{
 for(const path of [vectorLock]){
  const repo=await mkdtemp(join(tmpdir(),'acceptance-composition-'));t.after(()=>rm(repo,{recursive:true,force:true}));
  await mkdir(join(repo,'inputs'));await writeFile(join(repo,path),await readFile(join(root,path)));
  let installed=false;
  const run=async(cmd,args)=>{if(cmd==='git')return args[0]==='status'?'':'a'.repeat(40);installed=true;throw Error('Installation boundary reached');};
  await assert.rejects(()=>production({repository:repo,metadata:options(['--lock',path]),run}),/Installation boundary reached/);
  assert.equal(installed,true);
  const [dir]=await readdir(join(repo,'.work/acceptance'));const r=JSON.parse(await readFile(join(repo,'.work/acceptance',dir,'acceptance.json')));
  assert.equal(r.sourceLockPath,path);assert.deepEqual(r.engine,(await selection(path)).engine);assert.deepEqual(r.package,options([]));assert.equal(r.stages.install.status,'failed');
  t.after(()=>rm(r.toolsDirectory.replace(/\/tools$/,''),{recursive:true,force:true}));
 }
});

test('applicability binds selected engine/lock to browser evidence and rejects cross-composition passes',async()=>{
 for(const path of [vectorLock]){
  const s=await selection(path), p=packaged(s), revision='a'.repeat(40), archive={size:3,sha256:hash('abc')};
  const browser={schemaVersion:1,...s,browser:'observed fixture',hosting:{secureContext:true,crossOriginIsolated:true},runtimeFiles:runtimeNames.map(name=>({name})),cases:Object.fromEntries(browserCases.map(n=>[n,{status:'passed'}])),packaging:p};
  const report={schemaVersion:1,...s,verdict:'passed',source:{commit:revision,dirty:false},archive,browserResults:browser,stages:Object.fromEntries(productionStages.map(n=>[n,{status:'passed'}]))};
  assertApplicable(report,revision,archive);
  for(const change of [r=>delete r.sourceLock,r=>r.engine.version='wrong',r=>r.sourceLockPath='inputs/unsupported.lock.json',r=>r.browserResults.engine.key='wrong',r=>delete r.browserResults.engine,r=>r.browserResults.sourceLockSha256='0'.repeat(64),r=>r.browserResults.packaging.inputs[s.engine.key].version='wrong']){
   const bad=structuredClone(report);change(bad);assert.throws(()=>assertApplicable(bad,revision,archive));
  }
 }
});

test('fresh read rejects missing vectors before native initialization and rejects initialization that changes stored values',()=>{
 assert.throws(()=>fixtureEngine('other'));
 let initialized=false;
 const missing={selectArrays(sql){if(sql.includes('FROM bits'))throw Error('no such table: bits');return [];},exec(){initialized=true;}};
 assert.throws(()=>readFixtures(missing,'sqliteVector'),/no such table/);assert.equal(initialized,false);
 const changed={selectArrays(){return initialized?[[1,'changed']]:[[1,'original']];},exec(){initialized=true;}};
 assert.throws(()=>readFixtures(changed,'sqliteVector'),/changed stored fixtures/);
});

test('Vector transport rejects legacy callers and preserves registration observations',()=>{
 const vector={key:'sqliteVector',version:'1.1.2'},rows=[['3.54.0','1.1.2',0]];
 const r={versions:rows,sqlRows:rows,neighbors:[[1,0],[2,Math.SQRT2]]};
 assert.deepEqual(transportResult(r,'3.54.0',vector).sqlRows,rows);
 for(const old of ['0.1.9',{key:'sqliteVec',version:'0.1.9'}])assert.throws(()=>transportResult(r,'3.54.0',old));
});

const ci=env=>spawnSync('python3',[join(root,'tools/acceptance/ci.py')],{encoding:'utf8',env:{...process.env,...env}});
test('required aggregate fails on scope, composition, cancellation or upload failures; only actual site-only skips pass',()=>{
 for(const result of ['failure','cancelled','skipped','', 'pending'])assert.notEqual(ci({CI_ACTION:'complete',SCOPE_RESULT:'success',REQUIRED:'true',COMPOSITION_RESULT:result}).status,0);
 assert.equal(ci({CI_ACTION:'complete',SCOPE_RESULT:'success',REQUIRED:'true',COMPOSITION_RESULT:'success'}).status,0);
 assert.equal(ci({CI_ACTION:'complete',SCOPE_RESULT:'success',REQUIRED:'false',COMPOSITION_RESULT:'skipped'}).status,0);
 for(const scope of ['failure','cancelled',''])assert.notEqual(ci({CI_ACTION:'complete',SCOPE_RESULT:scope,REQUIRED:'false',COMPOSITION_RESULT:'skipped'}).status,0);
});
test('workflow qualifies Vector once with exact lock wiring and fail-closed aggregate',async()=>{
 const s=await readFile(join(root,'.github/workflows/acceptance.yml'),'utf8');
 assert.doesNotMatch(s,/matrix:|source_lock:/);
 assert.match(s,/needs: \[scope, composition\]\n    if: always\(\)/);
 assert.match(s,/SOURCE_LOCK: inputs\/sqlite-vector.sources.lock.json/);
 assert.match(s,/COMPOSITION_RESULT: \$\{\{ needs.composition.result \}\}/);
 assert.match(s,/if-no-files-found: error/);
});
