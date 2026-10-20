import test from 'node:test';
import assert from 'node:assert/strict';
import { checkNeighbors } from '../demo-reference.mjs';
test('membership check accepts arbitrary boundary ties and rejects farther, self, repeated or missing closer rows', () => {
  const reference = { id: 0, binary: [0, 1, 2, 3, 4, 5, 5, 5, 6] };
  const result = { id: 0, mode: 'binary', rows: [1, 2, 3, 4, 7, 5].map(id => ({ id, distance: reference.binary[id] })) };
  assert.equal(checkNeighbors(result, reference).boundaryTies, 3);
  for (const ids of [[1,2,3,4,5,8], [0,1,2,3,4,5], [1,2,3,4,5,5], [2,3,4,5,6,7]]) {
    assert.throws(() => checkNeighbors({ ...result, rows: ids.map(id => ({ id, distance: reference.binary[id] })) }, reference));
  }
});
