# Design

## Context

See [proposal](proposal.md). At merged main a1ea5e39afb2ca4aa9df5bd138e240d351df8dad, tools/watch/discovery.mjs hardcodes sqliteVec 0.1.9 and amalgamation assets; plan.mjs uses sqlite/sqliteVec pairs; state.mjs recognizes old run titles and reads inputs/sources.lock.json. A-release already exports engineKey/componentReferences, reads historical provenance and implements transition/alpha policy. A-updates exposes sqlite_vector fields, Vector run titles and schema-2 descriptors. The notification consumer reads only the existing result envelope, outcome/count and run context; its message refers generically to the optional helper. No transport redesign is needed.

The user explicitly adopted fixed inclusive Vector 1.1.0; the currently recorded 1.1.2 pin does not compute a live predecessor. Official release inspection during exploration found 54 releases and no published prerelease, with stable 1.1.0 directly preceding 1.1.2; tag 1.1.0 resolves to 235a7c51b18858e1fea9fb2895e115e4cbbd9f7d. These are bounded observations, not an availability promise or build qualification.

## Goals / Non-Goals

**Goals:** connect the existing read-only Watch to the fixed Vector product and adopted floor, full same-engine eligibility/history/current-candidate semantics, unchanged human plan and notification handoff.

**Non-Goals:** no moving N−1 policy, fake baseline publication, guaranteed nonempty plan, automatic newest-only selection, runtime/backend abstraction, source acquisition/build, release/Updates policy change, notification transport/account setup or live email. Preserve existing Friday 08:00 Europe/Paris/manual schedule and no-keepalive behavior. No production pins, descriptor, notices, synchronized specs or public Site edits in Apply.

## Decisions

### 1. Fixed floor and bounded official metadata reader

Change only the Vector discovery floor to literal 1.1.0; keep SQLite 3.53.4 and Fossil/release-log verification. Reuse existing pages/cachedReader transport and official A-inputs admissibility conventions. Replace vec asset assumptions by Vector's published non-draft release identity, exact suffix/maturity, official release ID/URL and released tag/commit/archive binding. Resolve required tag/commit metadata as read-only GitHub records for versions within the fixed floor. Preserve full pagination, duplicate/contradiction/truncation failures and captured-source provenance.

Do not call candidate resolution's source-download/hash operation or demand a nonexistent upstream asset checksum: preparation records that pin under A-inputs. No clone, archive acquisition, new dependency or general source framework is needed. Published alpha/beta/rc metadata is conditionally supported; tests use synthetic prereleases rather than manufacturing a live alpha from branch/header/npm state. Future pins leave the floor unchanged. Keep 1.1.0-alpha below the inclusive stable floor under SemVer.

### 2. One engine-aware identity and existing reference selection

Use the fixed Vector selection shape and a composition key containing SQLite version, engine identity and engine version. Keep published foreign-engine history distinguishable for numbering/collisions and its own composition exclusion; never relabel it as Vector. Consume engineKey/componentReferences and calculate from A-release instead of another reference/numbering policy.

Stable and experimental enumeration retain all applicable combinations, suffix order, no comparable-component regression, strict progression and latest lower bounds. When no Vector reference exists, engine identity change supplies eligibility without making 1.1.0 a published reference; SQLite constraints still apply. Once channel/latest Vector references exist, normal same-engine comparisons apply. A valid empty result is allowed; no forced pair, newest-only alpha, fake bootstrap or alternate-number retry is added.

### 3. Consume exact preparation evidence without changing Updates

Read current queued/active run identity from the new fixed Vector title and validate repository/workflow/event/main/run/attempt. Read a changed descriptor at each candidate PR's exact observed head; select schema 2 and its recorded Vector lock, validate exact selection, canonical preparation/run association and branch attempt through existing release validators. Preserve run-to-PR joining and distinct PRs/attempts, inherited-descriptor rejection, head-race/metadata failures and read-only behavior.

Clearly identifiable legacy sqlite-vec preparations are historical and do not establish current Vector candidates. An unknown/mixed or contradictory relevant record fails explicitly; absence cannot be inferred from an unreadable candidate. No parallel current legacy discovery/qualification, remote candidate update, cancellation or dispatch is introduced.

### 4. Preserve the compact human plan and optional drafting boundary

Update prospective pair labels/parameters to sqlite_vector_version and sqlite_vector_comment, retaining SQLite/comment/misc fields and the central Forecast grouping with exact selectors. Render each historical reference using its actual engine identity and components; do not display undefined Vector values for a legacy HEAD. Preserve all eligible entries, existing-candidate detail, order and true empty/failure Summary outcomes.

Update docs/watch.md, correct only the obsolete pending-Watch consumer note in docs/candidates.md, and update the on-demand release-comments skill for official Vector notes and the current fields. The helper resolves exact published provenance, compares a component only against its same-engine reference and explicitly describes an engine transition when none exists; it does not invent cumulative numerical changes from sqlite-vec. It stays outside nominal Watch, returns optional data and starts no preparation. Retain unchanged-component, explicit-reference, prerelease/rollback and source-evidence limitations. This updates a planning aid, not the notification message or a new product API.

### 5. Keep notification and trigger contracts unchanged

Keep the existing schema-1 result/plan envelope, context, outcome/count and current run reference consumed by notifyPlan/notify-cli. Test actual Vector producer records at that boundary with injected transport: both triggers, complete nonempty plans including all-existing-candidate entries, repeated executions, empty and failed results. Do not modify notification policy, sender implementation, credentials, addresses or account settings. No live email is needed to prove this producer handoff. Existing schedule and workflow permissions remain; any integration test tied to obsolete producer fields must verify the new producer without pretending an old reader already supports it.

### 6. Evidence proportional to a read-only planner

Use the existing registered offline suites, captured real release/tag/Fossil records and separately labelled synthetic histories/candidates/prereleases, including wrong identities, source failures, collisions and writer failures. Execute one complete live read-only planning rehearsal through runWatch and existing read transports, writing Summary/JSON only to a temporary/ignored destination. Read actual public source/publication/candidate state; do not dispatch the hosted workflow because its eligible result can send email. Use an explicitly local rehearsal context and never claim it is a hosted dispatch/run. Retain observation times, exact code/source references and raw/result hashes. The actual outcome can be empty or nonempty; do not weaken eligibility to obtain mail input. Test hosted invocation/trigger identity separately with fixtures and fake notification transport.

## Risks / Trade-offs

- Dynamic floor or fictitious reference → literal floor plus existing componentReferences; advancing-pin and first-transition tests.
- Legacy history or candidates poison identity → explicit engine keys, historical discrimination and relevant-ambiguity failure.
- Vector releases lack amalgamation/checksum assets → use existing released tag/commit admissibility, leave source pinning/acquisition in preparation.
- Summary becomes misleading or verbose → preserve central forecast grouping/order and exact typed producer parameters/reference labels.
- Synthetic evidence overclaims upstream or mail behavior → distinguish captures, fixtures, actual public reads, local context and unexercised live delivery.

## Migration Plan

Implement this Watch consumer and its tests/docs/helper, preserving producer/notification/release contracts. Verify the full unchanged envelope and no-write boundaries before any subsequent manual workflow use. If source identity or policy cannot be established, fail with diagnostics; do not switch sources, restore a parallel vec product, force a plan or repair upstreams. Complete post-Apply 42P Verification before archive. No unresolved design question remains within A-watch; this proposition authorizes no execution or integration.
