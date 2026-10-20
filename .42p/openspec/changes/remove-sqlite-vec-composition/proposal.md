# Proposal

## Why

SQLite-Vector is the sole product engine, but the repository still acquires, builds, packages and qualifies sqlite-vec as an isolated alternative. Remove that maintenance surface for the 0.3.0 product target while retaining the provenance needed to interpret actual past publications.

**Status: adopted implementation target.** S-composition-cleanup adopts D1/D2 and the derived A-composition-cleanup unit; S-demo-placeholder retains the temporary static demo. Current Captures and Allocation are reconciled before Apply. [The amendment record](authority-amendment.md) preserves the decisions and their bounds. Coverage and implementation Verification remain separate controls.

## What Changes

- **BREAKING:** remove sqlite-vec source resolution/acquisition, source lock, C integration, alternate build/package paths, document sources and double-composition qualification. The sole current chain uses SQLite plus SQLite-Vector; use the existing `inputs/sqlite-vector.sources.lock.json` everywhere and retain `resolve-vector` as the single resolver, without a legacy-command shim.
- Delete `docs/sqlite-vec/` and obsolete current callers. Remove old-engine-only defaults, manifest branches, notice inputs and fixtures. Retain SQLite-Vector/FP16 and SQLite/toolchain notices and all generic SQLite functionality.
- Reject legacy candidate/build/package/acceptance inputs. Keep only narrowly necessary read-only interpretation of historical published records for channel history, transition numbering, integrity and collisions. No legacy build or calculation offer is retained for callers.
- Preserve SQLite/SQLite-Vector official stable/prerelease tracking, discovery floor, shared numbering policy, exact bytes, fail-closed integrity and full browser/persistence qualification.
- Replace the running demo temporarily with a static SQLite-Vector refactoring notice and Usage link, preserving navigation and loading no demo runtime, Worker or corpus. Its separately qualified future return (PR #77) retains the full published-runtime contract but no longer blocks cleanup completion. This bounded decision is adopted as S-demo-placeholder; D1/D2 are adopted under S-composition-cleanup.
- Explain the break in 0.3.0 Release notes only; native Vector usage remains documented, without an additional migration guide or old-vector compatibility promise.

## Capabilities

### New Capabilities

None. No runtime facade, adapter framework or additional product is introduced.

### Modified Capabilities

- `upstream-inputs`: one source composition and resolver; remove the retained sqlite-vec acquisition promise.
- `browser-build`: Vector-only inputs/default/static integration while preserving the entire SQLite baseline.
- `browser-package`: Vector-only handoff, document selection and licensing; remove dual-composition guarantees.
- `browser-acceptance`: one production composition with the complete existing Vector matrix and independent oracles.
- `distribution-release`: separate Vector-only current calculations/qualification from required historical publication interpretation.
- `site-docs`: native current usage without a separate legacy adaptation guide.
- `site-demo`: temporary placeholder with no active demo runtime/data dependencies; keep the full future demo contract deferred to its separate qualified return.

## Impact

The [inventory](inventory.md) identifies concrete removal/adaptation/conservation targets, PR #78 overlaps and reproducibility boundaries. Watch, Updates, notifications, bootstrap and Site shell keep their existing responsibilities; prune obsolete technical paths and renew affected handoff checks without redesigning their policy. Synchronized base specs and implementation remain unchanged in this PR.

Adopted single-unit attribution is `A-composition-cleanup`, recorded in the current Allocation. It owns this bounded removal and regression proof, not the continuing duties of the existing twelve units. Existing whole-unit responsibilities cannot legitimately be replaced by a partial multi-unit coverage claim.

Excluded: archiving, merging, publishing, modifying the general 42P model/canon, broad editorial reconciliation already in [PR #78](https://github.com/at-rama/sqlite-vector-wasm/pull/78), new runtime APIs, release-system redesign, historical archive rewriting, old database migration and preservation of unused 0.x caller interfaces. No actual 0.3.0 publication is asserted.

Primary risks: accidental removal of generic SQLite behavior; shared validators breaking historical publication reading; notice/provenance loss; test-count reduction hiding a weakened Vector matrix; accidental old-demo reactivation; conflict with #78. Acceptance is defined by the delta scenarios and tasks, under the adopted A-composition-cleanup attribution; replacement-demo publication is not a cleanup prerequisite.
