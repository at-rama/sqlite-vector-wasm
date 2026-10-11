# Distribution release delta

## MODIFIED Requirements

### Requirement: Complete publication state and uniqueness

Calculation/publication SHALL read Git distribution tags, npm versions and distinct channel HEADs with published provenance. Definitive identity SHALL be checked for uniqueness. An existing identity or concurrent collision SHALL fail without reuse, overwrite, reservation registry, application lock or alternative-version retry. Unavailable or contradictory required state SHALL NOT be treated as empty history. The shared npm-state interpretation SHALL recognize a registry placeholder only when its entry key and embedded version are exactly `0.0.0-stage`, its embedded package name matches the exact expected scoped package, and its `stub` marker is boolean `true`, after validating the top-level package identity and required metadata structure. The recognized placeholder SHALL remain distinguishable from package absence and SHALL NOT supply distribution history, numbering, channel references or completion evidence. Other unsupported versions or inconsistent placeholder metadata SHALL fail. A placeholder-only registry state SHALL NOT authorize an ordinary new-publication attempt; a `latest` or `next` reference to the placeholder SHALL block ordinary state-based calculation. Real distributions SHALL retain package identity, authoritative revision, provenance, channel, uniqueness and exact-byte checks. Initial completion SHALL remain read-only: missing real initial version remains pending, while completion requires that version on its expected channel with matching published evidence and bytes, independently of a recognized placeholder's presence.

#### Scenario: Existing or concurrently claimed identity
- **WHEN** the selected version/tag already exists or another publisher claims it after the check
- **THEN** publication fails without replacing it or choosing another version within that attempt

#### Scenario: Inaccessible or inconsistent history
- **WHEN** required publication state cannot be acquired completely or its version/channel/commit/composition references conflict
- **THEN** calculation fails rather than fabricating bootstrap state or trusting a partial snapshot

#### Scenario: Registry placeholder accompanies real distributions
- **WHEN** a recognized scoped `0.0.0-stage` placeholder accompanies coherent published stable or experimental distributions
- **THEN** all consumers of the common state use only the real distribution versions and qualified channel references for calculation and verification, without broadening the distribution version grammar or omitting checks on real entries

#### Scenario: Unsupported entry cannot masquerade as a placeholder
- **WHEN** `0.0.0-stage` lacks boolean `stub: true`, its entry/version/package identity conflicts, another unsupported version is present even with that marker, or a real distribution is marked as a stub
- **THEN** npm state fails explicitly rather than skipping that entry or reporting successful completion

#### Scenario: Placeholder-only package is not an absent package
- **WHEN** the registry contains the recognized placeholder but no real distribution version
- **THEN** ordinary preparation/publication-state acquisition reports an unready existing package and does not fabricate empty bootstrap history or authorize a new publication attempt

#### Scenario: Placeholder is a published channel reference
- **WHEN** `latest` or `next` points to the recognized placeholder
- **THEN** ordinary state-based calculation fails explicitly without silently deleting that channel, selecting a replacement HEAD or mutating dist-tags

#### Scenario: Initial completion with a remaining registry placeholder
- **WHEN** the recognized placeholder remains alongside the real initial `0.1.0` publication on `latest`, matching the accepted handoff and already published GitHub identity and archive
- **THEN** read-only completion can report complete success while still checking the real package identity, channel, source evidence, archive size and SHA-256, without changing either destination

#### Scenario: Placeholder does not complete the initial publication
- **WHEN** only the recognized placeholder exists or the real initial version is absent
- **THEN** initial completion remains npm pending; inaccessible or malformed metadata still fails rather than counting the placeholder as publication evidence

#### Scenario: Real publication is inconsistent despite a valid placeholder
- **WHEN** the recognized placeholder accompanies a real initial or normal publication with a wrong package identity, channel, revision, required provenance or archive bytes
- **THEN** the applicable completion/publication verification fails under its existing requirements, without publication repair or a complete-success claim
