# Spec Delta

## MODIFIED Requirements

### Requirement: Shared deterministic calculation

Watch forecasts, dispatch, preparation and publication SHALL consume one shared calculation based on exact upstream selections, actual engine identities and publication state. New product publication SHALL select SQLite-Vector only. Historical sqlite-vec records and any retained low-level legacy calculation compatibility SHALL NOT authorize a new sqlite-vec product publication or require a maintained parallel offer. Identical inputs and state SHALL return identical channel/version results without AI. Forecasts SHALL reserve no identity; different forecast/final results SHALL be explained by changed inputs or state.

#### Scenario: Same calculation across consumers
- **WHEN** different consumers supply the same selected pair and published references
- **THEN** they receive the same channel, numerical signal and distribution version without independent numbering policies

#### Scenario: Publication state changes after forecast
- **WHEN** a candidate's forecast precedes another relevant publication
- **THEN** publication recalculates against actual state rather than treating the forecast as a reservation

#### Scenario: Product policy versus retained legacy callers
- **WHEN** an existing caller supplies a legacy same-engine selection or historical record
- **THEN** any retained compatibility is explicit and keeps its recorded meaning, while active Vector publication cannot accept that selection as its product candidate

### Requirement: Numerical upstream increment

Within the SQLite-Vector lineage, distribution increments SHALL use `max(ΔSQLite, ΔSQLite-Vector)` with MAJOR above MINOR above PATCH, classifying numerical progression independently of suffixes. For the first Vector product transition while the published stable product remains 0.x with sqlite-vec, the numerical base SHALL instead use the explicitly adopted MINOR increment from that actual stable product reference and remain 0.x. Unrelated engine version numbers SHALL NOT supply a delta. Otherwise, without numerical progression a new distribution SHALL use PATCH unless a higher applicable signal exists. This convention SHALL NOT replace compatibility or acceptance checks.

#### Scenario: Numerical progression into a prerelease
- **WHEN** SQLite-Vector changes numerically within its own lineage from `1.1.2` to `1.1.3-alpha.1`, or from `1.1.3` to `1.2.0-alpha.1`
- **THEN** the respective upstream signals are PATCH and MINOR, independently of prerelease classification

#### Scenario: Mixed signals and reconstruction
- **WHEN** one upstream supplies MINOR and the other PATCH, or neither numerically progresses in a code/packaging correction or distinct rebuild
- **THEN** the respective selected signals are MINOR and PATCH, without bypassing mandatory product checks

#### Scenario: Explicit rollback
- **WHEN** the authorized selection includes an upstream older than its channel reference
- **THEN** a release comment is required and the distribution uses an unused advancing version with PATCH by default unless another applicable upstream supplies a higher signal

#### Scenario: First product engine transition
- **WHEN** latest is product 0.2.4 with sqlite-vec and a qualified stable Vector selection is prepared
- **THEN** the selected numerical product base is 0.3.0, not a cross-engine MAJOR, PATCH or new 0.1.0 bootstrap, subject to definitive recalculation and uniqueness

#### Scenario: Transition does not recur after stable adoption
- **WHEN** latest already contains SQLite-Vector and the next selected Vector version supplies only PATCH
- **THEN** the ordinary same-engine numerical policy applies rather than another forced transition MINOR

### Requirement: Distribution maturity ceiling

Within a same-engine lineage, while the selected Vector upstream remains in 0.x the distribution SHALL remain in 0.x, capping upstream MAJOR signals at distribution MINOR; that same engine reaching 1.x SHALL permit entry into the product 1.x regime. The first adopted sqlite-vec-to-Vector product transition SHALL remain a MINOR within product 0.x; Vector already having an upstream 1.x number SHALL NOT itself advance the product to 1.x.

#### Scenario: SQLite major while vector engine is immature
- **WHEN** the distribution reference is `0.4.2`, SQLite supplies MAJOR and the same Vector upstream remains `0.x`
- **THEN** the next numerical distribution base is `0.5.0`

#### Scenario: Vector engine reaches one
- **WHEN** the same Vector upstream progresses from `0.x` to `1.x`
- **THEN** the prior maturity cap no longer prevents transition into distribution `1.x`

#### Scenario: Mature alternative is not a product major signal
- **WHEN** the first selected Vector upstream is 1.1.2 while the stable product reference is 0.2.x with sqlite-vec
- **THEN** the transition remains in product 0.x under the adopted MINOR rule

### Requirement: Selected stable bootstrap

The initial distribution version SHALL be `0.1.0`. The selected first effective publication SHALL use two stable upstreams and npm `latest`. Initial bootstrap SHALL preserve all verification and revision/payload requirements; it SHALL NOT be treated as permission to publish a prerelease first.

#### Scenario: Initial selected publication
- **WHEN** no distribution has been published and the authorized initial candidate has two stable upstreams
- **THEN** its definitive project version is `0.1.0` on `latest`, subject to all publication gates and initial registry setup

#### Scenario: Prerelease cases retained before bootstrap
- **WHEN** prerelease selections are used for tests or future workflow preparation before the selected initial stable publication
- **THEN** they establish no authorization for an initial experimental publication

#### Scenario: Product transition is not bootstrap
- **WHEN** published product history exists but no SQLite-Vector product has yet been published
- **THEN** that history remains authoritative and the first Vector selection cannot reset the version or invoke initial npm setup again

### Requirement: Independent channel progression and alpha series

Each channel SHALL advance monotonically by SemVer without requiring a version greater than the other channel's complete history. For experimental calculation, the required base SHALL be the current published latest version incremented under the numerical/maturity policy: the adopted MINOR transition base while latest is the pre-transition 0.x product, then ordinary same-engine numerical signals once latest contains Vector. Historical foreign-engine versions SHALL NOT be compared numerically with Vector. Product alpha counters/bases are independent of component-reference selection. An open alpha series SHALL retain its base and advance its counter when the required base is less than or equal to its base; a greater required base SHALL start at `alpha.1`. A stable version reaching/exceeding an alpha base SHALL close that series; absent an open series, the stable-derived required base SHALL start at `alpha.1`. This version reference SHALL NOT replace watch eligibility or explicit rollback's channel reference. The initial selected stable case requires no preceding stable reference.

#### Scenario: Stable maintenance alongside an experimental series
- **WHEN** publications follow `latest=0.2.0`, `next=0.3.0-alpha.2`, `latest=0.2.1`, `next=0.3.0-alpha.3`, `latest=0.3.0`
- **THEN** all channel progressions are valid and the `0.3.0` experimental series closes at the final stable publication

#### Scenario: Closed series cannot continue
- **WHEN** `latest` has reached `0.3.0` and a subsequent experimental selection supplies PATCH or MINOR
- **THEN** the next series starts respectively at `0.3.1-alpha.1` or `0.4.0-alpha.1`, rather than `0.3.0-alpha.4`

#### Scenario: Required base below the open series
- **WHEN** `latest=0.2.0`, `next=0.3.0-alpha.2` and the experimental selection supplies PATCH relative to the stable upstream composition
- **THEN** the required base is `0.2.1` and publication continues at `0.3.0-alpha.3`

#### Scenario: Required base equals the open series
- **WHEN** `latest=0.2.0`, `next=0.3.0-alpha.2` and the experimental selection supplies MINOR relative to the stable upstream composition
- **THEN** the required base is `0.3.0` and publication continues at `0.3.0-alpha.3`

#### Scenario: Required base exceeds the open series
- **WHEN** `latest=0.2.0`, `next=0.2.1-alpha.2` and the experimental selection supplies MINOR relative to the stable upstream composition
- **THEN** the required base is `0.3.0` and publication opens `0.3.0-alpha.1`

#### Scenario: Transition continues the product alpha series
- **WHEN** latest is 0.2.0 with sqlite-vec, next is an open 0.4.0-alpha.2 series, and a Vector prerelease selection has required transition base 0.3.0
- **THEN** the product series continues at 0.4.0-alpha.3 without reusing a number, creating an engine-specific counter or treating the historical engine version as a Vector comparison

#### Scenario: Transition starts an absent or closed series
- **WHEN** the transition required base is 0.3.0 and there is no open product alpha series
- **THEN** the experimental identity uses 0.3.0-alpha.1 on next while stable/stable selections still use latest

### Requirement: Complete publication state and uniqueness

Calculation/publication SHALL read Git distribution tags, npm versions and distinct channel HEADs with published provenance. Historical sqlite-vec and new Vector records SHALL be validated as their actual exact engine/version/source-lock identities; absent explicit historical engine metadata SHALL be interpreted only from an unambiguous verified historical source shape/origin, never from a version number. New Vector records SHALL NOT satisfy validation with legacy engine sources, package bytes or evidence. Historical versions, tags and channel HEADs SHALL retain uniqueness and progression effects without rewriting publications or creating another registry. Definitive identity SHALL be checked for uniqueness. An existing identity or concurrent collision SHALL fail without reuse, overwrite, reservation registry, application lock or alternative-version retry. Unavailable or contradictory required state SHALL NOT be treated as empty history. The shared npm-state interpretation SHALL recognize a registry placeholder only when its entry key and embedded version are exactly `0.0.0-stage`, its embedded package name matches the exact expected scoped package, and its `stub` marker is boolean `true`, after validating the top-level package identity and required metadata structure. The recognized placeholder SHALL remain distinguishable from package absence and SHALL NOT supply distribution history, numbering, channel references or completion evidence. Other unsupported versions or inconsistent placeholder metadata SHALL fail. A placeholder-only registry state SHALL NOT authorize an ordinary new-publication attempt; a `latest` or `next` reference to the placeholder SHALL block ordinary state-based calculation. Real distributions SHALL retain package identity, authoritative revision, provenance, channel, uniqueness and exact-byte checks. Initial completion SHALL remain read-only: missing real initial version remains pending, while completion requires that version on its expected channel with matching published evidence and bytes, independently of a recognized placeholder's presence.

#### Scenario: Existing or concurrently claimed identity
- **WHEN** the selected version/tag already exists or another publisher claims it after the check
- **THEN** publication fails without replacing it or choosing another version within that attempt

#### Scenario: Inaccessible or inconsistent history
- **WHEN** required publication state cannot be acquired completely or its version/channel/commit/composition references conflict
- **THEN** calculation fails rather than fabricating bootstrap state or trusting a partial snapshot

#### Scenario: Registry placeholder accompanies real distributions
- **WHEN** a recognized scoped `0.0.0-stage` placeholder accompanies coherent published stable or experimental distributions
- **THEN** all consumers of the common state use only the real distribution versions and qualified channel references for calculation and verification, without broadening the distribution version grammar or omitting checks on real entries

#### Scenario: Unsupported entry cannot masquerade as a placeholder
- **WHEN** `0.0.0-stage` lacks boolean `stub: true`, its entry/version/package identity conflicts, another unsupported version is present even with that marker, or a real distribution is marked as a stub
- **THEN** npm state fails explicitly rather than skipping that entry or reporting successful completion

#### Scenario: Placeholder-only package is not an absent package
- **WHEN** the registry contains the recognized placeholder but no real distribution version
- **THEN** ordinary preparation/publication-state acquisition reports an unready existing package and does not fabricate empty bootstrap history or authorize a new publication attempt

#### Scenario: Placeholder is a published channel reference
- **WHEN** `latest` or `next` points to the recognized placeholder
- **THEN** ordinary state-based calculation fails explicitly without silently deleting that channel, selecting a replacement HEAD or mutating dist-tags

#### Scenario: Initial completion with a remaining registry placeholder
- **WHEN** the recognized placeholder remains alongside the real initial `0.1.0` publication on `latest`, matching the accepted handoff and already published GitHub identity and archive
- **THEN** read-only completion can report complete success while still checking the real package identity, channel, source evidence, archive size and SHA-256, without changing either destination

#### Scenario: Placeholder does not complete the initial publication
- **WHEN** only the recognized placeholder exists or the real initial version is absent
- **THEN** initial completion remains npm pending; inaccessible or malformed metadata still fails rather than counting the placeholder as publication evidence

#### Scenario: Real publication is inconsistent despite a valid placeholder
- **WHEN** the recognized placeholder accompanies a real initial or normal publication with a wrong package identity, channel, revision, required provenance or archive bytes
- **THEN** the applicable completion/publication verification fails under its existing requirements, without publication repair or a complete-success claim

#### Scenario: Foreign-engine history is coherent published state
- **WHEN** latest or next still points to a valid historical sqlite-vec publication
- **THEN** state acquisition validates its actual engine, source provenance and destination bytes, retains its product identity and uses the adopted component-reference rule without relabeling it Vector

#### Scenario: Engine identity conflicts across evidence
- **WHEN** a publication record names Vector but its lock, origins, selected components or evidence identify sqlite-vec, both engines or an unsupported identity
- **THEN** state acquisition fails instead of fabricating empty history, guessing an engine from numbers or accepting mixed provenance

### Requirement: Human-authorized integration trigger

Normal publication SHALL automatically follow human integration of a qualified A-updates candidate into `main`, using its resulting authoritative commit and exact selection/comment context. A new product publication context SHALL identify exactly SQLite and SQLite-Vector, match its recorded verified Vector source lock and real preparation identity, and reject unsupported, ambiguous, conflicting or stale candidate selections before release effects. Historical descriptor interpretation SHALL NOT authorize a new sqlite-vec release. Candidate preparation, successful checks, unrelated merges and passing PR-head evidence SHALL NOT alone trigger publication. Dispatch SHALL remain preparation intent.

#### Scenario: Qualified candidate is integrated
- **WHEN** the human-approved candidate is merged into `main` and its integration/selection context is established
- **THEN** automatic post-integration publication evaluates that exact resulting commit under all mandatory gates

#### Scenario: No authorized candidate integration
- **WHEN** the event is preparation, an unmerged PR, an unrelated main update or a passing check alone
- **THEN** no release tag or npm/GitHub publication is created

#### Scenario: Integrated Vector selection is exact
- **WHEN** the changed candidate descriptor identifies Vector and agrees with its recorded SQLite/Vector lock at the human merge commit
- **THEN** qualification consumes that exact engine, versions, comment and preparation reference rather than the default sqlite-vec lock

#### Scenario: Legacy descriptor is not new product authorization
- **WHEN** an integrated candidate requests sqlite-vec or contradicts its recorded Vector lock, run identity or repository
- **THEN** the publication path stops before qualification side effects can create any tag or publication

### Requirement: Definitive identity before final qualification

Publication SHALL recalculate the definitive version against current Git/npm state and associate it with the authoritative commit. Package-affecting version changes SHALL preserve or renew applicable verification. Qualification of a forecast package SHALL NOT justify relabeling or repacking it without evidence covering the resulting bytes. Production SHALL explicitly consume the integrated recorded Vector lock with the definitive package name/version, binding returned engine, exact sources, lock identity and complete payload to that context instead of relying on producer defaults.

#### Scenario: Forecast differs from final version
- **WHEN** publication recalculation changes package metadata relative to candidate preparation
- **THEN** the final package is produced and qualified with the definitive identity before tagging or publishing

#### Scenario: Existing defaults cannot change the published engine
- **WHEN** the general build/acceptance default still identifies sqlite-vec but the authorized product context selects Vector
- **THEN** release qualification explicitly supplies the exact recorded Vector lock and rejects a successful default-engine bundle as unrelated

### Requirement: Applicable complete acceptance evidence

Every publication SHALL require successful mandatory build, compatibility, packaging, integrity and complete real-browser acceptance evidence applicable to the authoritative revision and exact final payload. For the product this SHALL be the exact selected Vector engine/source lock and upstream identities; Vector Float32, native binary/Hamming, all required loading/JS APIs, Workers, FTS5, baseline and every default OPFS restart gate SHALL remain mandatory. Returned successful evidence for another engine or input selection SHALL NOT qualify even when archive name/version or SQLite version matches. Failed, unavailable, incomplete, different-revision or different-payload evidence SHALL prevent release tagging and npm/GitHub publication; human approval SHALL NOT waive these gates.

#### Scenario: Exact revision and payload qualify
- **WHEN** complete successful production/browser evidence identifies the authoritative commit and exact proposed archive/runtime bytes
- **THEN** the publisher can proceed with those bytes after remaining publication checks

#### Scenario: Evidence does not apply
- **WHEN** only a passing PR head, incomplete browser outcomes or a different archive is supplied
- **THEN** release tagging and publication do not proceed without renewed applicable evidence

#### Scenario: Cross-engine successful evidence is rejected
- **WHEN** a complete passing sqlite-vec bundle is supplied for a Vector publication context
- **THEN** qualification fails before any tag/publication rather than accepting success as engine-independent

#### Scenario: Nonpublishing real Vector exercise
- **WHEN** release qualification is exercised using an explicit coherent historical-state fixture and actual freshly produced Vector browser package
- **THEN** the full existing production/browser path and retained-tarball inspection pass with the calculated definitive identity and transition notice, without invoking publishers, modifying channel state or claiming live-state/OIDC publication proof

### Requirement: Complete publication provenance

Publication provenance SHALL identify exact code commit, distribution tag, GitHub Release/npm version, channel, exact upstream versions/origins/source digests including suffixes, actual build tools/versions/options/environment and published output digests. New provenance SHALL explicitly identify SQLite-Vector and agree with integrated selection, source lock/origins, package and acceptance engine identity. Any dispatch comment SHALL be retained; an explicit rollback's required comment SHALL appear in GitHub Release notes. The first Vector product transition SHALL include a breaking-change Release notice stating the engine replacement and native SQL adaptation for vec0/vec_* usage; preserving SQLite JavaScript APIs SHALL NOT imply interchangeable vector SQL, automatic database migration or unverified vector-structure compatibility. This bounded notice SHALL NOT require a general handwritten changelog, migration framework or release email. No competing manual version registry SHALL be added.

#### Scenario: Traceable published composition
- **WHEN** release metadata and evidence are inspected
- **THEN** their linked records establish code, input, build and final-output identities matching the published version and bytes

#### Scenario: Comment and rollback explanation
- **WHEN** dispatch included a comment, particularly for an explicit rollback
- **THEN** publication provenance preserves it and rollback Release notes retain its explanation without requiring general handwritten release narratives

#### Scenario: Required transition notice is part of the handoff
- **WHEN** the first Vector transition is qualified and its Release handoff is prepared
- **THEN** the notes identify SQLite-Vector replacing sqlite-vec and the native SQL break, preserve any separate rollback comment, and are rechecked with the context before publication

#### Scenario: No engine-specific notice invention after transition
- **WHEN** a subsequent same-engine Vector release is prepared after stable Vector adoption
- **THEN** the bounded transition notice does not become a recurring manual narrative requirement while normal provenance and any rollback comment remain mandatory

### Requirement: Bounded initial npm exception

The minimum unavoidable initial registry setup/first npm-publication exception SHALL override only the automatic npm trigger where needed to establish trusted publishing. It SHALL preserve qualification and commit/payload identity, create no recurring manual path and leave subsequent human initiation/integration and automatic publication unchanged. A-bootstrap SHALL supply setup, not an alternative numbering policy. Selecting Vector SHALL NOT recreate initial setup, reset product history or grant another first-npm exception. Read-only completion of the actual historical initial sqlite-vec publication SHALL retain its engine and payload identity under the existing bounded checks. After authorized integration and mandatory qualification, the exception SHALL automatically create the tag and publish the GitHub Release with the accepted archive/evidence, hand that exact archive to A-bootstrap and report npm pending. Complete success SHALL require verification of the corresponding manual npm publication. That completion check SHALL be read-only and SHALL NOT recreate identities, repack, overwrite, resume another partial failure or supply a recurring manual publisher.

#### Scenario: Initial setup is unavoidable
- **WHEN** initial registry setup requires a first manual npm publication
- **THEN** tagging and GitHub Release publication remain automatic, the exact qualified initial payload/evidence is handed to A-bootstrap and npm is explicitly pending, with no waiver of mandatory controls or complete-success claim

#### Scenario: Initial manual npm publication matches
- **WHEN** npm's initial published version, channel, provenance and archive match the accepted handoff and already published GitHub identity
- **THEN** read-only completion verification can report complete success without recreating the tag, republishing either destination or qualifying different bytes

#### Scenario: Initial npm completion is absent or inconsistent
- **WHEN** the initial npm publication is absent, inaccessible, on a different channel or inconsistent with the accepted identity/payload
- **THEN** completion remains pending or fails with an explicit diagnostic, with no complete-success claim, overwrite or automatic repair

#### Scenario: Steady-state release after bootstrap
- **WHEN** trusted publishing is established
- **THEN** subsequent qualified integrated candidates use the normal automatic npm/GitHub publication path

#### Scenario: Historical initial completion remains read-only
- **WHEN** the initial scoped 0.1.0 sqlite-vec record is checked after Vector tooling is introduced
- **THEN** completion validates that original engine, GitHub/npm identities, expected channel and exact bytes without relabeling it Vector, creating another publication or weakening the preserved placeholder rules

## ADDED Requirements

### Requirement: Component-aware comparison references

The common policy SHALL use the target-channel HEAD (latest if absent) for SQLite. Vector SHALL use that channel's Vector reference, otherwise latest if Vector, otherwise no numerical vector reference. Engine change alone SHALL NOT be rollback; comparable regression SHALL require the existing comment. Selected reference identities SHALL be supplied to consumers without foreign-engine ordering or another history registry.


#### Scenario: Neither channel supplies Vector history
- **WHEN** latest contains sqlite-vec and next is absent or also sqlite-vec
- **THEN** SQLite keeps its ordinary reference, Vector has no numerical reference, the product identity change can supply first-Vector eligibility without invented vector progression, and the adopted MINOR transition policy applies

#### Scenario: Experimental Vector reference exists before stable adoption
- **WHEN** latest contains sqlite-vec and next contains Vector
- **THEN** a next candidate compares SQLite with next and Vector with that same-engine next reference, including prerelease order and rollback-comment enforcement

#### Scenario: Fallback from foreign experimental reference
- **WHEN** next still contains sqlite-vec while latest contains Vector
- **THEN** SQLite retains its ordinary next reference while Vector uses current latest; an older selected Vector version still requires the rollback comment

#### Scenario: SQLite regression during engine transition
- **WHEN** the first Vector composition selects SQLite older than its ordinary channel reference
- **THEN** the engine change is not numerical rollback but the SQLite regression requires the explicit retained comment, alongside the transition breaking-change notice

#### Scenario: Same-engine normal comparison
- **WHEN** the target channel contains Vector
- **THEN** both components use that channel reference for applicable ordering/rollback, with stable-base version calculation and ordinary Watch enumeration remaining distinct

#### Scenario: No fabricated reference or per-engine history
- **WHEN** a coherent snapshot supplies no Vector reference or incomplete required publication state
- **THEN** no arbitrary older release, pinned candidate, new engine registry or foreign version is used as a substitute; incomplete required state still fails under publication-state rules
