# Tasks

## 1. Dispatch and official candidate records

- [ ] 1.1 Implement candidate input/context validation under `tools/updates/`; verify exact required versions, allowed dispatch/main context, no channel/version override and comments as data with injected tests, including metacharacters and invalid run references.
- [ ] 1.2 Compose the existing resolver with explicit versions and baseline pins; verify stable, prerelease, unchanged-pair and digest-drift/error paths with isolated injected fixtures and no automatic fallback, vendoring or upstream patch.
- [ ] 1.3 Produce the existing schema-1 release descriptor from the actual run and prepare a local temporary-branch commit; verify lock/descriptor agreement with A-release's validator and clean Git status in disposable repositories.
- [ ] 1.4 Document dispatch fields, exact-selection independence and candidate record format in contributor documentation; verify examples against executable validation and existing publication docs.

## 2. Shared calculation and candidate qualification

- [ ] 2.1 Compose `readState` and `calculate` for preflight and qualification without empty-state fixtures in nominal operation; verify initial stable, subsequent next/alpha, rollback comment, unavailable/inconsistent state and collision behavior through injected state readers.
- [ ] 2.2 Execute canonical repository checks/tests and the existing nonpublishing `qualify` path on the committed candidate; verify ordering and exact commit/archive applicability, fresh production, complete browser prerequisites and all mandatory-failure stops with orchestration controls.
- [ ] 2.3 Retain candidate summary, invocation/run attempt, state observations, existing acceptance bundle, proposed identity and digests under ignored outputs; verify a changed preflight/qualification forecast is explained, failures retain diagnostics and generated files never enter candidate commits.
- [ ] 2.4 Document forecast versus definitive publication, artifact names/retention and failure interpretation; verify documentation examples identify candidate evidence without claiming published identities or reusable post-merge acceptance.

## 3. Candidate branch and PR presentation

- [ ] 3.1 Implement create-only non-forced push and PR creation after successful qualification, with one temporary branch per run/attempt; verify injected operations receive exactly the qualified commit and target main, and no push/eligible PR is attempted after qualification failure.
- [ ] 3.2 Present exact selections, comment, forecast, preparation reference and evidence links in the PR and candidate result; verify current candidate identity is discoverable from PR/head/descriptor without a separate registry or silently replacing another candidate.
- [ ] 3.3 Record branch collisions, head mismatch and push/PR transport failures without destructive compensation or complete-success claims; verify partial pushed-branch evidence and unchanged existing candidate identities.
- [ ] 3.4 Document repeat preparations, human workflow approval/review/merge and evidence invalidation after edits; verify links and examples and assert adapters expose no auto-merge, release-tag, npm or GitHub Release publication operation.

## 4. Hosted workflow and registered controls

- [ ] 4.1 Add a manually dispatched `updates.yml` using existing full action pins, hosted prerequisites, native token permissions and nonpersisted checkout credentials; verify workflow structure and safe environment/argument handling through offline tests, including no publishing OIDC/npm token or nominal AI path.
- [ ] 4.2 Preserve available candidate/acceptance evidence on success and failure with the pinned upload action and documented retention; verify artifact paths, hidden-file handling and token redaction boundaries in workflow/control tests.
- [ ] 4.3 Register mandatory candidate control suites in `tools/test-repository.sh` with failure on missing tests for a present implementation; verify the entry point runs candidate tests and retains existing suites, and document native Actions PR-permission/approval prerequisites without an alternate token fallback.

## 5. Integration and lifecycle evidence

- [ ] 5.1 Run `sh tools/check-repository.sh`, registered repository tests and strict OpenSpec validation on the implemented Change; verify all results pass and the complete bidirectional allocation mapping still matches the final specs, tasks and scope.
- [ ] 5.2 Obtain a clean hosted qualification rehearsal of the real preparation production path using the recorded stable pair, with PR/publishing side effects disabled for rehearsal; verify exact evaluated commit, archive, real-browser matrix and diagnostics, and explicitly distinguish injected PR controls from any observed live permission behavior. Do not merge a real candidate or publish to collect evidence.
- [ ] 5.3 Perform `42p-verify-change`, commit its truthful report, then follow Archive/sync only after satisfactory Verification; verify the archived report and applicable PR gates while retaining human integration/publication authority. These later workflows require their current repository skills.
