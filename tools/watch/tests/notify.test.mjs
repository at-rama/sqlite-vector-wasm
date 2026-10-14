import test from 'node:test';
import assert from 'node:assert/strict';
import { notifyPlan } from '../notify.mjs';

const environment={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'at-rama/sqlite-vector-wasm',GITHUB_SHA:'a'.repeat(40),
  GITHUB_EVENT_NAME:'schedule',GITHUB_SERVER_URL:'https://github.com',GITHUB_RUN_ID:'123',
  RESEND_API_KEY:'synthetic-private-key',RESEND_FROM:'sender@example.test',RESEND_TO:'recipient@gmail.com'};
function record(event='schedule',entries=[{selection:{sqlite:'3.54.0',sqliteVec:'0.1.9'},candidates:[]}]) {
  return {schemaVersion:1,context:{repository:environment.GITHUB_REPOSITORY,revision:environment.GITHUB_SHA,event},
    plan:{schemaVersion:1,repository:environment.GITHUB_REPOSITORY,outcome:entries.length?'nonempty':'empty',entries}};
}
const accepted=()=>({ok:true,status:200,json:async()=>({id:'synthetic-email-id'})});

test('one short Resend request per execution under either trigger, including partial/all existing candidates',async()=>{
  for(const event of ['schedule','workflow_dispatch'])for(const candidates of [0,1,3]) {
    const entries=Array.from({length:3},(_,i)=>({selection:{sqlite:'3.54.0',sqliteVec:`0.1.${9+i}`},
      candidates:i<candidates?[{url:'https://github.com/example/candidate',state:'queued'}]:[]}));
    const input=record(event,entries),before=structuredClone(input),calls=[];
    const send=async(url,options)=>{calls.push({url,options});return accepted();};
    assert.equal(await notifyPlan(input,{...environment,GITHUB_EVENT_NAME:event},send),'sent');
    assert.equal(calls.length,1);assert.deepEqual(input,before);
    const {url,options}=calls[0];assert.equal(url,'https://api.resend.com/emails');
    assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(options.headers,{Authorization:'Bearer synthetic-private-key','Content-Type':'application/json'});
    const body=JSON.parse(options.body);
    assert.deepEqual(Object.keys(body).sort(),['from','subject','text','to']);
    assert.equal(body.from,environment.RESEND_FROM);assert.deepEqual(body.to,[environment.RESEND_TO]);
    assert.equal(body.subject,'sqlite-vector-wasm: upstream plan available');
    assert.match(body.text,/3 eligible pairs/);assert.match(body.text,/https:\/\/github.com\/at-rama\/sqlite-vector-wasm\/actions\/runs\/123/);
    assert.ok(body.text.length<300);assert.doesNotMatch(body.text,/3\.54\.0|0\.1\.9|candidate|queued|synthetic-private-key/);
    assert.equal(options.headers['Idempotency-Key'],undefined);
  }
});
test('identical recurring plans produce independent fresh mail without history',async()=>{
  const calls=[];const request=async(_,options)=>{calls.push(JSON.parse(options.body));return accepted();};
  await notifyPlan(record(),environment,request);await notifyPlan(record(),{...environment,GITHUB_RUN_ID:'124'},request);
  assert.equal(calls.length,2);assert.match(calls[0].text,/runs\/123/);assert.match(calls[1].text,/runs\/124/);
  assert.match(calls[0].text,/1 eligible pair\)/);
});
test('empty and failed results send nothing without requiring mail configuration',async()=>{
  const request=()=>{assert.fail('must not contact any service');};
  for(const event of ['schedule','workflow_dispatch']) {
    assert.equal(await notifyPlan(record(event,[]),{},request),'skipped');
    assert.equal(await notifyPlan({schemaVersion:1,outcome:'failed',stage:'evidence',plan:record(event).plan},{},request),'skipped');
  }
});
test('malformed, inconsistent or foreign handoffs cannot send',async()=>{
  const inputs=[null,{}, {schemaVersion:1}, {...record(),outcome:'nonempty'},
    {...record(),plan:{...record().plan,outcome:'empty'}},
    {...record(),context:{...record().context,revision:'b'.repeat(40)}},
    {...record(),plan:{...record().plan,repository:'another/repository'}},
    {...record(),context:{...record().context,event:'workflow_dispatch'}}];
  for(const input of inputs)await assert.rejects(notifyPlan(input,environment,()=>assert.fail('must not send')));
});
test('eligible mail requires the three established configuration names',async()=>{
  for(const name of ['RESEND_API_KEY','RESEND_FROM','RESEND_TO']) {
    await assert.rejects(notifyPlan(record(),{...environment,[name]:''},()=>assert.fail('must not send')),new RegExp(`Missing ${name}`));
    await assert.rejects(notifyPlan(record(),{...environment,[name]:'invalid\nvalue'},()=>assert.fail('must not send')),new RegExp(`Invalid ${name}`));
  }
});
test('request rejection, timeout and ambiguous responses never retry or expose provider secrets',async()=>{
  for(const request of [
    async()=>{throw Error('synthetic-private-key network error');},
    async()=>{throw new DOMException('synthetic-private-key','TimeoutError');},
    async()=>({ok:false,status:429,json:()=>assert.fail('must not read rejection body')}),
    async()=>({ok:true,status:200,json:async()=>{throw Error('synthetic-private-key');}}),
    async()=>({ok:true,status:200,json:async()=>({message:'synthetic-private-key'})})
  ]) {
    let calls=0;
    await assert.rejects(notifyPlan(record(),environment,async(...args)=>{calls++;return request(...args);}),error=>{
      assert.doesNotMatch(error.message,/synthetic-private-key/);assert.match(error.message,/No automatic resend/);return true;
    });assert.equal(calls,1);
  }
});
test('run link validation prevents misleading destinations without altering the plan',async()=>{
  for(const change of [{GITHUB_RUN_ID:'123/other'},{GITHUB_SERVER_URL:'https://example.test'},
    {GITHUB_REPOSITORY:'owner/repo\ntext'},{GITHUB_ACTIONS:'false'}])
    await assert.rejects(notifyPlan(record(),{...environment,...change},()=>assert.fail('must not send')));
});
