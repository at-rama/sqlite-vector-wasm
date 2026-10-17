# upstream-inputs Delta

These requirements govern the SQLite-Vector candidate source path. The recorded current production pair and its existing acquisition callers remain unchanged until their dependent realization units are updated.

## MODIFIED Requirements

### Requirement: Official published source selection

The resolver SHALL select exact published, non-draft official upstream releases. Explicit versions SHALL take precedence independently and admit published alpha, beta or release-candidate versions with sufficient official source/integrity metadata. Omitted versions SHALL select the latest stable release. Development snapshots, malformed or ambiguous release identities SHALL fail without fallback. The helper SHALL NOT select npm channels or waive downstream checks.

#### Scenario: Both versions omitted
- **WHEN** neither project has an explicit version
- **THEN** the resolver selects each project's latest official stable release, excluding newer prereleases, and returns both exact versions

#### Scenario: One explicit version
- **WHEN** an exact admissible SQLite version is supplied and SQLite-Vector is omitted
- **THEN** that SQLite version is retained and the latest stable SQLite-Vector release is selected

#### Scenario: Explicit sqlite-vec or both versions
- **WHEN** an exact published stable or prerelease SQLite-Vector version is supplied, alone or with an exact admissible SQLite version
- **THEN** each supplied version takes precedence and only an omitted version is resolved to latest stable

#### Scenario: Published prerelease selection
- **WHEN** an exact SQLite-Vector alpha, beta or release-candidate version identifies a published non-draft official release with sufficient source and digest metadata
- **THEN** the resolver retains its exact suffix in the source lock without replacing it by its stable base or computing a distribution channel

#### Scenario: Invalid or unstable selection
- **WHEN** a supplied identity is malformed, absent, draft, unpublished, a development snapshot or supported by ambiguous or contradictory release metadata
- **THEN** resolution fails without replacing it with another version

#### Scenario: SQLite development download
- **WHEN** a SQLite download is a development snapshot rather than an identified published release with sufficient full-source/integrity metadata
- **THEN** resolution rejects it even when it is hosted by the official upstream

#### Scenario: Newest stable metadata is insufficient
- **WHEN** the newest stable release lacks the official release, source and integrity identities required for that upstream
- **THEN** resolution fails without choosing an older stable release or a prerelease

### Requirement: Frozen source pair without automatic fallback

The selected source pair SHALL be frozen before acquisition. Acquisition SHALL use those exact pins without re-resolving latest versions. Selection or acquisition failure SHALL terminate processing without an automatic older-version fallback or upstream repair; the helpers SHALL NOT replace the pair in response to a later compatibility failure.

#### Scenario: New release during acquisition
- **WHEN** another stable upstream release appears after resolution
- **THEN** acquisition retains the already frozen source pair

#### Scenario: Frozen candidate cannot proceed
- **WHEN** source processing fails or a caller reports an incompatible selected pair
- **THEN** the helpers provide no automatic replacement pair or repair

### Requirement: Repository-recorded official source identities

The source lock SHALL record exact component/release identity, official source origin and expected cryptographic digest before production source use. SQLite SHALL retain its official SHA3-256 pin. SQLite-Vector SHALL bind its published release to an exact tag and commit and a commit-addressed official source archive with recorded SHA-256. Only candidate preparation may compute a new archive digest; production acquisition SHALL verify an already repository-recorded pin and never authorize or refresh its own checksum.

#### Scenario: New official source pin
- **WHEN** a new published stable or prerelease source has sufficient official release and archive-integrity metadata
- **THEN** resolution emits its exact identity and available official digest for recording in the candidate repository state before production acquisition

#### Scenario: Vector release without a published source-archive digest
- **WHEN** a published non-draft official SQLite-Vector release resolves unambiguously to its exact tag and commit but has no upstream-published source-archive checksum
- **THEN** candidate preparation can hash the commit-addressed official archive and record that SHA-256 with the release URL, tag and commit before adoption; production acquisition cannot use an unrecorded candidate or derive its own expected digest

#### Scenario: Unbound source snapshot
- **WHEN** a commit or archive cannot be bound unambiguously to the selected published release
- **THEN** resolution fails even if the downloaded bytes have a computable checksum

#### Scenario: Missing official digest
- **WHEN** a new SQLite pin lacks the existing official full-source SHA3-256 evidence
- **THEN** resolution fails without using the Vector candidate-hashing path to authorize that SQLite pin

#### Scenario: Incomplete source lock
- **WHEN** acquisition receives a lock with missing, malformed or inconsistent required identities
- **THEN** it fails before exposing or using any source tree

### Requirement: Existing pin integrity is retained

For an already recorded source identity, the resolver and acquirer SHALL retain its recorded expected digest. Changed official metadata, tag/commit binding or downloaded bytes SHALL NOT silently replace that identity or digest. An announced or observed digest mismatch SHALL fail the operation and require explicit upstream-authority handling outside automatic acquisition.

#### Scenario: Official metadata changes an existing digest
- **WHEN** resolution encounters a different official digest for a source identity already present in the supplied baseline pins
- **THEN** resolution fails and preserves the existing pin

#### Scenario: Existing release tag moves
- **WHEN** an already pinned Vector release tag resolves to another commit or authoritative metadata contradicts the established release binding
- **THEN** resolution fails without replacing the recorded commit or digest

#### Scenario: Acquisition is independent of moving checksums
- **WHEN** the acquisition command consumes the recorded lock
- **THEN** it checks downloaded bytes against that lock and does not fetch a replacement checksum or modify the lock

### Requirement: Verification precedes source use

Every downloaded source archive SHALL be verified against its repository-recorded cryptographic digest before extraction or other source use. Download, digest or extraction failure SHALL return failure and SHALL NOT expose sources for a build.

#### Scenario: Matching archive
- **WHEN** a complete downloaded archive matches its recorded digest
- **THEN** that archive is eligible for extraction

#### Scenario: Changed or incomplete archive
- **WHEN** downloaded bytes fail the recorded digest or the download is incomplete
- **THEN** acquisition fails before extracting or using that archive

### Requirement: Official sufficient archives without vendoring

Acquisition SHALL use the official SQLite full-source release archive and the official release-bound SQLite-Vector commit archive. The extension handoff SHALL supply unchanged extension sources, required bundled headers and root license, excluding its bundled SQLite and unrelated packages. No clone, submodule, mirror or tracked upstream source tree is required. Missing required content SHALL fail without fallback; SQLite core, WASM support and JS bindings SHALL remain from the separately pinned SQLite release.

#### Scenario: Sufficient official archives
- **WHEN** the two selected official archives are verified and extracted
- **THEN** acquisition provides the complete independently pinned SQLite source tree and unchanged Vector extension C/header and FP16 inputs, without a clone or exposing bundled SQLite as a build input

#### Scenario: Source archive contains unrelated package symlinks
- **WHEN** the verified Vector archive includes package-license symlinks outside the selected extension inputs
- **THEN** those links are not materialized or followed; required selected files and ancestors are regular files/directories, unsafe paths or selected links fail, and no bundled SQLite or package content enters the extension handoff

#### Scenario: Required content unavailable
- **WHEN** a selected archive cannot supply the required source content
- **THEN** acquisition fails without silently substituting a clone, mirror or unrelated source bundle

#### Scenario: Repository content boundary
- **WHEN** source acquisition completes
- **THEN** acquired upstream archives and trees remain outside tracked repository content

### Requirement: Fresh acquisition and complete handoff

Each invocation SHALL acquire sources in a fresh temporary workspace under ignored `.work/`, without relying on a cache, earlier extracted trees or unpublished files. Both archives SHALL pass integrity and extraction/content checks before the invocation reports a successful pair handoff. A failed invocation SHALL NOT fall back to earlier outputs.

#### Scenario: Clean checkout
- **WHEN** acquisition runs from a clean checkout with the documented existing prerequisites and tracked source pins
- **THEN** it obtains and verifies both inputs without an installed WASM SDK, pre-existing source output or necessary cache

#### Scenario: Earlier temporary trees exist
- **WHEN** acquisition runs with existing files under `.work/`
- **THEN** it uses a new workspace and freshly downloaded archives rather than those earlier inputs

#### Scenario: Second source fails
- **WHEN** one source succeeds but the other fails download, integrity, extraction or required-content checks
- **THEN** the invocation fails without reporting a usable source pair or falling back to previous trees

#### Scenario: Successful pair handoff
- **WHEN** both inputs pass the required acquisition checks
- **THEN** the invocation reports their temporary source locations, exact versions, origins and verified digests, Vector release/tag/commit and the exact lock identity consumed, without claiming build compatibility or product acceptance

#### Scenario: Preparatory pair does not activate a distribution
- **WHEN** a recorded Vector candidate pair is acquired while the default production lock still identifies the existing distribution inputs
- **THEN** acquisition returns that requested pair without changing the default lock, release descriptor or consumer build; existing recorded production acquisitions keep their identities without silent conversion

#### Scenario: Acquired prerelease identity
- **WHEN** a recorded source pair includes a published SQLite-Vector prerelease and both archives pass integrity, extraction and content checks
- **THEN** the handoff preserves that exact prerelease identity and recorded digest, without selecting a distribution channel or claiming build compatibility
