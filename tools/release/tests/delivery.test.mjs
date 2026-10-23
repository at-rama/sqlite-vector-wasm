import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { deliveryReceipt, assertDelivered, deliveryOperations } from '../delivery.mjs';
import { qualify, publish } from '../run.mjs';
import { githubServices } from '../services.mjs';
import { releaseFixture, syntheticAttestation } from './fixture.mjs';

const snapshot = () => ({schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}});
async function prepared(t) {
  const f = await releaseFixture(t);
  const handoff = await qualify({...f, readSnapshot:async()=>snapshot(), produce:async()=>({bundle:f.bundle}),
    run:async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?f.context.commit:''});
  return {...f,handoff,evidence:JSON.parse(await readFile(handoff.evidencePath))};
}
const operations = () => deliveryOperations.map(operation=>({operation,status:'succeeded',result:{}}));
const releaseFor = evidence => ({id:23,tag_name:evidence.tag,draft:false,prerelease:evidence.channel==='next',
  assets:['payload.tgz','publication.json','attestation.json','delivery.json'].map(name=>({name,state:'uploaded'}))});

test('durable receipt completes only with its finalized matching Release, without Actions or public reads',async t=>{
  const f=await prepared(t),release=releaseFor(f.evidence),receipt=deliveryReceipt(f.evidence,release,operations());
  assert.equal(assertDelivered(receipt,release,f.evidence).status,'complete');
  assert.throws(()=>assertDelivered(receipt,release,f.evidence,Buffer.from(JSON.stringify(f.evidence))),/manifest mismatch/);
  for(const change of [r=>{r.draft=true;},r=>{r.id++;},r=>{r.tag_name='dist/v9.9.9';},r=>{r.assets.pop();},r=>{r.assets[0].state='new';},r=>{r.prerelease=true;}]) {
    const other=structuredClone(release);change(other);assert.throws(()=>assertDelivered(receipt,other,f.evidence));
  }
  for(const change of [r=>{r.subject.commit='b'.repeat(40);},r=>{r.subject.archive.sha256='0'.repeat(64);},r=>{r.publicationSha256='0'.repeat(64);},r=>{r.operations.pop();},r=>{r.operations[5].status='unknown';}]) {
    const other=structuredClone(receipt);change(other);assert.throws(()=>assertDelivered(other,release,f.evidence));
  }
});

test('a failed or unknown operation cannot create durable successful evidence',async t=>{
  const f=await prepared(t);
  for(const status of ['failed','pending','unknown']) {
    const records=operations();records[5].status=status;
    assert.throws(()=>deliveryReceipt(f.evidence,{id:23},records),/Incomplete/);
  }
});

test('npm acceptance precedes receipt upload and finalization; no public inspector executes',async t=>{
  const f=await prepared(t),calls=[];
  const services={assertReady:async()=>{},createTag:async()=>calls.push('tag'),createDraft:async()=>({id:23}),
    upload:async(release,name,path)=>{calls.push(name);assert.ok((await readFile(path)).length);},
    npmPublish:async(path,channel,evidence)=>{calls.push('npm');assert.deepEqual(evidence.archive,f.evidence.archive);},
    finalize:async()=>calls.push('finalize'),verifyGitHub:async()=>assert.fail('No public GitHub inspector'),verifyNpm:async()=>assert.fail('No public npm inspector')};
  const result=await publish({...f,readSnapshot:async()=>snapshot(),services,attestation:{bundle:syntheticAttestation(f.evidence)}});
  assert.equal(result.status,'complete');
  assert.deepEqual(calls,['tag','payload.tgz','publication.json','attestation.json','npm','delivery.json','finalize']);
});

test('unknown publication acceptance is retained and prevents finalization',async t=>{
  const f=await prepared(t),error=Object.assign(new Error('acceptance unknown'),{completionUnknown:true});
  const services={assertReady:async()=>{},createTag:async()=>{throw error;},createDraft:async()=>assert.fail('No later operation')};
  await assert.rejects(publish({...f,readSnapshot:async()=>snapshot(),services,attestation:{bundle:syntheticAttestation(f.evidence)}}),/acceptance unknown/);
  const outcome=JSON.parse(await readFile(join(f.handoff.directory,'outcome.json')));
  assert.deepEqual(outcome.outcomes.map(({operation,status})=>({operation,status})),[{operation:'tag',status:'unknown'}]);
  assert.equal(outcome.stableDocumentationEligible,false);
});

test('journal failure after acknowledgment is not recorded as a rejected remote operation',async t=>{
  const f=await prepared(t),original=f.handoff.directory,retained=original+'-retained';
  const services={assertReady:async()=>{},createTag:async()=>{await rename(original,retained);await writeFile(original,'blocked journal');return {ref:'acknowledged'};}};
  await assert.rejects(publish({...f,readSnapshot:async()=>snapshot(),services,attestation:{bundle:syntheticAttestation(f.evidence)}}),/Operation tag acknowledged; local journal persistence failed/);
});

test('a transport timeout reports unknown acceptance rather than proving rejection',async t=>{
  const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async()=>{throw new Error('timeout');};
  const service=githubServices({repository:'a/b',token:'synthetic'});
  await assert.rejects(service.createTag('dist/v0.1.0','a'.repeat(40)),e=>e.completionUnknown===true&&/unknown/.test(e.message));
});
