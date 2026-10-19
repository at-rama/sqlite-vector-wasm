# Proposal

## Why

Merged A-release and A-updates select SQLite-Vector, while Watch still discovers sqlite-vec and cannot interpret the new preparation handoff. The adopted fixed inclusive Vector discovery floor `1.1.0` now resolves A-watch's remaining design question.

## What Changes

- **BREAKING**: change prospective discovery, candidate identity and actionable plan fields to SQLite-Vector only; read historical sqlite-vec publication provenance without proposing a second current product.
- Fix ordinary Vector discovery at `1.1.0` inclusive, retaining SQLite `3.53.4`; keep these floors distinct from published component references and independent of future pin changes.
- Consume A-release's existing same-engine references, transition/alpha policy and actual publication state, and A-updates' exact Vector run/PR/schema-2 handoff.
- Preserve complete pair enumeration, history exclusions, candidate awareness, compact Summary/forecasts and true empty/error outcomes; supply the existing notification consumer unchanged.
- Align Watch documentation and the optional release-comments drafting helper with native Vector fields and honest historical comparisons; renew read-only and injected evidence.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `upstream-watch`: official Vector discovery/floor, engine-aware publication/candidate reads and eligibility, shared forecasts and human plan parameters.

## Impact

Exactly one realization unit: **A-watch**, in the [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `29cbc8358d52bf1947f445643fe6e15450786752876437ef9fb56f22c0d70cd9`, including all qualified Distribution, Release/Watch and Notifications passages. Base main: `a1ea5e39afb2ca4aa9df5bd138e240d351df8dad` (merged #73). See [coverage](coverage.md).

Expected realization paths: tools/watch discovery/state/plan and tests/fixtures, docs/watch.md, the obsolete pending-Watch note in docs/candidates.md and the optional release-comments skill. Existing run/CLI, schedule and notification envelope are preserved or adjusted only where an exact producer handoff requires it. Notification policy/transport, production inputs, A-inputs/build/package/acceptance, release policy, Updates producer, public Site and synchronized specs are not implemented or changed by this proposition.

The accompanying design-only Capture/Allocation reconciliation records the explicit human validation of the fixed inclusive floor and closes the former question without a new unit. It changes no runtime, pin or published composition and is not implementation evidence. Planning stops here: no Apply, live workflow dispatch, candidate, email, merge, publication or archive.
