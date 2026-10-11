# Proposal

## Why

The first npm publication exposes a registry-created `0.0.0-stage` placeholder alongside the real `0.1.0` distribution. A-release currently validates every npm entry as a distribution, so the placeholder blocks read-only initial completion, candidate preparation and subsequent publication verification despite matching published archive bytes.

## What Changes

- Realize exactly `A-release`: distinguish the narrowly recognized npm placeholder from published distributions in the shared registry reader and its consumers.
- Require the exact scoped package identity, exact `0.0.0-stage` entry/version and boolean `stub: true`; retain strict rejection of other unsupported or inconsistent entries.
- Exclude the recognized placeholder from distribution history and numbering, without treating its presence as package absence or accepting it as a `latest`/`next` reference. Preserve collision, provenance and exact-byte checks.
- Specify read-only completion with placeholder plus real distribution, pending initial publication, and explicit failure of inconsistent references.
- Verify shared preparation/normal-publication consumers through meaningful fixtures and an authorized read-only completion check of the existing publication; do not republish, delete, change dist-tags or force a demonstration release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-release`: refine complete publication-state interpretation to distinguish registry placeholders from distribution publications, retaining the existing identity and bounded initial-completion requirements.

## Impact

Expected implementation targets are `tools/release/state.mjs` and registered release tests; inspect `run.mjs`, `services.mjs` and A-updates' existing `readState` use without introducing parallel policies. No runtime/package rebuild, new dependency or publishing mechanism is planned. The synchronized spec will change only through the normal later lifecycle; this proposal adds a Change-local delta.

The Allocation snapshot is [edit-0.1](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`, unit `A-release`, examined at `main` commit `ef202b77e120332703ebeba67501ea91bfab667e`. Its Capture inputs remain unchanged. The preceding scoped documentary derivation review found the correction compatible with existing design; it did not verify this future Change or its implementation. See [coverage](coverage.md) for the proposed obligation mapping; a separate derivation examination remains necessary before Apply.

The existing [#35 integration](https://github.com/at-rama/sqlite-vector-wasm/pull/35) and [publication run](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38139932466) supply the operational trigger: npm accepted `0.1.0`; registry inspection found `latest=0.1.0` and archive size `1147792`, SHA-256 `f730ffe041730f8f98306004e488fe97dd64bf08646c380d1a7a30f033a80ff9`, while the maintainer's `check-initial` failed on `0.0.0-stage`. These are dated 2026-10-11 observations, not proof of corrected behavior or completed A-bootstrap. #33 remains distinct. This request authorizes planning only.
