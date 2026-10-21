import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runArtifact, uniqueRecord } from '../artifacts.mjs';
import { sha256, httpReader, download } from '../state.mjs';

async function fixture(t,entries=[{name:'evidence/result.json',text:'{"value":1}'}]) {
 const directory=await mkdtemp(join(tmpdir(),'handoff-test-'));t.after(()=>rm(directory,{recursive:true,force:true}));
 const path=join(directory,'fixture.zip');
 execFileSync('python3',['-c',`import sys,json,zipfile
with zipfile.ZipFile(sys.argv[1],'w') as z:
 for e in json.loads(sys.argv[2]):
  i=zipfile.ZipInfo(e['name']);i.create_system=3;i.external_attr=e.get('mode',0o100644)<<16
  z.writestr(i,e.get('text',''))`,path,JSON.stringify(entries)]);
 const bytes=await readFile(path),run={id:17,head_sha:'a'.repeat(40)};
 const metadata={id:1,name:'fixture-17',expired:false,digest:'sha256:'+sha256(bytes),size_in_bytes:bytes.length,workflow_run:{id:17,head_sha:run.head_sha}};
 const listing={total_count:1,artifacts:[metadata]};
 const get=async(url,options)=>{if(url.endsWith('/zip'))assert.equal(options.binary,true);return {status:200,data:url.endsWith('/zip')?bytes:listing};};
 return {directory,bytes,run,metadata,listing,get,invoke:()=>runArtifact({repository:'a/b',run,name:'fixture-17',directory,get})};
}

test('workflow artifact bytes and source identities are checked before fresh bounded extraction',async t=>{
 const f=await fixture(t),first=await f.invoke();assert.equal(first.id,1);assert.equal(first.sha256,sha256(f.bytes));assert.deepEqual(await uniqueRecord(first,'result.json'),{value:1});
 const second=await f.invoke();assert.notEqual(second.directory,first.directory);assert.deepEqual(await uniqueRecord(second,'result.json'),{value:1});
});

test('real HTTP reader negotiates Actions ZIPs as GitHub JSON and retains byte/digest checks',async t=>{
 const f=await fixture(t),original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
 globalThis.fetch=async(url,{headers})=>{
  assert.equal(headers.Authorization,'Bearer fixture-token');
  const archive=new URL(url).pathname.endsWith('/zip');
  const status=headers.Accept==='application/vnd.github+json'?200:415;
  const bytes=status!==200?Buffer.from('{"message":"Unsupported media type"}'):archive?f.bytes:Buffer.from(JSON.stringify(f.listing));
  return {status,headers:new Map(),arrayBuffer:async()=>bytes};
 };
 const invoke=()=>runArtifact({repository:'a/b',run:f.run,name:'fixture-17',directory:f.directory,get:httpReader('fixture-token')});
 const artifact=await invoke();assert.deepEqual(await uniqueRecord(artifact,'result.json'),{value:1});
 f.metadata.digest='sha256:'+'0'.repeat(64);
 await assert.rejects(invoke(),/Artifact digest mismatch/);
});

test('HTTP reader preserves octet-stream for Release assets and registry tarballs without leaking credentials',async t=>{
 const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
 const bytes=Buffer.from([0,255,128,1]);
 globalThis.fetch=async(url,{headers})=>{
  assert.equal(headers.Accept,'application/octet-stream');
  assert.equal(headers.Authorization,new URL(url).hostname==='api.github.com'?'Bearer fixture-token':undefined);
  return {status:200,headers:new Map(),arrayBuffer:async()=>bytes};
 };
 for(const url of ['https://api.github.com/repos/a/b/releases/assets/123','https://registry.npmjs.org/a/-/a-1.0.0.tgz'])
  assert.deepEqual(await download(url,httpReader('fixture-token')),bytes);
});

test('HTTP download rejects an Actions HTTP error rather than accepting its JSON body as a ZIP',async t=>{
 const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
 globalThis.fetch=async()=>({status:415,headers:new Map(),arrayBuffer:async()=>Buffer.from('{"message":"Unsupported media type"}')});
 await assert.rejects(download('https://api.github.com/repos/a/b/actions/artifacts/123/zip',httpReader()),/Archive\/evidence unavailable \(415\)/);
});
for(const failure of ['missing','expired','digest','size','run','source','truncated'])test(`artifact rejects ${failure}`,async t=>{
 const f=await fixture(t);
 if(failure==='missing')f.metadata.name='other';
 if(failure==='expired')f.metadata.expired=true;
 if(failure==='digest')f.metadata.digest='sha256:'+'0'.repeat(64);
 if(failure==='size')f.metadata.size_in_bytes++;
 if(failure==='run')f.metadata.workflow_run.id=18;
 if(failure==='source')f.metadata.workflow_run.head_sha='b'.repeat(40);
 if(failure==='truncated')f.listing.total_count=2;
 await assert.rejects(f.invoke());
});
for(const entries of [[{name:'../outside'}],[{name:'/outside'}],[{name:'nested/../outside'}],[{name:'a//b'}],[{name:'link',text:'outside',mode:0o120777}],[{name:'pipe',mode:0o010644}],[{name:'same'},{name:'same'}]])
 test(`artifact rejects unsafe members ${entries.map(e=>e.name).join(',')}`,async t=>{const f=await fixture(t,entries);await assert.rejects(f.invoke());});

test('ambiguous or absent evidence cannot be selected from an otherwise valid artifact',async t=>{
 const f=await fixture(t,[{name:'one/result.json',text:'{}'},{name:'two/result.json',text:'{}'}]);
 const artifact=await f.invoke();await assert.rejects(uniqueRecord(artifact,'result.json'),/ambiguous/);await assert.rejects(uniqueRecord(artifact,'missing.json'),/Missing/);
});
