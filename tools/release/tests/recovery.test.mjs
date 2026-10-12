import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root } from '../../package/package.mjs';
import { syntheticAttestation } from './fixture.mjs';
import { sha256 } from '../state.mjs';
import { recover011, recovery011, validateRecovery011 } from '../recover-011.mjs';

async function fixture() {
  const lockBytes = await readFile(join(root, 'inputs/sources.lock.json'));
  const descriptor = JSON.parse(await readFile(join(root, 'inputs/release.json')));
  const archive = Buffer.from('synthetic archive for recovery preflight only');
  const target = { ...recovery011, sha256: sha256(archive), size: archive.length };
  const evidence = {
    schemaVersion: 1, name: '@at-rama/sqlite-vector-wasm', version: target.version,
    tag: target.tag, channel: 'latest', commit: target.commit, repository: target.repository,
    upstreams: { sqlite: descriptor.sqlite, sqliteVec: descriptor.sqliteVec },
    sourceLock: JSON.parse(lockBytes), sourceLockSha256: sha256(lockBytes),
    build: { tools: { node: 'synthetic' } }, acceptance: { verdict: 'passed' },
    archive: { size: archive.length, sha256: sha256(archive) },
    invocation: { pullRequest: target.pullRequest, preparation: { runId: target.preparationRun },
      comment: descriptor.releaseComment },
  };
  const release = {
    id: target.releaseId, tag_name: target.tag, draft: true, prerelease: false,
    assets: ['payload.tgz', 'publication.json', 'attestation.json'].map((name, i) => ({
      name, url: 'https://api.github.com/repos/' + target.repository + '/releases/assets/' + (i + 1),
    })),
  };
  const tagRef = { ref: 'refs/tags/' + target.tag, object: { type: 'commit', sha: target.commit } };
  const snapshot = {
    schemaVersion: 1, tags: ['dist/v0.1.0', target.tag],
    releaseTags: ['dist/v0.1.0', target.tag], npmVersions: ['0.1.0'],
    heads: { latest: { version: '0.1.0' }, next: null },
  };
  const attestation = syntheticAttestation(evidence);
  return { target, archive, evidence, release, tagRef, snapshot, lockBytes, descriptor, attestation };
}

test('one-off recovery accepts exactly the original integrated, qualified and unpublished state', async () => {
  const f = await fixture();
  assert.equal(validateRecovery011(f).release, f.release);
  const tampering = [
    value => { value.release = { ...value.release, draft: false }; },
    value => { value.release = { ...value.release, assets: value.release.assets.slice(0, 2) }; },
    value => { value.release = { ...value.release, assets: [...value.release.assets, value.release.assets[0]] }; },
    value => { value.snapshot = { ...value.snapshot, npmVersions: ['0.1.0', '0.1.1'] }; },
    value => { value.snapshot = { ...value.snapshot, heads: { latest: { version: '0.1.1' } } }; },
    value => { value.tagRef = { ...value.tagRef, object: { type: 'commit', sha: 'a'.repeat(40) } }; },
    value => { value.archive = Buffer.from('different archive'); },
    value => { value.lockBytes = Buffer.from('{}'); },
    value => { value.evidence = { ...value.evidence, commit: 'b'.repeat(40) }; },
    value => { value.evidence = { ...value.evidence, invocation: { pullRequest: 39 } }; },
    value => { value.attestation = { ...value.attestation, dsseEnvelope: {
      ...value.attestation.dsseEnvelope, payload: Buffer.from('{}').toString('base64') } }; },
  ];
  for (const change of tampering) {
    const input = { ...f };
    change(input);
    assert.throws(() => validateRecovery011(input), 'Tampering must not authorize recovery');
  }
});

test('recovery uses only old signed archive, trusted npm publication and existing draft finalization', async t => {
  const f = await fixture();
  const directory = await mkdtemp(join(tmpdir(), 'release-recover-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'inputs'), { recursive: true });
  await mkdir(join(directory, '.work/release'), { recursive: true });
  await writeFile(join(directory, 'inputs/sources.lock.json'), f.lockBytes);
  await writeFile(join(directory, 'inputs/release.json'), JSON.stringify(f.descriptor));
  const api = 'https://api.github.com/repos/' + f.target.repository + '/';
  const values = Object.fromEntries([
    [api + 'releases/' + f.target.releaseId, f.release],
    [api + 'git/ref/tags/' + f.target.tag, f.tagRef],
    [f.release.assets[0].url, f.archive],
    [f.release.assets[1].url, Buffer.from(JSON.stringify(f.evidence))],
    [f.release.assets[2].url, Buffer.from(JSON.stringify(f.attestation))],
  ]);
  const get = async url => ({ status: 200, data: values[url] });
  const calls = [];
  const services = {
    assertReady: async opts => { calls.push('ready'); assert.equal(opts.bootstrap, false); },
    npmPublish: async (path, channel) => {
      calls.push('npm');
      assert.equal(channel, 'latest');
      assert.deepEqual(await readFile(path), f.archive);
    },
    finalize: async release => { calls.push('finalize'); assert.equal(release, f.release); },
    verifyGitHub: async (_release, evidence) => { calls.push('github-identity'); assert.deepEqual(evidence, f.evidence); },
    verifyNpm: async evidence => { calls.push('npm-identity'); assert.deepEqual(evidence, f.evidence); },
  };
  const run = async (cmd, args) => {
    assert.equal(cmd, 'gh'); assert.deepEqual(args.slice(0, 2), ['attestation', 'verify']);
    calls.push('signed-attestation');
  };
  const result = await recover011({ get, services, repository: directory, target: f.target,
    snapshot: async () => f.snapshot, run });
  assert.equal(result.status, 'complete');
  assert.deepEqual(calls, ['signed-attestation', 'ready', 'npm', 'finalize', 'github-identity', 'npm-identity']);

  // Collisions and altered draft state must be rejected before ANY effect.
  calls.length = 0;
  await assert.rejects(recover011({ get, services, repository: directory, target: f.target,
    snapshot: async () => ({ ...f.snapshot, npmVersions: ['0.1.0', '0.1.1'] }), run }));
  assert.deepEqual(calls, []);
});

test('npm failure retains bounded operations without finalizing GitHub', async t => {
  const f = await fixture();
  const directory = await mkdtemp(join(tmpdir(), 'release-recover-failure-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'inputs'), { recursive: true });
  await mkdir(join(directory, '.work/release'), { recursive: true });
  await writeFile(join(directory, 'inputs/sources.lock.json'), f.lockBytes);
  await writeFile(join(directory, 'inputs/release.json'), JSON.stringify(f.descriptor));
  const api = 'https://api.github.com/repos/' + f.target.repository + '/';
  const assets = [f.archive, Buffer.from(JSON.stringify(f.evidence)), Buffer.from(JSON.stringify(f.attestation))];
  const get = async url => ({ status: 200, data: url.endsWith('/' + f.target.releaseId) ? f.release :
    url.endsWith('/tags/' + f.target.tag) ? f.tagRef :
    assets.find((_, i) => url === f.release.assets[i].url) === undefined ? null :
    assets[f.release.assets.findIndex(a => a.url === url)] });
  let finalized = false;
  await assert.rejects(recover011({ get, repository: directory, target: f.target,
    snapshot: async () => f.snapshot, run: async () => '',
    services: { assertReady: async () => {}, npmPublish: async () => { throw Error('npm unavailable'); },
      finalize: async () => { finalized = true; } } }), /npm unavailable/);
  assert.equal(finalized, false);
  const entries = (await readdir(join(directory, '.work/release'))).filter(name => name.startsWith('recover-'));
  assert.equal(entries.length, 1);
  const outcome = JSON.parse(await readFile(join(directory, '.work/release', entries[0], 'outcome.json')));
  assert.equal(outcome.status, 'failed');
  assert.ok(outcome.outcomes.some(x => x.operation === 'npm' && x.status === 'failed'));
});
