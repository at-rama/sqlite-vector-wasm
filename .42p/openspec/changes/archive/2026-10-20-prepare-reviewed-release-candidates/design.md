# Design

## Context

Allocation: `A-updates` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

Observed implementation: `tools/updates/run.mjs` prepareCandidate commit allowlist, qualification and createPullRequest; `tools/updates/context.mjs` descriptor/body; `.github/workflows/updates.yml`; candidate tests. Site preview only starts after the PR is opened, so product qualification precedes PR creation and documentation preview readiness follows on that same PR.

## Goals / Non-Goals

Realize this unit's changed obligations while retaining its complete existing effective contract. Compose package/public documentation preparation and candidate example evidence into the same temporary candidate PR; expose its exact documentation preview and required check state for human integration; retain exact dispatch, official inputs, complete qualification and stop-before-merge/publication. No change to general 42P, source locks, human authority, published history, product channel/version policy, runtime API or unrelated unit is proposed.

## Decisions

Add bounded document preparation before committing the candidate snapshot, using the selected lock and existing shared forecast. Qualify that committed head and hand exact archive identity to Site/example checks. Open/update the PR after product qualification; it remains not eligible for human integration until applicable preview/doc checks for that head pass. Do not wait for a preview before the PR exists, reuse stale evidence, dispatch another release workflow or require a published candidate. Extend the explicit changed-file allowlist only for authored docs/declared candidate inputs; generated archives/evidence remain temporary artifacts.

The synchronized `distribution-candidates` baseline at main `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` plus this delta forms the effective contract; omitted unchanged requirements are retained, not deferred. Implementation tasks preserve that complete surface and checks; prior historical passes are not future acceptance evidence.

Public Markdown sources must remain readable on GitHub. Keep durable prose free of forecast-dependent literals where possible; any final-identity rendering is limited to reviewed mechanical fields. If a changed definitive identity would invalidate authored instructions or require substantive source edits, stop before publication and prepare a refreshed reviewable candidate rather than planning a post-publication documentation fix. No workflow writes directly to main.

## Risks / Trade-offs

Changing authored docs after qualification invalidates the head/archive evidence. Repeated runs must update/retain a single matching candidate without duplicate preparation or using another run artifact.

## Migration Plan

After prepare-release-package-docs and preview-vector-release-docs; existing release qualification supplies exact candidate archive. Supplies the head/descriptor/archive/doc context consumed by bind-release-documentation and Site. Stage implementation/verification so each unit remains reviewable; the first five changes must be integrated coherently before a real candidate uses the new workflow. The demo has only the explicitly stated published-runtime dependency. Preserve previous public deployment on publication failure; do not roll back a published identity or fabricate a replacement artifact.

## Open Questions

No unresolved design choice blocks this proposal. Concrete bounded code/file handoff details remain realization choices under the stated identity/failure rules. Any newly discovered authority conflict or necessary semantic revision stops Apply and reopens affected derivation. Required browser/Pages/publication observations belong to later realization and cannot be claimed here.
