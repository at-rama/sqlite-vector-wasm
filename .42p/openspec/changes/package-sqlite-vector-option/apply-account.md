# Apply execution account

## Renewed repair and completion

On 2026-10-18 the maintainer authorized “Tu peux réparer et poursuivre”. Implementation
`8f20d4df5c9562526b0a414114298cbce1de1e58` resolves the stopped payload-consumption
boundary without changing release policy. All eight tasks are complete on the
renewed evidence below. This account is an authored execution record, not a raw
log, full-product acceptance result or publication authorization.

### Construction, tools and commit continuity

`/tmp/repair69-repro` and `/tmp/repair69-sdk` began new, without product outputs,
SDK, browser dependencies or npm state. A clean temporary worktree at
`f3bdf97f50d0f89c01db734148f1145a26ee2086` bootstrapped the pinned toolchain:

```sh
export HARNESS_STATE=/tmp/repair69-sdk
bash tools/harness.sh install
bash tools/harness.sh check
bash tools/harness.sh deps
bash tools/harness.sh smoke
bash tools/build.sh > /tmp/repair69-vec-build.json
bash tools/build.sh --lock inputs/sqlite-vector.sources.lock.json > /tmp/repair69-vector-build.json
```

All returned zero. The checkout advanced to `8f20d4df5c9562526b0a414114298cbce1de1e58`
around the first build's launch/tool-identity queries; source locks, acquisition,
A-build/config/templates, harness and dependency pins are byte-unchanged between
those commits. Packaging and final checks used the clean corrected checkout.
This discloses the commit transition rather than treating the first launch as a
single-snapshot rebuild. Both invocations acquired and constructed fresh sources;
no original attempt's runtime or archive was reused. Vector could reuse the newly
populated compiler cache. No byte-identical cross-host reconstruction is claimed.

Observed tools: Linux 6.18.55 x86_64; Ubuntu GCC 13.3.0; Make 4.3; Emscripten
4.0.23 (`7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed`), Node 24.19.0, npm
11.17.0, WABT 1.0.42, Binaryen 125 and Chrome 153.0.8010.12. Configure remained
`env CC=cc CC_FOR_BUILD=cc CXX=/bin/false ./configure --enable-all`; amalgamation
`make sqlite3.c`; WASM `b-vanilla b-esm b-bundler emcc_opt=-Oz`. Vector used the
seven C object commands and extra Make include in unchanged `tools/build/build.mjs`.
No upstream source, loader or harness patch was introduced.

### Fresh final packages and checks

For each `ENGINE=vec` and `ENGINE=vector`, these commands returned zero:

```sh
bash tools/package.sh --build-handoff /tmp/repair69-${ENGINE}-build.json \
  --name sqlite-vector-wasm-fixture --version 0.0.0-${ENGINE} \
  > /tmp/repair69-${ENGINE}-package.json
bash tools/harness.sh exec node tools/package/check.mjs \
  /tmp/repair69-${ENGINE}-package.json
bash tools/harness.sh exec node /tmp/repair69-real-payload.mjs ${ENGINE}
```

Before both final check sequences, `.work/inputs` and `.work/build` were renamed
to unavailable paths; they were restored only after all four commands finished.
Each actual tarball was freshly extracted and installed with npm offline, scripts
disabled and explicit subpaths checked. Browser fixtures served only extracted
companions at `/runtime/`, with COOP same-origin and COEP require-corp; loopback
HTTP was secure/cross-origin isolated, with Web Locks and Atomics.waitAsync.

Both compositions passed conventional/ESM/bundler main C/OO1, direct Worker,
Worker1 and promiser: twelve contexts each. They checked exact selected versions,
absence of the other engine and native deterministic neighbors. Main/Worker probes
also checked BigInt, FTS5, kvvfs and conditional opfs/opfs-wl/installed SAH pool;
main-thread OPFS requests remained explicitly unavailable. Each archive's eleven
assets were requested only under its local runtime prefix (51 successful runtime
responses). Four negatives actually requested absent WASM, ESM Worker1 and OPFS
proxy (404), and corrupt WASM (200), then observed unavailable target capability.
A bounded upstream initialization hang was failure to initialize, not success.
All 29 extracted file hashes and each archive hash were unchanged after checks.

The temporary `repair69-real-payload.mjs` called the real `acceptedPayload` with
each actual archive and exact raw build/package handoffs after cleanup. Its
acceptance envelope was deliberately synthetic, using the existing contract's
stage/case names solely to reach payload guards; no publication adapter ran and
no real A-acceptance verdict is claimed. Both calls passed complete selected-source,
metadata, runtime, notice and inventory validation. The same script loaded ESM from
the separately extracted package and executed the exact SQL code block from its
shipped `docs/usage.md` through OO1. Both returned `[[1,0],[2,1.4142135381698608]]`.
This directly checks the new guides, not merely a similar probe query.

| Measured identity/result | sqlite-vec fixture | SQLite-Vector fixture |
| --- | --- | --- |
| SQLite | 3.54.0 | 3.54.0 |
| Engine | 0.1.9 | 1.1.2 / 0c2223ada9dce1fa33248c8835a15f51d9a0f655 |
| Archive bytes | 1166009 | 1164706 |
| Archive SHA-256 | 4a4e654b791859ccc4203f37ca35570f2f6b937fc70c5c02cfefdc2d65a4f297 | 81e6eb5d8552f91fc5b5612e093774e086fb326849a71d313a5dfb57dcb2ff95 |
| WASM bytes | 955300 | 943014 |
| WASM SHA-256 | 2673d71618a1e44d3a2fb958fa421d08a8c4067d22b6258eb1788aeb68f4ebd4 | 020dc67ad711674b98f7621262054653e8692b9dc1e656298735b356cb488284 |

The package names are explicitly nonpublished fixtures. Compact default input
objects, distinct `inputs.sqliteVector`, source origins and all portable recorded
commands were inspected; no original checkout path remains in `runtime.json`.
Actual command paths remain in raw handoffs bound by `buildHandoffSha256`.
New-name/version tests assemble fresh independent tarballs and retain runtime bytes;
no qualified archive is relabeled.

### Selected document, notice and metadata identities

The following shipped SHA-256 values were checked against each final inventory;
runtime records and other notice hashes remain in the controlled manifests/raw
handoffs. These describe the new archives, not those from the first attempt.

| Shipped file | sqlite-vec | SQLite-Vector |
| --- | --- | --- |
| README.md | b2f3f4f29b29e304aee8d4edaf2e8666ccf71b93f891e47d83637c101767656a | d8e510d007f518d43380771d61f75a598186b37186ce1bc59b33e0e9dbc94dfd |
| docs/usage.md | d8c313ae4a5bf12c33de072d9f4aba8f880a27c11e17b945c03c03fa607f3644 | 9218ce31cf1fb02348f7a6d12e6cc1638996df6a736b1c016534fd0afdc3a067 |
| docs/browser.md | 0705d1980e7f7d545a6d8cda5a7f3ea4d57e6504a440fb5445cde2c561fbe42d | 0705d1980e7f7d545a6d8cda5a7f3ea4d57e6504a440fb5445cde2c561fbe42d |
| NOTICE | 4915554842879e9f047075c8bd4b930bedbb08f9b14ba80bfb8945744b7fa126 | 5d6b5d0a252bc3c1f2ad760a739ab5dc63f990afc9cb4e967f2134f385b95961 |
| licenses/origins.json | 7b9a1ef5546d7e747f3a14727305106a69c30c2a37b01bf8339177ef5a867072 | 5391a1216fe0575d84b04c65b70164f42cb710949b8f3f95baa5d5de341c433a |
| runtime.json | c34783ffe417e0937500e4854518b1135361730aa28839258ee16a3c043e373c | 96c230cac214a889d5ee89412819519cd3b5b1b638981df023c56a830c650188 |
| package.json | ea9bf38cda0630a2e37c17954c3bf4546db5ab9ed1739c925c5558e5e11dd1b8 | 80d27c5bf11f517cfa9cc9b999561543759d697f761616996773a6ff110dfa39 |

Each archive includes ten applicable upstream notices, common material plus exactly
its selected engine; Vector includes the controlled FP16 MIT text. Embedded runtime
bytes were preserved. The acquired Vector archive's Apache text was compared again
byte-for-byte with `tools/package/notices/sqlite-vector-APACHE.txt`. Its FP16 headers
again matched the recorded Git blobs `95fa0c2de8c0bbc76a0927304f20160737cb9f7b`,
`1de8d24297a0455f638f8ea552c236c4921d9f55` and
`4018b0c9d0f87a29a7f2f4e7e40a29eb17103898` respectively. The immutable FP16 MIT
license/revision association is reused from the [first-attempt account](https://github.com/at-rama/sqlite-vector-wasm/blob/471e0e1fc252dfffed02862c1a343e12db787e3d/.42p/openspec/changes/package-sqlite-vector-option/apply-account.md),
“Notice provenance actually examined”: byte comparison to FP16 revision
`98b0a46bce017382a6351a19577ec43a715b6835` and that revision's MIT license. Its old
raw comparison files are unavailable; source-origin/license claims are not newly
independently investigated. Controlled origins and exact notice hashes are unchanged.

### Repository tests and repair dispositions

`sh tools/check-repository.sh` passed. `sh tools/test-repository.sh` returned zero:
341 tests, 108 Python and 233 Node, all passed. Breakdown: gates 44, acquisition 47,
build 44, package 18, acceptance 15, release 41, Updates Node 27/Python 6, Watch 51,
OpenSpec Python 11 and Site 37. Offline tests use system Node 24.19.0/npm 11.9.0,
Python 3.12.14; real product commands use the pinned SDK above. Pinned OpenSpec
preflight and strict validation from `.42p` passed (13/13 items).

The previous F1 conflict is repaired by the authorized selected/common document
consumer and exact reconstructed inventory. F2 is repaired by separate first-use
and retained validation plus the raw-handoff digest binding; removed-input and
stale-provenance fixtures pass. F3's sixteen release fixture failures are fixed
without suppressing byte checks; changed selected/common docs still fail and root
Site docs remain separate. F4 is fixed by the exact fixture name/version in both
Vector guides, with fresh archived guide SQL executed above.

Source locks, release descriptor, harness/SDK, A-build and all other downstream
policy/orchestration/Site implementations are unchanged. The bounded authorized
exception is `acceptedPayload` in `tools/release/run.mjs` and its test inputs/cases;
numbering/channels/triggers/publish adapters remain unchanged. Captures, Allocation
and synchronized specs are untouched. The eight-requirement/twenty-eight-scenario
unit still has 100% semantic coverage each way; this is not full-product acceptance.

### Evidence availability and limits

At completion, new raw logs/handoffs are under `/tmp/repair69-*.{json,log}`;
archives and browser reports are under `/tmp/repair69-repro/.work`. Specific positive
browser reports are:

- vec: `/tmp/repair69-repro/.work/package-check/run-hVc9li/checks.json`.
- vector: `/tmp/repair69-repro/.work/package-check/run-0zADlg/checks.json`.

These raw artifacts are temporary/uncommitted, with no durable public download URL;
future readers may only have this account and need to reproduce. Public-surface
browser/HTTP observations share repository-authored build/probe/harness mechanisms
and agentic authorship; controls use synthetic scaffolding where expressly labeled.
Full binary/Hamming oracles, shutdown/reopen persistence, whole-path production CI
and release authorization remain separately allocated. Current observations do not
qualify every browser or future source pair or assert byte-identical reconstruction.

## Historical first attempt

The [initial account](https://github.com/at-rama/sqlite-vector-wasm/blob/471e0e1fc252dfffed02862c1a343e12db787e3d/.42p/openspec/changes/package-sqlite-vector-option/apply-account.md)
retains the original c9c33ad implementation, its stopped 3/8 progress, old archive
identities and four discovered gaps. The [failed Verification](https://github.com/at-rama/sqlite-vector-wasm/blob/f3bdf97f50d0f89c01db734148f1145a26ee2086/.42p/openspec/changes/package-sqlite-vector-option/verification.md)
remains tied to candidate `471e0e1fc252dfffed02862c1a343e12db787e3d`. Neither is
retroactively labeled successful; the renewed implementation/evidence above replaces
their applicability to the repaired candidate.
