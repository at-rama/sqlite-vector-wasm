# Proposal

## Why

Manual candidate preparation and distribution calculation already exist, but the maintainer has no weekly view of eligible upstream combinations and candidates already being prepared. Realize `A-watch` as a deterministic directly consultable job plan, leaving selection, dispatch and integration with the maintainer.

## What Changes

- Discover exact official published SQLite and sqlite-vec stable/prerelease identities from their designated sources, starting at SQLite `3.53.4` and sqlite-vec `0.1.9`, under A-inputs' admissibility criteria.
- Read coherent published channel references, historical published compositions and current candidates; enumerate all eligible pairs component by component, without a refusal registry or newest-only shortcut.
- Consume A-release's existing calculation for channel, increment and forecast version. Plans reserve nothing and initiate no candidate preparation.
- Present the plan in the GitHub Actions execution summary, with exact versions, Updates parameters/links and existing candidate state. Nonempty plans, normal empty plans and explicit failures have readable results without raw-log inspection; errors never become fabricated empty plans. Use native completion notifications within GitHub capabilities and account preferences, with no guaranteed push/format or dedicated transport.
- Schedule planning each Friday at 08:00 in `Europe/Paris`, including seasonal time changes. Accept inactivity deactivation with manual reactivation and no keepalive.
- Permit manual `workflow_dispatch` of A-watch independently of the cron, using the same discovery, eligibility and forecast policy. This only recalculates/presents the plan; it never dispatches the separate Updates candidate-preparation workflow.
- Expose the selected pair in a fixed Updates run name so A-watch can identify queued/running preparation before a PR exists. This is observational metadata serving A-watch, not a new preparation policy or dispatch restriction.

## Capabilities

### New Capabilities

- `upstream-watch`: official upstream discovery, pair eligibility, existing-candidate awareness, shared forecasts and weekly/manual plan presentation and native notification integration.

### Modified Capabilities

None. `upstream-inputs`, `distribution-candidates` and `distribution-release` remain dependencies with unchanged behavioral contracts. The supporting run-name adjustment changes only how existing preparation state is exposed.

## Impact

Realization will add tooling under `tools/watch/`, a thin `tools/watch.sh` entry point, `.github/workflows/watch.yml`, contributor setup documentation and relevant automated suites. It will make the bounded run-name addition in `.github/workflows/updates.yml`. Existing policy/state helpers will be consumed without weakening publication checks; no source pins, runtime/package behavior, publisher, 42P canon or archived evidence are changed by this Proposition. GitHub source/state reads require only read permissions; the watch presents its own execution result using native Actions mechanisms and mutates no candidate or publication state.

This Change realizes exactly `A-watch` from [the current global Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `e6a518b8b9c7f957ba222164a091873e4b6cd0af60cfc054a110f2e48cc52dfc`, reconciled on the existing PR #44 from revision `2b5edf80d76af6d83e0edc2d6d23b0824d42c20b` under the 2026-10-13 mission. Its qualified Distribution and Release/Watch passages are mapped in [coverage](coverage.md). Allocation and Captures are projections; their instituted sources retain authority.

The instituted user decision of 2026-10-13, “Mission — Réconciliation documentaire A-watch et révision de la PR #44”, replaces the earlier Gmail/conditional-email orientation with summary consultation and native completion notifications, accepts notifications for empty plans and requires independent manual planning. Friday 08:00 Paris time and all selection/authority boundaries are retained. `S-watch-native` in both Captures records that bounded supersession and the retrievable earlier orientation; no public conversation permalink is available. That mission authorized documentary reconciliation only. The subsequent explicit user instruction `/openspec-apply PR #44` on 2026-10-13 authorizes Apply from the actual PR state on the same branch; integration and publication remain distinct human decisions.

This PR contains the initial A-watch implementation and historical Apply correspondence in [coverage](coverage.md). Post-Apply [Verification](verification.md) failed at `c5ee5c313948bb8b23de5815f07ba9bace9c1dc1`: conflicting Release resource identities (F1) and conflicting preparation run/attempt selections (F2) were accepted. The current documentary revision, from PR head `a02e3dd738a1915d776aac95843b7f84697c452a`, refines reader identity checks, run-to-PR joining and regression cases in the existing design/tasks; five tasks are reopened. The delta requirements, Allocation and other responsibilities remain unchanged. That documentary update implemented no correction. The subsequent `/openspec-apply PR #44` invocation authorized corrective Apply from `77cd09529a45fdd58337b996c92cd66fa9cdd584`; corrections and regression tests are committed at [606747a](https://github.com/at-rama/sqlite-vector-wasm/commit/606747ac2e4c339ea10e42ac24c01ca7f3ec191c), with 17/17 tasks now checked and fresh Apply evidence in [coverage](coverage.md#corrective-apply-correspondence-and-observed-checks). Renewed Verification, synchronization and archive remain pending. The failed report remains bound to its original candidate. This branch remains a draft and is not ready for integration into `main`.
