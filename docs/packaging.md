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
bytes into a fresh `.work/package/run-*/assembly/`, adds recorded notices, the root README and `docs/usage.md`,
metadata inputs and the runtime manifest, and runs pinned
`npm pack --ignore-scripts --json`. It then checks the actual archive contents
and hashes and extracts an independent copy. Progress/diagnostics go to stderr;
stdout is success JSON matching the invocation's atomic `handoff.json`.

One npm-compatible `.tgz` is suitable for both npm and GitHub Release channels.
Packaging does not select a release name/version policy, tag or publish it.
The explicit name/version supplied by the caller are carried into metadata;
the fixture identity above is never published by these commands. For the product,
use `--name @at-rama/sqlite-vector-wasm` and an independently selected SemVer according to
the [release-version policy](publication.md). `0.1.0` is an initial example,
not a repository release pin. `package.json` holds that product identity;
`runtime.json` preserves exact `inputs.sqlite` and `inputs.sqliteVec` versions
and digests. The latter key identifies the selected sqlite-vec upstream, not the
product. No release orchestrator or registry publication is implemented here.

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
See the [consumer usage guide](usage.md) for browser examples
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
