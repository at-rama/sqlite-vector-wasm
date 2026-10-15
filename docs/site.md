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

Presentation is generated from the README and Usage from `docs/usage.md` on every build. Demo remains unavailable until its own implementation is supplied. No second documentation copy is maintained.

## Integrating documentation and the demo

Authored shell sources live in `site/`. `tools/site/docs.mjs` renders README and `docs/usage.md` with the locked VitePress Markdown renderer into temporary `index.md` and `usage/index.md`. Rendered HTML is marked `v-pre` so Vue cannot interpret literal documentation content. Do not maintain a second copy of their content. The demo work supplies `demo/index.md`, any Vue components and its prepared public assets. Initialize browser-only code locally in the demo, using `onMounted` or `ClientOnly`, rather than in the global theme.

The shell accepts an ordinary prepared directory overlaid onto its temporary source tree:

```sh
sh tools/site.sh build --prepared .work/site-input
```

Prepare that directory before invoking the command, outside `.work/site/`. Its paths are relative to the site root, such as `usage/index.md` or `public/demo-runtime/`. Either documentation or demo inputs can be supplied without the other. Symlinks and nonregular input files are rejected. Normal builds always prepare the two real documentation sources after this overlay, preserving supplied demo content and runtime files. Shell fixture tests explicitly use synthetic documentation instead.

An integrated demo supplies its opaque `demo-runtime.json`, unchanged runtime files under `public/demo-runtime/`, and a standard SHA-256 sidecar `demo-runtime.sha256` covering the selection file and every runtime file. The sidecar uses lowercase digest, two spaces, then the site-relative filename, one entry per line. This transport check does not define the demo's selection/acquisition JSON schema. Missing, altered, duplicate or unlisted assets fail construction and clear previous generated output. The selection is copied to the public `demo-runtime.json`; runtime files bypass Vite rebundling, and emitted digests are compared with the supplied inventory.

The demo work owns resolving the latest stable on an explicit refresh and preparing the corresponding published archive. A documentation update keeps that selection and those bytes; it may reacquire the exact pinned archive but must not query a floating latest version. The shell does no release discovery or runtime download. An absent demo needs neither runtime assets nor a release selection.

## Browser and preservation checks

The offline tests run with `sh tools/test-repository.sh`. A real compiler/browser exercise is separate and requires the [qualified browser harness](../.42p/engineering/2026-10-04_sqlite-vec-wasm_technical_architecture_edit-0.1.md), its Linux system prerequisites and network access for initial installation:

```sh
export HARNESS_STATE="$(mktemp -d /tmp/sqlite-site-harness.XXXXXX)/tools"
bash tools/harness.sh install
bash tools/harness.sh deps
bash tools/harness.sh exec sh tools/site.sh check
bash tools/harness.sh exec sh tools/site.sh exercise
```

`check` serves the built output at the real project prefix on loopback, without COOP/COEP headers. Chrome checks all three destinations directly and through client-side transitions at 1280px and 390px, the responsive menu and GitHub link, asset errors and page overflow. `exercise` builds docs-only, demo-only and documentation-update fixtures, checks wide-code scrolling, compares fixed selection/runtime digests despite a distinct newer candidate, and rejects a corrupted asset. It finishes by rebuilding the real repository site. Results and a mobile screenshot remain in `.work/site/`.

The fixtures use a synthetic JavaScript module, not a published engine, emoji corpus or vector oracle. The exercise additionally checks real README/Usage content, code, links, anchors and mobile layout at stable/preview prefixes and preserves synthetic demo digests across an actual README edit. External image destinations are retained; third-party image availability is not an internal-link check. These checks do not establish demo correctness or distribution acceptance.

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

README and Usage links to each other use the canonical stable site URLs, so GitHub and installed-package readers reach the public pages. During construction, own-site URLs and relative links to these two documents stay under the current stable/preview prefix. Repository-only relative files point to the exact build commit on GitHub. Relative images become source-relative copied assets. Missing local files or anchors fail construction with the authored source and destination; external URLs and literal code are preserved. `site-docs.json` records source hashes and expected rendered text, headings, code, images and links for the browser checks. No runtime is acquired by a normal documentation build.

The browser example has its own explicit dependency record, `tools/site/docs-example.json`, initially published version 0.2.0. It is separate from demo selection. To check the renderer fixtures and execute the actual guide initialization and Float32 SQL snippets:

```sh
node --test tools/site/checks/*.test.mjs
bash tools/harness.sh exec sh tools/site.sh example
```

`example` downloads the pinned publication record and archive, verifies their SHA-256 values and identities, extracts only the eleven declared regular runtime members, checks their hashes, and serves them unchanged on loopback. Chrome executes the snippets extracted from Usage, checks the two expected neighbors/distances and SQLite/sqlite-vec versions, then rechecks runtime hashes. `.work/docs-example/result.json` records the selected archive, guide/snippet hashes and observed results. A download, integrity or execution failure fails the command. This scoped example establishes no OPFS, Worker, complete API or emoji-demo acceptance.

Refreshing the documented version is an explicit source revision: verify the chosen published release, update the dependency record and README/Usage version/install instructions together, then rerun renderer, browser and example checks. A newer release alone does not change it. The Site workflow retains example results separately from deployed-documentation observations.


Copied documentation images enter the VitePress compiler with source-root public asset URLs. Vite applies the selected stable/preview prefix once; the browser manifest records that final destination. The compiler/browser exercise includes relative inline/reference SVGs, a filename with an encoded space, query/fragment preservation and source-relative Usage images under both bases. It decodes the emitted images, compares the copied SVG bytes and rejects a missing source image without retaining stale output.
