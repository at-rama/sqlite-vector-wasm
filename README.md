# sqlite-vector-wasm

[![npm latest](https://img.shields.io/npm/v/@at-rama/sqlite-vector-wasm/latest)](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm)
[![npm license](https://img.shields.io/npm/l/@at-rama/sqlite-vector-wasm)](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE)
[![SQLite in npm latest](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2F%40at-rama%2Fsqlite-vector-wasm%40latest%2Fruntime.json&query=%24.inputs.sqlite.version&label=SQLite)](https://sqlite.org/wasm)
[![SQLite-Vector in npm latest](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2F%40at-rama%2Fsqlite-vector-wasm%40latest%2Fruntime.json&query=%24.inputs.sqliteVector.version&label=SQLite-Vector)](https://github.com/sqliteai/sqlite-vector)
[![CI](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml/badge.svg)](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml)
[![Site](https://img.shields.io/badge/Site-Documentation-3451B2)](https://at-rama.github.io/sqlite-vector-wasm/)

The package and component badges describe the npm `latest` publication; the checked example and demo identify their own runtime selections.

**SQLite for the browser, with vector search built in.**

sqlite-vector-wasm distributes SQLite's browser WebAssembly runtime with [SQLite-Vector](https://github.com/sqliteai/sqlite-vector) statically integrated. Use SQLite's own browser APIs, with vector search available in every new connection. No compilation or extension registration is needed.

[Get started](https://at-rama.github.io/sqlite-vector-wasm/usage/)

## Quick start

Install the browser assets:

```sh
npm install @at-rama/sqlite-vector-wasm
```

Serve **all eleven runtime files** together, for example under `/sqlite/`. The [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/#host-and-initialize) provides the copy commands and hosting setup. npm installs the assets; your server must expose their URLs with JavaScript MIME types for `.js`/`.mjs` and `application/wasm` for `.wasm`.

With those files available under `/sqlite/`, load the upstream ES module:

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';

const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');
try {
  console.log(db.selectValue('SELECT vector_version()'));
} finally {
  db.close();
}
```

Next, [create a vector table and find its nearest neighbors](https://at-rama.github.io/sqlite-vector-wasm/usage/#float32-nearest-neighbors). The guide also covers binary vectors, FTS5, Workers and persistence.

## Features

- SQLite's JavaScript, ES module, C-style and OO1 browser APIs.
- Native Float32 similarity search on ordinary tables and BLOB columns, with optional quantization.
- Binary vectors and Hamming-distance search.
- Full-text search through SQLite FTS5.
- Web Worker support through SQLite's direct APIs; upstream Worker1/promiser entries remain available for compatibility.
- Browser persistence through OPFS when supported and correctly hosted.
- Static SQLite-Vector integration: no runtime extension loading.

## Browser requirements and boundaries

Target modern browsers with the required WebAssembly and JavaScript support. Keep all WASM, Worker, promiser and OPFS companion assets together when deploying the runtime. OPFS requires a secure context and Workers; some persistent VFS modes additionally require cross-origin isolation. An unavailable requested persistent VFS does not silently fall back to in-memory storage.

The package preserves upstream SQLite/SQLite-Vector behavior. It does **not** provide a Node.js, native or WASI runtime, a root JavaScript wrapper, or guaranteed compatibility with every bundler. Consult the [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) and [SQLite browser documentation](https://sqlite.org/wasm/doc/trunk/api-index.md) for details.

## Distribution and source

Download size is approximately **672 kB with gzip (1.77 MB raw)** for the ES module loader and WASM binary together, based on the [measured published runtime](https://github.com/at-rama/sqlite-vector-wasm/blob/1193e6964ff262a3c4d17e0593a639fd4ca244ad/docs/runtime-footprint.md). Application data and additional requested companion files are extra; transfer size depends on server compression and caching. These figures describe downloaded files, not runtime memory usage.

- [npm package](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm)
- [GitHub Releases](https://github.com/at-rama/sqlite-vector-wasm/releases)

Each distribution contains `runtime.json`, recording the selected SQLite and SQLite-Vector versions, source digests, runtime files and build options. The distribution includes consumer guides for SQLite-Vector.

To build or inspect the distribution, see [source acquisition](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/source-acquisition.md), [browser builds](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/build.md) and [packaging](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md).

## Contributing

This repository uses agent-assisted development, automated verification and human review. See [AGENTS.md](https://github.com/at-rama/sqlite-vector-wasm/blob/main/AGENTS.md) and the [development standards](https://github.com/at-rama/sqlite-vector-wasm/tree/main/.42p/standards).

## License

Project-authored code and documentation use [Apache-2.0](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE), also identified by the npm `license` field. Bundled upstream components retain their own terms: see [NOTICE](https://github.com/at-rama/sqlite-vector-wasm/blob/main/tools/package/NOTICE-vector.txt) and the full texts in the package's `licenses/` directory.

Built on [SQLite](https://sqlite.org/) and [SQLite-Vector](https://github.com/sqliteai/sqlite-vector).
