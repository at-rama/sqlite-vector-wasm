import assert from 'node:assert/strict';

export class NotificationError extends Error {}

export async function notifyPlan(record, environment, request=globalThis.fetch) {
  assert.equal(record?.schemaVersion,1,'Invalid Watch result schema');
  if(record.outcome==='failed')return 'skipped';
  assert.equal(record.outcome,undefined,'Invalid Watch result outcome');
  const plan=record.plan;
  assert.equal(plan?.schemaVersion,1,'Invalid Watch plan schema');
  assert.ok(['empty','nonempty'].includes(plan.outcome),'Invalid Watch plan outcome');
  assert.ok(Array.isArray(plan.entries),'Invalid Watch plan entries');
  assert.equal(plan.outcome,plan.entries.length ? 'nonempty' : 'empty','Contradictory Watch plan');
  if(plan.outcome==='empty')return 'skipped';

  const repository=environment.GITHUB_REPOSITORY;
  assert.match(repository || '',/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/,'Invalid Actions repository');
  assert.equal(environment.GITHUB_ACTIONS,'true','Notification requires GitHub Actions');
  assert.equal(record.context?.repository,repository,'Watch invocation repository mismatch');
  assert.equal(plan.repository,repository,'Watch plan repository mismatch');
  assert.match(environment.GITHUB_SHA || '',/^[0-9a-f]{40}$/,'Invalid Actions revision');
  assert.equal(record.context?.revision,environment.GITHUB_SHA,'Watch revision mismatch');
  assert.ok(['schedule','workflow_dispatch'].includes(environment.GITHUB_EVENT_NAME),'Invalid Watch trigger');
  assert.equal(record.context?.event,environment.GITHUB_EVENT_NAME,'Watch trigger mismatch');
  assert.equal(environment.GITHUB_SERVER_URL,'https://github.com','Invalid Actions server');
  assert.match(environment.GITHUB_RUN_ID || '',/^[1-9][0-9]*$/,'Invalid Actions run identity');

  for(const name of ['RESEND_API_KEY','RESEND_FROM','RESEND_TO']) {
    if(typeof environment[name]!=='string'||!environment[name].trim())throw new NotificationError(`Missing ${name}`);
    if(/[\r\n]/.test(environment[name]))throw new NotificationError(`Invalid ${name}`);
  }
  const url=`${environment.GITHUB_SERVER_URL}/${repository}/actions/runs/${environment.GITHUB_RUN_ID}`;
  const message={from:environment.RESEND_FROM,to:[environment.RESEND_TO],
    subject:'sqlite-vector-wasm: upstream plan available',
    text:`A new upstream plan is available (${plan.entries.length} eligible ${plan.entries.length===1?'pair':'pairs'}).\n\nRead the plan and diagnostics in the GitHub run:\n${url}\n\nOptional release comments: invoke /release-comments with the selected pair; skill linked in the Summary.\n`};
  let response;
  try {
    response=await request('https://api.resend.com/emails',{
      method:'POST',redirect:'error',signal:AbortSignal.timeout(15000),
      headers:{Authorization:`Bearer ${environment.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(message)
    });
  } catch {
    throw new NotificationError('Resend request failed; acceptance is unknown. No automatic resend.');
  }
  if(!response.ok) {
    const status=Number.isInteger(response.status)&&response.status>=100&&response.status<=599 ? response.status : 'unknown';
    throw new NotificationError(`Resend rejected the request (HTTP ${status}). No automatic resend.`);
  }
  try {
    const result=await response.json();
    if(typeof result?.id!=='string'||!result.id.trim())throw Error();
  } catch {
    throw new NotificationError('Resend acceptance could not be confirmed. No automatic resend.');
  }
  return 'sent';
}
