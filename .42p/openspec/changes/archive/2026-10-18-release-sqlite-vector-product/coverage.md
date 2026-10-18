# A-release planning coverage

## Identity and scope

Unit: **A-release**, not the whole Allocation. The source is the [Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `00ab76dd9cd370ca1cf6e5cf6a8943efbf5076500bcd583b7c38932c7ff39840`, with the exact Capture inputs recorded there; the same PR records the explicitly adopted S-transition-references decision. Comparison main: `28c382dea0a7b81178d3a2440639d58dada6016c`. Paths below identify the current proposed input snapshot, not a claim that the changed bytes existed at that comparison commit.

Start: the complete A-release attributed responsibility field, including full qualified D/W passages, common authority/glue boundaries and handoffs. End: this proposal, delta, design and tasks plus the retained synchronized distribution-release requirements. This planning map records intended checks, not executed implementation evidence or post-Apply Verification. Baseline requirements not modified by the delta remain binding in full, with their scenarios.

## Allocation to effective Change contract

| Attributed source portion | Effective contract requirements | Design / tasks |
| --- | --- | --- |
| D/C-purpose; D/C-release; W/C-version-identity: one browser product, exact scoped npm/GitHub identity, no separate code SemVer or parallel product | Single distribution identity; Shared deterministic calculation; Matching consumer payload and notices | Decisions 1/3/4; 1.1, 2.1–2.2, 3.2 |
| W/C-determinism; D/R-updates; W/R-frugality: common deterministic policy, no AI, reservations, second registry or automatic adoption | Shared deterministic calculation; Component-aware comparison references; Complete publication state and uniqueness | Decisions 1/2; 1.1–1.2, 4.2 |
| W/C-semver; D/C-release: first-transition MINOR/0.x, subsequent numerical/suffix/maturity/default rules, historical initial stable 0.1.0 | Numerical upstream increment; Distribution maturity ceiling; Selected stable bootstrap | Decision 2; 1.2, 3.2 |
| W/C-channels/C-semver: upstream-derived channel, per-channel progression, alpha base/continuation/closure, definitive nonreservation | Upstream-derived publication channel; Independent channel progression and alpha series; Definitive identity before final qualification | Decisions 2/4; 1.2, 2.2 |
| W/C-selection/C-dispatch under S-transition-references: SQLite channel reference, Vector same-engine channel/latest/absence, comparable rollback comment, no foreign-engine ordering | Component-aware comparison references; Numerical upstream increment; Complete publication provenance | Decision 2; 1.1–1.2, 3.1 |
| D/C-autonomy/C-failure; W/C-publication: exact human-integrated context and stop on mandatory failure; unrelated merge not publication intent | Human-authorized integration trigger; Applicable complete acceptance evidence; Publication failures remain explicit | Decisions 3/4/5; 2.1–2.2, 3.2 |
| D/C-release; W/C-publication: current state, uniqueness, no overwrite/retry/locks and exact authoritative commit/definitive bytes | Complete publication state and uniqueness; Definitive identity before final qualification; Matching consumer payload and notices | Decisions 1/4/5; 1.1–1.2, 2.2, 3.2 |
| D/C-purpose/C-release/C-failure; allocated producer/acceptance handoffs: complete browser runtime, upstream behavior, notice/integrity and all required exact-payload evidence | Applicable complete acceptance evidence; Matching consumer payload and notices; Definitive identity before final qualification | Decision 4; 2.2, 4.1–4.2; producers reused, no implementation of A-build/A-package/A-acceptance |
| W/C-provenance; D/C-release: code/tag/package/channel, exact SQLite/engine origins/versions/digests, tools/options/environment/output digests and comment | Complete publication provenance; Complete publication state and uniqueness | Decisions 1/4/5; 1.1, 2.2, 3.1 |
| S-transition-version through D/C-release/W/C-publication: bounded breaking-change Release notice and downstream public SQL guidance | Complete publication provenance | Decision 5; 3.1; A-site_docs consumes the information, its public page/example remains outside this Change |
| D/C-bootstrap; W/C-publication: normal trusted publishing/attestation, bounded initial exception and read-only historical completion | Trusted publishing and supported attestations; Bounded initial npm exception; Selected stable bootstrap | Decision 5; 3.2; no account/configuration or fresh first-publication exception |
| D/C-failure; W/C-publication: diagnostics/partial-state preservation and no repair; generated outputs uncommitted | Publication failures remain explicit; Complete publication state and uniqueness | Decisions 5/6; 3.2, 4.1–4.2 |
| Unit handoffs: common policy to Watch/Updates, exact payload from package/acceptance, initial setup from bootstrap, stable publication to Site | Shared deterministic calculation; Component-aware comparison references; Human-authorized integration trigger; Matching consumer payload and notices; Bounded initial npm exception | Decisions 3/4/6; 2.1–2.2, 3.1–3.2, 4.1–4.2 |

W/Q-engine-transition now retains only the discovery baseline, assigned to A-watch. Its absence is not an unresolved A-release attribution or a reason to invent a value. Historical source/provenance and unselected alternatives remain context; no source-processing unit, migration framework, engine-specific channel or public Node/WASI runtime is added. No old source, compatibility, acceptance, publication or human gate is waived.

## Effective Change contract to Allocation

| Requirement | Disposition | Grounding and planned checks |
| --- | --- | --- |
| Shared deterministic calculation | MODIFIED complete block | W/C-determinism, D/C-purpose/R-updates; tasks 1.1, 2.1, 4.2 |
| Single distribution identity | Retained baseline, unchanged full block/scenarios | D/C-release, W/C-version-identity; tasks 2.1–2.2, 3.2 |
| Numerical upstream increment | MODIFIED complete block | W/C-semver, D/C-release, S-transition-version; tasks 1.2 |
| Distribution maturity ceiling | MODIFIED complete block | W/C-semver and the explicit one-off MINOR/0.x decision; task 1.2 |
| Selected stable bootstrap | MODIFIED complete block | W/C-semver, D/C-bootstrap; tasks 1.2, 3.2 |
| Upstream-derived publication channel | Retained baseline, unchanged full block/scenarios | D/C-inputs/C-release, W/C-channels; tasks 1.1–1.2 |
| Independent channel progression and alpha series | MODIFIED complete block | W/C-semver/C-channels; task 1.2 |
| Complete publication state and uniqueness | MODIFIED complete block | D/C-release, W/C-publication/C-provenance; tasks 1.1–1.2, 3.2 |
| Human-authorized integration trigger | MODIFIED complete block | D/C-autonomy, W/C-determinism/C-publication; task 2.1 |
| Definitive identity before final qualification | MODIFIED complete block | D/C-release, W/C-publication; task 2.2 |
| Applicable complete acceptance evidence | MODIFIED complete block | D/C-release/C-failure and allocated full acceptance handoff, W/C-publication; tasks 2.2, 4.1–4.2 |
| Matching consumer payload and notices | Retained baseline, unchanged full block/scenarios | D/C-purpose/C-release, W/C-publication; tasks 2.2, 3.2, 4.1 |
| Complete publication provenance | MODIFIED complete block | W/C-provenance/C-publication, D/C-release/S-transition-version; tasks 3.1–3.2 |
| Trusted publishing and supported attestations | Retained baseline, unchanged full block/scenarios | D/C-bootstrap; task 3.2 |
| Bounded initial npm exception | MODIFIED complete block | D/C-bootstrap, W/C-publication; task 3.2 |
| Publication failures remain explicit | Retained baseline, unchanged full block/scenarios | D/C-failure, W/C-publication/R-frugality; tasks 3.2, 4.1–4.2 |
| Component-aware comparison references | ADDED | W/C-selection/C-dispatch and S-transition-references; tasks 1.1–1.2 |

Proposal scope is exactly A-release; design choices refine its existing helpers, descriptor, provenance and release exercise. Every task implements or verifies an attributed requirement above, with tests/documentation attached to each group. No baseline requirement is removed and no outside unit is claimed implemented. All material A-release portions and every effective requirement have entries in both directions: intended coverage is 100% each way, to be independently checked by derivation review before Apply. This map is not evidence that any planned check has run.
