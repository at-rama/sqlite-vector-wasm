# Design

## Context

Allocation: `A-site_docs` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

Observed implementation: `tools/site/docs.mjs` prepareDocs/link rewriting; `tools/site/example.mjs` published archive/example execution; `tools/site/docs-example.json`; `README.md`, `docs/usage.md`, site checks. Reuse build-prefix rendering and real-browser example execution; candidate input is currently absent.

## Goals / Non-Goals

Realize this unit's changed obligations while retaining its complete existing effective contract. Prepare the single-source public Vector presentation/Usage and transition explanation; check the minimal native SQL example against exact qualified candidate archive bytes in an explicitly unpublished preview; retain published-only stable documentation and independent doc updates. No change to general 42P, source locks, human authority, published history, product channel/version policy, runtime API or unrelated unit is proposed.

## Decisions

Introduce a bounded candidate input mode to the existing example/build check, accepting explicit archive, digest, composition and qualified revision from preparation. Keep ordinary published-selection mode. Render candidate status/version from the same bound input; candidate preview must not tell readers the unissued npm version is installable. Use actual qualified bytes, not a synthetic module or a second engine build. Stable rendering resolves the matching definitive publication identity; only mechanical identity/status rendering may differ from reviewed content. SQL/meaning changes require renewed review.

The synchronized `site-docs` baseline at main `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` plus this delta forms the effective contract; omitted unchanged requirements are retained, not deferred. Implementation tasks preserve that complete surface and checks; prior historical passes are not future acceptance evidence.

Public Markdown sources must remain readable on GitHub. Keep durable prose free of forecast-dependent literals where possible; any final-identity rendering is limited to reviewed mechanical fields. If a changed definitive identity would invalidate authored instructions or require substantive source edits, stop before publication and prepare a refreshed reviewable candidate rather than planning a post-publication documentation fix. No workflow writes directly to main.

## Risks / Trade-offs

Shared /preview/ can be replaced; review/check identity must equal PR head and archive, not simply a URL. Definitive number may differ, so publication binding must renew affected checks.

## Migration Plan

Candidate archive consumer documents are prepared by prepare-release-package-docs; archive qualification itself already exists. Supplies content/check context to prepare-reviewed-release-candidates, bind-release-documentation and publish-site-after-distribution. Does not require demo migration. Stage implementation/verification so each unit remains reviewable; the first five changes must be integrated coherently before a real candidate uses the new workflow. The demo has only the explicitly stated published-runtime dependency. Preserve previous public deployment on publication failure; do not roll back a published identity or fabricate a replacement artifact.

## Open Questions

No unresolved design choice blocks this proposal. Concrete bounded code/file handoff details remain realization choices under the stated identity/failure rules. Any newly discovered authority conflict or necessary semantic revision stops Apply and reopens affected derivation. Required browser/Pages/publication observations belong to later realization and cannot be claimed here.
