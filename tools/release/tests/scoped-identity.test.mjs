import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { npmState, publicationIdentity } from '../state.mjs';
import { qualify, checkInitialCompletion } from '../run.mjs';
import { githubServices } from '../services.mjs';
import { releaseFixture } from './fixture.mjs';

const endpoint = 'https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm';
const ok = data => ({status:200,headers:{},data});
const empty = () => ({schemaVersion:1,tags:[],npmVersions:[],releaseTags:[],heads:{latest:null,next:null}});
const metadata = () => ({name:'@at-rama/sqlite-vector-wasm',versions:{'0.1.0':{
  name:'@at-rama/sqlite-vector-wasm',version:'0.1.0',dist:{tarball:'https://registry.npmjs.org/scoped-archive',attestations:{provenance:'fixture'}}
}},'dist-tags':{latest:'0.1.0'}});
async function qualified(t) {
  const f = await releaseFixture(t);
  const handoff = await qualify({...f,readSnapshot:async()=>empty(),produce:async({metadata})=>{
    assert.deepEqual(metadata,{name:'@at-rama/sqlite-vector-wasm',version:'0.1.0'});return {bundle:f.bundle};
  },run:async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?f.context.commit:''});
  return {...f,evidence:JSON.parse(await readFile(handoff.evidencePath))};
}

test('scoped registry endpoint, recognized absence and exact metadata identity',async()=>{
  assert.deepEqual(await npmState(async url=>{assert.equal(url,endpoint);return ok(metadata());}),metadata());
  assert.deepEqual(await npmState(async url=>{assert.equal(url,endpoint);return {status:404,data:{error:'Not found'}};}),
    {name:'@at-rama/sqlite-vector-wasm',versions:{},'dist-tags':{}});
  await assert.rejects(npmState(async()=>({status:404,data:{error:'Not found'}}),{allowAbsent:false}),/unavailable/);
  for(const wrong of ['sqlite-vector-wasm','@another/sqlite-vector-wasm']) {
    const top=metadata();top.name=wrong;await assert.rejects(npmState(async()=>ok(top)),/Unexpected npm package/);
    const version=metadata();version.versions['0.1.0'].name=wrong;await assert.rejects(npmState(async()=>ok(version)));
  }
  for(const data of [null,{}, {...metadata(),versions:[]}, {...metadata(),'dist-tags':null}])
    await assert.rejects(npmState(async()=>ok(data)));
});

test('qualification rejects an archive packaged for another npm identity',async t=>{
  for(const name of ['sqlite-vector-wasm','@another/sqlite-vector-wasm']) {
    const f=await releaseFixture(t,{name});
    await assert.rejects(qualify({...f,readSnapshot:async()=>empty(),produce:async()=>({bundle:f.bundle}),
      run:async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?f.context.commit:''}),/Acceptance package identity/);
  }
});

test('initial completion rejects wrong names, channels and bytes without publication adapters',async t=>{
  const f=await qualified(t),bytes=await readFile(join(f.bundle,'payload.tgz'));
  const urls=[];const get=async url=>{urls.push(url);return url===endpoint?ok(metadata()):ok(bytes);};
  const verifyGitHub=async()=>{};
  assert.equal((await checkInitialCompletion({evidence:f.evidence,get,verifyGitHub})).status,'complete');
  assert.deepEqual(urls,[endpoint,metadata().versions['0.1.0'].dist.tarball]);
  for(const name of ['sqlite-vector-wasm','@another/sqlite-vector-wasm']) {
    const evidence={...f.evidence,name};assert.throws(()=>publicationIdentity(evidence));
    await assert.rejects(checkInitialCompletion({evidence,get:async()=>assert.fail('No registry read for wrong provenance'),
      verifyGitHub:async()=>assert.fail('No GitHub read for wrong provenance')}));
    for(const field of ['top','version']) {
      const npm=metadata();if(field==='top')npm.name=name;else npm.versions['0.1.0'].name=name;
      await assert.rejects(checkInitialCompletion({evidence:f.evidence,verifyGitHub,get:async url=>url===endpoint?ok(npm):ok(bytes)}));
    }
  }
  const wrongChannel=metadata();wrongChannel['dist-tags']={next:'0.1.0'};
  await assert.rejects(checkInitialCompletion({evidence:f.evidence,verifyGitHub,get:async()=>ok(wrongChannel)}),/channel mismatch/);
  const changed=Buffer.from(bytes);changed[0]^=1;
  await assert.rejects(checkInitialCompletion({evidence:f.evidence,verifyGitHub,get:async url=>url===endpoint?ok(metadata()):ok(changed)}),/archive mismatch/);
});

test('ordinary npm verification and publishing adapter retain scoped bytes and publication arguments',async t=>{
  const f=await qualified(t),bytes=await readFile(join(f.bundle,'payload.tgz'));const calls=[];
  const services=githubServices({repository:'a/b',directory:f.bundle,get:async url=>{
    calls.push(url);return url===endpoint?ok(metadata()):ok(bytes);
  },environment:{},run:async(cmd,args,options)=>{
    assert.equal(cmd,'bash');assert.deepEqual(args,['tools/harness.sh','exec','npm','publish',join(f.bundle,'payload.tgz'),
      '--tag','latest','--access','public','--ignore-scripts','--provenance']);
    assert.equal(options.env.npm_config_registry,'https://registry.npmjs.org/');
    assert.equal(await readFile(options.env.npm_config_userconfig,'utf8'),'\n');calls.push('injected npm');
  }});
  assert.equal((await services.verifyNpm(f.evidence)).sha256,f.evidence.archive.sha256);
  await services.npmPublish(join(f.bundle,'payload.tgz'),'latest');
  assert.deepEqual(calls,[endpoint,metadata().versions['0.1.0'].dist.tarball,'injected npm']);
  const missing=metadata();delete missing.versions['0.1.0'].dist.attestations;
  await assert.rejects(githubServices({repository:'a/b',get:async url=>url===endpoint?ok(missing):ok(bytes)}).verifyNpm(f.evidence),/provenance/);
});
