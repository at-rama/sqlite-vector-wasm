# Design

## Context

See proposal.md. eligibility.mjs currently reconstructs completion from release-outcome Actions artifacts and falls back to public site-publication.json. The exact local assembled observer and official Pages acknowledgment already exist. New Release manifests declare deliveryReceipt and retain delivery.json before finalization.

## Goals / Non-Goals

Remove operational rereads/expired artifact dependencies while retaining fail-closed identity and freshness. Runtime downloads are acquisitions with integrity checks, not post-publication delivery gates. Candidate archive producer relocation belongs to the following units.

## Decisions

1. Validate a declared delivery.json using the A-release validator, the exact downloaded publication bytes, matching Release and human integrated PR. New records never take legacy fallback. For pre-receipt records, retain read-only matching GitHub/npm identity inspection; an explicitly qualified initial-manual-npm handoff (and historical initial record) uses the existing bounded initial read-only completion check instead of a normal receipt. Otherwise retain matching GitHub/npm identity inspection without Actions artifacts; this is historical compatibility, not another normal publishing gate or fabricated receipt.
2. A release workflow completion is a signal only: validate its repository/path/event/attempt and completed successful publish job before selection, then establish completion independently from durable records. Qualification-only/skipped/failed publishers do not promote. Later manual Site runs require no originating Actions artifact or job history.
3. For a candidate with no finalized matching publication, tag that specific known-pending condition. Only then inspect at most 100 descriptor-change commits on current main, trying their first parents in ancestry order for an eligible previous source. Verify ancestry and full eligibility; stop on unknown/invalid evidence. Exhaustion leaves Pages unchanged with a manual diagnostic. Do not use catch-all fallback for API/integrity errors. This bounded source lookup is not a replay/recovery engine.
4. Remove only the automatic public observe job. Preserve observe.mjs for the existing local assembled check and optional manual diagnostics. Expose the same Site jobs via workflow_call, called by the existing Acceptance workflow for relevant PR changes; its required acceptance job depends on the called Site result. A small Site-owned diff scope and fail-closed result adapter avoid API polling or administration changes. Builds retain read-only permissions; only the caller job authorizes Pages/OIDC for the reusable deploy job. The Release review adapter accepts the identified Acceptance run and site / build/deploy job names as well as historical direct Site runs; Actions artifact traces are short-lived review inputs, not stable publication authority.
5. Keep independent stable checkout, explicit demo/placeholder overlay, read-only builds, isolated privileged official deployment and final freshness guards unchanged. Pages failure is repaired by a manual Site-only run against the same durable publication.

## Risks / Trade-offs

Historical input acquisition may still require readable registry/archive data; it cannot relabel the original delivery as failed. Missing new receipts are never treated as historical. A bounded history exhausted without a valid prior source stops safely for manual diagnosis. GitHub API outages remain explicit source-acquisition errors; no replacement public HTTP fallback is added.
