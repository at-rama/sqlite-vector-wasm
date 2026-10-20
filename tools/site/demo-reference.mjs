import assert from 'node:assert/strict';
export const cosineTolerance = 2e-6; // Scalar double reference vs a 300-component Float32 reduction.
export function checkNeighbors(result, reference) {
  const distances = reference[result.mode], tolerance = result.mode === 'binary' ? 0 : cosineTolerance;
  assert.equal(result.id, reference.id); assert.equal(result.rows.length, 6);
  assert.equal(new Set(result.rows.map(r => r.id)).size, 6);
  assert.ok(result.rows.every(r => r.id !== reference.id));
  const sorted = distances.map((distance, id) => ({ id, distance })).filter(r => r.id !== reference.id).sort((a, b) => a.distance - b.distance);
  const boundary = sorted[5].distance, actual = new Set(result.rows.map(r => r.id));
  for (const row of result.rows) {
    assert.ok(Number.isInteger(row.id) && row.id >= 0 && row.id < distances.length);
    assert.ok(Math.abs(row.distance - distances[row.id]) <= tolerance, `Distance mismatch for ${row.id}`);
    assert.ok(distances[row.id] <= boundary + tolerance, 'Returned a farther neighbor');
  }
  for (const row of sorted.filter(r => r.distance < boundary - tolerance)) assert.ok(actual.has(row.id), 'Missing a strictly closer neighbor');
  return { boundary, boundaryTies: sorted.filter(r => Math.abs(r.distance - boundary) <= tolerance).length };
}
