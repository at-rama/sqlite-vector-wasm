---
schema_version: 1
change: build-sqlite-vector-option
allocation_unit: A-build
checked_commit: c6d79e32aac863e0775b97933a2434466a37e9c0
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification: build-sqlite-vector-option

## Institutional view

**Situated conclusion.** Verification passes for **A-build** at clean committed candidate `c6d79e32aac863e0775b97933a2434466a37e9c0`, for the two recorded compositions under the documented tooling and browser conditions. Code/contract examination and repository tests were renewed. Real construction/browser observations from this Apply at implementation commit `5a6dfe1e351b5f70ac86888299e90a61f18f39d5` are reused after a zero-diff comparison of implementation, documentation, proposal, design and delta specs with the candidate. Only tasks, coverage and the execution account changed between these commits. [The Apply execution account][execution] contains the observed results; primary logs, runtime bytes and inventories are available in the executing temporary workspace, not as durable remote artifacts. No historical archived PASS substitutes for those executions.

**Command provenance.** [AGENTS.md][authority] records the human institution of the reconciled Captures; the adopted S-release-engines decision retains sqlite-vec and adds another possible composition. The examined command is [Allocation A-build][allocation], with its complete attributed Distribution C-purpose/C-nonmodification/C-inputs/R-inputs/C-browser/C-static/C-storage and Release/Watch C-provenance build contribution, mapped to this Change in [coverage.md][coverage]. The actual passages, conditions and boundaries were examined in both directions. The [historic SPEC][historical] is retained provenance, not a parallel current contract. This is not a renewed audit of all historical sources-to-Capture fidelity or all allocation units; unchanged hashes identify the examined bytes without establishing authority or fidelity by themselves.

**One composition and one SQLite release.** Supported by renewed code examination, fresh acquisitions/builds and identity/failure fixtures. The default command retains SQLite 3.54.0/sqlite-vec 0.1.9; the explicit recorded lock builds SQLite 3.54.0/Vector 1.1.2. Each handoff binds exact lock bytes, origins, versions and archive digests, with only its selected engine. Core, generated header and browser support come from the same full SQLite source release. No lock or release descriptor is switched. See [Apply account][execution], “Source identities and nonmodification”, and [construction implementation][construction], `sourceSelection`, `verifyAcquisition` and `construct`.

**Canonical APIs and automatic static registration.** Supported by both newly executed raw-browser matrices and unchanged upstream/core examination. All three loader variants passed main, direct Worker, Worker1 and promiser checks. Independent C-style and OO1 connections and Worker transports exposed the exact selected engine and native queries without consumer extension registration; absence of the other engine was checked. BigInt/FTS5 probes and all baseline inventory-inclusion checks passed. Compiled bridge fixtures propagate registration failure; a separate native controlled callback fixture with the actual generated SQLite core/Vector bridge returned an opening error after successful registration. That fixture is not a Vector/WASM product failure injection. See [Apply account][execution], “Integration observations” and “Observed complete browser results”, and [probe definitions][probes]. The exercised cases plus preservation of upstream code/configuration support this bounded conclusion; finite probes do not prove every SQL/API behavior.

**Conditional persistence and its documentation.** Supported by actual main-thread kvvfs and Worker OPFS/opfs-wl/sahpool read/write, plus main-thread unavailability checks, for both candidates and references. Tests ran on trustworthy loopback HTTP with COOP `same-origin`, COEP `require-corp`, browser OPFS/synchronous handles, Web Locks and `Atomics.waitAsync`. [The prerequisite documentation][documentation], “Browser storage conditions”, distinguishes each VFS's requirements; sahpool does not itself require isolation headers. [Apply account][execution], “Observed complete browser results”, records success. This does not establish restart persistence or browser portability; those final-package acceptance duties are not transferred into A-build.

**Pinned, clean construction and failure behavior.** Supported by newly executed installation/check/deps/smoke, cache-cleared reproduction of the default and fresh construction of Vector, then two freshly acquired references. The initially empty tool/npm/product state and checkout transition are explicitly described in [Apply account][execution], “Identity and conditions”; tooling sources/locks did not change during that transition. The second build reused verified tools/compiler cache, never earlier product/source output. Missing tools, wrong identities, unsupported paths/arguments, compile/link errors, asset and handoff-write failures are covered by [offline test definitions][tests] and their renewed successful execution below. Both candidates passed missing/corrupt companion cases. Failures retain diagnostics without returning old outputs. These observations establish the documented path, not all hosts or arbitrary future upstream releases.

**Bounded integration without upstream edits.** Supported by code/diff examination and post-build archive-byte comparisons. All 2,284 original SQLite files in each of four candidate/reference trees matched; both sqlite-vec files and the 18-file consumed Vector view matched the official archives. Vector's seven separate C units link through the generated Make include and supported init hook; `strings.h` inclusion and preserving `MAKEFILE` identity are build glue within that approach. No new SDK, source patch, SQL facade, runtime engine selector, vendored SQLite, Node/native/WASI product or downstream implementation is introduced. Native fixtures/objects are temporary tooling inputs. See [Apply account][execution], “Source identities and nonmodification” and “Integration observations”, and [construction implementation][construction], `compileVector`.

**Traceable output and retained downstream convention.** Supported by the actual handoffs, size/hash validation of all eleven runtime files and successful execution of unchanged downstream `validateBuild()` on the real default handoff. Selected lock/engine, actual compile/link inputs, tools/options/environment and integration hashes are carried forward; used-template identity is correct. [Apply account][execution], “Observed runtime sizes and SHA-256”, records the exact assets; “Lightweight checks and boundaries” records the bounded diff. A raw Vector handoff does not claim support in the existing packager, notices, publication policy or final-package acceptance.

**Shared dependencies and remaining limits.** Both references are separately acquired/built and checked through public browser APIs, but share repository options, harness, probe definitions and agentic authorship with candidates and this report. Correlated construction/probe errors remain possible. Primary results are temporary; the immutable linked execution account is a written account, not the raw outputs. Real browser testing here covers the pinned stable pairs in Chrome 153.0.8010.12; prerelease suffix behavior is supported by exact-identity logic and offline fixtures, not a newly qualified real prerelease. Every future selected pair still needs its required qualification. Full final-package Float32/binary/Hamming oracles, shutdown/reopen persistence, notices and cross-engine publication/Watch policy remain with their allocated owners. These are scoped boundaries, not waivers of an unproved A-build requirement.

**Conclusion for institution.** The additive A-build construction and its retained default satisfy this Change under the recorded examination and execution conditions. All three required controls completed satisfactorily; no unresolved A-build conformity finding remains. This prepares human review of this unit. It neither accepts the full product nor authorizes integration/publication. Synchronization/archive were not performed by this Verification.

## Detailed verification record

### 1. Allocation unit ↔ Change coverage

Selected project root resolved through pinned OpenSpec to `/tmp/apply-build68/.42p`; schema `spec-driven`. The current generated `openspec-verify-change` skill was available and read; no skill installation/update occurred during Verification. Candidate working tree was clean before controls and report authoring.

Allocation snapshot: main `a2c9276385f09473ced800893c073a4129a0e0cf`, `2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md`, SHA-256 `2e1862a7dfb09a52675eb78bda79e32e0a2bad832c196a2b7fb37c9113f1a9ef`, unchanged in the checked candidate. Relevant Distribution Capture SHA-256 `cdec56ee15c5c4eee2d32a42c93a3da0168715004ab469e14a37a7c59a6bb589`; Release/Watch Capture `b75e064a5b4f21cc29be561313be04d88493ce59d29b60fce5ce8705a15a53be`.

Reviewed Change inputs: `proposal.md`, complete `specs/browser-build/spec.md`, `design.md`, all eight task descriptions and `coverage.md`. The exhaustive forward contribution table and reverse requirement grounding remain in [coverage.md][coverage], “Forward coverage” and “Reverse grounding”. Each qualified A-build obligation retains its complete conditions, exclusions and dependencies; every requirement/scenario/task has that unit or applicable-canon grounding. Permitted static glue and probes introduce no separate product responsibility. No missing source authority or semantic revision was needed in the examined scope. **Allocation → Change 100%; Change → Allocation 100%.** This semantic judgment is distinct from the implementation findings below.

### 2. Official OpenSpec verify

Executed the generated workflow's completeness, correctness and coherence assessment against the confirmed context, not an invented `openspec verify` command. The CLI reports 8/8 tasks, zero remaining, `all_done`; that tracking result alone does not establish the following findings.

| Dimension | Examined result |
| --- | --- |
| Completeness | 8/8 substantive tasks complete; all 10 MODIFIED requirements represented in implementation; no ADDED/REMOVED/RENAMED blocks. |
| Correctness | All 10 requirement mappings and 37 scenarios supported by the combination of code examination, offline controls and real construction/browser observations identified below. Conditional prerelease cases use exact-version code/fixtures; no new real prerelease qualification is claimed. |
| Coherence | Selector/default, seven separate C units, official hook, generated Make include, native probes, matched reference, additive provenance and unchanged downstream boundaries follow the design and existing repository patterns. |

Implementation locators below are in [construction][construction], [browser check orchestration][checks], [browser probes][probes], [offline tests][tests] and [documentation][documentation]. Execution outcomes are in [the Apply account][execution] and the renewed checks below; definitions alone are not cited as executed success.

| Delta requirement and all its scenarios | Implementation and examination / suitable evidence |
| --- | --- |
| Fresh verified build inputs (8) | `parseBuildArguments`, `sourceSelection`, `selectedEngine`, `verifyAcquisition`, `construct`; wrapper forwards one optional lock. Fresh recorded/default/alternative builds, prior-workspace retention; argument/schema/origin/digest/suffix/stale-handoff fixtures; unchanged A-inputs rejects unrecorded/failed acquisitions. No engine/default fallback. |
| Common SQLite release identity (2) | `checkRecipe`, `checkRelease`, canonical `configure`/`make sqlite3.c`, complete runtime inventory. Same acquired full tree supplies core/header/WASM/JS; mismatched headers, unsupported recipe/source inventory and missing outputs fail fixtures. Both actual builds/references use 3.54.0. |
| Static registration on every connection (4) | Retained vec bridge and new Vector bridge return `sqlite3_auto_extension`; actual independent C/OO1 and Worker1/promiser native SQL/version checks pass. Compiled registration-return fixtures and controlled native callback-opening failure pass. Prerelease expected-version strings retain full suffix; real execution qualifies only the current stable pins. |
| Canonical browser baseline is retained (5) | `reference`, `assertReference`, `inspect`, `checkConstructed` and `probe`; both full three-mode matrices, native SQL, BigInt/FTS5 and 84 inventory-inclusion comparisons pass. Identity/flag/reference mismatch and wrong-neighbor controls detect substitution/regression. |
| Upstream storage conditions are preserved (2) | Retained `probe` VFS branches; actual kvvfs/OPFS/opfs-wl/sahpool operations and unavailable-main-context failures pass in both candidates/references. Documentation retains separate upstream prerequisites; restart testing remains final-package acceptance. |
| Recorded reproducible construction (3) | Existing qualified harness and `buildEnvironment`, actual tool/options reporting; initially empty install/deps/smoke and clean candidate construction evidence, cache-clear command, fresh source trees. Tool-identity wrapper tests and ambient-override rejection pass. The actual transition/cache reuse is disclosed, not described as two independent SDK installations. |
| Integration and runtime boundaries (3) | `compileVector`, separate templates and official recipe; archive comparisons show no upstream edits, fixed runtime inventory excludes additional distributions. Inspection confirms build/init glue only. Missing content/hooks/compile/link tests fail rather than patch/fallback. The two initial diagnostic obstacles were resolved within the authorized approach. |
| Traceable runtime handoff (5) | `atomicHandoff`, `runtimeInventory`, selected engine/lock and actual compile/link/hash fields in `construct`; both actual handoffs match emitted JSON and validated asset hashes. Missing/empty/extra/nonregular/stale/wrong/write-failure fixtures pass; unchanged downstream validator accepts the real default. Suffix fixtures preserve exact identity. |
| Failure does not reuse previous output (3) | Unique workspaces and `construct` catch/diagnostic path; offline injected stage/compile/link/write/inventory failures retain diagnostics and no success, while earlier-success fixtures remain unchanged. Real diagnostic failures retained their workspaces; successful assets remain available. |
| Reproduction and browser prerequisites are documented (2) | `docs/build.md` includes both exact commands, source-only selection, tooling, outputs/lifetime, same-lock reference and shared-check limits; separate VFS prerequisites and restart/final-package boundary. Documented setup/build/check sequence actually executed under recorded host conditions. |

**Finding dispositions.** No CRITICAL, WARNING or SUGGESTION conformity issue was identified in this scoped examination; no applicable official verify check was skipped. The observed `strings.h` declaration issue and lazy Makefile-directory issue were corrected during Apply, documented and covered by renewed fixture/real build results; neither required a source patch or changed design. The unchanged synchronized browser-build Purpose still names sqlite-vec: aligning it belongs to subsequent native synchronization/archive as planned, not a silent source edit during Verification. Existing strict-validation informational length notices do not signal an unmet requirement. **Official verify passes for this Change; subsequent lifecycle operations remain separate.**

### 3. Repository checks and applicable tests

Renewed on the clean checked candidate, all exited zero:

```sh
sh tools/openspec.sh check
OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec list --json
OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec status --change build-sqlite-vector-option --json
OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec instructions apply --change build-sqlite-vector-option --json
sh tools/check-repository.sh
sh tools/test-repository.sh
OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict
```

Repository check passed. Offline suites passed **333 tests: 108 Python (44 + 47 + 6 + 11) and 225 Node (44 + 12 + 15 + 39 + 27 + 51 + 37)**, zero failures/skips. Strict OpenSpec validation passed **13/13 items**. Material prerequisites were system Python/Bash/archive tools, Node, npm, C compiler/GNU Make and the installed pinned OpenSpec environment. These checks do not install or execute the product browser build.

Real toolchain/install/browser evidence is reused from this Apply after identity binding: `git diff --exit-code 5a6dfe1e351b5f70ac86888299e90a61f18f39d5 HEAD -- tools docs <Change>/proposal.md <Change>/design.md <Change>/specs` returned zero differences. Thus no build/probe/test/config/documentation/contract change intervened. All real build/reference assets were hash-checked when copied into browser fixtures. The native callback fixture uses the unchanged generated core/bridge associated with that execution. Full commands, source identities, integration hashes and every candidate asset size/SHA-256 are retained in [the execution account][execution]; observed WASM sizes are 955,300 bytes for sqlite-vec, 943,014 for Vector and 879,114 for each SQLite-only reference. These are size observations, not performance rankings.

Boundary comparison against main `a2c9276385f09473ced800893c073a4129a0e0cf` returned zero differences for `inputs/` (including `inputs/release.json`), harness sources/locks, acquisition, package, acceptance, Updates, Watch, release, Site and engineering inputs. The complete implementation diff is limited to the declared A-build surfaces and Change-local records. Primary Verification stdout/logs: `/tmp/verify68-{repository,tests,openspec}.log`; code-applicability and boundary comparisons: `/tmp/verify68-{code-applicability,boundaries}.log`. These transient locations identify observations made in this invocation, not accessible remote evidence links.

No unresolved failure, blocker or unverified applicable A-build control remains. No synchronization, archive, merge, release/default switch or publication was performed.

[authority]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/AGENTS.md
[allocation]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md
[historical]: https://github.com/at-rama/sqlite-vector-wasm/blob/d463c4034604d6593cf45bbf5a523598dd3f53cc/SPEC.md
[coverage]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/.42p/openspec/changes/build-sqlite-vector-option/coverage.md
[execution]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/.42p/openspec/changes/build-sqlite-vector-option/apply-evidence.md
[construction]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/tools/build/build.mjs
[checks]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/tools/build/check.mjs
[probes]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/tools/build/browser-probe.mjs
[tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/tools/build/tests/build.test.mjs
[documentation]: https://github.com/at-rama/sqlite-vector-wasm/blob/c6d79e32aac863e0775b97933a2434466a37e9c0/docs/build.md
