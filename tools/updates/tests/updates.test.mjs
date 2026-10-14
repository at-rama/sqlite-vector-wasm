import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { command } from '../../acceptance/run.mjs';
import { calculate } from '../../release/policy.mjs';
import { invocation, candidateDescriptor, candidateBody } from '../context.mjs';
import { prepareCandidate, resolveSources } from '../run.mjs';
import { candidateServices } from '../services.mjs';
const pair = { sqlite:'3.53.4',sqliteVec:'0.1.9' };
const empty = () => ({schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}});
const event = () => ({repository:{full_name:'a/b'},sender:{type:'User'},inputs:{sqlite_version:pair.sqlite,sqlite_vec_version:pair.sqliteVec,sqlite_comment:'  SQLite line 1\nSQLite line 2  ',sqlite_vec_comment:'$(touch BAD); `echo data`\n"quoted"',misc_comment:'  Misc note  '}});
const environment = () => ({GITHUB_REPOSITORY:'a/b',GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:'refs/heads/main',GITHUB_RUN_ID:'17',GITHUB_RUN_ATTEMPT:'2'});
const context = () => invocation({event:event(),environment:environment()});
const lock = selection => ({sqlite:{version:selection.sqlite},sqliteVec:{version:selection.sqliteVec}});
const published = version => {const s=empty();s.heads.latest={version,commit:'a'.repeat(40),upstreams:pair};s.tags=[`dist/v${version}`];s.releaseTags=[`dist/v${version}`];s.npmVersions=[version];return s;};

test('dispatch is exact, hosted, main and comments remain data', () => {
  assert.throws(()=>invocation({event:{...event(),sender:{type:'Bot'}},environment:environment()}));
  const c=context();assert.equal(c.branch,'candidate/run-17-2');
  const expected='SQLite line 1\nSQLite line 2\n\n$(touch BAD); `echo data`\n"quoted"\n\nMisc note';
  assert.equal(c.comment,expected);assert.equal(candidateDescriptor(c,lock(pair)).releaseComment,expected);
  for(const key of ['sqlite_comment','sqlite_vec_comment','misc_comment']) {
    const optional=event();delete optional.inputs[key];
    assert.ok(!invocation({event:optional,environment:environment()}).comment.includes(key==='sqlite_comment'?'SQLite line 1':key==='sqlite_vec_comment'?'$(touch BAD)':'Misc note'));
  }
  const empty=event();empty.inputs.sqlite_comment=' ';empty.inputs.sqlite_vec_comment='';delete empty.inputs.misc_comment;
  assert.equal(invocation({event:empty,environment:environment()}).comment,'');
  for(const override of [{GITHUB_REF:'refs/heads/other'},{GITHUB_EVENT_NAME:'push'},{GITHUB_ACTIONS:'false'},{GITHUB_RUN_ID:'0'},{GITHUB_RUN_ID:'17x'},{GITHUB_RUN_ATTEMPT:'0'}]) assert.throws(()=>invocation({event:event(),environment:{...environment(),...override}}));
  for(const inputs of [{...event().inputs,channel:'latest'},{...event().inputs,sqlite_version:'latest'},{...event().inputs,sqlite_comment:null},{...event().inputs,sqlite_vec_comment:null},{...event().inputs,misc_comment:null}]) assert.throws(()=>invocation({event:{...event(),inputs},environment:environment()}));
  assert.throws(()=>candidateDescriptor(c,lock({...pair,sqliteVec:'0.1.8'})));
  assert.throws(()=>candidateDescriptor({...c,preparation:{runId:18,url:c.preparation.url}},lock(pair)));
  const e=event();e.pull_request={base:{ref:'main',repo:{full_name:'a/b'}},head:{repo:{full_name:'fork/b'}}};
  assert.throws(()=>invocation({event:e,environment:{...environment(),GITHUB_EVENT_NAME:'pull_request'},rehearsal:true}));
});

async function fixture(t, options={}) {
  const repository=await mkdtemp(join(tmpdir(),'updates-test-'));t.after(()=>rm(repository,{recursive:true,force:true}));
  await mkdir(join(repository,'inputs'));await writeFile(join(repository,'.gitignore'),'.work/\n');await writeFile(join(repository,'inputs/sources.lock.json'),JSON.stringify(lock(pair)));
  const git=args=>command('git',args,{cwd:repository});await git(['init','-b','main']);await git(['add','.']);await git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture']);
  const calls=[];let reads=0;const c={...context(),...options.context};
  const run=async (cmd,args,opts)=>{if(cmd==='sh'){calls.push(args[0]);if(options.failure===args[0])throw Error('mandatory check failed');return '';}return command(cmd,args,opts);};
  const services={push:async(branch,commit)=>{calls.push('push');assert.equal(await git(['rev-parse','HEAD']),commit);if(options.failure==='push')throw Error('push denied');return {branch,head:commit};},createPullRequest:async value=>{calls.push('pr');assert.match(value.body,/not reserved or published/);if(options.failure==='pr')throw Error('PR denied');return {number:1,url:'https://github.com/a/b/pull/1',head:options.failure==='head'?'b'.repeat(40):value.commit};}};
  const qualification=async({context:ctx,readSnapshot})=>{calls.push('qualify');const snapshot=await readSnapshot();if(options.failure==='qualify')throw Error('browser failed');const evidencePath=join(repository,'.work/evidence.json');await writeFile(evidencePath,JSON.stringify({commit:options.failure==='revision'?'b'.repeat(40):ctx.commit,upstreams:ctx.selection,invocation:{preparation:ctx.preparation,comment:ctx.comment},archive:{sha256:'c'.repeat(64),size:123}}));return {identity:calculate({selection:ctx.selection,snapshot,comment:ctx.comment}),evidencePath,bundle:join(repository,'.work/bundle')};};
  const execute=()=>prepareCandidate({repository,context:c,run,services:c.rehearsal?undefined:services,resolve:async()=>{calls.push('resolve');if(options.failure==='resolve')throw Error('digest drift');return lock(c.selection);},readSnapshot:async()=>{calls.push('state');if(options.failure==='state')throw Error('unavailable');return options.states?.[reads++]||empty();},qualification});
  return {repository,git,calls,execute};
}

test('qualified committed pair precedes push/PR; diagnostics stay ignored',async t=>{
  // Candidate preparation consumes the release-owned npm identity.
  const f=await fixture(t);const result=await f.execute();assert.equal(result.status,'candidate-ready');assert.equal(result.identity.version,'0.1.0');assert.deepEqual(f.calls,['resolve','state','tools/check-repository.sh','tools/test-repository.sh','qualify','state','push','pr']);
  assert.equal(result.preflight.name,'@at-rama/sqlite-vector-wasm');assert.equal(result.identity.name,'@at-rama/sqlite-vector-wasm');
  assert.equal(await f.git(['status','--porcelain','--untracked-files=all']),'');assert.deepEqual((await f.git(['diff-tree','--no-commit-id','--name-only','-r',result.commit])).split('\n'),['inputs/release.json']);
  const descriptor=JSON.parse(await readFile(join(f.repository,'inputs/release.json')));assert.equal(descriptor.releaseComment,context().comment);
  assert.deepEqual(Object.keys(descriptor).sort(),['preparation','releaseComment','schemaVersion','sqlite','sqliteVec']);
  assert.match(candidateBody(result),/attempt 2/);
});
for(const failure of ['resolve','state','tools/check-repository.sh','tools/test-repository.sh','qualify','revision','push','pr','head']) test(`mandatory ${failure} failure stops and retains truthful evidence`,async t=>{
  const f=await fixture(t,{failure});let path;await assert.rejects(f.execute(),error=>{path=error.message.split('evidence: ')[1];return !!path;});const evidence=JSON.parse(await readFile(path));assert.equal(evidence.status,'failed');assert.ok(evidence.diagnostic);
  if(!['push','pr','head'].includes(failure))assert.ok(!f.calls.includes('push'));
  if(['pr','head'].includes(failure))assert.equal(evidence.branchResult.head,evidence.commit);
});
test('rehearsal has no writes; changed observed state changes the forecast',async t=>{
  const f=await fixture(t,{context:{rehearsal:true},states:[empty(),published('0.1.0')]});const r=await f.execute();assert.equal(r.status,'qualified-without-pr');assert.equal(r.identity.version,'0.1.1');assert.equal(r.forecastChanged,true);assert.ok(!f.calls.includes('push'));assert.equal(r.publicationCalls,0);
});
test('real shared policy handles next and rollback without alternate calculator',async t=>{
  const f=await fixture(t,{context:{selection:{...pair,sqliteVec:'0.1.10-alpha.1'}},states:[published('0.1.0'),published('0.1.0')]});assert.equal((await f.execute()).identity.version,'0.1.1-alpha.1');
  const g=await fixture(t,{context:{selection:{...pair,sqliteVec:'0.1.8'},comment:''},states:[published('0.1.0')]});await assert.rejects(g.execute());assert.ok(!g.calls.includes('push'));
});
test('resolver preserves exact versions/baseline and relocates traces without fallback',async t=>{
  const repository=await mkdtemp(join(tmpdir(),'updates-resolve-'));t.after(()=>rm(repository,{recursive:true,force:true}));const directory=join(repository,'.work/updates/run');await mkdir(directory,{recursive:true});await mkdir(join(repository,'.work/inputs/resolve-test'),{recursive:true});let calls=0;
  const run=async(cmd,args)=>{calls++;assert.equal(cmd,'bash');if(args[1]==='resolve'){assert.deepEqual(args.slice(2,8),['--sqlite-version',pair.sqlite,'--sqlite-vec-version',pair.sqliteVec,'--baseline-lock','inputs/sources.lock.json']);const path=args.at(-1);await writeFile(path,JSON.stringify(lock(pair)));return JSON.stringify({lockPath:path});}assert.equal(args[1],'validate');return '';};
  assert.deepEqual(await resolveSources({repository,directory,context:context(),run}),lock(pair));assert.equal(calls,2);
  await assert.rejects(resolveSources({repository,directory,context:context(),run:async()=>{throw Error('digest drift');}}),/digest drift/);
});
test('adapter is create-only, credentials stay out of args and transport bodies',async()=>{
  const calls=[];const sha='a'.repeat(40);const token='SECRET';const services=candidateServices({repository:'a/b',token,cwd:'/tmp',run:async(cmd,args)=>{assert.ok(!args.join(' ').includes(token));calls.push(args);return '';},request:async(url,options)=>({ok:true,status:200,json:async()=>options.method==='GET'?{object:{sha}}:{number:1,html_url:'https://github.com/a/b/pull/1',base:{ref:'main'},head:{sha}}})});
  assert.deepEqual(Object.keys(services).sort(),['createPullRequest','push']);await services.push('candidate/run-17-2',sha);assert.equal(calls[1][1],'--force-with-lease=refs/heads/candidate/run-17-2:');await services.createPullRequest({branch:'candidate/run-17-2',commit:sha,title:'candidate',body:'data'});
  const collision=candidateServices({repository:'a/b',token,run:async()=>sha});await assert.rejects(collision.push('candidate/run-17-2',sha),/push failed/);
  const denied=candidateServices({repository:'a/b',token,request:async()=>({ok:false,status:403,json:async()=>({message:token})})});await assert.rejects(denied.createPullRequest({branch:'candidate/run-17-2',commit:sha}),error=>!error.message.includes(token)&&error.message.includes('403'));
});
test('workflow and documented handoff retain existing pins and publication boundary',async()=>{
  const workflow=await readFile(new URL('../../../.github/workflows/updates.yml',import.meta.url),'utf8');
  assert.match(workflow,/workflow_dispatch:/);assert.match(workflow,/persist-credentials: false/);assert.match(workflow,/pull-requests: write/);assert.doesNotMatch(workflow,/id-token:|NPM_TOKEN|pull_request_target|secrets\./);
  for(const pin of [...workflow.matchAll(/uses: ([^\n ]+)/g)])assert.match(pin[1],/@[a-f0-9]{40}$/);
  for(const path of ['.work/updates/','.work/acceptance/','.work/release/'])assert.ok(workflow.includes(path));
  assert.match(workflow,/include-hidden-files: true/);assert.match(workflow,/retention-days: 30/);assert.match(workflow,/if: always\(\)/);
  const rehearsal=workflow.split('  prepare:')[0];assert.doesNotMatch(rehearsal,/contents: write|pull-requests: write/);assert.match(rehearsal,/sh tools\/updates.sh rehearsal/);
  for(const pkg of ['libnss3','libgbm1','libasound2t64'])assert.ok(workflow.includes(pkg));
  const docs=await readFile(new URL('../../../docs/candidates.md',import.meta.url),'utf8');const example=JSON.parse(docs.match(/```json\n([\s\S]*?)\n```/)[1]);
  candidateDescriptor({...context(),repository:'at-rama/sqlite-vector-wasm',comment:example.releaseComment,preparation:example.preparation},lock(pair));
  const entry=await readFile(new URL('../../test-repository.sh',import.meta.url),'utf8');assert.match(entry,/test -f tools\/updates\/tests\/updates.test.mjs/);
});
test('dirty and prior production state fail before resolving',async t=>{
  const f=await fixture(t);await writeFile(join(f.repository,'untracked'),'data');await assert.rejects(f.execute());assert.deepEqual(f.calls,[]);
  const g=await fixture(t);await mkdir(join(g.repository,'.work/build'),{recursive:true});await writeFile(join(g.repository,'.work/build/prior'),'data');await assert.rejects(g.execute());assert.deepEqual(g.calls,[]);
});
test('initial prerelease, collision and inconsistent snapshot create no candidate',async t=>{
  for(const options of [{context:{selection:{...pair,sqliteVec:'0.1.10-alpha.1'}}},{states:[{...empty(),tags:['dist/v0.1.0']}]},{states:[{...published('0.1.0'),releaseTags:[]}]}]){
    const f=await fixture(t,options);await assert.rejects(f.execute());assert.ok(!f.calls.includes('qualify'));assert.ok(!f.calls.includes('push'));
  }
});
test('registered entry point fails if candidate implementation lacks its required suite',async t=>{
  const repository=await mkdtemp(join(tmpdir(),'updates-registration-'));t.after(()=>rm(repository,{recursive:true,force:true}));
  await mkdir(join(repository,'tools/gates/tests'),{recursive:true});await mkdir(join(repository,'tools/updates'),{recursive:true});
  for(const name of ['test_change_gates.py','test_repository.py'])await writeFile(join(repository,'tools/gates/tests',name),'');
  await writeFile(join(repository,'tools/updates/run.mjs'),'');await writeFile(join(repository,'tools/test-repository.sh'),await readFile(new URL('../../test-repository.sh',import.meta.url)));
  await command('git',['init'],{cwd:repository});await assert.rejects(command('sh',['tools/test-repository.sh'],{cwd:repository}));
});
