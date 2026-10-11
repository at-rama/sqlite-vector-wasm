import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { qualify, acceptedPayload, publish, checkInitialCompletion, attestSubject } from '../run.mjs';
import { readState, sha256 } from '../state.mjs';
import { releaseFixture, syntheticAttestation } from './fixture.mjs';

const empty = () => ({schemaVersion:1,tags:[],npmVersions:[],releaseTags:[],heads:{latest:null,next:null}});
const ok = data => ({status:200,headers:{},data});
async function qualified(t) {
  const fixture = await releaseFixture(t);
  const handoff = await qualify({...fixture,readSnapshot:async()=>empty(),produce:async ({metadata})=>{assert.deepEqual(metadata,{name:'sqlite-vector-wasm',version:'0.1.0'});return {bundle:fixture.bundle};},run:async (cmd,args)=>cmd==='git' && args[0]==='rev-parse' ? fixture.context.commit : ''});
  const evidence = JSON.parse(await readFile(handoff.evidencePath));
  return {...fixture,handoff,evidence,attestation:{bundle:syntheticAttestation(evidence)}};
}
function destinations(fixture,{bootstrap=false,failAt=null}={}) {
  const calls=[];
  const call = (name,result={}) => async (...args)=>{calls.push({name,args});if(name===failAt)throw Error(`injected ${name}`);return result;};
  return {calls,initialNpmException:bootstrap,assertReady:call('ready'),createTag:call('tag'),createDraft:call('draft',{id:1}),upload:async (release,name,path)=>{assert.ok((await readFile(path)).length);return call(name)();},npmPublish:call('npm'),finalize:call('github'),verifyGitHub:call('github-identity'),verifyNpm:call('npm-identity')};
}

test('exact accepted archive remains independently inspectable after original build is gone',async t=>{
  const f=await releaseFixture(t);await rm(f.constructed.runtimeDirectory,{recursive:true});
  const accepted=await acceptedPayload({bundle:f.bundle,commit:f.context.commit,repository:f.repository,identity:f.packaged.package});
  assert.equal(accepted.archive.sha256,f.packaged.archive.sha256);
  await assert.rejects(acceptedPayload({bundle:f.bundle,commit:'b'.repeat(40),repository:f.repository,identity:f.packaged.package}),/revision/);
  await assert.rejects(acceptedPayload({bundle:f.bundle,commit:f.context.commit,repository:f.repository,identity:{name:'fixture',version:'0.0.0-test'}}),/identity/);
  await writeFile(join(f.bundle,'payload.tgz'),'tampered');
  await assert.rejects(acceptedPayload({bundle:f.bundle,commit:f.context.commit,repository:f.repository,identity:f.packaged.package}),/archive/);
});

test('missing browser cases and altered notices/metadata/runtime fail before publication',async t=>{
  const f=await releaseFixture(t);
  const verify=()=>acceptedPayload({bundle:f.bundle,commit:f.context.commit,repository:f.repository,identity:f.packaged.package});
  const report=structuredClone(f.report);delete report.browserResults.cases['restart-opfs'];await writeFile(join(f.bundle,'acceptance.json'),JSON.stringify(report));
  await assert.rejects(verify(),/browser case/);await writeFile(join(f.bundle,'acceptance.json'),JSON.stringify(f.report));
  for(const name of ['package.json','sqlite3.wasm','licenses/sqlite-vec-MIT.txt']){
    const packaged=structuredClone(f.packaged);packaged.files.find(file=>file.name===name).sha256='0'.repeat(64);await writeFile(join(f.bundle,'package.json'),JSON.stringify(packaged));
    await assert.rejects(verify(),/hash mismatch/);
  }
});

test('qualification refuses dirty/wrong revision or failed production without publishers',async t=>{
  const f=await releaseFixture(t);let productions=0;
  for(const wrong of ['revision','dirty'])await assert.rejects(qualify({...f,readSnapshot:async()=>empty(),produce:async()=>{productions++;},run:async(cmd,args)=>cmd==='git' ? args[0]==='rev-parse' ? wrong==='revision'?'b'.repeat(40):f.context.commit : 'dirty' : ''}));
  assert.equal(productions,0);
  await assert.rejects(qualify({...f,readSnapshot:async()=>empty(),produce:async()=>{throw Error('mandatory build failure');},run:async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?f.context.commit:''}),/mandatory build/);
});

test('steady-state publication sends exact bytes, generated provenance and comment before complete success',async t=>{
  const f=await qualified(t),services=destinations(f);
  const result=await publish({...f,readSnapshot:async()=>empty(),services});
  assert.equal(result.status,'complete');
  assert.deepEqual(services.calls.map(c=>c.name),['ready','tag','draft','payload.tgz','publication.json','attestation.json','npm','github','github-identity','npm-identity']);
  assert.equal(services.calls.find(c=>c.name==='npm').args[0],join(f.bundle,'payload.tgz'));
  assert.equal(services.calls.find(c=>c.name==='npm').args[1],'latest');
  assert.ok(f.handoff.notes.includes(f.context.comment));assert.deepEqual(f.evidence.sourceLock,f.report.sourceLock);assert.deepEqual(f.evidence.build,f.constructed.build);
});

test('initial exception publishes GitHub automatically, hands off the same archive and records npm pending',async t=>{
  const f=await qualified(t),services=destinations(f,{bootstrap:true});
  assert.equal((await publish({...f,readSnapshot:async()=>empty(),services})).status,'npm-pending');
  assert.ok(services.calls.some(c=>c.name==='github'));assert.ok(!services.calls.some(c=>c.name==='npm'));
});

test('manual first-npm exception cannot be selected for a subsequent release',async t=>{
  const f=await releaseFixture(t,{version:'0.1.1'}),snapshot=empty();
  snapshot.tags=['dist/v0.1.0'];snapshot.npmVersions=['0.1.0'];snapshot.releaseTags=['dist/v0.1.0'];snapshot.heads.latest={version:'0.1.0',commit:f.context.commit,upstreams:f.context.selection};
  const handoff=await qualify({...f,readSnapshot:async()=>snapshot,produce:async()=>({bundle:f.bundle}),run:async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?f.context.commit:''});
  const evidence=JSON.parse(await readFile(handoff.evidencePath));const services=destinations(f,{bootstrap:true});
  await assert.rejects(publish({...f,handoff,readSnapshot:async()=>snapshot,attestation:{bundle:syntheticAttestation(evidence)},services}),/initial only/);
  assert.deepEqual(services.calls,[]);
});

test('stale state, concurrent occupancy, changed evidence and wrong attestation stop before tags',async t=>{
  const f=await qualified(t);
  for(const key of ['tags','npmVersions','releaseTags']){const snapshot=empty();snapshot[key].push(key==='npmVersions'?'0.1.0':'dist/v0.1.0');const services=destinations(f);
    await assert.rejects(publish({...f,readSnapshot:async()=>snapshot,services}),/collision/);assert.deepEqual(services.calls,[]);}
  const moved=empty();moved.tags=['dist/v0.1.0'];moved.releaseTags=['dist/v0.1.0'];moved.npmVersions=['0.1.0'];moved.heads.latest={version:'0.1.0',commit:f.context.commit,upstreams:f.context.selection};
  const beforeTag=destinations(f);await assert.rejects(publish({...f,readSnapshot:async()=>moved,services:beforeTag}),/Stale/);assert.deepEqual(beforeTag.calls,[]);
  const bad=structuredClone(f.attestation.bundle);bad.dsseEnvelope.payload=Buffer.from(JSON.stringify({predicateType:'https://slsa.dev/provenance/v1',subject:[{digest:{sha256:'0'.repeat(64)}}]})).toString('base64');
  assert.throws(()=>attestSubject(bad,f.evidence),/archive/);
  const services=destinations(f);await assert.rejects(publish({...f,attestation:{bundle:bad},readSnapshot:async()=>empty(),services}));assert.ok(!services.calls.some(c=>c.name==='tag'));
  await writeFile(f.handoff.evidencePath,JSON.stringify({...f.evidence,commit:'b'.repeat(40)}));
  await assert.rejects(publish({...f,readSnapshot:async()=>empty(),services}),/evidence changed/);
});

test('every side-effect failure preserves operation outcomes without compensation or identity reuse',async t=>{
  const f=await qualified(t);
  for(const failAt of ['ready','tag','draft','payload.tgz','publication.json','attestation.json','npm','github','github-identity','npm-identity']){
    const services=destinations(f,{failAt});await assert.rejects(publish({...f,readSnapshot:async()=>empty(),services}),/injected/);
    const outcome=JSON.parse(await readFile(join(f.handoff.directory,'outcome.json')));assert.equal(outcome.status,'failed');
    assert.equal(services.calls.at(-1).name,failAt);assert.ok(!services.calls.some(c=>/delete|overwrite|repair/.test(c.name)));
    assert.ok((await readFile(join(f.bundle,'payload.tgz'))).length);
  }
});

test('read-only initial completion distinguishes pending, matching, inaccessible and inconsistent npm',async t=>{
  const f=await qualified(t),bytes=await readFile(join(f.bundle,'payload.tgz'));
  const npm={name:'sqlite-vector-wasm',versions:{'0.1.0':{name:'sqlite-vector-wasm',version:'0.1.0',dist:{tarball:'https://registry.npmjs.org/archive'}}},'dist-tags':{latest:'0.1.0'}};
  let calls=0;const verifyGitHub=async()=>{calls++;};
  const get=async url=>url.endsWith('/archive')?ok(bytes):ok(npm);
  assert.equal((await checkInitialCompletion({evidence:f.evidence,get,verifyGitHub})).status,'complete');
  assert.equal((await checkInitialCompletion({evidence:f.evidence,get:async()=>({status:404,data:{error:'Not found'}}),verifyGitHub})).status,'npm-pending');
  await assert.rejects(checkInitialCompletion({evidence:f.evidence,get:async()=>({status:401,data:{}}),verifyGitHub}));
  await assert.rejects(checkInitialCompletion({evidence:f.evidence,get:async url=>url.endsWith('/archive')?ok(Buffer.from('bad')):ok(npm),verifyGitHub}));
  assert.equal(calls,4);
});

test('state validates published HEAD composition, revision and both destination bytes',async t=>{
  const f=await qualified(t),bytes=await readFile(join(f.bundle,'payload.tgz'));
  const api='https://api.github.com/repos/a/b/';
  const get=async url=>url===api+'evidence'?ok(Buffer.from(JSON.stringify(f.evidence))):url.endsWith('/archive')?ok(bytes):url.includes('/tags?')?ok([{name:'dist/v0.1.0',commit:{sha:f.context.commit}}]):url.includes('/releases?')?ok([{tag_name:'dist/v0.1.0',draft:false,prerelease:false,assets:[{name:'publication.json',url:api+'evidence'},{name:'payload.tgz',url:api+'archive'}]}]):ok({name:'sqlite-vector-wasm',versions:{'0.1.0':{name:'sqlite-vector-wasm',version:'0.1.0',dist:{tarball:'https://registry.npmjs.org/archive'}}},'dist-tags':{latest:'0.1.0'}});
  assert.equal((await readState({repository:'a/b',get})).heads.latest.commit,f.context.commit);
  await assert.rejects(readState({repository:'a/b',get:async(url,options)=>url.endsWith('/archive')?ok(Buffer.from('bad')):get(url,options)}));
  assert.equal(sha256(bytes),f.evidence.archive.sha256);
});
