# Apply execution account — partial implementation

## Outcome and boundary

Implementation `c9c33ad928f975dc4fd96c88f0d462c22646c7fa` assembles both retained
compositions and passes their extracted-package browser matrices. Apply stopped
on an established downstream compatibility conflict; **3/8 tasks are complete**
(1.2, 1.3, 2.1). This is not complete A-package realization or release acceptance.
Task 2.2 explicitly requires failures to block rather than expanding scope.

No source lock, release descriptor, harness, A-build, downstream implementation,
root README, root usage guide, Capture, Allocation or synchronized spec was edited.
No publication, merge, archive or upstream patch was attempted.

## Actual construction and packaging

On 2026-10-17 UTC, `/tmp/package69-repro` began at proposition commit
`335a4ff07e531f28e28e3bcf67c57cccaa5371b4`, with empty `.work`, npm dependency
and product state; `/tmp/package69-sdk` was also new. From that checkout:

```sh
export HARNESS_STATE=/tmp/package69-sdk
bash tools/harness.sh install
bash tools/harness.sh check
bash tools/harness.sh deps
bash tools/harness.sh smoke
bash tools/build.sh > /tmp/package69-vec-build.json
bash tools/build.sh --lock inputs/sqlite-vector.sources.lock.json > /tmp/package69-vector-build.json
```

All returned zero. Tool smoke checked the harness only. The checkout then moved
cleanly to implementation `c9c33ad928f975dc4fd96c88f0d462c22646c7fa` through the
GitHub-created commit before packaging. Build/harness/locks were byte-unchanged
between those commits; these were fresh product builds, not old runtime reuse.
The second build could reuse the newly populated SDK compiler cache. Runtime
rebuild byte reproducibility across independent hosts was not established.

For each `ENGINE=vec` and `ENGINE=vector`, the following actual commands returned zero:

```sh
bash tools/package.sh --build-handoff /tmp/package69-${ENGINE}-build.json \
  --name sqlite-vector-wasm-fixture --version 0.0.0-${ENGINE} \
  > /tmp/package69-${ENGINE}-package.json
bash tools/harness.sh exec node tools/package/check.mjs \
  /tmp/package69-${ENGINE}-package.json
```

Before both check invocations, `.work/inputs` and `.work/build` were renamed to
unavailable paths. They were restored only after both checks finished. Package
checks performed their own fresh extraction, local `npm install --offline
--ignore-scripts`, consumer subpath resolution and HTTP hosting at `/runtime/`.
Their all-file and archive hashes were unchanged afterward. Neither fixture name
nor version was published. Each archive has 11 runtime assets and 29 total files.

Observed environment: Linux 6.18.55 x86_64; Ubuntu GCC 13.3.0; GNU Make 4.3;
Emscripten 4.0.23 (7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed); Node 24.19.0;
npm 11.17.0; WABT 1.0.42; Binaryen 125; Chrome 153.0.8010.12. Configure was
`env CC=cc CC_FOR_BUILD=cc CXX=/bin/false ./configure --enable-all`; amalgamation
`make sqlite3.c`; WASM targets `b-vanilla b-esm b-bundler emcc_opt=-Oz`.
Vector added the seven source-specific commands and Make include defined in
`tools/build/build.mjs`; no source patch or runtime loader modification occurred.

| Actual fixture | sqlite-vec | SQLite-Vector |
| --- | --- | --- |
| Upstream | 0.1.9 | 1.1.2, commit 0c2223ada9dce1fa33248c8835a15f51d9a0f655 |
| SQLite | 3.54.0 | 3.54.0 |
| WASM bytes | 955300 | 943014 |
| WASM SHA-256 | 037467b953545840774a31e72b6c62df32a27d443e72cf306e8b21ec45e73d47 | 020dc67ad711674b98f7621262054653e8692b9dc1e656298735b356cb488284 |
| Archive bytes | 1166016 | 1164681 |
| Archive SHA-256 | 47a183c6b910ece83d8c853d3d89fdbcd0dbede0e38b7c14a2776270b92ff260 | 5bbfd06710615e734d6139d5ed519fb2fe9412620ebd20086b9d0e636aceb275 |
| Twelve positive contexts | passed | passed |
| Four negative companions | passed | passed |
| Packaged asset responses | 51, all local prefix/status 200 | 51, all local prefix/status 200 |
| Final-file/archive hashes | unchanged | unchanged |

Each composition exercised main C/OO1 and direct Worker, Worker1 and promiser
through conventional/ESM/bundler modes. Native queries returned ids 1 then 2 at
distances 0 and sqrt(2); version was exactly `v0.1.9` or `1.1.2`, with the other
engine absent. Main/Worker probes also checked BigInt, FTS5, kvvfs and explicit
unavailability of main-thread OPFS; Workers exercised opfs, opfs-wl and installed
SAH pool. Loopback HTTP had COOP same-origin and COEP require-corp, secure context,
Web Locks and Atomics.waitAsync. The negatives actually requested absent WASM,
ESM Worker1 and OPFS proxy (404), and corrupt WASM (200), then observed the target
capability fail. A bounded upstream initialization hang counts as unavailable,
not as successful initialization. These observations establish packaging usability
in these conditions, not full Hamming, restart persistence or production CI acceptance.

Source archive digests and origins remain in the unchanged recorded locks.
Default lock SHA-256 is
`29bd2007a91eecc7810814c76e911792c18507942b980f51b4280ff12afaeb8d`;
Vector lock is `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`.
`runtime.json` contained no original checkout path; raw build handoffs retained
actual commands. Compact `inputs.sqlite`/`inputs.sqliteVec` default fields and
separate Vector identity were inspected. Selected/common document bytes matched
the controlled mapping. Final inventories hash every document, notice and metadata
file, in addition to the unchanged runtime inventory.

## Notice provenance actually examined

The acquired Vector archive's `LICENSE.md` exactly matched the shipped Apache
text (SHA-256 `421717de661f6707b9829bd7d459994af9fc5c7b400335da822a817ffd8a42a1`).
Its three incorporated FP16 files were compared byte-for-byte to
`Maratyszcza/FP16` commit `98b0a46bce017382a6351a19577ec43a715b6835`:

- `fp16.h`: Git blob `95fa0c2de8c0bbc76a0927304f20160737cb9f7b`.
- `bitcasts.h`: `1de8d24297a0455f638f8ea552c236c4921d9f55`.
- `macros.h`: `4018b0c9d0f87a29a7f2f4e7e40a29eb17103898`.

That exact revision supplies the included MIT license with Facebook, Georgia
Institute of Technology and Google copyright notices. Controlled origins, source
and shipped digests and header identities are in `tools/package/notices.json`.
Each archive selected ten applicable upstream notices, without attribution of the
other engine. Embedded runtime bytes remained unchanged. This examines the pinned
incorporated files, not every possible future upstream dependency.

## Failures and uncompleted work

**F1 — publication document/inventory conflict.** `tools/release/run.mjs`,
`acceptedPayload`, still compares extracted README/usage with the root files and
reconstructs a fixed inventory without `docs/browser.md`. New engine-specific
sources intentionally differ from those unchanged transitional Site inputs. A
read-only control invoked the real `acceptedPayload` on the actual vec archive
and observed `Published README.md differs from source revision`. Its acceptance
envelope was synthetic solely to reach this byte check; it was not an acceptance
result, and no publication adapter was invoked. Even aligning the two root files
would not solve the fixed inventory/common-file conflict and would violate the
chosen transitional Site boundary. Required action: explicitly revise the
realization scope/dependency for publication's selected-document consumption,
then cover it, rather than weakening the byte checks or editing A-release here.

**F2 — original build-file dependency.** New annotated `validateBuild` reads the
generated bridge and Vector Make include. `acceptedPayload` reuses that function
when original build paths may already be gone. A read-only default-handoff control
renamed the build directory and observed ENOENT for `extra-init.c` despite intact
extracted runtime bytes. This is an implementation gap in the preserved downstream
contract. Required correction before renewed verification: distinguish raw build
consumption validation from revalidation of already consumed/identified package
provenance, retaining stale-input detection without requiring deleted build files.
No correction was made after the stop.

**F3 — existing release fixture setup.** The registered release suite's fixture
copies only root README/usage, so 16/39 tests fail at missing selected docs before
reaching their intended assertions. Fixtures need the new controlled inputs after
F1 is resolved; merely changing fixtures or suppressing these failures would not
repair the real conflict demonstrated above.

Tasks 1.1/1.4/2.2/3.1/3.2 remain unchecked: raw validation, metadata and real-archive
work is substantially implemented, but their complete compatibility/evidence
requirements cannot be closed. The requested post-Apply Verification must report
these failures rather than treating partial successes as complete realization.

## Tests actually executed before Verification

- `sh tools/check-repository.sh`: passed.
- `sh tools/test-repository.sh`: failed. Gate Python 44/44, inputs Python 47/47,
  build Node 44/44, package Node 17/17 and acceptance Node 15/15 passed; release
  Node 23/39 passed, 16 failed. The canonical script stops there.
- Remaining suites run separately to expose their actual state: Updates Node
  27/27, Updates Python 6/6, Watch Node 51/51, OpenSpec Python 11/11 and Site Node
  37/37 passed. This does not turn the failed canonical command into a pass.
- `OPENSPEC_TELEMETRY=0 sh ../tools/openspec.sh exec validate --all --strict`, run
  from `.42p`: passed.

## Evidence availability and dependencies

This is an authored execution account, not raw output. At report preparation the
primary build/package/check handoffs, tarballs and full logs remained accessible
under `/tmp/package69-repro/.work` and `/tmp/package69-*.{json,log}`. They are
transient, uncommitted and have no durable public artifact URL. In particular the
browser results are `package-check/run-mVpIDU/checks.json` (vec) and
`package-check/run-wl2fKE/checks.json` (Vector). Future readers may have only this
account and must reproduce the commands rather than assume raw artifacts remain.

The final-archive browser observations cross the actual package's public surface
and inspect real HTTP requests, separate from assembly's own byte assertions.
They share repository-authored harness, build/probe definitions and agentic
authorship; this is not independently authored acceptance. The stopped release
suite and explicit downstream controls are contrary evidence, not optional scope
exclusions. Source/build checksum continuity permits reuse of these exact Apply
observations for the unchanged implementation; it does not qualify a later fix.
