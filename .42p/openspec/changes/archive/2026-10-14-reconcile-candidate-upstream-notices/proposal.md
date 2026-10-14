# Proposal

## Why

Candidate preparation changes upstream identities without reconciling their version-associated notices, so repository tests reject an otherwise resolved candidate before qualification. Run [38627390423](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38627390423) demonstrates the gap; weakening packaging validation would conceal it.

## What Changes

- Make preparation reconcile notice text, exact upstream association, origins and digests before committing and checking the candidate, for both SQLite and sqlite-vec.
- Prefer verified selected archives for notice material; acquire missing sqlite-vec license files from its official version tag resolved to an immutable commit.
- Commit the coherent lock, release descriptor, notice manifest and changed notice texts together. Keep raw acquisitions and diagnostics uncommitted.
- Fail before repository checks and qualification when reconciliation is incomplete; preserve existing strict package/release checks, complete qualification and human integration/publication boundaries.
- Preserve unchanged upstream notice groups and support advances, admitted prereleases, rollbacks and same-pair reconstruction without a special case for SQLite 3.54.0.

This is a corrective realization of exactly `A-updates`, composing existing A-inputs/A-package duties without transferring them. The [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) snapshot is SHA-256 `ed381776c7b45d559640174b66155947f9c2ec1537a6896ab24a539c660e441e` at `b1bacae6854e8e6594fc7023ffa29ed6245df4ea`. [Coverage](coverage.md) accounts for the complete unit through this delta and retained realization requirements. The user's present instruction explicitly establishes candidate coherence before checks; instituted sources remain authoritative through the Allocation's qualified references.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-candidates`: official pinned candidate inputs include coherent versioned notice records before checks, and retained diagnostics identify notice acquisition/reconciliation failures.

The existing browser-package licensing and strict association requirements are consumed unchanged.

## Impact

Implementation is confined to preparation orchestration and a notice helper under `tools/updates/`, its registered offline tests, candidate documentation and, if needed, focused package regression tests. Each real preparation may update `tools/package/notices.json` and the four SQLite/sqlite-vec notice inputs alongside its source lock and descriptor. No changes to current pins or notice bytes are part of this planning PR.

No new dependency, toolchain update, licensing policy, engine, publication policy or 42P mechanism is proposed. Emscripten and its bundled notices remain tied to the existing toolchain; this workflow has no toolchain selector. Generated runtime notices remain untouched.

This PR remains a draft with an active Change. Apply, post-Apply Verification and Archive require subsequent work; merge gates are not expected to pass for a planning-only active Change.
