# Tasks

## 1. Watch-specific result consumer and sender

- [x] 1.1 Implement the bounded consumer of the existing nested successful record and root failure record, short run-linked message and single Resend request with existing configuration names; verify injected transport observes one request for eligible input and no request for empty/failed input, without planner or candidate reads.
- [x] 1.2 Add offline notification tests covering both triggers, multiple pairs, partial/all existing candidates, repeated identical plans across executions, short content/run link, malformed or unavailable handoff, missing eligible-send configuration, provider rejection, ambiguous network failure and secret-safe diagnostics; verify the notification suite passes with no live send and no automatic retry/history.
- [x] 1.3 Document the sender entry point and operational configuration in `docs/watch.md`, preserving technical planning outcomes and GitHub reference results; verify names match `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`, no deployment values or secret are committed, and statements distinguish provider acceptance from receipt.

## 2. Workflow integration after reference restitution

- [x] 2.1 Add the sender after successful planning and artifact preservation in `watch.yml`, with the existing secret/variables supplied only to that step; add offline workflow/CLI integration cases and verify failed producer/presentation/evidence paths never invoke transport while eligible plans under either trigger invoke it once, without changing the read-only permissions, schedule or producer contract.
- [x] 2.2 Register the mandatory notification suite in `tools/test-repository.sh`; update the Watch guide and obsolete introductory upstream-watch baseline note to reference the new notification capability without modifying its 15 producer requirements or archives; verify the registered command runs the suite, links resolve and documentation matches the implemented boundaries.

## 3. Integrated candidate checks

- [x] 3.1 Re-examine every row of `coverage.md` against the implemented candidate, retain both 100% directions and stop for any semantic revision; verify all five notification requirements have applicable code and scenario evidence without adding another allocation unit.
- [x] 3.2 Stage candidate files, run `sh tools/check-repository.sh`, `sh tools/test-repository.sh` and locked `sh tools/openspec.sh exec validate --all --strict`; verify all applicable results pass and record outcomes for subsequent separately invoked 42P Verification, without claiming live Gmail receipt or product acceptance.
