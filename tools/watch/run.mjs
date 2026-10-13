import assert from 'node:assert/strict';
import { commitPattern } from '../release/policy.mjs';
import { repositoryName } from '../release/state.mjs';
import { discover } from './discovery.mjs';
import { publicationState, candidateState, cachedReader } from './state.mjs';
import { makePlan, renderPlan, renderFailure } from './plan.mjs';

export function invocation(event,environment) {
  const repository=repositoryName(environment.GITHUB_REPOSITORY);
  assert.equal(environment.GITHUB_ACTIONS,'true','Watch entry point requires GitHub Actions');
  assert.ok(['schedule','workflow_dispatch'].includes(environment.GITHUB_EVENT_NAME),'Watch only accepts scheduled or manual planning');
  assert.equal(event.repository?.full_name,repository,'Planning repository mismatch');
  assert.match(environment.GITHUB_SHA || '',commitPattern);
  if(environment.GITHUB_EVENT_NAME==='schedule')assert.equal(environment.GITHUB_REF,`refs/heads/${event.repository.default_branch}`,'Schedule must use the default branch');
  else {
    assert.equal(event.sender?.type,'User','Manual Watch requires a human actor');
    assert.ok(!event.inputs || (typeof event.inputs==='object'&&!Array.isArray(event.inputs)&&Object.keys(event.inputs).length===0),'Watch accepts no preparation or override inputs');
  }
  return {repository,event:environment.GITHUB_EVENT_NAME,revision:environment.GITHUB_SHA,node:process.version};
}

export function diagnostic(error,secrets=[]) {
  let result=String(error?.message || 'Planning could not complete');
  for(const secret of secrets.filter(Boolean))result=result.split(secret).join('[redacted]');
  return result.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,2000);
}

export async function runWatch({context,get,writeSummary,writeEvidence,secrets=[]}) {
  let stage='discovery';
  try {
    repositoryName(context.repository);
    const reader=cachedReader(get);
    const inventory=await discover({get:reader});
    stage='publication state';const publication=await publicationState({repository:context.repository,get:reader});
    stage='candidate state';const candidates=await candidateState({repository:context.repository,get:reader});
    stage='calculation';const plan=makePlan({repository:context.repository,inventory,publication,candidates});
    stage='presentation';
    await writeSummary(renderPlan(plan)+`\nInvocation: ${context.event}; revision ${context.revision}; Node ${context.node}.\n`);
    stage='evidence';await writeEvidence({schemaVersion:1,context,plan});
    return plan;
  } catch(error) {
    const message=diagnostic(error,secrets),failure={schemaVersion:1,outcome:'failed',stage,diagnostic:message,context};
    try {await writeSummary(renderFailure(stage,message));}catch { /* Output failure still leaves a failed execution. */ }
    try {await writeEvidence(failure);}catch { /* Evidence failure cannot become a successful or empty result. */ }
    return failure;
  }
}
