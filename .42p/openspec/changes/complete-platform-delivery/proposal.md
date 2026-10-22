# Proposal

## Why

A completed npm/GitHub publication can still be reported incomplete because immediate public rereads lag or fail. Site also reconstructs completion from expiring Actions artifacts, so a durable release is not sufficient for a later deployment.

## What Changes

- Realize exactly `A-release` at Allocation commit `85585a833b4cd37959f8ad841109f7b2e4c45c1e`, under adopted `D/C-delivery`, `D/C-release-review` and `W/C-publication`.
- Keep definitive revision/version qualification, exact-byte preflight, collision rules, licensing, hosted trusted publishing and archive attestations.
- Complete normal delivery from validated successful publishing operations, without a second public availability gate.
- Retain a durable archive-bound receipt in the draft Release before its finalization, binding successful npm acceptance and preceding GitHub operations. Only the non-draft matching Release completes that receipt.
- Preserve historical/initial read-only inspection and explicit partial/unknown diagnostics; document a bounded manual incident procedure, without an automatic recovery engine.
- Supply the durable completion contract to later `A-site_shell` work. Later producer/document Changes replace the original Updates/live-preview evidence handoff; this Change does not move those producers.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `distribution-release`: successful platform-operation delivery, durable matching evidence and explicit incident handling.

## Impact

Release orchestration/adapters/tests and `docs/publication.md`. Site consumer integration remains a separate allocation-unit Change. No product API, source pin, numbering policy, setup, real publisher invocation or general 42P change.
