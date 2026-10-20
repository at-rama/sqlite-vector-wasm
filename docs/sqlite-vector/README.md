# SQLite WASM with SQLite-Vector

sqlite-vector-wasm packages SQLite's official browser runtime with SQLite-Vector statically integrated. It preserves the upstream C API, OO1, Worker1, promise wrapper, FTS5 and browser storage interfaces. Vector functions are registered on new connections without dynamic loading.

The enclosed `package.json` and `runtime.json` identify this archive and its exact upstream composition. Install version `0.3.0` with `npm install @at-rama/sqlite-vector-wasm@0.3.0`, or serve the runtime assets from its distribution archive.

Read the enclosed [native SQL guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/sqlite-vector/usage.md) and [browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md) for loading, Workers and storage.

Only explicit runtime subpaths are exported; there is no package-root JavaScript entry point or runtime engine selector.

Project-authored code and documentation use Apache-2.0. Included upstream material retains its own terms; see the archive's `NOTICE`, `LICENSE` and `licenses/origins.json`. Existing embedded runtime notices are preserved.
