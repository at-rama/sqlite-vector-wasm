import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runWatch } from '../run.mjs';
import { planningFixture } from './fixture.mjs';

async function cli(t,input,extra={},failure=false) {
  const directory=await mkdtemp(join(tmpdir(),'watch-notify-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  await mkdir(join(directory,'.work/watch'),{recursive:true});
  if(input!==undefined)await writeFile(join(directory,'.work/watch/result.json'),typeof input==='string'?input:JSON.stringify(input));
  await writeFile(join(directory,'summary.md'),'Reference Summary remains intact.');
  const preload=join(directory,'transport.mjs');
  await writeFile(preload,`import {appendFile} from 'node:fs/promises';
globalThis.fetch=async(url,options)=>{
  if(url!=='https://api.resend.com/emails')throw Error('Unexpected network request');
  await appendFile('requests.jsonl',JSON.stringify({url,method:options.method,body:JSON.parse(options.body)})+'\\n');
  ${failure ? "throw Error('synthetic-private-key provider diagnostic');" : "return {ok:true,status:200,json:async()=>({id:'test-email'})};"}
};\n`);
  const environment={PATH:process.env.PATH,GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'at-rama/sqlite-vector-wasm',
    GITHUB_SHA:'a'.repeat(40),GITHUB_EVENT_NAME:'schedule',GITHUB_SERVER_URL:'https://github.com',GITHUB_RUN_ID:'123',
    RESEND_API_KEY:'synthetic-private-key',RESEND_FROM:'sender@example.test',RESEND_TO:'recipient@gmail.com',...extra};
  const run=spawnSync(process.execPath,['--import',preload,new URL('../notify-cli.mjs',import.meta.url).pathname],
    {cwd:directory,encoding:'utf8',env:environment});
  const requests=await readFile(join(directory,'requests.jsonl'),'utf8').catch(()=> '');
  assert.doesNotMatch(run.stdout+run.stderr,/synthetic-private-key|provider diagnostic/);
  assert.equal(await readFile(join(directory,'summary.md'),'utf8'),'Reference Summary remains intact.');
  if(input!==undefined)assert.equal(await readFile(join(directory,'.work/watch/result.json'),'utf8'),typeof input==='string'?input:JSON.stringify(input));
  return {run,requests:requests.trim()?requests.trim().split('\n').map(JSON.parse):[]};
}
async function produced(event,options={}) {
  const f=await planningFixture(options);let record;
  const result=await runWatch({context:{...f.context,event},get:options.get||f.get,
    writeSummary:options.writeSummary|| (async()=>{}),writeEvidence:async value=>{record=value;}});
  return {result,record};
}
test('actual producer records reach the sender CLI under both triggers',async t=>{
  for(const event of ['schedule','workflow_dispatch']) {
    const {result,record}=await produced(event);
    const {run,requests}=await cli(t,record,{GITHUB_EVENT_NAME:event,GITHUB_SHA:record.context.revision});
    assert.equal(result.outcome,'nonempty');assert.equal(run.status,0,run.stderr);assert.equal(requests.length,1);
    assert.match(run.stdout,/accepted by Resend; receipt is not confirmed/);
  }
});
test('actual producer empty and discovery/state/calculation/presentation/evidence failures cannot send',async t=>{
  for(const event of ['schedule','workflow_dispatch']) {
    const empty=await produced(event,{empty:true});
    const {run,requests}=await cli(t,empty.record,{RESEND_API_KEY:'',RESEND_FROM:'',RESEND_TO:''});
    assert.equal(run.status,0);assert.equal(requests.length,0);
    for(const target of ['src/taglist','/tags?','actions/workflows/']) {
      const f=await planningFixture();
      const failure=await produced(event,{get:async(u,o)=>{if(u.includes(target))throw Error('unavailable');return f.get(u,o);}});
      assert.equal(failure.result.outcome,'failed');
      const output=await cli(t,failure.record);assert.equal(output.run.status,0);assert.equal(output.requests.length,0);
    }
    const f=await planningFixture();
    f.replies.get('https://api.github.com/repos/at-rama/sqlite-vector-wasm/tags?per_page=100').data.push({name:'dist/v0.2.0',commit:{sha:'a'.repeat(40)}});
    const calculation=await produced(event,{get:f.get});assert.equal(calculation.result.stage,'calculation');
    assert.equal((await cli(t,calculation.record)).requests.length,0);
    const presentation=await produced(event,{writeSummary:async()=>{throw Error('unavailable');}});
    assert.equal(presentation.result.stage,'presentation');assert.equal((await cli(t,presentation.record)).requests.length,0);
    let first=true,record;
    const evidence=await runWatch({context:{...f.context,event},get:(await planningFixture()).get,writeSummary:async()=>{},
      writeEvidence:async value=>{if(first){first=false;throw Error('unavailable');}record=value;}});
    assert.equal(evidence.stage,'evidence');assert.equal((await cli(t,record)).requests.length,0);
  }
});
test('missing/malformed handoff and missing configuration fail safely without sending',async t=>{
  const {record}=await produced('schedule');
  for(const input of [undefined,'{synthetic-private-key',{}, {...record,plan:{...record.plan,outcome:'empty'}}]) {
    const {run,requests}=await cli(t,input);assert.equal(run.status,1);assert.equal(requests.length,0);
  }
  const {run,requests}=await cli(t,record,{GITHUB_SHA:record.context.revision,RESEND_API_KEY:''});
  assert.equal(run.status,1);assert.equal(requests.length,0);
});
test('ambiguous CLI send fails once and preserves producer records without fallback',async t=>{
  const {record}=await produced('schedule');
  const {run,requests}=await cli(t,record,{GITHUB_SHA:record.context.revision},true);
  assert.equal(run.status,1);assert.equal(requests.length,1);assert.match(run.stderr,/No automatic resend/);
});
