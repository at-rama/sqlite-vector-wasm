import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runWatch, invocation } from '../run.mjs';
import { planningFixture } from './fixture.mjs';
import { httpReader } from '../../release/state.mjs';

async function exercise(options={}) {
  const f=await planningFixture(options),summaries=[],evidence=[];
  const result=await runWatch({context:f.context,get:options.get||f.get,writeSummary:async x=>summaries.push(x),writeEvidence:async x=>evidence.push(x),secrets:['synthetic-private-token']});
  return {result,summaries,evidence,f};
}
test('complete scheduled and manual fixture plans use the same read/compute/render path',async()=>{
  const f=await planningFixture(),summary=[],evidence=[];
  const run=event=>runWatch({context:{...f.context,event},get:f.get,writeSummary:async s=>summary.push(s),writeEvidence:async e=>evidence.push(e)});
  const scheduled=await run('schedule'),manual=await run('workflow_dispatch');assert.deepEqual(scheduled,manual);
  assert.deepEqual(scheduled.entries.map(e=>[e.selection.sqlite,e.selection.sqliteVec,e.identity.channel,e.identity.version]),[
    ['3.54.0','0.1.9','latest','0.2.0'],['3.53.4','0.1.10-alpha.4','next','0.1.1-alpha.1'],['3.54.0','0.1.10-alpha.4','next','0.2.0-alpha.1']]);
  assert.equal(summary[0].split('Invocation:')[0],summary[1].split('Invocation:')[0]);assert.equal(evidence.length,2);
  assert.match(evidence[0].observationStartedAt,/^\d{4}-\d{2}-\d{2}T/);
  assert.equal(evidence[0].inventory.sqlite[1].release,'https://sqlite.org/releaselog/3_54_0.html');
  assert.equal(evidence[0].publication.snapshot.heads.latest.version,'0.1.0');
  assert.ok(f.calls.every(u=>!u.includes('dispatches')));
});
test('normal empty plan succeeds with readable summary and invocation evidence',async()=>{
  const {result,summaries,evidence}=await exercise({empty:true});
  assert.equal(result.outcome,'empty');assert.match(summaries[0],/Normal empty plan/);assert.equal(evidence[0].plan.outcome,'empty');
});

test('F1 Release identity contradictions fail discovery rather than presenting a plan',async()=>{
  const f=await planningFixture();
  const releases=f.replies.get('https://api.github.com/repos/asg017/sqlite-vec/releases?per_page=100').data;
  releases[0].id=releases[1].id;releases[0].url=releases[1].url;
  const {result,summaries,evidence}=await exercise({get:f.get});
  assert.equal(result.outcome,'failed');assert.equal(result.stage,'discovery');
  assert.match(result.diagnostic,/repeated sqlite-vec Release resource/);
  assert.match(summaries[0],/planning failed/);assert.match(summaries[0],/discovery/);
  assert.doesNotMatch(summaries[0],/Normal empty plan|## latest|## next/);
  assert.equal(evidence[0].outcome,'failed');assert.equal(evidence[0].stage,'discovery');
  assert.equal(result.entries,undefined);assert.equal(evidence[0].plan,undefined);
});

test('F2 contradictory pre-PR preparation selections fail candidate state without launch advice',async()=>{
  const f=await planningFixture(),repository=f.repository;
  const run={id:17,run_attempt:1,status:'queued',event:'workflow_dispatch',head_branch:'main',
    path:'.github/workflows/updates.yml',repository:{full_name:repository},head_sha:f.context.revision,
    html_url:`https://github.com/${repository}/actions/runs/17`};
  const runs=['3.54.0','3.54.1'].map(sqlite=>({...run,display_title:`candidate sqlite=${sqlite} sqlite-vec=0.1.9`}));
  f.replies.get(`https://api.github.com/repos/${repository}/actions/workflows/updates.yml/runs?branch=main&event=workflow_dispatch&per_page=100`).data={total_count:2,workflow_runs:runs};
  const {result,summaries,evidence}=await exercise({get:f.get});
  assert.equal(result.outcome,'failed');assert.equal(result.stage,'candidate state');
  assert.match(result.diagnostic,/Repeated active preparation observation/);
  assert.match(summaries[0],/planning failed/);assert.match(summaries[0],/candidate state/);
  assert.doesNotMatch(summaries[0],/Normal empty plan|gh workflow run|## latest|## next/);
  assert.equal(evidence[0].outcome,'failed');assert.equal(evidence[0].stage,'candidate state');
  assert.equal(result.entries,undefined);assert.equal(evidence[0].plan,undefined);
  assert.ok(f.calls.every(u=>!u.includes('dispatches')));
});
test('source, state, candidate and calculation failures retain stage, redacted diagnostics and failure outcome',async()=>{
  for(const [target,stage] of [['src/taglist','discovery'],['/tags?','publication state'],['actions/workflows/','candidate state']]) {
    const f=await planningFixture();const {result,summaries,evidence}=await exercise({get:async(u,o)=>{if(u.includes(target))throw Error('synthetic-private-token unavailable');return f.get(u,o);}});
    assert.equal(result.outcome,'failed');assert.equal(result.stage,stage);assert.match(summaries[0],/not an empty-plan/);
    assert.ok(!JSON.stringify({result,summaries,evidence}).includes('synthetic-private-token'));
  }
  const f=await planningFixture();f.replies.get('https://api.github.com/repos/at-rama/sqlite-vector-wasm/tags?per_page=100').data.push({name:'dist/v0.2.0',commit:{sha:'a'.repeat(40)}});
  const {result}=await exercise({get:f.get});assert.equal(result.stage,'calculation');assert.equal(result.outcome,'failed');
});
test('summary or evidence write failure cannot produce successful empty execution',async()=>{
  for(const key of ['writeSummary','writeEvidence']) {
    const f=await planningFixture();const args={context:f.context,get:f.get,writeSummary:async()=>{},writeEvidence:async()=>{}};
    args[key]=async()=>{throw Error('destination unavailable');};const r=await runWatch(args);
    assert.equal(r.outcome,'failed');assert.equal(r.stage,key==='writeSummary'?'presentation':'evidence');
  }
});
test('invocation separates Watch events from preparation and rejects overrides',()=>{
  const environment={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'at-rama/sqlite-vector-wasm',GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_SHA:'a'.repeat(40),GITHUB_REF:'refs/heads/development'};
  const event={repository:{full_name:environment.GITHUB_REPOSITORY,default_branch:'main'},sender:{type:'User'},inputs:{}};
  assert.equal(invocation(event,environment).event,'workflow_dispatch');
  assert.equal(invocation({...event,sender:{type:'Bot'}},environment).event,'workflow_dispatch','GitHub-authorized API dispatch only recalculates the plan');
  assert.throws(()=>invocation({...event,inputs:{sqlite_version:'3.54.0'}},environment));
  assert.throws(()=>invocation(event,{...environment,GITHUB_EVENT_NAME:'pull_request'}));
  assert.throws(()=>invocation(event,{...environment,GITHUB_EVENT_NAME:'schedule'}));
  assert.equal(invocation(event,{...environment,GITHUB_EVENT_NAME:'schedule',GITHUB_REF:'refs/heads/main'}).event,'schedule');
});
test('HTTP adapter uses GET and confines token authorization to GitHub API',async()=>{
  const original=globalThis.fetch,calls=[];
  globalThis.fetch=async(url,options)=>{calls.push({url:String(url),options});return {status:200,headers:[],arrayBuffer:async()=>Buffer.from('{}')};};
  try {const get=httpReader('synthetic-token');await get('https://api.github.com/repos/at-rama/sqlite-vector-wasm/tags');await get('https://sqlite.org/src/taglist',{binary:true});}
  finally {globalThis.fetch=original;}
  assert.ok(calls.every(x=>x.options.method===undefined&&x.options.body===undefined));
  assert.equal(calls[0].options.headers.Authorization,'Bearer synthetic-token');assert.equal(calls[1].options.headers.Authorization,undefined);
});
test('CLI invocation failure writes a summary, ignored diagnostics and a failing process status',async t=>{
  const directory=await mkdtemp(join(tmpdir(),'watch-cli-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  const event=join(directory,'event.json'),summary=join(directory,'summary.md');await writeFile(event,'{}');
  const run=spawnSync(process.execPath,[new URL('../cli.mjs',import.meta.url).pathname],{cwd:directory,encoding:'utf8',env:{PATH:process.env.PATH,GITHUB_EVENT_PATH:event,GITHUB_STEP_SUMMARY:summary}});
  assert.equal(run.status,1);assert.match(await readFile(summary,'utf8'),/planning failed/);
  const evidence=JSON.parse(await readFile(join(directory,'.work/watch/result.json'),'utf8'));assert.equal(evidence.stage,'invocation');
});
test('workflow exposes only weekly/manual read-only planning with pinned actions',async()=>{
  const workflow=await readFile(new URL('../../../.github/workflows/watch.yml',import.meta.url),'utf8');
  assert.match(workflow,/cron: '0 8 \* \* 5'\s+timezone: Europe\/Paris/);assert.match(workflow,/workflow_dispatch:/);
  assert.doesNotMatch(workflow,/pull_request:|push:|inputs:|: write|id-token:|smtp|secrets\./i);
  assert.match(workflow,/contents: read\s+pull-requests: read\s+actions: read/);
  const actions=[...workflow.matchAll(/uses: (\S+)/g)].map(m=>m[1]);assert.equal(actions.length,2);assert.ok(actions.every(a=>/@[0-9a-f]{40}$/.test(a)));
  assert.equal(new Intl.DateTimeFormat('en',{timeZone:'Europe/Paris',hour:'numeric',hourCycle:'h23'}).format(new Date('2026-01-09T07:00:00Z')),'08');
  assert.equal(new Intl.DateTimeFormat('en',{timeZone:'Europe/Paris',hour:'numeric',hourCycle:'h23'}).format(new Date('2026-07-10T06:00:00Z')),'08');
});
