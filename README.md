# sqlite-vector-wasm

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/wasm)
[![sqlite-vec](https://img.shields.io/badge/sqlite--vec-integrated-00897B)](https://github.com/asg017/sqlite-vec)
[![CI](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml/badge.svg)](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/repository.yml)

**SQLite for the browser, with vector search built in.**

sqlite-vector-wasm aims to provide a ready-to-use SQLite WebAssembly distribution with statically integrated [sqlite-vec](https://github.com/asg017/sqlite-vec).

It combines SQLite's official browser capabilities with vector search, without requiring users to compile WebAssembly or integrate an extension themselves.

## Features

- SQLite's JavaScript, ES module, C-style and OO1 browser APIs.
- Vector similarity search with Float32 vectors.
- Binary vectors and Hamming-distance search.
- Full-text search with FTS5.
- Web Worker support, including Worker1 and its promise interface.
- Persistent browser storage through OPFS where supported.
- Static integration without runtime extension loading.

The distribution preserves upstream SQLite and sqlite-vec behavior rather than introducing a new database API or vector-search abstraction.

## Browser compatibility

sqlite-vector-wasm targets modern browsers supporting the required WebAssembly and JavaScript capabilities.

Some features, particularly OPFS, depend on browser support, execution context and hosting configuration. See the [browser build documentation](docs/build.md) for details.

Node.js runtimes, native binaries and WASI are outside the project's scope.

## Distribution

The project targets distribution through:

- [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm)
- [GitHub Releases](https://github.com/at-rama/sqlite-vector-wasm/releases)

Releases are intended to include reproducible browser artifacts, identified upstream versions, checksums and build provenance.

Check the release channels for currently available versions.

## Building from source

Builds use versioned, verified upstream sources and reproducible tooling.

See the project documentation for:

- [Source acquisition](docs/source-acquisition.md)
- [Browser builds](docs/build.md)
- [Packaging](docs/packaging.md)

## Contributing

This repository uses agent-assisted development, automated verification and human review.

See [AGENTS.md](AGENTS.md) for repository instructions and [development standards](.42p/standards/) for engineering conventions.

## License

Repository-authored material is licensed under [Apache-2.0](LICENSE).

Upstream components retain their respective licenses and notices.

Built on [SQLite](https://sqlite.org/) and [sqlite-vec](https://github.com/asg017/sqlite-vec).
