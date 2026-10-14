# A-watch planning coverage

## Selected identity and authority

Change: `simplify-watch-job-summary`. Exactly one allocation unit: **A-watch — Upstream planning and result presentation**. Selected repository revision: `089e6d994f302adf36461521ad1157151025b8d8`, the merged notifications reconciliation PR #45. Current input filenames were resolved from that revision's `.42p/engineering/` tree.

| Input | SHA-256 of examined bytes |
| --- | --- |
| [Global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) | `ed381776c7b45d559640174b66155947f9c2ec1537a6896ab24a539c660e441e` |
| [Distribution Capture](../../../engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md) | `e1a3d3beb5e025630a6dc5d5d26ce3f3cb08e7da0858a115d3584eaa1476f718` |
| [Release/Watch Capture](../../../engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md) | `1b4f23f3df25f73ec7d8da9ca5ad3015dfd9a23b154424878b80eeb0bb64ce94` |
| [Notifications Capture](../../../engineering/2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md) | `a2b1fe9cd3ae4c0df5ef884b1829ca86705f63d7a12868bd5cd65bc4a6439668` |

The Allocation also identifies the Site Capture; it contributes no selected A-watch obligation. These hashes establish input identity, not semantic correctness or independent corroboration. Read the immutable versions at the selected revision when checking this snapshot; relative links provide navigation to the repository files.

Examined passages are the complete A-watch unit, its boundary/dependencies and the notification-split continuity passage; D `C-watch`, `C-autonomy`, `R-updates`; W `C-watch`, `C-selection`, `C-determinism`, `C-semver`, `C-channels`, `R-frugality`; N `C-status`, `C-summary`, `C-trigger`, including source records and scoped supersessions. Current instituted decisions remain authority, particularly `S-watch-native`'s direct-summary/manual-planning portions and `S-notifications`, `S-reconciliation`, `S-allocation`, `S-notification-rules`' responsibility/notification refinements. D/W `S-release-refinement` retains A-release's current policy ownership and Watch's consumption boundary. Source records were read as supplied in the repository; their original private conversations were not reacquired and are not claimed independently verified.

## Realization basis and bidirectional correspondence

The basis is the [cumulative upstream-watch spec](../../specs/upstream-watch/spec.md) at the selected revision, with the [Change delta](specs/upstream-watch/spec.md) applied conceptually. Retained requirements remain binding; they are not duplicated into the delta merely to restate unchanged behavior. The three MODIFIED blocks preserve every original scenario. The added handoff is the current allocated producer obligation. The removed notification requirement is outside current A-watch and explicitly superseded, not silently omitted.

Each row maps the qualified A-watch command to the corresponding OpenSpec requirement and relevant scenarios/tasks; reading the row backwards grounds every retained or changed requirement in the same unit. Task numbers refer to [tasks](tasks.md); design decisions implement these obligations without adding requirements.

| A-watch obligation and selected attribution | OpenSpec requirement and scenario scope | Tasks |
| --- | --- | --- |
| D/W `C-watch`: official released sources and admissibility; exact stable/prerelease identities, unresolved reads fail | Retained **Official released upstream discovery**: published stable/experimental versions, development snapshot exclusion, unresolved inventory | 2.2, 3.1–3.2 |
| D/W `C-watch`: SQLite `3.53.4`, sqlite-vec `0.1.9` ordinary bounds, not manual prohibitions | Retained **Ordinary discovery baselines**: suffix ordering around the bound, manual older selection | 2.2, 3.2 |
| D/W `C-watch`, W `C-selection`/`C-determinism`: coherent published Git/npm/provenance and separate HEAD references; A-release owns state interpretation | Retained **Coherent publication references**: complete state and explicit incomplete/inconsistent failures | 2.2, 3.1–3.2 |
| W `C-selection`, D/W `C-watch`: stable componentwise progression, no regression or blockage by advanced next, combinations remain eligible | Retained **Stable pair eligibility**: stable maintenance alongside next, component regression, existing-version new pair | 2.2, 3.2 |
| W `C-selection`, D/W `C-watch`: experimental progression from next/latest fallback and both latest floors, suffix order | Retained **Experimental pair eligibility**: next behind latest, all eligible alphas, absent next | 2.2, 3.2 |
| W `C-selection`: historical corresponding-status publication excludes a pair; packaging correction/rollback adds no new job | Retained **Published pair exclusion**: rollback and several distribution identities with one composition | 2.2, 3.2 |
| W `C-selection`, D/W `C-watch`: signal current preparations/PRs, exact links/states, no duplicate preparation or false absence | Retained **Current candidate awareness**: active pre-PR preparation, open PR, unresolved candidate selection; delta **Actionable human job plan** covers complete candidate-backed presentation | 1.1–1.3, 2.1–2.2, 3.2 |
| W `C-determinism`/`C-semver`/`C-channels`: consume the single shared A-release calculation, independent unreserved forecasts, no local override/collision retry | Retained **Shared nonreserving forecasts**: shared snapshot, equal forecast numbers, later state/collision; A-release owns detailed stable-derived alpha policy | 1.1–1.2, 2.2, 3.2 |
| D/W `C-watch`, N `C-summary`: every exact pair, forecast channel/increment/version, parameters/link, human chooses zero/one/several, no qualification claim; simplify without information loss | Modified **Actionable human job plan**: no candidate, existing preparation, shared instructions, all entries already candidates | 1.1–1.3, 2.1, 3.2 |
| D/W `C-watch`, N `C-status`/`C-summary`: directly readable complete nonempty, normal empty success and explicit unsuccessful error; reference Summary/artifacts/diagnostics | Modified **Readable execution outcomes**: nonempty, empty, failed planning, failed presentation/evidence writing | 1.1–1.3, 2.1, 3.2 |
| D `C-autonomy`, D/W `C-watch`, N `C-trigger`'s producer portion: fresh manual plan independent of schedule, same read/compute/present behavior, no preparation or override input | Retained **Independent manual planning**: outside schedule and identical observed state under both triggers | 2.1–2.2, 3.2 |
| D/W `C-watch`, W `R-frugality`: Friday 08:00 Paris, seasonal time, accepted inactivity deactivation/manual reactivation, no keepalive | Retained **Weekly Paris schedule**: winter/summer and inactivity | 2.2, 3.2 |
| D `C-autonomy`, D/W `C-watch`, W `C-determinism`: stop at producer result, human preparation remains independent, no pins/build/dispatch/PR/merge/tag/publication | Modified **Planning stops before preparation**: successful execution preserves repository/candidate/publication state | 1.3, 2.1–2.2, 3.2 |
| D `R-updates`, W `R-frugality`/`C-selection`/`C-determinism`: deterministic nominal operation, no refusal/proposal registry, reservation/lock/second version/permanent distribution branch | Retained **Stateless deterministic operation**: recurring unselected pair and natural supersession | 2.2, 3.2 |
| Allocation A-watch handoff, N `C-status`/`C-summary`/`C-trigger`: actual result, technical outcome and concerned run reference; producer does not apply notification criteria/delivery | Added **Reference result handoff**: scheduled/manual success or empty, failed planning | 2.1, 3.2 |

**Removal correspondence.** Former **Native completion notifications** maps to the expressly superseded D/W notification portion, projected in N `C-status`/`C-summary`/`C-trigger` and Allocation's current A-watch/A-notifications split. Removing that obligation and the native-notification phrase in **Planning stops before preparation** implements the instituted boundary. Its migration text records downstream ownership and sequencing, without allocating notification eligibility or transport to this Change. GitHub account preferences remain outside scope. Tasks 1.3 and the later synchronization follow-up keep documentation honest; no account, delivery or sender task is added.

## Planning conclusion and limits

Forward examination covers all selected A-watch obligations, including retained discovery/calculation/scheduling, result presentation, technical status and handoff. Reverse examination grounds every delta and retained requirement in A-watch. **Allocation unit → Change: 100%; Change → allocation unit: 100%, at documentary planning level.** These conclusions follow examination of the selected passages and full requirement/scenario blocks, not requirement counts or hashes. Layout choices are downstream implementation choices under the allocated simplification obligation.

A-notifications' one-mail rule, content criterion, Resend transport, sender setup and delivery are not requirements/tasks here. Its current allocated contribution is preserved by the producer/consumer boundary, not claimed realized. A-inputs/A-release/A-updates dependencies remain with their owners. No global Capture derivation audit, full A-release policy verification, implementation verdict, live execution evidence or delivery claim follows from this mapping. If an applicable dependency or authority mismatch prevents full A-watch realization, stop and escalate rather than narrow this mapping or repair another unit locally.

Planning artifacts are complete; seven implementation tasks remain unchecked. Propose does not create a passed `verification.md`, synchronize the cumulative spec, archive or authorize merge. Recheck this mapping against current upstream snapshots before Apply and against the committed realization during the separately invoked post-Apply Verification.
