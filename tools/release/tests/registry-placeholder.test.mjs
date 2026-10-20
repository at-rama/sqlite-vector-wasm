import test from 'node:test';
import assert from 'node:assert/strict';
import { npmState, readState, sha256 } from '../state.mjs';
import { calculate, distribution, npmPackageName as name } from '../policy.mjs';
import { checkInitialCompletion } from '../run.mjs';
import { githubServices } from '../services.mjs';

const repository = 'at-rama/sqlite-vector-wasm';
const api = `https://api.github.com/repos/${repository}/`;
const registry = 'https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm';
const commit = 'a'.repeat(40);
const ok = data => ({status:200,headers:{},data});
const entry = version => ({name,version,dist:{tarball:`https://registry.npmjs.org/archive/${version}`,attestations:{provenance:'supported fixture'}}});
const placeholder = () => ({...entry('0.0.0-stage'),stub:true});
const pair = (sqliteVec='0.1.9') => ({sqlite:'3.53.4',sqliteVec});
// Independent registry/GitHub observations, rather than production-generated expected state.
function observations({stage=true,versions=['0.1.0'],next=null}={}) {
  const npm = {name,versions:{},'dist-tags':{latest:versions[0]}};
  if (stage) npm.versions['0.0.0-stage'] = placeholder();
  const tags=[],releases=[],evidence={},bytes={};
  for (const version of versions) {
    npm.versions[version]=entry(version);
    const channel=version.includes('-alpha.')?'next':'latest';
    const upstreams=pair(channel==='next'?'0.2.0-alpha.1':'0.1.9');
    const payload=Buffer.from(`independent accepted archive ${version}`);
    const record={schemaVersion:1,name,version,tag:`dist/v${version}`,channel,initial:version==='0.1.0',commit,repository,
      upstreams,archive:{size:payload.length,sha256:sha256(payload)},
      sourceLock:{schemaVersion:1,...Object.fromEntries(Object.entries(upstreams).map(([key,v])=>[key,{version:v,archiveUrl:key==='sqlite'?'https://sqlite.org/2026/source.zip':'https://github.com/asg017/sqlite-vec/releases/download/v0.1.9/source.tgz',digest:{algorithm:'sha256',value:'b'.repeat(64)}}]))},
      build:{tools:{node:'fixture'}},acceptance:{verdict:'passed'}};
    const id=releases.length+1;
    const assets=[{name:'publication.json',url:`${api}releases/assets/evidence-${id}`},{name:'payload.tgz',url:`${api}releases/assets/archive-${id}`}];
    releases.push({id,tag_name:record.tag,draft:false,prerelease:channel==='next',assets});
    tags.push({name:record.tag,commit:{sha:commit}});
    evidence[version]=record;
    bytes[assets[0].url]=Buffer.from(JSON.stringify(record));bytes[assets[1].url]=payload;bytes[entry(version).dist.tarball]=payload;
  }
  if(next) npm['dist-tags'].next=next;
  const calls=[];
  const get=async(url,options)=>{
    calls.push([url,options]);
    if(url===registry)return ok(npm);
    if(url.startsWith(`${api}tags?`))return ok(tags);
    if(url.startsWith(`${api}releases?`))return ok(releases);
    if(url.startsWith(`${api}git/ref/tags/`))return ok({object:{type:'commit',sha:tags.find(t=>url.endsWith(t.name))?.commit.sha}});
    if(url.startsWith(`${api}releases/`)&&!url.includes('/assets/'))return ok(releases.find(r=>url.endsWith(`/tags/${r.tag_name}`)||url===`${api}releases/${r.id}`));
    if(bytes[url])return ok(bytes[url]);
    assert.fail(`Unexpected read or publishing operation: ${url}`);
  };
  return {npm,tags,releases,evidence,bytes,get,calls};
}
const state = o => readState({repository,get:o.get});
const complete = o => {
  const services=githubServices({repository,get:o.get,run:async()=>assert.fail('No publisher/repack command')});
  return checkInitialCompletion({evidence:o.evidence['0.1.0'],get:o.get,verifyGitHub:async e=>{
    const response=await o.get(`${api}releases/tags/${e.tag}`);assert.equal(response.status,200);
    return services.verifyGitHub(response.data,e);
  }});
};

test('only the validated exact boolean stub is recognized; raw observations survive',async()=>{
  const o=observations();assert.equal(await npmState(o.get),o.npm);
  assert.deepEqual(o.npm.versions['0.0.0-stage'],placeholder());
  const mutations=[
    n=>n.name='@foreign/package',n=>n.versions['0.0.0-stage'].name='@foreign/package',
    n=>n.versions['0.0.0-stage'].version='0.1.0',n=>delete n.versions['0.0.0-stage'].dist,
    n=>n.versions['0.0.0-stage']=null,n=>n.versions['0.0.0-stage']=[],
    n=>n.versions=[],n=>n['dist-tags']=[],n=>n.versions['0.1.0'].stub=true,
    n=>n.versions['0.9.0-stage']={...entry('0.9.0-stage'),stub:true},
    ...[undefined,false,'true',1,null].map(marker=>n=>{n.versions['0.0.0-stage'].stub=marker;})
  ];
  for(const mutate of mutations){const f=observations();mutate(f.npm);await assert.rejects(npmState(f.get));}
  assert.throws(()=>distribution('0.0.0-stage'),/Unsupported distribution/);
  assert.deepEqual((await npmState(async()=>({status:404,data:{error:'Not found'}}))).versions,{});
  for(const status of [401,403,500])await assert.rejects(npmState(async()=>({status})),/unavailable/);
  await assert.rejects(npmState(async()=>({status:404,data:{error:'Forbidden'}})),/absence/);
  await assert.rejects(npmState(async()=>{throw Error('transport');}),/transport/);
});

test('projected stable/experimental history and shared forecasts ignore only the recognized placeholder',async()=>{
  const current=(sqliteVector='1.1.2')=>({sqlite:'3.53.4',sqliteVector});
  for(const configuration of [{versions:['0.2.0']},{versions:['0.2.0','0.3.0-alpha.2'],next:'0.3.0-alpha.2'}]) {
    const withStage=await state(observations(configuration));
    const withoutStage=await state(observations({...configuration,stage:false}));
    assert.deepEqual(withStage,withoutStage);
    for(const selection of [current(),current('0.2.0-alpha.2'),current('0.2.0'),current('0.1.8')]) {
      const input={selection,snapshot:withStage,comment:'reviewed selection'};
      assert.deepEqual(calculate(input),calculate({...input,snapshot:withoutStage}));
    }
    const forecast=calculate({selection:current(),snapshot:withStage});
    assert.equal(forecast.version,'0.3.0');
    for(const key of ['tags','releaseTags','npmVersions']){
      const collision=structuredClone(withStage);collision[key].push(key==='npmVersions'?forecast.version:forecast.tag);
      assert.throws(()=>calculate({selection:current(),snapshot:collision}),/collision/);
    }
    assert.throws(()=>calculate({selection:pair(),snapshot:withStage}),/requires SQLite-Vector/);
    if(configuration.next)assert.equal(calculate({selection:current('0.2.0-alpha.2'),snapshot:withStage}).version,'0.3.0-alpha.3');
  }
});

test('existing placeholder-only package and placeholder channel references block ordinary state',async()=>{
  for(const tags of [{},{latest:'0.0.0-stage'},{next:'0.0.0-stage'}]) {
    const o=observations({versions:[]});o.npm['dist-tags']=tags;
    await assert.rejects(state(o),/only an unready/);
  }
  for(const channel of ['latest','next']){
    const o=observations();o.npm['dist-tags'][channel]='0.0.0-stage';
    await assert.rejects(state(o),/channel points to an unready/);
  }
});

test('placeholder cannot mask missing references, ambiguous provenance, revision or destination failures',async()=>{
  const mutations=[
    o=>o.npm['dist-tags']={},o=>o.npm['dist-tags'].latest='0.9.0',o=>o.tags.length=0,
    o=>o.releases[0].draft=true,o=>o.releases[0].prerelease=true,
    o=>o.tags[0].commit.sha='b'.repeat(40),o=>o.tags.push(structuredClone(o.tags[0])),
    o=>o.releases[0].assets.push(o.releases[0].assets[0]),
    o=>o.bytes[o.releases[0].assets[0].url]=Buffer.from('{}'),
    o=>o.bytes[entry('0.1.0').dist.tarball]=Buffer.from('different bytes'),
    o=>{const b=Buffer.from(o.bytes[entry('0.1.0').dist.tarball]);b[0]^=1;o.bytes[entry('0.1.0').dist.tarball]=b;}
  ];
  for(const mutate of mutations){const o=observations();mutate(o);await assert.rejects(state(o));}
});

test('initial completion with placeholder is read-only, missing real version pending, real contradictions fail',async()=>{
  const o=observations();assert.equal((await complete(o)).status,'complete');
  assert.ok(o.calls.every(([url])=>url.startsWith(api)||url.startsWith('https://registry.npmjs.org/')));
  const pending=observations();delete pending.npm.versions['0.1.0'];pending.npm['dist-tags']={latest:'0.0.0-stage'};
  assert.equal((await complete(pending)).status,'npm-pending');
  const mutations=[
    f=>f.npm.name='@foreign/package',f=>f.npm.versions['0.1.0'].name='@foreign/package',
    f=>f.npm['dist-tags'].latest='0.0.0-stage',f=>f.tags[0].commit.sha='b'.repeat(40),
    f=>f.bytes[f.releases[0].assets[0].url]=Buffer.from('{}'),
    f=>f.bytes[entry('0.1.0').dist.tarball]=Buffer.from('short'),
    f=>{const b=Buffer.from(f.bytes[entry('0.1.0').dist.tarball]);b[0]^=1;f.bytes[entry('0.1.0').dist.tarball]=b;}
  ];
  for(const mutate of mutations){const f=observations();mutate(f);await assert.rejects(complete(f));}
});

test('normal verification with placeholder retains supported provenance and exact bytes',async()=>{
  const verify=o=>githubServices({repository,get:o.get}).verifyNpm(o.evidence['0.1.0']);
  assert.equal((await verify(observations())).version,'0.1.0');
  const missing=observations();delete missing.npm.versions['0.1.0'].dist.attestations;
  await assert.rejects(verify(missing),/provenance/);
  const changed=observations();const b=Buffer.from(changed.bytes[entry('0.1.0').dist.tarball]);b[0]^=1;changed.bytes[entry('0.1.0').dist.tarball]=b;
  await assert.rejects(verify(changed));
});
