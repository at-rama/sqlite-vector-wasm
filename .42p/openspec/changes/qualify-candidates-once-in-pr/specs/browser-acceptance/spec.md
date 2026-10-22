## MODIFIED Requirements

### Requirement: Vector-only complete acceptance outcomes
Acceptance SHALL return failure on any mandatory failed or unavailable gate and retain available diagnostic outcomes with evaluated identities. A successful verdict SHALL require the complete required production/browser matrix for its identified composition; partial, historical or other-engine results SHALL NOT substitute for missing current evidence. Automatic applicable PR CI SHALL qualify only the current Vector composition once from isolated fresh state and retain complete exact-head evidence/archive artifacts for its dependent consumers. Definitive integrated qualification remains separate and mandatory for the actual final archive. Automatic main Acceptance and Release PR-exercise jobs SHALL NOT duplicate this producer. Site-only non-applicability remains valid only when no candidate archive is required.

#### Scenario: Complete success
- **WHEN** every mandatory production and browser gate passes for the identified revision and payload
- **THEN** the result supplies a complete successful acceptance record for downstream evaluation without claiming publication or human merge approval

#### Scenario: Incomplete or failed run
- **WHEN** a gate fails, remains unavailable or execution stops early
- **THEN** the operation returns nonzero and records available outcomes and diagnostics without issuing a successful acceptance handoff or reusing an earlier pass

#### Scenario: Complete Vector automatic CI qualification
- **WHEN** automatic package acceptance applies to a PR revision
- **THEN** the current Vector composition executes every required production/browser case from fresh state and preserves exact payload/evidence artifacts; any required failure or unavailable prerequisite prevents aggregate success, and no legacy composition job or successful skip supplies coverage

#### Scenario: Single-composition manual and downstream qualification
- **WHEN** a manual or existing downstream caller qualifies a supplied payload identity
- **THEN** the selected composition yields its own exact-byte success handoff, omitted selection retains the default, and no second composition is published or substituted

#### Scenario: Required CI evidence unavailable
- **WHEN** a successful CI qualification cannot preserve its required report and exact payload artifact, or a later consumer cannot obtain matching evidence
- **THEN** it cannot establish a complete usable acceptance handoff or publication applicability from workflow status alone

#### Scenario: Shared exact candidate input
- **WHEN** applicable PR product qualification succeeds
- **THEN** dependent Site/example checks consume that run's exact head/archive through explicit job dependencies and validated artifact handoff, without polling another workflow or producing another product archive

#### Scenario: Qualified candidate source differs
- **WHEN** another commit, archive, source lock, forecast identity or incomplete report is supplied to Site or reviewed for Release
- **THEN** the handoff is rejected; a successful unrelated workflow cannot supply applicability

#### Scenario: Preparation ends before product qualification
- **WHEN** manual dispatch has prepared coherent candidate sources/notices/documents
- **THEN** its PR remains qualification-pending and the single PR producer performs the full production/browser path after opening, with no dispatch product qualification
