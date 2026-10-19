# Prepare a distribution candidate

After the preparation workflow is integrated on main, a maintainer starts **Updates** through GitHub Actions, selects `main`, and supplies:

| Field | Value |
| --- | --- |
| `sqlite_version` | Exact official SQLite version, for example `3.54.0` |
| `sqlite_vector_version` | Exact published SQLite-Vector version, for example `1.1.2` |
| `sqlite_comment` | Optional SQLite release-note paragraph |
| `sqlite_vector_comment` | Optional SQLite-Vector release-note paragraph |
| `misc_comment` | Optional miscellaneous release-note paragraph |

Selection does not depend on watch suggestions or intervening releases. There is no channel or distribution-version input. Nonempty comments are trimmed at their edges and joined in SQLite → SQLite-Vector → miscellaneous order with one blank line between them; the resulting single release comment is required for a rollback. Comments, including quotes, real newlines and shell metacharacters, remain JSON data. The existing resolver determines source admissibility: stable SQLite full-source releases and published SQLite-Vector stable/prerelease release/tag/commit archives with sufficient official integrity metadata. Development snapshots and unsupported selections fail. An established pin cannot silently acquire a new digest. Selecting the recorded pair preserves its source-lock bytes.

The workflow resolves and validates `inputs/sqlite-vector.sources.lock.json`, reconciles the selected upstream notice inputs, then introduces or updates `inputs/release.json` using A-release's existing schema:

```json
{
  "schemaVersion": 2,
  "sqlite": "3.54.0",
  "sqliteVector": "1.1.2",
  "releaseComment": "First distribution",
  "preparation": {
    "runId": 17,
    "url": "https://github.com/at-rama/sqlite-vector-wasm/actions/runs/17"
  }
}
```

Run 17 illustrates the format; the workflow writes its actual repository/run reference. The descriptor contains no reserved package version. Candidate production starts only after the source lock, release descriptor, notice manifest and changed notice texts have been committed together on `candidate/run-<runId>-<attempt>` and the checkout is clean. Canonical checks/tests and A-release's shared nonpublishing qualification inspect the candidate revision and exact archive, including the real-browser matrix. A successful fixture test alone is insufficient.

Before candidate checks, preparation refreshes the two SQLite notices or the Vector Apache notice for the changed upstream in `tools/package/notices/` and their version/origin/digest records in `tools/package/notices.json`. SQLite notices come from the digest-verified full-source archive: `LICENSE.md` and the initial `/* @preserve` license block in `ext/wasm/api/sqlite3-license-version-header.js`, excluding subsequent version/template code. Missing or unsupported SQLite notice sources stop preparation. SQLite-Vector uses the required `LICENSE.md` from its verified commit-addressed archive, bound to the selected published release/tag/commit. Missing required content fails without a different source or license fallback. Its raw Apache text must satisfy the existing package provenance checks; unsupported normalization fails. Preparation validates the pinned FP16 license record and Git blob identities of the incorporated headers against the selected archive; dependency drift stops rather than adopting a new FP16 revision. Unused sqlite-vec records remain unchanged.

Preparation preserves wording and embedded runtime notices. Recorded text removes trailing horizontal whitespace and blank EOF lines and ends with one newline; refreshed records identify the raw source digest, extraction/normalization and shipped digest. Package/release checks still require exact version associations and byte hashes and never download notices. Unchanged groups, including Emscripten/toolchain notices, retain their recorded bytes/metadata. Same-pair reconstruction validates existing notices without new notice acquisition; absent historical raw digests or immutable origins are reported as not established rather than invented.

Notice acquisitions stay under `.work/updates/run-*/notice-inputs/`, separately from the fresh production workspace. `notices.json` in the run directory distinguishes refreshed source proof from retained-record validation; `notices.log` records the helper execution. Reconciliation failure stops before candidate commit, repository checks, qualification and remote writes. Available expected identities and diagnostics are retained even when failed acquisition removes its temporary sources. A successful reconciliation alone does not qualify a candidate.

The actual Git/npm state determines the forecast. A stable first candidate forecasts `0.1.0` on `latest`; later experimental inputs use the shared `next` policy. Initial experimental publication remains prohibited. Unavailable or inconsistent history and identity collisions stop preparation. If state changes between preflight and qualification, `candidate.json` retains both observations and sets `forecastChanged`; the qualified forecast is shown in the PR. No identity is reserved.

The run retains `updates-<runId>-<attempt>` for 30 days, including hidden files from `.work/updates/`, `.work/acceptance/` and `.work/release/`. Download it from the linked run. `candidate.json` records invocation, base/candidate commits, performed controls, state observations, forecast, archive digest and branch/PR outcomes. Resolver traces, repository/test logs and the existing acceptance bundle link source origins/digests, toolchain, build options, hosting/browser results and `payload.tgz`. Preparation's `publication.json` records qualification provenance; it does not establish a published distribution. All generated files remain ignored and outside candidate commits.

Failed runs retain available evidence. An operation marked failed is unsuccessful; absent later operations did not execute. Qualification failure creates no candidate PR. A push or PR transport failure can leave a remote branch: inspect it rather than treating the run as complete. An empty expected-ref lease enforces atomic branch creation and refuses every existing ref, including races; it never authorizes replacing a candidate. There is no destructive cleanup or alternate-identity retry. A new run or attempt receives its own branch and preserves earlier candidates.

Enable **Allow GitHub Actions to create and approve pull requests** in repository Actions settings and grant the native job token `contents: write` and `pull-requests: write`. Checkout credentials are not persisted; push authorization is scoped to process environment and excluded from retained diagnostics. No permanent token, npm credential or publishing OIDC permission is used. If repository policy rejects the native token, preparation reports failure without a credential fallback.

GitHub documents [native token behavior](https://docs.github.com/en/actions/concepts/security/github_token): PR workflows opened or updated by the native token can await human approval. Approve pending workflow runs, inspect their results, review the candidate head/descriptor, then decide whether to merge. The implementation's read-only PR rehearsal does not demonstrate live PR-creation permissions. Its real production path uses the recorded pair and creates neither remote branches nor PRs.

Preparation stops at the PR. It cannot merge, enable auto-merge, create release tags or publish GitHub/npm distributions. Edits or rebases invalidate the earlier evidence's applicability to the new revision. Human integration triggers [A-release](publication.md), which recalculates and qualifies the definitive main revision and exact payload. Follow [First npm publication](bootstrap.md) to establish initial access before candidate integration and complete the exact-archive npm handoff afterward.

The fixed product is SQLite-Vector. Legacy sqlite-vec fields, mixed inputs and engine selectors are rejected. The handoff supplies exact Vector/run/commit/PR identities; Watch's still-unadapted candidate consumer is separate work and must not be treated as already interoperable. Manual preparation remains independent of that consumer and its discovery baseline.

Published alpha/beta/rc inputs are conditionally admissible with exact official non-draft release/tag/source binding. As observed on 2026-10-19, no such Vector prerelease was published in the inspected official releases or npm versions; branch headers, artifacts and aliases do not establish a release. Synthetic prerelease tests demonstrate classification, not an actual alpha build. The product retains `latest`/`next` and its own alpha series. First transition from the historical 0.x sqlite-vec product consumes A-release's MINOR rule; incomparable engine version numbers are never ordered. Only an older comparable component requires a rollback comment.

`sh tools/updates.sh rehearsal` runs for a same-repository PR with the recorded Vector pair and actual hosted run/attempt. The implementation-Change guard selects this rehearsal in CI. It needs a clean dedicated checkout, fresh production/tool state and the documented browser prerequisites. It allows a local temporary branch/commit, never a remote adapter or publisher. Local verification may invoke the same preparation function with an explicitly recorded historical publication-state fixture; that proves production and qualification with fixture policy state, not live GitHub authorization. Evidence must retain all nine production stages, 22 browser cases and the exact archive. Service injection separately tests remote ordering, collisions and partial failures. The tooling PR itself does not adopt the rehearsal descriptor, source pins or notice outputs.
