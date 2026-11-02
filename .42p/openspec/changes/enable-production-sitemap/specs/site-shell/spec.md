## ADDED Requirements

### Requirement: Production-only sitemap

The stable site SHALL expose a valid XML sitemap listing its public pages under the stable origin and project prefix. New public pages SHALL enter the sitemap automatically. Preview builds SHALL emit no sitemap and SHALL retain robots `noindex`. Assembly SHALL preserve the stable sitemap without preview URLs. Existing site behavior SHALL remain unchanged.

#### Scenario: Stable discovery follows public pages
- **WHEN** the production site is compiled, including an additional public page
- **THEN** sitemap.xml lists all those pages at their stable URLs, with no duplicate project prefix, foreign origin or preview URL

#### Scenario: Preview remains unindexed
- **WHEN** a preview is compiled from the same site sources
- **THEN** it emits no sitemap.xml, all preview pages retain robots noindex and stable pages have no preview noindex

#### Scenario: Stable and preview assembly
- **WHEN** the independently built stable root and candidate preview are assembled for Pages
- **THEN** the stable sitemap is preserved byte for byte, remains valid and contains no preview URL, and preview/sitemap.xml is absent

#### Scenario: Stable-only and preview-only publication
- **WHEN** a stable-only artifact or preview-only bootstrap artifact is assembled
- **THEN** the stable-only artifact retains the production sitemap, while the preview-only artifact invents neither a production sitemap nor a preview sitemap

### Requirement: Sitemap output qualification and documentation

The existing site verification chain SHALL check emitted sitemap XML, public destinations, stable URL scope, preview absence and assembled preservation using real compiler outputs. The site contributor guide SHALL identify the sitemap location and preview policy.

#### Scenario: Existing site qualification
- **WHEN** the existing site compiler exercise runs
- **THEN** it parses actual generated XML and checks public-page coverage, production/preview separation and the assembled artifact without an additional workflow or dependency

#### Scenario: Contributor guidance
- **WHEN** a contributor reads the site guide
- **THEN** the production sitemap URL, automatic generation, preview exclusion and relevant verification command are documented
