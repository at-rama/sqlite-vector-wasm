# Apply execution account

## Result and boundary

All 13 Apply tasks are complete. Candidate preparation now reconciles the SQLite/sqlite-vec notice snapshot before its single candidate commit and mandatory checks. Strict packaging/release association and byte checks are unchanged. This account is not the distinct post-Apply 42P Verification, an archive, human integration or publication authorization.

The implementation PR keeps its original source pins and controlled notice inputs. The updated input/notice snapshot described below exists only in a local nonpublishing replay, not in a remotely created distribution candidate.

## Repository and offline checks

The canonical `sh tools/check-repository.sh` and locked OpenSpec 1.14.0 `validate --all --strict` passed. `sh tools/test-repository.sh` passed all **256 tests** on current pins and again in an isolated synthetic upgraded-input snapshot (SQLite 3.54.0 / sqlite-vec 0.1.9). That second snapshot uses synthetic source/notice bytes and establishes fixture independence and control behavior, not actual upstream/runtime qualification.

New fixtures exercise real archive integrity/safe extraction, SQLite license/header derivation, archive-first sqlite-vec notices, canonical Git tag/commit/tree/blob fallback including an annotated prerelease tag, raw/recorded digests, supported whitespace normalization, unchanged wording across a version change, retained legacy limits and fail-closed diagnostics. Orchestration fixtures inspect the clean committed snapshot before checks and cover single/combined updates, prerelease, rollback, reconstruction, failure ordering and no remote-write rehearsal. Actual local npm packing/extraction confirms refreshed provenance survives in `licenses/origins.json`; wrong version/project, missing notices and changed bytes remain rejected.

The first real upgraded replay exposed a separate fixture assumption: the publication documentation's stable example was compared with the candidate's current source lock. The release test now validates that example against a matching controlled fixture lock and still rejects mismatched versions. Production descriptor validation was not modified. The successful replay below includes this correction.

## Fresh real preparation replay

A standalone local clone started with empty generated/tool state. Preparation used live official resolution and live Git/npm publication state for SQLite **3.54.0** / sqlite-vec **0.1.9**. Its context explicitly replays the historical selection/invocation from run 38627390423; it is not a new GitHub Actions run, and no historical qualification or publication-state snapshot substitutes for new execution.

Implementation snapshot: local commit `8835f19c47fd4b94df22e65fbc8521cc36d08723`, tree `a908752d4fbda5597cc7f51e919cf11e1afade25`.

Evaluated candidate: local commit `3677c5640df30c6ce5fd5ab63583605f87cad9fc`, tree `722e53163a4c3235a2a68fdd48bbd5fb3f087faa`, clean checkout. It commits the updated source lock, release descriptor and notice manifest together. Both SQLite notice sources were reacquired from the official 3.54.0 archive and digest-verified; their normalized texts happen to equal the previously recorded text. New release associations and immutable archive provenance were nevertheless established. sqlite-vec's notice group was retained and validated without inventing missing historical raw-source proof. Notice acquisition and fresh production acquisition used separate workspaces.

Checkout, resolution, live state, reconciliation, commit, repository checks/tests and complete nonpublishing qualification passed. Acceptance completed checkout, exact tool installation/identity, dependencies, smoke, build, package, browser and bundle stages. Chrome **153.0.8010.12** passed all **22 recorded cases**, including the loading matrix, baseline/FTS5, float32/Hamming, negative controls, OPFS/OPFS-WL/SAHPool restart persistence and final hashes, under the recorded secure loopback/cross-origin-isolated hosting conditions.

The local forecast payload is `@at-rama/sqlite-vector-wasm` **0.2.0**, `latest`, **1,167,456 bytes**, SHA-256 `d9b468210acb140b77bbfb92c9db83b91edb66b753698e87333228621242677a`. This is a tested local forecast archive, not a reserved or published identity. Final preparation status is `qualified-without-pr`; no remote candidate branch/PR, merge, automatic merge, release tag or GitHub/npm publication was performed.

## Inspectable evidence and limits

Raw results and the exact payload are delivered separately to the maintainer in `notice-reconciliation-evidence.zip`, SHA-256 `f99cf16b954a0c24faec6bd9bdcb1667b8f34b672df2b97d5610879b184539c8`. The bundle is not a GitHub Actions artifact and is not committed upstream material. Its `SHA256SUMS.json` inventories the other entries. Locators inside it include:

- `validation-summary.json`: checked source/tree, implementation blob identities, conditions and scope.
- `checks/current-pins-tests.log`, `checks/synthetic-upgraded-pins-tests.log`, `checks/openspec-strict.log`: primary local check outputs.
- `raw/updates/run-GJEqtd/candidate.json` and `notices.json`: operation order, selected identities, refreshed/retained notice proof and final status.
- `raw/acceptance/run-KQEgTK/acceptance.json`, its logs and `payload.tgz`: complete production/browser results and actual archive.
- `raw/release/run-wOrd7o/publication.json`: qualification provenance; no publication is asserted.

Temporary paths in raw reports identify the original execution locations. This committed account summarizes those results; it is not the raw evidence itself. Raw sources/SDK/cache state and screenshots are excluded from the delivered bundle.

The checked local candidate differs from the implementation PR's resulting source revision and contains a different source pair from its baseline pins. Evidence is bounded to that candidate, payload and environment. It does not establish all possible upstream combinations, other browsers/platforms, source-to-Capture fidelity or final integration/publication eligibility. Subsequent 42P Verification must assess the implementation and this evidence's applicability before Archive; A-release must still recalculate and qualify its authoritative revision and exact payload after human integration.
