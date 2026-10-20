## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Clean production in CI

**Reason**: The retained sqlite-vec capability or caller convention is removed under the proposed cleanup amendment; the complete replacement retains unrelated obligations.

**Migration**: Use the current SQLite-Vector path described by "Vector-only clean production in CI". No old-engine compatibility mechanism or separate consumer migration guide is supplied.

### Requirement: Worker1 and promise interface behavior

**Reason**: The retained sqlite-vec capability or caller convention is removed under the proposed cleanup amendment; the complete replacement retains unrelated obligations.

**Migration**: Use the current SQLite-Vector path described by "Vector-only worker1 and promise interface behavior". No old-engine compatibility mechanism or separate consumer migration guide is supplied.

### Requirement: Complete acceptance outcomes

**Reason**: The retained sqlite-vec capability or caller convention is removed under the proposed cleanup amendment; the complete replacement retains unrelated obligations.

**Migration**: Use the current SQLite-Vector path described by "Vector-only complete acceptance outcomes". No old-engine compatibility mechanism or separate consumer migration guide is supplied.

## ADDED Requirements

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

Acceptance SHALL return failure on any mandatory failed or unavailable gate and retain available diagnostic outcomes with evaluated identities. A successful verdict SHALL require the complete required production/browser matrix for its identified composition; partial, historical or other-engine results SHALL NOT substitute for missing current evidence. Automatic applicable CI SHALL qualify only the current Vector composition from isolated fresh state and retain complete evidence artifacts, without changing site-only non-applicability or publication policy.

#### Scenario: Complete success
- **WHEN** every mandatory production and browser gate passes for the identified revision and payload
- **THEN** the result supplies a complete successful acceptance record for downstream evaluation without claiming publication or human merge approval

#### Scenario: Incomplete or failed run
- **WHEN** a gate fails, remains unavailable or execution stops early
- **THEN** the operation returns nonzero and records available outcomes and diagnostics without issuing a successful acceptance handoff or reusing an earlier pass

#### Scenario: Complete Vector automatic CI qualification
- **WHEN** automatic package acceptance applies to a PR or main revision
- **THEN** the current Vector composition executes every required production/browser case from fresh state and preserves exact payload/evidence artifacts; any required failure or unavailable prerequisite prevents aggregate success, and no legacy composition job or successful skip supplies coverage

#### Scenario: Single-composition manual and downstream qualification
- **WHEN** a manual or existing downstream caller qualifies a supplied payload identity
- **THEN** the selected composition yields its own exact-byte success handoff, omitted selection retains the default, and no second composition is published or substituted

#### Scenario: Required CI evidence unavailable
- **WHEN** a successful CI qualification cannot preserve its required report and exact payload artifact, or a later consumer cannot obtain matching evidence
- **THEN** it cannot establish a complete usable acceptance handoff or publication applicability from workflow status alone
