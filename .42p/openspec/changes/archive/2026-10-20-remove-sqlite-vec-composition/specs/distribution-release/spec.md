
## REMOVED Requirements

### Requirement: Shared deterministic calculation

**Reason**: The retained sqlite-vec capability or caller convention is removed under the proposed cleanup amendment; the complete replacement retains unrelated obligations.

**Migration**: Use the current SQLite-Vector path described by "Vector-only shared deterministic calculation". No old-engine compatibility mechanism or separate consumer migration guide is supplied.

## ADDED Requirements

### Requirement: Vector-only shared deterministic calculation

Watch forecasts, dispatch, preparation and publication SHALL consume one shared calculation based on exact upstream selections, actual engine identities and publication state. New product publication SHALL select SQLite-Vector only. Only read-only historical publication interpretation SHALL retain sqlite-vec identities required by current state, transition and uniqueness rules; current selection/calculation/qualification SHALL reject sqlite-vec and supply no legacy caller compatibility. Identical inputs and state SHALL return identical channel/version results without AI. Forecasts SHALL reserve no identity; different forecast/final results SHALL be explained by changed inputs or state.

#### Scenario: Same calculation across consumers
- **WHEN** different consumers supply the same selected pair and published references
- **THEN** they receive the same channel, numerical signal and distribution version without independent numbering policies

#### Scenario: Publication state changes after forecast
- **WHEN** a candidate's forecast precedes another relevant publication
- **THEN** publication recalculates against actual state rather than treating the forecast as a reservation

#### Scenario: Current selection versus historical reference
- **WHEN** an old-engine selection is supplied to current calculation, preparation or qualification, or an actual historical publication is read as a reference
- **THEN** the selection is rejected, while the validated historical reference retains its exact source/engine identity and transition, channel and collision effects without enabling new old-engine production
