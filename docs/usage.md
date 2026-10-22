# Using sqlite-vector-wasm

Use SQLite's browser JavaScript/WASM APIs with SQLite-Vector built in. This guide takes you from serving the runtime assets to vector search, Workers and persistent storage.

## Host and initialize

```sh
npm install @at-rama/sqlite-vector-wasm
```

From your project's root, copy **all eleven runtime files** into one public asset directory. For example, with a POSIX shell:

```sh
mkdir -p public/sqlite
cp node_modules/@at-rama/sqlite-vector-wasm/*.js \
   node_modules/@at-rama/sqlite-vector-wasm/*.mjs \
   node_modules/@at-rama/sqlite-vector-wasm/*.wasm public/sqlite/
```

Configure your application server to serve `public/sqlite/` at `/sqlite/`; this mapping is a hosting choice, not something npm sets up. Another static host can use an equivalent directory and URL. Keep the loaders, WASM, Worker entries, promisers and OPFS proxy together. Serve `.js`/`.mjs` as JavaScript and `.wasm` as `application/wasm`.

In a browser module, initialize the in-memory database:

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';
const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');
// Run the SQL examples below in this connection, then release it:
// db.close();
```

SQLite-Vector functions are registered automatically on each connection. Use the OO1 methods below for convenient SQL execution, or the upstream C bindings through `sqlite3.capi` and `sqlite3.wasm`. Use JavaScript `BigInt` when handling 64-bit integers outside the safe `Number` range; see [SQLite's JavaScript API reference](https://sqlite.org/wasm/doc/trunk/api-index.md) for conversions and binding details.

## Float32 nearest neighbors

SQLite-Vector uses ordinary tables and BLOB columns. This two-dimensional Float32 example uses exact L2 full-scan search; quantization is optional.

```js
db.exec('CREATE TABLE items(embedding BLOB)');
db.exec("INSERT INTO items(rowid, embedding) VALUES(1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'))");
db.exec("SELECT vector_init('items', 'embedding', 'type=FLOAT32,dimension=2,distance=L2')");
const neighbors = db.selectArrays(
  "SELECT rowid, distance FROM vector_full_scan('items', 'embedding', '[1,0]', 2) ORDER BY distance"
);
console.log(neighbors);
// [[1, 0], [2, approximately 1.414214]]
```

`vector_init()` associates the table and column with a vector type, dimension and distance metric for the current connection. Initialize that association again when opening another connection to the same stored data; do not recreate the table or reinsert its rows just to query it. The column stores the vectors themselves as BLOBs. Keep the stored vectors and query vectors consistent in type and dimension.

For quantized search and its preparation and refresh requirements, consult the [SQLite-Vector reference](https://github.com/sqliteai/sqlite-vector).

## Binary vectors and Hamming distance

Native binary vectors use BLOBs and Hamming distance. This example stores one byte (eight bits) per vector; a query of `01` is one bit away from `03`.

```js
db.exec('CREATE TABLE bits(embedding BLOB)');
db.exec("INSERT INTO bits(rowid, embedding) VALUES(1, x'03')");
db.exec("SELECT vector_init('bits', 'embedding', 'type=BIT,dimension=8,distance=HAMMING')");
const matches = db.selectArrays(
  "SELECT rowid, distance FROM vector_full_scan('bits', 'embedding', x'01', 1) ORDER BY distance"
);
console.log(matches);
// [[1, 1]]
```

## Full-text search (FTS5)

FTS5 is part of the bundled SQLite configuration and can be used alongside vector tables.

```js
db.exec('CREATE VIRTUAL TABLE texts USING fts5(body)');
db.exec("INSERT INTO texts(rowid, body) VALUES(1, 'browser vector search')");
console.log(db.selectArrays("SELECT rowid FROM texts WHERE texts MATCH 'vector'"));
// [[1]]
```

## Scripts and Workers

For new applications, run the initialization and SQL examples above inside your own **dedicated module Worker**, importing `/sqlite/sqlite3.mjs` there and using SQLite's API directly. Exchange application messages with the page through `postMessage()`. This keeps synchronous database work off the UI thread. See [SQLite's JavaScript API documentation](https://sqlite.org/wasm/doc/trunk/api-index.md).

For a classic script, load `/sqlite/sqlite3.js` and await `globalThis.sqlite3InitModule()`. In a classic Worker, first call `importScripts('/sqlite/sqlite3.js')`, then await the same initializer. Use a module Worker for `.mjs` loaders and a classic Worker for `sqlite3.js`.

The supplied `sqlite3-bundler-friendly.mjs` and corresponding Worker1/promiser variants remain available through explicit package subpaths. The package root is not a JavaScript loader. A bundler must preserve the upstream WASM and Worker asset URLs and copy their companion files; compatibility with every bundler is not guaranteed. Keep companions from the same distribution together rather than mixing runtime versions.

### Worker1 compatibility

SQLite [deprecates Worker1 and its promiser interface](https://sqlite.org/wasm/doc/trunk/api-worker1.md) and discourages their use for new applications. The package continues to include their upstream `.js`, `.mjs` and promiser entry points for compatibility.

For an existing application using the promise-based Worker1 interface, with the runtime files at `/sqlite/`:

```js
import createPromiser from '/sqlite/sqlite3-worker1-promiser.mjs';
const promiser = await createPromiser();
const { dbId } = await promiser('open', { filename: ':memory:' });
const response = await promiser({
  type: 'exec', dbId,
  args: { sql: 'SELECT vector_version()', resultRows: [], rowMode: 'array' }
});
console.log(response.result.resultRows);
await promiser({ type: 'close', dbId });
```

Worker companions must resolve from the same asset directory; when a Worker entry is hosted elsewhere, the upstream `sqlite3.dir=/sqlite` URL parameter can locate the assets. The Worker1 documentation describes its message and promiser APIs.

## Browser persistence

In-memory `new sqlite3.oo1.DB(':memory:')` does not persist. For persistence, choose an upstream OPFS VFS and open the database inside a Worker. OPFS requires a secure context, normally HTTPS; loopback HTTP is also treated as secure for local development. Check the requested VFS availability rather than silently substituting transient storage.

The `opfs` and `opfs-wl` modes require cross-origin isolation. Serve the document with the following response headers and ensure its resources meet the embedding policy:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

`opfs` uses the supplied asynchronous proxy. `opfs-wl` additionally requires Web Locks and `Atomics.waitAsync()`. The `opfs-sahpool` mode must be installed explicitly through `await sqlite3.installOpfsSAHPoolVfs()`; it does not require cross-origin isolation. These OPFS modes are unavailable on the main thread. SQLite also supplies `kvvfs` for main-thread `localStorage`/`sessionStorage`, with different capacity and storage behavior.

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

See [SQLite's persistence prerequisites](https://sqlite.org/wasm/doc/trunk/persistence.md) for VFS selection, concurrency and initialization details. Browser quotas and private-browsing modes can restrict or disable persistence; check storage behavior in the actual deployment.
