# Spec Delta

## MODIFIED Requirements

### Requirement: Official pinned candidate inputs

Preparation SHALL resolve official published non-draft inputs with recorded origins and digests, retaining established pin integrity and exact prerelease suffixes. It SHALL freeze a coherent set of repository input records, release descriptor and version-associated SQLite/sqlite-vec notices before candidate checks and production, check downloaded bytes before use and consume the existing clean acquisition/build/package path without vendoring sources, committing outputs or patching upstreams.

#### Scenario: New admissible pair
- **WHEN** selected stable or published prerelease versions have sufficient official source and integrity metadata
- **THEN** candidate records preserve those exact versions, origins and official digests for verified production

#### Scenario: Existing pin differs
- **WHEN** official metadata or downloaded bytes disagree with an established expected digest
- **THEN** preparation fails without silently replacing the digest or repairing upstream sources

#### Scenario: Inadmissible source
- **WHEN** a selected source is draft, unpublished, a development snapshot or lacks sufficient official integrity metadata
- **THEN** preparation fails without selecting another upstream or acquisition workaround

#### Scenario: Same source pair
- **WHEN** the maintainer selects the already recorded pair for a first distribution or distinct reconstruction
- **THEN** an unchanged source lock remains valid and preparation still introduces or updates a traceable release descriptor

#### Scenario: SQLite identity changes
- **WHEN** an admissible selection changes SQLite, including a supported older version
- **THEN** both SQLite notices, their version associations, origins and content digests are reconciled to that exact selected release before repository checks, without changing the sqlite-vec notice group

#### Scenario: sqlite-vec identity changes
- **WHEN** an admissible selection changes sqlite-vec, including a published prerelease or rollback
- **THEN** its MIT and Apache notices, exact suffix-bearing version associations, origins and content digests are reconciled before repository checks, without changing the SQLite notice group

#### Scenario: Both upstream identities change
- **WHEN** both selected upstreams differ from the recorded pair
- **THEN** the committed candidate contains both reconciled notice groups with its source lock and descriptor before any repository check or qualification consumes it

#### Scenario: Notice absent from the selected archive
- **WHEN** a required notice is absent from the verified selected archive
- **THEN** preparation obtains it from a canonical upstream origin fixed to the exact selected release and records its immutable source identity and digest before candidate checks, without using a floating branch or another version's text

#### Scenario: Notice content is unchanged across releases
- **WHEN** the selected release supplies the same notice text as the previous release
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

### Requirement: Retained candidate provenance and diagnostics

Preparation SHALL retain available reports, logs, candidate provenance and the forecast payload as uncommitted artifacts. Successful evidence SHALL relate the preparation invocation, exact candidate commit, source origins/digests, actual build tools/options/environment, channel/forecast and output digests. Notice reconciliation evidence SHALL identify the selected upstreams, immutable notice origins, raw and recorded digests, normalization and its outcome. Failures SHALL retain available evaluated identities and diagnostics without manufacturing successful evidence.

#### Scenario: Traceable candidate
- **WHEN** the maintainer inspects a successful candidate and its linked run artifacts
- **THEN** the selected inputs, code, build and payload identities are linked to the exact aggregated dispatch comment and preparation execution

#### Scenario: Failed preparation
- **WHEN** preparation terminates before all controls or PR operations succeed
- **THEN** available diagnostics distinguish completed, failed and unexecuted work and no complete-success claim is made

#### Scenario: Notice acquisition or reconciliation fails
- **WHEN** preparation cannot produce the complete notice snapshot
- **THEN** retained evidence names the failing upstream/notice and available source identity, distinguishes attempted, completed and unexecuted operations, and claims neither a qualified candidate nor a successful commit if none was created
