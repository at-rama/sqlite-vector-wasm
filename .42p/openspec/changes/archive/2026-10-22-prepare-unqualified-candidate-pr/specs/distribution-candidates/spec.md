## MODIFIED Requirements

### Requirement: Clean revision-bound candidate qualification

Preparation SHALL check coherent clean committed Vector source/notice/document inputs and schema-2 descriptor before opening a qualification-pending PR. Complete mandatory repository, build, compatibility, packaging, integrity and real-browser acceptance controls SHALL then run in that PR through A-acceptance, before integration eligibility. Qualification SHALL explicitly consume that Vector lock and calculated scoped package identity; returned engine, sources, revision and payload SHALL agree. Float32, native binary/Hamming, retained SQLite APIs/Workers/FTS5/baseline and all default OPFS restart gates remain mandatory. A fixture, partial matrix, different-engine success or historical run SHALL NOT qualify a candidate.

#### Scenario: Complete candidate qualification
- **WHEN** all required controls pass on the clean candidate revision and its exact forecast payload
- **THEN** the PR producer records their complete results for that exact revision/payload; preparation alone never asserts qualification

#### Scenario: Dirty or different revision
- **WHEN** tracked inputs change during qualification or evidence identifies a different candidate commit or archive
- **THEN** qualification fails without presenting that evidence as applicable

#### Scenario: Required control unavailable or failed
- **WHEN** a mandatory test, browser prerequisite, persistence case or integrity check fails or cannot execute
- **THEN** the existing PR remains ineligible for integration; a pending PR is not a successful qualification

#### Scenario: Another engine succeeds for the selected candidate
- **WHEN** qualification returns a passing sqlite-vec bundle, another source lock/version, or otherwise mismatched engine evidence for a Vector candidate
- **THEN** PR qualification fails rather than treating the passing result as engine-independent or permitting integration

#### Scenario: Nonpublishing real preparation rehearsal
- **WHEN** preparation is exercised with its exact recorded Vector pair in a fresh isolated candidate checkout and fresh preparation state
- **THEN** the complete source/notice/document/commit/descriptor path can succeed while explicitly leaving product/browser qualification pending without a remote write adapter, actual candidate PR, tag or publication, with any fixture state explicitly identified

### Requirement: Qualified temporary candidate PR

After source/notice/document preparation and mandatory repository coherence controls pass, the system SHALL create or update a temporary candidate PR targeting `main` carrying the exact prepared Vector commit. Run/PR presentation SHALL expose exact engine/version selection, unreserved forecast, preparation reference and links to pending PR qualification and preview for human review and subsequent candidate-state consumption. It SHALL NOT silently replace another candidate, create permanent distribution branches or use a refusal-history registry. Supplying the Vector handoff SHALL NOT imply that an unadapted Watch consumer already understands it. Documentation preview/check readiness SHALL be associated with the exact qualified head/archive before the candidate is eligible for human integration; opening the PR to trigger Site SHALL NOT itself assert that readiness.

#### Scenario: Successful PR presentation
- **WHEN** coherent preparation passes and the candidate branch can be pushed
- **THEN** the PR presents the prepared head, selected pair, unreserved forecast and pending qualification/preview links while leaving integration to the maintainer

#### Scenario: Repeated preparation
- **WHEN** another preparation selects the same pair
- **THEN** it preserves existing candidate identities and does not silently rewrite their branches or PRs

#### Scenario: PR creation fails after push
- **WHEN** the candidate branch was pushed but PR creation fails
- **THEN** preparation reports the partial branch state and failure without claiming a completed candidate or force-replacing another branch

#### Scenario: Preview is produced after PR creation
- **WHEN** the same-repository candidate PR is opened and its product qualification subsequently passes
- **THEN** Site can build the unpublished documentation preview from its exact qualified handoff, and the PR remains ineligible for integration until applicable required preview/doc checks pass

### Requirement: Retained candidate provenance and diagnostics

Preparation SHALL retain available reports, logs, candidate provenance as uncommitted artifacts; exact qualified payload/build/browser reports belong to the PR producer. Successful evidence SHALL relate actual engine identity, exact selections/source origins/digests, candidate commit, preparation/run, channel/forecast and aggregated comment; subsequent qualified output digests/tools/options/environment SHALL be linked through the PR producer. Notice evidence SHALL distinguish refreshed and retained groups; refreshed records SHALL identify immutable origins, raw/recorded digests, any permitted normalization and outcome. Retained records SHALL report validation and unavailable provenance honestly, without claiming renewed acquisition. Failures SHALL preserve evaluated identities and completed/failed/unexecuted diagnostics without manufacturing success.

#### Scenario: Traceable candidate
- **WHEN** the maintainer inspects a successful candidate and its linked run artifacts
- **THEN** the selected inputs/code and separately qualified build/payload identities are linked to the exact aggregated dispatch comment and preparation execution

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

Preparation SHALL stop at the qualification-pending candidate PR. It SHALL NOT merge, enable automatic merge, create release tags or publish GitHub/npm distributions. Human integration and all mandatory gates remain prerequisites; passing candidate evidence SHALL NOT waive A-release's definitive recalculation and authoritative-revision/exact-payload qualification. Bootstrap SHALL NOT bypass this boundary.

#### Scenario: Checks pass before merge
- **WHEN** a candidate passes preparation and PR checks
- **THEN** no adoption or publication occurs until human integration and subsequent publication controls

#### Scenario: Publication forecast changes
- **WHEN** actual publication state changes after preparation or merge produces a different source revision
- **THEN** candidate evidence remains bound to its evaluated commit/payload and A-release recalculates and qualifies the definitive distribution

#### Scenario: Incompatible selected sources
- **WHEN** mandatory compatibility controls fail
- **THEN** the candidate remains ineligible without automatic source repair, fallback pair selection or human waiver of the failed gates

### Requirement: Joint release documentation preparation

Updates SHALL compose A-package consumer documents and A-site_docs public sources/example context with the exact selected Vector lock, descriptor and notices in the same temporary candidate PR. The qualified archive, source revision, composition, document context and preview/check links SHALL remain traceable to that PR head. Generated runtime/archive/evidence outputs SHALL remain temporary. Preparation SHALL stop before merge, tagging or publication and SHALL NOT require an already published candidate.

#### Scenario: Prepare one reviewable candidate
- **WHEN** manual exact-version preparation succeeds
- **THEN** the committed candidate includes applicable public/package documentation sources for the selected composition, subsequent in-PR complete product qualification binds that head/archive, and the PR exposes its unpublished documentation preview and required check state for human review after its required checks complete

#### Scenario: Documentation or evidence fails
- **WHEN** document preparation, required example/preview check or head/archive association is missing, stale, inconsistent or fails
- **THEN** the candidate is not reported eligible for integration, diagnostics identify the failing step, and no automatic merge or publication occurs

#### Scenario: Repeat candidate preparation
- **WHEN** an equivalent candidate already exists or the forecast changes before qualification
- **THEN** existing candidate deduplication remains effective, the same coherent PR is prepared or referenced, and any changed identity/head renews affected qualification/document checks without reusing stale artifacts
