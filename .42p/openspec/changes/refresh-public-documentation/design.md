# Design

## Context

See [proposal.md](proposal.md) for motivation and the exact A-site_docs Allocation/Capture snapshot. The source checkout was reconstructed through the GitHub connector at `af5ddc9e8636cc0088948a846aad92fb569515de`; its initial local tree exactly matched upstream tree `ebb4071d2cc3208a42de30d5f0cceffd640efbc1`.

`tools/site/documentation.mjs` currently discovers a preceding literal from a versioned npm command, rewrites that version, and prepends selected composition/status. `tools/site/example.mjs` requires the rendered pinned command and extracts shell/JavaScript fences by ordinal position. Merely deleting the source suffix would leave candidate installation misleading and fail published-example validation. `tools/package/package.mjs` copies README/Usage bytes unchanged and checks their local links; an added repository-only note must not become an unshipped relative package link.

The cumulative site-docs specification has five requirements. This Change modifies two complete requirement blocks and retains the other three and all prior scenarios. No shell/demo spec or upstream authority artifact changes.

## Goals / Non-Goals

**Goals:** preserve the existing source/render/example pipeline while separating generic consumer instructions, informational latest metadata and the exact checked example. Keep practical footprint information understandable and reproducible without adding a measurement service or release obligation.

**Non-Goals:** engine/runtime/package changes, automatic runtime selection from badges, new distribution/deployment channels, release/workflow changes, demo source/UI fixes or refresh, and changes to 42P authority/lifecycle. A read-only demo observation is not independent vector qualification.

## Decisions

### 1. Keep durable Markdown and generate only qualified reproducibility details

README and Usage retain one authored source each. Published-package installation uses `npm install @at-rama/sqlite-vector-wasm`. Remove release numbers from surrounding generic distribution prose and replace the generic SQLite-Vector `tree/1.1.2` reference with an upstream project/reference destination; provenance still identifies the bundled exact composition.

In Usage, the existing selected context supplies a compact, clearly labeled checked-example/reproducibility disclosure containing exact product/component versions and a pinned published install recipe. It is generated adjacent to the documented example from already validated context, not maintained as a second guide. The generic published install remains separate. In candidate rendering, generic install commands for that candidate become `npm install ./payload.tgz`; the disclosure identifies the exact qualified unpublished archive without asserting npm availability. README preview installation likewise must not advertise installation of an unpublished candidate from npm. When no qualified context exists, raw generic Markdown remains readable and must not invent a checked-version claim.

Adapt `renderPublicDocument()` and the existing example validator/extractor together. Select asset-copy and example snippets by their documented section/role rather than assuming the second shell fence remains the copy recipe after a generated install fence is added. Use the existing Markdown tokens and bounded section matching; introduce no generalized documentation framework. Execute the actual Usage snippets and copy recipe, retain the checked archive installation and reject missing/ambiguous snippets. Keep source hashes, exact commit/archive binding, observed native results, Worker parity and stale-evidence rejection.

Alternative rejected: keep authored version literals or silently validate unpinned npm latest. The former causes recurring editorial drift; the latter changes the qualified-example contract. The chosen disclosure is the existing reproducibility duty, not a new runtime-selection mechanism.

### 2. Use badges as informational publication metadata

Use Shields' npm version badge for the explicit `latest` tag and npm license metadata for the package license badge. Component badges read `runtime.json` of `@at-rama/sqlite-vector-wasm@latest` through the existing public npm CDN surface, for example jsDelivr, using `$.inputs.sqlite.version` and `$.inputs.sqliteVector.version`. Give readable alt text and links, label the group as the npm latest publication, retain the CI badge and useful project/upstream destinations, and keep bundled-license qualifications in the prose.

These are external image URLs rendered by the reader, not a build-time latest acquisition or a new canonical runtime distribution. CDN/Shields caches can update at different times; do not promise atomic badge consistency or use badges as provenance. Registry/package/runtime manifests remain the authoritative publication records. A blocked badge endpoint is recorded as an incomplete live check, never replaced by a manually typed version or treated as a successful check. No new external uptime gate or release automation is introduced.

Alternative rejected: hard-code current component versions or derive them from the repository source lock. Those values can describe a candidate instead of the published npm latest package.

### 3. Restore a practical measured footprint, with a small reproducibility note

Add the rounded loader-plus-WASM figures to the existing distribution paragraph; use decimal units (1 kB = 1,000 bytes; 1 MB = 1,000,000 bytes). Link an absolute GitHub repository URL for `docs/runtime-footprint.md`, so the installed README remains usable without changing package document mapping or introducing another site page.

Exploration on 2026-10-22 observed the following actual GitHub Pages bodies with `Accept-Encoding: identity` and `Accept-Encoding: gzip`:

| File | Raw bytes | Served gzip body bytes | Decoded SHA-256 |
| --- | ---: | ---: | --- |
| `sqlite3.mjs` | 829,068 | 233,688 | `8bbd6d8674d86ab645d0dabe0b590e328d6a7e7d90c4426bec8865f404a91e93` |
| `sqlite3.wasm` | 943,296 | 438,112 | `3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6` |
| Total | 1,772,364 | 671,800 | Per-file hashes above |

This supports approximately **672 kB gzip / 1.77 MB raw** for this pair. Pages currently serves demo runtime 0.3.0; the same raw file hashes were observed in the npm 0.3.1 archive. The final record must explicitly distinguish serving selection from byte-equivalent package selection rather than claim that the demo already uses 0.3.1. The historical README at `dist/v0.2.1` used the same practical loader/WASM scope, with a measurement attributed to 0.2.0.

During Apply, renew and record the endpoint responses before publishing the paragraph: record date, full URLs, request/response encoding, actual response-body counts, decompression method, exact package version/archive integrity, raw sizes and decoded hashes, and a small reproducible standard-library command. Compare decoded files with the exact package archive. Do not label local gzip recompression as served HTTP gzip, sum all eleven alternative entries as a normal browser transfer, or confuse compressed npm tarball size with this pair. Round only the public summary; exact numbers/identities live in the note. Application data, extra requested companions, server compression and cache state affect actual transfer; raw bytes do not establish memory footprint. This is a dated observation, not an automatic every-release benchmark or a guarantee for every 0.3.x release.

### 4. Reuse existing link, package and deployed checks

Keep canonical stable site URLs in authored documentation links, including Usage's return to Presentation; preserve existing stable/preview remapping, anchors, repository-only file links and images. The reproducibility note is repository-only and externally linked by its existing GitHub URL, without adding a VitePress route. Verify that this path exists and remains accessible from the installed README as well as GitHub/Pages.

Keep the guide's native Float32/BIT/FTS5, direct module Worker guidance, Worker1 compatibility and conditional OPFS behavior. Run the existing renderer/example checks against changed source hashes. Observe the exact deployed Pages candidate at desktop/mobile widths and retain preview identity, links/images/anchors and local-versus-deployed evidence separation. Follow the existing published/candidate handoffs; do not change release eligibility or add release publication as part of this work.

Read-only checks may follow Demo from documentation and confirm its displayed selection and the already supplied asset hashes remain unchanged. The stale explanatory `sqlite-vec` sentence in `site/demo/EmojiDemo.vue` remains a separately owned A-site_demo editorial issue. Do not edit it or claim complete demo acceptance here.

## Risks / Trade-offs

- [Generic install resolves a newer publication than the checked example] → label generic/latest and reproducible-example identities explicitly; the check keeps using its fixed archive.
- [Generated shell fences shift ordinal extraction] → bounded section/role extraction plus missing/ambiguous-snippet failures; preserve actual-snippet execution and copy-inventory checks.
- [Badges fail or lag through independent caches] → retain readable labels and direct package/manifest links; report live-access limits without inferring runtime identity.
- [Gzip responses change by host or edge] → keep the measurement dated and record actual content encoding/body bytes; renew the note when renewed measurements justify a new summary.
- [New note breaks installed-package links] → absolute repository link and existing packaging link validation, without changing the distribution's document/API surface.
- [Proposal-only PR cannot satisfy lifecycle merge gates] → keep it draft with pending Apply/Verification/Archive; do not fabricate reports or archive planning work.

## Migration Plan

Review this planning-only PR, then explicitly invoke Apply on the same branch. Apply edits the bounded documentation/render/check files and produces the scoped evidence; 42P Verification, synchronization/archive and human integration remain subsequent steps. The normal Site pipeline publishes documentation after the existing eligibility checks; no engine publication is required for this independent editorial revision. Roll back through a reviewed source/render-check revert while preserving example/demo runtime selections; do not edit historical publications.

## Allocation coverage before Apply

The effective contract is the cumulative five-requirement `site-docs` baseline with the two complete modified blocks in this Change. This table maps the entire selected unit, including preserved obligations; unchanged requirements are not omitted simply because their blocks are absent from the delta. Task numbers refer to [tasks.md](tasks.md), to be completed before Apply.

| A-site_docs contribution / qualified source | Effective requirement and scenarios | Planned tasks |
| --- | --- | --- |
| README-only Presentation and dedicated directly readable Usage; C-site/C-readme | Single-source public documentation: all three baseline scenarios, durable installation, latest badges, practical footprint and measurement distinctions | 1.1–1.3, 2.1–2.3, 3.1 |
| Truthful native candidate guidance, exact archive preview and matching published identity; D/C-release-review, C-readme/C-demo-checks | Single-source candidate scenario; Explicit published-version example: all seven baseline scenarios plus generic published/candidate rendering and independent latest metadata | 1.2, 3.1–3.3, 4.1 |
| Useful rendered destinations, anchors/images and GitHub/package access; C-readme/C-demo-checks | Unchanged Systematic documentation link resolution: all four scenarios | 1.2, 1.3, 2.3, 3.1, 4.2 |
| Independent documentation revisions, no engine release, fixed demo identity; C-readme/C-demo-release | Unchanged Independent documentation integration: both scenarios; Explicit published-version example preservation/latest scenarios | 3.3, 4.3 |
| Scoped actual-Pages desktop/mobile and separate executed example evidence; C-demo-checks | Unchanged Scoped deployed documentation checks: both scenarios; exact candidate/published example scenarios | 3.1–3.3, 4.1–4.3 |
| Shell consumed without owning deployment, post-shell independence, no package API/publication/extra canonical distribution or replacement acceptance; Q-realization/unit boundary | Unchanged Independent documentation integration and scoped deployed checks, with Decisions 2 and 4 preserving owner boundaries | 2.3, 4.2–4.4 |

Reverse correspondence: the two modified requirement blocks and every added scenario are editorial/rendering/measurement realizations of C-readme plus its documentation verification portion of C-demo-checks, explicitly bounded by the accepted 2026-10-22 user request. The other three unchanged requirements carry the remaining links, integration, evidence and separation contributions above. Badges do not acquire release policy; the footprint note does not acquire package/build ownership; read-only demo observations do not acquire A-site_demo qualification. Every design decision and task belongs to these contributions or the mandatory repository check.

**Documentary coverage: A-site_docs → effective Change 100%; effective Change → A-site_docs 100%.** This assesses scoped requirement correspondence, not historical fidelity, implementation conformity, executed tests, deployed success or post-Apply Verification. Recheck the mapping if any artifact or authority snapshot changes before Apply; unresolved semantic expansion must be escalated rather than silently implemented.
