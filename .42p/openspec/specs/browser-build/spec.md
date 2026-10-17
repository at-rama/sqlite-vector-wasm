# browser-build Specification

## Purpose

Construct the canonical SQLite browser/WASM runtime with sqlite-vec statically integrated, preserving the pinned upstream baseline and supplying traceable build outputs to packaging. This capability realizes `A-build`.

## Requirements

### Requirement: Fresh verified build inputs

Each construction SHALL consume a fresh successful A-inputs acquisition of its selected repository-recorded source lock. The build command SHALL accept `--lock PATH`, defaulting to `inputs/sources.lock.json`. The validated lock SHALL determine exactly one engine; both retained paths SHALL remain usable, without a separate engine selector or automatic engine substitution. It SHALL use that exact verified pair without latest-version resolution, source-cache reuse, fallback versions or externally supplied prior handoffs.

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

#### Scenario: Default construction remains sqlite-vec
- **WHEN** construction is invoked without a lock argument
- **THEN** it uses the existing default source lock and sqlite-vec integration without changing recorded release inputs or downstream callers

#### Scenario: Explicit alternative source lock
- **WHEN** construction selects the recorded SQLite-Vector source lock
- **THEN** it acquires and builds SQLite with only SQLite-Vector, retaining the sqlite-vec path for subsequent independent builds

#### Scenario: Invalid or ambiguous engine selection
- **WHEN** a lock is unrecorded, unsupported or identifies an ambiguous engine composition, or the command supplies an unsupported/conflicting selector
- **THEN** construction fails without compiling sources or falling back to another engine or lock

### Requirement: Common SQLite release identity

SQLite core, WASM support and JavaScript bindings SHALL originate from the same pinned SQLite release. Construction SHALL generate the amalgamation from its verified full-source tree and SHALL NOT substitute a separately acquired core, header or binding distribution.

#### Scenario: Consistent source generation
- **WHEN** the recorded full-source SQLite release is constructed
- **THEN** its generated core and header and its WASM and JavaScript support share that release identity

#### Scenario: Missing release component
- **WHEN** the verified release cannot supply a required core, WASM or JavaScript component
- **THEN** construction fails without substituting a component from another release

### Requirement: Static registration on every connection

The runtime SHALL compile the pinned official published release of the engine selected by the lock, whether stable or prerelease, into its WASM and automatically register it through SQLite's supported static-extension initialization mechanism on every new connection. Consumers SHALL NOT dynamically load or register the selected engine themselves. Registration failure SHALL fail initialization or connection opening, as applicable.

#### Scenario: Independent connections
- **WHEN** a consumer opens multiple independent connections through the conventional or ESM browser runtime
- **THEN** each exposes the pinned selected engine's native SQL functionality without consumer registration and reports the exact SQLite and selected-engine identities and versions

#### Scenario: Worker connections
- **WHEN** a browser Worker opens a connection directly or through Worker1 and its promise interface
- **THEN** the selected engine is available without consumer registration

#### Scenario: Registration cannot complete
- **WHEN** static-extension registration or a connection's extension initialization fails
- **THEN** the corresponding initialization or opening fails instead of returning a usable connection without the selected engine

#### Scenario: Exact prerelease runtime identity
- **WHEN** the selected engine release is a published prerelease and the canonical build succeeds
- **THEN** independent browser connections expose its SQL functionality without consumer registration and report its exact upstream version including the prerelease suffix

### Requirement: Canonical browser baseline is retained

The runtime SHALL preserve the pinned canonical default browser baseline's documented APIs, loading modes, SQL behavior and capabilities, adding only the selected engine's upstream functionality. This includes conventional JavaScript, ESM, C-style and OO1 APIs, BigInt, Worker1 and its promise interface, FTS5 and default persistence VFSes. Supplied upstream browser bundler variants SHALL remain available.

#### Scenario: Loading and API surface
- **WHEN** conventional JavaScript and ESM assets initialize on the main thread and in a Worker under supported conditions
- **THEN** documented C-style and OO1 APIs and BigInt support remain usable alongside the selected engine

#### Scenario: SQL and extension semantics
- **WHEN** supported SQL, FTS5 and the selected engine's native vector operations execute in the constructed runtime
- **THEN** their upstream semantics are preserved, including FTS5 matches and native vector queries: vec0 for sqlite-vec or the corresponding SQLite-Vector functions/modules, without SQL translation

#### Scenario: Worker1 surface
- **WHEN** Worker1 and its promise interface open a database, execute SQL using the selected engine's native functions, return results and close
- **THEN** those upstream operations remain usable

#### Scenario: Baseline omissions
- **WHEN** the constructed runtime is compared with the same pinned canonical baseline
- **THEN** omitted documented APIs, default capabilities, loading variants or required runtime assets are detected as build-conformity failures

#### Scenario: Reference follows the selected source composition
- **WHEN** raw-browser checks construct an unmodified SQLite-only reference for a selected-engine candidate
- **THEN** the reference consumes fresh acquisition of the same selected lock and uses the same SQLite release, SDK and common options, omitting only vector integration; mismatched reference/input identities fail the comparison

### Requirement: Upstream storage conditions are preserved

The runtime SHALL retain every default persistence VFS supplied by the pinned canonical baseline, including OPFS, with upstream storage semantics, prerequisites and limitations. It SHALL NOT promise main-thread OPFS or silently replace requested persistence with transient storage.

#### Scenario: Default VFS availability
- **WHEN** the runtime initializes in a browser context meeting the pinned baseline's prerequisites
- **THEN** each applicable default persistence VFS and its documented initialization surface remain available

#### Scenario: Unsupported persistence context
- **WHEN** a consumer requests persistence in a context lacking its required Worker, secure-context or VFS-specific browser/isolation capabilities
- **THEN** upstream unavailability or failure behavior is preserved without silent transient substitution

### Requirement: Recorded reproducible construction

Construction SHALL be repeatable for either retained engine composition from a clean checkout with documented prerequisites, without unpublished files, prior outputs or necessary caches. Build-defining toolchain/dependency versions and options SHALL be pinned in repository inputs and recorded in the result. Reproduction means the same defined functionality and runtime contents, not byte-identical outputs.

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

Integration SHALL be limited to building, initializing, locating and exposing upstream functionality. Retaining both construction paths SHALL NOT introduce a runtime engine selector, simultaneous-engine payload or generic backend/SQL framework. It SHALL NOT patch upstream sources, change upstream SQL or vector semantics, add an ORM, SQL abstraction, application API or FluidJ behavior, or add Node.js runtime, native or WASI distributions. Node.js tooling remains permitted; an unavoidable source patch SHALL require explicit upstream contract revision.

#### Scenario: Unmodified upstream sources
- **WHEN** integration material is prepared and the canonical recipes run
- **THEN** repository-authored glue is added as a separate compilation input without editing upstream source files or acquiring a vendored SQLite copy

#### Scenario: Unsupported runtime outputs
- **WHEN** construction reports its browser runtime outputs
- **THEN** it includes no Node.js, native, WASI or optional experimental runtime distribution

#### Scenario: Incompatibility requires a patch
- **WHEN** the pinned pair cannot satisfy the retained behavior without an upstream source patch or semantic change
- **THEN** construction fails and the required revision is escalated rather than applied locally

### Requirement: Traceable runtime handoff

Successful construction SHALL supply packaging with runtime locations, the complete expected browser asset inventory and per-file sizes and SHA-256 digests, explicit selected engine identity, exact input versions/origins/archive digests/lock path and digest, actual build environment/options including extension compilation/link inputs and selected integration-input hashes and a diagnostic-log location. Runtime sources and generated outputs SHALL remain temporary and uncommitted. The handoff SHALL NOT claim product acceptance or publication readiness.

#### Scenario: Complete successful output
- **WHEN** all required construction steps succeed and each expected runtime file is present and nonempty
- **THEN** construction atomically records and emits one complete handoff with identities and digests for those exact outputs

#### Scenario: Missing runtime file
- **WHEN** an expected loader, Worker, proxy or WASM output is missing or empty
- **THEN** construction fails without a successful runtime handoff

#### Scenario: Packaging boundary
- **WHEN** packaging consumes a successful build handoff
- **THEN** it can locate and check the runtime bytes while package assembly, licensing, final-asset acceptance and publication remain separate responsibilities

#### Scenario: Prerelease handoff provenance
- **WHEN** construction succeeds for a verified source pair containing a published prerelease
- **THEN** its complete handoff retains the exact input versions including suffixes, source digests and lock identity alongside actual build tools/options and output digests, without claiming product acceptance

#### Scenario: Retained downstream handoff compatibility
- **WHEN** the default sqlite-vec composition is constructed
- **THEN** its existing required handoff fields and downstream calling convention remain compatible; alternative-composition provenance is explicit and does not imply that unchanged packaging already supports it

### Requirement: Failure does not reuse previous output

Any mandatory acquisition, tool, generation, compilation or output-inventory failure SHALL return nonzero without emitting a successful build handoff or selecting earlier outputs. Once a build workspace exists, construction SHALL retain its available diagnostic log and temporary state for investigation. Successful workspaces SHALL remain available to packaging until caller cleanup.

#### Scenario: Compilation failure with earlier success
- **WHEN** compilation fails while an earlier successful build exists
- **THEN** the invocation fails without returning the earlier build or a partial result as success

#### Scenario: Diagnostic retention
- **WHEN** generation or compilation fails after workspace creation
- **THEN** the current workspace and available diagnostics remain identifiable without a successful handoff

#### Scenario: Successful workspace lifetime
- **WHEN** a build handoff is emitted
- **THEN** its runtime files remain available for the downstream caller to consume before cleanup

### Requirement: Reproduction and browser prerequisites are documented

Contributor documentation SHALL describe the build's system prerequisites, pinned tooling setup, commands for both retained lock selections, selected-engine provenance and output lifetime. It SHALL document upstream Worker, secure-hosting and VFS-specific isolation/header requirements and limitations without promising main-thread OPFS or broader browser, storage or bundler compatibility than the pinned baseline.

#### Scenario: Reproduction instructions
- **WHEN** a contributor follows the documented build sequence from a clean checkout
- **THEN** required system tools, harness setup, acquisition/build commands and temporary output handling are explicit

#### Scenario: Storage prerequisites
- **WHEN** a consumer evaluates the documented persistence conditions
- **THEN** Worker and secure-context requirements and each VFS's distinct isolation/header and browser prerequisites are stated without generalizing one VFS's requirements to all others
