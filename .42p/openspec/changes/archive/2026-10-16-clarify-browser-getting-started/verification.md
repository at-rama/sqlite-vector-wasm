---
schema_version: 1
change: clarify-browser-getting-started
allocation_unit: A-site_docs
checked_commit: 524848a3b5a223c2c2cd4d4b2b9e736d97ec622c
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — clarify-browser-getting-started

## Institutional view

**Situated conclusion.** Post-Apply 42P Verification **passed for A-site_docs** at clean committed candidate `524848a3b5a223c2c2cd4d4b2b9e736d97ec622c`. Coverage, the official OpenSpec review and applicable checks are satisfactory within this documentation scope. Repository/site tests and the actual published-runtime example were executed again during this invocation. Build/integration and Pages evidence is reused from [successful Site run 38881172164](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164), which exercised this exact commit; its primary artifacts were downloaded, digest-checked and inspected during Verification. This result covers the documented first-use path and its site integration, not full runtime acceptance or every browser.

**Command provenance.** The examined command comes through the [current Allocation, section A-site_docs](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), qualified by Site C-site, C-readme, documentation C-demo-checks, C-demo-release preservation and Q-realization. The [Site Capture](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md) records S-site-design, S-site-usage and S-site-split as source provenance. These passages, the complete unit and the Change were compared semantically; their hashes identify inputs rather than establish authority or complete upstream fidelity. Historical source conversations were not reacquired. Distribution C-browser/C-storage/C-nonmodification were read as compatibility/context constraints; their immutable S-spec provenance at `d463c4034604d6593cf45bbf5a523598dd3f53cc` remains a reference, not a renewed original-source audit.

**One presentation source and one Usage source — established for the examined paths.** Source review confirms that the [existing renderer](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/tools/site/docs.mjs) consumes README and `docs/usage.md` directly; no second authored presentation or guide was added. Renewed renderer fixtures verify edits and source-relative content. The [exact-candidate live result](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/artifacts/12038380316), `live-pages.json`, identifies both public documentation hashes as the candidate's source hashes. This establishes fidelity for the observed content, not independent validation of the renderer's entire language surface.

**Actionable, truthful first use — established by execution and editorial review.** The [Usage source](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/docs/usage.md), sections Host and initialize and Scripts and Workers, supplies concrete copying/hosting instructions and distinguishes recommended direct API use from retained Worker1 compatibility. The actual copy recipe and first two JavaScript snippets were executed again against published `0.2.0`; all eleven copied files match the publication, and page/Worker searches return the expected two neighbors and versions. [Hosted primary results](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/artifacts/12037362756), `docs-example/result.json`, corroborate the same recipe, guide identity and observations. Current [upstream Worker1 advice](https://sqlite.org/wasm/doc/trunk/api-worker1.md) was rechecked on 2026-10-16; the candidate changes advice without removing required APIs. Runtime boundaries, OPFS conditions and upstream licensing meaning survive the editorial shortening. This is a minimal Float32 example, not execution of every guide snippet or complete Worker/OPFS qualification.

**Usable links and mobile reading — established for fixtures and the identified deployment.** Renewed [resolver/renderer tests](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/tools/site/tests/docs-policy.test.mjs) exercise mapped/relative destinations, fragments, images, external targets and rejection of missing targets at both bases. Reused same-commit compiler/browser results include real-source stable/preview rendering; `live-pages.json` in the live artifact checks source fidelity, links/anchors, navigation and viewport overflow at 1280px and 390px. The new Demo and worked-example links are included in these emitted-link checks. Third-party badge availability was not established by the internal-resource checks; the Apply screenshots' unavailable external badges remain an explicit environmental limit.

**Independent updates and preserved demo runtime — established within the exercised composition.** The [hosted integration results](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/artifacts/12037362756), `site/exercise.json`, show 16 successful cases, including docs-only integration and identical supplied runtime inventories across documentation changes. Those preservation fixtures deliberately use synthetic identities; they do not establish vector correctness. Review of the unchanged selections and deployment code, together with the actual live selection/inventory observations, supports preservation for this candidate. No theme, demo interaction, package API, selection or publication requirement was changed, and the documented example retains its separate `0.2.0` pin.

**Scoped evidence and responsibilities — preserved.** The [actual Pages observation job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/job/116909552480) succeeded against this exact candidate and checked deployment identity before and after browsing. It supplies the required hosted evidence independently of the workspace's earlier DNS failure; that failed attempt is not counted as success. Current repository tests and strict OpenSpec validation also passed, supported by the [same-candidate CI test job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172069/job/116907985885). Documentation checks complement shell/demo checks and A-acceptance without replacing their distinct responsibilities.

**Common dependencies and limits.** The implementation, fixtures, expected rendering manifest and review share repository authorship, including the same agent for Apply and this review. Browser observations exercise real compiled/published assets, but depend on repository-authored orchestration; source-fidelity expectations share the renderer, and page/Worker checks share the same documented SQL. Expected neighbor IDs/distances are explicit rather than copied from the observed result. These boundaries expose correlated-error risks rather than establish an independent audit. The observed browsers and finite fixtures support the stated paths only. OPFS, every bundler/browser, full distributed API acceptance and emoji semantic quality remain outside this unit. Primary hosted artifacts are available until 2026-11-15; shared preview content may be replaced sooner.

**Conclusion for institution.** All obligations in the examined A-site_docs unit have a supported disposition; no unresolved conformity gap was found in that scope. This Verification completed satisfactorily. Archive, synchronization, merge and publication are separate operations and were not performed.

## Detailed verification record

### 1. Allocation-unit ↔ Change coverage

Reviewed snapshot: [candidate 524848a](https://github.com/at-rama/sqlite-vector-wasm/commit/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c), confirmed clean before writing this report. OpenSpec 1.14.0 resolved `.42p` as the project root and this active Change as the report destination. The official verify skill was present before controls began; no generated skill was installed or refreshed.

Allocation: `2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md`, SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`. Qualified Site Capture: `2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md`, SHA-256 `7e520ad3573cc84fb787229bf33ee195c19bcb6deb92998d7a63d7457c61777c`. Both match the Change's recorded inputs.

The complete unit, qualified Capture passages and surrounding shell/demo handoffs were re-read against proposal, design, all eight task descriptions, the [coverage mapping](https://github.com/at-rama/sqlite-vector-wasm/blob/524848a3b5a223c2c2cd4d4b2b9e736d97ec622c/.42p/openspec/changes/clarify-browser-getting-started/coverage.md) and all five retained `site-docs` requirements/scenarios. All seven forward contribution groups remain represented: unique presentation source; dedicated Usage/minimal example; deployed link/image usability; independent updates and runtime preservation; independent integration; scoped local/hosted checks; API/publication/acceptance separation. Reverse review grounds recipe/Worker/editorial changes and each check in those contributions or applicable editorial/technical canon. No added unit, weakened requirement or ungrounded product obligation was identified. Both semantic coverage directions are **100%**; the mapping itself was not treated as proof of realization.

Retained contract-to-evidence correspondence:

| Retained requirement | Implementation and examined scenarios/evidence |
| --- | --- |
| Single-source public documentation | `tools/site/docs.mjs`, README and Usage; both render/edit scenarios covered by renewed real-renderer fixtures, hosted real-source edit exercise and exact live source hashes. |
| Systematic documentation link resolution | `documentationResolver` and `browser.mjs` documentation checks; all four scenarios covered by source-relative/canonical/fragment/image/external-target tests, missing-target failures, stable/preview compilation and public emitted-link checks. |
| Explicit published-version example | `docs-example.json` and `example.mjs:14–106`; actual unchanged published archive executed in page/Worker. Version/no-floating behavior, unavailable download, mismatched publication, corrupt archive and missing inventory are exercised by renewed policy tests. Recipe command/copy failures also propagate through executable assertions; every possible copy failure was not fault-injected. |
| Independent documentation integration | Unchanged source selection/build boundaries; both docs-before-demo and docs-with-demo scenarios exercised in the hosted 16-case run, including unchanged inventory comparisons. Synthetic preservation evidence is distinguished from actual published bytes. |
| Scoped deployed documentation checks | `browser.mjs`, `observe.mjs`, actual primary `live-pages.json`; exact candidate desktop/mobile results inspected. Local-only results and the prior local DNS failure remain qualified, not substituted for Pages success. |

### 2. Official OpenSpec verification

Followed the intact generated `openspec-verify-change` skill at this candidate: selected this Change; read status and every `instructions apply` context file; examined completeness, correctness applicability and coherence. `state: all_done` is tracking context, not the verdict.

| Dimension | Result |
| --- | --- |
| Completeness | Task Completion passed: 8/8 descriptions corroborated by source and primary execution evidence. Delta Spec Coverage is **Not applicable** because `skip_specs: true` is intentional; the retained baseline is examined above. |
| Correctness | Delta Requirement Implementation Mapping and Scenario Coverage are **Not applicable** under the official skill's skipped-spec rule. The complete existing A-site_docs behavior/scenarios were nevertheless assessed through the allocation coverage and evidence correspondence above. |
| Coherence | Design Adherence and Code Pattern Consistency passed: ordinary Markdown/single sources, unchanged theme, POSIX recipe, fixed-version archive consumption and direct-Worker advice; existing Node/fs/assert/execFileSync patterns, directories and locked dependencies are retained. |

Implementation locators: `README.md:9–39` and `70–74`; `docs/usage.md:5–45`, `75–99` and `101–121`; `tools/site/example.mjs:14–106`; the Documentation links and example section of `docs/site.md`. The checker verifies publication/archive identities before offline installation, installed/copied inventories and digests, actual guide snippets, page/Worker results and post-execution hashes. Negative download/integrity/link behavior was examined in both code and executed tests, rather than inferred solely from task checkboxes.

CRITICAL: **0**. WARNING: **0**. SUGGESTION: **0**. No applicable official check was left Not verified; intentionally skipped delta checks are Not applicable. All applicable official checks passed. This advisory conclusion supplies only the OpenSpec control within the three-control 42P result, not authorization to archive.

### 3. Repository checks and applicable tests

Renewed during this Verification on the clean checked candidate, before report creation:

- `sh tools/openspec.sh check` and `sh tools/openspec.sh exec context --json`: locked CLI/skills conform; project root is the checkout's `.42p`.
- `sh tools/check-repository.sh`: passed, including canon and Capture/Allocation byte identities.
- `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs`: **37 passed, 0 failed**. This includes renderer fixtures, both-base link failures and published-example identity/availability failures.
- `sh tools/openspec.sh exec validate --all --strict`: **13 passed, 0 failed**. Informational messages about existing long requirements are not conformity findings.
- `sh tools/test-repository.sh`: all registered suites passed; raw output is in `.work/verification-repository-tests.log`.
- `HARNESS_STATE=/tmp/sqlite-vector-wasm-docs61-harness bash tools/harness.sh exec sh tools/site.sh example`: passed again with verified harness identities, Node 24.19.0 and Chrome 153.0.8010.12. The eleven copied assets match published version 0.2.0; page and Worker return `[[1,0],[2,1.4142135381698608]]`, SQLite 3.54.0 and sqlite-vec v0.1.9, with unchanged runtime hashes. Guide and recipe hashes agree with the primary same-candidate hosted example results.

Same-candidate evidence reused and directly re-inspected, not merely copied from the Apply receipt:

- [Site build job 116907985489](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/job/116907985489): compiler/browser integration and example execution; [site-checks artifact 12037362756](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/artifacts/12037362756) contains `site/exercise.json` (16 cases), `docs-example/result.json`, build/inventory/publication records and screenshots. Downloaded ZIP SHA-256 `7579b6ae09e5cd4797634138df97450ee97790e954e33077e9cc8ed2ba491d15` matches GitHub metadata.
- [Site live artifact 12038380316](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38881172164/artifacts/12038380316): inspected `live-pages.json` selects `524848a3b5a223c2c2cd4d4b2b9e736d97ec622c` and stable main `2c9910a3824a942b1d8ff0e0182b93dbcb976f5e`. Preview README SHA-256 is `b04c972663d6477866f3223a8cc6b369e56d0a7aef57a2a855a21fe8832b0d2b`; Usage is `aba78e68747648737550885bff30ce80f1e8119bb91657dd7c6186930803930f`. These match current source bytes. Downloaded ZIP SHA-256 `dc1c214a453df2110e407da63bb693d6f64ed9995bb9a0f387723852212c05e1` matches GitHub metadata.
- Both hosted artifacts were available and unexpired when inspected; retention ends 2026-11-15. Local extracted copies are in `.work/verification-hosted/` and `.work/verification-live/`. Renewed local logs/results remain temporary under `.work/verification-*.log` and `.work/docs-example/result.json`; these are not durable public evidence links.

No harness implementation/tooling dependency changed, so harness reconstruction/update qualification was not introduced into this invocation. The earlier Apply workspace-DNS failure is retained as a failed local attempt; the required public-site obligation has same-candidate successful hosted evidence. No failure or missing prerequisite for an applicable obligation remains unresolved. The report commit changes only this report and does not extend the checked implementation, invoke archive or authorize publication.
