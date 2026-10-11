# Design

## Context

See [proposal](proposal.md) for the selected identity and its authority. At the examined main revision, `calculate` in `tools/release/policy.mjs` returns an unscoped name; `npmState` and `publicationIdentity` in `tools/release/state.mjs` independently hardcode it. Qualification passes the calculated name through A-acceptance to A-package, then checks package metadata, accepted bytes and provenance. Ordinary npm verification and `checkInitialCompletion` share `npmState`; the latter also calls `publicationIdentity`.

`tools/package/package.mjs` already validates scoped names and constructs metadata from the supplied name. Its existing test “scoped package and SemVer build metadata survive real npm packing” covers that generic support. `tools/updates/run.mjs` imports the common calculation and qualification path. These are inspected capabilities, not evidence that the selected scoped distribution has been qualified. The [existing A-release contract](../../specs/distribution-release/spec.md), with the [identity delta](specs/distribution-release/spec.md), constrains the complete behavior.

## Goals / Non-Goals

**Goals:** supply one canonical npm name throughout A-release and its existing consumers, reject different package identities, and demonstrate that the exact scoped archive follows the retained qualification and completion paths.

**Non-Goals:** registry/account configuration, an actual publication or candidate dispatch, a generic publication-name option, compatibility aliases, another version domain, runtime changes, or edits to other units' implementation contracts. Consumer checks exercise existing interfaces; they do not transfer responsibility to A-release.

## Decisions

### One release-owned npm identity

Export the canonical npm package name from the existing release policy module and reuse it in state/provenance checks. Keep it fixed to `@at-rama/sqlite-vector-wasm`; existing consumers already import release policy. This resolves the observed duplicated literals without adding a configuration surface or separate identity framework. A caller-selected name would permit competing histories and is unnecessary for this single distribution. Product/repository identifiers retain their existing roles.

### Read the scoped namespace explicitly

Build the npm registry request with the scope separator encoded as `%2f`, for example `https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm`. Validate top-level and version metadata names with the canonical npm name. Preserve the recognized-404 branch, non-200 rejection, complete-history reading, channel references and exact archive checks. Download URLs remain those supplied by validated version metadata; no scoped tarball filename convention is assumed. A scope is part of npm identity, not part of SemVer or the Git repository path.

### Propagate through existing qualification and publication

Keep calculation → qualification → metadata → provenance → publication on the existing path. Adapt canonical release fixtures to the selected name and explicitly verify initial and subsequent stable/experimental calculations, candidate consumption, ordinary npm verification and read-only initial completion. Keep npm publishing the exact supplied archive with existing public-access, channel, authentication and provenance arguments. No repack or relabel step is added. Preserve GitHub Release product display names and repository/workflow authentication binding.

The fifteen untouched A-release requirements, including every scenario, are retained by reference and mapped in [coverage](coverage.md). Regression controls cover the complete policy/state/publication boundary, with renewed real production/browser qualification of the scoped package. Historical unscoped qualification records cannot establish applicability to its changed metadata or archive digest.

### Align current consumer guidance selectively

Update current product npm links and canonical name examples in README and publication/packaging/acceptance documentation. Preserve internal harness names, user-agent strings, temporary paths, generic fixture names and repository URLs. A global text replacement would conflate these roles. Do not rewrite archived Changes, historical evidence, Captures or Allocation solely to change a concrete npm selection that does not contradict their product/version obligations.

## Risks / Trade-offs

- A malformed scoped endpoint could fabricate an absent history → assert the exact requested URL in tests and distinguish recognized absence from inaccessible/malformed state.
- Mixed names could pass through weak fixtures → independently supply canonical and wrong-name metadata/provenance, including matching version/digest with another scope, and assert failure before side effects or completion.
- A shared constant in every test could conceal a wrong literal → retain explicit expected `@at-rama/sqlite-vector-wasm` assertions at public boundaries.
- Earlier archive evidence could be reused despite changed package metadata → renew the nonpublishing qualification exercise and inspect the scoped name, commit and digest in the retained tarball/handoffs.
- External access remains unproven → this Change verifies tooling; account permissions, trusted-publisher setup and actual first npm publication remain A-bootstrap operations.

## Migration Plan

The user reports that no corresponding npm package exists. Make the correction before the first publication; no old-package migration, dual publication or compatibility package is planned. If actual published state or an incompatible authoritative decision is discovered, stop and escalate rather than discarding history or extending this scope.

After Apply, distinct 42P Verification and Archive precede human integration. The bootstrap proposal then consumes the integrated scoped handoff. A code revert before publication creates no registry migration; after publication, any corrective distribution must follow the existing advancing-version and no-overwrite rules. No registry rollback or deletion is authorized here.
