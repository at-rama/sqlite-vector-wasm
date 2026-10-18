import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, regularBytes, hash, validatePackagedBuild, documentInputs, engineIdentity, noticeInputs, manifest, packageMetadata, inspectArchive } from '../package/package.mjs';
import { production, command } from '../acceptance/run.mjs';
import { vectorLock, recordedSelection, assertSelected, assertSelectionEvidence, assertApplicable } from '../acceptance/contracts.mjs';
import { engineKey, calculate } from './policy.mjs';
import { publicationIdentity, npmState, download, sha256 } from './state.mjs';

const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const json = async path => JSON.parse(await regularBytes(path));

export async function acceptedPayload({ bundle, identity, commit, repository = root }) {
  const [report, packaged, build] = await Promise.all(['acceptance.json','package.json','build.json'].map(name => json(join(bundle, name))));
  const archivePath = join(bundle, 'payload.tgz');
  const bytes = await regularBytes(archivePath);
  const archive = { size: bytes.length, sha256: hash(bytes) };
  assertApplicable(report, commit, archive);
  assert.deepEqual(report.package, { name: identity.name, version: identity.version }, 'Acceptance package identity');
  assert.deepEqual(packaged.package, report.package, 'Package/acceptance identity');
  assert.deepEqual({ size: packaged.archive.size, sha256: packaged.archive.sha256 }, archive);
  assert.equal(packaged.buildHandoffSha256, hash(jsonBytes(build)), 'Consumed build handoff identity');
  const composition = manifest(build);
  assert.deepEqual(packaged.inputs, composition.inputs, 'Packaged component identities');
  assert.deepEqual(packaged.lockDigest, composition.lockDigest, 'Packaged lock identity');
  for (const key of ['engine', 'sourceLockPath', 'sourceOrigins']) {
    if (key in packaged) assert.deepEqual(packaged[key], composition[key], `Packaged ${key} identity`);
  }
  const sourceLockPath = build.sourceLockPath || 'inputs/sources.lock.json';
  assert.ok(['inputs/sources.lock.json', 'inputs/sqlite-vector.sources.lock.json'].includes(sourceLockPath), 'Unsupported source lock');
  const lockBytes = await regularBytes(join(repository, sourceLockPath));
  const sourceLock = JSON.parse(lockBytes);
  assert.equal(report.sourceLockSha256, hash(lockBytes), 'Acceptance source lock identity mismatch'); assert.deepEqual(report.sourceLock, sourceLock);
  const inspection = await mkdtemp(join(bundle, 'release-inspect-'));
  const extracted = join(inspection, 'extracted');
  await inspectArchive(archivePath, packaged.files, extracted);
  const documents = await documentInputs(build, repository);
  for (const [path, data] of documents) {
    assert.equal(hash(await regularBytes(join(extracted, path))), hash(data), `Published ${path} differs from selected source revision`);
  }
  // The retained archive is the downstream input; original build directories may be gone.
  const runtime = await validatePackagedBuild({ ...build, runtimeDirectory: extracted }, repository);
  const contents = await noticeInputs(build, repository);
  for (const item of runtime) contents.set(...item);
  for (const entry of documents) contents.set(...entry);
  contents.set('runtime.json', jsonBytes(manifest(build)));
  const names = [...contents.keys(), 'package.json'].sort();
  contents.set('package.json', jsonBytes(packageMetadata(identity.name, identity.version, names, engineIdentity(build))));
  const expected = [...contents].map(([name, data]) => ({ name, size: data.length, sha256: hash(data) }));
  assert.deepEqual([...packaged.files].sort((a,b) => a.name.localeCompare(b.name)), [...expected].sort((a,b) => a.name.localeCompare(b.name)), 'Package inventory/notices/runtime/metadata mismatch');
  assert.deepEqual(packaged.runtimeFiles, build.runtimeFiles); assert.deepEqual(report.runtimeFiles, build.runtimeFiles);
  assert.deepEqual(report.build, build.build); assert.deepEqual(packaged.build, build.build);
  assert.equal(hash(await regularBytes(archivePath)), archive.sha256, 'Archive changed during release inspection');
  return { report, packaged, build, sourceLock, archive, archivePath };
}

export function bindSelection(context, accepted, { product = false } = {}) {
  const key = engineKey(context.selection);
  if (product) assert.equal(key, 'sqliteVector', 'New product publication requires SQLite-Vector');
  assert.equal(accepted.sourceLock[key]?.version, context.selection[key], 'Context engine/version mismatch');
  assert.equal(accepted.sourceLock.sqlite.version, context.selection.sqlite, 'Context SQLite version mismatch');
  assert.deepEqual(engineIdentity(accepted.build), {key,upstream:key === 'sqliteVec' ? 'asg017/sqlite-vec' : 'sqliteai/sqlite-vector',version:context.selection[key]}, 'Context/build engine mismatch');
  if (key === 'sqliteVector') {
    const selection = recordedSelection(jsonBytes(accepted.sourceLock), vectorLock);
    // Preserve the digest of actual lock bytes, including their formatting.
    selection.sourceLockSha256 = accepted.report.sourceLockSha256;
    assertSelected(accepted.build, selection, true);
    assertSelected(accepted.packaged, selection);
    assertSelectionEvidence(accepted.report, selection);
    assertSelectionEvidence(accepted.report.browserResults, selection);
  }
}

export function provenance(context, identity, accepted) {
  bindSelection(context, accepted);
  const evidence = { schemaVersion: 1, ...identity, commit: context.commit, repository: context.repository,
    upstreams: { ...context.selection }, ...(engineKey(context.selection) === 'sqliteVector' ? {engine:engineIdentity(accepted.build)} : {}), sourceLock: accepted.sourceLock,
    sourceLockSha256: accepted.report.sourceLockSha256, build: accepted.build.build,
    runtimeFiles: accepted.build.runtimeFiles, archive: accepted.archive,
    acceptance: { verdict: accepted.report.verdict, source: accepted.report.source, stages: accepted.report.stages,
      browser: accepted.report.browserResults.browser, hosting: accepted.report.browserResults.hosting,
      reportSha256: hash(jsonBytes(accepted.report)) },
    invocation: { pullRequest: context.pullRequest || null, preparation: context.preparation || null, comment: context.comment } };
  publicationIdentity(evidence);
  const key = engineKey(context.selection), label = key === 'sqliteVector' ? 'SQLite-Vector' : 'sqlite-vec';
  const breaking = identity.transition ? '\nBREAKING CHANGE: SQLite-Vector replaces sqlite-vec. Adapt native vector SQL using vec0/vec_* to SQLite-Vector SQL. Official SQLite JavaScript APIs remain; vector SQL is not interchangeable. No automatic database migration or compatibility of existing vector structures is established.\n' : '';
  const notes = `${identity.name} ${identity.version} (${identity.channel})\n\nCommit: ${context.commit}\nSQLite: ${context.selection.sqlite}\n${label}: ${context.selection[key]}\nArchive SHA-256: ${accepted.archive.sha256}\n${breaking}${context.comment ? `\n${context.comment}\n` : ''}`;
  return { evidence, notes };
}

export async function qualify({ context, readSnapshot, produce = production, verify = acceptedPayload, repository = root, run = command }) {
  assert.equal(await run('git', ['rev-parse','HEAD'], { cwd: repository }), context.commit, 'Wrong authoritative checkout');
  assert.equal(await run('git', ['status','--porcelain','--untracked-files=all'], { cwd: repository }), '', 'Dirty release checkout');
  await run('sh', ['tools/check-repository.sh'], { cwd: repository });
  const identity = calculate({ selection: context.selection, snapshot: await readSnapshot(), comment: context.comment });
  assert.equal(engineKey(context.selection), 'sqliteVector', 'New product publication requires SQLite-Vector');
  const result = await produce({ repository, lockPath: vectorLock, metadata: { name: identity.name, version: identity.version } });
  const accepted = await verify({ bundle: result.bundle, identity, commit: context.commit, repository });
  bindSelection(context, accepted, {product:true});
  const { evidence, notes } = provenance(context, identity, accepted);
  const parent = join(repository, '.work/release'); await mkdir(parent, { recursive: true });
  const directory = await mkdtemp(join(parent, 'run-'));
  const evidencePath = join(directory, 'publication.json'); await writeFile(evidencePath, jsonBytes(evidence));
  const handoff = { schemaVersion: 1, context, identity, bundle: result.bundle, evidencePath, directory, archivePath: accepted.archivePath, notes };
  const path = join(directory, 'handoff.json'); await writeFile(path, jsonBytes(handoff));
  return { ...handoff, path };
}

export function attestSubject(bundle, evidence) {
  assert.ok(bundle?.verificationMaterial && bundle.dsseEnvelope?.signatures?.length, 'Missing signed attestation bundle');
  const statement = JSON.parse(Buffer.from(bundle.dsseEnvelope.payload, 'base64').toString('utf8'));
  assert.equal(statement.predicateType, 'https://slsa.dev/provenance/v1');
  assert.equal(statement.subject?.length, 1);
  assert.equal(statement.subject[0].digest?.sha256, evidence.archive.sha256, 'Attested archive differs');
  assert.ok(statement.predicate?.buildDefinition?.resolvedDependencies?.some(dependency => dependency.digest?.gitCommit === evidence.commit), 'Attestation source revision mismatch');
  return statement;
}

export async function publish({ handoff, readSnapshot, services, attestation, repository = root, verify = acceptedPayload }) {
  const outcomes = [];
  const outcomePath = join(handoff.directory, 'outcome.json');
  const save = value => writeFile(outcomePath, jsonBytes({ ...value, outcomes }));
  const step = async (operation, action) => {
    try { const result = await action(); outcomes.push({ operation, status:result?.status === 'verification-pending' ? 'pending' : 'succeeded', result }); await save({ status:'in-progress' }); return result; }
    catch (error) { outcomes.push({ operation, status:'failed', diagnostic:error.message }); throw error; }
  };
  try {
    const accepted = await verify({ bundle: handoff.bundle, identity: handoff.identity, commit: handoff.context.commit, repository });
    bindSelection(handoff.context, accepted, {product:true});
    const expected = provenance(handoff.context, handoff.identity, accepted);
    assert.deepEqual(await json(handoff.evidencePath), expected.evidence, 'Publication evidence changed');
    assert.equal(handoff.notes, expected.notes); assert.equal(handoff.archivePath, accepted.archivePath);
    const snapshot = await readSnapshot();
    assert.deepEqual(calculate({ selection: handoff.context.selection, snapshot, comment: handoff.context.comment }), handoff.identity, 'Stale publication state/identity');
    const bootstrap = services.initialNpmException === true;
    assert.ok(!bootstrap || handoff.identity.initial && !snapshot.tags.length && !snapshot.npmVersions.length && !snapshot.releaseTags.length, 'Bootstrap exception is initial only');
    await services.assertReady({ bootstrap });
    attestSubject(attestation.bundle, expected.evidence);
    const attestationPath = join(handoff.directory, 'attestation.json'); await writeFile(attestationPath, jsonBytes(attestation.bundle));
    await step('tag', () => services.createTag(handoff.identity.tag, handoff.context.commit));
    const release = await step('draft', () => services.createDraft(handoff.identity, handoff.notes));
    await step('archive', () => services.upload(release, 'payload.tgz', accepted.archivePath));
    await step('provenance', () => services.upload(release, 'publication.json', handoff.evidencePath));
    await step('attestation', () => services.upload(release, 'attestation.json', attestationPath));
    if (!bootstrap) await step('npm', () => services.npmPublish(accepted.archivePath, handoff.identity.channel));
    await step('github', () => services.finalize(release));
    await step('github-identity', () => services.verifyGitHub(release, expected.evidence));
    if (bootstrap) {
      const result = { status:'npm-pending', identity:handoff.identity, release, evidencePath:handoff.evidencePath, archivePath:accepted.archivePath };
      await save(result); return result;
    }
    const verification = await step('npm-identity', () => services.verifyNpm(expected.evidence));
    assert.ok(['verified','verification-pending'].includes(verification?.status), 'Unexpected npm verification verdict');
    if (verification.status === 'verification-pending') {
      const result = { status:'published-verification-pending', identity:handoff.identity, release, verification };
      await save(result); return result;
    }
    const result = { status:'complete', identity:handoff.identity, release }; await save(result); return result;
  } catch (error) {
    await save({ status:'failed', diagnostic:error.message }); error.message += `; per-operation evidence: ${outcomePath}`; throw error;
  }
}

export async function checkInitialCompletion({ evidence, get, verifyGitHub }) {
  publicationIdentity(evidence);
  assert.ok(evidence.initial && evidence.version === '0.1.0' && evidence.channel === 'latest', 'Completion check is bounded to selected initial publication');
  await verifyGitHub(evidence);
  const npm = await npmState(get);
  if (!npm.versions[evidence.version]) return { status:'npm-pending', version:evidence.version };
  assert.equal(npm['dist-tags'].latest, evidence.version, 'Initial npm channel mismatch');
  const bytes = await download(npm.versions[evidence.version].dist.tarball, get);
  assert.equal(bytes.length, evidence.archive.size); assert.equal(sha256(bytes), evidence.archive.sha256, 'Initial npm archive mismatch');
  return { status:'complete', version:evidence.version };
}
