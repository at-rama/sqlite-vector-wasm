## MODIFIED Requirements

### Requirement: Canonical browser baseline is retained

The runtime SHALL preserve the pinned canonical default browser baseline's documented APIs, loading modes, SQL behavior and capabilities, adding only the selected engine's upstream functionality. This includes conventional JavaScript, ESM, C-style and OO1 APIs, BigInt, Worker1 and its promise interface, FTS5 and default persistence VFSes. Supplied upstream browser bundler variants SHALL remain available.

#### Scenario: Loading and API surface
- **WHEN** conventional JavaScript and ESM assets initialize on the main thread and in a Worker under supported conditions
- **THEN** documented C-style and OO1 APIs and BigInt support remain usable alongside the selected engine

#### Scenario: SQL and extension semantics
- **WHEN** supported SQL, FTS5 and the selected engine's native vector operations execute in the constructed runtime
- **THEN** their upstream semantics are preserved, including FTS5 matches and native SQLite-Vector queries, without SQL translation

#### Scenario: Worker1 surface
- **WHEN** Worker1 and its promise interface open a database, execute SQL using the selected engine's native functions, return results and close
- **THEN** those upstream operations remain usable

#### Scenario: Baseline omissions
- **WHEN** the constructed runtime is compared with the same pinned canonical baseline
- **THEN** omitted documented APIs, default capabilities, loading variants or required runtime assets are detected as build-conformity failures

#### Scenario: Reference follows the selected source composition
- **WHEN** raw-browser checks construct an unmodified SQLite-only reference for a selected-engine candidate
- **THEN** the reference consumes fresh acquisition of the same selected lock and uses the same SQLite release, SDK and common options, omitting only vector integration; mismatched reference/input identities fail the comparison

### Requirement: Recorded reproducible construction

Construction SHALL be repeatable for the SQLite/SQLite-Vector composition from a clean checkout with documented prerequisites, without unpublished files, prior outputs or necessary caches. Build-defining toolchain/dependency versions and options SHALL be pinned in repository inputs and recorded in the result. Reproduction means the same defined functionality and runtime contents, not byte-identical outputs.

#### Scenario: Clean reconstruction
- **WHEN** the documented installation and build sequence runs from a clean checkout with empty temporary state
- **THEN** it can obtain the pinned tools and sources and construct the defined runtime without unpublished inputs or required caches

#### Scenario: Tool integrity failure
- **WHEN** the retained harness finds a missing, altered or wrong-version required tool
- **THEN** construction fails before using that tool instead of silently selecting another installation

#### Scenario: Actual build parameters
- **WHEN** a construction succeeds
- **THEN** its result records the tools and options actually used, sufficient to repeat the defined construction

### Requirement: Integration and runtime boundaries

Integration SHALL be limited to building, initializing, locating and exposing upstream functionality. The single construction path SHALL NOT introduce a runtime engine selector, simultaneous-engine payload or generic backend/SQL framework. It SHALL NOT patch upstream sources, change upstream SQL or vector semantics, add an ORM, SQL abstraction, application API or FluidJ behavior, or add Node.js runtime, native or WASI distributions. Node.js tooling remains permitted; an unavoidable source patch SHALL require explicit upstream contract revision.

#### Scenario: Unmodified upstream sources
- **WHEN** integration material is prepared and the canonical recipes run
- **THEN** repository-authored glue is added as a separate compilation input without editing upstream source files or acquiring a vendored SQLite copy

#### Scenario: Unsupported runtime outputs
- **WHEN** construction reports its browser runtime outputs
- **THEN** it includes no Node.js, native, WASI or optional experimental runtime distribution

#### Scenario: Incompatibility requires a patch
- **WHEN** the pinned pair cannot satisfy the retained behavior without an upstream source patch or semantic change
- **THEN** construction fails and the required revision is escalated rather than applied locally

## REMOVED Requirements

### Requirement: Fresh verified build inputs

**Reason**: The retained sqlite-vec capability or caller convention is removed under the proposed cleanup amendment; the complete replacement retains unrelated obligations.

**Migration**: Use the current SQLite-Vector path described by "Vector-only fresh verified build inputs". No old-engine compatibility mechanism or separate consumer migration guide is supplied.

## ADDED Requirements

### Requirement: Vector-only fresh verified build inputs

Each construction SHALL consume a fresh successful A-inputs acquisition of its selected repository-recorded source lock. The build command SHALL accept `--lock PATH`, defaulting to `inputs/sqlite-vector.sources.lock.json`. The validated lock SHALL identify SQLite plus SQLite-Vector only, without an alternate-engine path, separate engine selector or automatic engine substitution. It SHALL use that exact verified pair without latest-version resolution, source-cache reuse, fallback versions or externally supplied prior handoffs.

#### Scenario: Recorded pair is built
- **WHEN** construction starts with documented prerequisites and a recorded source lock
- **THEN** it acquires and builds that exact verified SQLite and selected-engine pair without adopting newer releases

#### Scenario: Acquisition fails
- **WHEN** A-inputs rejects the lock, download, digest or extracted content
- **THEN** construction stops without compiling unverified sources or using an earlier acquisition

#### Scenario: Previous sources exist
- **WHEN** an earlier acquisition or build remains in temporary state
- **THEN** a new construction uses freshly acquired trees rather than those earlier sources or outputs

#### Scenario: Published prerelease pair
- **WHEN** A-inputs successfully acquires a recorded pair containing an official published prerelease
- **THEN** construction consumes that exact verified pair with its complete version suffixes, without independently resolving releases or deciding a publication channel

#### Scenario: Acquisition identity drifts
- **WHEN** the acquisition handoff no longer matches the consumed lock bytes, exact version including suffix, or expected digest
- **THEN** construction fails before generation or compilation without substituting another pair

#### Scenario: Default construction is SQLite-Vector
- **WHEN** construction is invoked without a lock argument
- **THEN** it uses the current recorded Vector lock and static integration, without silently selecting or recreating a legacy source composition

#### Scenario: Explicit alternative source lock
- **WHEN** construction selects the recorded SQLite-Vector source lock
- **THEN** it acquires and builds SQLite with only SQLite-Vector, without retaining a sqlite-vec build path

#### Scenario: Invalid or ambiguous engine selection
- **WHEN** a lock is unrecorded, unsupported or identifies an ambiguous engine composition, or the command supplies an unsupported/conflicting selector
- **THEN** construction fails without compiling sources or falling back to another engine or lock
