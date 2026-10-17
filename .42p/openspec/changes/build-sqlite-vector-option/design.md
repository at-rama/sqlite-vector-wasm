# Design

## Context

See [proposal](proposal.md) for the purpose, A-build authority and exact Allocation snapshot. Main `a2c9276385f09473ced800893c073a4129a0e0cf` includes the archived A-inputs addition, with SQLite 3.54.0 / sqlite-vec 0.1.9 in schema 1 and SQLite 3.54.0 / SQLite-Vector 1.1.2 in schema 2. Both locks are already repository-recorded. `tools/build/build.mjs` and the SQLite-only reference in `check.mjs` hardcode the default lock; the bridge and all vector browser probes hardcode sqlite-vec.

The harness pins Emscripten 4.0.23 and SDK Node 24.19.0. Common configuration is `--enable-all`, `-Oz`, targets `b-vanilla`, `b-esm`, `b-bundler`, with eleven expected browser assets. Retain that baseline and its upstream flags/exports, VFS defaults and existing environment filtering.

Read-only upstream inspection at Vector commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655` finds `sqlite3_vector_init`, a `SQLITE_CORE` header path and explicit `SQLITE_WASM_EXTRA_INIT` handling for mutex calls and `strcasestr`. Its source tree has seven C files; distance dispatch starts with the CPU implementation and architecture-specific branches. These are implementation clues, not a successful build. Its platform Makefile produces native shared libraries and is not the build driver for this browser distribution.

## Goals / Non-Goals

**Goals:** preserve the functioning sqlite-vec route and default invocation, add one concrete Vector route, reuse official SQLite construction and browser checks, and supply sufficient provenance for downstream qualification. Both retained compositions must satisfy the full A-build contract.

**Non-Goals:** source resolution changes, SDK/version upgrades, upstream patches, a generated amalgamation, general backend infrastructure, SQL translation, public runtime selection, SIMD tuning, benchmarks, final package/notices, publication, Site changes or resolution of Q-engine-transition. Quantization is not required to demonstrate static integration; full binary/Hamming oracle coverage on the final package remains A-acceptance's work. Raw native query smoke tests here establish usable integration only.

## Decisions

### Select the recorded composition through one lock

Add `--lock PATH` to `tools/build.sh` and the build entry point; omit it to retain `inputs/sources.lock.json`. Support exactly the current single-engine schemas accepted by A-inputs. The lock determines `sqliteVec` or `sqliteVector`; there is no separate `--engine`, environment-selected backend, registry or silent schema conversion. Delegate recorded-lock validation and fresh acquisition to A-inputs, then independently verify handoff lock digest, selected component/upstream identity, exact versions including suffixes, source origins and archive digests before generation/compilation. Reject unsupported arguments and ambiguous/mismatched compositions.

Keep source pins and the release descriptor unchanged. A raw build with `--lock inputs/sqlite-vector.sources.lock.json` is an explicit experimental construction, not a default release switch. The alternative of replacing the default lock would activate another composition prematurely; a second engine parameter could contradict the lock.

### Separate C units, existing SQLite initialization hook

Retain the existing sqlite-vec template and amalgamation integration. For Vector, compile its seven unchanged `src/*.c` translation units separately with the pinned `emcc`, common `-Oz` optimization, `SQLITE_CORE`, the existing upstream `SQLITE_WASM_EXTRA_INIT` conditional and include paths to the generated canonical SQLite header, selected extension `src` and `libs`/FP16 view. Link the resulting temporary object files directly; no additional archiver, SDK or dependency is needed. Architecture guards retain upstream CPU dispatch for the WASM baseline; no new native ISA or WASM SIMD flags are added.

Generate a separate small Vector bridge that declares/includes the upstream entry point and returns `sqlite3_auto_extension((void (*)(void))sqlite3_vector_init)` from `sqlite3_wasm_extra_init`. Propagate registration and connection-initialization failure as for sqlite-vec. No SQL functions are registered in JavaScript and no dynamic loading is required.

Use a small generated Make include, parsed after the official SQLite GNUmakefile, to append the explicit object-file list to the official `sqlite3-wasm.c.in` input list. Keep `sqlite3_wasm_extra_init.c` as the official hook input. This preserves distinct translation units and the existing flag/export definitions. Record and check the actual recipe/hook/input-list compatibility; never edit the acquired GNUmakefile or replace complete official compiler/export lists. Generated glue and objects remain in this invocation's ignored workspace. These objects are temporary build intermediates, not a native product distribution.

This deliberately avoids text-concatenating upstream C files into an unprovided amalgamation or adding a reusable engine adapter layer. If the pinned recipe cannot accept the retained separate-unit approach without an upstream patch, stop with diagnostics and escalate; do not change the SDK, patch sources, disable required functionality or redesign the approach silently.

### Extend the existing raw-browser checks

Pass the selected lock identity to the SQLite-only reference builder instead of reacquiring the default composition. Both builds acquire fresh sources; the reference uses the candidate's SQLite release, SDK, host/configure/common WASM options and omits only vector integration. Retain lock-digest equality and baseline-inventory inclusion checks. An unrelated default lock must not prevent or invalidate a legitimate alternate-lock check. The reference is a temporary control, not another product distribution.

Use small explicit engine branches in the existing internal probes, not interchangeable runtime adapters. Keep sqlite-vec's version/vec0 queries; add Vector's `vector_version()` and deterministic native `vector_init`/`vector_full_scan` smoke queries, preserving upstream storage semantics and not enabling quantization as a build prerequisite. Probe independent C-style and OO1 connections, conventional/ESM/bundler variants on main thread and direct Workers, Worker1 and promiser. Check SQLite and exact selected-engine identity, real query results and absence of accidental second-engine registration.

Retain BigInt, FTS5, baseline C/OO1/WASM/SQL/VFS inventories, applicable kvvfs/OPFS/opfs-wl/sahpool read/write and their context-dependent failure behavior. Keep missing/corrupt WASM, Worker and OPFS-proxy negative checks; an initialization error or timeout is not a successful capability. Storage prerequisites remain those of the pinned upstream. Full final-package vector oracles, persistence after shutdown/reopen and complete production-path acceptance stay with A-acceptance.

### Preserve provenance, failure behavior and downstream boundaries

Retain the outer build handoff and required default sqlite-vec fields. Add selected repository-relative lock path and engine identity plus actual extension compile/link commands, tool versions, generated integration-input hashes and their options as needed. Existing `inputs` already carries source origins and component keys; do not rename or discard these. Any `templateSha256` identifies the template actually used, never a hash of an unused sqlite-vec template presented as Vector evidence. Default callers remain compatible; neither the new provenance nor raw-build success claims that existing A-package accepts Vector handoffs.

Keep stdout success-only JSON, atomic handoff writing, eleven nonempty regular runtime files with size/SHA-256 inventory, retained logs/state on build failure, and caller-owned successful workspace lifetime. Extend current offline tests with fixed fixtures, including external command failures, schema/identity mismatch, argument/default compatibility and emitted provenance. No benchmark or general test framework is added.

### Evidence and lifecycle

First prove separate compilation with the current pinned pair and SDK without source modification. Then exercise both real compositions with the matched SQLite-only reference and complete existing raw-browser matrix. Reconstruct both compositions from isolated clean checkout/tool/npm/output state using documented pinned installation, and compare functional inventories and recorded inputs/options rather than requiring identical WASM bytes. Record newly measured sizes/hashes and commands; do not substitute native or fixture success for browser evidence. Existing archived A-build PASS reports retain their historical scope, not automatic applicability to this new composition.

## Risks / Trade-offs

- Separate-unit linkage can expose unresolved symbols or header/flag mismatches → use the canonical generated SQLite header and official hook, retain errors and stop rather than patching upstream.
- Existing Vector WASM conditionals do not guarantee compatibility with this SDK → require real compilation and browser execution before completion; failures are evidence, not waived checks.
- Engine-specific SQL can leak into shared checks → keep two explicit native probe branches while sharing unchanged baseline/API/storage checks; no product SQL abstraction.
- A fixed inventory/Make hook can change upstream → detect unsupported recipe/layout and fail explicitly, without promising all future releases or generalized build discovery.
- A raw Vector handoff is not yet consumable by unchanged packaging → leave A-package implementation untouched and record the exact source/build composition for its later Change.
- Reference and candidate share harness/options/authorship → disclose common dependencies and reused evidence; a matched reference demonstrates the examined baseline comparison, not independent end-to-end acceptance.

## Migration Plan

Implement the additive selector and exact source validation, then the separate Vector compilation/bridge with offline failure tests. Retain the default sqlite-vec path throughout. Update the reference/probes and documentation, reconstruct both compositions and record real browser evidence. Any required patch or change to the selected approach triggers explicit reconsideration; failed invocations retain diagnostics and never use earlier output. Default locks/release composition and all downstream unit implementations remain unchanged. After satisfactory post-Apply Verification, native synchronization must align the existing browser-build Purpose with the retained two composition options; historical archives are not rewritten.

## Open Questions

No unresolved product/design decision is delegated to implementation. Two technical hypotheses remain unproved until Apply: separate-unit linkage under the pinned SDK succeeds without a patch, and the resulting runtime initializes correctly across the required browser contexts. The task list contains the concrete evidence and stop conditions for both; inability to prove either prevents completion. Cross-engine publication version/maturity/alpha/reference policy and the Vector Watch baseline remain outside this unit under Q-engine-transition.
