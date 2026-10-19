# Proposal

## Why

The existing demo worker and identity checks use sqlite-vec native SQL, while the adopted public product target is Vector. Its published-only runtime rule requires an explicit later refresh, separate from candidate documentation preview.

Allocation: `A-site_demo` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

## What Changes

Adapt native Vector SQL/version identity and independent binary/Hamming/Float32-cosine checks; keep the complete existing corpus and UI; explicitly refresh only from an actually published stable Vector archive.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-demo`: Adapt native Vector SQL/version identity and independent binary/Hamming/Float32-cosine checks; keep the complete existing corpus and UI; explicitly refresh only from an actually published stable Vector archive.

## Impact

`site/demo/demo-worker.mjs`, demo client/data logic, `tools/site/demo.mjs`, `tools/site/demo-runtime.json`, site/demo tests and checks. Current selection is published vec 0.2.0 and must remain truthful until a real stable Vector archive exists.

Dependencies: Runtime dependency: actual stable Vector publication after the release-review chain, not merely implementation of those changes. No reverse dependency: candidate docs and first Vector product publication do not require demo refresh.

Existing synchronized requirements not modified by the delta remain binding within this unit; [coverage](coverage.md) records the complete effective contract and its grounding. All task checkboxes remain open.
