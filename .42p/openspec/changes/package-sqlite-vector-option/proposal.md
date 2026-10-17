# Proposal

## Why

A-build now constructs both retained engine compositions, but packaging still validates and describes only sqlite-vec. Extend the existing envelope so either recorded composition can become a self-contained, correctly attributed browser archive, without discarding the default path.

## What Changes

- Realize the complete A-package unit for either successful single-engine build handoff, retaining existing CLI arguments, default sqlite-vec consumption, runtime filenames/subpaths and conservative assembly.
- Bind packaging to the handoff's recorded lock, exact selected engine and actually used build inputs; reject ambiguous, stale or mismatched composition/provenance without fallback or recompilation.
- Carry concrete engine/source identities into package metadata, portable `runtime.json` and the final-archive handoff. Preserve existing sqlite-vec fields for that composition; do not disguise Vector as sqlite-vec.
- Select common documentation/notices and explicit `docs/sqlite-vec/` or `docs/sqlite-vector/` sources according to that same engine, exposing stable consumer paths in the archive. The maintainer approved per-engine documentation directories and switching all composition-dependent documentation with the selected upstream; shared material remains single-source.
- Include verified, version-associated licensing material for the actual composition and incorporated dependencies; resolve FP16 provenance/notices before accepting Vector packaging.
- Extend existing offline and actual extracted-package checks for both compositions, including independent asset resolution, native queries, Workers, storage conditions and negative companions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `browser-package`: preserve the full existing packaging contract while supporting either retained engine, engine-selected documentation/notices and exact portable provenance.

## Impact

Target surfaces are `tools/package/`, its existing tests, documentation sources under `docs/common/`, `docs/sqlite-vec/`, `docs/sqlite-vector/`, and `docs/packaging.md`. The root README remains the repository entry point; the existing root presentation and `docs/usage.md` remain compatible with the currently implemented Site until its separate A-site_docs Change. Package descriptions and selected document sources must describe the enclosed composition honestly, including unpublished fixture status where applicable. No template framework, merged prose, SQL adapter or public runtime selector is introduced.

Source: **A-package** in the [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) at main `6bad238fdbbbd0793abfdfe382d8c94f8a2c3a62`, SHA-256 `2e1862a7dfb09a52675eb78bda79e32e0a2bad832c196a2b7fb37c9113f1a9ef`. Qualified contributions are Distribution C-purpose/C-nonmodification/C-inputs/C-browser/C-storage/C-release and Release/Watch C-version-identity/C-provenance/C-publication. The current conversation's documentation refinement selects a realization layout within those consumer-envelope duties; it does not institute new runtime or publication behavior. [Coverage](coverage.md) maps the complete unit.

A-build and its recorded locks/SDK remain unchanged. A-acceptance owns full final-package Float32/binary/Hamming/restart and production-path qualification; A-release owns supplied version/channel/publication policy and definitive-number recalculation; A-updates owns automated notice refresh/candidate preparation. Retaining default callers includes notice-helper compatibility. Site source selection belongs to a subsequent A-site_docs Change, not this one. Q-engine-transition remains unresolved and is not a packaging prerequisite. This proposition creates no implementation, accepted product or publication.
