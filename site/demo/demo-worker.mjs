import { descriptionWords, textSearch } from './discovery.mjs';

let db, catalogue, binary, floats, manifest, runtime, base, floatReady = false;
let queue = Promise.resolve(), controller = new AbortController();
const stages = [];
const elapsed = start => +(performance.now() - start).toFixed(3);
async function json(path) {
  const response = await fetch(new URL(path, base), { signal: controller.signal });
  if (!response.ok) throw Error(`Could not load ${path} (${response.status})`);
  return response.json();
}
async function payload(name) {
  const start = performance.now(), response = await fetch(new URL('demo-data/' + name, base), { signal: controller.signal });
  if (!response.ok) throw Error(`Could not load ${name} (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer()), expected = manifest.files[name];
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== expected.size || hash !== expected.sha256) throw Error(`Data integrity check failed: ${name}`);
  stages.push({ stage: 'Load ' + name, ms: elapsed(start), bytes: bytes.length });
  return bytes;
}
function transaction(action) {
  db.exec('BEGIN');
  try { action(); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
}
function insert(table, bytes, width, bit) {
  const statement = db.prepare(`INSERT INTO ${table}(rowid, embedding) VALUES (?, ?)`);
  try {
    for (const row of catalogue) statement.bind([row.id, bytes.subarray(row.id * width, (row.id + 1) * width)]).stepReset();
  } finally { statement.finalize(); }
}
function volume() { return db.selectValue('PRAGMA page_count') * db.selectValue('PRAGMA page_size'); }
async function init(args) {
  base = new URL(args.base); controller = new AbortController(); stages.length = 0;
  runtime = await json('demo-runtime.json'); manifest = await json('demo-data/manifest.json');
  if (manifest.count !== 1661 || manifest.dimensions !== 300 || manifest.binaryDimensions !== 304) throw Error('Unexpected corpus shape');
  const start = performance.now();
  const url = new URL('demo-runtime/sqlite3.mjs', base).href;
  const { default: initialize } = await import(/* @vite-ignore */ url);
  const sqlite = await initialize(); db = new sqlite.oo1.DB(':memory:');
  const versions = { sqlite: db.selectValue('SELECT sqlite_version()'), sqliteVector: db.selectValue('SELECT vector_version()') };
  if (versions.sqlite !== runtime.upstreams.sqlite || versions.sqliteVector.replace(/^v/, '') !== runtime.upstreams.sqliteVector) throw Error('Runtime composition mismatch');
  stages.push({ stage: 'Initialize SQLite/WASM', ms: elapsed(start) });
  catalogue = JSON.parse(new TextDecoder().decode(await payload('catalogue.json')));
  binary = await payload('binary.bin');
  const inserted = performance.now();
  transaction(() => {
    db.exec('CREATE TABLE emojis(id INTEGER PRIMARY KEY, words TEXT NOT NULL)');
    db.exec('CREATE TABLE binary_vectors(embedding BLOB NOT NULL)');
    db.exec("SELECT vector_init('binary_vectors','embedding','type=BIT,dimension=304,distance=HAMMING')");
    const statement = db.prepare('INSERT INTO emojis VALUES (?, ?)');
    try { for (const row of catalogue) statement.bind([row.id, descriptionWords(row.words)]).stepReset(); }
    finally { statement.finalize(); }
    insert('binary_vectors', binary, 38, true);
  });
  stages.push({ stage: 'Insert catalogue and binary vectors', ms: elapsed(inserted), rows: catalogue.length, sqliteBytes: volume() });
  return { catalogue, versions, runtime, corpus: { revision: manifest.revision, credit: manifest.credit }, stages: [...stages] };
}
async function loadFloat() {
  if (floatReady) return;
  const bytes = await payload('float32.bin'), start = performance.now();
  transaction(() => { db.exec('CREATE TABLE float_vectors(embedding BLOB NOT NULL)'); db.exec("SELECT vector_init('float_vectors','embedding','type=FLOAT32,dimension=300,distance=COSINE')"); insert('float_vectors', bytes, 1200, false); });
  floats = bytes; floatReady = true;
  stages.push({ stage: 'Insert Float32 vectors', ms: elapsed(start), rows: catalogue.length, sqliteBytes: volume() });
}
async function execute(type, args) {
  if (type === 'init') return init(args);
  if (type === 'close') { db?.close(); db = undefined; return { closed: true }; }
  if (!db) throw Error('Demo is not initialized');
  if (type === 'text') {
    const query = textSearch(args.text);
    return db.selectArrays(query.sql, query.parameters).map(r => r[0]);
  }
  if (type !== 'neighbors') throw Error('Unknown operation');
  if (!Number.isInteger(args.id) || !catalogue[args.id]) throw Error('Invalid emoji');
  if (!['binary', 'float32'].includes(args.mode)) throw Error('Invalid representation');
  if (args.mode === 'float32') await loadFloat();
  const bit = args.mode === 'binary', width = bit ? 38 : 1200, bytes = bit ? binary : floats;
  const vector = bytes.subarray(args.id * width, (args.id + 1) * width);
  const sql = `SELECT rowid, distance FROM vector_full_scan('${bit ? 'binary_vectors' : 'float_vectors'}','embedding',?,7) ORDER BY distance`;
  const start = performance.now();
  const rows = db.selectArrays(sql, [vector]).filter(r => r[0] !== args.id).slice(0, 6);
  return { id: args.id, mode: args.mode, metric: bit ? 'Hamming' : 'Cosine', dimensions: bit ? 304 : 300,
    sql, parameters: [`${vector.length} bytes from emoji #${args.id}; ${bit ? '300 sign bits + 4 zero padding bits' : '300 original Float32 components'}`],
    queryMs: elapsed(start), rows: rows.map(([id, distance]) => ({ id, distance })), stages: [...stages], sqliteBytes: volume() };
}
self.onmessage = ({ data }) => {
  if (data.type === 'close') controller.abort();
  queue = queue.catch(() => {}).then(async () => {
    try { self.postMessage({ id: data.id, result: await execute(data.type, data.args ?? {}) }); }
    catch (error) { if (data.type === 'init') { db?.close(); db = undefined; } self.postMessage({ id: data.id, error: error.message }); }
  });
};
