# Design

## Context

See [proposal](proposal.md). On main `17d42d1976b8f3235c59fb499613a8cff89f7fc1`, Updates invocation/resolution/notice refresh, schema-1 descriptor, run title, candidate body and rehearsal still select sqliteVec/default lock. A-release already requires Vector and schema 2, passes the explicit Vector lock to complete production and verifies integrated preparation-run identity. A-inputs already provides resolve-vector, released-tag/commit binding and suffix-aware resolution. Package/acceptance already understand Vector, its selected documents/notices and native browser cases. No new engine integration is needed.

## Goals / Non-Goals

**Goals:** connect the existing Vector producers and release consumer to the complete A-updates lifecycle; make changed and unchanged source/notice snapshots reviewable before checks; keep human dispatch/merge distinct from qualification and publication.

**Non-Goals:** no discovery baseline or Watch parser migration, notification/site/public usage rewrite, source/build/package contract revision, runtime selector, dependency upgrade framework, separate alpha publisher or credential/account setup. Do not change shared numbering or make new sqlite-vec candidates. This implementation PR must not alter actual inputs/release.json, source pins or notice bytes, so it cannot itself be a publication candidate.

## Decisions

### 1. Keep one explicit Vector dispatch and the existing comment model

Use sqlite_version and sqlite_vector_version, with sqlite_comment, sqlite_vector_comment and misc_comment. Preserve edge trimming, SQLite → Vector → miscellaneous joining with one blank line and canonical releaseComment in the descriptor. Reject legacy/mixed inputs and overrides rather than add aliases or an engine menu. Preserve real hosted run/attempt identity and candidate/run-<runId>-<attempt> branches. This is the smallest change to the current form, test surface and downstream canonical comment.

### 2. Consume A-inputs as implemented, including conditional prereleases

Use resolve-vector with --sqlite-version, --vector-version and the explicit recorded inputs/sqlite-vector.sources.lock.json baseline. Persist its exact lock at that recorded path; preserve unchanged lock bytes, established binding/digests and the unused legacy lock. For a new Vector identity, reuse A-inputs’ preparation-time SHA-256 of the official commit-addressed archive, bound to its published release/tag/commit; do not require a nonexistent published asset checksum or recompute an established pin during production. Continue to retain resolver diagnostics outside the fresh production input directory. Do not duplicate source discovery, resolve npm dist-tags as versions, strip suffixes or fetch a branch to manufacture a release.

Observation from the exploration, not a future guarantee: public API lookup on 2026-10-19 returned 54 [releases](https://api.github.com/repos/sqliteai/sqlite-vector/releases?per_page=100) and 54 [tags](https://api.github.com/repos/sqliteai/sqlite-vector/tags?per_page=100), with no published prerelease; npm had 22 versions, latest 1.1.2 and no prerelease. The [upstream publication workflow at commit 0c2223a](https://github.com/sqliteai/sqlite-vector/blob/0c2223ada9dce1fa33248c8835a15f51d9a0f655/.github/workflows/main.yml) accepts only X.Y.Z for its release job. Historical 0.x versions are not automatically alphas. These observations neither restrict future official releases nor authorize development snapshots. Test alpha/beta/rc and invalid classification with synthetic official-metadata fixtures; do not claim an actual alpha build until an admissible one exists. No live alpha qualification is required when none is available; the actual recorded stable pair still requires the full real preparation exercise.

### 3. Freeze selected notices with the candidate commit

Adapt the current narrow notice helper, not a new license framework. Validate the current selected Vector baseline before preparing changes. For changed SQLite, retain its two exact archive-derived notices and permitted license-block extraction. For changed Vector, use LICENSE.md from its verified selected archive, bind the Apache text and raw/recorded digests to that release's immutable commit, and validate the already pinned FP16 license and incorporated headers. Vector's archive license is mandatory under the existing acquisition contract: missing selected content stops; the historical vec-only missing-license fallback does not justify a new Vector source workaround. Historical scenario titles containing sqlite-vec are retained solely for native full-block traceability; their updated WHEN/THEN clauses select Vector, never an additional product.

Do not relabel old license text merely because its bytes happen to match. Establish the selected source association before recording a changed version. For unchanged coherent groups, preserve records/bytes and report retained validation without claiming a fresh download or unavailable historical raw provenance. Leave unused vec records untouched, without maintaining another qualified product. Stage exactly the selected lock, descriptor, changed notice manifest/texts; copy all selected supporting notice inputs needed for staging validation, including NOTICE-vector.txt and pinned FP16 material. Dependency/header drift or unsupported normalization stops under current checks; it does not automatically adopt a new FP16 revision or weaken package provenance checks.

### 4. Reuse the complete qualification path on an exact clean commit

Generate A-release's schema-2 descriptor, not another handoff format. Use the existing shared calculation for actual state, rollback comments, transition and alpha rules. Commit the coherent snapshot, run canonical/registered checks and qualify that clean candidate through the current release qualifier with explicit Vector lock and forecast package identity. Keep preflight/qualification state snapshots and explain an input/state-derived forecast change; reserve no number. Check returned exact commit, engine/lock/versions, archive and preparation/comment identity before presentation. Reuse every browser/OPFS gate; no selective or fixture-only acceptance path.

The current release tests read the mutable recorded Vector lock while some descriptors/expected versions are fixed at 1.1.2. Isolate only those fixture inputs/expectations so changing an otherwise admissible candidate pin does not fail a test for the wrong reason. Keep independent negative expectations and strict production equality checks; do not relax them or rewrite A-release policy. Test same-pair reconstruction, changed SQLite, changed Vector, both changes and rollback selections without hardcoding the repository's current pair as the only valid candidate.

### 5. Preserve create-only presentation and a deliberate consumer boundary

Keep existing temporary branch/create-only remote protections, source/payload provenance, failure diagnostics and no automatic merge/tag/publication. Update run-name and candidate body to identify Vector plus exact versions, commit, preparation reference, unreserved forecast and artifacts; preserve structured comments. Supply that truthful handoff for A-watch's separate Change. Its existing parser still reads vec fields/default lock and may reject new candidate records: do not claim interoperation or silently modify/disable Watch here. Manual preparation remains independent of Watch state or its open discovery baseline.

### 6. Exercise actual preparation without a real candidate or publisher

Adapt existing rehearsal routing and the current-Change guard. Execute the existing preparation pipeline in a dedicated clean checkout with fresh production/tool state, allowing only its local temporary candidate branch/commit. Use the exact recorded stable Vector pair and an explicit coherent historical-publication fixture if live state is not used; identify that fixture and calculate the version rather than reserve an example. No remote candidate adapter or publisher is instantiated. Retain actual committed descriptor/notice snapshot, complete real-browser evidence, final archive and preparation report. Injected service tests separately establish remote ordering, collision/partial push/PR failure behavior; they are not live GitHub write/OIDC evidence. The tooling PR must retain its original input records rather than commit the rehearsal's candidate outputs.

## Risks / Trade-offs

- Source/descriptor/default-engine mismatch → one explicit Vector lock, existing validators and cross-bound qualification negatives.
- License association or FP16 drift → immutable selected-source proof, unchanged-record honesty and failure before qualification, without automatic dependency repair.
- Real upstream has no alpha → conditional support plus synthetic admissibility tests; no invented alpha or waived real stable exercise.
- Mutable pins make tests reject legitimate candidates → narrowly isolated fixtures, preserving behavior/integrity assertions.
- Old Watch cannot read the new handoff → document its pending separate adaptation; do not add its producer/consumer implementation to this unit.
- Simulated services or local commits overstate qualification → distinguish real production, fixture state and unexercised remote publication/candidate writes.

## Migration Plan

Implement only this preparation consumer and its tests/documentation, preserving production defaults and existing code outside the scoped paths. Verify the real nonpublishing preparation rehearsal and all applicable checks, then perform post-Apply 42P Verification. A later manually dispatched Vector preparation can create its own qualified candidate for human merge; the current tooling Change does not dispatch it. No automatic rollback, source patch, alternate pair, republishing or new bootstrap exception is introduced. No new blocking policy question remains in A-updates; the discovery baseline belongs to A-watch.
