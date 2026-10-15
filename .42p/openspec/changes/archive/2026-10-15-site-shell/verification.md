---
schema_version: 1
change: site-shell
allocation_unit: A-site_shell
checked_commit: 4aaf0754e268a2b4bb6409a7ed92365863c6d1f4
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — site-shell

## Institutional view

**Situated conclusion.** Verification passes for **A-site_shell** at [candidate 4aaf075][candidate], limited to the common static envelope, deployment and scoped shell checks. Repository tests and strict OpenSpec validation were renewed against a clean local checkout of that exact commit. Real compiler/browser and actual-Pages observations are reused from the same candidate's [hosted execution][build-job], not rerun or redeployed by this invocation. Both primary evidence archives were downloaded, inspected and matched their published SHA-256 digests. One nonblocking editorial suggestion remains; no required behavior is left unresolved by this examination.

**Command provenance.** The [Allocation's A-site_shell unit][allocation] attributes construction/deployment, common navigation/mobile styling, independent downstream handoffs, runtime preservation and their checks. Its qualified [Site Capture passages][capture] C-site, scoped C-readme/C-demo-release/C-demo-checks and Q-realization were read with their boundaries and provenance. The proposal records the VitePress/English choices and the user's explicitly adopted shared-preview decisions. The visible preview discussion supports that deployment selection. The full historical source corpus behind the Capture was not reacquired: this report establishes the examined Allocation-to-Change correspondence and implementation response, not complete original-source fidelity. No historical Distribution SPEC audit is needed for this shell-only unit.

**Common public envelope and mobile navigation — supported by execution and source review.** The unit requires three destinations, the common four-entry navigation and a usable mobile envelope. The standard VitePress configuration and bounded build helpers supply them. In [compiler/browser evidence][site-checks], `site/exercise.json` contains nine stable/preview fixture exercises, each with six direct visits and six client transitions at 1280px/390px; screenshots were inspected. [Actual Pages evidence][site-live], `live-pages.json`, identifies this exact candidate and records the same navigation coverage on the public preview. The browser checks examine links, menus, assets, JavaScript/resource errors and overflow. These observations cover the exercised routes/viewports, not arbitrary future content or devices.

**Independent docs/demo integration and preserved runtime — supported by renewed tests and compiler fixtures.** Documentation and demo remain independently supplied file inputs; neither downstream implementation is required for the shell. Renewed runtime tests exercise docs-only/demo-only preparation, fixed identity across documentation edits, explicit replacement, and rejection of missing, corrupt or inconsistent inputs. In [the primary fixture results][site-checks], `demo-only` and `documentation-update` retain identical selection/module digests; `preview-demo` uses a different pair, and both sides remain functional after assembly. This establishes shell transport/preservation on synthetic inputs. It does not establish published archive acquisition, actual WASM/vector behavior, README rendering or the Usage example, which remain with their owners.

**Bounded Pages publication — supported by configuration examination, injected-state tests and a real candidate deployment.** The [workflow][workflow] builds an exact internal PR head separately from main, assembles a complete artifact, and reserves Pages/id-token write permissions for deployment. Main/manual-main output is stable-only; fork/Dependabot publication is excluded. One workflow-level concurrency group and two freshness guards reject obsolete main/head or closed-PR inputs. Renewed publication tests exercise these refusal cases and artifact isolation/removal; they do not simulate GitHub's scheduler. The [live job][live-job] observed the exact preview commit, metadata and `noindex`. Main has no site at the recorded revision, so the observed root is legitimately absent; actual public stable-root behavior is conditional and was not observed here. Stable-plus-preview and stable-only behavior are supported by compiler/browser fixtures and the reviewed workflow, not represented as a public main deployment.

**Checks and product boundary — supported within the shell scope.** Construction only invokes locked VitePress tooling; supplied runtime files bypass rebundling. The changed paths and command graph do not add engine building, distribution publication, a package API or a third canonical runtime distribution. The shell's own tests are registered in [the repository test entry point][test-entry]. The public Pages observation satisfies the required shell deployment check; downstream content/runtime checks and A-acceptance are neither waived nor claimed.

**Common dependencies and limits.** Product code, fixtures and checks share known agentic authorship. Browser observations cross the generated public-surface boundary but depend on the same repository-authored harness and fixtures; repeated local/hosted runs are not independent implementations. Runtime digest expectations are calculated from explicit synthetic bytes with Node SHA-256, while preparation also uses Node SHA-256. Correlated fixture, navigation-check or hash-use mistakes remain possible. The shared preview is mutable and evidence archives expire on 2026-11-14; the URL alone is not permanent proof of this candidate. No new publication or configuration change occurred during Verification.

**Conclusion for institution.** The three required controls complete satisfactorily for A-site_shell, with the evidence qualifications above. The stale historical task prose is editorial and does not conceal unfinished implementation: the current checklist and exact-candidate execution establish completion. The next permitted workflow is archive, including its normal synchronization handling, followed by the human integration decision. This report performs neither operation.

## Detailed verification record

### Identity, scope and renewed coverage

Checked commit: `4aaf0754e268a2b4bb6409a7ed92365863c6d1f4`; tree: `c0d01beea48f90ab660191bc8450e177cd426d98`. The exact Git commit objects were imported through GitHub reads, their hashes verified, and the local index/working contents matched that tree. The candidate was clean before tests and before this report was written. The report's later commit changes no reviewed implementation or requirement.

The locked OpenSpec launcher resolved project root `.42p` and active Change directory `.42p/openspec/changes/site-shell`; schema is `spec-driven`. All four planning artifacts were readable, with 12/12 tracked tasks complete. There is no skipped spec/design artifact or synchronized Site baseline requiring a modified/removed/renamed comparison. The delta contains six ADDED requirements and nineteen scenarios.

Source snapshots, rehashed during this invocation:

- Allocation `2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md`: SHA-256 `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`.
- Site Capture `2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md`: SHA-256 `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`.

The forward examination follows every shell contribution in the complete unit and its qualified passages: static hosting/surface, mobile navigation, documentation-only runtime preservation, independent handoffs, deployed/scoped checks and site/package separation. Each has a represented requirement, scenario and task in [the existing mapping][coverage], whose semantic content was re-examined rather than accepted from its percentages. In reverse, all six requirements, the design choices and tasks stay within those contributions. Shared preview, identity/noindex, bootstrap, fork exclusion, filters and stale-input controls refine the assigned deployment responsibility under Q-realization and the adopted user decisions; they add no unrelated product unit. Documentation rendering/example and demo acquisition/data/vector obligations are explicitly retained with A-site_docs/A-site_demo. Both coverage directions are therefore **100%** for the selected unit only.

### Official OpenSpec verify

The current generated [openspec-verify-change skill][verify-skill] was available, read and followed. Status and `instructions apply` supplied the concrete context files and tracked tasks; `all_done` was treated as context, not a verdict. Completeness, correctness and coherence were assessed against code and execution evidence.

| Dimension | Examined result |
| --- | --- |
| Completeness | 12/12 tasks supported; implementations found for all six ADDED requirements. No REMOVED/RENAMED entries. |
| Correctness | Six requirement mappings and all nineteen scenarios examined below; none left Not verified. |
| Coherence | Standard-theme/private-tooling, file preparation, fixed runtime, independent checkouts, complete artifact deployment and scoped-check decisions followed. ESM tools, ignored state and built-in test runners follow repository patterns. One editorial suggestion. |

Requirement implementation mapping:

| Requirement | Implementation and scope |
| --- | --- |
| Common static construction | [build.mjs][build] `install`/`build`; [prepare.mjs][prepare] `prepare`/`checkOutput`; locked private manifest and site page slots. No engine/package command in the construction path. |
| Common navigation and mobile presentation | [theme configuration][theme] `themeConfig.nav`; standard responsive theme; [browser.mjs][browser] `checkBrowser`. The user's arrow correction removes the literal glyph while retaining the theme's external-link indicator. |
| Independent downstream integration | `prepare` overlays optional ordinary files; concise unavailable page slots; [guide][guide] assigns content/runtime responsibilities explicitly. |
| Documentation deployment preserves demo runtime | `runtimeInventory` validates selection/sidecar/assets; `checkOutput` rechecks emitted digests; [exercise.mjs][exercise] retains the fixed selection across a documentation edit. |
| Bounded Pages deployment | [workflow][workflow] build/deploy/observe jobs; [publication.mjs][publication] `publicationContext`, `hasSite`, `assemble`, `assertCurrent`; stable/preview options and metadata. |
| Scoped shell verification | [runtime tests][runtime-tests], [publication tests][publication-tests], [workflow tests][workflow-tests], compiler/browser exercise and [observe.mjs][observe]. These remain complementary to downstream/product acceptance. |

Scenario examination, including failures and conditional paths:

| Scenario | Examined handling and evidence |
| --- | --- |
| Fresh static construction | Clean temporary source/output preparation and locked install/build; current hosted job completes real builds from a fresh checkout. |
| Project-prefix hosting | Stable/preview bases in options/config; primary `exercise.json` stable and preview routes pass direct/client visits. |
| Navigate among destinations | Browser asserts all internal destinations and exact external repository URL; live result passes. |
| Mobile viewport | 390px menu, transitions, page overflow and wide-code containment; primary screenshot and fixture results inspected. |
| Shell before downstream units | Initial notices, shell-only preparation and `shell-only` browser fixture; actual preview has no invented content/demo. |
| Integrate either downstream unit | Runtime tests plus real `docs-only`/`demo-only` fixtures; each works without the other. |
| Documentation changes after demo integration | Fixed synthetic selection/module digests equal before/after the documentation edit; distinct newer candidate remains separate. |
| Explicit demo refresh handoff | Renewed coherent-replacement test accepts different supplied identity/assets without discovery. |
| Missing supplied runtime assets | Renewed missing/altered/duplicate/unlisted/unsafe/symlink cases fail; corrupt compiler-exercise input removes stale output. |
| Internal pull request preview | Separate workflow checkouts/locks and assembly reviewed; root/preview fixture keeps both sides distinct. Public deployment exercises its bootstrap variant because main has no site. |
| Preview identity and navigation | Preview footer escapes branch text; all pages get noindex; direct/client browser checks verify identity and prefix, including exact live candidate. Stable fixtures reject preview metadata. |
| Fork validation | Context tests return no publication; workflow eligibility denies fork/Dependabot deployment while allowing build/checks. No live fork experiment was needed to establish the configured branch. |
| Preview-only bootstrap | Absence detection differs from partial/failed builds; tests fail closed for the latter. Actual assembly/live records report `stablePresent: false`; observer requires root 404. |
| Integrated or manual deployment | Main-only context guard, clean stable-only assembly and no-preview observation branch; fixture `stable-only-removes-preview` passes. No public main run is claimed before integration. |
| Shared preview replacement and unmerged closure | Assembly replaces the single preview; no closed-event trigger; freshness guard rejects a queued closed PR. This is configuration/state-test evidence, not a live PR-closure experiment. |
| Concurrent publication | Shared workflow-level critical section covers selection through publication; injected delayed-main/head/closed-PR tests reject stale state before a simulated publisher. No FIFO assumption or exhaustive scheduler test is claimed. |
| Relevant input filtering | Shared PR/main path list and conditional publication reviewed and tested; includes sources, tools/lock, workflow, README/Usage and check prerequisites. Future preparation inputs must extend it when integrated. |
| Before a real demo exists | Explicitly synthetic module/selection fixtures exercise integration and preservation; no actual WASM/vector inference. |
| Deployed integration check | Exact-candidate primary `live-pages.json` and successful observe job establish actual preview navigation/assets at both tested widths. Stable root is absent under the explicit bootstrap condition. |

Findings: **0 CRITICAL, 0 WARNING, 1 SUGGESTION**. No applicable check was skipped. S1: [tasks.md, Update disposition][tasks] still says “Task 3.2 remains pending” after the completed checklist. Label that paragraph as historical in a subsequent documentation edit. This does not represent an outstanding realization obligation: current checkboxes, code and primary current-candidate live evidence establish task 3.2 completion. Verification does not edit it. The design's earlier GitHub-arrow label describes the intended external-link appearance; relying on VitePress's native glyph follows the user's explicit correction without changing that navigation behavior.

Official verify assessment: no critical issues or warnings; one nonblocking suggestion. All applicable checks were examined. Its advisory archive-readiness conclusion is subject to the other two controls and the host's human integration authority; it does not invoke archive.

### Commands, primary evidence and reuse

Renewed on the clean candidate during this invocation:

- `sh tools/openspec.sh check`: pinned OpenSpec 1.14.0 installation, CLI and generated skills conform.
- `sh tools/openspec.sh exec list --json`, `status --change site-shell --json` and `instructions apply --change site-shell --json`: correct project/Change paths, four readable planning artifacts, 12/12 tasks.
- `sh tools/check-repository.sh`: passed canon identities, Capture/Allocation identities and repository checks.
- `sh tools/test-repository.sh`: **288 tests**, eleven suite reports, no failure or skip; includes **22 site tests**.
- `sh tools/openspec.sh exec validate --all --strict`: **10/10 items passed**. Existing informational long-requirement hints in unrelated specs are not failures.
- Working-tree identity and whitespace checks passed. Generated local results are ignored under `.work/site/verification-*`; these local logs are not presented as hosted primary results.

No dependency, harness or generated skill was installed, refreshed or updated for Verification. The clean committed source remained unchanged until writing this report. No code correction was performed.

Material reuse is from Site run **38742930720**, tied by artifact metadata and checkout log to checked commit **4aaf0754e268a2b4bb6409a7ed92365863c6d1f4**. The [build job][build-job] successfully ran locked npm installation, 22 offline site cases, harness setup, five real exercise builds plus the exact-head preview build, browser/assembly checks and both prepublication identity handling and artifact upload. The deployment job passed. The [observe job][live-job] passed at 2026-10-15 13:31 UTC for the public preview, verifying six direct visits and six client transitions across three destinations at 1280px/390px with Chrome 153.0.8010.12. It used main `f59a1ddd083641ec7471e4fa89f48455dcedaf2c` and legitimately no stable site.

Primary archives were downloaded through the GitHub connector and their exact ZIP hashes checked:

- [site-checks-38742930720][site-checks], id `11977485514`, SHA-256 `b2b90e87be7e5342c1fd0ca3472ae99ff966095ecc2cdc49d2a0919a98987196`: inspected `site/build.json`, `site/exercise.json`, `site/assembled.json`, `pages/site-publication.json` and mobile screenshots. The selection/module digests match between `demo-only` and `documentation-update`, and differ in `preview-demo` as intended.
- [site-live-38742930720][site-live], id `11977305728`, SHA-256 `5e4ad49c45a69e7530f8be57c8afe639fe92c615cb1ef40b2b76b78725a1b02d`: inspected `live-pages.json`, including exact branch/commit, main identity, bootstrap state, URL, browser version and visit counts.

Both were available and unexpired when examined, with expiry 2026-11-14. These are accessible primary outputs, not merely the historical account in coverage.md. Their finite observations and shared implementation/harness dependencies remain as qualified above. The older run's transient HTTP 502 and retry are historical Apply context, not a failure in this candidate's successful run. Stable-main public execution, future downstream content and real distribution/runtime acceptance are outside the observations claimed here.

### Scoped verdict and next action

Coverage **100% / 100%**; official OpenSpec verify **passed**; renewed repository checks **passed**; applicable tests and identity-bound reused compiler/browser/Pages evidence **passed**. Therefore **verdict: passed** for A-site_shell at the checked commit, with S1 editorial and nonblocking. Proceed through `/openspec-archive-change site-shell` only as a separately invoked action. No synchronization, archive, merge or publication was performed by this invocation.

[candidate]: https://github.com/at-rama/sqlite-vector-wasm/commit/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4
[allocation]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md#L104-L110
[capture]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md
[coverage]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.42p/openspec/changes/site-shell/coverage.md
[tasks]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.42p/openspec/changes/site-shell/tasks.md#L24-L26
[verify-skill]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.42p/.agents/skills/openspec-verify-change/SKILL.md
[build]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/build.mjs
[prepare]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/prepare.mjs
[theme]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/site/.vitepress/config.mts
[browser]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/browser.mjs
[exercise]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/exercise.mjs
[workflow]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/.github/workflows/site.yml
[publication]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/publication.mjs
[observe]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/observe.mjs
[guide]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/docs/site.md
[test-entry]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/test-repository.sh
[runtime-tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/tests/runtime.test.mjs
[publication-tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/tests/publication.test.mjs
[workflow-tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/4aaf0754e268a2b4bb6409a7ed92365863c6d1f4/tools/site/tests/workflow.test.mjs
[build-job]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38742930720/job/116449017362
[live-job]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38742930720/job/116450396045
[site-checks]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38742930720/artifacts/11977485514
[site-live]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38742930720/artifacts/11977305728
