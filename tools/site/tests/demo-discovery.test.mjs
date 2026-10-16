import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { descriptionWords, textSearch, initialEmojiId } from '../../../site/demo/discovery.mjs';

test('SQLite matches word beginnings across descriptions with all terms, never internal substrings or SQL syntax', () => {
  const catalogue = [
    { id: 0, label: 'unrelated title', words: ['cat face', 'kitten'] },
    { id: 1, label: 'flag', words: ['regional indicator'] },
    { id: 2, label: 'animal', words: ['cats', 'face'] },
    { id: 3, label: 'note', words: ['music', 'musical note'] },
    { id: 4, label: 'vehicle', words: ['car'] }
  ];
  const cases = [
    ['cat', [0, 2]], ['CAT', [0, 2]], ['cat fac', [0, 2]], ['fac cat', [0, 2]],
    ['  CAT, fac! cat ', [0, 2]], ['kit', [0]], ['mus', [3]], ['music', [3]],
    ['sic', []], ['mus cat', []], ['', [0, 1, 2, 3, 4]], [' \t ', [0, 1, 2, 3, 4]],
    ['%', []], ['_', []], ['\\', []], ["' OR 1=1 --", []], ['zz-no-such-emoji', []]
  ];
  // Literal memberships are independent expectations; execute production SQL in SQLite.
  const input = { rows: catalogue.map(row => [row.id, descriptionWords(row.words)]), queries: cases.map(([text]) => textSearch(text)) };
  const actual = JSON.parse(execFileSync('python3', ['-c', `import sys,json,sqlite3
x=json.load(sys.stdin); db=sqlite3.connect(':memory:'); db.execute('CREATE TABLE emojis(id INTEGER, words TEXT)')
db.executemany('INSERT INTO emojis VALUES (?,?)',x['rows'])
print(json.dumps([[r[0] for r in db.execute(q['sql'],q['parameters'])] for q in x['queries']]))`], { input: JSON.stringify(input), encoding: 'utf8' }));
  assert.deepEqual(actual, cases.map(([, expected]) => expected));
});

test('the starting emoji follows Unicode identity through reordering and rejects missing or duplicate identities', () => {
  const cat = { id: 773, emoji: '🐱' }, flag = { id: 0, emoji: '🇸🇮' };
  assert.equal(initialEmojiId([flag, cat]), 773);
  assert.equal(initialEmojiId([cat, flag]), 773);
  assert.throws(() => initialEmojiId([flag]), /exactly one/);
  assert.throws(() => initialEmojiId([cat, { id: 4, emoji: '🐱' }]), /exactly one/);
});
