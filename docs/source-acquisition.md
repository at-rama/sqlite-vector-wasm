# Source acquisition

Run these commands from the repository root on Linux with Bash, Python 3.9 or newer, curl,
Git, tar and unzip. Source acquisition uses existing system tools; it does not
install or require the WASM SDK, Node.js, npm or browser tooling.

Prepare a SQLite-Vector candidate:

```sh
bash tools/inputs.sh resolve-vector --sqlite-version 3.54.0 --vector-version 1.1.2 --output .work/inputs/vector-candidate.lock.json
```

Ranges, development snapshots, drafts and unpublished releases are rejected without fallback. SQLite uses official numbered full-source releases and SHA3-256 pins; development snapshots and unestablished numbered-prerelease conventions are not admitted.

Omit either version for that upstream's latest stable release, or select an exact
published alpha/beta/rc version. This fixed command uses only
`sqliteai/sqlite-vector`, not the `sqliteai/sqlite-wasm` distribution or native
binary assets. The default baseline is `inputs/sqlite-vector.sources.lock.json`
when present.
`--baseline-lock PATH` overrides it. Component keys distinguish upstream identities;
matching textual versions in different engines never share a pin.

Schema 2 retains the SQLite pin and records `sqliteVector`: exact version,
release URL/id, tag, full commit, commit-addressed codeload archive URL, SHA-256
and official release/tag/commit metadata URLs. The resolver checks the published
non-draft release and dereferences its tag to a verified commit through the official
GitHub API. Candidate preparation downloads and hashes that archive because this
upstream does not publish a source-asset checksum. This is a locally measured
candidate digest, not an upstream checksum, signature or production authorization.
Metadata, observations and the candidate archive remain in a fresh
`.work/inputs/resolve-vector-*` directory. A changed release binding, tag, archive
URL or digest for an established pin fails; no automatic refresh is performed.
A newly prepared candidate is not extracted or adopted by resolution.

Inspect the identities and provenance, then record the reviewed candidate as
`inputs/sqlite-vector.sources.lock.json`. Only this SQLite/SQLite-Vector lock schema is admitted. Omitted selection uses the same recorded Vector lock.

Validate a lock without network access:

```sh
bash tools/inputs.sh validate inputs/sqlite-vector.sources.lock.json
```

After reviewing the lock, record it in the candidate Git snapshot before use:

```sh
git add inputs/sqlite-vector.sources.lock.json
bash tools/inputs.sh acquire --lock inputs/sqlite-vector.sources.lock.json
```

The production command requires the lock bytes to match the Git index, so an
unreviewed candidate under `.work/` cannot authorize source use. Acquisition
never refreshes checksums or changes the lock. Each invocation downloads both
archives into a new ignored `.work/inputs/acquire-*` workspace. Transport retries
are bounded and repeat the same URL, with HTTP failures treated as failures.
There is no source cache or reuse of earlier trees.

The command verifies each archive before extraction, retains executable modes
needed by SQLite and checks its full build/WASM tree. Acquisition inspects all archive paths and copies only unchanged regular `src/` files, the
three `libs/fp16/` headers and root `LICENSE.md` into `sqliteVector/`, preserving
relative layout. It requires the pinned version in `src/sqlite-vector.h`, the
extension C/header pair and distance C/header set. Missing inputs, unsafe paths,
collisions, selected links/special files and linked or non-directory ancestors
fail. Unrelated package-license symlinks are never followed or materialized;
bundled `libs/sqlite3.*`, packages and examples do not enter the source view.
SQLite core, WASM support and JS bindings come from the separately pinned full
SQLite release. No upstream source bytes are patched. Package license/notice
qualification, including FP16 notice provenance, remains downstream. On any
failure it removes only its own partial workspace and returns nonzero without a
pair handoff. Older workspaces remain untouched.

Only complete success emits JSON on stdout and writes `handoff.json` in the new
workspace. `sqlite.sourcePath` and `sqliteVector.sourcePath`
locate the verified sources; the component key identifies the chosen engine; each entry also identifies its exact version, local archive, official archive/release
origins, digest metadata URL and verified digest. The Vector entry additionally
retains release id, tag, commit and tag/commit metadata URLs.
`lockDigest` is the SHA-256 of the exact consumed lock bytes. The caller owns the
successful workspace lifetime and may remove it after use. Temporary paths are
specific to that invocation. A successful handoff establishes source acquisition,
not compatibility of the selected pair, a completed build or product acceptance.
Source admissibility does not select a publication channel: that policy belongs
to `A-release`. A future dispatch supplies exact versions; helper defaults do not
relax that obligation. Construction consumes the exact verified pair, including
published SQLite-Vector prereleases, under the [canonical build checks](build.md).
Acquisition and raw-runtime construction do not establish final-package acceptance
or complete product support for prereleases.

Run the inexpensive offline checks with the existing system Python, Bash and archive
tools. The registered build-orchestration suite additionally requires Node 18 or newer
and a native C compiler; packaging tests also use npm for local packing/installation.
No SDK installation, network or dependency installation is needed:

```sh
sh tools/check-repository.sh
sh tools/test-repository.sh
```

The [technical repository canon](../.42p/standards/software.md) describes the
repository integrity gateway and separate registered test command. Real
clean-checkout acquisition remains a separate check;
the authored offline fixtures do not replace official-archive evidence.
