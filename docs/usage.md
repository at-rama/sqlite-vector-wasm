# Using sqlite-vector-wasm

A short guide to SQLite's browser JavaScript/WASM APIs, with SQLite-Vector available in each new connection.

Use an identified SQLite-Vector archive. Install a release candidate from its supplied archive; a published distribution can also be installed using its exact npm version. A prepared archive does not itself establish npm availability.

## Host and initialize

```sh
npm install ./payload.tgz
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
// Run the examples below, then close the connection:
// db.close();
```

## Float32 nearest neighbors

SQLite-Vector uses ordinary tables and BLOB columns. This two-dimensional Float32 example uses exact L2 full-scan search; quantization is optional. Existing sqlite-vec `vec0` tables and `vec_*` SQL require adaptation, without automatic migration of existing vector structures.

```js
db.exec('CREATE TABLE items(embedding BLOB)');
db.exec("INSERT INTO items(rowid, embedding) VALUES(1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'))");
db.exec("SELECT vector_init('items', 'embedding', 'type=FLOAT32,dimension=2,distance=L2')");
const neighbors = db.selectArrays(
  "SELECT rowid, distance FROM vector_full_scan('items', 'embedding', '[1,0]', 2) ORDER BY distance"
);
console.log(neighbors);
```

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
```

## Full-text search (FTS5)

FTS5 is part of the bundled SQLite configuration and can be used alongside vector tables.

```js
db.exec('CREATE VIRTUAL TABLE texts USING fts5(body)');
db.exec("INSERT INTO texts(rowid, body) VALUES(1, 'browser vector search')");
console.log(db.selectArrays("SELECT rowid FROM texts WHERE texts MATCH 'vector'"));
```

## Scripts and Workers

For new applications, run the initialization and SQL examples above inside your own **dedicated module Worker**, importing `/sqlite/sqlite3.mjs` there and using SQLite's API directly. Exchange application messages with the page through `postMessage()`. This keeps synchronous database work off the UI thread. See [SQLite's JavaScript API documentation](https://sqlite.org/wasm/doc/trunk/api-index.md).

For a classic script, load `/sqlite/sqlite3.js` and call `globalThis.sqlite3InitModule()`. In a classic Worker, first call `importScripts('/sqlite/sqlite3.js')`, then the same initializer.

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

Worker companions must resolve from the same asset directory; when a Worker entry is hosted elsewhere, the upstream `sqlite3.dir=/sqlite` URL parameter can locate the assets. Supplied bundler-friendly variants rely on the bundler's support for upstream asset-URL handling; compatibility with every bundler is not guaranteed. The Worker1 documentation describes its message and promiser APIs.

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
