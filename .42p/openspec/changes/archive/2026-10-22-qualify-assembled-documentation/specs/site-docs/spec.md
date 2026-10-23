## MODIFIED Requirements

### Requirement: Scoped deployed documentation checks

Documentation checks SHALL verify source fidelity, rendered links/images/anchors and mobile presentation on the exact locally served assembled Pages artifact. Minimal-example execution SHALL remain separate against its exact qualified candidate or matching published runtime. Release-candidate eligibility SHALL require matching successful documentation checks and completed preview deployment. Missing, stale or failed evidence SHALL remain ineligible; public HTTP observation SHALL NOT gate qualification.

#### Scenario: Observe actual Pages documentation
- **WHEN** the complete Pages artifact is served locally at its stable/preview prefix
- **THEN** real-browser checks identify the exact candidate and verify both documents, navigation, links, images and anchors at desktop/mobile widths before deployment

#### Scenario: Completed deployment with unavailable public reads
- **WHEN** matching local documentation/example checks and preview deployment completed successfully but public reads are unavailable
- **THEN** documentation qualification remains successful without an additional public observation

#### Scenario: Local checks without a public deployment
- **WHEN** local rendering alone succeeds but applicable assembled browser/example evidence or completed preview deployment is missing, stale, mismatched or failed
- **THEN** integration remains ineligible; local results do not fabricate either the missing qualification or a successful deployment
