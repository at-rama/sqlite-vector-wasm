# Proposal

## Why

A candidate can currently be built/qualified by dispatch, generic Acceptance and a Release exercise, while Site waits for a separate producer. This duplicates expensive qualification and makes readiness dependent on polling unrelated workflows.

## What Changes

- Realize exactly A-acceptance at Allocation `85585a833b4cd37959f8ad841109f7b2e4c45c1e`.
- Produce one complete exact-head candidate archive in the PR's Acceptance composition job, preserving every production/browser case and archive/source identity check.
- Pass that archive directly to dependent Site jobs in the same run; execute the documentation example there once. Keep exact artifact/report validation and effective readiness through the existing required result.
- Remove the redundant Release PR exercise and automatic main Acceptance rebuild; definitive integrated qualification remains Release-owned.
- Transfer the candidate qualifier invocation out of dispatch as a necessary producer interface. A-updates' companion Change owns coherent preparation and the qualification-pending PR presentation; source/notice policy is unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `browser-acceptance`: single current-PR producer and exact shared handoff, with complete production/browser evidence retained.

## Impact

Acceptance candidate producer/entry point, workflow dependencies, Site's candidate input, Release review adapter and their tests. The companion prepare-unqualified-candidate-pr contract supplies the preparer's new boundary before this producer is activated. No product test omission, numbering/security change, new runtime, live publication or general retry engine.
