# Proposal

## Why

The current source resolver assumes sqlite-vec release-asset amalgamations and published asset digests. Add an exact official SQLite / SQLite-Vector source option while retaining sqlite-vec acquisition for future release compositions, without changing the running distribution or extending acquisition into building and publication.

## What Changes

- Realize exactly `A-inputs`: official release selection, provenance, independently recorded source pins, fresh verified acquisition and a complete source-pair handoff.
- Select SQLite-Vector `1.1.2` from `sqliteai/sqlite-vector`, release tag `1.1.2`, commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. Retain the existing SQLite `3.54.0` full-source pin unchanged.
- For SQLite-Vector only, replace amalgamation/published-asset-checksum assumptions with an official release-to-commit binding and SHA-256 of its commit-addressed GitHub source archive, recorded before production use. Acquisition never learns or updates its own expected checksum.
- Deliver unchanged `src/`, bundled `libs/fp16/` headers and the root license from that archive, excluding its vendored SQLite, package symlinks and unrelated packages/examples from the extension handoff.
- Retain both fixed acquisition paths as release options, not temporary migration compatibility. Keep the current production pin, acquisition callers and runtime unchanged in this Change. Each acquired pair contains SQLite and exactly one identified engine; failure never selects the other engine. No multi-engine runtime, registry or backend abstraction is created.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `upstream-inputs`: retain sqlite-vec release-asset acquisition and add SQLite-Vector release-bound commit-archive acquisition; preserve the entire unit's selection, integrity, fresh-workspace and handoff obligations.

## Impact

Implementation is confined to `tools/inputs.py`, necessary `tools/inputs.sh` glue, their existing tests, source-acquisition documentation and a separate recorded candidate pair at `inputs/sqlite-vector.sources.lock.json`. The default `inputs/sources.lock.json`, release descriptor and downstream build/package/Watch/release implementations remain unchanged. This enables subsequent units; it does not demonstrate static registration, browser compatibility, OPFS, packaging or publication.

This Change derives from **A-inputs** in the [global Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `2e1862a7dfb09a52675eb78bda79e32e0a2bad832c196a2b7fb37c9113f1a9ef`, at revision `f754f2ba8723d65db981dbcf1f171ae1d9b0cadd`. Read its qualified Distribution `C-purpose`, `C-inputs`, `R-inputs` and Release/Watch `C-provenance` contributions. The maintainer's 2026-10-17 decision recorded as Distribution S-release-engines retains sqlite-vec and adds SQLite-Vector as another potential single-engine release composition. This proposal realizes that decision's A-inputs portion; it neither implements another unit nor authorizes publication. [Coverage](coverage.md) records the complete bidirectional obligation mapping.

PR #66 has been merged. Implementation, post-Apply Verification and archive remain separate steps before integration under the repository rules. Cross-engine version/maturity/alpha/reference policy and the SQLite-Vector Watch baseline remain open under Release/Watch Q-engine-transition; their A-release/A-watch owners do not block source acquisition and are not implemented here.
