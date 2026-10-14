# Spec Delta

## Purpose

Realize A-notifications for Watch by applying the instituted result rule and delivering a short Resend email to Gmail that points to the reference GitHub run.

## ADDED Requirements

### Requirement: Actual producer result consumption

Notifications SHALL consume A-watch's actual result, technical outcome and concerned run reference after reference Summary simplification. Discovery, upstream eligibility, candidate inspection, forecasts and reference restitution SHALL remain with A-watch; notifications SHALL NOT duplicate them or redefine planning outcomes.

#### Scenario: Completed producer handoff
- **WHEN** Watch has successfully produced its reference result and Summary
- **THEN** notification selection uses that actual result and concerned run, without another discovery, candidate read or planning calculation

#### Scenario: Producer failure
- **WHEN** discovery, state reading, calculation, presentation or evidence production fails
- **THEN** the failure remains a technical failure and is not transformed into a successful or empty notification input

### Requirement: Closed plan notification rule

Each successful planning execution producing a complete nonempty plan SHALL trigger exactly one plan email. A complete empty plan or a planning error SHALL trigger no project-controlled notification. No additional relevance criterion SHALL be applied; existing preparations or open PRs SHALL NOT suppress notification of any complete nonempty plan.

#### Scenario: Nonempty complete plan
- **WHEN** planning succeeds with one or several eligible pairs
- **THEN** exactly one plan email is triggered for that execution, rather than one email per pair

#### Scenario: Existing candidates cover part or all of the plan
- **WHEN** successful complete nonempty planning includes preparations or PRs for some or all pairs
- **THEN** exactly one plan email is triggered without filtering those pairs for notification

#### Scenario: Normal empty plan
- **WHEN** planning successfully produces a complete empty plan
- **THEN** no project-controlled notification is triggered and planning remains successful

#### Scenario: Failed or incomplete planning
- **WHEN** planning fails or does not complete successfully
- **THEN** no project-controlled notification is triggered, including when partial eligible pairs were available

### Requirement: Trigger invariance and fresh execution mail

Scheduled and manually dispatched Watch executions SHALL apply the same notification rule. Every new eligible execution SHALL produce its own fresh plan email, even for recurring proposals. No trigger filter, cross-execution notification deduplication or history of sent plans or emails SHALL be introduced.

#### Scenario: Both invocation types
- **WHEN** scheduled and manual executions each produce a successful complete nonempty plan
- **THEN** each execution triggers its own single plan email under the same rule

#### Scenario: Repeated plan
- **WHEN** a later eligible execution repeats some or all previously presented proposals
- **THEN** it triggers a fresh plan email without consulting or storing sent-plan history

### Requirement: Short reference-linked message

The plan email SHALL remain short, indicate the availability of a new plan and link to the concerned GitHub run. The producer's Job Summary and artifacts SHALL remain the reference for the complete plan and diagnostics; the email SHALL NOT reproduce the full plan or technical diagnostics.

#### Scenario: Several pairs and diagnostics
- **WHEN** a successful complete plan contains several pairs and associated reference detail
- **THEN** a single short availability message links to that execution, while pair details and diagnostics remain in GitHub

### Requirement: Bounded Resend delivery

Plan emails SHALL be sent through the Resend API to the configured Gmail recipient using a dedicated sender domain. No Gmail SMTP, global CI notification mechanism, issue, comment or mention workaround SHALL be used. GitHub account-controlled notifications and preferences SHALL remain outside scope. This integration SHALL serve only Watch without a general notification service or framework.

#### Scenario: Configured eligible execution
- **WHEN** an eligible Watch execution has the required Resend deployment configuration
- **THEN** its short plan email is sent through Resend to the configured Gmail recipient

#### Scenario: Account-controlled GitHub notification
- **WHEN** GitHub additionally notifies the account according to its preferences
- **THEN** that behavior supplies no project notification mechanism, suppression duty or account-setting operation

#### Scenario: Notification does not initiate adoption
- **WHEN** a plan email is sent
- **THEN** no candidate preparation, repository mutation, merge or publication is initiated and no notification policy is added to another workflow
