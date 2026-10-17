# Repository instructions

## Authority and navigation

Read the applicable repository standards before acting. On 2026-10-17 the maintainer instituted the four reconciled Captures at [revision 3756c95](https://github.com/at-rama/sqlite-vector-wasm/tree/3756c95a296acb68117cb825ac3e3ec5e3ab06f0/.42p/engineering) as this project's authoritative current design reference: Distribution, Site, Release/Watch and Workflow Notifications. The [Allocation at that revision](https://github.com/at-rama/sqlite-vector-wasm/blob/3756c95a296acb68117cb825ac3e3ec5e3ab06f0/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) records their exact paths and SHA-256 identities.

The primary decision in this project conversation is “La capture devient la nouvelle source autoritative”, followed by “Applique le changement de la référence autoritative”. It adopts that reconciled design and authorizes recording its new status; no public conversation permalink is available. Earlier sources remain historical provenance and rationale, not a parallel current contract that can silently restore superseded obligations. Material uncertainty must be escalated to the maintainer. This institution establishes neither historical fidelity, implementation conformity, engine substitution nor publication approval.

Authority comes from this explicit human institution. Future semantic Capture revisions require explicit human adoption; editing a Capture, passing checks or merging a PR alone does not institute a new design decision. Generic skill descriptions of non-authoritative Captures continue to apply to uninstituted working projections; this repository rule identifies the adopted design baseline without changing the general 42P workflow. Allocation remains derived responsibility coverage with no independent design authority.

- [Editorial standard](.42p/standards/editorial.md) — human-facing content.
- [Technical canon](.42p/standards/software.md) — repository engineering and validation.
- [Pull-request gates](.42p/standards/gates.md) — integration controls.
- [OpenSpec canon](.42p/standards/openspec.md) — Change lifecycle.
- [Verification standard](.42p/standards/verification.md) — post-Apply verification.

Resolve current Captures, Allocations and other engineering documents from `.42p/engineering/`. Do not assume fixed filenames, versions or implementation status.

## Workflows

Read and follow the applicable repository-owned skill under `.42p/.agents/skills/` before invoking its workflow.

OpenSpec lives under `.42p/openspec/`; run normal OpenSpec CLI commands from `.42p`.

## Repository changes

Work on a branch through a pull request targeting protected `main`. Do not write directly to `main`.

Run the canonical repository check for every proposed change and applicable tests under the technical canon. Do not interpret passing checks as implementation acceptance or publication authorization.

Preserve human integration and publication authority. Escalate unresolved authority or required semantic revisions rather than deciding them locally.
