# distribution-candidates Specification

## Purpose

Realize A-updates by preparing exact human-selected official upstream combinations into fully checked, traceable candidate pull requests for human integration and subsequent A-release qualification.

## Requirements

### Requirement: Exact human dispatch

Candidate preparation SHALL start from human `workflow_dispatch` with exact `sqlite_version`, exact `sqlite_vector_version` and optional free-text `sqlite_comment`, `sqlite_vector_comment` and `misc_comment`. The fixed product engine SHALL be SQLite-Vector; retained sqlite-vec support SHALL NOT be a dispatch choice. Nonempty comments SHALL be edge-trimmed and joined in SQLite → SQLite-Vector → miscellaneous order with one blank line into the canonical release comment. Preparation SHALL reject manual channel/version overrides and operate independently of watch plans, polling history and intervening releases, without nominal AI selection or repair.

#### Scenario: Exact pair outside watch suggestions
- **WHEN** the maintainer selects an admissible pair absent from any watch plan, skipping intermediate releases or rebuilding the recorded pair
- **THEN** preparation evaluates that exact pair without requiring watch implementation or history

#### Scenario: Missing or malformed selection
- **WHEN** either exact version is missing, malformed or accompanied by an unsupported channel/version override
- **THEN** preparation fails without substituting a latest version or publishing anything

#### Scenario: Comments aggregate as structured data
- **WHEN** one or more comment fields contain text, including quotes, real newlines or shell metacharacters
- **THEN** nonempty trimmed fields are joined in SQLite → SQLite-Vector → miscellaneous order with one blank line, retained as data without execution, and do not change selection

#### Scenario: Comments are absent or blank
- **WHEN** all three comment fields are absent, empty or whitespace-only
- **THEN** the canonical release comment is empty

#### Scenario: Legacy selection is not a current product choice
- **WHEN** a dispatch supplies sqlite-vec selection fields, an engine selector or a mixed/ambiguous selection
- **THEN** preparation fails without translating it into another selection or creating an eligible candidate


### Requirement: Official pinned candidate inputs

Preparation SHALL resolve the exact official published, non-draft SQLite/SQLite-Vector pair with established source identities/digests and exact suffixes. It SHALL freeze one coherent Vector lock, release descriptor and release-associated required notices before checks or production, verify downloaded bytes before use and consume the existing clean acquisition/build/package path. Stable releases and actually published alpha/beta/rc releases are admissible under A-inputs; branches, development snapshots, aliases and fabricated prereleases are not. Required source/license/dependency integrity failures SHALL stop preparation without vendoring, upstream patches, fallback pair selection or silent adoption of a changed established pin.

#### Scenario: New admissible pair
- **WHEN** selected stable or published prerelease versions have sufficient official source and integrity metadata
- **THEN** candidate records preserve those exact released versions, immutable source bindings and recorded digests established under A-inputs for verified production

#### Scenario: Existing pin differs
- **WHEN** official metadata or downloaded bytes disagree with an established expected digest
- **THEN** preparation fails without silently replacing the digest or repairing upstream sources

#### Scenario: Inadmissible source
- **WHEN** a selected source is draft, unpublished, a development snapshot or lacks sufficient official integrity metadata
- **THEN** preparation fails without selecting another upstream or acquisition workaround

#### Scenario: Same source pair
- **WHEN** the maintainer selects the already recorded pair for a first distribution or distinct reconstruction
- **THEN** an unchanged source lock remains valid and preparation still introduces or updates a traceable release descriptor

#### Scenario: Only SQLite identity changes
- **WHEN** an admissible selection changes SQLite, including a supported older version, while retaining the recorded SQLite-Vector version
- **THEN** both SQLite notices, their version associations, origins and content digests are reconciled to that exact selected release before repository checks, without refreshing the unchanged Vector notice group, while validating its selected identity and pinned dependency

#### Scenario: Only sqlite-vec identity changes
- **WHEN** an admissible selection changes SQLite-Vector, including a published prerelease or rollback, while retaining the recorded SQLite version
- **THEN** its Apache license notice, exact suffix-bearing version association, immutable selected-commit origin and content digest are reconciled, and its pinned FP16 dependency is validated before repository checks, without changing the SQLite notice group

#### Scenario: Both upstream identities change
- **WHEN** both selected upstreams differ from the recorded pair
- **THEN** the committed candidate contains both reconciled notice groups with its source lock and descriptor before any repository check or qualification consumes it

#### Scenario: sqlite-vec notice absent from the selected archive
- **WHEN** the SQLite-Vector notice group is being refreshed and a required license file is absent from its verified selected archive
- **THEN** preparation fails under the existing required-content checks without borrowing another release's text, a floating branch or an alternate source bundle

#### Scenario: SQLite notice source absent or unsupported
- **WHEN** the SQLite notice group is being refreshed and its verified selected archive lacks a required notice source or its license block cannot be extracted by the defined selector
- **THEN** preparation fails before checks without substituting another source or version

#### Scenario: Notice content is unchanged across releases
- **WHEN** a changed upstream version supplies the same notice text as the formerly recorded version
- **THEN** preparation still establishes and records its association and provenance for the new release instead of merely relabeling unverified old bytes

#### Scenario: Same pair with valid notices
- **WHEN** both selected versions and their recorded notice groups are already coherent
- **THEN** preparation validates and preserves the source-lock and notice-input bytes while creating the invocation's release descriptor as usual

#### Scenario: Reconciliation cannot establish coherence
- **WHEN** required material is unavailable, ambiguous, malformed, contradicts an established identity or fails integrity validation
- **THEN** preparation fails before candidate repository checks, qualification or remote writes, and does not weaken strict package version/digest validation or replace the selection

#### Scenario: Candidate source and notice snapshot
- **WHEN** reconciliation succeeds
- **THEN** one candidate commit contains all changed source identities, release descriptor, notice records and notice texts; raw upstream acquisitions and diagnostic outputs remain uncommitted

#### Scenario: Prospective prerelease is not an observed publication
- **WHEN** an alpha-like version exists only in a branch, header, npm alias or build artifact without the required exact official release/tag/source binding
- **THEN** preparation fails without manufacturing a release identity, stripping its suffix or accepting the artifact as a published source

#### Scenario: Recorded FP16 dependency no longer matches
- **WHEN** the selected Vector archive cannot establish the existing pinned FP16 license and incorporated-header identities
- **THEN** preparation fails before candidate qualification rather than silently adopting a new dependency or retaining an unverified association


### Requirement: Shared forecast and rollback policy

Preparation SHALL derive channel, forecast and comparable rollback through the existing A-release calculation and complete actual Git/npm state, including historical engine identity, adopted component references and the first-transition MINOR/0.x rule. It SHALL NOT compare foreign-engine version numbers, introduce another numbering policy/registry/lock or reserve a forecast. Comparable regression SHALL require the aggregated comment; engine substitution alone SHALL NOT count as rollback. Unavailable state/collisions SHALL fail; no initial experimental publication or renewed bootstrap exception is authorized.

#### Scenario: Stable initial candidate
- **WHEN** actual publication state permits the first distribution and both selected upstreams are stable
- **THEN** the shared forecast is `0.1.0` on `latest` under unchanged initial-publication gates

#### Scenario: Experimental candidate after stable publication
- **WHEN** admissible selected inputs include a prerelease and a stable published reference exists
- **THEN** forecast uses the shared `next` and alpha-series rules with exact upstream suffixes retained

#### Scenario: Initial experimental selection
- **WHEN** no stable distribution has been published and a selected pair contains a prerelease
- **THEN** preparation cannot present it as an eligible initial publication candidate

#### Scenario: Explicit rollback
- **WHEN** SQLite is older than its normal channel reference or Vector is older than its applicable same-engine channel/latest reference
- **THEN** a nonempty release comment is required and retained, with the advancing distribution forecast calculated by A-release

#### Scenario: Incomplete or colliding state
- **WHEN** required publication history is inaccessible, inconsistent or yields an existing identity
- **THEN** preparation fails without treating the state as empty or trying a replacement identity

#### Scenario: First Vector candidate uses historical product state
- **WHEN** a Vector selection is prepared while stable latest still contains the pre-transition 0.x sqlite-vec product
- **THEN** preparation consumes A-release's MINOR transition and current component references without cross-engine ordering, resetting history or reserving a publication number


### Requirement: Clean revision-bound candidate qualification

Preparation SHALL evaluate the clean committed candidate containing its exact Vector source/notice snapshot and schema-2 descriptor with complete mandatory repository, build, compatibility, packaging, integrity and real-browser acceptance controls. Qualification SHALL explicitly consume that Vector lock and calculated scoped package identity; returned engine, sources, revision and payload SHALL agree. Float32, native binary/Hamming, retained SQLite APIs/Workers/FTS5/baseline and all default OPFS restart gates remain mandatory. A fixture, partial matrix, different-engine success or historical run SHALL NOT qualify a candidate.

#### Scenario: Complete candidate qualification
- **WHEN** all required controls pass on the clean candidate revision and its exact forecast payload
- **THEN** preparation records their complete results and that revision/payload as eligible for PR presentation

#### Scenario: Dirty or different revision
- **WHEN** tracked inputs change during qualification or evidence identifies a different candidate commit or archive
- **THEN** preparation fails without presenting that evidence as applicable

#### Scenario: Required control unavailable or failed
- **WHEN** a mandatory test, browser prerequisite, persistence case or integrity check fails or cannot execute
- **THEN** preparation is unsuccessful and creates no eligible candidate PR

#### Scenario: Another engine succeeds for the selected candidate
- **WHEN** qualification returns a passing sqlite-vec bundle, another source lock/version, or otherwise mismatched engine evidence for a Vector candidate
- **THEN** preparation fails before remote branch/PR writes rather than treating the passing result as engine-independent

#### Scenario: Nonpublishing real preparation rehearsal
- **WHEN** preparation is exercised with its exact recorded Vector pair in a fresh isolated candidate checkout and fresh production/tool state
- **THEN** the complete commit/notice/descriptor/production/browser/evidence path can succeed without a remote write adapter, actual candidate PR, tag or publication, with any fixture state explicitly identified


### Requirement: Release descriptor handoff

The candidate SHALL introduce or update `inputs/release.json` in A-release's schemaVersion 2 with exact `sqlite`/`sqliteVector` matching `inputs/sqlite-vector.sources.lock.json`, the aggregated comment and actual preparation run ID/URL in this repository. Its invocation context SHALL remain retrievable through candidate state and PR evidence. Historical formats SHALL NOT authorize a current sqlite-vec candidate. The descriptor SHALL NOT persist a reserved forecast or manually selected channel/version.

#### Scenario: Candidate descriptor is consumed
- **WHEN** A-release reads the integrated candidate descriptor
- **THEN** selections, comment and preparation reference agree with the candidate lock and retained preparation context

#### Scenario: Invalid invocation identity
- **WHEN** run ID/URL is missing, contradictory or names another repository
- **THEN** preparation fails rather than inventing a preparation reference

### Requirement: Qualified temporary candidate PR

After mandatory product qualification and pre-PR document preparation controls pass, the system SHALL create or update a temporary candidate PR targeting `main` carrying the evaluated Vector commit. Run/PR presentation SHALL expose exact engine/version selection, unreserved forecast, preparation reference and accessible qualification evidence for human review and subsequent candidate-state consumption. It SHALL NOT silently replace another candidate, create permanent distribution branches or use a refusal-history registry. Supplying the Vector handoff SHALL NOT imply that an unadapted Watch consumer already understands it. Documentation preview/check readiness SHALL be associated with the exact qualified head/archive before the candidate is eligible for human integration; opening the PR to trigger Site SHALL NOT itself assert that readiness.

#### Scenario: Successful PR presentation
- **WHEN** qualification passes and the candidate branch can be pushed
- **THEN** the PR presents the evaluated head, selected pair, forecast and evidence while leaving integration to the maintainer

#### Scenario: Repeated preparation
- **WHEN** another preparation selects the same pair
- **THEN** it preserves existing candidate identities and does not silently rewrite their branches or PRs

#### Scenario: PR creation fails after push
- **WHEN** the candidate branch was pushed but PR creation fails
- **THEN** preparation reports the partial branch state and failure without claiming a completed candidate or force-replacing another branch

#### Scenario: Preview is produced after PR creation
- **WHEN** product qualification has passed and the same-repository candidate PR is opened
- **THEN** Site can build the unpublished documentation preview from its exact qualified handoff, and the PR remains ineligible for integration until applicable required preview/doc checks pass

### Requirement: Retained candidate provenance and diagnostics

Preparation SHALL retain available reports, logs, candidate provenance and forecast payload as uncommitted artifacts. Successful evidence SHALL relate actual engine identity, exact selections/source origins/digests, candidate commit, preparation/run, build tools/options/environment, channel/forecast, aggregated comment and output digests. Notice evidence SHALL distinguish refreshed and retained groups; refreshed records SHALL identify immutable origins, raw/recorded digests, any permitted normalization and outcome. Retained records SHALL report validation and unavailable provenance honestly, without claiming renewed acquisition. Failures SHALL preserve evaluated identities and completed/failed/unexecuted diagnostics without manufacturing success.

#### Scenario: Traceable candidate
- **WHEN** the maintainer inspects a successful candidate and its linked run artifacts
- **THEN** the selected inputs, code, build and payload identities are linked to the exact aggregated dispatch comment and preparation execution

#### Scenario: Failed preparation
- **WHEN** preparation terminates before all controls or PR operations succeed
- **THEN** available diagnostics distinguish completed, failed and unexecuted work and no complete-success claim is made

#### Scenario: Notice acquisition or reconciliation fails
- **WHEN** preparation cannot produce the complete notice snapshot
- **THEN** retained evidence names the failing upstream/notice and available source identity, distinguishes attempted, completed and unexecuted operations, and claims neither a qualified candidate nor a successful commit if none was created

#### Scenario: Retained legacy notice provenance
- **WHEN** a notice group remains unchanged, including same-pair reconstruction, and its existing valid record lacks a raw digest or immutable Git commit
- **THEN** evidence identifies the retained record and checked recorded-byte digest, explicitly marks unavailable raw or immutable-source information as not established, preserves the record without a new notice download, and does not claim fresh source verification
### Requirement: Human integration and publication boundary

Preparation SHALL stop at the qualified candidate PR. It SHALL NOT merge, enable automatic merge, create release tags or publish GitHub/npm distributions. Human integration and all mandatory gates remain prerequisites; passing candidate evidence SHALL NOT waive A-release's definitive recalculation and authoritative-revision/exact-payload qualification. Bootstrap SHALL NOT bypass this boundary.

#### Scenario: Checks pass before merge
- **WHEN** a candidate passes preparation and PR checks
- **THEN** no adoption or publication occurs until human integration and subsequent publication controls

#### Scenario: Publication forecast changes
- **WHEN** actual publication state changes after preparation or merge produces a different source revision
- **THEN** candidate evidence remains bound to its evaluated commit/payload and A-release recalculates and qualifies the definitive distribution

#### Scenario: Incompatible selected sources
- **WHEN** mandatory compatibility controls fail
- **THEN** preparation stops without automatic source repair, fallback pair selection or human waiver of the failed gates

### Requirement: Joint release documentation preparation

Updates SHALL compose A-package consumer documents and A-site_docs public sources/example context with the exact selected Vector lock, descriptor and notices in the same temporary candidate PR. The qualified archive, source revision, composition, document context and preview/check links SHALL remain traceable to that PR head. Generated runtime/archive/evidence outputs SHALL remain temporary. Preparation SHALL stop before merge, tagging or publication and SHALL NOT require an already published candidate.

#### Scenario: Prepare one reviewable candidate
- **WHEN** manual exact-version preparation succeeds
- **THEN** the committed candidate includes applicable public/package documentation sources for the selected composition, complete product qualification binds that head/archive, and the PR exposes its unpublished documentation preview and required check state for human review

#### Scenario: Documentation or evidence fails
- **WHEN** document preparation, required example/preview check or head/archive association is missing, stale, inconsistent or fails
- **THEN** the candidate is not reported eligible for integration, diagnostics identify the failing step, and no automatic merge or publication occurs

#### Scenario: Repeat candidate preparation
- **WHEN** an equivalent candidate already exists or the forecast changes before qualification
- **THEN** existing candidate deduplication remains effective, the same coherent PR is prepared or referenced, and any changed identity/head renews affected qualification/document checks without reusing stale artifacts
