# Spec Delta

## Purpose

Realize A-release by supplying one deterministic distribution calculation and publishing an authorized, qualified browser package with matching npm and GitHub identities, payload and provenance.

## ADDED Requirements

### Requirement: Shared deterministic calculation

Watch forecasts, dispatch, preparation and publication SHALL consume one shared calculation based on exact upstream selections and publication state. Identical inputs and state SHALL return identical channel/version results without AI. Forecasts SHALL reserve no identity; different forecast/final results SHALL be explained by changed inputs or state.

#### Scenario: Same calculation across consumers
- **WHEN** different consumers supply the same selected pair and published references
- **THEN** they receive the same channel, numerical signal and distribution version without independent numbering policies

#### Scenario: Publication state changes after forecast
- **WHEN** a candidate's forecast precedes another relevant publication
- **THEN** publication recalculates against actual state rather than treating the forecast as a reservation

### Requirement: Single distribution identity

The assembled browser distribution SHALL use product name `sqlite-vector-wasm`, one project SemVer, Git tag `dist/v<version>` and the same unprefixed npm version. Exact Git commit SHALL identify code. There SHALL be no code SemVer, separate code publication, permanent distribution branch or upstream-composition version string.

#### Scenario: Published identity
- **WHEN** a distribution is published
- **THEN** its package, tag and GitHub Release identify one version and authoritative source commit, with exact upstream versions in provenance rather than the project version

### Requirement: Numerical upstream increment

Distribution increments SHALL use `max(ΔSQLite, Δsqlite-vec)` with MAJOR above MINOR above PATCH, classifying numerical progression independently of suffixes. Without numerical progression, a new distribution SHALL use PATCH unless a higher applicable signal exists. This convention SHALL NOT replace compatibility or acceptance checks.

#### Scenario: Numerical progression into a prerelease
- **WHEN** sqlite-vec changes from `0.1.9` to `0.1.10-alpha.1`, or from `0.1.10` to `0.2.0-alpha.1`
- **THEN** the respective upstream signals are PATCH and MINOR, independently of prerelease classification

#### Scenario: Mixed signals and reconstruction
- **WHEN** one upstream supplies MINOR and the other PATCH, or neither numerically progresses in a code/packaging correction or distinct rebuild
- **THEN** the respective selected signals are MINOR and PATCH, without bypassing mandatory product checks

#### Scenario: Explicit rollback
- **WHEN** the authorized selection includes an upstream older than its channel reference
- **THEN** a release comment is required and the distribution uses an unused advancing version with PATCH by default unless another applicable upstream supplies a higher signal

### Requirement: Distribution maturity ceiling

While sqlite-vec remains in `0.x`, the distribution SHALL remain in `0.x`, capping upstream MAJOR signals at distribution MINOR. sqlite-vec reaching `1.x` SHALL permit entry into the distribution's `1.x` regime.

#### Scenario: SQLite major while vector engine is immature
- **WHEN** the distribution reference is `0.4.2`, SQLite supplies MAJOR and sqlite-vec remains `0.x`
- **THEN** the next numerical distribution base is `0.5.0`

#### Scenario: Vector engine reaches one
- **WHEN** sqlite-vec progresses from `0.x` to `1.x`
- **THEN** the prior maturity cap no longer prevents transition into distribution `1.x`

### Requirement: Selected stable bootstrap

The initial distribution version SHALL be `0.1.0`. The selected first effective publication SHALL use two stable upstreams and npm `latest`. Initial bootstrap SHALL preserve all verification and revision/payload requirements; it SHALL NOT be treated as permission to publish a prerelease first.

#### Scenario: Initial selected publication
- **WHEN** no distribution has been published and the authorized initial candidate has two stable upstreams
- **THEN** its definitive project version is `0.1.0` on `latest`, subject to all publication gates and initial registry setup

#### Scenario: Prerelease cases retained before bootstrap
- **WHEN** prerelease selections are used for tests or future workflow preparation before the selected initial stable publication
- **THEN** they establish no authorization for an initial experimental publication

### Requirement: Upstream-derived publication channel

Two stable selected upstreams SHALL yield `latest` and stable `X.Y.Z`; at least one prerelease SHALL yield `next` and `X.Y.Z-alpha.N`. Channel SHALL NOT be manually selected. The distribution SHALL own its alpha counter independently of upstream suffixes, retaining those exact suffixes in provenance.

#### Scenario: Stable versus experimental composition
- **WHEN** a selected pair is stable/stable, stable/prerelease, prerelease/stable or prerelease/prerelease
- **THEN** classification yields respectively `latest`, `next`, `next` and `next`, without permitting a stable distribution containing a prerelease upstream

#### Scenario: Manual channel override
- **WHEN** an invocation attempts to route stable upstreams to `next` or force prerelease inputs onto `latest`
- **THEN** it cannot override the shared classification

### Requirement: Independent channel progression and alpha series

Each channel SHALL advance monotonically by SemVer without requiring a version greater than the other channel's complete history. For experimental calculation, the required base SHALL be the current published `latest` version incremented by the numerical signal of the selected upstreams relative to that stable composition, with default PATCH and the maturity ceiling. An open alpha series SHALL retain its base and advance its counter when the required base is less than or equal to its base; a greater required base SHALL start at `alpha.1`. A stable version reaching/exceeding an alpha base SHALL close that series; absent an open series, the stable-derived required base SHALL start at `alpha.1`. This version reference SHALL NOT replace watch eligibility or explicit rollback's channel reference. The initial selected stable case requires no preceding stable reference.

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

### Requirement: Complete publication state and uniqueness

Calculation/publication SHALL read Git distribution tags, npm versions and distinct channel HEADs with published provenance. Definitive identity SHALL be checked for uniqueness. An existing identity or concurrent collision SHALL fail without reuse, overwrite, reservation registry, application lock or alternative-version retry. Unavailable or contradictory required state SHALL NOT be treated as empty history.

#### Scenario: Existing or concurrently claimed identity
- **WHEN** the selected version/tag already exists or another publisher claims it after the check
- **THEN** publication fails without replacing it or choosing another version within that attempt

#### Scenario: Inaccessible or inconsistent history
- **WHEN** required publication state cannot be acquired completely or its version/channel/commit/composition references conflict
- **THEN** calculation fails rather than fabricating bootstrap state or trusting a partial snapshot

### Requirement: Human-authorized integration trigger

Normal publication SHALL automatically follow human integration of a qualified A-updates candidate into `main`, using its resulting authoritative commit and exact selection/comment context. Candidate preparation, successful checks, unrelated merges and passing PR-head evidence SHALL NOT alone trigger publication. Dispatch SHALL remain preparation intent.

#### Scenario: Qualified candidate is integrated
- **WHEN** the human-approved candidate is merged into `main` and its integration/selection context is established
- **THEN** automatic post-integration publication evaluates that exact resulting commit under all mandatory gates

#### Scenario: No authorized candidate integration
- **WHEN** the event is preparation, an unmerged PR, an unrelated main update or a passing check alone
- **THEN** no release tag or npm/GitHub publication is created

### Requirement: Definitive identity before final qualification

Publication SHALL recalculate the definitive version against current Git/npm state and associate it with the authoritative commit. Package-affecting version changes SHALL preserve or renew applicable verification. Qualification of a forecast package SHALL NOT justify relabeling or repacking it without evidence covering the resulting bytes.

#### Scenario: Forecast differs from final version
- **WHEN** publication recalculation changes package metadata relative to candidate preparation
- **THEN** the final package is produced and qualified with the definitive identity before tagging or publishing

### Requirement: Applicable complete acceptance evidence

Every publication SHALL require successful mandatory build, compatibility, packaging, integrity and complete real-browser acceptance evidence applicable to the authoritative revision and exact final payload. Failed, unavailable, incomplete, different-revision or different-payload evidence SHALL prevent release tagging and npm/GitHub publication; human approval SHALL NOT waive these gates.

#### Scenario: Exact revision and payload qualify
- **WHEN** complete successful production/browser evidence identifies the authoritative commit and exact proposed archive/runtime bytes
- **THEN** the publisher can proceed with those bytes after remaining publication checks

#### Scenario: Evidence does not apply
- **WHEN** only a passing PR head, incomplete browser outcomes or a different archive is supplied
- **THEN** release tagging and publication do not proceed without renewed applicable evidence

### Requirement: Matching consumer payload and notices

GitHub Release and npm SHALL publish the same verified npm-compatible archive for one version and commit, with the complete canonical browser runtime, retained required notices and no consumer native/WASM compilation. Publication SHALL NOT repack, modify runtime semantics or create another runtime distribution.

#### Scenario: Both publication destinations
- **WHEN** the publisher sends the final archive to npm and attaches it to the GitHub Release
- **THEN** both carry the same qualified runtime and package identity, with archive integrity checked and upstream notices retained

#### Scenario: Bytes change before publication
- **WHEN** archive bytes or their embedded identity/notices differ from the accepted payload
- **THEN** publication fails without substituting an earlier or repacked archive

### Requirement: Complete publication provenance

Publication provenance SHALL identify exact code commit, distribution tag, GitHub Release/npm version, channel, exact upstream versions/origins/source digests including suffixes, actual build tools/versions/options/environment and published output digests. Any dispatch comment SHALL be retained; an explicit rollback's required comment SHALL appear in GitHub Release notes. No competing manual version registry SHALL be added.

#### Scenario: Traceable published composition
- **WHEN** release metadata and evidence are inspected
- **THEN** their linked records establish code, input, build and final-output identities matching the published version and bytes

#### Scenario: Comment and rollback explanation
- **WHEN** dispatch included a comment, particularly for an explicit rollback
- **THEN** publication provenance preserves it and rollback Release notes retain its explanation without requiring general handwritten release narratives

### Requirement: Trusted publishing and supported attestations

Steady-state npm publication SHALL use trusted publishing rather than persistent publishing credentials where secretless publication is supported. Publication SHALL supply verifiable build provenance/asset attestations where supported by the selected environment; unsupported mechanisms and any fallback SHALL be explicit rather than silently omitted.

#### Scenario: Supported hosted publishing environment
- **WHEN** the configured environment supports npm trusted publishing and artifact attestations
- **THEN** the workflow uses those mechanisms bound to its authorized repository/workflow and exact payload

#### Scenario: Missing publishing prerequisites
- **WHEN** required authentication outside the bounded initial npm exception, or a supported required attestation mechanism, is unavailable
- **THEN** the workflow fails with an explicit diagnostic rather than silently using a persistent token or claiming attestation success

### Requirement: Bounded initial npm exception

The minimum unavoidable initial registry setup/first npm-publication exception SHALL override only the automatic npm trigger where needed to establish trusted publishing. It SHALL preserve qualification and commit/payload identity, create no recurring manual path and leave subsequent human initiation/integration and automatic publication unchanged. A-bootstrap SHALL supply setup, not an alternative numbering policy. After authorized integration and mandatory qualification, the exception SHALL automatically create the tag and publish the GitHub Release with the accepted archive/evidence, hand that exact archive to A-bootstrap and report npm pending. Complete success SHALL require verification of the corresponding manual npm publication. That completion check SHALL be read-only and SHALL NOT recreate identities, repack, overwrite, resume another partial failure or supply a recurring manual publisher.

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

### Requirement: Publication failures remain explicit

A mandatory failure SHALL stop the attempt with available diagnostics and no complete-success claim. If a publication side effect has already succeeded before a later transport/service failure, the result SHALL identify that partial state without overwriting an existing identity, deleting published evidence or treating the successful destination as both publications. Generated payload/evidence SHALL remain uncommitted.

#### Scenario: One destination succeeds and the other fails
- **WHEN** npm or GitHub has succeeded but a later publication operation fails
- **THEN** the attempt returns failure identifying successful and failed operations, retaining exact identities and diagnostics without destructive compensation

#### Scenario: Failure before publication
- **WHEN** qualification, state acquisition, integrity or uniqueness fails before release side effects
- **THEN** no release tag or publication is created and available diagnostics remain distinguishable from accepted publication evidence
