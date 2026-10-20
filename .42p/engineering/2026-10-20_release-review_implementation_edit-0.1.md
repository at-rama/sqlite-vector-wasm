# PR #76 — Rapport d’implémentation pour institution

> État de lecture : les sections 1 à 7 conservent le compte rendu du candidat vérifié avant archivage ; la section 8 décrit l’archivage demandé par le mainteneur. La section 9 requalifie uniquement les correctifs post-archive sur `11f8621c2fa59ef3c52056a1ca127957dfea1c37` et précise les preuves réutilisées, les contrôles renouvelés et leurs limites.

## 1. Périmètre et décision proposée

**Les cinq changes sont implémentés et vérifiés ; l’ensemble est prêt pour décision d’institution.** La PR reste ouverte en brouillon, sans archivage, fusion ni publication de distribution. Le gate Archive restera donc bloquant jusqu’à l’opération ultérieure explicitement autorisée. Cette conclusion ne signifie pas « fusionnable immédiatement ».

Le candidat global examiné est `0dbb88b937542d6d5f5021da6ff1497d2236c7ad`, sur `plan/release-docs-review`, avec `main` à `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e`. Les exécutions réelles finales portent sur `67d5feb9245666e3f046718fc828d47dfae3efd7`, arbre `109f628cf2ee2968229c4f420acdfbbb6a2d3836`. Entre ces deux commits, seuls les marqueurs de tâches et le premier rapport de vérification du dernier change diffèrent. Les preuves d’exécution sont réutilisées explicitement sur cette base ; elles ne sont pas présentées comme un déploiement du commit administratif.

La source de commande reste l’[Allocation réconciliée](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `bd990a1bea53e94184349837794489648d27e68b7327e76be9ddeea318df9217`, avec ses quatre Captures et les baselines/deltas des changes. Leur sémantique n’a pas été modifiée pendant Apply. La [dérivation documentaire globale](2026-10-19_release-review_derivation_edit-0.1.md) conserve sa portée initiale ; les contrôles d’identité ont été renouvelés, sans transformer cette dérivation en preuve d’implémentation.

## 2. Réalisations et ordre suivi

Chaque unité a été traitée après vérification satisfaisante de la précédente. Les rapports unitaires initiaux gardent leurs identités et limites propres ; le présent rapport donne l’état intégré final et ses preuves renouvelées.

| Ordre et allocation | Change et rapport | Résultat réalisé |
| --- | --- | --- |
| 1 — A-package | [prepare-release-package-docs](../openspec/changes/archive/2026-10-20-prepare-release-package-docs/verification.md) | Documents du package dérivés de la composition et du numéro fournis ; sources/rendus tracés et revérifiés lors de la consommation de l’archive. |
| 2 — A-site_docs | [preview-vector-release-docs](../openspec/changes/archive/2026-10-20-preview-vector-release-docs/verification.md) | README/Usage Vector, adaptation SQL native et exemple main/Worker sur l’archive exacte ; preview explicitement non publié, sources uniques et liens vérifiés. |
| 3 — A-updates | [prepare-reviewed-release-candidates](../openspec/changes/archive/2026-10-20-prepare-reviewed-release-candidates/verification.md) | Une préparation compose sélection, documents et qualification dans le même candidat ; les candidats existants sont référencés et le preview manquant laisse l’intégration inéligible. |
| 4 — A-release | [bind-release-documentation](../openspec/changes/archive/2026-10-20-bind-release-documentation/verification.md) | Liaison à la préparation, au preview et aux sources/rendeurs revus ; qualification documentaire renouvelée sur l’archive définitive ; handoff complet seulement après les destinations vérifiées. |
| 5 — A-site_shell | [publish-site-after-distribution](../openspec/changes/archive/2026-10-20-publish-site-after-distribution/verification.md) | Même garde sur push, manuel et stable voisin d’un preview ; ancien public conservé pendant l’attente ; promotion après publication complète et contrôle final des identités/fraîcheur. |

Les capacités techniques isolées sqlite-vec et SQLite-Vector restent consommables et testées. Watch/Updates/Release prospectifs restent explicitement Vector. Aucun moteur simultané, canal supplémentaire, registre de releases ou écriture directe sur main n’a été ajouté. La démo conserve son runtime publié 0.2.0 ; son adaptation Vector reste dans [PR #77](https://github.com/at-rama/sqlite-vector-wasm/pull/77).

## 3. Vérifications et corrections

Les cinq rapports unitaires concluent `passed`, avec 100 % dans les deux directions de couverture sémantique. Ces pourcentages sont des jugements documentés sur les obligations complètes de chaque unité, pas des scores calculés à partir du nombre de tests. Le dernier rapport examine les six exigences/23 scénarios effectifs, dont les 11 scénarios du déploiement modifié.

Sur le candidat global propre, `sh tools/check-repository.sh`, la suite complète `sh tools/test-repository.sh` et OpenSpec strict passent, ce dernier à 17/17. Les contextes CLI des cinq changes ont été relus : chacun est `spec-driven`, 4/4 tâches, `all_done`, avec racine `.42p`. La suite Site ciblée avec ses checks passe 62/62. `verify` a été exécuté comme workflow agentique officiel, et non comme une commande CLI inventée.

Les [jobs Repository finaux sur le code exécuté](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39328793243) confirment `check` et `tests` réussis. Leur gate Verification précède le dernier rapport passant ; son échec à cet instant ne constitue pas un échec de la suite. Les contrôles transversaux ont ainsi renouvelé les preuves affectées par le consommateur Site et les fixtures partagées, sans changer les contrats ni réutiliser silencieusement une réussite ancienne.

Corrections effectuées et revérifiées : isolation du profil documentaire dans la fixture d’images, renouvellement de l’exemple pendant les éditions temporaires de documents, retry borné du nettoyage Git temporaire après deux erreurs ENOTEMPTY, et refus d’emprunter le handoff d’une ancienne tentative réussie pour une tentative Release échouée. Les échecs restent dans l’historique. Le premier contrôle du dernier change a aussi correctement refusé le marqueur de vérification encore ouvert ; sa [trace](https://github.com/at-rama/sqlite-vector-wasm/blob/0dbb88b937542d6d5f5021da6ff1497d2236c7ad/.42p/openspec/changes/publish-site-after-distribution/verification.md) est conservée, puis la vérification a été répétée après correction administrative.

## 4. Preuves d’intégration réelles

- [Acceptance](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39328793298) : les deux compositions isolées passent. Cela conserve la capacité vec tout en qualifiant le chemin Vector ; ce n’est pas une seconde offre produit.
- [Release sans publishers](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39328793248) : neuf étapes, 22 cas navigateur, exemple natif main/Worker et résolution des liens réussis sur le head exécuté. Archive de 1 164 980 octets, SHA-256 `9ac1ec39c45ef6d71bbd1b90b07da32c8f373be3f6e283f429a2181961b9f203`. L’état de publication 0.2.4 est une fixture explicite ; les jobs de publication sont ignorés.
- [Updates en répétition](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39328793448) : état publié réellement observé latest 0.2.1, candidat temporaire local `78f67706b86c7e1f69ca357b6032c6ca3abaea5c`, qualification et exemple exact-archive réussis. Son archive est distincte : 1 164 982 octets, SHA-256 `ce55ce38d89501afb56bfff67b8ca9244f34052f50d57111dfab8b5a014a2535`. Aucun adaptateur de création distante de candidat n’est utilisé.
- [Site](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39328793220) : build, deploy et observe réussissent. Le preview identifie exactement `67d5feb9245666e3f046718fc828d47dfae3efd7` et consomme l’artefact Release `12224170572`, dont l’archive est vérifiée. Le stable provient séparément de main `741b26d`, avec la sélection publiée 0.2.0 vérifiée sur GitHub/npm. Les destinations sont observées à 1280/390 pixels ; les identités avant/après, sources rendues, navigations et runtime préservé sont enregistrés.

Les quatre ZIPs décisifs ont été téléchargés, leurs SHA-256 comparés aux métadonnées GitHub et leurs JSON inspectés. Le [rapport A-site_shell](../openspec/changes/archive/2026-10-20-publish-site-after-distribution/verification.md) donne les identifiants, digests, fichiers et liens primaires. Les preuves publiques sont limitées par leur rétention ; l’URL partagée du preview peut être remplacée et n’est pas à elle seule une identité de preuve.

## 5. Cohérence, écarts et limites

La chaîne relie désormais préparation commune, revue identifiée, calcul définitif, qualification renouvelée, publication complète et promotion documentaire. Une erreur ou une identité inconnue interrompt l’éligibilité ; Site ne répare ni ne republie une distribution. L’ancienne documentation reste déployable à partir des preuves Git/Pages/publication existantes, sinon Pages demeure inchangé. Les mises à jour documentaires d’une version effectivement publiée restent possibles, sans rafraîchir implicitement la démo.

Aucun écart d’implémentation bloquant ne demeure dans le périmètre examiné. Les succès futurs de publication et les mauvais handoffs ont été exercés avec des services contrôlés ; aucune fusion humaine de candidat, création réelle de nouvelle PR Updates ou publication GitHub/npm n’est prétendue. Les prérequis opérationnels de ces services restent nécessaires. Les qualifications réelles portent ici sur SQLite 3.54.0 × SQLite-Vector 1.1.2 ; elles ne qualifient pas implicitement une future sélection 3.54.1.

Les observations passent par le navigateur et les archives externes, mais partagent les checkers, le harness et l’auteur agentique du dépôt. Il ne s’agit pas d’une certification indépendante ou d’une garantie pour tout navigateur, réseau ou ordonnancement. L’exécuteur local a été indisponible pendant une partie du dernier change : les mutations distantes ont continué exclusivement par le connecteur GitHub avec contrôle CAS et relecture. Les contrôles locaux finaux ont ensuite été réellement exécutés après son rétablissement.

## 6. État Git et décision d’institution

Les principaux commits d’implémentation sont `6b80ab0` (package), `a102cc2` (docs), `b1c28ce` (Updates), `afe2e0c` (Release corrigé), puis `25de361`/`560f874`/`67d5feb` (Site et corrections). Les rapports et marqueurs ont leurs propres commits ; le candidat administratif vérifié est identifié en ouverture. Tous ces travaux sont sur la branche existante de PR #76. Aucun change n’est archivé, aucune spec n’est synchronisée et aucune branche ou PR supplémentaire n’a été créée pendant cette implémentation.

**Recommandation : instituer les cinq changes comme un ensemble cohérent.** Leurs rapports et les preuves d’intégration permettent cette décision sans investigation technique supplémentaire dans le périmètre testé. L’institution, la sélection de la première vraie paire Vector et la publication restent des décisions humaines distinctes.

## 7. Suite opératoire minimale

Après décision explicite d’institution : archiver ensemble les cinq changes selon les skills du dépôt, avec la synchronisation prévue par l’archivage ; renouveler strict, contrôles canoniques et gates ; fusionner humainement PR #76. L’archivage n’a pas été anticipé pour rendre le gate vert.

Ensuite, lancer Updates avec la paire exacte choisie, examiner sa PR et son preview identifié, puis décider de son intégration. Release recalcule et qualifie le numéro et l’archive définitifs ; Site promeut les documents seulement après publication complète vérifiée. L’intégration de la PR technique #76 seule ne publie pas de nouvelle distribution et ne doit pas exposer les documents Vector comme déjà disponibles. Une mise à jour explicite de la démo #77 vient après une véritable publication stable Vector.

## 8. Archivage du 20 octobre 2026

Le mainteneur a demandé l’actualisation de la PR puis l’archivage dans l’ordre d’implémentation. Chaque opération a relu le statut, les tâches et les instructions OpenSpec, constaté la vérification passante, synchronisé le delta avec conservation du titre/Purpose, des exigences non modifiées et des scénarios retenus, puis validé les specs avant l’archivage natif. La mise à jour automatique des specs a été désactivée uniquement au moment du déplacement natif, après cette synchronisation explicite déjà achevée et comparée ; aucune validation n’a été contournée.

| Ordre | Change | Commit d’archivage |
| --- | --- | --- |
| 1 | prepare-release-package-docs | `ba8ed9cee01bb66ec970707c3b36237afef542ac` |
| 2 | preview-vector-release-docs | `5f1863f326e90a925bb14f3632bd594d6d66efce` |
| 3 | prepare-reviewed-release-candidates | `f1bda5eeeca856a787ec877c3de24ed9727fd758` |
| 4 | bind-release-documentation | `783c187e13f5aa1b7e33c5f3ea9ec49e8e4f7c13` |
| 5 | publish-site-after-distribution | `5efa6b47b2603e5c243c506f66f40e7aa4f87c46` |

Les dossiers sont sous `.42p/openspec/changes/archive/2026-10-20-<change>/` et la liste active OpenSpec est vide. L’horloge de l’exécuteur natif produisait un préfixe au 19 ; les noms ont été alignés sur le 20 octobre, date courante de la session. Les cinq rapports `verification.md` et leurs métadonnées sont identiques octet par octet à ceux du candidat vérifié. Les liens relatifs des propositions/designs et des comptes rendus ont été ajustés pour leur déplacement, sans modification sémantique des contrats ou des preuves. Les anciennes archives n’ont pas été modifiées.

Après archivage, le contrôle canonique, la suite complète enregistrée et OpenSpec strict (12/12 specs, aucun change actif) passent. Les gates Verification et Archive passent pour les cinq changes sur le commit d’archivage final `5efa6b47b2603e5c243c506f66f40e7aa4f87c46` ; ils sont relancés après les ajustements de liens. Leur état final et celui de la CI sont reportés dans la description de PR #76. Aucun code produit, workflow exécutable, pin, Capture ou Allocation n’a changé pendant cette opération ; aucune fusion ni publication de distribution n’a été déclenchée.

## 9. Requalification documentaire ciblée des correctifs post-archive

**Conclusion favorable dans ce périmètre.** À la demande du mainteneur du 20 octobre 2026, le candidat propre examiné est `11f8621c2fa59ef3c52056a1ca127957dfea1c37`. La revue relie les correctifs de sécurité à leurs obligations et aux exécutions déjà réalisées sur ce commit ; elle ne rejoue pas les cinq Changes. Les rapports archivés conservent leurs verdicts, candidats et limites historiques. Cette section constitue le complément documentaire pour la décision d’institution, sans nouvelle déclaration de Verification complète ni nouveau pourcentage de couverture.

### Périmètre et rattachement

La comparaison Git avec `0990f16ef7370595e52ddbcdebae0de313fd3fb3` identifie exactement quatre fichiers : `.github/workflows/site.yml`, `tools/site/checkout.mjs`, `tools/site/tests/checkout.test.mjs` et `tools/site/tests/workflow.test.mjs`. Les commits correctifs sont `87c9584f52b301b6df63adece8c9d31bb9aa356b` puis `11f8621c2fa59ef3c52056a1ca127957dfea1c37`. Captures, Allocation, specs cumulées, archives, autres implémentations et pins sont identiques entre ces deux bornes.

Le rattachement est `A-site_shell`, [Allocation source](https://github.com/at-rama/sqlite-vector-wasm/blob/41c7d36e2f67118d507deb0005eda887bfa12334/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), avec les passages Site C-site/C-readme/C-demo-release/Q-realization et Distribution C-release-review relus. La comparaison avec le [design archivé](../openspec/changes/archive/2026-10-20-publish-site-after-distribution/design.md), sa couverture et la [spec effective sur le candidat](https://github.com/at-rama/sqlite-vector-wasm/blob/11f8621c2fa59ef3c52056a1ca127957dfea1c37/.42p/openspec/specs/site-shell/spec.md) conclut à une correction de réalisation du déploiement borné, sans nouvelle obligation produit. Les quatre autres Changes ne sont pas requalifiés globalement : leurs réalisations ne changent pas dans ce delta ; les interactions effectivement réexercées sont identifiées ci-dessous.

### Obligations affectées et justification

**Preview exact et isolation des droits.** Le [workflow corrigé](https://github.com/at-rama/sqlite-vector-wasm/blob/11f8621c2fa59ef3c52056a1ca127957dfea1c37/.github/workflows/site.yml) interdit l’accès aux caches et conserve les droits de lecture dans build/observe. Le [sélecteur Git](https://github.com/at-rama/sqlite-vector-wasm/blob/11f8621c2fa59ef3c52056a1ca127957dfea1c37/tools/site/checkout.mjs) vérifie le contrôleur puis le second parent du merge GitHub avant de sélectionner le head PR exact, sans fetch dynamique. Le [build exécuté](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424355/job/118429250422), étapes de liaison et tests Git, confirme le chemin réel et les rejets d’identité incorrecte. Le déploiement utilise le checkout du contexte GitHub : merge pour une PR interne autorisée, branche par défaut pour `workflow_run`. Il ne faut donc pas lire cette correction comme une interdiction générale d’exécuter du code de PR interne ; la frontière fork/acteur et le contrôle d’éligibilité restent nécessaires.

**Stable éligible, repli et fraîcheur.** Le checkout indépendant de `main` doit correspondre au main observé ; la source stable sélectionnée doit en être un ancêtre. L’ascendance s’ajoute à l’éligibilité de publication, sans la remplacer et sans forcer la sélection des derniers documents de main. La lecture du code confirme le maintien des contrôles de publication complète, du repli précédent et des gardes finales sous concurrence Pages. Les tests Git exécutés rejettent PR étrangère à l’ascendance, futur merge, révision malformée/inconnue et checkout différent du main observé ; les tests eligibility/publication conservent les cas pending/failed/partial, manuel, completion étrangère et tentative périmée. Le [déploiement réel](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424355/job/118430446182) a passé sa garde finale. L’[ancienne exécution 39361069888](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361069888) a effectivement refusé le head devenu obsolète avant déploiement ; son échec ne sert pas de preuve de réussite du nouveau candidat.

**Documentation, navigation et démo conservées.** Les artefacts inspectés identifient le preview `11f8621`, le stable `741b26df750b3c1f0f5a00c1dd1e579b4e7c6d9e` et la démo publiée 0.2.0. Le handoff de l’archive qualifiée vient de Release `39361424416`, artefact `12237827134`, digest `2200bac5c04ebb7b22a9d182bec804ce1be925070a60d99e8c5067381adc5312`, pour ce même head. L’[observation Pages réussie](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424355/job/118430737384) couvre trois destinations, 1280/390 pixels, six visites directes et six transitions client par côté, avec démo fonctionnelle. Le contrôle npm est vrai sur le nouveau preview, faux sur l’ancienne source stable qui précède cet ajout ; cette limite historique n’est pas une preuve d’évolution du stable.

### Preuves et contrôles

Les états et identités des exécutions ont été relus dans GitHub pendant cette requalification. Les deux ZIPs Site déjà téléchargés ont été rouverts ; leurs SHA-256 ont été recalculés et confrontés aux métadonnées GitHub toujours disponibles : [site-checks 12237952179](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424355/artifacts/12237952179), `52ef74d92a4f1a83c150f323214b920cc1cda4960e7af7b978470eb6a3a71678`, fichiers `pages/site-publication.json`, `docs-input/handoff.json`, `site/assembled.json` ; [site-live 12238200304](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424355/artifacts/12238200304), `539a9d3738fbfa03296350e9d1e4781413126fb65e2c543d65adedb7347963d0`, fichier `live-pages.json`. Il s’agit d’une réinspection des résultats sur `11f8621`, pas d’une nouvelle observation en ligne.

[CodeQL](https://github.com/at-rama/sqlite-vector-wasm/runs/118428394752) et ses trois analyses sont réussis sur `11f8621`. La première correction gardait deux alertes ; seul le résultat final est retenu comme passant. Les quatre jobs de [Repository](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424368) passent, ainsi qu’[Acceptance](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424358) et [Release exercise](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39361424416). Ces exécutions identifiées sont réutilisées ; aucun nouveau build produit, publisher ou déploiement n’a été lancé par cette revue.

Sur le candidat propre, la commande ciblée `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs` a été renouvelée : **65/65, aucun échec ni saut**. Les résultats CI de la suite complète restent ceux de Repository sur ce même candidat. OpenSpec 1.14.0 résout `.42p`, liste zéro Change actif et valide strictement **12/12** specs. Le contrôle canonique est renouvelé pour le complément documentaire avant son commit. Les gates relisent les déclarations archivées ; leur réussite ne requalifie pas automatiquement des preuves anciennes sur le nouveau code.

### Limites et décision proposée

L’examen sémantique et les tests partagent l’auteur agentique de l’implémentation ; les observations passent par le harness du dépôt et les services GitHub/Pages. Leur combinaison ne prouve ni l’absence universelle de vulnérabilité ni tous les entrelacements futurs. Les cas manuel, fork et `workflow_run` sont étayés par lecture et tests contrôlés, sans nouvelle exécution réelle de chacun de ces déclencheurs. La promotion après une véritable publication Vector reste une limite déjà identifiée ; aucune publication n’a été créée pour la lever. Les artefacts ont une rétention bornée.

**Recommandation : retenir les correctifs post-archive de `11f8621` pour l’institution de la PR #76, avec les limites de preuve ci-dessus et sans réserve bloquante identifiée dans ce delta.** La requalification documentaire est achevée ; elle ne modifie ni le verdict historique des cinq archives ni l’autorité de décision humaine. Ce complément ne change que le présent rapport. Toute nouvelle modification exécutable ou sémantique demanderait un réexamen des preuves affectées ; une réexécution automatique ultérieure ne doit pas être confondue avec les résultats identifiés ici.
