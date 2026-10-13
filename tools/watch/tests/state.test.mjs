import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { cachedReader, publicationState, candidateState } from '../state.mjs';
import { npmPackageName } from '../../release/policy.mjs';

const repository='at-rama/sqlite-vector-wasm',api=`https://api.github.com/repos/${repository}/`;
const pair={sqlite:'3.54.0',sqliteVec:'0.1.9'},commit='a'.repeat(40);
const bytes=Buffer.from('synthetic payload; not a qualified runtime');
const sha=createHash('sha256').update(bytes).digest('hex');
test('Updates exposes only the exact pair for dispatches and a separate rehearsal title',async()=>{
  const workflow=await readFile(new URL('../../../.github/workflows/updates.yml',import.meta.url),'utf8');
  const title=workflow.split('\n').find(x=>x.startsWith('run-name:'));
  assert.match(title,/github.event_name == 'workflow_dispatch'/);
  assert.match(title,/format\('candidate sqlite=\{0\} sqlite-vec=\{1\}', inputs.sqlite_version, inputs.sqlite_vec_version\)/);
  assert.match(title,/'Updates PR rehearsal'/);assert.doesNotMatch(title,/release_comment|token|secret/i);
});
const provenance=(version,selection=pair)=>({schemaVersion:1,name:npmPackageName,version,tag:`dist/v${version}`,
  channel:version.includes('-')?'next':'latest',commit,upstreams:selection,archive:{sha256:sha,size:bytes.length},
  sourceLock:Object.fromEntries(Object.entries(selection).map(([k,version])=>[k,{version,archiveUrl:'https://example.invalid/source',digest:{algorithm:'sha256',value:'b'.repeat(64)}}])),
  build:{tools:{}},acceptance:{verdict:'passed'}});
function publicationFixture(){
  const versions=['0.1.0','0.2.0','0.3.0-alpha.1'];
  const evidence=versions.map((v,i)=>provenance(v,i===0?pair:{sqlite:'3.54.1',sqliteVec:i===1?'0.1.9':'0.1.10-alpha.1'}));
  const tags=versions.map(v=>({name:`dist/v${v}`,commit:{sha:commit}}));
  const releases=versions.map((v,i)=>({tag_name:`dist/v${v}`,draft:false,prerelease:v.includes('-'),assets:[{name:'publication.json',url:api+`releases/assets/${i+1}`},{name:'payload.tgz',url:api+`releases/assets/${i+11}`}]}));
  const npm={name:npmPackageName,versions:Object.fromEntries(versions.map(v=>[v,{name:npmPackageName,version:v,dist:{tarball:`https://registry.npmjs.org/payload-${v}`}}])), 'dist-tags':{latest:'0.1.0'}};
  const calls=[];
  const get=async(url,options={})=>{calls.push([url,options.binary]);
    if(url.startsWith(api+'tags'))return {status:200,data:tags,headers:{}};
    if(url===api+'releases?per_page=100')return {status:200,data:releases.slice(0,1),headers:{link:`<${api}releases?page=2>; rel="next"`}};
    if(url===api+'releases?page=2')return {status:200,data:releases.slice(1),headers:{}};
    if(url.includes('/releases/assets/')) {const id=+url.split('/').at(-1);return {status:200,data:id<10?Buffer.from(JSON.stringify(evidence[id-1])):bytes};}
    if(url.includes('/payload-'))return {status:200,data:bytes};
    if(url.includes('registry.npmjs.org/'))return {status:200,data:npm};
    throw Error('Unexpected read '+url);
  };
  return {get,calls,tags,releases,npm,evidence};
}
test('historical compositions survive rollback; HEAD bytes and provenance are still verified',async()=>{
  const f=publicationFixture(),observed=await publicationState({repository,get:cachedReader(f.get)});
  assert.equal(observed.snapshot.heads.latest.version,'0.1.0');
  assert.deepEqual(observed.history.map(x=>x.version),['0.1.0','0.2.0','0.3.0-alpha.1']);
  assert.equal(observed.history[1].selection.sqlite,'3.54.1');
  assert.ok(f.calls.some(([u])=>u.includes('/payload-')));
  assert.equal(f.calls.filter(([u])=>u===api+'releases/assets/1').length,1);
  assert.equal(f.calls.filter(([u])=>u===api+'releases/assets/12').length,0);
});
test('partial occupied identities are not completed publications; inconsistent provenance fails',async()=>{
  const partial=publicationFixture();delete partial.npm.versions['0.2.0'];
  const observed=await publicationState({repository,get:cachedReader(partial.get)});
  assert.deepEqual(observed.partial,['dist/v0.2.0']);assert.ok(observed.snapshot.tags.includes('dist/v0.2.0'));
  assert.equal(observed.history.length,2);
  const bad=publicationFixture();bad.evidence[1].commit='c'.repeat(40);
  await assert.rejects(()=>publicationState({repository,get:cachedReader(bad.get)}),/mismatch/);
  const unavailable=publicationFixture();
  await assert.rejects(()=>publicationState({repository,get:async(url,o)=>url.endsWith('page=2')?{status:503}:unavailable.get(url,o)}),/unavailable/);
  const corrupt=publicationFixture();
  await assert.rejects(()=>publicationState({repository,get:async(url,o)=>url.includes('/payload-')?{status:200,data:Buffer.from('changed bytes')}:corrupt.get(url,o)}));
});
test('unready registry placeholder is not empty publication history',async()=>{
  const f=publicationFixture();f.npm.versions={'0.0.0-stage':{name:npmPackageName,version:'0.0.0-stage',stub:true,dist:{tarball:'https://registry.npmjs.org/stub'}}};f.npm['dist-tags']={};
  await assert.rejects(()=>publicationState({repository,get:cachedReader(f.get)}),/unready/);
});

const run=(id=17,attempt=1)=>({id,run_attempt:attempt,status:'queued',event:'workflow_dispatch',head_branch:'main',path:'.github/workflows/updates.yml',repository:{full_name:repository},head_sha:commit,html_url:`https://github.com/${repository}/actions/runs/${id}`,display_title:'candidate sqlite=3.54.0 sqlite-vec=0.1.9'});
const pr=(number=44,id=17,attempt=1)=>({number,state:'open',html_url:`https://github.com/${repository}/pull/${number}`,changed_files:1,base:{ref:'main',repo:{full_name:repository}},head:{ref:`candidate/run-${id}-${attempt}`,sha:commit,repo:{full_name:repository}}});
function candidateFixture(){
  const runs=[run()],prs=[pr()],changed=new Map(),values=new Map();
  const requests=[];
  const get=async(url)=>{requests.push(url);
    if(url.includes('actions/workflows/'))return {status:200,data:{total_count:runs.length,workflow_runs:runs},headers:{}};
    if(url.startsWith(api+'pulls?'))return {status:200,data:prs,headers:{}};
    const identity=url.match(/\/pulls\/(\d+)(\/files)?/);
    if(identity){const p=prs.find(p=>p.number===+identity[1]);return {status:200,data:identity[2]?[{filename:'inputs/release.json',status:changed.get(p.number)||'modified'}]:p,headers:{}};}
    if(url.includes('/contents/')){
      const path=url.includes('sources.lock')?'inputs/sources.lock.json':'inputs/release.json';
      const value=values.get(path)|| (path.includes('sources.lock')?{sqlite:{version:pair.sqlite},sqliteVec:{version:pair.sqliteVec}}:{schemaVersion:1,...pair,releaseComment:'',preparation:{runId:17,url:`https://github.com/${repository}/actions/runs/17`}});
      const raw=Buffer.from(JSON.stringify(value));return {status:200,data:{type:'file',path,encoding:'base64',size:raw.length,content:raw.toString('base64')}};
    }
    throw Error('Unexpected '+url);
  };
  return {runs,prs,changed,values,requests,get};
}
test('exact-head changed descriptors join active preparation while keeping distinct PRs and attempts',async()=>{
  const f=candidateFixture();f.prs.push(pr(45));f.runs.push(run(17,2));
  const observed=await candidateState({repository,get:f.get});
  assert.equal(observed.length,3);assert.ok(observed.find(x=>x.number===44).run);
  assert.equal(observed.filter(x=>x.kind==='pr').length,2);
  assert.equal(observed.filter(x=>x.kind==='pr'&&x.run).length,1);
  assert.ok(observed.every(x=>!x.run || x.kind==='pr'));
  assert.ok(observed.find(x=>x.kind==='run'&&x.attempt===2));
  assert.ok(f.requests.filter(u=>u.includes('/contents/')).every(u=>u.endsWith('?ref='+commit)));
});
test('inherited descriptor, completed failures and unrelated branches do not become candidates or refusal records',async()=>{
  const f=candidateFixture();f.changed.set(44,'unchanged');f.runs[0].status='completed';f.prs.push({...pr(45),head:{ref:'unrelated',sha:commit}});
  assert.deepEqual(await candidateState({repository,get:f.get}),[]);
});

test('same run and attempt cannot supply repeated or contradictory pre-PR selections',async()=>{
  for(const title of ['candidate sqlite=3.54.0 sqlite-vec=0.1.9','candidate sqlite=3.54.1 sqlite-vec=0.1.9']) {
    const f=candidateFixture();f.prs.length=0;f.runs.push({...run(),display_title:title});
    await assert.rejects(()=>candidateState({repository,get:f.get}),/Repeated active preparation observation/);
  }
  const f=candidateFixture();f.prs.length=0;f.runs.push(run(17,2),run(18,1));
  const observed=await candidateState({repository,get:f.get});
  assert.deepEqual(observed.map(x=>[x.runId,x.attempt]).sort(),[[17,1],[17,2],[18,1]]);
  assert.ok(observed.every(x=>x.kind==='run' && !x.run));
});
test('legacy, unsafe, truncated and contradictory candidate reads fail explicitly',async()=>{
  for(const modify of [f=>f.runs[0].display_title='Updates',f=>f.runs[0].repository.full_name='other/repository',f=>f.runs[0].head_branch='other',f=>f.runs[0].path='.github/workflows/other.yml',f=>f.prs[0].changed_files=2,
    f=>f.values.set('inputs/sources.lock.json',{sqlite:{version:'3.53.4'},sqliteVec:{version:'0.1.9'}}),
    f=>f.values.set('inputs/release.json',{schemaVersion:1,...pair,releaseComment:'',preparation:{runId:17,url:'https://github.com/other/repository/actions/runs/17'}})]) {
    const f=candidateFixture();modify(f);await assert.rejects(()=>candidateState({repository,get:f.get}));
  }
  const f=candidateFixture();await assert.rejects(()=>candidateState({repository,get:async(url)=>url.includes('actions/workflows/')?{status:200,data:{total_count:2,workflow_runs:f.runs},headers:{}}:f.get(url)}),/Truncated/);
  const moved=candidateFixture();await assert.rejects(()=>candidateState({repository,get:async(url)=>{
    const r=await moved.get(url);return url===api+'pulls/44'?{...r,data:{...r.data,head:{...r.data.head,sha:'b'.repeat(40)}}}:r;
  }}),/head changed/);
});
