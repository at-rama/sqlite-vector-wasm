# Tasks

## 1. Exact released source selection and candidate pin

- [ ] 1.1 Add fixed SQLite-Vector candidate resolution and schema-2 pin validation in the existing input helper, preserving the current schema-1 production path; cover explicit/omitted independent selections, stable/prerelease identities, drafts, absent releases, malformed data and no-fallback cases in `tools/tests/test_inputs.py`, and document the new command alongside the unchanged legacy commands in `docs/source-acquisition.md`.
- [ ] 1.2 Bind official release/tag/commit metadata, prepare the commit-addressed archive SHA-256 separately from production acquisition and retain established pins on subsequent resolution; test missing/contradictory bindings, moved tags, changed archives/digests, incomplete locks and unchanged SQLite official-digest policy, and document the difference between candidate hashing and recorded-pin verification.
- [ ] 1.3 Independently retrieve release 1.1.2 metadata and its commit archive, confirm the planning identity/hash, and record `inputs/sqlite-vector.sources.lock.json` with the unchanged SQLite 3.54.0 pin; verify offline validation and Git-index lock matching, retaining official origin evidence in ignored `.work/` and a durable concise account without changing the default source lock or release descriptor.

## 2. Fresh safe source-pair acquisition

- [ ] 2.1 Extend explicit schema-2 acquisition to verify both downloaded archives before use, inspect the Vector archive safely and materialize unchanged selected extension/FP16/license inputs only; add archive fixtures for required content/version, malformed paths, collisions, selected links/linked parents, unrelated skipped package symlinks, vendored SQLite exclusion and preserved SQLite executable modes; document the source-view layout and confirm the targeted input suite passes.
- [ ] 2.2 Emit a complete pair handoff carrying source locations, exact versions/origins/digests, Vector release/tag/commit and consumed lock digest only after both inputs succeed; test source-one/source-two failures, cleanup, fresh-workspace isolation, unchanged previous outputs, no cache/fallback and preserved legacy production acquisition, and document handoff ownership and its source-only evidence limits.

## 3. Integration evidence and boundary checks

- [ ] 3.1 Reconstruct recorded schema-2 acquisition twice in isolated clean checkouts with empty tool/npm/output state and no SDK or source cache; verify independently hashed archives, source-view bytes, exact identities and distinct workspaces, recording commands/prerequisites/results without claiming build or browser acceptance.
- [ ] 3.2 Run `sh tools/check-repository.sh`, `sh tools/test-repository.sh` and pinned strict OpenSpec validation; compare production source lock/release descriptor and downstream build/package/Watch/release code to the baseline, review full bidirectional coverage and record failures or unresolved prerequisites rather than substituting fixture success for real acquisition evidence.
