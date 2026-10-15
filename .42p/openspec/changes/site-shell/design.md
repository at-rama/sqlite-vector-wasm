# Design

## Context

See `proposal.md` for motivation, Allocation identity and the user's adopted realization choices. At the planning base there is no site directory, Pages workflow or Site realization spec. `README.md` and `docs/usage.md` already exist; they are English and are downstream documentation inputs, not content to duplicate here. The repository uses small JavaScript ESM tools and a separate locked OpenSpec installation. The browser harness already provides playwright-core and Chrome; its COOP/COEP-enabled test server must not be mistaken for proof of Pages hosting conditions.

This design is required because the Change introduces VitePress and crosses source preparation, common UI, CI and deployment boundaries.

## Goals / Non-Goals

**Goals:** Keep construction conventional, preserve VitePress's default presentation, and expose stable file-based integration points. Make runtime preservation independent of whether docs or demo are integrated first.

**Non-Goals:** No general plugin system, custom generator/theme, documentation search, localization setup, engine build, runtime selection service or generic release promotion pipeline. No implementation of the README renderer, usage example or emoji demonstration in this unit.

## Decisions

### Standard VitePress, private tooling and temporary output

Use VitePress's standard theme and normal Markdown/Vue support. Registry metadata inspected during planning reports stable `1.6.4` and prerelease `2.0.0-alpha.20`; select stable `1.6.4`, record it exactly in a private `tools/site/package.json`, and commit its npm lockfile during Apply. Record any direct peer dependencies exactly as needed by that selected version. Use a supported Node version pinned in the eventual workflow. Dependency installation and generated files remain under `.work/site/`, following the existing tooling pattern; do not reuse OpenSpec's dependency tree.

`site/` holds authored page slots, `.vitepress/config.mts` and any necessary small style override. The build helper copies these into a clean temporary source tree, uses the temporary locked installation and emits `.work/site/dist/`. This avoids committing generated Markdown, runtime binaries, dependency directories or VitePress caches. Commands are exposed through a small `tools/site.sh` entry point for install, build and scoped checks, consistent with existing repository entry points.

A custom Node generator was considered but would make the project maintain rendering and presentation machinery. Eleventy would require more layout work. The default VitePress theme meets the current need; no theme extension is planned merely to establish a future customization point.

### Three fixed destinations and conventional navigation

Use `/`, `/usage/` and `/demo/` relative to a configured base, initially `/sqlite-vector-wasm/`. Configure English labels Presentation, Usage, Demo and GitHub ↗; keep the standard responsive navigation. Disable an unnecessary sidebar and leave search unconfigured. Use ordinary document layouts for docs and a page layout for the future demo; no custom routing layer is needed.

Initially each content slot contains only a concise unavailable notice. It is not a second project presentation or a substitute Usage guide. Downstream docs replaces the two documentation slots from its single sources at build time; downstream demo supplies its page/component and prepared public assets. Keep this a concrete preparation sequence over ordinary files, not a registry of plugins or invented application API. Either downstream preparation can be absent without breaking the other. Client-only runtime initialization belongs in the future demo, not in the global theme or navigation.

### Preserve a supplied runtime selection, do not discover latest

Reserve `site/demo-runtime.json` as the future demo-owned explicit selection input and `public/demo-runtime/` in the prepared tree as the unchanged runtime asset location. The selection needs only the selected release identity and corresponding archive/asset integrity information; A-site_demo will supply its precise schema and acquisition. The shell does not invent that schema or implement acquisition now. Its build path accepts prepared assets, carries the selection with the deployment and never queries a floating `latest` endpoint. Absence of an integrated demo is a normal shell-only state.

An explicit demo update resolves the latest stable under A-site_demo, updates its selection, and supplies matching assets. Rebuilding after a README/Usage edit uses that same selection and bytes. Assets may be reacquired from the exact pinned published archive by demo-owned preparation; pre-existing local output is never necessary. Runtime files are copied as public assets, not rebundled by Vite. If an integrated selection is supplied without matching assets, fail the build rather than silently switching versions or accepting stale output.

The shell preservation check uses two deliberately distinct synthetic runtime selections and known asset digests. An injected newer candidate must not change the fixed selection during a documentation-only rebuild. These fixtures establish shell behavior, not real archive acquisition, WASM loading or vector correctness. The real demo later plugs into the same preparation/build path.

### Dedicated build and Pages deployment

Add `.github/workflows/site.yml`. PRs validate the proposed build and scoped checks with read-only permissions, without deployment or distribution publication. Relevant pushes to `main` and manual main-branch redeployment build and check the site, then upload/deploy a Pages artifact. Include `site/`, its tooling and lockfile, the workflow, README and Usage among relevant inputs; account for downstream preparation inputs as they integrate. All external actions use full commit SHAs. Only the deployment job receives Pages/id-token permissions and the Pages environment; use one deployment concurrency group. Do not alter `release.yml` or add a release event trigger.

Use GitHub Pages' normal artifact deployment path, not a generated-content branch. Base-aware URLs and unchanged public runtime filenames support project-prefix hosting. No service worker, custom domain, OPFS or cross-origin-isolation workaround is introduced. The in-memory demo must be checked on actual Pages by its own unit.

### Scoped checks and publication evidence

Add offline tests for preparation/build control, prefix configuration, workflow conditions and runtime preservation, registering applicable offline tests in `tools/test-repository.sh`. Exercise a real locked VitePress build separately: offline fixture tests alone do not establish compiler compatibility. Use the existing verified browser toolchain for navigation and mobile/desktop checks against the built site served without added isolation headers; do not change that harness merely to serve the site. Exercise direct visits and client-side transitions, assets and a narrow viewport, plus docs-only/demo-only fixtures.

Record actual GitHub Pages navigation/integration observations in post-Apply evidence. Local prefix tests do not substitute for this check. Pages setup or a deployment unavailable before the first main integration is an operational evidence prerequisite: if no approved candidate deployment is possible, report the post-Apply check blocked and resolve the deployment prerequisite with the human; do not fabricate evidence, relax gates or merge merely to obtain a passing report.

## Risks / Trade-offs

- VitePress adds Vue/Vite dependencies → accept the standard toolchain to reduce project-owned code; lock installation and verify a real build.
- Relative README links and Markdown syntax may need adaptation → leave rendering and link rewriting with A-site_docs; provide the common base and output locations without prematurely implementing its renderer.
- SSR or navigation can accidentally initialize a runtime globally → keep demo loading local and exercise both direct navigation and transitions when demo integrates.
- Test hosting can hide Pages constraints → serve shell tests without extra isolation headers and retain the actual deployed check.
- Initial Pages configuration/deployment may be unavailable under pre-merge gates → expose this operational prerequisite in evidence; do not count local checks as public deployment.

## Migration Plan

Implement the shell and unavailable slots first, then run its scoped checks and the repository gateway. Documentation and demo integrate independently through their own Changes after this shell. Obtain satisfactory post-Apply Verification and archive before human integration under the existing gates. Later main-branch deployments use the dedicated workflow. Roll back site source/configuration to a reviewed prior revision and redeploy with its explicit runtime selection; never rebuild or republish the distribution as a rollback side effect.
