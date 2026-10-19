# SQLite WASM with SQLite-Vector

sqlite-vector-wasm packages SQLite's official browser runtime with SQLite-Vector statically integrated. It preserves the upstream C API, OO1, Worker1, promise wrapper, FTS5 and browser storage interfaces. Vector functions are registered on new connections without dynamic loading.

The enclosed `package.json` and `runtime.json` identify this archive and its exact upstream composition. Use the archive directly for local installation or static hosting; do not infer registry availability from a prepared archive. A published distribution is identified by its matching GitHub Release and npm version.

Use the [composition guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/sqlite-vector/usage.md) for native SQL and the [shared browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md) for loading, Workers and storage. The archive contains these guides at `docs/usage.md` and `docs/browser.md` respectively. Existing sqlite-vec `vec0` tables and `vec_*` queries require explicit adaptation to SQLite-Vector native SQL; no automatic database migration or vector-structure compatibility is promised.

Only explicit runtime subpaths are exported; there is no package-root JavaScript entry point or runtime engine selector.

Project-authored code and documentation use Apache-2.0. Included upstream material retains its own terms; see the archive's `NOTICE`, `LICENSE` and `licenses/origins.json`. Existing embedded runtime notices are preserved.
