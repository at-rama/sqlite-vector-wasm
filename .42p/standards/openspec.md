# OpenSpec usage canon

This normative canon governs OpenSpec as the repository's 42P change mechanism, subordinate to [instituted design decisions and sources](../../AGENTS.md). **MUST** and **MUST NOT** are mandatory. Apply the [editorial standard](editorial.md) and [technical canon](software.md) throughout.

## Project and CLI location

`.42p` is the OpenSpec project root; `.42p/openspec/` contains its configuration, changes and realization canon. Keep the built-in `spec-driven` schema. MUST NOT use an OpenSpec Store, `--store`, or a repository-root `openspec/`.

OpenSpec is pinned to the exact version in [the tooling manifest](../../tools/openspec/package.json), currently `1.14.0`, with transitive versions and registry integrity in its npm lockfile. Install with `sh tools/openspec.sh install` from the repository root (Node.js >=20.19.0 and npm required). This runs `npm ci` in ignored `.work/openspec/`; it does not use a global installation or resolve a floating version.

Before use, `sh tools/openspec.sh check` MUST pass. It checks manifest/lock agreement, installed records and dependency versions, the CLI version and generated skill metadata. Every command MUST use `sh tools/openspec.sh exec <arguments>`; the launcher repeats these checks and selects the local CLI. It never installs or updates implicitly. To use the bare `openspec` examples and CLI-generated skill commands below, define a shell function in the execution session, with the absolute checkout path:

```sh
repository_root=$(git rev-parse --show-toplevel)
openspec() { sh "$repository_root/tools/openspec.sh" exec "$@"; }
```

The launcher sets `.42p` as working directory, including when invoked elsewhere. Normal OpenSpec CLI commands MUST execute with `.42p` as working directory. From the repository root:

```sh
cd .42p
openspec list
openspec list --specs
openspec status --change <change>
openspec validate --all --strict
openspec instructions proposal --change <change> --json
openspec archive <change>
```

MUST NOT run normal commands from the repository root or rely on downward discovery of `.42p/openspec/`. Setup/update operations that accept a project path MUST target `.42p`; pathless refresh commands MUST run from `.42p`. This checkout already contains its OpenSpec project and generated skills; initial setup is not part of normal execution. Keep the core workflows plus `verify` when refreshing the generated skills as described below. Use the locked repository tooling above for the official CLI; it is separate from product and browser-harness dependencies.

Before any workflow write, resolve the local project with `openspec list --json` or `openspec context --json` from `.42p`. The returned project root MUST be this checkout's `.42p`; generated change and spec paths MUST remain inside `.42p/openspec/`. Stop on a missing or different root. Interpret generated `openspec/...` paths relative to `.42p`; repository implementation files remain relative to the repository root, its parent.

## Generated skills

Shared skills live under `.42p/.agents/skills/openspec-*/`; `.42p/.agents/skills/.openspec-target` is generated target metadata. MUST read and use the appropriate generated `SKILL.md` for a workflow. MUST NOT hand-edit these files. Refresh them through the OpenSpec CLI when required.

The required workflow selection is the core set (`propose`, `explore`, `apply`, `update`, `sync`, `archive`) plus `verify`. The core profile alone does not install `openspec-verify-change`. To reproduce this selection in the execution environment and refresh, run from the repository root:

```sh
sh tools/openspec.sh refresh
```

The explicit `refresh` command checks the installed CLI and lock, sets this workflow selection, runs the CLI-owned `update --force` from `.42p`, then checks the resulting skill metadata. It permits old generated metadata only during this refresh; normal execution refuses it. These settings configure the execution environment; generated repository skills remain CLI-owned. Keep this workflow selection when refreshing so Verification remains available.

Use the generated skills directly in ChatGPT Work by reading their files through repository access. Add an adapter only for a demonstrated Work incompatibility; MUST NOT duplicate workflow logic in advance. Repository 42P rules override generic OpenSpec assumptions where they differ, including fluid Apply and archive suggestions. The repository-owned [42p-verify-change composition skill](../.agents/skills/42p-verify-change/SKILL.md) orchestrates the three Verification controls and delegates to the current generated verify skill. MUST NOT copy or modify an OpenSpec skill to encode repository policy; keep composition skills separate from CLI-owned `openspec-*` skills.

## Authority and lifecycle

The authority chain is:

Human institution → distinct reconciled Captures as current design reference → global Allocation → OpenSpec realization canon → Proposition → implementation → Verification.

Under AGENTS.md, the maintainer has instituted the [current Captures](../engineering/) as the authoritative design reference; the global Allocation derives responsibility coverage from them. Earlier sources, including the immutable historic Distribution contract under S-spec, remain provenance and rationale rather than parallel current obligations. Capture edits do not institute semantic revisions without explicit human adoption, and none of these artifacts independently corroborates implementation or historical fidelity. The README is public product documentation. Neither OpenSpec artifacts nor task completion can change upstream authority or establish implementation acceptance. A-site consumes the published canonical distribution; it neither extends the package API nor introduces another canonical runtime distribution.

Only realization of an allocation unit requires a Change in this repository. Evolution of design or canon, including governance tooling, is exempt. The [pull-request gate canon](gates.md) defines executable Verification/Archive checks for affected Changes; it does not infer omitted Changes or replace review of evidence freshness.

The normal operational path is:

Allocation → `propose` → allocation/change coverage gate → `apply` → 42P Verification → `archive`.

1. **Propose.** Each Change MUST realize exactly one allocation unit. Use `openspec-propose` to derive the Change's proposal, delta specs, design and tasks from that unit. Record the Allocation snapshot and the stable allocation handle used. MUST NOT introduce unallocated product requirements. The generated `proposal.md` is the OpenSpec Proposition artifact; it is drafted here and constrains implementation together with the other Change artifacts.
2. **Coverage gate.** Before Apply, record a bidirectional mapping from every requirement of the allocation unit realized by the Change to OpenSpec requirements and back, with relevant scenarios and tasks. Allocation unit → Change coverage MUST be 100% and Change → allocation unit coverage MUST be 100%: no requirement of that unit missing, no OpenSpec requirement without authority from that unit. Other allocation units need not be proposed or synchronized before this Change is implemented. Missing, contradictory or insufficient upstream content, or a required semantic change, MUST stop the workflow and escalate to the upstream authority. MUST NOT resolve it by local reinterpretation.
3. **Apply.** Use `openspec-apply-change` only after coverage. Apply MUST remain constrained by the Change and repository standards. MUST NOT reinterpret upstream authority, narrow obligations or add unallocated requirements. If an artifact needs a semantic revision, stop and escalate; repeat coverage for an authorized revision before resuming Apply.
4. **Verification.** After Apply, use the repository-owned `42p-verify-change` composition skill under the [Verification standard](verification.md): confirm 100% bidirectional allocation-unit/Change coverage, use `openspec-verify-change`, and run repository checks and applicable tests. These three controls constitute the distinct post-Apply Verification stage; MUST NOT add a fourth verification procedure. Follow the Verification standard's report prerequisite and stop rules: write and commit the Change-local `verification.md` with its versioned YAML frontmatter, available evidence and verdict, including failed or blocked results; return a diagnostic if report prerequisites are unresolved. The official skill must be available before invocation; installation and updates belong to separate preparation. Task checkboxes, file-existence status and OpenSpec structural validation alone MUST NOT substitute for Verification or product acceptance.
5. **Archive.** Use `openspec-archive-change` only after satisfactory 42P Verification. Archive may propose or apply synchronization of delta specs through the native OpenSpec workflow. MUST NOT use incomplete-work confirmations to bypass an earlier gate. If invoking the archive CLI, use `openspec archive <change>`. Archive records completed work; it does not replace Verification or authorize merge/publication.

`openspec-sync-specs` is optional after implementation and before archive, not a mandatory 42P stage. Sync is an agent workflow, not an assumed `openspec sync` CLI command. Strict validation MUST pass; synchronization does not claim implementation exists.

The other generated core workflows (`openspec-explore` and `openspec-update-change`) are supporting operations, not extra 42P lifecycle stages. MUST NOT use them to bypass Capture, Allocation, coverage or Verification. Any semantic update invalidates affected coverage and verification evidence until reconciled through the same gates.

## Explicit version updates

Change the exact dependency in `tools/openspec/package.json` and regenerate `tools/openspec/package-lock.json` with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --prefix tools/openspec`. Review the resolved versions and integrity changes. Reinstall with `sh tools/openspec.sh install`, then use `sh tools/openspec.sh refresh` to regenerate CLI-owned skills when required. Do not hand-edit their metadata. Review the generated diff, update this canon’s current version and its manifest digest, run the preflight, project resolution and strict validation, and run the canonical repository check and registered tests. Repeat installation and validation in an isolated checkout with empty npm/tool state. Submit the complete update in a PR; no implicit upgrade, floating install or `npx` fallback is permitted.
