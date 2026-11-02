# Vite consumer example

Build a small browser application that imports the published SQLite-Vector runtime into a dedicated module Worker. The Worker opens an in-memory database, runs the native Float32/L2 query from the Usage guide, closes the connection and returns the result to the page.

The [Usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) explains the integration. This directory contains the complete runnable files rather than another copy of that guide. The runtime is imported through its explicit package subpath; Vite emits its WASM and OPFS proxy automatically. No upstream source modification, asset-copy plugin or root package wrapper is used.

## Reproduce

From the repository root, copy this consumer into the ignored workspace so dependencies and generated output remain outside tracked source:

```sh
mkdir -p .work/vite-example
cp examples/vite/* .work/vite-example/
cd .work/vite-example
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npx --no-install playwright install chromium --only-shell
npm run check
```

Use Node.js 22 or newer, npm and the Chromium system prerequisites. The browser installation uses the Playwright version already installed from the lockfile. `npm run preview` also lets you open the built application at `/vite-example/`; use `npm run dev` for local editing. Change `base` in `vite.config.js` to match another deployment prefix.

Both local servers are configured with COOP `same-origin` and COEP `require-corp`. In-memory operation does not require these headers; they prepare local hosting for OPFS. Production hosting must configure its own response headers. This example does not open persistent storage or provide an application persistence protocol.

## Recorded validation

On 2026-11-02, the production build and its opt-in check passed with sqlite-vector-wasm **0.3.2** (SQLite **3.54.1**, Vector **1.1.2**), Vite **6.4.5**, Playwright **1.56.1**, Chromium Headless Shell **141.0.7390.37**, and Node.js **24.22.1**. The lockfile records the exact package artifacts and transitive dependencies.

The check serves only the built application through Vite preview at `/vite-example/`, observes real browser requests for the hashed Worker and WASM, verifies independently calculated L2 results and runtime versions, checks browser errors and response statuses, observes isolation, and verifies that the emitted WASM matches the published bytes. It writes `check-result.json` next to the copied application and returns nonzero on failure. Run it after building; the command is separate from repository CI and final-package acceptance.

The recorded result covers this in-memory consumer and this browser/build combination. It does not qualify the development server, other bundlers/browsers, Worker1/promisers, OPFS persistence, process crashes or a production host. The package, site demo, existing acceptance checks and release pipeline are unchanged.
