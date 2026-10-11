# Tasks

Operational execution is blocked until A-release consistently supplies the scoped npm identity described in [proposal](proposal.md). This list plans A-bootstrap only; corrections to the supplying mechanisms and established consumer impacts belong to their owning units. It does not presume a product rename, a Capture/Allocation rewrite or an A-package migration. Planning does not authorize external setup, candidate dispatch, merge or publication.

## 1. Confirm dependencies and deliver the procedure

- [ ] 1.1 Confirm that A-release's calculation, provenance, registry readers and completion checks consistently use `@at-rama/sqlite-vector-wasm`, and inspect actual consumers for established impacts. Reassess A-package's supplied-identity contract and existing scope support without presuming a modification. Record applicable owning-unit checks and current input identities; repeat coverage for material revisions and update fingerprints only for changed source bytes. Keep operational execution blocked if an active identity producer/checker still targets the unscoped npm package; do not implement another unit here or treat the unchanged product name as a defect.
- [ ] 1.2 Write `docs/bootstrap.md` with the existing initial disposition, candidate/integration boundary, exact archive retrieval/digest checks, interactive scoped-public first npm operation, read-only completion command and trusted-publisher transition. Link it from `docs/publication.md` and `docs/candidates.md`; verify links, command arguments and settings against the reconciled code and current official npm documentation. Preserve the explicit local provenance fallback and partial-failure rules.
- [ ] 1.3 Create `execution-evidence.md` with pending states and fields for non-secret setup results, source/run/publication identities, exact archive SHA-256, completion output and trusted-access validity/demonstration; verify it contains no invented successful result or credential and refers to the procedure without duplicating it.

## 2. Establish minimum initial access

- [ ] 2.1 In a separately authorized operational stage, verify live npm account/organization publication rights for `@at-rama/sqlite-vector-wasm`, package absence and interactive authentication prerequisites; record observable outcomes without recording credentials or OTPs. Stop on unavailable rights or an existing conflicting package/publication.
- [ ] 2.2 Verify live GitHub/organization Actions settings permit the existing native-token candidate PR and hosted release/attestation permissions; establish `RELEASE_SETUP=initial-manual-npm` for the unavoidable first operation. Record read-back values and setting outcomes, preserving protected-main gates and human merge authority; do not add a permanent npm publishing token.

## 3. Consume the initial handoff and complete npm

- [ ] 3.1 At the maintainer-authorized normal candidate integration boundary, obtain A-release's resulting automatic tag/GitHub Release and `npm-pending` handoff. Record the actual preparation/integration/publication run references, authoritative commit, shared `0.1.0`/`latest` identity and successful complete qualification; verify this is the initial exception rather than an arbitrary partial failure. Bootstrap does not merge or replace A-updates/A-release.
- [ ] 3.2 Retrieve the exact GitHub `payload.tgz`, publication provenance and signed archive attestation; verify signature/source using supported GitHub tooling and compare SHA-256/size/package identity with the accepted record. Retain the check result and stop on mismatch; do not rebuild or repack.
- [ ] 3.3 Perform the separately authorized one manual npm publication from those exact bytes using scoped public access, explicit registry/`latest` and disabled scripts. Record the command outcome and explicit unsupported local npm OIDC provenance/fallback; inspect failures without deleting, overwriting or repeatedly invoking the ordinary publisher.
- [ ] 3.4 Invoke A-release's existing read-only `check-initial` with the retained `publication.json`; record output and exit status. Mark the first publication complete only when its matching version/channel/commit/archive evidence passes; retain pending or failure otherwise. Verify that no second tag, repack or publication call was made by completion checking.

## 4. Establish the normal trusted disposition

- [ ] 4.1 Configure the scoped package's trusted publisher for `at-rama` / `sqlite-vector-wasm` / `release.yml`, no environment with the current workflow, and explicit direct `npm publish` permission. Verify settings read-back and current expiry requirements; coordinate with a forthcoming normal release or record the need to recreate an expired configuration. Record configured versus demonstrated status without forcing a release or granting recurring manual publishing responsibility.
- [ ] 4.2 After matching first-publication completion and usable trusted setup, set `RELEASE_SETUP=trusted` and verify read-back. Update execution evidence with the configuration/validation deadline and any actual normal hosted-publication demonstration; verify no steady-state publishing token or manual publishing workflow was introduced. An expired configuration is unready and settings alone are not OIDC proof.

## 5. Check the complete bootstrap handoff

- [ ] 5.1 Run the canonical repository check and strict OpenSpec validation on the delivered procedure/evidence; verify that every spec scenario is supported by applicable operational evidence or remains explicitly pending/blocked, including source/payload identity, supported attestations and normal-path readiness. Do not manufacture an automated test that merely repeats procedure prose.

After Apply, invoke distinct 42P Verification under the repository standard, then Archive only on a satisfactory verdict. These stages are not Apply tasks and do not authorize merge or publication. Missing external evidence prevents a passed operational verdict even if documentation and task file structure are complete.
