# Spec Delta

## Purpose

Realize A-updates by preparing exact human-selected official upstream combinations into fully checked, traceable candidate pull requests for human integration and subsequent A-release qualification.

## ADDED Requirements

### Requirement: Exact human dispatch

Candidate preparation SHALL start from human `workflow_dispatch` with exact `sqlite_version`, exact `sqlite_vec_version` and free-text `release_comment`. It SHALL accept no manual channel or distribution-version override and SHALL operate independently of watch plans, polling history and intervening releases. Nominal preparation SHALL be deterministic without AI selection or repair.

#### Scenario: Exact pair outside watch suggestions
- **WHEN** the maintainer selects an admissible pair absent from any watch plan, skipping intermediate releases or rebuilding the recorded pair
- **THEN** preparation evaluates that exact pair without requiring watch implementation or history

#### Scenario: Missing or malformed selection
- **WHEN** either exact version is missing, malformed or accompanied by an unsupported channel/version override
- **THEN** preparation fails without substituting a latest version or publishing anything

#### Scenario: Comment is structured data
- **WHEN** a comment contains quotes, newlines or shell metacharacters
- **THEN** its value is retained as data without executing it or changing selection

### Requirement: Official pinned candidate inputs

Preparation SHALL resolve official published non-draft inputs with recorded origins and digests, retaining established pin integrity and exact prerelease suffixes. It SHALL freeze repository input records before production, check downloaded bytes before use and consume the existing clean acquisition/build/package path without vendoring sources, committing outputs or patching upstreams.

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

### Requirement: Shared forecast and rollback policy

Preparation SHALL derive its channel, forecast version and rollback classification using the A-release policy and complete actual Git/npm publication state. Forecasts SHALL reserve no identity, introduce no second numbering policy, reservation registry or application lock, and SHALL NOT authorize initial experimental publication. Unavailable state or calculation collisions SHALL fail.

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
- **WHEN** a selected upstream is older than its channel reference
- **THEN** a nonempty release comment is required and retained, with the advancing distribution forecast calculated by A-release

#### Scenario: Incomplete or colliding state
- **WHEN** required publication history is inaccessible, inconsistent or yields an existing identity
- **THEN** preparation fails without treating the state as empty or trying a replacement identity

### Requirement: Clean revision-bound candidate qualification

Preparation SHALL evaluate the clean committed candidate containing its input records and release descriptor, using complete mandatory repository, build, compatibility, packaging, integrity and real-browser acceptance controls. Evidence SHALL identify that exact commit and forecast package/archive. A passing tooling fixture, partial matrix or historical run SHALL NOT establish candidate qualification.

#### Scenario: Complete candidate qualification
- **WHEN** all required controls pass on the clean candidate revision and its exact forecast payload
- **THEN** preparation records their complete results and that revision/payload as eligible for PR presentation

#### Scenario: Dirty or different revision
- **WHEN** tracked inputs change during qualification or evidence identifies a different candidate commit or archive
- **THEN** preparation fails without presenting that evidence as applicable

#### Scenario: Required control unavailable or failed
- **WHEN** a mandatory test, browser prerequisite, persistence case or integrity check fails or cannot execute
- **THEN** preparation is unsuccessful and creates no eligible candidate PR

### Requirement: Release descriptor handoff

The candidate SHALL introduce or update `inputs/release.json` in the format consumed by A-release, with selections matching `inputs/sources.lock.json`, the exact comment and the real preparation run ID/URL in this repository. Its invocation context SHALL remain retrievable through candidate state. The descriptor SHALL NOT persist a forecast as a reserved final version.

#### Scenario: Candidate descriptor is consumed
- **WHEN** A-release reads the integrated candidate descriptor
- **THEN** selections, comment and preparation reference agree with the candidate lock and retained preparation context

#### Scenario: Invalid invocation identity
- **WHEN** run ID/URL is missing, contradictory or names another repository
- **THEN** preparation fails rather than inventing a preparation reference

### Requirement: Qualified temporary candidate PR

After successful mandatory preparation controls, the system SHALL create or update a candidate PR targeting `main` from a temporary branch carrying the evaluated commit. It SHALL expose exact selection, forecast, preparation reference and qualification evidence for human review and current candidate discovery. It SHALL NOT silently replace another candidate, create permanent distribution branches or use a refusal-history registry.

#### Scenario: Successful PR presentation
- **WHEN** qualification passes and the candidate branch can be pushed
- **THEN** the PR presents the evaluated head, selected pair, forecast and evidence while leaving integration to the maintainer

#### Scenario: Repeated preparation
- **WHEN** another preparation selects the same pair
- **THEN** it preserves existing candidate identities and does not silently rewrite their branches or PRs

#### Scenario: PR creation fails after push
- **WHEN** the candidate branch was pushed but PR creation fails
- **THEN** preparation reports the partial branch state and failure without claiming a completed candidate or force-replacing another branch

### Requirement: Retained candidate provenance and diagnostics

Preparation SHALL retain available reports, logs, candidate provenance and the forecast payload as uncommitted artifacts. Successful evidence SHALL relate the preparation invocation, exact candidate commit, source origins/digests, actual build tools/options/environment, channel/forecast and output digests. Failures SHALL retain available evaluated identities and diagnostics without manufacturing successful evidence.

#### Scenario: Traceable candidate
- **WHEN** the maintainer inspects a successful candidate and its linked run artifacts
- **THEN** the selected inputs, code, build and payload identities are linked to the exact dispatch comment and preparation execution

#### Scenario: Failed preparation
- **WHEN** preparation terminates before all controls or PR operations succeed
- **THEN** available diagnostics distinguish completed, failed and unexecuted work and no complete-success claim is made

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
