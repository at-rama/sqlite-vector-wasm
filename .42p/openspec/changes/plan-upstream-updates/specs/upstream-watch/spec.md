# Spec Delta

## Purpose

Realize A-watch by presenting eligible official upstream combinations and current candidate state in a deterministic weekly email plan, leaving preparation and adoption under human control.

## ADDED Requirements

### Requirement: Official released upstream discovery

The watch SHALL discover exact published stable and prerelease versions from SQLite's official Fossil publications and sqlite-vec's official GitHub Releases, applying A-inputs' admissibility criteria. Drafts, development snapshots and ambiguous release identities SHALL NOT be treated as releases. Exact suffixes SHALL be preserved; source uncertainty SHALL NOT be silently converted into a complete inventory.

#### Scenario: Stable and experimental publications
- **WHEN** official published versions have unambiguous admissible identities, including alpha, beta or release-candidate suffixes
- **THEN** discovery retains their exact identities and maturity for subsequent pair enumeration

#### Scenario: Official host contains a development snapshot
- **WHEN** an upstream branch, draft or development snapshot is visible on an official service
- **THEN** its hosting alone does not make it an admissible published release or authorize a fabricated prerelease identity

#### Scenario: Discovery cannot establish its inventory
- **WHEN** a required source is unavailable, truncated, contradictory or exposes an unresolved release identity
- **THEN** the watch reports unsuccessful discovery without presenting the result as an empty or complete plan

### Requirement: Ordinary discovery baselines

Ordinary planning SHALL include only SQLite versions at least `3.53.4` and sqlite-vec versions at least `0.1.9`, compared with prerelease ordering. These discovery baselines SHALL NOT change manual preparation's ability to select older admissible inputs or explicit rollback.

#### Scenario: Versions around the baseline
- **WHEN** discovery includes sqlite-vec `0.1.9-alpha.1`, `0.1.9` and `0.1.10-alpha.1`
- **THEN** ordinary planning excludes the first and retains the latter two for eligibility assessment

#### Scenario: Manual older selection
- **WHEN** the maintainer dispatches an admissible pair below an ordinary watch baseline
- **THEN** the watch's discovery limits supply no dispatch prohibition or mandatory watch-history prerequisite

### Requirement: Coherent publication references

The watch SHALL read Git distribution tags, scoped npm versions, published provenance and separate `latest`/`next` HEADs using A-release's state interpretation. Historical published compositions SHALL remain available for selection exclusions. Required unavailable or inconsistent state SHALL fail rather than become empty history; placeholder metadata SHALL supply no distribution reference.

#### Scenario: Complete channel state
- **WHEN** published Git/npm identities and provenance are coherent
- **THEN** planning uses their exact upstream compositions, channel references and occupied identities

#### Scenario: Inconsistent or incomplete publication state
- **WHEN** a required page or provenance is unreadable, a HEAD conflicts with its publication or npm contains only an unready placeholder
- **THEN** planning fails without inventing a bootstrap reference or claiming no work exists

### Requirement: Stable pair eligibility

For `latest`, the watch SHALL enumerate stable-only pairs strictly later than its published pair component by component: neither component regresses and at least one progresses. A more advanced `next` SHALL NOT block stable maintenance. Enumeration SHALL consider combinations, including eligible pairs containing no newly discovered individual version.

#### Scenario: Stable maintenance alongside next
- **WHEN** `latest` is `(3.54.0, 0.1.9)`, `next` is more advanced and stable `(3.54.1, 0.1.9)` is available
- **THEN** the stable pair remains eligible subject to published-pair exclusion

#### Scenario: One component regresses
- **WHEN** a stable pair increases sqlite-vec but decreases SQLite relative to `latest`
- **THEN** it is excluded from ordinary stable planning

#### Scenario: Existing versions form new work
- **WHEN** already known individual versions form an unpublished eligible pair
- **THEN** that pair is considered without requiring a newly detected upstream release

### Requirement: Experimental pair eligibility

For `next`, the watch SHALL enumerate pairs containing a prerelease that strictly progress component by component from its HEAD and are at least as recent as `latest` on both components. Without a `next` publication, `latest` SHALL supply the initial comparison reference. Eligibility SHALL preserve suffix ordering independently of numerical forecast increments.

#### Scenario: Next is behind latest on one component
- **WHEN** `latest=(3.54.0, 0.1.9)`, `next=(3.53.5, 0.1.10-alpha.1)` and `(3.53.6, 0.1.10-alpha.2)` is available
- **THEN** the pair is excluded despite progression from `next`, because SQLite remains behind `latest`

#### Scenario: Several experimental pairs are eligible
- **WHEN** those references apply and `(3.54.0, 0.1.10-alpha.1)` and `(3.54.0, 0.1.10-alpha.2)` are available
- **THEN** both pairs remain candidates for the plan rather than only the newest alpha

#### Scenario: Next has not been published
- **WHEN** coherent state has `latest` and no `next`
- **THEN** an experimental pair is compared component by component against `latest` before its shared forecast is calculated

### Requirement: Published pair exclusion

The watch SHALL exclude a pair already published in the corresponding status, using published composition history rather than only current HEADs. Stable and experimental references SHALL remain distinct. Publication version changes without composition changes SHALL NOT make the same pair newly eligible for ordinary watch planning.

#### Scenario: Rollback reveals an earlier published pair
- **WHEN** a manual rollback moves a channel HEAD behind a pair already published in that status
- **THEN** that historical pair is not proposed again merely because it is newer than the current HEAD

#### Scenario: Several distributions carry the same composition
- **WHEN** a packaging correction publishes another version with the same upstream pair
- **THEN** both publications establish the same pair exclusion without creating extra upstream jobs

### Requirement: Current candidate awareness

For each eligible pair, the watch SHALL identify current queued/running preparation and open candidate PRs, preserving exact selection and run/PR links. Existing candidates SHALL be signaled without suggesting duplicate preparation. Several existing candidates SHALL remain distinguishable. Candidate reads SHALL NOT merge, update, cancel or dispatch anything.

#### Scenario: Preparation precedes its PR
- **WHEN** an Updates preparation is queued or active for an eligible pair and has no PR yet
- **THEN** the plan identifies that preparation and its run link instead of presenting the pair as having no candidate

#### Scenario: Existing candidate PR
- **WHEN** an open candidate PR's exact head descriptor establishes the eligible pair and its preparation identity
- **THEN** its link and state appear on that pair's plan entry without a suggested duplicate launch

#### Scenario: Candidate selection cannot be established
- **WHEN** relevant candidate metadata is unavailable or contradicts the descriptor or repository identity
- **THEN** the watch reports the unresolved read rather than falsely declaring no existing candidate

### Requirement: Shared nonreserving forecasts

Each eligible pair SHALL use A-release's common deterministic calculation for channel, increment and distribution version from the same acquired publication state. The watch SHALL add no numbering override, alternative policy, AI heuristic or reservation. Changed later state SHALL permit changed final results; watch forecasts SHALL NOT waive publication or compatibility controls.

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

The email SHALL contain every eligible pair with exact upstream versions, forecast channel/increment/version, exact Updates workflow parameters, a GitHub Actions link and existing candidate state when present. The maintainer SHALL remain able to choose zero, one or several jobs. A plan SHALL NOT assert build compatibility or publication acceptance from discovery or forecasting alone.

#### Scenario: Pair has no existing candidate
- **WHEN** a nonempty plan contains an eligible pair without current preparation
- **THEN** its entry supplies exact `sqlite_version`, `sqlite_vec_version`, `release_comment` and the Updates Actions link for human initiation, with no channel/version override

#### Scenario: Pair already has preparation
- **WHEN** an eligible pair has an active run or open candidate PR
- **THEN** the entry presents those references and states without recommending a duplicate dispatch

### Requirement: Conditional Gmail delivery

The watch SHALL send a nonempty computed plan through Gmail SMTP to the privately configured recipient, using the privately selected same account as sender. A complete successfully computed empty plan SHALL send no email. SMTP configuration or delivery failure for a nonempty plan SHALL remain unsuccessful; no notification issue or silent alternate transport SHALL replace delivery.

#### Scenario: Empty successful plan
- **WHEN** complete discovery and state reads yield zero eligible entries
- **THEN** the run reports an empty plan and performs no SMTP connection or email send

#### Scenario: Nonempty plan
- **WHEN** a complete plan contains one or more entries and mail configuration is usable
- **THEN** it is sent as one job-plan email and the outcome records SMTP acceptance without claiming recipient inbox delivery

#### Scenario: Mail fails
- **WHEN** a nonempty plan cannot authenticate or be accepted by Gmail SMTP
- **THEN** the run fails with sanitized diagnostics and retains no complete-delivery claim or automatic issue fallback

### Requirement: Private mail configuration

Real mail addresses and SMTP credentials SHALL remain in GitHub Actions secrets and SHALL NOT enter tracked documents/configuration, public logs, job summaries or artifacts. Planning evidence SHALL contain only nonsecret operational results. The GitHub noreply commit identity SHALL NOT substitute for the actual mail account or recipient.

#### Scenario: Public repository and diagnostics
- **WHEN** configuration, a successful run or a failed mail operation is inspected publicly
- **THEN** only secret names and sanitized results are exposed, without real address values, passwords or raw SMTP diagnostics

### Requirement: Weekly Paris schedule

The watch SHALL run through GitHub Actions each Friday with a scheduled time of 08:00 in `Europe/Paris`, respecting daylight-saving changes. Scheduling deactivation through repository inactivity SHALL be accepted and reactivated manually. No keepalive, repository write or alternate scheduler SHALL be introduced to prevent deactivation.

#### Scenario: Winter and summer scheduling
- **WHEN** Paris switches between winter and summer time
- **THEN** the configured scheduled time remains Friday 08:00 Paris time rather than a fixed UTC hour

#### Scenario: Inactivity deactivation
- **WHEN** GitHub disables the scheduled workflow through inactivity
- **THEN** reactivation remains manual without a keepalive commit or automated reactivation mechanism

### Requirement: Planning stops before preparation

The watch SHALL stop at the plan and email. It SHALL NOT change source pins, acquire/build a candidate, dispatch preparation, create candidate PRs, merge, enable auto-merge, create tags or publish distributions. Manual preparation SHALL remain independent of plan history, and human integration and mandatory acceptance gates SHALL retain their existing roles.

#### Scenario: Successful watch execution
- **WHEN** a watch plan is successfully computed and emailed
- **THEN** repository, candidate and publication state remain unchanged and no preparation or publication has been initiated

### Requirement: Stateless deterministic operation

Nominal discovery, selection and forecasting SHALL operate deterministically without AI. The watch SHALL use official upstream state, published references/history and current candidates, introducing no refusal registry, persistent proposal/delivery history, version reservation, application lock, second version domain or permanent distribution branch.

#### Scenario: Eligible pair is not selected
- **WHEN** the maintainer does not launch a proposed eligible pair and the relevant state stays unchanged
- **THEN** the pair remains proposable on the next weekly plan without a refusal record

#### Scenario: Reference progression supersedes a pair
- **WHEN** later published references make a previously proposed pair ineligible
- **THEN** it disappears naturally from subsequent plans without changing or consulting refusal history
