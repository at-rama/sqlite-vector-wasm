# Apply evidence — A-site_docs

## Scope and source identity

Implements only `A-site_docs` from the Allocation and Site Capture identified in [coverage.md](coverage.md). The source checkout was reconstructed from the PR #58 candidate `c2d765a8cd2bde0f2d5f35c4e2b3fa0effbb935d`; its complete tracked tree was independently matched to GitHub tree `cdca5a362d71da7f94c008069a48413b84b75bb2` before editing. Local Git commit identities are reconstruction identities, not substituted GitHub candidate identities.

## Realized behavior and evidence

README and Usage are rendered with pinned VitePress 1.6.4 into ignored build state. Renderer tokens handle inline/reference links and images; own-site and mapped document destinations stay within the selected base, source-relative repository files use the build commit, and missing files/anchors fail with diagnostics. Generated HTML uses `v-pre` to preserve literal documentation. Public source hashes and expected rendered text, headings, code, images and links feed browser checks. The current two sources remain directly readable on GitHub. External image destination URLs are retained; external service availability is not claimed as internal-link validation.

The documentation example uses explicit dependency records for published 0.2.0, independently of demo selection. Observed release: GitHub release 413460274, `dist/v0.2.0`, source commit `a92667ad43fbcc0a1aa12431f44a7a82ea44a725`. Archive SHA-256 `5074eb9462ea4cf9eb92a198ed184e1d0949e3a1c7694eb72f40669a4efda775`, 1,167,451 bytes; publication JSON SHA-256 `6cb17fa09a8472c5ff9adcb2b8ed7f82b53e3f68e4ec17c6ff041c508fbf4d8c`. Both downloaded bytes match the recorded identities. The check extracts only the eleven declared regular runtime members and checks their publication hashes before and after execution.

Chrome 153.0.8010.12 executed the actual initialization and first Float32 SQL snippets extracted from Usage. Observed SQLite `3.54.0`, sqlite-vec `v0.1.9`, neighbors `[[1,0],[2,1.4142135381698608]]`; expected distances are 0 and sqrt(2), tolerance 1e-6. Guide SHA-256 `a7bb4732ff4698715a90197413f940a010f49c47d294d3c6a58c0a11f7298feb`; extracted snippets SHA-256 `18a7d787f1504954bd37b94884545b08a85d31f220cf1405e98e4df3307ce25d`. Runtime bytes remained unchanged. No Worker, OPFS, full API or emoji/vector-demo acceptance is inferred.

## Commands and local outcomes

- `sh tools/openspec.sh check`: pinned OpenSpec 1.14.0 and generated metadata passed. `list --json` resolved this checkout's `.42p`; `status` and `instructions apply` resolved the four planning artifacts and eight task locations.
- `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs`: 29 tests passed, none skipped. Pure resolver/publication policies remain in the registered offline suite; compiler renderer fixtures use the installed locked site dependencies. Fixtures cover reference/inline links and images, source-relative directories, both bases, queries/fragments, repeated headings, literal code, unknown targets, inconsistent publication and unavailable dependencies.
- `sh tools/site.sh build`, followed by qualified `check`: real stable documentation passed at 1280px/390px, six direct visits and six client transitions, source text/headings/code/link/image/anchor checks and contained wide code.
- `build --preview propose-site-docs c2d765a8cd2bde0f2d5f35c4e2b3fa0effbb935d`, followed by qualified `check` with matching options: same checks passed under `/sqlite-vector-wasm/preview/`. This local preview uses a declared source-origin identity, not a claim that the edited implementation was already deployed at that commit.
- `bash tools/harness.sh install`, `deps`, and `exec sh tools/site.sh example`: pinned tool identities verified; actual published-runtime example passed as described above. No engine build was performed.
- Qualified `sh tools/site.sh exercise`: thirteen cases passed, including docs-only/demo-only, assembled stable/preview/bootstrap, removal of preview, real documentation with synthetic demo, actual README edit with unchanged selection/asset digests, real documentation preview, and corrupt-runtime rejection. The synthetic runtime proves transport preservation, not published demo execution.
- `sh tools/check-repository.sh`: passed. `sh tools/test-repository.sh`: registered suites passed. `sh tools/openspec.sh exec validate site-docs --strict`: passed. Final evidence identities and any renewed results are recorded below.

Raw outputs, dependency downloads, generated pages and screenshots are ignored under `.work/`. CI preserves compiler/browser, example and Pages observations separately. These local results are not actual Pages evidence.

## Correspondence and limits

Independent forward/reverse examination retains all seven contribution groups in [coverage.md](coverage.md): single-source presentation; GitHub-readable Usage/instructions/example; usable rendering/links/images; independent updates preserving demo identity; post-shell independence; scoped Pages/example checks; and package/publication/acceptance boundaries. All five requirements, scenarios, design decisions and tasks remain grounded in those contributions or repository validation rules. Allocation-to-Change and Change-to-Allocation remain 100%/100% for this unit only. No semantic planning artifact revision was needed.

Task 3.2 remains open until the exact implementation candidate is observed on actual Pages. Task 3.3 remains open until final candidate evidence is reconciled. This is Apply evidence, not post-Apply Verification, archive, merge or product publication authorization.
