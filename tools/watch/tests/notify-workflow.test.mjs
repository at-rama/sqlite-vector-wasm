import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('sender follows successful producer and artifact steps with isolated established configuration',async()=>{
  const workflow=await readFile(new URL('../../../.github/workflows/watch.yml',import.meta.url),'utf8');
  const steps=workflow.split(/\n      - /).slice(1);
  assert.equal(steps.length,4);
  assert.match(steps[1],/run: sh tools\/watch\.sh/);assert.doesNotMatch(steps[1],/RESEND|notify/);
  assert.match(steps[2],/if: always\(\)/);assert.match(steps[2],/actions\/upload-artifact@[0-9a-f]{40}/);
  assert.match(steps[2],/path: \.work\/watch\//);assert.doesNotMatch(steps[2],/RESEND|notify/);
  assert.match(steps[3],/if: success\(\)/);assert.match(steps[3],/run: node tools\/watch\/notify-cli\.mjs/);
  assert.match(steps[3],/RESEND_API_KEY: \$\{\{ secrets\.RESEND_API_KEY \}\}/);
  assert.match(steps[3],/RESEND_FROM: \$\{\{ vars\.RESEND_FROM \}\}/);
  assert.match(steps[3],/RESEND_TO: \$\{\{ vars\.RESEND_TO \}\}/);
  assert.doesNotMatch(steps[3],/always\(\)|continue-on-error|github\.event_name|GH_TOKEN|GITHUB_TOKEN/);
  assert.equal((workflow.match(/run: node tools\/watch\/notify-cli\.mjs/g)||[]).length,1);
  assert.doesNotMatch(workflow,/RESEND_TO_EMAIL|RESEND_FROM_EMAIL|smtp|: write|id-token:/i);
  assert.match(workflow,/contents: read\s+pull-requests: read\s+actions: read/);
  assert.match(workflow,/cron: '0 8 \* \* 5'\s+timezone: Europe\/Paris/);
  assert.match(workflow,/workflow_dispatch:\s*\n/);
});
