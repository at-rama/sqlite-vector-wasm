# SQLite-Vectortor-wasm

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/LICENSE)
[![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/wasm)
[![SQLite-Vector](https://img.shields.io/badge/SQLite--Vector-integrated-00897B)](https://github.com/sqliteai/sqlite-vector)
[![CI](https://github.com/at-rama/SQLite-Vectortor-wasm/actions/workflows/repository.yml/badge.svg)](https://github.com/at-rama/SQLite-Vectortor-wasm/actions/workflows/repository.yml)
[![Site](https://img.shields.io/badge/Site-Documentation-3451B2)](https://at-rama.github.io/SQLite-Vectortor-wasm/)

**SQLite for the browser, with vector search built in.**

SQLite-Vectortor-wasm distributes SQLite's browser WebAssembly runtime with [SQLite-Vector](https://github.com/sqliteai/sqlite-vector) statically integrated. Use SQLite's own browser APIs, with vector search available in every new connection. No compilation or extension registration is needed.

[Try the demo](https://at-rama.github.io/SQLite-Vectortor-wasm/demo/) · [Get started](https://at-rama.github.io/SQLite-Vectortor-wasm/usage/)

## Quick start

Install the selected archive locally; use an exact npm version only when its matching release is published:

```sh
npm install @at-rama/SQLite-Vectortor-wasm@0.2.0
```

Serve **all eleven runtime files** together, for example under `/sqlite/`. The [usage guide](https://at-rama.github.io/SQLite-Vectortor-wasm/usage/#host-and-initialize) provides the copy commands and hosting setup. npm installs the assets; your server must expose their URLs with JavaScript MIME types for `.js`/`.mjs` and `application/wasm` for `.wasm`.

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

Next, [create a vector table and find its nearest neighbors](https://at-rama.github.io/SQLite-Vectortor-wasm/usage/#float32-nearest-neighbors). The guide also covers binary vectors, FTS5, Workers and persistence.

Existing sqlite-vec `vec0` tables and `vec_*` queries require adaptation to SQLite-Vector native SQL. Preserved SQLite JavaScript APIs do not imply automatic database migration or compatible old vector structures. Historical sqlite-vec releases retain their identity. The demo may still use its explicitly displayed historical published runtime until a separate refresh.

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

The package preserves upstream SQLite/SQLite-Vector behavior. It does **not** provide a Node.js, native or WASI runtime, a root JavaScript wrapper, or guaranteed compatibility with every bundler. Consult the [usage guide](https://at-rama.github.io/SQLite-Vectortor-wasm/usage/) and [SQLite browser documentation](https://sqlite.org/wasm/doc/trunk/api-index.md) for details.

## Distribution and source

Archive size depends on the selected composition. Consult the identified release assets for its exact payload and provenance.

- [npm package](https://www.npmjs.com/package/@at-rama/SQLite-Vectortor-wasm)
- [GitHub Releases](https://github.com/at-rama/SQLite-Vectortor-wasm/releases)

Each distributed archive contains `runtime.json`, recording the selected SQLite and SQLite-Vector versions, source digests, runtime files and build options. Each archive includes consumer guides matching its composition. Previously published releases retain their own contents.

To build or inspect the distribution, see [source acquisition](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/docs/source-acquisition.md), [browser builds](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/docs/build.md) and [packaging](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/docs/packaging.md).

## Contributing

This repository uses agent-assisted development, automated verification and human review. See [AGENTS.md](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/AGENTS.md) and the [development standards](https://github.com/at-rama/SQLite-Vectortor-wasm/tree/main/.42p/standards).

## License

Project-authored code and documentation use [Apache-2.0](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/LICENSE), also identified by the npm `license` field. Bundled upstream components retain their own terms: see [NOTICE](https://github.com/at-rama/SQLite-Vectortor-wasm/blob/main/tools/package/NOTICE-vector.txt) and the full texts in the package's `licenses/` directory.

Built on [SQLite](https://sqlite.org/) and [SQLite-Vector](https://github.com/sqliteai/sqlite-vector).
