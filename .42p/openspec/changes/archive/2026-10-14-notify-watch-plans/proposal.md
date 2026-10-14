# Proposal

## Why

Watch now provides a compact reference Summary but has no project-controlled sender. Realize the instituted notification rule so each successful complete nonempty plan produces one short Resend email pointing to its GitHub run.

## What Changes

- Consume Watch's actual result and technical success; notify for complete nonempty plans, including entries with existing preparations or PRs, identically for scheduled and manual executions.
- Send one fresh short plan email per eligible execution through Resend to the configured Gmail recipient; keep plan details and diagnostics in GitHub.
- Preserve silence for empty plans and planning failures, with no notification history, cross-execution deduplication or additional notification cases.
- Integrate after the existing Summary/result production without duplicating discovery, candidate inspection or forecasts.

## Capabilities

### New Capabilities

- `watch-plan-notifications`: Watch-result notification eligibility, short run-linked message and Resend delivery.

### Modified Capabilities

None. The current `upstream-watch` contract already separates producer responsibilities and the result handoff; its 15 requirements need no revision. Historical notification contracts remain in their archives.

## Impact

The planned implementation affects `.github/workflows/watch.yml`, bounded notification glue and offline tests, their registration in `tools/test-repository.sh`, and `docs/watch.md`. No package API or runtime dependency is needed. Deployment uses the existing `RESEND_API_KEY` secret and `RESEND_FROM`/`RESEND_TO` repository variables; their values are deployment configuration, not product requirements.

This Change realizes exactly `A-notifications` from [the current Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `ed381776c7b45d559640174b66155947f9c2ec1537a6896ab24a539c660e441e`, at base commit `36f21e86d9fbede24a5c5dbd8757eb451ceaae70`. Its instituted sources are projected in Notifications `C-status`, `C-summary`, `C-noise`, `O-resend`, `C-trigger` and the scoped Distribution/Release-Watch notification portions selected by that unit. Summary-first sequencing is satisfied by the archived `2026-10-14-simplify-watch-job-summary` Change and its passing verification; this does not establish sender realization. The bidirectional planning coverage gate is recorded in `coverage.md` before Apply.
