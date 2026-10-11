---
schema_version: 1
change: scope-npm-distribution-identity
allocation_unit: A-release
checked_commit: 438848a1e2ffabda7f9f970c22cfdebb9bf03506
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — scoped npm distribution identity

## Institutional view

**Situated conclusion.** Verification of `scope-npm-distribution-identity`, realizing A-release, passed on clean committed candidate `438848a1e2ffabda7f9f970c22cfdebb9bf03506`, tree `a49ed680dc88d4e4210d616bcb230f3a2d1e963f`. The three controls completed. Local repository/tests were renewed during this invocation. Real qualification evidence is reused from [release exercise 38124049545][exercise], executed on this exact candidate after the CodeQL correction; its retained archive and primary reports were downloaded and inspected anew. This supports the scoped implementation and retained release mechanisms, not a completed live publication or account setup. Those external operations remain A-bootstrap dependencies. Earlier qualification recorded in [Apply's account][apply] was not substituted for this candidate's runtime evidence.

**Command provenance.** The examined [Allocation][allocation], section “A-release — Distribution policy and publication”, assigns shared policy, authoritative qualification/publication, provenance and initial completion. Its qualified references were compared with the selected Distribution Capture passages C-purpose, C-release, C-autonomy, C-failure, C-bootstrap and R-updates, and Release/Watch C-determinism, C-version-identity, C-semver, C-channels, C-publication, C-provenance and R-frugality. [Distribution source records][distribution] and [Release/Watch source records][watch] retain S-spec, S-product-design, S-release-watch-design, S-local-reconciliation and S-release-refinement. The immutable [historical SPEC][historical] was retrieved through the current repository name and read, including distribution/publication/bootstrap provisions. Later source instructions/consolidation are referenced through those records, not independently reacquired here. The user's explicit scoped-name decision is visible in this conversation and recorded in [proposal][proposal]. This examination confirms the allocation/Change correspondence, not an independent audit of the entire authority chain.

**One distribution identity and supplied consumers — passed.** Semantic examination of [policy][policy] (`npmPackageName`, `calculate`) and [state][state] (`npmState`, `publicationIdentity`), renewed literal-name/endpoint tests and the downloaded real archive agree on `@at-rama/sqlite-vector-wasm@0.1.0`. Product/repository spelling and distribution-only SemVer/tag relationships remain separate. Wrong top-level, version-entry, archive and provenance names are rejected in the executed [scoped control definitions][scoped]. Package installation resolves all runtime subpaths under that scope in an actual offline npm installation, using a synthetic runtime fixture; the real runtime result comes from [exercise][exercise]. Current README/docs align with the supplied identity while preserving generic fixtures and historical records. No second version policy or publication API was found in the changed code examined.

**Shared deterministic numbering and channel progression — passed.** [Policy implementation][policy], functions `channelFor`, `signalFor`, `calculate`, follows the composed requirements: maximum numerical signal, default PATCH, immature-engine ceiling, initial stable `0.1.0`, upstream-derived channel, independent alpha counter, stable-derived required base, open-series continuation/replacement/closure and separate rollback reference/comment. Renewed [policy control definitions][policy-tests] exercise all four upstream classifications, numerical/suffix cases, maturity transition, base less/equal/greater, closed/absent series, stable maintenance, rollback, deterministic immutable inputs and changed state. Consumer code imports the same calculator. These finite cases support the branch reasoning; they are not exhaustive proof over every version/state. A-watch's future use is an allocated dependency, not an implementation supplied by this Change.

**Complete state, uniqueness and definitive qualification — passed.** Examination of [state readers][state] and [qualification/publication flow][run], plus renewed state/pagination/collision and stale-state controls, supports complete scoped metadata and published HEAD acquisition, failure on inaccessible/inconsistent state, definitive recalculation before production and revalidation before side effects. Non-forced Git identity creation and create-only assets preserve collision failure without alternate-version retry, reservation registry, overwrite or application lock. The PR exercise deliberately uses an empty fixture; it does not establish live registry history. The tests supply state and transport doubles, distinct from the externally executed production/browser path.

**Human integration and authoritative revision — passed as a mechanism.** [Integration context][context], function `integratedContext`, requires a human merge into main, matching merge revision and a changed candidate descriptor with exact selection/comment. [Release workflow][workflow] separates read-only PR exercise from post-integration qualification and publishing. Renewed context/workflow tests reject unmerged, bot-integrated, unrelated, changed-revision and truncated contexts. The current PR exercise reports zero publication calls. No real human integration was performed; this report supplies evidence for that later decision and cannot authorize it.

**Applicable complete acceptance, exact payload and notices — passed.** [Exact-payload validation][run], functions `acceptedPayload`, `qualify`, `publish`, binds complete acceptance to clean authoritative commit and exact archive, reconstructs the expected inventory/notices from recorded inputs and prevents relabeling/repacking accepted bytes. Renewed controls reject changed revision, incomplete browser cases, notices/metadata/runtime tampering, dirty checkout and failed production. [Current real execution and retained artifact][exercise] provide nine passed production stages and 22 passed Chromium cases on the final scoped archive. Downloaded package metadata, 27 file sizes/digests, runtime hashes and license material were inspected separately with Python ZIP/tar/JSON/SHA-256 facilities. Both destination adapters consume the same accepted tarball in executed synthetic publication controls; transport to live npm/GitHub remains unperformed.

**Complete composition and comments — passed.** [Provenance construction][run], function `provenance`, and the inspected `release/run-7GmsLb/publication.json` in [exercise's artifact][exercise] agree with package/acceptance records on source commit, distribution identity, upstream origins/digests, build tools/options/environment and output hashes. Renewed [publication control definitions][publication-tests] check retained comment and generated records; policy controls require a rollback explanation. Code examination confirms notes retain that comment, without another manual version registry. The real exercise uses an empty comment; rollback/comment conclusions rely on executed fixtures and semantic examination, not a live rollback.

**Trusted publication and supported attestations — passed as a provisioned mechanism.** [Publisher adapters][services], `assertReady`/`npmPublish`, and the pinned [workflow][workflow] demand GitHub-hosted OIDC/attestation authorization, qualified publishing tools, empty npm configuration, public access, calculated channel and provenance; persistent npm tokens and provenance overrides fail. Executed prerequisite/adapter tests confirm these controls and missing-provenance rejection. The pinned GitHub attestation action produces the signing bundle in the real publisher path; the local subject/source check is not an independent cryptographic verifier. No real OIDC publication/signing or npm publisher binding was exercised. Those setup-dependent operations are disclosed in [publication documentation][publication-doc], including the bounded first-npm fallback to GitHub archive attestation; the implementation does not silently claim they occurred.

**Bounded initial handoff and read-only completion — passed as mechanisms.** [Release implementation][run], `publish`/`checkInitialCompletion`, and executed initial-path controls preserve automatic tag/GitHub publication, exact archive handoff and explicit npm-pending disposition; they reject choosing the exception for a later release. Completion reads matching GitHub/npm identity, channel and bytes and accepts recognized absence only as pending. Wrong names, inaccessible state, wrong channel and same-size changed bytes fail. The [scoped test definitions][scoped] also show wrong provenance stops before service reads and completion has no publisher adapter. These are controlled service observations; this report does not assert that the manual first npm operation has happened.

**Failure, partial outcomes and retained diagnostics — passed.** Renewed [publication controls][publication-tests], test “every side-effect failure preserves operation outcomes without compensation or identity reuse”, inject failures at prerequisite/tag/draft/upload/npm/finalization/destination verification boundaries. Observed results retain failure/operation records and accepted bytes without destructive compensation or complete-success claims. Semantic examination of [publish][run] confirms failures stop subsequent steps. Generated output remains ignored and uncommitted. Fixtures share repository construction and validators, so these observations do not eliminate correlated errors or establish behavior for every possible transport failure.

**Common dependencies and limits.** This agent also authored the scoped correction and examined its Apply evidence; there was no independent agent review. The fresh local suites and CI executions share repository-authored tests. Real browser probes execute packaged public surfaces but use the repository's acceptance harness and oracle definitions; the production/reference builds share tooling/configuration. Independent Python hashing separates byte inspection from release validators, while expected inventory/case definitions still come from repository records/contracts. Primary CI evidence is accessible now with bounded retention; temporary local raw outputs are not durable repository evidence. Live accounts, registry permissions, actual trusted publication and later integrated-revision qualification remain unestablished external steps, not waived release obligations.

**Conclusion for institution.** The examined A-release realization satisfies this Change under the recorded code, execution and evidence limits. The three-control invocation is satisfactory. Archive can follow; human integration and bootstrap/publication remain subsequent decisions/operations. No implementation correction, spec synchronization, Archive, merge, candidate dispatch, tag, Release or npm publication occurred during this invocation.

## Detailed verification record

### Candidate and semantic coverage

The local reviewed index/working snapshot matched the remote tree exactly. The remote commit object was reconstructed byte-for-byte, verified by its Git hash, and selected locally before checks; `git status --porcelain --untracked-files=all` was empty. This establishes the clean committed input rather than treating the earlier synthetic local history as the remote candidate. Publishing this report changes only its new Markdown file.

The [coverage mapping][coverage] was re-examined against the full A-release unit and the composed contract: synchronized distribution-release with Single distribution identity replaced by the complete delta. All 16 requirements and 41 effective scenarios remain applicable; the delta adds five scenarios to the retained Published identity scenario. Each forward row's conditions/exclusions and corresponding reverse grounding were examined, including shared policy, state failure/collision, human authority, exact acceptance/payload, provenance, trusted mechanisms, bootstrap and partial failure. No missing allocation contribution or ungrounded Change requirement was identified in that comparison: both directions 100%. Counts establish inventory, not the semantic conclusion.

Input SHA-256 identities were rechecked: Allocation `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`; Distribution Capture `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00`; Release/Watch Capture `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944`; Site Capture `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085`; synchronized distribution-release `968acac29f9e1e15faee7e9e5fed30c02072b33773837994e8d8fb87c6f01b86`. Site realization is outside this unit. Hashes identify examined projections, not their upstream fidelity.

### Official OpenSpec verify

The current generated `openspec-verify-change` skill was read intact and executed as an agent workflow. `list`, `status` and `instructions apply` resolved this checkout's `.42p` root, spec-driven schema, the concrete Change directory and all four context artifacts; all were read. Apply's all-done message was treated only as context. No generated skill was installed or modified.

| Dimension | Executed result |
| --- | --- |
| Completeness | 9/9 readable tasks checked against implementation/execution evidence; 1 MODIFIED requirement implemented; no ADDED, REMOVED or RENAMED entries |
| Correctness | Modified requirement mapped to policy/state/qualification/provenance/completion and supplied consumers; all 6 delta scenarios covered below; retained contract also examined |
| Coherence | All four design decisions followed; changed code/tests/docs follow existing module, fixture and failure patterns |

| Delta scenario | Implementation and executed support |
| --- | --- |
| Published identity | `calculate`, `provenance`, `publish`, service adapters; exact-byte/provenance publication controls and inspected real package records |
| Scoped identity across consumers | shared constant/calculation, qualification metadata, unchanged generic APIs; explicit candidate assertions, offline npm installation and real scoped archive |
| Scoped registry state | `npmState` encoded URL and both name checks; exact literal endpoint assertion and malformed/state failure controls |
| Another package cannot satisfy identity | `publicationIdentity`, `npmState`, `acceptedPayload`; unscoped/other-scope metadata, provenance and archive rejection with matching version/digest |
| Scoped initial package is absent | recognized 404 scoped empty state and read-only pending; unrecognized/forbidden/inaccessible absence rejection |
| Initial scoped completion matches | `checkInitialCompletion`, CLI GitHub verification adapter; matching fixture succeeds, wrong names/channel/bytes fail without publishers |

All retained requirement groups have visible dispositions in the institutional view. Their scenarios were traced to the corresponding policy, context, state, acceptance, publication and workflow definitions and renewed suites, with actual build/browser/payload evidence for the selected stable composition. No applicable check was marked Not verified, and no requirement gap, design divergence or material pattern inconsistency was identified in this examined field. CRITICAL: 0; WARNING: 0; SUGGESTION: 0; skipped applicable checks: 0. Official assessment: all checks passed; archive readiness remains subject to the other two controls, which also passed here.

The prior incomplete-encoding CodeQL finding is addressed by `replaceAll`; the current endpoint remains the literal expected URL. [JavaScript/TypeScript CodeQL execution][codeql] and current commit check results report success. The old review thread still exists; its presence is not a new unresolved implementation finding. Strict validation's informational long-requirement notices introduce no unsatisfied behavior.

### Renewed repository controls

On the clean checked commit, `sh tools/check-repository.sh` passed; `sh tools/test-repository.sh` exited 0 with all 167 tests passing: 43 repository/gate, 31 acquisition, 28 build, 11 package, 9 acceptance-control, 26 release and 19 candidate-preparation tests. No test was skipped. Local prerequisites included Git, POSIX shell/Bash, tar/unzip, native compiler, Python 3.12.14, Node.js 24.19.0 and system npm 11.9.0. This npm is used for offline fixture packaging/installation, not hosted publication. Raw local stdout remains temporary at `.work/verify34-tests.log`; these results are recorded here, not exposed as durable raw output.

From `.42p`, `openspec validate --all --strict` passed all seven items using the prepared official CLI, with telemetry disabled. [Repository CI on the same candidate][repository-ci] also passed `check` and `tests`. Its Verification/Archive jobs failed before this report existed because the report/archive gates were not yet satisfied; those lifecycle outcomes are not product test failures or bypassed requirements. Archive remains pending after this report.

### Identity-bound real evidence inspected

The existing read-only `sh tools/release.sh exercise` completed on the checked commit in run `38124049545`, attempt 1, job `114424575257`, finishing at `2026-10-11T08:17:00Z`. Its CLI result reports `qualified-without-publication`, `publicationCalls: 0`, and explicit empty state rather than live registry evidence. The separate qualify/publish jobs were skipped. This CI execution predates this invocation and is reused with exact identity established, not claimed as launched again by Verification.

The retained [run artifact][exercise] is `release-exercise-38124049545-1`, ID `11695744907`, 3,760,375 ZIP bytes, expiry `2026-11-10T08:17:01Z`. Its downloaded ZIP SHA-256 matches Actions' digest `6ba47b914799add36717ab7185e4dd76525faf4fcf6faba15e08669ca97e67fb`. Primary locators within it are `acceptance/run-Skaeya/{acceptance.json,package.json,build.json,browser.json,payload.tgz}` and `release/run-7GmsLb/{handoff.json,publication.json}`. The run page exposes the artifact and job log; these are verified written locators, not invented download anchors.

Python inspection established `payload.tgz` size 1,147,793 bytes and SHA-256 `09ad118c4bdb91bdfcc6fe2b9cfc9cdc511389fb2655397aca36aec37ef95a04`. The embedded `package/package.json` and all handoffs identify the scoped `0.1.0`; tag/channel are `dist/v0.1.0`/`latest`. Source commit/tree are exactly the checked identities, `dirty: false`. Recorded archive sizes/digests match downloaded bytes; the exact 27-file inventory and runtime hashes match; all recorded required license files are present. Provenance upstreams are SQLite `3.53.4` and sqlite-vec `0.1.9`, with source-lock/build records agreeing across the handoffs.

All nine expected production-stage entries and all 22 expected browser-case entries report passed. Chromium is `153.0.8010.12`; hosting is HTTP loopback `http://127.0.0.1:38923`, secure context and cross-origin isolation, COOP `same-origin`, COEP `require-corp`. The cases include all loading/context combinations, baseline capability comparison, FTS5, Float32/Hamming SQL, negative controls, restart persistence for all three default OPFS VFSes and final hashes. Available execution records support the observations for that browser/host/composition; they do not establish every browser or future release revision.

## Evidence references

All candidate file references below use the immutable checked commit. Code/test links expose definitions, while execution links expose CI results/logs/artifacts; neither is mislabeled as the other. The report's own assertions of renewed local results are summaries of temporary execution output. The report adds no release authorization.

[allocation]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md
[distribution]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md
[watch]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md
[historical]: https://github.com/at-rama/sqlite-vector-wasm/blob/d463c4034604d6593cf45bbf5a523598dd3f53cc/SPEC.md
[proposal]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/openspec/changes/scope-npm-distribution-identity/proposal.md
[coverage]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/openspec/changes/scope-npm-distribution-identity/coverage.md
[apply]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.42p/openspec/changes/scope-npm-distribution-identity/apply.md
[policy]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/policy.mjs
[state]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/state.mjs
[run]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/run.mjs
[context]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/context.mjs
[services]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/services.mjs
[workflow]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/.github/workflows/release.yml
[scoped]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/tests/scoped-identity.test.mjs
[policy-tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/tests/release.test.mjs
[publication-tests]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/tools/release/tests/publication.test.mjs
[publication-doc]: https://github.com/at-rama/sqlite-vector-wasm/blob/438848a1e2ffabda7f9f970c22cfdebb9bf03506/docs/publication.md
[exercise]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38124049545
[repository-ci]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38124049550
[codeql]: https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38124047588/job/114424572660
