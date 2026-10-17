# Proposal

## Why

The current source resolver assumes sqlite-vec release-asset amalgamations and published asset digests. Prepare the exact official SQLite / SQLite-Vector source pair for the intended replacement, without changing the running distribution or extending acquisition into building and publication.

## What Changes

- Realize exactly `A-inputs`: official release selection, provenance, independently recorded source pins, fresh verified acquisition and a complete source-pair handoff.
- Select SQLite-Vector `1.1.2` from `sqliteai/sqlite-vector`, release tag `1.1.2`, commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. Retain the existing SQLite `3.54.0` full-source pin unchanged.
- Replace the selected extension's amalgamation/published-asset-checksum assumptions with an official release-to-commit binding and SHA-256 of its commit-addressed GitHub source archive, recorded before production use. Acquisition never learns or updates its own expected checksum.
- Deliver unchanged `src/`, bundled `libs/fp16/` headers and the root license from that archive, excluding its vendored SQLite, package symlinks and unrelated packages/examples from the extension handoff.
- Keep the current production pin, legacy acquisition callers and runtime unchanged while this preparatory source pair is introduced. No multi-engine runtime, registry or backend abstraction is created.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `upstream-inputs`: acquire the officially released selected extension from a release-bound commit archive; preserve the entire unit's selection, integrity, fresh-workspace and handoff obligations.

## Impact

Implementation is confined to `tools/inputs.py`, necessary `tools/inputs.sh` glue, their existing tests, source-acquisition documentation and a separate recorded candidate pair at `inputs/sqlite-vector.sources.lock.json`. The default `inputs/sources.lock.json`, release descriptor and downstream build/package/Watch/release implementations remain unchanged. This enables subsequent units; it does not demonstrate static registration, browser compatibility, OPFS, packaging or publication.

This Change derives from **A-inputs** in the [global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0d43d5ee8864388060ee7e15b1b0aac0491190adc77b2c4431400a82d273badd`, at revision `12370ee6093cf931771ecaa4ab4e217f45466fbf`. Read its qualified Distribution `C-purpose`, `C-inputs`, `R-inputs` and Release/Watch `C-provenance` contributions. The maintainer's 2026-10-17 instruction to begin A-inputs in this replacement work authorizes this proposal, not an implemented engine replacement or publication. The Captures themselves remain engine-neutral; choosing this concrete implementation does not revise their functional contract. [Coverage](coverage.md) records the complete bidirectional obligation mapping.

PR #66 is still open at this baseline. This planning branch depends on it and is not ready for merge: implementation, post-Apply Verification and archive remain separate steps under the repository rules.
