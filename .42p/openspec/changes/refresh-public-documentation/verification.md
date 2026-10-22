---
schema_version: 1
change: refresh-public-documentation
allocation_unit: A-site_docs
checked_commit: 8b497184b6d7bfd7432f638d08cde78724b8070e
verdict: failed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: failed
repository_checks: passed
applicable_tests: failed
---

# Verification — refresh-public-documentation

**Situated conclusion.** This renewed 42P Verification **fails** for A-site_docs at `8b497184b6d7bfd7432f638d08cde78724b8070e`. The current guide and deployed site pass their renewed checks, but the release preparation's applicable documentation-link check fails on the README's new Demo badge. [Release exercise 39735940075](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39735940075/job/119681501085) reports `README.md: missing site target https://at-rama.github.io/sqlite-vector-wasm/demo/`. The renderer is called without preparing that route in its isolated check directory. This is an integration defect in the documentation check, not evidence that the deployed Demo URL is missing. Successful local tests, native SQL execution and actual Pages observations do not waive it.

**Command provenance.** [AGENTS.md](https://github.com/at-rama/sqlite-vector-wasm/blob/8b497184b6d7bfd7432f638d08cde78724b8070e/AGENTS.md), “Authority and navigation”, identifies the instituted Captures. The examined command is [Allocation A-site_docs](https://github.com/at-rama/sqlite-vector-wasm/blob/8b497184b6d7bfd7432f638d08cde78724b8070e/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), “Public presentation and usage”, with Site Capture C-site, C-readme, the documentation part of C-demo-checks, demo preservation in C-demo-release and Q-realization, plus Distribution C-release-review's handoffs. Those contributions were compared with the effective five-requirement contract and the Change's coverage mapping. This examination does not independently audit the original conversations or certify historical fidelity from matching hashes.

**Single-source content and editorial quality — supported by examination and renewed rendering tests.** The README remains the presentation source; Usage retains its own source and all nine executable/code fences unchanged by this final editorial pass. The maintainer's removal of the provenance/licensing section is preserved. Three repetitions were removed: the introductory installation sentence, repeated optional-quantization explanations and repeated bundler-compatibility wording. Examples, browser/storage conditions and the guide's progression remain intact. Published Presentation now stays product-first; Usage retains exact reproducibility information beside installation. Candidate Presentation retains unpublished status and its archive recipe. The [current Usage](https://github.com/at-rama/sqlite-vector-wasm/blob/8b497184b6d7bfd7432f638d08cde78724b8070e/docs/usage.md), “Host and initialize” through “Browser persistence”, and renewed renderer/documentation tests support this limited conclusion.

**Exact example identity and execution — supported, with a failed surrounding handoff.** The downloaded [Site checks artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39735940191/artifacts/12406902985), `docs-example/result.json`, binds actual page and dedicated module Worker execution to this exact commit, current README/Usage source hashes and published 0.3.1 archive SHA-256 `753ead2e894f8b502b75d2328f1b991bcf83fb5bedb9351591309fe7a3f77adb`. SQLite 3.54.1 and SQLite-Vector 1.1.2 returned identical neighbors `[[1,0],[2,1.4142135381698608]]`; installed/copy inventory and unchanged-runtime checks passed. The downloaded [release exercise artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39735940075/artifacts/12407081960), `release/run-BVWhWY/documentation-example.json`, separately records the same source hashes and results against this head's exact qualified candidate archive. Its fixture version 0.3.0 is explicitly unpublished. That example succeeded before the subsequent link check failed; the complete release exercise did not pass.

**Links, mobile rendering and actual deployment — Site checks passed; release-path check failed.** [Site run 39735940191](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39735940191) built, deployed and observed this exact preview successfully. Its downloaded [live Pages artifact](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39735940191/artifacts/12407127264), `live-pages.json`, identifies this branch/head and actual stable/preview URLs, with Chrome 153.0.8010.12 at 1280px and 390px. Navigation, source-derived content/code, images, links and anchors passed on the observed deployment. The separate release check calls `prepareDocs()` in an unprepared directory and cannot resolve the newly linked demo route. Required link-check preservation through preparation therefore remains unsatisfied despite the deployed success.

**Latest metadata and practical footprint — retained, using identified earlier observations.** The metadata endpoints and measured summary remain automatic and version-neutral in public prose. The immutable [footprint record](https://github.com/at-rama/sqlite-vector-wasm/blob/1193e6964ff262a3c4d17e0593a639fd4ca244ad/docs/runtime-footprint.md), “Reproduce the measurement”, is unchanged: note SHA-256 `d8a922a1bcdb48c8c5cbfacf80db47018be464346b6d35f9a875c2b5f6da6c1e`. Measurement execution and package/hash comparisons are reused from the [earlier Verification account](https://github.com/at-rama/sqlite-vector-wasm/blob/8917fc81e0ec1c69000d9151d03159b597f1818f/.42p/openspec/changes/refresh-public-documentation/verification.md), “Latest metadata and truthful footprint”: 1,772,364 raw bytes and 671,800 actually served gzip bytes. This invocation did not renew that HTTP measurement or npm-page inspection. The preceding editorial pass observed the changed badge endpoints as `latest: v0.3.1` and `CI: passing`, recorded in [Apply evidence](apply-evidence.md), “Editorial correction after review”. Those conversation observations have no independent public transcript. The dated measurement is not a guarantee of future transfer size or RAM use; the previously reported npm HTML access limitation remains explicit.

**Independent updates and demo preservation — supported within A-site_docs.** The current Site artifact contains 19 integration exercises, including independent source edits, both bases, separate demo integration and failure cases. Current live records retain the independently selected demo 0.3.0 at stable and preview URLs. Tracked demo selection, data, component and Worker hashes match the earlier Apply record. No runtime/API, release policy, package document mapping or demo source changed. Actual demo observations here support preservation/integration, not renewed full A-site_demo or product acceptance. Shell deployment and publication remain with their owners.

**Common dependencies and limits.** Repository-authored tooling, implementation and this examination share specifications and agent authorship. Hosted browser execution crosses the public/runtime boundary but is not an independent external audit. Finite exercised cases do not prove every browser, bundler or OPFS mode. The shared preview is replaceable and Actions artifacts have retention limits. Artifact ZIP digests were checked before their primary JSON records were read. Local logs remain transient. The release-link failure is an unresolved required obligation, not a harmless scope exclusion.

**Conclusion for institution.** The three Usage edits are applied and the current public deployment and examples have renewed evidence. This Verification is nevertheless failed and does not support treating the Change as satisfactorily verified. Correct and rerun the release documentation-link preparation, preserving actual route/fragment validation, then renew Verification. No correction, synchronization, archive, merge or distribution publication was performed during this invocation.

## Detailed record

### Control 1 — allocation-unit correspondence

Allocation SHA-256 remains `80e3d64c3e30e9340b192ca2c2867e46e91f076036319c1e0c89866f3b9b40cc`; Site Capture SHA-256 remains `6d6cfb73e49d18984cc05ddeb0549719061ea7e27a3a1e5c396ac2affd30be3f`. Both match the proposal's selected snapshots. The complete [design mapping](design.md), “Allocation coverage before Apply”, remains valid: single-source presentation/Usage, truthful native candidate and published guidance, exact examples, usable links/images/anchors, independent integration/demo preservation, actual Pages checks and owner boundaries all have requirements/scenarios/tasks. Conversely, the two modified requirement blocks, badges, measurement note and bounded renderer/extractor changes serve these contributions. Both directions remain 100%; correspondence is not implementation conformity. The editorial corrections refine the existing design without changing the instituted Capture or Allocation.

### Control 2 — official OpenSpec verification

The repository-owned composition skill and unmodified generated `openspec-verify-change` skill were read and used. The pinned CLI resolved this checkout's `.42p`, schema `spec-driven`, all four planning artifacts and 13/13 checked tasks, with no unreadable tracking input. Existing proposal, delta, design, tasks and the cumulative site-docs baseline were examined.

| Dimension | Finding |
| --- | --- |
| Completeness | 13/13 task boxes checked; both modified requirements have implementations. The current failed integration check prevents treating those boxes as proof of completion. |
| Correctness | Both modified blocks and their 17 scenarios mapped to sources, renderer/example code, negative tests and primary results. The candidate/final documentation handoff and preserved link validation have an observed defect. The other three effective requirements were also reviewed; the systematic-link requirement is affected. |
| Coherence | Product-first rendering, Usage reproducibility and existing runtime/source binding follow the design. The added Demo link was not accommodated by the release path's standalone renderer call. |

**CRITICAL — unresolved documentation integration failure.** `tools/release/documentation.mjs`, `renewDocumentation()` (lines 132–140), invokes `prepareDocs()` without preparing the destination's demo route. `tools/site/docs.mjs`, `documentationResolver()` (lines 99–110), correctly rejects that missing internal target. The README's new Demo badge now reaches this path. Primary failure evidence is `release/run-BVWhWY/documentation-links.log` in artifact 12407081960 and the linked failed job. Remedy: prepare/validate the shell-owned Demo destination for this standalone documentation check without deleting the badge, suppressing link errors or weakening target validation; then rerun the exact-head release documentation exercise and Verification. This is a correction recommendation, not an applied change or a new product requirement.

No further issue was established in the examined editorial content, scenario mappings or code patterns. The generated workflow cannot declare readiness with this critical finding. Synthetic identity/mismatch tests remain distinguished from real native SQL execution. No applicable check was silently waived.

### Control 3 — repository and executable results

Reviewed candidate: remote `8b497184b6d7bfd7432f638d08cde78724b8070e`, tree `8042b9a91ff05d382e0af51742fa8f004ddaa5ba`. The clean committed reconstructed local checkout had the identical tree before this report. Its synthetic local commit identifier is not the remote candidate identity. Dependencies and generated skills were already available; none was installed or refreshed during Verification.

Renewed successful local commands:

- `sh tools/openspec.sh check` — locked 1.14.0 CLI, installation and generated metadata conform.
- `sh tools/openspec.sh exec list --json`, `status --change refresh-public-documentation --json`, `instructions apply --change refresh-public-documentation --json` — confirmed root, artifacts and tracking.
- `sh tools/check-repository.sh` — repository integrity, canon bytes and Capture/Allocation identities pass.
- `sh tools/openspec.sh exec validate --all --strict` — 13 items pass; long-description messages are informational.
- `sh tools/test-repository.sh` — all 471 registered tests pass: 98 Python and 373 Node.js.
- `node --test tools/site/checks/*.test.mjs` — all three locked-VitePress renderer tests pass, including stable/preview resolution and actual guide snippet selection/negative cases.

Node.js 24.19.0 and existing locked dependencies were used. Logs: `.work/usage-verify-check.log`, `.work/usage-verify-strict.log`, `.work/usage-verify-tests.log`, `.work/usage-verify-renderer.log`.

Hosted results for the checked head:

- Site 39735940191: build, deploy and actual observation succeed; current published example, integration exercises and actual Pages records were downloaded and examined.
- Distribution release 39735940075: `exercise` fails at `documentation-links.log` after the candidate example succeeds. Publisher/candidate publication jobs were skipped. The failure is retained in `applicable_tests: failed` and `openspec_verify: failed`.
- Repository 39735940152: `check`, `tests` and the machine report gate pass; `archive` fails because the Change is active. The report gate read the older report and does not establish this renewed verdict or evidence freshness.

Primary artifact ZIP SHA-256 digests matched the API descriptors:

- Site checks 12406902985: `d7bca41c2f10d500b59c32743f740b6a9c3718e5ec3d311da43b73cf4030c6ad`.
- Live Pages 12407127264: `ddd348b8ce919be8a89e60f749047bb6e63f7774a8551387e10fa9be6b89c652`.
- Release exercise 12407081960: `a06abdefc6526c9224cb64ad184fc2a8a95d960b83d32bcf80c71a8bb169ff58`.

The example records identify raw README SHA-256 `b02a1115a79ca66b9e4199fc434f71b6db50b074f787f3d3abdab174d778657a` and Usage SHA-256 `3d4a66cc22b62c9f9da9ffaf617a5e8cdf327a4f4793bcea3bbb374baffbabeb`, matching the reviewed sources. Published archive binding and candidate `qualifiedCommit` match their respective contexts; neither record is replay-only. Candidate archive SHA-256 is `b73d6ac17fbb49b90996d6fd11edb158142238f89398b054cf534a4572db6ebf`. These successful intermediate records do not change the failed aggregate verdict.
