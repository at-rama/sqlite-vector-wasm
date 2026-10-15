import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Pages deploy and artifact upload are guarded; PRs use read-only checks', async () => {
  const workflow = await readFile(new URL('../../../.github/workflows/site.yml', import.meta.url), 'utf8');
  const deploy = workflow.slice(workflow.indexOf('\n  deploy:'));
  const build = workflow.slice(workflow.indexOf('\n  build:'), workflow.indexOf('\n  deploy:'));
  assert.match(workflow, /permissions:\n  contents: read/);
  const guard = "if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'";
  assert.ok(deploy.includes(guard));
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /pages: write\n      id-token: write/);
  assert.match(deploy, /name: github-pages/);
  assert.match(deploy, /group: github-pages\n      cancel-in-progress: false/);
  assert.doesNotMatch(build, /pages: write|id-token: write|contents: write|secrets\./);
  assert.ok(build.slice(build.indexOf('Upload the validated site')).includes(guard));
  assert.match(build, /path: \.work\/site\/dist/);
  assert.match(build, /sh tools\/site\.sh install/);
  assert.match(build, /node --test tools\/site\/tests\/\*\.test\.mjs/);
  assert.match(build, /sh tools\/site\.sh exercise/);
  assert.match(build, /node-version: '24\.19\.0'/);
  assert.doesNotMatch(workflow, /pull_request_target:|\n  release:|tools\/release\.sh|npm publish|latest|refresh/);
  for (const action of workflow.matchAll(/uses: ([^\s#]+)/g)) assert.match(action[1], /@[0-9a-f]{40}$/);
});

test('both PR and main inputs include the actual documentation and tooling sources', async () => {
  const workflow = await readFile(new URL('../../../.github/workflows/site.yml', import.meta.url), 'utf8');
  assert.match(workflow, /pull_request:\n    paths: &site-inputs/);
  assert.match(workflow, /push:\n    branches: \[main\]\n    paths: \*site-inputs/);
  assert.match(workflow, /workflow_dispatch:/);
  for (const path of ['README.md', 'docs/usage.md', 'site/**', 'tools/site/**', 'tools/site.sh',
    'tools/harness/**', 'tools/harness.sh', '.github/workflows/site.yml']) assert.ok(workflow.includes(`'${path}'`));
});
