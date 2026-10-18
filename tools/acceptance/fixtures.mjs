// Browser-side native fixtures; only host code computes expected distances.
export const bitBytes = [0x00, 0x01, 0x03, 0x07, 0x0f];
export const floatVectors = [[1, 0], [0, 1], [-1, 0]];

export function fixtureEngine(engine = 'sqliteVec') {
  if (!['sqliteVec','sqliteVector'].includes(engine)) throw Error('Unsupported acceptance fixture engine');
  return engine;
}

// This restores connection context, never stored rows or schema.
export function initializeColumns(db, engine = 'sqliteVec') {
  if (fixtureEngine(engine) === 'sqliteVector') {
    db.exec("SELECT vector_init('floats','embedding','type=FLOAT32,dimension=2,distance=L2');");
    db.exec("SELECT vector_init('bits','embedding','type=BIT,dimension=8,distance=HAMMING');");
  }
}

export function writeFixtures(db, engine = 'sqliteVec') {
  fixtureEngine(engine);
  db.exec('BEGIN; CREATE TABLE ordinary(id INTEGER PRIMARY KEY, value TEXT);');
  db.exec("INSERT INTO ordinary VALUES(1,'committed ordinary data'),(2,'survives Worker termination');");
  if (engine === 'sqliteVec') {
    db.exec('CREATE VIRTUAL TABLE floats USING vec0(embedding float[2]); CREATE VIRTUAL TABLE bits USING vec0(embedding bit[8]);');
    floatVectors.forEach((v, i) => db.exec({ sql: 'INSERT INTO floats(rowid,embedding) VALUES(?,?)', bind: [i + 1, JSON.stringify(v)] }));
    bitBytes.forEach((v, i) => db.exec({ sql: 'INSERT INTO bits(rowid,embedding) VALUES(?,vec_bit(?))', bind: [i + 1, new Uint8Array([v])] }));
  } else {
    db.exec('CREATE TABLE floats(embedding BLOB); CREATE TABLE bits(embedding BLOB);');
    floatVectors.forEach((v,i) => db.exec({sql:'INSERT INTO floats(rowid,embedding) VALUES(?,vector_as_f32(?))',bind:[i+1,JSON.stringify(v)]}));
    bitBytes.forEach((v,i) => db.exec({sql:'INSERT INTO bits(rowid,embedding) VALUES(?,?)',bind:[i+1,new Uint8Array([v])]}));
    initializeColumns(db,engine);
  }
  db.exec('COMMIT');
}

export function storedFixtures(db) {
  return {
    schema: db.selectArrays('SELECT name,type,tbl_name,sql FROM sqlite_schema ORDER BY name'),
    ordinary: db.selectArrays('SELECT id,value FROM ordinary ORDER BY id'),
    floats: db.selectArrays('SELECT rowid,hex(embedding) FROM floats ORDER BY rowid'),
    bits: db.selectArrays('SELECT rowid,hex(embedding) FROM bits ORDER BY rowid'),
  };
}

export function readFixtures(db, engine = 'sqliteVec') {
  fixtureEngine(engine);
  const stored = storedFixtures(db); // Missing tables fail before column initialization.
  initializeColumns(db,engine);
  if (JSON.stringify(storedFixtures(db)) !== JSON.stringify(stored)) throw Error('Native column initialization changed stored fixtures');
  return {
    ordinary: stored.ordinary, stored,
    floats: engine === 'sqliteVec'
      ? db.selectArrays("SELECT rowid,distance FROM floats WHERE embedding MATCH '[1,0]' AND k=3 ORDER BY distance")
      : db.selectArrays("SELECT rowid,distance FROM vector_full_scan('floats','embedding','[1,0]',3) ORDER BY distance"),
    bits: engine === 'sqliteVec'
      ? db.selectArrays('SELECT rowid,distance FROM bits WHERE embedding MATCH vec_bit(?) AND k=5 ORDER BY distance', [new Uint8Array([0])])
      : db.selectArrays("SELECT rowid,distance FROM vector_full_scan('bits','embedding',?,5) ORDER BY distance",[new Uint8Array([0])]),
  };
}

export function sqlProbe(sqlite3, engine = 'sqliteVec') {
  const db = new sqlite3.oo1.DB(':memory:', 'c');
  try {
    writeFixtures(db,engine);
    db.exec("CREATE VIRTUAL TABLE texts USING fts5(body); INSERT INTO texts(rowid,body) VALUES(1,'browser vector'),(2,'other'),(3,'browser persistence');");
    return { ...readFixtures(db,engine), fts: db.selectArrays("SELECT rowid FROM texts WHERE texts MATCH 'browser' ORDER BY rowid").flat() };
  } finally { db.close(); }
}
