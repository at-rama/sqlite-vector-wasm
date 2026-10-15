# Proposal

## Why

The integrated shell provides navigation but its Presentation and Usage pages remain unavailable. Publish the existing documentation through that envelope so readers can understand and start using the published runtime without waiting for the emoji demo.

## What Changes

- Render the repository README as Presentation and `docs/usage.md` as Usage during construction, retaining one authored source for each.
- Make authored links to site-published documentation use canonical stable site URLs. Resolve site URLs, repository-relative links/images and local anchors consistently for stable and preview builds; retain GitHub destinations for repository-only files.
- Identify and check the minimal documented example against explicitly pinned published distribution `0.2.0`, with voluntary version updates and no floating release lookup during ordinary documentation builds.
- Check actual rendered content, links, anchors and mobile presentation on Pages, plus browser execution of the documented example against the identified published runtime.
- Integrate independently of the demo and preserve any supplied demo runtime identity/assets.

## Capabilities

### New Capabilities

- `site-docs`: single-source Presentation/Usage, systematic link resolution, published-version example and scoped documentation checks.

### Modified Capabilities

None. The existing `site-shell` behavior is consumed without changing its requirements.

## Impact

Expected implementation areas are README and Usage links/version disclosure, documentation preparation in `tools/site/`, existing site checks/build integration and contributor guidance. Keep the VitePress 1.6.4 standard theme and English content. No maintained generated Markdown, new UI framework, engine build, package API or distribution publication is introduced.

## Allocation and adopted choices

Exactly **A-site_docs** from [the Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`, at main `65623405a6f8360e0d634ebcfa45cfb2be918083` (shell integrated). The qualified [Site Capture](../../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`, retains C-site, C-readme, the documentation portions of C-demo-checks, runtime-preservation boundary of C-demo-release and Q-realization. These projections are not independent sources or implementation evidence.

In this conversation on 2026-10-15, the user adopted reusing existing sources/theme, fixed example version, canonical site links in the README, and systematic build resolution (including preview bases, repository-only GitHub targets and destination/anchor checks), then explicitly requested this proposal. No public conversation permalink is available. Release `dist/v0.2.0` and its `payload.tgz` were observed published during exploration; Apply must verify its exact publication/archive identity before use. Demo selection, corpus/UI/vector checks and distribution acceptance remain with their owners. This proposal does not implement or verify the unit.
