import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,appendFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {root} from '../package/package.mjs';
import {sourceCommit,documentHash as hash} from './documentation.mjs';
import {httpReader,pages,download,publicationIdentity,npmState,repositoryName} from '../release/state.mjs';
import {candidateDescriptorChanged,descriptor} from '../release/context.mjs';
import {githubServices} from '../release/services.mjs';
import {inspectPublicationCompletion,checkInitialCompletion} from '../release/run.mjs';
import {runArtifact,uniqueRecord} from '../release/artifacts.mjs';
import {mainPlaceholder} from './placeholder.mjs';
import {mainDemo} from './current-demo.mjs';
import {candidateProfile} from '../updates/documentation.mjs';
function api(repository) { return `https://api.github.com/repos/${repository}`; }

async function json(get, url) { const r=await get(url);assert.equal(r.status,200,`Site eligibility unavailable: ${url}`);return r.data; }

async function sourceAt({repository,commit,path,get,localCommit,directory=root,optional=false}) {
 if(commit===localCommit){try{return await readFile(join(directory,path),"utf8");}catch(error){if(optional&&error.code==="ENOENT")return null;throw error;}}
 const r=await get(`${api(repository)}/contents/${path}?ref=${commit}`);if(optional&&r.status===404)return null;
 assert.equal(r.status,200,`Stable source unavailable: ${path}`);const f=r.data;assert.equal(f.type,"file");assert.equal(f.path,path);assert.equal(f.encoding,"base64");
 const b=Buffer.from(f.content,"base64");assert.equal(b.length,f.size);return b.toString("utf8");
}

async function verifyPublished({repository,release,publication,get}) {
 publicationIdentity(publication);const services=githubServices({repository,get});await services.verifyGitHub(release,publication);
 const npm=await npmState(get,{allowAbsent:false}),version=npm.versions[publication.version];assert.ok(version,"Announced npm version unavailable");
 const bytes=await download(version.dist.tarball,get);assert.equal(bytes.length,publication.archive.size);assert.equal(hash(bytes),publication.archive.sha256,"GitHub/npm archive mismatch");
 const records=release.assets.filter(a=>a.name==="publication.json"),archives=release.assets.filter(a=>a.name==="payload.tgz");assert.equal(records.length,1);assert.equal(archives.length,1);
 const record=await download(records[0].url,get);
 return {mode:"published",engine:publication.upstreams.sqliteVector?"sqliteVector":"sqliteVec",version:publication.version,releaseId:release.id,commit:publication.commit,
 publicationUrl:records[0].browser_download_url,publicationSha256:hash(record),archiveUrl:archives[0].browser_download_url,archiveSha256:publication.archive.sha256};
}

async function publicationCompletion({repository,publication,release,get,trigger,directory,artifact=runArtifact,inspect=inspectPublicationCompletion,services=githubServices({repository,get})}) {
 const number=publication.invocation?.pullRequest;assert.ok(Number.isSafeInteger(number)&&number>0,"Missing integrated publication PR");
 const pr=await json(get,`${api(repository)}/pulls/${number}`);assert.ok(pr.merged&&pr.state==="closed"&&pr.merged_by?.type==="User");
 assert.equal(pr.base?.ref,"main");assert.equal(pr.base.repo?.full_name,repository);assert.equal(pr.head?.repo?.full_name,repository);assert.equal(pr.merge_commit_sha,publication.commit);
 let runs;if(trigger)runs=[await json(get,`${api(repository)}/actions/runs/${trigger.id}`)];
 else{const found=[];for(const sha of new Set([pr.head.sha,publication.commit])){const r=await json(get,`${api(repository)}/actions/runs?head_sha=${sha}&event=pull_request&per_page=100`);assert.equal(r.total_count,r.workflow_runs?.length,"Truncated publication run inventory");found.push(...r.workflow_runs);}runs=[...new Map(found.map(r=>[r.id,r])).values()];}
 const eligible=runs.filter(r=>r.path?.split("@")[0]===".github/workflows/release.yml"&&r.repository?.full_name===repository&&r.event==="pull_request"&&[pr.head.sha,publication.commit].includes(r.head_sha)&&r.status==="completed");
 if(trigger)assert.equal(eligible.length,1,"Unrelated release completion");
 const matches=[];
 for(const run of eligible){const list=await json(get,`${api(repository)}/actions/runs/${run.id}/artifacts?per_page=100`);assert.equal(list.total_count,list.artifacts?.length);
  for(const entry of list.artifacts.filter(a=>new RegExp(`^release-outcome-${run.id}-[1-9][0-9]*$`).test(a.name)&&!a.expired&&(!trigger||a.name===`release-outcome-${trigger.id}-${trigger.run_attempt}`))){
   const attempt=Number(entry.name.split("-").at(-1)),source=await json(get,`${api(repository)}/actions/runs/${run.id}/attempts/${attempt}`);
   assert.equal(source.id,run.id);assert.equal(source.head_sha,run.head_sha);assert.equal(source.run_attempt,attempt);assert.equal(source.repository?.full_name,repository);
   assert.equal(source.path?.split("@")[0],".github/workflows/release.yml");assert.equal(source.event,"pull_request");assert.equal(source.status,"completed");
   const input=await artifact({repository,run:source,name:entry.name,get,directory}),outcome=await uniqueRecord(input,"outcome.json");
   const evidence=await uniqueRecord(input,"publication.json",e=>e.commit===publication.commit&&e.version===publication.version);assert.deepEqual(evidence,publication,"Publication handoff differs from published provenance");
   if(outcome.identity?.version!==publication.version||outcome.identity?.tag!==publication.tag)continue;
   let completed;
   if(outcome.status==="npm-pending"&&publication.initial&&publication.version==="0.1.0"){
    assert.deepEqual(outcome.outcomes.map(o=>[o.operation,o.status]),["tag","draft","archive","provenance","attestation","github","github-identity"].map(n=>[n,"succeeded"]));
    completed=await checkInitialCompletion({evidence:publication,get,verifyGitHub:e=>services.verifyGitHub(release,e)});
   }else{
    if(!["complete","published-verification-pending"].includes(outcome.status))continue;assert.equal(source.conclusion,"success","Failed publication workflow");
    completed=await inspect({evidence:publication,outcome,verifyGitHub:e=>services.verifyGitHub(release,e),verifyNpm:services.verifyNpm});
   }
   assert.ok(completed.status==="complete"&&completed.stableDocumentationEligible,"Distribution publication remains incomplete");
   matches.push({runId:run.id,attempt,artifactId:input.id,artifactSha256:input.sha256,status:"complete"});
  }
 }
 assert.ok(matches.length,"No complete matching publication handoff");return matches.sort((a,b)=>b.runId-a.runId||b.attempt-a.attempt)[0];
}

async function eligibleSource({repository,commit,readAt,get,trigger,directory,completion=publicationCompletion,verify=verifyPublished}) {
 const shell=await readAt(commit,"tools/site.sh",true),index=await readAt(commit,"site/index.md",true);
 if(shell===null&&index===null)return null;assert.ok(shell!==null&&index!==null,"Incomplete stable site source");
 const raw=await readAt(commit,"tools/site/docs-example.json",true);
 if(raw===null){assert.equal(await readAt(commit,"tools/site/example.mjs",true),null,"Missing declared documentation selection");return {sourceCommit:commit,selection:null,publication:null,kind:"shell-only"};}
 const profile=JSON.parse(raw),descriptorText=await readAt(commit,"inputs/release.json",true),value=descriptorText===null?null:JSON.parse(descriptorText);
 let published,release,promotion;
 if(value?.schemaVersion===2){
  const lockText=await readAt(commit,"inputs/sqlite-vector.sources.lock.json"),lock=JSON.parse(lockText),selected=descriptor(value,lock),matches=[];
  for(const item of await pages(repository,"releases",get)){
   if(item.draft||!item.tag_name?.startsWith("dist/v"))continue;
   const assets=item.assets.filter(a=>a.name==="publication.json");if(assets.length!==1)continue;
   const evidence=JSON.parse(await download(assets[0].url,get));if(evidence.invocation?.preparation?.runId!==selected.preparation.runId)continue;
   publicationIdentity(evidence);assert.deepEqual(evidence.invocation.preparation,selected.preparation);assert.deepEqual(evidence.upstreams,selected.selection);
   assert.equal(evidence.sourceLockSha256,hash(Buffer.from(lockText)));assert.deepEqual(evidence.sourceLock,lock);matches.push({publication:evidence,release:item});
  }
  assert.equal(matches.length,1,"Candidate has no unique matching publication");({publication:published,release}=matches[0]);
  const compare=await json(get,`${api(repository)}/compare/${published.commit}...${commit}`);
  assert.ok(["ahead","identical"].includes(compare.status)&&compare.merge_base_commit?.sha===published.commit,"Unrelated publication revision");
  promotion=await completion({repository,publication:published,release,get,trigger,directory});
 }else{
  assert.ok(profile.version&&profile.mode!=="candidate","Unpublished documentation cannot be stable");
  release=await json(get,`${api(repository)}/releases/${profile.releaseId}`);const assets=release.assets.filter(a=>a.name==="publication.json");assert.equal(assets.length,1);
  const bytes=await download(assets[0].url,get);assert.equal(hash(bytes),profile.publicationSha256,"Pinned publication changed");published=JSON.parse(bytes);
  assert.equal(published.version,profile.version);assert.equal(published.commit,profile.commit);assert.equal(published.archive.sha256,profile.archiveSha256);
  assert.ok(!trigger,"Unrelated completion cannot promote historical documentation");
 }
 if(value?.schemaVersion===2&&(profile.mode==="published"||(profile.version&&!profile.mode))&&profile.version!==published.version){
 release=await json(get,`${api(repository)}/releases/${profile.releaseId}`);const assets=release.assets.filter(a=>a.name==="publication.json");assert.equal(assets.length,1);
 const bytes=await download(assets[0].url,get);assert.equal(hash(bytes),profile.publicationSha256);published=JSON.parse(bytes);
 assert.equal(published.version,profile.version);assert.equal(published.commit,profile.commit);
 }
 let selection=await verify({repository,release,publication:published,get});
 if(profile.mode==="published"||(profile.version&&!profile.mode)){
  assert.equal(profile.version,selection.version,"Declared published selection differs from completed candidate");assert.equal(profile.archiveSha256,selection.archiveSha256);
  if(!profile.mode)selection=profile;
 }
 const demoRaw=await readAt(commit,"tools/site/demo-runtime.json",true);
 return {sourceCommit:commit,selection,publication:{commit:published.commit,version:published.version,archive:published.archive,
 ...(published.invocation?.preparation?{preparation:published.invocation.preparation}:{})},demoSelection:demoRaw===null?null:JSON.parse(demoRaw),
 ...(promotion?{promotion}:{}),kind:promotion?"completed-publication":"declared-publication"};
}

async function stableSource({repository,mainCommit,readAt,get,trigger,directory,resolveSource=eligibleSource}) {
 try { return await resolveSource({repository,commit:mainCommit,readAt,get,trigger,directory}); }
 catch(error) {
  if(trigger)throw error;
  const previous=await json(get,`https://${repository.split("/")[0]}.github.io/${repository.split("/")[1]}/site-publication.json`);
  assert.equal(previous.repository,repository);assert.equal(previous.stablePresent,true,"No previous eligible stable source");
  const commit=previous.stableDocumentation?.sourceCommit??previous.mainCommit;
  assert.match(commit??"",/^[a-f0-9]{40}$/);assert.notEqual(commit,mainCommit,"Previous source is also unpublished");
  const compare=await json(get,`${api(repository)}/compare/${commit}...${mainCommit}`);
  assert.ok(["ahead","identical"].includes(compare.status)&&compare.merge_base_commit?.sha===commit,"Previous source is unrelated to main");
  const source=await resolveSource({repository,commit,readAt,get,directory});assert.ok(source,"Previous stable site absent");
  return {...source,kind:"previous-eligible-source",currentDiagnostic:error.message};
 }
}

async function siteSelection({repository,eventName,event,ref,sha,actor,readAt,get,directory,selectStable=stableSource,resolveSource=eligibleSource}) {
 repositoryName(repository);assert.match(sha??"",/^[a-f0-9]{40}$/);
 const mainCommit=(await json(get,`${api(repository)}/commits/main`)).sha;
 assert.match(mainCommit??"",/^[a-f0-9]{40}$/);
 const pull=eventName==="pull_request",internal=pull&&event.pull_request?.head.repo?.full_name===repository&&actor!=="dependabot[bot]";
 if(!pull){assert.ok(["push","workflow_dispatch","workflow_run"].includes(eventName)&&ref==="refs/heads/main","Ineligible Site event");assert.equal(sha,mainCommit,"Stale Site controller revision");}
 let trigger;
 if(eventName==="workflow_run"){
  const r=event.workflow_run;assert.equal(event.repository?.full_name,repository);
  assert.ok(r&&r.repository?.full_name===repository&&r.path?.split("@")[0]===".github/workflows/release.yml"&&r.event==="pull_request"&&r.status==="completed","Unrelated release completion event");
  trigger=await json(get,`${api(repository)}/actions/runs/${r.id}`);assert.equal(trigger.head_sha,r.head_sha);assert.equal(trigger.run_attempt,r.run_attempt);
  const list=await json(get,`${api(repository)}/actions/runs/${r.id}/artifacts?per_page=100`);assert.equal(list.total_count,list.artifacts.length);
  if(!list.artifacts.some(a=>a.name===`release-outcome-${r.id}-${r.run_attempt}`&&!a.expired))return {relevant:false,publish:false,repository,mainCommit,reason:"No product publication handoff"};
 }
 let preview=null,previewSelection=null,input=null;
 if(pull){
  const pr=event.pull_request;assert.equal(pr.state,"open");assert.match(pr.head.sha,/^[a-f0-9]{40}$/);assert.ok(Number.isSafeInteger(event.number)&&event.number>0);
  preview={branch:pr.head.ref,commit:pr.head.sha};
  const profile=JSON.parse(await readAt(preview.commit,"tools/site/docs-example.json"));
  const descriptorRaw=await readAt(preview.commit,"inputs/release.json",true);
  const value=descriptorRaw===null?null:JSON.parse(descriptorRaw);
  const nominal=value?.schemaVersion===2&&new RegExp('^candidate/run-'+value.preparation?.runId+'-[1-9][0-9]*$').test(pr.head.ref)&&await candidateDescriptorChanged({repository,pullRequest:pr,get});
  if(nominal){assert.deepEqual(profile,candidateProfile);descriptor(value,JSON.parse(await readAt(preview.commit,"inputs/sqlite-vector.sources.lock.json")));previewSelection=profile;input="updates";}
  else{
   try{const ready=await resolveSource({repository,commit:preview.commit,readAt,get,directory});previewSelection=ready?.selection;}
   catch(error){assert.equal(profile.mode,"candidate","Unpublished preview must declare the candidate profile");assert.deepEqual(profile,candidateProfile);previewSelection=profile;input="exercise";}
  }
 }
 const stablePlaceholder=(!pull||internal)?await mainPlaceholder(readAt,mainCommit):null;
 const stableDemo=(!pull||internal)&&!stablePlaceholder?await mainDemo(readAt,mainCommit):null;
 const stable=(!pull||internal)?await selectStable({repository,mainCommit,readAt,get,trigger,directory}):null;
 if(!pull)assert.ok(stable,"Stable source absent");
 return {relevant:true,publish:!pull||internal,repository,mainCommit,mode:pull?"preview":"stable",
 ...(pull?{pullRequest:event.number}:{}),preview,previewSelection,input,stable,...(stablePlaceholder?{stablePlaceholder}:{}),...(stableDemo?{stableDemo}:{})};
}

async function assertStableCurrent(record,{get,readAt,directory,selectStable=stableSource}) {
 const selected=await selectStable({repository:record.repository,mainCommit:record.mainCommit,get,readAt,directory});
 const identity=value=>value?{sourceCommit:value.sourceCommit,selection:value.selection,publication:value.publication,demoSelection:value.demoSelection}:null;
 assert.deepEqual(identity(selected),identity(record.stableDocumentation),"Stable publication eligibility changed; rerun Site");
 const placeholder=await mainPlaceholder(readAt,record.mainCommit);
 assert.deepEqual(placeholder,record.stablePlaceholder??null,"Stable placeholder source changed");
 assert.deepEqual(placeholder?null:await mainDemo(readAt,record.mainCommit),record.stableDemo??null,"Stable demo source changed");
}

async function main() {
 const [command]=process.argv.slice(2),env=process.env,repository=repositoryName(env.GITHUB_REPOSITORY),get=httpReader(env.GH_TOKEN),commit=sourceCommit(root);
 const readAt=(sha,path,optional=false)=>sourceAt({repository,commit:sha,path,optional,get,localCommit:commit,directory:root});
 const path=join(root,".work/site/selection.json");
 if(command==="select"){
  const decision=await siteSelection({repository,eventName:env.GITHUB_EVENT_NAME,event:JSON.parse(await readFile(env.GITHUB_EVENT_PATH,"utf8")),ref:env.GITHUB_REF,sha:env.GITHUB_SHA,actor:env.GITHUB_ACTOR,readAt,get,directory:join(root,".work/site")});
  await mkdir(join(root,".work/site"),{recursive:true});
  await writeFile(path,JSON.stringify(decision,null,2)+"\n");
  for(const [label,selection]of[["preview",decision.previewSelection],["stable",decision.stable?.selection]])if(selection)await writeFile(join(root,`.work/site/${label}-selection.json`),JSON.stringify(selection,null,2)+"\n");
  if(env.GITHUB_OUTPUT)await appendFile(env.GITHUB_OUTPUT,`relevant=${decision.relevant}\npublish=${decision.publish}\nstable_commit=${decision.stable?.sourceCommit??decision.mainCommit}\nstable_present=${Boolean(decision.stable)}\nstable_placeholder=${Boolean(decision.stablePlaceholder)}\nstable_demo=${Boolean(decision.stableDemo)}\nstable_profile=${decision.stable?.selection?join(root,".work/site/stable-selection.json"):""}\n`);
  console.log(JSON.stringify(decision));
 }else if(command==="environment"){
  const decision=JSON.parse(await readFile(path,"utf8"));
  if(env.GITHUB_ENV&&decision.previewSelection)await appendFile(env.GITHUB_ENV,`SITE_DOCUMENTATION_SELECTION=${join(root,".work/site/preview-selection.json")}\nSITE_DOCUMENTATION_PREVIEW_INPUT=${decision.input??""}\n`);
 }else throw Error("Usage: eligibility.mjs select|environment");
}
export {sourceAt,verifyPublished,publicationCompletion,eligibleSource,stableSource,siteSelection,assertStableCurrent};
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(error);process.exitCode=1;});
