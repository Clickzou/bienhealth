# Réponse au client — Veepee et affiliation, 22/09/2026

Contexte : le client est en discussion avec Veepee, qui relie son Shopify à celui
de BIEN pour récupérer les fiches produit. Il constate que les descriptions
Shopify ne correspondent pas à ce qu'affiche le site. Il demande aussi s'il doit
installer lui-même une application d'affiliation type UpPromote.

**Diagnostic (22/09/2026)** :

- la description Shopify est bien affichée sur le site (bloc « À propos »,
  depuis le commit `0c8ece0` du 02/09) ; les 10 descriptions sont propres, sans
  défaut d'encodage ;
- tout le reste de la fiche est codé en dur dans
  `src/app/[lang]/products/[handle]/page.tsx` : `HIGHLIGHTS` (bloc vert),
  `ACTIVES`, les `*_ACCORDIONS` (ingrédients, goût, posologie, traçabilité,
  délai d'effet, contre-indications), et le titre de section dans
  `product-seo.ts`. Veepee ne le reçoit pas ;
- ces textes codés en dur portent encore des allégations santé non autorisées
  (« doses cliniquement efficaces », « mémoire ») ;
- le jeton Storefront n'a pas le scope `unauthenticated_read_metafields`
  (`ACCESS_DENIED` au test) : à faire cocher par le client avant de migrer vers
  des métachamps ;
- contenu dupliqué : Google ne pénalise pas, mais peut préférer la page Veepee.
  D'où deux niveaux : infos pratiques + description courte partagées, texte de
  marque réservé au site (métachamp non exporté) ;
- affiliation : `sca_ref` (UpPromote) est déjà reconnu dans `PARAMS`
  (`src/lib/affiliate.ts`).

**En attente du client** : les trois réponses de Veepee, la case à cocher
Shopify, l'installation d'UpPromote et le lien d'un affilié test.

---

Objet : Vos fiches produit pour Veepee, et l'affiliation

Bonjour Carla,

Vous avez raison, et ce n'est pas une limite de l'IA : c'est un choix de
construction qu'il faut revoir maintenant que Veepee arrive.

**Pourquoi Veepee ne voit pas la même chose que votre site**

Le texte « description » de Shopify est bien celui affiché sur le site, dans le
bloc « À propos » en bas de fiche. Mais tout ce qu'on voit en premier sur la
fiche a été écrit directement dans le site, pas dans Shopify : le bloc vert avec
les bienfaits, les ingrédients, la posologie, le goût, la traçabilité et les
contre-indications. Veepee, qui lit votre Shopify, ne récupère donc qu'une partie
de l'information.

**Ce que je propose**

Ramener tout ce contenu dans Shopify, pour que vous n'ayez plus qu'un seul
endroit à tenir à jour. Je l'organiserais en deux niveaux :

- **Ce que Veepee et vos revendeurs reçoivent** : les informations pratiques
  (ingrédients, posologie, goût, précautions d'emploi), plus une description
  produit courte et factuelle.
- **Ce qui reste réservé à votre site** : un texte plus riche, qui raconte le
  produit avec le ton de la marque.

Pourquoi deux niveaux : si Veepee affiche mot pour mot les mêmes textes que votre
site, Google peut choisir de mettre leur page en avant plutôt que la vôtre. Les
informations pratiques identiques partout, c'est normal et sans risque. Le texte
de marque, lui, doit rester propre à bien.health.

On en profitera pour faire relire les formulations santé : certaines phrases du
site ne sont pas autorisées par la réglementation européenne sur les compléments
alimentaires, et un grand compte comme Veepee y sera attentif. Je vous soumettrai
les textes corrigés avant toute mise en ligne.

**Ce qu'il me faut de votre côté**

1. Trois questions à poser à Veepee :
   - quel outil utilisent-ils pour se connecter à votre Shopify ?
   - quels champs récupèrent-ils : la description seule, ou aussi les champs
     complémentaires ?
   - leurs pages produit sont-elles visibles sur Google, ou réservées aux membres
     connectés ?
2. Je vous enverrai une case à cocher dans Shopify, pour que le site puisse lire
   ces nouveaux champs, comme nous l'avions fait pour le stock.

**Pour l'affiliation**

Oui, installez UpPromote vous-même depuis l'App Store Shopify, c'est gratuit pour
démarrer. Tout le suivi côté site est déjà en place et reconnaît les liens
UpPromote. Une fois l'application installée, créez un premier affilié test et
envoyez-moi son lien : je vérifierai que la vente remonte bien jusqu'à la
commande.

Bien à vous,
