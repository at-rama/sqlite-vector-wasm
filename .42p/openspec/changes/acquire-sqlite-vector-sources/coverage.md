# A-inputs ↔ acquire-sqlite-vector-sources

## Identity and method

Planning contract at baseline `12370ee6093cf931771ecaa4ab4e217f45466fbf`; unit **A-inputs** in [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0d43d5ee8864388060ee7e15b1b0aac0491190adc77b2c4431400a82d273badd`. Direct design inputs: [Distribution](../../../engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), C-purpose/C-inputs/R-inputs, and [Release/Watch](../../../engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), C-provenance. Their current identities are recorded by that Allocation. These are the human-instituted design references under AGENTS.md, not implementation evidence.

Read the complete selected passages, including conditions outside handles, then compare each source portion with the full proposal, delta scenarios, design decisions and tasks. Read every target requirement independently in reverse. References and row counts are navigation, not evidence by themselves. This review establishes the proposed realization contract only; it does not verify code or re-audit the historical sources.

## Forward dispositions

Requirement names below refer to `specs/upstream-inputs/spec.md`.

| Complete attributed portion | Realization contract / scenarios | Tasks and disposition |
| --- | --- | --- |
| D/C-purpose: exact official selected pair, browser-distribution support boundary | Official published source selection; source-only success under Fresh acquisition and complete handoff; proposal scope | 1.1, 1.3, 2.2. Represented; no Node runtime/native binary support is added. |
| D/C-inputs: exact published non-draft releases, explicit stable/alpha/beta/rc admissibility, no development snapshot | Official published source selection, all explicit/omitted/invalid/newest-insufficient scenarios; release-bound pin requirement | 1.1–1.3. Represented with the existing SQLite-format support limit stated explicitly; unknown metadata fails, not silently stable-only substitution. |
| D/C-inputs: apply admissibility without owning latest/next policy or waiving gates | Official published source selection's no-channel/no-waiver clause; source-only handoff | 1.1, 2.2. Represented; A-release still owns classification/channel policy. |
| D/C-inputs: repository-recorded cryptographic digest before source use | Repository-recorded official source identities; new Vector pin vs unbound snapshot/incomplete lock/SQLite-policy scenarios | 1.2–1.3. Represented; candidate hashing is not production self-authorization. |
| D/C-inputs: changed bytes/checksums never silently authorize themselves; mismatch fails | Existing pin integrity is retained; Verification precedes source use, including moved-tag and moving-checksum scenarios | 1.2, 2.1–2.2. Represented; existing identity is immutable within automatic processing. |
| D/C-inputs: official archives preferred when sufficient, acquisition exceptions stay bounded | Official sufficient archives without vendoring; design release-bound official commit archive | 1.2, 2.1. Represented; sufficient official archive used, no clone/submodule/mirror exception is invoked. |
| D/C-inputs: no tracked upstream trees or generated SQLite JS/WASM | Official sufficient archives without vendoring, Repository content boundary; proposal/design boundaries | 2.1, 3.1–3.2. Represented; source view and raw archive stay ignored/temporary and no runtime outputs are produced. |
| D/C-inputs: clean acquisition without unpublished files, prior outputs or necessary cache | Frozen source pair without automatic fallback; Fresh acquisition and complete handoff, all failure/clean/prior-output scenarios | 2.2, 3.1. Represented for A-inputs. Complete build/package/browser production-path proof belongs to A-acceptance, not omitted acquisition evidence. |
| D/C-inputs: recorded build-defining tools/options and complete build reproduction | Allocation explicitly attributes build-tool reproduction to A-build and full-path proof to A-acceptance | Contextual boundary, not an invented acquisition duty. Existing system prerequisites and acquisition commands are documented under tasks 1–3; no SDK change. |
| D/R-inputs: full separately pinned SQLite tree, same-release SQLite core/WASM/JS, temporary no-vendoring boundary | Official sufficient archives without vendoring and its sufficient/required-content/selected-symlink scenarios; design excludes bundled SQLite from extension view | 2.1, 3.1. Acquisition supplies the full pinned SQLite tree and prevents substituted bundled headers/core; A-build constructs the components from it. |
| D/R-inputs: selected engine's released sources and required headers, layout is realization detail | Official sufficient archives without vendoring; version/content checks and unchanged src/FP16 inputs in design | 2.1. Represented without requiring the former amalgamation layout or patching sources. |
| W/C-provenance: exact source identities/versions/origins/digests, full prerelease suffix | Repository-recorded official source identities; Fresh acquisition and complete handoff, Successful pair handoff and Acquired prerelease identity scenarios | 1.2–1.3, 2.2. Represented with release/tag/commit binding; build/output/channel/publication provenance stays with its other owners. |
| A-inputs dependencies: A-updates selects candidates, verified exact pair feeds A-build | Frozen source pair without automatic fallback; preparatory-pair scenario; proposal boundaries | 2.2, 3.2. Source handoff supplied without implementing either dependent unit. |
| Current production inputs/callers must not be silently switched by preparatory acquisition | Frozen-pair rule and preparatory-pair scenario; minimal source-only schema compatibility in design | 1.1, 2.2, 3.2. Permitted technical refinement preserving existing callers, not a multi-engine product requirement or compatibility framework. |

## Reverse grounding

| Target requirement | Grounding and boundary | Scenarios/tasks checked |
| --- | --- | --- |
| Official published source selection | D/C-purpose, D/C-inputs released identity/admissibility; A-inputs/A-release boundary | Both omitted, independent explicit selections, full prerelease, malformed/draft/development and insufficient metadata; 1.1, 1.2. |
| Frozen source pair without automatic fallback | D/C-inputs exact inputs/integrity/reproduction and A-inputs handoff boundary | New release during acquisition and incompatible frozen pair; 1.2, 2.2. |
| Repository-recorded official source identities | D/C-inputs record-before-use; W/C-provenance origins/versions/digests | New Vector candidate hash is a realization choice permitted by the current Capture, replacing the older spec's stronger published-asset-checksum assumption; unbound commits and missing SQLite official digest still fail; 1.2–1.3. |
| Existing pin integrity is retained | D/C-inputs no automatic digest refresh or self-authorization | Changed metadata, moved tag, production independent of moving checksums; 1.2, 2.2. |
| Verification precedes source use | D/C-inputs integrity-before-use/mismatch failure | Matching vs changed/incomplete archive; 2.1–2.2, 3.1. |
| Official sufficient archives without vendoring | D/C-inputs official archive preference/source-tree exclusion; D/R-inputs complete required sources and common SQLite release | Sufficient sources, selected symlinks/unsafe paths, missing content, repository boundary; 2.1, 3.1–3.2. |
| Fresh acquisition and complete handoff | D/C-inputs clean reproduction; W/C-provenance input contribution; Allocation dependencies | Clean checkout, previous outputs, second-source failure, complete/prerelease handoff and unchanged production pair; 2.2, 3.1–3.2. |

Proposal and design select one concrete upstream/release-bound source format inside this unit. Selective regular-file copying is acquisition glue; it changes no vector semantics. Backward compatibility is confined to the existing source-only callers, with no runtime engine selector. All seven tasks realize the acquisition behavior or its necessary evidence/documentation; none implements another unit.

## Conclusion and limits

Allocation-unit → proposed Change: **100%**. Proposed Change → allocation unit: **100%**. No missing source obligation or ungrounded target requirement identified in this semantic planning review. This is correspondence of the entire A-inputs contract, not task completion, archive readiness, source acquisition success or product acceptance.

Known downstream limits are explicit: production still uses sqlite-vec, A-build does not yet consume schema 2, final notice qualification including bundled FP16 provenance belongs to A-package, and full browser/OPFS evidence belongs to A-acceptance. PR #66 is the unmerged upstream design dependency. Historical archived input Changes retain their own snapshots and are not rewritten.
