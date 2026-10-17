# SQLite WASM with sqlite-vec

sqlite-vector-wasm packages SQLite's official browser runtime with sqlite-vec statically integrated. This composition uses SQLite 3.54.0 and sqlite-vec 0.1.9. It preserves the upstream C API, OO1, Worker1, promise wrapper, FTS5 and browser storage interfaces. Vector functions are registered on new connections without dynamic loading.

The published usage reference is `@at-rama/sqlite-vector-wasm@0.2.0` (sqlite-vec 0.1.9). This selected source is also exercised through nonpublished package fixtures.

Use the [composition guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/sqlite-vec/usage.md) for native SQL and the [shared browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md) for loading, Workers and storage. The archive contains these guides at `docs/usage.md` and `docs/browser.md` respectively. Only explicit runtime subpaths are exported; there is no package-root JavaScript entry point or runtime engine selector.

Project-authored code and documentation use Apache-2.0. Included upstream material retains its own terms; see the archive's `NOTICE`, `LICENSE` and `licenses/origins.json`. Existing embedded runtime notices are preserved.
