# Design

## Context

The baseline resolver/acquirer in `tools/inputs.py` validates schema 1 with `sqlite`/`sqliteVec`, requires official asset digests, rejects any archive link and rejects vendored SQLite. `tools/build/build.mjs` consumes its `acquire` output; Updates calls `resolve`. These callers and the production SQLite 3.54.0 / sqlite-vec 0.1.9 lock are unchanged here. See proposal.md for the unit and snapshot authority.

The official Vector release `1.1.2` is published, stable and non-draft. Its tag resolves to commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`. GitHub's release assets are platform binaries; there is no source release asset/checksum. The commit tree contains the complete extension and FP16 headers, plus unrelated packages and a vendored SQLite copy. Its upstream Makefile builds `src/*.c`; the Vector header identifies 1.1.2 and uses `SQLITE_CORE` to select the external SQLite header. No submodule exists at this revision.

## Goals / Non-Goals

**Goals:** supply a reproducible, provenance-complete candidate source pair under A-inputs; retain both concrete engine acquisition paths as release options, with exact engine identity, source integrity, fresh-workspace failure behavior and unchanged current production callers.

**Non-Goals:** build or patch the extension, run upstream packaging, modify SQLite/toolchain versions, add runtime engine selection, change channel/version policy or make a package/license-acceptance claim. A-build will consume the new handoff; package notices belong to A-package, including checking bundled FP16 notice provenance. Acquisition preserves available notices and does not invent a license assertion for that third-party code.

## Decisions

### Release-bound archive and explicit pin preparation

Use `https://codeload.github.com/sqliteai/sqlite-vector/tar.gz/<full-commit>` after binding the exact published release, tag and commit through official GitHub metadata. Reject drafts, unpublished commits, malformed/contradictory metadata and exact-version ambiguity. Explicit stable or alpha/beta/rc selections retain their full identity; omitted versions choose the latest official stable release. Retain the documented limit for SQLite prereleases without an established official numbered source/integrity format; fail rather than guess.

A new candidate resolution may download and hash this official commit archive, but writes only a candidate lock and provenance. It cannot adopt that pin or expose source trees for production. Production acquisition requires reviewed lock bytes matching the Git index, exactly as today, and checks the expected digest before archive inspection/extraction. Existing pin identities cannot change under resolution, including a tag retarget or regenerated archive. No signature or upstream-published checksum is claimed for the locally measured Vector digest. TLS origin/release binding and integrity against a previously recorded digest are distinct evidence.

Keep the existing SQLite pin unchanged. Candidate source-lock schema 2 uses `sqlite` and `sqliteVector`; the Vector record includes its exact version, official release URL and numeric release identity, tag, full commit, commit-addressed archive URL, SHA-256 and official metadata locators. The schema-2 handoff preserves these identities and `lockDigest`. Schema 1 retains its `sqliteVec` identity and published release-asset SHA-256 policy. The fixed schema keys distinguish `asg017/sqlite-vec` from `sqliteai/sqlite-vector`; pin lookup compares component/upstream identity and exact version, never version alone. Existing schema-1 handoff fields remain compatible; no schema conversion is needed. No registry of engines or interchangeable adapter interface is introduced.

### Retain two fixed acquisition paths without changing current callers

Add a fixed `resolve-vector` command to the existing input helper, with `--sqlite-version`, `--vector-version`, `--baseline-lock` and `--output`. It targets only sqliteai/sqlite-vector. Existing `resolve` and schema-1 `validate`/`acquire` behavior stay intact for the current production pipeline. `validate`/`acquire` accept schema 2 without converting schemas or silently switching engines. Retain both paths as durable acquisition options for future single-engine releases. This does not promise support for every future upstream layout/version. Fixed commands and discriminated locks suffice; a generic selector, registry, adapter framework or public runtime selection surface is unnecessary.

Record the prepared new pair in `inputs/sqlite-vector.sources.lock.json` during Apply; leave `inputs/sources.lock.json` and `inputs/release.json` unchanged. Acquire it explicitly with `bash tools/inputs.sh acquire --lock inputs/sqlite-vector.sources.lock.json`. This avoids advancing A-build, A-package or A-updates inside an acquisition Change. Default acquisition remains the existing frozen sqlite-vec pair. An explicit schema-2 acquisition obtains SQLite plus SQLite-Vector only; a schema-1 acquisition obtains SQLite plus sqlite-vec only. Neither path is a fallback for a failure in the other.

### Select unchanged extension inputs without extracting unrelated files

For schema 2, after digest verification inspect archive paths without filesystem extraction, identify its single commit-root directory and copy only regular files beneath `src/`, required `libs/fp16/` headers and `LICENSE.md` into the extension source view, preserving their bytes and relative layout. Require `src/sqlite-vector.c`, `src/sqlite-vector.h`, the distance C/header set present at this pinned revision and the three FP16 headers. Check the header's version against the pin. Keep the raw verified archive for provenance, but never expose `libs/sqlite3.c`, `libs/sqlite3.h` or `libs/sqlite3ext.h` through the extension source view.

Reject absolute/traversal/backslash paths, collisions and selected symlinks/hardlinks/special files or linked ancestors. The archive's three unrelated package-license symlinks are never followed or materialized. Keep schema-1 extraction checks unchanged; do not weaken the existing generic extractor to allow links. SQLite's separately verified full-source tree retains executable bits and is the only source for its core/WASM/JS components. Copying an unchanged subset is acquisition glue, not an upstream patch.

### Evidence already observed during planning

On 2026-10-17, directly downloaded the official commit archive once: 2,772,458 bytes, SHA-256 `b44a759233bdc9a502bf2407972608d13dd6e60a31b4b03c2d4ae4b6b04f03c7`. It contains 125 members and three unrelated package-license symlinks. This is a measured candidate digest, not an upstream checksum or completed production acquisition. Apply must independently retrieve and confirm the archive before recording and consuming its pin.

Source locators: [release](https://github.com/sqliteai/sqlite-vector/releases/tag/1.1.2), [tag binding](https://api.github.com/repos/sqliteai/sqlite-vector/git/ref/tags/1.1.2), [source tree](https://github.com/sqliteai/sqlite-vector/tree/0c2223ada9dce1fa33248c8835a15f51d9a0f655), [version/header](https://github.com/sqliteai/sqlite-vector/blob/0c2223ada9dce1fa33248c8835a15f51d9a0f655/src/sqlite-vector.h), [license](https://github.com/sqliteai/sqlite-vector/blob/0c2223ada9dce1fa33248c8835a15f51d9a0f655/LICENSE.md). sqliteai/sqlite-wasm and precompiled native artifacts are not source inputs for this Change.

The delta preserves the historical scenario identifiers required by OpenSpec, including “Explicit sqlite-vec or both versions”; its WHEN/THEN text now covers either retained acquisition path independently. It does not select both engines in one pair.

## Risks / Trade-offs

- GitHub can regenerate archive bytes at a fixed commit → digest mismatch fails; a new pin needs explicit review, never an automatic checksum refresh or fallback.
- Release tags can move → preserve and verify release/tag/commit binding against existing pins; mismatches fail.
- A full upstream source archive includes its own SQLite and links → copy only the checked extension view, using the independent SQLite pin for the actual core.
- Two concrete source formats remain available → test both paths and keep engine identities distinct; retain existing behavior without promising arbitrary future upstream compatibility or combining engines in one distribution.
- A source handoff cannot prove static integration or licensing completeness of the final package → retain separate A-build, A-package and A-acceptance responsibilities. No source-only success is product acceptance.

## Migration Plan

Implement and verify the additional acquisition path and exact new pair while retaining sqlite-vec acquisition. PR #66 is merged. A failed candidate acquisition cleans only its own temporary workspace; the existing production lock is unchanged, so rollback requires no runtime or publication operation. Later unit Changes own consuming, integrating and qualifying a chosen composition, without a scheduled removal of sqlite-vec. Native post-Verification synchronization must align the upstream-inputs Purpose with both retained source options, without changing another capability or rewriting archives.

Cross-engine version increments, maturity, alpha/reference selection (including returning to a retained engine) and the SQLite-Vector Watch baseline remain unresolved in Release/Watch Q-engine-transition. A-release/A-watch own those decisions; A-inputs records engine identity and exact source pins without guessing that policy or making it an acquisition prerequisite.
