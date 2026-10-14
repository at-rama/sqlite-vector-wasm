# Proposal

## Why

A-watch's current Summary repeats explanatory paragraphs, the Updates link and three parameter lines for each eligible pair. Simplifying that reference result is the instituted first step before notification integration, while keeping the complete actionable plan directly readable in GitHub.

## What Changes

- Present the actual outcome first and use compact vertical entries for every eligible pair, with shared instructions and forecast caveats stated once.
- Preserve exact upstream versions, forecast channel/increment/version, exact Updates parameters and workflow link, every existing preparation/PR identity and state, and the published reference context. No required plan information moves exclusively to an artifact.
- Preserve normal successful empty plans, explicit failed-stage diagnostics and unsuccessful errors, for scheduled and manual executions alike.
- Reconcile the `upstream-watch` contract with the instituted responsibility split: A-watch owns results and their GitHub restitution; A-notifications will consume the actual result, outcome and concerned run reference. Remove the superseded native-notification requirement from this capability without implementing notification eligibility or delivery.
- Retain discovery, eligibility, shared calculation, scheduling and human preparation/integration boundaries as A-watch invariants.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `upstream-watch`: simplified complete reference restitution, honest outcomes, producer handoff and planning-only boundary; retire the superseded native-notification obligation.

## Impact

Realizes exactly `A-watch` from the [current global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), read at commit `089e6d994f302adf36461521ad1157151025b8d8`. The exact Allocation/Capture snapshots, selected passages, retained requirements and bidirectional correspondence are recorded in [coverage](coverage.md).

Expected implementation surfaces are `tools/watch/plan.mjs`, its presentation tests, orchestration tests and `docs/watch.md`; `tools/watch/run.mjs` only if arranging existing execution context requires it. Existing `.work/watch/result.json` and the workflow artifact remain the technical record. No new dependency, result schema, notification service or workflow trigger is needed. A-inputs/A-release/A-updates remain dependency owners; this Change must not substitute a local policy for them.

Propose produced planning artifacts only. The separately requested Apply is recorded in [coverage](coverage.md#apply-correspondence-and-observed-checks). Post-Apply 42P Verification and Archive require their subsequent workflows; the active Change cannot yet pass those merge gates. Historical archives and cumulative specs remain unchanged during Propose and Apply. A separate A-notifications Change will implement the already instituted notification rule and transport after Summary simplification.
