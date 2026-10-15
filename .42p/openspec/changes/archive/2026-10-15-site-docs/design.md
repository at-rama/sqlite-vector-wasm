# Design

## Context

See [proposal.md](proposal.md) for motivation and authority. Main `65623405` integrates the VitePress 1.6.4 shell. `site/index.md` and `site/usage/index.md` are notices; README and `docs/usage.md` already contain public instructions. `prepare.mjs` copies the shell and optional prepared inputs into ignored state, checks runtime inventory and clears stale output. Existing browser checks cover navigation at 1280px/390px but do not establish documentation fidelity or actual published-runtime execution. This design is warranted by the source/rendering/build/browser boundaries and link semantics.

## Goals / Non-Goals

Connect authored documentation to the existing build and verification paths with a small deterministic transformation. Retain standard-theme English rendering. Do not redesign the README, create a second maintained page, introduce a CMS/plugin registry, implement demo behavior or broaden product acceptance. The minimal example is a check, not a fourth public interactive page.

## Decisions

### Prepare sources at build time

Add documentation preparation to the normal site construction path: README becomes `index.md`, `docs/usage.md` becomes `usage/index.md`. Generated copies exist only in ignored build state. Apply the same source-aware rendering to actual candidate/stable checkouts and explicitly qualify synthetic shell fixtures. Preserve optional demo inputs and existing inventory checks; docs production preparation must not overwrite demo content. Maintained page copies would drift; manual preparation flags alone would leave hosted builds with notices.

### Resolve Markdown tokens using two explicit document mappings

Use the locked VitePress Markdown renderer/token mechanisms, including nested/link/image tokens and reference definitions, rather than a regular-expression substitution over Markdown text. Declare only README → `/` and `docs/usage.md` → `/usage/`. Resolve relative targets from each authored file's repository location before classifying them. Normalize paths and retain query/fragment; do not alter fenced/inline code.

Authored links to these pages use `https://at-rama.github.io/sqlite-vector-wasm/` and its `usage/` destination so GitHub/package readers reach the site. During rendering, own-site stable URLs and mapped relative document links use the current base (`/sqlite-vector-wasm/` or `/sqlite-vector-wasm/preview/`). Exact origin/project-prefix matching prevents rewriting unrelated URLs. Unknown local site paths must resolve to real output rather than becoming silent GitHub fallbacks. External URLs and local fragments remain unchanged. Existing absolute GitHub links to the two documents are revised in the authored sources during Apply; other GitHub URLs remain repository destinations.

Repository-only relative file links become GitHub URLs at the build's source commit, preserving snapshot correspondence, with correct path encoding. Relative images are copied to generated site assets with deterministic source-relative identity and rebased URLs, so they remain usable under both prefixes. Preserve relative-image behavior in the authored GitHub documents. Check authored local targets and emitted fragments with the same renderer's generated heading IDs, including repeated headings. Check representative inline/reference/image/query/fragment forms and guard against changing literal examples. This is a two-document resolver, not a general documentation platform.

### Pin and execute the actual documented example

Announce `0.2.0` in Usage and its install instructions. Use one explicit machine-readable selection for documentation checks, with a check that the announced version agrees; retain the published archive URL/identity and SHA-256 after validating existing `publication.json` and archive evidence during Apply. These are dependency records, not runtime payloads. Do not resolve latest during normal builds. A version change is a reviewed source/selection revision, independent of demo refresh.

Acquire the exact published `dist/v0.2.0` payload into ignored check state, verify digest and runtime inventory, and serve its companions unchanged. Extract and execute the actual initialization/minimal example code from the authored guide in the qualified browser harness; do not maintain an equivalent handwritten substitute. Assert initialization, SQLite/extension availability and concrete minimal SQL results. Keep the remaining Usage snippets accurately rendered; no claim that one example establishes every API, OPFS or demo vector path. Reuse existing publication/archive and browser facilities where applicable, without building the engine or using unreleased local artifacts.

### Add scoped checks to existing publication observation

Offline tests cover transformation, missing targets, fragments and independent integration. Real VitePress/browser checks verify actual source content, code fidelity, images, cross-page/local anchors, desktop/mobile overflow and links under stable/preview bases. Extend the read-only actual-Pages observer with documentation checks conditional on documentation integration; stable main may still be the previous shell during this PR. Required example execution uses the pinned published bytes in the browser harness, recorded separately from public Pages rendering. No public test runtime endpoint is needed. Existing Pages permissions/concurrency/freshness controls are retained.

## Risks / Trade-offs

- Markdown/link syntax mistakes → use renderer tokens, targeted negative fixtures and actual output/anchor checks; avoid a new parser dependency when locked facilities suffice.
- README content contains syntax interpreted by Vue → preserve code literals and verify real builds/source fidelity, without silently dropping content.
- Network or archive unavailability → retain diagnostics and block the mandatory example check; never replace it with local engine output.
- Source main differs from archived package documentation → explicitly test the current guide against its announced pinned runtime, preserving published package bytes.
- Documentation check runtime mistaken for demo selection → keep separate selection/state and exercise unchanged demo inventory through the existing shell preservation check.
- External sites transiently unavailable → verify external destination URLs and local resolution; do not equate a third-party outage with an internal broken anchor.

## Migration Plan

Implement in a separate PR based on integrated shell main. Preview both real documentation pages before integration. Keep generated material ignored and source/runtime selection changes reviewable. Main integration uses the existing stable-only deployment. Roll back documentation sources/preparation and its explicit example selection through a reviewed revision; no distribution republication or demo refresh is required.
