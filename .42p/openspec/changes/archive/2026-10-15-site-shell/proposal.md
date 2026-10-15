# Proposal

## Why

The project needs a common public web envelope before its documentation and browser demonstration can be integrated independently. Visual changes also need an actual GitHub Pages candidate before merge: validating only a local build leaves the required deployed check blocked. A small VitePress site supplies that envelope without coupling documentation edits to runtime upgrades.

## What Changes

- Build the static site with VitePress's standard theme, English navigation and minimal mobile-adapted styling.
- Supply Presentation, Usage and Demo destinations plus a direct GitHub link, respecting the GitHub Pages project prefix.
- Validate relevant PRs and deploy internal PR candidates to one shared `/preview/`, alongside a stable root rebuilt from `main`; relevant main-branch deployments contain only the stable site.
- Identify the preview branch/commit, exclude preview pages from search indexing with `noindex`, and prevent obsolete deployments from restoring an older stable root. Fork PRs build and check without deployment.
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

This Change realizes exactly `A-site_shell` from [the Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`, at base commit `f59a1ddd083641ec7471e4fa89f48455dcedaf2c`. Its complete qualified references are Site `C-site`, scoped `C-readme`, `C-demo-release`, `C-demo-checks` and `Q-realization` in [the Site Capture](../../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`.

On 2026-10-15 the user explicitly validated VitePress's standard theme, English for the first site and explicit demo refresh selecting the latest stable, preserved across documentation updates. These select realization options left open by Q-realization; they do not transfer demo release selection to the shell. No bilingual site, theme redesign, search plugin or automatic distribution-to-site publication coupling is introduced. The full pre-Apply mapping is recorded in `coverage.md`.

In this project's 2026-10-15 preview discussion, the user adopted: “Les PR checkout main build stable et preview / Main build stable et rien”, then validated all three residual recommendations with “Les 3 sont validés”. This selects the deployment realization under Q-realization: official Actions artifact deployment, no generated-content branch or committed build, one shared preview identified by branch/commit with `noindex`, input-scoped triggers, serialized publication without stable-root regression, internal PR deployment only, no cleanup on unmerged PR closure, and preview-only bootstrap while `main` has no site. The user confirmed revision of this Change's five planning/coverage documents after `/openspec-update-change site-shell`. There is no public conversation permalink. These decisions supersede the earlier PR-without-deployment choice, remain within A-site_shell, and do not authorize implementation, merge or a deployment in this Update invocation.
