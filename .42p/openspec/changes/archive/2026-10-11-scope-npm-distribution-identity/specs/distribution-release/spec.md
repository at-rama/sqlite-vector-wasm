# Spec Delta

## MODIFIED Requirements

### Requirement: Single distribution identity

The assembled browser distribution SHALL use product name `sqlite-vector-wasm`, npm package identifier `@at-rama/sqlite-vector-wasm`, one project SemVer, Git tag `dist/v<version>` and the same unprefixed npm version. Exact Git commit SHALL identify code. There SHALL be no code SemVer, separate code publication, permanent distribution branch or upstream-composition version string. Calculation, supplied package metadata, publication provenance, registry state and initial completion SHALL consistently identify this npm package; another package SHALL NOT supply its history or satisfy publication completion.

#### Scenario: Published identity
- **WHEN** a distribution is published
- **THEN** its package, tag and GitHub Release identify one version and authoritative source commit, with exact upstream versions in provenance rather than the project version

#### Scenario: Scoped identity across consumers
- **WHEN** preparation or publication obtains the common distribution identity
- **THEN** the package and its evidence identify `@at-rama/sqlite-vector-wasm`, while the product remains sqlite-vector-wasm and the repository remains `at-rama/sqlite-vector-wasm`

#### Scenario: Scoped registry state
- **WHEN** publication state or a publication completion check reads npm metadata
- **THEN** it requests the scoped package using a registry-compatible encoded name and validates both the package name and each version's package name against `@at-rama/sqlite-vector-wasm`

#### Scenario: Another package cannot satisfy identity
- **WHEN** supplied provenance or registry metadata names the unscoped package or another scope, even with matching version and archive digest
- **THEN** the attempt fails without accepting that package's history, publishing or reporting completion

#### Scenario: Scoped initial package is absent
- **WHEN** the scoped registry query returns a recognized package-absence response
- **THEN** it supplies empty history for `@at-rama/sqlite-vector-wasm` only; initial completion remains npm pending, while errors or inconsistent responses remain failures under the existing publication-state rules

#### Scenario: Initial scoped completion matches
- **WHEN** the manually published `@at-rama/sqlite-vector-wasm@0.1.0` on `latest` matches the qualified handoff and published GitHub revision and archive
- **THEN** the existing read-only initial completion check can report complete success without new publication side effects
