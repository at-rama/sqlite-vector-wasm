# Browser distribution assembly

For complete browser and restart-persistence checks on the resulting archive,
see [final-package acceptance](acceptance.md).

Use the [canonical build prerequisites and commands](build.md) first. Keep
its handoff and input/build directories until assembly has consumed them.
Packaging uses the same qualified SDK Node/npm; Python 3 checks tarball
contents. No product runtime or compiler is installed for consumers.

From the repository root, with an explicit nonpublished fixture identity:

```sh
export HARNESS_STATE=/tmp/sqlite-vector-wasm-tools
bash tools/package.sh --build-handoff /tmp/sqlite-vector-wasm-build.json \
  --name sqlite-vector-wasm-packaging-fixture --version 0.0.0-test \
  > /tmp/sqlite-vector-wasm-package.json
```

The entry point verifies the source lock, build configuration identities,
complete eleven-file inventory and each size/SHA-256. It copies those exact
bytes into a fresh `.work/package/run-*/assembly/`, adds selected recorded notices and composition-specific/common documents,
metadata inputs and the runtime manifest, and runs pinned
`npm pack --ignore-scripts --json`. It then checks the actual archive contents
and hashes and extracts an independent copy. Progress/diagnostics go to stderr;
stdout is success JSON matching the invocation's atomic `handoff.json`.

One npm-compatible `.tgz` is suitable for both npm and GitHub Release channels.
Packaging does not select a release name/version policy, tag or publish it.
The explicit name/version supplied by the caller are carried into metadata;
the fixture identity above is never published by these commands. For the product,
use `--name @at-rama/sqlite-vector-wasm` and an independently selected SemVer according to
the [release-version policy](publication.md). For the SQLite-Vector product documentation, the selected target is `0.3.0`; this guide does not itself select or publish a release. `package.json` holds that product identity;
`runtime.json` preserves exact `inputs.sqlite` and selected engine versions
and digests (`inputs.sqliteVec` or `inputs.sqliteVector`). These identify upstream
components, not the project version. Packaging performs no registry publication.

The result identifies the archive path/size/SHA-256, every shipped file, runtime
paths/hashes, source identities and actual build environment/options. These
identities are content/integrity results, not full product acceptance. A later
publisher must use the exact accepted artifact; a repack requires evidence
applicable to its resulting bytes.

For static use, extract the archive into a new directory and serve its
`package/` contents, keeping all runtime files together. For a local npm
consumption check, install the archive path from the handoff into a disposable
consumer directory with `npm install --offline --ignore-scripts --no-audit
--no-fund --package-lock=false ARCHIVE_PATH`. No runtime dependency or
install-time compilation is required. The package exposes explicit filename
subpaths; it has no root wrapper and does not support Node.js execution.

Run the scoped packaging/browser check on the final archive:

```sh
bash tools/harness.sh deps
bash tools/harness.sh exec node tools/package/check.mjs \
  /tmp/sqlite-vector-wasm-package.json
```

This checks local npm consumption, extracts the actual tarball again, hosts it
at a non-root URL prefix, and exercises all retained main-thread/Worker loaders,
Worker1/promisers and applicable OPFS companion resolution. Missing WASM,
Worker/proxy and corrupt assets must prevent the affected capability from
initializing; unsupported persistent-VFS requests must not silently fall back.
The report records archive/runtime identity, browser version, hosting conditions
and scoped results. It does not establish the full Hamming, restart-persistence
or hosted production CI acceptance gates.

The package checker uses browser test infrastructure, not a consumer server.
See the [SQLite-Vector guide](sqlite-vector/usage.md) for product-facing browser examples
and the [build storage conditions](build.md#browser-storage-conditions) for
VFS-specific prerequisites. All generated material stays ignored. After assembly,
the caller can remove the exact original build/input invocation directories;
after downstream checks/publication, it can remove the exact package/check
workspaces. Failed invocations retain diagnostics and emit no successful handoff.

Offline tests and source review:

```sh
sh tools/test-repository.sh
sh tools/check-repository.sh
```

The packaging suite uses existing Node, npm and Python with synthetic handoffs
and local tarball fixtures, without SDK downloads or dependency installation. It does not replace real-archive browser checks. Notice texts and
their source/version/digest associations are recorded in `tools/package/`;
changing upstream or toolchain identities requires reviewed notice reconciliation.

Recorded notice inputs may remove trailing horizontal whitespace and blank
EOF lines to meet repository checks; `notices.json` records each such
normalization and the shipped digest. License wording and embedded runtime
notices remain preserved.

## Recorded engine selection

The CLI remains `bash tools/package.sh --build-handoff PATH --name NAME --version VERSION`.
The successful A-build handoff supplies the selected recorded lock and exact engine
identity. Both retained compositions use SQLite 3.54.0 and Emscripten 4.0.23;
source versions, origins, digests and actual template/bridge/Make input identities
must agree. Annotated handoffs also have their configure, compile and link command
shapes checked. Legacy unannotated handoffs retain only the exact default vec
interpretation; they cannot represent Vector. All eleven runtime assets retain
regular-file, size and SHA-256 checks. Nothing is acquired or rebuilt by packaging.

`runtime.json` retains compact `inputs.sqlite` and `inputs.sqliteVec` objects for
default consumers. Vector instead has `inputs.sqliteVector`. Additive `engine`,
`sourceLockPath` and `sourceOrigins` describe the concrete composition. Source/build
paths in every recorded command become symbolic `<sqlite-source>`,
`<sqliteVec-source>`, `<sqliteVector-source>` or `<build>` paths. Flags, argument
order, filenames and integration hashes remain. The success handoff retains actual
commands and a digest of the consumed build handoff; the complete `files` inventory
identifies notices, documentation and metadata as well as runtime bytes.

## Documentation sources

Package documents are copied byte for byte from this explicit map:

| Source | Archive |
| --- | --- |
| `docs/sqlite-vec/README.md` or `docs/sqlite-vector/README.md` | `README.md` |
| Matching engine directory's `usage.md` | `docs/usage.md` |
| `docs/common/browser.md` | `docs/browser.md` |

Every package description and selected guide follows the handoff. There are no
prose overlays or generated examples. Required sources must be regular files;
wrong-engine headings and broken repository/source/archive links fail checks.
Shared browser instructions have one source. Absolute repository links retain
their meaning after relocation; checks resolve this repository's `blob/main` links
against the candidate source tree, without requiring an unpublished branch to be
available on main. External upstream links are authored references, not a promise
of network availability during offline assembly.

Root `README.md` and `docs/usage.md` are the Site presentation and usage sources for the SQLite-Vector `0.3.0` target;
its local fixture evidence must not be described as a registry release.

## Selected notices and FP16 provenance

`tools/package/notices.json` records common and engine-specific texts. Archives
include common notices plus exactly the selected engine's notices; Vector also
includes FP16 MIT. Project Apache-2.0 does not replace upstream terms or embedded
runtime notices. `licenses/origins.json` contains only selected records and hashes.
Ordinary packaging reads controlled local inputs and never downloads notices.

All three incorporated Vector 1.1.2 FP16 headers exactly match Git blobs at
[FP16 revision 98b0a46](https://github.com/Maratyszcza/FP16/tree/98b0a46bce017382a6351a19577ec43a715b6835/include/fp16).
Their Git blob identities are recorded alongside the unmodified MIT
[license at that revision](https://github.com/Maratyszcza/FP16/blob/98b0a46bce017382a6351a19577ec43a715b6835/LICENSE).
Vector's separate Apache-2.0 text is pinned to its recorded source commit.
Missing dependency provenance or changed texts fail assembly. The existing
`noticeInputs({inputs: lock}, repository)` default convention remains usable;
Vector notice refresh is performed during candidate preparation.

## Final archive checks and reuse

Run `HARNESS_STATE=PATH bash tools/harness.sh exec node tools/package/check.mjs HANDOFF`
in the pinned environment. This checker extracts the final archive again,
installs it locally with npm offline and scripts disabled, and serves only the
extracted companions at `/runtime/`. Conventional, ESM and bundler modes exercise
C/OO1, direct Workers, Worker1 and promiser. Both engines use native deterministic
queries and exact versions; the other engine must be absent. BigInt, FTS5, kvvfs,
Worker OPFS, opfs-wl and SAH pool checks retain their browser prerequisites.
Missing/corrupt WASM, missing Worker and missing proxy must make the targeted
capability unavailable. Checks preserve the archive and all extracted file hashes.
These are packaging checks, not complete Hamming, restart or production acceptance.
The acceptance workflow selects the explicit Vector source lock for Vector release candidates.

A changed supplied package name/version means a fresh assembly, archive and renewed
downstream checks. Never relabel qualified bytes or transfer an acceptance result
to another digest. Keep original sources/builds unavailable when checking the
relocated package, and retain raw logs and artifacts only in ignored/external work
storage. Remove temporary work only after recording identities and results; later
reproduction must rebuild rather than depend on those files.


## Retained-payload validation

First assembly uses `validateBuild` and checks actual generated bridge/Make bytes
before consuming the runtime. After assembly, `validatePackagedBuild` checks the
same selected lock, exact origins, tools, recipe/template identities, reconstructed
integration hashes and runtime bytes without reopening cleaned-up build paths.
Its caller must first verify the raw handoff against `buildHandoffSha256` and the
archive against its accepted identity. The publication consumer now performs this
binding, reads selected document sources through the same explicit map, compares
their exact bytes and reconstructs the complete expected inventory, including the
common guide. Changed/missing documents, metadata, notices or provenance still fail.
Numbering, channel policy, triggers and publication adapters are unchanged.

Vector consumer documents are rendered from their selected authored sources and the supplied package/build identity. The package handoff records each source path/hash and final document hash, with the rendered identity/composition. Local fixture packages remain explicitly unpublished; preparing a production archive does not assert registry availability. A different supplied version produces new document/archive bytes and requires applicable renewed checks. The release consumer recomputes this rendering and provenance from the selected source revision.
