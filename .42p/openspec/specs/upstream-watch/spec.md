# upstream-watch Specification

## Purpose

Realize A-watch by presenting eligible official upstream combinations and current candidate state in a deterministic weekly or manually invoked execution summary, leaving preparation and adoption under human control.

**Notification responsibility.** The requirements below realize A-watch: discovery, planning, technical outcomes and reference GitHub restitution. The separate `watch-plan-notifications` capability realizes A-notifications through one short Resend → Gmail email for each successful complete nonempty plan, identically for scheduled and manual executions and including existing candidates. Empty plans and errors trigger no project-controlled notification; account-driven GitHub notifications remain outside scope. See the [Notifications Capture](../../../engineering/2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md), [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) and [Watch guide](../../../../docs/watch.md#plan-email). Historical notification contracts and verification evidence retain their original archived scope. This explanatory note does not establish sender Verification or actual delivery.

## Requirements

### Requirement: Official released upstream discovery

The watch SHALL discover exact official published stable/prerelease SQLite and SQLite-Vector identities under A-inputs' admissibility, preserving suffixes and released tag/commit/source binding. It SHALL NOT discover prospective sqlite-vec candidates, acquire candidate sources or require an upstream-published Vector archive checksum where preparation legitimately establishes it. Drafts, snapshots, aliases, ambiguous or incomplete evidence SHALL fail or be excluded under the existing admissibility rules without a fabricated complete inventory.

#### Scenario: Stable and experimental publications
- **WHEN** official published versions have unambiguous admissible identities, including alpha, beta or release-candidate suffixes
- **THEN** discovery retains their exact identities and maturity for subsequent pair enumeration

#### Scenario: Official host contains a development snapshot
- **WHEN** an upstream branch, draft or development snapshot is visible on an official service
- **THEN** its hosting alone does not make it an admissible published release or authorize a fabricated prerelease identity

#### Scenario: Discovery cannot establish its inventory
- **WHEN** a required source is unavailable, truncated, contradictory or exposes an unresolved release identity
- **THEN** the watch reports unsuccessful discovery without presenting the result as an empty or complete plan

#### Scenario: Released Vector binding without a published archive checksum
- **WHEN** an official non-draft Vector release has unambiguous exact release/tag/commit source metadata but no published archive checksum
- **THEN** discovery can retain its admissible metadata without downloading the source archive or rejecting A-inputs' preparation-time pin policy; build and integrity qualification remain subsequent controls

#### Scenario: Development header does not establish a release
- **WHEN** a prospective alpha appears only in a branch, header or artifact
- **THEN** it is not proposed as a published release, regardless of an official host or npm alias

### Requirement: Ordinary discovery baselines

Ordinary planning SHALL include only SQLite versions at least `3.53.4` and SQLite-Vector versions at least `1.1.0`, including prerelease ordering. The inclusive Vector floor SHALL be fixed; future source-pin or upstream release changes SHALL NOT recompute N−1. Discovery floors SHALL remain separate from published references and SHALL NOT prohibit manual older admissible selections or guarantee a nonempty plan or notification.

#### Scenario: Versions around the baseline
- **WHEN** discovery includes SQLite-Vector `1.1.0-alpha.1`, `1.1.0` and `1.1.3-alpha.1`
- **THEN** ordinary planning excludes the first and retains the latter two for eligibility assessment

#### Scenario: Manual older selection
- **WHEN** the maintainer dispatches an admissible pair below an ordinary watch baseline
- **THEN** the watch's discovery limits supply no dispatch prohibition or mandatory watch-history prerequisite

#### Scenario: Inclusive predecessor floor
- **WHEN** official stable Vector 1.1.0 and 1.1.2 satisfy the remaining publication-reference and candidate conditions
- **THEN** both are eligible for enumeration from the inclusive 1.1.0 floor; the floor neither prioritizes the newer version nor forces an email

#### Scenario: Source pins later advance
- **WHEN** a source pin or new official release advances beyond 1.1.2
- **THEN** ordinary Vector discovery retains the fixed 1.1.0 floor without recomputing a moving predecessor

### Requirement: Coherent publication references

The watch SHALL read actual Git distribution tags, scoped npm versions, published provenance and latest/next HEADs through A-release's existing interpretation, retaining exact engine identity. Historical sqlite-vec publications SHALL remain readable for numbering, occupied identities and corresponding-history exclusions without becoming numerical Vector references or prospective candidates. Missing/inconsistent state SHALL fail; placeholder metadata SHALL supply no reference.

#### Scenario: Complete channel state
- **WHEN** published Git/npm identities and provenance are coherent
- **THEN** planning uses their exact upstream compositions, channel references and occupied identities

#### Scenario: Inconsistent or incomplete publication state
- **WHEN** a required page or provenance is unreadable, a HEAD conflicts with its publication or npm contains only an unready placeholder
- **THEN** planning fails without inventing a bootstrap reference or claiming no work exists

#### Scenario: Historical latest is from the other engine
- **WHEN** latest still contains an exact historical sqlite-vec composition
- **THEN** the shared state remains valid for numbering and applicable SQLite references, with no invented Vector version reference

### Requirement: Stable pair eligibility

For latest, the watch SHALL enumerate every unpublished stable SQLite/SQLite-Vector pair under the adopted component references: SQLite uses the channel HEAD or latest, and Vector uses that channel's Vector composition, otherwise latest if Vector, otherwise no numerical Vector reference. Without a Vector reference the engine identity change permits eligibility without fabricated vector progression; applicable SQLite no-regression remains. With comparable references, require no component regression and strict progression. An advanced next SHALL NOT block stable maintenance.

#### Scenario: Stable maintenance alongside next
- **WHEN** `latest` is `(3.54.0, 1.1.2)`, `next` is more advanced and stable `(3.54.1, 1.1.2)` is available
- **THEN** the stable pair remains eligible subject to published-pair exclusion

#### Scenario: One component regresses
- **WHEN** a stable pair increases SQLite-Vector but decreases SQLite relative to `latest`
- **THEN** it is excluded from ordinary stable planning

#### Scenario: Existing versions form new work
- **WHEN** already known individual versions form an unpublished eligible pair
- **THEN** that pair is considered without requiring a newly detected upstream release

#### Scenario: First Vector composition retains SQLite
- **WHEN** latest contains sqlite-vec and an admissible stable Vector selection retains latest's SQLite version
- **THEN** engine identity change permits the Vector composition to enter eligibility, subject to the discovery floor and publication/candidate rules, without requiring a numerical comparison with sqlite-vec

#### Scenario: Existing Vector reference governs progression
- **WHEN** the target channel already supplies a published Vector reference
- **THEN** ordinary stable eligibility uses same-engine no-regression/strict-progression rather than the discovery floor as a substitute reference

### Requirement: Experimental pair eligibility

For next, the watch SHALL enumerate all admissible pairs containing a prerelease, progressing from its applicable channel/latest references without component regression and remaining at least as recent as latest on comparable components. It SHALL consume A-release's same-engine reference selection; no foreign-engine ordering or imaginary Vector reference is allowed. Without next, latest supplies applicable references. Suffix order SHALL remain distinct from numerical forecast signals; no newest-alpha-only selection is introduced.

#### Scenario: Next is behind latest on one component
- **WHEN** `latest=(3.54.0, 1.1.2)`, `next=(3.53.5, 1.1.3-alpha.1)` and `(3.53.6, 1.1.3-alpha.2)` is available
- **THEN** the pair is excluded despite progression from `next`, because SQLite remains behind `latest`

#### Scenario: Several experimental pairs are eligible
- **WHEN** those references apply and `(3.54.0, 1.1.3-alpha.1)` and `(3.54.0, 1.1.3-alpha.2)` are available
- **THEN** both pairs remain candidates for the plan rather than only the newest alpha

#### Scenario: Next has not been published
- **WHEN** coherent state has `latest` and no `next`
- **THEN** an experimental pair is compared component by component against `latest` before its shared forecast is calculated

#### Scenario: Applicable Vector channel and latest references
- **WHEN** next and latest contain different engine identities or one has no Vector composition
- **THEN** eligibility consumes the adopted same-engine fallback and latest lower-bound rules only where comparable, without constructing a baseline publication or ordering foreign-engine numbers

### Requirement: Published pair exclusion

The watch SHALL exclude compositions already published in the corresponding stable/experimental status, keyed by exact SQLite version, engine identity and engine version. It SHALL use published history, not only current HEADs. A rollback or packaging-only publication SHALL NOT reintroduce an already published same-engine composition; identical numbers from different engines SHALL NOT exclude the new Vector composition.

#### Scenario: Rollback reveals an earlier published pair
- **WHEN** a manual rollback moves a channel HEAD behind a pair already published in that status
- **THEN** that historical pair is not proposed again merely because it is newer than the current HEAD

#### Scenario: Several distributions carry the same composition
- **WHEN** a packaging correction publishes another version with the same upstream pair
- **THEN** both publications establish the same pair exclusion without creating extra upstream jobs

#### Scenario: Equal version strings identify different engines
- **WHEN** a historical foreign-engine publication happens to share a version string with a Vector candidate
- **THEN** that history is retained truthfully and does not count as the candidate's already-published Vector composition

### Requirement: Current candidate awareness

For each eligible Vector pair, the watch SHALL identify current queued/active Updates runs and open candidate PRs from their exact engine/selection/run/attempt and schema-2 descriptor matching the head's recorded Vector lock. It SHALL preserve distinct candidates and prohibit duplicate-preparation recommendations, without remote writes. Clearly historical sqlite-vec records SHALL NOT establish current Vector candidates; unknown or contradictory relevant identities SHALL fail rather than imply no candidate.

#### Scenario: Preparation precedes its PR
- **WHEN** an Updates preparation is queued or active for an eligible pair and has no PR yet
- **THEN** the plan identifies that preparation and its run link instead of presenting the pair as having no candidate

#### Scenario: Existing candidate PR
- **WHEN** an open candidate PR's exact head descriptor establishes the eligible pair and its preparation identity
- **THEN** its link and state appear on that pair's plan entry without a suggested duplicate launch

#### Scenario: Candidate selection cannot be established
- **WHEN** relevant candidate metadata is unavailable or contradicts the descriptor or repository identity
- **THEN** the watch reports the unresolved read rather than falsely declaring no existing candidate

#### Scenario: New Updates producer handoff
- **WHEN** an active run exposes the Vector title/parameters or a candidate head contains its coherent schema-2 descriptor and inputs/sqlite-vector.sources.lock.json
- **THEN** the exact selection, run/attempt and PR head are recognized and joined without reading the unused vec lock as the selected product

#### Scenario: Historical or ambiguous candidate metadata
- **WHEN** a candidate-like record is clearly an old sqlite-vec preparation, or a relevant prospective Vector record is mixed, malformed or unreadable
- **THEN** the historical record supplies no current Vector candidate while the ambiguous relevant record causes explicit failure, not a false absence claim

### Requirement: Shared nonreserving forecasts

Each eligible Vector pair SHALL use A-release's existing deterministic channel, increment, transition/component-reference and alpha-series calculation from one acquired actual publication state. No separate policy, manual override, foreign-engine version comparison, reservation or AI heuristic is allowed. Identical inputs/state SHALL agree with preparation; changed later state permits recalculation. A collision SHALL fail without an alternate-number retry; forecasts waive no mandatory publication or compatibility control.

#### Scenario: Forecasts share a snapshot
- **WHEN** watch and preparation calculate the same exact pair against the same publication state
- **THEN** channel, increment and version agree under the common maturity, alpha-series, initial-publication and uniqueness rules

#### Scenario: Independent jobs forecast the same number
- **WHEN** several eligible pairs yield the same distribution number from the current snapshot
- **THEN** each is shown as an independent nonreserved forecast without simulating sequential adoption

#### Scenario: State changes or a collision is found
- **WHEN** later publication changes references, or current calculation finds an occupied identity
- **THEN** later publication recalculates under its own gates, while a current collision is reported as a planning failure without an alternative-number retry

### Requirement: Actionable human job plan

The reference GitHub Summary SHALL present every eligible SQLite/SQLite-Vector pair, exact Updates parameters, Actions link and candidate state. A central Forecast section SHALL associate each pair with channel/increment/version without repetition or loss, retaining latest/next ordering. Engine identities and historical reference compositions SHALL remain truthful. The maintainer chooses zero, one or several jobs. Optional release-comment guidance SHALL target native Vector fields, remain separate from nominal operation and imply no build/publication acceptance.

#### Scenario: Pair has no existing candidate
- **WHEN** a nonempty plan contains an eligible pair without current preparation
- **THEN** its entry supplies exact `sqlite_version`, `sqlite_vector_version`, empty `sqlite_comment`, `sqlite_vector_comment` and `misc_comment`, and the Updates Actions link for human initiation, with no channel/version override

#### Scenario: Pair already has preparation
- **WHEN** an eligible pair has an active run or open candidate PR
- **THEN** the entry presents those references and states without recommending a duplicate dispatch

#### Scenario: Shared instructions reduce repetition
- **WHEN** common parameter instructions or forecast caveats are stated once for several entries
- **THEN** each entry and its centralized forecast association still unambiguously supply its exact pair, channel/increment/version and applicable Updates parameters/link directly in the Summary, without consulting raw logs or downloading an artifact

#### Scenario: Channel has a common forecast
- **WHEN** every eligible pair in a channel has the same forecast version and increment
- **THEN** the Forecast section states that channel/version/increment once and the channel's pair blocks contain no repeated forecast

#### Scenario: Channel has differing forecasts
- **WHEN** eligible pairs within one channel have different forecast versions or increments
- **THEN** the Forecast section presents all distinct forecasts and unambiguously associates them with their exact upstream pairs, using a SQLite-only selector only when sufficient, without treating the first pair as representative or changing pair order

#### Scenario: Forecasts are alternatives at the observed state
- **WHEN** forecasts are centralized for several pairs or channels
- **THEN** they remain independent and unreserved at the observed published state, with an explicit publication recalculation caveat rather than a sequential publication plan

#### Scenario: All eligible entries already have candidates
- **WHEN** every eligible pair is associated with current preparation or an open candidate PR
- **THEN** all entries and their distinct candidate states remain in the complete nonempty plan, without reclassifying the result as empty or proposing duplicate preparation

#### Scenario: Optional comments respect the selected engine
- **WHEN** the maintainer invokes the separate release-comments aid for a selected Vector pair
- **THEN** guidance uses sqlite_vector_version/sqlite_vector_comment, official Vector release notes and same-engine comparison only when a reference exists, explicitly describing a first engine transition without fabricating a cumulative sqlite-vec-to-Vector numerical changelog
### Requirement: Readable execution outcomes

The watch SHALL present its result directly in the GitHub Actions execution summary without requiring raw-log inspection. A complete nonempty plan, a complete empty plan and a discovery/state/calculation failure SHALL have distinct readable outcomes. The simplified Summary and associated artifacts SHALL remain the reference for results and diagnostics. An empty plan SHALL be normal; errors SHALL remain unsuccessful executions rather than fabricated empty plans.

#### Scenario: Nonempty plan is available
- **WHEN** complete discovery, state reads and calculation yield eligible entries
- **THEN** the execution summary presents the complete actionable plan and its reference state

#### Scenario: Empty successful plan
- **WHEN** complete discovery and state reads yield zero eligible entries
- **THEN** the execution summary explicitly presents a normal empty plan and the run succeeds

#### Scenario: Planning fails
- **WHEN** discovery, state acquisition or calculation cannot complete correctly
- **THEN** the execution summary identifies the failed stage and diagnostic, the run fails and no complete empty-plan claim is made

#### Scenario: Result presentation or evidence writing fails
- **WHEN** writing the Summary or its associated technical record fails
- **THEN** the execution remains unsuccessful and preserves available failed-stage diagnostics without reporting successful complete planning or a normal empty plan

### Requirement: Independent manual planning

A-watch SHALL support manual GitHub Actions `workflow_dispatch` independently of its weekly schedule. Manual invocation SHALL use the same discovery, pair eligibility and shared forecast policy and only recalculate/present the plan. It SHALL NOT initiate or dispatch A-updates candidate preparation, select candidates for adoption or introduce channel/version overrides.

#### Scenario: Plan outside the weekly schedule
- **WHEN** the maintainer invokes the watch manually before its next scheduled execution
- **THEN** A-watch calculates and presents the plan without waiting for the cron or starting candidate preparation

#### Scenario: Same planning state under both triggers
- **WHEN** scheduled and manual executions observe identical upstream, publication and candidate state
- **THEN** they produce the same job plan and forecasts while remaining distinct from the separate manual Updates workflow

### Requirement: Weekly Paris schedule

The watch SHALL run through GitHub Actions each Friday with a scheduled time of 08:00 in `Europe/Paris`, respecting daylight-saving changes. Scheduling deactivation through repository inactivity SHALL be accepted and reactivated manually. No keepalive, repository write or alternate scheduler SHALL be introduced to prevent deactivation.

#### Scenario: Winter and summer scheduling
- **WHEN** Paris switches between winter and summer time
- **THEN** the configured scheduled time remains Friday 08:00 Paris time rather than a fixed UTC hour

#### Scenario: Inactivity deactivation
- **WHEN** GitHub disables the scheduled workflow through inactivity
- **THEN** reactivation remains manual without a keepalive commit or automated reactivation mechanism

### Requirement: Planning stops before preparation

The watch SHALL stop at plan/result production and GitHub restitution, for both scheduled and manual invocation. It SHALL NOT change source pins, acquire/build a candidate, dispatch preparation, create candidate PRs, merge, enable auto-merge, create tags or publish distributions. Manual preparation SHALL remain independent of plan history, and human integration and mandatory acceptance gates SHALL retain their existing roles.

#### Scenario: Successful watch execution
- **WHEN** a watch plan is successfully computed and presented after scheduled or manual invocation
- **THEN** repository, candidate and publication state remain unchanged and no preparation or publication has been initiated

### Requirement: Stateless deterministic operation

Nominal discovery, selection and forecasting SHALL operate deterministically without AI. The watch SHALL use official upstream state, published references/history and current candidates, introducing no refusal registry, persistent proposal history, version reservation, application lock, second version domain or permanent distribution branch.

#### Scenario: Eligible pair is not selected
- **WHEN** the maintainer does not launch a proposed eligible pair and the relevant state stays unchanged
- **THEN** the pair remains proposable on the next weekly plan without a refusal record

#### Scenario: Reference progression supersedes a pair
- **WHEN** later published references make a previously proposed pair ineligible
- **THEN** it disappears naturally from subsequent plans without changing or consulting refusal history

### Requirement: Reference result handoff

A-watch SHALL make its actual plan/result, technical outcome and concerned GitHub run reference available for A-notifications to consume. A-watch SHALL retain discovery, eligibility, forecasting and reference restitution; notification eligibility, message and delivery SHALL remain A-notifications responsibilities. The handoff SHALL NOT prescribe a new API, service or data format or duplicate planning.

#### Scenario: Successful scheduled or manual planning
- **WHEN** either trigger produces a complete plan, including a normal empty plan
- **THEN** the actual plan, success/empty outcome and concerned run reference are available through the producer's reference results, without implementing notification selection or delivery in this Change

#### Scenario: Failed planning
- **WHEN** planning cannot complete successfully
- **THEN** the available result identifies the actual failure and concerned run, without substituting an empty plan or a successful notification input
