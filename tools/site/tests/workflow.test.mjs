import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = () => readFile(new URL('../../../.github/workflows/site.yml', import.meta.url), 'utf8');

test('selected sources cannot access Actions caches and privileged deployment executes the event controller', async () => {
  const workflow = await source();
  assert.match(workflow.split('\njobs:')[0], /^cache-mode: none$/m);
  assert.equal([...workflow.matchAll(/^\s*cache-mode:/gm)].length, 1, 'No job may override cache isolation');
  const deploy = workflow.split('\n  deploy:')[1].split('\n  observe:')[0];
  assert.equal([...deploy.matchAll(/uses: actions\/checkout@/g)].length, 1);
  assert.match(deploy, /uses: actions\/checkout@[0-9a-f]{40}[^\n]*\n        with:\n          persist-credentials: false\n/);
  assert.doesNotMatch(deploy, /\bref:|pull_request\.head|stable_commit|workflow_run\.head|npm (?:install|ci)|harness\.sh/);
  assert.match(deploy, /run: node tools\/site\/publication\.mjs guard evidence\/pages\/site-publication\.json/);
  assert.doesNotMatch(workflow, /ref: \$\{\{/);
  assert.equal([...workflow.matchAll(/run: node tools\/site\/checkout\.mjs preview/g)].length, 2);
  assert.match(workflow, /run: node tools\/site\/checkout\.mjs stable/);
});

test('the complete publication sequence shares concurrency; builds and observers receive no Pages credentials', async () => {
  const workflow = await source();
  const build = workflow.split('\n  build:')[1].split('\n  deploy:')[0];
  const deploy = workflow.split('\n  deploy:')[1].split('\n  observe:')[0];
  const observe = workflow.split('\n  observe:')[1];
  assert.match(workflow.split('\njobs:')[0], /group: github-pages\n  cancel-in-progress: false/);
  assert.doesNotMatch(build + observe, /pages: write|id-token: write|contents: write|secrets\./);
  assert.match(deploy, /pages: write\n      id-token: write/);
  assert.match(deploy, /needs.build.outputs.publish == 'true'/);
  assert.match(deploy, /publication.mjs guard evidence\/pages\/site-publication.json/);
  assert.ok(deploy.indexOf('publication.mjs guard') < deploy.indexOf('uses: actions/deploy-pages@'));
  assert.match(build, /head.repo.full_name == github.repository/);
  assert.match(build, /github.actor != 'dependabot\[bot\]'/);
  assert.match(build, /github.ref == 'refs\/heads\/main'/);
  assert.match(build, /publication.mjs assemble/);
  assert.match(build, /publication.mjs guard \.work\/pages\/site-publication.json/);
  assert.match(build, /steps.assemble.outcome == 'success'/);
  assert.match(build, /ref: main\n          fetch-depth: 0\n          path: stable\n          persist-credentials: false/);
  assert.match(build, /cd \.\.\/stable/);
  assert.match(build, /STABLE_PROFILE/);
  assert.match(build, /eligibility\.mjs select/);
  assert.match(build, /sh tools\/site.sh build --preview "\$PREVIEW_BRANCH" "\$PREVIEW_COMMIT"/);
  assert.match(build, /path: candidate\/\.work\/pages/);
  assert.match(observe, /tools\/site\/observe.mjs "\$SITE_URL"/);
  assert.match(observe, /path:\s*(?:\|\s*)?live-pages.json/);
  assert.match(workflow, /node-version: '24\.19\.0'/);
  assert.doesNotMatch(build.slice(0, build.indexOf('    steps:')), /runner\./);
  assert.match(build, /Check real builds and browser integration\n        if: steps.selection.outputs.relevant == 'true'\n        env:\n          HARNESS_STATE: \$\{\{ runner\.temp \}\}/);
  assert.doesNotMatch(workflow, /pull_request_target:|\n  release:|tools\/release\.sh|npm publish|gh-pages|latest/);
  for (const action of workflow.matchAll(/uses: ([^\s#]+)/g)) assert.match(action[1], /@[0-9a-f]{40}$/);
});

test('automatic publication is input scoped and unmerged closure has no trigger', async () => {
  const workflow = await source();
  assert.match(workflow, /pull_request:\n    paths: &site-inputs/);
  assert.match(workflow, /push:\n    branches: \[main\]\n    paths: \*site-inputs/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /types:.*closed/);
  for (const path of ['README.md', 'docs/usage.md', 'site/**', 'tools/site/**', 'tools/site.sh',
    'tools/harness/**', 'tools/harness.sh', '.github/workflows/site.yml']) assert.ok(workflow.includes(`'${path}'`));
});


test('documentation checks run separately from example execution and retain its evidence', async () => {
  const workflow = await source();
  assert.match(workflow, /node --test tools\/site\/checks\/\*.test.mjs/);
  assert.match(workflow, /bash tools\/harness.sh exec sh tools\/site.sh example/);
  assert.match(workflow, /candidate\/\.work\/docs-example\/result.json/);
});


test('the real demo exercise and hosted mobile evidence remain in the existing publication path', async () => {
  const workflow = await source();
  assert.match(workflow, /bash tools\/harness.sh exec sh tools\/site.sh demo/);
  for (const file of ['demo-results.json', 'demo-stable-mobile.png', 'demo-preview-mobile.png', 'live-pages-demo-mobile.png']) assert.ok(workflow.includes(file));
});
