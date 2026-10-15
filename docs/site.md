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

The initial three destinations contain concise unavailable notices. The common navigation and responsive theme are functional; these notices do not claim that the presentation, Usage content or browser demonstration has been integrated.

## Integrating documentation and the demo

Authored shell sources live in `site/`. The documentation work supplies `index.md` and `usage/index.md` from the README and the existing `docs/usage.md`; it owns rendering, relative-link rewriting and example checks. Do not maintain a second copy of their content. The demo work supplies `demo/index.md`, any Vue components and its prepared public assets. Initialize browser-only code locally in the demo, using `onMounted` or `ClientOnly`, rather than in the global theme.

The shell accepts an ordinary prepared directory overlaid onto its temporary source tree:

```sh
sh tools/site.sh build --prepared .work/site-input
```

Prepare that directory before invoking the command, outside `.work/site/`. Its paths are relative to the site root, such as `usage/index.md` or `public/demo-runtime/`. Either documentation or demo inputs can be supplied without the other. Symlinks and nonregular input files are rejected. Downstream Changes will connect their own preparation to the production build; there is no plugin registry or downstream implementation in the shell.

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

The fixtures use a synthetic JavaScript module, not a published engine, emoji corpus or vector oracle. These checks do not establish real WASM execution, demo correctness, README/Usage fidelity or distribution acceptance.

## GitHub Pages

Configure the repository's **Settings → Pages → Source** as **GitHub Actions**. The dedicated [Site workflow](../.github/workflows/site.yml) validates relevant pull requests with read-only permissions. Relevant pushes to `main`, or a manual run on `main`, build and check the site before uploading the Pages artifact. Only the deployment job receives Pages/id-token write permissions and uses the `github-pages` environment. Actions are pinned to commit identities; no package release workflow or release-triggered refresh is involved.

The workflow preserves build/browser result artifacts for 30 days. Local results do not establish hosted-CI success. Check the actual deployed site separately with the same qualified browser environment:

```sh
bash tools/harness.sh exec sh tools/site.sh check --url https://at-rama.github.io/sqlite-vector-wasm/
```

Record the deployed revision, URL and observations. Before the initial main integration, Pages configuration and a permitted candidate deployment may not yet exist. The workflow deliberately does not deploy PRs. If no approved candidate deployment is available, the actual-Pages check remains blocked; neither local serving nor merging to obtain evidence counts as a passing check. Resolve that operational prerequisite before claiming full realization.

For redeployment, manually run Site on `main`; it retains the selected demo runtime. For rollback, restore reviewed site sources/configuration and the corresponding explicit demo selection through the repository integration path, then redeploy. Do not compile or republish the package to roll back the site.
