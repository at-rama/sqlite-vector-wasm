# Proposal

## Why

The public Demo page is still an unavailable notice: visitors cannot exercise the published SQLite/sqlite-vec runtime. A small emoji explorer will demonstrate actual browser vector searches and the effect of binary quantization using a familiar, precomputed corpus.

## What Changes

- Realize exactly **A-site_demo** from the [current Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`, read at main `08b5f690259a6c60e6e9c3dbcba6fef5152d4acb`.
- Replace the Demo notice with English textual emoji discovery, six clickable vector neighbors, copying and Binary/Float32 selection in the existing mobile-adapted site.
- Prepare the complete emoji2vec corpus from an identified revision, preserving attribution and MIT notice; derive binary vectors from the same original 300-component Float32 vectors and identifiers.
- Acquire an explicitly selected, actually published stable archive without rebuilding it; preserve the selected runtime across documentation updates and expose observed SQLite/sqlite-vec versions and the release link.
- Load the in-memory binary demo on entry and Float32 on first selection; reveal actual SQL, distances and measured execution information in a collapsible panel.
- Check a few searches per mode against independently calculated distances, accepting equally close neighbors without requiring a special UI ordering.

## Capabilities

### New Capabilities

- `site-demo`: the published-runtime emoji demonstration, including pinned data/runtime preparation, both vector modes, exploration and scoped real-browser checks.

### Modified Capabilities

None. Consume the existing `site-shell` integration and preservation behavior and leave `site-docs` requirements unchanged.

## Impact

Implementation will affect `site/demo/`, local Vue components and a demo Worker, `tools/site/` preparation/check tooling and version records, `docs/site.md`, and the existing Site workflow's integration steps and evidence. Generated data, runtime assets and acquired inputs remain in ignored work directories; source identities and transformation code are tracked. Existing extraction/integrity utilities may be reused without changing the independently pinned Usage example.

The user's 2026-10-16 exploration adopts these realization choices within the Site Capture's Q-realization: Vue/native controls, a dedicated Worker, prepared catalogue/binary/Float32 payloads, deferred Float32, actual-operation diagnostics and simple tie-tolerant checks. No public conversation permalink is available. These choices refine the allocated demo rather than change upstream product requirements. See [coverage.md](coverage.md) for its complete planning correspondence.

No package API, engine rebuild, model inference, remote embedding service, persistence, new distribution channel or semantic-quality target is introduced. This request produces planning artifacts only; implementation, post-Apply Verification, archive and human integration remain subsequent actions.
