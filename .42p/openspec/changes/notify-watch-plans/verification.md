---
schema_version: 1
change: notify-watch-plans
allocation_unit: A-notifications
checked_commit: 785c2ff1e5e96ce2b9b3c411452e6985b27892e8
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification — notify-watch-plans

## Vue pour institution

**Conclusion située.** La Verification de `notify-watch-plans`, limitée à `A-notifications`, est **passed** sur le candidat propre et commité [785c2ff](https://github.com/at-rama/sqlite-vector-wasm/commit/785c2ff1e5e96ce2b9b3c411452e6985b27892e8). Les trois contrôles ont été exécutés, avec renouvellement local des suites et consultation des [résultats CI du même candidat](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496). Les preuves établissent le comportement du code et de l'intégration examinés avec un transport injecté ; elles n'attestent aucun envoi réel, configuration Resend effective, réception Gmail ou notification Android. Les logs CI sont accessibles ; les logs locaux sont temporaires et leur compte rendu figure ci-dessous.

**Provenance de la commande.** L'[unité A-notifications examinée](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md#L70-L76) attribue conditions, message et acheminement. Ses références qualifiées ont été confrontées aux passages de la [Capture Notifications](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/.42p/engineering/2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md), sections C-status, C-summary, C-noise, O-resend et C-trigger, et aux contributions notifications D/W C-watch, D/R-updates et W/R-frugality. Les sources S-notifications, S-reconciliation, S-allocation et S-notification-rules sont identifiées par ces projections ; aucun audit indépendant de leur corpus original n'a été effectué. La couverture établit la correspondance de l'unité avec le Change, sans instituer les décisions ni prouver toute la chaîne amont.

**Consommer le résultat réel, après le Summary simplifié.** Conformité soutenue par examen du [workflow et de sa garde de succès](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/.github/workflows/watch.yml#L23-L42), puis par les tests renouvelés et les [exécutions CI des cas de handoff](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496), intitulés « actual producer records reach the sender CLI under both triggers » et « actual producer empty and discovery/state/calculation/presentation/evidence failures cannot send ». Le sender reçoit le record réel du producteur, sans nouveau calcul ni inspection des candidats. Les définitions utilisent le producteur réel avec des services amont simulés. Le préalable historique Summary est étayé par la vérification archivée indiquée dans le détail ; son PASS n'est pas réutilisé comme preuve du sender.

**Un mail par plan éligible, silence pour vide et erreur.** Les [branches du consommateur et l'appel unique](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/notify.mjs#L5-L42) correspondent à la règle fermée. Dans les [résultats CI](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496), les cas « one short Resend request per execution under either trigger, including partial/all existing candidates » et « empty and failed results send nothing without requiring mail configuration » passent. Ils observent une requête pour les exemples non vides et aucune pour les entrées vides/échouées, candidats partiels ou complets compris. L'examen du chemin de code complète ces exemples : aucune donnée candidat ne participe à la sélection et aucun appel n'existe avant les retours de silence.

**Même règle pour les triggers et mail frais sans historique.** Conformité soutenue par les cas exécutés des deux triggers et de récurrence, notamment « identical recurring plans produce independent fresh mail without history », visibles dans les [logs CI](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496). La [définition du cas de récurrence](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/tests/notify.test.mjs#L34-L39) attend deux appels et des liens de runs distincts. L'examen du sender constate le même chemin après validation du contexte, sans filtre propre à un trigger, cache, écriture d'historique ou retry. Les exemples finis ne prouvent pas le comportement d'un fournisseur arbitraire ; ils sont complétés par cette structure sans état.

**Message court et restitution de référence dans GitHub.** Le [texte effectivement construit](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/notify.mjs#L32-L35) contient disponibilité, nombre de couples et lien du run, sans plan ni diagnostics. Le test de requête vérifie contenu, absence des versions/candidats et taille inférieure à 300 caractères pour ses exemples. Les cas CLI vérifient aussi que result.json et le Summary fourni restent inchangés après succès ou erreur d'envoi ; leurs résultats figurent dans les [logs CI](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496). La forme fixe du texte évite une croissance proportionnelle aux détails du plan ; 300 caractères n'est pas une limite produit instituée.

**Acheminement Resend borné et frontières conservées.** L'examen de l'[appel HTTP et des erreurs](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/notify.mjs#L28-L57) et du workflow constate un seul endpoint Resend, les trois noms de configuration fournis, aucun SDK, SMTP, mécanisme issue/comment/mention, service général ou déclenchement de préparation/publication. Les tests de configuration, rejet/timeout/réponse ambiguë et sortie CLI passent dans les [résultats CI](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496). Le secret et les réponses brutes ne sont pas reproduits dans la sortie du CLI. Cette preuve porte sur la requête et ses contrôles avec un fournisseur simulé ; l'acceptation effective et la livraison restent non observées, dépendantes de la configuration et du service externes. Le code distingue acceptation et réception et traite l'acceptation inconnue sans renvoi automatique.

**Dépendances et limites communes.** Code, tests, compte rendu Apply et présent rapport ont une origine agentique commune. La CI apporte une autre infrastructure d'exécution, mais les mêmes assertions et fixtures ; elle n'est pas une preuve indépendante du modèle de plan ni de la livraison. Les tests CLI franchissent une frontière de processus et consomment le record produit, tout en injectant fetch et les services amont. La garde GitHub est examinée et testée comme configuration ; aucun run Watch hébergé n'a été dispatché. Le préalable Summary repose sur une preuve historique, pas une nouvelle qualification complète d'A-watch. Les préférences du compte GitHub demeurent hors périmètre.

**Conclusion pour institution.** Les correspondances, l'examen de réalisation et les contrôles exécutés ne montrent pas d'écart à corriger dans le périmètre d'A-notifications. Le verdict prépare Archive sous les limites précédentes ; il ne constitue ni acceptation produit complète, ni autorisation de merge/publication, ni attestation de réception. Aucun Apply correctif, Sync, Archive, dispatch ou envoi réel n'est effectué par cette invocation.

## Détail des trois contrôles

### 1. Allocation ↔ Change

Snapshot Allocation : `ed381776c7b45d559640174b66155947f9c2ec1537a6896ab24a539c660e441e`. Les empreintes Notifications `a2b1fe9cd3ae4c0df5ef884b1829ca86705f63d7a12868bd5cd65bc4a6439668`, Distribution `e1a3d3beb5e025630a6dc5d5d26ce3f3cb08e7da0858a115d3584eaa1476f718` et Release/Watch `1b4f23f3df25f73ec7d8da9ca5ad3015dfd9a23b154424878b80eeb0bb64ce94` correspondent aux fichiers examinés. Leurs identités ne sont pas une preuve de fidélité aux originaux.

Les cinq lignes de la [correspondance commise](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/.42p/openspec/changes/notify-watch-plans/coverage.md), sections « Bidirectional semantic mapping » et « Apply correspondence », ont été recontrôlées contre proposal.md, la spécification, design.md et tasks.md. Chaque obligation et exclusion de l'unité a un traitement contractuel ; chacune des cinq exigences a son fondement dans cette unité. Configuration, timeout, validation du record et échec technique d'envoi restent des choix de réalisation bornés. A-watch conserve découverte, candidats, forecasts, états techniques et restitution. Les deux directions restent **100 %**. Aucune sémantique upstream ne nécessite de révision dans cet examen.

Le préalable d'ordre des travaux utilise le [rapport historique Summary](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/.42p/openspec/changes/archive/2026-10-14-simplify-watch-job-summary/verification.md), verdict passed sur `abf1e86115b74769e89e532c01c4426394b86cc3`. Le producteur courant et le sender ont été lus séparément ; leurs exigences ne sont pas confondues. Les 15 blocs d'exigences upstream-watch restent byte-identiques au commit de Proposition `6245119`; seule sa notice explicative a changé. Les archives et Captures/Allocation ne sont pas réécrites.

### 2. OpenSpec verify

Skill officiel `openspec-verify-change`, généré par 1.14.0, disponible et lu avant les contrôles. `status --json` confirme spec-driven et les quatre artefacts ; `instructions apply --json` fournit les quatre contextFiles lus, sept tâches décrites, toutes terminées, sans tracking inaccessible. Ces constats de structure ne valent pas verdict à eux seuls.

| Dimension | Résultat des examens effectués |
| --- | --- |
| Complétude | Task Completion : 7/7, contenu réalisé examiné. Spec Coverage : cinq exigences ADDED présentes dans les chemins de réalisation. Aucun REMOVED/RENAMED. |
| Correction | Requirement Implementation Mapping : 5/5. Scenario Coverage : 12/12, par exécution offline et/ou examen des frontières explicites ci-dessous. |
| Cohérence | Design Adherence : handoff existant, garde de succès après artefact, Node natif, message court, configuration isolée, aucun état/retry. Code Pattern Consistency : modules .mjs, CLI séparé et node:test dans tools/watch, cohérents avec le dépôt. |

Localisateurs d'implémentation : `tools/watch/notify.mjs:5–26` (record/éligibilité/contexte), `:28–35` (configuration/message), `:36–57` (appel unique/erreurs) ; `tools/watch/notify-cli.mjs:4–16` (lecture/sortie/statut) ; `.github/workflows/watch.yml:23–42` (handoff/garde). Les tests correspondants sont [notify.test.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/tests/notify.test.mjs), [notify-cli.test.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/tests/notify-cli.test.mjs) et [notify-workflow.test.mjs](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/tools/watch/tests/notify-workflow.test.mjs). Ces liens donnent les définitions, pas les résultats d'exécution.

| Scénario du Change | Traitement vérifié |
| --- | --- |
| Completed producer handoff | Record produit réellement en fixture puis exécuté au CLI sous les deux triggers ; garde workflow examinée. |
| Producer failure | Records de découverte, état, calcul, présentation et preuve en échec : zéro requête ; garde success empêche l'étape après échec réel du producteur. |
| Nonempty complete plan | Une requête pour un et plusieurs couples, sortie d'acceptation simulée. |
| Existing candidates cover part or all of the plan | Matrice 0/1/3 candidats sur trois couples ; absence d'inspection candidat dans le sender. |
| Normal empty plan | Aucun appel ni besoin de configuration ; résultat et restitution préservés. |
| Failed or incomplete planning | Aucun appel, y compris record failed contenant un plan partiel ; handoffs incohérents refusés. |
| Both invocation types | Records du producteur au CLI pour schedule/workflow_dispatch ; même chemin et même compte d'appels. |
| Repeated plan | Deux invocations similaires produisent deux requêtes et deux liens ; absence d'état persistent constatée. |
| Several pairs and diagnostics | Texte court sans versions/candidats/diagnostics, lien du run ; nonmutation des fichiers. |
| Configured eligible execution | Requête POST vers l'endpoint Resend avec configuration synthétique, body/auth attendus ; acceptation simulée et erreurs testées. Pas d'observation live. |
| Account-controlled GitHub notification | Examen : aucune configuration de préférence, suppression ou API de notification GitHub ; aucune garantie account ajoutée. |
| Notification does not initiate adoption | Examen du sender et permissions : aucune opération de préparation, mutation GitHub ou publication ; seul POST Resend. |

Le [guide Watch vérifié](https://github.com/at-rama/sqlite-vector-wasm/blob/785c2ff1e5e96ce2b9b3c411452e6985b27892e8/docs/watch.md), sections « Plan email » et « Development checks », correspond aux noms, commandes et limites du code. Les liens locaux et leurs ancres sont résolus. L'intégration conserve les actions épinglées et la cadence ; la suite obligatoire est enregistrée dans tools/test-repository.sh. Les scenarios de frontière sont établis par examen du code/configuration plutôt que par simulation d'un changement des préférences utilisateur ou d'une publication réelle.

CRITICAL : aucun. WARNING : aucun. SUGGESTION : aucune. Aucun des six checks OpenSpec applicables n'est sauté ou marqué Not verified. Les preuves suffisent à la revue d'implémentation dans le périmètre indiqué ; elles ne revendiquent pas des propriétés de livraison externes non exercées. Le résultat OpenSpec est passed, sans correction silencieuse.

### 3. Contrôles du dépôt et tests applicables

Sur le candidat propre `785c2ff`, les commandes renouvelées ont terminé avec succès :

- `sh tools/check-repository.sh` : exit 0, identités canon et Capture/Allocation et contrôles repository réussis.
- `sh tools/openspec.sh exec validate --all --strict` : 9/9, aucun échec ; launcher verrouillé 1.14.0 et racine `.42p` confirmés. Les notices INFO préexistantes de longueur n'ajoutent pas d'obligation.
- `sh tools/test-repository.sh` : exit 0, toutes les suites enregistrées exécutées et réussies ; Watch 51 tests, zéro échec/skipped, dont 12 tests notification.

Environnement local : Node.js v24.19.0, Python 3.12.14, Git 2.51.1, Bash/tar/unzip/npm/compilateur système disponibles. Aucun outil ou skill n'a été installé, restauré ou rafraîchi pendant Verification. Les résultats locaux sont consignés dans ce rapport ; les logs temporaires ne sont pas des résultats hébergés.

Corroboration d'exécution du même candidat : le [job CI check](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935056994) et le [job CI tests avec logs consultés](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057496) sont success. Les logs tests contiennent les 51 cas Watch réussis, les cas CLI et notification nommés ci-dessus, ainsi que l'installation/préflight OpenSpec 1.14.0 et la validation 9/9. Il s'agit de CI de tests, pas d'un run Watch réel. Les suites locales ont été renouvelées ; le compte rendu Apply n'est pas utilisé comme substitut.

Les [logs du gate verification avant ce rapport](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935057119) et du [gate archive](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38588004614/job/115935056076) identifient le rapport manquant sur `785c2ff`. Ces gates d'intégration ne sont pas des prérequis à sa rédaction. Ce rapport doit entrer dans un commit ultérieur sans modification de réalisation ; Archive reste une opération séparée et le Change est encore actif.
