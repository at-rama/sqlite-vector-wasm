# Design

## Context

Allocation: `A-package` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

Observed implementation: `tools/package/package.mjs` documentMapping/document content validation and assemble; `docs/sqlite-vector/{README,usage}.md`; composition packaging tests. Root README is not packaged: keep the existing selected-engine document mapping rather than replacing it by the public site source.

## Goals / Non-Goals

Realize this unit's changed obligations while retaining its complete existing effective contract. Prepare selected-engine consumer documentation in the candidate source snapshot; render identity-dependent package references from the supplied package/build identity; retain exact document provenance and reject fixture-only or wrong-composition publication prose. No change to general 42P, source locks, human authority, published history, product channel/version policy, runtime API or unrelated unit is proposed.

## Decisions

Keep engine-specific authored sources and common browser instructions. Use a bounded deterministic substitution or equivalent explicit renderer for product/version/upstream literals from the existing supplied identity and build handoff. Do not create a new release/version registry. Record authored source hashes and rendered output hashes separately. Local fixtures remain identified as unpublished; production documents describe the enclosed composition without claiming that publication has already happened. Existing vec source selection remains usable.

The synchronized `browser-package` baseline at main `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` plus this delta forms the effective contract; omitted unchanged requirements are retained, not deferred. Implementation tasks preserve that complete surface and checks; prior historical passes are not future acceptance evidence.

Public Markdown sources must remain readable on GitHub. Keep durable prose free of forecast-dependent literals where possible; any final-identity rendering is limited to reviewed mechanical fields. If a changed definitive identity would invalidate authored instructions or require substantive source edits, stop before publication and prepare a refreshed reviewable candidate rather than planning a post-publication documentation fix. No workflow writes directly to main.

## Risks / Trade-offs

A rendered document changes archive bytes. Reassemble and renew acceptance for any identity change; never mutate a qualified archive in place.

## Migration Plan

None among this batch; consumes existing successful build/explicit package identity. Public documentation is a separate A-site_docs contribution. Stage implementation/verification so each unit remains reviewable; the first five changes must be integrated coherently before a real candidate uses the new workflow. The demo has only the explicitly stated published-runtime dependency. Preserve previous public deployment on publication failure; do not roll back a published identity or fabricate a replacement artifact.

## Open Questions

No unresolved design choice blocks this proposal. Concrete bounded code/file handoff details remain realization choices under the stated identity/failure rules. Any newly discovered authority conflict or necessary semantic revision stops Apply and reopens affected derivation. Required browser/Pages/publication observations belong to later realization and cannot be claimed here.
