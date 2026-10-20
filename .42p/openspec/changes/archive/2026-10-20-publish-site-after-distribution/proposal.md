# Proposal

## Why

Site currently rebuilds stable directly from main on pushes, manual redeploys and PR previews. Once a candidate PR contains future documentation, those paths can expose it before distribution publication succeeds.

Allocation: `A-site_shell` only, [snapshot at 41c7d36e2f67118d507deb0005eda887bfa12334](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) (SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`). Its complete qualified Capture references apply, including unchanged boundaries. Global Capture → Allocation examination: [record](../../../../engineering/2026-10-19_release-review_derivation_edit-0.1.md). This proposal changes no other unit and authorizes no Apply, merge or publication.

## What Changes

Reuse the existing identified shared PR preview; gate stable candidate-document promotion on complete matching distribution publication; protect push/manual/preview-stable-root paths and preserve previous public docs on failed or partial publication.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-shell`: Reuse the existing identified shared PR preview; gate stable candidate-document promotion on complete matching distribution publication; protect push/manual/preview-stable-root paths and preserve previous public docs on failed or partial publication.

## Impact

`.github/workflows/site.yml` pull_request/push/manual path filters and independent stable main checkout; `tools/site/publication.mjs` assemble/guard/freshness; release workflow outcome artifacts; current Pages checks/concurrency. Stable root rebuilt from main is unsafe during the post-merge publication interval.

Dependencies: After preview-vector-release-docs and bind-release-documentation. Integration readiness also consumes prepare-reviewed-release-candidates context; deployment does not own product qualification or publication.

Existing synchronized requirements not modified by the delta remain binding within this unit; [coverage](coverage.md) records the complete effective contract and its grounding. All task checkboxes remain open.
