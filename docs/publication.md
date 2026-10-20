# Distribution calculation and publication

The release tooling supplies one deterministic policy to watch/candidate callers and consumes qualified integrated candidates. It does not implement watch, candidate preparation or account setup. Implementing or merging the tooling itself does not publish a distribution; a merged candidate must introduce/update its validated descriptor. Release state and generated evidence remain under ignored `.work/` or CI/Release assets.

## Shared calculation

The product is sqlite-vector-wasm; its npm package identifier is `@at-rama/sqlite-vector-wasm`. The common calculation supplies this fixed name to package metadata and publication evidence, and state/completion checks read that scoped package. The repository remains `at-rama/sqlite-vector-wasm`; npm uses the distribution SemVer without the `dist/v` tag prefix.

Import `calculate` from [policy](../tools/release/policy.mjs) or invoke `sh tools/release.sh calculate INPUT.json`. Input contains exactly `selection: {sqlite, sqliteVector}`, `snapshot`, and optional `comment`. The snapshot has `schemaVersion: 1`, `tags` and `releaseTags` containing `dist/v...`, all `npmVersions`, and `heads: {latest, next}`; an absent HEAD is `null`, otherwise `{version, commit, upstreams: {sqlite, sqliteVector}}`. HEADs must identify matching published npm/tag/Release identities. State readers acquire complete paginated GitHub tags/releases, npm metadata and exact HEAD provenance/archives; errors are not empty history. Read access needs a GitHub token for authenticated API state; public npm metadata uses HTTPS without npm credentials.

Output contains name/version/tag/channel, signal, required numerical base, initial/rollback flags and stable/channel reference versions. Same input/state gives the same result; there is no caller channel/version override, AI, reservation, lock or second code version. Watch/preparation should use this entry point with the same state reader, not maintain another policy. They retain their own eligibility/initiation responsibilities.

The shared reader recognizes npm's `0.0.0-stage` placeholder only with the exact scoped name, matching entry/version and boolean `stub: true`. It retains that metadata but excludes it from distribution history. A placeholder-only package or a `latest`/`next` reference to it blocks ordinary calculation. Other unsupported versions and inconsistent metadata fail; real publications retain their identity, provenance and exact-byte checks.

Two stable upstreams select `latest`; any prerelease selects `next`. The first Vector transition while stable latest contains sqlite-vec in product 0.x uses MINOR within 0.x (fixture: 0.2.4 → 0.3.0), regardless of the unrelated engine version. After stable Vector adoption, numerical changes ignore suffixes, using maximum MAJOR/MINOR/PATCH with default PATCH and a MAJOR-to-MINOR cap while Vector is `0.x`. Experimental required bases use current `latest` and selected numerical changes relative to its stable composition. An open series continues if that required base is less than or equal to its base; otherwise the required higher base starts at `alpha.1`. A stable publication reaching the alpha base closes it. SQLite rollback compares the target channel HEAD, falling back to latest. Vector compares that HEAD only if it contains Vector, otherwise latest if Vector, otherwise no numerical engine reference. Engine substitution alone is not rollback; comparable regressions require a comment. Vector results expose `transition` and `componentReferences` separately from product numbering. Tags/npm/Release collisions fail, including partial attempts. The selected initial effective publication is stable `0.1.0` with two stable upstreams; prerelease fixtures authorize no initial experimental release.

Historical `{sqlite, sqliteVec}` records remain readable and raw calculation compatibility is retained for existing Watch/Updates callers. It authorizes no new sqlite-vec publication. Historical input support does not authorize a new sqlite-vec publication. Product version history never restarts when changing engine.

## Candidate handoff and integrated revision

Updates candidates introduce or update `inputs/release.json`:

```json
{
  "schemaVersion": 2,
  "sqlite": "3.54.0",
  "sqliteVector": "1.1.2",
  "releaseComment": "",
  "preparation": {
    "runId": 17,
    "url": "https://github.com/at-rama/sqlite-vector-wasm/actions/runs/17"
  }
}
```

This schema example is not an executed preparation run. Only this Vector schema authorizes a new product publication. Versions must match the integrated `inputs/sqlite-vector.sources.lock.json`; preparation run identity and repository must agree with the GitHub API record (id, URL and repository). It records invocation context, not forecast reservations or duplicated digests. Retained descriptors in unrelated PRs do not authorize publication. The closed-PR event is confirmed against the API, including human merge into this repository's `main`, complete changed-file listing and exact merge commit. All strings remain structured data, including release comments.

`prepare` requires that event context, checks the exact clean resulting checkout and repository controls, computes the final identity, and calls the existing complete production/browser acceptance path with that explicit Vector lock and definitive scoped name/version. Returned context, build, package, acceptance, source origins/digests and archive must agree; success for the default sqlite-vec engine is rejected. Preflight independently inspects the retained tarball, current metadata/notices, runtime inventory/digests and acceptance applicability. Publication refreshes state immediately before any tag, rechecks the handoff and attestation subject/source, and fails on changed identity without relabeling or repacking. No PR-head evidence is sufficient by itself.

## Reviewed documentation and final identity

A production candidate must carry the successful original Updates artifact and applicable Site `build`, `deploy` and `observe` results for its exact head. Release verifies the actual producer repository/workflow/event/run attempt, the candidate PR number/head, complete qualification and archive, documentation-source digests, Site's acquired input and browser example, and the identified live preview's rendered source hashes. A repetition without a remote PR is not publication authority. Missing, failed, stale, expired or mismatched evidence stops publication; a shared preview URL or nominal workflow success is insufficient.

The public/package Markdown sources, candidate example selector, content-rendering modules, descriptor and Vector lock must be byte-identical between reviewed PR head and authoritative integration. Substantive merge changes require renewed reviewable preparation. The definitive number can change: final qualification creates and accepts a fresh archive, reruns the native example in main and module Worker, and renews source-relative link/image/fragment validation against the actual integrated files. Identity/status rendering is mechanical; it does not repair substantive instructions after publication. The handoff and `publication.json` retain the reviewed context, final example, link-validation record and exact package-document provenance.

Only `outcome.json` with complete verified GitHub and npm results and a matching documentation-bearing publication supplies stable promotion eligibility. npm visibility pending, bounded initial npm pending and failed/partial outcomes do not. Site consumes that evidence separately. Its read-only completion inspection can recheck a normal publication whose only outstanding result was npm visibility, or retry an already complete publication; failed operations and the initial manual-npm exception are not translated into normal success. It calls only the existing GitHub/npm verification adapters and creates no tag or publication. A deployment failure permits a site retry for the same publication, not a new product tag or republish. Read-only initial completion can confirm its exact archive after the bounded manual npm step without introducing another publication effect.

## Nonpublishing qualification and retained evidence

Prerequisites are the [clean acceptance prerequisites](acceptance.md), system Node.js and Git. From a clean checkout with empty production/tool state:

```sh
sh tools/release.sh exercise
```

This exercises the recorded stable pair with explicit `@at-rama/sqlite-vector-wasm@0.3.0` against a coherent synthetic historical `latest=0.2.4` sqlite-vec publication fixture. It runs real production/browser qualification, release preflight, the final-archive documentation example and source-relative link validation, but instantiates no publisher and performs no tag, GitHub Release or npm mutation. Its snapshot is not live registry evidence. `.github/workflows/release.yml` runs it at the exact PR head with read-only permissions for active implementation checks and relevant unpublished-documentation previews. The latter selection uses actual changed documentation/integration inputs and the declared candidate profile, so it survives later OpenSpec archival. Unrelated edits do not select it; nominal candidate PRs consume their original Updates archive instead of requiring a second producer. It supplies an explicitly unpublished documentation check, never an eligible release PR or publication authority. Qualification/bundle/provenance artifacts are retained for 30 days; download them before expiry if durable execution evidence is needed. The accepted bundle includes `acceptance.json`, package/build handoffs, browser evidence, logs and `payload.tgz`; `.work/release/` contains publication provenance, handoff and operation outcomes. Local generated evidence is temporary. Fixtures in the offline test suite are synthetic controls, not qualified runtimes.

The first-transition Release notes state that SQLite-Vector replaces sqlite-vec and `vec0`/`vec_*` SQL must be adapted. Official SQLite JavaScript APIs remain, but vector SQL is not interchangeable; automatic database migration and existing vector-structure compatibility are not established. Generated notes and free-text comments are bound to the handoff and rechecked before effects. Subsequent Vector releases need no recurring transition narrative. README and Usage document the SQLite-Vector `0.3.0` target.

## Hosted publication and setup boundary

The workflow separates read-only qualification from the publishing job. Publishing consumes the qualified artifact from the same run, reconstructs no runtime, and uses the qualified harness Node.js `24.19.0` / npm `11.17.0`. External checkout/upload/download/attestation actions are pinned to full commits in the workflow. GitHub artifact attestations bind the actual archive and source revision and are attached as `attestation.json`; consumers can use GitHub's attestation verification tooling. The local subject/source check is not an independent cryptographic verifier: the pinned action produces the verifiable signature bundle. Material build tools/options and source/output digests are retained in `publication.json`.

A-bootstrap must establish repository variable `RELEASE_SETUP` as `trusted` or, solely for an unavoidable first npm publication, `initial-manual-npm`. This tooling does not configure accounts or that disposition. Missing/authentication-failed state never chooses the exception. GitHub publication requires `contents: write`; attestations require `attestations: write` and `id-token: write`. Normal npm publication requires the npm trusted publisher bound to this repository and `release.yml` on a GitHub-hosted runner; there is no steady-state npm token. npm user/global configuration is explicitly empty, package scripts are disabled, registry/channel are explicit, and provenance is requested. npm's documented minimum is Node.js 22.14.0 / npm 11.5.1; this qualified pair exceeds it. No separate `npm dist-tag` mutation is used.

Steady state creates a non-forced tag, uploads archive/provenance/attestation to a draft Release, publishes the same tarball to npm and finalizes GitHub. Destination metadata and bytes are checked after successful publishing: matching npm archive, provenance and channel yield `complete`. If npm metadata, the published version, tarball or channel is not yet visible, the workflow records `published-verification-pending`, emits a warning and preserves the outcome without treating an already completed publication as a failed write. Observed archive size/digest mismatches, missing provenance and malformed metadata remain errors. Stable presentation stays on `latest`; experimental GitHub Releases are prereleases. Failed operations retain per-operation identifiers/diagnostics and return nonzero; successful public identities are never deleted, overwritten or silently reused. Ordinary reruns still collide; there is no automatic recovery registry or general resume route.

For the bounded initial exception, all supported mandatory qualification and GitHub attestation requirements still apply. Tagging/GitHub publication remain automatic with the exact accepted archive; the result is `npm-pending` (exit 2), not complete success. A-bootstrap performs the unavoidable manual first npm publication from those exact bytes on `latest`. Local manual npm publication does not supply npm's hosted OIDC provenance; the explicit initial fallback is the GitHub signed archive attestation plus complete source/build/acceptance records, never a waiver of supported checks. Subsequent publication requires normal trusted publishing and npm provenance.

After the manual operation, obtain the retained `publication.json` and run:

```sh
sh tools/release.sh check-initial PUBLICATION.json
```

This reads GitHub tag/Release/assets and npm version/channel/archive, compares the accepted identities and bytes, and reports complete success only for matching destinations. Absent npm stays pending; inaccessible/inconsistent evidence is non-success. It performs no publication, overwrite or other mutation and cannot repair an arbitrary partial attempt. Its input must be the selected initial `0.1.0` record. New publication attempts always retain uniqueness checks. Live OIDC/registry publication remains unexercised until an authorized integrated candidate and A-bootstrap setup exist.

A recognized placeholder can coexist with the real initial distribution. Completion remains pending until `0.1.0` exists, then requires that real version on `latest` and matching destination evidence and archive bytes. The placeholder itself supplies no completion evidence.

Mechanism references: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm provenance](https://docs.npmjs.com/generating-provenance-statements/) and [GitHub attestations](https://github.com/actions/attest/tree/1e69f48acb82d1966a394da916b4c1698aa569d6). Moving documentation cannot revise product obligations.

Candidate selection and preparation are documented in [Prepare a distribution candidate](candidates.md). Follow [First npm publication](bootstrap.md) for initial access, the accepted-archive handoff, completion checking and trusted-publisher setup.

## Closed publication incident: 0.1.1 (2026-10-12)

[Candidate PR #41](https://github.com/at-rama/sqlite-vector-wasm/pull/41) qualified `0.1.1`; an npm configuration collision interrupted the first publication attempt. [PR #42](https://github.com/at-rama/sqlite-vector-wasm/pull/42) corrected npm configuration and added a one-off recovery. The [recovery run](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38213437946) published npm and finalized the GitHub Release but reported failure when its immediate registry read still showed `latest` as `0.1.0`. The maintainer subsequently confirmed that npm `latest` resolves to `0.1.1` and closed the incident. The one-off recovery command and workflow dispatch are removed.

For a future `published-verification-pending` outcome, inspect the retained `outcome.json` and check `npm view @at-rama/sqlite-vector-wasm@VERSION dist.integrity` and `npm dist-tag ls @at-rama/sqlite-vector-wasm` later. Visibility lag does not authorize retry, re-tagging or republishing. If archive bytes or provenance are inconsistent, escalate rather than treating the discrepancy as lag.
