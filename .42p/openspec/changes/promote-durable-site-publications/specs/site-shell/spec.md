## MODIFIED Requirements

### Requirement: Bounded Pages deployment

Relevant internal PRs SHALL deploy one shared preview beside a stable root from an eligible public documentation revision. Relevant main-branch pushes and manual main-branch redeployments SHALL publish only an eligible stable site. Candidate documentation SHALL become eligible only after matching complete distribution publication; an ordinary documentation-only revision remains eligible when its announced version is already published. All deployment paths SHALL preserve the previous public documentation during failed, pending or partial candidate publication, including stable roots assembled for other PR previews. Unknown eligibility SHALL stop deployment without changing Pages. Fork PRs SHALL build and check without deployment. Applicable Site checks and internal preview deployment SHALL block human integration through the existing required acceptance context. Publication SHALL prevent obsolete runs from restoring an older stable root and SHALL NOT publish distributions or implicitly refresh the demo.

#### Scenario: Internal pull request preview
- **WHEN** an internal pull request changes the site or its integration inputs and `main` contains the site
- **THEN** the proposed construction and applicable shell checks run, a separate checkout of the eligible public revision builds the stable root, and one complete Pages artifact publishes that root beside the candidate at `/preview/` relative to the project prefix

#### Scenario: Preview identity and navigation
- **WHEN** a visitor opens a preview destination
- **THEN** the candidate branch and exact commit are visible, that page declares robots `noindex`, and its common navigation and assets resolve within the preview prefix without applying preview identity or `noindex` to the stable root

#### Scenario: Fork validation
- **WHEN** a pull request comes from a fork
- **THEN** its proposed build and applicable shell checks run without deploying Pages or receiving publication credentials

#### Scenario: Preview-only bootstrap
- **WHEN** a relevant internal PR introduces the site's first implementation and `main` does not yet contain the site
- **THEN** the artifact publishes only the candidate under `/preview/`, without inventing a stable root or treating an existing stable site's build failure as absence

#### Scenario: Integrated or manual deployment
- **WHEN** a relevant integrated main-branch change or manual main-branch redeployment is processed
- **THEN** the dedicated workflow selects an eligible revision, builds and validates it before deploying a complete stable-only Pages artifact with its supplied demo selection preserved and no preview

#### Scenario: Shared preview replacement and unmerged closure
- **WHEN** another eligible candidate is deployed or an internal PR closes without merging
- **THEN** a new candidate replaces the single shared preview, while closure alone performs no cleanup or deployment and leaves existing content until the next deployment

#### Scenario: Concurrent publication
- **WHEN** eligible main and PR executions overlap or a prepared artifact's stable revision becomes obsolete
- **THEN** publication is serialized, an obsolete artifact cannot restore an older stable root, and the published stable and candidate revisions can be identified

#### Scenario: Relevant input filtering
- **WHEN** site sources, site tooling/dependency records, the site workflow, README, Usage or integrated demo preparation inputs change
- **THEN** the site workflow is triggered, while unrelated source edits alone do not trigger automatic site deployment

#### Scenario: Merged candidate awaits publication
- **WHEN** main contains candidate documents but release is pending or failed and a main push, manual redeployment or another PR preview is processed
- **THEN** unpublished documentation cannot replace the stable root; the previous eligible public source is resolved from bounded Git history and reverified using durable publication records, or deployment stops leaving current Pages unchanged if it cannot be established; no public Pages record is required

#### Scenario: Matching publication completion
- **WHEN** a release completion signal requests stable promotion
- **THEN** repository/run/revision/archive/publication and document-check identities are verified using the matching finalized Release and durable receipt for new publications, without downloading expiring CI artifacts, both destinations are complete, and only the matching eligible site is deployed under final freshness/concurrency guards

#### Scenario: Stale or unrelated completion
- **WHEN** a completion event or artifact is stale, from another repository/run/revision or only nominally successful
- **THEN** no stable promotion occurs and no unsafe artifact or unpublished main content is trusted

#### Scenario: Required integration result
- **WHEN** applicable Site qualification or internal preview deployment is missing, skipped unexpectedly or failed
- **THEN** the existing required acceptance context fails through its dependency on Site, so a green product qualification alone cannot permit merge

### Requirement: Scoped shell verification

Shell checks SHALL cover construction/navigation, mobile presentation, stable/preview prefixes, independent integration, runtime preservation and bounded deployment scenarios. Navigation and common integration SHALL be checked on the exact locally served assembled Pages artifact against the identified candidate. Completed official Pages deployment SHALL establish deployment success without a public HTTP observation gate. These checks SHALL complement rather than replace documentation checks, vector-demo checks or distribution acceptance.

#### Scenario: Before a real demo exists
- **WHEN** shell verification uses representative documentation and demo fixtures
- **THEN** it exercises both independent integration paths and compares release identity and runtime asset digests across a documentation-only rebuild, without claiming real published-WASM or vector execution evidence

#### Scenario: Deployed integration check
- **WHEN** a candidate preview of the shell is prepared for GitHub Pages
- **THEN** its assembled destinations, common assets and navigation are checked locally at the actual preview prefix and identified commit, with stable-root separation when present, and the official deployment must explicitly complete; missing browser/deployment prerequisites or failed deployment remain blocking

#### Scenario: Expired CI evidence after completed publication
- **WHEN** Site rebuilds an already delivered matching publication after its Actions artifacts expire
- **THEN** its durable Release receipt/manifest and exact archive remain sufficient to establish publication completion and acquire the selected runtime, without a release-outcome artifact or a new distribution publication

#### Scenario: Invalid durable completion
- **WHEN** a new publication lacks its declared receipt, the Release is draft or a required subject/archive/manifest/asset differs
- **THEN** stable promotion is rejected without legacy fallback or a public URL substituting for proof

#### Scenario: Historical publication and bounded inspection
- **WHEN** a pre-receipt publication is needed by an existing historical source
- **THEN** existing read-only destination/identity inspection remains distinguishable, requires matching actual publication and archive, and neither fabricates a new receipt nor reads expiring CI artifacts
