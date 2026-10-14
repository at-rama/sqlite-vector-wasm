# sqlite-vector-wasm — Notifications des workflows GitHub Actions

## Identité, périmètre et autorité

Capture dédiée aux notifications des workflows de sqlite-vector-wasm, en particulier A-watch. Elle projette les décisions et l'orientation fournies par l'utilisateur dans `S-notifications` ; elle ne constitue ni une autorité de décision indépendante ni une preuve de réalisation.

Cette source remplace explicitement, dans ce périmètre, le recours aux notifications natives de fin d'exécution pour signaler les résultats A-watch, l'acceptation des notifications de plans vides et l'exclusion d'un transport email dédié. Ces choix étaient projetés dans `C-watch` et `R-updates` de la [Capture Distribution](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md), et `C-watch` et `R-frugality` de la [Capture Release/Watch](2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md). La révision découle du remplacement explicite de ces choix par la source utilisateur, pas de la seule date de cette Capture.

La découverte, le calcul du plan, la cadence et l'invocation manuelle, ainsi que les limites entre planification, préparation, intégration et publication restent hors de cette révision. Aucun état OpenSpec ni achèvement d'implémentation n'est déduit de la demande de capture.

## Décisions et raisons

### C-status — Séparer exécution et notification

Les workflows conservent leurs statuts techniques habituels. La notification utilisateur dépend de la pertinence du résultat produit, pas du seul statut `success` ou `failure`.

A-watch peut réussir en identifiant des mises à jour intéressantes ou sans rien trouver. Il ne faut ni notifier chaque succès ni provoquer artificiellement un échec pour obtenir une notification. Une erreur réelle conserve son statut d'échec ; la source ne définit pas encore sa politique de notification.

### C-summary — Garder la restitution dans GitHub

Les résultats restent dans GitHub, notamment dans le Job Summary et les artefacts associés. Les notifications sont courtes et renvoient vers le run concerné. Les détails techniques et les diagnostics restent ainsi accessibles sans encombrer le message.

Le premier chantier reste la simplification du Job Summary d'A-watch. Cette priorité ne définit pas encore sa nouvelle présentation et ne demande pas sa réalisation dans cette Capture.

### C-noise — Éviter le bruit des notifications CI

Ne pas utiliser les notifications CI globales de GitHub Mobile pour signaler les résultats d'A-watch, ni détourner les issues, commentaires ou `@mentions`.

La source motive ce choix par l'absence de moyen simple de notifier un utilisateur selon le contenu métier d'un Job Summary et par le bruit possible des autres workflows. Cette justification est fournie par l'utilisateur ; elle n'est pas une vérification indépendante des capacités actuelles de GitHub. Elle ne demande pas de modifier les préférences du compte.

### O-resend — Canal cible Resend vers Gmail

L'orientation retenue est l'email transactionnel via Resend vers Gmail, avec un domaine d'expédition dédié tel que `notify.bourgeon.ovh`, administré chez OVH. Le sous-domaine cité reste un exemple, pas une configuration déjà établie.

La raison retenue est la simplicité d'un appel API depuis GitHub Actions ; Gmail assure la réception et la notification Android sans donner accès au compte Google protégé par Advanced Protection. Il s'agit du fonctionnement cible, sans preuve d'envoi, de réception ni de notification Android dans cette intervention. Ce choix ne rétablit pas l'ancienne solution SMTP Gmail.

### C-trigger — Notifier seulement lorsqu'une attention est utile

Ne pas notifier les résultats A-watch vides ni systématiquement chaque exécution réussie. Différer l'intégration Resend jusqu'à la définition des conditions précises de notification : le mécanisme doit signaler une information qui mérite une attention sans reproduire le bruit CI.

GitHub Actions reste le lieu d'exécution et de restitution ; Resend → Gmail est le canal envisagé. L'ajout des notifications vient après la simplification du Job Summary, sans infrastructure générale supplémentaire et seulement lorsque leurs conditions de déclenchement sont établies.

## Question et condition de passage

`Q-trigger` — Quelles conditions précises rendent un résultat notifiable ? La pertinence métier est le principe retenu, mais les critères opérationnels, y compris le traitement des erreurs réelles, ne sont pas encore définis. Il ne faut pas les inventer ni assimiler automatiquement tout plan non vide à une notification.

Avant l'intégration Resend, établir ces conditions conformément à `C-trigger`. Cette condition ne bloque ni la Capture ni le chantier préalable du Job Summary.

## Impacts documentaires à reprendre

La [spécification upstream-watch](../openspec/specs/upstream-watch/spec.md), notamment « Native completion notifications » et la frontière de fin de planification, décrit encore le contrat réalisé antérieur. Les passages des deux Captures cités plus haut portent également l'ancienne orientation ; la présente révision en délimite explicitement la supersession. Leur réconciliation et les futurs contrats de réalisation restent à reprendre séparément. Les archives et leur vérification conservent leurs identités et leurs preuves historiques ; elles n'attestent pas la réalisation de cette nouvelle orientation.

L'[Allocation globale](2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) référence cette Capture comme nouvel input et rattache son apport à `A-watch`, sans créer de service général de notification ni certifier sa réalisation.

## Sources matérielles

**S-notifications** — Source primaire : message utilisateur du 2026-10-14 dans le projet sqlite-vec-wasm, introduit par « Prépare une PR et capture dans un nouveau document », titre « sqlite-vector-wasm — Notifications des workflows GitHub Actions », points 1 à 5 et conclusion. Il fournit explicitement les décisions, raisons, orientation Resend et ordre des chantiers projetés ici. Aucun permalien public de conversation n'est disponible. La provenance identifie la source ; cette projection et sa PR ne constituent pas des corroborations indépendantes.

**S-repository** — État de comparaison lu sur `main` à [1e35fc4](https://github.com/at-rama/sqlite-vector-wasm/commit/1e35fc4fe7adfabde04ea36334d9acdd9e11a4df) : instructions, standards, skill de capture, Captures Distribution et Release/Watch, Allocation globale et spécification upstream-watch. Ces documents localisent l'état antérieur et les impacts ; ils n'instituent pas la nouvelle décision et ne prouvent pas la configuration de Resend, d'OVH ou de Gmail.
