---
schema_version: 1
change: prepare-unqualified-candidate-pr
allocation_unit: A-updates
checked_commit: 0cc1cea58ad065ec3ad9746e0b6b5d17d7772399
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---
# Verification — prepare-unqualified-candidate-pr

## Institutional view

**Scoped conclusion.** A-updates passes at `0cc1cea58ad065ec3ad9746e0b6b5d17d7772399`: dispatch ends at a coherent qualification-pending PR, while the companion verified A-acceptance producer supplies actual in-PR qualification. The registered offline suite passed on identical Apply implementation bytes and is reused here; repository checks were renewed on clean committed inputs. No real manual dispatch, source preparation rehearsal, remote candidate creation, email or product publication was performed by these tests. Final cross-unit freshness review remains necessary.

**Command provenance.** [Allocation A-updates](https://github.com/at-rama/sqlite-vector-wasm/blob/85585a833b4cd37959f8ad841109f7b2e4c45c1e/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), its complete qualified Distribution/Release-Watch/Site portions, and [coverage examination](coverage.md) supply the scoped command. The adopted 2026-10-22 decision moves qualification after opening; source/notice/license/version/human authority remain. The unit/Change relation was re-examined with the companion producer contract; this is not full historical-source corroboration.

**Independent human selection, forecast and rollback policy — preserved.** Renewed [Updates test definitions](https://github.com/at-rama/sqlite-vector-wasm/blob/0cc1cea58ad065ec3ad9746e0b6b5d17d7772399/tools/updates/tests/updates.test.mjs), “dispatch is exact” and “real shared policy”, exercise structured comments, explicit versions, main/human invocation, no channel/version override, rollback and invalid/inconsistent/colliding state. Version policy itself is unchanged. These are injected metadata/policy tests, not current live registry observations.

**Official exact inputs, coherent notices and unchanged sources — preserved.** Existing resolution/reconciliation implementation remains; renewed tests cover source selections, unchanged/changed notice associations, corrupt baseline/helper output and coherent commit before checks. Retained raw-origin gaps remain honest rather than invented. Source acquisition and notice-integrity controls precede the create-only PR. The source/notice fixture tests and Python suites passed; no new upstream download or published prerelease is asserted from them.

**Same-PR documents, clean descriptor and pending qualification — implemented.** [Preparation implementation](https://github.com/at-rama/sqlite-vector-wasm/blob/0cc1cea58ad065ec3ad9746e0b6b5d17d7772399/tools/updates/run.mjs), `prepareCandidate`, retains coherent commit/repository/source checks and ends with `candidate-awaiting-qualification` or `prepared-without-pr`. It no longer imports/calls a product qualifier or example, and dispatch no longer installs browser prerequisites or repeats the full repository suites. Those remain required in PR CI. Tests verify exact descriptor/comment/preparation, source hashes, clean commits, no claimed archive and no qualifier/example calls. The already verified Acceptance producer is an implemented dependency, not a future placeholder.

**Create-only temporary PR, deduplication and reviewable presentation — preserved and revised.** [PR body definition](https://github.com/at-rama/sqlite-vector-wasm/blob/0cc1cea58ad065ec3ad9746e0b6b5d17d7772399/tools/updates/context.mjs), `candidateBody`, presents exact selection/head, provisional unreserved forecast, preparation/check/preview links and explicitly pending product/archive/browser/example qualification. Tests reject archive/pass claims and preserve existing candidate/run identities, empty expected-ref leases and partial push/PR failures. [Candidate guide](https://github.com/at-rama/sqlite-vector-wasm/blob/0cc1cea58ad065ec3ad9746e0b6b5d17d7772399/docs/candidates.md) distinguishes preparation, complete PR qualification, native workflow approval, maintainer review and definitive Release. No additional token, trigger engine, refusal registry or authority was added.

**Provenance, uncertain writes and bounded diagnostics — implemented.** Renewed Updates tests exercise unknown PR creation, token-safe transport timeout and acknowledged push followed by journal failure; they require preserved pushed identity, explicit uncertainty and no later PR write/retry. [Service adapter](https://github.com/at-rama/sqlite-vector-wasm/blob/0cc1cea58ad065ec3ad9746e0b6b5d17d7772399/tools/updates/services.mjs) preserves create-only behavior and validates returned PR identity. The CLI exposes the retained causal diagnostic without transport bodies/credentials. Source/notice reports and completed/failed/unknown/unexecuted work remain distinguishable. The new incident paths are injected filesystem/transport cases, not actual remote incident repairs.

**Human integration, definitive publication and Watch continuity — preserved.** Tests and semantic inspection establish no merge/tag/publisher API in preparation. Existing Watch/notification tests passed with the descriptor/branch interfaces unchanged; no mail was sent. Human workflow approval where GitHub requires it, required checks and maintainer merge remain. Candidate success cannot replace definitive revision/version/archive qualification; the Release path still owns it.

**Common limits and institutional conclusion.** The code, fixtures, review and report share repository helpers and agent authorship. Linked definitions do not independently expose execution; ignored local logs are their primary outputs and this report preserves a scoped account. The producer dependency is implemented and this unit is verified; final rechecks of the modified Release/Site interfaces still precede the overall task conclusion. No synchronization, archive, merge or live product publication occurred. The PR remains a working draft, not integrable merely because this unit passes.

## Detailed record

### 1. Allocation ↔ Change

Compared complete A-updates attribution and selected Capture passages at `85585a833b4cd37959f8ad841109f7b2e4c45c1e` against [coverage](coverage.md), all nine distribution-candidates baseline requirements, five modified blocks, design and tasks. Exact human dispatch, official pinned/notice inputs, shared forecast/rollback and schema-2 descriptor remain; preparation/qualification ordering, pending presentation/provenance and integration boundary follow the adopted target. Full product/browser/example/Site qualification is moved to the implemented PR producer and dependent Site; no mandatory control is removed. Reverse examination grounds diagnostic details in the existing failure/provenance duty. Both directions 100%; coverage, grounding, preservation, consistency and companion handoff pass.

### 2. Official openspec-verify-change

Used the current generated skill with resolved status/apply context under `.42p`; read all planning artifacts, retained baseline, implementation and tests. All three tracked tasks are complete.

| Dimension | Result |
| --- | --- |
| Completeness | 3/3 tasks; all five modified requirements and retained obligations accounted for |
| Correctness | Preparation/PR/rehearsal/source/notice/descriptor and failure scenarios mapped to implementation, generated presentation and executable control tests |
| Coherence | Companion producer consumed; obsolete API/browser setup removed; create-only/human/version boundaries retained |

Dirty/source/notice/repository failures precede remote writes. PR product failure now leaves an opened but ineligible PR rather than pretending preparation itself qualified it. Journal failure is distinguished from rejected remote action; unknown POST acceptance is not replayed. Historical notice gaps remain explicit. No critical issue, unresolved warning or skipped applicable check remains in this scoped examination; advisory archive readiness does not authorize archive/integration.

### 3. Repository checks and applicable tests

- `sh tools/check-repository.sh`: passed, renewed after committing clean inputs.
- `sh tools/test-repository.sh`: all registered suites passed on identical Apply implementation bytes; source/notice Python, Updates, Watch/notifications and producer/Release/Site controls all passed.
- `node --test tools/updates/tests/*.test.mjs tools/watch/tests/*.test.mjs`: 92 passed, zero failed, including the new uncertain-write/journal regressions.
- `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict`: 17 items passed, zero failed.

System Node/npm/Python/Bash/compiler and locked OpenSpec 1.14.0 supplied prerequisites. No harness or product runtime changed. Source preparation fixtures use controlled inputs and Git checkouts; producer/browser tests remain separate and no live authorization is inferred. Earlier pre-PR qualification rejection cases were relocated to the producer/consumer suites, not accepted by bypass. Raw ignored outputs: `.work/pending-tests.log`, `.work/pending-repository-tests.log`, `.work/pending-openspec.log`; this report is their durable execution account, not independently accessible raw evidence.
