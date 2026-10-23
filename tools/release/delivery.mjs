import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { publicationIdentity } from './state.mjs';

export const deliveryOperations = ['tag', 'draft', 'archive', 'provenance', 'attestation', 'npm'];
const subject = evidence => Object.fromEntries(['repository', 'name', 'version', 'tag', 'channel', 'commit', 'archive'].map(key => [key, evidence[key]]));
const bytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');

// This receipt records completed writes, not independent attestation or public
// availability. The matching Release must subsequently leave draft state.
export function deliveryReceipt(evidence, release, outcomes) {
  publicationIdentity(evidence);
  assert.ok(Number.isSafeInteger(release.id) && release.id > 0, 'Invalid receipt Release');
  assert.deepEqual(outcomes.map(o => o.operation), deliveryOperations, 'Incomplete delivery operations');
  for (const operation of outcomes) assert.equal(operation.status, 'succeeded', 'Incomplete delivery operation');
  return { schemaVersion: 1, subject: subject(evidence), releaseId: release.id,
    publicationSha256: createHash('sha256').update(bytes(evidence)).digest('hex'),
    operations: structuredClone(outcomes) };
}

export function assertDelivered(receipt, release, evidence, publicationBytes = bytes(evidence)) {
  publicationIdentity(evidence);
  assert.equal(receipt?.schemaVersion, 1, 'Unsupported delivery receipt');
  assert.deepEqual(receipt.subject, subject(evidence), 'Delivery subject mismatch');
  assert.equal(receipt.releaseId, release.id, 'Delivery Release mismatch');
  assert.ok(Buffer.isBuffer(publicationBytes), 'Missing publication bytes');
  assert.deepEqual(JSON.parse(publicationBytes.toString('utf8')), evidence, 'Delivery manifest contents mismatch');
  assert.equal(receipt.publicationSha256, createHash('sha256').update(publicationBytes).digest('hex'), 'Delivery manifest mismatch');
  assert.equal(release.tag_name, evidence.tag, 'Delivery tag mismatch');
  assert.equal(release.draft, false, 'Delivery Release is not finalized');
  assert.equal(release.prerelease, evidence.channel === 'next', 'Delivery channel mismatch');
  assert.deepEqual(receipt.operations?.map(o => o.operation), deliveryOperations, 'Incomplete delivery operations');
  for (const operation of receipt.operations) assert.equal(operation.status, 'succeeded', 'Incomplete delivery operation');
  for (const name of ['payload.tgz', 'publication.json', 'attestation.json', 'delivery.json']) {
    const assets = release.assets?.filter(a => a.name === name);
    assert.equal(assets?.length, 1, `Missing or ambiguous delivery asset: ${name}`);
    assert.equal(assets[0].state, 'uploaded', 'Incomplete delivery asset');
  }
  return { status: 'complete', publication: evidence, completion: 'completed-platform-operations' };
}
