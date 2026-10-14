# Design

## Context

See `proposal.md` for motivation and the Allocation identity. The current `watch.yml` runs `sh tools/watch.sh` and then preserves `.work/watch/` with an `always()` artifact step. `runWatch` writes the Summary before evidence and returns a failure for errors in discovery, state, calculation, presentation or evidence. The CLI makes failures technically unsuccessful.

Successful `result.json` records contain `plan.outcome` (`nonempty` or `empty`) and `plan.entries`; failed records instead have root `outcome: failed`. `makePlan` produces `nonempty` only after the required discovery/state/calculation work, and successful CLI completion also covers presentation/evidence. The run reference is supplied by the Actions invocation. The existing upstream-watch requirements already describe this handoff. Its introductory notification baseline note still mentions a retired requirement absent from the current requirement set; documentation must reconcile that note without revising producer obligations or historical archives.

## Goals / Non-Goals

**Goals:** Add a small Watch-specific result consumer and sender using native Node.js facilities and the existing workflow. Keep producer execution, reference evidence and transport errors distinguishable.

**Non-Goals:** A new scheduler, workflow, result schema, completeness flag, general service, delivery ledger or planner. No new third-party runtime package is needed.

## Decisions

### Consume the existing successful handoff

Add a notification step after successful planning and artifact preservation, guarded by normal step success. Read `.work/watch/result.json` and select `plan.outcome === 'nonempty'` from a valid successful record. Do not treat an absent, malformed or contradictory record as eligible; surface an operational error without sending. An empty or failed record sends nothing. Do not inspect candidates or filter by event type. A separate workflow would add orchestration and retrieval without a second case to justify it; reading the current result is sufficient. A second `complete` flag would duplicate the successful producer contract.

### Bounded sender and short text

Use Watch-specific glue, for example `tools/watch/notify.mjs` with a narrow CLI entry point if required for test injection. Construct a short subject and plain text availability message containing the concerned Actions run URL; a count derived from `plan.entries.length` is optional. Do not list pairs, forecasts, candidate state or diagnostics. Construct the URL from the current Actions server, repository and run identity, not from candidates or external input links.

Use native Node.js HTTP facilities to call Resend's email API once per eligible execution. Keep the eligibility/message functions testable with injected transport; use no SDK dependency, retry loop, automatic resend, idempotency ledger or cross-run state. The instituted single-message rule is a per-execution rule, not a guarantee of transactional exactly-once transport under network failure.

### Existing deployment names and technical failure behavior

Only the sender step receives `RESEND_API_KEY` from the existing secret and `RESEND_FROM`/`RESEND_TO` from repository variables. Check required configuration only after selecting an eligible result, so silence for empty/error plans does not depend on Resend configuration. No aliases or committed address values are needed. The user reports the configuration prepared; this planning workflow neither reads the secret nor claims hosted delivery.

For missing eligible-send configuration, request failure or provider rejection, fail the sender step with a bounded nonsecret diagnostic. Keep the producer's successful result and Summary intact. This is an operational realization choice preserving actual statuses, not a new notification rule: do not send an error email or add a fallback channel. Do not print credentials or raw provider response bodies. Avoid retries because ambiguous acceptance could produce duplicate mail; a timeout/request bound is an implementation safeguard, not a product delivery SLA.

## Risks / Trade-offs

- Provider acceptance does not prove Gmail receipt or Android notification → distinguish offline request evidence, provider acceptance and any later live receipt; do not claim receipt from a mocked send.
- A network failure can leave acceptance unknown → stop with an operational failure, without automatic resend or stored history. No transport deduplication guarantee is instituted.
- Producer and consumer share repository-authored assumptions → test the actual successful nested record and failed root record through the CLI boundary, alongside workflow ordering and failure guards.
- Hosted configuration is supplied but unverified → validate deployment names and fail clearly for eligible sends with unusable configuration; keep configuration values outside the specification.

## Migration Plan

Implement only after a new Apply request and the recorded 100% bidirectional coverage gate. Add the sender and offline tests, update the Watch guide and obsolete introductory baseline note, then perform the three post-Apply Verification controls and archive through their separate workflows. Human integration remains required. No live Watch dispatch or mail is part of planning; any later delivery observation must identify its actual execution and evidence. Reverting the bounded sender integration restores the prior dedicated-sender absence without changing the planner or schedule.
