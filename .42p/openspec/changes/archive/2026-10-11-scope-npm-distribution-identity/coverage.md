# A-release planning correspondence

## Inputs and contract composition

This Change realizes exactly `A-release` from the [global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), examined at main revision `32f62b8547801f8f3a21eeaed0fd41ac4c3a5abe`, SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`.

| Current Capture | SHA-256 |
| --- | --- |
| Distribution, `2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md` | `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00` |
| Site, `2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md` | `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085` |
| Release/Watch, `2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md` | `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944` |

The Site Capture identifies an input to the global Allocation; its implementation is outside A-release. The selected Distribution (D) and Release/Watch (W) passages include their full modalities, conditions, exclusions, bounded exceptions, source relationships and material lifecycle prose. Instituted sources remain authoritative; document fingerprints identify projections rather than corroborate their fidelity. The additional concrete user identity decision and its limits are recorded in [proposal](proposal.md).

The effective Change contract is the [complete synchronized distribution-release spec](../../specs/distribution-release/spec.md), SHA-256 `968acac29f9e1e15faee7e9e5fed30c02072b33773837994e8d8fb87c6f01b86`, with Single distribution identity replaced by the [full delta block](specs/distribution-release/spec.md). Every other requirement and every existing scenario is explicitly retained, not presumed implemented or accepted from an archive. The proposal, design and tasks constrain realization of that composition. This lets the delta remain narrow while the coverage gate examines the whole allocation unit.

## Forward correspondence

Requirement names in this table refer to that composed contract; each row includes every scenario of its named requirements. Tasks 1.1 and 4.1 apply throughout.

| Entire allocated contribution | Requirements and scenario field | Realization / preservation tasks |
| --- | --- | --- |
| D/C-purpose and D/C-release: one browser distribution, independent product/version/revision identity, npm/GitHub delivery, no second code/runtime distribution | Single distribution identity (modified); Matching consumer payload and notices | 2.1–2.3, 3.1–3.3, 4.2 |
| W/C-determinism, D/R-updates: common deterministic calculation, shared forecast/preparation/publication consumption, no AI/reservation or independent policy | Shared deterministic calculation | 2.1–2.2, 3.2 |
| D/C-release and W/C-version-identity: distribution-only SemVer, exact code commit, tag/npm version relationship, no code SemVer/composition number/permanent distribution branch | Single distribution identity (modified, retained clauses) | 2.1–2.2, 3.2, 4.2 |
| D/C-release and W/C-semver: maximum numerical signals, suffix-independent classification, default PATCH, maturity ceiling, rollback comment and initial stable rule | Numerical upstream increment; Distribution maturity ceiling; Selected stable bootstrap | 2.1–2.2, 3.1, 4.2 |
| D/C-release, W/C-semver and W/C-channels: upstream-derived channel, own alpha counter, one namespace/separate HEADs, monotonicity, stable-reference required base, continuity/replacement/closure, distinct rollback reference | Upstream-derived publication channel; Independent channel progression and alpha series | 2.1–2.2, 3.1 |
| D/C-release, W/C-publication and W/R-frugality: complete actual state, recalculation, uniqueness, collision failure, no overwrite/retry/reservation/application lock; unavailable state is not empty history | Complete publication state and uniqueness; Definitive identity before final qualification; scoped-state/wrong-name/absence scenarios of Single distribution identity | 2.1–2.2, 3.1 |
| D/C-autonomy, W/C-determinism and W/C-publication: human candidate integration into main, exact resulting revision/selection/comment, preparation and checks alone do not authorize publication | Human-authorized integration trigger | 2.2, 3.1–3.2, 4.2 |
| D/C-release, D/C-failure and W/C-publication: consume complete applicable acceptance evidence, qualify definitive metadata/bytes, no PR-head shortcut, no waiver or upstream repair; stop on mandatory failure | Definitive identity before final qualification; Applicable complete acceptance evidence; Publication failures remain explicit | 2.2, 3.1, 4.2 |
| D/C-release and W/C-publication: same qualified archive at both destinations, supplied identity, browser envelope/notices, no consumer compilation/repack/runtime modification | Matching consumer payload and notices; scoped-consumer scenario of Single distribution identity | 2.2, 3.1–3.3, 4.2 |
| D/C-release and W/C-provenance: exact code/upstream/source/build/output identity, channel/comment, rollback notes, no competing manual version registry | Complete publication provenance; Single distribution identity | 2.2–2.3, 3.1, 4.2 |
| D/C-bootstrap: ordinary trusted publication, supported verifiable provenance/attestations, explicit unsupported fallback, no normal persistent publishing credentials | Trusted publishing and supported attestations | 3.1, 4.1–4.2 |
| D/C-bootstrap and W/C-publication: bounded npm-only first exception, automatic tag/GitHub archive/evidence, exact handoff to A-bootstrap, pending until read-only identity/byte completion, no recurring manual publisher/repair/recreation | Bounded initial npm exception; initial scoped absence/matching/wrong-name scenarios of Single distribution identity | 3.1, 4.2 |
| D/C-failure, W/C-publication and W/R-frugality: explicit partial outcomes and retained diagnostics, no destructive compensation, no successful destination substituted for both, generated outputs uncommitted | Publication failures remain explicit | 3.1, 4.1–4.2 |

## Reverse correspondence

| Contract requirement | Allocated grounding |
| --- | --- |
| Shared deterministic calculation | W/C-determinism; D/R-updates |
| Single distribution identity, including all added scoped scenarios | D/C-purpose, D/C-release, W/C-version-identity, W/C-publication, W/C-provenance and the user's concrete npm selection |
| Numerical upstream increment | D/C-release; W/C-semver |
| Distribution maturity ceiling | D/C-release; W/C-semver |
| Selected stable bootstrap | D/C-release, D/C-bootstrap; W/C-semver |
| Upstream-derived publication channel | D/C-release; W/C-channels |
| Independent channel progression and alpha series | D/C-release; W/C-semver, W/C-channels |
| Complete publication state and uniqueness | D/C-release; W/C-determinism, W/C-publication, W/R-frugality |
| Human-authorized integration trigger | D/C-autonomy; W/C-determinism, W/C-publication |
| Definitive identity before final qualification | D/C-release; W/C-publication |
| Applicable complete acceptance evidence | D/C-release, D/C-failure; W/C-publication |
| Matching consumer payload and notices | D/C-purpose, D/C-release; W/C-publication |
| Complete publication provenance | D/C-release; W/C-provenance |
| Trusted publishing and supported attestations | D/C-bootstrap |
| Bounded initial npm exception | D/C-bootstrap; W/C-publication |
| Publication failures remain explicit | D/C-failure; W/C-publication, W/R-frugality |

The additional scoped scenarios instantiate the already allocated name/history/provenance/completion identity and fail-closed boundaries. Product identity is not an unscoped npm prescription; “unprefixed npm version” excludes the Git tag prefix from SemVer, not an npm scope from the package name. Packaging and acceptance remain supplied-identity consumers; no A-package migration or global Capture/Allocation rewrite is inferred.

Design decisions centralize actual duplicated literals and construct the required registry request without new policy parameters, schema, state domain or unit. Consumer tests and current documentation align that supplied identity. Tasks retain all applicable controls and separately renew the changed archive's qualification; none adds a publisher, waives the post-integration evidence requirement or grants external setup authority. A-watch's future consumption and A-site's stable-archive use remain dependencies, not implementation work here. Lifecycle/engine reconsideration context supplies no automatic retirement or replacement mechanism.

## Planning disposition

The composed contract accounts for every identified A-release obligation and grounds all sixteen requirements, their complete scenario field, and the proposal/design/task boundaries: allocation-unit → Change 100%; Change → allocation-unit 100%, as a planning semantic judgment. This is not a separate upstream derivation audit, post-Apply Verification, implementation acceptance, account-access proof or publication authorization. Task 1.1 must reconfirm correspondence on the actual inputs before Apply; material changes invalidate affected mappings.

The cumulative spec is retained as a contractual input, not reused evidence of current implementation. Historical qualification of an unscoped archive cannot establish qualification of the scoped archive. Verification must examine the implemented candidate under the existing three controls and produce its identity-bound report before Archive. This proposal contains no Verification report and satisfies no merge-ready claim.
