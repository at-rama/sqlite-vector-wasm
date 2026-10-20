# Building and deploying the site

The public site uses VitePress 1.6.4 with its standard theme, English navigation and the GitHub Pages prefix `/sqlite-vector-wasm/`. Site tooling is private to this repository and does not compile or publish the browser runtime.

## Local construction

Use Node.js 24.19.0 (the CI version) and npm. From the repository root:

```sh
sh tools/site.sh install
node --test tools/site/tests/*.test.mjs
sh tools/site.sh build
```

Installation copies the tracked private manifest/lockfile to `.work/site/` and runs `npm ci`. Construction starts with a clean `.work/site/src/` and emits `.work/site/dist/`; `.work/site/build.json` records the runtime asset inventory, or `null` when no demo is integrated. Generated content, dependencies and runtime files are not committed. Do not run concurrent installs/builds in one checkout.

Presentation is generated from the README and Usage from `docs/usage.md` on every build. Démo is temporarily a static notice that the demonstration is being refactored for SQLite-Vector, with a Usage link. It loads no demo Worker, JS/WASM runtime or corpus, and requires no replacement engine publication.

## Integrating documentation and the placeholder

Authored shell sources live in `site/`. `tools/site/docs.mjs` renders README and `docs/usage.md` through the locked VitePress Markdown renderer; `v-pre` preserves literal content. No second authored documentation copy is maintained. The Démo route and shared mobile navigation remain present.

The shell still accepts ordinary prepared documentation outside `.work/site/` through `sh tools/site.sh build --prepared DIRECTORY`. Symlinks/nonregular inputs are rejected. The ordinary placeholder build supplies no runtime or corpus overlay and performs no old-runtime acquisition. The generic shell checksum transport remains available to independent synthetic integration checks and a future explicitly qualified demo; it does not select or acquire a runtime. The future complete demo and its published-stable runtime qualification are separate work.

## Browser and preservation checks

The offline tests run with `sh tools/test-repository.sh`. A real compiler/browser exercise is separate and requires the [qualified browser harness](../.42p/engineering/2026-10-04_sqlite-vec-wasm_technical_architecture_edit-0.1.md), its Linux system prerequisites and network access for initial installation:

```sh
export HARNESS_STATE="$(mktemp -d /tmp/sqlite-site-harness.XXXXXX)/tools"
bash tools/harness.sh install
bash tools/harness.sh deps
bash tools/harness.sh exec sh tools/site.sh check
bash tools/harness.sh exec sh tools/site.sh exercise
```

`check` serves the built output at the project prefix on loopback without COOP/COEP. Chrome checks direct and client-side navigation at 1280px and 390px, mobile menus, GitHub/npm and documentation links, overflow, asset errors and absence of demo runtime/corpus requests or Workers. `exercise` checks prepared documentation, placeholder preservation across stable/preview/documentation rebuilds, complete artifact assembly and generic supplied-asset integrity failures. Relative-image and missing-link checks remain. Results and screenshots stay under `.work/site/`.

Placeholder checks do not count as vector execution, published-runtime qualification or distribution acceptance. Future demo reinstatement still requires its complete independent runtime checks.

## GitHub Pages

The [Site workflow](../.github/workflows/site.yml) deploys complete artifacts with the official Pages actions. No build is committed and no generated-content branch is used.

| Execution | Project root | `/preview/` |
| --- | --- | --- |
| Relevant internal PR | Independently built from current `main` | Exact PR-head build |
| First internal PR while `main` has no site | No stable page | Exact PR-head build |
| Relevant main push or manual main redeployment | Main build | Absent |
| Fork or restricted-token Dependabot PR | No publication; build and checks only | No publication |

The stable URL is <https://at-rama.github.io/sqlite-vector-wasm/> and the single shared preview is <https://at-rama.github.io/sqlite-vector-wasm/preview/>. Preview pages display the branch and full commit and declare robots `noindex`; they remain publicly accessible. A new eligible deployment replaces the shared preview. Closing a PR without merging performs no cleanup; existing content remains until the next deployment.

Only changes to site sources, tooling and locks, workflow, build/check prerequisites, README, Usage and site guidance automatically run Site. Extend that input list when downstream documentation/demo preparation integrates. A manual run publishes only when started on `main`.

### Repository setup

An administrator must set **Settings → Pages → Build and deployment → Source → GitHub Actions**. In **Settings → Environments → github-pages → Deployment branches and tags**, allow both `main` and PR runs. With **Selected branches and tags**, add branch patterns `main` and `refs/pull/*/merge`; the latter matches the workflow event ref, even though the candidate checkout builds the exact PR head. See [GitHub's deployment branch rules](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments#deployment-branches-and-tags). Retain any applicable review policy and approve a waiting deployment if required. Do not remove protected-main integration gates.

Build and live-observation jobs have read-only permissions. Only the deployment job receives `pages: write` and `id-token: write`, uses the Pages environment and invokes the official deployment action. No personal access token or `pull_request_target` candidate execution is used. The normal `GITHUB_TOKEN` cannot enable Pages automatically; missing setup must be resolved by an administrator. The connector used for development may not expose these administrative settings.

### Construction and publication

For an internal PR, two isolated checkouts use their own sources, tooling locks and explicit runtime selections. The stable side runs its own install/build commands. The candidate builds at the preview base with its branch/commit identity. The assembly helper copies stable files to the artifact root and candidate files to `preview/`, validates runtime digests and records the selected revisions in `site-publication.json`. It never substitutes candidate runtime assets for the stable selection. Rebuilding stable does not promise byte-identical static files to an earlier deployment; the source is `main` and its runtime remains pinned.

If main genuinely has no tracked site entry points, bootstrap publishes only the preview. Partial stable sources or a failed stable build block publication instead of silently removing the root. A main deployment starts from a clean artifact and therefore removes any preview.

One workflow-level concurrency group covers stable selection/build, assembly, deployment and observation. Pending-run order is not assumed. Read-only API guards reject advanced-main baselines, superseded PR heads and closed PRs, both after assembly and immediately before publication. A rejected run must be rerun with current inputs; it does not publish stale output. Each run's summary links to the site/preview and records its revisions.

The workflow retains compiler/browser/assembly results, revision metadata and screenshots for 30 days. After successful deployment a separate read-only job observes the public Pages URLs, compares `site-publication.json` before and after browser checks, verifies the exact preview identity and preserves `site-live-<run-id>` evidence. Replaced shared content is a failed observation, not evidence for another commit.

### Local preview and actual Pages checks

Build a preview from a checkout with the same locked dependencies:

```sh
preview_commit=$(git rev-parse HEAD)
preview_branch=$(git branch --show-current)
sh tools/site.sh build --preview "$preview_branch" "$preview_commit"
bash tools/harness.sh exec sh tools/site.sh check --preview "$preview_branch" "$preview_commit"
```

To check an actual published preview, use the branch and full commit displayed by the intended deployment:

```sh
bash tools/harness.sh exec sh tools/site.sh check \
  --url https://at-rama.github.io/sqlite-vector-wasm/preview/ \
  --preview "$preview_branch" "$preview_commit"
```

For a complete stable/preview observation, supply the deployment record downloaded from its `site-checks-<run-id>` artifact:

```sh
bash tools/harness.sh exec node tools/site/observe.mjs \
  https://at-rama.github.io/sqlite-vector-wasm/ \
  evidence/pages/site-publication.json .work/site/live-pages.json
```

Record the URL, selected revisions and actual outcomes. Local serving, successful compiler tests and passing configuration checks do not establish actual Pages success. If Pages setup, environment permission or the deployment is unavailable, the actual-Pages task stays open. Do not merge merely to obtain evidence.

For redeployment, manually run Site on `main`; it retains that checkout's selected demo runtime. For rollback, restore reviewed site sources/configuration and the corresponding explicit demo selection through the repository integration path, then redeploy. Do not compile or republish the package to roll back the site.

## Documentation links and example

README and Usage links to each other use the canonical stable site URLs, so GitHub and installed-package readers reach the public pages. During construction, own-site URLs and relative links to these two documents stay under the current stable/preview prefix. Repository-only relative files point to the exact build commit on GitHub. Relative images become source-relative copied assets. Missing local files or anchors fail construction with the authored source and destination; external URLs and literal code are preserved. `site-docs.json` records source hashes and expected rendered text, headings, code, images and links for the browser checks. Documentation rendering itself acquires no runtime; an integrated site build separately prepares the demo's pinned assets.

The browser example uses its own explicit profile, `tools/site/docs-example.json`, independently of demo selection. A candidate profile requires the exact-head qualified archive bundle; a published profile names a digest-bound existing publication. To check renderer fixtures and execute the guide’s actual initialization/Float32 snippets with an available candidate bundle:

```sh
node --test tools/site/checks/*.test.mjs
bash tools/harness.sh exec sh tools/site.sh example --candidate-bundle /absolute/path/to/acceptance/run-directory
```

`example` verifies the qualified candidate handoffs/archive or downloads and verifies an explicit published selection, then installs the exact local archive in a temporary consumer using offline npm with lifecycle scripts disabled. It executes the asset-copy commands extracted from Usage, checks the eleven copied runtime names and hashes, and serves `public/` on loopback. Chrome executes the guide's initialization and Float32 SQL in both the page and a dedicated module Worker, checks the two expected neighbors/distances and SQLite and selected-engine versions, then rechecks runtime hashes. `.work/docs-example/result.json` records the selected archive, guide/snippet/copy-command hashes, copied inventory and observed results. A download, integrity, copy or execution failure fails the command. This scoped example establishes no OPFS, complete Worker/API or emoji-demo acceptance.

The rendered header and install command follow the explicitly checked identity without rewriting authored instructions after publication. A completed publication supplies an explicit published selection through `SITE_DOCUMENTATION_SELECTION`; a newer unrelated release does not silently change it. Candidate rendering checks the source/commit/lock identities and rejects stale or missing execution evidence. Historical example replays are separate records and cannot authorize the current preview. The Site workflow retains example results separately from deployed-documentation observations.


Copied documentation images enter the VitePress compiler with source-root public asset URLs. Vite applies the selected stable/preview prefix once; the browser manifest records that final destination. The compiler/browser exercise includes relative inline/reference SVGs, a filename with an encoded space, query/fragment preservation and source-relative Usage images under both bases. It decodes the emitted images, compares the copied SVG bytes and rejects a missing source image without retaining stale output.

## Deferred demo refactoring

The placeholder does not prepare a runtime or corpus. Reusable pinned corpus/reference material remains in `tools/site/demo-data.*` and `tools/site/demo-reference.*` for the future refactoring; it is not part of active Site construction or qualification. Reinstatement requires a separately qualified published-stable SQLite-Vector demonstration.

## Publication-ordered documentation

The shared preview still identifies the exact PR branch and commit. Its stable
root is built from a separately checked-out eligible public source, rather than
assuming current main is already published. Candidate previews consume the
original Updates-qualified archive; unpublished tooling PRs consume an exact-head
publisher-free Release exercise. This selection does not depend on active OpenSpec
files and does not authorize distribution publication.

For a merged Vector candidate, Site verifies the descriptor, source lock,
preparation, integrated human PR, exact Release workflow attempt and digest-checked
publication handoff. Complete matching GitHub and npm destinations, final-archive
documentation checks and the published provenance are required. An exercise,
failed or partial publication, an unrelated completion or unknown eligibility
cannot promote candidate documentation. A read-only visibility recheck can
complete an already published identity; Site never republishes it.

Pushes, manual main redeployments and stable roots for other PR previews use the
same selection. While publication is pending, the previous source is resolved
from the existing Pages publication record and Git ancestry, then its declared
publication and actual archives are reverified. If no eligible source can be
established, deployment stops and existing Pages stays unchanged. Ordinary
documentation-only changes for an already published selected version remain
deployable. No new version ledger, main-branch write or engine build is involved.

The existing github-pages concurrency group covers selection through observation.
Immediately before deployment, main/PR freshness and stable publication
eligibility are checked again. A changed selection rejects a delayed artifact.
The complete artifact records observed main separately from the stable content
source and preserves that source's explicit demo selection. A documentation
promotion never selects a newer demo runtime.

A Distribution release completion triggers Site through workflow_run only after
this workflow is integrated on main. Qualification-only completions without a
product publication handoff are ignored. This trigger's event and artifacts are
inputs to validation, not authority by themselves. Forks and Dependabot retain
validation without Pages deployment permissions.
