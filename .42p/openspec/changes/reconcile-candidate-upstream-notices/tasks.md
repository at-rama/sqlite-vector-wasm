# Tasks

## 1. Deterministic notice derivation

- [ ] 1.1 Add the preparation-only helper under `tools/updates/`, using existing source acquisition/integrity/safe-extraction primitives with a run-local parent; verify digest mismatch and unsafe/duplicate/link fixtures fail without writing controlled inputs or populating production workspaces.
- [ ] 1.2 Implement the fixed SQLite license/header selectors and archive-first sqlite-vec license selectors with canonical tag-to-commit/tree/blob fallback; verify exact fixture bytes, annotated tags, prerelease tags, raw Git blob identity, missing/ambiguous sources and transport failures, including SQLite missing-source failure versus sqlite-vec missing-file fallback.
- [ ] 1.3 Derive normalized text and schema-1 notice records with the source metadata defined in design decision 3; verify independently specified raw/recorded digests, unchanged wording across a changed version, preserved manifest inventory/order and unchanged Emscripten records.
- [ ] 1.4 Register the helper fixtures in the existing update suite/mandatory repository test entry point and document the archive/fallback, normalization and failure rules in `docs/candidates.md`; verify the registered command executes the fixtures offline and documented paths match implementation.

## 2. Coherent preparation snapshot

- [ ] 2.1 Add injectable reconciliation before the candidate commit in `prepareCandidate`, validate the baseline and selected complete notice snapshots with existing strict package validation, then commit the explicit input/descriptor/notice allowlist together; verify orchestration fixtures inspect the real clean commit before the first repository check.
- [ ] 2.2 Cover SQLite-only, sqlite-vec-only, both-upstream, admitted prerelease, rollback and same-pair selections; assert exact versions/origins/digests, no unchanged-group churn, no same-pair notice downloads, no unrelated tracked changes and production workspace freshness; verify that the two single-upstream scenarios do not apply to a combined update.
- [ ] 2.3 Record reconciliation operations and a report in the uploaded updates workspace, with upstream/notice/source identity and available failure diagnostics; verify failures in acquisition, derivation, validation and commit never invoke subsequent checks/qualification/push/PR and report no nonexistent candidate commit. Verify same-pair and one-upstream fixtures distinguish refreshed proof from retained legacy validation, mark missing historical raw/immutable provenance as not established, and perform no notice acquisition for a wholly retained pair.
- [ ] 2.4 Extend `docs/candidates.md` with the final sequence, committed notice diff, diagnostic locations and unchanged human/publication boundary; verify existing artifact upload includes the report and sources without adding a workflow or schema migration.

## 3. Downstream compatibility and retained A-updates duties

- [ ] 3.1 Exercise refreshed notice inputs through packaging and inspect the final archive's `licenses/origins.json`; verify recorded source metadata survives and missing notices, wrong projects/versions and changed bytes still fail the existing strict checks.
- [ ] 3.2 Retain and run the complete existing update control suite for exact dispatch/comments, shared forecast/rollback/collision policy, descriptor identity, revision/payload binding, clean production, mandatory failure stops, create-only remote writes and rehearsal's lack of writes; verify all retained coverage rows in `coverage.md` have applicable tests or explicit semantic examination.
- [ ] 3.3 Confirm no runtime source/header/assets, toolchain pins, permanent branch rules, package/publication policy or 42P canon changed; verify the diff is limited to preparation glue, relevant tests/documentation and this Change.

## 4. Integrated validation

- [ ] 4.1 Stage intended implementation files and run `sh tools/check-repository.sh`, `sh tools/test-repository.sh` and locked `openspec validate --all --strict`; record commands/results and fix failures without weakening validation.
- [ ] 4.2 Run nonpublishing preparation of SQLite `3.54.0` / sqlite-vec `0.1.9` in a fresh environment through complete production/browser qualification, using the existing injectable rehearsal context if hosted rehearsal forces the recorded pair; retain the exact commit, notice provenance, payload and real-browser evidence, or report a prerequisite/compatibility blocker without success claims. Do not push, create a distribution candidate PR, merge, tag or publish during this validation.
