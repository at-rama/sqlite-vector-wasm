# Design

## Context

See proposal.md. `observe.mjs` already serves an assembled directory locally, compares its publication record before/after, and runs the existing browser checks under both prefixes. `browser.mjs` checks document source hashes and desktop/mobile navigation; `example.mjs` separately runs the selected archive. The first A-release Change now consumes `assembled.json` with exact subject checks. No second documentation validator is necessary.

## Goals / Non-Goals

Align the documentation qualification contract and guide with this existing artifact check. Preserve all content/example and source-selection behavior. Removing the public workflow job, durable selection and PR orchestration remain other units' responsibilities.

## Decisions

- Reuse local assembled checks unchanged, including the record/commit/digest bindings and the real browser harness. Adding another runner or duplicating the example qualification would add no guarantee.
- Retain optional manual public diagnostics, labelled as observations rather than delivery gates. A successful local check cannot stand in for a missing deployment acknowledgment.
- Update the guide's documentation boundary now; the dependent shell Change updates its workflow/retention sections when implemented. Keep the PR unmerged across this migration.

## Risks / Trade-offs

Public hosting availability is outside artifact qualification. The exact completed deployment remains necessary for the candidate preview; it is not inferred from local serving. Browser harness errors remain blocking. No new dependency, selector or runtime is added.
