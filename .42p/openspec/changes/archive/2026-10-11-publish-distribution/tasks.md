# Tasks

## 1. Shared distribution policy

- [x] 1.1 Implement pure exact-version/channel/signal helpers in `tools/release/`; verify native Node tests for all four stable/prerelease combinations, suffix-independent numerical PATCH/MINOR/MAJOR classification, SQLite maintenance components, simultaneous signals and immutable inputs.
- [x] 1.2 Implement initial stable `0.1.0`, maturity ceiling, code/rebuild/rollback PATCH, per-channel progression and stable-reference alpha continuation/replacement/closure; verify table tests compute the required base from `latest` and its composition, cover required-base less/equal/greater than the open base with exact expected versions, use current stable state after closure, preserve separate rollback/eligibility references and independent upstream counters, and retain the attributed `0.4.2` ceiling, vector `1.x` and stable-maintenance examples. Escalate a case requiring an unallocated policy rather than introducing one.
- [x] 1.3 Expose one calculation entry point for future watch/preparation/publication consumers and document its explicit selection/state/result contract; verify identical input/state results across calling modes, forecast changes only after changed input/state, and absence of AI, reservations or caller-selected channel/version policy.
- [x] 1.4 Register the mandatory release suite in `tools/test-repository.sh` when its implementation enters the repository; verify both normal execution and nonzero failure when the required suite is absent, without changing protected canon or the existing tests.

## 2. Publication state and integrated-candidate handoff

- [x] 2.1 Implement read-only Git/GitHub/npm snapshot adapters with complete pagination and strict provenance/HEAD validation; verify injected responses for coherent stable/experimental history, genuinely absent bootstrap state, unrelated tags, occupied partial-publication identities, malformed references, authentication/transport errors and truncated results.
- [x] 2.2 Implement exact integrated-candidate context validation, including merged/base/repository checks, authoritative merge commit, changed `inputs/release.json`, selection/source-lock agreement and required rollback comment; verify fixtures reject unmerged/unrelated events, retained stale descriptors, mismatched pairs, missing comments and passing PR-head-only contexts without side effects.
- [x] 2.3 Document the candidate descriptor consumed by A-release, state-reader credentials and examples for future A-updates callers; verify recorded examples against reader fixtures, keep comment strings as data, and state truthfully that this Change implements neither dispatch/PR creation nor bootstrap setup.

## 3. Definitive package qualification and provenance

- [x] 3.1 Implement orchestration that calculates the definitive identity before invoking the existing complete production/acceptance path on the exact clean integrated commit; verify injected runs carry the final product name/version and refuse fixture metadata, dirty/different revisions, failed/missing stages and PR-head evidence without calling publishers.
- [x] 3.2 Validate the accepted bundle, archive metadata, required notices, runtime inventory/digests and `assertApplicable` result; verify tampered tarball/identity/runtime/notice and incomplete browser cases fail before tag creation. Reuse existing packaging/acceptance controls without weakening their requirements or substituting development assets.
- [x] 3.3 Generate publication composition/evidence and concise Release notes from exact source origins/digests, upstream suffixes, code/tag/version/channel, actual tools/options/environment, output digests and comment; verify fixtures ground every field in the accepted inputs and retain rollback explanation without another manual version registry.
- [x] 3.4 Refresh publication state immediately before side effects and implement stale-state/collision failure; verify changed required identity or a concurrently claimed version stops without relabeling, repacking, alternate-version retry or application locking.
- [x] 3.5 Document nonpublishing qualification commands, prerequisites and retained evidence/workspace lifetime; verify the commands against orchestration fixtures and distinguish existing acceptance fixtures from qualified product archives.

## 4. Matching destination publication and hosted workflow

- [x] 4.1 Implement non-forced tag creation at the verified commit, draft GitHub Release creation and exact archive/evidence upload without clobber; verify injected service tests for exact commit/tag/bytes, stable/prerelease classification, existing tag/Release/assets and failures at each operation.
- [x] 4.2 Implement both destination paths: in steady state publish the accepted archive to npm with the calculated channel before finalizing GitHub; in the explicitly established unavoidable first-npm exception automatically finalize GitHub with the same archive/evidence, hand it to A-bootstrap and report `npm-pending` without automatic npm publication. Verify injected tests inspect exact arguments/bytes, prohibit repacking/channel overrides, retain all mandatory gates, reject exception selection from an authentication error or noninitial state alone, and never claim complete success before both destinations agree.
- [x] 4.3 Implement explicit per-operation diagnostics and partial-publication failure without destructive compensation or automatic identity reuse; verify npm/GitHub success-then-failure, tag/draft-only failure, rerun collisions and evidence retention, including nonzero outcomes with no false complete-success claim.
- [x] 4.4 Add the hosted `release.yml` workflow with merged-candidate filtering, exact commit checkout, documented clean-production prerequisites, separated read/qualification/publication permissions, OIDC trusted publishing and supported archive attestations; pin every external action/material added tool before use and verify workflow/event/permission fixtures and negative tests prevent unrelated main merges or preparation from publishing.
- [x] 4.5 Implement the bounded read-only initial npm-completion check against the retained accepted handoff and published GitHub identity; verify matching version/channel/provenance/archive yields complete success, absent npm remains pending and inaccessible or inconsistent evidence produces explicit non-success diagnostics. Verify zero mutation calls, no repeated identity creation or general collision bypass, and separation from ordinary publication reruns. Document initial exception disposition, exact-payload retention/handoff, trust/attestation prerequisites and explicit unsupported mechanisms/fallbacks; no steady-state persistent npm token or recurring manual publisher exists. Do not configure accounts or perform the manual bootstrap publication under this task.

## 5. Integrated validation and lifecycle evidence

- [x] 5.1 Execute `sh tools/test-repository.sh`, `sh tools/check-repository.sh` and strict OpenSpec validation from `.42p`; verify all applicable checks pass and the complete A-release fixture matrix covers the requirements in both directions.
- [x] 5.2 Run a hosted nonpublishing qualification exercise using the recorded stable source pair, an exact implementation commit and explicit `sqlite-vector-wasm@0.1.0`; retain clean production/browser evidence and check the accepted archive/provenance with release preflight. Verify no tag, npm publish or GitHub Release call occurs; report live OIDC/registry publication as unexercised until separately authorized.

## Post-Apply lifecycle

These remain required sequential operations under the repository canon, outside the implementation checklist. Verification must finish before Archive; neither may be declared complete by an Apply checkbox.

**5.3 Verification.** Re-examine the current Allocation-to-Change mapping, then invoke repository-owned `42p-verify-change` after Apply to write the truthful Verification report with applicable evidence and limits; verify its three controls and coverage disposition rather than treating task completion or this proposal as acceptance.

**5.4 Archive.** After satisfactory Verification, follow `openspec-archive-change` and its synchronization instructions; verify required Change merge gates on the committed candidate. Preserve human integration/publication authority and do not perform a real release merely to complete this Change.
