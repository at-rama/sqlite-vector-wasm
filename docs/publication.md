# Distribution calculation and publication

The release tooling supplies one deterministic policy to future watch/candidate callers and consumes qualified integrated candidates. It does not implement watch, candidate preparation or account setup. Implementing or merging the tooling itself does not publish a distribution; a merged candidate must introduce/update its validated descriptor. Release state and generated evidence remain under ignored `.work/` or CI/Release assets.

## Shared calculation

Import `calculate` from [policy](../tools/release/policy.mjs) or invoke `sh tools/release.sh calculate INPUT.json`. Input contains exactly `selection: {sqlite, sqliteVec}`, `snapshot`, and optional `comment`. The snapshot has `schemaVersion: 1`, `tags` and `releaseTags` containing `dist/v...`, all `npmVersions`, and `heads: {latest, next}`; an absent HEAD is `null`, otherwise `{version, commit, upstreams: {sqlite, sqliteVec}}`. HEADs must identify matching published npm/tag/Release identities. State readers acquire complete paginated GitHub tags/releases, npm metadata and exact HEAD provenance/archives; errors are not empty history. Read access needs a GitHub token for authenticated API state; public npm metadata uses HTTPS without npm credentials.

Output contains name/version/tag/channel, signal, required numerical base, initial/rollback flags and stable/channel reference versions. Same input/state gives the same result; there is no caller channel/version override, AI, reservation, lock or second code version. Watch/preparation should use this entry point with the same state reader, not maintain another policy. They retain their own eligibility/initiation responsibilities.

Two stable upstreams select `latest`; any prerelease selects `next`. Numerical changes ignore suffixes, using maximum MAJOR/MINOR/PATCH with default PATCH and a MAJOR-to-MINOR cap while sqlite-vec is `0.x`. Experimental required bases use current `latest` and selected numerical changes relative to its stable composition. An open series continues if that required base is less than or equal to its base; otherwise the required higher base starts at `alpha.1`. A stable publication reaching the alpha base closes it. Rollback detection retains the target channel reference and requires a comment. Tags/npm/Release collisions fail, including partial attempts. The selected initial effective publication is stable `0.1.0` with two stable upstreams; prerelease fixtures authorize no initial experimental release.

## Candidate handoff and integrated revision

Future A-updates candidates introduce or update `inputs/release.json`:

```json
{
  "schemaVersion": 1,
  "sqlite": "3.53.4",
  "sqliteVec": "0.1.9",
  "releaseComment": "",
  "preparation": {
    "runId": 17,
    "url": "https://github.com/at-rama/sqlite-vector-wasm/actions/runs/17"
  }
}
```

This schema example is not an executed preparation run. Versions must match the integrated `inputs/sources.lock.json`; preparation run identity and repository must agree. It records invocation context, not forecast reservations or duplicated digests. Retained descriptors in unrelated PRs do not authorize publication. The closed-PR event is confirmed against the API, including human merge into this repository's `main`, complete changed-file listing and exact merge commit. All strings remain structured data, including release comments.

`prepare` requires that event context, checks the exact clean resulting checkout and repository controls, computes the final identity, and calls the existing complete production/browser acceptance path. Preflight independently inspects the retained tarball, current metadata/notices, runtime inventory/digests and acceptance applicability. Publication refreshes state immediately before any tag, rechecks the handoff and attestation subject/source, and fails on changed identity without relabeling or repacking. No PR-head evidence is sufficient by itself.

## Nonpublishing qualification and retained evidence

Prerequisites are the [clean acceptance prerequisites](acceptance.md), system Node.js and Git. From a clean checkout with empty production/tool state:

```sh
sh tools/release.sh exercise
```

This exercises the recorded stable pair with explicit `sqlite-vector-wasm@0.1.0` and an explicitly empty publication-state fixture. It runs real production/browser qualification and release preflight, but instantiates no publisher and performs no tag, GitHub Release or npm mutation. Its snapshot is not live registry evidence. `.github/workflows/release.yml` runs it on opened/reopened/updated PRs at the exact PR head commit with read-only permissions. Qualification/bundle/provenance artifacts are retained for 30 days; download them before expiry if durable execution evidence is needed. The accepted bundle includes `acceptance.json`, package/build handoffs, browser evidence, logs and `payload.tgz`; `.work/release/` contains publication provenance, handoff and operation outcomes. Local generated evidence is temporary. Fixtures in the offline test suite are synthetic controls, not qualified runtimes.

## Hosted publication and setup boundary

The workflow separates read-only qualification from the publishing job. Publishing consumes the qualified artifact from the same run, reconstructs no runtime, and uses the qualified harness Node.js `24.19.0` / npm `11.17.0`. External checkout/upload/download/attestation actions are pinned to full commits in the workflow. GitHub artifact attestations bind the actual archive and source revision and are attached as `attestation.json`; consumers can use GitHub's attestation verification tooling. The local subject/source check is not an independent cryptographic verifier: the pinned action produces the verifiable signature bundle. Material build tools/options and source/output digests are retained in `publication.json`.

A-bootstrap must establish repository variable `RELEASE_SETUP` as `trusted` or, solely for an unavoidable first npm publication, `initial-manual-npm`. This tooling does not configure accounts or that disposition. Missing/authentication-failed state never chooses the exception. GitHub publication requires `contents: write`; attestations require `attestations: write` and `id-token: write`. Normal npm publication requires the npm trusted publisher bound to this repository and `release.yml` on a GitHub-hosted runner; there is no steady-state npm token. npm user/global configuration is explicitly empty, package scripts are disabled, registry/channel are explicit, and provenance is requested. npm's documented minimum is Node.js 22.14.0 / npm 11.5.1; this qualified pair exceeds it. No separate `npm dist-tag` mutation is used.

Steady state creates a non-forced tag, uploads archive/provenance/attestation to a draft Release, publishes the same tarball to npm and finalizes GitHub. Destination metadata and bytes are checked before complete success. Stable presentation stays on `latest`; experimental GitHub Releases are prereleases. Failed operations retain per-operation identifiers/diagnostics and return nonzero; successful public identities are never deleted, overwritten or silently reused. Ordinary reruns still collide; there is no automatic recovery registry or general resume route.

For the bounded initial exception, all supported mandatory qualification and GitHub attestation requirements still apply. Tagging/GitHub publication remain automatic with the exact accepted archive; the result is `npm-pending` (exit 2), not complete success. A-bootstrap performs the unavoidable manual first npm publication from those exact bytes on `latest`. Local manual npm publication does not supply npm's hosted OIDC provenance; the explicit initial fallback is the GitHub signed archive attestation plus complete source/build/acceptance records, never a waiver of supported checks. Subsequent publication requires normal trusted publishing and npm provenance.

After the manual operation, obtain the retained `publication.json` and run:

```sh
sh tools/release.sh check-initial PUBLICATION.json
```

This reads GitHub tag/Release/assets and npm version/channel/archive, compares the accepted identities and bytes, and reports complete success only for matching destinations. Absent npm stays pending; inaccessible/inconsistent evidence is non-success. It performs no publication, overwrite or other mutation and cannot repair an arbitrary partial attempt. Its input must be the selected initial `0.1.0` record. New publication attempts always retain uniqueness checks. Live OIDC/registry publication remains unexercised until an authorized integrated candidate and A-bootstrap setup exist.

Mechanism references: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm provenance](https://docs.npmjs.com/generating-provenance-statements/) and [GitHub attestations](https://github.com/actions/attest/tree/1e69f48acb82d1966a394da916b4c1698aa569d6). Moving documentation cannot revise product obligations.
