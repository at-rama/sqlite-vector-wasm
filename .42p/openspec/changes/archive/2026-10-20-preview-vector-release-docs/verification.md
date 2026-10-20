---
schema_version: 1
change: preview-vector-release-docs
allocation_unit: A-site_docs
checked_commit: 3a213e1b07cb22964f1bf5fa4a9af50f0be4da78
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---
# A-site_docs Verification

## Institutional view

**Passed for A-site_docs.** The five effective obligations are supported by the examinations and executions below. All four tasks and the three Verification controls pass. The checked commit only completes task markers after the actual execution on `a102cc2bc3314f5b0d7471a751cbf85ab611d1fd`; all implementation, Markdown, locks and harness bytes are identical. That execution is explicitly reused rather than relabeled as a deployment of the later administrative commit. The identified candidate was actually observed on Pages. Published-mode browser support additionally reuses a disclosed historical 0.2.0 archive/guide replay; no future Vector publication is asserted. This verdict concerns documentation, not the still-pending Updates/Release/stable-promotion units or overall release readiness.

**Command provenance.** The instituted Site Capture, particularly C-readme/C-demo-checks/C-demo-release/Q-realization, and Distribution C-release-review ground [A-site_docs in the reconciled Allocation](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md). The complete unit, attributed passages and [bidirectional mapping](coverage.md) were read against the synchronized `site-docs` baseline plus the delta. Both semantic directions remain 100%. This does not reaudit original historical-source fidelity or treat document hashes as evidence of implementation.

**Single-source presentation and usage — verified.** [README](https://github.com/at-rama/sqlite-vector-wasm/blob/a102cc2bc3314f5b0d7471a751cbf85ab611d1fd/README.md) and [Usage](https://github.com/at-rama/sqlite-vector-wasm/blob/a102cc2bc3314f5b0d7471a751cbf85ab611d1fd/docs/usage.md) remain readable authored sources. They explain native Vector SQL, vec0/vec_* adaptation, loading/Worker/storage prerequisites and the absence of automatic migration. The renderer mechanically adds checked identity/status; unpublished instructions use the supplied archive. [Live observation](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/artifacts/12212266062), `live-pages.json`, checks both rendered documents at the exact candidate revision. A real edited-source rebuild also passed in the browser exercise, without an engine publication or second authored page.

**Links, images, anchors and mobile envelope — verified.** [Site build job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/job/118222210622) passed real VitePress builds, copied relative-image fixtures and missing-image rejection, stable/preview navigation and source/fragment checks. [Hosted browser evidence](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/artifacts/12212266062) records six direct visits and six client transitions for each root at widths 1280/390 in Chrome 153.0.8010.12. The candidate Usage screenshot was inspected: long code scrolls within the mobile page. These are exercised browser/prefix cases, not universal rendering guarantees.

**Exact candidate and explicit published examples — verified within the stated modes.** [Preserved example record](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/artifacts/12211820779), `docs-example/result.json`, binds the actual native example in main and module Worker to candidate head `a102cc2`, SQLite 3.54.0/SQLite-Vector 1.1.2, archive size 1,164,980 and SHA-256 `17aedb6e2bf85396c945e4394f3e8dc1b46435589f22d568b5afd410b049270c`. Both contexts observed neighbors 1/2 at distances 0/1.4142135381698608 and the announced native versions, with unchanged runtime files. Candidate 0.3.0 is a qualification fixture forecast, not a reserved or published identity. Actual published 0.2.0 was separately replayed locally with its historical guide/selection in both browser contexts; that replay is supporting historical evidence, writes `replay.json`, and cannot authorize current rendering. Publication selection remains digest-bound and fixed; regression execution rejects unavailable publication, wrong archive/version/revision/composition, stale source/head, missing evidence and historical replay. Mechanical final-number/status rendering and selector mismatch are tested with synthetic identities; those tests do not assert that a future Vector package exists on npm. Final-publication qualification/promotion remains the dependent Release/Shell responsibility.

**Independent documentation and demo — verified.** [Browser integration execution](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/job/118222210622) covered docs-only/demo-only inputs and actual documentation edits with the fixed demo selection. `site/demo-results.json` in the [check artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/artifacts/12211820779) retains identical demo runtime inventories. The demo stays truthfully pinned to published legacy 0.2.0; no Vector demo refresh, runtime API or Site engine build was introduced. Site acquires already-qualified bytes through a read-only Actions artifact handoff.

**Identified deployed checks — verified.** Build, deployment and [actual Pages observation](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036384/job/118224206565) all succeeded. The observer compares `site-publication.json` before and after checks; it identifies PR 76, branch `plan/release-docs-review`, exact head `a102cc2` and independent stable main `741b26d`. Local success was not substituted for this mandatory observation. Exact-head/required-check enforcement across candidate integration and later stable promotion is supplied by the dependent changes; this unit emits the bound results and fails missing/stale input.

**Dependencies, limits and institution.** Evidence depends on repository-authored checkers, locked tooling, the qualifying acceptance bundle and GitHub/Pages availability, with common agentic authorship; this is not independent certification. Two implementation defects found during execution were corrected and rechecked: temporary README edits in the demo exercise require renewed example evidence; published rendering must compare its result with the explicit pinned selector. The failed earlier Site run `39297114344` is retained as failure history. The successful hosted artifacts expire on 2026-11-18; raw local historical replays are temporary and have no durable hosted primary URL. This scoped unit is satisfactory and permits proceeding to A-updates. No archive, merge, tag, npm publication or GitHub product release occurred; the required Pages preview was deployed.

## Detailed verification record

### Official OpenSpec verify

The repository composition and unchanged generated verification skills were read and executed agentically, using pinned OpenSpec 1.14.0 status/apply context. The resolved root is `.42p`; proposal, design, all delta specs and tasks were examined. Baseline omissions were treated as retained behavior. No generated skill was installed or modified during Verification.

| Dimension | Result |
| --- | --- |
| Completeness | 4/4 tasks, all 3 modified requirements found; all 5 effective requirements retained. |
| Correctness | All 12 delta scenarios mapped to implementation and applicable execution/negative controls; all 18 effective scenarios accounted for. No applicable check skipped. |
| Coherence | Exact qualified archive reuse, one authored source per page, bounded identity rendering, published-only dependency mode and independent fixed demo follow the design. Existing Node/fs/test patterns and locked VitePress/browser tooling retained. |

No critical issues, warnings or skipped applicable checks remain in this unit. Archive-readiness advice does not authorize this mission's prohibited archival action.

### Obligation and implementation correspondence

- Single-source documentation: `tools/site/docs.mjs`, `documentation.mjs`, README and Usage; three modified scenarios, source hashes separated from rendered hashes.
- Systematic link resolution: retained resolver/browser checks and real relative-image exercise; four retained scenarios.
- Explicit version/example: `example.mjs`, `candidate-input.mjs`, `documentation.mjs`; seven effective scenarios, exact acceptance consumer and negative/selector tests. Historical replay and final mechanical fixture limitations are disclosed above.
- Independent integration: `build.mjs`, `prepare.mjs`, `exercise.mjs`, `demo-exercise.mjs`; two retained scenarios, actual and synthetic supplied-runtime inventory checks.
- Scoped deployed checks: Site workflow, browser/observer and preserved bound records; two modified scenarios, actual Pages result distinct from loopback example execution.

Reverse examination found no ungrounded requirement or new product responsibility; acquisition/check handoffs realize the existing documented dependency boundaries.

### Executed checks and evidence identities

`sh tools/check-repository.sh` passed on the clean checked snapshot. `openspec status`/`instructions apply` report 4/4 tasks; strict validation of this Change passed, and the full corpus previously passed 17/17 on the identical implementation. [Repository execution](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036408) has successful `check` job 118219034971 and `tests` job 118219034469, including registered suites and locked OpenSpec validation. Local targeted execution `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs` passed 42/42, zero skipped. Full local repeated-suite logs are supplementary; the identity-bound successful CI job supplies the decisive full-suite execution.

[Publisher-free qualification](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39299036137/job/118219034205) succeeded on the same implementation; product publisher jobs were skipped. Site's real API acquisition recorded producer run 39299036137, artifact 12212010487, ZIP SHA-256 `d21b0615d1cae4b3a4d9c686491ec3ec6a754c76d162a56d28edd121287aacd8`, exact candidate head and accepted bundle `acceptance/run-eye0qq`. It performs no engine compile within Site.

Downloaded and inspected Site artifacts:

- `site-checks-39299036384`, ID 12211820779: ZIP SHA-256 `3d9b0477cceb4def405cdd0fd61401b60a42a3c25ecfe0b6fef4aa79e557dec9`; locators `docs-input/handoff.json`, `docs-example/result.json`, `site/exercise.json`, `site/demo-results.json`, `pages/site-publication.json` and mobile images.
- `site-live-39299036384`, ID 12212266062: ZIP SHA-256 `1cb0f7197296c7e6f0219d9d0024eb73abb60e3a80b035a0df666f7a675bc993`; locator `live-pages.json` and observed demo/mobile images. This primary result identifies the live deployment, rather than merely showing a local build definition.

The checked administrative commit differs from the executed commit only in this Change's two completed task markers; `git diff a102cc2..3a213e1` was examined. This explicitly establishes the material applicability of reused execution, not a claim that the shared preview remains permanently at that revision. Repository Verification/Archive aggregate gates still cover the pending units; their expected incompleteness does not replace these scoped controls or permit merge.
