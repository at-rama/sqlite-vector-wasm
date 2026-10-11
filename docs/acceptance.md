# Final-package acceptance

Run the complete command from a clean Git checkout with empty tool, npm, source,
build and package state. Existing `.work/` producer state is rejected, not reused.
Use a new checkout rather than removing another invocation's diagnostics. Install
the [build system prerequisites](build.md) and Node.js 18 or newer for bootstrap
orchestration. Compilation, packaging and browser tests use the harness's pinned
SDK Node/npm and verified Chrome, not the bootstrap runtime.

```sh
bash tools/acceptance.sh
```

The default identity is the nonpublished `sqlite-vector-wasm-acceptance-fixture`
version `0.0.0-test`. A caller preparing an exact release artifact can provide
its already selected name and version without changing the acceptance procedure:

```sh
bash tools/acceptance.sh --name @at-rama/sqlite-vector-wasm --version 0.1.0
```

This command installs and verifies fresh tools, installs locked test dependencies,
runs the harness smoke, acquires/builds the recorded sources, packages the runtime
and tests the actual archive. The unmodified reference build uses the same SQLite
pin, toolchain and retained options. Byte-identical reconstruction is not required.
The command requires HTTPS access to the official tool/source endpoints and npm.
It returns nonzero on any missing prerequisite, altered identity, unavailable VFS,
failed mandatory case or incomplete run. Stdout contains only a successful JSON
handoff; diagnostics go to stderr and retained logs.

## Browser evidence

The suite extracts the final archive separately, serves it under `/runtime/` and
checks all conventional, ESM and supplied bundler-friendly main-thread, Worker,
Worker1 and promiser surfaces. It checks independent C/OO1 versions, BigInt and
baseline API/WASM/SQL/VFS inventory inclusion. Additional vec functionality is
permitted; missing retained capabilities fail. This establishes the selected real
browser and hosting conditions, not universal browser or bundler compatibility.

FTS5 must return identifiers `1,3` for the fixture's `browser` query. Float32
neighbors of `[1,0]` among `[1,0]`, `[0,1]`, `[-1,0]` have independently calculated
Euclidean distances `0`, `sqrt(2)`, `2`; the absolute tolerance is `1e-5` to allow
Float32 distance rounding. Binary bytes `00,01,03,07,0f` queried against `00` have
independently computed XOR/popcount distances `0,1,2,3,4`, asserted exactly with
no ordering ties. Wrong identifiers, distances, ordering and FTS expectations are
checked as negative controls.

Each default `opfs`, `opfs-wl` and `opfs-sahpool` VFS must preserve committed
ordinary, Float32 and bit-vector data after explicit connection closure and
Worker termination. A newly constructed Worker reinitializes SQLite and reopens
the same database at the same origin; its read phase never creates or inserts
fixture data. The live server and browser context remain unchanged across phases.
SAH pools use explicit initialization and a unique directory shared between the
two runtimes. Database/pool paths are recorded. A missing-table control must fail
without fixture repair. Worker termination and final context/browser closure
release temporary storage after results are recorded. This tests orderly runtime
restart, not process-crash durability or whole-browser restart.

The [VFS-specific prerequisites](build.md#browser-storage-conditions) still apply.
The test server supplies loopback secure-context hosting and COOP `same-origin` /
COEP `require-corp`; actual secure/isolation and storage prerequisites are observed
and recorded. Unavailable OPFS never becomes a skipped pass. Changed upstream
default VFS inventories require reconciliation instead of shrinking the suite.

## Reports and release consumption

Reports, logs and payloads are retained under `.work/acceptance/run-*/`; tool state
uses a separately identified fresh directory under the system temporary directory.
The success handoff identifies its exact report, bundle and archive SHA-256. The
bundle contains `acceptance.json`, `browser.json`, build/package handoffs, logs and
`payload.tgz`, a byte-identical copy of the accepted archive. Failed runs retain
available records with failed/not-executed stages and no successful handoff.
Generated material stays outside Git. Clean up the exact recorded invocation and
tool directories only after downstream use and diagnostic retention are complete.

The `Acceptance` workflow evaluates PR checkouts, authoritative `main` commits
and explicitly selected manual revisions from fresh state. PR checkout identity
may be GitHub's synthetic merge commit; the report records the actual commit/tree
without relabeling it as the PR head. A PR pass is not transferred through merge.
After human merge, `main` acceptance renews the evidence for that authoritative
revision. It never merges, tags, publishes or configures npm.

GitHub retains each uploaded evidence bundle for 30 days. A later A-release
consumer must retrieve the successful run's bundle, verify its actual archive
size/SHA-256, evaluated revision and complete matrix, and publish those exact
bytes with the same supplied package identity. `assertApplicable` in
`tools/acceptance/contracts.mjs` checks report applicability against a supplied
commit and archive identity; consumers must first hash the actual archive. An
absent bundle, changed revision, repack or changed package metadata requires
renewed or demonstrably applicable acceptance evidence. Workflow success without
an available matching archive/report is insufficient. Branch protection and later
candidate/release consumers must enforce the mandatory acceptance outcome; adding
workflow YAML alone does not register a required repository check.

Offline controls run with `sh tools/test-repository.sh`; they test failure
propagation, matrix completeness, independent arithmetic and identity rejection.
They do not replace hosted clean production or real-browser execution. The raw
acceptance report is product evidence, distinct from the subsequent Change-local
42P Verification report and Archive.
