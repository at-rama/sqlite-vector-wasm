import initialize from '@at-rama/sqlite-vector-wasm/sqlite3-bundler-friendly.mjs';

self.onmessage = async () => {
  let db;
  try {
    const sqlite3 = await initialize();
    db = new sqlite3.oo1.DB(':memory:');
    db.exec('CREATE TABLE items(embedding BLOB)');
    db.exec("INSERT INTO items(rowid, embedding) VALUES(1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'))");
    db.exec("SELECT vector_init('items', 'embedding', 'type=FLOAT32,dimension=2,distance=L2')");
    const result = {
      sqlite: db.selectValue('SELECT sqlite_version()'),
      vector: db.selectValue('SELECT vector_version()'),
      neighbors: db.selectArrays("SELECT rowid, distance FROM vector_full_scan('items', 'embedding', '[1,0]', 2) ORDER BY distance"),
    };
    db.close();
    db = null;
    self.postMessage(result);
  } catch (error) {
    if (db) try { db.close(); } catch { /* Preserve the original failure. */ }
    self.postMessage({ error: error.message });
  }
};
