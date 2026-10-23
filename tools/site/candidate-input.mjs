import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,appendFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceCommit,documentationSelection} from './documentation.mjs';
import {httpReader} from '../release/state.mjs';
import {runArtifact,uniqueRecord} from '../release/artifacts.mjs';
import {acceptedPayload} from '../release/run.mjs';

export function selectDocumentationRun({run,repository,commit,runId,attempt}) {
 assert.equal(run.id,runId);assert.equal(run.run_attempt,attempt,'Qualification attempt mismatch');
 assert.equal(run.repository?.full_name,repository);assert.equal(run.head_sha,commit,'Qualification head mismatch');
 assert.equal(run.path?.split('@')[0],'.github/workflows/acceptance.yml');assert.equal(run.event,'pull_request');
 assert.ok(['in_progress','completed'].includes(run.status),'Qualification run is unavailable');return run;
}

export async function acquireDocumentationBundle({root,repository,commit=sourceCommit(root),runId,attempt,name,
 get=httpReader(),artifact=runArtifact,accept=acceptedPayload}) {
 assert.match(repository,/^[\w.-]+\/[\w.-]+$/);assert.match(commit,/^[a-f0-9]{40}$/);
 assert.equal(name,`candidate-${runId}-${attempt}`,'Missing same-run candidate input');
 const api=`https://api.github.com/repos/${repository}`;
 const response=await get(`${api}/actions/runs/${runId}`);assert.equal(response.status,200,'Qualification run unavailable');
 const run=selectDocumentationRun({run:response.data,repository,commit,runId,attempt});
 // The workflow's explicit needs edge supplies producer completion. Validate the
 // immutable same-run artifact and full report, without polling job visibility.
 const input=await artifact({repository,run,name,get,directory:join(root,'.work/docs-input')});
 const candidate=await uniqueRecord(input,'candidate.json',c=>c.commit===commit);
 assert.equal(candidate.status,'qualified-in-pr');assert.deepEqual(candidate.qualification,{runId,attempt});
 const acceptance=join(input.directory,'acceptance'),bundles=[];
 for(const entry of await readdir(acceptance,{withFileTypes:true})){
  if(!entry.isDirectory()||!/^run-[A-Za-z0-9_-]+$/.test(entry.name))continue;
  const bundle=join(acceptance,entry.name);let report;
  try{report=JSON.parse(await readFile(join(bundle,'acceptance.json'),'utf8'));}catch(e){if(e.code==='ENOENT')continue;throw e;}
  if(report.source?.commit===commit&&report.verdict==='passed')bundles.push(bundle);
 }
 assert.equal(bundles.length,1,'No exact-head qualified documentation bundle');
 const accepted=await accept({bundle:bundles[0],identity:candidate.identity,commit});
 assert.deepEqual(accepted.archive,candidate.archive,'Candidate archive handoff mismatch');
 return {bundle:resolve(bundles[0]),runId,attempt,artifactId:input.id,artifactSha256:input.sha256,commit};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))try{
 const root=fileURLToPath(new URL('../../',import.meta.url)),selection=await documentationSelection(root);
 if(selection.mode!=='candidate')console.log('Published documentation uses its explicit recorded selection.');
 else{
  const result=await acquireDocumentationBundle({root,repository:process.env.GITHUB_REPOSITORY,get:httpReader(process.env.GH_TOKEN),
   runId:Number(process.env.GITHUB_RUN_ID),attempt:Number(process.env.GITHUB_RUN_ATTEMPT),name:process.env.SITE_CANDIDATE_ARTIFACT});
  if(process.env.GITHUB_ENV)await appendFile(process.env.GITHUB_ENV,`SITE_CANDIDATE_BUNDLE=${result.bundle}\n`);
  await mkdir(join(root,'.work/docs-input'),{recursive:true});await writeFile(join(root,'.work/docs-input/handoff.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }
}catch(error){console.error(error);process.exitCode=1;}
