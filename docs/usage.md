# Using sqlite-vector-wasm

A short guide to using the distributed browser runtime. The package exposes SQLite's own JavaScript/WASM APIs, with sqlite-vec already available in each new connection; it does not add a new JavaScript wrapper.

This guide’s minimal browser example is checked against published version **0.2.0**.

## Host and initialize

```sh
npm install @at-rama/sqlite-vector-wasm@0.2.0
```

Copy **all eleven** files from the installed package to the same public URL directory, here `/sqlite/`. Keep the `.wasm` file, Worker entries, promisers and OPFS proxy with the loaders. Serve `.js`/`.mjs` as JavaScript and `.wasm` as `application/wasm`. npm installation alone does not serve these assets.

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';
const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');
// Run the examples below, then close the connection:
// db.close();
```

## Float32 nearest neighbors

Use sqlite-vec's `vec0` virtual table. This small two-dimensional example uses JSON vector literals; real embeddings can have many more dimensions.

```js
db.exec('CREATE VIRTUAL TABLE items USING vec0(embedding float[2])');
db.exec({sql: 'INSERT INTO items(rowid, embedding) VALUES(?, ?)', bind: [1, '[1,0]']});
db.exec({sql: 'INSERT INTO items(rowid, embedding) VALUES(?, ?)', bind: [2, '[0,1]']});
const neighbors = db.selectArrays(
  "SELECT rowid, distance FROM items WHERE embedding MATCH '[1,0]' AND k = 2 ORDER BY distance"
);
console.log(neighbors);
```

## Binary vectors and Hamming distance

`vec_bit()` converts byte data for bit-vector storage and querying. The following table declares eight bits per vector.

```js
db.exec('CREATE VIRTUAL TABLE bits USING vec0(embedding bit[8])');
db.exec({
  sql: 'INSERT INTO bits(rowid, embedding) VALUES(?, vec_bit(?))',
  bind: [1, new Uint8Array([0x03])]
});
const matches = db.selectArrays(
  'SELECT rowid, distance FROM bits WHERE embedding MATCH vec_bit(?) AND k = 1 ORDER BY distance',
  [new Uint8Array([0x01])]
);
console.log(matches);
```

## Full-text search (FTS5)

FTS5 is part of the bundled SQLite configuration and can be used alongside vector tables.

```js
db.exec('CREATE VIRTUAL TABLE texts USING fts5(body)');
db.exec("INSERT INTO texts(rowid, body) VALUES(1, 'browser vector search')");
console.log(db.selectArrays("SELECT rowid FROM texts WHERE texts MATCH 'vector'"));
```

## Scripts and Workers

For a classic script, load `/sqlite/sqlite3.js` and call `globalThis.sqlite3InitModule()`. In a classic Worker, `importScripts('/sqlite/sqlite3.js')` precedes the same initializer. The package includes `sqlite3-worker1.js` and `sqlite3-worker1.mjs`, plus the corresponding `sqlite3-worker1-promiser` entry points. Worker companions must resolve from the same asset directory; when a Worker entry is hosted elsewhere, the upstream `sqlite3.dir=/sqlite` URL parameter can locate the assets.

For the promise-based Worker1 interface, with the runtime files at /sqlite/:

```js
import createPromiser from '/sqlite/sqlite3-worker1-promiser.mjs';
const promiser = await createPromiser();
const { dbId } = await promiser('open', { filename: ':memory:' });
const response = await promiser({
  type: 'exec', dbId,
  args: { sql: 'SELECT vec_version()', resultRows: [], rowMode: 'array' }
});
console.log(response.result.resultRows);
await promiser({ type: 'close', dbId });
```

Bundler-friendly variants are supplied for tools that support the upstream asset-URL handling. There is no guarantee that every bundler can consume them. Follow [SQLite's Worker1 documentation](https://sqlite.org/wasm/doc/trunk/api-worker1.md) for message and promiser API details.

## Browser persistence

In-memory `new sqlite3.oo1.DB(':memory:')` does not persist. For persistence, use one of the available upstream OPFS VFS modes from an appropriate Worker after the required initialization. OPFS needs a secure context; `opfs` and `opfs-wl` require applicable cross-origin isolation. `opfs-wl` also needs Web Locks and `Atomics.waitAsync()`. The explicitly initialized `opfs-sahpool` does not require those isolation headers. Main-thread OPFS is unsupported. Check the requested VFS availability rather than silently substituting transient storage.

For example, **inside a Worker** with SQLite initialized and the required OPFS conditions met:

```js
if (!sqlite3.capi.sqlite3_vfs_find('opfs')) throw Error('OPFS unavailable');
const stored = new sqlite3.oo1.DB('/example.db', 'c', 'opfs');
try {
  stored.exec('CREATE TABLE IF NOT EXISTS notes(message TEXT)');
} finally {
  stored.close();
}
```

See [SQLite's persistence prerequisites](https://sqlite.org/wasm/doc/trunk/persistence.md) for exact setup and API examples.

## Package provenance and licensing

`runtime.json` records source versions, digests, assets and build settings. The distribution's `LICENSE` covers project-authored Apache-2.0 material; `NOTICE` and `licenses/` preserve the upstream licensing terms. See the [project README](https://at-rama.github.io/sqlite-vector-wasm/) for release channels and source-build documentation.
