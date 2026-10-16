# Design

## Context

See [proposal.md](proposal.md) for motivation and allocation identity. A design is useful here to settle asset-copy instructions, advice about preserved upstream APIs, and the boundary between documentation layout and the common shell before Apply.

`tools/site/docs.mjs` renders README and Usage through the locked VitePress renderer into temporary pages, with stable/preview URL resolution and a source-fidelity manifest. `tools/site/example.mjs` extracts the first two JavaScript snippets from Usage and executes initialization plus Float32 SQL against the archive pinned in `docs-example.json`. `tools/build/config.mjs` names eleven runtime files; `tools/package/package.mjs` places them at the package root and includes historical README/Usage copies. The current standard theme already supplies headings, code copying, responsive navigation and contained code scrolling.

## Goals / Non-Goals

**Goals:** make the existing documentation actionable and its recommended path current, while retaining all five synchronized `site-docs` requirements and their scenarios. Keep the documented example independently pinned to `0.2.0` and preserve the separate demo selection.

**Non-Goals:** redesign the shell/theme, change demo UI or search, replace the corpus, add an API wrapper or remove Worker1 assets. This planning operation does not modify product documentation or implementation and does not invoke post-Apply Verification.

## Decisions

### Use the existing Markdown surface

Keep one opening promise, nearby canonical links to Usage and Demo, and a clear route to the existing Float32 nearest-neighbor example. Prefer ordinary Markdown headings, links and concise paragraphs. Retain the README initialization check if it remains useful; link directly to the worked vector example instead of maintaining another long SQL example. A separate landing page, custom hero component and theme/config changes are unnecessary for this correction and would cross into A-site_shell.

Shorten repeated wrapper/bundler caveats and the licensing paragraph without deleting relevant runtime boundaries, conditional OPFS prerequisites, upstream attribution or links to LICENSE/NOTICE/full third-party terms. Avoid promises about browsers or bundlers beyond the pinned baseline.

### Make asset copying concrete

Document a POSIX-shell example in the consuming project's root, after the existing versioned npm installation. Use an ordinary static-public directory such as `public/sqlite/`, created explicitly, and copy `*.js`, `*.mjs` and `*.wasm` from `node_modules/@at-rama/sqlite-vector-wasm/` there. These patterns select the eleven root runtime assets identified by the current package inventory; provenance/docs/licenses are not runtime assets. Explain that the application's server must map that directory to `/sqlite/`, serve the correct MIME types, and that other static hosts can choose an equivalent mapping. Do not imply a framework-independent automatic mapping or universal bundler support.

Before presenting the recipe as checked, execute its actual commands against the selected published package in a temporary consumer directory and compare copied names and digests with the published runtime inventory. Reuse the existing download/integrity and browser-example path where practical; avoid a new package manager, helper API or parallel manifest. Preserve Usage's first-two-JavaScript-snippet contract, or deliberately adapt its existing extractor and checks if document organization requires it.

### Separate recommendation from interface availability

Recommend a dedicated Worker importing `sqlite3.mjs` and using the direct SQLite API for new work, with an upstream API link and a short initialization example or explicit reuse of the existing initialization snippet in Worker context. Explain that SQLite now deprecates Worker1/promiser while the package continues to supply those upstream entry points for compatibility. Keep the existing promiser example secondary if retained; do not call it broken or remove runtime support. Recheck the upstream guidance during Apply and distinguish current advice from claims about pinned-version behavior.

### Preserve and exercise the documentation contract

The synchronized [site-docs specification](../../specs/site-docs/spec.md) remains the behavior contract; `skip_specs: true` avoids inventing requirements for a documentation correction. [coverage.md](coverage.md) covers the complete A-site_docs unit, including unchanged obligations, rather than just the edited paragraphs.

Reuse renderer/link tests, source-fidelity and mobile browser checks, stable/preview construction, independent integration/runtime-preservation exercises and the real pinned-example execution. Extend only the existing example path as needed to exercise the actual copy recipe. Do not add tests that merely assert editorial wording. Observe the identified PR candidate on Pages separately from local results; unavailable prerequisites remain explicit blockers. Do not claim demo-oracle or full distribution acceptance from these checks.

## Risks / Trade-offs

- Static-public conventions vary: label `public/` as one host mapping and verify the demonstrated `/sqlite/` URL rather than claiming automatic serving.
- Moving snippets can silently invalidate the existing extractor: keep the initialization/Float32 order or update the extractor coherently and execute the resulting published-runtime example.
- A stronger deprecation statement can be mistaken for removed support: explicitly retain baseline availability and qualify upstream advice.
- Presentation improvements are constrained by one README usable on GitHub and the site: accept the standard theme and avoid a second authored landing page.
- A new Demo link must stay under the candidate prefix: use the canonical site URL and exercise the existing resolver on stable and preview builds.

## Migration Plan

Apply through the existing PR/site-preview path after a separate implementation request. No runtime refresh, package release or data migration is required. Existing published archives keep their own documentation. Rollback restores the reviewed Markdown/check changes through the normal PR path; it does not alter published runtime bytes or historical Change archives.
