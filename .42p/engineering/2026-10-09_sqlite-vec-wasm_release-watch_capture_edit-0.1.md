# Release/Watch Capture

## Purpose, scope, and authority

Retain the current design of sqlite-vector-wasm distribution versioning, upstream watch, manual candidate preparation and post-integration publication from the final consolidation explicitly supplied by the user, `S-release-watch-design`, with the seven scoped local corrections authorized by `S-local-reconciliation`. `S-capture-mission` establishes this dedicated Capture, distinct from the [Distribution Capture](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md) and [Site Capture](2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md). This is a reconciled, non-authoritative working projection; it neither institutes decisions nor proves implementation, upstream availability, acceptance or publication.

The supplied consolidation expressly supersedes earlier versioning and watch orientations within the scope recorded under `C-reconciliation`. This precedence comes from its explicit revision relation and user designation, not its date or this Capture. The original exploration transcript is not supplied; the consolidation is a designated derived source, not independent corroboration of every preceding discussion message. Repository projections in `S-repository-state` are current-state inputs and impact locators, never substantive evidence supporting themselves.

The scope retains existing source authenticity, integrity, upstream nonmodification, browser/product fidelity, mandatory verification and human integration authority. It does not change the selected vector engine, runtime, site behavior or general 42p model. S-capture-reconciliation authorizes the bounded Distribution reconciliation and minimal Site reference adjustments recorded under C-reconciliation. The [global Allocation](2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) now carries the reconciled responsibility mapping and current snapshot identities for all three Captures. Snapshot identity alone does not establish semantic coverage. The stable-only acquisition and build contracts remain to be reconciled through their allocated Changes; no prerelease implementation support is established here.

## Material criteria and lifecycle boundaries

### C-determinism — Mechanical calculation and human authority

Source: `S-release-watch-design`, sections 1, 9 and 11; `S-local-reconciliation`, correction 4.

Detection, combination selection, version calculation and publication preparation are algorithmic. No AI participates in nominal operation. A-watch, dispatch, preparation and publication use one shared deterministic logic to calculate the channel and distribution version, using official upstream versions, published provenance, Git tags, npm versions and the separate `latest`/`next` HEADs. Identical inputs and publication state produce identical results; a forecast and final publication result may differ only if their inputs or reference state have changed. Workflows do not have separate numbering policies.

A-watch proposes work. The maintainer selects upstreams and initiates preparation; the workflow stops at a candidate PR. Human integration into `main` authorizes the subsequent automatic publication, subject to mandatory gates. Dispatch expresses preparation intent, not permission to publish; passing checks alone does not institute adoption.

### C-version-identity — One distribution version domain

Source: `S-release-watch-design`, sections 1–2 and 10.

`main` is the sole permanent branch; preparation branches are temporary. There is no permanent distribution branch. The assembled distribution alone has a project SemVer, with Git tags `dist/vX.Y.Z` and the same unprefixed npm version, for example `dist/v0.2.0-alpha.1` / `0.2.0-alpha.1`. Tags identify GitHub Releases and npm publications.

The codebase identity is its exact Git commit. There are no `code/vX.Y.Z` tags, code-version counter, separate code npm publication or code/dist synchronization mechanism. A code change receives a new project number only through a new distribution; changed upstreams or build parameters can produce a new distribution without changing project code. Upstream numbers remain exact component identities, not parts of the distribution version string.

### C-semver — Deterministic increments and maturity ceiling

Source: `S-release-watch-design`, section 3; `S-local-reconciliation`, correction 3.

The distribution increment is `max(ΔSQLite, Δsqlite-vec)`, ordered `MAJOR > MINOR > PATCH`. Classify the numerical change of each upstream independently of its prerelease suffix. Thus `0.1.9 → 0.1.10-alpha.1` supplies PATCH and `0.1.10 → 0.2.0-alpha.1` supplies MINOR. The suffix separately determines prerelease status and ordering. This is the selected numbering convention, not automatic compatibility assessment; mandatory compatibility and acceptance checks remain independent.

While sqlite-vec remains `0.x`, the distribution stays `0.x`: an upstream MAJOR signal is capped at distribution MINOR. A SQLite MAJOR signal with distribution `0.4.2` and sqlite-vec still `0.x` therefore yields `0.5.0`. sqlite-vec reaching `1.x` permits transition to the distribution's `1.x` regime.

A new distribution without numerical upstream progression uses PATCH by default unless a higher applicable upstream signal exists. This includes code or packaging corrections, distinct reconstruction, changed build parameters and explicit rollback. A published distribution version is never reused. This revision replaces the prior impact-based increment policy; it does not waive product checks.

The initial distribution version is `0.1.0`, within the existing Distribution `C-bootstrap` boundary retained under `C-publication`; the selected first effective publication uses two stable upstreams on `latest`. Prerelease fixtures and future candidates do not authorize an initial experimental publication.

Under `S-release-refinement`, calculate an experimental selection's required numerical base from the current published `latest` version and its upstream composition: compare the selected upstreams numerically with that stable composition, select the maximum positive signal or default PATCH, apply the maturity ceiling, and increment the stable distribution version accordingly. This reference concerns version calculation, not watch eligibility or the channel reference used to detect explicit rollback. If an open experimental series has a base greater than `latest`, retain that base and increment its alpha counter when the required base is less than or equal to it; otherwise open the higher required base at `alpha.1`. With no open series, use the required base at `alpha.1`. Closure remains governed by `C-channels`; an obsolete `next` composition is not the reference for a fresh base. Stable publications retain their stable-channel reference. No future first-experimental bootstrap is authorized by the selected initial stable case.

### C-channels — Stable and experimental publication

Source: `S-release-watch-design`, section 4, locally revised by `S-local-reconciliation`, corrections 1 and 3.

`latest` carries stable `X.Y.Z`; `next` carries experimental `X.Y.Z-alpha.N`. They share one npm version namespace but have separate publication HEADs. Calculate the channel exclusively from the two selected upstream versions: two stable upstreams yield `latest`; at least one prerelease upstream yields `next`. Two stable upstreams cannot be published on `next`. A stable distribution cannot contain a prerelease upstream. The distribution owns its `alpha.N` counter, independently of upstream alpha/beta counters; exact upstream suffixes remain in provenance.

Each channel advances monotonically by SemVer; a publication need not exceed every version previously published on the other channel. For example, `latest = 0.2.0`, then `next = 0.3.0-alpha.2`, then `latest = 0.2.1`, then `next = 0.3.0-alpha.3`, then `latest = 0.3.0` is valid.

When a stable version reaches or exceeds an experimental series' numerical base, that series closes. After `latest = 0.3.0`, `0.3.0-alpha.4` is obsolete; the next series starts at `0.3.1-alpha.1` for PATCH, `0.4.0-alpha.1` for MINOR or an applicable MAJOR base. `C-semver` governs continuation or replacement of a still-valid series when a new signal arrives. Forecasts reserve no npm number: recalculate against actual tags and publications, preserving unique versions, per-channel progression, SemVer order, valid series continuity and closure. Collisions fail without reuse or overwrite under `C-publication`.

### C-watch — Weekly planning and email boundary

Source: `S-release-watch-design`, sections 5 and 7.

A-watch runs weekly through GitHub Actions. It discovers official published stable and prerelease versions from SQLite's official Fossil publications and sqlite-vec's official GitHub Releases. Discovery baselines are SQLite `3.53.4` and sqlite-vec `0.1.9`; older versions do not participate in ordinary discovery. These are designated design baselines, not newly verified upstream facts or a ban on manual older-version selection.

Read available upstream versions, channel HEADs, published distribution provenance and candidates in progress; enumerate eligible SQLite × sqlite-vec combinations through `C-selection`; calculate their forecast channel and increment; generate a job plan and email it through Gmail SMTP. The source's low-release-frequency rationale supports enumeration without AI heuristics. Scheduling deactivation due to repository inactivity is accepted and reactivated manually; no keepalive is introduced.

For each job the email contains exact upstream versions, forecast channel/increment, workflow parameters, a GitHub Actions link and any existing-candidate state. It may also include a ready-to-copy `gh workflow run` command. The maintainer can launch zero, one or several jobs. The email reserves no version and triggers no dispatch. No GitHub notification issue is created. A-watch neither changes pins, builds, prepares PRs, merges, tags nor publishes.

### C-selection — Two-dimensional eligibility and no refusal registry

Source: `S-release-watch-design`, section 6.

Compare pairs `(SQLite, sqlite-vec)` component by component, including prerelease order. A pair is at least as recent as another only when both components are greater than or equal; strict progression requires at least one greater component and no regression of the other.

For `latest`, propose stable-only pairs strictly later than its published pair, not already published in the corresponding status, without implicit component regression. A more advanced `next` does not block stable maintenance. For `next`, require progression relative to its HEAD and a pair at least as recent component by component as `latest`, excluding pairs already covered by a corresponding publication. If `next` has no publication, use `latest` as its initial reference. An in-progress candidate may be signaled without duplicating preparation.

For example, with `latest = (3.54.0, 0.1.9)` and `next = (3.53.5, 0.1.10-alpha.1)`, `(3.53.6, 0.1.10-alpha.2)` is excluded because SQLite regresses relative to `latest`. Both `(3.54.0, 0.1.10-alpha.1)` and `(3.54.0, 0.1.10-alpha.2)` are candidates; `(3.54.0, 0.1.9)` is already published. The pair is the proposal unit: a new pair can be eligible even without a newly discovered individual upstream version.

There is no refusal registry. Eligible unselected pairs remain proposable; pairs superseded by their reference HEAD disappear naturally; a published pair is not reproposed in the same status. HEADs and published provenance supply selection state, with current-candidate inspection for preparation deduplication. The maintainer need not integrate every pair. Manual dispatch can explicitly select an older pair or rollback outside ordinary watch eligibility.

### C-dispatch — Exact manual selection and rollback

Source: `S-release-watch-design`, sections 7–8; `S-local-reconciliation`, correction 2.

`workflow_dispatch` accepts `sqlite_version`, `sqlite_vec_version` and the maintainer's free-text `release_comment`. Versions are exact. No manual channel parameter is required or permitted: the channel results exclusively from `C-channels`. Dispatch is independent of A-watch and its history; select any combination admissible to preparation, including an unlisted pair, skipped intermediate versions, a prerelease, an older upstream or reconstruction. Ordinary-watch baselines and progression filters are not manual-selection prohibitions. Official-source integrity and mandatory checks remain applicable.

A rollback explicitly selects an upstream older than the channel reference. It requires `release_comment`, retained in GitHub Release notes, and an unused distribution version with PATCH by default unless a higher applicable signal exists. A-watch never initiates rollback implicitly. For example, `sqlite_version=3.53.4`, `sqlite_vec_version=0.1.10` and a comment explaining a SQLite regression select older composition without rolling back the publication number.

### C-candidate — Automated preparation ending at a PR

Source: `S-release-watch-design`, section 9.

On manual dispatch, acquire the selected official upstreams, verify integrity/digests, prepare repository changes, build, execute all mandatory controls, prepare artifacts/provenance and create or update a candidate PR. Preparation stops there, without merging or publishing. The maintainer examines and integrates the candidate into `main`; a failing mandatory control makes it ineligible for integration and human approval does not replace the controls.

### C-publication — Authorized integration, definitive version and exact payload

Source: `S-release-watch-design`, sections 9–10; `S-local-reconciliation`, correction 5.

Authorized candidate integration triggers recalculation of the definitive distribution version from the current Git and npm publication state and uniqueness verification, association with the authoritative commit and verified artifacts, creation of `dist/vX.Y.Z`, GitHub Release publication and npm publication on the channel calculated under `C-channels`. Never reuse or overwrite an existing publication identity; a collision stops processing in failure. No reservation, application lock or additional coordination mechanism is introduced. GitHub Release and npm use the same version, revision and verified runtime payload. A number change affecting the package cannot be applied to an already qualified artifact without preserving or renewing the necessary verification. Evidence must apply to the revision actually published, not only a pre-integration PR head. Any mandatory failure prevents the corresponding release tag and GitHub/npm publications; passing candidate checks alone does not establish post-merge evidence applicability.

Existing bounded initial npm bootstrap, trusted publishing and supported provenance provisions remain applicable where not superseded. In particular, the minimum unavoidable initial registry setup/first npm-publication exception may override only the automatic npm trigger: it waives no verification or revision/payload identity requirement, creates no recurring manual publication path and changes no recurring human initiation/integration authority.

Under `S-release-refinement`, after human integration and exact-payload qualification, the bounded initial exception still automatically creates the tag and publishes the GitHub Release with its archive and evidence. It hands that exact archive to A-bootstrap and explicitly reports npm publication pending. Complete success requires subsequent verification of the corresponding manual npm publication against the accepted identity and payload. This verification creates no new tag/publication, bypasses no collision rule for new attempts and introduces no recurring manual publisher or automatic repair path. Subsequent releases use normal automatic publication.

### C-provenance — Distribution composition and publication identity

Source: `S-release-watch-design`, sections 2, 9–11.

Record the exact code commit; distribution tag, GitHub Release and npm version; exact SQLite and sqlite-vec versions, origins and source digests, including prerelease suffixes; build tools/versions/options/environment; published output digests; channel; and dispatch comment when present. Provenance distinguishes code, upstreams, build and artifacts without another code SemVer or manually synchronized version domain.

## Rationale

### R-frugality — Bounded automation and retained alternatives

Source: `S-release-watch-design`, sections 1–2, 5–6 and 12; `S-local-reconciliation`, correction 6.

One permanent branch, one distribution version domain, direct email plans, no refusal history and no keepalive limit maintenance machinery. Git identifies code; upstream versions identify components; provenance relates them to published artifacts. Weekly deterministic enumeration proposes the available work while the maintainer controls selection and integration.

The former two-tag-family proposal, daily assigned-issue notification, issue-closure refusal memory and impact-based version choice are explicitly superseded, not technically refuted. Retaining a second code version would need a separate distribution/use case that is absent from the selected design. Fully autonomous selection/adoption remains outside the human-authority boundary; automatic preparation and post-integration publication retain distinct authorization points.

Git and npm supply the necessary uniqueness constraints; a collision fails without overwrite. No reservation registry or application lock is retained. Simplicity takes precedence over preventive orchestration of concurrent candidates. This explains `C-publication`'s failure boundary without introducing another architecture or coordination responsibility.

## Reconciliation and material impact

### C-reconciliation — Replace superseded active rules, preserve history

Source: `S-release-watch-design`, section 12; `S-capture-reconciliation`; repository locators from `S-repository-state`.

Reconcile active documents from design toward responsibilities and realization contracts. Replace contradictory rules rather than juxtaposing both as current obligations. Preserve authenticity/integrity, browser fidelity, mandatory controls, exact revision/payload evidence, human authority and unaffected bootstrap provisions. Immutable contracts, archived Changes, reports and evidence keep their original contents and source snapshots; a superseded historical rule is not a current requirement.

| Current document / element | Reconciliation disposition and retained boundaries |
| --- | --- |
| [Distribution Capture](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md): `C-purpose`, `C-inputs` | Reconciled stable-only qualifiers to released stable/prerelease admissibility by calculated channel; selected-engine, official-source, digest, reproduction and nonmodification boundaries retained. |
| Distribution: `C-release` and material relationships | Reconciled impact-based increments to distribution-only identity, numerical upstream signals, maturity ceiling, initial version and alpha/channel rules; retained exact revision/payload, notices and evidence obligations, with definitive recalculation and collision failure. `R-engine` itself has no versioning rule to replace; engine-selection rationale and any future decision remain outside this revision. |
| Distribution: `C-watch`, `R-updates`, `C-autonomy`, scope/provenance and material relationships | Reconciled daily stable-only/newer-than-pins assigned issues and refusal memory to weekly pair planning, email and no refusal registry; exact dispatch inputs, rollback/comment, shared calculation and no-keepalive behavior are represented. PR/human integration/publication boundaries retained. |
| [Global Allocation](2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md): `A-inputs`, `A-build`, `A-package`, `A-watch`, `A-updates`, `A-release`, compositions and coverage rows | Reconciled stable-only wording, watch surface, input/reference relationships and version/publication responsibilities through qualified references to all three Captures and reverse correspondence. `A-acceptance`/`A-bootstrap` retain mandatory evidence and bounded bootstrap; no new unit split is instituted. |
| [Synchronized upstream-inputs spec](../openspec/specs/upstream-inputs/spec.md): source-selection purpose, requirement and scenarios | Stable-only rejection is superseded for experimental distributions; exact official released identities, integrity and frozen-pair/no-fallback behavior remain. Any delta must retain applicability to its allocated unit. |
| [Synchronized browser-build spec](../openspec/specs/browser-build/spec.md): static-integration requirement | Reconsider the pinned-stable qualifier; retain same-release SQLite components, every-connection registration and upstream behavior. Other package/acceptance specs retain their payload/evidence boundaries. |
| [AGENTS.md](../../AGENTS.md), [technical canon](../standards/software.md), [OpenSpec canon](../standards/openspec.md), [OpenSpec context](../openspec/config.yaml) | Maintain discovery of distinct Captures, explicit scoped supersession and truthful Allocation coverage, without changing the general process. |
| [Acquisition documentation](../../docs/source-acquisition.md) and acquisition implementation/contracts | Their stable-only behavior describes the existing realization. Identify its divergence for a later allocated change; do not rewrite implementation evidence or promise prerelease support before realization. |
| [Site Capture](2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md): scope/provenance and `C-demo-release` | Minimal references reconciled to the revised distribution identity and channels; actually published latest stable archive consumption and fixed demo identity retained. Experimental npm publication introduces no automatic experimental demo deployment. The current Allocation carries `A-site` and its qualified references; Site realization remains deferred. |

This table distinguishes reconciled Capture projections and Allocation responsibilities from pending realization-contract work and the separately scoped canon/context wording adjustment. The Allocation preserves all nine unit identities, qualified contributions and reverse correspondence; its recorded digests identify the current Capture inputs. Snapshot identity does not establish semantic coverage, implementation progress or authority to realize superseded requirements. The synchronized upstream-inputs and browser-build contracts still require correction through their respective allocated Changes. No report or archive is rewritten to manufacture current evidence.

## Material sources

**S-release-refinement** — Primary user decisions in this project conversation on 2026-10-10, following the Allocation-to-A-release derivation review of PR #31 at `cba83e761f2e4d2d203076bab0598a059a474a8a`: “Proposition pour les séries alpha : validée” and “Bootstrap npm : validé”, followed by the instruction to update the Change and repeat derivation verification. These explicitly adopt the immediately preceding exploration's stable-reference required-base calculation and bounded initial GitHub-publication/npm-handoff/completion-verification path. The earlier user decision selected first effective stable `0.1.0` on `latest` with two stable upstreams and retained prereleases for future watch/candidates. This scoped refinement resolves the alpha-base underdetermination and realizes the existing npm-only exception; it changes no watch eligibility, recurring authority, mandatory checks or upstream identity requirement. No public conversation permalink is available. The adopted assistant-origin proposal and its projections are not independent corroboration; these decisions authorize planning reconciliation, not Apply, merge or real publication.

**S-capture-reconciliation** — Primary user instruction of 2026-10-10 in this project conversation, explicitly supplying and adopting the three-Capture comparison at PR #26 revision `df13642956586dea1cc858edec1dee0f5a019dca` with “Je valide”, then requiring strict application of its listed changes and bidirectional conformity checking with correction of anomalies. It authorizes the bounded Distribution reconciliation and minimal Site reference adjustments while retaining distinct Capture scopes. That mission deferred Allocation reconciliation; the current global Allocation carries the later reconciled responsibility mapping. This source supersedes the earlier Capture-only edit restriction only for the present authorized Capture work. No new versioning mechanism, engine decision, implementation evidence or publication authorization is introduced. No public conversation permalink is available; the adopted assistant-origin comparison and related projections are not independent corroboration.

**S-release-watch-design** — User-supplied file `2026-10-09_consolidation_watch.md`, titled “Consolidation finale — Versionnement, surveillance et publication de sqlite-vector-wasm”, dated 2026-10-09; sections 1–13 and conclusion. Library identity: `libfile_63b5a662028881918b55a9feb445275e`; exact supplied-byte SHA-256: `c0ec8160d9d20bc4e924251cb6fb09c0d310e97231a21bf635c202e923129a78`. The attachment was read directly from its supplied workspace copy. It is the explicitly designated final derived consolidation, including its stated supersessions, not an independently acquired transcript or verification of upstream versions, publication state or email delivery. Copies and this projection are not corroboration.

**S-capture-mission** — Primary user instruction of 2026-10-09 in this sqlite-vec-wasm project conversation: “Réalise avec le competence 42p-capture, unr capture de l'exploration ci-jointe dédiée au design Release/Watch, dans le dossier .42p/engineering”. It designates the attached exploration and establishes the dedicated Capture's identity, scope and destination; it does not establish realization progress. No public conversation permalink is available.

**S-local-reconciliation** — Primary user mission of 2026-10-10, “Mission — Réconciliation locale de la Capture Release/Watch”, in this project conversation: “Corrections autorisées”, items 1–7, and “Bornes strictes”. It explicitly authorizes only the channel, dispatch, initial-version/alpha-series, shared-calculation, collision/payload-evidence and frugality revisions projected above, and removal of the two resolved questions. It supersedes the corresponding matter in S-release-watch-design and the prior working projection within that scope only. Other design, provenance and lifecycle boundaries remain intact; downstream document reconciliation is expressly excluded from this intervention. No public conversation permalink is available; the mission itself supplies the seven decisions without reconstruction of an unavailable preceding message.

**S-repository-state** — Current-state acquisition at `main` commit [`8cc9122b9f540eaada7ee3e1d75b782335dece46`](https://github.com/at-rama/sqlite-vector-wasm/commit/8cc9122b9f540eaada7ee3e1d75b782335dece46): repository instructions, current Distribution/Site Captures, global Allocation, standards, synchronized specs and acquisition documentation. Immutable [Distribution](https://github.com/at-rama/sqlite-vector-wasm/blob/8cc9122b9f540eaada7ee3e1d75b782335dece46/.42p/engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), [Site](https://github.com/at-rama/sqlite-vector-wasm/blob/8cc9122b9f540eaada7ee3e1d75b782335dece46/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md) and [Allocation](https://github.com/at-rama/sqlite-vector-wasm/blob/8cc9122b9f540eaada7ee3e1d75b782335dece46/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) locators preserve the pre-reconciliation comparison state. Captures and Allocation contribute existing state and source provenance, never independent decision authority or evidence; historical sources are interpreted at their own recorded revisions. No release/npm HEAD lookup, upstream availability qualification or SMTP experiment was performed for this Capture.
