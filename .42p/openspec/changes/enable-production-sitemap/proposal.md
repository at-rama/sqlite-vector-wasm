# Proposal

## Why

The public VitePress site has no sitemap. Native generation can expose its stable pages while preserving the existing separation from unindexed PR previews.

## What Changes

- Generate a native production-only sitemap using the stable origin and existing project prefix.
- Check real compiled XML and stable/preview assembly, including automatic inclusion of an additional page.
- Document the sitemap location and preview policy in the contributor guide.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-shell`: add production sitemap discovery and scoped output verification. All six existing site-shell requirements and their scenarios remain part of this Change's retained contract; the addition does not replace them.

## Impact

Realizes only `A-site_shell` from the [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) at design commit `84c44b303bb8d646002ea4c5f5feeca7ee8a28cd` and Site `C-sitemap`/`S-site-sitemap`, adopted by the maintainer on 2026-11-02. Exact input hashes and complete unit coverage are recorded in coverage.md before Apply.

Product changes are limited to `site/.vitepress/config.mts`, site verification code and `docs/site.md`. Keep VitePress 1.6.4, all lockfiles, workflows, metadata, content, navigation and runtime selection unchanged. No new build job, SEO package, manual URL inventory or publication action is introduced.
