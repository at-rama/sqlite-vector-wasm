import initialize from './runtime/sqlite3.mjs';
import { writeFixtures, readFixtures, sqlProbe, fixtureEngine } from './fixtures.mjs';

onmessage = async ({ data }) => {
  let db;
  try {
    const conditions = {
      secureContext: globalThis.isSecureContext,
      crossOriginIsolated: globalThis.crossOriginIsolated,
      opfs: !!navigator.storage?.getDirectory,
      syncAccessHandles: typeof FileSystemFileHandle !== 'undefined' && typeof FileSystemFileHandle.prototype.createSyncAccessHandle === 'function',
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      webLocks: !!navigator.locks, waitAsync: typeof Atomics.waitAsync === 'function',
    };
    const engine = fixtureEngine(data.engine);
    const sqlite3 = await initialize();
    if (data.phase === 'sql') { postMessage({ result: sqlProbe(sqlite3,engine), conditions }); return; }
    if (!conditions.secureContext || !conditions.opfs || !conditions.syncAccessHandles) throw Error('Required OPFS prerequisites absent');
    if (data.vfs !== 'opfs-sahpool' && (!conditions.crossOriginIsolated || !conditions.sharedArrayBuffer)) throw Error('Required isolation/SAB absent');
    if (data.vfs === 'opfs-wl' && (!conditions.webLocks || !conditions.waitAsync)) throw Error('Required Web Locks/waitAsync absent');
    const flags = data.phase === 'write' || data.phase.startsWith('corrupt') ? 'c' : 'r';
    if (data.vfs === 'opfs-sahpool') {
      const pool = await sqlite3.installOpfsSAHPoolVfs({ name: 'opfs-sahpool', directory: data.poolDirectory, initialCapacity: 6 });
      db = new pool.OpfsSAHPoolDb(data.database, flags);
    } else {
      if (!sqlite3.capi.sqlite3_vfs_find(data.vfs)) throw Error(`Required VFS absent: ${data.vfs}`);
      db = new sqlite3.oo1.DB(data.database, flags, data.vfs);
    }
    if (data.phase === 'write') writeFixtures(db,engine);
    if (data.phase === 'corrupt') db.exec('DROP TABLE ordinary');
    if (data.phase === 'corrupt-vector') db.exec('DROP TABLE bits');
    if (data.phase === 'read') db.exec('PRAGMA query_only=ON');
    const result = data.phase.startsWith('corrupt') ? null : readFixtures(db,engine);
    db.close(); db = null;
    postMessage({ result, conditions, phase: data.phase, vfs: data.vfs, database: data.database, poolDirectory: data.poolDirectory, closed: true });
  } catch (error) {
    if (db) try { db.close(); } catch { /* Preserve the original test failure. */ }
    postMessage({ error: error.message, stack: error.stack });
  }
};
