---
schema_version: 1
change: prepare-sqlite-vector-candidate
allocation_unit: A-updates
checked_commit: be94784a4a7a3332bb214099cf06831d8eba9c94
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — prepare-sqlite-vector-candidate

## Institutional view

**Situated conclusion.** Passed for A-updates at `be94784a4a7a3332bb214099cf06831d8eba9c94`. The examination supports the scoped preparation implementation, with all eight tasks complete. Actual clean preparation was renewed on implementation head `f01d56b20d89fa902e96794c3eb631e9454b8cc7`, through [hosted rehearsal 39210323082](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082); its exact local candidate is `2eb1837715a8160ff7c8c0ef74cbca863f28e0d9`. This invocation reuses that newly executed Apply evidence, not a historical product PASS. The checked snapshot adds only task completion and its execution account to that implementation head. Primary results and the archive were downloaded and inspected from [artifact 12167532286](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082/artifacts/12167532286); GitHub retention expires on 2026-11-18. These results do not qualify an unexecuted future candidate or establish publication readiness.

**Command provenance.** The human institution recorded in [AGENTS.md](../../../../../AGENTS.md) establishes the current design reference. The [Allocation, A-updates](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), and its qualified Distribution and Release/Watch passages ground this Change. Its [bidirectional mapping](coverage.md) was independently re-examined against the effective contract and current implementation. Original-source historical fidelity was not audited; the [immutable historical SPEC](https://github.com/at-rama/sqlite-vec-wasm/blob/d463c4034604d6593cf45bbf5a523598dd3f53cc/SPEC.md) remains provenance, not a parallel current contract.

### Exact human selection and bounded invocation — supported

Code review and renewed tests establish fixed Vector dispatch, both exact versions, ordered structured comments, hosted run/attempt/repository validation, rejection of legacy/mixed inputs and manual overrides, and independence from Watch history. See [context implementation](../../../../../tools/updates/context.mjs), functions `invocation` and `candidateDescriptor`, and [test definitions](../../../../../tools/updates/tests/updates.test.mjs), “dispatch is exact, hosted, main and comments remain data”. The successful execution account and primary test-log locator are in [Apply evidence](apply-evidence.md). The actual run used the recorded stable pair; invalid and adversarial invocations are injected tests, not live dispatches.

### Official pins, notices and dependency coherence — supported

The real run resolved SQLite 3.54.0 / SQLite-Vector 1.1.2, preserved its recorded pin and validated retained notices. Changed-source, rollback, identical-text/new-release, missing license, encoding, archive integrity and FP16/header-drift conditions were exercised with controlled fixtures. [Resolution and notice implementations](../../../../../tools/updates/run.mjs), `resolveSources` and the notice phase, consume existing A-inputs and [strict notice handling](../../../../../tools/updates/notices.py), `reconcile`; [Python test definitions](../../../../../tools/updates/tests/test_notices.py) define those cases. New archive hashes are established only during preparation; production never recalculates its expected pin. The selected source association remains explicit, dependencies are not silently upgraded, and upstream sources are not repaired. No actual upstream alpha was built; conditional prerelease classification uses [synthetic metadata tests](../../../../../tools/updates/tests/test_resolution.py).

### Shared forecast, references and rollback — supported

The renewed real run read actual Git/npm history, observed historical sqlite-vec latest 0.2.1 and calculated the first Vector transition as MINOR to unreserved forecast 0.3.0/latest, without cross-engine ordering or rebootstrap. `candidate.json` and `publication.json` in [the inspected artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082/artifacts/12167532286) retain these observations. [Preparation](../../../../../tools/updates/run.mjs), `prepareCandidate`, delegates both phases to the existing release calculator. Renewed [release policy test definitions](../../../../../tools/release/tests/vector-product.test.mjs) and preparation tests cover comparable rollback comments, initial experimental rejection, changing state, inconsistent state and collisions. This is no reservation or publication of 0.3.0.

### Clean commit and complete exact-payload qualification — supported

The real candidate `2eb1837715a8160ff7c8c0ef74cbca863f28e0d9` was clean, with the exact schema-2 descriptor and selected lock/notice state committed before checks. All nine production stages and 22 real Chromium cases passed, including official API/Worker transports, native Float32/Hamming, FTS5, SQLite baseline and restart persistence through opfs/opfs-wl/opfs-sahpool. [Primary results](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082/artifacts/12167532286), `acceptance/run-IisRdW/acceptance.json`, identify that commit and archive. [Preparation](../../../../../tools/updates/run.mjs), qualification checks, binds returned engine, versions, full lock, lock-byte digest, repository, commit, preparation/comment and retained payload bytes; renewed injected negatives reject mismatches. Existing A-release acceptance validation is reused, not weakened. Raw archive bytes were independently downloaded from the artifact, rehashed and rechecked by `acceptedPayload`/`bindSelection`; this reuses repository validators rather than claiming an independent validator implementation.

### Release descriptor and invocation handoff — supported

The inspected `updates/run-0p4Psd/release.json` contains the actual committed schema-2 descriptor, exact SQLite/Vector versions, canonical comment and this repository's real run reference. Its versions and preparation agree with candidate/publication evidence and the selected lock. [Descriptor generation](../../../../../tools/updates/context.mjs), `candidateDescriptor`, reuses A-release validation; [preparation](../../../../../tools/updates/run.mjs), commit phase, retains the committed bytes. The renewed test “qualified committed pair precedes push/PR; diagnostics stay ignored” compares this retained descriptor to `git show` at the candidate commit. No forecast is persisted as a reserved final version.

### Temporary candidate presentation and Watch handoff — supported within its allocated boundary

[Create-only service implementation](../../../../../tools/updates/services.mjs), `candidateServices`, and renewed injected tests cover branch occupancy/races, transport failures, wrong pushed/PR heads and partial outcomes, without destructive compensation. The [workflow](../../../../../.github/workflows/updates.yml) and `candidateBody` expose exact Vector/run/commit/forecast/artifact identities. The real rehearsal has no remote write adapter: live candidate-PR authorization was not exercised or claimed. [Watch integration test definitions](../../../../../tools/watch/tests/state.test.mjs), “unadapted Watch rejects the Vector producer handoff explicitly”, preserve the declared pending consumer adaptation. This Change does not claim current Watch interoperability or transfer discovery ownership.

### Retained provenance and honest failure evidence — supported

The inspected artifact retains source bindings, lock, descriptor, selected notice snapshot, toolchain/options/environment, clean candidate identity, state/forecast, browser evidence and actual payload. [Preparation and failure handling](../../../../../tools/updates/run.mjs), `step` and outer failure catch, plus renewed injected tests distinguish completed, failed and unexecuted work. [Notice handling](../../../../../tools/updates/notices.py), retained/refreshed records, preserves unchanged bytes and unavailable historical provenance honestly. The first hosted attempt failed at the mandatory repository tests on an obsolete Updates-title assertion, retained diagnostics and never reached eligibility; its correction and the successful replacement evidence are recorded in [Apply evidence](apply-evidence.md). Failure is not converted into successful qualification.

### Human adoption and publication boundary — supported

Code review, service interfaces and renewed tests establish the retained baseline requirement “Human integration and publication boundary”: preparation ends at an eligible PR; no merge, auto-merge, release tag or publisher operation exists in this path. Actual rehearsal ended `qualified-without-pr` with zero publication calls. A-release still recalculates and qualifies the definitive integrated revision/payload; candidate evidence cannot waive its gates or bootstrap boundary. See [actual execution account](apply-evidence.md) and [preparation implementation](../../../../../tools/updates/run.mjs), rehearsal/presentation branches.

**Common dependencies and limits.** Tests and implementation share agentic authorship and repository validators. The native numerical expectations, negative controls and public browser surfaces give distinct observations but share harness/configuration mechanisms with the candidate and SQLite baseline build; correlated mistakes remain possible. Changed-version metadata and remote services are synthetic; they do not establish live prerelease builds or remote write rights. Hosted production used fresh production/tool state and actual publication history. No other allocation unit, source-to-Capture history, live publication, or future payload is verified here. Raw hosted evidence is directly accessible until retention expiry; local additional mutated-pin test logs are temporary and only their execution account/hashes are retained.

**Conclusion for institution.** The three required Verification controls pass for this A-updates realization under the conditions above. The Change is eligible for the subsequent archive operation; human integration and publication remain separate. No synchronization, archive, merge or publication was performed by this Verification.

## Detailed verification record

### Inputs and coverage control

Starting main: `17d42d1976b8f3235c59fb499613a8cff89f7fc1`; implementation head: `f01d56b20d89fa902e96794c3eb631e9454b8cc7`; clean checked candidate: `be94784a4a7a3332bb214099cf06831d8eba9c94`. Current edit-0.1 inputs:

- Allocation SHA-256 `00ab76dd9cd370ca1cf6e5cf6a8943efbf5076500bcd583b7c38932c7ff39840`.
- Distribution Capture SHA-256 `a61f58135f68d9b1cc9288992ada88780203d121ffb64d7cc83acdc85e14a6da`.
- Release/Watch Capture SHA-256 `4ec6952d718fda29fdebbb238beea72a00ea0228753fe370b8454c7d9b3efff6`.

The complete A-updates unit, dependencies and qualified passages were compared with proposal, design, delta, tasks and the retained synchronized baseline requirement. The thirteen forward portions and eight reverse requirement dispositions in [coverage](coverage.md) remain semantically valid: exact selection; official sources/integrity/nonmodification; shared policy/references; notices/dependencies; complete clean qualification; temporary PR identity; provenance/failures; human boundary; and production/Watch/Release handoffs. No orphan requirement, omitted material portion or transferred producer responsibility was found within this examination. Both semantic coverage directions are 100%; hashes establish identity, not source authority or implementation conformity by themselves.

### Official OpenSpec verification control

Used the intact generated `openspec-verify-change` 1.14.0 skill; status/instructions resolved this repository's `.42p` project and the selected Change. No executable `openspec verify` was invented.

| Dimension | Examined result |
| --- | --- |
| Completeness | 8/8 tasks; seven MODIFIED requirements implemented; the eighth retained requirement remains applicable. All 43 effective scenarios examined (40 delta, 3 retained). |
| Correctness | Mapping and scenario conditions checked against context, source/notice reconciliation, preparation sequencing/evidence, create-only services, workflow/docs, existing release qualification and renewed tests. |
| Coherence | All six design decisions followed; existing resolver/package/acceptance/release paths reused. Narrow test-fixture corrections and the Watch producer assertion preserve strict validators and the pending consumer boundary. |

No critical issue, unresolved warning, optional suggestion or applicable skipped check remains from this examination. Requirement-level dispositions and decisive implementation/test locators are given in the institutional view. Unexercised live writes and actual alpha builds are expressly outside the selected execution methods, not silently counted as successful executions.

### Repository and applicable-test control

See [Apply execution account](apply-evidence.md) and its accessible primary hosted logs/artifact. Renewed registered suite: 371 tests (262 JavaScript, 109 Python), all pass, no skips. Additional changed-pin metadata exercise: 86 JavaScript + 7 Python pass; it creates no actual published-source identity. The retained-descriptor suite: 36 JavaScript pass. Current hosted `Repository / tests` also installed locked OpenSpec 1.14.0 and completed strict validation.

On the clean checked snapshot, `sh tools/check-repository.sh`, `sh tools/openspec.sh check`, project resolution and `sh tools/openspec.sh exec validate --all --strict` were run successfully (13/13 strict items). Full registered tests and real production from Apply are reused with explicit applicability: `git diff f01d56b20d89fa902e96794c3eb631e9454b8cc7 be94784a4a7a3332bb214099cf06831d8eba9c94` changes only task completion and `apply-evidence.md`; implementation, requirements, fixtures, source records, notices and production dependencies are byte-identical. No new failure, behavior change or evidence concern requires a duplicate production build during this control.

Real proof identities: run `39210323082`, artifact `12167532286`, ZIP SHA-256 `83a00982c50d9a011f89ab4ec077d99db734fdb12bb0548a2110de8b48a79da4`, candidate `2eb1837715a8160ff7c8c0ef74cbca863f28e0d9`, payload `1164711` bytes / SHA-256 `30d806bb5e5f826ab6401cd95726afa20a60c12b3b5d2edf1f0828e2990303e1`. Evidence locators, descriptor/lock hashes, environment and previous failed-run disposition are in Apply evidence. These identify the observed candidate, not the report's source commit as an independently qualified publication payload.

The missing Verification report and still-active Change made earlier PR lifecycle gates fail as expected. This report resolves the report prerequisite; Archive remains the next separately authorized operation. Those lifecycle gate outcomes do not erase successful checks/tests or establish release acceptance.
