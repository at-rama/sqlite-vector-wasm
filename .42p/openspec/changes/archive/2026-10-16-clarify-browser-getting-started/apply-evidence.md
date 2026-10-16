# Apply evidence

## Scope and candidate

This is the Apply receipt for **A-site_docs**, not post-Apply Verification. The executable/documentation candidate is [4202a1acff3e2d4e276be4fe7ad234fcf410ee03](https://github.com/at-rama/sqlite-vector-wasm/commit/4202a1acff3e2d4e276be4fe7ad234fcf410ee03), following planning commit `f8e3e85f8a137cf7f7d0f33f5dd423bd192c9be4`. Subsequent task/coverage/receipt edits record work without changing executable or public documentation bytes.

The README now exposes Demo and Usage near the opening promise and links directly to the worked vector example. Usage supplies the actual asset-copy recipe and hosting assumptions, recommends direct SQLite APIs in a dedicated module Worker, and preserves Worker1/promiser compatibility with upstream deprecation guidance. Repetitive prose and licensing presentation are shortened without removing runtime boundaries or upstream terms. Contributor guidance in `docs/site.md` reflects the updated example checker.

## Renewed local observations

Node `24.19.0`, locked VitePress `1.6.4`, and the qualified harness with Chrome `153.0.8010.12` were used on 2026-10-16. Temporary harness state was reconstructed after the interrupted session; no interrupted execution was counted as success.

- `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs`: **37 passed**.
- `sh tools/check-repository.sh`: passed; current canon and Capture/Allocation byte identities agree.
- `sh tools/test-repository.sh`: all registered suites passed.
- `sh tools/openspec.sh exec validate --all --strict`: **13 passed, 0 failed**; the documentation-only `skip_specs` declaration is accepted.
- Through `bash tools/harness.sh exec`, `sh tools/site.sh example`: passed against the pinned published archive `0.2.0`, SHA-256 `5074eb9462ea4cf9eb92a198ed184e1d0949e3a1c7694eb72f40669a4efda775`. Offline npm installed that verified archive with scripts disabled; the shell commands extracted from Usage copied exactly eleven files with matching published sizes/digests. The guide's initialization and Float32 query returned `[[1,0],[2,1.4142135381698608]]` in both the page and a dedicated module Worker, reporting SQLite `3.54.0` and sqlite-vec `v0.1.9`. Runtime hashes remained unchanged.
- Through the same harness, `sh tools/site.sh exercise`: **16 cases passed**, including stable/preview rendering, copied images and missing-target rejection, docs-only/demo-only integration, documentation updates preserving supplied runtime digests, assembly and corrupt-runtime rejection. Preservation fixtures use explicitly synthetic runtime identities; their success is not a real vector oracle.
- `sh tools/site.sh check`: passed on the real local build at 1280px and 390px, checking README/Usage text/code/links/anchors, all three destinations, six direct visits, six client transitions and GitHub/npm navigation. Mobile Usage and desktop/mobile README screenshots were visually inspected; content fits the viewport and wide code scrolls within its block. Third-party badge images were unavailable in the local screenshot environment; external image availability is outside this internal-resource check.

Raw local outputs remain in ignored `.work/docs-example/result.json`, `.work/site/exercise.json`, `.work/docs-browser.log`, `.work/docs-tests.log` and `.work/apply-repository-tests.log`; these temporary paths are not durable external evidence links. Hosted execution and actual Pages observations are recorded below.

## Hosted execution and actual Pages

[Site run 38880277434](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434) completed successfully for executable candidate `4202a1acff3e2d4e276be4fe7ad234fcf410ee03`: [build](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434/job/116905076772), [deploy](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434/job/116906466432) and [actual public observation](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434/job/116906700901) passed. The build log and downloaded [site-checks artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434/artifacts/12037690733) were inspected: `docs-example/result.json` reports the same copy recipe, guide hash and page/Worker results as the local execution; `pages/site-publication.json` selects PR 61 at that exact commit and stable main `2c9910a3824a942b1d8ff0e0182b93dbcb976f5e`.

The downloaded [site-live artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38880277434/artifacts/12038030345), `live-pages.json`, was inspected. Its ZIP SHA-256 is `81b6439ba924eaa084c45fd46c426ddd7974035634ded7b726b3eb5161e9abb9`, matching GitHub's artifact digest. It identifies the actual preview as `docs/clarify-browser-getting-started` at `4202a1acff3e2d4e276be4fe7ad234fcf410ee03`; the published README SHA-256 is `b04c972663d6477866f3223a8cc6b369e56d0a7aef57a2a855a21fe8832b0d2b` and Usage is `aba78e68747648737550885bff30ce80f1e8119bb91657dd7c6186930803930f`, both matching the candidate. Public checks covered source fidelity, emitted documentation links/anchors, three destinations, six direct visits and six client transitions at 1280px/390px, plus the distinct stable root. The observation checks the publication record before and after browsing to reject replacement of the shared deployment.

The public-preview check attempted from this workspace failed before reaching the site with `getaddrinfo EAI_AGAIN at-rama.github.io`. It is not counted as success. The required actual-Pages result is established by the successful identified GitHub-hosted observation above. Both hosted artifacts are retained until 2026-11-15; their availability is time-limited, and the shared preview URL can later be replaced.

## Boundaries and continuity

All seven obligation groups in [coverage.md](coverage.md) and the five retained synchronized `site-docs` requirements were re-examined in both directions against the unchanged current Allocation and Site Capture. Coverage remains **100% each way**. The added recipe execution and Worker-context check support the existing documented-example obligation; they introduce no runtime API or product requirement.

The source selections `tools/site/docs-example.json` and `tools/site/demo-runtime.json` are unchanged, as are Capture/Allocation, shell/theme, demo interactions/corpus and package APIs. No runtime was compiled or published by this documentation work. These documentation observations establish neither OPFS, complete Worker/API behavior, semantic quality of emoji neighbors nor full distribution acceptance. Verification, synchronization, archive and merge have not been invoked.
