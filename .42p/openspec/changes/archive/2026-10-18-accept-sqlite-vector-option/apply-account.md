# Apply account — accept-sqlite-vector-option

## Scope and candidate

Allocation unit A-acceptance; proposition `584d5a2cca42b3bea359444fcae777c78c97c7e9`, based on main `7bdea1e20171b1d138fadddfadab97e506a0dc1a`. Implementation candidate `8017abfac719e22799bcafacc0d7e6b05363d5d7` changes acceptance tooling/workflow/tests and contributor documentation only. Source locks, SDK/harness, A-build/A-package, Captures/Allocation and downstream release/Updates/Watch/Site policy implementations are unchanged. Planning coverage and its fourteen qualified forward contributions/twelve reverse requirements remain the map in coverage.md; no semantic requirement revision is made.

The selector is separate from supplied package identity. Actual production validates raw source/build identities, package lock/engine/inventory and raw build-handoff digest, browser composition identity and exact archive applicability. Default metadata-only callers and transport meanings remain preserved. Host-only Float32/Hamming expectations remain unchanged. Native fixture branches use exact queries without quantization; read-only fresh Workers check original schema/ordinary/vector bytes before/after context setup and against committed state. Missing ordinary and binary tables are distinct real negative controls. CI selects two automatic isolated jobs, one selected manual job, preserves site-only rules and the stable acceptance aggregate, and requires artifact upload success.

## Offline executions

`node --test tools/acceptance/tests/*.test.mjs` returned zero: 24/24 tests. `sh tools/test-repository.sh` returned zero: **351 tests**, 108 Python and 243 Node. Breakdown: gates 44, acquisition 47, build 44, package 19, acceptance 24, release 41, Updates Python 6/Node 27, Watch 51, OpenSpec Python 11, Site 37. A final selected-source absence rejection was added and the affected acceptance suite rerun successfully before commit; the other suites' implementation inputs did not change. Synthetic cases exercise selectors, contradictory identities, stage failure, oracle corruption, context mutation/missing vectors and CI aggregate outcomes; they are not real browser evidence.

`sh tools/check-repository.sh` passed. Pinned `OPENSPEC_TELEMETRY=0 sh ../tools/openspec.sh exec validate --all --strict` from `.42p` passed 13/13 items. Raw logs are temporary `/tmp/apply70-acceptance-tests.log`, `/tmp/apply70-all-tests.log`, `/tmp/apply70-strict.log`. The normal test tooling uses the system Node/Python/npm/native compiler; actual product builds run with the qualified pinned harness.

## Real execution records

Two separate clean detached worktrees at implementation candidate 8017abf were created with initially empty tool/npm/source/build/package state. Each invokes the production orchestrator, which installs its own new temporary SDK, locked dependencies and browser rather than using the development installation. Commands:

```sh
# /tmp/apply70-vec
bash tools/acceptance.sh --name sqlite-vector-wasm-acceptance-fixture --version 0.0.0-vec
# /tmp/apply70-vector
bash tools/acceptance.sh --lock inputs/sqlite-vector.sources.lock.json --name sqlite-vector-wasm-acceptance-fixture --version 0.0.0-vector
```

Both commands returned zero. Each passed all nine production stages and all 22 browser cases, including twelve loading/transports, SQLite-only baseline, FTS5, Float32, binary/Hamming, SQL negatives, actual opfs/opfs-wl/opfs-sahpool restart, persistence negatives and final hashes. Source commit stayed `8017abfac719e22799bcafacc0d7e6b05363d5d7`, tree `23a403f71cdfd5df9385f530e40eee24335e166e`, clean at start/end. Raw primary reports are `/tmp/apply70-vec/.work/acceptance/run-e0P90U/acceptance.json` and `/tmp/apply70-vector/.work/acceptance/run-gI14Ea/acceptance.json`; adjacent browser/build/package JSON and logs carry full commands, options and identities. Stdout/progress are `/tmp/apply70-{vec,vector}-{result.json,progress.log}`.

| Local observed identity | sqlite-vec | SQLite-Vector |
| --- | --- | --- |
| Fixture version | 0.0.0-vec | 0.0.0-vector |
| Archive bytes | 1166007 | 1164713 |
| Archive SHA-256 | 87d644b78c6e464ddee937e2929d6404dc29824357a9e30ab54b70c874be652e | f13c924da2bad176cc01526030ad402f53f34b055e28b789f48f214a0a71ef07 |
| WASM bytes | 955300 | 943014 |
| WASM SHA-256 | 0689abe12369060c8d62748a5d6a9eeda1905ed463062f774b335197e2658370 | 020dc67ad711674b98f7621262054653e8692b9dc1e656298735b356cb488284 |
| Source lock SHA-256 | 29bd2007a91eecc7810814c76e911792c18507942b980f51b4280ff12afaeb8d | f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779 |
| Fresh SDK directory | /tmp/sqlite-vector-wasm-acceptance-gbUHdo/tools | /tmp/sqlite-vector-wasm-acceptance-PGBVsj/tools |

Both use SQLite 3.54.0, with vec 0.1.9 or Vector 1.1.2 at `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. Recorded tools: Emscripten 4.0.23 (`7a5d93b50f6a3a35e85a0d2fc9e667b8498e6aed`), Node 24.19.0/npm 11.17.0, WABT 1.0.42, Binaryen 125; Chrome 153.0.8010.12. Local offline system Node 24.19.0/npm 11.9.0/Python 3.12.14. Actual upstream source digests/origins and unchanged configure/wasm/extension commands are recorded in the source locks and raw build JSON; no new flags or source patches were introduced. Host-dependent bytes differ without implying byte-identical rebuilds.

### Browser and persistence observations

Both engines return Float32 `[[1,0],[2,1.4142135381698608],[3,2]]` against independent expectations `0,sqrt(2),2` at tolerance 1e-5. Binary results are `[[1,0],[2,1],[3,2],[4,3],[5,4]]`, exact Hamming with no ties or quantize/preload calls. FTS5 returns `[1,3]`. Each OPFS case records closed connections, terminated first/fresh second Workers, identical origin/database/pool identity and byte-exact equality of the committed versus reopened ordinary/vector fixtures and schema. The read phase enables query-only mode and compares before/after native context initialization. Vector therefore demonstrates its native context setup on fresh read-only connections without restoring fixture data. Real missing ordinary and missing bit-table controls both fail as required; neither is repaired.

Local hosting is secure HTTP loopback, COOP same-origin/COEP require-corp and observed cross-origin isolation, at origins `http://127.0.0.1:39279` (vec) and `http://127.0.0.1:38483` (Vector). Raw reports record VFS-specific OPFS/SAB/Web Locks/Atomics prerequisites and final asset requests under `/runtime/`, complete packaging companion negatives and unchanged archive/file hashes. This is orderly runtime/Worker restart, not browser-process or crash durability.

### Hosted production and retrieved primary artifacts

[Acceptance run 39105043561](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39105043561) passed scope, both composition jobs and the stable `acceptance` aggregate. Jobs: sqliteVec `117608960746`, sqliteVector `117608960815`, aggregate `117609566049`. PR head `8017abfac719e22799bcafacc0d7e6b05363d5d7` was evaluated through actual merge checkout `076bbdfb2757907c2e2a52f177fa671225480100`, with the same implementation tree `23a403f71cdfd5df9385f530e40eee24335e166e`; it is not relabeled as the PR head. Both exact source/engine records and all nine stages/22 cases were read from downloaded primary reports.

- [sqlite-vec primary artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39105043561/artifacts/12128431123): `acceptance-39105043561-1-sqliteVec`, 1412112 ZIP bytes, verified ZIP SHA-256 `d91f7438a23772f7557166de4be7413adf67afb9f83dd2e868a9d1a10a77c07a`; locator `run-HV2nQ8/acceptance.json`, adjacent `browser.json`, build/package handoffs, logs and `payload.tgz`. Payload 1166028 bytes, SHA-256 `3ca0fa1982dd20e938631ae01c86b79af1162213e9d6937acc29feaeab8e5673`.
- [SQLite-Vector primary artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39105043561/artifacts/12127099740): `acceptance-39105043561-1-sqliteVector`, 1413981 ZIP bytes, verified ZIP SHA-256 `cfc69689d7fde597b185e3e94f49452d2be4cb5b89f96fb492fe32325220be7f`; locator `run-Dn1G6s/acceptance.json`, adjacent `browser.json`, build/package handoffs, logs and `payload.tgz`. Payload 1164709 bytes, SHA-256 `b594ae339551d2967258e8d35df26c7902cf08d592e77eda8b87aaf2019dd0cb`.

CI fixtures share supplied package identity `sqlite-vector-wasm-acceptance-fixture@0.0.0-test`, while selected-engine records and payloads remain distinct. Both artifacts expire 2026-11-17; they were available/downloaded at account preparation. Extracted temporary copies are `/tmp/apply70-ci-12128431123/run-HV2nQ8` and `/tmp/apply70-ci-12127099740/run-Dn1G6s`. CI browser is Chrome 153.0.8010.12 under recorded isolated loopback conditions. Manual-selection and site-only/aggregate failure branches have executable offline controls and inspected workflow wiring; no separate manual/site-only hosted run is claimed.

### Actual downstream consumption

The real unchanged `acceptedPayload` was invoked on each of the two local accepted bundles and each of the two downloaded CI accepted bundles, using each report's actual package identity and source commit. All four calls passed raw build-handoff digest, selected lock/engine, exact supplied identity, complete source-selected docs/notices/metadata/runtime inventory and actual archive SHA-256. These envelopes contain genuine complete acceptance results, not the synthetic success records used in earlier packaging work. The calls only inspect/reconstruct and invoke no publisher. Local consumer stdout is `/tmp/apply70-local-consumers.json`; CI consumer outcomes were directly observed during this session and are summarized here, not an extra CI-attested consumer artifact.

### Completion checks

The implementation diff against proposition 584d5a2 contains only acceptance code/workflow/tests, `docs/acceptance.md` and authored Change records. Recorded source locks, A-build/A-package, SDK/harness and release/Updates/Watch/Site policy implementations are byte-unchanged. There is no new upstream patch, dependency or generated runtime in Git. Complete canonical tests are renewed after the final identity guard; their final result is recorded at completion below. No requirement or Coverage source snapshot changed.

## Evidence boundaries

Generated logs, sources, runtimes, reports and tarballs stay temporary/ignored. The account is repository-authored evidence of execution, not direct access to primary artifacts. Browser observations cross public upstream interfaces and real final packaged bytes but share repository-authored probes/harness and common agentic implementation/test authorship. Host arithmetic is separate from extension results but does not eliminate shared fixture/setup mistakes. Qualification is bounded to recorded pins, real browser/hosting conditions and orderly Worker/runtime restart, not all browsers, future sources, crash recovery, optional quantization, publication or human integration.

Completion: renewed `sh tools/test-repository.sh` returned zero, 351/351 after the final identity guard (`/tmp/apply70-complete-tests.log`). Canonical repository checking and pinned strict OpenSpec validation passed again (13/13). All eight tasks are complete on the observed evidence. No implementation or requirement changed after the tested 8017abf implementation; subsequent Apply account/task changes record completion only. This is an Apply account, not the mandatory subsequent 42P Verification verdict. No archive, merge or publication was performed.
