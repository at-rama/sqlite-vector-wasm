# SQLite WASM with SQLite-Vector

sqlite-vector-wasm packages SQLite's official browser runtime with SQLite-Vector statically integrated. This composition uses SQLite 3.54.0 and SQLite-Vector 1.1.2. It preserves the upstream C API, OO1, Worker1, promise wrapper, FTS5 and browser storage interfaces. Vector functions are registered on new connections without dynamic loading.

This composition has no published npm release. Examples are exercised through the nonpublished local fixture `sqlite-vector-wasm-fixture@0.0.0-vector` (SQLite 3.54.0, SQLite-Vector 1.1.2); do not install an invented registry version. See the [packaging guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md) for fixture assembly and verification.

Use the [composition guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/sqlite-vector/usage.md) for native SQL and the [shared browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md) for loading, Workers and storage. The archive contains these guides at `docs/usage.md` and `docs/browser.md` respectively. Only explicit runtime subpaths are exported; there is no package-root JavaScript entry point or runtime engine selector.

Project-authored code and documentation use Apache-2.0. Included upstream material retains its own terms; see the archive's `NOTICE`, `LICENSE` and `licenses/origins.json`. Existing embedded runtime notices are preserved.
