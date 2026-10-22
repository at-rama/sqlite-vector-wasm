# Proposal

## Why

Documentation currently requires a second browser observation on public Pages even though the exact assembled artifact is already checked locally. Public propagation can invalidate otherwise complete product qualification.

## What Changes

- Realize exactly A-site_docs at Allocation `85585a833b4cd37959f8ad841109f7b2e4c45c1e`, following adopted S/C-readme/C-demo-checks and D/C-delivery.
- Qualify source fidelity, rendered links/images/anchors and desktop/mobile presentation on the exact locally served assembled artifact; retain separate exact-archive example execution and publication-aware stable selection.
- Preserve source rendering, truthful candidate/published identity, existing examples, fixed demo identity and all link/content checks. Reuse the existing implementation rather than introduce another test runner.
- Document the proof boundary: local qualification plus completed deployment, with optional public diagnostics that do not gate delivery.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-docs`: replace scoped public-observation qualification by assembled-artifact qualification.

## Impact

The site documentation contract and `docs/site.md`; existing browser, assembly, documentation and Release-consumer tests supply the implementation checks. A-site_shell separately removes the observe job and wires durable completion; A-acceptance and A-updates separately orchestrate PR qualification. No new distribution, compiler, runtime selection, API or substantive documentation rewrite.
