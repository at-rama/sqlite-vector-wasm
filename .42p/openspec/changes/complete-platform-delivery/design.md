# Design

## Context

See proposal.md for the problem and single-unit scope. `publish()` already qualifies/preflights exact bytes, uploads a draft Release, invokes npm and finalizes GitHub. Its subsequent GET/download gates create an additional delivery verdict unrelated to successful writes. `reviewedDocumentation()` currently requires public Site observations even though `site-checks` already retains `assembled.json` from the real local browser check.

## Goals / Non-Goals

Keep complete authoritative-revision qualification and all product/security controls. Change only the Release-owned consumption and publication evidence boundary here. Site deployment, candidate producer relocation and acceptance orchestration belong to their subsequent Changes. No publisher is executed in verification.

## Decisions

1. Consume the local assembled-browser report from the identified successful Site build/deploy run, preserving commit, archive, rendered-document hashes and desktop/mobile assertions. Do not require a public URL or `site-live` artifact. Before moving producers, the existing Updates artifact remains the candidate input; later Changes replace that source without weakening identity binding.
2. Normal publication ends after successful npm and GitHub operations. Retain the existing read-only inspection adapters solely for historical/bootstrap/incident use; do not invoke them after normal successful writes.
3. Add an archive-bound `delivery.json` receipt to the existing draft Release after npm succeeds and before finalization. It records repository/name/version/tag/channel/commit, archive identity, Release ID, the publication manifest digest and the successful preceding operations. A receipt alone is not complete: its matching Release must be finalized and contain the expected payload, manifest, attestation and receipt assets. This reuses the Release as the durable publication object, without another registry. The publisher records the receipt contract in new provenance so missing new receipts cannot silently take a historical fallback.
4. Preserve the bounded initial manual-npm path and historical read-only inspection rather than fabricating a normal npm acknowledgment. Historical evidence keeps its original semantics. Site's historical selection/rebuild belongs to the subsequent consumer Change.
5. Keep an operation acknowledgment even if persisting its local journal subsequently fails; do not record the same acknowledged remote write as a failed remote operation. A transport exception identifies unknown acceptance; explicit rejection stays a failure. Document inspection and manual continuation of the same identity, not automatic replay.

## Risks / Trade-offs

- npm and GitHub are not atomic: if receipt upload/finalization fails after npm success, retain a partial incident; never republish blindly.
- Normal success trusts platform completion rather than independently downloading public bytes. Integrity is established on the unchanged qualified/transmitted files; runtime acquisitions by later consumers still verify their inputs.
- The receipt is an operational record, not an independent signature or human approval; existing archive attestation remains separate.
- Local browser evidence shares the existing repository harness; it proves exercised assembled output, not public CDN availability.

## Migration Plan

Implement and test Release boundaries first. Subsequent Site/docs Changes consume durable receipts and remove public observe; producer Changes then move candidate qualification into PRs. Keep this working PR unmerged until the complete dependent revision is verified. Do not synchronize specs or archive in this task.
