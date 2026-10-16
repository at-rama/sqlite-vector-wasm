const tokens = text => [...new Set(text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])];

export function descriptionWords(descriptions) {
  return ' ' + tokens(descriptions.join(' ')).join(' ');
}

export function textSearch(text) {
  const terms = tokens(text);
  const where = terms.length ? terms.map(() => 'instr(words, ?) > 0').join(' AND ') : (text.trim() ? '0' : '1');
  return { sql: `SELECT id FROM emojis WHERE ${where} ORDER BY id`, parameters: terms.map(term => ' ' + term) };
}

export function initialEmojiId(catalogue) {
  const matches = catalogue.filter(row => row.emoji === '🐱');
  if (matches.length !== 1) throw Error('The emoji catalogue must contain exactly one 🐱 starting emoji.');
  return matches[0].id;
}
