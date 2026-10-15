import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assemble, hasSite, assertCurrent, publicationContext } from '../publication.mjs';
import { previewIdentity } from '../options.mjs';

const main = 'a'.repeat(40), head = 'b'.repeat(40), repository = 'at-rama/sqlite-vector-wasm';
const preview = { branch: 'feature/site', commit: head };
const context = { mode: 'preview', repository, mainCommit: main, pullRequest: 57, preview };

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'site-publication-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const stableRoot = join(root, 'stable'), candidateRoot = join(root, 'candidate'), output = join(root, 'pages');
  async function built(directory, marker, identity = null) {
    for (const path of ['site/index.md', 'site/.vitepress/config.mts', 'tools/site.sh', 'tools/site/package-lock.json']) {
      await mkdir(join(directory, path, '..'), { recursive: true });
      await writeFile(join(directory, path), marker);
    }
    for (const page of ['', 'usage/', 'demo/']) {
      await mkdir(join(directory, '.work/site/dist', page), { recursive: true });
      await writeFile(join(directory, '.work/site/dist', page, 'index.html'), marker);
    }
    await writeFile(join(directory, '.work/site/build.json'), JSON.stringify({ preview: identity, runtime: null }));
  }
  await built(stableRoot, 'stable');
  await built(candidateRoot, 'candidate', preview);
  return { stableRoot, candidateRoot, output, built };
}

test('internal PR publication is distinct from fork, restricted-token and manual non-main checks', () => {
  const event = { number: 57, pull_request: { state: 'open', head: { ref: preview.branch, sha: head, repo: { full_name: repository } } } };
  const input = { eventName: 'pull_request', event, ref: 'refs/pull/57/merge', sha: 'c'.repeat(40), repository, actor: 'jpbourgeon' };
  const { mainCommit, ...expected } = context;
  assert.deepEqual(publicationContext(input), expected);
});

test('forks and Dependabot cannot publish; manual publication requires main', () => {
  const event = { number: 57, pull_request: { state: 'open', head: { ...preview, ref: preview.branch, sha: head, repo: { full_name: 'other/fork' } } } };
  const input = { eventName: 'pull_request', event, sha: head, repository, actor: 'someone' };
  assert.equal(publicationContext(input), null);
  event.pull_request.head.repo.full_name = repository;
  assert.equal(publicationContext({ ...input, actor: 'dependabot[bot]' }), null);
  assert.equal(publicationContext({ ...input, eventName: 'workflow_dispatch', ref: 'refs/heads/feature' }), null);
  assert.equal(publicationContext({ ...input, eventName: 'workflow_dispatch', ref: 'refs/heads/main' }).mode, 'stable');
  assert.throws(() => previewIdentity('feature', 'short'), /full lowercase/);
});

test('assembly keeps independent stable/candidate bytes and main removes prior preview', async t => {
  const f = await fixture(t);
  const result = await assemble({ ...f, context });
  assert.equal(result.stablePresent, true);
  assert.equal(await readFile(join(f.output, 'index.html'), 'utf8'), 'stable');
  assert.equal(await readFile(join(f.output, 'preview/index.html'), 'utf8'), 'candidate');
  await assemble({ ...f, context: { mode: 'stable', repository, mainCommit: main, preview: null } });
  await assert.rejects(readFile(join(f.output, 'preview/index.html')), { code: 'ENOENT' });
});

test('bootstrap is allowed only for genuinely absent stable sources; partial or broken builds fail closed', async t => {
  const f = await fixture(t);
  await rm(f.stableRoot, { recursive: true });
  assert.equal(await hasSite(f.stableRoot), false);
  assert.equal((await assemble({ ...f, context })).stablePresent, false);
  await assert.rejects(readFile(join(f.output, 'index.html')), { code: 'ENOENT' });
  await f.built(f.stableRoot, 'stable');
  await rm(join(f.stableRoot, '.work/site/dist/usage/index.html'));
  await assert.rejects(assemble({ ...f, context }), /Missing built page/);
  await assert.rejects(readFile(join(f.output, 'preview/index.html')), { code: 'ENOENT' });
  await rm(join(f.stableRoot, 'tools/site.sh'));
  await assert.rejects(hasSite(f.stableRoot), /Incomplete stable/);
});

test('wrong candidate metadata and altered supplied runtime block complete publication', async t => {
  const f = await fixture(t);
  await writeFile(join(f.candidateRoot, '.work/site/build.json'), JSON.stringify({ preview: { ...preview, commit: main } }));
  await assert.rejects(assemble({ ...f, context }), /identity mismatch/);
  await f.built(f.candidateRoot, 'candidate', preview);
  await writeFile(join(f.stableRoot, '.work/site/dist/asset.js'), 'wrong bytes');
  await writeFile(join(f.stableRoot, '.work/site/build.json'), JSON.stringify({ runtime: { 'public/asset.js': '0'.repeat(64) } }));
  await assert.rejects(assemble({ ...f, context }), /Runtime changed/);
});

test('delayed runs reject advanced main, superseded PR heads and closed PRs without publication', async () => {
  let mainSha = main, state = 'open', prSha = head;
  const get = async path => path.endsWith('/main') ? { sha: mainSha } :
    { state, head: { ref: preview.branch, sha: prSha, repo: { full_name: repository } } };
  const published = [];
  async function publish(record) { await assertCurrent(record, get); published.push(record.mainCommit); }
  await publish(context);
  mainSha = 'c'.repeat(40);
  await publish({ ...context, mainCommit: mainSha });
  await assert.rejects(publish(context), /baseline advanced/);
  prSha = 'd'.repeat(40);
  await assert.rejects(publish({ ...context, mainCommit: mainSha }), /superseded/);
  prSha = head; state = 'closed';
  await assert.rejects(publish({ ...context, mainCommit: mainSha }), /closed/);
  await assert.rejects(publish({ ...context, mode: 'stable' }), /baseline advanced/);
  assert.deepEqual(published, [main, mainSha]);
  await assert.rejects(assertCurrent(context, async () => { throw Error('Unavailable'); }), /Unavailable/);
});
