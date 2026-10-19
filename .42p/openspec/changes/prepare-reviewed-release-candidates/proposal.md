# Proposal

## Why

Updates currently commits the Vector lock, release descriptor and notices only. Its PR cannot carry the complete public/package documentation review required before publication.

Allocation: `A-updates` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

## What Changes

Compose package/public documentation preparation and candidate example evidence into the same temporary candidate PR; expose its exact documentation preview and required check state for human integration; retain exact dispatch, official inputs, complete qualification and stop-before-merge/publication.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-candidates`: Compose package/public documentation preparation and candidate example evidence into the same temporary candidate PR; expose its exact documentation preview and required check state for human integration; retain exact dispatch, official inputs, complete qualification and stop-before-merge/publication.

## Impact

`tools/updates/run.mjs` prepareCandidate commit allowlist, qualification and createPullRequest; `tools/updates/context.mjs` descriptor/body; `.github/workflows/updates.yml`; candidate tests. Site preview only starts after the PR is opened, so product qualification precedes PR creation and documentation preview readiness follows on that same PR.

Dependencies: After prepare-release-package-docs and preview-vector-release-docs; existing release qualification supplies exact candidate archive. Supplies the head/descriptor/archive/doc context consumed by bind-release-documentation and Site.

Existing synchronized requirements not modified by the delta remain binding within this unit; [coverage](coverage.md) records the complete effective contract and its grounding. All task checkboxes remain open.
