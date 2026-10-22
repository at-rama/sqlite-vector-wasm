import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {deliveryReceipt,deliveryOperations} from '../../release/delivery.mjs';
import {documentHash as hash} from '../documentation.mjs';
import {candidateProfile} from '../../updates/documentation.mjs';
import {stableSource,siteSelection,assertStableCurrent,eligibleSource,publicationCompletion,verifyPublished} from '../eligibility.mjs';
const repository='at-rama/sqlite-vector-wasm',main='a'.repeat(40),prior='b'.repeat(40),head='c'.repeat(40);
const response=data=>({status:200,data});
const stable={sourceCommit:prior,selection:{mode:'published',version:'0.2.0'},publication:{version:'0.2.0'},demoSelection:{version:'0.2.0'}};
const readAt=async(commit,path)=>path==='tools/site/docs-example.json'?JSON.stringify(candidateProfile):path==='tools/site/demo-runtime.json'?null:JSON.stringify({schemaVersion:1});
const event={number:76,pull_request:{number:76,state:'open',head:{sha:head,ref:'plan/release-docs-review',repo:{full_name:repository}}}};
const common={repository,event,sha:main,actor:'maintainer',readAt,directory:'.work/site',get:async()=>response({sha:main})};
const selected=async()=>structuredClone(stable);
for(const eventName of ['push','workflow_dispatch'])test(eventName+' keeps the eligible previous source while merged candidate is pending',async()=>{
 const result=await siteSelection({...common,eventName,ref:'refs/heads/main',selectStable:selected});
 assert.equal(result.stable.sourceCommit,prior);assert.equal(result.preview,null);assert.equal(result.publish,true);
});
test('an unrelated PR cannot expose pending main; exact preview and original demo are separate',async()=>{
 const result=await siteSelection({...common,eventName:'pull_request',selectStable:selected,resolveSource:async()=>{throw Error('pending');}});
 assert.equal(result.stable.sourceCommit,prior);assert.deepEqual(result.stable.demoSelection,stable.demoSelection);
 assert.deepEqual(result.preview,{branch:event.pull_request.head.ref,commit:head});assert.equal(result.input,'exercise');
 assert.deepEqual(result.previewSelection,candidateProfile);
});
for(const restriction of ['fork','dependabot'])test(restriction+' validates without stable publication eligibility',async()=>{
 const ev=structuredClone(event);if(restriction==='fork')ev.pull_request.head.repo.full_name='other/fork';
 const result=await siteSelection({...common,event:ev,actor:restriction==='dependabot'?'dependabot[bot]':'maintainer',eventName:'pull_request',selectStable:async()=>assert.fail('no stable deployment for restricted PR'),resolveSource:async()=>{throw Error('unpublished');}});
 assert.equal(result.publish,false);
});
test('genuine absent shell supports preview bootstrap, unknown stable eligibility blocks',async()=>{
 assert.equal((await siteSelection({...common,eventName:'pull_request',selectStable:async()=>null,resolveSource:async()=>null})).stable,null);
 await assert.rejects(siteSelection({...common,eventName:'workflow_dispatch',ref:'refs/heads/main',selectStable:async()=>null}),/Stable source absent/);
});
const pending=()=>Object.assign(new Error('publication pending'),{publicationPending:true});
test('previous source is resolved from bounded Git history without public Pages or CI artifacts',async()=>{
 const seen=[],urls=[];
 const get=async url=>{urls.push(url);assert.ok(url.startsWith('https://api.github.com/'));return response(url.includes('/compare/')?{status:'ahead',merge_base_commit:{sha:prior}}:[{parents:[{sha:prior}]}]);};
 const result=await stableSource({repository,mainCommit:main,readAt,get,resolveSource:async({commit})=>{seen.push(commit);if(commit===main)throw pending();return structuredClone(stable);}});
 assert.equal(result.sourceCommit,prior);assert.deepEqual(seen,[main,prior]);assert.equal(urls.length,2);
 await assert.rejects(stableSource({repository,mainCommit:main,readAt,get,trigger:{id:1},resolveSource:async()=>{throw pending();}}),/pending/);
 await assert.rejects(stableSource({repository,mainCommit:main,readAt,get:async()=>assert.fail('No fallback on unknown evidence'),resolveSource:async()=>{throw Error('API unavailable');}}),/API unavailable/);
 await assert.rejects(stableSource({repository,mainCommit:main,readAt,get:async()=>response([]),resolveSource:async()=>{throw pending();}}),/bounded descriptor history/);
});
test('freshness rejects advanced publication eligibility without requiring a new main commit',async()=>{
 const record={repository,mainCommit:main,stableDocumentation:structuredClone(stable)};
 await assertStableCurrent(record,{get:common.get,readAt,selectStable:selected});
 await assert.rejects(assertStableCurrent(record,{get:common.get,readAt,selectStable:async()=>({...stable,sourceCommit:main})}),/eligibility changed/);
 await assert.rejects(assertStableCurrent({...record,stableDocumentation:null},{get:common.get,readAt,selectStable:selected}));
});
test('manual old controller and foreign completion fail before deployment',async()=>{
 await assert.rejects(siteSelection({...common,eventName:'workflow_dispatch',ref:'refs/heads/main',sha:prior}),/Stale/);
 await assert.rejects(siteSelection({...common,eventName:'workflow_run',ref:'refs/heads/main',event:{repository:{full_name:repository},workflow_run:{repository:{full_name:'other/repo'}}}}),/Unrelated/);
});
test('a successful qualification exercise supplies no product handoff and cannot promote',async()=>{
 const run={id:9,head_sha:head,run_attempt:1,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion:'success'};
 const result=await siteSelection({...common,eventName:'workflow_run',ref:'refs/heads/main',event:{repository:{full_name:repository},workflow_run:run},
 get:async url=>response(url.endsWith('/commits/main')?{sha:main}:url.includes('/jobs?')?{total_count:1,jobs:[{name:'publish',status:'completed',conclusion:'skipped'}]}:run),selectStable:async()=>assert.fail('no promotion from exercise')});
 assert.equal(result.relevant,false);assert.equal(result.publish,false);
});
async function candidate(t) {
 const lockText=await readFile(new URL('../../../inputs/sqlite-vector.sources.lock.json',import.meta.url),'utf8'),lock=JSON.parse(lockText);
 const prep={runId:17,url:'https://github.com/'+repository+'/actions/runs/17'};
 const pub={schemaVersion:1,name:'@at-rama/sqlite-vector-wasm',version:'0.3.0',tag:'dist/v0.3.0',channel:'latest',commit:prior,
 upstreams:{sqlite:lock.sqlite.version,sqliteVector:lock.sqliteVector.version},engine:{key:'sqliteVector',upstream:'sqliteai/sqlite-vector',version:lock.sqliteVector.version},
 sourceLock:lock,sourceLockSha256:hash(lockText),archive:{size:10,sha256:'d'.repeat(64)},build:{tools:{}},acceptance:{verdict:'passed'},invocation:{preparation:prep,pullRequest:4},documentation:{reviewed:{}}};
 const release={id:5,tag_name:pub.tag,draft:false,assets:[{name:'publication.json',url:'https://fixture/publication'}]};
 const source={'tools/site.sh':'shell','site/index.md':'# site','tools/site/docs-example.json':JSON.stringify(candidateProfile),
 'inputs/release.json':JSON.stringify({schemaVersion:2,...pub.upstreams,preparation:prep,releaseComment:''}),
 'inputs/sqlite-vector.sources.lock.json':lockText,'tools/site/demo-runtime.json':JSON.stringify(stable.demoSelection)};
 const get=async url=>response(url.includes('/releases?')?[release]:url.includes('/compare/')?{status:'ahead',merge_base_commit:{sha:prior}}:Buffer.from(JSON.stringify(pub)));
 const invoke=extra=>eligibleSource({repository,commit:main,get,readAt:async(c,p,optional)=>p in source?source[p]:optional?null:assert.fail(p),
 completion:async()=>({runId:9,attempt:1,artifactId:10,artifactSha256:'e'.repeat(64),status:'complete'}),
 verify:async()=>({mode:'published',engine:'sqliteVector',version:pub.version,archiveSha256:pub.archive.sha256}),...extra});
 return {pub,release,source,get,invoke};
}
test('complete matching publication mechanically selects final identity without changing the demo',async t=>{
 const f=await candidate(t),result=await f.invoke();assert.equal(result.selection.version,'0.3.0');assert.equal(result.selection.mode,'published');
 assert.equal(result.promotion.status,'complete');assert.deepEqual(result.demoSelection,stable.demoSelection);
});
for(const failure of ['pending','failed','partial'])test(failure+' publication cannot make candidate sources eligible',async t=>{
 const f=await candidate(t);await assert.rejects(f.invoke({completion:async()=>{throw Error(failure);}}),new RegExp(failure));
});
test('another preparation, changed archive/source lock and unrelated commit cannot promote',async t=>{
 const f=await candidate(t);
 f.pub.invocation.preparation.runId=18;await assert.rejects(f.invoke());f.pub.invocation.preparation.runId=17;
 f.pub.sourceLockSha256='0'.repeat(64);await assert.rejects(f.invoke());f.pub.sourceLockSha256=hash(f.source['inputs/sqlite-vector.sources.lock.json']);
 await assert.rejects(f.invoke({get:async url=>url.includes('/compare/')?response({status:'diverged',merge_base_commit:{sha:head}}):f.get(url)}),/Unrelated/);
});
test('ordinary published documentation revision remains deployable after completion',async t=>{
 const f=await candidate(t);f.source['tools/site/docs-example.json']=JSON.stringify({mode:'published',version:f.pub.version,archiveSha256:f.pub.archive.sha256});
 assert.equal((await f.invoke()).sourceCommit,main);
});
async function durable(t) {
 const f=await candidate(t);f.pub.repository=repository;f.pub.deliveryReceipt='delivery.json';
 f.release.prerelease=false;f.release.assets=['publication.json','payload.tgz','attestation.json','delivery.json'].map(name=>({name,state:'uploaded',url:'https://fixture/'+name}));
 const bytes=Buffer.from(JSON.stringify(f.pub,null,2)+'\n');
 const receipt=structuredClone(deliveryReceipt(f.pub,f.release,deliveryOperations.map(operation=>({operation,status:'succeeded'}))));
 const pr={merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:repository}},head:{sha:head,repo:{full_name:repository}},merge_commit_sha:prior};
 const run={id:9,head_sha:head,run_attempt:1,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed'};
 const input={repository,publication:f.pub,release:f.release,trigger:run,get:async url=>{
  assert.doesNotMatch(url,/actions\/|github\.io|registry\.npmjs/,'No expiring artifact or public visibility input');
  return response(url.includes('/pulls/')?pr:url.endsWith('/delivery.json')?Buffer.from(JSON.stringify(receipt)):bytes);
 }};
 return {...f,bytes,receipt,pr,run,input};
}
test('durable completion needs exact finalized subject and integrated human PR, not CI artifacts',async t=>{
 const f=await durable(t);assert.equal((await publicationCompletion(f.input)).completion,'durable-release-receipt');
 f.pr.merge_commit_sha=head;await assert.rejects(publicationCompletion(f.input));f.pr.merge_commit_sha=prior;
 f.run.head_sha=main;await assert.rejects(publicationCompletion(f.input),/Unrelated/);f.run.head_sha=head;
 f.release.draft=true;await assert.rejects(publicationCompletion(f.input),/not finalized/);f.release.draft=false;
 f.receipt.subject.archive.sha256='0'.repeat(64);await assert.rejects(publicationCompletion(f.input),/subject mismatch/);
});
test('new receipt cannot be missing or borrowed from another archive/commit or replaced by manifest contents',async t=>{
 for(const mutate of [f=>f.release.assets.pop(),f=>{f.receipt.subject.commit=main;},f=>{f.receipt.publicationSha256='0'.repeat(64);},f=>{f.receipt.operations[5].status='unknown';}]){
  const f=await durable(t);mutate(f);await assert.rejects(publicationCompletion(f.input));
 }
});
test('historical completion uses only explicit read-only destination checks and cannot fabricate a receipt',async t=>{
 const f=await candidate(t),seen=[];
 const pr={merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:repository}},head:{sha:head,repo:{full_name:repository}},merge_commit_sha:prior};
 const invoke=status=>publicationCompletion({repository,publication:f.pub,release:f.release,get:async url=>{assert.ok(url.includes('/pulls/'));return response(pr);},
 services:{verifyGitHub:async()=>seen.push('github'),verifyNpm:async()=>{seen.push('npm');return {status};}}});
 assert.equal((await invoke('verified')).completion,'historical-destination-inspection');assert.deepEqual(seen,['github','npm']);
 await assert.rejects(invoke('verification-pending'),/Historical npm identity/);
});
test('matching completion passes only its verified run to stable selection; stale attempt stops',async()=>{
 const run={id:9,head_sha:head,run_attempt:2,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion:'success'};
 const value={...common,eventName:'workflow_run',ref:'refs/heads/main',event:{repository:{full_name:repository},workflow_run:structuredClone(run)},
 get:async url=>response(url.endsWith('/commits/main')?{sha:main}:url.includes('/jobs?')?{total_count:1,jobs:[{name:'publish',status:'completed',conclusion:'success'}]}:run),
 selectStable:async({trigger})=>{assert.deepEqual(trigger,run);return {...stable,sourceCommit:main};}};
 assert.equal((await siteSelection(value)).stable.sourceCommit,main);
 run.run_attempt=3;await assert.rejects(siteSelection(value));
});
test('fallback source must remain an ancestor and unknown historical eligibility stops',async()=>{
 const args={repository,mainCommit:main,readAt,resolveSource:async({commit})=>{if(commit===main)throw pending();return stable;}};
 await assert.rejects(stableSource({...args,get:async url=>response(url.includes('/compare/')?{status:'diverged',merge_base_commit:{sha:head}}:[{parents:[{sha:prior}]}])}),/unrelated/);
 await assert.rejects(stableSource({...args,get:async url=>response(url.includes('/compare/')?{status:'ahead',merge_base_commit:{sha:prior}}:[{parents:[{sha:prior}]}]),resolveSource:async({commit})=>{throw commit===main?pending():Error('registry unavailable');}}),/registry unavailable/);
});

test('failed or skipped publisher completion does not select or deploy stable sources',async()=>{
 for(const conclusion of ['failure','skipped','cancelled']){
 const run={id:9,head_sha:head,run_attempt:2,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion};
 const result=await siteSelection({...common,eventName:'workflow_run',ref:'refs/heads/main',event:{repository:{full_name:repository},workflow_run:run},
 get:async url=>response(url.endsWith('/commits/main')?{sha:main}:url.includes('/jobs?')?{total_count:1,jobs:[{name:'publish',status:'completed',conclusion}]}:run),selectStable:async()=>assert.fail('No stable promotion')});
 assert.equal(result.relevant,false);assert.equal(result.publish,false);
 }
});

test('a cleanup PR without release.json still selects an unpublished preview and preserves stable eligibility',async()=>{
 const absent=async(commit,path)=>path==='inputs/release.json'?null:readAt(commit,path);
 const result=await siteSelection({...common,readAt:absent,eventName:'pull_request',selectStable:selected,resolveSource:async()=>{throw Error('unpublished');}});
 assert.equal(result.input,'exercise');assert.deepEqual(result.previewSelection,candidateProfile);
 assert.equal(result.stable.sourceCommit,prior);
});


test('only adopted main placeholder replaces the historical stable demo, independently of unpublished docs', async () => {
 const markdown = '# Demo\n\nThe demonstration is being refactored for SQLite-Vector.\n\n[Read the usage documentation](../usage/).\n';
 const source = async (commit,path,...args) => path==='site/demo/index.md' ? (commit===main?markdown:'# Demo\n<script>old runtime</script>') : readAt(commit,path,...args);
 const result=await siteSelection({...common,readAt:source,eventName:'pull_request',selectStable:selected,resolveSource:async()=>{throw Error('pending');}});
 assert.equal(result.stable.sourceCommit,prior);assert.deepEqual(result.stable.selection,stable.selection);
 assert.deepEqual(result.stablePlaceholder,{sourceCommit:main,sha256:hash(markdown),markdown});
 await assertStableCurrent({repository,mainCommit:main,stableDocumentation:stable,stablePlaceholder:result.stablePlaceholder},{get:common.get,readAt:source,selectStable:selected});
 await assert.rejects(assertStableCurrent({repository,mainCommit:main,stableDocumentation:stable,stablePlaceholder:{...result.stablePlaceholder,sha256:'0'.repeat(64)}},{get:common.get,readAt:source,selectStable:selected}),/placeholder source changed/);
 const previewOnly=await siteSelection({...common,readAt:async(commit,path,...args)=>path==='site/demo/index.md'?(commit===head?markdown:'# Old demo'):readAt(commit,path,...args),eventName:'pull_request',selectStable:selected,resolveSource:async()=>{throw Error('pending');}});
 assert.equal(previewOnly.stablePlaceholder,undefined);
});
