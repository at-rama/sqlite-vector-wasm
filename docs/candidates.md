# Prepare a distribution candidate

After the preparation workflow is integrated on main, a maintainer starts **Updates** through GitHub Actions, selects `main`, and supplies:

| Field | Value |
| --- | --- |
| `sqlite_version` | Exact official SQLite version, for example `3.53.4` |
| `sqlite_vec_version` | Exact published sqlite-vec version, for example `0.1.9` |
| `release_comment` | Free text; nonempty for a rollback |

Selection does not depend on watch suggestions or intervening releases. There is no channel or distribution-version input. Comments, including quotes and shell metacharacters, remain JSON data. The existing resolver determines source admissibility: stable SQLite full-source releases and published sqlite-vec stable/prerelease amalgamations with sufficient official integrity metadata. Development snapshots and unsupported selections fail. An established pin cannot silently acquire a new digest. Selecting the recorded pair preserves its source-lock bytes.

The workflow resolves and validates `inputs/sources.lock.json`, then introduces or updates `inputs/release.json` using A-release's existing schema:

```json
{
  "schemaVersion": 1,
  "sqlite": "3.53.4",
  "sqliteVec": "0.1.9",
  "releaseComment": "First distribution",
  "preparation": {
    "runId": 17,
    "url": "https://github.com/at-rama/sqlite-vector-wasm/actions/runs/17"
  }
}
```

Run 17 illustrates the format; the workflow writes its actual repository/run reference. The descriptor contains no reserved package version. Candidate production starts only after these records have been committed on `candidate/run-<runId>-<attempt>` and the checkout is clean. Canonical checks/tests and A-release's shared nonpublishing qualification inspect the candidate revision and exact archive, including the real-browser matrix. A successful fixture test alone is insufficient.

The actual Git/npm state determines the forecast. A stable first candidate forecasts `0.1.0` on `latest`; later experimental inputs use the shared `next` policy. Initial experimental publication remains prohibited. Unavailable or inconsistent history and identity collisions stop preparation. If state changes between preflight and qualification, `candidate.json` retains both observations and sets `forecastChanged`; the qualified forecast is shown in the PR. No identity is reserved.

The run retains `updates-<runId>-<attempt>` for 30 days, including hidden files from `.work/updates/`, `.work/acceptance/` and `.work/release/`. Download it from the linked run. `candidate.json` records invocation, base/candidate commits, performed controls, state observations, forecast, archive digest and branch/PR outcomes. Resolver traces, repository/test logs and the existing acceptance bundle link source origins/digests, toolchain, build options, hosting/browser results and `payload.tgz`. Preparation's `publication.json` records qualification provenance; it does not establish a published distribution. All generated files remain ignored and outside candidate commits.

Failed runs retain available evidence. An operation marked failed is unsuccessful; absent later operations did not execute. Qualification failure creates no candidate PR. A push or PR transport failure can leave a remote branch: inspect it rather than treating the run as complete. An empty expected-ref lease enforces atomic branch creation and refuses every existing ref, including races; it never authorizes replacing a candidate. There is no destructive cleanup or alternate-identity retry. A new run or attempt receives its own branch and preserves earlier candidates.

Enable **Allow GitHub Actions to create and approve pull requests** in repository Actions settings and grant the native job token `contents: write` and `pull-requests: write`. Checkout credentials are not persisted; push authorization is scoped to process environment and excluded from retained diagnostics. No permanent token, npm credential or publishing OIDC permission is used. If repository policy rejects the native token, preparation reports failure without a credential fallback.

GitHub documents [native token behavior](https://docs.github.com/en/actions/concepts/security/github_token): PR workflows opened or updated by the native token can await human approval. Approve pending workflow runs, inspect their results, review the candidate head/descriptor, then decide whether to merge. The implementation's read-only PR rehearsal does not demonstrate live PR-creation permissions. Its real production path uses the recorded pair and creates neither remote branches nor PRs.

Preparation stops at the PR. It cannot merge, enable auto-merge, create release tags or publish GitHub/npm distributions. Edits or rebases invalidate the earlier evidence's applicability to the new revision. Human integration triggers [A-release](publication.md), which recalculates and qualifies the definitive main revision and exact payload. First npm publication and trusted-publishing access remain A-bootstrap operations.
