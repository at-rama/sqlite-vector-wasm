# Design

## Context

See [proposal](proposal.md) for the motivation and source Allocation. Main `6bad238fdbbbd0793abfdfe382d8c94f8a2c3a62` merges A-build: each handoff now carries `sourceLockPath`, concrete `engine`, acquisition identities and actual build commands; Vector adds seven extension commands and generated-input hashes. Both recorded locks use SQLite 3.54.0 and the same qualified Emscripten 4.0.23/Node 24.19.0 tooling, with sqlite-vec 0.1.9 or Vector 1.1.2.

`tools/package/package.mjs` currently hardcodes the default lock, `inputs.sqliteVec`, vec bridge hash, ten notices and vec package description. Its manifest only normalizes the bridge argument, so new Vector object/Make/include paths would remain temporary absolute paths. Assembly/archive inspection, complete-file hashing, atomic handoffs and offline local npm install already exist. `tools/package/check.mjs` already checks the actual extracted archive at `/runtime/`, but its Worker1/promiser SQL and selected version assume vec. `tools/build/browser-probe.mjs` now has two explicit native branches reusable by this scoped checker.

The current packaging tests require exact README/usage copies, while `tools/site/` consumes root `README.md` and `docs/usage.md`. Site C-readme leaves source paths as realization choices but current `site-docs` fixes those two paths. This Change selects separate package documents without breaking those existing Site inputs; selecting Site sources is subsequent A-site_docs work, already accepted as separate by the maintainer.

## Goals / Non-Goals

**Goals:** support both recorded build compositions with one concrete assembly flow, exact composition-aware notices/documents/provenance and unchanged upstream runtime bytes; retain default callers and actual final-archive resolution evidence.

**Non-Goals:** another package/product name, default release switch, runtime engine chooser, SQL translation, dynamic extension loading, source/build changes, publication/channel calculation, automated Vector candidate/notice refresh, Site selection implementation, general document templating or final A-acceptance qualification. Both fixture package identities remain explicitly nonpublished.

## Decisions

### Derive composition from the existing build handoff

Retain `package.sh --build-handoff PATH --name NAME --version VERSION`. Use the handoff's repository-recorded lock and engine identity; verify them against repository bytes, exact component origins/versions/digests, actual template/configuration/tool identities and expected single-engine composition. Reject missing, contradictory or stale fields before consuming runtime bytes. An unannotated legacy sqlite-vec handoff may retain the existing default interpretation only when its existing exact default-lock/component checks succeed; it must never stand in for Vector. No additional selector, source resolution, acquisition, recompilation or previous-output fallback is added.

Reuse bounded A-build identity helpers where their existing contract fits; do not make package consumption depend on live build sources once packaging has consumed them. Keep the eleven-file inventory and all regular-file/path/symlink/size/hash checks, complete archive inspection and runtime byte preservation. Concrete branches for these two supported compositions are sufficient; a backend registry would add maintenance without an assigned need.

### Preserve explicit identities and portable provenance

Keep current default `runtime.json` input keys, compact `{version, digest}` component shapes and required package-handoff fields; Vector uses `inputs.sqliteVector`, never an alias under `sqliteVec`. Existing A-acceptance compares the default component shapes exactly. Add engine/selected-lock and source-origin information as additive outer metadata, rather than expanding those compared component objects or changing their meaning. Retain exact versions, source origins/archive digests, lock digest, actual build configuration/integration hashes and runtime identities. Validate Vector's used template and bridge/Make/object input reporting instead of hashing an unused vec template.

The portable manifest replaces invocation-specific source/build paths in recorded commands with clearly described symbolic paths, including extension compile arguments, objects, include directories and Make include. Preserve command order, flags, filenames and digests; no secret original-path dependency survives extraction. The raw build handoff remains the actual-command record, identified by its existing handoff digest. Do not require byte-identical runtime rebuilds or introduce another version registry. Record and hash notice, document, metadata and final-archive contents for downstream consumers. A newly supplied package number requires a newly assembled/checked payload rather than relabeling an old qualified archive.

### Select explicit documentation files by engine

Use `docs/common/`, `docs/sqlite-vec/` and `docs/sqlite-vector/`. Engine folders own their composition-specific presentation and usage sources; genuinely common hosting/API/Worker/storage material has one source. An explicit small file-to-destination mapping produces `README.md`, `docs/usage.md` and any declared common document paths in each archive. No directory overlay, implicit overwrite, prose merge, general generator or runtime selection is introduced. Missing, duplicate, unsafe or wrong-engine sources fail assembly. Selected sources are copied without inventing factual content; author links that work in GitHub and the extracted layout, using explicit stable source URLs where relocation makes relative positions differ. Test links and the exact shipped-source selection rather than assuming copying preserves them.

Every composition-dependent package document and description follows this selection, not just the usage example. Examples use the selected engine's native SQL; common SQLite APIs remain unchanged. Each guide identifies its actually checked published package/composition when one exists. Before a Vector publication exists, label its verification against an identified nonpublished fixture archive honestly; do not invent a registry release. The subsequent release/documentation work must align that guide with its actual publication.

Keep root README as the repository entry point and current `docs/usage.md` as the existing Site source in this Change, preserving the currently checked published example and Site behavior. Those existing published-reference documents may remain unchanged as transitional compatibility inputs; do not establish a second automatic mirror or maintain parallel edits of the same shared instructions. New engine-folder documents are the package's selected sources. Reuse common material where possible; the subsequent A-site_docs Change replaces the legacy Site source selection with the approved composition-specific selection. If compatibility cannot be preserved without changing Site semantics, stop and report that dependency rather than implementing Site behavior here. That later Change preserves its separately pinned demo/runtime identity; this proposal neither creates nor verifies it.

### Ship only the applicable notices, retaining default refresh callers

Retain reviewed common SQLite/SDK licensing material and vec notices for vec; add reviewed Vector and incorporated-dependency records for Vector. Extend the existing controlled notice manifest/text inventory with explicit associations, exact version or dependency revision, immutable origin, source digest and shipped-text digest. Select common plus one engine's required material, including the selected `NOTICE` description and matching `licenses/origins.json`. Root project Apache-2.0 remains distinct from upstream terms; embedded runtime notices remain untouched. Do not ship an unselected engine's attribution as the description of the included binary.

At pinned Vector commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`, `LICENSE.md` is Apache-2.0 and three `libs/fp16/*.h` files are consumed. The examined upstream tree supplies no separate FP16 license file. The FP16 upstream has MIT material, but exact provenance/licensing for the incorporated header revisions remains a specific Apply check, not an established finding here. Trace those headers to suitable immutable source/licensing evidence, record the notices, and fail packaging if required attribution cannot be established. Do not assume the extension's top-level license covers every dependency or fetch unrecorded notice bytes during ordinary assembly.

Existing A-updates calls `noticeInputs({inputs: lock}, repository)` and uses a fixed retained-path list. Preserve that helper convention and the default notice-refresh path; exercise its existing tests and targeted compatibility controls. Ordinary packaging consumes already recorded material. Adding automated Vector notice acquisition/refresh belongs to A-updates; do not silently modify its implementation or turn that future work into a waiver of Vector package completeness.

### Verify the extracted payload with concrete native SQL

Extend the existing package checker, preserving its exported default vec caller behavior used by A-acceptance. Pass concrete engine identity into fixed native query branches, reusing the existing probe definitions rather than inventing runtime adapters. Worker1/promiser must execute native deterministic queries as well as report exact versions; absence of the other engine must be checked. Retain C/OO1, BigInt, FTS5, three modes, actual requested package assets, main/Worker storage checks and missing/corrupt companion controls.

For each real composition, use the pinned environment to acquire/build/package fresh inputs, install the resulting tarball locally with scripts/network disabled, extract it separately, make original build/source directories unavailable to the check and host under a non-root prefix. Verify all runtime requests resolve only packaged bytes. Record actual commands, versions, notice/doc metadata, asset/archive identities, conditions and failures. These public-surface checks still share repository harness/probe/authorship dependencies; disclose them. No benchmark infrastructure is needed. Full independent vector/Hamming oracles, shutdown/reopen persistence, whole-path CI and authoritative publication evidence remain A-acceptance/A-release's contributions.

## Risks / Trade-offs

- FP16 notice provenance may be insufficient → record a precise blocker and stop; no assumed license or optional-notice fallback.
- Per-engine documents can drift or break on relocation → explicit file mapping, source/output link checks, no duplicate maintained shared prose and exact selected-source hashes.
- Changing documentation paths could affect Site → preserve its current inputs/checked example and run relevant existing documentation controls; escalate a semantic Site dependency rather than expanding this unit.
- New notice records/metadata can break default downstream callers → retain helper signatures/default fields and run existing notice/packaging/acceptance fixture suites; do not claim Vector acceptance support.
- Temporary paths can leak into Vector manifest → inspect every recorded command and test relocation after original-source removal.
- Shared probes can conceal correlated errors → separate final tarball/install/request observations from definitions and disclose shared dependencies and finite tested conditions.

## Migration Plan

Implement bounded input/provenance validation, reviewed notice associations and explicit document selection, then extend final-archive checks and compatibility fixtures. Reconstruct and package both actual compositions and record the extracted-browser evidence before task completion. Keep source locks, release descriptor, SDK and default orchestration unchanged. Any upstream patch, omitted capability or required source-authority revision stops Apply. Post-Apply 42P Verification precedes any synchronization/archive. Rollback is a code revert preserving previously published artifacts, not republishing an existing identity.

## Open Questions

No unresolved product decision is delegated to Apply. Exact FP16 attribution and actual two-composition packaging/browser behavior are bounded technical checks with explicit failure/stop conditions. Q-engine-transition is an independently recorded A-release/A-watch policy question, not resolved or made a prerequisite here. Site source selection remains separately allocated A-site_docs work, not an untracked part of this implementation.
