import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { documentationHashes, sourceCommit, checkedDocumentation, renderPublicDocument, documentHash } from '../documentation.mjs';
import { selectDocumentationRun, acquireDocumentationBundle } from '../candidate-input.mjs';

test('generic Markdown keeps latest installation distinct from the checked publication', () => {
  const source = '# Using sqlite-vector-wasm\n\n```sh\nnpm install @at-rama/sqlite-vector-wasm\n```\n\n![npm latest](https://img.shields.io/npm/v/@at-rama/sqlite-vector-wasm/latest)\n';
  const context = {mode:'published',version:'0.3.1',upstreams:{sqlite:'3.54.1',sqliteVector:'1.1.2'}};
  const published = renderPublicDocument(source, context);
  assert.match(published, /```sh\nnpm install @at-rama\/sqlite-vector-wasm\n```/);
  assert.match(published, /npm install @at-rama\/sqlite-vector-wasm@0\.3\.1/);
  assert.match(published, /Reproducibility — Published distribution \*\*0\.3\.1\*\*/);
  const candidate = renderPublicDocument(source, {...context,mode:'candidate',version:'0.4.0'});
  assert.match(candidate, /npm install \.\/payload.tgz/);
  assert.doesNotMatch(candidate, /npm install @at-rama\/sqlite-vector-wasm/);
  assert.match(candidate, /Unpublished release candidate \*\*0\.4\.0\*\*/);
  for (const rendered of [published,candidate]) assert.ok(rendered.includes('https://img.shields.io/npm/v/@at-rama/sqlite-vector-wasm/latest'));
  assert.equal(renderPublicDocument(source, null), source);
});

test('Presentation keeps its opening and generic install while Usage owns reproducibility', () => {
  const source = '# sqlite-vector-wasm\n\n**SQLite for the browser, with vector search built in.**\n\n## Quick start\n\n```sh\nnpm install @at-rama/sqlite-vector-wasm\n```\n';
  const context = {mode:'published',version:'0.3.1',upstreams:{sqlite:'3.54.1',sqliteVector:'1.1.2'}};
  assert.equal(renderPublicDocument(source, context, {presentation:true}), source);
  const usage = renderPublicDocument(source, context);
  assert.ok(usage.startsWith(source.trimEnd()));
  assert.match(usage, /Reproducibility — Published distribution/);
  assert.match(usage, /npm install @at-rama\/sqlite-vector-wasm@0\.3\.1/);
  const candidate = renderPublicDocument(source, {...context,mode:'candidate'}, {presentation:true});
  assert.ok(candidate.startsWith(source.split('```sh')[0]));
  assert.match(candidate, /npm install \.\/payload.tgz/);
  assert.match(candidate, /Unpublished release candidate \*\*0\.3\.1\*\*/);
  assert.doesNotMatch(candidate, /npm install @at-rama\/sqlite-vector-wasm/);
});

test('the shared authored guide renders the checked next version instead of its preceding release', () => {
 const source='# Using sqlite-vector-wasm\n\nInstall `@at-rama/sqlite-vector-wasm@0.3.0`.\n\n```sh\nnpm install @at-rama/sqlite-vector-wasm@0.3.0\n```\n';
 const context={mode:'candidate',version:'0.3.1',upstreams:{sqlite:'3.54.1',sqliteVector:'1.1.2'}};
 const preview=renderPublicDocument(source,context);
 assert.ok(preview.includes('npm install ./payload.tgz'));assert.ok(!preview.includes('npm install @at-rama'));
 assert.ok(!preview.includes('0.3.0'));
 const published=renderPublicDocument(source,{...context,mode:'published'});
 assert.ok(published.includes('npm install @at-rama/sqlite-vector-wasm@0.3.1'));
 assert.ok(!published.includes('0.3.0'));
});

test('candidate presentation never claims npm availability and published identity changes are mechanical', () => {
  const text='# Usage\n\n```sh\nnpm install ./payload.tgz\n```\n\nSELECT vector_version();\n';
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
  // Editorial edits may rebuild the site but cannot requalify a changed Usage guide.
  await save(evidence);
  await writeFile(join(root,'README.md'),'# Edited presentation\n');
  await assert.rejects(checkedDocumentation(root),/Stale documentation example sources/);
  assert.equal((await checkedDocumentation(root,{allowDirtyDocumentation:true})).version,'0.3.0');
  await writeFile(join(root,'docs/usage.md'),'# Changed usage\n');
  await assert.rejects(checkedDocumentation(root,{allowDirtyDocumentation:true}),/Stale qualified usage guide/);
  await writeFile(join(root,'README.md'),'# Presentation\n');
  await writeFile(join(root,'docs/usage.md'),'# Usage\n');
  await assert.rejects(checkedDocumentation(root,{allowDirtyDocumentation:true}),/Editorial exercise requires a dirty documentation checkout/);
  const published=structuredClone(evidence);
  published.context.mode='published';published.context.publicationCommit='c'.repeat(40);published.selection.commit='c'.repeat(40);
  const profile={...published.selection,mode:'published',engine:'sqliteVector'};
  const select=p=>writeFile(join(root,'tools/site/docs-example.json'),JSON.stringify(p));
  // Selector changes themselves are committed, so these failures test the
  // pinned publication rather than the general stale-source guard.
  await select(profile);execFileSync('git',['add','tools/site/docs-example.json'],{cwd:root});
  execFileSync('git',['-c','user.name=fixture','-c','user.email=fixture@example.test','commit','-qm','published profile'],{cwd:root});
  published.context.commit=sourceCommit(root);await save(published);assert.equal((await checkedDocumentation(root)).mode,'published');
  for (const key of ['version','commit','archiveSha256']) {
    await select({...profile,[key]:key==='version'?'0.3.1':'d'.repeat(key==='commit'?40:64)});
    await assert.rejects(checkedDocumentation(root),/Wrong selected publication/);
  }
  await select(profile);await writeFile(join(root,'README.md'),'# Changed\n');await assert.rejects(checkedDocumentation(root),/Stale/);
  await rm(join(root,'.work/docs-example/result.json'));await assert.rejects(checkedDocumentation(root));
  assert.equal(await readFile(join(root,'tools/site/demo-runtime.json'),'utf8'),'unchanged demo selection');
});

test('documentation input selects only the exact same-run Acceptance producer', () => {
 const repository='at-rama/sqlite-vector-wasm',commit='a'.repeat(40);
 const run={id:25,run_attempt:2,path:'.github/workflows/acceptance.yml',head_sha:commit,event:'pull_request',status:'in_progress',repository:{full_name:repository}};
 const input={run,repository,commit,runId:25,attempt:2};
 assert.equal(selectDocumentationRun(input),run);
 for(const change of [r=>r.id++,r=>r.run_attempt++,r=>r.repository.full_name='other/repo',r=>r.head_sha='b'.repeat(40),r=>r.path='.github/workflows/updates.yml',r=>r.event='push',r=>r.status='queued']){
  const other=structuredClone(run);change(other);assert.throws(()=>selectDocumentationRun({...input,run:other}));
 }
});

test('same-run handoff validates the qualified archive and never waits for another workflow',async t=>{
 const root=await mkdtemp(join(tmpdir(),'docs-same-run-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const commit='a'.repeat(40),repository='a/b',directory=join(root,'artifact');
 await mkdir(join(directory,'acceptance/run-one'),{recursive:true});
 const archive={size:10,sha256:'d'.repeat(64)},candidate={status:'qualified-in-pr',commit,qualification:{runId:25,attempt:2},identity:{version:'0.1.0'},archive};
 const report={source:{commit},verdict:'passed'};
 await writeFile(join(directory,'candidate.json'),JSON.stringify(candidate));
 await writeFile(join(directory,'acceptance/run-one/acceptance.json'),JSON.stringify(report));
 const urls=[],run={id:25,run_attempt:2,head_sha:commit,path:'.github/workflows/acceptance.yml',event:'pull_request',status:'in_progress',repository:{full_name:repository}};
 const jobs={total_count:1,jobs:[{name:'composition',status:'completed',conclusion:'success'}]};
 const options={root,repository,commit,runId:25,attempt:2,name:'candidate-25-2',get:async url=>{urls.push(url);return {status:200,data:url.includes('/jobs?')?jobs:run};},
 artifact:async({name})=>{assert.equal(name,'candidate-25-2');return {directory,id:101,sha256:'e'.repeat(64)};},
 accept:async({identity,commit:head})=>{assert.equal(head,commit);assert.equal(identity.version,'0.1.0');return {archive};}};
 const result=await acquireDocumentationBundle(options);assert.equal(result.runId,25);assert.equal(result.artifactId,101);assert.equal(urls.length,1);
 assert.ok(urls.every(url=>!url.includes('?head_sha=')));
 candidate.archive={...archive,sha256:'0'.repeat(64)};await writeFile(join(directory,'candidate.json'),JSON.stringify(candidate));
 await assert.rejects(acquireDocumentationBundle(options),/archive handoff/);candidate.archive=archive;
 candidate.qualification.attempt=1;await writeFile(join(directory,'candidate.json'),JSON.stringify(candidate));await assert.rejects(acquireDocumentationBundle(options));candidate.qualification.attempt=2;
 await writeFile(join(directory,'candidate.json'),JSON.stringify(candidate));report.verdict='failed';await writeFile(join(directory,'acceptance/run-one/acceptance.json'),JSON.stringify(report));await assert.rejects(acquireDocumentationBundle(options),/No exact-head/);report.verdict='passed';await writeFile(join(directory,'acceptance/run-one/acceptance.json'),JSON.stringify(report));
 await assert.rejects(acquireDocumentationBundle({...options,artifact:async()=>{throw Error('artifact expired');}}),/expired/);
 report.source.commit='b'.repeat(40);await writeFile(join(directory,'acceptance/run-one/acceptance.json'),JSON.stringify(report));await assert.rejects(acquireDocumentationBundle(options),/No exact-head/);
});
