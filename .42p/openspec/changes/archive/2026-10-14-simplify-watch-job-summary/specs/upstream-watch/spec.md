# Spec Delta

## MODIFIED Requirements

### Requirement: Actionable human job plan

The directly consultable execution summary SHALL contain every eligible pair with exact upstream versions, exact Updates parameters, a GitHub Actions link and existing candidate state. A central Forecast section SHALL associate each pair with its channel/increment/version without repetition in pair blocks or information loss. Pairs SHALL retain their current order under latest and next. The maintainer SHALL remain able to choose zero, one or several jobs. A plan SHALL NOT assert build or publication acceptance.

#### Scenario: Pair has no existing candidate
- **WHEN** a nonempty plan contains an eligible pair without current preparation
- **THEN** its entry supplies exact `sqlite_version`, `sqlite_vec_version`, `release_comment` and the Updates Actions link for human initiation, with no channel/version override

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

### Requirement: Planning stops before preparation

The watch SHALL stop at plan/result production and GitHub restitution, for both scheduled and manual invocation. It SHALL NOT change source pins, acquire/build a candidate, dispatch preparation, create candidate PRs, merge, enable auto-merge, create tags or publish distributions. Manual preparation SHALL remain independent of plan history, and human integration and mandatory acceptance gates SHALL retain their existing roles.

#### Scenario: Successful watch execution
- **WHEN** a watch plan is successfully computed and presented after scheduled or manual invocation
- **THEN** repository, candidate and publication state remain unchanged and no preparation or publication has been initiated

## ADDED Requirements

### Requirement: Reference result handoff

A-watch SHALL make its actual plan/result, technical outcome and concerned GitHub run reference available for A-notifications to consume. A-watch SHALL retain discovery, eligibility, forecasting and reference restitution; notification eligibility, message and delivery SHALL remain A-notifications responsibilities. The handoff SHALL NOT prescribe a new API, service or data format or duplicate planning.

#### Scenario: Successful scheduled or manual planning
- **WHEN** either trigger produces a complete plan, including a normal empty plan
- **THEN** the actual plan, success/empty outcome and concerned run reference are available through the producer's reference results, without implementing notification selection or delivery in this Change

#### Scenario: Failed planning
- **WHEN** planning cannot complete successfully
- **THEN** the available result identifies the actual failure and concerned run, without substituting an empty plan or a successful notification input

## REMOVED Requirements

### Requirement: Native completion notifications

**Reason**: The instituted notification decisions and current Allocation separate A-watch's plan/result production from A-notifications' eligibility, message and delivery. Native completion notifications, including for empty plans, are no longer A-watch's project notification contract.

**Migration**: Keep the directly consultable Summary/artifacts and actual technical outcomes. A separate A-notifications Change will implement the established successful-complete-nonempty, one-mail-per-execution rule and retained Resend transport after Summary simplification. GitHub account-driven notifications remain outside scope; no account preferences are changed and no delivery is claimed here.
