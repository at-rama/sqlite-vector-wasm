# Design

## Context

See [proposal](proposal.md) for motivation and scope. Current release tooling has the complete tag/attestation/exact-tarball publisher, but policy/context/state require sqliteVec, qualification calls production without a lock, and generated notes label sqlite-vec. Build, package, acceptedPayload and browser acceptance already support the recorded Vector lock. The release workflow's nonpublishing exercise is currently enabled only for earlier Change names and assumes an empty initial-state fixture.

## Goals / Non-Goals

**Goals:** make A-release consume the existing Vector path, actual source identities, human-integrated context and complete final-payload evidence under one shared calculation; preserve historical state and safeguards while realizing the adopted transition and reference policy.

**Non-Goals:** no discovery-baseline selection, Watch enumeration/Updates workflow rewrite, general engine adapter, runtime selector, engine integration replacement, source-lock promotion/rename, source or packaging refresh, site examples/demo rewrite, account setup, production publication, archive rewrite or generic benchmark/test framework. A-site_docs owns public native-SQL guidance; A-release produces its bounded Release notice and handoff.

## Decisions

### 1. Bind identity to existing inputs rather than infer it from numbers

Extend the small release policy/state helpers to distinguish an exact sqlite/sqliteVec historical shape and sqlite/sqliteVector product shape. Validate one engine only, actual upstream identity, exact versions and lock origins/digests against package/evidence. Read legacy publication envelopes unchanged; new Vector provenance adds explicit engine identity consistently with the build/package handoffs. Keep the publication envelope's existing complete fields, version its new shape only if necessary for unambiguous validation, and reject ambiguous/mixed shapes. This is less machinery than migrating old publications or a generic backend registry.

### 2. Keep component references separate from product numbering

Use the adopted channel/latest component-reference rule in one small shared helper used by rollback and exposed to future Watch/Updates consumers. Keep product SemVer HEADs and global collision sets intact even when their engine is historical. While stable latest is the old 0.x product, use its MINOR transition base, including successive experimental preparations until stable adoption; feed it into existing alpha continuation/closure. After stable Vector adoption use ordinary numerical Vector/SQLite deltas. Never compare sqlite-vec's number with Vector or use pins as a published reference. No transition counter/flag, reservations or per-engine history store is needed: actual latest provenance identifies the phase.

Examples are coherent synthetic policy fixtures, not source-availability or live publication observations:

| Published state / selection | Expected policy |
| --- | --- |
| latest 0.2.4 with vec; selected stable Vector | required base 0.3.0 on latest; no engine-only rollback |
| latest 0.2.0 with vec; next 0.4.0-alpha.2; Vector prerelease | required base 0.3.0; existing open series continues 0.4.0-alpha.3 |
| latest Vector; next legacy vec; selected Vector older than latest | Vector rollback uses latest; SQLite still compares with its normal channel HEAD; comment required |
| latest vec; next Vector; selected Vector older than next | next's Vector version remains a real rollback reference |
| engine transition plus older SQLite | comment required for SQLite; transition notice also required; no reset to bootstrap |
| latest Vector 0.3.0; only Vector PATCH | ordinary numerical base 0.3.1, not another forced MINOR |

### 3. Version the integrated candidate handoff, not other producers

Introduce a minimal Vector descriptor schemaVersion 2 in inputs/release.json containing exact sqlite/sqliteVector versions, releaseComment and the existing real preparation run identity. The engine key fixes SQLite-Vector; bind it to the existing recorded inputs/sqlite-vector.sources.lock.json. No arbitrary path, runtime engine selector or channel/version override is added. IntegratedContext must establish human merge, complete changed-descriptor evidence and authoritative merge revision, then reject legacy-only or conflicting publication selections. State/history and bounded historical completion continue to read old records.

Future A-updates emits this descriptor and its existing Vector lock; this Change defines and tests the release consumer contract without rewriting Updates. Legacy low-level calculations/calling shapes may remain technically usable where current callers need them; they are not new product publication contexts or a parallel release promise. Document the still-old Watch/Updates producers as pending their own Changes, not current Vector readiness. Avoid breaking their offline common-library tests unnecessarily; do not change their public workflows as a hidden second unit.

### 4. Qualify the definitive composition explicitly

Pass the integrated recorded Vector lock plus calculated scoped package name/version to the existing production function. Reuse the real native Float32/Hamming, APIs, Worker, FTS5, SQLite-only baseline and every OPFS restart checks; do not make release code reconstruct an acceptance report. Extend the final consumer binding so integrated selection, lock bytes, returned build/package/report engine/source identities and archive inventory/digests all agree. Retain independent archive extraction/document/notices checks after original build output cleanup. Never switch to the general default sqlite-vec lock or accept another-engine success. Refresh state before publication and fail on stale identity without repacking, retries or overwriting.

### 5. Generate and check the bounded transition notice

Generate concise truthful SQLite/Vector identity and required breaking-change text from verified context; include vec0/vec_* adaptation and no unverified migration promise. Preserve free-text dispatch/rollback comments as data. Bind notes and provenance into the qualification handoff and recheck before services run. A general handwritten release narrative and notification email are unnecessary. Retain supported OIDC/trusted npm publication, attestations, exact same archive, operation outcomes and explicit npm visibility-pending behavior without claiming complete verified success.

### 6. Exercise the real release consumer without publishers

Adapt the existing release exercise and its workflow guard for this Change: use the recorded released Vector pair and an explicit coherent synthetic historical stable-publication snapshot, calculate the transition identity, run fresh real production/browser qualification and acceptedPayload/provenance/notice checks, and preserve artifacts. No publisher/service-write adapter is instantiated. Synthetic policy/injected-service tests establish failures and ordering; they are not real browser/OIDC/registry evidence. Run the entire registered offline suite and the real exercise during Apply/Verification. No live package, tag, dist-tag, account or sender write is authorized.

## Risks / Trade-offs

- Existing Watch/Updates callers still select vec → preserve only necessary low-level compatibility, fail closed at new product publication authorization, and document/test the future Vector descriptor handoff rather than silently claiming those units migrated.
- Historical state shape mistaken for a new product candidate → validate source/engine shape and keep history reading separate from active publication context.
- Engine change hides a SQLite regression or real Vector downgrade → test absent, matching and fallback component references with comment enforcement.
- Package recalculation or wrong default silently changes bytes/engine → explicit lock and exact context/report/archive binding plus prepublication state refresh.
- Synthetic service checks overstate publication assurance → separately report real browser production, fixture-state calculation and unexercised hosted publication; never send actual writes during this Change.

## Migration Plan

Implement this consumer and shared policy through its reviewed Change, preserve historical publications and the old low-level integration code, then let A-watch/A-updates consume the contract through their own Changes. This implementation PR must not alter inputs/release.json or source locks and must not itself trigger candidate publication. Before any later real release, an actual integrated Vector candidate must satisfy complete definitive qualification and normal trusted-publishing configuration. A failure stops with retained outcomes; no automatic rollback, retagging or republishing is introduced. Public docs/demo later select an actually published Vector version under their own responsibilities.
