## MODIFIED Requirements

### Requirement: Bounded Pages deployment

Relevant internal PRs SHALL deploy one shared preview beside a stable root from an eligible public documentation revision. Relevant main-branch pushes and manual main-branch redeployments SHALL publish only an eligible stable site. Candidate documentation SHALL become eligible only after matching complete distribution publication; an ordinary documentation-only revision remains eligible when its announced version is already published. All deployment paths SHALL preserve the previous public documentation during failed, pending or partial candidate publication, including stable roots assembled for other PR previews. Unknown eligibility SHALL stop deployment without changing Pages. Fork PRs SHALL build and check without deployment. Publication SHALL prevent obsolete runs from restoring an older stable root and SHALL NOT publish distributions or implicitly refresh the demo.

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
- **THEN** unpublished documentation cannot replace the stable root; the previous eligible public source is retained, or deployment stops leaving current Pages unchanged if it cannot be established

#### Scenario: Matching publication completion
- **WHEN** a release completion signal requests stable promotion
- **THEN** repository/run/revision/archive/publication and document-check identities are verified, both destinations are complete, and only the matching eligible site is deployed under final freshness/concurrency guards

#### Scenario: Stale or unrelated completion
- **WHEN** a completion event or artifact is stale, from another repository/run/revision or only nominally successful
- **THEN** no stable promotion occurs and no unsafe artifact or unpublished main content is trusted
