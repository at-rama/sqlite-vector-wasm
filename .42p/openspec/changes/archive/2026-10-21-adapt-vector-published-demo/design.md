# Design

## Context

Allocation: `A-site_demo` only, [current source snapshot](https://github.com/at-rama/sqlite-vector-wasm/blob/c1707c6712b686523fd9978f322c7741ac7c8690/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `80e3d64c3e30e9340b192ca2c2867e46e91f076036319c1e0c89866f3b9b40cc`. Its complete qualified references apply, especially Site C-demo-release/C-demo-checks under S-demo-placeholder and S-composition-cleanup. [Coverage](coverage.md) traces the complete unit, including retained requirements. This reconciliation changes planning only; it performs no Apply, synchronization, archive, merge, publication or deployment.

At source snapshot `c1707c6712b686523fd9978f322c7741ac7c8690`, [the Demo page](https://github.com/at-rama/sqlite-vector-wasm/blob/c1707c6712b686523fd9978f322c7741ac7c8690/site/demo/index.md) is static. `site/demo/demo-worker.mjs`, `tools/site/demo.mjs` and `tools/site/demo-runtime.json` no longer exist. [Placeholder publication handling](https://github.com/at-rama/sqlite-vector-wasm/blob/c1707c6712b686523fd9978f322c7741ac7c8690/tools/site/placeholder.mjs) intentionally constructs that state without runtime assets. Corpus source pins, parsing and independent-reference utilities remain in `tools/site/`; their presence does not establish a working demo.

The effective contract is the synchronized [site-demo baseline](https://github.com/at-rama/sqlite-vector-wasm/blob/c1707c6712b686523fd9978f322c7741ac7c8690/.42p/openspec/specs/site-demo/spec.md) (SHA-256 `41101f96cee3330696176e37c2bd36300439143c1332924f1eee9b6c95657ae8`) plus this delta. Its temporary exception is current; its full deferred runnable requirements are retained for the qualified return. Historical archives and old passes neither override that exception nor qualify new runtime bytes.

## Goals / Non-Goals

Restore the complete deferred A-site_demo behavior through a single SQLite-Vector implementation. Preserve the temporary public state until a qualified return is integrated through the existing human-controlled lifecycle. Keep the current corpus/modes/UI obligations and independent browser/Pages checks, with native extension execution and no package API or engine rebuild.

No parallel sqlite-vec capability, engine chooser, compatibility facade, configurable placeholder/runtime mode, new release channel, upstream patch, migration guide, persistent database or broader 42P/workflow redesign is introduced. README/Usage and product publication retain their current owners and guarantees.

## Decisions

### Rebuild from the current site, reuse history selectively

Treat the runnable client/Worker, exact runtime selection and integration checks as work to perform, not existing code needing a small SQL edit. Reuse the retained pinned corpus/parser/reference utilities after checking their applicability. Historical UI code may be ported where useful, but no abandoned engine SQL, selector or obsolete runtime pin returns to active support. A clean rewrite or selective port remains a realization choice under identical behavior; neither permits a smaller corpus or reduced checks.

### Select published bytes explicitly

Resolve the stable distribution corresponding to `latest` at explicit preparation/refresh; verify publication companions, package/composition identity and archive/runtime digests before use. Release 0.3.0 is an observed available publication, not a hardcoded future selection. Persist the selected identity so ordinary stable/preview or documentation rebuilds do not rediscover a newer runtime. Fail on unavailable, ineligible or inconsistent inputs; do not build an engine or substitute unpublished candidate assets. Preview qualification of demo code still uses published stable runtime bytes.

### Preserve native operations and independent checks

Use native SQLite-Vector ordinary-table vector storage and search operations for binary304/Hamming and original300/Float32 cosine. Check the exact released SQL, dimensions, initialization and metric behavior on the selected archive before wiring it into the UI. Both modes must use extension execution; a JavaScript search or SQL facade cannot substitute. Show observed SQLite/Vector identities and actual SQL/parameters/distances/timing. Retain six distinct neighbors excluding self, tie-boundary acceptance, initial cat selection, full text matching and deferred Float32 semantics from the effective contract.

Keep the independently calculated reference outside the extension path and document shared corpus/conversion assumptions and Float32 tolerance. Existing parser/oracle code and fixtures must be examined and exercised again; their historical results are not current browser evidence.

### Stage the return without weakening the temporary phase

Keep the active public placeholder while implementing and qualifying the return locally and on an identified Pages preview through existing site mechanisms. The implementation may make bounded A-site_demo handoff changes in preparation, browser checks and stable publication handling so they can carry the qualified fixed demo selection; do not create a second deployment architecture or bypass shell/docs gates. A preview must never relabel candidate package bytes as a published demo runtime. Preserve existing documentation-version eligibility independently from the demo selection.

Only the separately qualified return and authorized integration end the temporary exception. A metadata lookup, package publication, successful placeholder test, merge of planning artifacts or documentation rebuild alone does not reactivate the demo. Keep public output static when preparation/qualification/publication fails. Subsequent documentation-only deployments preserve the selected runtime identity; failures preserve the previous public deployment under existing publication guarantees. No recurring public switch between two demo implementations is added.

## Risks / Trade-offs

Native metric/storage limits must be checked against the actual selected release before UI work is treated as complete. An inability to preserve the required dimensions, distances or native execution requires escalation, not a custom replacement or weakened requirement. Local success without an identified Pages observation leaves qualification incomplete. Corpus age, English labels and representation-dependent neighbors remain disclosed limitations; database volume is measured without inventing a threshold or semantic-relevance guarantee.

## Migration Plan

Verify the current placeholder/integration boundary; select and check the published runtime and corpus; build and check both native representations, UI and disposal; then integrate local/preview qualification and record exact identities/results. Renew bidirectional coverage and execute post-Apply 42P Verification. Archive and human integration/deployment remain subsequent authorized lifecycle operations. This planning reconciliation performs none of those operations.

## Open Questions

No unresolved product-design choice is introduced by this reconciliation. Internal file organization, concrete native queries, the then-current eligible release and final database volume are bounded realization/measurement choices. If their investigation requires changing the effective behavior or authority, stop and escalate before continuing Apply.
