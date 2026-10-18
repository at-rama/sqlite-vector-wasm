# Proposal

## Why

The product now selects SQLite-Vector, but publication calculation, integrated selection and provenance still assume sqlite-vec. A-release must consume the already implemented Vector production path and the adopted first-transition MINOR/notice and component-reference decisions without treating unrelated upstream versions as an upgrade or restarting bootstrap.

## What Changes

- **BREAKING**: qualify and publish new product candidates with SQLite-Vector; make the first transition MINOR within product 0.x and include an explicit native-vector-SQL breaking-change Release notice. Official SQLite browser APIs and all acceptance duties remain.
- Extend the common calculation/state interpretation with actual engine identity, the adopted channel/latest component references and unchanged product alpha-series, uniqueness and exact-payload rules. Keep historical sqlite-vec publications readable without offering a parallel release line.
- Bind integrated selection, the exact recorded Vector lock, final package identity, complete production/browser evidence and published provenance to one authoritative commit and archive. Pass the Vector lock explicitly rather than changing other allocation units' defaults.
- Preserve normal human candidate integration, trusted publishing/attestations, scoped package identity, registry-placeholder behavior, partial-outcome reporting and the historical bounded initial-completion path. Adapt the existing nonpublishing release exercise for an actual Vector production payload.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-release`: product-engine-aware calculation, reference selection, integrated handoff, definitive qualification, publication identity/provenance and transition notice; retain the rest of A-release's complete existing contract.

## Impact

Exactly one realization unit: **A-release**. Inputs are the reconciled Allocation in this PR, SHA-256 `00ab76dd9cd370ca1cf6e5cf6a8943efbf5076500bcd583b7c38932c7ff39840`, and its qualified Capture references. Comparison baseline: main `28c382dea0a7b81178d3a2440639d58dada6016c`. The same PR records the already human-adopted reference decision in Distribution/Release-Watch and refreshes Allocation identities; these design edits add no realization unit.

Expected realization touches `tools/release/`, its tests, `tools/release.sh`/release workflow where needed, and `docs/publication.md`. Existing build/package/acceptance producers are consumed rather than replaced. The candidate descriptor and common policy outputs form the downstream handoff for future A-updates/A-watch Changes; their workflows, discovery baseline, notice-refresh producer and site/docs/demo implementations are outside this Change. Legacy low-level calculation compatibility may remain for existing callers; it never qualifies a new sqlite-vec publication. Current source locks, engine integrations, package interfaces, canon, historical archives and evidence are not migrated or rewritten.

Planning creates no code, release tag, publication, sender setup, account configuration or deployment. The exact distribution number is recalculated later against real published state, not reserved here. See [coverage](coverage.md) for the entire unit, including unchanged baseline requirements, and [design](design.md) for coordinated downstream limits.
