# Browser APIs, Workers and storage

Serve the package assets together from one directory. Conventional `sqlite3.js` exposes `sqlite3InitModule`; ESM `sqlite3.mjs` and bundler-friendly `sqlite3-bundler-friendly.mjs` export the initializer. Await initialization before opening `new sqlite3.oo1.DB(':memory:', 'c')`. Use the SQLite C bindings through `sqlite3.capi` and `sqlite3.wasm`; integer values beyond JavaScript's safe integer range use BigInt.

```js
import initialize from './sqlite3.mjs';
const sqlite3 = await initialize();
const db = new sqlite3.oo1.DB(':memory:', 'c');
try { console.log(db.selectValue('select sqlite_version()')); }
finally { db.close(); }
```

The import is relative to the served runtime directory. For npm consumers, resolve explicit subpaths such as `@at-rama/sqlite-vector-wasm/sqlite3.mjs`; configure your bundler to copy all companion assets together. Never assume the package root is a loader or that a bundler automatically preserves WASM and Worker URLs.

The three modes have corresponding `sqlite3-worker1` and `sqlite3-worker1-promiser` assets. Keep `sqlite3.wasm`, the Worker loaders, promise wrappers and `sqlite3-opfs-async-proxy.js` alongside the selected loader. Direct Workers must use classic mode for `sqlite3.js` and module mode for `.mjs`. Worker1 supplies message-based database operations; the promiser wraps that protocol. Refer to the [official SQLite JavaScript documentation](https://sqlite.org/wasm/doc/trunk/index.md) for their APIs.

OPFS requires a secure context and suitable Worker support. The `opfs` and `opfs-wl` VFS modes additionally require cross-origin isolation: serve `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. Loopback HTTP is treated as secure for local tests. `opfs` uses the asynchronous proxy; `opfs-wl` also requires Web Locks and `Atomics.waitAsync()`. `opfs-sahpool` is installed through `installOpfsSAHPoolVfs()` and does not require cross-origin isolation. Request a specific VFS explicitly: missing capability must fail instead of silently switching storage. OPFS variants are unavailable on the main thread. `kvvfs` is retained for main-thread key/value storage.

Do not modify loader code or fetch companions from an unrelated runtime version. Missing or corrupted companions prevent the associated capability from initializing. Browser support and application persistence requirements must be checked in the actual deployment; successful loopback checks cover only the documented browser and hosting conditions.
