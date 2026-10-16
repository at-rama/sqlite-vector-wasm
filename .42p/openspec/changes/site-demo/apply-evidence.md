# Apply evidence — site-demo

## Scope and candidate

This is the Apply receipt for **A-site_demo**, not post-Apply 42P Verification, archive, complete distribution acceptance or integration authorization. The initial executable candidate is commit `5f9c847fcebbc4fab5623728c08f5b6790281346`, tree `06d501cf20e73ca5587aa41a3df57426c9a338f1`. The local staged tree was independently compared with that GitHub tree and matched exactly before the final documentation/test checks. Its immediate completion commit changed only task/receipt files. The editorial continuation below identifies the later UI changes and renewed evidence separately.

The [planning correspondence](coverage.md) was re-examined against the complete allocated unit and qualified Capture passages at the same Allocation SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`. All eight delta requirements remain within that unit: published stable consumption/identity, complete attributed corpus, both modes, actual exploration, actual-operation inspection, transient usable session and scoped checks. Both semantic correspondence directions remain 100%; no upstream semantic revision or unrelated realization was introduced. This does not establish fidelity to unexamined historical originals.

## Realized behavior and local observations

The pinned emoji2vec source was acquired at `3f91c339df13b2a511d9e3a9f73efa7b61c54707`; the word2vec header is `1661 300`, and all 1,661 vector identities have exact description matches. Original Float32 bytes are preserved. The sign conversion emits 38 bytes per emoji with four zero padding bits; catalogue, both vector payloads, source/transform manifest and MIT notice are independently reproducible from the source lock. Actual byte sizes were 191,727 for catalogue JSON, 63,118 for binary vectors and 1,993,200 for Float32 vectors. JS/WASM, manifests, notices, SQLite overhead and HTTP compression are separate.

A second acquisition with empty demo input/download/prepared caches reproduced all 32 prepared file digests identically, without an engine build or selection refresh.

Initial explicit selection observed npm latest / GitHub `dist/v0.2.0`, distribution commit `a92667ad43fbcc0a1aa12431f44a7a82ea44a725`, SQLite 3.54.0 and sqlite-vec 0.1.9. Archive SHA-256 is `5074eb9462ea4cf9eb92a198ed184e1d0949e3a1c7694eb72f40669a4efda775`. Preparation verifies the publication/archive and every declared runtime member, preserves all eleven companions and licensing, then supplies the shell inventory. No engine was built or package published. Usage keeps its independent unchanged record.

Real Chrome 153.0.8010.12 exercised the unchanged published loader in a page-local module Worker, automatic sqlite-vec availability, transactional insertion of all 1,661 records, SQL text discovery, bit[304]/Hamming and float[300]/cosine searches. The explorer supports six distinct non-self neighbors, continued neighbor selection, copying, empty text matches, literal LIKE wildcards, mode switching and current-response correlation. Initial and optional acquisition failures were injected; initialization retry, continued binary operation, optional retry and honest copy failure worked. Leaving Demo closed its Worker session and re-entry initialized binary afresh. Presentation/Usage made no demo runtime/data requests; Float32 was fetched only once per exercised session.

Four fixed queries per mode (IDs 0, 1, 40, 100) were compared at each stable/preview base against a separate Python scalar reference over the pinned originals. The reference imports neither production preparation nor sqlite-vec query logic. Hamming comparisons are exact; cosine allows absolute error 2e-6 for a 300-component Float32 reduction against double precision. All eight comparisons per base passed; each binary query had multiple candidates tied at its boundary. A tiny known tie fixture separately accepts alternative tied members and rejects self, duplicate, farther or missing strictly closer results. Source identity and repository/agent authorship remain shared dependencies; these checks do not establish semantic quality of the embeddings.

The latest local exercise observed binary query times 0.4–1.4 ms and Float32 query times 1.1–2.2 ms across its two bases. SQLite page volume was 286,720 bytes after binary insertion and 2,834,432 bytes after Float32 insertion. These are Linux x86-64 / qualified headless Chrome loopback observations with no-store fixture responses, not mobile/network benchmarks or total WASM/Worker memory. Stages and end-to-end times are retained separately in generated evidence. No performance threshold is inferred.

Mobile/desktop checks (390/1280 pixels) covered layout containment, focusable native controls, radio selection, technical panel, source/release links and screenshots. The local container initially lacked emoji glyph fonts; adding an untracked system Noto Color Emoji font enabled visual inspection of actual Unicode glyphs. The site itself ships no emoji font/image collection and uses the visitor's system rendering.

An actual README edit followed by ordinary rebuilding preserved the exact selected runtime inventory; it was restored afterwards. Existing synthetic shell preservation checks, independent stable/preview assembly behavior and Usage example checks also passed. Local assembled-site observation exercised both common pages/navigation and the real demo with runtime-inventory hash comparisons. It is not the public Pages result.

## Commands and evidence

The following commands completed successfully for the applicable local candidate inputs:

- `sh tools/check-repository.sh` and `sh tools/test-repository.sh`.
- Locked OpenSpec 1.14.0 preflight and `sh tools/openspec.sh exec validate --all --strict` (12 valid items; existing informational long-requirement hints only).
- `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs` (37 passing tests).
- `HARNESS_STATE=/tmp/sqlite-site-demo-harness/tools bash tools/harness.sh install`, `deps` and `smoke`.
- `bash tools/harness.sh exec sh tools/site.sh exercise`, `example` and `demo` in that qualified environment, sequentially in one checkout.
- `bash tools/harness.sh exec node tools/site/observe.mjs .work/demo-pages .work/demo-pages/site-publication.json .work/demo-observed.json` for the local combined artifact.

Primary local results remain temporary under `.work/site/` (`exercise.json`, `demo-results.json`, mobile screenshots), `.work/docs-example/result.json` and `.work/demo-observed.json`. This durable receipt is their account; it does not imply those transient files are permanently accessible. Hosted run artifacts below provide separately accessible evidence.

The first Site execution on `23a616c` failed the renderer fixture because renaming the Demo heading removed its existing `#demo` anchor. The anchor was preserved explicitly, both renderer tests were rerun successfully, and the correction is included in the executable candidate. No gate was bypassed. The Repository gate-suite also encountered an unchanged temporary-Git-directory cleanup error (`OSError: Directory not empty: .git`); rerunning that job succeeded, without modifying its tests or policy. A workspace attempt to repeat the hosted browser observation could read the deployment metadata but its Playwright request failed DNS resolution (`EAI_AGAIN`); this is not counted as a successful public browser check. An overlapping local build attempt was discarded and the shell/demo exercises were rerun sequentially; only successful completed exercises support the outcomes above.

## Identified public Pages observation

The [Site execution 38851460742](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38851460742) completed build, deployment and hosted observation successfully for the exact executable candidate `5f9c847fcebbc4fab5623728c08f5b6790281346`. The [hosted observer job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38851460742/job/116814881487), step “Observe the identified live Pages deployment”, records main `08b5f690259a6c60e6e9c3dbcba6fef5152d4acb` separately from that preview commit and compares the deployment record before and after the observation.

The observation checked common navigation/docs at the stable and preview roots, then executed the real demo at [the preview](https://at-rama.github.io/sqlite-vector-wasm/preview/demo/). Its primary JSON identifies runtime 0.2.0, corpus `3f91c339df13b2a511d9e3a9f73efa7b61c54707`, Chrome 153.0.8010.12, eight successful independent query comparisons (four per mode), one first-session Float32 load and no page errors. It also exercises neighbor navigation/copy, text filtering, both viewport widths and session disposal/re-entry, and compares every served runtime inventory digest. Hosted failure injection is not claimed: those paths were exercised in the local/CI loopback exercise.

The [hosted-results artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38851460742/artifacts/12025866995), `site-live-38851460742`, contains `live-pages.json` and `live-pages-demo-mobile.png`. The [construction/check artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38851460742/artifacts/12024967684), `site-checks-38851460742`, contains the local compiler/browser/example/demo results, identities and screenshots. Both were confirmed present and unexpired when this receipt was authored; workflow retention is 30 days. The public preview is shared and can later be replaced, so the execution/artifact identities, not the moving URL alone, support these results.

The Repository check and rerun automated tests for the executable candidate also succeeded in [execution 38851460559](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38851460559). Its Verification/Archive jobs remain intentionally non-passing because this invocation is Apply only. All 16 Apply tasks are complete; subsequent receipt/task commits carry no executable, site-content or dependency change.

## Remaining lifecycle

Post-Apply `42p-verify-change`, native archive and human integration remain subsequent operations. Their merge gates are expected to remain unsatisfied while this Change is active and has no post-Apply Verification report. No OPFS, persistence, full package API/capability or semantic-quality acceptance is claimed.


## Editorial continuation — 2026-10-16

The user approved a bounded editorial revision after exercising the demo: identify SQLite/sqlite-vec and local execution in the introduction; explain compact binary versus original Float32 values with a vector-only approximate size ratio; show a human-readable representation/metric/timing summary, six distances and actual SQL before optional raw diagnostics; shorten the initial grid to 24 emojis while keeping every match reachable; move versions and execution details into the technical panel and keep the attributed footer brief.

These changes realize the existing interaction/inspection/mobile obligations and permitted presentation choices. The complete corpus, both representations, search/lifetime behavior, independent checks and package/runtime boundaries remain unchanged. The existing Allocation snapshot and bidirectional planning correspondence remain applicable; no new product requirement or separate allocation unit is introduced. Historical initial-Apply results above retain their original candidate identity. Renewed evidence for this continuation is recorded below rather than carrying earlier UI results forward.

Renewed checks: the 37 site/renderer tests and repository gateway passed. Browser and identified preview results are pending while the updated UI is prepared. The browser check now verifies the readable six-row distance table, actual SQL, raw diagnostics collapsed by default, 24-to-48 grid expansion and layout containment with the technical panel open at desktop/mobile widths.
