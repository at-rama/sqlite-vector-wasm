# Design

## Context

Allocation: `A-site_shell` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

Observed implementation: `.github/workflows/site.yml` pull_request/push/manual path filters and independent stable main checkout; `tools/site/publication.mjs` assemble/guard/freshness; release workflow outcome artifacts; current Pages checks/concurrency. Stable root rebuilt from main is unsafe during the post-merge publication interval.

## Goals / Non-Goals

Realize this unit's changed obligations while retaining its complete existing effective contract. Reuse the existing identified shared PR preview; gate stable candidate-document promotion on complete matching distribution publication; protect push/manual/preview-stable-root paths and preserve previous public docs on failed or partial publication. No change to general 42P, source locks, human authority, published history, product channel/version policy, runtime API or unrelated unit is proposed.

## Decisions

Keep existing preview construction, Pages assembly/serialization, navigation and freshness guards. Select stable documentation from a revision/identity proven deployable by matching complete publication, rather than blindly using current main; ordinary docs-only revisions remain deployable when their announced release is already published. Resolve the eligible prior source from existing Git/publication/site evidence, with no new authoritative version ledger. If eligibility or previous source cannot be established, stop deployment and leave existing Pages unchanged. A preview must still identify the candidate and must not overwrite stable with unpublished main. Consume successful release handoff through a bounded existing-workflow dependency/completion trigger with exact repository/run/revision checks; event success alone is insufficient.

The synchronized `site-shell` baseline at main `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` plus this delta forms the effective contract; omitted unchanged requirements are retained, not deferred. Implementation tasks preserve that complete surface and checks; prior historical passes are not future acceptance evidence.

Public Markdown sources must remain readable on GitHub. Keep durable prose free of forecast-dependent literals where possible; any final-identity rendering is limited to reviewed mechanical fields. If a changed definitive identity would invalidate authored instructions or require substantive source edits, stop before publication and prepare a refreshed reviewable candidate rather than planning a post-publication documentation fix. No workflow writes directly to main.

## Risks / Trade-offs

workflow_run or equivalent cross-workflow inputs must be treated as untrusted until repository/run/head/artifact identities match. Shared Pages concurrency and freshness checks must cover the final guard. A deploy failure can be retried for the same completed release without republishing.

## Migration Plan

After preview-vector-release-docs and bind-release-documentation. Integration readiness also consumes prepare-reviewed-release-candidates context; deployment does not own product qualification or publication. Stage implementation/verification so each unit remains reviewable; the first five changes must be integrated coherently before a real candidate uses the new workflow. The demo has only the explicitly stated published-runtime dependency. Preserve previous public deployment on publication failure; do not roll back a published identity or fabricate a replacement artifact.

## Open Questions

No unresolved design choice blocks this proposal. Concrete bounded code/file handoff details remain realization choices under the stated identity/failure rules. Any newly discovered authority conflict or necessary semantic revision stops Apply and reopens affected derivation. Required browser/Pages/publication observations belong to later realization and cannot be claimed here.
