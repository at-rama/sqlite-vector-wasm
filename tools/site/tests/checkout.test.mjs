import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { selectPreview, selectStable } from '../checkout.mjs';

async function history(t) {
  const directory = await mkdtemp(join(tmpdir(), 'site-checkout-'));
  t.after(() => rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-b', 'main');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'user.name', 'Fixture');
  git('commit', '--allow-empty', '-m', 'published');
  const published = git('rev-parse', 'HEAD');
  git('checkout', '-b', 'candidate');
  git('commit', '--allow-empty', '-m', 'candidate');
  const head = git('rev-parse', 'HEAD');
  git('checkout', 'main');
  git('commit', '--allow-empty', '-m', 'main advanced independently');
  const main = git('rev-parse', 'HEAD');
  git('checkout', '-b', 'event-merge');
  git('merge', '--no-ff', 'candidate', '-m', 'event merge');
  const controller = git('rev-parse', 'HEAD');
  return { directory, git, main, published, head, controller };
}

test('PR preview selects only the exact event merge parent; non-PR runs keep the controller', async t => {
  const f = await history(t);
  for (const eventName of ['push', 'workflow_run', 'workflow_dispatch']) {
    assert.equal(selectPreview({ ...f, eventName }), f.controller);
    assert.equal(f.git('rev-parse', 'HEAD'), f.controller);
  }
  assert.throws(() => selectPreview({ ...f, eventName: 'pull_request', head: f.main }), /merge parent/);
  assert.throws(() => selectPreview({ ...f, controller: f.main, eventName: 'pull_request' }), /checkout changed/);
  assert.equal(selectPreview({ ...f, eventName: 'pull_request' }), f.head);
  assert.equal(f.git('rev-parse', 'HEAD'), f.head);
});

test('stable tooling accepts observed main or its ancestor and rejects PR, future and malformed revisions', async t => {
  const f = await history(t);
  f.git('checkout', '--detach', f.main);
  for (const selected of [f.head, f.controller, '--help', 'a'.repeat(40)]) {
    assert.throws(() => selectStable({ ...f, selected }));
    assert.equal(f.git('rev-parse', 'HEAD'), f.main, 'Rejection must not change checkout');
  }
  assert.equal(selectStable({ ...f, selected: f.main }), f.main);
  assert.equal(selectStable({ ...f, selected: f.published }), f.published);
  assert.equal(f.git('rev-parse', 'HEAD'), f.published);
  assert.throws(() => selectStable({ ...f, selected: f.published }), /Main advanced/);
});
