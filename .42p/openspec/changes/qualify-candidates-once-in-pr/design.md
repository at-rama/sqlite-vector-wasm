# Design

## Context

See proposal.md. Acceptance already implements all production/browser controls, Release's qualify composes them with deterministic identity, and Site consumes qualified bundles. Updates currently calls that qualifier before opening a PR; Release's exercise repeats production for tooling PRs. Existing required acceptance now depends on reusable Site.

## Goals / Non-Goals

Relocate orchestration while leaving the mandatory product matrix and definitive Release qualification intact. No shared framework, new runtime, test relaxation or publication invocation is needed.

## Decisions

- Add one Acceptance-owned PR producer around the existing Release qualifier. Nominal release PRs consume their schema-2 descriptor and live read-only policy state; tooling PRs retain an explicitly identified nonpublishing fixture forecast. Both use the exact PR head and actual Vector lock, complete acceptance and exact-byte handoffs.
- Pass the named same-run candidate artifact to Site through needs and workflow_call input. Site validates extracted acceptance/archive/commit data and executes the documentation example once. Remove polling and the Release PR exercise. Preserve manual caller-supplied acceptance and published documentation-only builds.
- Move the existing dispatch qualification invocation to this producer, including the narrow preparer handoff needed to open an explicitly pending PR. The companion A-updates Change owns presentation/source-preparation refinements and removes obsolete qualification-specific API/tests. This necessary producer relocation does not alter source/notice/version policy or add preparation authority.
- Release review reads the identified same-run PR qualification artifact and Site report, with exact head/archive/example checks. Existing historical direct-Site/Updates evidence remains distinguishable for already prepared candidates, not a success fallback for a missing new artifact. Durable post-publication consumers continue to use Release receipts.
- Remove automatic main Acceptance and PR Release production; definitive merge revision/version/archive still undergo the complete Release path. Required failed/missing artifacts remain blocking. Short-lived review artifacts are consumed before publication; the final manifest retains the reviewed/final proof and future stable redeployments require no Actions artifacts.

## Risks / Trade-offs

PR workflow approval for bot-created PRs remains a native human prerequisite; no new secret/automatic approval is added. Expired review evidence before integration/publication requires renewing the applicable open-PR checks; it cannot be waived. After publication the durable Release is sufficient for stable redeployment. The producer and preparer contracts are proposed together and must leave the working PR unmerged until both are verified.
