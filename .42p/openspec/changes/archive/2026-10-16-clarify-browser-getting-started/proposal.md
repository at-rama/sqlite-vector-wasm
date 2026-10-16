# Proposal

## Why

The public documentation describes the runtime accurately but leaves asset copying implicit, gives the demo little visibility, and presents Worker1/promiser without SQLite's current deprecation guidance. Improve first use and the presentation within the existing documentation responsibility.

## What Changes

- Keep README as the sole Presentation source and `docs/usage.md` as the sole Usage source.
- Put clear Usage and Demo links near the opening promise, and improve the README's hierarchy using ordinary Markdown and the existing theme.
- Give Usage a concrete, checked recipe from the installed package's eleven runtime files to a public asset directory. Keep the version explicit and explain the hosting assumptions.
- Make the first vector-search example easy to reach from the README, alongside the initialization check.
- Recommend direct SQLite API use inside a dedicated Worker for new applications. Retain accurate documentation of the distributed Worker1/promiser interfaces while stating upstream's deprecation guidance.
- Remove repetitive caveats and shorten licensing presentation while preserving scope, conditions, attribution and access to the full notices.
- Recheck source rendering, links, narrow layout, the published-version example and unchanged demo runtime selection.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This corrects the realization of the existing `site-docs` requirements without changing their semantics. The Change explicitly sets `skip_specs: true`; the complete synchronized `site-docs` specification remains applicable, as mapped in [coverage.md](coverage.md).

## Impact

Expected edits are `README.md`, `docs/usage.md` and only the documentation checks needed to exercise the new setup instructions. Keep the existing renderer, standard theme, English navigation, documented version `0.2.0` and runtime selections. No shell/theme redesign, demo filter/default-selection edit, upstream modification, runtime/API removal, package publication or Capture/Allocation revision is included. Published packages retain their historical documentation copies.

## Allocation and source decisions

Exactly **A-site_docs**, from [the current Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`, at main `2c9910a3824a942b1d8ff0e0182b93dbcb976f5e`. Its qualified [Site Capture](../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `7e520ad3573cc84fb787229bf33ee195c19bcb6deb92998d7a63d7457c61777c`, supplies C-site, C-readme, documentation C-demo-checks, C-demo-release preservation and Q-realization. These documents are derived projections, not independent authority or implementation evidence.

On 2026-10-16 the user accepted the documentation/site audit recommendations, agreed to retain existing allocation boundaries, and requested preparation of the first, documentation-only Change. The two demo-interaction improvements remain a separate future A-site_demo Change. No public conversation permalink is available. [SQLite's Worker1 documentation](https://sqlite.org/wasm/doc/trunk/api-worker1.md) currently dates Worker1/promiser deprecation to 2026-04-15; this is advice to document, not authority to remove interfaces required by the pinned browser baseline. [design.md](design.md) bounds the resulting editorial choices and evidence.
