# Design

## Context

See [proposal](proposal.md) for motivation and [delta](specs/distribution-candidates/spec.md) for behavior. Inspection baseline is `main` commit `b1bacae6854e8e6594fc7023ffa29ed6245df4ea`, newer than the failed run's `cb506d9bdd811a7a61bd873903bc9e4bb436ca0b`.

[Preparation code](../../../../tools/updates/run.mjs) resolves a lock, computes a forecast, switches branch and commits only `inputs/sources.lock.json` and `inputs/release.json`. Repository checks precede complete qualification. [Packaging](../../../../tools/package/package.mjs) requires the exact ten notice names, project/version association and SHA-256 agreement; release preflight uses the same validation against the committed payload. Current pins/notices are SQLite `3.53.4`, sqlite-vec `0.1.9`, Emscripten `4.0.23`.

### Revalidated incident

The downloaded [artifact 11924641304](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38627390423/artifacts/11924641304), named `updates-38627390423-1`, has ZIP SHA-256 `f43cb2125378200575b0ac7cda225dc271d76e125ac0bdca570f687f660803ea`, matching the GitHub artifact metadata. It contains:

- `updates/run-Jel7ry/candidate.json`: selection SQLite `3.54.0` / sqlite-vec `0.1.9`; base `cb506d9bdd811a7a61bd873903bc9e4bb436ca0b`; candidate `b3c1e83f9e23d5a61f40399150d6076812438a24`; checkout, resolve, state and commit passed, repository failed.
- `sources.lock.json` in that directory: SQLite `3.54.0` official archive and digest.
- `repository.log`: repository gateway passed.
- `tests.log`: multiple package tests report `Wrong notice association: SQLite-LICENSE.txt`; qualification and remote operations are absent from the recorded operation list.

The artifact does not contain a complete candidate checkout. The stale manifest conclusion combines those primary results with preparation code and notice inputs read at both the failed run base and current main; it does not claim inspection of absent candidate files. The run did not reach qualification or create a candidate PR. No active Change existed on main and no PR was open at inspection; archived candidate preparation defines the broader feature, and archived packaging defines controlled notice inputs, but neither plans this reconciliation.

[Archived packaging design](../archive/2026-10-07-package-browser-runtime/design.md) records that its verified sqlite-vec amalgamation contained only C/header files, whereas SQLite's full-source archive contained both required notice sources. This is historical archive inspection, not renewed inspection of the selected 3.54.0 archive. The official sqlite-vec `v0.1.9` Git tree was independently read through GitHub and contains `LICENSE-MIT` and `LICENSE-APACHE`. The implementation validates each future selected archive rather than assuming an invariant archive layout.

## Goals / Non-Goals

Make the snapshot entering checks coherent and reproducible from controlled notice inputs. Keep downloading, deriving and validating notices inside preparation; packaging and publication remain offline with respect to notice sources.

Do not reconcile Emscripten/toolchain updates, discover additional engines, decide new legal terms, change the notice inventory, modify upstream code, run a second production build from preparation's temporary acquisitions, or weaken existing validators. A missing/changed licensing layout outside the defined extraction rules fails for review instead of being guessed.

## Decisions

### 1. Reconcile before the single candidate commit

Add an injectable reconciliation operation in `tools/updates/run.mjs` after resolve/state/preflight and before the commit operation. It reads the recorded baseline lock/manifest and prepares all outputs in the run's ignored directory before replacing tracked files. Validate baseline notices against baseline identities first; corruption is not an instruction to repair.

For every changed upstream version, derive its complete notice group from selected sources. Preserve unchanged groups byte-for-byte, including their metadata; validate their existing hashes and selected-version association. Selecting the same pair adds no notice network dependency or notice churn. Changed origins/digests for an established source version remain resolver errors. A new version with unchanged wording still receives newly established provenance and the new version association.

Only after every group and the complete resulting manifest validate, switch to the temporary branch, write changed records/texts and the release descriptor, stage an explicit allowlist of lock/descriptor/manifest/four upstream notice paths, and create one commit. No commit is made on reconciliation failure. A write/commit failure stops; it never advances to repository checks or remote writes. The disposable checkout can retain partial local edits for diagnosis; there is no requirement for a multi-file filesystem transaction or automatic reset.

Run the existing strict `noticeInputs` against the selected versions before commit, without constructing runtime output. Leave its project/version/digest checks intact. Assert the clean evaluated commit includes the coherent snapshot, then keep the current repository checks, qualification and create-only push/PR path.

Alternative: reconciling during packaging makes its inputs network-dependent or mutates a revision after qualification begins. A metadata-only version bump does not establish notice provenance.

### 2. Fixed archive-first source rules

Use a small Python helper `tools/updates/notices.py`, called through the existing Node command runner. Reuse `tools/inputs.py` acquisition/digest/archive safety functions, with an explicit run-local parent. The existing `acquire_lock` function can acquire the exact selected pair into `.work/updates/run-*/notice-inputs/` whenever either group changes; it validates the selected lock and both archive digests before extraction. This intentionally permits an extra pair acquisition to keep the existing complete production path unchanged. Same-pair reconstruction skips acquisition.

Preparation notice acquisition must not populate `.work/inputs/`: `production` requires that workspace empty. Never reuse the notice workspace as production input or weaken freshness checks. If acquisition itself deletes failed source work, preserve the operation diagnostic and available expected identity; do not promise bytes it did not retain.

| Notice | Selected source | Derived recorded text |
| --- | --- | --- |
| SQLite-LICENSE.txt | Verified SQLite full-source root, `LICENSE.md` | Complete notice text |
| SQLite-WASM-NOTICE.txt | Same archive, `ext/wasm/api/sqlite3-license-version-header.js` | Initial `/* @preserve` license block through its first terminating `*/`; exclude following version/template code |
| sqlite-vec-MIT.txt | Verified sqlite-vec archive, unique regular `LICENSE-MIT`, if present; otherwise canonical Git file below | Complete notice text |
| sqlite-vec-APACHE.txt | Verified sqlite-vec archive, unique regular `LICENSE-APACHE`, if present; otherwise canonical Git file below | Complete notice text |

Only inspect the safely extracted selected tree. Missing SQLite sources, ambiguous sqlite-vec matches, nonregular files, empty/invalid UTF-8 text, NULs or an absent/malformed initial preserve block fail. Do not substitute unrelated archive text or infer a license from the C header. Missing sqlite-vec files use `asg017/sqlite-vec`, exact `v<selected version>` (suffix retained), resolved via GitHub Git refs/tags to a commit, including annotated-tag peeling. Read the named top-level license file at that commit through its Git tree/blob, not a default branch. Verify blob identity against the tree and recompute its Git blob SHA-1 before deriving text; record SHA-256 as well. Transport/API errors, absent tags/files or unexpected object kinds fail. No replacement source repository archive is necessary.

Archive-first keeps SQLite provenance tied to the same source as its runtime and uses future sqlite-vec archive notices when supplied. Canonical-file fallback is necessary because the known amalgamation omits them; always using floating web license pages is rejected.

### 3. Preserve wording and record immutable provenance

Apply only existing permitted whitespace normalization: remove trailing spaces/tabs per line and blank EOF lines; retain wording and end with one LF. For the WASM header, extract the defined license block first. Do not render Markdown, expand template variables, rewrite dates/license wording or modify runtime assets. Record normalization explicitly when applied and record the header extraction selector.

Keep `notices.json` schemaVersion 1, name/project/version/origin/sha256 fields, inventory and order. Add a `source` object only to refreshed entries; existing consumers permit additional entry fields and copy the full manifest to `licenses/origins.json`:

- Archive source: `kind: archive`, selected `archiveUrl`, `archiveDigest` (algorithm/value), member `path`, and `sha256` of the complete raw member before extraction/normalization.
- Git source: `kind: git`, `repository`, exact `tag`, resolved `commit`, member `path`, `blobSha` and raw `sha256`.
- `origin` becomes a reviewable immutable source URL: archive URL plus a member-path fragment, or `https://github.com/asg017/sqlite-vec/blob/<commit>/<path>`. The `source` object carries the machine-readable locator; a fragment is not represented as an HTTP member download.

The existing top-level entry `sha256` remains the digest of recorded/shipped notice bytes. Validate raw integrity and provenance before promoting the records; freeze these digests in the candidate before checks. Unchanged legacy records remain valid; do not invent missing historical immutable provenance. Evidence identifies the retained manifest entry, its existing origin/version, its checked recorded-byte digest and a retained/validated disposition. A raw digest or immutable source identity absent from that entry is explicitly not established; retaining it does not claim renewed upstream acquisition. The richer raw/immutable evidence is mandatory only for notices refreshed by this preparation. Emscripten's six records and bytes remain unchanged.

A canonical Git source has Git object integrity and recorded SHA-256, not an independently published upstream SHA-256 attestation. Candidate review and human integration review the newly recorded input. Once recorded, package/release consume those fixed bytes/digests; they never refresh them from a moving tag.

### 4. Truthful diagnostics and downstream scope

Write a reconciliation report under the existing uploaded `.work/updates/run-*/` tree. For each group record selection and its refreshed or retained disposition. For refreshed groups record source identities, raw/recorded digests, extraction/normalization, and completed/failed actions; for retained groups record the existing notice association and checked recorded-byte digest, with unavailable historical raw/immutable provenance explicitly not established. Same-pair preparation still emits these retained-validation results without notice acquisition. On failure retain available diagnostics naming the upstream and notice; avoid credentials and full HTTP response headers/bodies. Add a named reconciliation operation to `candidate.json`; do not assign a candidate commit until commit succeeds.

Existing workflow artifact upload already uses `always()` and includes this directory, so no broader artifact or workflow redesign is needed. Source archives/trees and reports remain ignored. Candidate PR diffs expose the actual recorded notice updates for human review. Packaging's `licenses/origins.json` carries the refreshed provenance without a new publication schema or manual version registry.

### 5. Validation at the appropriate boundaries

Offline fixtures exercise real derivation against independently specified expected notice bytes/digests, archive integrity/safety, and canonical Git responses. Orchestration tests inspect the actual candidate commit at the moment repository checks start; stubbing checks alone cannot establish coherent inputs. Cover SQLite-only, sqlite-vec-only, both, admitted sqlite-vec prerelease, rollback, same-pair, unchanged text/new version, and failures before commit/checks/qualification/push.

Keep package tests rejecting wrong version, project, missing notice and changed bytes; add regression coverage for refreshed metadata in the assembled/extracted `licenses/origins.json`. Run all registered suites and the gateway. A nonpublishing preparation rehearsal using the incident pair must exercise refreshed notices and the complete real-browser path in a fresh environment during implementation/Verification, with evidence or an explicit blocker. Fixtures and planning checks do not establish real candidate eligibility.

## Risks / Trade-offs

- Additional verified archive acquisition costs time/bandwidth → reuse the current acquisition primitive in a run-local directory; do not introduce caching or alter production freshness.
- Canonical tags can move → resolve once to an immutable commit, verify tree/blob identity and record it; no silent refresh of an established candidate.
- New license files or header formats may exceed the fixed inventory/selector → fail with diagnostics and escalate any required semantic/inventory revision.
- Whitespace normalization can hide accidental wording edits → compare independent expected fixture bytes and raw/normalized digests; retain the complete raw source identity.
- Historical evidence is limited → distinguish the downloaded incident evidence, current code, historical archive account and new future execution in Verification.

## Migration Plan

Implement the helper and orchestration without updating the repository's current source pins/notices as a shortcut. The next preparation with a changed pair generates its coherent notice diff; same-pair preparation remains compatible with existing valid records. Publication/packaging continue reading only committed notice inputs. Reverting this corrective implementation restores the present failure for changed versions; never use rollback to relax validators. No data or 42P migration is required, and no major functional decision remains open.
