---
schema_version: 1
change: acquire-sqlite-vector-sources
allocation_unit: A-inputs
checked_commit: 7e204267d0c0032cd8b2210b0087d1bf18d73047
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# A-inputs Verification

## Institutional view

**Situated conclusion — passed for A-inputs.** The clean committed candidate `7e204267d0c0032cd8b2210b0087d1bf18d73047` realizes the additional SQLite-Vector source-acquisition option while retaining sqlite-vec, within the examined requirements and scenarios. All three Verification controls completed satisfactorily. Repository/tests/OpenSpec execution was renewed on this candidate. The four clean-checkout acquisitions are reused from Apply at `823172e719b3ecdffa779b256b96fb69a29e9dc6`: acquisition code, tests, documentation and input locks are byte-identical between those commits. Their [durable execution account][evidence], section “Isolated clean-checkout reproduction”, is available; raw archives, metadata, handoffs and logs remain transient and are not published primary evidence. The result does not qualify a SQLite-Vector WASM build or a release.

**Command provenance.** Examined the instituted Distribution `C-purpose`, `C-inputs`, `R-inputs`, including the maintainer's `S-release-engines` retention decision, Release/Watch `C-provenance`, and the complete qualified `A-inputs` unit in the [Allocation snapshot][allocation]. Compared those attributed obligations with the proposal, design, delta and tasks in both directions using the [coverage mapping][coverage]. The mapping remains 100% each way; it is traceability, not proof of execution or a fresh audit of historical sources. `AGENTS.md` identifies human institution. Distribution's `S-spec` links the immutable historical SPEC at `d463c4034604d6593cf45bbf5a523598dd3f53cc` as provenance; this review does not restore superseded historical clauses or independently audit that entire source chain.

**Retain both source options, one engine per pair — supported by renewed fixtures, code examination and reused real acquisitions.** Two fixed resolver paths and distinct lock component keys preserve sqlite-vec and add SQLite-Vector without conversion, engine registry or alternative-engine fallback. The four real acquisitions succeeded in both invocation orders. Equal textual versions across engine upstreams cannot share a baseline pin in the examined implementation. See [resolver and acquisition implementation][implementation], `resolve_pair`, `resolve_vector_pair`, `acquire_lock`; [test definitions][tests], `test_same_version_other_upstream_cannot_supply_pin` and `test_selected_bytes_exclusions_handoff_and_both_orders`; execution accounts appear below and in Apply evidence. This establishes the recorded options, not arbitrary future upstream compatibility.

**Exact official released identities — supported by renewed fixtures and the reused official preparation account.** Stable defaults, independent explicit versions, published prerelease suffixes and rejection cases are represented and exercised. SQLite-Vector 1.1.2's official release/tag/commit binding and commit-addressed archive are recorded in the [candidate source lock][pin]. sqlite-vec's official amalgamation-asset/digest path remains available. The [selection implementation][implementation], `select_sqlite`, `select_vec`, `select_vector`, and the `ResolutionTests`/`VectorResolutionTests` [test definitions][tests] support the observed results. SQLite's previously documented lack of a numbered prerelease archive convention is retained: unknown formats fail rather than guessed support. Channel and cross-engine publication policy are not acquisition decisions.

**Integrity recorded before source use — supported by renewed failure tests and repeated official downloads.** Candidate-only Vector hashing is separate from recorded-lock acquisition. Git-index matching, immutable established pins, moved-tag rejection and digest-before-inspection/extraction were examined and exercised. Both real Vector acquisitions independently reproduced the recorded SHA-256; SQLite and sqlite-vec matched their retained pins. See [implementation][implementation], `preserve_pin`, `select_vector`, `recorded_lock`, `acquire_lock`; [test definitions][tests], pin-drift and digest-before-extraction cases; [Apply execution account][evidence], “Candidate preparation and first acquisition” and reproduction. Vector's checksum is locally measured, not an upstream-published checksum/signature. Repository adoption and later mismatch failure do not establish publisher authenticity beyond the official HTTPS metadata/origin binding used here.

**Sufficient unchanged sources without vendoring — supported by renewed archive fixtures and reused byte comparisons.** SQLite supplies its full separately pinned source tree. Vector supplies 18 selected regular source/header/license files; its own SQLite, packages and unrelated symlinks do not enter the source view. Required content/version, unsafe names, collisions, selected links and linked ancestors fail in the exercised cases. The independent comparison path checked every handed-off file against its archive member: 9,176 file comparisons over four pairs, with SQLite executable modes retained. See [extraction implementation][implementation], `extract_vector`, `archive_members`, `source_root`; the `VectorAcquisitionTests` [definitions][tests] and [reproduction account][evidence]. Byte-preserving selection is acquisition glue. Package notice qualification, including FP16 provenance, remains A-package's obligation.

**Fresh acquisition and complete source-only handoff — supported by renewed fixtures and reused clean-checkout execution.** Four invocations used distinct workspaces in two initially empty checkouts without SDK/tool/npm/source outputs; each downloaded both exact archives. Handoffs retain component identity, versions, origins, verified digests and consumed lock digest, plus Vector release/tag/commit. Failure cases clean their own workspace, leave previous outputs intact and emit no successful pair. See [implementation][implementation], `acquire_lock`/`acquire_command`, [test definitions][tests], fresh-workspace and failure cases, and the [execution account][evidence]. Supplying all SQLite sources supports the same-release core/WASM/JS boundary; building those components is A-build's responsibility. Production pins, release descriptor and downstream code are unchanged against the planning baseline.

**Common dependencies and limits.** Fixture construction, implementation and this semantic review share agentic authorship. Official downloads exercise real upstream archives rather than authored fixtures, but share the helper, host/network and standard-library hash/archive implementations with the separate comparison script. This is not an independent parser or security audit. Raw transient results are not durably attached; the committed execution account is the retained evidence. Finite exercised cases and code examination support the scoped conclusion, not a universal absence of defects. SQLite-Vector static registration, WASM/Workers/OPFS/FTS5 compatibility, package notices and performance are outside A-inputs and remain unestablished by this Change. Cross-engine version/maturity/alpha/reference policy and the SQLite-Vector Watch baseline remain open with A-release/A-watch; they were not silently decided or made acquisition gates.

**Conclusion for institution.** A-inputs is complete for the recorded two source options, with satisfactory scoped Verification. The next lifecycle action can be native archive/synchronization under the repository rules. This invocation performs neither, and grants no merge or publication authorization.

## Detailed verification record

### Candidate, project and coverage

Confirmed clean Git inputs at the checked commit before creating this report. Pinned OpenSpec 1.14.0 preflight passed; `context --json` resolved `/tmp/apply-inputs-67/.42p`; `status --change acquire-sqlite-vector-sources --json` and `instructions apply --change acquire-sqlite-vector-sources --json` identified the four existing planning artifacts, `spec-driven`, and 7/7 complete tasks. The report destination is the returned Change directory. No generated skill was installed, restored or updated during Verification.

Allocation SHA-256: `2e1862a7dfb09a52675eb78bda79e32e0a2bad832c196a2b7fb37c9113f1a9ef`, unchanged from `f754f2ba8723d65db981dbcf1f171ae1d9b0cadd`. Reviewed [Distribution][distribution] `C-purpose/C-inputs/R-inputs`, [Release/Watch][watch] `C-provenance` and Allocation `A-inputs` with all scoped conditions. Re-read the proposal, design, all seven MODIFIED requirement blocks and 33 scenarios, tasks and coverage. The coverage document's 15 forward dispositions and seven reverse rows preserve source selection/admissibility, identities, prior integrity, archive/no-vendoring, clean reproduction, complete provenance handoff, retention and owner boundaries. Both semantic directions remain 100%; no unallocated requirement or omitted attributed obligation was identified in that comparison. This is separate from correctness of the implementation.

### Official OpenSpec verify

Executed the current generated `openspec-verify-change` agent workflow: task/spec completeness; implementation and scenario correctness; design adherence and code-pattern consistency. This is not an invented CLI `verify` command. Advisory archive readiness from that workflow is subordinate to the other two controls.

| Dimension | Result |
| --- | --- |
| Completeness | 7/7 tasks complete; implementation located for all 7 MODIFIED requirements |
| Correctness | All 7 requirement implementations and all 33 scenarios examined against code and suitable fixture/real-execution evidence; no applicable check skipped |
| Coherence | Fixed commands, schema separation, official metadata binding, selective byte-preserving source view and source-only boundaries match design; existing Python/shell helper and test patterns retained |

Implementation/scenario correspondence (test identifiers refer to [test definitions][tests], whose renewed execution is recorded below):

1. **Official published source selection** → `version`, `published_vector`, `select_sqlite`, `select_vec`, `select_vector`, the two pair resolvers. All seven scenarios: omitted/independent versions, explicit engine/both overrides, prereleases, invalid/draft/development identities, SQLite development downloads and insufficient newest-stable metadata. Existing `ResolutionTests` plus `VectorResolutionTests.test_fixed_schema_and_independent_selection`, `test_explicit_prereleases_and_stable_default`, `test_invalid_release_and_no_latest_fallback` exercise these cases. API-pagination transport is examined in the command code; real release 1.1.2 preparation uses the exact-release endpoint.
2. **Frozen source pair without automatic fallback** → `recorded_lock` and `acquire_lock` never call resolution or release discovery. Three scenarios: later release, failed/incompatible frozen pair and no other-engine fallback. `test_fresh_downloads_frozen_pair_and_handoff`, `test_failures_clean_only_own_workspace_without_other_engine` and fixed-command examination show only pinned archive URLs are requested and no repair path exists. External build incompatibility itself is not tested as an A-inputs feature; the helper has no compatibility-search interface.
3. **Repository-recorded official source identities** → `validate_lock`, `select_vector`, `resolve_vector_command`, `recorded_lock`. Seven scenarios: new official pin; locally hashed Vector candidate; unbound snapshot; missing official SQLite digest; incomplete lock; retained sqlite-vec policy; equal versions across upstreams. `LockTests`, `test_command_candidate_is_atomic_and_not_adopted`, `test_annotated_tag_and_unbound_commit`, `test_sqlite_digest_policy_is_unchanged`, `test_same_version_other_upstream_cannot_supply_pin` and retained missing-digest/index tests exercise the boundaries. Real pin preparation and subsequent recorded acquisition also succeeded.
4. **Existing pin integrity is retained** → `preserve_pin` plus `select_vector` compares established release/id/tag/commit/origins before accepting its candidate digest. Three scenarios: changed official digest, moved Vector tag and acquisition independent of moving checksums. `PinTests`, `test_bindings_and_archive_drift_fail` and acquisition URL assertions exercise rejection/retention. Candidate preparation may remeasure bytes; acquisition never obtains a replacement checksum.
5. **Verification precedes source use** → `acquire_lock` verifies each downloaded archive before passing it to either extraction path. Two scenarios: matching vs changed/incomplete archive. `test_altered_and_truncated_archives_fail_before_extraction` and `test_failures_clean_only_own_workspace_without_other_engine` assert the corrupt input is not inspected/extracted, including the second-source path. No complete pair is emitted until both inputs pass.
6. **Official sufficient archives without vendoring** → `source_root`, `archive_members`, `extract_file`, `extract_vector`. Four scenarios: sufficient official inputs, unrelated package symlinks, required-content failure and repository exclusion. Existing archive tests plus `test_selected_bytes_exclusions_handoff_and_both_orders`, `test_unsafe_paths_selected_links_and_collisions`, `test_content_and_version_required` exercise these. The clean-worktree acquisitions and file comparison establish the actual pinned layouts; tracked-file review excludes acquired upstream trees and generated SQLite output.
7. **Fresh acquisition and complete handoff** → `acquire_lock`, `acquire_command`, and component-specific handoff fields. Seven scenarios: clean checkout, earlier trees, second-source failure, complete handoff, no distribution activation, exact prerelease and both paths retained. Existing `AcquisitionTests` plus `VectorAcquisitionTests` exercise freshness, cleanup, previous-output preservation, exact output and prerelease behavior. Reused four-pair reproduction covers clean actual inputs and both orders. Git comparison confirms default pins, descriptor and downstream code did not change, supporting the non-activation scenario without claiming runtime tests.

**Findings:** 0 critical, 0 warning, 0 suggestion; no applicable check marked not verified. The reviewed design is implemented without introducing a generic backend mechanism or removing sqlite-vec. Long requirement notices from structural validation are informational; existing full MODIFIED blocks were retained as instructed. The scoped finding does not imply full-product acceptance.

### Renewed executable controls

Executed on the clean checked candidate, before report authoring:

```sh
sh tools/check-repository.sh
sh tools/test-repository.sh
sh tools/openspec.sh exec validate --all --strict
```

All returned exit status 0. Repository output reports canon byte identities, Capture/Allocation identities and repository checks passed; those checks explicitly do not evaluate human authorization, semantic coverage or product acceptance. Strict OpenSpec validation reports 13 passed / 0 failed, with informational long-text notices.

The registered suite executed **317 tests**, zero failures: repository gates 44; inputs 47; build 28; package 12; acceptance controls 15; release 39; update notices 6; update controls 27; Watch 51; OpenSpec tooling 11; site 37. Inputs include 34 retained tests plus 13 added test methods with multiple subcases. Python 3.12.14, Bash 5.2.21, curl 8.5.0, Git 2.51.1, GNU tar 1.35, UnZip 6.00, Node 24.19.0, npm 11.9.0 and GCC 13.3.0 satisfy the applicable prerequisites; no WASM SDK was required for this source-only verification. No mandatory test was skipped. These are newly executed results recorded here; raw logs are transient and not published primary artifacts.

Real upstream acquisition evidence is reused from the same Apply invocation, not rerun during Verification. `git diff 823172e719b3ecdffa779b256b96fb69a29e9dc6 7e204267d0c0032cd8b2210b0087d1bf18d73047 -- tools/inputs.py tools/inputs.sh tools/tests/test_inputs.py docs/source-acquisition.md inputs` is empty. Only task/evidence/coverage prose changed between those commits. The [Apply account][evidence] records commands, versions, hashes, archive sizes, two clean checkouts and four successful runs. This applicability check supports reuse, not independent corroboration.

### Final disposition

All A-inputs obligations have a visible disposition above, and all three controls passed for this candidate. No unresolved A-inputs conformity gap or evidence prerequisite was identified in the examinations performed. No source/requirement correction was made during Verification. The active Change and its future archive/synchronization remain distinct; the archive merge gate is expected to remain unsatisfied until that lifecycle operation occurs.

[allocation]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md
[distribution]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/.42p/engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md
[watch]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/.42p/engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md
[coverage]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/.42p/openspec/changes/acquire-sqlite-vector-sources/coverage.md
[evidence]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/.42p/openspec/changes/acquire-sqlite-vector-sources/apply-evidence.md
[implementation]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/tools/inputs.py
[tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/tools/tests/test_inputs.py
[pin]: https://github.com/at-rama/sqlite-vector-wasm/blob/7e204267d0c0032cd8b2210b0087d1bf18d73047/inputs/sqlite-vector.sources.lock.json
