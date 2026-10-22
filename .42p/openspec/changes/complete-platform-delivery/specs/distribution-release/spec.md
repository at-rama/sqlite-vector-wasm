## MODIFIED Requirements

### Requirement: Reviewed documentation publication handoff

Release SHALL bind reviewed candidate documents and local assembled-site checks to the PR head, authoritative integrated revision, definitive identity and exact qualified archive. Substantive unreviewed changes SHALL block publication. Successful matching npm and GitHub publication operations SHALL supply stable-promotion evidence; partial or uncertain publication SHALL NOT. Release SHALL NOT deploy Pages or republish a product to repair Site.

#### Scenario: Complete matching publication
- **WHEN** authorized integration, definitive qualification and both distribution destinations complete successfully
- **THEN** retained durable evidence supplies Site the matching revision/version/archive and reviewed/final document/example context without requiring public HTTP observation

#### Scenario: Publication is incomplete
- **WHEN** a required publication fails, is uncertain or remains pending, or document/archive context disagrees
- **THEN** Site receives no successful promotion evidence and existing failure, collision and initial-bootstrap boundaries remain intact

#### Scenario: Site deployment fails after publication
- **WHEN** a matching completely published distribution cannot be deployed by Site
- **THEN** a site-only retry uses the same publication without a new distribution/tag or altered payload

#### Scenario: Reviewed local artifact
- **WHEN** the exact candidate archive/example and assembled site passed identified desktop/mobile browser checks and preview deployment completed
- **THEN** Release accepts that identity-bound local evidence without a live Pages artifact, while missing, stale, mismatched or failed build/deploy/content evidence blocks publication

## ADDED Requirements

### Requirement: Completed platform operations establish delivery

Normal delivery SHALL require exact qualified/transmitted bytes and explicit successful completion of all required publishing operations. An initial submission or acceptance without completion SHALL NOT suffice. Immediate registry/CDN visibility, public HTTP observations and destination archive redownloads SHALL NOT gate normal success. Existing qualification, source/license/integrity, provenance, attestation, identity and collision obligations SHALL remain.

#### Scenario: Public reads fail after successful writes
- **WHEN** required npm and GitHub publication operations succeeded but public reads are unavailable or stale
- **THEN** delivery remains complete and no post-publication visibility adapter is invoked to establish normal success

#### Scenario: Failed or uncertain write
- **WHEN** a required operation is rejected or its completion cannot be established
- **THEN** no complete verdict is produced, acknowledged operations and uncertainty remain distinguishable, and no overwrite, destructive compensation or blind retry occurs

### Requirement: Durable matching publication receipt

Normal publication SHALL retain an archive-bound operational receipt with its manifest and attestation in the existing GitHub Release. The receipt SHALL identify successful preceding operations and its exact publication subject; only the matching finalized Release completes it. Stable-promotion evidence SHALL remain retrievable without expiring CI artifacts. A receipt SHALL NOT supply independent attestation or human authorization.

#### Scenario: Traceable normal publication
- **WHEN** npm publication succeeds and the receipt has been uploaded to its matching draft Release
- **THEN** finalizing that Release completes the durable delivery evidence for exactly that revision/archive/identity

#### Scenario: Draft or substituted evidence
- **WHEN** the Release remains draft, an operation is incomplete, a required asset is missing, or receipt/manifest/Release subject differs
- **THEN** durable completion is rejected even if a CI run claims success or the public URL responds

#### Scenario: Bounded historical and initial inspection
- **WHEN** an actual pre-revision publication or the historical initial manual-npm exception is inspected
- **THEN** its original evidence remains distinguishable and existing read-only checks remain available without fabricating a new automatic publishing receipt or another bootstrap exception

### Requirement: Bounded manual incident procedure

Publication SHALL retain precise operation identities, accepted results, failures and uncertain completion for a bounded manual incident procedure. It SHALL distinguish publication from Site deployment and journal retention. The procedure SHALL preserve the already qualified identity/archive and prohibit blind republication, overwrite or destructive compensation. No general automatic recovery engine SHALL be introduced.

#### Scenario: Journal failure after acknowledgment
- **WHEN** a platform operation succeeded but retaining its local journal fails
- **THEN** diagnostics distinguish evidence persistence failure from a rejected remote write and direct inspection of the existing identity before further action

#### Scenario: Publication partial or Pages failed
- **WHEN** only some publication operations completed or only Site deployment failed
- **THEN** the procedure identifies completed, failed, unknown and unexecuted work and limits intervention to the missing operation or Site alone, without selecting another release version
