# Proposal

## Why

Manual candidate preparation and distribution calculation already exist, but the maintainer has no weekly view of eligible upstream combinations and candidates already being prepared. Realize `A-watch` as a deterministic emailed job plan, leaving selection, dispatch and integration with the maintainer.

## What Changes

- Discover exact official published SQLite and sqlite-vec stable/prerelease identities from their designated sources, starting at SQLite `3.53.4` and sqlite-vec `0.1.9`, under A-inputs' admissibility criteria.
- Read coherent published channel references, historical published compositions and current candidates; enumerate all eligible pairs component by component, without a refusal registry or newest-only shortcut.
- Consume A-release's existing calculation for channel, increment and forecast version. Plans reserve nothing and initiate no candidate preparation.
- Email each nonempty plan through Gmail SMTP, with exact versions, Updates parameters/links and existing candidate state. A successfully computed empty plan sends no email; incomplete reads or delivery failures remain failures.
- Schedule planning each Friday at 08:00 in `Europe/Paris`, including seasonal time changes. Accept inactivity deactivation with manual reactivation and no keepalive.
- Keep mail addresses and authentication in GitHub Actions secrets, outside public documents, logs and artifacts. The privately selected Gmail account is both sender and recipient; public planning records contain no address value.
- Expose the selected pair in a fixed Updates run name so A-watch can identify queued/running preparation before a PR exists. This is observational metadata serving A-watch, not a new preparation policy or dispatch restriction.

## Capabilities

### New Capabilities

- `upstream-watch`: official upstream discovery, pair eligibility, existing-candidate awareness, shared forecasts and weekly conditional email planning.

### Modified Capabilities

None. `upstream-inputs`, `distribution-candidates` and `distribution-release` remain dependencies with unchanged behavioral contracts. The supporting run-name adjustment changes only how existing preparation state is exposed.

## Impact

Realization will add tooling under `tools/watch/`, a thin `tools/watch.sh` entry point, `.github/workflows/watch.yml`, contributor setup documentation and relevant automated suites. It will make the bounded run-name addition in `.github/workflows/updates.yml`. Existing policy/state helpers will be consumed without weakening publication checks; no source pins, runtime/package behavior, publisher, 42P canon or archived evidence are changed by this Proposition. GitHub reads require only read permissions; email is the watch's sole external write.

This Change realizes exactly `A-watch` from [the current global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`, read at `8e9de3c42334e12eb065440b4155aad06391ff27`. Its qualified Distribution and Release/Watch passages are mapped in [coverage](coverage.md). Allocation and Captures are projections; their instituted sources retain authority.

The primary user decisions in this project's A-watch exploration of 2026-10-12/13 select no email for an empty plan, Friday 08:00 Paris time and private mail configuration. No public conversation permalink is available. These resolve notification/scheduling realization choices inside A-watch; they authorize planning, not implementation, secret setup or a delivery experiment. The prior assistant recommendations supply realization context, not independent design authority.

This PR contains planning artifacts only. Apply, post-Apply Verification, synchronization and archive are pending; no implementation or passing Verification report is claimed. Repository merge gates require later successful Verification and archive, so the planning branch is not ready for integration into `main`.
