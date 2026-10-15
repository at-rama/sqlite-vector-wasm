---
schema_version: 1
change: site-docs
allocation_unit: A-site_docs
checked_commit: 59579009a077d0c405489fbb341fa0ac3ba8a65d
verdict: failed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: failed
repository_checks: passed
applicable_tests: failed
---

# Verification — site-docs

## Institutional view

**Conclusion — failed for A-site_docs.** The reviewed, committed candidate is `59579009a077d0c405489fbb341fa0ac3ba8a65d`. The current README/Usage and published example have successful execution evidence, but a valid relative image causes the real compiler to fail under both stable and preview prefixes. That contradicts an allocated obligation and prevents satisfactory Verification. Repository tests were renewed locally; actual-Pages and integration evidence was reused only after downloading and examining the primary artifacts for this exact candidate. The reproduction and finding are recorded below; successful current-page checks do not erase the missing image behavior.

**Provenance of the command.** The examined command is [A-site_docs in Allocation edit-0.1](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), section “A-site_docs — Public presentation and usage”, through [Site Capture edit-0.1](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), C-site, C-readme, documentation portions of C-demo-checks, runtime preservation in C-demo-release, and Q-realization. Capture provenance attributes these to S-site-design, S-site-usage and S-site-split. Their projected correspondence was examined; original conversations were not independently reacquired or audited. Neither unchanged hashes nor the 100% contractual mapping establishes full upstream fidelity or human authorization.

**Single-source presentation and Usage — supported for the current sources.** Both pages are generated from their respective Markdown source, with getting-started instructions and the minimal example; generated copies remain ignored. The downloaded primary `live-pages.json` in artifact `site-live-38761660072` of the [exact-candidate Site run](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38761660072) records both source hashes and successful actual-Pages checks at 1280px/390px. The real renderer fixtures were also renewed. The relative-image branch has the separate failed disposition below.

**Usable relative links and images — failed.** The allocation requires usable deployed relative links/images. A temporary input containing `![Image](docs/picture.svg)` with a valid existing SVG causes VitePress 1.6.4 to fail resolving `/sqlite-vector-wasm/docs-assets/docs/picture.svg`; the preview variant fails resolving `/sqlite-vector-wasm/preview/docs-assets/docs/picture.svg`. This was observed with the real locked compiler, not inferred from a missing test. The relevant implementation is [docs.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/tools/site/docs.mjs), lines 123–127, with rendered HTML emitted at lines 54–61; see finding V1 and its reproducible input below. Textual URL-resolution assertions are insufficient to establish compiled image usability.

**Published-version example — supported by renewed execution.** The actual guide initialization/Float32 snippets executed against pinned published 0.2.0. Observed SQLite `3.54.0`, sqlite-vec `v0.1.9`, neighbors `[[1,0],[2,1.4142135381698608]]`, with all eleven runtime files unchanged. [example.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/tools/site/example.mjs), lines 14–85, identifies acquisition, extraction, snippet execution and assertions; this is implementation evidence, not the execution result itself. The matching primary CI result is available in `docs-example/result.json`, artifact `site-checks-38761660072` of the linked Site run. This invocation additionally renewed that command; its observed identities/results are preserved in the detailed record below. No complete API, OPFS or vector-demo acceptance follows.

**Independent updates and demo preservation — supported within the exercised boundary.** Code examination confirms documentation construction neither discovers a release nor acquires a demo runtime. The downloaded primary `site/exercise.json` in `site-checks-38761660072` records thirteen integration cases, including absent demo, unchanged synthetic selection/runtime digests across an actual README edit, independent stable/preview assembly, and corrupt-runtime rejection. [prepare.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/tools/site/prepare.mjs), lines 45–86, preserves the supplied inventory through preparation/output checks. These synthetic bytes establish transport preservation, not a real emoji demo or its release-selection behavior.

**Scoped deployed checks and product boundaries — supported with the image gap retained.** The hosted observer examined actual stable main and the exact preview; the stable side remains the prior shell. Documentation example execution is separate. Code remains within documentation production/checks and consumes shell deployment; no engine build, package API or distribution publication was added. The requested npm menu link is absent and belongs to a separately proposed shell revision, outside this examined Change. The new badge and its small theme CSS remain documentation presentation refinements. Primary deployed results are available at the Site run above, artifact `site-live-38761660072`, file `live-pages.json`; the implementation of those checks is [browser.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/59579009a077d0c405489fbb341fa0ac3ba8a65d/tools/site/browser.mjs), lines 12–111. Passing checks on external badge URLs did not exercise a copied local image.

**Dependencies and limits.** Local runs used the locked renderer and qualified browser harness. Local Git is a clean committed reconstruction with an exactly matching tree, not the GitHub commit identity itself; this distinction and the remote identities are detailed below. Code, test definitions and verification probes share repository/assistant authorship. The browser exercises a rendered public surface, but its expected manifest is produced by the same preparation code; shared mistakes can escape both. The published archive supplies separately identified bytes, while its execution still depends on repository-authored checks. Hosted artifacts are retained for 30 days. Earlier container DNS/proxy-certificate failures described in Apply evidence are not successful public-browser evidence; this invocation used the downloaded hosted primary result instead.

**Institutional consequence.** Contractual coverage is 100% in both directions; realization is incomplete for relative images. Correct V1 and renew its compiler/browser checks before another Verification. This invocation implements no repair, synchronization, archive, merge or publication.

## Detailed verification record

### Inputs, identity and procedure

The current repository-owned `42p-verify-change` composition and generated `openspec-verify-change` skill were read and followed. The official skill was present with `generatedBy: 1.14.0`; nothing was installed, restored or refreshed during Verification. The generated workflow selected `site-docs` from the active Change list; `status` resolved `spec-driven`, and `instructions apply --change site-docs --json` returned proposal, delta spec, design and tasks under this checkout's confirmed `.42p/openspec/changes/site-docs/`. All returned artifacts and required context were read. There was no additional operation guidance.

Remote candidate: `59579009a077d0c405489fbb341fa0ac3ba8a65d`, PR #58, branch `propose-site-docs`, committed tree `7f1a882b9ad2bd76e9b202f0a92082bb45c7105a`. Before authoring this report the local checkout was clean and committed at reconstruction `dc7ea906f66f92ad71c99526c735fdcb17e219ae`, with exactly the same tree. This receipt binds reviewed file bytes to the GitHub candidate without claiming equal local Git history. Negative fixtures used isolated temporary copies and did not modify reviewed sources. Local runtime dependency state was separately checked by the launchers. Git-derived local link metadata uses the reconstruction identity; actual hosted results below use the real GitHub identity.

Allocation SHA-256: `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`. Site Capture SHA-256: `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`. Both match the recorded Change inputs. The scoped Site contract has direct Site Capture provenance; a recursive Distribution historical-SPEC audit is not part of this invocation.

### Control 1 — allocation ↔ Change: passed

The complete unit, neighboring shell/demo boundaries, selected Capture passages and all proposal/requirements/scenarios/design/tasks were read independently in both directions. The existing [correspondence record](coverage.md), “Forward correspondence” and “Reverse correspondence”, remains valid for all seven contribution groups: presentation in the common mobile envelope; dedicated single-source Usage/instructions/example; rendering/links/images; independent updates preserving demo identity; post-shell independence; documentation/Pages/example checks; and package/publication/acceptance boundaries. Requirements 1–5 map back to those contributions, with technical refinement permitted by Q-realization. Conditions, separation of example/demo versions, unavailable-evidence handling and downstream ownership survive the derivation. No unallocated product obligation or omitted unit obligation was found in this examined mapping. The image failure is an implementation gap, not missing contractual coverage. Both directions are 100%.

### Control 2 — generated OpenSpec verification: failed

| Dimension | Result |
| --- | --- |
| Completeness | 8/8 tasks checked; all five ADDED requirements have identifiable implementation. V1 shows that the completion marks for the image-related portions of 1.2/1.3 overstate established behavior. |
| Correctness | All thirteen scenarios examined against code and suitable evidence. Current-source rendering, links, pinned example, independent integration and deployed identity have support; the relative-image branch of “Resolve files and images from the authored location” fails. |
| Coherence | Build-time preparation, two explicit mappings, locked token renderer, separate pinned example and existing observer integration follow the design. Local-image asset emission diverges at the compiler boundary (V1). Naming, module organization and dependency placement otherwise follow the existing tooling pattern in the reviewed files. |

Implementation/scenario locators at the checked candidate:

- **Single-source public documentation**: `tools/site/prepare.mjs:45–73`, `tools/site/docs.mjs:21–67`; real renderer fixture `tools/site/checks/docs.test.mjs`, test “real renderer tokens and independent doc edits”, both bases; current-source output also examined in hosted `live-pages.json`.
- **Systematic documentation link resolution**: `tools/site/docs.mjs:70–130`; offline test “source-relative destinations, images, queries and anchors” and real-renderer fixture cover mappings, source directories, queries/fragments, repeated headings, external boundaries, literals and negative local targets. They inspect prepared files/strings, not compiled local-image behavior. V1 adds the missing real compiler observation and fails this branch.
- **Explicit published-version example**: `tools/site/docs-example.json`, `tools/site/example.mjs:14–85`, `docs/usage.md`, and `tools/site/tests/example.test.mjs`; source/selection/version agreement, unavailable dependency and inconsistent digest/version cases were renewed, as was actual browser execution. Ordinary construction does not call example acquisition or resolve a floating release. JavaScript errors or absent results cannot satisfy the final browser assertions; there is no synthetic fallback.
- **Independent documentation integration**: `prepare.mjs:45–86`, existing runtime inventory/output checks, `tools/site/exercise.mjs`, and its thirteen exact-candidate hosted results. Absence of a demo leaves no selection acquisition; docs-only edits with a supplied synthetic selection retain its digests. The example state lives in `.work/docs-example`, separate from demo inputs.
- **Scoped deployed documentation checks**: `tools/site/browser.mjs:12–111`, `tools/site/observe.mjs`, and `.github/workflows/site.yml`. The hosted primary result proves exact candidate identification and successful current-document checks. Before/after publication-record comparison detects a replaced shared deployment. Local and hosted evidence are distinct; missing required example/deployment evidence cannot become a pass. V1 remains blocking despite the current public content passing.

**V1 — CRITICAL: valid copied relative images fail real construction.**

Reproduction used this candidate's `build({root})` in an isolated copy of `site/`, the exact installed locked dependencies, and these valid documentation inputs:

```markdown
# Presentation

![Image](docs/picture.svg)
```

Usage was `# Usage` followed by `Guide.`. The existing `docs/picture.svg` was a regular file containing:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="blue"/></svg>
```

Stable construction failed with `Rollup failed to resolve import "/sqlite-vector-wasm/docs-assets/docs/picture.svg"`. Repeating with preview branch `verification` and checked commit as explicit preview identity failed with `Rollup failed to resolve import "/sqlite-vector-wasm/preview/docs-assets/docs/picture.svg"`. A filename with an encoded space also failed; the simple filename already establishes the defect. Existing generated output was removed on failure as intended. These are expected-success fixtures; their failure is not a deliberately broken-file success test.

The resolver copies the valid file below generated `public/docs-assets/` and returns an already deployment-prefixed image URL at `docs.mjs:123–127`; the rendered HTML is then compiled by VitePress at `build.mjs:28–30`. The actual compiler treats that emitted URL as an unresolved import. This explanation joins observed output and code examination; no claim is made that every image form fails. Current README badges use external URLs and are not this failing branch.

Correction: make emitted local-image URLs compatible with VitePress asset handling, then add a real compiler/browser fixture with a copied relative SVG under both bases, including URL encoding, and repeat Verification. Merely externalizing an unresolved import without demonstrating that the emitted image loads would not establish conformity. No corrective code or task rewriting was performed in this invocation.

No separate WARNING or SUGGESTION is raised. The missing compiler/image test is part of V1, not a second counted issue. No applicable generated-workflow check was skipped; the failed branch prevents a clean result. Official assessment: one critical conformity issue; resolve before archive. The generated skill's advisory archive wording does not supersede the 42P verdict.

### Control 3 — checks and applicable tests

Renewed against the clean matching candidate snapshot:

- `sh tools/openspec.sh check`: passed, locked OpenSpec 1.14.0 and generated metadata conform. `list --json` confirmed this checkout's `.42p`; `status` and `instructions apply` resolved the reviewed artifacts and task evidence.
- `sh tools/check-repository.sh`: passed canon byte identities, Capture/Allocation input identities and repository integrity.
- `sh tools/test-repository.sh`: all registered suites passed: 95 Python tests and 198 Node tests (293 total), none skipped in the reported suites. These are suite executions, not full product acceptance.
- `node --test tools/site/checks/*.test.mjs`: both real-renderer fixtures passed with the locked dependencies. Together with the 27 site tests in the registered command, 29 scoped tests passed; they did not compile the copied-image case.
- `sh tools/openspec.sh exec validate site-docs --strict`: passed structural validation.
- `bash tools/harness.sh exec sh tools/site.sh example`: renewed actual published-archive execution passed using Node 24.19.0, locked Playwright-core 1.63.0 and Chrome 153.0.8010.12, with harness tool identities verified. Archive SHA-256 `5074eb9462ea4cf9eb92a198ed184e1d0949e3a1c7694eb72f40669a4efda775`, publication JSON SHA-256 `6cb17fa09a8472c5ff9adcb2b8ed7f82b53e3f68e4ec17c6ff041c508fbf4d8c`, guide SHA-256 `a7bb4732ff4698715a90197413f940a010f49c47d294d3c6a58c0a11f7298feb`, extracted snippets SHA-256 `18a7d787f1504954bd37b94884545b08a85d31f220cf1405e98e4df3307ce25d`. Observed SQLite `3.54.0`, sqlite-vec `v0.1.9`, and `[[1,0],[2,1.4142135381698608]]`; 0 and sqrt(2) within 1e-6, all eleven runtime hashes unchanged.
- Qualified temporary-fixture commands `.work/verification-site-docs/probe-simple-image.mjs` and `probe-preview-image.mjs`: failed real builds for the valid SVG case above. These targeted scenario checks make `applicable_tests: failed`, despite the registered suites passing. The encoded-space variant failed as well.

Reused exact-candidate primary execution evidence, downloaded and read in this invocation:

- [Site run 38761660072](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38761660072), successful build/deploy/observe, `head_sha` equal to the checked candidate.
- Artifact `site-live-38761660072`, ID `11985941738`, file `live-pages.json`: public stable main `65623405a6f8360e0d634ebcfa45cfb2be918083`, preview `propose-site-docs` at `59579009a077d0c405489fbb341fa0ac3ba8a65d`; each side has six direct visits and six client transitions at 1280px/390px. Preview documentation hashes match README `7bc8abca02036495693be679cddd5767dfa603f88ce118564fd1b7c95ea1e4c7` and Usage `a7bb4732ff4698715a90197413f940a010f49c47d294d3c6a58c0a11f7298feb`. The stable side reports no documentation, matching the previous shell.
- Artifact `site-checks-38761660072`, ID `11986371518`, files `site/exercise.json`, `site/assembled.json`, `pages/site-publication.json` and `docs-example/result.json`: thirteen integration outcomes, assembled/publication identities and the matching pinned-example result were examined. The checks record uses the candidate source/runtime configuration; it does not establish an independent image oracle.

Raw renewed logs, probes, downloaded ZIPs, extracted primary results and ignored fixture state remain under `.work/verification-site-docs/`. The linked hosted run and explicit artifact/file locators provide access to reused primary results while retained. For the new negative reproduction, this durable report supplies the exact input, command boundary, checked source, observed compiler messages and correction; its account is not a link to an externally hosted raw result.

The supported conclusion is scoped to `A-site_docs` and this candidate. Coverage remains 100%/100%; OpenSpec correctness and applicable scenario execution fail on V1. No archive, merge, product acceptance or publication authorization follows.
