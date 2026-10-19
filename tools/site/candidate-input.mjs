import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir, access, appendFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { sourceCommit, documentationSelection } from './documentation.mjs';

export function selectDocumentationRun({ descriptor, fixture, runs, repository, commit }) {
  if (!fixture && descriptor?.schemaVersion === 2 && Number.isSafeInteger(descriptor.preparation?.runId)) {
    const run = runs.find(r => r.id === descriptor.preparation.runId);
    assert.ok(run && run.repository?.full_name === repository && run.path === '.github/workflows/updates.yml' && run.event === 'workflow_dispatch', 'Unrelated candidate preparation run');
    return { run, prefix: 'updates' };
  }
  assert.ok(fixture, 'Missing qualified candidate preparation input');
  const matches = runs.filter(r => r.head_sha === commit && r.path === '.github/workflows/release.yml' && r.event === 'pull_request' && r.repository?.full_name === repository);
  return matches.length ? { run: matches.sort((a,b)=>b.id-a.id)[0], prefix: 'release-exercise' } : null;
}

export async function acquireDocumentationBundle({ root, repository, commit = sourceCommit(root), token, get = fetch, wait = ms => new Promise(r=>setTimeout(r,ms)), attempts = 40 }) {
  assert.match(repository, /^[\w.-]+\/[\w.-]+$/); assert.match(commit, /^[a-f0-9]{40}$/);
  const profile = await documentationSelection(root);
  const fixture = process.env.SITE_DOCUMENTATION_PREVIEW_INPUT === 'exercise' || (profile.mode === 'candidate' && JSON.parse(await readFile(join(root,'inputs/release.json'),'utf8')).schemaVersion !== 2);
  const descriptor=JSON.parse(await readFile(join(root,'inputs/release.json'),'utf8'));
  const api=`https://api.github.com/repos/${repository}`;
  const headers={Accept:'application/vnd.github+json',...(token?{Authorization:`Bearer ${token}`}:{})};
  const json=async url=>{const response=await get(url,{headers});assert.equal(response.status,200,'Documentation input API unavailable');return response.json();};
  for(let i=0;i<attempts;i++){
    const response = !fixture && descriptor.schemaVersion===2 ? {workflow_runs:[await json(`${api}/actions/runs/${descriptor.preparation.runId}`)]} : await json(`${api}/actions/runs?head_sha=${commit}&event=pull_request&per_page=100`);
    const selected=selectDocumentationRun({descriptor,fixture,runs:response.workflow_runs,repository,commit});
    if(!selected || selected.run.status!=='completed'){await wait(15000);continue;}
    assert.equal(selected.run.conclusion,'success','Candidate qualification workflow failed');
    const {run,prefix}=selected;
    const artifacts=await json(`${api}/actions/runs/${run.id}/artifacts?per_page=100`);
    const name=`${prefix}-${run.id}-${run.run_attempt}`;
    const matches=artifacts.artifacts.filter(a=>a.name===name && !a.expired);
    assert.equal(matches.length,1,'Missing or ambiguous qualified documentation artifact');
    const artifact=matches[0];assert.match(artifact.digest,/^sha256:[a-f0-9]{64}$/);
    const downloaded=await get(`${api}/actions/artifacts/${artifact.id}/zip`,{headers});assert.equal(downloaded.status,200,'Qualified artifact unavailable');
    const bytes=Buffer.from(await downloaded.arrayBuffer());assert.equal(createHash('sha256').update(bytes).digest('hex'),artifact.digest.slice(7),'Qualified artifact digest mismatch');
    const directory=join(root,'.work/docs-input',`${run.id}-${run.run_attempt}`);await mkdir(directory,{recursive:true});
    const archive=join(directory,'artifact.zip');await writeFile(archive,bytes);
    const extracted=join(directory,'extracted');
    execFileSync('python3',['-c',`import zipfile,sys,stat,re
from pathlib import PurePosixPath
with zipfile.ZipFile(sys.argv[1]) as z:
 for i in z.infolist():
  p=PurePosixPath(i.filename)
  assert not p.is_absolute() and '..' not in p.parts and re.fullmatch(r'[A-Za-z0-9_./-]+',i.filename) and not stat.S_ISLNK(i.external_attr>>16), 'Unsafe documentation artifact member'
 z.extractall(sys.argv[2])`,archive,extracted]);
    const acceptance=join(extracted,'acceptance'), candidates=[];
    for(const entry of await readdir(acceptance,{withFileTypes:true})){
      if(!entry.isDirectory() || !/^run-[A-Za-z0-9_-]+$/.test(entry.name))continue;
      const bundle=join(acceptance,entry.name);let report;try{report=JSON.parse(await readFile(join(bundle,'acceptance.json'),'utf8'));}catch(error){if(error.code==='ENOENT')continue;throw error;}
      if(report.source?.commit===commit && report.verdict==='passed')candidates.push(bundle);
    }
    assert.equal(candidates.length,1,'No exact-head qualified documentation bundle');
    return {bundle:resolve(candidates[0]),runId:run.id,artifactId:artifact.id,artifactSha256:artifact.digest.slice(7),commit};
  }
  throw Error('Timed out waiting for exact-head qualified documentation input');
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))try{
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const selection=await documentationSelection(root);
 if(selection.mode!=='candidate'){console.log('Published documentation uses its explicit recorded selection.');}else{
 const result=await acquireDocumentationBundle({root,repository:process.env.GITHUB_REPOSITORY,token:process.env.GH_TOKEN});
 if(process.env.GITHUB_ENV)await appendFile(process.env.GITHUB_ENV,`SITE_CANDIDATE_BUNDLE=${result.bundle}\n`);
 await writeFile(join(root,'.work/docs-input/handoff.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));}
}catch(error){console.error(error);process.exitCode=1;}
