// Executed inside the browser, using upstream APIs without runtime glue.
// Fixed native smoke queries for the current Vector composition and SQLite-only reference.
export function nativeProbeSql(vector) {
  const key = vector?.key;
  if (key === 'sqliteVector') return {
    versionSql: "select sqlite_version(), vector_version(), (select count(*) from pragma_function_list where name='vec_version')", expectedVersion: vector.version,
    setup: "create table v(embedding blob); insert into v(rowid,embedding) values(1,vector_as_f32('[1,0]')),(2,vector_as_f32('[0,1]')); select vector_init('v','embedding','type=FLOAT32,dimension=2,distance=L2');",
    query: "select rowid,distance from vector_full_scan('v','embedding','[1,0]',2) order by distance",
    otherVersion: 'vec_version',
  };
  if (vector) throw Error('Unsupported vector probe identity');
  return { versionSql: 'select sqlite_version()' };
}

export async function probe(sqlite3, vector, worker) {
  const check = (value, label) => { if (!value) throw Error(label); };
  const { capi: c, wasm: w, oo1 } = sqlite3;
  const db = new oo1.DB(':memory:', 'c');
  const sql = nativeProbeSql(vector);
  try {
    const version = db.selectValue('select sqlite_version()');
    const vecVersion = vector ? db.selectArray(sql.versionSql)[1] : null;
    check(db.selectValue('select 9007199254740993') === 9007199254740993n, 'BigInt');
    db.exec("create virtual table f using fts5(text); insert into f values('browser vector'),('other');");
    check(db.selectValue("select count(*) from f where f match 'browser'") === 1, 'FTS5');
    if (vector) {
      check(vecVersion === sql.expectedVersion, 'engine version/automatic OO1 initialization');
      check(db.selectValue(`select count(*) from pragma_function_list where name='${sql.otherVersion}'`) === 0, 'only selected engine registered');
      db.exec(sql.setup);
      const rows = db.selectArrays(sql.query);
      check(rows.length === 2 && rows[0][0] === 1 && rows[0][1] === 0 && rows[1][0] === 2 && Math.abs(rows[1][1]-Math.SQRT2)<0.00001, 'native deterministic nearest neighbors');
    }
    const pointer = w.allocPtr();
    let native;
    try {
      check(c.sqlite3_open_v2(':memory:', pointer, c.SQLITE_OPEN_READWRITE|c.SQLITE_OPEN_CREATE, null) === 0, 'C open');
      native = w.peekPtr(pointer);
      check(native !== db.pointer, 'independent connections');
      check(c.sqlite3_exec(native, 'create table independent(x)', 0, 0, 0) === 0, 'C execution');
      const statementPointer = w.allocPtr();
      let statement;
      try {
        check(c.sqlite3_prepare_v2(native, sql.versionSql, -1, statementPointer, 0) === 0, 'C prepare versions');
        statement = w.peekPtr(statementPointer);
        check(c.sqlite3_step(statement) === c.SQLITE_ROW, 'C version row');
        check(c.sqlite3_column_text(statement, 0) === version, 'independent C SQLite version');
        if (vector) {
          check(c.sqlite3_column_text(statement, 1) === sql.expectedVersion, 'independent C engine version');
          check(c.sqlite3_column_int(statement, 2) === 0, 'only selected engine on C connection');
        }
      } finally { if (statement) c.sqlite3_finalize(statement); w.dealloc(statementPointer); }
      if (vector) {
        check(c.sqlite3_exec(native, sql.setup, 0, 0, 0) === 0, 'automatic C initialization');
        const queryPointer = w.allocPtr(); let statement;
        try {
          check(c.sqlite3_prepare_v2(native, sql.query, -1, queryPointer, 0) === 0, 'C native query prepare');
          statement = w.peekPtr(queryPointer);
          check(c.sqlite3_step(statement) === c.SQLITE_ROW && c.sqlite3_column_int(statement, 0) === 1 && c.sqlite3_column_double(statement, 1) === 0, 'C native nearest neighbor');
        } finally { if (statement) c.sqlite3_finalize(statement); w.dealloc(queryPointer); }
      }
      check(db.selectValue("select count(*) from sqlite_schema where name='independent'") === 0, 'connection separation');
    } finally { if (native) check(c.sqlite3_close_v2(native) === 0, 'C close'); w.dealloc(pointer); }
    const vfs = c.sqlite3_js_vfs_list().sort();
    check(vfs.includes('kvvfs'), 'kvvfs retained');
    if (!worker) {
      const kv = new oo1.DB('session', 'c', 'kvvfs');
      try { kv.exec('create table if not exists build_probe(x); delete from build_probe; insert into build_probe values(17)'); check(kv.selectValue('select x from build_probe') === 17, 'kvvfs storage'); }
      finally { kv.close(); }
      for (const name of ['opfs','opfs-wl','opfs-sahpool']) {
        check(!c.sqlite3_vfs_find(name), `${name} unavailable on main thread`);
        let failed = false;
        try { const unavailable = new oo1.DB('/unavailable.db', 'c', name); unavailable.close(); } catch { failed = true; }
        check(failed, `${name} request must not fall back`);
      }
    } else {
      check(globalThis.isSecureContext && globalThis.crossOriginIsolated, 'secure isolated Worker');
      check(typeof Atomics.waitAsync === 'function' && !!navigator.locks, 'opfs-wl prerequisites');
      for (const name of ['opfs','opfs-wl']) {
        check(vfs.includes(name), `${name} initialization`);
        const persistent = new oo1.DB(`/build-${name}.db`, 'c', name);
        try { persistent.exec('create table if not exists probe(x); delete from probe; insert into probe values(23)'); check(persistent.selectValue('select x from probe') === 23, `${name} read/write`); }
        finally { persistent.close(); }
      }
      const pool = await sqlite3.installOpfsSAHPoolVfs({ initialCapacity: 3 });
      const pooled = new pool.OpfsSAHPoolDb('/build-pool.db');
      try { pooled.exec('create table if not exists probe(x); delete from probe; insert into probe values(29)'); check(pooled.selectValue('select x from probe') === 29, 'SAH pool read/write'); }
      finally { pooled.close(); }
    }
    return { version, vecVersion, independentVersionsChecked: true, capi: Object.keys(c).sort(), oo1: Object.keys(oo1).sort(),
      dbMethods: Object.getOwnPropertyNames(oo1.DB.prototype).sort(),
      exports: Object.keys(w.exports).sort(), vfs: c.sqlite3_js_vfs_list().sort(),
      options: db.selectArrays('pragma compile_options').flat().sort(),
      functions: db.selectArrays("select name || '/' || narg from pragma_function_list").flat().sort() };
  } finally { db.close(); }
}
