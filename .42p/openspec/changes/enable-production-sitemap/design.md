# Design

## Context

The site uses locked VitePress 1.6.4. Its config receives `base` and `preview` from the existing generated site-build.json. Production and preview are compiled separately before `assemble` copies the stable output to the Pages root and the candidate below preview/. See proposal.md for motivation and specs/site-shell/spec.md for the added contract.

## Goals / Non-Goals

Use the existing production identity and compiler route inventory. Keep discovery generation outside assembly; retain historical stable builds that predate this feature. No robots.txt, metadata changes, lastUpdated, custom sitemap generator, new package or workflow is needed.

## Decisions

Configure native `sitemap` only when `preview` is absent. Its hostname combines the stable GitHub Pages origin with configuration.base, including the project prefix exactly once. Unconditional sitemap generation was rejected because previews must not advertise their own URLs.

Extend the existing real compiler exercise with a small isolated shell fixture using the actual checked-in config and locked tooling. Include a fourth page to prove automatic route inclusion. Parse XML with Python's standard-library ElementTree, already a repository and Site prerequisite, rather than checking config text or introducing a parser dependency. Compare sitemap bytes through actual assembly and inspect noindex in emitted HTML. Record observations in the existing exercise.json output.

The new fixture needs no runtime, corpus, publication lookup or browser: the changed feature is a build artifact. Existing compiler/browser exercises and offline suites remain in place, including their unchanged publication/runtime preservation checks. This feature's checks do not make a historical stable checkout acquire a sitemap retroactively.

## Risks / Trade-offs

- A hostname/base error can advertise wrong URLs: compare parsed URLs against independently written expected stable destinations.
- A future compiler change can alter route inclusion or preview handling: compile actual config in the existing exercise.
- Sitemap validity does not guarantee indexing: document discovery only.
- Fixture compilation does not establish current hosted delivery or rerun product/demo qualification; those remain with existing CI and human integration.

## Migration Plan

The existing Site workflow rebuilds production after integration; it then publishes sitemap.xml normally. The PR preview can initially coexist with a stable root built from older tooling without a sitemap. Rollback removes this config addition through the normal PR path. No distribution publication or runtime refresh is needed.
