## MODIFIED Requirements

### Requirement: Definitive identity before final qualification

Publication SHALL recalculate the definitive version against current Git/npm state and associate it with the authoritative commit. Package-affecting version changes SHALL preserve or renew applicable verification. Qualification of a forecast package SHALL NOT justify relabeling or repacking it without evidence covering the resulting bytes. Production SHALL explicitly consume the integrated recorded Vector lock with the definitive package name/version, binding returned engine, exact sources, lock identity and complete payload to that context instead of relying on producer defaults.

#### Scenario: Forecast differs from final version
- **WHEN** publication recalculation changes package metadata relative to candidate preparation
- **THEN** the final package is produced and qualified with the definitive identity before tagging or publishing

#### Scenario: Existing defaults cannot change the published engine
- **WHEN** the general build/acceptance default still identifies sqlite-vec but the authorized product context selects Vector
- **THEN** release qualification explicitly supplies the exact recorded Vector lock and rejects a successful default-engine bundle as unrelated

#### Scenario: Definitive documentation identity
- **WHEN** final calculation changes candidate version or the authoritative revision differs
- **THEN** final package/docs/example identity is reconciled through deterministic reviewed inputs and affected qualification/link/example checks are preserved or renewed before publication, without relabeling qualified bytes

## ADDED Requirements

### Requirement: Reviewed documentation publication handoff

Release SHALL require applicable reviewed candidate-document context and bind it to the authoritative integrated revision, definitive distribution identity and exact qualified archive. Substantive documentation changes outside the reviewed sources SHALL prevent publication readiness pending renewed review. Only complete matching GitHub and npm publication SHALL supply a successful handoff for stable documentation deployment. Partial publication, npm pending or any mismatch SHALL remain explicit and SHALL NOT authorize that deployment. Release SHALL NOT own Pages deployment or republish an existing distribution to repair a site failure.

#### Scenario: Complete matching publication
- **WHEN** authorized integration, definitive qualification and both distribution destinations complete successfully
- **THEN** the retained publication evidence supplies Site the exact revision/version/archive and applicable documentation/example context, allowing stable promotion only for that matching identity

#### Scenario: Publication is incomplete
- **WHEN** GitHub succeeds but npm fails or is pending, qualification fails, or document/archive context disagrees
- **THEN** the outcome remains failed or explicitly incomplete, Site receives no successful stable-promotion authorization, and ordinary failure/collision/bootstrap rules remain intact

#### Scenario: Site deployment fails after publication
- **WHEN** a completely published matching distribution cannot be deployed by Site
- **THEN** the site failure is reported separately and a bounded site retry uses the same verified publication identity without a new distribution/tag or changed payload
