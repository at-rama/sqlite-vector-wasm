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
bash tools/acceptance.sh --lock inputs/sqlite-vector.sources.lock.json --name @at-rama/sqlite-vector-wasm --version 0.3.0
```

For a nonpublished test fixture using SQLite-Vector, retain a distinct fixture identity:

```sh
bash tools/acceptance.sh --lock inputs/sqlite-vector.sources.lock.json --name sqlite-vector-wasm-acceptance-fixture --version 0.0.0-test
```

Omitted `--lock` keeps sqlite-vec through `inputs/sources.lock.json`. Only these
two recorded paths are accepted. Selection is distinct from the supplied product
name/version, and does not choose a release version, channel or publication.
Build/package/report identities must all match the selected lock and engine;
an ambiguous, altered or other-engine handoff fails without fallback.

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
baseline API/WASM/SQL/VFS inventory inclusion. Additional selected-engine functionality is
permitted; missing retained capabilities fail. This establishes the selected real
browser and hosting conditions, not universal browser or bundler compatibility.

FTS5 must return identifiers `1,3` for the fixture's `browser` query. Float32
neighbors of `[1,0]` among `[1,0]`, `[0,1]`, `[-1,0]` have independently calculated
Euclidean distances `0`, `sqrt(2)`, `2`; the absolute tolerance is `1e-5` to allow
Float32 distance rounding. Binary bytes `00,01,03,07,0f` queried against `00` have
independently computed XOR/popcount distances `0,1,2,3,4`, asserted exactly with
no ordering ties. Wrong identifiers, distances, ordering and FTS expectations are
checked as negative controls. sqlite-vec uses native vec0 Float32/bit tables;
SQLite-Vector uses ordinary BLOB columns, `vector_init` for FLOAT32/L2 and
BIT/HAMMING, and exact `vector_full_scan`. Binary fixture bytes are stored directly;
quantization, training, preload and approximate search are not prerequisites.
Expectations come from host arithmetic, never from the extension or another engine.
The retained sqlite-vec Worker1/promiser dimension column remains 2, with
other-engine registration count 0 checked separately.

Each default `opfs`, `opfs-wl` and `opfs-sahpool` VFS must preserve committed
ordinary, Float32 and bit-vector data after explicit connection closure and
Worker termination. A newly constructed Worker reinitializes SQLite and reopens
the same database at the same origin; its read phase never creates or inserts
fixture data. SQLite-Vector restores only its native column context with
`vector_init` on the fresh connection; this is distinct from extension registration,
which remains automatic. The read phase enables query-only mode, observes stored
ordinary/vector bytes and schema before/after context setup, and requires equality
with committed state. It never quantizes, rebuilds derived state or repairs a lost
fixture. A separate missing-vector-table control must also fail before context
setup, even if ordinary rows survive. The live server and browser context remain unchanged across phases.
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
bundle records the selected engine, lock path/digest and exact inputs, alongside
the retained version-1 fields. It contains `acceptance.json`, `browser.json`, build/package handoffs, logs and
`payload.tgz`, a byte-identical copy of the accepted archive. Failed runs retain
available records with failed/not-executed stages and no successful handoff.
Generated material stays outside Git. Clean up the exact recorded invocation and
tool directories only after downstream use and diagnostic retention are complete.

The `Acceptance` workflow keeps its required `acceptance` job on every PR and push
to `main`. Applicable automatic runs qualify both recorded compositions in separate
fresh jobs. A counterpart is not cancelled when one fails. The aggregate succeeds
only when every required composition and its evidence upload succeed; failed,
cancelled or unexpectedly skipped work cannot count as success. Each artifact name
includes the run, attempt and concrete engine so results cannot overwrite each other.
For automatic runs, it reports package acceptance as not applicable only when
all changed paths are under `site/`. It compares the PR base to the evaluated
merge checkout, or the before/after revisions of a push, with rename detection
disabled so moves across the boundary count on both sides. Mixed changes, empty
diffs and unavailable comparison revisions run complete acceptance. Site-only
runs perform no package production or browser qualification and upload no
acceptance bundle; the site's own checks remain separate.

Manual runs always execute complete acceptance for the one selected recorded lock,
including for site-only revisions; their default remains sqlite-vec. Existing
metadata-only downstream callers also retain that default. Selection does not run
or publish another composition.
Applicable PR checkouts, authoritative `main` commits and explicitly selected
manual revisions are evaluated from fresh state. PR checkout identity
may be GitHub's synthetic merge commit; the report records the actual commit/tree
without relabeling it as the PR head. A PR pass is not transferred through merge.
When applicable after human merge, `main` acceptance renews the evidence for that
authoritative revision. It never merges, tags, publishes or configures npm.

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
