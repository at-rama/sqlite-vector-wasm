## ADDED Requirements

### Requirement: Temporary static demo placeholder

During the temporary refactoring phase adopted under S-demo-placeholder, the Démo destination SHALL show only a short notice that the demonstration is being refactored for SQLite-Vector and a working link to current Usage, without a delivery date or claim of working vector execution. Common navigation and mobile access SHALL remain usable. The placeholder SHALL NOT initialize, acquire, bundle or execute a demo runtime, Worker or emoji corpus, display simulated results or report runtime/version observations. Active Site preparation, build, deployment and checks SHALL NOT require the abandoned demo pin/assets, corpus preparation, a replacement published Vector archive or completion of PR #77. Existing shell/docs publication and check guarantees and product acceptance SHALL remain applicable.

For this temporary phase only, this requirement supersedes the runnable portions of Explicit published stable runtime, Visible runtime identity, Complete attributed emoji corpus, Binary-first and deferred Float32 modes, Textual discovery and vector exploration, Actual-operation inspection, Transient browser session and usable states, and Scoped real-runtime demo checks. Those requirements remain deferred for the separate future demo return, with native SQLite-Vector adaptation, actual published stable bytes and full independent qualification; placeholder checks SHALL NOT count as their successful execution. Neither the future demo nor its publication dependency SHALL block cleanup completion. This exception introduces no second runtime, compatibility layer or configurable demo mode.

#### Scenario: Open the temporary demo destination
- **WHEN** a visitor opens Démo through common navigation on desktop or mobile
- **THEN** the static SQLite-Vector refactoring notice and Usage link are usable, without runtime identity, search controls, simulated results, demo runtime/Worker/corpus loading or a promised delivery date

#### Scenario: Construct and deploy without a replacement demo
- **WHEN** stable or preview Site construction, deployment or an independent documentation rebuild occurs during the placeholder phase
- **THEN** no old demo runtime/data preparation, archive acquisition or PR #77 completion is needed, the placeholder remains intact without reactivating old assets, and applicable shell/docs publication gates and checks remain enforced

#### Scenario: Verify the placeholder and retain future qualification
- **WHEN** local and identified Pages placeholder checks are recorded
- **THEN** they verify the notice, Usage link, common navigation/mobile access and absence of demo runtime/Worker/corpus dependencies and requests; runtime/vector checks remain explicitly deferred rather than passed, and the future complete demo still requires its separate published-stable/native-Vector qualification before return
