# sqlite-vector-wasm

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE)
[![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/wasm)
[![sqlite-vec](https://img.shields.io/badge/sqlite--vec-integrated-00897B)](https://github.com/asg017/sqlite-vec)
[![CI](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml/badge.svg)](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml)

**SQLite for the browser, with vector search built in.**

sqlite-vector-wasm distributes SQLite's browser WebAssembly runtime with [sqlite-vec](https://github.com/asg017/sqlite-vec) statically integrated. Vector search is available in every new connection, without compilation or extension registration by consumers. It retains SQLite's upstream browser APIs rather than introducing a new database wrapper.

## Quick start

Install the browser assets:

```sh
npm install @at-rama/sqlite-vector-wasm
```

Serve **all eleven runtime files** from the package at a common URL prefix, for example `/sqlite/`. npm installs the assets but does not configure a browser server or expose a root initialization API. Serve `.js` and `.mjs` as JavaScript, and `.wasm` as `application/wasm`.

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

The package also includes conventional script and Worker loaders, Worker1/promiser entries and supplied bundler-friendly variants. See the [short usage guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/usage.md) for practical SQL, vector, Worker and persistence examples.

## Features

- SQLite's JavaScript, ES module, C-style and OO1 browser APIs.
- Float32 vector similarity search with sqlite-vec (`vec0`).
- Binary vectors and Hamming-distance search.
- Full-text search through SQLite FTS5.
- Web Worker support, including Worker1 and its promise interface.
- Browser persistence through OPFS when supported and correctly hosted.
- Static sqlite-vec integration: no runtime extension loading.

## Browser requirements and boundaries

Target modern browsers with the required WebAssembly and JavaScript support. Keep all WASM, Worker, promiser and OPFS companion assets together when deploying the runtime. OPFS requires a secure context and Workers; some persistent VFS modes additionally require cross-origin isolation. An unavailable requested persistent VFS does not silently fall back to in-memory storage.

The package preserves upstream SQLite/sqlite-vec behavior. It does **not** provide a Node.js, native or WASI runtime, a root JavaScript wrapper, or guaranteed compatibility with every bundler. Consult the [usage guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/usage.md) and [SQLite browser documentation](https://sqlite.org/wasm/doc/trunk/api-index.md) for details.

## Distribution and source

- [npm package](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm)
- [GitHub Releases](https://github.com/at-rama/sqlite-vector-wasm/releases)

Each distributed archive contains `runtime.json`, recording the selected SQLite and sqlite-vec versions, source digests, runtime files and build options. The package includes byte-identical copies of this README and `docs/usage.md` from the source commit used to assemble it; previously published releases retain their own copies.

To build or inspect the distribution, see [source acquisition](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/source-acquisition.md), [browser builds](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/build.md) and [packaging](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md).

## Contributing

This repository uses agent-assisted development, automated verification and human review. See [AGENTS.md](https://github.com/at-rama/sqlite-vector-wasm/blob/main/AGENTS.md) and the [development standards](https://github.com/at-rama/sqlite-vector-wasm/tree/main/.42p/standards).

## License

Project-authored code and documentation are licensed under [Apache-2.0](https://github.com/at-rama/sqlite-vector-wasm/blob/main/LICENSE). The distribution also includes upstream code under its own terms. **See [NOTICE](https://github.com/at-rama/sqlite-vector-wasm/blob/main/tools/package/NOTICE.txt) for bundled-component licensing**, with the full third-party texts in the package's `licenses/` directory. The npm `license` field identifies the project's Apache-2.0 license; it does not replace those upstream licenses.

Built on [SQLite](https://sqlite.org/) and [sqlite-vec](https://github.com/asg017/sqlite-vec).
