# sqlite-vector-wasm — Notifications des workflows GitHub Actions

## Identité, périmètre et autorité

Capture dédiée aux notifications des workflows de sqlite-vector-wasm, en particulier A-watch. Elle projette les décisions et l'orientation fournies par l'utilisateur dans `S-notifications`, précisées par `S-reconciliation` et `S-notification-rules` ; elle ne constitue ni une autorité de décision indépendante ni une preuve de réalisation.

Cette source remplace explicitement, dans ce périmètre, le recours aux notifications natives de fin d'exécution pour signaler les résultats A-watch, l'acceptation des notifications de plans vides et l'exclusion d'un transport email dédié. Ces choix étaient projetés dans `C-watch` et `R-updates` de la [Capture Distribution](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), et `C-watch` et `R-frugality` de la [Capture Release/Watch](2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md). La révision découle du remplacement explicite de ces choix par la source utilisateur, pas de la seule date de cette Capture.

La découverte, le calcul du plan, la cadence et l'invocation manuelle, ainsi que les limites entre planification, préparation, intégration et publication restent inchangés par cette révision. Aucun état OpenSpec ni achèvement d'implémentation n'est déduit de la demande de capture.

## Décisions et raisons

### C-status — Séparer exécution et notification

Les workflows conservent leurs statuts techniques habituels. La notification utilisateur dépend de la pertinence du résultat produit, pas du seul statut `success` ou `failure`.

A-watch peut réussir en identifiant des mises à jour intéressantes ou sans rien trouver. Il ne faut ni notifier chaque succès ni provoquer artificiellement un échec pour obtenir une notification. Une erreur réelle conserve son statut d'échec. Un plan vide et une erreur ne déclenchent aucune notification interne, c'est-à-dire contrôlée par le projet. GitHub peut émettre des notifications supplémentaires selon les préférences utilisateur : ce comportement et ces préférences sont hors périmètre.

### C-summary — Garder la restitution dans GitHub

Les résultats restent dans GitHub, notamment dans le Job Summary et les artefacts associés. Les notifications sont courtes et renvoient vers le run concerné. Les détails techniques et les diagnostics restent ainsi accessibles sans encombrer le message.

Le premier chantier reste la simplification du Job Summary d'A-watch, en conservant les informations de plan exigées par les Captures Distribution et Release/Watch. Cette priorité ne définit pas encore sa nouvelle présentation et ne demande pas sa réalisation dans cette Capture.

### C-noise — Éviter le bruit des notifications CI

Ne pas prendre les notifications CI globales de GitHub Mobile comme mécanisme de notification interne d'A-watch, ni détourner les issues, commentaires ou `@mentions`. Les notifications supplémentaires que GitHub émet selon les préférences utilisateur sont hors périmètre, y compris pour les plans vides et les erreurs ; cette décision ne vise pas à les empêcher.

La source motive ce choix par l'absence de moyen simple de notifier un utilisateur selon le contenu métier d'un Job Summary et par le bruit possible des autres workflows. Cette justification est fournie par l'utilisateur ; elle n'est pas une vérification indépendante des capacités actuelles de GitHub. Elle ne demande pas de modifier les préférences du compte.

### O-resend — Canal cible Resend vers Gmail

L'orientation retenue est l'email transactionnel via Resend vers Gmail, avec un domaine d'expédition dédié tel que `notify.bourgeon.ovh`, administré chez OVH. Le sous-domaine cité reste un exemple, pas une configuration déjà établie.

La raison retenue est la simplicité d'un appel API depuis GitHub Actions ; Gmail assure la réception et la notification Android sans donner accès au compte Google protégé par Advanced Protection. Il s'agit du fonctionnement cible, sans preuve d'envoi, de réception ni de notification Android dans cette intervention. Ce choix ne rétablit pas l'ancienne solution SMTP Gmail.

### C-trigger — Notifier seulement lorsqu'une attention est utile

La règle instituée est simple : une planification réussie produisant un plan complet non vide déclenche un mail de plan. Un plan vide ou une erreur ne déclenche aucune notification interne. Tous les couples éligibles participent au plan, y compris ceux ayant déjà une préparation ou une PR en cours ; leur présence ne rend pas le plan non notifiable.

Chaque exécution éligible produit un seul mail de plan, quel que soit son déclencheur, planifié ou manuel. Aucun filtre par déclencheur n'est ajouté. L'absence de déduplication des notifications est volontaire : le plan est frais à chaque exécution et peut reprendre des propositions déjà présentées. Aucun historique des mails ou des plans envoyés n'est introduit pour supprimer ces répétitions. La prise en compte des candidats en cours et la prévention d'une préparation en double restent distinctes de l'envoi du mail.

GitHub Actions reste le lieu d'exécution et de restitution ; Resend → Gmail est le canal cible. Le mail reste court et renvoie au run. Cette règle définit le nombre de messages de plan attendu par exécution, sans instituer de mécanisme général de déduplication de transport.

## Ordre des travaux

Le premier chantier reste la simplification du Job Summary d'A-watch ; l'intégration Resend vient ensuite, sans infrastructure générale supplémentaire. Les anciens critères de pertinence et le cas manuel sont désormais résolus par `C-trigger` : ils ne constituent plus une condition ouverte avant l'intégration. Cette progression ne prouve ni configuration de l'expéditeur ni réalisation de l'envoi.

## Impacts documentaires à reprendre

La [spécification upstream-watch](../openspec/specs/upstream-watch/spec.md), notamment « Native completion notifications » et la frontière de fin de planification, conserve le contrat réalisé antérieur avec un avertissement de statut explicite et un renvoi à la cible actuelle. La documentation de Watch distingue également comportement implémenté et cible instituée. Les passages concernés des deux Captures cités plus haut sont réconciliés dans cette PR : choix de notification, rationale, relations et provenance. Les futurs contrats de réalisation restent à reprendre séparément. Les archives et leur vérification conservent leurs identités et leurs preuves historiques ; elles n'attestent pas la réalisation de cette nouvelle orientation.

Sous la mission `S-allocation`, l'[Allocation globale](2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) sépare les responsabilités : `A-watch` produit le plan, ses statuts techniques et la restitution GitHub ; `A-notifications` porte l'application des critères de notification établis, le message court et son acheminement. La règle désormais instituée dans `C-trigger` s'applique sans distinction de déclencheur ; elle ne provient pas du découpage de l'Allocation. Cette distinction ne prescrit ni service général, ni composant partagé, ni nouvelle infrastructure ; seul le cas A-watch est actuellement spécifié, sans étendre les notifications aux autres workflows. Elle ne certifie aucune réalisation.

## Sources matérielles

**S-notification-rules** — Source primaire : message utilisateur du 2026-10-14 répondant aux propositions D1, D2, N1, N2 et N3 de la restitution des écarts. « D1 - recommandation validée » adopte la règle planification réussie et plan non vide, candidats en cours compris. « D2 - recommandation rejetée : YAGNI » et « 1 exécution = même comportement du job quel que soit le trigger = 1 mail » imposent le même comportement pour les déclencheurs manuel et planifié ; la proposition de silence en manuel est rejetée. Les exclusions déjà instituées pour plan vide et erreur restent applicables. « N1 et N2 validés » autorise la correction des statuts prerelease obsolètes et des descriptions incomplètes des Captures. « N3 principe validé. Pourquoi on ne corrige pas la doc ? » distingue la mise à jour nécessaire de la documentation actuelle de la préservation des archives et de l'évolution future des contrats de réalisation. Cette source clôt les anciennes questions de pertinence et de déclencheur, sans autoriser l'implémentation de l'envoi dans cette PR. Aucun permalien public de conversation n'est disponible ; les recommandations non adoptées ne sont pas des décisions.

**S-allocation** — Source primaire : message utilisateur du 2026-10-14 suivant la réconciliation inter-Captures de la PR #45, « Maintenant on fait le même exo pour l'allocation / Je pense qu'il nous faut A-notifications / Et réconcilier les allocations existantes ». Cette mission demande le découpage de responsabilité et la réconciliation de l'Allocation, suivis du même examen des conflits et écarts ; elle n'établit aucun critère de contenu supplémentaire ni architecture générale de notification. Aucun permalien public de conversation n'est disponible. L'Allocation projette ce découpage sans devenir une autorité de conception indépendante.

**S-reconciliation** — Source primaire : message utilisateur du 2026-10-14 dans cette même conversation, après l'étude des conflits de la PR #45, commençant par « Un plan vide et une erreur ne déclenchent pas de notification interne ». Il exclut ces deux notifications, situe les notifications GitHub liées aux préférences utilisateur hors périmètre et confirme l'absence volontaire de déduplication avec un mail de plan frais par semaine si le contenu le justifie. Il demande la réconciliation inter-Captures, une vérification de résolution des conflits et la publication des écarts résiduels avec un score de confiance. Cette clarification complète `S-notifications` sans définir les critères fins de contenu ni une règle de mail pour les exécutions manuelles. Aucun permalien public de conversation n'est disponible ; le diagnostic antérieur de l'assistant ne constitue pas une nouvelle décision.

**S-notifications** — Source primaire : message utilisateur du 2026-10-14 dans ce projet, introduit par « Prépare une PR et capture dans un nouveau document », titre « sqlite-vector-wasm — Notifications des workflows GitHub Actions », points 1 à 5 et conclusion. Il fournit explicitement les décisions, raisons, orientation Resend et ordre des chantiers projetés ici. Aucun permalien public de conversation n'est disponible. La provenance identifie la source ; cette projection et sa PR ne constituent pas des corroborations indépendantes.

**S-repository** — État de comparaison lu sur `main` à [1e35fc4](https://github.com/at-rama/sqlite-vector-wasm/commit/1e35fc4fe7adfabde04ea36334d9acdd9e11a4df) : instructions, standards, skill de capture, Captures Distribution et Release/Watch, Allocation globale et spécification upstream-watch. Ces documents localisent l'état antérieur et les impacts ; ils n'instituent pas la nouvelle décision et ne prouvent pas la configuration de Resend, d'OVH ou de Gmail.
