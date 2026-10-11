# Design

## Context

See [proposal](proposal.md) for the observed incident, source snapshot and A-release ownership. At examined main `ef202b77e120332703ebeba67501ea91bfab667e`, `npmState` in `tools/release/state.mjs` validates every registry version through `distribution`. `readState` places every entry key into `snapshot.npmVersions`; A-updates imports it for preparation. `checkInitialCompletion` and `githubServices.verifyNpm` also use `npmState`, so repairing only the CLI completion command would leave normal consumers blocked.

The [current distribution-release spec](../../specs/distribution-release/spec.md) retains the entire A-release contract. The [delta](specs/distribution-release/spec.md) refines state interpretation only. A design document is warranted because skipping registry entries can otherwise conceal identity or publication-state contradictions.

Official [npm staged-publishing documentation](https://docs.npmjs.com/staged-publishing/), inspected 2026-10-11, describes the publicly available `0.0.0-stage` placeholder when staging a new package. Live registry inspection also observed `stub: true` on that entry. Documentation explains an external mechanism; it does not authorize a new staged-publication lifecycle. The maintainer invoked ordinary `npm publish`, not an explicitly recorded `npm stage publish`; this Change does not infer the exact internal registry transition from the resulting placeholder.

## Goals / Non-Goals

**Goals:** classify the exact registry placeholder once at the shared state boundary, preserve inspectable raw state, and restore established completion/preparation/verification behavior when real publications are coherent.

**Non-Goals:** adopt staged publishing, relax distribution SemVer, skip arbitrary versions, delete or deprecate the placeholder, mutate channel tags, republish the first archive, introduce a recovery workflow, change trusted-publisher setup, or implement A-bootstrap/A-watch/A-updates responsibilities.

## Decisions

### Validate identity before classifying an entry

Retain the existing top-level package/structure checks. Validate each entry's metadata object, exact scoped name and embedded version against its key before recognizing a placeholder. The sole recognition tuple is key/version `0.0.0-stage` and `stub === true`. Retain expected archive metadata structure; do not match on description text, timestamps, maintainers or a particular archive digest. Reject inconsistent markers, including `stub: true` on a real distribution. All non-placeholder entries still pass the existing distribution validator and archive-metadata checks.

A name-only exception could accept a genuine unsupported publication; a truthy-marker exception could discard arbitrary entries. Widening `distribution` would incorrectly add the placeholder to numbering and channel policy. The bounded classifier avoids those alternatives.

### Preserve the registry observation and project distribution state deliberately

Prefer retaining the validated raw metadata returned by `npmState`, with one shared classification predicate used by its state projection. `readState` excludes only the recognized placeholder from `npmVersions`; the original entry remains observable rather than being globally deleted. Exact function shape is an implementation choice, but consumers must not independently invent recognition rules or reinterpret placeholder presence as HTTP 404.

Do not silently drop `latest`/`next` when it targets the placeholder. Ordinary state acquisition reports that reference as unready/inconsistent. A placeholder-only response is also an unready existing package, including if dist-tags are empty; it is not permission to re-enter the initial publishing path. This differs deliberately from `checkInitialCompletion`: that bounded read-only command can report pending when the real `0.1.0` is absent. Once present, its expected `latest`, GitHub evidence and exact bytes are still mandatory. An unrelated `next` reference is not silently rewritten by completion checking; ordinary state acquisition continues to check both channels.

### Keep all downstream publication mechanisms intact

The shared correction must reach `readState`, initial completion and normal `verifyNpm`. Existing calculation, qualification, provenance enforcement and publisher invocation stay unchanged unless an actual required consumer adjustment is demonstrated. Inspect A-updates' import/use and test the supplied state/calculate path rather than implementing a second preparation policy. Normal verification continues to require supported npm provenance; the first manual operation retains its separately documented signed-GitHub fallback.

Tests should construct independent registry fixtures with a recognized placeholder plus stable/experimental releases and matching destination evidence. Exercise false markers, wrong names/embedded versions, arbitrary unsupported versions, placeholder-only state, placeholder channels, absent real initial version, changed bytes/provenance, collision rejection and shared deterministic calculation. Preserve the existing fixtures that reject incomplete/inaccessible state; successful placeholder handling must not weaken them.

## Risks / Trade-offs

- Future npm changes to its placeholder shape → preserve explicit failure and reassess against authoritative documentation; do not generalize the exception preemptively.
- Filtering hides a publication or malformed entry → validate identity/shape first, retain the observation and test rejection cases.
- Placeholder-only state appears empty → distinguish existing unready package from recognized HTTP 404 and test both ordinary state and read-only completion.
- A valid placeholder masks wrong real archive/provenance → renew completion and normal-publication negative tests with the placeholder present.
- A new PR merge inadvertently publishes again → use the existing unrelated-merge guard; this Change introduces no release input or candidate and invokes no publisher.

## Migration Plan

Review the planning artifacts and complete the separate bidirectional derivation check before Apply. Implement/test through a PR, then run post-Apply 42P Verification and Archive before human integration. Preserve Captures, Allocation, package bytes and existing publication identifiers. If the correction fails, leave automation explicitly blocked; reverting repository code must not delete or roll back public npm/GitHub publications.

After authorized integration, use the corrected checkout for read-only `check-initial` on the retained `publication.json` from run `38139932466`, commit `ef202b77e120332703ebeba67501ea91bfab667e`, archive SHA-256 `f730ffe041730f8f98306004e488fe97dd64bf08646c380d1a7a30f033a80ff9`. The command executes from new tool code but checks the existing published revision; it does not relabel the archive to the correction commit. Record actual output/exit status and return the evidence to #33. Repository access alone does not authorize a new npm operation or forced release. A live read-only check may be renewed during Apply from the corrected branch if authorized access is available; post-integration consumption remains separate from planning completion.
