import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { regularBytes, hash, documentMapping } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { documentationSources } from '../site/documentation.mjs';

export const candidateDocumentPaths = [...documentationSources,
  ...documentMapping({ key: 'sqliteVector' }).map(([source]) => source), 'tools/site/docs-example.json'];
export const candidateProfile = { mode: 'candidate', engine: 'sqliteVector', sourceLockPath: 'inputs/sqlite-vector.sources.lock.json' };

export async function documentSnapshot(repository) {
  return Object.fromEntries(await Promise.all(candidateDocumentPaths.map(async path => [path, hash(await regularBytes(join(repository, path)))])));
}

export async function prepareDocumentation({ repository }) {
  // Durable authored sources already describe native Vector usage. Selection
  // and final identity are rendered from the qualified input, never forecast text.
  const path = join(repository, 'tools/site/docs-example.json');
  const bytes = Buffer.from(JSON.stringify(candidateProfile, null, 2) + '\n');
  if (!(await regularBytes(path)).equals(bytes)) await writeFile(path, bytes);
  return documentSnapshot(repository);
}

export function assertDocumentation(evidence, { commit, selection, archive, sourceHashes, identity }) {
  assert.equal(evidence.replayOnly, false, 'Historical documentation replay');
  const c = evidence.context;
  assert.equal(c.mode, 'candidate'); assert.equal(c.engine, 'sqliteVector');
  assert.equal(c.commit, commit, 'Documentation revision mismatch');
  assert.equal(c.qualifiedCommit, commit); assert.equal(c.sourceDirty, false);
  assert.equal(c.version, identity.version, 'Documentation forecast mismatch');
  assert.deepEqual(c.upstreams, selection, 'Documentation composition mismatch');
  assert.deepEqual(c.archive, archive, 'Documentation archive mismatch');
  assert.deepEqual(c.sourceHashes, Object.fromEntries(documentationSources.map(p => [p, sourceHashes[p]])), 'Documentation source mismatch');
  assert.ok(evidence.browser && evidence.unchangedRuntime && evidence.result && evidence.workerResult, 'Missing documentation execution');
  assert.deepEqual(evidence.result, evidence.workerResult);
  assert.equal(evidence.result.sqliteVersion, selection.sqlite);
  assert.equal(evidence.result.engineVersion.replace(/^v/, ''), selection.sqliteVector);
  assert.deepEqual(evidence.result.neighbors.map(row => row[0]), [1, 2]);
}

export async function checkDocumentation({ repository, qualified, directory, run = command }) {
  const report = JSON.parse(await readFile(join(qualified.bundle, 'acceptance.json'), 'utf8'));
  assert.ok(report.toolsDirectory, 'Missing qualified browser tooling');
  const env = { ...process.env, HARNESS_STATE: report.toolsDirectory };
  await run('bash', ['tools/harness.sh', 'exec', 'sh', 'tools/site.sh', 'install'], { cwd: repository, env, log: join(directory, 'documentation-install.log') });
  await run('bash', ['tools/harness.sh', 'exec', 'sh', 'tools/site.sh', 'example', '--candidate-bundle', qualified.bundle],
    { cwd: repository, env, log: join(directory, 'documentation-example.log') });
  const bytes = await regularBytes(join(repository, '.work/docs-example/result.json'));
  await writeFile(join(directory, 'documentation-example.json'), bytes);
  return JSON.parse(bytes);
}
