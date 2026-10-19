import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { documentationHashes, sourceCommit, checkedDocumentation, renderPublicDocument, documentHash } from '../documentation.mjs';
import { selectDocumentationRun } from '../candidate-input.mjs';

test('candidate presentation never claims npm availability and published identity changes are mechanical', () => {
  const text='# Usage\n\nnpm install ./payload.tgz\n\nSELECT vector_version();\n';
  const input={mode:'candidate',version:'0.3.0',upstreams:{sqlite:'3.54.1',sqliteVector:'1.1.2'}};
  const candidate=renderPublicDocument(text,input);
  assert.match(candidate,/Unpublished release candidate \*\*0\.3\.0\*\*/);assert.match(candidate,/npm install \.\/payload.tgz/);
  assert.doesNotMatch(candidate,/npm install @at-rama\/sqlite-vector-wasm@/);
  const published=renderPublicDocument(text,{...input,mode:'published',version:'0.3.1'});
  assert.match(published,/Published distribution \*\*0\.3\.1\*\*/);assert.match(published,/@at-rama\/sqlite-vector-wasm@0\.3\.1/);
  assert.match(published,/SELECT vector_version\(\)/);assert.throws(()=>renderPublicDocument(text,{...input,mode:'inferred'}));
});

test('documentation rendering rejects stale, missing or mismatched execution evidence without touching demo state', async t => {
  const root=await mkdtemp(join(tmpdir(),'checked-docs-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await mkdir(join(root,'docs'));await mkdir(join(root,'tools/site'),{recursive:true});await mkdir(join(root,'.work/docs-example'),{recursive:true});
  await writeFile(join(root,'README.md'),'# Presentation\n');await writeFile(join(root,'docs/usage.md'),'# Usage\n');
  await mkdir(join(root,'inputs'));await writeFile(join(root,'inputs/sqlite-vector.sources.lock.json'),'synthetic lock fixture');
  await writeFile(join(root,'tools/site/docs-example.json'),JSON.stringify({mode:'candidate',engine:'sqliteVector',sourceLockPath:'inputs/sqlite-vector.sources.lock.json'}));
  await writeFile(join(root,'tools/site/demo-runtime.json'),'unchanged demo selection');
  execFileSync('git',['init','-q'],{cwd:root});execFileSync('git',['add','.'],{cwd:root});
  execFileSync('git',['-c','user.name=fixture','-c','user.email=fixture@example.test','commit','-qm','fixture'],{cwd:root});
  const commit=sourceCommit(root), result={sqliteVersion:'3.54.1',engineVersion:'1.1.2',neighbors:[[1,0],[2,Math.SQRT2]]};
  // Synthetic evidence exercises record validation, never claims browser execution.
  const evidence={context:{mode:'candidate',engine:'sqliteVector',version:'0.3.0',commit,qualifiedCommit:commit,sourceHashes:await documentationHashes(root),sourceDirty:false,sourceLockPath:'inputs/sqlite-vector.sources.lock.json',sourceLockSha256:documentHash('synthetic lock fixture'),archive:{size:1,sha256:'a'.repeat(64)},upstreams:{sqlite:'3.54.1',sqliteVector:'1.1.2'}},selection:{version:'0.3.0',archiveSha256:'a'.repeat(64)},replayOnly:false,browser:'synthetic validation fixture',result,workerResult:result,unchangedRuntime:true};
  const save=x=>writeFile(join(root,'.work/docs-example/result.json'),JSON.stringify(x));await save(evidence);
  assert.equal((await checkedDocumentation(root)).version,'0.3.0');
  for(const mutate of [e=>e.context.commit='b'.repeat(40),e=>e.context.sourceHashes['README.md']='b'.repeat(64),e=>e.context.archive.sha256='b'.repeat(64),e=>e.context.version='0.3.1',e=>e.context.qualifiedCommit='b'.repeat(40),e=>e.replayOnly=true,e=>e.unchangedRuntime=false,e=>e.result.engineVersion='wrong']){
    const changed=structuredClone(evidence);mutate(changed);await save(changed);await assert.rejects(checkedDocumentation(root));
  }
  await save(evidence);await writeFile(join(root,'README.md'),'# Changed\n');await assert.rejects(checkedDocumentation(root),/Stale/);
  await rm(join(root,'.work/docs-example/result.json'));await assert.rejects(checkedDocumentation(root));
  assert.equal(await readFile(join(root,'tools/site/demo-runtime.json'),'utf8'),'unchanged demo selection');
});

test('documentation input selects only the bound preparation or exact-head publisher-free exercise', () => {
 const repository='at-rama/sqlite-vector-wasm',commit='a'.repeat(40);
 const fixtureRun={id:1,path:'.github/workflows/release.yml',head_sha:commit,event:'pull_request',repository:{full_name:repository}};
 assert.equal(selectDocumentationRun({fixture:true,runs:[fixtureRun],repository,commit}).run.id,1);
 assert.equal(selectDocumentationRun({fixture:true,runs:[{...fixtureRun,head_sha:'b'.repeat(40)}],repository,commit}),null);
 assert.throws(()=>selectDocumentationRun({fixture:false,runs:[fixtureRun],repository,commit}));
 const update={...fixtureRun,id:2,path:'.github/workflows/updates.yml',event:'workflow_dispatch'};
 const descriptor={schemaVersion:2,preparation:{runId:2}};
 assert.equal(selectDocumentationRun({descriptor,runs:[update],repository,commit}).prefix,'updates');
 assert.throws(()=>selectDocumentationRun({descriptor,runs:[{...update,event:'push'}],repository,commit}));
 assert.throws(()=>selectDocumentationRun({descriptor,runs:[{...update,repository:{full_name:'other/repo'}}],repository,commit}));
});
