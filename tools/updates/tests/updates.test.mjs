import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { command } from '../../acceptance/run.mjs';
import { calculate } from '../../release/policy.mjs';
import { invocation, candidateDescriptor, candidateBody } from '../context.mjs';
import { prepareCandidate, resolveSources } from '../run.mjs';
import { candidateServices } from '../services.mjs';
import { reconcileNotices } from '../notices.mjs';
import { noticeInputs, root, hash } from '../../package/package.mjs';
const baselineLock = JSON.parse(await readFile(new URL('../../../inputs/sqlite-vector.sources.lock.json', import.meta.url), 'utf8'));
const pair = { sqlite:'3.54.0',sqliteVector:'1.1.2' };
const empty = () => ({schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}});
const event = () => ({repository:{full_name:'a/b'},sender:{type:'User'},inputs:{sqlite_version:pair.sqlite,sqlite_vector_version:pair.sqliteVector,sqlite_comment:'  SQLite line 1\nSQLite line 2  ',sqlite_vector_comment:'$(touch BAD); `echo data`\n"quoted"',misc_comment:'  Misc note  '}});
const environment = () => ({GITHUB_REPOSITORY:'a/b',GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REF:'refs/heads/main',GITHUB_RUN_ID:'17',GITHUB_RUN_ATTEMPT:'2'});
const context = () => invocation({event:event(),environment:environment()});
const lock = selection => {
  const value=structuredClone(baselineLock);
  const code=selection.sqlite.split('.').map((n,i)=>i?String(n).padStart(2,'0'):n).join('')+'00';
  value.sqlite={...value.sqlite,version:selection.sqlite,archiveUrl:`https://sqlite.org/2026/sqlite-src-${code}.zip`,releaseUrl:`https://sqlite.org/releaselog/${selection.sqlite.replaceAll('.','_')}.html`};
  value.sqliteVector={...value.sqliteVector,version:selection.sqliteVector,tag:selection.sqliteVector,releaseUrl:`https://github.com/sqliteai/sqlite-vector/releases/tag/${selection.sqliteVector}`};
  return value;
};
const published = version => {const s=empty();s.heads.latest={version,commit:'a'.repeat(40),upstreams:pair};s.tags=[`dist/v${version}`];s.releaseTags=[`dist/v${version}`];s.npmVersions=[version];return s;};

test('dispatch is exact, hosted, main and comments remain data', () => {
  assert.throws(()=>invocation({event:{...event(),sender:{type:'Bot'}},environment:environment()}));
  const c=context();assert.equal(c.branch,'candidate/run-17-2');
  const expected='SQLite line 1\nSQLite line 2\n\n$(touch BAD); `echo data`\n"quoted"\n\nMisc note';
  assert.equal(c.comment,expected);assert.equal(candidateDescriptor(c,lock(pair)).releaseComment,expected);
  for(const key of ['sqlite_comment','sqlite_vector_comment','misc_comment']) {
    const optional=event();delete optional.inputs[key];
    assert.ok(!invocation({event:optional,environment:environment()}).comment.includes(key==='sqlite_comment'?'SQLite line 1':key==='sqlite_vector_comment'?'$(touch BAD)':'Misc note'));
  }
  const empty=event();empty.inputs.sqlite_comment=' ';empty.inputs.sqlite_vector_comment='';delete empty.inputs.misc_comment;
  assert.equal(invocation({event:empty,environment:environment()}).comment,'');
  for(const override of [{GITHUB_REF:'refs/heads/other'},{GITHUB_EVENT_NAME:'push'},{GITHUB_ACTIONS:'false'},{GITHUB_RUN_ID:'0'},{GITHUB_RUN_ID:'17x'},{GITHUB_RUN_ATTEMPT:'0'}]) assert.throws(()=>invocation({event:event(),environment:{...environment(),...override}}));
  for(const inputs of [{...event().inputs,sqlite_vec_version:'0.1.9'},{...event().inputs,engine:'sqliteVector'},{...event().inputs,channel:'latest'},{...event().inputs,sqlite_version:'latest'},{...event().inputs,sqlite_comment:null},{...event().inputs,sqlite_vector_comment:null},{...event().inputs,misc_comment:null}]) assert.throws(()=>invocation({event:{...event(),inputs},environment:environment()}));
  assert.throws(()=>candidateDescriptor(c,lock({...pair,sqliteVector:'1.1.1'})));
  assert.throws(()=>candidateDescriptor({...c,preparation:{runId:18,url:c.preparation.url}},lock(pair)));
  const e=event();e.pull_request={base:{ref:'main',repo:{full_name:'a/b'}},head:{repo:{full_name:'fork/b'}}};
  assert.throws(()=>invocation({event:e,environment:{...environment(),GITHUB_EVENT_NAME:'pull_request'},rehearsal:true}));
});

async function fixture(t, options={}) {
  const repository=await mkdtemp(join(tmpdir(),'updates-test-'));t.after(()=>rm(repository,{recursive:true,force:true}));
  await mkdir(join(repository,'inputs'));await writeFile(join(repository,'.gitignore'),'.work/\n');await writeFile(join(repository,'inputs/sqlite-vector.sources.lock.json'),JSON.stringify(lock(pair)));
  await mkdir(join(repository,'tools/package'),{recursive:true});
  for(const name of ['tools/package/notices.json','tools/package/notices','tools/package/NOTICE-vector.txt','LICENSE']) await cp(join(root,name),join(repository,name),{recursive:true});
  const baselineNoticesPath=join(repository,'tools/package/notices.json');
  const baselineNotices=JSON.parse(await readFile(baselineNoticesPath));
  for(const record of baselineNotices.notices)if(pair[record.project]) {record.version=pair[record.project];if(record.project==='sqlite'){record.origin='controlled offline fixture';delete record.source;}}
  await writeFile(baselineNoticesPath,JSON.stringify(baselineNotices,null,2)+'\n');
  const git=args=>command('git',args,{cwd:repository});await git(['init','-b','main']);await git(['add','.']);await git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture']);
  const calls=[];let reads=0;const c={...context(),...options.context};
  const run=async (cmd,args,opts)=>{if(cmd==='sh'){await noticeInputs({inputs:lock(c.selection)},repository);assert.equal(await git(['status','--porcelain','--untracked-files=all']),'');calls.push(args[0]);if(options.failure===args[0])throw Error('mandatory check failed');return '';}if(options.failure==='commit'&&cmd==='git'&&args.includes('commit'))throw Error('commit denied');return command(cmd,args,opts);};
  const services={push:async(branch,commit)=>{calls.push('push');assert.equal(await git(['rev-parse','HEAD']),commit);if(options.failure==='push')throw Error('push denied');return {branch,head:options.failure==='pushed-head'?'b'.repeat(40):commit};},createPullRequest:async value=>{calls.push('pr');assert.match(value.body,/not reserved or published/);if(options.failure==='pr')throw Error('PR denied');return {number:1,url:'https://github.com/a/b/pull/1',head:options.failure==='head'?'b'.repeat(40):value.commit};}};
  const qualification=async({context:ctx,readSnapshot})=>{calls.push('qualify');const snapshot=await readSnapshot();if(options.failure==='qualify')throw Error('browser failed');const evidencePath=join(repository,'.work/evidence.json');const evidence={engine:{key:'sqliteVector',upstream:'sqliteai/sqlite-vector',version:ctx.selection.sqliteVector},sourceLock:lock(ctx.selection),sourceLockSha256:hash(await readFile(join(repository,'inputs/sqlite-vector.sources.lock.json'))),repository:ctx.repository,commit:options.failure==='revision'?'b'.repeat(40):ctx.commit,upstreams:ctx.selection,invocation:{preparation:ctx.preparation,comment:ctx.comment},archive:{sha256:'c'.repeat(64),size:123}};
    if(options.failure==='engine')evidence.engine.key='sqliteVec';
    if(options.failure==='sources')evidence.sourceLock.sqliteVector.version='9.9.9';
    if(options.failure==='lock-digest')evidence.sourceLockSha256='0'.repeat(64);
    if(options.failure==='repository')evidence.repository='other/repo';
    if(options.failure==='comment')evidence.invocation.comment='changed';
    if(options.failure==='preparation')evidence.invocation.preparation={runId:99};
    await writeFile(evidencePath,JSON.stringify(evidence));return {identity:calculate({selection:ctx.selection,snapshot,comment:ctx.comment}),evidencePath,bundle:join(repository,'.work/bundle')};};
  const reconcile=async parameters=>{calls.push('notices');if(options.failure==='notices')throw Error('notice source unavailable');
    if(JSON.stringify(c.selection)===JSON.stringify(pair))return reconcileNotices(parameters);
    const prepared=join(parameters.directory,'prepared');await mkdir(prepared);await cp(join(repository,'tools'),join(prepared,'tools'),{recursive:true});await cp(join(repository,'LICENSE'),join(prepared,'LICENSE'));
    const manifestPath=join(prepared,'tools/package/notices.json'), manifest=JSON.parse(await readFile(manifestPath));
    for(const record of manifest.notices)if(c.selection[record.project]&&c.selection[record.project]!==pair[record.project]) {
      record.version=c.selection[record.project];
      const bytes=record.project==='sqliteVector'?await readFile(join(prepared,'tools/package/notices',record.name)):Buffer.from(`independently selected fixture notice ${record.name} ${record.version}\n`);
      await writeFile(join(prepared,'tools/package/notices',record.name),bytes);record.sha256=hash(bytes);
    }
    await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');return {prepared};};
  const execute=()=>prepareCandidate({repository,context:c,run,reconcile,services:c.rehearsal?undefined:services,resolve:async()=>{calls.push('resolve');if(options.failure==='resolve')throw Error('digest drift');return lock(c.selection);},readSnapshot:async()=>{calls.push('state');if(options.failure==='state')throw Error('unavailable');return options.states?.[reads++]||empty();},qualification});
  return {repository,git,calls,execute};
}

test('qualified committed pair precedes push/PR; diagnostics stay ignored',async t=>{
  // Candidate preparation consumes the release-owned npm identity.
  const f=await fixture(t);const result=await f.execute();assert.equal(result.status,'candidate-ready');assert.equal(result.identity.version,'0.1.0');assert.deepEqual(f.calls,['resolve','state','notices','tools/check-repository.sh','tools/test-repository.sh','qualify','state','push','pr']);
  assert.equal(result.preflight.name,'@at-rama/sqlite-vector-wasm');assert.equal(result.identity.name,'@at-rama/sqlite-vector-wasm');
  assert.equal(await f.git(['status','--porcelain','--untracked-files=all']),'');assert.deepEqual((await f.git(['diff-tree','--no-commit-id','--name-only','-r',result.commit])).split('\n'),['inputs/release.json']);
  const descriptor=JSON.parse(await readFile(join(f.repository,'inputs/release.json')));assert.equal(descriptor.releaseComment,context().comment);
  assert.deepEqual(Object.keys(descriptor).sort(),['preparation','releaseComment','schemaVersion','sqlite','sqliteVector']);
  assert.match(candidateBody(result),/attempt 2/);
});
for(const failure of ['resolve','state','notices','commit','tools/check-repository.sh','tools/test-repository.sh','qualify','revision','push','pr','head']) test(`mandatory ${failure} failure stops and retains truthful evidence`,async t=>{
  const f=await fixture(t,{failure});let path;await assert.rejects(f.execute(),error=>{path=error.message.split('evidence: ')[1];return !!path;});const evidence=JSON.parse(await readFile(path));assert.equal(evidence.status,'failed');assert.ok(evidence.diagnostic);
  if(['notices','commit'].includes(failure)) {assert.equal(evidence.commit,undefined);assert.ok(!f.calls.includes('tools/check-repository.sh'));assert.ok(!f.calls.includes('qualify'));}
  if(!['push','pr','head'].includes(failure))assert.ok(!f.calls.includes('push'));
  if(['pr','head'].includes(failure))assert.equal(evidence.branchResult.head,evidence.commit);
});
test('rehearsal has no writes; changed observed state changes the forecast',async t=>{
  const f=await fixture(t,{context:{rehearsal:true},states:[empty(),published('0.1.0')]});const r=await f.execute();assert.equal(r.status,'qualified-without-pr');assert.equal(r.identity.version,'0.1.1');assert.equal(r.forecastChanged,true);assert.ok(!f.calls.includes('push'));assert.equal(r.publicationCalls,0);
});
test('real shared policy handles next and rollback without alternate calculator',async t=>{
  const f=await fixture(t,{context:{selection:{...pair,sqliteVector:'1.1.3-alpha.1'}},states:[published('0.1.0'),published('0.1.0')]});assert.equal((await f.execute()).identity.version,'0.1.1-alpha.1');
  const g=await fixture(t,{context:{selection:{...pair,sqliteVector:'1.1.1'},comment:''},states:[published('0.1.0')]});await assert.rejects(g.execute());assert.ok(!g.calls.includes('push'));
});
test('resolver preserves exact versions/baseline and relocates traces without fallback',async t=>{
  const repository=await mkdtemp(join(tmpdir(),'updates-resolve-'));t.after(()=>rm(repository,{recursive:true,force:true}));const directory=join(repository,'.work/updates/run');await mkdir(directory,{recursive:true});await mkdir(join(repository,'.work/inputs/resolve-test'),{recursive:true});let calls=0;
  const run=async(cmd,args)=>{calls++;assert.equal(cmd,'bash');if(args[1]==='resolve-vector'){assert.deepEqual(args.slice(2,8),['--sqlite-version',pair.sqlite,'--vector-version',pair.sqliteVector,'--baseline-lock','inputs/sqlite-vector.sources.lock.json']);const path=args.at(-1);await writeFile(path,JSON.stringify(lock(pair)));return JSON.stringify({lockPath:path});}assert.equal(args[1],'validate');return '';};
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
  assert.match(workflow,/workflow_dispatch:/);assert.match(workflow,/prepare-sqlite-vector-candidate\/tasks.md/);assert.match(workflow,/sqlite_vector_version:/);assert.doesNotMatch(workflow,/sqlite_vec_version|sqlite_vec_comment/);assert.match(workflow,/persist-credentials: false/);assert.match(workflow,/pull-requests: write/);assert.doesNotMatch(workflow,/id-token:|NPM_TOKEN|pull_request_target|secrets\./);
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
  for(const options of [{context:{selection:{...pair,sqliteVector:'1.1.3-alpha.1'}}},{states:[{...empty(),tags:['dist/v0.1.0']}]},{states:[{...published('0.1.0'),releaseTags:[]}]}]){
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

for (const selection of [
  {...pair,sqlite:'3.55.0'}, {...pair,sqliteVector:'1.1.3'},
  {sqlite:'3.55.0',sqliteVector:'1.1.3-alpha.1'}, {...pair,sqlite:'3.52.0'},
]) test(`selected notice snapshot is committed before checks: ${JSON.stringify(selection)}`, async t=>{
  const f=await fixture(t,{context:{selection},states:[published('0.1.0'),published('0.1.0')]});
  const result=await f.execute();
  const names=(await f.git(['diff-tree','--no-commit-id','--name-only','-r',result.commit])).split('\n');
  const changedNotices=selection.sqlite!==pair.sqlite?['SQLite-LICENSE.txt','SQLite-WASM-NOTICE.txt']:[];
  // Equal license text changes its manifest association, not the text bytes.
  assert.deepEqual(names,['inputs/release.json','inputs/sqlite-vector.sources.lock.json','tools/package/notices.json',...changedNotices.map(name=>`tools/package/notices/${name}`)].sort());
  const manifest=JSON.parse(await f.git(['show',`${result.commit}:tools/package/notices.json`]));
  for(const record of manifest.notices) if(selection[record.project])assert.equal(record.version,selection[record.project]);
});

test('real reconciliation rejects corrupt baseline before invoking its helper and keeps a report',async t=>{
  const f=await fixture(t);const directory=join(f.repository,'.work/updates/corruption');await mkdir(directory,{recursive:true});
  await writeFile(join(f.repository,'tools/package/notices/SQLite-LICENSE.txt'),'tampered');
  await assert.rejects(reconcileNotices({repository:f.repository,directory,lock:lock(pair),run:async()=>assert.fail('helper must not run')}),/Notice digest mismatch/);
  const report=JSON.parse(await readFile(join(directory,'notices.json')));
  assert.equal(report.status,'failed');assert.match(report.diagnostic,/SQLite-LICENSE.txt/);
});

test('real reconciliation rejects invalid helper output before tracked promotion',async t=>{
  const f=await fixture(t),directory=join(f.repository,'.work/updates/invalid-helper');await mkdir(directory,{recursive:true});
  const before=await f.git(['rev-parse','HEAD']);
  const prepared=join(directory,'prepared');await mkdir(prepared);await cp(join(f.repository,'tools'),join(prepared,'tools'),{recursive:true});
  await cp(join(f.repository,'LICENSE'),join(prepared,'LICENSE'));
  const path=join(prepared,'tools/package/notices.json'),manifest=JSON.parse(await readFile(path));manifest.notices[0].version='99.0.0';await writeFile(path,JSON.stringify(manifest));
  await assert.rejects(reconcileNotices({repository:f.repository,directory,lock:lock(pair),run:async()=>JSON.stringify({prepared,reportPath:join(directory,'notices.json')})}),/Wrong notice association/);
  assert.equal(await f.git(['rev-parse','HEAD']),before);assert.equal(await f.git(['status','--porcelain','--untracked-files=all']),'');
  assert.equal(JSON.parse(await readFile(join(directory,'notices.json'))).status,'failed');
});

for (const failure of ['engine','sources','lock-digest','repository','comment','preparation','pushed-head']) test(`qualification/presentation rejects ${failure} mismatch`, async t => {
  const f=await fixture(t,{failure});
  await assert.rejects(f.execute());
  assert.ok(!f.calls.includes('pr'));
  if(failure!=='pushed-head') assert.ok(!f.calls.includes('push'));
});

test('candidate adapter rejects a racing create, wrong pushed head and wrong PR head', async()=>{
  const sha='a'.repeat(40),branch='candidate/run-17-2';
  const race=candidateServices({repository:'a/b',token:'synthetic',run:async(cmd,args)=>{if(args[0]==='push')throw Error('ref already exists');return '';}});
  await assert.rejects(race.push(branch,sha),/push failed/);
  const wrong=candidateServices({repository:'a/b',token:'synthetic',run:async()=>'',request:async()=>({ok:true,json:async()=>({object:{sha:'b'.repeat(40)}})})});
  await assert.rejects(wrong.push(branch,sha),/head mismatch/);
  const pr=candidateServices({repository:'a/b',token:'synthetic',request:async()=>({ok:true,json:async()=>({base:{ref:'main'},head:{sha:'b'.repeat(40)}})})});
  await assert.rejects(pr.createPullRequest({branch,commit:sha}),/head mismatch/);
});
