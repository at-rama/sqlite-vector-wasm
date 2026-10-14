# Global Capture-derived Allocation

## Identity, source, and examined scope

Current direct inputs. Earlier full-design and release refinements remain historical comparison context; the current bounded reconciliation separates notification responsibility from planning/result presentation and re-examines the affected contributions and handoffs:

- [Distribution Capture](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), snapshot SHA-256 `e1a3d3beb5e025630a6dc5d5d26ce3f3cb08e7da0858a115d3584eaa1476f718`.
- [Site Capture](2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), snapshot SHA-256 `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085`.
- [Release/Watch Capture](2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), snapshot SHA-256 `1b4f23f3df25f73ec7d8da9ca5ad3015dfd9a23b154424878b80eeb0bb64ce94`.
- [Workflow Notifications Capture](2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md), snapshot SHA-256 `a2b1fe9cd3ae4c0df5ef884b1829ca86705f63d7a12868bd5cd65bc4a6439668`.

Reference prefixes `D`, `S`, `W` and `N` identify these scopes; a handle is local to its Capture. The links above retrieve the current input files; their fingerprints identify the exact bytes examined. The immutable comparison revision below preserves the preceding state, not these refreshed editorial snapshots. Instituted sources and decisions retain authority. Captures project them; this Allocation attributes responsibility without instituting requirements or certifying realization. Explicit scoped supersessions recorded in the Captures govern the revised release/watch matter. Related sources and projections are not independent corroboration.

The 2026-10-10 full reconciliation replaced the unit descriptions and correspondence in the [comparison Allocation at PR #26 revision ce6707](https://github.com/at-rama/sqlite-vector-wasm/blob/ce6707d032d2a245a81b18bf6bf6ed55f5077764/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md). Its original nine handles remain; the present S-allocation mission, projected under [N/S-allocation], adds `A-notifications` by extracting the notification contribution from `A-watch`. The current Allocation therefore has ten responsibility units, not ten prescribed components. The comparison for this bounded split is [PR #45 at 03be3b3](https://github.com/at-rama/sqlite-vector-wasm/blob/03be3b352a5e2d2dd5c0a0f5c93049df3ff88441/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md). Historical contracts keep the responsibility scope they actually realized.

A unit is a responsibility boundary, not a prescribed component. Its references below are attribution selectors: retrieve the full selected passages, including modalities, exclusions, conditions and exceptions, when preparing a realization contract or Verification. Short purposes and table rows are not self-contained specifications. Shared references distinguish production, checks, planning and publication roles; they do not multiply the underlying obligation.

Distribution-facing responsibilities share [D/C-purpose]'s runtime/selected-engine boundary and [D/C-nonmodification]'s permitted-glue boundary. Candidate and publication responsibilities retain [D/C-autonomy], [D/C-failure] and [W/C-determinism]'s human-authority and mandatory-gate boundaries. These apply through the compositions below; passing checks or a merge alone do not establish acceptance of the released payload. [D/C-obsolescence] and [D/R-engine] remain lifecycle/reconsideration context, without an automatic replacement or retirement implementation unit.

The [technical architecture](2026-10-04_sqlite-vec-wasm_technical_architecture_edit-0.1.md) supplies downstream realization context, not design authority or completion evidence. Historical Changes retain their own contracts, snapshots and evidence. The current contract impacts recorded below are distinct from Allocation coverage and do not constitute post-Apply Verification.

The user's subsequent `S-release-refinement` decisions, projected in Distribution `C-release`/`C-bootstrap` and Release/Watch `C-semver`/`C-publication`, refine the alpha required-base reference and bounded initial npm path. The incremental review covers `A-release` policy/publication/completion, `A-watch` and `A-updates` consumption of that common policy, and `A-bootstrap` setup/manual first-npm handoff. Their existing qualified references cover these contributions without new units or transferred duties. `A-release` owns read-only completion checking; `A-bootstrap` performs the unavoidable manual operation. Other inputs, boundaries, historical contracts and evidence are unchanged; this incremental review does not renew a global verification verdict. The archived `publish-distribution`, `plan-upstream-updates`, candidate-preparation and npm-bootstrap Changes retain their original snapshots; future revisions must consume the applicable current references. Their archive status does not establish conformity to the new notification split.

The 2026-10-13 `S-watch-native` mission previously reconciled `A-watch` to native notifications, normal empty results and independent manual planning. The notification choices are superseded by the bounded 2026-10-14 reconciliation below; direct-summary and independent-manual-planning contributions remain applicable. Historical realization evidence retains its original snapshot and scope.

The 2026-10-14 notifications decisions and clarification remain projected in N/S-notifications and N/S-reconciliation and D/W S-notifications-reconciliation. The subsequent [N/S-allocation] mission separates planning/result production from notification eligibility, message and delivery. `A-watch` owns discovery, planning, actual technical outcomes and the reference GitHub restitution, including summary simplification. `A-notifications` consumes those results and applies only established notification criteria; it neither determines upstream eligibility nor redefines technical outcomes. [N/S-notification-rules] now resolves eligibility as successful planning with a complete nonempty plan, including existing-candidate entries, and requires one plan mail per eligible execution regardless of scheduled/manual trigger. Empty/error exclusions, out-of-scope GitHub account notifications and intentional repetition remain intact; summary simplification still precedes Resend integration. The current concrete notification case is A-watch; no release/candidate/site notification policy or generic framework is inferred from the new unit's name. The affected field is reviewed in both directions; other unit texts and responsibilities are preserved. This is not a renewed global-design or implementation verdict.

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

### A-watch — Upstream planning and result presentation

Produce the human-readable upstream job plan and its reference execution results.

**Qualified references:** [D/C-watch] and [W/C-watch], discovery sources/baselines, cadence, plan contents, directly consultable GitHub restitution, weekly/manual planning, scheduling and stop before preparation; [W/C-selection], pair eligibility, published references, current-candidate awareness/preparation deduplication and no refusal registry; [W/C-determinism], [W/C-semver] and [W/C-channels], shared forecast calculation; [D/C-autonomy], independent human candidate initiation; [D/R-updates] and [W/R-frugality], planning/state and human-authority boundaries; [N/C-status], actual success/empty/error technical outcomes; [N/C-summary], reference Job Summary/artifacts and their prior simplification preserving required plan information; [N/C-trigger], a fresh plan from either trigger as notification input, distinct from applying notification eligibility or delivery.

**Boundary and dependencies:** use `A-inputs`' admissibility criteria, `A-release`'s publication state/policy and `A-updates`' current candidate state. Make the actual plan/result, technical outcome and concerned run reference available to `A-notifications`, which owns notification selection/message/delivery. This is a responsibility handoff, not a selected API or data format. Plan production and direct consultation do not wait for notification integration; the content/trigger rule is now established in [N/C-trigger]. A plan reserves no version and initiates no preparation; independent manual planning and forecast-policy ownership remain unchanged.

### A-notifications — Relevant workflow notifications

Apply established notification conditions and deliver short messages pointing to the reference execution result.

**Qualified references:** [N/C-status], notification relevance distinct from technical status and no project notification for an empty plan or an error; [N/C-summary], short run-linked message with details/diagnostics retained in the producer's GitHub restitution, after summary simplification; [N/C-noise], no CI-global/issue/comment/mention workaround and GitHub account notifications outside scope; [N/O-resend], retained Resend → Gmail transport orientation and dedicated OVH sender-domain example, without turning the example into a configured domain or restoring Gmail SMTP; [N/C-trigger], one plan mail per successful complete nonempty planning execution, scheduled or manual, including existing-candidate entries, without notification deduplication/sent-plan history or general infrastructure; summary-first integration sequencing; [D/C-watch], [W/C-watch], [D/R-updates] and [W/R-frugality], the corresponding notification portions and preserved planning/authority/frugality boundaries.

**Boundary and dependencies:** the currently captured case consumes `A-watch`'s actual plan/result, technical outcome and run reference; notification conditions are applied here without repeating discovery, pair selection, forecasting or candidate inspection. The reference Job Summary/artifacts remain with `A-watch`. Apply the established success-plus-complete-nonempty rule identically for either trigger, without adding another relevance test or suppressing plans whose entries already have candidates. This unit owns the message and retained transport integration within [N/O-resend]/[N/C-trigger]; `A-bootstrap` retains its separate publication-only setup. The split prescribes neither a service, shared framework, workflow file, API nor another notification case. It adds no candidate/publication trigger, product acceptance gate or account-setting duty. No notification implementation or delivery evidence is established; integration remains after summary simplification. Content eligibility and identical manual/scheduled behavior are resolved; they are no longer readiness questions.

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

The following correspondence retains the preceding mapping of 41 non-source D/S/W handles, qualified by the bounded N revision above, and includes the five current N design handles below; the resolved Q-trigger question is removed from the current working projection. Attribution to several units selects distinct contributions; contextual treatment is explicit. Unit references above retain the source's full obligations rather than replacing them with the table's summaries.

| Capture element | Qualified contributions or contextual treatment |
| --- | --- |
| [N/C-status] | `A-watch`: preserve actual technical success/empty/error outcomes. `A-notifications`: notification relevance and empty/error exclusion; additional GitHub account notifications outside scope. |
| [N/C-summary] | `A-watch`: reference Job Summary/artifacts and their prior simplification retaining required plan information. `A-notifications`: short message/run link; consume that reference rather than moving its diagnostics into the message. |
| [N/C-noise] | `A-notifications`: no global-CI reliance or issue/comment/mention workaround; additional GitHub notifications and user preferences remain outside scope. |
| [N/O-resend] | `A-notifications`: Resend → Gmail retained target and bounded sender-domain integration; OVH subdomain remains an example. No Gmail SMTP, configured-delivery or general-infrastructure claim. |
| [N/C-trigger] | `A-watch`: fresh plan production from either trigger. `A-notifications`: one mail per successful complete nonempty execution, candidates in progress included, with identical scheduled/manual behavior; no empty/error project mail, trigger filter, notification deduplication/history or general infrastructure. Summary simplification comes first. Candidate-preparation deduplication remains `A-watch`. |
| [D/C-purpose] | `A-inputs`: official selected inputs; `A-build`: canonical integration; `A-package`: browser consumption; `A-release`: distribution. Runtime/engine scope constrains their composition. |
| [D/C-nonmodification] | `A-build`/`A-package`: allowable integration/glue; `A-updates`: intervention. Common distribution boundary excludes added product behavior. |
| [D/C-inputs] | `A-inputs`: admissibility/origins/pins/digests/acquisition exceptions; `A-build`: pinned tools/options and reproduction; `A-package`: clean packaging/output exclusion; `A-acceptance`: full-path proof; `A-updates`: candidate records/composition. Channel policy is `A-release`'s W/C-channels contribution, consumed by `A-watch` and `A-inputs`. |
| [D/R-inputs] | `A-inputs`: acquisition context; `A-build`: construction context and mandatory common SQLite release. Context alone adds no task. |
| [D/C-browser] | `A-build`: baseline production; `A-package`: complete consumer asset/variant surface; `A-acceptance`: baseline checks. Exclusions travel with each contribution. |
| [D/C-static] | `A-build`: every-connection registration; `A-acceptance`: its checks. |
| [D/C-storage] | `A-build`: behavior/conditions; `A-package`: faithful consumer behavior/documentation; `A-acceptance`: mandatory persistence evidence under those prerequisites. |
| [D/C-release] | `A-release`: policy, identity, publication and notices; `A-package`: envelope/metadata/notices; `A-acceptance`: authoritative-revision/exact-payload evidence. Watch forecasts, candidate preparation and bootstrap consume that policy through their dependencies; none owns an alternative number. |
| [D/C-verification] | `A-acceptance`: all mandatory controls and evidence conditions; `A-updates`/`A-release` consume the corresponding gate results/applicable evidence. |
| [D/C-watch] | `A-watch`: discovery, planning, reference summary/artifacts, weekly/manual scheduling, normal empty results, explicit technical failures and stop before preparation; candidate/publication inputs from `A-updates`/`A-release`. `A-notifications`: only the scoped relevance, short-message, transport and no-notification-history contribution, through N's detailed references. |
| [D/C-autonomy] | `A-updates`: initiation/preparation/human integration; `A-release`: normal post-merge publication; `A-bootstrap`: bounded initial exception; `A-watch`: planning stops before initiation. |
| [D/R-updates] | `A-watch`/`A-updates`/`A-release`: shared calculation, constrained automation/state and human authority. `A-notifications`: bounded email rationale, separate account notifications and no sent-plan history. Historical alternatives do not become current duties. |
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
| [W/C-watch] | `A-watch`: official discovery/baselines, complete direct plan presentation, weekly/manual scheduling, normal empty successes, explicit technical failures and planning stop/no keepalive. `A-notifications`: separately scoped notification conditions, run-linked message/transport and deliberate repetition across eligible executions under the same rule for both triggers; no second planner or scheduler is inferred. |
| [W/C-selection] | `A-watch`: pair progress/no-regression filters, published references, candidate-preparation deduplication and absence of refusal memory, independently of the deliberately non-deduplicated weekly notifications; manual selections remain outside these watch filters. |
| [W/C-dispatch] | `A-updates`: exact inputs/comment, manual independence, rollback classification/comment; `A-release` consumes invocation context for numbering/provenance. |
| [W/C-candidate] | `A-updates`: full preparation composition ending at a PR; producing units and `A-acceptance` retain their respective contributions. |
| [W/C-publication] | `A-release`: definitive recalculation, collision/uniqueness, authoritative revision/payload/publication; `A-package`: resulting payload changes; `A-acceptance`: applicable/renewed evidence; `A-bootstrap`: retained bounded exception. |
| [W/C-provenance] | `A-inputs`: sources; `A-build`: tools/options/environment; `A-package`: output digests/metadata; `A-updates`: invocation context; `A-release`: complete cross-publication identity/composition. |
| [W/R-frugality] | `A-watch`/`A-updates`/`A-release`: existing shared-policy/state/authority boundaries. `A-notifications`: bounded transport, no notification deduplication/history or general infrastructure; retained alternatives remain context. |
| [W/C-reconciliation] | Documentary reconciliation instruction: this Allocation replaces its superseded mapping, reports downstream impacts and preserves history. It is not a product realization unit or evidence of implementation. |

The source handles have the following provenance treatment. Their decisions/relationships govern interpretation of the attributed passages; they do not create source-processing product units.

| Scope | Source handles and treatment |
| --- | --- |
| Distribution | [D/S-notifications-reconciliation]: notification revision and inter-Capture reconciliation; [D/S-notification-rules]: resolved eligibility/trigger rule; [D/S-watch-native]: historical notification choice and retained direct-summary/manual-planning contribution; [D/S-release-watch-design] and [D/S-local-reconciliation]: scoped supersessions; [D/S-capture-reconciliation]: adopted Capture-level reconciliation; [D/S-product-design]: identity/engine decision; [D/S-spec]: immutable historical contract; [D/S-release-model], [D/S-doc-model] and [D/S-watch-model]: retained lifecycle/documentation/watch provenance with recorded revision limits. |
| Site | [S/S-capture-reconciliation] and [S/S-product-design]: bounded provenance/identity consequences; [S/S-site-design] and [S/S-site-exploration]: behavior, observations and alternatives; [S/S-site-mission]: representation migration and one instituted site unit. |
| Release/Watch | [W/S-notifications-reconciliation]: the same notification revision; [W/S-notification-rules]: resolved eligibility/trigger rule and authorized status cleanup; [W/S-watch-native]: the earlier notification choice and retained planning revision, not independent corroboration; [W/S-capture-reconciliation]: earlier bounded reconciliation scope; [W/S-release-watch-design] and [W/S-local-reconciliation]: design and explicit scoped revisions; [W/S-capture-mission]: dedicated Capture identity; [W/S-repository-state]: retrievable comparison/provenance state, not decision authority or implementation evidence. |
| Notifications | [N/S-notifications]: initial channel, relevance and sequencing decisions; [N/S-reconciliation]: empty/error exclusion, out-of-scope account notifications, intentional weekly repetition and authorized reconciliation; [N/S-allocation]: responsibility separation/reconciliation; [N/S-notification-rules]: instituted eligibility, trigger invariance and documentary cleanup; [N/S-repository]: comparison/provenance state only. |

Material prose outside handles is also covered: scope/authority and explicit revision relations govern this input interpretation; Distribution's material relationships ground the acquisition/build/package/acceptance and watch/candidate/publication compositions; Site's separation/open-choice prose constrains `A-site`; Release/Watch's retained-invariant prose and impact map constrain the common lifecycle and the downstream findings below. Historical source setup restrictions remain attached to their interventions rather than becoming permanent product restrictions. Moving upstream documentation and source-stated technical context are not renewed evidence.

**Preceding bidirectional result (historical reconciliation scope):** the full three-Capture responsibility field was accounted for: 41 non-source elements, 18 provenance elements, material prose and all nine units. Every material realization obligation has qualified production/check/publication contributions; every unit contribution and dependency has current grounding. There is no unresolved Allocation attribution or new unit. This is a semantic Capture↔Allocation responsibility result, not a claim of fidelity to reacquired original sources, current implementation conformity or release readiness. Open Site choices retain their original role. This preceding global conclusion is not renewed by the current A-watch/A-notifications split; current input fingerprints and the bounded notification/handoff examination are distinguished above.

**Downstream impacts outside this edit:** the synchronized [upstream-inputs spec](../openspec/specs/upstream-inputs/spec.md), requirement "Official published source selection", now admits explicitly selected published alpha, beta or release-candidate versions with sufficient official source/integrity metadata; omitted versions still select the latest stable release. The synchronized [browser-build spec](../openspec/specs/browser-build/spec.md) likewise consumes exact verified published prerelease inputs. [Source-acquisition documentation](../../docs/source-acquisition.md) and the current resolver admit explicit published sqlite-vec prereleases under the existing release/archive/digest checks; the documented absence of a numbered SQLite prerelease acquisition convention remains a separate support limit. The earlier blanket stable-only reconciliation status is therefore superseded, without establishing complete product acceptance or publication readiness for prereleases. Exact candidate dispatch does not by itself remove the acquisition helper's separate omitted-version convenience. The [browser-package](../openspec/specs/browser-package/spec.md) and [browser-acceptance](../openspec/specs/browser-acceptance/spec.md) contracts retain payload/evidence boundaries; their applicability must be reassessed for changed inputs or package-affecting numbers, without inferring a blanket failure. The existing archived Changes retain historical snapshot-bound coverage/evidence; there is no active Change to rewrite. Capture current-state passages have been refreshed to reflect this responsibility reconciliation; their earlier mission scopes remain identifiable in provenance. Canon/context navigation now refers to the current Captures without an obsolete fixed count or incomplete exhaustive list, under N2. The present allocation split changes current responsibility attribution, not those historical contracts, implementation, canon or evidence.

**Notification split and downstream continuity:** the current [upstream-watch specification](../openspec/specs/upstream-watch/spec.md), especially “Native completion notifications” and “Planning stops before preparation”, retains the former combined native-notification baseline with an explicit status note and link to the current design; the current Watch documentation also separates implemented behavior from target. Its [archived A-watch Change](../openspec/changes/archive/2026-10-13-plan-upstream-updates/proposal.md) and [Verification](../openspec/changes/archive/2026-10-13-plan-upstream-updates/verification.md) remain bound to their original Allocation snapshot, not retroactively attributed to `A-notifications`. A future A-watch realization contract must retain planning/restitution and the handoff boundary; a separate future `A-notifications` Change must trace the notification contribution and preserve its captured sequencing. The formerly open content/trigger condition is resolved by [N/C-trigger]; summary simplification still precedes Resend integration. Drafting a Change is not blocked by a retired question. No such Change currently exists; its absence is expected at Allocation stage and supplies no implementation failure or success verdict. Other units' product contracts are not changed by this split. In particular, candidate preparation, publication results/gates and npm bootstrap retain their existing meanings; no mail obligation is added to them.

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
[D/S-watch-native]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
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
[W/C-watch]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-watch--weekly-planning-and-notification-boundary
[W/C-selection]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-selection--two-dimensional-eligibility-and-no-refusal-registry
[W/C-dispatch]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-dispatch--exact-manual-selection-and-rollback
[W/C-candidate]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-candidate--automated-preparation-ending-at-a-pr
[W/C-publication]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-publication--authorized-integration-definitive-version-and-exact-payload
[W/C-provenance]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-provenance--distribution-composition-and-publication-identity
[W/R-frugality]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#r-frugality--bounded-automation-and-retained-alternatives
[W/C-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#c-reconciliation--replace-superseded-active-rules-preserve-history
[W/S-watch-native]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-capture-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-release-watch-design]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-capture-mission]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-local-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[W/S-repository-state]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources

[N/C-status]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#c-status--séparer-exécution-et-notification
[N/C-summary]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#c-summary--garder-la-restitution-dans-github
[N/C-noise]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#c-noise--éviter-le-bruit-des-notifications-ci
[N/O-resend]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#o-resend--canal-cible-resend-vers-gmail
[N/C-trigger]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#c-trigger--notifier-seulement-lorsquune-attention-est-utile

[D/S-notifications-reconciliation]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[W/S-notifications-reconciliation]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
[N/S-notifications]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#sources-matérielles
[N/S-reconciliation]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#sources-matérielles
[N/S-repository]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#sources-matérielles

[N/S-allocation]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#sources-matérielles

[N/S-notification-rules]: 2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md#sources-matérielles
[D/S-notification-rules]: 2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md#material-sources
[W/S-notification-rules]: 2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md#material-sources
