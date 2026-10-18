import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scope.py', import.meta.url));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

async function fixture(t) {
  const cwd = await mkdtemp(join(tmpdir(), 'acceptance-scope-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.name', 'Scope test');
  git(cwd, 'config', 'user.email', 'scope@example.invalid');
  await mkdir(join(cwd, 'site'));
  await writeFile(join(cwd, 'site/index.html'), 'original\n');
  await writeFile(join(cwd, 'runtime.txt'), 'runtime\n');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-qm', 'base');
  return { cwd, base: git(cwd, 'rev-parse', 'HEAD') };
}

function select({ cwd, base }, event = 'pull_request', overrides = {}) {
  const result = spawnSync('python3', [script], { cwd, encoding: 'utf8',
    env: { ...process.env, EVENT_NAME: event, BASE_SHA: base,
      HEAD_SHA: git(cwd, 'rev-parse', 'HEAD'), ...overrides } });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /Acceptance scope:/);
  return result.stdout.trim();
}

function commit(cwd) {
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-qm', 'candidate');
}

test('site-only additions, modifications and deletions avoid production on PR and push', async t => {
  for (const operation of ['add', 'modify', 'delete']) {
    const f = await fixture(t);
    if (operation === 'delete') await rm(join(f.cwd, 'site/index.html'));
    else await writeFile(join(f.cwd, operation === 'add' ? 'site/new\npage.html' : 'site/index.html'), 'new\n');
    commit(f.cwd);
    for (const event of ['pull_request', 'push']) assert.equal(select(f, event), 'required=false');
  }
});

test('mixed and outside-only changes require full production', async t => {
  for (const mixed of [false, true]) {
    const f = await fixture(t);
    await writeFile(join(f.cwd, 'runtime.txt'), 'changed\n');
    if (mixed) await writeFile(join(f.cwd, 'site/index.html'), 'changed\n');
    commit(f.cwd);
    assert.equal(select(f), 'required=true');
  }
});

test('moves across site boundary and similarly named paths require production', async t => {
  for (const [from, to] of [['runtime.txt', 'site/runtime.txt'],
    ['site/index.html', 'index.html'], ['runtime.txt', 'site-other.txt']]) {
    const f = await fixture(t);
    git(f.cwd, 'mv', from, to);
    commit(f.cwd);
    assert.equal(select(f), 'required=true');
  }
});

test('complete PR diff retains earlier product changes after a site-only final commit', async t => {
  const f = await fixture(t);
  await writeFile(join(f.cwd, 'runtime.txt'), 'changed\n');
  commit(f.cwd);
  await writeFile(join(f.cwd, 'site/index.html'), 'changed\n');
  commit(f.cwd);
  assert.equal(select(f), 'required=true');
});

test('manual, unknown, empty or unavailable comparisons always require production', async t => {
  const f = await fixture(t);
  assert.equal(select(f), 'required=true');
  await writeFile(join(f.cwd, 'site/index.html'), 'changed\n');
  commit(f.cwd);
  for (const event of ['workflow_dispatch', 'unknown']) assert.equal(select(f, event), 'required=true');
  for (const overrides of [{ BASE_SHA: '' }, { BASE_SHA: '0'.repeat(40) },
    { BASE_SHA: 'f'.repeat(40) }, { HEAD_SHA: '' }, { HEAD_SHA: 'bad' }]) {
    assert.equal(select(f, 'push', overrides), 'required=true');
  }
});

test('workflow keeps required job and gates setup, production and artifacts with the same scope', async () => {
  const workflow = await readFile(new URL('../../../.github/workflows/acceptance.yml', import.meta.url), 'utf8');
  assert.match(workflow, /  pull_request:/);
  assert.match(workflow, /  push:/);
  assert.match(workflow, /  workflow_dispatch:/);
  assert.doesNotMatch(workflow, /paths-ignore:|paths:/);
  assert.match(workflow, /  acceptance:\n    needs: \[scope, composition\]\n    if: always\(\)\n    runs-on:/);
  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /github.event.pull_request.base.sha/);
  assert.match(workflow, /github.event.before/);
  assert.match(workflow, /HEAD_SHA: \$\{\{ github.sha \}\}/);
  assert.match(workflow, /python3 tools\/acceptance\/scope.py >> "\$GITHUB_OUTPUT"/);
  assert.match(workflow, /composition:\n    needs: scope\n    if: needs.scope.outputs.required == 'true'/);
  assert.match(workflow, /Produce and accept exact final package/);
  assert.match(workflow, /Preserve available acceptance evidence and exact payload\n        if: always\(\)/);
  assert.match(workflow, /No package qualification was performed/);
});
