# Global Capture-derived Allocation

## Identity, source, and examined scope

Current direct inputs. The full reconciliation of 2026-10-10 is retained; the subsequent bounded review below re-examines the authorized release refinements and their affected contributions:

- [Distribution Capture](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), snapshot SHA-256 `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00`.
- [Site Capture](2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), snapshot SHA-256 `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085`.
- [Release/Watch Capture](2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), snapshot SHA-256 `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944`.

Reference prefixes `D`, `S` and `W` identify these scopes; a handle is local to its Capture. The links above retrieve the current input files; their fingerprints identify the exact bytes examined. The immutable comparison revision below preserves the preceding state, not these refreshed editorial snapshots. Instituted sources and decisions retain authority. Captures project them; this Allocation attributes responsibility without instituting requirements or certifying realization. Explicit scoped supersessions recorded in the Captures govern the revised release/watch matter. Related sources and projections are not independent corroboration.

This full reconciliation replaces the superseded unit descriptions and correspondence in the [comparison Allocation at PR #26 revision ce6707](https://github.com/at-rama/sqlite-vector-wasm/blob/ce6707d032d2a245a81b18bf6bf6ed55f5077764/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md). All nine unit identities remain. The review includes every Capture element, material relationships, boundary prose, provenance, and affected downstream contracts. Capture provenance preserves the preceding intervention's deferred scope; current-state passages now refer to this reconciled mapping. The status-only Capture corrections do not change attributed product obligations or responsibility boundaries.

A unit is a responsibility boundary, not a prescribed component. Its references below are attribution selectors: retrieve the full selected passages, including modalities, exclusions, conditions and exceptions, when preparing a realization contract or Verification. Short purposes and table rows are not self-contained specifications. Shared references distinguish production, checks, planning and publication roles; they do not multiply the underlying obligation.

Distribution-facing responsibilities share [D/C-purpose]'s runtime/selected-engine boundary and [D/C-nonmodification]'s permitted-glue boundary. Candidate and publication responsibilities retain [D/C-autonomy], [D/C-failure] and [W/C-determinism]'s human-authority and mandatory-gate boundaries. These apply through the compositions below; passing checks or a merge alone do not establish acceptance of the released payload. [D/C-obsolescence] and [D/R-engine] remain lifecycle/reconsideration context, without an automatic replacement or retirement implementation unit.

The [technical architecture](2026-10-04_sqlite-vec-wasm_technical_architecture_edit-0.1.md) supplies downstream realization context, not design authority or completion evidence. Historical Changes retain their own contracts, snapshots and evidence. The current contract impacts recorded below are distinct from Allocation coverage and do not constitute post-Apply Verification.

The user's subsequent `S-release-refinement` decisions, projected in Distribution `C-release`/`C-bootstrap` and Release/Watch `C-semver`/`C-publication`, refine the alpha required-base reference and bounded initial npm path. The incremental review covers `A-release` policy/publication/completion, `A-watch` and `A-updates` consumption of that common policy, and `A-bootstrap` setup/manual first-npm handoff. Their existing qualified references cover these contributions without new units or transferred duties. `A-release` owns read-only completion checking; `A-bootstrap` performs the unavoidable manual operation. Other inputs, boundaries, historical contracts and evidence are unchanged; this incremental review does not renew a global verification verdict. The active `publish-distribution` Change is reconciled against these refreshed snapshots; future watch/update/bootstrap Changes must consume the current references.

## Allocation units

### A-inputs — Upstream selection and acquisition

Identify and acquire the exact official source pair.

**Qualified references:** [D/C-purpose], official selected upstream inputs; [D/C-inputs], released-input admissibility, origins, repository-recorded pins/digests, integrity before use, acquisition preference/exceptions and source-tree exclusion; [D/R-inputs], archive/acquisition context; [W/C-provenance], input origins, versions and source digests.

**Boundary and dependencies:** apply the admissibility classified by `A-release` without owning channel policy. `A-updates` supplies candidate selections; verified exact sources feed `A-build`. Build-tool reproduction belongs to `A-build`, complete-path proof to `A-acceptance`. Official prereleases are admissible under the referenced rules; development snapshots remain excluded.

### A-build — Canonical browser build and static integration

Construct the canonical browser runtime with the selected engine.

**Qualified references:** [D/C-purpose] and [D/C-nonmodification], runtime/integration boundary; [D/C-inputs], pinned toolchain/options and clean build reproduction; [D/R-inputs], construction context and same-release SQLite components; [D/C-browser], construction of the retained baseline; [D/C-static], per-connection integration; [D/C-storage], upstream persistence behavior, conditions and prerequisite documentation; [W/C-provenance], build tools, options and environment.

**Boundary and dependencies:** consume `A-inputs`' verified pair; supply runtime/assets and build context to `A-package`. `A-acceptance` checks the produced behavior. The selected engine's released prerelease status does not remove browser, registration or storage obligations.

### A-package — Browser payload and consumer envelope

Prepare the complete consumable distribution payload.

**Qualified references:** [D/C-purpose] and [D/C-nonmodification], consumer/runtime and glue boundary; [D/C-inputs], clean packaging and generated-output exclusion; [D/C-browser], delivered assets, resolution, variants and exclusions; [D/C-storage], consumer prerequisite documentation and storage fidelity; [D/C-release], package envelope, licenses/notices and supplied identity/composition; [W/C-version-identity], carried distribution identity; [W/C-provenance], packaged metadata and output digests; [W/C-publication], exact payload handoff and effects of definitive-number changes.

**Boundary and dependencies:** consume `A-build`; supply the same identified package to `A-acceptance` and `A-release`. `A-release` owns numbering/channel decisions; `A-package` applies their payload consequences, allowing renewed checks. Exclusion of optional experimental build variants in [D/C-browser] does not exclude officially released upstream prereleases.

### A-acceptance — Production and browser acceptance

Establish the required evidence for the actual packaged runtime and complete production path.

**Qualified references:** [D/C-inputs], clean-path reproduction proof; [D/C-browser], [D/C-static] and [D/C-storage], behavior and prerequisite checks; [D/C-verification], the entire mandatory evidence/test field; [D/C-release] and [W/C-publication], evidence applicability to the authoritative revision and exact published payload, including package-affecting recalculation.

**Boundary and dependencies:** exercise `A-inputs` → `A-build` → `A-package` under the referenced real-browser conditions. Supply candidate-gate results to `A-updates` and applicable publication evidence to `A-release`; neither channel nor bootstrap waives the checks. Site checks belong to `A-site` and complement this responsibility.

### A-watch — Upstream planning and notification

Produce the human-readable upstream job plan.

**Qualified references:** [D/C-watch] and [W/C-watch], discovery sources/baselines, cadence, plan/email contents, scheduling and planning stop; [W/C-selection], pair eligibility, published references, candidate deduplication and no refusal registry; [W/C-determinism], [W/C-semver] and [W/C-channels], use of the shared calculation for forecasts; [D/C-autonomy], separation from manual initiation; [D/R-updates] and [W/R-frugality], applicable automation/state constraints and rationale.

**Boundary and dependencies:** use `A-inputs`' admissibility criteria, `A-release`'s publication state/policy and `A-updates`' current candidate state. A plan does not reserve a version or initiate candidate preparation. Forecast policy belongs to `A-release`; the common mechanism does not prescribe another unit.

### A-updates — Manual candidate preparation

Prepare an eligible candidate and stop at the pull request for human integration.

**Qualified references:** [D/C-inputs], candidate input records and clean acquisition composition; [D/C-autonomy], initiation, automated preparation and adoption boundary; [D/C-failure], eligibility stop; [D/C-nonmodification], intervention limit; [W/C-dispatch], exact selections, comment and rollback conditions; [W/C-candidate], complete preparation/PR boundary; [W/C-version-identity], candidate branches and code identity; [W/C-determinism], [W/C-semver] and [W/C-channels], application of shared policy during preparation; [W/C-provenance], invocation context; [D/R-updates] and [W/R-frugality], applicable constraints/rationale.

**Boundary and dependencies:** compose `A-inputs`, `A-build`, `A-package` and `A-acceptance`, using `A-release`'s calculation policy. Supply candidate state to `A-watch` and integrated revision/selection/comment context to `A-release`. Manual dispatch is independent of watch selection/history; human merge is the integration boundary, not proof of final-payload acceptance.

### A-release — Distribution policy and publication

Own the shared distribution calculation and publish the authorized, qualified payload.

**Qualified references:** [D/C-purpose], distribution publication boundary; [D/C-release], full identity/envelope/publication obligations; [D/C-autonomy], post-integration trigger; [D/C-failure], mandatory publication stop; [D/C-bootstrap], normal publication/authentication/attestation provisions and bounded exception relationship; [W/C-determinism], shared policy; [W/C-version-identity], [W/C-semver] and [W/C-channels], distribution/code identity, numerical/maturity/initial/alpha rules, channel classification and progression; [W/C-publication], definitive recalculation, uniqueness/collision and revision/payload/evidence binding; [W/C-provenance], full publication composition; [D/R-updates] and [W/R-frugality], applicable constraints/rationale.

**Boundary and dependencies:** supply policy/publication state to `A-watch` and `A-updates`; consume authorized integration context from `A-updates`, exact payload from `A-package` and applicable evidence from `A-acceptance`. Coordinate payload changes and renewed checks before publication. `A-bootstrap` establishes setup or the bounded first-npm exception and receives the accepted archive; `A-release` verifies the initial npm completion without new publication side effects. Published stable archives feed `A-site`. Policy ownership assigns responsibility without requiring a separate engine/service or relaxing checks.

### A-bootstrap — Initial publication setup

Establish the minimum initial setup for the normal publication path.

**Qualified references:** [D/C-bootstrap], unavoidable initial setup/first-npm exception, limits and publication mechanisms; [D/C-autonomy] and [W/C-publication], retained initial-publication exception within the human/verification lifecycle; [W/C-semver], consumption of the initial-version rule owned by `A-release`.

**Boundary and dependencies:** support `A-release`'s transition to normal publication. `A-acceptance` and revision/payload identity remain applicable; the exception neither creates a recurring manual publication path nor replaces recurring human initiation/integration.

### A-site — Public presentation and demonstration

Deliver the public site and its demonstration of the actually distributed runtime.

**Qualified references:** [S/C-site], surface/navigation; [S/C-readme], presentation source/deployment links; [S/C-demo-release], published stable runtime consumption and fixed deployment identity; [S/C-emoji], corpus/data identity, licensing and limits; [S/C-vector-modes], representations/loading/selection; [S/C-interaction], exploration behavior; [S/C-search], textual start and actual vector execution; [S/C-memory], connection lifetime; [S/C-demo-checks], full scoped checks; [S/R-demo], rationale/observations and their limits; [S/Q-volume] and [S/Q-realization], retained open choices; [W/C-version-identity] and [W/C-channels], stable-publication identity consumed by the demo.

**Boundary and dependencies:** consume the public README and `A-release`'s published stable archive. Site data/UI/deployment stay within this one unit; they do not rebuild the engine, create a third distribution channel or replace `A-acceptance`. `next` does not trigger experimental demo deployment. [S/O-corpus] remains an unselected alternative; open choices create no additional readiness gate.

## Reverse correspondence and examined limits

The following correspondence accounts for all 41 non-source handles. Attribution to several units selects distinct contributions; contextual treatment is explicit. Unit references above retain the source's full obligations rather than replacing them with the table's summaries.

| Capture element | Qualified contributions or contextual treatment |
| --- | --- |
| [D/C-purpose] | `A-inputs`: official selected inputs; `A-build`: canonical integration; `A-package`: browser consumption; `A-release`: distribution. Runtime/engine scope constrains their composition. |
| [D/C-nonmodification] | `A-build`/`A-package`: allowable integration/glue; `A-updates`: intervention. Common distribution boundary excludes added product behavior. |
| [D/C-inputs] | `A-inputs`: admissibility/origins/pins/digests/acquisition exceptions; `A-build`: pinned tools/options and reproduction; `A-package`: clean packaging/output exclusion; `A-acceptance`: full-path proof; `A-updates`: candidate records/composition. Channel policy is `A-release`'s W/C-channels contribution, consumed by `A-watch` and `A-inputs`. |
| [D/R-inputs] | `A-inputs`: acquisition context; `A-build`: construction context and mandatory common SQLite release. Context alone adds no task. |
| [D/C-browser] | `A-build`: baseline production; `A-package`: complete consumer asset/variant surface; `A-acceptance`: baseline checks. Exclusions travel with each contribution. |
| [D/C-static] | `A-build`: every-connection registration; `A-acceptance`: its checks. |
| [D/C-storage] | `A-build`: behavior/conditions; `A-package`: faithful consumer behavior/documentation; `A-acceptance`: mandatory persistence evidence under those prerequisites. |
| [D/C-release] | `A-release`: policy, identity, publication and notices; `A-package`: envelope/metadata/notices; `A-acceptance`: authoritative-revision/exact-payload evidence. Watch forecasts, candidate preparation and bootstrap consume that policy through their dependencies; none owns an alternative number. |
| [D/C-verification] | `A-acceptance`: all mandatory controls and evidence conditions; `A-updates`/`A-release` consume the corresponding gate results/applicable evidence. |
| [D/C-watch] | `A-watch`: complete planning/notification/scheduling boundary; candidate/publication state supplied by `A-updates`/`A-release`. |
| [D/C-autonomy] | `A-updates`: initiation/preparation/human integration; `A-release`: normal post-merge publication; `A-bootstrap`: bounded initial exception; `A-watch`: planning stops before initiation. |
| [D/R-updates] | `A-watch`/`A-updates`/`A-release`: shared calculation, constrained automation/state and human authority; earlier alternatives remain rationale, not current conflicting rules. |
| [D/C-failure] | `A-updates`: candidate/integration eligibility stop; `A-release`: publication stop; contributing production/acceptance results remain mandatory. No waiver or automatic repair responsibility is invented. |
| [D/C-bootstrap] | `A-bootstrap`: initial setup/exception; `A-release`: normal mechanisms, authentication, attestation/provenance and their supported exceptions. |
| [D/C-obsolescence] | Conditional end-of-responsibility/reconsideration context shared by the Allocation. No automatic implementation or retirement is allocated. |
| [D/R-engine] | Selected-engine rationale, unselected alternatives and human reconsideration context for the runtime boundary. No replacement, abstraction or versioning responsibility is invented. |
| [S/C-site] | `A-site`: public surface/navigation; no independently allocated framework or deployment unit. |
| [S/C-readme] | `A-site`: single presentation source and usable deployed links; documentation updates remain separable from fixed demo runtime. |
| [S/C-demo-release] | `A-site`: actual published stable archive, fixed demo identity and displayed composition; `A-release` supplies the publication through the dependency. |
| [S/C-emoji] | `A-site`: full selected corpus, embeddings/names, upstream limits, pinned data and attribution/license. |
| [S/C-vector-modes] | `A-site`: both representations, dimensions/padding, distances, initial/optional loading and common selection behavior. |
| [S/C-interaction] | `A-site`: all exploratory interaction behavior. |
| [S/C-search] | `A-site`: textual starting point and real SQLite/sqlite-vec vector execution, with model/service exclusions. |
| [S/C-memory] | `A-site`: transient connection closure; no invented authentication/persistence cleanup. |
| [S/C-demo-checks] | `A-site`: independent deterministic checks for both modes on published WASM and navigation; complement `A-acceptance`. |
| [S/R-demo] | `A-site`: rationale/quality orientation and reported-size limits; observations are neither renewed evidence nor thresholds. |
| [S/O-corpus] | Unselected earlier alternative contextualizes `A-site`; no second dataset obligation. |
| [S/Q-volume] | `A-site`: open final-volume measurement; no instituted size gate. |
| [S/Q-realization] | `A-site`: choices left to realization within captured behavior; no adopted subdivision or new passage condition. |
| [W/C-determinism] | `A-release`: common calculation policy; `A-watch`: forecast use; `A-updates`: preparation use; human authority constrains the whole candidate/publication composition. |
| [W/C-version-identity] | `A-release`: distribution/code identity and branch model; `A-updates`: candidate branches/commit identity; `A-package`: carried identity; `A-site`: published identity consumption. |
| [W/C-semver] | `A-release`: full numerical, maturity, initial/default and alpha-series policy; `A-watch`/`A-updates`: calculation use; `A-bootstrap`: initial-rule consumption. Compatibility evidence remains `A-acceptance`'s distinct contribution. |
| [W/C-channels] | `A-release`: classification, separate HEADs, monotonic progression and shared namespace; `A-watch`/`A-updates`: forecast/preparation use; `A-site`: stable-publication consumption. |
| [W/C-watch] | `A-watch`: official discovery/baselines, weekly email plan contents, stop and scheduling lifecycle, including no keepalive. |
| [W/C-selection] | `A-watch`: pair progress/no-regression filters, published references, candidate deduplication and absence of refusal memory; manual selections remain outside these watch filters. |
| [W/C-dispatch] | `A-updates`: exact inputs/comment, manual independence, rollback classification/comment; `A-release` consumes invocation context for numbering/provenance. |
| [W/C-candidate] | `A-updates`: full preparation composition ending at a PR; producing units and `A-acceptance` retain their respective contributions. |
| [W/C-publication] | `A-release`: definitive recalculation, collision/uniqueness, authoritative revision/payload/publication; `A-package`: resulting payload changes; `A-acceptance`: applicable/renewed evidence; `A-bootstrap`: retained bounded exception. |
| [W/C-provenance] | `A-inputs`: sources; `A-build`: tools/options/environment; `A-package`: output digests/metadata; `A-updates`: invocation context; `A-release`: complete cross-publication identity/composition. |
| [W/R-frugality] | `A-watch`/`A-updates`/`A-release`: material state/automation prohibitions and shared-policy boundary; retained alternatives/rationale do not create extra mechanisms. |
| [W/C-reconciliation] | Documentary reconciliation instruction: this Allocation replaces its superseded mapping, reports downstream impacts and preserves history. It is not a product realization unit or evidence of implementation. |

All 18 source handles have the following provenance treatment. Their decisions/relationships govern interpretation of the attributed passages; they do not create source-processing product units.

| Scope | Source handles and treatment |
| --- | --- |
| Distribution | [D/S-release-watch-design] and [D/S-local-reconciliation]: scoped supersessions; [D/S-capture-reconciliation]: adopted Capture-level reconciliation; [D/S-product-design]: identity/engine decision; [D/S-spec]: immutable historical contract; [D/S-release-model], [D/S-doc-model] and [D/S-watch-model]: retained lifecycle/documentation/watch provenance with recorded revision limits. |
| Site | [S/S-capture-reconciliation] and [S/S-product-design]: bounded provenance/identity consequences; [S/S-site-design] and [S/S-site-exploration]: behavior, observations and alternatives; [S/S-site-mission]: representation migration and one instituted site unit. |
| Release/Watch | [W/S-capture-reconciliation]: earlier bounded reconciliation scope; [W/S-release-watch-design] and [W/S-local-reconciliation]: design and explicit scoped revisions; [W/S-capture-mission]: dedicated Capture identity; [W/S-repository-state]: retrievable comparison/provenance state, not decision authority or implementation evidence. |

Material prose outside handles is also covered: scope/authority and explicit revision relations govern this input interpretation; Distribution's material relationships ground the acquisition/build/package/acceptance and watch/candidate/publication compositions; Site's separation/open-choice prose constrains `A-site`; Release/Watch's retained-invariant prose and impact map constrain the common lifecycle and the downstream findings below. Historical source setup restrictions remain attached to their interventions rather than becoming permanent product restrictions. Moving upstream documentation and source-stated technical context are not renewed evidence.

**Bidirectional result:** the full three-Capture responsibility field is accounted for: 41 non-source elements, 18 provenance elements, material prose and all nine units. Every material realization obligation has qualified production/check/publication contributions; every unit contribution and dependency has current grounding. There is no unresolved Allocation attribution or new unit. This is a semantic Capture↔Allocation responsibility result, not a claim of fidelity to reacquired original sources, current implementation conformity or release readiness. Open Site choices retain their original role.

**Downstream impacts outside this edit:** the active [upstream-inputs spec](../openspec/specs/upstream-inputs/spec.md) and [browser-build spec](../openspec/specs/browser-build/spec.md) retain superseded stable-only qualifiers; [source-acquisition documentation](../../docs/source-acquisition.md) and the current resolver likewise describe/enforce the older restriction. They need allocated realization/contract reconciliation before prerelease support can be claimed. Exact candidate dispatch does not by itself remove the acquisition helper's separate omitted-version convenience. The [browser-package](../openspec/specs/browser-package/spec.md) and [browser-acceptance](../openspec/specs/browser-acceptance/spec.md) contracts retain payload/evidence boundaries; their applicability must be reassessed for changed inputs or package-affecting numbers, without inferring a blanket failure. Four archived Changes retain historical snapshot-bound coverage/evidence; there is no active Change to rewrite. Capture current-state passages have been refreshed to reflect this responsibility reconciliation; their earlier mission scopes remain identifiable in provenance. Canon/context prose referring to two Captures still needs a separately scoped adjustment. This status-only update changes no responsibility, contract, implementation, canon or historical evidence.

[D/C-purpose]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-purpose--responsibility-and-runtime-boundary
[D/C-nonmodification]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-nonmodification--added-behavior-and-patch-boundary
[D/C-inputs]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-inputs--source-authority-integrity-acquisition-and-reproduction
[D/R-inputs]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#r-inputs--source-stated-build-context
[D/C-browser]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-browser--retained-browser-baseline
[D/C-static]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-static--per-connection-extension-availability
[D/C-storage]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-storage--conditional-browser-and-persistence-availability
[D/C-release]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-release--version-revision-payload-and-distribution-identity
[D/C-verification]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-verification--required-evidence-and-test-conditions
[D/C-watch]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-watch--upstream-awareness-and-notification-boundary
[D/C-autonomy]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-autonomy--manually-initiated-candidate-and-human-adoption-lifecycle
[D/R-updates]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#r-updates--mechanical-automation-and-authority-boundary
[D/C-failure]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-failure--failed-update-and-intervention-boundary
[D/C-bootstrap]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-bootstrap--publication-setup-exception-and-publication-mechanisms
[D/C-obsolescence]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#c-obsolescence--end-of-project-responsibility
[D/R-engine]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#r-engine--selected-engine-trade-offs-and-reconsideration
[D/S-release-watch-design]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-local-reconciliation]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-capture-reconciliation]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-product-design]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-spec]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-release-model]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-doc-model]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[D/S-watch-model]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[S/C-site]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-site--public-surface-and-navigation
[S/C-readme]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-readme--one-public-presentation-source
[S/C-demo-release]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-demo-release--published-runtime-consumption
[S/C-emoji]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-emoji--corpus-identity-and-limits
[S/C-vector-modes]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-vector-modes--default-binary-and-optional-float32
[S/C-interaction]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-interaction--small-exploratory-interface
[S/C-search]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-search--text-starting-point-and-actual-vector-execution
[S/C-memory]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-memory--transient-connection-lifetime
[S/C-demo-checks]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#c-demo-checks--scoped-deterministic-verification
[S/R-demo]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#r-demo--small-web-friendly-demonstration
[S/O-corpus]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#o-corpus--earlier-miniature-corpus-alternative
[S/Q-volume]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#q-volume--final-sqlite-size
[S/Q-realization]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#q-realization--openspec-realization-choices
[S/S-capture-reconciliation]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#material-sources
[S/S-product-design]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#material-sources
[S/S-site-design]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#material-sources
[S/S-site-exploration]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#material-sources
[S/S-site-mission]: 2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md#material-sources
[W/C-determinism]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-determinism--mechanical-calculation-and-human-authority
[W/C-version-identity]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-version-identity--one-distribution-version-domain
[W/C-semver]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-semver--deterministic-increments-and-maturity-ceiling
[W/C-channels]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-channels--stable-and-experimental-publication
[W/C-watch]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-watch--weekly-planning-and-email-boundary
[W/C-selection]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-selection--two-dimensional-eligibility-and-no-refusal-registry
[W/C-dispatch]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-dispatch--exact-manual-selection-and-rollback
[W/C-candidate]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-candidate--automated-preparation-ending-at-a-pr
[W/C-publication]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-publication--authorized-integration-definitive-version-and-exact-payload
[W/C-provenance]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-provenance--distribution-composition-and-publication-identity
[W/R-frugality]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#r-frugality--bounded-automation-and-retained-alternatives
[W/C-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-reconciliation--replace-superseded-active-rules-preserve-history
[W/S-capture-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-release-watch-design]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-capture-mission]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-local-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-repository-state]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
