# A-watch planning coverage

## Reviewed inputs and scope

Change: `plan-upstream-updates`. Allocation unit: exactly `A-watch`.

Read the current [global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `e6a518b8b9c7f957ba222164a091873e4b6cd0af60cfc054a110f2e48cc52dfc`, reconciled on the existing PR #44 from revision `2b5edf80d76af6d83e0edc2d6d23b0824d42c20b` under the 2026-10-13 mission. The fingerprints below identify the revised candidate inputs, not their preceding bytes. Its qualified passages select:

- [Distribution Capture](../../../engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), SHA-256 `59b54e5ecc19861ce13da5c018d9ba546a4ff33f215fe678d1cda2e01ae0649a`: `C-watch`, `C-autonomy`, `R-updates`, plus the A-inputs admissibility dependency in `C-inputs`.
- [Release/Watch Capture](../../../engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), SHA-256 `0cfd081230e972027c18d53819203079e8267a88ae47e3fa473925b801a5f5cb`: `C-watch`, `C-selection`, `C-determinism`, `C-semver`, `C-channels` and `R-frugality` with their conditions, exclusions and responsibility boundaries.

These projections retain instituted-source authority, including `S-release-watch-design`, `S-local-reconciliation` and `S-release-refinement`. Their related projections are not independent corroboration. The examination covers Captures-to-A-watch and A-watch-to-Change derivation, not a new audit of the complete upstream authority chain or historical implementation acceptance.

`S-watch-native` in both Captures denotes the instituted 2026-10-13 user mission: replace dedicated Gmail delivery with native Actions completion notifications and direct summary consultation, accept notifications for normal empty plans and add independent manual planning without candidate preparation. It expressly preserves Friday 08:00 Paris scheduling and the other obligations. It supersedes the earlier `S-watch-exploration` mail/empty-plan/privacy choices, whose user-adopted Proposition remains retrievable at the preceding PR revision; no address value is recorded. No public conversation permalink is available. The mission authorizes bounded documentary reconciliation, not implementation, integration or settings changes.

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
| D/W `C-watch`: complete plan contents, exact parameters/link, maintainer selects zero/one/several jobs | Actionable human job plan: every eligible pair, parameters and candidate references; forecast is not qualification | 3.3, 3.4 |
| D/W `C-watch`, `S-watch-native`: direct consultation and honest outcomes | Readable execution outcomes: complete nonempty plan, normal empty plan and failed discovery/state/calculation remain distinct and readable without raw logs | 4.1, 4.2, 5.1 |
| D/W `C-watch`, `S-watch-native`: native notifications with capability/preference limits, including empty plans | Native completion notifications: no custom transport or guaranteed push/format/delivery; the execution summary remains directly consultable | 4.4 |
| D/W `C-watch`, D `C-autonomy`, `S-watch-native`: independent manual planning without candidate initiation | Independent manual planning: Watch dispatch recalculates/presents the plan with unchanged policy, independently of cron and distinctly from Updates | 4.2, 4.3, 4.4 |
| D/W `C-watch`, W `R-frugality`: weekly schedule, accepted deactivation, manual reactivation/no keepalive; S-watch-native: retained Friday 08:00 Paris | Weekly Paris schedule: seasonal time changes, inactivity deactivation remains manual | 4.3, 4.4 |
| D `C-autonomy`, D/W `C-watch`, W `C-determinism`: stop at plan; independent human preparation and integration, retained mandatory gates | Planning stops before preparation: no source/candidate/repository/publication mutations or candidate dispatch; manual preparation stays independent | 3.4, 4.3, 5.1 |
| D `R-updates`, W `R-frugality`, `C-selection`, `C-determinism`: deterministic nominal operation; no refusal registry, reservation/lock/version-domain machinery | Stateless deterministic operation: eligible unselected pairs recur, reference progression removes superseded work naturally; transient diagnostics never drive future selection | 3.1, 3.2, 4.2, 4.3 |

Tasks 4.5 and 5.2 integrate the registered suites and complete-case evidence under the existing repository canon; they add no product requirement or new Verification stage. Optional copied `gh` commands remain optional presentation, not an additional mandatory job capability.

## Derivation conclusions and limits

**Captures → Allocation (`A-watch` only): PASS.** Forward examination attributes the full current D/W `C-watch` contribution (direct consultation, native capability/preference limits, normal empty results, explicit failures, weekly/manual planning and stop) to A-watch through its qualified references and reverse rows. Reverse examination grounds the unit's revised boundary and dependencies in those passages, with unchanged selection/calculation/authority references. Coverage, grounding, preservation and consistency hold in this bounded field; no other unit is reassigned or claimed newly verified. Prior global findings remain historical, not renewed by this review.

**Allocation → Change: PASS at documentary derivation level.** The following coverage conclusions follow independent forward and reverse reading of the revised requirements/scenarios, design and tasks; the correspondence table alone is not proof.

Allocation-unit to Change coverage: **100% at planning level**, after examining all selected watch passages, common constraints and dependency boundaries. Change to allocation-unit coverage: **100% at planning level**; the fifteen requirements above each trace to A-watch's selected responsibility, including the explicit bounded notification/manual-planning supersession. The table records semantic correspondence, not a count-based confidence score or an implementation verdict.

**Continuity of the examined chain: PASS.** The Allocation's refreshed Distribution/Release-Watch fingerprints match the inputs identified here; its current watch references resolve to the revised passages, including the renamed presentation heading. `S-watch-native`'s explicit supersession governs the two edges without promoting projections to independent authority. No operational Gmail obligation or implementation detail is retained in the current Capture obligations; no notification guarantee or selection/publication policy change is introduced. Institution-to-Capture fidelity outside this bounded new decision and implementation are not examined.

The bounded Updates run-name adjustment supplies candidate observation only. It adds no preparation eligibility restriction, dispatch requirement, branch replacement or publication behavior. Historical reads consume A-release provenance without changing its snapshot contract/policy. Existing source acquisition, build, package, acceptance and publication obligations remain outside realization by this Change, while their applicable watch dependencies and failure boundaries are retained.

The [proposal](proposal.md), [design](design.md), delta spec and [tasks](tasks.md) are the planning artifacts reviewed. All implementation tasks remain unchecked. No `verification.md`, archive or product acceptance is claimed. Re-evaluate both coverage directions if an authorized semantic revision changes these artifacts or if an insufficient upstream/source dependency is discovered; do not waive it by narrowing discovery or adding local policy. Apply still requires human authorization and post-Apply Verification remains mandatory before archive/integration.
