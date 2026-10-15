# Proposal

## Why

The project needs a common public web envelope before its documentation and browser demonstration can be integrated independently. A small VitePress site on GitHub Pages supplies that envelope without maintaining a custom site generator or coupling documentation edits to runtime upgrades.

## What Changes

- Build the static site with VitePress's standard theme, English navigation and minimal mobile-adapted styling.
- Supply Presentation, Usage and Demo destinations plus a direct GitHub link, respecting the GitHub Pages project prefix.
- Add PR validation and a separate Pages deployment workflow for integrated site changes and manual redeployment.
- Define bounded integration points for documentation sources and demo assets; preserve the demo's selected published runtime during documentation-only deployment.
- Check navigation, mobile presentation, deployed integration and runtime-identity preservation without implementing either downstream unit.

## Capabilities

### New Capabilities

- `site-shell`: Common static construction, navigation, deployment and preservation of the integrated demo runtime identity.

### Modified Capabilities

None. Distribution and browser-acceptance requirements retain their existing scope.

## Impact

Future implementation concerns `site/`, `tools/site/`, a dedicated locked npm tooling manifest, a Pages workflow and scoped tests. Generated content belongs in ignored `.work/`. No package API, engine build, publication workflow or canonical distribution changes are planned. README rendering and the existing `docs/usage.md` belong to `A-site_docs`; corpus, runtime selection/acquisition, vector execution and demonstration UI belong to `A-site_demo`.

## Allocation and adopted realization choices

This Change realizes exactly `A-site_shell` from [the Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`, at base commit `f59a1ddd083641ec7471e4fa89f48455dcedaf2c`. Its complete qualified references are Site `C-site`, scoped `C-readme`, `C-demo-release`, `C-demo-checks` and `Q-realization` in [the Site Capture](../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`.

On 2026-10-15 the user explicitly validated VitePress's standard theme, English for the first site and explicit demo refresh selecting the latest stable, preserved across documentation updates. These select realization options left open by Q-realization; they do not transfer demo release selection to the shell. No bilingual site, theme redesign, search plugin or automatic distribution-to-site publication coupling is introduced. The full pre-Apply mapping is recorded in `coverage.md`.
