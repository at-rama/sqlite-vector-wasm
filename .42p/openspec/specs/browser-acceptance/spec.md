# browser-acceptance Specification

## Purpose

Establish complete production and real-browser acceptance for the final sqlite-vector-wasm package, with evidence bound to its evaluated source revision and payload. This capability realizes `A-acceptance`.

## Requirements

### Requirement: Final packaged asset consumption
Browser acceptance SHALL consume independently extracted final packaged assets and verify their correspondence to the recorded archive, runtime digests and selected engine/source identities. It SHALL NOT substitute development/build-tree assets, another engine composition or another runtime payload.

#### Scenario: Relocated final archive
- **WHEN** acceptance extracts the final archive outside its build/source directories and hosts it under a non-root URL prefix
- **THEN** the browser uses the identified packaged loaders, WASM, workers and proxies with working companion resolution

#### Scenario: Payload identity fails
- **WHEN** archive or consumed runtime bytes differ from their recorded identities, or runtime resolution escapes the packaged asset mount
- **THEN** acceptance fails rather than certifying the substituted or altered payload

#### Scenario: Other-composition payload substitution
- **WHEN** a payload or handoff belongs to the abandoned engine even if its SQLite version or fixture package identity matches
- **THEN** it cannot satisfy the selected composition’s acceptance evidence

### Requirement: Initialization and independent connection versions

Acceptance SHALL establish main-thread and Worker initialization and SQL execution with SQLite and the selected engine’s native runtime version matching the recorded pins on independently opened connections, without consumer dynamic loading or extension registration. The unselected engine SHALL NOT be registered.

#### Scenario: Main-thread and Worker connections
- **WHEN** supported conventional JavaScript and ESM packaged loading surfaces initialize and independently open C-style and OO1 connections on the main thread and in a Worker
- **THEN** each connection executes SQL and reports the pinned SQLite and selected-engine versions without consumer extension registration

#### Scenario: Missing or wrong extension
- **WHEN** a newly opened connection lacks the selected engine, exposes the other engine or reports an unexpected upstream version
- **THEN** acceptance fails even if another connection passed

### Requirement: FTS5 query behavior
Acceptance SHALL establish FTS5 virtual-table creation, fixture insertion and querying that returns the expected matches from the packaged runtime for SQLite-Vector.

#### Scenario: Known text matches
- **WHEN** deterministic text fixtures are inserted into a newly created FTS5 table and queried
- **THEN** returned matching identifiers equal the expected set

### Requirement: Deterministic vector queries
Acceptance SHALL establish native Float32 vector storage creation, insertion and nearest-neighbor searches for the selected engine, with deterministic fixtures returning independently expected identifiers and distances through the packaged runtime. Optional quantization or an approximate representation SHALL NOT replace this exact native path.

#### Scenario: Known Float32 neighbors
- **WHEN** deterministic Float32 fixtures are inserted and searched through the selected engine’s native SQL
- **THEN** identifiers, ordering and distances match expectations calculated independently of the selected engine, within an explicit justified floating-point tolerance

#### Scenario: Common independent Float32 oracle
- **WHEN** the Vector composition queries the same small deterministic Float32 fixtures using its native exact SQL
- **THEN** expected identifiers/order and Euclidean distances are calculated outside the extension and checked with the same explicit justified tolerance, without quantizing the fixture or using one engine as the other’s oracle

### Requirement: Binary Hamming queries
Acceptance SHALL establish native binary bit-vector insertion and nearest-neighbor queries for the selected engine, returning independently known Hamming distances and ordering exactly. Fixtures SHALL avoid ambiguous ties; optional quantization of Float32 inputs SHALL NOT substitute for directly stored binary vectors.

#### Scenario: Distinct binary neighbors
- **WHEN** bit-vector fixtures with distinct known query distances are inserted into the selected engine’s native binary storage and searched
- **THEN** returned identifiers and ordering match the independent expectations and Hamming distances match exactly

#### Scenario: Direct binary representation
- **WHEN** the Vector composition stores the deterministic binary bytes directly and searches them using native Hamming semantics
- **THEN** all expected neighbors and exact XOR/popcount distances are returned without Float32 conversion, training, quantization or preloading as a prerequisite

### Requirement: Every default OPFS VFS survives runtime restart

Acceptance SHALL establish that every retained default OPFS VFS preserves committed ordinary and vector data through write, close, runtime/Worker termination, fresh initialization, reopen and query under the same origin. Reopened Float32 and binary/Hamming searches SHALL return independently expected results without recreating, repopulating or repairing the fixture database or rebuilding derived vector data. Native per-connection column-context initialization is permitted only when it preserves the existing stored data and schema; it SHALL NOT register/load the extension or conceal missing persisted state.

#### Scenario: OPFS write and fresh reopen
- **WHEN** each retained default OPFS VFS commits ordinary and vector fixtures, closes its connection and terminates its Worker/runtime, then a fresh runtime reopens the same database under the same origin
- **THEN** it reads the original ordinary data and returns independently expected vector-search identifiers and distances

#### Scenario: Persistence is unavailable or lost
- **WHEN** a retained default OPFS VFS is unavailable, cannot reopen, loses committed data or yields incorrect reopened search results
- **THEN** acceptance fails without skipping that VFS or substituting transient storage

#### Scenario: Native context initialization after reopen
- **WHEN** a fresh connection requires the selected engine’s native column-context initialization before querying already persisted tables
- **THEN** initialization only reestablishes connection context over existing data, preserves schema and stored ordinary/vector values, and permits correct queries without fixture creation, reinsertion, recovery, quantization or derived-data rebuild

#### Scenario: Missing persisted vector state
- **WHEN** a persisted vector fixture or required stored state is removed before a fresh read phase
- **THEN** reopen acceptance fails rather than restoring it from fixture definitions or claiming success from ordinary rows alone

### Requirement: Real-browser prerequisites and recorded conditions

Every mandatory gate for each qualified composition SHALL execute in at least one real browser satisfying the pinned upstream's relevant prerequisites. Acceptance SHALL record browser versions, Worker/secure-context conditions and VFS-specific hosting/isolation conditions. Missing prerequisites SHALL NOT count as a pass or silently skip persistence.

#### Scenario: Supported browser execution
- **WHEN** the required suite runs in the selected real browser
- **THEN** its evidence records the actual browser version and applicable hosting/context prerequisites with explicit outcomes for every mandatory gate

#### Scenario: Prerequisite is absent
- **WHEN** browser, Worker, storage or isolation prerequisites required for a mandatory gate are absent
- **THEN** that gate prevents overall acceptance instead of becoming a skipped success

### Requirement: Packaged baseline preservation checks
Acceptance SHALL compare packaged public API/loading surfaces and default capabilities against the same selected composition’s pinned canonical SQLite browser baseline and detect accidental omissions. Supplied upstream bundler variants SHALL remain covered without promising compatibility with every bundler.

#### Scenario: Retained baseline
- **WHEN** packaged loading/API and capability results are compared with the same pinned unmodified baseline
- **THEN** documented C-style/OO1 APIs, BigInt, conventional/ESM and supplied bundler surfaces, Worker1/promisers, FTS5 and default VFS capabilities are retained, permitting only the selected engine’s additions

#### Scenario: Baseline omission
- **WHEN** a retained API, loading surface, companion or default capability is absent from the package
- **THEN** acceptance detects the omission and fails

#### Scenario: Selected-lock reference identity
- **WHEN** a reference is constructed for the Vector composition
- **THEN** it uses that composition’s exact SQLite release, recorded source lock, toolchain and retained common configuration without the extension, rather than substituting the default engine’s lock or an unrelated SQLite baseline

### Requirement: Revision and payload applicable evidence

Acceptance SHALL supply evidence identifying the evaluated revision and exact archive/runtime payload, selected engine, exact source-lock/upstream identities, production and browser outcomes, applicable to the authoritative revision actually released and exact payload published. A passing PR head SHALL NOT establish that applicability solely because it was merged.

#### Scenario: Authoritative revision is evaluated
- **WHEN** acceptance evaluates the authoritative revision and the exact archive supplied for publication
- **THEN** the recorded evidence identifies both and all mandatory successful production/browser results, enabling A-release to establish applicability

#### Scenario: Revision or payload differs
- **WHEN** the proposed authoritative revision or publication payload differs from the evaluated revision or bytes without evidence covering that difference
- **THEN** existing results do not establish publication applicability and fresh or otherwise demonstrably applicable evidence is required

#### Scenario: Evidence belongs to another composition
- **WHEN** a prior successful report identifies a different engine, selected lock or exact upstream input than the payload being qualified
- **THEN** it does not establish acceptance applicability, regardless of equal version strings, shared SQLite or merge ancestry

#### Scenario: Package-affecting supplied identity changes
- **WHEN** a definitive supplied package name or version changes the archive bytes
- **THEN** acceptance must cover the actual newly assembled payload; an earlier report cannot qualify a relabeled or repacked archive

### Requirement: Vector-only clean production in CI
CI SHALL demonstrate acquisition, integrity verification, construction, verification and packaging of the SQLite/SQLite-Vector composition from a clean checkout with documented prerequisites and recorded tool/source identities, without unpublished files, prior outputs or necessary caches. Reproduction SHALL cover defined functionality and contents, without requiring byte-identical rebuilds. Selection SHALL use the recorded exact sources; omitted selection SHALL use the current Vector lock and caller-supplied package identity SHALL remain supported, without legacy default/result compatibility.

#### Scenario: Empty production state
- **WHEN** CI evaluates a repository revision with empty tool, dependency, source and output state
- **THEN** it obtains and verifies the recorded inputs and tools and completes the production path using documented prerequisites

#### Scenario: Production step fails
- **WHEN** a prerequisite, acquisition, integrity, build, verification or packaging step fails
- **THEN** acceptance fails without using earlier outputs or reporting a partial production path as successful

#### Scenario: Explicit or default Vector qualification
- **WHEN** acceptance selects the current recorded Vector source lock or omits selection
- **THEN** production uses exactly that Vector lock and engine and the supplied name/version; an old-engine or mixed lock is rejected rather than converted

#### Scenario: Contradictory source selection
- **WHEN** selected lock, build, package, engine, exact source identities or digests disagree, or selection is unsupported or ambiguous
- **THEN** acceptance fails without selecting another lock, engine or prior payload

### Requirement: Vector-only worker1 and promise interface behavior
Acceptance SHALL establish that packaged Worker1 and its promise interface can open a database, execute the selected engine’s native SQL, return expected results and close through their retained upstream loading surfaces.

#### Scenario: Worker1 lifecycle
- **WHEN** the packaged Worker1 protocol opens a database, executes SQLite/selected-engine native SQL and closes it
- **THEN** it returns the expected rows and upstream versions and successfully completes closure

#### Scenario: Promiser lifecycle
- **WHEN** the packaged promise interface opens a database, executes SQLite/selected-engine native SQL and closes it
- **THEN** its promises return the expected rows and upstream versions and successfully complete closure

#### Scenario: Native Vector transport results
- **WHEN** Worker1 or promiser returns the Vector fixture query and native version results
- **THEN** the results are checked against independent fixture expectations and exact recorded versions, without preserving a sqlite-vec-only result convention

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
