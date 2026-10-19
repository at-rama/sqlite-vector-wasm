# Design

## Context

Allocation: `A-site_demo` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

Observed implementation: `site/demo/demo-worker.mjs`, demo client/data logic, `tools/site/demo.mjs`, `tools/site/demo-runtime.json`, site/demo tests and checks. Current selection is published vec 0.2.0 and must remain truthful until a real stable Vector archive exists.

## Goals / Non-Goals

Realize this unit's changed obligations while retaining its complete existing effective contract. Adapt native Vector SQL/version identity and independent binary/Hamming/Float32-cosine checks; keep the complete existing corpus and UI; explicitly refresh only from an actually published stable Vector archive. No change to general 42P, source locks, human authority, published history, product channel/version policy, runtime API or unrelated unit is proposed.

## Decisions

Use Vector native ordinary-table BLOB storage and native exact search operations suited to binary Hamming and Float32 cosine, preserving the independent reference oracle, six-neighbor/tie semantics and deferred Float32 loading. Choose concrete SQL from the exact released upstream already selected by the eventual published archive; no facade or custom distance implementation substitutes for extension execution. Prepare code/fixtures without relabeling the current demo. Actual integration/verification of the refreshed demo waits for an available qualified published stable Vector archive; absence is blocked, never synthetic success.

The synchronized `site-demo` baseline at main `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` plus this delta forms the effective contract; omitted unchanged requirements are retained, not deferred. Implementation tasks preserve that complete surface and checks; prior historical passes are not future acceptance evidence.

Public Markdown sources must remain readable on GitHub. Keep durable prose free of forecast-dependent literals where possible; any final-identity rendering is limited to reviewed mechanical fields. If a changed definitive identity would invalidate authored instructions or require substantive source edits, stop before publication and prepare a refreshed reviewable candidate rather than planning a post-publication documentation fix. No workflow writes directly to main.

## Risks / Trade-offs

Vector native binary storage/dimension/metric details must be checked on the selected published runtime; if the required behavior cannot be preserved without upstream changes, stop and escalate. Do not invent a 0.3.0 archive or claim current Pages Vector acceptance.

## Migration Plan

Runtime dependency: actual stable Vector publication after the release-review chain, not merely implementation of those changes. No reverse dependency: candidate docs and first Vector product publication do not require demo refresh. Stage implementation/verification so each unit remains reviewable; the first five changes must be integrated coherently before a real candidate uses the new workflow. The demo has only the explicitly stated published-runtime dependency. Preserve previous public deployment on publication failure; do not roll back a published identity or fabricate a replacement artifact.

## Open Questions

No unresolved design choice blocks this proposal. Concrete bounded code/file handoff details remain realization choices under the stated identity/failure rules. Any newly discovered authority conflict or necessary semantic revision stops Apply and reopens affected derivation. Required browser/Pages/publication observations belong to later realization and cannot be claimed here.
