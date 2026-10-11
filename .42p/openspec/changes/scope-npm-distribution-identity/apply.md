# Apply evidence

## Candidate and scope

Implemented exactly A-release's scoped npm identity correction at commit [`8cef6d6544b1d2b2a95c1b00bb825fe63ddad2a7`](https://github.com/at-rama/sqlite-vector-wasm/commit/8cef6d6544b1d2b2a95c1b00bb825fe63ddad2a7), tree `5a16b69f53af8439f938012437a14ce7112d5c3f`. The subsequent evidence/task commit changes no implementation or requirement. [Coverage](coverage.md) remains applicable; the preceding documentary derivation examined the proposal at `83f5c1615c4b68bb73a3572a251a33a5e29f0e32`, not implementation conformity.

The release policy supplies one fixed npm name; state and provenance checks reuse it and read `https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm`. Current canonical fixtures, examples and the npm link align with it. Generic package/acceptance interfaces, product/repository names, publication arguments, numbering, channels and authority boundaries are unchanged. The existing read-only release exercise selects this active Change as well as the former publish-distribution Change; its publisher jobs are not invoked by the PR exercise.

## Executed controls

Local `sh tools/check-repository.sh` passed. `openspec validate --all --strict`, from `.42p`, passed all seven items. `sh tools/test-repository.sh` passed 167 registered offline tests: 43 repository/gate, 31 acquisition, 28 build, 11 package, 9 acceptance-control, 26 release and 19 candidate-preparation tests. The standalone release suite also passed its 26 tests during implementation. Raw local output is temporary; [Repository CI run 38122952098](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38122952098), jobs `check` and `tests`, independently executed those repository controls on the committed candidate and succeeded. Verification/Archive merge gates remain unsatisfied because those separate stages have not occurred.

The added controls exercise the exact scoped registry endpoint, recognized absence, inaccessible/malformed state, wrong top-level/version names, wrong archive identity, wrong provenance identity, completion channel/byte mismatches, retained npm provenance requirements and unchanged trusted publication arguments. Candidate assertions check the shared name; actual offline npm installation resolves all runtime subpaths under the selected scope. These use synthetic runtime/service fixtures and do not establish browser qualification or live registry access. Packaging and acceptance keep their generic fixture defaults and behavior.

## Renewed real qualification

[Distribution release run 38122952089](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38122952089), attempt 1, job `exercise` (`114421275649`), executed `sh tools/release.sh exercise` successfully at the exact candidate commit. The workflow checked out that head with a clean source tree, installed fresh tools, built the recorded SQLite `3.53.4` / sqlite-vec `0.1.9` pair, packaged the scoped identity and completed all nine production stages and 22 mandatory real-browser cases. Chromium reported `153.0.8010.12`; HTTP loopback hosting was a secure context with cross-origin isolation, COOP `same-origin` and COEP `require-corp`. Qualification's final CLI result reported `qualified-without-publication`, `publicationCalls: 0` and an explicitly empty publication-state fixture, not observed live npm history. The `qualify` and `publish` jobs were skipped.

The run retained artifact `release-exercise-38122952089-1`, ID `11695758510`, available from that run until the reported expiry `2026-11-10T07:58:43Z`. Its ZIP was downloaded through the GitHub connector and independently hashed to the uploader/Actions digest `ef8a420968b57791b3df043b1bcc100e12f75e9fd237aee2345d79ef1d937bac`.

Inspection of the downloaded bytes established:

- `acceptance/run-8rpUgt/payload.tgz`: 1,147,790 bytes, SHA-256 `d50e1e8393364972846307aecfd3651e58c04a43a3899a4b4d00fe8b738fc37a`.
- The tarball's `package/package.json`, acceptance/package handoffs and `release/run-Zw16h2/publication.json` carry `@at-rama/sqlite-vector-wasm@0.1.0`; publication/handoff use `latest` and `dist/v0.1.0`.
- Acceptance source commit/tree identify the candidate above with `dirty: false`; release context/provenance use the same commit. All recorded archive sizes/digests match the downloaded tarball.
- Every one of the 27 tarball files matches the packaged inventory's size and SHA-256; runtime digests match acceptance and required license material is present. All expected nine stage and 22 browser-case entries report `passed`.

The byte inspection used Python's ZIP, tar, JSON and SHA-256 facilities separately from repository validators. It relies on repository-authored inventory/evidence for the intended contents; the browser run uses the existing repository-authored acceptance harness. The same agent authored this correction and examined the evidence, so these observations are not an independent agent review. Downloaded artifacts and detailed inspection output remain temporary local evidence; the CI artifact has bounded retention. This record distinguishes those observations from a durable copy of the original bytes.

## Remaining lifecycle and external limits

This is Apply evidence, not the distinct post-Apply 42P Verification report. Verification must assess the current committed candidate under its three controls before Archive. No spec synchronization, archive, human integration, candidate dispatch, account configuration, Git tag, GitHub Release or npm publication occurred. Scoped registry access and organization/publisher permissions remain external bootstrap concerns. Qualification of this PR does not authorize publication or substitute for evidence applicable to a later integrated release revision.
