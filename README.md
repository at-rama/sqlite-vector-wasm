# sqlite-vector-wasm

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE)
[![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/wasm)
[![sqlite-vec](https://img.shields.io/badge/sqlite--vec-integrated-00897B)](https://github.com/asg017/sqlite-vec)
[![CI](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml/badge.svg)](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml)
[![Site](https://img.shields.io/badge/Site-Documentation-3451B2)](https://at-rama.github.io/sqlite-vector-wasm/)

**SQLite for the browser, with vector search built in.**

sqlite-vector-wasm distributes SQLite's browser WebAssembly runtime with [sqlite-vec](https://github.com/asg017/sqlite-vec) statically integrated. Use SQLite's own browser APIs, with vector search available in every new connection. No compilation or extension registration is needed.

[Try the demo](https://at-rama.github.io/sqlite-vector-wasm/demo/) · [Get started](https://at-rama.github.io/sqlite-vector-wasm/usage/)

## Quick start

Install the browser assets:

```sh
npm install @at-rama/sqlite-vector-wasm@0.2.0
```

Serve **all eleven runtime files** together, for example under `/sqlite/`. The [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/#host-and-initialize) provides the copy commands and hosting setup. npm installs the assets; your server must expose their URLs with JavaScript MIME types for `.js`/`.mjs` and `application/wasm` for `.wasm`.

With those files available under `/sqlite/`, load the upstream ES module:

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';

const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');
try {
  console.log(db.selectValue('SELECT vec_version()'));
} finally {
  db.close();
}
```

Next, [create a vector table and find its nearest neighbors](https://at-rama.github.io/sqlite-vector-wasm/usage/#float32-nearest-neighbors). The guide also covers binary vectors, FTS5, Workers and persistence.

## Features

- SQLite's JavaScript, ES module, C-style and OO1 browser APIs.
- Float32 vector similarity search with sqlite-vec (`vec0`).
- Binary vectors and Hamming-distance search.
- Full-text search through SQLite FTS5.
- Web Worker support through SQLite's direct APIs; upstream Worker1/promiser entries remain available for compatibility.
- Browser persistence through OPFS when supported and correctly hosted.
- Static sqlite-vec integration: no runtime extension loading.

Download size: approximately 674 kB gzipped (1.78 MB uncompressed) for the JavaScript loader and SQLite/sqlite-vec WASM binary combined, measured with release 0.2.0 served by GitHub Pages. Application data is additional; transfer size depends on your server’s compression settings.

## Browser requirements and boundaries

Target modern browsers with the required WebAssembly and JavaScript support. Keep all WASM, Worker, promiser and OPFS companion assets together when deploying the runtime. OPFS requires a secure context and Workers; some persistent VFS modes additionally require cross-origin isolation. An unavailable requested persistent VFS does not silently fall back to in-memory storage.

The package preserves upstream SQLite/sqlite-vec behavior. It does **not** provide a Node.js, native or WASI runtime, a root JavaScript wrapper, or guaranteed compatibility with every bundler. Consult the [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) and [SQLite browser documentation](https://sqlite.org/wasm/doc/trunk/api-index.md) for details.

## Distribution and source

- [npm package](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm)
- [GitHub Releases](https://github.com/at-rama/sqlite-vector-wasm/releases)

Each distributed archive contains `runtime.json`, recording the selected SQLite and sqlite-vec versions, source digests, runtime files and build options. The package includes byte-identical copies of this README and `docs/usage.md` from the source commit used to assemble it; previously published releases retain their own copies.

To build or inspect the distribution, see [source acquisition](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/source-acquisition.md), [browser builds](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/build.md) and [packaging](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md).

## Contributing

This repository uses agent-assisted development, automated verification and human review. See [AGENTS.md](https://github.com/at-rama/sqlite-vector-wasm/blob/main/AGENTS.md) and the [development standards](https://github.com/at-rama/sqlite-vector-wasm/tree/main/.42p/standards).

## License

Project-authored code and documentation use [Apache-2.0](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE), also identified by the npm `license` field. Bundled upstream components retain their own terms: see [NOTICE](https://github.com/at-rama/sqlite-vector-wasm/blob/main/tools/package/NOTICE.txt) and the full texts in the package's `licenses/` directory.

Built on [SQLite](https://sqlite.org/) and [sqlite-vec](https://github.com/asg017/sqlite-vec).
