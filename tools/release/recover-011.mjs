import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { attestSubject } from './run.mjs';
import { download, publicationIdentity, readState, sha256 } from './state.mjs';

// Single incident response for the partially created distribution in run 38210271292.
// No generic retry, new candidate, new tag, version override or artifact replacement.
export const recovery011 = Object.freeze({
  repository: 'at-rama/sqlite-vector-wasm',
  releaseId: 410238424,
  tag: 'dist/v0.1.1',
  version: '0.1.1',
  commit: '58f8f662c25466dc2b1bfed8de6a6f6b690d336a',
  pullRequest: 41,
  preparationRun: 38209533993,
  sha256: '29fa8a2c59f07b92ddc6b886f2b698b6542e0e36a007c54c9279f5a11b0c0c2b',
  size: 1149568,
});

export function validateRecovery011({ snapshot, release, tagRef, evidence, archive, attestation, lockBytes, descriptor, target = recovery011 }) {
  assert.equal(release.id, target.releaseId, 'Wrong recovery Release');
  assert.equal(release.tag_name, target.tag);
  assert.equal(release.draft, true, 'Recovery requires the original draft Release');
  assert.equal(release.prerelease, false, 'Unexpected experimental Release');
  assert.deepEqual(release.assets.map(asset => asset.name).sort(),
    ['attestation.json', 'payload.tgz', 'publication.json'], 'Missing or unexpected Release assets');
  assert.equal(tagRef.ref, 'refs/tags/' + target.tag);
  assert.equal(tagRef.object?.type, 'commit');
  assert.equal(tagRef.object?.sha, target.commit, 'Original integrated tag moved');

  assert.ok(snapshot.tags.includes(target.tag) && snapshot.releaseTags.includes(target.tag), 'Original partial identity is absent');
  assert.ok(!snapshot.npmVersions.includes(target.version), 'npm version already exists; never republish');
  assert.equal(snapshot.heads.latest?.version, '0.1.0', 'Stable publication state moved');

  publicationIdentity(evidence);
  assert.equal(evidence.repository, target.repository);
  assert.equal(evidence.version, target.version);
  assert.equal(evidence.tag, target.tag);
  assert.equal(evidence.channel, 'latest');
  assert.equal(evidence.commit, target.commit);
  assert.equal(evidence.invocation?.pullRequest, target.pullRequest);
  assert.equal(evidence.invocation?.preparation?.runId, target.preparationRun);
  assert.equal(descriptor?.preparation?.runId, target.preparationRun);
  assert.equal(evidence.invocation?.comment, descriptor.releaseComment);
  assert.equal(evidence.upstreams.sqlite, descriptor.sqlite);
  assert.equal(evidence.upstreams.sqliteVec, descriptor.sqliteVec);
  assert.equal(evidence.archive.sha256, target.sha256);
  assert.equal(evidence.archive.size, target.size);
  assert.equal(archive.length, target.size);
  assert.equal(sha256(archive), target.sha256, 'Original archive was modified');
  assert.equal(sha256(lockBytes), evidence.sourceLockSha256, 'Source lock changed since qualification');
  assert.deepEqual(JSON.parse(lockBytes.toString('utf8')), evidence.sourceLock);
  attestSubject(attestation, evidence);
  return { release, evidence };
}

export async function recover011({ get, services, repository = root, target = recovery011,
  snapshot = () => readState({ repository: target.repository, get }), run = command } = {}) {
  const api = 'https://api.github.com/repos/' + target.repository + '/';
  const request = async path => {
    const response = await get(api + path);
    assert.equal(response.status, 200, 'Recovery GitHub state unavailable: ' + path);
    return response.data;
  };
  const release = await request('releases/' + target.releaseId);
  const tagRef = await request('git/ref/tags/' + target.tag);
  const assets = {};
  for (const asset of release.assets || []) {
    if (['payload.tgz', 'publication.json', 'attestation.json'].includes(asset.name)) {
      assert.ok(!assets[asset.name], 'Duplicate Release asset: ' + asset.name);
      assets[asset.name] = await download(asset.url, get);
    }
  }
  assert.ok(assets['payload.tgz'] && assets['publication.json'] && assets['attestation.json'],
    'Incomplete original Release');
  const lockBytes = await readFile(join(repository, 'inputs/sources.lock.json'));
  const descriptor = JSON.parse(await readFile(join(repository, 'inputs/release.json'), 'utf8'));
  const { evidence } = validateRecovery011({
    snapshot: await snapshot(), release, tagRef,
    evidence: JSON.parse(assets['publication.json'].toString('utf8')),
    archive: assets['payload.tgz'],
    attestation: JSON.parse(assets['attestation.json'].toString('utf8')),
    lockBytes, descriptor, target,
  });

  const directory = await mkdtemp(join(repository, '.work/release/recover-'));
  const archivePath = join(directory, 'payload.tgz');
  const outcomePath = join(directory, 'outcome.json');
  const outcomes = [];
  const save = async (status, diagnostic) => writeFile(outcomePath,
    JSON.stringify({ status, target: target.tag, diagnostic, outcomes }, null, 2) + '\n');
  const step = async (name, fn) => {
    try {
      const result = await fn();
      outcomes.push({ operation: name, status: 'succeeded' });
      await save('in-progress');
      return result;
    } catch (error) {
      outcomes.push({ operation: name, status: 'failed', diagnostic: error.message });
      throw error;
    }
  };
  try {
    await writeFile(archivePath, assets['payload.tgz'], { flag: 'wx' });
    // Verify the actual Sigstore-signed GitHub attestation, not only DSSE structure.
    await step('signed-attestation', () => run('gh',
      ['attestation', 'verify', archivePath, '--repo', target.repository], { cwd: repository }));
    await step('publisher-readiness', () => services.assertReady({ bootstrap: false }));
    await step('npm', () => services.npmPublish(archivePath, 'latest'));
    await step('github', () => services.finalize(release));
    await step('github-identity', () => services.verifyGitHub(release, evidence));
    await step('npm-identity', () => services.verifyNpm(evidence));
    await save('complete');
    return { status: 'complete', version: target.version, tag: target.tag, operations: outcomes };
  } catch (error) {
    await save('failed', error.message);
    throw error;
  }
}
