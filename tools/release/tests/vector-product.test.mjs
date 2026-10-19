import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {calculate,componentReferences} from '../policy.mjs';
import {descriptor,integratedContext} from '../context.mjs';
import {publicationIdentity,readState} from '../state.mjs';
import {qualify,acceptedPayload,provenance,publish,checkInitialCompletion} from '../run.mjs';
import {releaseFixture,syntheticAttestation} from './fixture.mjs';
const commit='a'.repeat(40);
const vec=(sqliteVec='0.1.9',sqlite='3.54.0')=>({sqlite,sqliteVec});
const vector=(sqliteVector='1.1.2',sqlite='3.54.0')=>({sqlite,sqliteVector});
function state(latest='0.2.4',next=null,stablePair=vec(),nextPair=vec('0.2.0-alpha.1')) {
 const s={schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}};
 for(const [channel,version,upstreams] of [['latest',latest,stablePair],['next',next,nextPair]])if(version){s.heads[channel]={version,commit,upstreams};s.tags.push('dist/v'+version);s.releaseTags.push('dist/v'+version);s.npmVersions.push(version);}return s;
}
const calc=(selection,snapshot=state(),comment='')=>calculate({selection,snapshot,comment});
const clean=(cmd,args)=>Promise.resolve(cmd==='git'&&args[0]==='rev-parse'?commit:'');
const ok=data=>({status:200,headers:{},data});

test('transition MINOR, ordinary Vector deltas/maturity and immutable deterministic inputs',()=>{
 const input={selection:vector(),snapshot:state()};const before=structuredClone(input);Object.freeze(input.selection);
 const r=calculate(input);assert.equal(r.version,'0.3.0');assert.equal(r.signal,'MINOR');assert.equal(r.initial,false);assert.equal(r.rollback,false);assert.equal(r.transition,true);assert.equal(r.componentReferences.sqliteVector,null);
 assert.deepEqual(calculate(input),r);assert.deepEqual(input,before);
 for(const [selected,stable,expected] of [[vector('1.1.3'),vector(),'0.3.1'],[vector('1.2.0'),vector(),'0.4.0'],[vector('2.0.0'),vector(),'1.0.0'],[vector('0.2.0','4.0.0'),vector('0.1.0'),'0.4.0'],[vector('1.0.0'),vector('0.2.0'),'1.0.0']])assert.equal(calc(selected,state('0.3.0',null,stable)).version,expected);
 assert.throws(()=>calc(vector('0.1.0'),state('1.0.0',null,vector()),'rollback'),/Maturity/);
 assert.throws(()=>calc(vector(),state('1.0.0')),/0.x/);
 for(const key of ['tags','npmVersions','releaseTags']){const s=state();s[key].push(key==='npmVersions'?'0.3.0':'dist/v0.3.0');assert.throws(()=>calc(vector(),s),/collision/);}
 for(const mutate of [s=>delete s.npmVersions,s=>s.heads.latest.commit='bad',s=>s.heads.latest.upstreams.sqliteVector='1.1.2',s=>s.heads.latest=null]){const s=state();mutate(s);assert.throws(()=>calc(vector(),s));}
});

test('transition alpha bases absent, equal, higher, closed and normal same-engine bases',()=>{
 for(const [snapshot,selection,expected,base] of [
 [state(),vector('1.1.3-alpha.1'),'0.3.0-alpha.1','0.3.0'],
 [state('0.2.0','0.3.0-alpha.2'),vector('1.1.3-alpha.1'),'0.3.0-alpha.3','0.3.0'],
 [state('0.2.0','0.4.0-alpha.2'),vector('1.1.3-alpha.1'),'0.4.0-alpha.3','0.3.0'],
 [state('0.2.0','0.2.1-alpha.2'),vector('1.1.3-alpha.1'),'0.3.0-alpha.1','0.3.0'],
 [state('0.2.4','0.2.0-alpha.2'),vector('1.1.3-alpha.1'),'0.3.0-alpha.1','0.3.0'],
 [state('0.3.0','0.3.0-alpha.3',vector(),vector('1.1.2-alpha.1')),vector('1.1.3-alpha.1'),'0.3.1-alpha.1','0.3.1'],
 [state('0.3.0','0.5.0-alpha.2',vector(),vector('1.1.3-alpha.1')),vector('1.2.0-alpha.1'),'0.5.0-alpha.3','0.4.0'],
 [state('0.3.0','0.3.1-alpha.2',vector(),vector('1.1.3-alpha.1')),vector('2.0.0-alpha.1'),'1.0.0-alpha.1','1.0.0']]){const r=calc(selection,snapshot);assert.equal(r.version,expected);assert.equal(r.requiredBase,base);}
});

test('component references preserve SQLite channel and same-engine Vector fallback; comments are data',()=>{
 const s=state('0.3.0','0.4.0-alpha.2',vector('1.2.0'),vec('0.2.0-alpha.1','3.55.0'));
 const selected=vector('1.1.3-alpha.1','3.55.0');const refs=componentReferences(selected,s);
 assert.equal(refs.sqlite.version,'0.4.0-alpha.2');assert.equal(refs.sqliteVector.version,'0.3.0');
 assert.throws(()=>calc(selected,s),/rollback/);assert.equal(calc(selected,s,'$(data)').rollback,true);
 const beforeStable=state('0.2.0','0.3.0-alpha.2',vec(),vector('1.1.3-alpha.2'));
 assert.equal(componentReferences(selected,beforeStable).sqliteVector.version,'0.3.0-alpha.2');assert.throws(()=>calc(selected,beforeStable),/rollback/);
 assert.throws(()=>calc(vector('1.1.2','3.53.0')),/rollback/);assert.equal(calc(vector('1.1.2','3.53.0'),state(),'older SQLite').rollback,true);
 assert.equal(calc(vector('1.1.3-alpha.1'),state('0.2.0','0.4.0-alpha.2')).componentReferences.sqliteVector,null);
});

test('integrated Vector descriptor is fixed to recorded lock and exact human/run/repository/revision evidence',async()=>{
 const lock=JSON.parse(await readFile(new URL('./vector-lock.json',import.meta.url)));
 const d={schemaVersion:2,...vector(),releaseComment:'$(data)',preparation:{runId:17,url:'https://github.com/a/b/actions/runs/17'}};
 assert.equal(descriptor(d,lock).comment,'$(data)');
 const pr={number:1,merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:'a/b'}},merge_commit_sha:commit,changed_files:1};
 const event={action:'closed',repository:{full_name:'a/b'},pull_request:pr};
 const invoke=({value=d,pins=lock,changes={},run={id:17,html_url:d.preparation.url,repository:{full_name:'a/b'}},files=[{filename:'inputs/release.json',status:'modified'}]}={})=>integratedContext({repository:'a/b',event,get:async url=>ok(url.includes('/actions/runs/')?run:url.includes('/files?')?files:{...pr,...changes}),readAt:async(revision,path)=>{assert.equal(revision,commit);assert.ok(['inputs/release.json','inputs/sqlite-vector.sources.lock.json'].includes(path));return JSON.stringify(path.endsWith('.lock.json')?pins:value);}});
 assert.deepEqual((await invoke()).selection,vector());
 for(const value of [{...d,sqliteVector:'1.1.3'},{...d,sqlite:'3.55.0'},{...d,sqliteVec:'0.1.9'},{...d,schemaVersion:1},{...d,preparation:{runId:18,url:d.preparation.url}},{...d,preparation:{runId:17,url:'https://github.com/c/d/actions/runs/17'}},{...d,preparation:{runId:0,url:d.preparation.url}}])await assert.rejects(invoke({value}));
 for(const run of [{id:18},{id:17,html_url:d.preparation.url,repository:{full_name:'c/d'}},{id:17,html_url:'https://github.com/a/b/actions/runs/18',repository:{full_name:'a/b'}}])await assert.rejects(invoke({run}));
 await assert.rejects(invoke({pins:{schemaVersion:1,sqlite:lock.sqlite,sqliteVec:{version:'0.1.9'}}}));
 for(const changes of [{merged_by:{type:'Bot'}},{merge_commit_sha:'b'.repeat(40)},{changed_files:2},{changed_files:3001},{base:{ref:'other',repo:{full_name:'a/b'}}}])await assert.rejects(invoke({changes}));
 await assert.rejects(invoke({files:[{filename:'README.md',status:'modified'}]}));
});

async function qualified(t) {
 const f=await releaseFixture(t,{version:'0.3.0'});
 const handoff=await qualify({...f,readSnapshot:async()=>state(),produce:async({lockPath,metadata})=>{assert.equal(lockPath,'inputs/sqlite-vector.sources.lock.json');assert.deepEqual(metadata,{name:'@at-rama/sqlite-vector-wasm',version:'0.3.0'});return {bundle:f.bundle};},run:clean});
 return {...f,handoff,evidence:JSON.parse(await readFile(handoff.evidencePath))};
}

test('Vector retained archive, explicit production selection, exact sources and transition notice are rechecked',async t=>{
 const f=await qualified(t);await rm(f.constructed.runtimeDirectory,{recursive:true});await rm(join(f.repository,'build'),{recursive:true});
 const a=await acceptedPayload({...f,identity:f.handoff.identity,commit});assert.equal(a.archive.sha256,f.evidence.archive.sha256);
 assert.equal(f.evidence.engine.upstream,'sqliteai/sqlite-vector');assert.equal(f.evidence.upstreams.sqliteVector,'1.1.2');
 for(const text of ['BREAKING CHANGE','vec0/vec_*','SQLite-Vector replaces sqlite-vec','No automatic database migration',f.context.comment])assert.ok(f.handoff.notes.includes(text));
 assert.equal(provenance(f.context,{...f.handoff.identity,transition:false},a).notes.includes('BREAKING CHANGE'),false);
 const attempts=[];const services={assertReady:async()=>attempts.push('ready')};
 const attempt=handoff=>publish({...f,handoff,readSnapshot:async()=>state(),services,attestation:{bundle:syntheticAttestation(f.evidence)}});
 for(const notes of ['',f.handoff.notes.replace('BREAKING CHANGE',''),f.handoff.notes.replace('SQLite-Vector:','sqlite-vec:')])await assert.rejects(attempt({...f.handoff,notes}));
 await assert.rejects(attempt({...f.handoff,context:{...f.context,selection:vector('1.1.3')}}),/version/);
 await writeFile(f.handoff.evidencePath,JSON.stringify({...f.evidence,engine:{key:'sqliteVec',upstream:'asg017/sqlite-vec',version:'0.1.9'}}));await assert.rejects(attempt(f.handoff),/evidence changed/);assert.deepEqual(attempts,[]);
});

test('Vector qualification rejects legacy product context/default bundle and selected-source drift',async t=>{
 const v=await releaseFixture(t,{version:'0.3.0'}),legacy=await releaseFixture(t,{version:'0.3.0',engine:'sqliteVec'});
 await assert.rejects(qualify({...legacy,run:clean,readSnapshot:async()=>state(),produce:async()=>assert.fail('legacy production forbidden')}),/requires SQLite-Vector/);
 await assert.rejects(qualify({...v,run:clean,readSnapshot:async()=>state(),produce:async()=>({bundle:legacy.bundle})}),/lock|engine|version|ENOENT/);
 for(const selection of [vector('1.1.3'),vector('1.1.2','3.54.0.1')])await assert.rejects(qualify({...v,context:{...v.context,selection},run:clean,readSnapshot:async()=>state(),produce:async()=>({bundle:v.bundle})}),/version/);
 const verify=()=>acceptedPayload({...v,identity:v.packaged.package,commit});
 const original=JSON.parse(await readFile(join(v.repository,'inputs/sqlite-vector.sources.lock.json')));
 const bad=structuredClone(original);bad.sqliteVector.digest.value='0'.repeat(64);await writeFile(join(v.repository,'inputs/sqlite-vector.sources.lock.json'),JSON.stringify(bad));await assert.rejects(verify(),/lock|identity/);
});

test('historical exact engine/origins remain readable, conflicting provenance fails',async t=>{
 const f=await qualified(t);publicationIdentity(f.evidence);
 for(const mutate of [e=>e.engine.key='sqliteVec',e=>delete e.engine,e=>e.sourceLock.sqliteVec=e.sourceLock.sqliteVector,e=>e.sourceLock.schemaVersion=1,e=>e.sourceLock.sqliteVector.archiveUrl=e.sourceLock.sqliteVector.archiveUrl.replace('sqliteai/sqlite-vector','asg017/sqlite-vec'),e=>e.sourceLock.sqlite.archiveUrl='https://evil.invalid/source',e=>e.upstreams.sqliteVector='1.1.3',e=>e.sourceLock.sqliteVector.commit='bad']){const e=structuredClone(f.evidence);mutate(e);assert.throws(()=>publicationIdentity(e));}
 const old=await releaseFixture(t,{engine:'sqliteVec'}),a=await acceptedPayload({...old,identity:old.packaged.package,commit});
 const evidence=provenance(old.context,calc(vec(),state(null)),a).evidence;assert.equal(evidence.engine,undefined);publicationIdentity(evidence);
 const bytes=await readFile(join(old.bundle,'payload.tgz'));let checks=0;
 const result=await checkInitialCompletion({evidence,verifyGitHub:async()=>checks++,get:async url=>url.endsWith('/archive')?ok(bytes):ok({name:evidence.name,versions:{'0.1.0':{name:evidence.name,version:'0.1.0',dist:{tarball:'https://registry.npmjs.org/archive'}}},'dist-tags':{latest:'0.1.0'}})});assert.equal(result.status,'complete');assert.equal(checks,1);
});

test('state reader preserves actual Vector HEAD, checks destination bytes and historical origins',async t=>{
 const f=await qualified(t),bytes=await readFile(join(f.bundle,'payload.tgz'));
 const api='https://api.github.com/repos/a/b/';
 const get=async url=>url===api+'evidence'?ok(Buffer.from(JSON.stringify(f.evidence))):url.endsWith('/archive')?ok(bytes):url.includes('/tags?')?ok([{name:'dist/v0.3.0',commit:{sha:commit}}]):url.includes('/releases?')?ok([{tag_name:'dist/v0.3.0',draft:false,prerelease:false,assets:[{name:'publication.json',url:api+'evidence'},{name:'payload.tgz',url:api+'archive'}]}]):ok({name:f.evidence.name,versions:{'0.3.0':{name:f.evidence.name,version:'0.3.0',dist:{tarball:'https://registry.npmjs.org/archive'}}},'dist-tags':{latest:'0.3.0'}});
 assert.deepEqual((await readState({repository:'a/b',get})).heads.latest.upstreams,vector());
 await assert.rejects(readState({repository:'a/b',get:async url=>url.endsWith('/archive')?ok(Buffer.from('altered')):get(url)}));
 const old=await releaseFixture(t,{engine:'sqliteVec'}),a=await acceptedPayload({...old,identity:old.packaged.package,commit}),e=provenance(old.context,calc(vec(),state(null)),a).evidence;
 for(const mutate of [e=>e.sourceLock.sqliteVec.archiveUrl='https://github.com/sqliteai/sqlite-vector/source.tgz',e=>e.engine={key:'sqliteVector',upstream:'sqliteai/sqlite-vector',version:'1.1.2'},e=>e.sourceLock.sqliteVector=e.sourceLock.sqliteVec]){const changed=structuredClone(e);mutate(changed);assert.throws(()=>publicationIdentity(changed));}
});

test('transition cannot repeat bootstrap; successful injected publication uses one archive and preserves partial outcomes',async t=>{
 const f=await qualified(t),calls=[],services={initialNpmException:true,assertReady:async()=>calls.push('ready')};
 const attempt=()=>publish({...f,readSnapshot:async()=>state(),services,attestation:{bundle:syntheticAttestation(f.evidence)}});
 await assert.rejects(attempt(),/initial only/);assert.deepEqual(calls,[]);
 services.initialNpmException=false;
 for(const name of ['createTag','createDraft','upload','npmPublish','finalize','verifyGitHub','verifyNpm'])services[name]=async(...args)=>{calls.push({name,args});return name==='verifyNpm'?{status:'verification-pending',reason:'fixture visibility lag'}:{id:1};};
 assert.equal((await attempt()).status,'published-verification-pending');
 assert.equal(calls.filter(c=>c.name==='npmPublish').length,1);assert.equal(calls.find(c=>c.name==='npmPublish').args[0],f.handoff.archivePath);assert.equal(calls.find(c=>c.name==='upload').args[2],f.handoff.archivePath);
 assert.ok(calls.find(c=>c.name==='createDraft').args[1].includes('BREAKING CHANGE'));
});
