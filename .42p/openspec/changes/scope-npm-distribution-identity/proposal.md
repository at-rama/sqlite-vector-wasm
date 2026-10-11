# Proposal

## Why

The selected public npm identifier is `@at-rama/sqlite-vector-wasm`, but A-release currently calculates, reads and validates the unscoped package name. Correct this handoff before the first publication so A-bootstrap can publish and verify the exact qualified scoped archive.

## What Changes

- Realize exactly `A-release` from the [current Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), examined at main commit `32f62b8547801f8f3a21eeaed0fd41ac4c3a5abe`, SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`.
- Specify `@at-rama/sqlite-vector-wasm` as the single npm identity supplied by the common calculation, carried through packaging and provenance, and checked against scoped registry state in ordinary publication and read-only initial completion.
- Preserve product name sqlite-vector-wasm, repository `at-rama/sqlite-vector-wasm`, the distribution-only SemVer domain, `dist/v<version>` tags, channel rules and every existing qualification, authority, authenticity and failure boundary.
- Update canonical publication fixtures and current consumer examples/links. Retain generic fixture identities and historical records as such.

The user explicitly required the npm prefix in this conversation on 2026-10-11, after reporting an npm account, organization `@at-rama`, membership of its Developers team and no corresponding published package. The adopted identifier is `@at-rama/sqlite-vector-wasm`; the product name remains unchanged. This is a concrete selection within A-release's allocated identity responsibility, not a revision of numbering, runtime or unit boundaries. No public conversation permalink is available; the user statements are decision authority, while the exploration and this proposal are derived records. Package absence is user-reported, not a live registry observation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-release`: refine Single distribution identity to distinguish product/repository identity from npm package identity and require consistent scoped state, metadata, provenance and completion checks. The other fifteen requirements and all their scenarios remain part of this Change's retained contract, as mapped in [coverage](coverage.md).

## Impact

Implementation targets are `tools/release/policy.mjs`, `tools/release/state.mjs` and their publication fixtures/tests; existing `run.mjs`/`services.mjs` flows consume the corrected identity and state. A-updates consumes the shared calculation and qualification path; A-package and A-acceptance already accept supplied scoped names. No new unit implementation or generic packaging API change is presumed.

Current npm links/examples in `README.md`, `docs/publication.md`, `docs/packaging.md` and `docs/acceptance.md` need alignment. Repository URLs, GitHub Release display names, internal tooling packages and nonpublished fixture defaults keep their respective meanings. No dependency, new state store, caller-selectable package name, alias package or second publication destination is introduced.

The [A-bootstrap proposal in PR #33](https://github.com/at-rama/sqlite-vector-wasm/pull/33) is a downstream consumer. This Change has its own PR based on main and must be implemented, verified, archived and human-integrated before bootstrap execution can rely on it. It does not configure GitHub/npm accounts, dispatch a candidate, merge, tag or publish. See [coverage](coverage.md) for source fingerprints and the complete A-release correspondence.
