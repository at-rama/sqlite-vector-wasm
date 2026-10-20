## MODIFIED Requirements

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

## ADDED Requirements

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
