# Design

## Context

The baseline resolver/acquirer in `tools/inputs.py` validates schema 1 with `sqlite`/`sqliteVec`, requires official asset digests, rejects any archive link and rejects vendored SQLite. `tools/build/build.mjs` consumes its `acquire` output; Updates calls `resolve`. These callers and the production SQLite 3.54.0 / sqlite-vec 0.1.9 lock are unchanged here. See proposal.md for the unit and snapshot authority.

The official Vector release `1.1.2` is published, stable and non-draft. Its tag resolves to commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. GitHub's release assets are platform binaries; there is no source release asset/checksum. The commit tree contains the complete extension and FP16 headers, plus unrelated packages and a vendored SQLite copy. Its upstream Makefile builds `src/*.c`; the Vector header identifies 1.1.2 and uses `SQLITE_CORE` to select the external SQLite header. No submodule exists at this revision.

## Goals / Non-Goals

**Goals:** supply a reproducible, provenance-complete candidate source pair under A-inputs; preserve source integrity, fresh-workspace failure behavior and current production callers.

**Non-Goals:** build or patch the extension, run upstream packaging, modify SQLite/toolchain versions, add runtime engine selection, change channel/version policy or make a package/license-acceptance claim. A-build will consume the new handoff; package notices belong to A-package, including checking bundled FP16 notice provenance. Acquisition preserves available notices and does not invent a license assertion for that third-party code.

## Decisions

### Release-bound archive and explicit pin preparation

Use `https://codeload.github.com/sqliteai/sqlite-vector/tar.gz/<full-commit>` after binding the exact published release, tag and commit through official GitHub metadata. Reject drafts, unpublished commits, malformed/contradictory metadata and exact-version ambiguity. Explicit stable or alpha/beta/rc selections retain their full identity; omitted versions choose the latest official stable release. Retain the documented limit for SQLite prereleases without an established official numbered source/integrity format; fail rather than guess.

A new candidate resolution may download and hash this official commit archive, but writes only a candidate lock and provenance. It cannot adopt that pin or expose source trees for production. Production acquisition requires reviewed lock bytes matching the Git index, exactly as today, and checks the expected digest before archive inspection/extraction. Existing pin identities cannot change under resolution, including a tag retarget or regenerated archive. No signature or upstream-published checksum is claimed for the locally measured Vector digest. TLS origin/release binding and integrity against a previously recorded digest are distinct evidence.

Keep the existing SQLite pin unchanged. Candidate source-lock schema 2 uses `sqlite` and `sqliteVector`; the Vector record includes its exact version, official release URL and numeric release identity, tag, full commit, commit-addressed archive URL, SHA-256 and official metadata locators. The handoff preserves these identities and `lockDigest`. No registry of engines or interchangeable adapter interface is introduced.

### Minimal transition without breaking current callers

Add a fixed `resolve-vector` command to the existing input helper, with `--sqlite-version`, `--vector-version`, `--baseline-lock` and `--output`. It targets only sqliteai/sqlite-vector. Existing `resolve` and schema-1 `validate`/`acquire` behavior stay intact for the current production pipeline. `validate`/`acquire` accept schema 2 without converting schemas or silently switching engines. Keep this compatibility confined to source acquisition until later units replace their callers; do not add new legacy features or a public runtime selection surface.

Record the prepared new pair in `inputs/sqlite-vector.sources.lock.json` during Apply; leave `inputs/sources.lock.json` and `inputs/release.json` unchanged. Acquire it explicitly with `bash tools/inputs.sh acquire --lock inputs/sqlite-vector.sources.lock.json`. This avoids advancing A-build, A-package or A-updates inside an acquisition Change. Default legacy acquisition is the existing frozen pair, not an automatic fallback when a Vector operation fails.

### Select unchanged extension inputs without extracting unrelated files

For schema 2, after digest verification inspect archive paths without filesystem extraction, identify its single commit-root directory and copy only regular files beneath `src/`, required `libs/fp16/` headers and `LICENSE.md` into the extension source view, preserving their bytes and relative layout. Require `src/sqlite-vector.c`, `src/sqlite-vector.h`, the distance C/header set present at this pinned revision and the three FP16 headers. Check the header's version against the pin. Keep the raw verified archive for provenance, but never expose `libs/sqlite3.c`, `libs/sqlite3.h` or `libs/sqlite3ext.h` through the extension source view.

Reject absolute/traversal/backslash paths, collisions and selected symlinks/hardlinks/special files or linked ancestors. The archive's three unrelated package-license symlinks are never followed or materialized. Keep schema-1 extraction checks unchanged; do not weaken the existing generic extractor to allow links. SQLite's separately verified full-source tree retains executable bits and is the only source for its core/WASM/JS components. Copying an unchanged subset is acquisition glue, not an upstream patch.

### Evidence already observed during planning

On 2026-10-17, directly downloaded the official commit archive once: 2,772,458 bytes, SHA-256 `b44a759233bdc9a502bf2407972608d13dd6e60a31b4b03c2d4ae4b6b04f03c7`. It contains 125 members and three unrelated package-license symlinks. This is a measured candidate digest, not an upstream checksum or completed production acquisition. Apply must independently retrieve and confirm the archive before recording and consuming its pin.

Source locators: [release](https://github.com/sqliteai/sqlite-vector/releases/tag/1.1.2), [tag binding](https://api.github.com/repos/sqliteai/sqlite-vector/git/ref/tags/1.1.2), [source tree](https://github.com/sqliteai/sqlite-vector/tree/0c2223ada9dce1fa33248c8835a15f51d9a0f655), [version/header](https://github.com/sqliteai/sqlite-vector/blob/0c2223ada9dce1fa33248c8835a15f51d9a0f655/src/sqlite-vector.h), [license](https://github.com/sqliteai/sqlite-vector/blob/0c2223ada9dce1fa33248c8835a15f51d9a0f655/LICENSE.md). sqliteai/sqlite-wasm and precompiled native artifacts are not source inputs for this Change.

The delta preserves the historical scenario identifiers required by OpenSpec, including “Explicit sqlite-vec or both versions”; its updated WHEN/THEN text applies to SQLite-Vector. This is an identifier retained for contract continuity, not a second selected engine.

## Risks / Trade-offs

- GitHub can regenerate archive bytes at a fixed commit → digest mismatch fails; a new pin needs explicit review, never an automatic checksum refresh or fallback.
- Release tags can move → preserve and verify release/tag/commit binding against existing pins; mismatches fail.
- A full upstream source archive includes its own SQLite and links → copy only the checked extension view, using the independent SQLite pin for the actual core.
- Two source-lock schemas coexist during the unit-by-unit replacement → keep the old path unchanged and test both; no multi-engine distribution or permanent compatibility promise is made.
- A source handoff cannot prove static integration or licensing completeness of the final package → retain separate A-build, A-package and A-acceptance responsibilities. No source-only success is product acceptance.

## Migration Plan

Implement and verify the preparatory acquisition path and exact new pair. Keep the current production pair until dependent units can consume and qualify the new one. PR #66 must be integrated before this Change is integrated. A failed candidate acquisition cleans only its own temporary workspace; the existing production lock is unchanged, so rollback requires no runtime or publication operation. Later unit Changes own activation and removal of obsolete acquisition compatibility when no caller needs it. The existing synchronized upstream-inputs Purpose remains accurate for the current production pair during planning; native post-Verification synchronization must align that Purpose with the new selected-source capability, without changing another capability or rewriting archives.
