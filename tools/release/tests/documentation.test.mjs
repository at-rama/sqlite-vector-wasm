import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { hash, root } from '../../package/package.mjs';
import { candidateDocumentPaths, documentSnapshot } from '../../updates/documentation.mjs';
import { documentationSources, renderPublicDocument } from '../../site/documentation.mjs';
import { reviewedDocumentation } from '../documentation.mjs';
import { qualify, publish, inspectPublicationCompletion } from '../run.mjs';
import { releaseFixture, syntheticAttestation } from './fixture.mjs';

const selected={selection:{sqlite:'3.54.0',sqliteVector:'1.1.2'},preparation:{runId:17,url:'https://github.com/a/b/actions/runs/17'}};
const head='b'.repeat(40),merge='a'.repeat(40),base='c'.repeat(40);
const record = async (directory,name,value) => { await mkdir(directory,{recursive:true});await writeFile(join(directory,name),JSON.stringify(value)); };
async function sourceFixture(t,version='0.1.0') {
  const f=await releaseFixture(t,{version});
  for (const path of candidateDocumentPaths) {
    await mkdir(join(f.repository,path,'..'),{recursive:true});await cp(join(root,path),join(f.repository,path));
  }
  const sources=await documentSnapshot(f.repository);
  const result={sqliteVersion:selected.selection.sqlite,engineVersion:selected.selection.sqliteVector,neighbors:[[1,0],[2,Math.SQRT2]]};
  const example={context:{mode:'candidate',engine:'sqliteVector',version:'0.1.0',commit:head,qualifiedCommit:head,sourceDirty:false,
    upstreams:selected.selection,archive:{size:f.packaged.archive.size,sha256:f.packaged.archive.sha256},
    sourceHashes:Object.fromEntries(documentationSources.map(p=>[p,sources[p]]))},replayOnly:false,browser:'synthetic policy fixture',result,workerResult:result,unchangedRuntime:true};
  return {...f,sources,example};
}
async function reviewFixture(t) {
 const f=await sourceFixture(t),repository='a/b';
 const source=Object.fromEntries(await Promise.all(candidateDocumentPaths.map(async p=>[p,await readFile(join(f.repository,p),'utf8')])));
 source['inputs/release.json']=JSON.stringify({schemaVersion:2,...selected.selection,preparation:selected.preparation,releaseComment:''});
 source['inputs/sqlite-vector.sources.lock.json']=JSON.stringify(f.report.sourceLock);
 const pr={number:4,merge_commit_sha:merge,head:{sha:head,ref:'candidate/run-17-1',repo:{full_name:repository}}};
 const common={status:'completed',conclusion:'success',run_attempt:1,repository:{full_name:repository}};
 const preparation={...common,id:17,path:'.github/workflows/updates.yml',event:'workflow_dispatch',head_sha:base,head_branch:'main'};
 const site={...common,id:18,path:'.github/workflows/site.yml',event:'pull_request',head_sha:head};
 const jobs={total_count:3,jobs:['build','deploy','observe'].map(name=>({name,status:'completed',conclusion:'success'}))};
 const candidate={status:'candidate-ready',commit:head,baseCommit:base,pullRequest:{number:4,head},selection:selected.selection,
   preparation:selected.preparation,documentSources:f.sources,archive:f.example.context.archive,identity:{version:'0.1.0'},documentation:{example:f.example}};
 const accepted=structuredClone(f.report);accepted.source.commit=head;
 const input={runId:17,commit:head,artifactId:101,artifactSha256:'d'.repeat(64)};
 const live={publication:{repository,pullRequest:4,mode:'preview',preview:{commit:head,branch:pr.head.ref}},results:[{
   preview:{commit:head,branch:pr.head.ref},url:'https://a.github.io/b/preview/',viewports:[1280,390],browser:'synthetic policy fixture',destinations:3,directVisits:6,clientTransitions:6,
   documentation:documentationSources.map(p=>({source:p,sha256:hash(Buffer.from(renderPublicDocument(source[p],f.example.context)))}))}]};
 const get=async url=>({status:200,data:url.includes('/attempts/')?preparation:url.includes('/jobs?')?jobs:url.includes('?head_sha=')?{workflow_runs:[site]}:site});
 const artifact=async({name})=>{
   const directory=join(f.repository,'.work/review',name);
   if(name.startsWith('updates-')) {await record(directory,'candidate.json',candidate);await record(directory,'acceptance.json',accepted);}
   else if(name.startsWith('site-checks-')) {await record(directory,'handoff.json',input);await record(directory,'result.json',f.example);}
   else await record(directory,'live-pages.json',live);
   return {directory,id:name.startsWith('updates-')?101:name.startsWith('site-checks-')?102:103,sha256:'d'.repeat(64)};
 };
 const changes={path:undefined};
 const readAt=async(revision,path)=>{assert.ok([head,merge].includes(revision));return source[path]+(revision===merge&&changes.path===path?' unreviewed':'');};
 const invoke=()=>reviewedDocumentation({repository,pr,selected,readAt,get,artifact});
 return {...f,source,pr,preparation,site,jobs,candidate,accepted,input,live,invoke,readAt,changes};
}

test('review binds preparation, qualified archive, exact Site jobs/live content and unchanged merged sources',async t=>{
 const f=await reviewFixture(t),result=await f.invoke();
 assert.equal(result.candidateCommit,head);assert.deepEqual(result.sourceHashes,f.sources);assert.equal(result.site.runId,18);
 for(const path of candidateDocumentPaths) {
   f.changes.path=path;await assert.rejects(f.invoke(),/Unreviewed integrated/);
 }
 f.changes.path=undefined;
 for(const key of ['inputs/release.json','inputs/sqlite-vector.sources.lock.json']){f.changes.path=key;await assert.rejects(f.invoke(),/Unreviewed integrated/);}
});

for(const failure of ['prepared-head','prepared-archive','prepared-status','rehearsal','missing-source','wrong-preparation','wrong-repository','wrong-workflow','wrong-event','site-pending','site-failed','site-head','job-missing','job-failed','input-run','input-artifact','input-digest','example-archive','example-replay','live-head','live-branch','live-source','missing-mobile'])
test(`review rejects ${failure} without publication authority`,async t=>{
 const f=await reviewFixture(t);
 switch(failure){
  case 'prepared-head':f.candidate.commit='e'.repeat(40);break;
  case 'prepared-archive':f.candidate.archive={...f.candidate.archive,sha256:'e'.repeat(64)};break;
  case 'prepared-status':f.candidate.status='failed';break;
  case 'rehearsal':f.candidate.status='qualified-without-pr';break;
  case 'missing-source':delete f.candidate.documentSources['README.md'];break;
  case 'wrong-preparation':f.preparation.run_attempt=2;break;
  case 'wrong-repository':f.site.repository={full_name:'other/repo'};break;
  case 'wrong-workflow':f.site.path='.github/workflows/other.yml';break;
  case 'wrong-event':f.site.event='push';break;
  case 'site-pending':f.site.status='in_progress';break;
  case 'site-failed':f.site.conclusion='failure';break;
  case 'site-head':f.site.head_sha='e'.repeat(40);break;
  case 'job-missing':f.jobs.jobs.pop();f.jobs.total_count--;break;
  case 'job-failed':f.jobs.jobs[2].conclusion='failure';break;
  case 'input-run':f.input.runId=19;break;
  case 'input-artifact':f.input.artifactId=999;break;
  case 'input-digest':f.input.artifactSha256='e'.repeat(64);break;
  case 'example-archive':f.example.context.archive={size:1,sha256:'e'.repeat(64)};break;
  case 'example-replay':f.example.replayOnly=true;break;
  case 'live-head':f.live.publication.preview.commit='e'.repeat(40);break;
  case 'live-branch':f.live.publication.preview.branch='other';break;
  case 'live-source':f.live.results[0].documentation[0].sha256='e'.repeat(64);break;
  case 'missing-mobile':f.live.results[0].viewports=[1280];break;
 }
 await assert.rejects(f.invoke());
});

const state=()=>({schemaVersion:1,tags:['dist/v0.1.0'],releaseTags:['dist/v0.1.0'],npmVersions:['0.1.0'],heads:{latest:{version:'0.1.0',commit:head,upstreams:selected.selection},next:null}});
async function finalFixture(t) {
 const f=await sourceFixture(t,'0.1.1');
 const reviewed={candidateCommit:head,forecast:'0.1.0',archive:{size:7,sha256:'f'.repeat(64)},sourceHashes:f.sources,
   preparation:{runId:17,attempt:1},site:{runId:18},example:structuredClone(f.example)};
 reviewed.example.context.archive=reviewed.archive;
 const context={...f.context,preparation:selected.preparation,pullRequest:4,documentation:reviewed};
 const final=structuredClone(f.example);final.context={...final.context,commit:merge,qualifiedCommit:merge,version:'0.1.1',archive:f.example.context.archive};
 const run=async(cmd,args)=>cmd==='git'&&args[0]==='rev-parse'?merge:'';
 const links={check:'source-relative-targets-and-fragments',context:final.context,pages:documentationSources.map(source=>({source,sourceSha256:f.sources[source],sha256:'d'.repeat(64),links:[],images:[]}))};
 const invoke=()=>qualify({...f,context,run,readSnapshot:async()=>state(),produce:async()=>({bundle:f.bundle}),documentationCheck:async()=>({example:final,links})});
 return {...f,context,final,links,invoke};
}
function destinations(failAt,visibility='verified') {
 const calls=[];const call=name=>async()=>{calls.push(name);if(name===failAt)throw Error('injected '+name);return name==='draft'?{id:1}:{};};
 return {calls,assertReady:call('ready'),createTag:call('tag'),createDraft:call('draft'),upload:call('upload'),npmPublish:call('npm'),finalize:call('github'),verifyGitHub:call('github-identity'),verifyNpm:async()=>{calls.push('npm-identity');return {status:visibility};}};
}
test('definitive number/archive/example renew before publication and complete handoff binds their identities',async t=>{
 const f=await finalFixture(t),handoff=await f.invoke(),evidence=JSON.parse(await readFile(handoff.evidencePath));
 assert.equal(handoff.identity.version,'0.1.1');assert.equal(evidence.documentation.reviewed.forecast,'0.1.0');
 assert.equal(evidence.documentation.example.context.commit,merge);assert.deepEqual(evidence.documentation.example.context.archive,evidence.archive);
 const services=destinations();const result=await publish({...f,handoff,readSnapshot:async()=>state(),services,attestation:{bundle:syntheticAttestation(evidence)}});
 assert.equal(result.status,'complete');assert.equal(result.stableDocumentationEligible,true);assert.deepEqual(result.publication,evidence);
 assert.deepEqual(JSON.parse(await readFile(join(handoff.directory,'outcome.json'))).publication,evidence);
});
for(const failure of ['no-review','changed-source','wrong-final-head','wrong-final-archive','wrong-final-version','missing-final-links','stale-final-links'])test(`final qualification rejects ${failure}`,async t=>{
 const f=await finalFixture(t);
 if(failure==='no-review')delete f.context.documentation;
 if(failure==='changed-source')await writeFile(join(f.repository,'README.md'),'unreviewed merge');
 if(failure==='wrong-final-head')f.final.context.commit=head;
 if(failure==='wrong-final-archive')f.final.context.archive={size:1,sha256:'f'.repeat(64)};
 if(failure==='wrong-final-version')f.final.context.version='0.1.0';
 if(failure==='missing-final-links')f.links.check='not-executed';
 if(failure==='stale-final-links')f.links.pages[0].sourceSha256='0'.repeat(64);
 await assert.rejects(f.invoke());
});
test('incomplete destinations and changed final proof never supply stable promotion',async t=>{
 const f=await finalFixture(t),handoff=await f.invoke(),evidence=JSON.parse(await readFile(handoff.evidencePath));
 for(const failAt of ['npm','github','github-identity']) {
  const services=destinations(failAt);await assert.rejects(publish({...f,handoff,readSnapshot:async()=>state(),services,attestation:{bundle:syntheticAttestation(evidence)}}));
  const result=JSON.parse(await readFile(join(handoff.directory,'outcome.json')));assert.equal(result.status,'failed');assert.notEqual(result.stableDocumentationEligible,true);assert.equal(result.publication,undefined);
 }
 const pending=await publish({...f,handoff,readSnapshot:async()=>state(),services:destinations(null,'verification-pending'),attestation:{bundle:syntheticAttestation(evidence)}});
 assert.equal(pending.status,'published-verification-pending');assert.notEqual(pending.stableDocumentationEligible,true);
 const changed=structuredClone(handoff);changed.documentation.example.context.archive.sha256='0'.repeat(64);
 const noCalls=destinations();await assert.rejects(publish({...f,handoff:changed,readSnapshot:async()=>state(),services:noCalls,attestation:{bundle:syntheticAttestation(evidence)}}));assert.deepEqual(noCalls.calls,[]);
});


test('visibility completion and site retries only re-observe the same already executed publication',async t=>{
 const f=await finalFixture(t),handoff=await f.invoke(),evidence=JSON.parse(await readFile(handoff.evidencePath));
 await publish({...f,handoff,readSnapshot:async()=>state(),services:destinations(null,'verification-pending'),attestation:{bundle:syntheticAttestation(evidence)}});
 const outcome=JSON.parse(await readFile(join(handoff.directory,'outcome.json'))),reads=[];
 const verifyGitHub=async()=>reads.push('github-read');
 const verifyNpm=async()=>{reads.push('npm-read');return {status:'verified'};};
 const result=await inspectPublicationCompletion({evidence,outcome,verifyGitHub,verifyNpm});
 assert.equal(result.status,'complete');assert.equal(result.stableDocumentationEligible,true);assert.deepEqual(result.publication,evidence);
 assert.deepEqual(reads,['github-read','npm-read']);
 assert.equal((await inspectPublicationCompletion({evidence,outcome,verifyGitHub,verifyNpm:async()=>({status:'verification-pending'})})).stableDocumentationEligible,false);
 for(const status of ['failed','npm-pending','in-progress'])await assert.rejects(inspectPublicationCompletion({evidence,outcome:{...outcome,status},verifyGitHub:async()=>assert.fail('no read for failed publication'),verifyNpm}));
 const wrong=structuredClone(outcome);wrong.identity.version='0.1.2';await assert.rejects(inspectPublicationCompletion({evidence,outcome:wrong,verifyGitHub,verifyNpm}));
 const partial=structuredClone(outcome);partial.outcomes[5].status='failed';await assert.rejects(inspectPublicationCompletion({evidence,outcome:partial,verifyGitHub,verifyNpm}));
});
