# Cleanup execution account

## Reviewed implementation

Exact clean implementation commit: `5204f0e75e4a955f8cb87b043eaf4ea238fe936e`. These are execution observations, not publication approval. Subsequent task/report-only commits do not alter the reviewed implementation or requirements. Generated primary local outputs remain temporary under `.work/`; this committed document is their account, not the raw output.

## Repository and isolated production

`sh tools/check-repository.sh` passed. `sh tools/test-repository.sh` passed all **454** registered tests: gates 44, inputs 36, build 43, package 20, acceptance controls 23, release 104, Updates Python 7 / Node 46, Watch 60, OpenSpec tooling 11, Site 60. No mandatory test was skipped. Locked OpenSpec 1.14.0 preflight and `validate --all --strict` passed **13/13** items. Long-requirement and already-synchronized-delta messages are informational; synchronization is not archive.

A separate detached worktree at the exact implementation commit began with empty tool/dependency/source/output state. `bash tools/acceptance.sh --name @at-rama/sqlite-vector-wasm --version 0.3.0` returned success after all nine stages: checkout, install, tools, deps, smoke, build, package, browser, bundle. Tools were newly acquired, not copied from the earlier developer workspace. The source remained clean through final bundling.

- SQLite `3.54.0`; SQLite-Vector `1.1.2`; lock `inputs/sqlite-vector.sources.lock.json`, SHA-256 `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`.
- Product archive `@at-rama/sqlite-vector-wasm@0.3.0`, size `1164687`, SHA-256 `73db631bc27b24d6dba8145dd4f4707501d6da15b30d83a757f3c4bb513f3926`.
- Eleven runtime assets; WASM size `943014`, SHA-256 `020dc67ad711674b98f7621262054653e8692b9dc1e656298735b356cb488284`.
- Pinned Emscripten `4.0.23`, SDK commit `96c657fc60920d2a6a82318aa50e0abf82749604`, Node `24.19.0`, npm `11.17.0`, WABT `1.0.42`, Chrome `153.0.8010.12`.
- All **22** final-package browser cases passed: conventional/ESM/bundler × main/Worker/Worker1/promiser; same-SQLite baseline; FTS5; independently calculated native Float32 and direct binary Hamming; SQL negative controls; restart/reopen through OPFS, OPFS-WL and SAH-pool; persistence negative control; final hashes. No development-tree runtime supplied those observations.

Local primary locators: `.work/proof-production-result.json`; detached worktree `cleanup-proof/.work/acceptance/run-tYgKYm/{acceptance,browser,build,package}.json`, `logs/` and `payload.tgz`. Earlier working-tree and clean runs have distinct archive digests and are not relabeled as this run; byte-identical rebuilds are not promised.

## Independent CI invocation and accessible execution bundles

[Repository check](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397022183/job/118542150714) and [registered tests](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397022183/job/118542150743) succeeded. These jobs run executable controls; they do not establish semantic coverage.

[Exact-head nonpublishing release exercise](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397021789/job/118542149470) succeeded on `5204f0e75e4a955f8cb87b043eaf4ea238fe936e`. Its [primary execution bundle](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397021789/artifacts/12253060452), `release-exercise-39397021789-1`, has ZIP SHA-256 `4925d7de54d50ca0a3452b797acbd91a86b3c8404c21a02dbba4b5f16e71d2eb`. It contains fresh production/browser evidence, package/build handoffs, payload, release provenance and final documentation example/link checks. The job log records product payload SHA-256 `f641d977fb589fdc9367b5bed611a4c3689180860b349bdd859959e33903aa18`, a distinct actual archive from the local run. The 0.2.4 reference is explicitly synthetic; the shared calculation produces a first transition to 0.3.0/latest and the bound breaking note. No publisher was instantiated and publicationCalls is zero; this is not live registry or historical-runtime requalification.

[Automatic Acceptance](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397021876/job/118542526289) and its aggregate succeeded. Its [primary execution bundle](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397021876/artifacts/12252223029), ZIP SHA-256 `3ed4c4f8bb799dde7312d2e521ac219543ce7ab026cd64e1c1cc9b32a411371a`, qualifies the PR's synthetic merge commit `b19dfab8aca4eee6ec4639f735a63d420224ede0` with fixture package identity `sqlite-vector-wasm-acceptance-fixture@0.0.0-test` and payload SHA-256 `833d3c42c629a297fc2417719fca5f51141a1f6da26c36f32d90982c19e82016`. It is supplementary and is not the local product archive or an exact-head product publication. Artifacts were present and unexpired when inspected; configured retention is 30 days, not permanent availability.

CI runs are operationally separate but reuse the same repository-authored build and validation code; they are not independent implementations of the contract or oracle.

## Documentation and current Site

The local final product archive supplied the actual root Usage install/copy/init/SQL snippets on main and in a dedicated module Worker. Both returned neighbors `[[1,0],[2,1.4142135381698608]]`, SQLite `3.54.0` and native Vector `1.1.2`, with unchanged final runtime hashes. Source-relative links/fragments were checked. A real nonpublishing Release handoff was also validated against that already complete production bundle and an explicitly synthetic 0.2.4 reference; no repeated production or external publication is implied by that handoff check.

Three real VitePress/browser observations passed on the current checkout: stable frame, identity-labeled preview, and a separate README-only rebuild. Each had null prepared runtime, working notice/Usage link/navigation at 1280 and 390 pixels, zero demo runtime/corpus requests and zero Workers. README was restored and documentation execution refreshed afterward. This proves local construction under both URL shapes, not hosted stable promotion or published availability.

The registered real `site.sh exercise` passed all **16** observations: stable/preview relative images, missing-image rejection, docs-only, independent synthetic runtime transport, documentation-only identity retention, preview, assembled stable/preview/bootstrap, preview removal, current rendered docs, corrupt-runtime rejection/stale-output removal and current shell/placeholder. Generic synthetic transport does not reactivate the product demo. An initial composed local diagnostic encountered a stale documentation manifest in its docs-only fixture and timed out; a fresh standalone invocation on the same committed code passed the complete exercise. No gate was weakened. That initial failure remains a local-state limitation; the later successful invocation is the reported current result, not a retroactive pass for the failed attempt.

Local primary locators: `.work/site-final-integration.json`, `.work/site/exercise.json`, `.work/docs-example/result.json`, `.work/site-final-current.log` and `.work/site-exercise-retry.log`.

## Pages limit and observed protections

An earlier exact-source Site run reached assembly and its local preview checks passed with zero demo requests/Workers, but its prepublication guard correctly rejected the superseded PR head: [job and diagnostics](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39396643981/job/118540910345). The independently retained historical stable root in that artifact still used its own published 0.2.0 demo (17 requests / four Workers in the shell observation). That is an identified historical stable source, not a current placeholder observation, and is not represented as a no-runtime pass. The cleanup does not alter main or promote unpublished candidate documentation.

[Site run for the implementation head](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39397021840) was canceled in the shared Pages queue before jobs existed. GitHub's rerun-failed-jobs endpoint returned 403, “This workflow run cannot be retried”. No identified live Pages placeholder observation is available at this checkpoint. Task 6.2 stays incomplete until such evidence is obtained. Current runtime/vector demo checks remain deferred to the independent future return under #77; they are not placeholder successes.

Earlier missing-descriptor and canonical-pagination CI failures were corrected before the reviewed implementation commit, with specific negative/security regressions. Verification and Archive merge gates were expected to fail before their reports/lifecycle outputs; those failures are not converted into product qualification passes. No merge, archive or product publication occurred.
