import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {documentHash as hash} from '../documentation.mjs';
import {candidateProfile} from '../../updates/documentation.mjs';
import {stableSource,siteSelection,assertStableCurrent,eligibleSource,publicationCompletion} from '../eligibility.mjs';
const repository='at-rama/sqlite-vector-wasm',main='a'.repeat(40),prior='b'.repeat(40),head='c'.repeat(40);
const response=data=>({status:200,data});
const stable={sourceCommit:prior,selection:{mode:'published',version:'0.2.0'},publication:{version:'0.2.0'},demoSelection:{version:'0.2.0'}};
const readAt=async(commit,path)=>path==='tools/site/docs-example.json'?JSON.stringify(candidateProfile):JSON.stringify({schemaVersion:1});
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
test('previous public source is resolved from existing Pages/Git evidence and reverified',async()=>{
 const seen=[];
 const get=async url=>response(url.includes('/compare/')?{status:'ahead',merge_base_commit:{sha:prior}}:{repository,stablePresent:true,mainCommit:prior});
 const result=await stableSource({repository,mainCommit:main,readAt,get,resolveSource:async({commit})=>{seen.push(commit);if(commit===main)throw Error('publication pending');return structuredClone(stable);}});
 assert.equal(result.sourceCommit,prior);assert.deepEqual(seen,[main,prior]);
 await assert.rejects(stableSource({repository,mainCommit:main,readAt,get,trigger:{id:1},resolveSource:async()=>{throw Error('partial publication');}}),/partial publication/);
 for(const bad of [{repository:'other/repo',stablePresent:true,mainCommit:prior},{repository,stablePresent:false,mainCommit:prior},{repository,stablePresent:true,mainCommit:main}])
 await assert.rejects(stableSource({repository,mainCommit:main,readAt,get:async()=>response(bad),resolveSource:async()=>{throw Error('pending');}}));
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
 get:async url=>response(url.endsWith('/commits/main')?{sha:main}:url.includes('/artifacts?')?{total_count:1,artifacts:[{name:'release-exercise-9-1'}]}:run),selectStable:async()=>assert.fail('no promotion from exercise')});
 assert.equal(result.relevant,false);assert.equal(result.publish,false);
});
async function candidate(t) {
 const lockText=await readFile(new URL('../../../inputs/sqlite-vector.sources.lock.json',import.meta.url),'utf8'),lock=JSON.parse(lockText);
 const prep={runId:17,url:'https://github.com/'+repository+'/actions/runs/17'};
 const pub={schemaVersion:1,name:'@at-rama/sqlite-vector-wasm',version:'0.3.0',tag:'dist/v0.3.0',channel:'latest',commit:prior,
 upstreams:{sqlite:lock.sqlite.version,sqliteVector:lock.sqliteVector.version},engine:{key:'sqliteVector',upstream:'sqliteai/sqlite-vector',version:lock.sqliteVector.version},
 sourceLock:lock,sourceLockSha256:hash(lockText),archive:{size:10,sha256:'d'.repeat(64)},build:{tools:{}},acceptance:{verdict:'passed'},invocation:{preparation:prep,pullRequest:4}};
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
test('handoff must match integrated human PR, workflow, attempt, outcome and canonical provenance',async t=>{
 const f=await candidate(t),directory=await mkdtemp(join(tmpdir(),'site-completion-'));t.after(()=>rm(directory,{recursive:true,force:true}));
 const run={id:9,head_sha:head,run_attempt:1,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion:'success'};
 const pr={merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:repository}},head:{sha:head,repo:{full_name:repository}},merge_commit_sha:prior};
 const outcome={status:'complete',identity:{version:f.pub.version,tag:f.pub.tag}};
 await writeFile(join(directory,'publication.json'),JSON.stringify(f.pub));
 const invoke=async()=>{await writeFile(join(directory,'outcome.json'),JSON.stringify(outcome));return publicationCompletion({repository,publication:f.pub,release:f.release,trigger:run,directory,
 get:async url=>response(url.includes('/pulls/')?pr:url.includes('/artifacts?')?{total_count:1,artifacts:[{name:'release-outcome-9-1',expired:false}]}:run),
 artifact:async()=>({directory,id:10,sha256:'e'.repeat(64)}),services:{verifyGitHub:async()=>{},verifyNpm:async()=>({status:'verified'})},
 inspect:async({evidence,outcome:value})=>{assert.deepEqual(evidence,f.pub);assert.equal(value.status,'complete');return {status:'complete',stableDocumentationEligible:true};}});};
 assert.equal((await invoke()).runId,9);
 outcome.status='failed';await assert.rejects(invoke(),/No complete/);outcome.status='complete';
 run.conclusion='failure';await assert.rejects(invoke(),/Failed publication/);run.conclusion='success';
 run.repository.full_name='other/repo';await assert.rejects(invoke(),/Unrelated/);run.repository.full_name=repository;
 pr.merge_commit_sha=head;await assert.rejects(invoke());pr.merge_commit_sha=prior;
 const changed=structuredClone(f.pub);changed.archive.sha256='0'.repeat(64);await writeFile(join(directory,'publication.json'),JSON.stringify(changed));await assert.rejects(invoke(),/differs/);
});

test('matching completion passes only its verified run to stable selection; stale attempt stops',async()=>{
 const run={id:9,head_sha:head,run_attempt:2,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion:'success'};
 const value={...common,eventName:'workflow_run',ref:'refs/heads/main',event:{repository:{full_name:repository},workflow_run:structuredClone(run)},
 get:async url=>response(url.endsWith('/commits/main')?{sha:main}:url.includes('/artifacts?')?{total_count:1,artifacts:[{name:'release-outcome-9-2',expired:false}]}:run),
 selectStable:async({trigger})=>{assert.deepEqual(trigger,run);return {...stable,sourceCommit:main};}};
 assert.equal((await siteSelection(value)).stable.sourceCommit,main);
 run.run_attempt=3;await assert.rejects(siteSelection(value));
});
test('fallback source must remain an ancestor and its published state must still verify',async()=>{
 const args={repository,mainCommit:main,readAt,resolveSource:async({commit})=>{if(commit===main)throw Error('pending');return stable;}};
 await assert.rejects(stableSource({...args,get:async url=>response(url.includes('/compare/')?{status:'diverged',merge_base_commit:{sha:head}}:{repository,stablePresent:true,mainCommit:prior})}),/unrelated/);
 await assert.rejects(stableSource({...args,get:async url=>response(url.includes('/compare/')?{status:'ahead',merge_base_commit:{sha:prior}}:{repository,stablePresent:true,mainCommit:prior}),resolveSource:async()=>{throw Error('registry unavailable');}}),/registry unavailable/);
});

test('a failed completion attempt cannot borrow an older successful handoff from the same run',async t=>{
 const f=await candidate(t),directory=await mkdtemp(join(tmpdir(),'site-attempt-'));t.after(()=>rm(directory,{recursive:true,force:true}));
 const run={id:9,head_sha:head,run_attempt:2,repository:{full_name:repository},path:'.github/workflows/release.yml',event:'pull_request',status:'completed',conclusion:'failure'};
 const pr={merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:repository}},head:{sha:head,repo:{full_name:repository}},merge_commit_sha:prior};
 const invoke=()=>publicationCompletion({repository,publication:f.pub,release:f.release,trigger:run,directory,
 get:async url=>response(url.includes('/pulls/')?pr:url.includes('/artifacts?')?{total_count:2,artifacts:[1,2].map(n=>({name:'release-outcome-9-'+n,expired:false}))}:url.includes('/attempts/1')?{...run,run_attempt:1,conclusion:'success'}:run),
 artifact:async({name})=>{await writeFile(join(directory,'publication.json'),JSON.stringify(f.pub));await writeFile(join(directory,'outcome.json'),JSON.stringify({status:name.endsWith('-1')?'complete':'failed',identity:{version:f.pub.version,tag:f.pub.tag}}));return {directory,id:10,sha256:'e'.repeat(64)};},
 services:{verifyGitHub:async()=>{},verifyNpm:async()=>({status:'verified'})},
 inspect:async()=>({status:'complete',stableDocumentationEligible:true})});
 await assert.rejects(invoke(),/No complete matching/);
});


test('a cleanup PR without release.json still selects an unpublished preview and preserves stable eligibility',async()=>{
 const absent=async(commit,path)=>path==='inputs/release.json'?null:readAt(commit,path);
 const result=await siteSelection({...common,readAt:absent,eventName:'pull_request',selectStable:selected,resolveSource:async()=>{throw Error('unpublished');}});
 assert.equal(result.input,'exercise');assert.deepEqual(result.previewSelection,candidateProfile);
 assert.equal(result.stable.sourceCommit,prior);
});
