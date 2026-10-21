---
schema_version: 1
change: prepare-release-package-docs
allocation_unit: A-package
checked_commit: a8dfcf65d4f15948c5286c4a0078e5b15d19c7d2
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---
# A-package Verification

## Institutional view

**Passed for A-package.** All four tasks are complete; both coverage directions and the three Verification controls pass. The actual production/browser execution is bound to 6b80ab08d9f18aba15eb3103e98cbdf220294cdc; the checked commit is a subsequent task/report-only checkpoint with identical implementation, document, lock and harness bytes. That evidence is explicitly reused after checking those identities, not relabeled as execution on the later commit. This verifies this package unit, not a new product release or the four later changes. No archive, merge or publication was performed. The release exercise uses an explicit historical-state fixture (0.2.4 legacy reference), not live registry state or a reservation of 0.3.0.

**Command provenance.** The [reconciled Allocation snapshot](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), A-package, and its complete qualified Distribution/Release-Watch passages govern this examination. In particular D/C-release-review adds selected candidate/final documents while D/C-purpose preserves both isolated technical capabilities with Vector production. The [bidirectional mapping](coverage.md) was reread against all eight effective requirements and their boundaries; both directions remain 100%. Original historical source fidelity was not reaudited; the Capture retains immutable S-spec provenance and current scoped human decisions.

**Verified build input and selected runtime.** [Current selection/runtime validation](https://github.com/at-rama/sqlite-vector-wasm/blob/6b80ab08d9f18aba15eb3103e98cbdf220294cdc/tools/package/package.mjs), `validateBuild`, rejects missing or contradictory locks, origins, versions, integration and file hashes. The package and composition tests exercise these failures. Fresh [dual-composition CI](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39293577618) succeeded for both sqliteVec and sqliteVector on the implementation commit; jobs 118200541448 and 118200541315 each produced and accepted their isolated final package. This proves exercised selected paths, not every possible upstream pair.

**Complete envelope and independent asset resolution.** The unchanged eleven-file inventory, conservative assembly and no consumer compile step are checked by real packing/local install and the actual [Vector qualification job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39293577588/job/118200211475). That job passed checkout/install/tools/deps/smoke/build/package/browser/bundle, with Chrome 153.0.8010.12 and 22 browser cases. A separate local replay of the earlier 2f5c5df archive exercised all twelve vanilla/ESM/bundler main/Worker/Worker1/promiser loading paths and four broken-companion controls; it is supporting evidence for a historical archive, not execution of the final archive. Fresh final CI and the both-engine jobs supply the decisive current result.

**Truthful consumer documents.** [Selected authored Vector sources](https://github.com/at-rama/sqlite-vector-wasm/blob/6b80ab08d9f18aba15eb3103e98cbdf220294cdc/docs/sqlite-vector/README.md) and [native usage](https://github.com/at-rama/sqlite-vector-wasm/blob/6b80ab08d9f18aba15eb3103e98cbdf220294cdc/docs/sqlite-vector/usage.md) carry durable composition-independent instructions and vec0/vec_* adaptation without automatic migration promises. `renderDocument`/`preparedDocuments` add the supplied package version and exact upstream pair. Fixtures stay explicitly unpublished; preparation does not assert registry availability. The [composition suite](https://github.com/at-rama/sqlite-vector-wasm/blob/6b80ab08d9f18aba15eb3103e98cbdf220294cdc/tools/package/tests/composition.test.mjs), “Vector archive documents follow supplied identity and changed upstreams without invented publication”, exercises 0.3.0/0.3.1, a changed SQLite/Vector prerelease context and fixture status, while the actual retained CI tarball confirms its rendered contents for SQLite 3.54.0/Vector 1.1.2. The changed-upstream renderer case is synthetic and does not qualify that hypothetical pair.

**Behavior, storage and glue boundary.** Runtime/API/glue code and source locks were not changed. Real-browser baseline, FTS5, Float32, Hamming, native registration/negative SQL, all loading surfaces and all three OPFS restart paths passed in the [actual qualification evidence](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39293577588/artifacts/12206792469), `acceptance/run-VxYPCR/acceptance.json` and `browser.json`. These checks retain their secure loopback, COOP/COEP and Chrome prerequisites; they are not a browser-universality guarantee. Consumer storage guidance remains in the selected shared browser document.

**Licensing and notices.** `noticeInputs` preserves exact selected notice records and immutable FP16 association; offline altered/missing/version/engine cases fail, and real packages passed the corresponding assembly/acceptance stages. This is source/digest and inclusion verification under existing associations, not an independent legal opinion or renewed assessment of upstream terms.

**Exact document/archive handoff.** `preparedDocuments` derives content and source/output hashes from a single source read. [Retained-archive consumption](https://github.com/at-rama/sqlite-vector-wasm/blob/6b80ab08d9f18aba15eb3103e98cbdf220294cdc/tools/release/run.mjs), `acceptedPayload`, recomputes those records and document bytes before accepting the unchanged archive. The composition suite rejects altered document provenance and retains archive verification after original build directories disappear. [Artifact 12206792469](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39293577588/artifacts/12206792469) has ZIP SHA-256 `979e492954cfc3934a053e77d2f3aaef674a5bd89c11cf34197717a3f8e87e5a`; it was downloaded, digest-checked and inspected. The final accepted tarball is 1,164,980 bytes, SHA-256 `0279f1e0bfdad678146a3fef7c1f6afc8cea1d1d17a71c44f05d63fb3145da18`. It binds package 0.3.0 to the exact CI source and records each authored/rendered document hash in `package.json` inside the acceptance bundle. Fresh identity assembly changes archive/document hashes while preserving runtime input identities; qualified bytes are never relabeled in place.

**Clean reconstruction and output boundary.** CI starts from a clean exact checkout and reconstructs the complete path. Locally the canonical check and tracked diff confirm no source vendoring or generated runtime/archive was committed; work outputs remain ignored. Tooling was independently installed in an empty temporary directory under `/tmp`, with pinned identities/deps and smoke passing. Shared repository-authored harnesses and common agentic authorship remain dependencies of these observations; no independent certification is claimed.

**Decision boundary.** The unit is satisfactory under these scoped results and explicit evidence reuse; the next allocation may now be implemented. Final integration must reconsider any later changes to these source/document/handoff bytes. Archive remains deliberately unperformed under the mission; overall PR merge gates also cover the four still-pending changes.

## Detailed verification record

### Official OpenSpec verify

The repository-owned composition and unmodified generated verify skills were read. Project resolution, status and apply context were loaded from the pinned 1.14.0 CLI in `.42p`; all proposal/design/delta/task artifacts were read. Apply state was used as context, not as a verdict. No skill was installed/modified during Verification.

| Dimension | Executed result |
| --- | --- |
| Completeness | 4/4 tasks; both modified requirements implemented; all eight effective baseline/delta requirements accounted for. |
| Correctness | Both modified requirements and all eleven scenarios mapped to selected documents/rendering, archive identity/provenance, malformed-input and retained-byte controls; broader effective requirement evidence is recorded above. No requirement or scenario was skipped. |
| Coherence | Deterministic identity rendering from existing package/build inputs, one selected engine, readable per-engine sources, source/output provenance and fresh archive generation follow the design. Existing Node/test/fs patterns retained; no new dependency, runtime API or registry. |

No critical issues, warnings or skipped applicable checks remain. Official verification passes; archive-readiness advice does not override this mission’s explicit no-archive boundary.

### Repository controls and execution

On implementation source 6b80ab08d9f18aba15eb3103e98cbdf220294cdc: `sh tools/check-repository.sh` passed; `sh tools/test-repository.sh` passed all 380 tests; targeted package/release suites passed 20/50; pinned strict OpenSpec validation passed 17/17. The GitHub [Repository jobs](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39293577664) independently passed `check` and `tests`; `verification`/`archive` failed for missing reports on still-active changes, not for product tests. Those merge gates are not substituted for these controls.

Full local log `.work/apply76/package-final-all-tests.log`, targeted `.work/apply76/package-controls.log`, and fresh tool/smoke/replay records are temporary primary results; this report summarizes them durably. Hosted acceptance and qualification logs/artifacts above remain accessible with GitHub retention (qualification artifact expires 2026-11-18). Their historical lookup must not later be represented as fresh execution.

The exact clean checked input is a8dfcf65d4f15948c5286c4a0078e5b15d19c7d2. After the failed administrative completeness finding, only execution evidence/task/report metadata changed before this recheck; current code/document/lock/harness identities were compared to the exercised source. The official task/context inspection and canonical/strict checks were renewed.
