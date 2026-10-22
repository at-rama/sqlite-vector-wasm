# Tasks

## 1. Durable publication and previous-source eligibility

- [x] 1.1 Replace release-outcome artifact reconstruction with exact durable receipt validation and bounded legacy read-only inspection; test expired-artifact independence, wrong commit/archive/manifest/draft/missing receipt, partial publication and unrelated completion, and document historical limits.
- [x] 1.2 Replace the public Pages fallback with bounded descriptor-history ancestry lookup only for known pending publication; test previous-source preservation, no public requests, unknown/inconsistent evidence, ancestry and exhaustion diagnostics, and document the manual stop procedure.

## 2. Site completion boundary

- [x] 2.1 Wire relevant PR Site checks/deployment into the existing required acceptance context through workflow_call, with scope/missing/failure regression tests and no cross-workflow polling; remove automatic public observation while preserving exact local assembled checks, official deploy completion, permissions/freshness/concurrency and optional manual diagnostics; update workflow regression tests and the site guide, and verify Pages failure cannot authorize promotion or cause distribution replay.

## 3. Integration checks

- [x] 3.1 Run repository checks, applicable Site and Release suites and strict validation; review the unchanged browser/runtime construction path, ensure no durable Actions-artifact dependency remains, and record unexecuted hosted deployment limits.
