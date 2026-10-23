import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {root,regularBytes,hash} from '../package/package.mjs';
import {command} from './run.mjs';
import {qualify} from '../release/run.mjs';
import {calculate} from '../release/policy.mjs';
import {descriptor,candidateDescriptorChanged} from '../release/context.mjs';
import {httpReader,readState,repositoryName} from '../release/state.mjs';
import {documentSnapshot} from '../updates/documentation.mjs';

export const fixtureSnapshot=()=>({schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}});

export async function qualifyCandidate({repository=root,context,pullRequest,runId,attempt,readSnapshot,
 qualification=qualify,run=command}) {
 assert.ok(Number.isSafeInteger(runId)&&runId>0&&Number.isSafeInteger(attempt)&&attempt>0,'Missing PR qualification execution');
 assert.equal(pullRequest.head.sha,context.commit,'Candidate head mismatch');
 await mkdir(join(repository,'.work/candidate'),{recursive:true});
 const directory=await mkdtemp(join(repository,'.work/candidate/run-')),path=join(directory,'candidate.json');
 const result={schemaVersion:1,status:'in-progress',commit:context.commit,baseCommit:pullRequest.base.sha,
  selection:context.selection,preparation:context.preparation??null,pullRequest:{number:pullRequest.number,head:context.commit},
  qualification:{runId,attempt},publicationCalls:0};
 const save=()=>writeFile(path,JSON.stringify(result,null,2)+'\n');await save();
 try {
  assert.equal(await run('git',['rev-parse','HEAD'],{cwd:repository}),context.commit,'Qualification checkout mismatch');
  assert.equal(await run('git',['status','--porcelain','--untracked-files=all'],{cwd:repository}),'','Clean candidate required');
  result.documentSources=await documentSnapshot(repository);
  const lockBytes=await regularBytes(join(repository,'inputs/sqlite-vector.sources.lock.json')),lock=JSON.parse(lockBytes);
  let snapshot;
  const qualified=await qualification({repository,context,run,readSnapshot:async()=>{snapshot=await readSnapshot();return snapshot;}});
  assert.deepEqual(qualified.identity,calculate({selection:context.selection,snapshot,comment:context.comment}),'Qualification forecast mismatch');
  const evidence=JSON.parse(await regularBytes(qualified.evidencePath)),payload=await regularBytes(join(qualified.bundle,'payload.tgz'));
  assert.equal(evidence.commit,context.commit,'Qualification revision mismatch');assert.equal(evidence.repository,context.repository,'Qualification repository mismatch');
  assert.deepEqual(evidence.upstreams,context.selection,'Qualification composition mismatch');
  assert.deepEqual(evidence.engine,{key:'sqliteVector',upstream:'sqliteai/sqlite-vector',version:context.selection.sqliteVector},'Qualification engine mismatch');
  assert.deepEqual(evidence.sourceLock,lock,'Qualification source mismatch');assert.equal(evidence.sourceLockSha256,hash(lockBytes),'Qualification lock digest mismatch');
  assert.deepEqual(evidence.invocation.preparation,context.preparation??null,'Qualification preparation mismatch');assert.equal(evidence.invocation.comment,context.comment,'Qualification comment mismatch');
  assert.deepEqual(evidence.archive,{size:payload.length,sha256:hash(payload)},'Qualification archive mismatch');
  assert.deepEqual(await documentSnapshot(repository),result.documentSources,'Candidate documents changed during qualification');
  assert.equal(await run('git',['rev-parse','HEAD'],{cwd:repository}),context.commit);assert.equal(await run('git',['status','--porcelain','--untracked-files=all'],{cwd:repository}),'');
  Object.assign(result,{status:'qualified-in-pr',identity:qualified.identity,archive:evidence.archive,bundle:qualified.bundle,
   qualificationEvidence:qualified.evidencePath,policyContext:context.preparation?'candidate-publication-forecast':'explicit-empty-state-fixture-not-publication-state'});
  await save();return {...result,path};
 }catch(error){result.status='failed';result.diagnostic=error.message;await save();throw new Error(`PR candidate qualification failed; evidence: ${path}`,{cause:error});}
}

async function main(){
 const env=process.env,repository=repositoryName(env.GITHUB_REPOSITORY),event=JSON.parse(await readFile(env.GITHUB_EVENT_PATH,'utf8'));
 assert.equal(env.GITHUB_EVENT_NAME,'pull_request');assert.notEqual(event.action,'closed');assert.equal(event.repository?.full_name,repository);
 const pr=event.pull_request;assert.equal(pr.base?.ref,'main');assert.equal(pr.base.repo.full_name,repository);
 const commit=await command('git',['rev-parse','HEAD'],{cwd:root});assert.equal(commit,pr.head.sha);
 const lock=JSON.parse(await regularBytes(join(root,'inputs/sqlite-vector.sources.lock.json'))),get=httpReader(env.GH_TOKEN);
 const raw=await readFile(join(root,'inputs/release.json'),'utf8').catch(e=>{if(e.code==='ENOENT')return null;throw e;}),value=raw===null?null:JSON.parse(raw);
 const nominal=value?.schemaVersion===2&&new RegExp(`^candidate/run-${value.preparation?.runId}-[1-9][0-9]*$`).test(pr.head.ref)&&await candidateDescriptorChanged({repository,pullRequest:pr,get});
 const selected=nominal?descriptor(value,lock):{selection:{sqlite:lock.sqlite.version,sqliteVector:lock.sqliteVector.version},comment:''};
 const result=await qualifyCandidate({context:{repository,commit,...selected},pullRequest:pr,runId:Number(env.GITHUB_RUN_ID),attempt:Number(env.GITHUB_RUN_ATTEMPT),
  readSnapshot:nominal?()=>readState({repository,get}):async()=>fixtureSnapshot()});
 console.log(JSON.stringify(result));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
