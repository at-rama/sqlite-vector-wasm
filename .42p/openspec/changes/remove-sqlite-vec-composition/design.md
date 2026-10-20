# Design

## Context

See [proposal](proposal.md) for the target and [inventory](inventory.md) for observed paths. Current main retains both technical engines by explicit design, although prospective Watch/Updates/Release are already Vector. This draft is conditional on [upstream decisions D1/D2](authority-amendment.md); no applicable allocated authorization is invented.

## Goals / Non-Goals

**Goals:** delete only the abandoned current composition; make omitted/current invocations unambiguously Vector; preserve exact identity and the complete existing browser contract; close the demo transition truthfully.

**Non-Goals:** rebuild the release system, introduce backend abstractions, maintain old CLI/result compatibility, rewrite historical evidence, alter general 42P rules or perform implementation in this proposal PR.

## Decisions

1. Keep `inputs/sqlite-vector.sources.lock.json` and `resolve-vector` as the only active source identity/resolver. Remove the old lock/resolver rather than introducing conversion or alias machinery. Retarget build, acceptance and repository-gateway defaults. Preserve the existing Vector schema/identity fields; cosmetic renaming buys no behavior. Remove the stale schema-1 `inputs/release.json`; the next real Updates candidate creates its own descriptor rather than inheriting fabricated preparation provenance. An alternate generic filename/command is unnecessary churn.

2. Collapse the existing Vector integration path in place. Retain separate immutable extension objects, bridge registration and link hashes; delete the unused vec C-inclusion branch. Preserve the SQLite-only comparison runtime, common build/tool settings, source safety and all eleven browser assets. Reimplementing generic build orchestration or switching storage/runtime APIs is unnecessary.

3. Collapse packaging/docs/notices to actual Vector inputs without changing consumer runtime paths. Remove vec-only templates/texts/records while retaining SQLite/toolchain, Apache Vector and FP16 provenance, source-document hashes, deterministic identity rendering and final archive checks. Keep `docs/sqlite-vector/` and `docs/common/browser.md`; no replacement historical guide. Licenses follow shipped bytes; preserve attribution for inactive reusable demo material without shipping or loading the old demo runtime.

4. Separate *current candidate admissibility* from *historical publication interpretation*. Production rejects sqliteVec/ambiguous/schema-1 inputs without conversion. Historical published records may still carry sqliteVec, old lock shapes and absent later engine annotations; validate their exact original meanings and retain namespace/collision/channel/reference effects. Current `engineKey`, `channelFor`, publication readers and build/package validators are coupled: removing old build support must not silently remove the history reader. Keep only bounded read-only handling justified by current release obligations, not a legacy raw-calculation API or generic compatibility adapter. Legacy preparation-run/PR records, if encountered during normal enumeration, can be classified safely but cannot become current jobs. Do not drop unknown/contradictory state as if no history existed.

5. Qualify one Vector composition with all existing behavior controls. Replace successful two-engine tests with Vector successes plus legacy/mixed/wrong-input failures. Retain independent mathematical oracles, all loading/API/Worker/FTS5 surfaces, per-connection native version checks, every OPFS restart case, source/bundle corruption and failure propagation. Remove CI's alternate composition/choice; do not simply remove a matrix axis and lose cases. Test count is not coverage.

6. Use the adopted S-demo-placeholder phase: keep the Démo route/navigation and show only a short SQLite-Vector refactoring notice plus a working Usage link, with no delivery date, runtime identity, simulated results or functional-demo controls. Remove old-demo runtime/Worker/corpus loading, bundling and preparation/check prerequisites from active Site paths. Keep shell/docs publication and integration guarantees; verify stable/preview builds and mobile access without triggering old assets. Preserve reusable corpus/reference sources as inactive future-demo material, with their attribution, only where they are not active dependencies. The future A-site_demo return, already proposed in PR #77, remains independent and requires a real stable Vector archive, observed native identity and the complete corpus/mode/UI/memory/oracle qualification. Neither that publication nor PR #77 completion blocks this cleanup. No new mode switch or compatibility mechanism is introduced.

7. Preserve #78's editorial work and the current release-review architecture. Keep native current usage but put the old-SQL breaking explanation only in 0.3.0 release notes. Use the existing shared version policy rather than reserving or forcing that number. Final identity, preview and stable-deployment truthfulness remain unchanged.

## Risks / Trade-offs

- Shared historical/current validators → explicitly test real historical source shapes against current Vector calculation and ensure old selections are rejected at every production boundary.
- Generic behavior lost with old fixtures → map each removed fixture's actual integrity/API/storage obligation to a retained Vector case before deletion; keep complete registered suites and real final-package acceptance.
- License/provenance loss → compare extracted final inventory with actual Vector/FP16/toolchain sources and preserve old published bytes independently.
- Accidental old-demo reactivation → verify placeholder-only stable/preview construction and navigation, with no runtime/Worker/corpus preparation or requests. Future demo publication/qualification is a separate return condition, not a cleanup blocker.
- #78 merge order → rebase before Apply, recheck affected guide/caller paths and renew exact candidate checks.

## Migration Plan

No consumer migration guide or database conversion. After explicit upstream adoption and renewed derivation, implement removals on a dedicated branch, regenerate only legitimate current records, run applicable offline/clean-production/browser/Site checks and record exact evidence. Implement only the temporary placeholder in the cleanup; defer the complete future demo and its stable-byte qualification to A-site_demo/PR #77, without applying or merging that PR here. Archive/merge/publication remain separate authorized operations. If qualification fails, stop and correct within the adopted scope; revert the source change if needed rather than shipping a compatibility shim or relabeling old bytes. Existing published identities remain immutable.
