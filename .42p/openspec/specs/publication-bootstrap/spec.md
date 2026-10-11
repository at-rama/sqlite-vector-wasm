# publication-bootstrap Specification

## Purpose

Establish the minimum initial registry and repository setup, complete the unavoidable first npm publication from the accepted archive, and hand subsequent publication to the normal trusted path.

## Requirements

### Requirement: Explicit minimum publication setup

Bootstrap SHALL establish the required repository/registry access and explicitly select normal trusted setup or the unavoidable initial npm exception. Missing or failed authentication SHALL NOT select an exception implicitly. Persistent npm publishing credentials SHALL NOT become the normal publication mechanism.

#### Scenario: Package does not yet exist
- **WHEN** the authorized package lacks the registry setup needed for trusted publication
- **THEN** bootstrap establishes the bounded initial disposition while retaining all supported publication and attestation prerequisites

#### Scenario: Setup is unavailable
- **WHEN** a required permission, registry access or supported attestation prerequisite is unavailable
- **THEN** bootstrap reports the blocking prerequisite without weakening controls or installing a recurring publishing token

### Requirement: Preserve human integration and complete qualification

Bootstrap SHALL consume the ordinary human-initiated candidate and human integration lifecycle. It SHALL retain all mandatory acceptance checks and authoritative revision/payload identity. It SHALL NOT create an alternative candidate, numbering policy, merge route or waiver.

#### Scenario: Authorized initial stable candidate
- **WHEN** A-release has qualified the human-integrated first candidate using its initial-version policy
- **THEN** bootstrap consumes that resulting version, channel, revision and archive without overriding them

#### Scenario: Candidate is unmerged or qualification failed
- **WHEN** only candidate evidence exists or a mandatory control failed
- **THEN** bootstrap cannot publish npm or treat human approval as a substitute for the missing controls

### Requirement: Exact bounded first npm operation

The unavoidable manual first npm publication SHALL use the exact accepted archive handed off after automatic tagging and GitHub publication. Bootstrap SHALL NOT rebuild, repack, substitute a placeholder, publish a different identity or establish a recurring manual publisher.

#### Scenario: Initial GitHub publication is npm pending
- **WHEN** A-release reports the bounded initial GitHub publication and npm-pending handoff
- **THEN** bootstrap verifies the retained identity/digest and publishes those same archive bytes on the calculated initial channel

#### Scenario: Handoff is missing or inconsistent
- **WHEN** the archive, revision, version, evidence or channel differs from the accepted handoff
- **THEN** bootstrap stops without publishing replacement bytes or reusing a publication identity

### Requirement: Consume read-only completion evidence

Bootstrap SHALL leave the initial publication pending until A-release's read-only completion check confirms matching GitHub/npm identities and exact archive bytes. Missing or inconsistent results SHALL remain explicit; bootstrap SHALL NOT recreate tags, overwrite publications or repair another partial failure.

#### Scenario: Destinations match
- **WHEN** the manual operation is followed by successful read-only matching of the accepted initial publication
- **THEN** bootstrap records that first-publication completion evidence without further publication side effects

#### Scenario: npm is absent or inconsistent
- **WHEN** npm remains absent, inaccessible or inconsistent with the handoff
- **THEN** bootstrap records pending or failure and does not claim complete success or rerun the ordinary publisher to repair it

### Requirement: Supported publication evidence remains explicit

Bootstrap SHALL preserve supported signed archive attestations and complete source/build/acceptance records. Any unsupported npm provenance mechanism and its fallback SHALL be explicit. Local manual publication SHALL NOT be described as supplying hosted OIDC provenance.

#### Scenario: Local first npm publication
- **WHEN** the unavoidable operation runs outside the supported hosted OIDC environment
- **THEN** its documented fallback is the GitHub signed archive attestation and retained qualification records, with no waiver of supported controls

### Requirement: Transition to normal trusted publication

Bootstrap SHALL establish trusted access bound to the authorized repository/workflow for subsequent automatic npm publication. It SHALL distinguish configured access from demonstrated access, preserve normal human initiation/integration, and retain no recurring manual release path. Unusable or expired setup SHALL NOT be reported as ready.

#### Scenario: First publication completed and trusted access configured
- **WHEN** the matching initial publication is complete and the required trusted-publisher settings are established
- **THEN** subsequent authorized candidates select the normal automatic path, with setup evidence identifying whether hosted access has actually been demonstrated

#### Scenario: Trusted access expires or lacks the required action
- **WHEN** the publisher configuration expires or does not permit the normal publication action
- **THEN** bootstrap reports setup as unready and requires configuration correction without bypassing release uniqueness or restoring a manual publication path
