# Design

## Context

See `proposal.md` for motivation, Allocation identity and the user's adopted realization choices. At the planning base there is no site directory, Pages workflow or Site realization spec. `README.md` and `docs/usage.md` already exist; they are English and are downstream documentation inputs, not content to duplicate here. The repository uses small JavaScript ESM tools and a separate locked OpenSpec installation. The browser harness already provides playwright-core and Chrome; its COOP/COEP-enabled test server must not be mistaken for proof of Pages hosting conditions.

At Update base `69835da88182b5963eade2186e615f87f8236317`, the shell and main-only workflow exist in PR #57, with 8/9 Apply tasks checked. The actual-Pages check is still pending because that workflow excludes PR deployment and no candidate is published. The adopted preview decisions revise this plan; existing implementation and historical checks do not establish the revised behavior.

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

Revise `.github/workflows/site.yml` to construct one complete Pages artifact per eligible publication. For an internal PR, build the exact PR head under `/sqlite-vector-wasm/preview/` and independently build a pinned checkout of current `main` under `/sqlite-vector-wasm/`. Assemble the two isolated outputs into one clean directory: stable files at its root and candidate files under `preview/`. Never build the stable root with PR sources, tooling, dependency records or runtime selection. Each checkout uses its own locked tooling and explicitly supplied demo selection/assets; the two sides may intentionally select different published runtimes. Runtime preservation applies within each side, not as a requirement to force the preview onto main's runtime.

For relevant pushes to `main` and explicit manual main-branch redeployment, build and check only the stable root and publish a fresh artifact without `preview/`. Preserve the existing manual-main restriction. When `main` genuinely has no site yet, allow only the PR preview output; do not create a stable placeholder. Distinguish absence of the site's tracked entry points from failed dependency installation, compilation or checks: any existing stable site's failure blocks the whole deployment.

Use a base-aware preview configuration and a small preview-only identity display carrying branch and exact head commit on every destination. Set HTML robots `noindex` on every preview page, including client navigation, without adding it to the stable site. Preview remains public. Do not rely on robots.txt or disable crawling needed to observe `noindex`. Relative navigation and assets stay within the selected base; external GitHub navigation stays unchanged. Put the stable/candidate commit identities in deployment evidence so the actual-Pages check can distinguish a shared preview that has since been replaced.

PR builds and scoped checks run with read-only permissions. Only PRs whose head repository equals this repository are eligible for deployment; forks, including restricted-token automation PRs where applicable, remain build/check-only. Do not introduce `pull_request_target` execution of candidate code or a personal access token to bypass this boundary. Only a separate deployment job receives Pages/id-token write permissions and the Pages environment; build jobs receive no publication credentials. Configure Pages for GitHub Actions and allow eligible internal PR refs as well as `main` in its deployment environment. Confirm those settings during Apply; missing administrative access or deployment permission is a reported prerequisite, not a reason to relax checks.

Keep one shared publication concurrency group across all eligible PR and main runs, with no cancellation of a deployment in progress. The critical section must cover selecting/building the stable revision, assembling the final artifact and deploying it; a deployment-job-only lock after unrelated stable builds is insufficient. Recheck current main and PR-head identities before publication. Do not publish obsolete main events or prepared output whose stable baseline has advanced; rebuild from the current allowed inputs or require a fresh execution. Check PR openness and identity before publishing so a closed or superseded PR cannot restore a preview after merge. GitHub concurrency does not promise FIFO ordering; do not depend on event order. Record the check and chosen revisions with deployment evidence. Local tests must exercise delayed PR/main runs, not merely assert that a concurrency key exists.

Include `site/`, its tooling and lockfile, the workflow, README and Usage among relevant inputs; retain required existing build/check inputs and extend the list as downstream preparation integrates. Non-site edits alone trigger no automatic site publication. A newer candidate replaces the shared preview. Closing a PR without merging triggers no cleanup; the next eligible deployment determines the content. No per-PR preview directories, cleanup workflow or PR-comment bot is needed. All external actions use full commit SHAs. Do not alter `release.yml` or add a release event trigger.

Use GitHub Pages' normal artifact deployment path, not a generated-content branch. Base-aware URLs and unchanged public runtime filenames support project-prefix hosting. No service worker, custom domain, OPFS or cross-origin-isolation workaround is introduced. The in-memory demo must be checked on actual Pages by its own unit.

Rebuilding `main` deliberately avoids storing or retrieving a previous build, action-artifact retention dependencies, crawling Pages or a generated-file inventory. Stable means construction from `main` and its fixed runtime selection; it does not promise byte-for-byte identity with a previous static-site build. A shared preview is enough for current visual review; isolated per-PR hosting remains outside this Change.

### Scoped checks and publication evidence

Add offline tests for preparation/build control, prefix configuration, workflow conditions and runtime preservation, registering applicable offline tests in `tools/test-repository.sh`. Exercise a real locked VitePress build separately: offline fixture tests alone do not establish compiler compatibility. Use the existing verified browser toolchain for navigation and mobile/desktop checks against the built site served without added isolation headers; do not change that harness merely to serve the site. Exercise direct visits and client-side transitions, assets and a narrow viewport, plus docs-only/demo-only fixtures.

Extend scoped checks to assembled stable/preview output, preview-only bootstrap, a fresh stable-only artifact removing preview, internal/fork eligibility, source/lock/runtime isolation, preview identity and robots metadata, input filtering and stale-publication rejection. Exercise both URL bases with the real compiler/browser, including direct visits and client transitions. Keep a broken stable build as a failing case rather than allowing bootstrap fallback. Existing root-only browser results remain historical evidence for unchanged behavior, not a pass for these new cases.

Record actual GitHub Pages navigation/integration observations against `/sqlite-vector-wasm/preview/` and the candidate's visible commit before merge. When present, inspect the stable root and its recorded main identity separately. Bootstrap legitimately has no stable root; record that condition rather than treating absent stable content as a successful stable check. A shared URL alone is not evidence that the expected candidate was observed. Pages setup or an unavailable deployment remains an operational evidence prerequisite: report a blocked check, without fabricating evidence, relaxing gates or merging to obtain a passing report.

## Risks / Trade-offs

- VitePress adds Vue/Vite dependencies → accept the standard toolchain to reduce project-owned code; lock installation and verify a real build.
- Relative README links and Markdown syntax may need adaptation → leave rendering and link rewriting with A-site_docs; provide the common base and output locations without prematurely implementing its renderer.
- SSR or navigation can accidentally initialize a runtime globally → keep demo loading local and exercise both direct navigation and transitions when demo integrates.
- Test hosting can hide Pages constraints → serve shell tests without extra isolation headers and retain the actual deployed check.
- Initial Pages configuration/deployment may be unavailable under pre-merge gates → expose this operational prerequisite in evidence; do not count local checks as public deployment.
- Two checkouts/builds cost extra CI time → accept that bounded cost to avoid durable build storage or a generated-content branch.
- One shared preview can change during review → show and record the exact candidate commit; recheck identity when collecting actual-Pages evidence.
- A delayed run can publish stale stable content or resurrect a merged preview → serialize the complete publication sequence and reject stale main/head or closed-PR inputs before deployment.

## Migration Plan

Retain the implemented shell and unavailable slots, then apply the revised dual-build/preview workflow, metadata, checks and contributor guide through `/openspec-apply-change site-shell`. Configure the Pages environment for the eligible pre-merge deployment and perform the actual candidate check. The first deployment is preview-only while `main` lacks the site. Documentation and demo integrate independently through their own Changes after this shell. Obtain satisfactory post-Apply Verification and archive before human integration under the existing gates. Main-branch deployment then publishes only the stable root. Roll back through a reviewed main-branch source/configuration revision and redeploy with its explicit runtime selection; never rebuild or republish the distribution as a rollback side effect. This Update invocation changes planning/coverage only and performs no implementation, deployment or later lifecycle step.
