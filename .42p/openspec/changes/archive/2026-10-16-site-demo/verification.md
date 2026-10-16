---
schema_version: 1
change: site-demo
allocation_unit: A-site_demo
checked_commit: 64c01d50e77e11ca9f8f5da37ecbeb0581657da2
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — site-demo

## Institutional view

**Situated conclusion.** Verification of `site-demo`, realizing **A-site_demo**, passes for committed candidate `64c01d50e77e11ca9f8f5da37ecbeb0581657da2`. The conclusion combines renewed semantic examination and local checks with reused, same-candidate CI executions: the [Site build results][build-job] and [identified public observation][live-job]. The latter's logged JSON directly records the preview commit, release/corpus, eight reference comparisons and absence of page errors. Retained artifacts are currently unexpired, with 30-day retention. Historical cold-reproduction evidence is reused only as an account, as qualified below; no claim that its old temporary primary outputs remain accessible is made.

**Command provenance.** The examined command is the complete [Allocation unit][allocation], section “A-site_demo”, and its qualified references to the [Site Capture][capture], C-site through C-demo-checks, R-demo, Q-volume and Q-realization, plus Release/Watch C-version-identity/C-channels. The Capture records S-site-design, S-site-exploration, S-site-split and bounded identity reconciliation; the present conversation adopts realization and editorial choices. Their correspondence with the Change was re-examined, not inferred from hashes or task counts. Original historical conversations were not independently recovered or audited. Distribution's recorded S-spec provenance remains contextual: immutable historical `SPEC.md` at `d463c4034604d6593cf45bbf5a523598dd3f53cc`, digest `23c94ad50be9559a5846b083996d46bc12607a73473d5272726d0faae4c6acb1`; this invocation does not verify the whole Distribution source chain. Captures and Allocation remain derived projections, not corroborating authorities.

**Published stable consumption and identity — supported.** The unit demands unchanged published assets, explicit stable selection, fixed rebuild identity and visible product/component versions. Examination of [acquisition implementation][runtime-code], functions `selectStable`, `validateRuntime` and `prepareDemo`, and renewed fixture results support fail-closed integrity, `latest` eligibility and no ordinary floating discovery. [Same-candidate build execution][build-job], step “Check real builds and browser integration”, ran shell preservation, Usage and demo exercises; [public results][live-job], field `selection`, identify distribution 0.2.0, SQLite 3.54.0 and sqlite-vec 0.1.9, with served inventory digest checks. This validates consumption of that selected publication, not an assertion that it remains the latest forever. The Usage pin remains separate.

**Complete attributed corpus and both representations — supported.** [Preparation code][data-code], `parseCorpus`/`prepareData`, preserves all 1,661 identities and original Float32 bytes, binds descriptions exactly and derives 300 sign bits with four zero padding bits. Renewed negative fixtures reject malformed, non-finite, duplicate or mismatched inputs. The [public observation][live-job], `corpus`, `binaryInitial.stages` and Float32 reports, records 1,661 insertions per representation and the pinned revision. Source credit and accessible MIT notice remain in the component and prepared manifest. System Unicode rendering, old-corpus and English-only limits are explicit. The [historical Apply account][apply-account], “Realized behavior and local observations”, reports cold reproduction of all 32 file digests; its temporary original outputs are not independently available here. Current preparation/build executions revalidate the pinned inputs, rather than treating that old account as current runtime evidence.

**Exploration and real SQLite searches — supported on exercised paths.** [Worker implementation][worker-code], `execute`, uses bound textual SQL and actual `vec0` queries, without embedding inference or a remote search service. The [browser check definition][browser-code] and its successful [same-candidate executions][build-job] exercise discovery, empty/literal-wildcard results, neighbor navigation/copy, both modes and response races. Eight scalar-reference comparisons pass in the [public result][live-job], `reports`: four per mode, IDs 0, 1, 40 and 100. Hamming boundary ties are accepted by distance and membership, with no imposed tie order. These finite cases and code examination support the scoped demo obligation, not exhaustive correctness for all corpus queries or semantic relevance.

**Binary-first loading and transient lifetime — supported.** [Worker code][worker-code], `loadFloat`, transaction handling and queued `close`, together with [component code][component-code], `choose`/`disposeSession`, implement one successful deferred Float32 insertion per session, retry after failure, selection preservation, explicit database closure and Worker termination. Renewed local browser execution injected initial and optional download failures and clipboard denial; recovery succeeded. Same-candidate CI repeats these paths on loopback. [Hosted results][live-job], `floatLoads`, `requests` and `errors`, confirm one initial-session Float32 download, fresh binary initialization after re-entry and no page errors. Hosted failure injection is not claimed. Exclusively `:memory:` storage and mount-local initialization are also supported by code examination; Worker closure is observed, rather than a claim to inspect browser memory reclamation directly.

**Readable inspection and mobile interaction — supported with rendering limits.** [Component code][component-code] exposes actual executed SQL, parameters, six distances, query/end-to-end timings and loaded versions; optional raw stages distinguish database volume from process memory. Native controls, visible focus and bounded scrolling remain. The [browser definition][browser-code], desktop/mobile loop, checks 1280/390px containment with the technical panel open and raw diagnostics collapsed; the [live artifact][live-artifact] retains `live-pages-demo-mobile.png`. The user's accepted optical font offset is not a missing geometric-centering obligation: both axes use standard flex centering, and the prior measured browser geometry placed the content group centrally. No device-specific compensation is introduced. System font glyph metrics can still vary.

**Scoped checks, measurements and integration boundaries — supported.** [Site execution][site-run] passed independent stable/preview construction, shell/docs/Usage integration and identified Pages observation for this candidate. Runtime files bypass Vite transformations; data/UI/checks remain site-owned, without a new package API, engine build or canonical distribution. The [hosted JSON][live-job] reports payloads of 191,727 catalogue bytes, 63,118 binary bytes and 1,993,200 Float32 bytes; SQLite page volume is 286,720 then 2,834,432 bytes. These are actual payload/database observations, not total browser memory, compressed transfer size or performance thresholds. Preparation remains explicitly pinned and independent of documentation version changes.

**Shared dependencies and remaining limits.** The Python reference reads pinned originals and uses its own scalar formulas, importing neither production conversion nor sqlite-vec. It nevertheless shares the upstream source, record ordering assumptions and repository/agent authorship. Production and browser-check code also share authorship; the check reads public UI/network/SQL observations but is not an external audit. Hash agreement proves byte identity, not upstream embedding quality. Successful sampled searches, fixtures and semantic examination do not eliminate correlated mistakes or cover every timing/network/browser combination. OPFS, persistence and full package acceptance belong outside this unit, rather than being unverified obligations silently waived here.

**Conclusion for institution.** The complete allocated demo has a satisfactory scoped Verification record at the identified candidate: both coverage directions are 100%, the official OpenSpec verification checks pass and the applicable repository/test results pass. This prepares a separate archive decision; it performs no synchronization, archive, merge or package publication and asserts no human integration authorization.

## Detailed verification record

### Candidate, project and evidence identities

The local tracked snapshot was reconciled to GitHub candidate `64c01d50e77e11ca9f8f5da37ecbeb0581657da2`, tree `2abf8d31e82b8120f5846f550280f36f9008eab3`, with a clean index/worktree before this report. This report's commit introduces no requirement, implementation or test change. OpenSpec 1.14.0 preflight passed; `list --json` resolved this checkout's `.42p`, and `status`/`instructions apply` resolved `.42p/openspec/changes/site-demo`, built-in `spec-driven`, all four planning artifacts and 16/16 completed tasks, with no unavailable tracking files. All returned context files were read.

Allocation SHA-256: `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`. Site Capture SHA-256: `7e520ad3573cc84fb787229bf33ee195c19bcb6deb92998d7a63d7457c61777c`. Both were recalculated. The [planning correspondence][coverage] remains semantically applicable to this candidate, including the later editorial and centering changes; matching hashes alone did not determine coverage.

Same-candidate [Site run 38858146098][site-run] passed build, deploy and observe. [Observer job 116835107850][live-job], step “Observe the identified live Pages deployment”, contains the primary JSON with preview `64c01d50e77e11ca9f8f5da37ecbeb0581657da2`, independent main `08b5f690259a6c60e6e9c3dbcba6fef5152d4acb`, runtime 0.2.0 and corpus `3f91c339df13b2a511d9e3a9f73efa7b61c54707`. Its successful deployment checks bracket browser observation. The [live artifact][live-artifact], `site-live-38858146098`, preserves `live-pages.json` and the mobile screenshot. The [build/check artifact][check-artifact], `site-checks-38858146098`, preserves `demo-results.json`, `exercise.json`, `result.json` for Usage, assembled results, publication identity and screenshots as listed by the workflow's upload step. Artifact listing confirmed both present and unexpired; binary artifact contents were not separately downloaded during this invocation. Job logs supply directly inspected execution results. The shared preview URL is mutable and is not the evidence identity by itself.

### Control 1 — bidirectional semantic coverage

The [existing correspondence][coverage], forward and reverse sections, was reviewed against the complete unit and all eight delta requirements. No upstream semantic change was needed. The following requirement-oriented mapping complements that obligation-oriented account:

| Delta requirement | Allocated basis and checked realization |
| --- | --- |
| Explicit published stable runtime | C-demo-release, W/C-version-identity/C-channels; explicit resolver, pinned acquisition and shell preservation; fixture/real build evidence |
| Visible runtime identity | C-demo-release; selected version/link plus SQL-observed SQLite/sqlite-vec composition; browser identity assertions |
| Complete attributed emoji corpus | C-emoji; full parser, input hashes, exact identities/bytes, source/MIT notice, system glyphs and limits |
| Binary-first and deferred Float32 modes | C-vector-modes; bit[304]/Hamming, float[300]/cosine, zero padding, deferred one-session reuse/retry |
| Textual discovery and vector exploration | C-interaction/C-search; English textual grid, selected existing vector, six non-self clickable results, truthful copy |
| Actual-operation inspection | C-interaction/C-search and adopted Q-realization choices; executed SQL, distances, actual timing and distinct metrics |
| Transient browser session and usable states | C-memory/C-site; mount-local Worker, in-memory DB/close, response correlation, loading/error/focus/mobile |
| Scoped real-runtime demo checks | C-demo-checks with shell/docs split; scalar reference, real WASM, stable/preview and identified hosted observation, explicit evidence limits |

R-demo/Q-volume retain binary-first rationale, actual size observations and the absence of semantic-quality/latency thresholds. Q-realization retains shell-before-integration dependency, independent docs/demo, permitted implementation choices and one complete unit; O-corpus remains unselected. Every scenario is a normal, failure or boundary case of its mapped obligation. Every task/design decision serves these requirements; there is no added package/storage/model capability or reassignment of another unit. Allocation → Change: **100%**; Change → Allocation: **100%**. This evaluates the selected unit, not the full Allocation or fidelity to every historical primary source.

### Control 2 — official openspec-verify-change

The intact generated skill was available and read before the controls. Its completeness/correctness/coherence procedure was applied; `instructions apply` was used for planning context, not as permission to implement or archive.

| Dimension | Result |
| --- | --- |
| Completeness | Passed: 16/16 tasks supported by implementation and suitable evidence; all eight ADDED requirements implemented. No removed/renamed requirements. |
| Correctness | Passed: eight requirement mappings and all 20 scenarios examined. Normal paths, publication/corpus rejection, initial/optional failure/retry, equal-distance membership, navigation/lifecycle and layout conditions have implementation/evidence support. |
| Coherence | Passed: all six design decisions follow the existing private tooling, pinned acquisition, page-local Vue/Worker, native UI and scalar-reference patterns. Code-pattern consistency was examined, not inferred from task completion. |

Implementation reviewed: `tools/site/demo-data.mjs`, `demo-runtime.mjs`, `demo.mjs`, `demo-reference.py`, `demo-check.mjs`, `demo-exercise.mjs`, integration in `build.mjs`/`observe.mjs`, `site/demo/EmojiDemo.vue`, `demo-worker.mjs`, Site workflow and `docs/site.md`; relevant test definitions were read. Preparation validates source shape, exact key correspondence, finite components and pinned digests. Worker transactions and serialized requests match design decisions 1–3; Vue/native controls and honest operation diagnostics match decisions 4–5; separate scalar original-source calculations and boundary membership match decision 6. Actual generated runtime inventory and executed hosted SQL/reference comparisons connect the code review to real execution.

Scenario dispositions, grouped without dropping conditions: stable selection/retention/rejection (3) are covered by resolver/integrity fixtures and preservation executions; runtime identity (1) by observed SQL versions; corpus preparation/attribution/rejection (3) by parser/notice review, negative fixtures and real preparation; default/deferred/failed optional modes (3) by request counts, explicit cosine table and injected retries; discovery/follow-copy/ties (3) by real UI searches, clipboard and reference checks; inspection (1) by actual SQL/results/summary assertions; transient/loading/mobile-keyboard (3) by request correlation, disposal/re-entry, native focus and viewport checks; reference/deployment/evidence bounds (3) by scalar results, identified observation and this scoped record. Keyboard operability combines native-control semantics, visible-focus CSS and observed focus/radio/summary interactions; it is not an exhaustive assistive-technology audit.

**Findings:** no CRITICAL, WARNING or SUGGESTION finding; no applicable check marked Not verified. Optional sign visualization/2D map and special tie sorting remain intentionally absent, not gaps. Existing strict-validation long-requirement hints concern unchanged other specs and do not establish a site-demo conformity issue. The accepted font-metric optical offset does not contradict the responsive/centering implementation and requires no compensating code. All official checks passed; archive readiness is advisory and does not perform archive.

### Control 3 — repository checks and applicable tests

Renewed on the clean candidate during this invocation:

- `sh tools/check-repository.sh`: passed; canon/source identities and repository gateway, not product acceptance.
- `sh tools/test-repository.sh`: passed, all registered suites completed; no mandatory suite skipped.
- `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh check`: passed, pinned 1.14.0 and generated skill metadata.
- `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict`: 12 passed, zero failed; existing informational hints only.
- `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs`: 37 passed, zero failed/skipped.
- `HARNESS_STATE=/tmp/sqlite-site-demo-harness/tools bash tools/harness.sh exec node .work/run-demo-check.mjs`: passed the repository's `checkDemo` against the current built stable-prefix output, eight reference comparisons, `failurePaths: true`, one initial-session Float32 load and no page errors. The small ignored runner only serves the build and invokes that existing check. It adds no committed test logic.

Prerequisites: Linux x86-64, Node.js 24.19.0, Python 3.12.14, Git, native compiler and existing locked site tooling (VitePress 1.6.4); qualified Chrome 153.0.8010.12 harness identity check passed. The local build was produced from the same UI/tree before its centering commit; source/tree equality was established before review. Loopback serving is not a public Pages observation.

Reused same-candidate CI execution results, inspected in logs: [Site build job][build-job] passed locked install, 35 site tests plus two renderer tests, harness install/dependencies, `sh tools/site.sh exercise`, `example`, `demo`, exact preview build/check, independent stable main build, assembly and assembled observation. This supplies both-base compiler/browser checks, real documentation-preservation rebuild, Usage example and initial/optional/copy failure injection beyond the renewed single-base local check. [Repository run 38858146178][repository-run] also passed `check` and `tests`. Its pre-report Verification/Archive failures are expected missing-report/active-Change lifecycle gates, not passing declarations; this report addresses Verification only.

Primary renewed local outputs are transient `.work/verify-*.log` and `.work/demo-browser.json`; their durable account is this report. Durable same-candidate primary JSON is directly present in the observer logs and retained in the linked artifacts. Earlier cold-preparation reproduction is the qualified historical Apply account, not a newly executed cold-cache test. Source-lock/transformation code remained unchanged and current CI rebuilt from pinned inputs, making that historical observation suitable supporting evidence without extrapolating it to all environments.

Hosted sample query times were 0.3–0.7 ms for Hamming and 0.8–1.0 ms for cosine. Float32 acquisition was 2,844.2 ms in that run; this is not pure SQLite query time. The record separates stages, end-to-end and SQLite volume. No cache-control, bandwidth, mobile-device latency or total-memory guarantee follows. No outstanding conformity gap, failed mandatory check or unavailable applicable prerequisite remains for this scoped verdict.

[allocation]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md
[capture]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md
[coverage]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/.42p/openspec/changes/site-demo/coverage.md
[apply-account]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/.42p/openspec/changes/site-demo/apply-evidence.md
[runtime-code]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/tools/site/demo-runtime.mjs
[data-code]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/tools/site/demo-data.mjs
[worker-code]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/site/demo/demo-worker.mjs
[component-code]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/site/demo/EmojiDemo.vue
[browser-code]: https://github.com/at-rama/sqlite-vector-wasm/blob/64c01d50e77e11ca9f8f5da37ecbeb0581657da2/tools/site/demo-check.mjs
[site-run]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146098
[build-job]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146098/job/116834134635
[live-job]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146098/job/116835107850
[live-artifact]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146098/artifacts/12028146256
[check-artifact]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146098/artifacts/12027858312
[repository-run]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38858146178
