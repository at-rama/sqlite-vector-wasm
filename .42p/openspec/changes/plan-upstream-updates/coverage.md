# A-watch planning coverage

## Reviewed inputs and scope

Change: `plan-upstream-updates`. Allocation unit: exactly `A-watch`.

Read the current [global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`, from source commit `8e9de3c42334e12eb065440b4155aad06391ff27`. Its qualified passages select:

- [Distribution Capture](../../../engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), SHA-256 `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00`: `C-watch`, `C-autonomy`, `R-updates`, plus the A-inputs admissibility dependency in `C-inputs`.
- [Release/Watch Capture](../../../engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), SHA-256 `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944`: `C-watch`, `C-selection`, `C-determinism`, `C-semver`, `C-channels` and `R-frugality` with their conditions, exclusions and responsibility boundaries.

These projections retain instituted-source authority, including `S-release-watch-design`, `S-local-reconciliation` and `S-release-refinement`. Their related projections are not independent corroboration. The examination is Allocation-to-Change derivation, not a new audit of the complete upstream authority chain or historical implementation acceptance.

`S-watch-exploration` denotes the primary user decisions in this project's 2026-10-12/13 conversation: suppress empty-plan email; Friday 08:00 Paris time; same privately selected sender/recipient; avoid exposing the real address through private configuration. The invocation of `/openspec-propose A-watch` authorizes planning. No public permalink is available. The records intentionally contain no address value. These decisions resolve choices within notification/scheduling responsibilities, not a new allocation unit.

## Bidirectional correspondence

Each row identifies the complete named requirement in [the delta spec](specs/upstream-watch/spec.md), its relevant scenarios and the tasks realizing it. Reading either direction preserves the selected obligations; shared references select watch contributions rather than transferring candidate production or publication policy.

| A-watch selected obligation / source | Change requirement and scenario scope | Tasks |
| --- | --- | --- |
| D/W `C-watch`: designated official sources; A-inputs admissibility | Official released upstream discovery: stable/prerelease exactness, nonrelease exclusion, incomplete/ambiguous discovery failure | 1.1, 1.2 |
| D/W `C-watch`: discovery baselines without manual-selection prohibition | Ordinary discovery baselines: suffix ordering at bounds, manual older selections remain independent | 1.2, 3.1 |
| D/W `C-watch`, W `C-determinism`: actual tags/npm/provenance and separate HEADs | Coherent publication references: complete state, unavailable/inconsistent state and placeholder exclusion | 2.1, 2.4, 3.2 |
| W `C-selection`: stable componentwise strict progression; next cannot block stable maintenance; pair as proposal unit | Stable pair eligibility: maintenance alongside next, component regression exclusion, new pair without new individual version | 3.1 |
| W `C-selection`: experimental progression, latest floor, missing-next fallback and suffix order | Experimental pair eligibility: next behind latest, all eligible alphas, latest as initial reference | 3.1, 3.2 |
| W `C-selection`: previously published corresponding-status pair exclusion | Published pair exclusion: historical pair after rollback, composition shared by several distribution versions | 2.1, 3.1 |
| D/W `C-watch`, W `C-selection`: current candidate inspection and deduplication; A-updates state dependency | Current candidate awareness: queued/active preparation, exact-head PR, unresolved identity, preserved distinct candidates | 2.2, 2.3, 2.4, 3.3 |
| W `C-determinism`, `C-semver`, `C-channels`: common policy consumption including maturity/alpha/initial/uniqueness boundaries | Shared nonreserving forecasts: identical pair/state agrees, independent jobs may share a number, changed state/collisions preserve common policy | 3.2, 3.4 |
| D/W `C-watch`: complete email contents, exact parameters/link, maintainer selects zero/one/several jobs | Actionable human job plan: every eligible pair, parameters and candidate references; forecast is not qualification | 3.3, 3.4 |
| D/W `C-watch`: Gmail SMTP plan; S-watch-exploration: empty-plan silence, same private account | Conditional Gmail delivery: empty success, nonempty SMTP acceptance and unsuccessful delivery without alternate transport | 4.1, 4.2, 4.4 |
| A-watch notification configuration; S-watch-exploration: real address stays private | Private mail configuration: secret-only private values, sanitized public diagnostics/artifacts, noreply not a transport substitute | 4.1, 4.2, 4.4 |
| D/W `C-watch`, W `R-frugality`: weekly schedule, accepted deactivation, manual reactivation/no keepalive; S-watch-exploration: Friday 08:00 Paris | Weekly Paris schedule: seasonal time changes, inactivity deactivation remains manual | 4.3, 4.4 |
| D `C-autonomy`, D/W `C-watch`, W `C-determinism`: stop at plan; independent human preparation and integration, retained mandatory gates | Planning stops before preparation: no source/candidate/repository/publication mutations or dispatch; manual workflow stays independent | 3.4, 4.3, 5.1 |
| D `R-updates`, W `R-frugality`, `C-selection`, `C-determinism`: deterministic nominal operation; no refusal registry, reservation/lock/version-domain machinery | Stateless deterministic operation: eligible unselected pairs recur, reference progression removes superseded work naturally; transient diagnostics never drive future selection | 3.1, 3.2, 4.2, 4.3 |

Tasks 4.5 and 5.2 integrate the registered suites and complete-case evidence under the existing repository canon; they add no product requirement or new Verification stage. Optional copied `gh` commands remain optional presentation, not an additional mandatory job capability.

## Derivation conclusions and limits

Allocation-unit to Change coverage: **100% at planning level**, after examining all selected watch passages, common constraints and dependency boundaries. Change to allocation-unit coverage: **100% at planning level**; the fourteen requirements above each trace to A-watch's selected responsibility, including explicit human choices within its configuration. The table records semantic correspondence, not a count-based confidence score or an implementation verdict.

The bounded Updates run-name adjustment supplies candidate observation only. It adds no preparation eligibility restriction, dispatch requirement, branch replacement or publication behavior. Historical reads consume A-release provenance without changing its snapshot contract/policy. Existing source acquisition, build, package, acceptance and publication obligations remain outside realization by this Change, while their applicable watch dependencies and failure boundaries are retained.

The [proposal](proposal.md), [design](design.md), delta spec and [tasks](tasks.md) are the planning artifacts reviewed. All implementation tasks remain unchecked. No `verification.md`, archive or product acceptance is claimed. Re-evaluate both coverage directions if an authorized semantic revision changes these artifacts or if an insufficient upstream/source dependency is discovered; do not waive it by narrowing discovery or adding local policy. Apply still requires human authorization and post-Apply Verification remains mandatory before archive/integration.
