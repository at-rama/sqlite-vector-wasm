# Proposal

## Why

The release tooling can qualify and publish an integrated candidate, but no workflow currently turns an exact human upstream selection into that candidate. Realize `A-updates` by composing the existing source resolver, shared distribution calculation and complete production/browser acceptance, ending at a pull request for human integration.

## What Changes

- Add manually dispatched candidate preparation with exact `sqlite_version`, `sqlite_vec_version` and free-text `release_comment`; derive channel and forecast through the existing A-release policy.
- Record the selected official source pins and a release descriptor carrying the preparation run, then qualify the clean candidate commit before pushing its temporary branch and opening its PR.
- Retain candidate artifacts, provenance and diagnostics separately from tracked inputs. Present the forecast and evidence without claiming publication, merging or enabling automatic merge.
- Use the repository-provided ephemeral `GITHUB_TOKEN` for candidate writes; document required repository permissions and any human approval of resulting PR workflow runs.

This Change realizes exactly `A-updates` in the [global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), examined at `main` commit `60f7decb1184b440b3421477f6aa954c05058c14`, Allocation SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`. The [coverage mapping](coverage.md) records its full qualified contributions and both directions of derivation. User approval in the 2026-10-11 project conversation confirms the preparation sequence; existing upstream authority supplies the product obligations. One PR per preparation is a proposed realization default, not a new product responsibility.

## Capabilities

### New Capabilities

- `distribution-candidates`: manually initiated, deterministic preparation of exact upstream combinations into verified, traceable candidate PRs.

### Modified Capabilities

None. Existing `upstream-inputs`, `browser-build`, `browser-package`, `browser-acceptance` and `distribution-release` requirements are consumed without revision.

## Impact

Implementation will add candidate orchestration under `tools/updates/` and a `workflow_dispatch` workflow, register offline control tests in `tools/test-repository.sh`, and document candidate invocation/handoff. It reuses `tools/inputs.sh resolve`, `tools/release/policy.mjs`, `tools/release/state.mjs`, `tools/release/run.mjs` qualification helpers and `tools/acceptance/run.mjs`. Existing actions and harness dependencies retain pinned identities; no new runtime dependency is planned.

This proposal does not implement A-watch, A-bootstrap, new publishing policy, upstream patches or a new 42P mechanism. It does not create a real distribution candidate or authorize merge/publication. The planning PR remains a draft with an active Change until Apply, 42P Verification and Archive are complete.
