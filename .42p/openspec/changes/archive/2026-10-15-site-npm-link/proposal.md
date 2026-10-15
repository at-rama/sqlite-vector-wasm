# Proposal

## Why

Visitors should reach the published npm package directly from the common site navigation, beside the repository link.

## What Changes

- Add `npm` immediately after GitHub, linking to `https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm`.
- Check destination, adjacency and access through desktop navigation and the mobile menu.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-shell`: extend Common navigation and mobile presentation with adjacent npm package access.

## Impact

Future implementation touches `site/.vitepress/config.mts` and the existing shell navigation checks. No new page, dependency, runtime, release mechanism or deployment policy is introduced. The synchronized spec is changed only through the eventual delta synchronization; `.42p/openspec/changes/archive/2026-10-15-site-shell/` stays byte-identical.

## Allocation

Exactly **A-site_shell**, incremental navigation revision. Base: `b0ed026a1bffc29d5151b7742af3493ba3c2da1b`. [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) snapshot SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`; [Site Capture](../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md) snapshot SHA-256 `7e520ad3573cc84fb787229bf33ee195c19bcb6deb92998d7a63d7457c61777c`. S-site-npm is the user's explicit 2026-10-15 instruction, projected in C-site and the shell portion of C-demo-checks. Other unit obligations remain in the synchronized baseline; `coverage.md` maps the complete effective contract and the bounded delta.
