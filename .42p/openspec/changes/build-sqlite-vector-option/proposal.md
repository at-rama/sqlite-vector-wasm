# Proposal

## Why

A-inputs now supplies verified sqlite-vec and SQLite-Vector source options, but construction and raw-browser checks still assume sqlite-vec. Add SQLite-Vector construction while retaining the existing integration so each future release can select one qualified engine without discarding prior work.

## What Changes

- Realize the complete `A-build` unit for both retained source paths, preserving the canonical SQLite browser baseline and static registration on every connection.
- Add an explicit `--lock PATH` build input. Omission retains `inputs/sources.lock.json`; the validated lock determines the engine, without a second engine parameter or fallback. The additional recorded option is `inputs/sqlite-vector.sources.lock.json`.
- Compile SQLite-Vector's unchanged C sources as separate units with the currently pinned SDK and integrate them through SQLite's official initialization hook. Retain sqlite-vec's existing bridge and construction path.
- Make the existing raw-browser checks aware of the selected engine, using separate native SQL probes and a fresh SQLite-only reference from the same selected source lock, SQLite release and common options.
- Preserve the three loader/Worker1/promiser variants, C-style/OO1 APIs, BigInt, FTS5, default persistent VFSes and the complete runtime asset inventory; retain meaningful negative and failure checks.
- Extend build provenance to identify the selected lock/engine and actual compilation/link inputs, without changing default source pins, release composition or downstream packaging/publication behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `browser-build`: construct either recorded single-engine composition while retaining both paths, exact verified inputs, source-only provenance, canonical runtime behavior, reproducibility and failure semantics.

## Impact

Expected implementation surfaces are `tools/build.sh`, `tools/build/build.mjs`, small engine-specific integration inputs beside the existing template, `tools/build/check.mjs`, `tools/build/browser-probe.mjs`, their existing offline tests and `docs/build.md`. Reuse the pinned Emscripten 4.0.23 harness, source locks and official SQLite 3.54.0 baseline. No upstream source patch, generic backend framework, SQL facade, public runtime selection API or additional distribution is proposed.

This Change derives solely from **A-build** in the [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `2e1862a7dfb09a52675eb78bda79e32e0a2bad832c196a2b7fb37c9113f1a9ef`, at main `a2c9276385f09473ced800893c073a4129a0e0cf`. Qualified inputs are Distribution C-purpose/C-nonmodification/C-inputs/R-inputs/C-browser/C-static/C-storage and Release/Watch C-provenance. The maintainer's 2026-10-17 approval of the A-build exploration confirms the bounded `--lock`, retained-default and separate-compilation choices. It does not establish that the new build works. [Coverage](coverage.md) records the full unit mapping.

Compilation without an upstream patch and correct behavior across the retained browser contexts are explicit Apply proof obligations, not assumptions of success. Packaging/notices remain A-package's responsibility, full final-package Float32/binary/Hamming and persistence-restart qualification remains A-acceptance's, and release numbering/Watch baselines remain with A-release/A-watch under the open Q-engine-transition. No cross-engine publication policy is decided or made a build prerequisite. Proposal and derivation review do not implement, accept, archive or publish this composition.
