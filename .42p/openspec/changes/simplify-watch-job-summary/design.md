# Design

## Context

See [proposal](proposal.md) for scope and motivation and [delta](specs/upstream-watch/spec.md) for changed behavior. At the selected main revision, `makePlan` produces structured entries and `renderPlan` produces Markdown in `tools/watch/plan.mjs`. `runWatch` appends invocation/revision/runtime/observation context and writes the existing result record. `.github/workflows/watch.yml` uploads `.work/watch/` even after failure. Discovery, publication/candidate reads and shared forecasting already have separate tests.

Design is included because the new presentation is deliberately unspecified upstream and needs a concrete, reviewable choice before coding. The choices below implement simplification; they introduce no new product requirement or notification protocol.

## Goals / Non-Goals

**Goals:** reduce repeated prose while keeping every job actionable in the Summary, preserve distinct preparations and exact identities, and expose actual outcomes and reference context in an order useful to a reader.

**Non-Goals:** change discovery/selection or A-release's policy; create truncation, ranking, newest-only selection, pagination or a new result schema; implement a mail sender or eligibility filter; change scheduling, account preferences or human preparation/integration boundaries. A dependency mismatch must be reported to its owner, not fixed by a Watch-local policy.

## Decisions

### 1. Reuse the planner and render compact vertical entries

Keep `makePlan` and the entry order unchanged. Replace repetitive per-pair paragraphs in `renderPlan` with channel sections and one short block per pair. Vertical blocks keep exact versions and candidate details readable on narrow screens; a wide table would combine too many long fields. A table, interactive UI or separate artifact-only plan adds no needed capability.

The opening identifies nonempty work, normal empty success or failed planning. For a nonempty result, show the jobs before the technical reference context. Keep the shared forecast caveat and human action instructions once, close to the entries, without suggesting qualification or reservation. No entry count limit, heuristic, filtering or hiding of candidate-backed entries is introduced.

Each pair block states the exact input names/values and forecast, with candidate references if present. The common instruction explicitly states `release_comment = ""` for all displayed jobs, the absence of channel/version override inputs, and links to Updates once. This binding must be unambiguous for every entry. Do not add a ready-to-copy `gh` command: it remains optional upstream and is unnecessary for this simplification.

Illustrative content only, using synthetic identities and a placeholder candidate locator:

```markdown
# Upstream job plan

Forecasts are independent and unreserved; discovery does not qualify a build or publication.
Choose zero, one or several jobs in [Updates](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/updates.yml).
Use each entry's exact inputs below and release_comment = ""; no channel/version override.

## latest

### SQLite 3.54.1 × sqlite-vec 0.1.9
sqlite_version: 3.54.1 · sqlite_vec_version: 0.1.9
Forecast: 0.1.1 · PATCH · latest
Preparation: none; a separate human action can start this job.

## next

### SQLite 3.54.0 × sqlite-vec 0.1.10-alpha.1
sqlite_version: 3.54.0 · sqlite_vec_version: 0.1.10-alpha.1
Forecast: 0.2.0-alpha.2 · PATCH · next
Existing preparation: [candidate run/PR link and actual state]. Do not start a duplicate.

## Reference state
latest/next publication identities, exact compositions and revisions; absent next if applicable.
Partial occupied identities when present; invocation and observation context.
```

An actual candidate block retains every currently supplied detail: run identity/attempt/state/link; PR number/state/link, preparation link/attempt/head, and joined active-attempt state when present. Several candidates remain separate, including candidates belonging to the same pair. Actual values come from the acquired result; the sketch does not establish a forecast or a live candidate.

### 2. Keep required facts in the Summary and detailed evidence in the existing artifact

Published channel references, their exact upstream compositions/revisions, partial occupied identities and existing invocation/observation context remain consultable in the Summary. Reorder them into a short final reference section; do not strip them or replace them with a download requirement. Keep `.work/watch/result.json` and the uploaded artifact's existing content/schema. Collapsible details are unnecessary at this scale and risk hiding information; compact prose is sufficient.

The existing artifact contains technical context, inventory, publication/candidate state and plan. The Actions run itself supplies the concerned run reference. These existing producer surfaces satisfy the responsibility handoff without a new API or transport abstraction. Do not add notification criteria to `makePlan`/`runWatch`; the future consumer uses the actual result and run context.

### 3. Preserve technical outcomes and failure handling

Reuse `renderFailure`, `diagnostic` and existing failure propagation. An empty plan remains successful only after complete reads/calculation. Errors preserve the failed stage and sanitized diagnostic, including output/evidence-write failures; no partial successful plan substitutes for them. Keep escaping and link validation when restructuring Markdown. Scheduled/manual invocation changes execution metadata only; identical observed state yields the same entries and forecasts.

### 4. Reconcile only the A-watch contract

The delta modifies the three presentation/boundary requirements, adds the allocated producer handoff and removes the explicitly superseded native-notification requirement. The other eleven requirements in the cumulative `upstream-watch` spec remain part of this Change's A-watch realization basis, traced in [coverage](coverage.md). Existing implementation is reused for those invariants, not newly certified by drafting them.

Do not copy or alter historical archives. During later authorized synchronization/Archive, revise the capability's notification status note to identify A-watch's reconciled producer contract and the still-pending A-notifications realization. Synchronization must not imply mail delivery. Propose leaves the cumulative spec unchanged.

## Risks / Trade-offs

- Shared instructions could make per-job parameters ambiguous → state their binding explicitly and test exact pair values, the empty comment and the single workflow link against the source plan.
- Concision could conceal distinct candidates or empty/error conditions → retain all candidate details and exercise multiple candidates, all-candidate plans, empty results and each failure class.
- Markdown restructuring could weaken escaping → retain escaping/link validation and hostile diagnostic cases; review a representative long-suffix/multiple-candidate Markdown rendering.
- The cumulative spec and archives retain older authority snapshots; A-release owns the newer stable-derived alpha-base refinement → preserve the shared calculator dependency and verify Watch uses its actual results. This Change does not certify or revise A-release's complete policy; any dependency nonconformity required for A-watch must stop Apply/Verification and be escalated rather than waived.
- A shorter Summary can still be long with many eligible pairs → preserve completeness; no new limit or paging policy is justified by the current allocation.

## Migration Plan

After a separately requested Apply, update the renderer and tests, then the Watch reading guide. No persisted state migration, new package or dependency installation is needed. Compare representative outputs before/after against the unchanged plan values and run the applicable checks. Complete 42P Verification before Archive and human integration. A renderer-only rollback restores previous presentation without changing plan semantics or artifacts; contract revisions still follow the existing lifecycle.
