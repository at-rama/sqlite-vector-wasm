# A-build Apply execution account

## Identity and conditions

Execution on 2026-10-17, implementation commit `5a6dfe1e351b5f70ac86888299e90a61f18f39d5`. This is an account of newly observed executions, not published raw logs or downloadable runtime artifacts. Primary handoffs, logs and browser inventories remain in the executing temporary workspace; they are not committed. No earlier archived PASS is reused as evidence for this composition.

The isolated checkout `/tmp/reproduce-build68` started at planning commit `2f0a9f9feb3ce8afc2b03befe0060920805d8db0`, without installed harness npm/tool/product state. Pinned installation, identity check, locked dependencies and browser smoke ran there with the initially empty external tool directory `/tmp/build68-clean-sdk`. The checkout then advanced cleanly to the implementation commit before product construction. Harness sources and locks are byte-identical between these commits. Diagnostic builds ran separately in `/tmp/apply-build68`; before reproduction, `emcc --clear-cache` removed the compiler cache they had populated. The reproduction checkout had no previous source/build outputs. Both compositions and both references acquire distinct fresh trees; the second construction reuses the already verified tool installation and compiler cache, not earlier product/source outputs.

Observed host: Linux 6.18.55 x86_64; cc Ubuntu 13.3.0; GNU Make 4.3. Qualified tools: Emscripten 4.0.23 (`7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed`), SDK Node 24.19.0, npm 11.17.0, WABT 1.0.42, wasm-opt 125 (`version_125-81-gf4138bbbe`), Chrome 153.0.8010.12 and locked playwright-core 1.63.0. Tool installation/check/deps exited zero; smoke passed 1/1. The host label is not an immutable OS image.

## Executed commands

From the isolated checkout, with `HARNESS_STATE=/tmp/build68-clean-sdk` exported:

```sh
bash tools/harness.sh install
bash tools/harness.sh check
bash tools/harness.sh deps
bash tools/harness.sh smoke
# After cleanly checking out the implementation commit:
bash tools/harness.sh exec emcc --clear-cache
bash tools/build.sh > /tmp/build68-repro-vec.json
bash tools/build.sh --lock inputs/sqlite-vector.sources.lock.json > /tmp/build68-repro-vector.json
bash tools/harness.sh exec node tools/build/check.mjs /tmp/build68-repro-vec.json
bash tools/harness.sh exec node tools/build/check.mjs /tmp/build68-repro-vector.json
```

Both construction commands exited zero. Their stdout parsed as the complete atomic handoff, matching the handoff file; eleven nonempty regular runtime assets had matching sizes/SHA-256. Configure was `env CC=cc CC_FOR_BUILD=cc CXX=/bin/false ./configure --enable-all`, followed by `make sqlite3.c`. Common browser arguments were `b-vanilla b-esm b-bundler emcc_opt=-Oz`. Engine-specific bridge/object inputs are additional inputs, with no upstream compiler/export replacement.

The unchanged `tools/package/package.mjs` `validateBuild()` was also executed against the real default handoff and accepted its provenance and all eleven assets. This checks the retained downstream handoff convention; no Vector package, notices, npm publication or final-package acceptance was performed.

## Source identities and nonmodification

Both locks retain SQLite 3.54.0, archive SHA3-256 `a5c29342ca185abcda332448fbb27c536661245be27e20199b46c49099b0e15e`. Default sqlite-vec 0.1.9 archive SHA-256 is `3acd67cb4aff080c7050926fd3cf8227905fe5b7ee3829d8ee5024ab1283cf61`. SQLite-Vector 1.1.2 is release `387102049`, tag `1.1.2`, commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`, archive SHA-256 `b44a759233bdc9a502bf2407972608d13dd6e60a31b4b03c2d4ae4b6b04f03c7`. Source-lock SHA-256: default `29bd2007a91eecc7810814c76e911792c18507942b980f51b4280ff12afaeb8d`, Vector `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`.

After both builds, a temporary Python zipfile/tarfile comparison read the original archive bytes and compared every original regular SQLite file with its constructed-tree counterpart: **2,284 files per build, zero changed/missing**. Both sqlite-vec archive files matched. All **18** files in the acquired Vector extension-only view matched their archive entries. The Vector archive's other directories, including bundled SQLite, are not consumed. Newly generated SQLite/build outputs are additions, not upstream source edits. The raw comparison result is `/tmp/build68-sources.json` and its temporary script is `/tmp/build68-verify-sources.py`; neither is a durable evidence link.

For repeatable identification, original-file manifests use sorted `[relative-path, sha256(bytes)]` pairs serialized with Python `json.dumps(..., separators=(',', ':'))`, then SHA-256. Observed manifest digests: SQLite `fb9ba172e7858e10d81b80e28e411cd86f726978d2eebefa28b05463e4393172`; sqlite-vec `42a350aee8dd87564bc104b1e5d837f5de131d1ef44cc0e84ef33ef8be4dca41`; Vector `01897d4ee5eb9125295fee8345e7ca238c7aeba3179ff617a4b851b5e304fe93`.

## Integration observations

The initial diagnostic failed with seven implicit-declaration errors for `strcasecmp`/`strncasecmp`. Supplying the system header with `-include strings.h` fixed these without editing upstream or suppressing warnings. A second diagnostic reached the official recipe but its lazy `MAKEFILE_LIST` resolution pointed to the generated include's directory. Adding `MAKEFILE := GNUmakefile` in that include preserved the original recipe location. A GNU Make fixture now executes that exact directory-resolution case. These are retained build-glue adjustments within the selected seven-unit approach, not an SDK upgrade, amalgamation or upstream patch.

All seven Vector units compile with `-Oz -std=c99 -fPIC -DSQLITE_CORE -DSQLITE_WASM_EXTRA_INIT -include strings.h`, canonical generated SQLite, extension `src` and `libs` include paths. Their objects link through the generated include after the official GNUmakefile. Reproduction integration hashes (paths are invocation-specific): bridge `e74f0d3a0fb12d315e52f75355174e26aadc797f053fe9a626e1902db908d8ff`; Make include `06d391bdf9972ab43e0f6f7952efdd981cb485e9eb2074eaaea310929c39b0fb`. The handoff records each actual compile/link argument and the selected template hash.

A separate controlled native fixture also passed: compile the real generated SQLite 3.54.0 core plus the unchanged Vector bridge against its real header, substituting only a test `sqlite3_vector_init` callback that returns `SQLITE_ERROR`. Calling `sqlite3_wasm_extra_init(0)` registered successfully; the following `sqlite3_open(":memory:")` returned `SQLITE_ERROR` with “automatic extension loading failed”. This exercises SQLite's connection-failure propagation separately from the bridge registration-return fixtures. Temporary source/binary/log: `/tmp/build68-open-failure.{c,log}` and `/tmp/build68-open-failure`; compile arguments were `cc -DSQLITE_CORE -DSQLITE_THREADSAFE=0 -DSQLITE_OMIT_LOAD_EXTENSION -I<canonical-sqlite> -I<vector-src> <generated-sqlite3.c> <unchanged-bridge.c> <fixture.c> -lm -o <fixture>`. This native callback fixture is not an actual Vector/WASM product failure injection. Source examination of `src/main.c` at `sqlite3AutoLoadExtensions(db)` and `src/loadext.c` at the `xInit` return check confirms the same retained mechanism.

## Lightweight checks and boundaries

On the implementation tree: `sh tools/check-repository.sh` passed; `sh tools/test-repository.sh` passed **333 tests** (108 Python, 225 Node, including 44 A-build tests), zero failed/skipped; pinned `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict` passed **13 items**. Existing informational long-requirement notices are not failures. Verification repeats applicable repository checks against its own committed candidate.

Diff inspection against proposition and main identifies only the Change artifacts, `docs/build.md`, `tools/build.sh` and `tools/build/` additions/modifications. Both source locks, `inputs/release.json`, harness/SDK locks and package/acceptance/Updates/Watch/release/Site implementations remain byte-identical. The default vec template and common build config remain unchanged. This bounded examination does not establish other allocation units' conformity or release readiness.

## Browser execution and remaining limits

The raw-browser reference/candidate observations and asset identities follow below. These controls share repository-authored options, probes, harness and agentic authorship. Separate fresh source trees, runtimes and public API calls expose regressions but cannot eliminate correlated errors in shared checks. Successful examples establish the examined pinned pair/browser/contexts; they do not qualify arbitrary future releases or every browser/bundler. Published prerelease suffix preservation is covered by fixed offline fixtures and exact-version probe logic, not a real prerelease browser build in this execution.

Full final-package Float32/binary/Hamming oracles, persistence across runtime shutdown/reopen, notices and publication remain with A-package/A-acceptance/A-release. Raw VFS read/write tests here do not substitute for that acceptance.

## Observed complete browser results

Both raw check commands exited zero. Each constructed a fresh SQLite-only reference from its candidate’s selected lock. Reference lock/SQLite identities, emcc/Node identities, configure and common WASM options matched. The two references independently produced an 879,114-byte WASM, SHA-256 `765633531bd06304d56fa5df62b5216e4dd1135242de1704f90a100e86dadb14`. Original SQLite archive-byte comparison also passed for all 2,284 files in each reference tree (zero changed/missing).

For each of the four runtimes (two candidates, two references), all three modes passed main, direct Worker, Worker1 and promiser: twelve transport contexts per runtime. Candidate C and OO1 independent connections, Worker1 and promiser reported the exact selected version and no other engine; native queries returned nearest row 1 at distance 0 and, where top-2 is asserted, row 2 at 1.4142135381698608 (within 1e-5 of sqrt(2)). No consumer dynamic registration is used. BigInt and FTS5, main-thread kvvfs read/write, Worker OPFS/opfs-wl/sahpool read/write and unavailable main-thread OPFS failure checks passed in the direct probes.

All 84 context/category inventory-inclusion comparisons passed (six main/direct-Worker contexts × seven categories × two candidate/reference pairs). Main C API keys: 668; Worker C API keys: 666; OO1 keys: 3/5; DB prototype methods: 21; WASM exports: 267. Reference SQL functions: 177; sqlite-vec: 195; Vector: 198. Reference compile options: 59; both candidates: 60. The finite inventories and operation probes support this examined baseline, rather than proving every possible upstream behavior.

Both candidates also passed all four negative companion cases: missing WASM, missing ESM Worker1, missing OPFS async proxy and corrupt WASM (eight cases in total). An intentional bounded failure-to-initialize on bad WASM is treated as the expected negative result, never as successful initialization.

Primary results (temporary, not remote links): sqlite-vec `.work/build-check/run-wLXeqA/checks.json`; Vector `.work/build-check/run-SwuqmQ/checks.json` in `/tmp/reproduce-build68`. Each includes reference provenance and complete expected/actual inventories; handoffs remain `/tmp/build68-repro-vec.json` and `/tmp/build68-repro-vector.json`.

## Observed runtime sizes and SHA-256

These are uncompressed bytes from the clean constructions, not benchmark or product-release claims. Both references have 879,114-byte WASM; observed marginal WASM sizes are 76,186 bytes for sqlite-vec and 63,900 bytes for Vector under this configuration. Reproduction does not require identical bytes.

| Composition | Asset | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| sqlite-vec 0.1.9 | `sqlite3.js` | 830239 | `3033b34ae531e0ef7c663d524c30933d54dd2bf6f5e217c7c6eb722da5a6fe0b` |
| sqlite-vec 0.1.9 | `sqlite3.mjs` | 828762 | `854a653f3540606afeb905e01d2861a77b5afca95040827b2e35abc975967006` |
| sqlite-vec 0.1.9 | `sqlite3-bundler-friendly.mjs` | 825290 | `04a2b3edfebe03751c7531016a72d2c5b5a1c9ca22a36dae47f47a61f048e653` |
| sqlite-vec 0.1.9 | `sqlite3.wasm` | 955300 | `12941218d72f8a26f288193dc55b26e2753354f8d110b9711e814c5d53c0e69f` |
| sqlite-vec 0.1.9 | `sqlite3-worker1.js` | 1791 | `131a835d991f750ab5090a9617bf06f586c42301d9648f7d2f887b275365713c` |
| sqlite-vec 0.1.9 | `sqlite3-worker1.mjs` | 1499 | `aeeb5f492b283a00fe275bd667711031c72b5acc45b06483b527d62f6f9cc28b` |
| sqlite-vec 0.1.9 | `sqlite3-worker1-bundler-friendly.mjs` | 1516 | `c043fcfadc1ded8e248ef032a27b6fcda4d66f9eee4b2a27acba02b85d17764f` |
| sqlite-vec 0.1.9 | `sqlite3-worker1-promiser.js` | 12908 | `a8ad8b0b053515fb8bb4846edd2f36dfda6ec7ac80b726c081c339906f2f99e5` |
| sqlite-vec 0.1.9 | `sqlite3-worker1-promiser.mjs` | 12675 | `3e72060ed48c77495472ca8f331c289240ed694761377ed80142b97c94791aec` |
| sqlite-vec 0.1.9 | `sqlite3-worker1-promiser-bundler-friendly.mjs` | 12692 | `f0b85e6e08abc012f071bd40e44d9b07f30cc00799fde113270569991d548c99` |
| sqlite-vec 0.1.9 | `sqlite3-opfs-async-proxy.js` | 41745 | `d068ff39746de03642d60a1479b4c284e11bf69ef8d097c4da1b75983c9b0ca9` |
| Vector 1.1.2 | `sqlite3.js` | 829948 | `4d288658b0e616181387a6d0e4549c282562ddb1df9564e052eb0221f93b6af5` |
| Vector 1.1.2 | `sqlite3.mjs` | 828471 | `0f4b89be7246df20c3c16e1ea38fb76ed6a82295016499fea64531d95581b204` |
| Vector 1.1.2 | `sqlite3-bundler-friendly.mjs` | 824999 | `46d7d9e237bd44022da35b7185bf7ff2a880a10b7878b4ccf14512b467989845` |
| Vector 1.1.2 | `sqlite3.wasm` | 943014 | `020dc67ad711674b98f7621262054653e8692b9dc1e656298735b356cb488284` |
| Vector 1.1.2 | `sqlite3-worker1.js` | 1791 | `131a835d991f750ab5090a9617bf06f586c42301d9648f7d2f887b275365713c` |
| Vector 1.1.2 | `sqlite3-worker1.mjs` | 1499 | `aeeb5f492b283a00fe275bd667711031c72b5acc45b06483b527d62f6f9cc28b` |
| Vector 1.1.2 | `sqlite3-worker1-bundler-friendly.mjs` | 1516 | `c043fcfadc1ded8e248ef032a27b6fcda4d66f9eee4b2a27acba02b85d17764f` |
| Vector 1.1.2 | `sqlite3-worker1-promiser.js` | 12908 | `a8ad8b0b053515fb8bb4846edd2f36dfda6ec7ac80b726c081c339906f2f99e5` |
| Vector 1.1.2 | `sqlite3-worker1-promiser.mjs` | 12675 | `3e72060ed48c77495472ca8f331c289240ed694761377ed80142b97c94791aec` |
| Vector 1.1.2 | `sqlite3-worker1-promiser-bundler-friendly.mjs` | 12692 | `f0b85e6e08abc012f071bd40e44d9b07f30cc00799fde113270569991d548c99` |
| Vector 1.1.2 | `sqlite3-opfs-async-proxy.js` | 41745 | `d068ff39746de03642d60a1479b4c284e11bf69ef8d097c4da1b75983c9b0ca9` |
