# Tasks

## 1. Confirm the A-release contract before Apply

- [x] 1.1 Re-read the current A-release Allocation, selected Capture passages, the user identity decision and all Change artifacts; confirm both coverage directions in `coverage.md` are 100%, including the fifteen retained requirements and every scenario. Stop on missing authority or material upstream changes and deliver an updated affected mapping before implementation.

## 2. Supply and read the canonical scoped identity

- [x] 2.1 Export the fixed npm package identity from `tools/release/policy.mjs`, use it in calculation and `tools/release/state.mjs`, and encode the scoped registry request. Verify explicit expected-name and exact-endpoint assertions for initial, stable and experimental results, recognized package absence, inaccessible/malformed metadata, top-level wrong name and wrong version-entry name in the release suite.
- [x] 2.2 Adapt canonical release fixtures and provenance checks to the scoped name. Verify qualification forwards the literal canonical name, mismatched metadata/provenance (including another scope with matching version/digest) fail, and existing numerical/channel/alpha/collision cases still pass with `node --test tools/release/tests/*.test.mjs`.
- [x] 2.3 Document the product/npm identity distinction and scoped qualification example in `docs/publication.md`; inspect documented calculation output against the corrected CLI without publishing.

## 3. Preserve publication and downstream consumption

- [x] 3.1 Exercise ordinary publication adapters and initial read-only completion against scoped metadata, successful exact-byte handoffs, absence, wrong names, wrong channel and changed bytes. Add or adapt meaningful release tests to show pending/failure dispositions, no completion side effects, no repack and unchanged public-access/channel/provenance arguments; preserve all existing partial-failure and authority controls.
- [x] 3.2 Confirm A-updates consumes the corrected shared name and A-package/A-acceptance retain supplied scoped identity without changing their generic interfaces. Use explicit name assertions in relevant consumer tests and run `node --test tools/updates/tests/*.test.mjs` plus the registered package/acceptance suites; preserve their other allocated boundaries.
- [x] 3.3 Align the npm link in `README.md` and canonical `--name` examples in `docs/packaging.md` and `docs/acceptance.md`; inspect targets and command arguments, preserving product/repository spellings, generic fixture defaults and historical records. Do not claim that the package is already published.

## 4. Establish the complete candidate's applicability

- [x] 4.1 Run `sh tools/check-repository.sh`, `sh tools/test-repository.sh` and `openspec validate --all --strict` from their canonical roots; retain commands/outcomes and any blockers without treating structural success as implementation acceptance.
- [x] 4.2 From a clean committed candidate, run the existing nonpublishing `sh tools/release.sh exercise` locally with documented prerequisites or through its read-only PR CI job. Inspect the retained tarball's `package.json`, package/acceptance handoffs and publication evidence for `@at-rama/sqlite-vector-wasm@0.1.0`, exact checked commit, matching archive digest and complete real-browser outcomes. Record the actual run/artifact identities and evidence availability; do not reuse unscoped archive qualification or invoke publishers.

Post-Apply 42P Verification and Archive are distinct subsequent workflows, not implementation checkbox substitutes. They must occur before human integration; this Change authorizes no account setup, candidate dispatch or real publication.
