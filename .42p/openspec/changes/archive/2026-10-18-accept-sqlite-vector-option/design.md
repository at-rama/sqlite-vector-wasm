# Design

## Context

See [proposal](proposal.md) for motivation and scope. At main `7bdea1e20171b1d138fadddfadab97e506a0dc1a`, A-inputs/A-build/A-package support the two recorded locks; SQLite is 3.54.0, sqlite-vec 0.1.9, SQLite-Vector 1.1.2 at `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. SDK and browser dependencies are already pinned. Acceptance has nine production stages and 22 browser cases, but `run.mjs` reads the default lock/build only, `check.mjs` assumes `sqliteVec`/`v`-prefixed version/dimension rows, and `fixtures.mjs` uses vec0. Reference construction already accepts a lock path. Package checks already support either concrete engine and preserve default transport conventions after the #69 regression repair.

This cross-cutting acceptance/orchestration change needs a design because fresh-state selection, browser fixtures, native reopen semantics, evidence and CI aggregation must agree. The synchronized browser-acceptance baseline has twelve requirements and twenty-one scenarios; the full delta retains them and adds explicit selected-composition cases. Historical packaging evidence is useful context, not proof of Vector Hamming/restart acceptance.

## Goals / Non-Goals

**Goals:** use one existing acceptance procedure per concrete selected composition; retain the working default and exact independently calculated oracles; prove fresh whole-path CI, final-byte identity and actual per-VFS reopen without fixture repair.

**Non-Goals:** change source/build/package policy, source pins, SDK or dependency versions; upstream patches; optional quantized/approximate-search qualification, CRUD/performance campaigns, benchmarks, native/Node/WASI product, browser-process crash recovery or universal browser support. No release version/channel decision, candidate selection, notification or Site adaptation. Q-engine-transition remains allocated elsewhere and cannot be settled by choosing a fixture version.

## Decisions

### D1 — Explicit recorded lock, one engine and one payload per invocation

Add optional `--lock` selection for the two existing repository-recorded lock paths, following A-build's convention. Omission retains `inputs/sources.lock.json`; `inputs/sqlite-vector.sources.lock.json` selects Vector. Retain existing command forms, fixture name/version defaults, existing metadata-only caller behavior and public internal-tool entry points such as `production({metadata})`, `options([])` and applicability signatures. Treat lock selection separately from the package `{name,version}` identity; never accidentally add orchestration fields to package metadata or its exact comparisons. Reject unknown/unsafe/ambiguous selections.

Reuse existing source-selection/identity helpers and pass the selected path to the actual build and reference. Bind the lock bytes/digest, selected engine, exact versions/origins/digests and build/package records before accepting the archive. Carry selection as additive report evidence while retaining existing required default fields and meanings. Fail a report/build/package mismatch or later substitution; an absent/contradictory identity must not default a Vector payload to sqlite-vec. Keep one raw build/package handoff and exact archive per result. Do not introduce an independent runtime engine selector or a registry of backends. Inferring the engine from an arbitrary function name or package version was rejected because it loses provenance.

### D2 — Two native fixture branches and one independent arithmetic oracle

Keep `oracles.mjs` host arithmetic and the existing data: `[1,0]`, `[0,1]`, `[-1,0]` against `[1,0]` yield Euclidean distances 0, sqrt(2), 2 at absolute tolerance 1e-5; bytes 00,01,03,07,0f against 00 yield exact XOR/popcount distances 0,1,2,3,4 without ties. Preserve expected identifiers and ordering. No extension or other engine computes expected results.

Extend only the acceptance fixture code with two explicit native SQL branches. sqlite-vec keeps vec0 float[2]/bit[8], vec_bit and MATCH. Vector uses ordinary BLOB columns, native FLOAT32 conversion, `vector_init` with FLOAT32/dimension=2/L2 or BIT/dimension=8/HAMMING, and exact `vector_full_scan`; bind binary bytes directly. Treat upstream type names and column semantics as pinned technical facts to verify. Native binary storage is distinct from optional quantization of Float32 input; no quantize/preload/training calls are required. Avoid a common product SQL API, general adapter or automatic capability fallback.

FTS5 fixture/expected identifiers remain unchanged. Reuse A-package's final extracted loader/Worker matrix and negative companions. Check exact SQLite/native selected-engine version and absence of the other engine on independent C/OO1 connections and retained transports. Preserve sqlite-vec Worker1/promiser `sqlRows` dimension 2 and separate `registrationRows` other-engine count 0; Vector follows its already supplied native result convention. Test the actual package-checker-to-acceptance boundary rather than synthesizing a mutually consistent replacement report.

### D3 — Fresh reopen allows native connection context, never fixture restoration

The pinned Vector source defines per-connection `vector_context` and requires `vector_init` before scans retrieve a column context; static extension registration alone does not initialize every application's vector column. This is source inspection, not an executed OPFS result. `vector_init` supplies type/dimension/distance and reads native metadata; optional quantized caches are not used here. Auto-registration may internally issue CREATE TABLE IF NOT EXISTS for its own metadata; no test-owned code may restore missing fixture tables or values. Normal native initialization is not consumer extension loading/registration.

Retain two separate Worker invocations per `opfs`, `opfs-wl`, `opfs-sahpool`: first write/commit/close/terminate, then fresh runtime/open existing database using retained read flags and identical origin/path/pool directory. Split fixture creation from connection-context setup and queries. On reopen, verify pre-existing ordinary, Float32 and binary fixture state, call only necessary native column-context setup, then query; compare stored values/schema before/after setup and with the committed state. No fixture DDL/DML, quantization, preload, training, index rebuild, recovery or repopulation is allowed in that phase. A missing vector table/state must fail, even if ordinary rows survive. The existing ordinary-table corruption control also remains.

If native initialization cannot preserve the recorded schema/data on fresh reopen or a required VFS fails, stop and report the incompatibility; do not relax the read phase, skip that VFS, patch upstream or invent a repair. Reusing the first Worker would hide retained memory; rebuilding vector state would weaken the persistence obligation. Neither is acceptable. This tests orderly Worker/runtime restart, not whole-browser restart or crash durability.

### D4 — Exact reference, extracted assets and fail-closed evidence

Build SQLite-only reference with the selected lock, exact SQLite inputs, pinned tools and common configuration, using existing A-build reference support; do not compare Vector against an unrelated default lock. Compare retained C/OO1/WASM/SQL/loading/VFS inventories and explicitly reconcile changed default VFS sets rather than shrinking them. No A-build implementation change is planned.

Keep separate extraction/offline install, non-root mount and actual runtime-request checks; final archive/extracted hashes must remain unchanged. Preserve all nine production stages and mandatory 22-case floor, adding bounded diagnostic/control results as needed. Missing prerequisites, altered archive/identity, wrong IDs/distances/order, absent engine or persistence, and interrupted stages fail nonzero with partial diagnostics and no success handoff. Emit the selected identity even in failure records when known, without inventing information not yet obtained.

Preserve report version-1 fields, exact runtime inventory and default consumer conventions. Extend acceptance's own applicability checks/fixtures as needed for selected composition while retaining existing call signatures. Exercise real `acceptedPayload` read-only consumption for each actual accepted bundle; never fabricate acceptance success to reach that consumer. If shared additive records require synthetic downstream fixture updates, limit them to the already assigned evidence inputs, keep complete suites and policy untouched. A need to change downstream publication/version policy or producer semantics is a stop/escalation, not an implicit expansion.

Record evaluated full commit/tree, dirty status, selected lock/engine/exact inputs, actual toolchain/configuration, archive/runtime hashes, baseline, browser/hosting/prerequisites and all case outcomes. PR merge checkouts keep their actual identities; neither merge ancestry nor the other engine's report transfers a pass. Changed supplied package bytes require acceptance of the new exact archive; A-release retains definitive recalculation and publication decisions.

### D5 — Isolated two-composition automatic CI, unchanged required outcome

Use a bounded two-value composition matrix for applicable PR/main runs, one fresh checkout/tool/npm/source/output state per job. Disable fail-fast cancellation of the counterpart so each result/diagnostic remains available. Preserve the existing site-only scope rules. Manual dispatch retains revision/name/version and adds selection with the default lock; it runs just that composition. Each invocation still produces only its one archive and report.

Keep the required job context `acceptance` as a small aggregate of the composition jobs: run even after failures/cancellations, succeed only on all required successful jobs including successful evidence upload, and explicitly report site-only non-applicability. Do not silently rename the required check to matrix-generated names or alter branch protections. Retain existing production/prerequisite behavior and pinned actions. Use distinct artifact names including run/attempt/engine, retain upload-on-failure diagnostics and the existing 30-day retention. Upload failure cannot leave aggregate acceptance green. No new framework, workflow dispatch orchestration service or publication trigger is needed.

Two jobs cost more CI work but protect both retained paths and avoid state cleanup/reuse tricks. A single selected-engine automatic test would leave the alternative unqualified; running both against the same mutable state would violate fresh-path proof. Manual/downstream supplied-version qualification remains separate from this regression matrix.

## Risks / Trade-offs

- Vector column context mistaken for persisted data or extension registration → separate native context setup, explicit stored-state checks and missing-vector-state negatives; stop on incompatibility.
- Independent fixtures share erroneous SQL/setup → retain host-only expectations, negative oracle controls, actual producer/consumer boundary and real extracted byte/request evidence; disclose common harness and agentic authorship.
- Wrong lock used for reference or evidence → compare selected lock/SQLite/config/tools/engine across raw handoffs and reports; include contradictory/cross-engine negatives.
- Additive records break existing consumers → preserve default fields and meanings, run complete registered tests and real read-only accepted-bundle consumer for both engines; policy changes require escalation.
- Matrix hides a failed job or overwrites artifacts → stable aggregate outcome, failure/cancellation/upload controls and engine-specific artifact names.
- Fresh tools and two references increase time/network exposure → keep the existing tiny fixture workload and pinned harness; record failure rather than relying on caches or historical passes.

## Migration Plan

Implement the acceptance selector/evidence and concrete fixtures, preserve default boundary regressions, then extend workflow/docs. Run registered offline controls and strict validation before independent fresh local and hosted complete production for each recorded composition. Retrieve actual CI evidence, check the reported revision/engine/lock and exact payload hashes, and exercise read-only consumer compatibility. Record commands, inputs, hashes, conditions, failed attempts and material reuse/primary availability in an authored Apply account; no generated assets enter Git. Post-Apply 42P Verification precedes archive. Rollback reverts acceptance changes, retaining historical evidence and already published bytes; it must not label unqualified Vector results as accepted.

## Open Questions

No unresolved product decision is delegated to Apply. Actual binary/Hamming and read-only native-context reopening across all three OPFS VFSes are bounded technical checks with explicit stop conditions, not established successes. Publication/reference Q-engine-transition remains outside this unit. No new Capture/Allocation semantics or source pins are required by this plan.
