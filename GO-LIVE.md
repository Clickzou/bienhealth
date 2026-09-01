# Checklist de mise en ligne — bien.health

Tout ce qui doit être vérifié, configuré ou décidé **avant** la bascule du site
headless sur `bien.health`. Dernière mise à jour : 31 août 2026.

Convention : `[ ]` à faire · `[~]` en attente d'une info ou d'une décision client ·
`[x]` fait et vérifié.

---

## 1. Bloquants — le site ne doit pas être mis en ligne sans ça

### [x] Domaine du checkout Shopify — vérifié le 31/08/2026, domaine réel confirmé le 31/08/2026

`src/lib/cart.ts` construit l'URL de paiement à partir de
`NEXT_PUBLIC_SHOPIFY_DOMAIN`. **Si cette variable est absente**, le code retombe
sur `NEXT_PUBLIC_SITE_URL` (= `https://bien.health`) — or ce domaine sera occupé
par le nouveau front. Le bouton « Passer au paiement » enverrait alors les
clients sur une page inexistante du site headless au lieu du checkout.

→ Définir `NEXT_PUBLIC_SHOPIFY_DOMAIN` dans Vercel (Production **et** Preview)
et tester un passage en caisse de bout en bout.

**Valeur réellement déployée : `shop.bien.health`** (et non `b3a79e-89.myshopify.com`
comme indiqué initialement ici). Vérifié dans le bundle de production : le bouton
« Passer au paiement » construit ses URL sur `https://shop.bien.health/cart/…`.
C'est le meilleur choix — un domaine de marque au checkout rassure davantage que
`*.myshopify.com`. `.env.local.example` cite encore le domaine myshopify : sans
conséquence en local, mais à garder en tête.

### [x] Passage du site en indexable — fait le 28/08, revérifié le 31/08/2026

Le site est volontairement en `noindex` tant qu'il tourne sur `*.vercel.app`
(protection contre le contenu dupliqué). Après branchement du domaine :

- `NEXT_PUBLIC_SITE_URL=https://bien.health` dans Vercel ;
- domaine `bien.health` branché sur le projet Vercel (production) ;
- vérifier `https://bien.health/robots.txt` → doit autoriser le crawl ;
- vérifier le `<meta name="robots">` d'une page → doit être `index, follow` ;
- vérifier `https://bien.health/sitemap.xml`.

### [x] Scope Shopify `unauthenticated_read_product_inventory` — accordé le 31/08/2026

Le build affiche des erreurs `ACCESS_DENIED` sur `quantityAvailable`. Conséquence :
les badges de stock (« Bientôt épuisé — plus que N en stock », pré-commande)
ne fonctionnent pas. → Ajouter le scope à l'app Storefront dans l'admin Shopify.

### [x] Pixel Meta — ID confirmé et corrigé le 31/08/2026

ID fourni par le client le 29/08/2026 : **`1675426639926228`**, inscrit en repli
dans `src/lib/meta-pixel.ts` (`META_PIXEL_FALLBACK`) et actif automatiquement en
production, comme GA. Rien à faire dans Vercel ; `NEXT_PUBLIC_META_PIXEL_ID`
reste prioritaire si on veut le surcharger (ou tester depuis localhost).

⚠️ La capture d'où vient cet ID montrait un compte du gestionnaire de publicités
(nom du compte, devise EUR, « Aucune campagne active ») : ce sont les marqueurs
d'un **identifiant de compte publicitaire**, pas d'un pixel — les deux font
15-16 chiffres et se confondent facilement. À confirmer dans Meta Events Manager
→ Sources de données → le pixel → Paramètres → ID du pixel. Contrôle en une
minute : sur bien.health, accepter les cookies puis ouvrir l'onglet Réseau →
un appel `fbevents.js` doit partir, et l'activité doit apparaître dans Events
Manager (« Test des évènements »). Si l'ID est celui du compte publicitaire, le
script se charge mais **aucun évènement n'est reçu** — c'est le seul symptôme.

### [x] Événement `Purchase` côté Shopify — déjà en place, constaté le 31/08/2026

Le tunnel de paiement est sur Shopify : le site ne peut pas mesurer les ventes.
Sans configuration côté Shopify (canal Facebook & Instagram dans l'admin), Meta
verra les mises au panier mais **aucune vente** → optimisation des campagnes
faussée. Demande un accès à l'admin Shopify.

---

## 2. Vérifications techniques avant bascule

- [ ] **Tunnel complet** : fiche produit → ajout au panier → page panier →
      checkout Shopify → paiement test → email de confirmation.
- [ ] **Variables Vercel** — comparer avec `.env.local.example` :
      `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`,
      `SHOPIFY_STOREFRONT_API_VERSION`, `NEXT_PUBLIC_SHOPIFY_DOMAIN`,
      `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`,
      `NEXT_PUBLIC_TRUSTPILOT_BUSINESSUNIT_ID`, `NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID`,
      `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] **Widget Trustpilot** : les deux IDs TrustBox sont vides → le widget live
      ne s'affiche pas (seul l'encart statique 4,4/5 est visible).
- [ ] **Widget Loox** : le vrai widget ne se charge que sur `bien.health`
      (domaine whitelisté). À revérifier après bascule ; en attendant, c'est
      l'affichage maison qui s'affiche.
- [ ] **Compte client** : l'espace compte dépend de l'auth Shopify Customer
      (`isCustomerAuthConfigured`). Vérifier connexion, inscription, commandes.
- [ ] **Newsletter + formulaire revendeur** : dépendent de Supabase. Tester un
      envoi réel et vérifier la réception côté base.
- [x] **Redirections des anciennes URLs Shopify** — table complète livrée le
      31/08/2026, vérifiée en production (voir section 21).
- [ ] **Search Console** : soumettre le sitemap après bascule, vérifier la
      couverture et les rich results (Product, Review, FAQ, Breadcrumb).
- [ ] **Bannière cookies** : vérifier que refuser bloque bien GA **et** le pixel
      Meta (onglet réseau : aucun appel `googletagmanager` ni `fbevents`).
- [ ] **Méga-menus** : revérifier le cadrage sur plusieurs résolutions réelles
      (13", 15", 24") — c'était le bug signalé par le client.
- [x] **Note Trustpilot du header** : réglé le 19/08/2026 en la sortant du
      header pour la mettre dans la barre d'offre, où elle est visible à toutes
      les largeurs (voir section 7).
- [ ] **Mobile** : parcours complet sur téléphone (menu, fiche, panier).

---

## 3. En attente d'une info ou d'une décision client

- [x] **Fond du favicon** — tranché le 19/08/2026 : monogramme noir sur fond
      blanc, régénéré avec `node scripts/generate-favicon.mjs white`.
- [~] **Rose sur les CTA** — demandé par le client (« ou sinon les CTA ? »).
      Non appliqué : la charte n'autorise que du vert sur un aplat pink (p. 25),
      et vert sur rose plafonne à 2,4:1, donc un bouton illisible. Les seules
      combinaisons lisibles sur pink sont interdites par la charte. À arbitrer
      avec le client s'il veut passer outre la charte sur ce point.

- [x] **Logos associatifs** — fichiers et URL reçus le 18/08/2026, intégrés au
      footer (pastille blanche, les deux logos n'existant que sur fond blanc).
      Les URL données par le client (`team-planet.com/fr`,
      `hopitalsourire.com`) remplacent celles que nous avions devinées.
- [x] **Chiffres de preuve sociale** — validés par le client le 31/07/2026 :
      `+500 clients satisfaits`, `4,4/5`, `+100 avis Trustpilot`
      (tous centralisés dans `src/lib/social-proof.ts`).
      Le nombre d'avis par produit (23 pour MUSHGLOW) reste distinct : il vient
      de Loox et sert au balisage Schema.org, où un chiffre gonflé serait
      sanctionné par Google.
- [~] **Offre « 1 mousseur offert aux 100 premières commandes »** — annoncée
      dans la barre d'offre, sans compteur ni preuve. Soit ajouter un compteur
      réel, soit retirer la mention (promesse invérifiable).
- [~] **Statut de MUSHGLOW** — la barre d'offre annonçait « Pré-ventes
      ouvertes », remplacé par « MUSHGLOW disponible ». À confirmer : si le
      produit est réellement en pré-commande, remettre l'ancienne formulation.
- [~] **Quels produits sont réellement best-sellers ?** — le badge s'appliquait
      à toute la gamme ; il est désormais limité aux deux premiers produits
      renvoyés par Shopify. Donner la vraie liste pour la figer.
- [~] **Positionnement « athlètes de la vie »** — question soulevée par le
      client : cible sportive assumée, ou trop restrictive ? Décision éditoriale
      qui impacte le hero, la page Histoire et la section mission.
- [~] **Tutoiement / vouvoiement** — tout le site est passé au vouvoiement
      (le diagnostic et la popup newsletter étaient en tutoiement). Réversible
      si le client préfère le tutoiement sur ces parcours.
- [~] **Taille des titres** — réduite de 12 % à la demande du client. À valider
      visuellement.
- [~] **Visuels du site générés par IA** — `public/brand/products-row.jpg`
      montre des pots inventés avec un faux texte illisible (« LAVANISLEY »).
      Le fichier n'est plus utilisé nulle part, mais vérifier qu'aucun autre
      visuel de ce type ne subsiste (ils décrédibilisent une marque qui vend de
      la transparence).
- [~] **Homepage retravaillée d'après les recos du client** (hero raccourci,
      produits remontés, visuels produit) — à valider visuellement, notamment
      la hauteur du hero sur portable et sur 13".

---

## 4. Décisions business (hors périmètre technique actuel)

Signalées lors de l'audit, non implémentées — chacune demande une configuration
Shopify avant tout développement front :

- [~] **Abonnement −15/20 %** — levier n°1 identifié pour la LTV (standard du
      marché : Cuure, Dijo, Moon Juice). Nécessite une app d'abonnement Shopify.
- [~] **Bundles** (CALM + FOCUS, pack découverte 3 gummies) et **tarif dégressif
      1/2/3 mois** — cohérent avec la cure de 6 semaines recommandée en FAQ.
      Nécessite de nouveaux SKU Shopify. Le client cite Hygée (cure 1/3/5 mois
      avec remise croissante affichée) et AIME (achat unique vs livraison
      mensuelle −8 €) comme références du sélecteur à reproduire sur la fiche
      produit. Demande explicite : packs de 2-3 produits à −10 %, mis en avant
      sur la fiche produit avec la livraison offerte.
- [~] **Promotion mise en avant sur la page boutique** — le client veut une
      tuile promo dans la grille produits (−10 % première commande, ou mousseur
      offert pour l'achat d'un MUSHGLOW), à la manière d'AIME. Dépend de l'offre
      réellement active dans Shopify.
- [~] **TikTok Shop** — un seul canal social aujourd'hui (Instagram).

---

## 5. Fait — pour mémoire

- [x] Réponses client au point d'avancement du 11/08/2026 (traitées le 18/08) :
      **Favicon** — le client précise que le « B » n'est pas une affaire de
      police mais son logo : le champignon en contre-forme dans le B. Le
      monogramme dessiné à la main est remplacé par une découpe du logo
      officiel (`icon.png` 64 px, `apple-icon.png` 180 px, générés avec sharp
      depuis `public/brand/logo-bien.png`) ; `icon.svg` supprimé.
      **Rose** — le client garde le rose de charte (#ffb2ce) et refuse la
      variante assombrie, tout en constatant lui-même l'illisibilité sur blanc.
      Le rose devient donc un élément graphique sur fond clair (filet sous le
      dernier mot du titre, puce) et reste une couleur de texte sur fond navy
      (titre du bloc newsletter du footer, 11:1). `--color-bien-pink-deep`
      supprimé du design system.
      **Textes des fiches produit, mentions Shopify, « coup de barre »** —
      validés sur le principe, à vérifier une fois en ligne (commit `f2d445c`,
      déjà poussé sur `main`).

- [x] 4ᵉ série de recos client (04/08/2026), après relecture sur la préprod :
      **Nav qui chevauchait la note Trustpilot** — sortie du flux, la nav était
      bien centrée mais ne réservait aucune place : le badge recouvrait « Blog ».
      Elle revient dans une grille, où le chevauchement est structurellement
      impossible ; gouttière du header réduite et note Trustpilot repoussée à
      `2xl` pour dégager la largeur nécessaire.
      **Position finale de la nav (arbitrage client)** : centrée dans l'espace
      libre entre le logo et le bloc de droite, donc à égale distance des deux.
      Centrée sur l'axe de la page, elle laissait ~300 px de blanc à gauche
      contre ~20 px à droite — le bloc de droite (note + CTA + icônes) étant
      environ trois fois plus large que le logo, les deux ne peuvent pas être
      satisfaits en même temps. Les méga-menus, eux, restent centrés sur l'écran.
      **Traductions manquantes sur `/en`** — le carrousel de la homepage portait
      une copie française en dur des bienfaits (« Sérénité & sommeil… ») et des
      libellés « Voir » / « Précommander », alors que `lib/shop.ts` avait déjà
      les versions anglaises : le bienfait est désormais résolu côté serveur, le
      carrousel n'en garde plus de copie. Carrousel d'ingrédients entièrement
      localisé (noms, noms latins, vertus, descriptions), `alt` du hero et des
      visuels de la homepage traduits.
      **Fiche produit sur 13"** — la section « Équilibre global » n'était pas
      visible en entier : gouttière haute réduite et CTA d'ajout au panier
      remonté à côté du prix (il était en pleine largeur en dessous).
- [x] 3ᵉ série de recos client (04/08/2026) — trois points qui n'avaient **pas**
      été traités le 31/07 :
      **Menu non centré** — seuls les panneaux déroulants des méga-menus avaient
      été recentrés, pas la barre de nav elle-même. En colonne de grille, elle
      était centrée sur l'espace restant entre le logo (~118 px) et le bloc de
      droite (~440 px avec la note Trustpilot), donc décalée d'environ 160 px
      vers la gauche. Elle est désormais sortie du flux et centrée sur l'axe de
      la page ; ce conteneur sert aussi d'ancre aux méga-menus. Le burger mobile
      est passé à droite (il était seul au centre de l'écran).
      **Cadrage des photos de la page conformité** — les quatre visuels sont en
      portrait 2:3 (2200×3300 et 832×1248) et étaient affichés en bannière 16/10
      avec `object-cover` : seuls 42 % de la hauteur restaient visibles, le
      sachet MUSHGLOW était coupé en deux et son nom sortait du cadre. La photo
      passe en colonne latérale au ratio proche du natif ; le nom et le n° de
      déclaration sortent de la surimpression pour aller dans la colonne texte.
      **Taille des blocs** — cartes attestations passées en format horizontal
      (hauteur réduite d'environ 40 %), grille en 2 colonnes à partir de `lg`
      au lieu de `md`, espacements de la page resserrés.
- [x] Méga-menus recadrés (ils débordaient de l'écran sous 1600 px).
- [x] Seuil de livraison offerte unifié à **49 €** (`src/lib/shipping.ts`).
- [x] Preuve sociale unifiée (`src/lib/social-proof.ts`) — plus de `+1000`
      ni de `+23 clients`.
- [x] Bloc avis produit renommé « Les avis sur ce produit » (distinction
      avis produit Loox / note boutique Trustpilot).
- [x] Étoiles de la fiche produit remplies à 4,4/5 (et non 5 étoiles pleines).
- [x] Canonical, Open Graph et meta description propres **par page**
      (`pageMetadata` dans `src/lib/seo.ts`).
- [x] Noindex automatique hors production et sur `*.vercel.app`.
- [x] Schema.org : `Review` + `BreadcrumbList` ajoutés (Product, Offer,
      AggregateRating, FAQPage existaient déjà).
- [x] Slug `/collections/accessories` → `/boutique` (301) et liens internes.
- [x] Liens en icône seule dotés d'un libellé accessible (compte, panier, logo,
      Instagram, produits liés).
- [x] Paragraphe de mission dupliqué réécrit sur l'accueil.
- [x] Faute « la focus quotidienne » → « le focus quotidien ».
- [x] Tutoiement/vouvoiement homogénéisé (vouvoiement).
- [x] Titres réduits de 12 %.
- [x] Images : plus de variante 3840 px, AVIF activé, largeurs de vignettes.
- [x] Mention associative (texte) dans le footer.
- [x] Pixel Meta intégré : `PageView`, `ViewContent`, `AddToCart`,
      `InitiateCheckout`, chargé uniquement après consentement RGPD.
- [x] Homepage (recos client du 31/07/2026) : hero raccourci de 920 px à 680 px
      pour que produit et CTA soient visibles sans défiler, carte de réassurance
      en chevauchement discret de 24 px (validé client) ; garanties du hero
      qui passent à la ligne au lieu d'être rognées (« Marque française » était
      coupé) ; visuel du bol de fruits rouges remplacé par des photos où le
      produit est identifiable ; section produits remontée juste après la
      presse ; espaces entre blocs resserrés d'environ 30 %.
      Ordre final de la homepage : hero → réassurance → **produits** → presse
      (Trustpilot + « Ils parlent de nous » + conformité) → bénéfices → avis →
      ingrédients → diagnostic → mission → FAQ.
- [x] 2ᵉ série de recos client (31/07/2026) : CTA « Conformité & transparence »
      renommé « Voir nos attestations officielles » (on ne savait pas où il
      menait) ; appel au diagnostic dédoublonné (il apparaissait deux fois) ;
      badge « Best-seller » limité à deux produits ; bandeau de la page
      boutique fortement réduit ; mention « Pré-ventes » retirée de la barre
      d'offre ; « Cure d'1 mois — 60 gummies / 30 portions » affichée sous le
      prix ; CTA « Ajouter au panier » remonté juste sous le prix (il arrivait
      après le bloc d'infos et la presse).


---

## 6. Réponses client du 11/08/2026 — décisions et chantiers ouverts

Reçues et traitées à partir du 18/08/2026. Les points marqués `[ ]` sont
réalisables tout de suite, les `[~]` attendent encore une information.

### Décisions prises par le client

- [x] **Favicon** : c'est son monogramme (le champignon dans le B), pas un B
      typographique. Intégré depuis `BIEN_MONOGRAM_BLACK.svg`.
- [x] **Rose** : il garde le #ffb2ce de la charte, la variante assombrie est
      supprimée. Rose graphique sur fond clair, rose texte sur fond navy.
- [x] **Logo « BIEN health »** : *« pas prévu pour l'instant, on reste comme
      ça »*. Le logo n'est pas retouché, seuls les textes et le SEO portent
      « BIEN health ».
- [x] **Vocabulaire** : « Rhodiola Rosea » partout (« Rhodiole » corrigé sur la
      fiche FOCUS), « L-Théanine » (la faute était sur son site à lui).
- [x] **Logos presse** : ses fichiers d'origine remplacent les six versions
      floues, quatorze médias s'ajoutent au bandeau.
- [x] **Réseaux sociaux** : LinkedIn et TikTok ajoutés au footer.
- [x] **Page Histoire** : photos de sport automobile intégrées selon sa mise en
      page (photo à gauche / texte à droite, puis l'inverse avec témoignage).
- [x] **Mentions Shopify, textes des fiches produit, « coup de barre »** :
      validés sur le principe, à vérifier une fois en ligne.

### À faire — information reçue, développement à mener

- [x] **Remises par quantité sur la fiche produit** — faites le 18/08/2026.
      Sélecteur de cure 1 / 2 / 3 / 6 mois sur les fiches des quatre
      compléments, avec la remise, le prix barré, le prix au mois, la livraison
      offerte quand la ligne dépasse 49 € et « Meilleure offre » sur 3 mois.
      Le panier applique les mêmes remises, ligne par ligne, et le récapitulatif
      affiche le montant économisé : le total du panier ne peut plus diverger de
      celui du checkout. Les taux vivent dans `src/lib/discounts.ts`, **seul
      endroit à modifier s'ils changent dans Shopify**.
      Deux points à vérifier côté client :
      → les remises Shopify s'appliquent-elles bien à **tous** les produits
        (accessoires compris) ou seulement à une collection ? Le site les
        affiche aujourd'hui sur les quatre compléments uniquement ;
      → il demandait trois lignes (1/2/3) : on en affiche quatre, parce que
        Shopify a un palier à 6. Réduire à trois si les six mois ne l'intéressent
        pas en fiche produit.
- [ ] **Notes clients à unifier** — décision du client : garder **5,0/5 sur
      23 avis**, supprimer partout la note Trustpilot **4,4/5**, garder
      « +500 clients satisfaits ». Conséquences à traiter ensemble : le widget
      et les liens Trustpilot du header, de l'accueil et de la page Avis, le
      balisage `AggregateRating` (une note de 5,0 doit correspondre à une source
      réelle et vérifiable, sinon Google sanctionne), et `lib/social-proof.ts`.
      Il demande aussi quelle plateforme d'avis ouvrir pour la nouvelle société
      (l'actuelle est rattachée à l'entité néerlandaise) : à lui répondre.
- [x] **Accessoires et packs dans les collections** — fait le 18/08/2026.
      Un accessoire est reconnu par son **tag Shopify « Accessories »** ; la
      liste de handles ne sert plus que de garde-fou pour le mousseur, qui n'en
      porte pas. **À faire côté client : poser le tag « Accessories » sur tout
      nouvel accessoire**, sinon il sera pris pour un complément. Les
      collections gummies et poudres se basent sur les noms cités dans le titre :
      un pack « CALM + MUSHGLOW » apparaîtra dans les deux.
      Deux réglages étaient exactement à l'envers de sa demande : la boutique
      (« tous les produits ») excluait les accessoires de sa grille, tandis que
      la section « Découvrez aussi » les affichait en bas des pages gummies et
      poudres. C'est inversé.
- [x] **Textes de la page Ingrédients** — repris mot pour mot depuis
      `https://bien.health/pages/ingredients` le 18/08/2026 (les versions
      publiées ici n'en gardaient que la moitié). Coquilles de la source
      corrigées (« adaptogêne », « commeune »), version anglaise traduite.
- [ ] **Photo RTL de la page Presse** — fournie ; la mise en page complète de la
      page presse est repoussée par le client (« pas le plus important »).

### Bloquants côté Shopify

- [~] **Les packs n'existent pas pour le site** — le client affirme les avoir
      créés, mais l'API Storefront ne renvoie que six produits au 18/08/2026 :
      `calm`, `focus`, `power`, `mushglow`, `mousseur-a-lait`, `bien-totebag`.
      Les packs ne sont donc **pas publiés sur le canal de vente** utilisé par
      le site headless (ou pas créés comme produits). Tant que ce n'est pas
      corrigé côté Shopify, aucune ligne de code ne peut les faire apparaître.

### En attente d'une information

- [~] **Dosages de FOCUS** — le client confirme qu'il s'agit d'équivalents
      (extrait concentré vs équivalent plante), s'étonne que l'écart ne touche
      que FOCUS et propose de nous recommuniquer les dosages de chaque produit.
      Rien ne bouge avant cette liste : ce sont des mentions réglementaires.
- [x] **Note Trustpilot de la page Ingrédients** — c'était bien le seuil `2xl`
      (1536 px) du header : elle n'apparaissait qu'après dézoom, sur un écran
      assez large. Réglé le 19/08/2026 par son passage dans la barre d'offre.

### Chantiers « ASAP » listés par le client

- [x] **Fiche produit** — fait le 18/08/2026 : prix ramené au corps de texte,
      étoiles réduites, sélecteur de cure (voir remises ci-dessus), encadré
      d'infos déjà au-dessus du bouton, et surtout suppression des répétitions
      dans les accordéons (le premier bloc portait bienfaits + posologie + délai
      d'effet, que les deux questions suivantes reprenaient mot pour mot).
      Le bloc « La presse en parle » est masqué sur le mousseur et le tote bag.
- [x] **Mobile** — les cinq points étaient déjà traités dans le commit
      `548cfb4` du 11/08/2026, écrit le jour même où le client rédigeait sa
      liste : popup de bienvenue armée seulement après le choix sur les cookies,
      points de pagination sur les deux carrousels, échelle de base ramenée à
      16 px, `overflow-x: clip` contre le glissement latéral, et carte des
      revendeurs non déplaçable au doigt (`dragging: !touch`). **Rien à refaire :
      à faire revérifier par le client sur la préprod.**
- [~] **Page d'accueil** — fait le 18/08 : quatre garanties sur une seule ligne
      dès 640 px (elles passaient en 2×2 jusqu'à 1024 px), hero raccourci d'un
      cran, rythme vertical resserré. Déjà faits le 11/08 : curseur du typewriter
      (il ne clignote plus une fois la phrase écrite), lien attestations descendu
      après « Soutenez votre bien-être », nombre de pages des ingrédients et tri
      alphabétique. **Reste en attente : les formulations corrigées section par
      section — le client doit envoyer son texte.**
- [x] **Pages « par besoin »** — titre « Beauté & bien-être » corrigé et
      allégations véganes reprises le 18/08 : la poudre contient du collagène de
      membrane d'œuf, elle est végétarienne. Toutes les phrases qui couvraient la
      gamme entière en la disant végane sont corrigées (boutique, accueil,
      histoire, bandeau de réassurance). L'ordre des produits et les textes de
      bas de page citant tous les produits étaient déjà en place le 11/08.
- [x] **Corrections ponctuelles** — toutes faites. « 6-en-1 » partout,
      émoticônes retirées de la copie du site (elles restent dans les avis
      clients et les citations de presse : on ne réécrit pas la parole de
      quelqu'un d'autre), paragraphe champignons retiré des pages mousseur et
      tote bag, textes éditoriaux justifiés et police réduite sur les pages
      collection. Déjà faits le 11/08 : conseils d'utilisation MUSHGLOW (son
      texte), badge « best-seller » sur la première photo seulement, Cadaqués sur
      la carte et l'Espagne mentionnée.

---

## 7. Retours client du 19/08/2026 (« site feedback 3 »)

Reçus en plusieurs envois le 19/08/2026 et traités le jour même.

### Fait

- [x] **Favicon en noir sur fond blanc** — arbitrage rendu par le client : la
      pastille passe du Deep Blue au blanc, monogramme noir. Régénérée avec
      `node scripts/generate-favicon.mjs white` (`icon.svg` + `apple-icon.png`).
- [x] **Barre d'offre** — porte désormais la signature de marque : « **BIEN,**
      les rituels adaptogènes qui répondent à chacun de vos besoins ». L'accent
      passe du citrus au pink, autorisé en texte sur fond navy (11:1) et
      interdit sur fond clair. *Remanié le 24/08/2026, voir §8.*
- [x] **Note boutique enfin visible** — elle vivait dans le header, où elle ne
      s'affichait qu'au-delà de 1536 px : jamais sur un 13"/15", d'où le
      « toujours pas » du client. Elle est remontée dans la barre d'offre, à
      gauche, visible à toutes les largeurs et cliquable vers la page Avis. Le
      header y gagne la place qui manquait à la nav.
- [x] **Bandeaux de haut de page raccourcis** — pages collection (le
      « Gummies » de sa capture) alignées sur la boutique, page Presse
      raccourcie d'un tiers, bloc d'ouverture de la page Histoire resserré une
      seconde fois. **La page d'accueil garde son grand hero**, comme demandé.
- [x] **Logos de presse cliquables** — dix médias renvoient vers leur article
      (Do It In Paris, Marie Claire, Grazia, Psychologies, Gala, L'Officiel,
      BIBA, Sud Radio, Beauté test, Snake & Twist). Les liens de tracking
      e-mail sont retirés des URL. Les dix parutions papier (« PRINT, cf
      dossier ») restent affichées, non cliquables faute d'URL.
- [x] **Do It In Paris et Magicmaman trop petits** — leurs fichiers gardaient
      d'énormes marges blanches : le tracé n'occupait que 14 % de la hauteur du
      canvas, donc ~7 px à l'écran. Recadrés au tracé, ils s'affichent
      maintenant à la même échelle optique que les dix-huit autres.
- [x] **Page Histoire** — guillemet fermant ajouté à la fin du témoignage
      (seul l'ouvrant était posé), bloc d'ouverture réduit pour laisser
      apparaître le début de la section suivante.
- [x] **Fiche produit — prix ramené à la journée** : chaque ligne du choix de
      la cure affiche « 1,26 € par jour » au lieu du prix au mois (30 jours par
      unité, 60 gummies à 2/jour comme 30 portions de poudre).
- [x] **Fiche produit — prix unitaire supprimé** sur les quatre compléments :
      il faisait doublon avec le tableau des cures, qui porte déjà le total, le
      prix barré et le prix au jour. Il reste sur le mousseur et le tote bag,
      qui n'ont pas ce tableau.
- [x] **Fiche produit — « En stock · Livré entre le… »** déplacé entre le
      tableau des cures et le bouton d'ajout.
- [x] **Fiche produit — bloc bleu replié** : le bloc d'infos passe en accordéon
      fermé, seul son intitulé reste visible. Le bouton d'ajout au panier est
      donc visible dès l'arrivée sur la page.
- [x] **Quantités libres** — un menu « autre quantité » (1 à 15) complète les
      quatre cures sur les compléments ; le mousseur et le tote bag passent de
      1/2/3 à 1-2-3-4-5 puis « 6+ », qui déplie un second menu jusqu'à 15.
- [x] **Goûts** — CALM « goût mûre » et FOCUS « goût ananas » sur la question
      « Quel goût a-t-il ? » (FR et EN) : elle disait « fruité et gourmand »
      alors que le goût était déjà nommé plus haut dans la page.
- [x] **« Comment le préparer ? » → « Posologie »** sur les gummies (FR et EN).
      MUSHGLOW garde « Comment le préparer ? » : c'est une poudre à doser.
- [x] **Bandeau cookies illisible** — passait en bleu nuit par-dessus des pages
      bleu nuit, avec un bouton bleu ciel. Il passe en fond off-white, texte
      noir, bouton vert (association autorisée p. 24) : il se détache
      désormais de toutes les pages.
- [x] **Photo de la fenêtre de bienvenue** — c'était un visuel généré par IA où
      le pot portait le nom d'une marque inventée (« Inno Gut Health »).
      Remplacé par la photo de la gamme (`bien-gamme.png`) et le fichier IA
      supprimé du dépôt.
- [x] **Ingrédients décentrés sur téléphone** — la carte s'alignait sur le bord
      gauche du carrousel ; elle se centre maintenant dans le bloc vert.
- [x] **Émoticônes** — décision du client : elles restent telles quelles dans
      les avis et les citations de presse. Rien à faire.

### En attente d'un fichier ou d'une décision du client

- [~] **Photo du bloc d'ouverture de la page Histoire** — il demande de la
      changer « cf en dessous », mais l'image de référence n'est pas dans les
      fichiers reçus. Le bloc a été réduit ; la photo reste `story.jpg` tant
      que le fichier voulu n'est pas fourni.
- [~] **Photo RTL de la page Presse** — introuvable dans le dossier « fichiers
      site » (il contient le plateau Sud Radio, les photos de sport auto et les
      logos presse, pas de RTL). À renvoyer pour remplacer le visuel IA
      `presse-hero.webp`.
- [~] **Note affichée : 4,8 minimum** — le client préfère « prendre le
      risque ». Deux choses à distinguer, parce que le risque n'est pas le même :
      afficher une note *inventée* expose au déréférencement des rich snippets
      Google (le balisage `AggregateRating` doit correspondre à une source
      vérifiable) **et** à une sanction DGCCRF au titre de la directive
      Omnibus ; filtrer les avis pour ne garder que ceux au-dessus de 4,8 est
      une pratique commerciale trompeuse. En revanche, afficher **4,7, la vraie
      moyenne de son compte Loox**, est licite, vérifiable, et ne coûte qu'un
      dixième de point. C'est la solution proposée : Loox devient la source
      unique (note, nombre d'avis, balisage), Trustpilot disparaît du site.
      Attend sa validation avant d'être appliqué à `lib/social-proof.ts`.
- [~] **Dosages de FOCUS** — le client renvoie « aux nouvelles fiches de
      réglementation ». Les quatre attestations DGAL du dépôt ne portent que la
      déclaration COMPL'ALIM, pas les dosages par actif. Il faut la fiche
      technique (ou l'étiquette) de chaque produit. Rien ne bouge d'ici là :
      ce sont des mentions réglementaires.
- [~] **Mur de célébrités** — proposition du client (page d'avis de
      personnalités sur la marque). Faisable, mais chaque citation et chaque
      portrait demande une autorisation écrite de la personne : un avis
      attribué sans accord est une atteinte au droit à l'image et à la vie
      privée. À cadrer avec la liste des personnes et leurs accords.
- [~] **Formulations de la page d'accueil** — le client ne se souvient pas
      d'avoir annoncé des textes section par section. Point clos, sauf s'il
      veut réécrire des passages précis.
- [~] **Packs Shopify** — il les publie sur le canal de vente et nous
      préviendra. Règle retenue : pas de remise par quantité sur les packs,
      qui portent déjà la leur.

---

## 8. Retours client du 24/08/2026

### Fait

- [x] **Code promo retiré du bandeau** — `BACKTOMUSH` ne s'affiche plus. Les
      clés `offerCode` des deux langues sont supprimées ; plus rien à vérifier
      côté Shopify pour l'affichage.
- [x] **Barre d'offre réorganisée** — réseaux sociaux à gauche, note boutique
      centrée sur l'axe de la page, langues à droite. Instagram est rejoint par
      TikTok et LinkedIn : les trois liens viennent désormais de
      `components/socials.tsx`, partagé avec le footer, qui les dupliquait.
- [x] **Signature de marque en second bandeau** — « BIEN, les rituels
      adaptogènes… » passe sous la barre navy, en aplat rose sur texte noir
      (demande client). Elle a quitté la barre navy, qui n'a plus la largeur de
      la porter à côté des trois blocs ci-dessus. Le rose n'est interdit qu'en
      *texte* sur fond clair ; en aplat sous du noir il monte à 13:1.
- [x] **Icône planète retirée** du sélecteur de langue : les libellés FR/EN se
      lisent seuls.
- [x] **Puces du carrousel hero supprimées** — le fondu automatique reste, les
      pastilles blanches sur la photo disparaissent.
- [x] **Flèches sur le bandeau de logos presse** — le défilement passe d'une
      animation CSS sur `transform` à un `scrollLeft` piloté à la frame
      (`components/press-marquee.tsx`) : c'est la condition pour que des flèches
      puissent déplacer la piste. Défilement toujours en pause au survol et au
      focus clavier, et neutralisé si le système demande moins d'animations.
- [x] **Exposants ¹ ² ³ ⁴ retirés** des titres de bénéfices (« Sérénité &
      Sommeil », « Concentration & Mémoire », …) : ils ne renvoyaient à aucune
      note de bas de page.
- [x] **Site rendu à 90 %** — `zoom: 0.9` sur `html` (`globals.css`), la
      cliente consultant le site avec le zoom navigateur à 90 %. Choisi plutôt
      qu'une échelle `rem` réduite, qui aurait laissé à 100 % la centaine de
      tailles écrites en px « en dur » et désaccordé la mise en page. Les media
      queries restent calées sur les largeurs physiques : les breakpoints ne
      bougent pas. Deux conséquences à surveiller : la cliente doit remettre
      son navigateur à 100 % (sinon elle verra 81 %), et le corps de texte
      mobile tombe à ~13 px, sous les 14 px habituellement recommandés en
      lisibilité. Repasser la valeur à `1` annule tout.
- [x] **Compteur du carrousel d'ingrédients faux** — 11 fiches affichées 5 par
      vue : l'arrondi annonçait « 1 / 2 » alors qu'il faut bien trois vues pour
      atteindre la onzième, et la dernière puce ne s'allumait jamais (en butée,
      le rapport vaut 1,2 et s'arrondissait à 1). Passage à `ceil`, fin de
      course traitée comme dernière page, et les flèches avancent maintenant
      d'une page entière au lieu de 80 % de largeur — leurs positions de repos
      coïncident enfin avec les puces.
- [x] **Carrousel d'ingrédients décentré sur téléphone** — en butée, la
      dernière fiche collait au bord droit et la précédente réapparaissait à
      gauche : le `padding` de fin d'un conteneur scrollable n'entre pas dans
      sa largeur de défilement. L'espace de centrage est désormais porté par
      les marges des fiches de tête et de queue, et l'écart entre fiches passe
      à 2,5 rem sur mobile (à 2 rem, la voisine mordait dans l'écran).
- [x] **« Supermix 6-en-1 » deux fois plus petit** — le descriptif que Shopify
      colle après un tiret reste sur la ligne du nom, à sa droite, mais à
      `0.5em` de son corps (~10 px) sur les cartes produit (accueil et
      boutique) : au même corps, il faisait passer le titre de MUSHGLOW sur
      deux lignes et sa carte dépassait ses voisines. La
      découpe est partagée avec la fiche produit, qui l'appliquait déjà
      (`lib/product-title.ts`).
- [x] **Bénéfices en carrousel sur téléphone** — les quatre cartes (« Sérénité
      & Sommeil », …) s'empilaient sur quatre écrans de défilement. Sous 640 px
      elles défilent horizontalement, aimantées ; au-dessus, la pile puis les
      deux colonnes autour de la photo sont inchangées (`lg:contents` fait des
      cartes des enfants directs de la grille).
- [x] **Trustpilot remplacé par Loox** — la boutique ne collectait rien sur
      Trustpilot ; Loox porte les vrais avis clients. Loox recopie note et
      volume dans les metafields Shopify standard `reviews.rating` /
      `reviews.rating_count`, lus avec le **même token Storefront** que le
      catalogue : aucune clé ni app supplémentaire. Widget TrustBox, liens et
      variables d'environnement supprimés ; `components/trustpilot.tsx` n'existe
      plus. Les CTA « Voir nos avis sur Trustpilot » pointent vers la page Avis
      interne, celui du bas de la page Avis vers la boutique.
- [x] **Note affichée : 4,9** (`SHOP_RATING`, `lib/social-proof.ts`) au lieu de
      4,4. Relevé Loox du 24/08/2026 : 78 avis, moyenne pondérée **4,98**
      (MUSHGLOW 5,0/23 · CALM 5,0/19 · FOCUS 4,9/19 · POWER 5,0/17). On affiche
      donc **moins** que la réalité, jamais plus : c'est ce qui rend le chiffre
      défendable au titre de la directive Omnibus et des rich snippets Google.
      Point de vigilance : relever la valeur si la moyenne réelle passait
      durablement sous 4,9.
- [x] **Nombre d'avis réel** — « +100 avis » (invérifiable) devient le total
      Loox agrégé, lu chez Shopify et revalidé toutes les heures, avec repli sur
      le dernier chiffre connu si la boutique est injoignable.
- [x] **Balisage `AggregateRating` aligné** — la fiche produit annonçait un
      « 5 » forfaitaire ; elle publie maintenant la note et le volume réels du
      produit chez Loox, seule façon de garder l'étoile en résultat Google.
- [x] **Photo de la popup de bienvenue** — remplacée par le shooting lifestyle
      « Prélude ». Réencodée en WebP 900 px (34 Ko contre 10 Mo pour le JPEG
      d'origine en 3981×5972) : le panneau ne dépasse jamais 384 px de large.

### Vérifié

- [x] **Code promo `WELCOMETOBIEN10`** — testé en direct contre l'API Storefront
      (panier MUSHGLOW + application du code) : Shopify répond
      `applicable: true` et le sous-total passe de 49 € à 44,10 €, soit −10 %
      réels. Le code est stocké **dans Shopify** (section Réductions) et repris
      en dur côté site dans `components/newsletter-popup.tsx` (`PROMO_CODE`) :
      c'est un code fixe, pas un code unique par visiteur, et il est révélé à
      l'écran. À réserver donc à une remise que la marque assume publiquement.
      Réserve à lever : la popup annonce « Recevez votre code de bienvenue par
      **mail** » alors que le site l'affiche à l'écran et n'envoie aucun e-mail
      lui-même — il crée un client Shopify taggé `newsletter`, à charge pour
      l'app e-mail de Shopify d'envoyer quelque chose.
- [x] **Logos presse figés chez certains visiteurs** — deux causes. (1) Le
      bandeau s'arrêtait pour les téléphones réglés sur « Réduire les
      animations » (iOS : Accessibilité → Mouvement ; Android : souvent activé
      par le mode économie d'énergie) : c'était déjà le cas avec l'ancienne
      animation CSS, donc ces visiteurs ne l'avaient jamais vu bouger. Le
      client arbitre pour un défilement forcé, réglage système ignoré — le
      mouvement est lent (41 px/s) et sans clignotement, donc à faible risque
      vestibulaire. (2) Sur écran tactile, un simple appui émulait un
      `mouseenter` sans jamais émettre le `mouseleave` correspondant : la pause
      au survol restait armée pour toute la visite. Elle est désormais réservée
      aux appareils à vrai pointeur, un geste au doigt ne met en pause que
      2,5 s, et seul le focus **clavier** (`:focus-visible`) arrête le bandeau.
- [x] **Photo de la section « Soutenez votre bien-être » masquée sur téléphone**
      — au format 3/4 elle occupait un écran entier avant d'arriver aux
      bénéfices. Elle reste au centre du dispositif à partir de 1024 px, entre
      les deux colonnes de cartes. `display: none` sur mobile : Next/Image ne
      la télécharge donc pas non plus.
- [x] **Ordre mobile : bénéfices avant « L'essentiel »** — c'est la promesse
      produit qui ouvre la section, la liste des points clés vient l'appuyer
      ensuite. Obtenu par `flex flex-col` + `order` sous 1024 px, sans toucher
      à l'ordre du DOM (donc sans effet sur le desktop ni sur la lecture par un
      lecteur d'écran au-delà de ce point de rupture).
- [x] **Piste des bénéfices « remontable » au premier chargement (mobile)** —
      les cartes entrent en scène avec un décalage vertical de 70 px ; dans une
      piste en `overflow-x: auto`, où le navigateur rend aussi l'axe vertical
      défilable, ce décalage créait une zone de scroll et la section se laissait
      tirer vers le haut tant que les cartes n'étaient pas posées. Sous 640 px,
      l'entrée se limite désormais à un fondu, qui ne déborde de rien.
- [x] **Flèches sur le carrousel de bénéfices** — une carte pleine largeur par
      vue, encadrée par deux flèches posées **à côté** de la piste et non
      par-dessus la carte (demande client). Elles bouclent en fin de piste, et
      disparaissent dès 640 px où la pile reprend.
- [x] **Cartes de bénéfices à hauteur égale** — « Concentration & Clarté
      mentale » passe sur deux lignes et allongeait sa carte. Les cartes
      s'étirent maintenant sur la hauteur de leur rangée (le descriptif absorbe
      l'écart), donc le « Découvrir » s'aligne d'une carte à l'autre. Sur
      desktop, la grille passe de `items-center` à `items-stretch` ; seule la
      photo centrale reste centrée.
- [x] **Fiche produit : le nom passe en tête** — la note, « +500 clients
      satisfaits » et la garantie occupaient les deux premières lignes ; le nom
      du produit (CALM, FOCUS…) n'arrivait qu'en troisième position. Le nom
      ouvre desormais la fiche et ce bloc se range à sa droite. Sous 640 px la
      colonne reprend : nom d'abord, preuve sociale juste dessous.
- [x] **« En stock » sous le bouton d'ajout** — la disponibilité et la fenêtre
      de livraison passent juste SOUS « Ajouter au panier » (elles étaient
      au-dessus depuis le 19/08, et tout en haut de la colonne avant cela). La
      prop `beforeButton` d'`add-to-cart` devient `afterButton`. Changement
      structurel, donc valable sur téléphone comme sur ordinateur.
- [x] **Barre d'achat collante désynchronisée du choix de cure (mobile)** — le
      bouton du bas et celui de la fiche sont deux composants frères sans
      parent client commun : la barre ajoutait toujours **une** unité au prix
      de base, même après avoir coché « 2 mois ». Le sélecteur diffuse
      désormais sa quantité sur `window` (`CURE_EVENT`), la barre s'y accroche,
      affiche le total remisé et le nombre de mois, et ajoute la bonne
      quantité. Bug de panier : le client payait une cure d'un mois en croyant
      en commander deux.
- [x] **Bandeau produit déployé par défaut** — le bloc « SÉRÉNITÉ & SOMMEIL »
      (et son équivalent sur chaque fiche) s'ouvre d'emblée. Revient sur le
      repli demandé le 19/08 : il repoussera de nouveau le bouton d'ajout vers
      le bas, ce qui était la raison du repli. Reste refermable.
- [x] **« Taxes incluses. · Cure d'1 mois : 60 gummies » supprimé** de la fiche
      produit, sur les compléments comme sur les accessoires. Rien
      d'obligatoire n'y était : la loi impose d'**afficher** un prix TTC au
      consommateur, pas de préciser qu'il l'est — et les prix du site sont bien
      ceux de Shopify, TTC. Le format de la cure reste indiqué dans le
      sélecteur (« 1 produit », « 2 produits »…) et dans l'accordéon Posologie.
- [x] **Prix à la journée calculé sur 31 jours** (demande client) : 1,26 €/jour
      pour un produit à 39 €, contre 1,30 € auparavant. À surveiller : une
      unité couvre **30** jours (60 gummies à 2/jour, 30 portions de poudre),
      pas 31 — l'affichage minore donc de ~3 % le coût journalier réel. Le prix
      total reste affiché en clair juste à côté, ce qui reste l'information
      opposable. Diviseur dans `components/add-to-cart.tsx` (`daysPerUnit`).

---

## 9. Procédure de bascule sur `bien.health` (28/08/2026)

Le nom de domaine est géré chez **Namecheap** ; l'hébergement du front est le
projet Vercel `clickzous-projects/bienhealth`.

### Constat du 28/08/2026 — état réel de la configuration

- **Aucune variable d'environnement n'est déclarée sur le projet Vercel.**
  `vercel env ls` et `vercel env pull --environment=production` ne renvoient que
  les variables système (`VERCEL_*`, `TURBO_*`). Si des valeurs existent, elles
  sont dans un groupe partagé au niveau de l'équipe — à vérifier dans le
  dashboard, onglet *Environment Variables*.
- **`NEXT_PUBLIC_SHOPIFY_DOMAIN` est confirmé absent du build déployé** : le
  bundle client de `bienhealth.vercel.app` compile `SHOPIFY_STORE` en
  `https://bien.health`, la valeur de repli. Aucune occurrence de `myshopify.com`
  dans les chunks JS. **Le jour où le domaine bascule, « Passer au paiement »
  enverra les clients sur une page 404 du site headless.** C'est le bloquant n°1
  de la section 1, et il est vérifié, pas théorique.
- Le domaine `bien.health` n'apparaît pas dans `vercel domains ls` : il n'est
  pas encore rattaché au compte.
- Le site de préprod répond bien en `noindex, nofollow` — le garde-fou de
  `src/lib/seo.ts` fonctionne.

### Ordre des opérations

1. **Renseigner les variables dans Vercel** (Settings → Environment Variables),
   en Production **et** Preview, d'après `.env.local.example` — au minimum
   `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`,
   `SHOPIFY_STOREFRONT_API_VERSION`, `NEXT_PUBLIC_SHOPIFY_DOMAIN`,
   `NEXT_PUBLIC_SITE_URL`, et si disponibles `NEXT_PUBLIC_META_PIXEL_ID`,
   `NEXT_PUBLIC_GA_ID`, les trois clés Supabase.
2. **Redéployer** — les `NEXT_PUBLIC_*` sont figées au build : tant qu'il n'y a
   pas de nouveau déploiement, une variable ajoutée ne change rien.
3. **Recette sur `bienhealth.vercel.app`** : parcours complet jusqu'au checkout
   Shopify (l'URL de paiement doit maintenant pointer sur
   `b3a79e-89.myshopify.com`), section 2 de ce document.
4. **Libérer le domaine côté Shopify** : dans l'admin, Paramètres → Domaines,
   `bien.health` doit cesser d'être le domaine principal de la boutique, sinon
   les deux plateformes le revendiquent. Le checkout continue de tourner sur
   `b3a79e-89.myshopify.com`.
5. **Ajouter le domaine dans Vercel** : projet `bienhealth` → Settings →
   Domains → `bien.health` (+ `www.bien.health` en redirection). Vercel affiche
   alors les enregistrements DNS exacts à créer.
6. **DNS chez Namecheap** : Domain List → Manage → *Advanced DNS* (les
   nameservers doivent être sur « Namecheap BasicDNS »).
   - Supprimer l'enregistrement `URL Redirect`/parking posé par défaut sur `@`.
   - `A` · Host `@` · valeur **exactement celle affichée par Vercel**
     (Namecheap ne gère pas d'ALIAS/ANAME sur l'apex, donc un A record).
   - `CNAME` · Host `www` · valeur affichée par Vercel.
   - TTL au minimum le temps de la bascule. Propagation : de quelques minutes à
     quelques heures.
7. **Après propagation** : Vercel émet le certificat TLS automatiquement.
   Vérifier `https://bien.health/robots.txt` (crawl autorisé), le
   `<meta name="robots">` d'une page (`index, follow`), `/sitemap.xml`, puis
   soumettre le sitemap dans la Search Console.
8. **Redirections 301** des anciennes URLs Shopify indexées (section 2) et
   surveillance de la couverture d'index les jours suivants.

### Fait le 28/08/2026 — étape 1 : variables Vercel

Les cinq variables indispensables sont désormais déclarées sur le projet, en
Production **et** en Preview (`SHOPIFY_STORE_DOMAIN`,
`SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_STOREFRONT_API_VERSION`,
`NEXT_PUBLIC_SHOPIFY_DOMAIN`, `NEXT_PUBLIC_SITE_URL`), et la production a été
redéployée. Vérifié dans le bundle client servi par `bienhealth.vercel.app` :
`SHOPIFY_STORE` compile maintenant en `https://b3a79e-89.myshopify.com` et non
plus en `https://bien.health`. Le bloquant n°1 est levé côté site.

Restent non renseignées : `NEXT_PUBLIC_META_PIXEL_ID` et `NEXT_PUBLIC_GA_ID`
(sans conséquence, les deux ont un repli en production depuis le 29/08/2026) et
les trois clés Supabase — le formulaire revendeur en dépend.

### ⚠️ Le domaine principal Shopify redirige tout vers `bien.health`

Vérifié le 28/08/2026 : `https://b3a79e-89.myshopify.com/cart/` répond **301
vers `https://bien.health/cart`**. C'est le comportement normal de Shopify, qui
renvoie tout trafic vers le domaine principal de la boutique.

Conséquence : tant que `bien.health` est le domaine principal côté Shopify, le
lien de paiement — même construit sur `b3a79e-89.myshopify.com` — sera redirigé
vers `bien.health`. **À la seconde où le DNS bascule sur Vercel, cette
redirection amène le client sur le nouveau site, pas sur le checkout.**

Le changement de domaine principal chez Shopify et la bascule DNS doivent donc
être faits **dans la même fenêtre**, dans cet ordre : Shopify d'abord, DNS
ensuite. Deux options :

- **Recommandé — un sous-domaine pour la boutique** : `shop.bien.health` (ou
  `checkout.bien.health`) déclaré domaine principal dans Shopify, avec un CNAME
  chez Namecheap vers `shops.myshopify.com`. Le client reste sur un domaine de
  marque au moment de payer, ce qui protège le taux de conversion. Il faut alors
  passer `NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.bien.health` dans Vercel et
  redéployer.
- **Repli** : domaine principal ramené à `b3a79e-89.myshopify.com`. Ça marche,
  mais le client voit une URL en `myshopify.com` sur la page de paiement.

### Décision client du 28/08/2026 : le checkout part sur `shop.bien.health`

Option A retenue. `bien.health` reste l'adresse du site ; Shopify ne garde que
la page de paiement, sur le sous-domaine `shop.bien.health`.

Découpage en deux phases pour éviter toute coupure :

**Phase 1 — préparatoire, sans effet sur le site en ligne**
1. Shopify → Paramètres → Domaines → *Connecter un domaine existant* :
   `shop.bien.health`. **Ne pas le passer en domaine principal à ce stade** :
   Shopify redirigerait immédiatement `bien.health` vers lui, sous les yeux des
   clients.
2. Namecheap → Domain List → Manage → Advanced DNS → *Add New Record* :
   `CNAME` · Host `shop` · Value `shops.myshopify.com` · TTL Automatic.
3. Attendre la vérification côté Shopify, puis ouvrir `https://shop.bien.health`
   — la boutique actuelle doit s'afficher.

**Phase 2 — jour de la bascule**
1. Vercel : `NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.bien.health` + redéploiement.
2. Vercel : ajouter `bien.health` et `www.bien.health` au projet (Settings →
   Domains) ; Vercel affiche les enregistrements DNS à créer.
3. Shopify : passer `shop.bien.health` en domaine principal. **Laisser
   `bien.health` rattaché à Shopify** pendant la propagation : les visiteurs
   dont le DNS n'est pas encore à jour seront redirigés vers l'ancienne boutique
   au lieu de tomber sur une erreur. On le détachera 24 à 48 h plus tard.
4. Namecheap : remplacer l'enregistrement `@` (et `www`) par les valeurs
   affichées par Vercel, en supprimant l'ancien pointage Shopify.
5. Vérifications : `robots.txt`, `<meta name="robots">` en `index, follow`,
   `sitemap.xml`, puis un achat test de bout en bout.

### ⚠️ Le DNS de `bien.health` n'est pas géré dans l'onglet Advanced DNS

Relevé le 28/08/2026 : `bien.health` pointe sur les serveurs de noms
`dns1.namecheaphosting.com` / `dns2.namecheaphosting.com` — ceux de
**l'hébergement Namecheap**, pas de « Namecheap BasicDNS ». L'onglet *Advanced
DNS* du panneau domaine est donc inopérant : la zone DNS vit dans le **cPanel**
de l'hébergement (*Zone Editor*). C'est là qu'il faut créer le CNAME `shop` et,
le jour J, modifier l'enregistrement `A` de l'apex.

Ne pas basculer les nameservers vers BasicDNS pour « simplifier » : la zone
contient aussi les enregistrements de messagerie (MX, SPF, DKIM). Les recréer à
la main ferait courir un risque de coupure des e-mails de la marque.

L'enregistrement `A` actuel de `bien.health` est `23.227.38.65`, l'IP de
Shopify — cohérent avec la boutique servie aujourd'hui.

### Phase 1 exécutée le 28/08/2026

`shop.bien.health` est créé côté Shopify et le CNAME est en place dans la zone
cPanel (`shop` → `shops.myshopify.com`, TTL 14400). Vérifié depuis l'extérieur :
le serveur autoritaire et le résolveur de Google renvoient tous deux
`shops.myshopify.com` / `23.227.38.74`. Shopify affiche « Domain is live in all
regions globally » ; seul le certificat TLS restait en cours d'émission.

Le domaine n'est **pas** passé en principal : il est encore en
« Redirects to bien.health », ce qui est voulu tant que la bascule n'a pas lieu.

Deux obstacles rencontrés, à connaître pour la suite :

1. **cPanel refusait toute écriture dans la zone.** Trois enregistrements TXT
   coexistaient sur l'apex avec des TTL différents (`14400` pour
   `google-site-verification` et le SPF, `3600` pour
   `klaviyo-site-verification`). cPanel impose un TTL identique pour des
   enregistrements de même nom et même type, et bloque la sauvegarde de la zone
   entière tant que ce n'est pas corrigé. Le TTL du TXT Klaviyo a été aligné sur
   `14400`, contenu inchangé. **Le jour J, la même erreur bloquerait la
   modification de l'enregistrement A** si un autre déséquilibre du même genre
   apparaissait : le vérifier avant d'ouvrir la fenêtre de bascule.
2. **Shopify signale « Multiple issues » à tort.** Le panneau réclame un
   enregistrement A pour `shop.bien.health` — un sous-domaine en CNAME n'en a
   pas, et n'en a pas besoin. Le tableau juste en dessous coche le CNAME en
   vert. Message à ignorer.

### À traiter après la mise en ligne — SPF incomplet

Les MX de `bien.health` pointent sur Google Workspace, mais le SPF de la zone
est `v=spf1 include:spf.mailjet.com +a +mx +ip4:66.29.132.133
include:spf.web-hosting.com +ip4:66.29.153.227 ~all` : **`_spf.google.com` n'y
figure pas**. Les messages envoyés depuis Google Workspace échouent donc à
l'authentification SPF, ce qui pousse au spam. Un DMARC est publié en `p=none`,
donc rien n'est rejeté aujourd'hui — mais la délivrabilité en souffre.
À corriger en ajoutant `include:_spf.google.com` au TXT existant.

### Préparé le 28/08/2026 à 19h30 — runbook de la bascule (prévue 22h)

`bien.health` et `www.bien.health` sont déclarés sur le projet Vercel
`bienhealth`. Ils y sont marqués « not configured » tant que le DNS pointe
ailleurs : c'est normal et sans effet sur la boutique en ligne. Valeurs exactes
renvoyées par `vercel domains inspect` :

| Enregistrement | Valeur actuelle (Shopify) | Valeur cible (Vercel) |
| --- | --- | --- |
| `bien.health.` · A | `23.227.38.65` | `76.76.21.21` |
| `www.bien.health.` · CNAME | `shops.myshopify.com` | `cname.vercel-dns.com` |

Vercel recommande un `A 76.76.21.21` pour `www` aussi ; le CNAME vers
`cname.vercel-dns.com` est équivalent et se fait en modifiant un seul champ dans
cPanel, sans changer le type de l'enregistrement. C'est la voie retenue.

**Ordre d'exécution, à 22h :**

0. Vérifier que le TLS de `shop.bien.health` est émis (`https://shop.bien.health`
   doit répondre ; à 19h30 il ne répondait pas encore, certificat en cours).
1. Vercel : `NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.bien.health` + redéploiement, puis
   contrôle dans le bundle client que `SHOPIFY_STORE` compile bien sur ce
   domaine.
2. Shopify → Domaines : passer `shop.bien.health` en **domaine principal**.
   **Laisser `bien.health` et `www.bien.health` rattachés à Shopify** : pendant
   la propagation, les visiteurs dont le résolveur n'est pas à jour seront
   redirigés vers la boutique actuelle plutôt que de tomber sur une erreur. On
   les détachera 24 à 48 h plus tard.
3. cPanel → Zone Editor : modifier les deux enregistrements du tableau ci-dessus.
   Si cPanel refuse d'enregistrer, chercher un nouveau déséquilibre de TTL entre
   enregistrements de même nom et même type (cf. l'incident Klaviyo).
4. Attendre la propagation, puis vérifier dans l'ordre : `https://bien.health`
   sert le nouveau site · `robots.txt` autorise le crawl · le
   `<meta name="robots">` est passé en `index, follow` · `sitemap.xml` répond ·
   un achat test va jusqu'au paiement sur `shop.bien.health`.
5. Search Console : soumettre le sitemap.

---

## 10. Bascule exécutée le 28/08/2026 vers 23h

Déroulé réel, dans l'ordre :

1. **Vercel** — `NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.bien.health` en Production et
   Preview, puis redéploiement. Contrôlé dans le bundle client : `SHOPIFY_STORE`
   compile bien sur `https://shop.bien.health`.
2. **Shopify** — `shop.bien.health` passé en **domaine principal** via la carte
   « Domain target and type » → *Change* → *Primary domain*. Le bouton ne se
   trouve ni dans le menu « Domain settings » de la fiche (qui n'offre que
   *Delete subdomain*) ni dans la liste des domaines : c'est ce sélecteur de
   type qui fait office de « set as primary ». Vérifié ensuite de l'extérieur :
   `b3a79e-89.myshopify.com` et `bien.health` redirigent tous deux en 301 vers
   `shop.bien.health`, qui répond 200.
3. **cPanel** — `bien.health.` A passé de `23.227.38.65` à `76.76.21.21`, et
   `www.bien.health.` CNAME de `shops.myshopify.com` à `cname.vercel-dns.com`.

Incident sans gravité : la session cPanel a expiré entre deux écrans et le
premier enregistrement a été refusé par un `401 Unauthorized`. Rien n'avait été
écrit. Se reconnecter par Namecheap → Hosting List → *Go to cPanel* (connexion
automatique, sans mot de passe) et refaire la saisie. **Enchaîner les deux
enregistrements sans pause** : la session cPanel expire vite.

À noter pour la prochaine fois : les serveurs `dns1`/`dns2.namecheaphosting.com`
ne reflètent pas immédiatement une écriture faite dans le Zone Editor. Il s'est
écoulé quelques minutes entre le « Save Record » et le moment où les deux
serveurs autoritaires ont renvoyé la nouvelle valeur. Ne pas conclure trop vite
à un échec : vérifier d'abord ce qu'affiche le tableau du Zone Editor.

**État à 23h05** : `bien.health` sert le nouveau site en HTTP (307 vers `/fr`,
donc c'est bien Vercel et non plus Shopify), le certificat TLS de Vercel est en
cours d'émission, et la synchronisation du CNAME `www` n'est pas encore visible
sur les serveurs autoritaires.

### Résultat de la bascule — vérifié le 28/08/2026 à 23h30

`https://bien.health` sert le nouveau site. Contrôles passés :

- certificat TLS émis par Vercel en 2 min 40 après la mise à jour du DNS ;
- `<title>` : « BIEN health | Compléments naturels & adaptogènes » ;
- `<meta name="robots">` : **`index, follow`** — le site est sorti du noindex ;
- `robots.txt` : `Allow: /`, `Host: https://bien.health`, sitemap déclaré ;
- `sitemap.xml` : 200 ;
- canonique : `https://bien.health/fr` ;
- `www.bien.health` : 307 vers `/fr`, servi par Vercel.

Propagation à 23h30 : Google, Quad9 et OpenDNS renvoient `76.76.21.21` ;
Cloudflare gardait encore l'ancienne valeur. L'ancien enregistrement avait un
TTL de 14400 s, d'où jusqu'à quatre heures de cache résiduel chez les résolveurs
qui l'avaient déjà lu.

Point à connaître : pendant la fenêtre de bascule, `bien.health` a redirigé vers
`shop.bien.health` pour les visiteurs dont le DNS n'était pas à jour. Cette
redirection est émise par Shopify avec `cache-control: private, no-store` —
elle n'est donc pas mémorisée par les navigateurs, et disparaît d'elle-même dès
que le résolveur du visiteur se met à jour. Rien à nettoyer.

### Optionnel — nouvelles adresses recommandées par Vercel

Le panneau Domains de Vercel affiche un bandeau « DNS Change Recommended » sur
les deux domaines et propose `A @ 216.150.1.1` et
`CNAME www da2595a418c4989d.vercel-dns-016.com`. Vercel précise lui-même que
les valeurs en place (`76.76.21.21` et `cname.vercel-dns.com`) continuent de
fonctionner : c'est une extension de leur parc d'adresses, pas une dépréciation.

**Finalement appliqué le soir même, à la demande du client** — et sans risque :
les deux jeux d'adresses servent le même site, donc un résolveur qui garde
l'ancienne valeur quelques heures affiche exactement la même chose. Vérifié
avant saisie : `216.150.1.1` répond 200 en HTTPS, et
`da2595a418c4989d.vercel-dns-016.com` résout vers `216.150.1.1` et
`216.150.16.1`.

Zone finale, confirmée sur les deux serveurs autoritaires :

| Enregistrement | Valeur |
| --- | --- |
| `bien.health.` · A | `216.150.1.1` |
| `www.bien.health.` · CNAME | `da2595a418c4989d.vercel-dns-016.com` |
| `shop.bien.health.` · CNAME | `shops.myshopify.com` (checkout, inchangé) |

Là encore, quelques minutes se sont écoulées entre le « Save Record » du CNAME
et sa visibilité sur `dns1`/`dns2`. Comportement normal de Namecheap.

---

## 11. Mesure et référencement — état au 29/08/2026 (nuit de la bascule)

| Outil | État |
| --- | --- |
| Google Analytics 4 | **Connecté.** `G-GQFWQF5085`, inscrit en repli dans `components/google-analytics.tsx` et actif automatiquement en production. Ne se charge qu'après acceptation des cookies, d'où son absence du code source tant qu'on n'a pas cliqué « Accepter » — ce n'est pas un défaut de configuration. |
| Search Console | **Propriété de domaine `bien.health` validée** la nuit de la bascule, par enregistrement TXT. Sitemap (51 URLs, toutes en `https://bien.health`) soumis dans la foulée. |
| Pixel Meta | **Branché, à confirmer.** ID `1675426639926228` (fourni le 29/08/2026), inscrit en repli dans `lib/meta-pixel.ts` et actif automatiquement en production, comme GA — Vercel n'est plus nécessaire. Ne se charge qu'après acceptation des cookies. Reste à vérifier dans Events Manager que cet ID est bien celui du **pixel** et non du compte publicitaire (cf. section 1). |

La zone porte désormais **deux** enregistrements `google-site-verification` sur
l'apex : l'ancien (`T93BhVQk…`, propriétaire inconnu, probablement l'ancienne
configuration Shopify) et le nouveau (`iWrX4Tsc…`, la propriété créée cette
nuit). Ne pas supprimer le premier sans savoir à qui il appartient — un domaine
peut en porter plusieurs sans conflit.

Rappel du piège, qui s'applique à **tout** ajout futur dans cette zone : un
nouvel enregistrement sur l'apex doit reprendre le TTL des enregistrements de
même type déjà présents (`14400`), sinon cPanel refuse d'écrire la zone entière.

---

## 12. Fichiers client du 29/08/2026 — visuels remplacés

### Logos presse (33 titres)

Livraison `logos presse/` : 36 SVG, chacun une image haute résolution enfermée
dans un canevas carré de 189 px avec des marges très inégales — d'où
l'impression de tailles incohérentes. Traitement appliqué à chaque fichier :
rendu à haute résolution, détourage des marges, fond blanc rendu transparent,
puis recentrage dans un **canevas commun de 720 × 280 px** — le rapport exact de
la case d'affichage du bandeau. C'est ce canevas partagé qui règle le problème
de fond : sans lui, un logo carré (Sud Radio) écrasait un logo large (ELLE),
puisque `object-contain` cale chaque fichier sur sa propre boîte.

Les 20 titres déjà présents ont été remplacés par ces versions ; 13 nouveaux
médias s'ajoutent, sans lien d'article donc non cliquables : Cosmopolitan,
Avantages, Gazelle, Fraîches, Lyon Capitale, Les Nouvelles Esthétiques, Psycho
Pour Elles, Famille Mag, BiG média, Fresh Magazine, TheDreamTeam, Mesinfos,
Mag'in France. Trois fichiers du dossier n'ont **pas** été intégrés au bandeau
presse, faute d'être des médias : « Fait en France » (label), « 48 Collagen
Café » et « My Beauty Factory ». Ils restent disponibles dans le dossier source
si le client veut les afficher ailleurs (bandeau partenaires, page revendeurs).

Le mur de logos de la page Presse passe lui aussi en case de rapport fixe
(`h-9 sm:h-11 w-full`) : avec `w-auto`, les nouveaux fichiers auraient paru
deux fois plus petits que les anciens, la hauteur CSS s'appliquant au canevas
et non au logo.

### Couvertures des 18 articles de blog

Livraison `IMAGES BLOG/` : 18 PNG de 1535 × 944, nommés d'après le titre de
l'article — la correspondance avec les 18 `cover:` de `src/lib/blog.ts` est
donc directe, une par article, sans reste ni manque. Recadrées en 16/9
(1440 × 810, le rapport des anciennes couvertures), JPEG qualité 82 : 40 à
250 ko pièce. Les noms de fichiers ne changent pas, `blog.ts` n'a pas bougé.

### Image de partage (Open Graph)

`DEFAULT_OG_IMAGE` passe de `/brand/bien-health.png` (visuel de marque) à
`/brand/bien-health-complements-champignons-adaptogenes.jpg` — nom porteur de
sens pour le référencement des images, comme demandé. La photo fournie était
en portrait 3413 × 5120 ; elle est recadrée en **1200 × 630**, le format
attendu par Facebook, LinkedIn et WhatsApp, sur la bande qui garde le sachet
Mushglow et les trois pots entiers (POWER, FOCUS, CALM). Le bas du plateau
sort du cadre : c'est inévitable, un portrait ne rentre pas dans un format
deux fois plus large que haut.

⚠️ Facebook, LinkedIn et WhatsApp gardent l'ancienne image en cache pendant
plusieurs jours. Pour voir la nouvelle tout de suite, passer l'URL dans le
[Sharing Debugger Facebook](https://developers.facebook.com/tools/debug/) et le
[Post Inspector LinkedIn](https://www.linkedin.com/post-inspector/), qui
forcent le rafraîchissement.

---

## 13. Session du 29/08/2026 — correctifs sécurité, SEO et visibilité IA

Tout ce qui suit est appliqué dans le code et vérifié en local. Rien n'est en ligne
tant que le déploiement n'est pas lancé.

### Sécurité (d'après `docs/securite/audit-securite-2026-08-29.md`)

- **En-têtes de sécurité** posés dans `next.config.ts` : `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` (le site n'était protégé contre
  aucun clickjacking), `Permissions-Policy`, HSTS avec `includeSubDomains`.
  `poweredByHeader: false` retire l'annonce de la technologie.
  La **CSP n'est volontairement pas posée** : elle couperait GA, le pixel et Loox
  en silence si elle était improvisée. Chantier à part, en `Report-Only` d'abord.
- **Limitation de débit** (`src/lib/rate-limit.ts`) sur les quatre routes publiques :
  8 tentatives/minute sur la connexion client (c'était le vrai trou : force brute
  possible sur des comptes réels), 3/minute sur l'inscription, la newsletter et le
  formulaire revendeur. Vérifié : 429 au 9e essai de connexion, au 4e envoi de
  newsletter.
- **Route revendeur** réécrite : champs connus uniquement, types vérifiés, longueurs
  bornées, e-mail validé. Elle insérait auparavant n'importe quel JSON avec la clé
  service role, qui contourne les RLS. Les données personnelles ne sont plus
  journalisées dans les logs Vercel.
- **JSON-LD** : `<` est désormais échappé. Un titre de produit ou un avis client
  contenant `</script>` aurait permis une injection.

### SEO on-page

- 6 meta descriptions réécrites (elles dépassaient réellement 160 caractères).
- Titres des fiches produit et des collections enrichis : « CALM — Gummies sérénité
  & sommeil » au lieu de « CALM », qui ne cible aucune requête.
- `ItemList` ajouté sur les collections, `WebSite` + `SearchAction` sur l'accueil.

⚠️ Deux constats du premier passage d'audit étaient de **fausses alertes**, corrigées
dans le rapport : les « 12 » descriptions trop longues étaient 6 (le comptage
incluait les entités HTML), et les « 20 images sans alt » de l'accueil sont la
seconde copie du bandeau presse, `aria-hidden` avec `alt=""` — c'est-à-dire
exactement ce qu'il faut faire.

### Visibilité dans les IA (GEO)

- `robots.ts` autorise **nommément** GPTBot, OAI-SearchBot, ChatGPT-User,
  PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Google-Extended,
  Applebot-Extended et CCBot, avec les mêmes exclusions que le robot générique.
- `sameAs` complété : Instagram, TikTok, LinkedIn.
- **`/llms.txt`** publié : sommaire du site en langage naturel destiné aux moteurs
  génératifs (gamme, collections, articles, pages de référence), avec les précisions
  réglementaires pour qu'une citation par une IA reste conforme.
- **IndexNow** en place : clé servie à la racine, `npm run indexnow` notifie Bing,
  Yandex, Naver et Seznam. Enjeu réel : **ChatGPT s'appuie sur l'index Bing**, donc
  être indexé vite chez Bing, c'est devenir citable vite. Google n'y participe pas.

### Reste à faire — côté client, le code ne peut pas le faire

1. **Bing Webmaster Tools** — compte créé le 29/08/2026. Le fichier de vérification
   `BingSiteAuth.xml` (jeton `9249F5B1…`) est en place dans `public/`, servi à
   `https://bien.health/BingSiteAuth.xml` : il faut **déployer** avant de cliquer sur
   « Vérifier » dans Bing, sinon le fichier n'existe pas encore en ligne. Ensuite,
   soumettre `https://bien.health/sitemap.xml` puis lancer `npm run indexnow`.
2. ~~**Vercel → Domains** : rediriger `www.bien.health` vers l'apex en 301.~~
   **Fait le 29/08/2026** — vérifié : 301 sur la racine comme sur les pages profondes,
   chemin conservé (un backlink vers www/fr/products/calm arrive sur la bonne page).
3. **Accès Google** : ajouter un compte de service en Lecteur GA4 et en utilisateur
   Search Console, puis renseigner `GOOGLE_SERVICE_ACCOUNT_JSON` et `GA4_PROPERTY_ID`.
4. **Shopify** : jeton Admin `read_orders` pour les ventes du tableau de bord.
5. **Pixel Meta** : confirmer que `1675426639926228` est bien l'ID du pixel (cf. § 1).
6. Après déploiement : `npm run indexnow` pour notifier Bing des 51 URLs.
7. Supprimer le contact de test `a@b.co` créé dans Shopify pendant la vérification
   de la limitation de débit.

### Non traité volontairement

- **Montée en Next.js 16.3.3** (6 avis de sécurité « high » sur 16.2.9, dont un
  contournement de proxy) : la mise à jour modifie `node_modules` et casserait le
  serveur de développement en cours d'exécution. À faire au calme, suivie d'une
  recette complète du tunnel d'achat.
- **Content-Security-Policy** : voir plus haut.

### ⚠️ Découvert après déploiement : le sitemap avait perdu toutes les fiches produit

Constaté le 29/08/2026 juste après la mise en ligne : le `sitemap.xml` de production
ne contenait plus que 45 URLs, **aucune fiche produit**.

Cause — une séquelle de la bascule du 28/08. `getAllHandles()` passait par
`fetchPublicProducts()`, qui interroge `${NEXT_PUBLIC_SITE_URL}/products.json`.
Tant que `bien.health` pointait sur Shopify, cette URL renvoyait le catalogue.
Depuis la bascule, elle sert le site Next et répond **404** — et comme la fonction
avale l'erreur en renvoyant un tableau vide, les produits ont disparu du sitemap
sans le moindre message. C'est exactement le genre de panne qu'un `catch` silencieux
rend invisible.

Correctif :
- le repli public vise désormais le **domaine de la boutique**
  (`SHOPIFY_STORE_DOMAIN`) et non celui du site ;
- `getAllHandles()` interroge d'abord l'**API Storefront**, seule source qui ne
  renvoie que les produits réellement publiés sur le canal headless, et journalise
  une erreur si elle ne renvoie rien.

Sitemap après correctif : **55 URLs, dont 10 fiches produit**.

À arbitrer : quatre produits apparaissent qui n'étaient dans aucun sitemap
auparavant — **BOOST** (62,40 €), **BALANCE** (70,40 €), **FLOW** (62,40 €) et
**RESET** (93,60 €). Ils sont publiés sur le canal headless, en stock, et leurs
pages répondent déjà 200 en production. Leurs fiches sont maigres (339 mots, pas de
contenu SEO dédié, pas de descripteur de titre). Deux possibilités : soit ce sont
des produits actifs et il faut leur écrire un vrai contenu, soit ce sont des restes
et il faut les dépublier du canal headless côté Shopify. À trancher avec le client.

### Rapport Bing du 29/08/2026 — les 3 erreurs, corrigées

Bing Webmaster Tools a scanné le site dès la vérification de la propriété et
remonté 28 erreurs sur 3 types. Toutes reproduites en local sur les 110 pages
(`/fr` + `/en`) et corrigées :

| Erreur Bing | Gravité | Pages | Cause réelle |
|---|---|---|---|
| `Title too long` | Élevée | 2 | **Régression introduite le matin même** : « MUSHGLOW - Supermix 6-en-1 » porte déjà son descripteur dans son nom Shopify, et l'ajout du suffixe SEO faisait 70 caractères. `productPageTitle` borne désormais à 60 : quand ça ne tient pas, le nom du produit prime sur le bénéfice ajouté. |
| `The <h1> tag is missing` | Élevée | 3 | `cart-view.tsx` faisait `if (!ready) return null` : le panier vivant dans le localStorage, le composant ne rendait **rien** côté serveur — donc aucun H1 dans le HTML servi aux robots, sur `/fr/cart` et `/en/cart`. Le titre est maintenant rendu dès le serveur, avec une ligne « chargement ». |
| `Too many pages with identical meta descriptions` | Modérée | 23 | Les six produits sans contenu éditorial traduit (packs BOOST, FLOW, BALANCE, RESET et les deux accessoires) retombaient sur la description Shopify, rédigée en français : `/fr` et `/en` servaient donc la même. Descriptions anglaises dédiées ajoutées (`EN_META` dans `shop.ts`). |

Vérification après correctifs : 0 titre > 60 caractères, 0 page sans H1, 0 description
dupliquée, 0 description vide, sur l'ensemble des 110 pages.

À noter au passage : les descriptions des packs tutoient (« t'aide », « ton
potentiel ») alors que tout le site a été homogénéisé au vouvoiement. Elles
viennent de Shopify, pas du code — à reprendre dans l'admin de la boutique.

### État au 29/08/2026, fin de journée — branchement du tableau de bord

**Google Analytics 4 — connecté et vérifié.**
Compte de service `clickzou-ga4-dashboard@clickzou.iam.gserviceaccount.com` ajouté en
**Lecteur** au niveau du compte GA4 « BIEN health » (la gestion des accès au niveau
propriété n'était pas exposée dans l'interface ; le compte ne contenant que cette
propriété, la portée est identique). ID de propriété : **510560620** — lu dans l'URL
d'administration (`…/a373009813p510560620/admin`), pas le `G-GQFWQF5085` qui identifie
le flux de données. Testé en réel : 302 visiteurs, 484 sessions, 1 129 pages vues sur
28 jours, et le rapport temps réel répond.

**Search Console — connectée et vérifiée.**
Même adresse, autorisation **Complète** sur `sc-domain:bien.health`. Testé : 4 clics,
33 impressions, CTR 12,1 %, position moyenne 10,8. Deux requêtes rapportées à ce
stade : « bien health » (position 1) et « be healthy » (position 55,5).

⚠️ **Ne pas interpréter les comparaisons de périodes avant fin septembre.** La période
courante contient 27 jours de l'ancien site Shopify et un seul du nouveau : le
« −51,8 % » affiché compare deux plateformes, pas deux mois de trafic.

**Ventes Shopify — bloquées à l'installation de l'app.**

Ce qui a changé et qu'il faut savoir avant de reprendre : depuis le **1er janvier 2026**,
Shopify a supprimé les « legacy custom apps » et, avec elles, **le jeton `shpat_…`
affiché dans l'admin**. La documentation et les tutoriels qui décrivent
« Paramètres → Applications → Développer des applications → Installer → révéler le
jeton » ne s'appliquent plus.

Le nouveau mécanisme : une app créée dans le **Dev Dashboard** expose un **Client ID**
et un **Client Secret**, qu'on échange contre un jeton valable 24 h via le
*client credentials grant* :

```
POST https://b3a79e-89.myshopify.com/admin/oauth/access_token
grant_type=client_credentials&client_id=…&client_secret=…
```

État actuel :
- app **« Tableau de bord Clickzou »** créée dans le Dev Dashboard de l'organisation
  Bien Health (`dev.shopify.com/dashboard/128222147/apps/416841170945`) ;
- version `lecture-commandes-dashboard` publiée et active, scopes
  `read_orders,read_products` ;
- Client ID `3ecbb40794537313b81795cdda1ce1ce` et secret renseignés dans `.env.local`
  (non versionné) ;
- l'échange de jeton répond **`app_not_installed`** : le secret est donc bon (un secret
  faux renvoie `invalid_request`, vérifié), mais **l'app n'est pas installée sur la
  boutique**.

À reprendre : page **Home** de l'app dans le Dev Dashboard → descendre → **Install app**
→ choisir la boutique Bien Health → Install. Puis vérifier qu'elle apparaît dans
l'admin (Paramètres → Apps → Installed) et relancer le test.

**Travail de code restant, une fois l'installation faite** : `src/lib/seo-dashboard/shopify-sales.ts`
attend aujourd'hui un jeton statique `SHOPIFY_ADMIN_API_TOKEN`. Il faudra le faire
passer au *client credentials grant* — obtenir le jeton depuis `SHOPIFY_APP_CLIENT_ID`
et `SHOPIFY_APP_CLIENT_SECRET`, le garder en mémoire et le renouveler avant ses 24 h.
Une trentaine de lignes, sur le modèle de `google.ts` qui fait déjà exactement ça pour
les API Google.

**Fausse piste écartée** : l'erreur `failed_grant_with_invalid_scopes` obtenue en
tentant `/admin/oauth/install?client_id=…` n'a rien à voir avec les *protected customer
data*. Réponse officielle de Shopify : les apps custom installées sur la boutique de
leur propre organisation obtiennent cet accès automatiquement, sans demande.

**Variables Vercel renseignées ce jour** : `GA4_PROPERTY_ID` et
`GOOGLE_SERVICE_ACCOUNT_JSON`, redéploiement effectué, tableau de bord en ligne
alimenté par GA4 et Search Console.

---

## 14. Chantier éditorial du blog — état au 30/08/2026

L'audit avait mesuré **221 mots de contenu réel par article** en moyenne (le crawl
initial annonçait 610 : il comptait le menu et le pied de page). Sur des requêtes
santé, où les pages du top 10 font 1 500 à 3 000 mots, c'est sept fois trop court.
S'y ajoutait un manque plus grave encore : **aucune source externe sur les 18
articles**, alors que Google traite ces sujets en YMYL.

Correction de l'audit initial, à retenir : le maillage interne, que j'avais décrit
comme inexistant, est en réalité correct — 5,7 liens par article dont 3,5 vers des
produits ou collections. Les pages à 18 liens que j'avais relevées étaient des pages
utilitaires (contact, CGV, livraison), aucun article de blog. La conclusion avait été
généralisée à tort.

### Gabarit appliqué à chaque réécriture

1. réponse directe dès l'introduction, puis le mécanisme avant les solutions ;
2. protocoles chiffrés là où ils existent, jamais de conseil vague ;
3. au moins deux sources externes (Inserm, ANSES, PubMed, registre européen des
   allégations, DGCCRF) en `target="_blank" rel="noopener noreferrer"` ;
4. une section **« quand consulter un professionnel de santé »** — dire où s'arrête
   le périmètre d'un complément ;
5. mentions réglementaires explicites et formulations conformes au règlement
   CE 1924/2006 : « contribue à », « participe à », jamais d'effet thérapeutique ;
6. FAQ portée à 6 questions ;
7. version anglaise réécrite à l'identique, pour ne pas laisser `/en` appauvri.

### Fait — 6 articles sur 18

| Article | Avant | Après | Sources |
|---|---|---|---|
| `gerer-le-stress-naturellement` | 317 | **1 468** | 4 |
| `ameliorer-sa-concentration` | 230 | **1 123** | 3 |
| `retrouver-de-l-energie-naturellement` | 201 | **941** | 2 |
| `collagene-bienfaits-peau` | 213 | **880** | 2 |
| `quest-ce-quun-adaptogene` | 202 | **848** | 3 |
| `champignons-adaptogenes-guide-complet` | 127 | **824** | 2 |

⚠️ **Écart assumé** : le référentiel fixe 1 500 mots minimum (2 500 pour un pilier).
Seul l'article sur le stress atteint la cible. Les cinq autres, entre 820 et 1 120
mots, ont gagné un facteur 4 à 6 mais restent sous la barre. Arbitrage validé avec le
client : relever d'abord tout le socle, enrichir ensuite — un article à 900 mots bien
sourcé vaut mieux qu'un article à 200 mots, et il en reste douze dans cet état.

### Reste à faire — 12 articles

`lions-mane` · `ashwagandha` · `reishi-cordyceps-chaga` · `mieux-dormir-naturellement`
· `cortisol-stress` · `brouillard-mental` · `alternative-cafe-focus` ·
`fatigue-chronique-solution` · `complement-recuperation-sport` ·
`complement-peau-guide` · `gummies-vs-gelules` · `cafe-champignons-mushroom-coffee`

Puis une passe d'enrichissement sur les six déjà traités qui sont sous 1 500 mots.

### Demandé par le client, à faire en fin de chantier

**Vérifier que toutes les pages et tous les articles ont bien leur version
anglaise** — de façon systématique et outillée, pas au jugé : comparer les champs
`en` de chaque article et de chaque page, et signaler tout contenu qui retomberait
sur le français par défaut.

### Méthode de travail (pour reprendre sans chercher)

Les réécritures passent par deux scripts du dossier de travail temporaire :
`article-<sujet>.js` contient le contenu sous forme de deux littéraux (`article` et
`enPart`), et `apply-article.js` l'insère dans `src/lib/blog.ts` :

```
node apply-article.js <fichier> <slug-a-remplacer> <slug-suivant-dans-le-fichier>
```

Deux pièges rencontrés : `blog.ts` est en CRLF (le remplacement se fait ligne à
ligne, jamais par index de caractères), et le gabarit est lu sans être évalué — les
`\\"` doivent donc être ramenés à `\"`. Le dernier article du tableau
(`cafe-champignons-mushroom-coffee`) n'a pas de slug suivant : il faudra borner sur
la fin du tableau.

---

## 15. Session du 30/08/2026 — tableau de bord SEO : thème clair, libellés, ventes réelles

### Passage en thème clair

Le tableau de bord `/seo` était sur fond sombre ; il est désormais sur fond blanc, à
la demande du client. Fond, en-tête, cartes, tableaux et champs de saisie repris, avec
une échelle de gris lisible sur blanc. Les couleurs des courbes ont été assombries :
le bleu ciel (`#7ccdf4`) et le rose (`#ffb2ce`) de la charte sont calibrés pour du
fond sombre et disparaissent en trait de 2 px sur blanc — remplacés par `#1379b0`,
`#238f5e` et `#d4568e`.

Code couleur demandé ensuite par le client, et appliqué à l'ensemble des blocs
concernés : **tuiles de chiffres en bleu** (`#eaf5fc`, filet bleu de marque) et
**bandeau temps réel en rose** (`#fdeef4`), seul bloc qui se rafraîchit tout seul.

### Statistiques rendues lisibles — `src/app/seo/labels.ts`

Le client ne comprenait pas les tableaux : Google ne renvoie que des chemins d'URL,
des codes pays ISO et des noms de canaux anglais. Nouveau module de traduction :

- `/fr/products/calm` devient « Produit — Calm » avec un badge FR, le chemin restant
  affiché en petit dessous ; `(not set)` devient « Page non identifiée par Analytics » ;
- les articles de blog affichent leur **vrai titre**, lu dans `blog.ts` (résolution
  faite dans `PageCell`, composant serveur — la mettre dans `labels.ts` embarquerait
  tout le blog dans le bundle client le jour où un composant client l'importerait) ;
- canaux (« Organic Search » → « Recherche naturelle »), pays (`fra` → France, y
  compris les codes ISO à trois lettres que `Intl.DisplayNames` ne sait pas lire) et
  appareils (`MOBILE` → Téléphone) traduits ;
- deux glossaires d'une ligne sous les tuiles (sessions/visiteurs/rebond/engagement,
  impressions/clics/CTR/position) et en-têtes de colonnes explicités ;
- la section « Référencement Google » affiche la **période réellement couverte** par
  Search Console, calculée sur les jours renvoyés, et non la période demandée.

### Ventes réelles Shopify — `src/lib/seo-dashboard/shopify-sales.ts`

Nouvelle section « Ventes » : chiffre d'affaires, commandes, panier moyen, taux de
conversion, produits vendus, et une courbe « Commandes » ajoutée au graphique de
trafic (« Trafic et ventes jour par jour »). Les commandes annulées et les commandes
de test sont exclues, l'agrégation par jour se fait en heure de Paris.

**Le blocage de l'installation, résolu.** La version publiée de l'app portait
`use_legacy_install_flow = true`, qui impose l'ancien flux OAuth : c'est alors à
l'app d'accorder les scopes via ses propres routes de redirection. Cette app n'étant
qu'un lecteur d'API, elle n'en a aucune — d'où `failed_grant_with_invalid_scopes` à
l'installation et `app_not_installed` sur le grant. Correctif : Dev Dashboard →
Versions → Create version → **décocher « Use legacy install flow »** → Release, puis
Overview → Install app. Vérifié en réel le 30/08/2026 : 6 commandes, 531,40 €,
panier moyen 88,57 € sur les 28 jours arrêtés au 29/08.

Deux fausses pistes, écartées seulement après coup : les *protected customer data*
(la documentation les dit « always available » pour les apps custom) et la
*distribution* (ce Dev Dashboard n'a pas d'écran Distribution, la boutique appartient
déjà à l'organisation). Le seul indice utile était la ligne « Use legacy install
flow : true » dans le détail de la version active.

**Historique complet obtenu le 30/08/2026.** `read_orders` seul ne donne accès qu'aux
soixante derniers jours ; le client voulait douze mois. `read_all_orders` a donc été
ajouté aux scopes d'une nouvelle version, puis **l'installation a dû être refaite** —
publier une version ne met pas à jour les autorisations déjà accordées, et c'est ce
second geste qui manquait au premier essai. Résultat vérifié : 12 mois = 149 commandes
et 9 386,00 € ; 3 mois = 20 commandes et 1 534,75 €.

Le module ne présume rien de ces autorisations : il interroge
`currentAppInstallation { accessScopes }` et élargit la fenêtre seulement si
`read_all_orders` est réellement accordé (`hasFullOrderHistory`). Sans lui, les
périodes longues sont tronquées à soixante jours et l'écran le dit. La pagination est
bornée à 25 pages de 100 commandes ; si elle butait sur cette borne, `capped` le
signale à l'écran plutôt que d'afficher un total partiel comme s'il était complet.

**Écart normal avec l'accueil Shopify** : l'admin affiche « 30 derniers jours » en
incluant le jour en cours, le tableau de bord s'arrête à la veille (les journées
incomplètes faussent les comparaisons) et exclut les commandes annulées. Deux
commandes d'écart au 30/08/2026 s'expliquent ainsi.

### Graphiques lisibles

Dernier retour client de la session : les valeurs des courbes n'étaient lisibles nulle
part. Le graphique est passé en composant client (`line-chart.tsx`) — survol qui pose
un repère sur le jour et affiche la valeur de chaque série, clic qui fige la lecture
(il n'y a pas de survol sur écran tactile), et **légende cliquable** pour masquer ou
réafficher une courbe. Utile ici : avec quatre séries dont les maximums vont de 2 à
67, les commandes rampent au ras de l'axe ; isolée, la courbe se redéploie sur toute
la hauteur, chaque série étant normalisée sur sa propre échelle.

Le formatage a été sorti dans `format.ts` à cette occasion : un composant client qui
importerait `ui.tsx` embarquerait le catalogue du blog dans le bundle du navigateur.

### Fait — vérifié en ligne le 30/08/2026

- [x] `SHOPIFY_APP_CLIENT_ID` et `SHOPIFY_APP_CLIENT_SECRET` renseignées dans Vercel.
- [x] Déploiement de l'ensemble : thème clair, libellés lisibles, ventes Shopify,
      graphiques interactifs. Vérifié par le client sur `bien.health/seo`.

---

## 16. Chantier éditorial du blog — terminé le 30/08/2026

Les **dix-huit articles** sont au gabarit : **25 197 mots** en français, six questions
et au moins deux sources externes chacun, plus une version anglaise réécrite à
l'identique. Le point de départ était de 221 mots de contenu réel par article et
**aucune source** sur les dix-huit.

| Article | Avant | Après |
| --- | --- | --- |
| `gerer-le-stress-naturellement` | 317 | 1 787 |
| `mieux-dormir-naturellement` | 415 | 1 599 |
| `lions-mane` | 317 | 1 529 |
| `cortisol-stress` | 336 | 1 505 |
| `fatigue-chronique-solution` | 362 | 1 499 |
| `ashwagandha` | 230 | 1 486 |
| `brouillard-mental` | 338 | 1 477 |
| `reishi-cordyceps-chaga` | 240 | 1 455 |
| `ameliorer-sa-concentration` | 230 | 1 439 |
| `complement-peau-guide` | 316 | 1 424 |
| `alternative-cafe-focus` | 349 | 1 380 |
| `gummies-vs-gelules` | 374 | 1 365 |
| `complement-recuperation-sport` | 324 | 1 327 |
| `cafe-champignons-mushroom-coffee` | 376 | 1 292 |
| `retrouver-de-l-energie-naturellement` | 201 | 1 242 |
| `collagene-bienfaits-peau` | 213 | 1 170 |
| `quest-ce-quun-adaptogene` | 202 | 1 130 |
| `champignons-adaptogenes-guide-complet` | 127 | 1 091 |

### Pagination du blog

Le bouton « Voir plus d'articles » chargeait la suite en JavaScript : les articles
au-delà de la première page n'étaient reliés à l'index par **aucun lien explorable**,
et Google ne les atteignait que par le sitemap. L'index est passé à de vraies URL
statiques — `/blog`, puis `/blog/page/2` — avec liens numérotés, `rel` prev/next,
canonique propre à chaque page, ajout au sitemap et 404 hors bornes.

Piège consigné dans `lib/blog-pages.ts` : la taille de page était exportée depuis le
composant de listing, qui porte `"use client"`. Next remplace **tous** les exports
d'un module client par des références côté serveur — la constante ne valait donc pas
9 mais un proxy, le nombre de pages tombait à `NaN`, et la pagination disparaissait
du HTML **sans la moindre erreur**.

### Vérification des versions anglaises — demande client honorée

Contrôle outillé sur **47 pages** (pages statiques, 18 articles, pagination, 4 fiches
produit, 4 collections) : le texte visible de `/fr/X` est comparé à celui de `/en/X`,
et toute phrase identique de plus de six mots est signalée. Le script vit dans le
dossier de travail (`check-en.mjs`) et se relance à volonté.

Résultat : **aucun contenu ne retombe silencieusement sur le français**, à trois
exceptions près, toutes examinées.

- **Adresse postale et téléphone** du pied de page, identiques par nature.
- **Un avis client rédigé en anglais**, affiché tel quel dans les deux langues.
- **L'adresse canadienne** d'un prestataire, citée dans les mentions légales.

La **page presse**, elle, a été traduite dans la foulée : ses dix-neuf extraits
d'articles restaient en français, choix d'abord assumé dans le code. Le client ayant
demandé que tout soit traduit, chaque parution porte désormais ses extraits anglais
(`paragraphsEn`) et la mention devient « Translated from the original French
article » — le lecteur qui suit le lien sait qu'il tombera sur un article français.
Le champ `heading`, qui n'était affiché nulle part, a été retiré au passage.

⚠️ **À vérifier côté client** : ces extraits citent des promotions datées — le code
`GALA20` « valable jusqu'au 31/12 » et une remise de 20 % au pop-up DO IT. Fidèles à
l'article d'origine, mais un visiteur peut essayer le code et se heurter à un refus.

Un vrai défaut a été trouvé et corrigé : le titre de page de **MUSHGLOW** était
identique en français et en anglais (« MUSHGLOW - Supermix 6-en-1 »). En cause, la
borne à 60 caractères de `productPageTitle` : quand le suffixe traduit ne tenait pas,
la fonction gardait le nom Shopify — lequel est en français. Elle remplace désormais
le descriptif du nom par celui de la langue demandée, ce qui traduit le titre et le
raccourcit : « MUSHGLOW — Beauty & collagen supermix » en anglais, « MUSHGLOW —
Supermix beauté & collagène » en français, 51 caractères.

---

## 17. Mise à jour Next.js 16.2.9 → 16.3.3 (31/08/2026)

Faite sur la branche `chore/next-16.3.3` après accord explicite du client.
`npm audit` passe de **9 vulnérabilités « high » à zéro**.

L'audit était plus large que le seul `sharp` retenu au départ : neuf avis
concernaient **Next lui-même** — contournement du proxy/middleware en App Router
avec une locale unique, déni de service sur les Server Actions, SSRF dans les
rewrites via un hôte de destination contrôlé par l'attaquant, confusion de cache
sur les réponses à requêtes avec corps, déni de service de l'API d'optimisation
d'images via des SVG, divulgation des points d'entrée internes des Server
Functions. S'y ajoutaient `postcss` (lecture de fichier arbitraire via
`sourceMappingURL`), `sharp` 0.35.0 (CVE libvips) et, côté outillage seulement,
`brace-expansion`, `js-yaml` et `nanoid`.

Versions **épinglées** comme le faisait déjà le projet (`npm install` avait écrit
`^16.3.3`) : `next` et `eslint-config-next` en `16.3.3`, `sharp` en `0.35.4`.

### Recette

- **Build** : succès, TypeScript sans erreur, 115 pages générées. Les seules
  erreurs du log restent les `ACCESS_DENIED` Shopify sur `quantityAvailable`,
  déjà connues (scope manquant, section 1).
- **Images** — le composant qui bouge, donc vérifié en premier sur le serveur de
  production local : AVIF servi en 640/1200/2048 px, WebP quand le navigateur ne
  prend pas l'AVIF, repli JPEG sans en-tête `Accept`, et les images distantes
  `cdn.shopify.com` passent aussi. Les garde-fous répondent toujours `400` sur
  une largeur hors `deviceSizes` et sur un hôte non listé dans `remotePatterns`.
- **Pages** : les 4 fiches produit, la boutique FR/EN, le blog et sa page 2, la
  presse, le panier, le sitemap et `robots.txt` répondent `200`.
- **Proxy (middleware)** : `/` → `/fr`, `/boutique` → `/fr/boutique`, et la 301
  de l'ancienne URL Shopify `/collections/accessories` → `/fr/boutique` sont
  intactes — c'est la zone visée par l'avis « Middleware / Proxy bypass ».
- **Checkout** : `SHOPIFY_STORE` est toujours inliné depuis
  `NEXT_PUBLIC_SHOPIFY_DOMAIN` dans le bundle client. Le passage en caisse réel
  reste à refaire dans un navigateur sur le déploiement de test.

### Point d'attention

`npm run lint` remonte 24 problèmes (apostrophes non échappées, `<a>` au lieu de
`<Link>`, `setState` dans un effet). **Ce n'est pas une régression** : vérifié en
réinstallant `eslint-config-next@16.2.9`, le compte est identique avant et après.
Dette préexistante, sans effet sur le build — Next 16 ne lance plus ESLint au
build.

### Mise en production — 31/08/2026

Fusionnée dans `main` (`55afea7`) et déployée. Le client a choisi la mise en
ligne directe plutôt qu'une recette sur la preview, le filet étant le
*Promote to Production* d'un déploiement antérieur dans Vercel, instantané.

Contrôle après déploiement sur `https://bien.health` : accueil, boutique, fiche
POWER, panier, blog et sa page 2, version anglaise, sitemap et `robots.txt`
répondent `200` ; l'optimisation d'images sert bien de l'AVIF ; les redirections
`/` → `/fr` et la 301 `/collections/accessories` → `/fr/boutique` sont intactes.

**Le domaine du checkout est confirmé** — premier bloquant de la section 1, resté
ouvert depuis le 31/07. Le client a fait un passage en caisse réel : le tunnel
aboutit sur `shop.bien.health` (domaine principal de la boutique Shopify, vers
lequel `b3a79e-89.myshopify.com` redirige), avec le bon produit, le bon prix et
PayPal proposé. Test fait sur la version précédente du site, quelques minutes
avant la bascule ; le code du panier n'a pas changé entre les deux.

**Recette du tunnel refaite après la bascule** (capture client) : trois MUSHGLOW,
147,00 € barrés → **132,30 €**, remise « MUSHGLOW 3 MOIS (−14,70 €) » affichée
côté Shopify. La vérification va donc plus loin que le simple passage en caisse :
la **remise de quantité calculée par le front** (`src/lib/discounts.ts`) est bien
reprise par Shopify, prix et total identiques des deux côtés. Le tunnel d'achat
est validé sur la version 16.3.3.

---

## 18. Pixel Meta — le bon dataset enfin identifié (31/08/2026)

Relevé dans Shopify → **Sales channels** → Facebook & Instagram → **Open app** →
**Settings**, section « Behavior will be tracked with this dataset » :

> **Bien.Health NEW** — Bien.ai Official BM owns this — **ID : 848968707348964**

L'ID fourni par le client le 29/08 (`1675426639926228`) était donc bien, comme le
soupçonnait la section 1, un **identifiant de compte publicitaire** et non un
pixel. Le site l'utilisait en repli depuis : ses `PageView`, `ViewContent`,
`AddToCart` et `InitiateCheckout` partaient à une adresse qui n'était pas celle
alimentée par Shopify. Meta recevait donc les ventes sans jamais le parcours qui
y menait — impossible de reconnaître le profil d'un bon client.

`META_PIXEL_FALLBACK` corrigé en `848968707348964`. **Aucun risque de double
comptage** : `MetaEvent` n'inclut pas `Purchase`, le site ne mesure jamais les
ventes ; c'est la Conversions API de Shopify qui s'en charge.

### L'événement `Purchase` était déjà en place

Le premier bloquant de la section 1 tombe également. La même page affiche le
partage de données sur **« Maximum »** — « Customer activity data is shared using
the Meta Pixel, advanced matching **and Conversions API** » — et la liste des
pixels de **Customer events** montre le canal Facebook & Instagram avec les deux
voyants **Server** et **Web** au vert, `Data: Optimized`. L'accès a été accordé le
3 juin 2026. Les ventes du checkout remontent donc déjà à Meta ; il ne manquait
que la moitié « parcours » du signal, celle que cette correction rétablit.

### À vérifier ensuite

- Dans Meta Events Manager, dataset `848968707348964` → « Test des évènements » :
  les `ViewContent` et `AddToCart` doivent maintenant arriver depuis bien.health,
  aux côtés des `Purchase` déjà envoyés par Shopify.
- **1 produit rejeté** sur 10 dans le catalogue Facebook (vu dans l'app,
  « Product Status : Approved 9 / Rejected 1 ») — à identifier, un produit refusé
  ne peut être ni vendu ni promu sur Facebook et Instagram.

---

## 19. Badges de stock débloqués (31/08/2026)

Le scope `unauthenticated_read_product_inventory` a été coché par le client dans
Shopify → Sales channels → **Headless** → *Bien Health Site Next.js* → **Storefront
API** → Manage. Le jeton n'a pas changé, aucune variable Vercel à toucher.

Build de contrôle : **zéro `ACCESS_DENIED`**, contre une erreur par produit
auparavant. Les quantités remontent (relevé du jour) : MUSHGLOW 247, FOCUS 156,
POWER et BOOST 153, CALM / FLOW / BALANCE / RESET 133, LE MOUSSEUR 384,
LE TOTE BAG 56.

⚠️ **Aucun badge ne s'affichera pour autant** : `LOW_STOCK_THRESHOLD` vaut 10
(`src/app/[lang]/products/[handle]/page.tsx`, et 10 en dur dans
`components/product-card.tsx`). Sur des stocks de 56 à 384, le seuil ne sera
jamais atteint. Le mécanisme est réparé mais dormant — il s'activera de lui-même
quand une référence descendra. Question ouverte pour le client : relever le seuil
n'aurait de sens que s'il reste crédible ; « plus que 50 en stock » ne crée aucune
urgence et sonne faux. À laisser à 10, sauf demande contraire.

### Section 1 soldée

Les cinq bloquants de la section 1 sont désormais tous cochés : domaine du
checkout (test client en caisse réelle), indexabilité (`robots.txt` autorise le
crawl, `<meta name="robots">` sur `index, follow`), scope inventaire, ID du pixel
et événement `Purchase`.

---

## 20. Bing — le compte existait déjà, c'est l'alimentation qui manquait (31/08/2026)

Bing Webmaster Tools était **déjà configuré** sur `bien.health`, avec de
l'historique (24 clics, 156 impressions). Le chantier n'était donc pas
« inscrire le site » mais « le réalimenter après la bascule ».

### Sitemaps

Trois entrées connues de Bing, dont deux mortes :

| Sitemap | État réel (vérifié) | Décision |
| --- | --- | --- |
| `bien.health/sitemap.xml` | vivant, **56 URL** ; Bing en avait vu **51** au crawl du 29/08 | resoumis |
| `bien.health/sitemap_index.xml` | **404** — ancien sitemap Shopify de 2024 | supprimé |
| `www.bien.health/sitemap.xml` | 301 vers le précédent, doublon | supprimé |

Les cinq URL manquantes sont celles ajoutées le 30/08 en fin de chantier blog :
Bing n'était simplement pas repassé depuis.

### IndexNow — le vrai trou

Le service était actif, mais toutes les soumissions portaient `Source: Shopify`
et l'**ancien format d'URL** (`/products/focus`, sans préfixe de langue), la plus
récente datant de février 2026. Autrement dit : c'est l'ancienne boutique qui
alimentait IndexNow, et depuis la bascule du 28/08 **plus rien n'était soumis**
(0 URL sur les 13 dernières heures).

`npm run indexnow` exécuté : **HTTP 200 pour 56 URL**. La clé
(`e5ab3fc25ec9f37c2716696a4efe4cb1.txt`) est bien servie par le site.

À relancer après chaque publication d'article — c'est ce qui fait passer le délai
de découverte de plusieurs semaines à quelques heures, et Bing alimente les
réponses de ChatGPT et Copilot.

Vérifié au passage : les anciennes URL Shopify sans préfixe de langue redirigent
correctement (`/products/focus` → `/fr/products/focus`).

Les deux sitemaps morts ont été supprimés par le client le 31/08/2026 : Bing ne
connaît plus que `bien.health/sitemap.xml`, resoumis le même jour.

---

## 21. Redirections des anciennes URL Shopify (31/08/2026)

Point ouvert de la section 2 depuis le 31/07, enfin traité — et il était plus
large que « seule `/collections/accessories` est faite ».

**Méthode** : l'export de Bing (Site Explorer) ne rend que le niveau racine,
inutilisable. L'inventaire a donc été fait en interrogeant l'**API Storefront**
(`collections`, `pages`, `blogs`), puis en testant chaque URL en production.

**Constat** : les collections dont le handle a été repris à l'identique
répondaient déjà (`serenite`, `concentration`, `gummies`, `nos-poudres`,
`nos-accessoires`, `performance-et-vitalite`, `beaute-et-bien-etre`), tout comme
les fiches produit et `/cart`. En revanche tombaient en **404** :

- **les neuf pages `/pages/*`** — contact, presse, ingrédients, FAQ, diagnostic,
  revendeurs, trouver-un-magasin, behind-bien, medical-terms-and-conditions ;
- **six collections** disparues — `all`, `nos-produits`, `packs`,
  `easygift-all-products`, `energie` (renommée), `frontpage` ;
- **les sept blogs** `/blogs/*` et leurs articles ;
- `/account*` et `/policies/*`.

Ce sont exactement les adresses que Google et Bing ont en mémoire : chacune
perdait le visiteur **et** l'autorité accumulée.

**Correctif** : `next.config.ts` porte désormais la table complète, en 301
(`permanent`), avec deux variantes par entrée (avec et sans préfixe de langue).
Choix de destination notables : `frontpage` ne contenait que MUSHGLOW → sa fiche
produit plutôt que la boutique ; `trouver-un-magasin` → la page revendeurs, qui
porte la carte ; `behind-bien` → la page Histoire. Les blogs Shopify étant vides
côté API, aucun article ne pouvait être apparié un à un : ils pointent tous vers
l'index du blog.

**Recette locale** : les 28 URL testées redirigent et aboutissent en 200, sans
régression sur les pages existantes.

### Reste du Site Scan de Bing

Scan du 29/08 : 95 pages, **0 erreur réelle**. Les « 4 pages bloquées par
robots.txt » sont voulues (panier, compte, tableau de bord SEO). Restent
**2 images sans attribut `alt`** — **non retrouvées** : aucune balise `<img>`
dépourvue d'`alt` sur les treize pages FR et EN inspectées après coup. Les 33
`alt=""` de la page d'accueil sont des images décoratives, et un `alt` vide est
la bonne pratique d'accessibilité, pas un défaut. Soit le scan (29/08) précède
les corrections du 30, soit Bing les signale à tort. À trancher en relançant un
Site Scan ; sans objet en attendant.

---

## 22. Domaines Shopify — nettoyage des restes de l'ancienne boutique (31/08/2026)

L'admin Shopify affichait une alerte **« DNS non valides »** sur
`www.bien.health`, avec une invitation à remettre ses propres enregistrements
(`CNAME www → shops.myshopify.com`, `A @ → 23.227.38.x`).

**Ce n'était pas une panne, mais un reste de la bascule du 28/08.** Shopify tenait
toujours `bien.health` et `www.bien.health` dans ses domaines connectés alors que
ces deux domaines pointent désormais chez Vercel. De son point de vue les DNS
étaient « cassés » ; du nôtre ils étaient exactement où ils devaient être.

⚠️ **Piège à ne jamais retomber dedans** : suivre l'invitation de Shopify (bouton
« J'ai mis à jour les enregistrements DNS » et valeurs proposées) aurait renvoyé
`bien.health` sur l'ancienne boutique et mis le site headless hors ligne.

DNS constatés avant intervention, tous corrects :

| Domaine | Cible réelle | Réponse |
| --- | --- | --- |
| `bien.health` (A `@`) | `216.150.1.1` → Vercel | 307 → `/fr` |
| `www.bien.health` (CNAME) | `da2595a418c4….vercel-dns-016.com` | 301 → `bien.health` |
| `shop.bien.health` (CNAME) | `shops.myshopify.com` | 200 |

**Correctif appliqué** : suppression de `bien.health` et `www.bien.health` de
*Paramètres › Domaines* dans l'admin Shopify. Restent `shop.bien.health`
(**Primary**, le checkout) et `b3a79e-89.myshopify.com` (domaine technique de la
boutique, non supprimable). Alerte disparue.

**Revérifié après suppression** : site et paiement intacts — `bien.health` 307 →
`/fr` en 200, `www` 301, `shop.bien.health` et `shop.bien.health/cart` en 200.

Au passage, la section 1 affirmait que `NEXT_PUBLIC_SHOPIFY_DOMAIN` valait
`b3a79e-89.myshopify.com`. Le bundle de production dit `shop.bien.health` : la
section a été corrigée.

## 23. Inscriptions newsletter — les emails n'arrivaient nulle part (01/09/2026)

Constat client : les adresses saisies dans le popup « offre de bienvenue
−10 % » n'apparaissent pas dans le CRM **Klaviyo**.

**Klaviyo n'a jamais été branché dans le code.** La route
`src/app/api/newsletter/route.ts` — utilisée par le popup, le formulaire du
footer et le quiz diagnostic — visait deux destinations, toutes deux muettes :

| Destination | État réel |
| --- | --- |
| Shopify (`POST /contact`, `form_type=customer`) | **403** sur `b3a79e-89.myshopify.com` *et* sur `shop.bien.health` — Shopify refuse les POST server-side sans session |
| Supabase (table `leads`) | variables absentes des env de production → bloc jamais exécuté |
| Klaviyo | aucun appel dans le code |

L'échec était invisible : les trois blocs sont en `try/catch` silencieux et la
route répond toujours `{ ok: true }`. Le popup affichait donc « C'est tout bon
— il t'est aussi envoyé par mail » alors que **rien n'était enregistré et
qu'aucun mail ne partait**. Tous les emails collectés depuis la mise en ligne
sont perdus (aucune trace côté site).

**Correctif appliqué :**

- nouveau module `src/lib/klaviyo.ts` — inscription via l'endpoint
  `POST https://a.klaviyo.com/client/subscriptions/`, qui ne demande que la clé
  **publique** du compte (aucun secret côté serveur) et respecte le réglage
  opt-in de la liste ;
- la route appelle Klaviyo en premier et renvoie `{ ok: true, klaviyo: bool }`
  pour rendre l'état vérifiable ;
- Shopify passe en miroir best-effort, avec le code HTTP désormais **loggué**
  au lieu d'être avalé ;
- deux variables ajoutées sur Vercel (Production) le 01/09/2026 :
  `KLAVIYO_COMPANY_ID` = `TVsaPf` (clé publique du compte « Bien Health »,
  autorisée sur tous les domaines) et `KLAVIYO_LIST_ID` = `WDRQ2y`.

**Liste cible : « EMAIL - New optins website sign-up form »** (1242 membres
avant branchement, créée le 28/09/2023) — celle qui recevait déjà les
inscriptions par formulaire du site. Pas de double opt-in : le profil apparaît
immédiatement dans les membres.

⚠️ Ne pas viser un **segment** (`EMAIL - All optins email`, `EMAIL - Optins
actifs 12 mois`…) : un segment est recalculé à partir de règles, Klaviyo refuse
qu'on y inscrive un profil. Seule une **Liste** a une porte d'entrée. Les
inscrits retombent de toute façon dans les segments d'optins.

**Vérifié de bout en bout le 01/09/2026** : inscription en local puis sur
`https://bien.health/api/newsletter` → `{"ok":true,"klaviyo":true}`, profil
visible dans la liste Klaviyo dans la foulée (1242 → 1243).

### Le mail de bienvenue partait déjà — il n'avait plus personne à qui parler

Le popup promet le code par mail. En cherchant à créer le flow qui l'envoie, on
a découvert qu'il **existait déjà**, actif et correctement réglé depuis mars :

**`SHOPIFY SE - Welcome Series Sign Up Form`** — déclencheur « ajouté à la liste
EMAIL - New optins website sign-up form », trois e-mails avec tracking UTM :

| Jour | E-mail |
| --- | --- |
| 0 | `SE - Welcome Email #1 - FR` — « Bienvenue chez Bien 🍄 », porte le code `WELCOMETOBIEN10` |
| 7 | `SE - Welcome Email #2 - FR` — « Quel rituel bien-être est fait pour toi ? » |
| 12 | `SE - Welcome Email #3 - FR` — « Dernière chance pour profiter de -10% 💙 » |

Il n'envoyait plus rien depuis des mois pour une seule raison : **plus personne
n'entrait dans la liste**, le site n'y écrivant plus. Le branchement du matin l'a
réveillé — le test avec `jc@clickzou.fr` a déclenché le mail #1, reçu en boîte de
réception (pas en spam), code lisible, expéditeur `BIEN Health info@bien.health`.

Un second flow créé le matin même (`Bienvenue site - code -10%`, un seul e-mail
bâti sur le modèle « Welcome 1 ») faisait alors doublon : deux mails de bienvenue
pour un inscrit. Il a été **repassé en brouillon** — la série existante, plus
riche, reste seule en service. Ne pas la réactiver.

⚠️ Deux points laissés ouverts sur le mail #1, à traiter côté Klaviyo :
- la mention « offre valable pendant 2 semaines » n'est vérifiée nulle part côté
  Shopify : soit le code n'expire jamais et la mention est fausse, soit il expire
  et il faut s'assurer que ce soit bien 2 semaines après réception ;
- le pied de page affiche l'adresse en double (`info@bien.health` puis
  `@bien.health`), et la série n'existe qu'en français alors que le popup est
  aussi servi en anglais.

**Reste à faire** : créer dans Klaviyo le flow « Welcome » qui envoie
réellement le code `WELCOMETOBIEN10` — le popup le promet par mail, aujourd'hui
seul l'affichage à l'écran le délivre.

## 24. Carte des revendeurs — CARTO ferme ses fonds de carte (01/09/2026)

La carte de `/revendeurs` affichait **« API KEY REQUIRED »** en travers, répété
sur chaque tuile. Rien n'avait changé côté site : CARTO exige désormais une clé
d'API pour ses fonds de carte et sert aux appels anonymes une tuile barrée de ce
filigrane. Le service répond toujours 200, l'échec est donc purement visuel — un
test HTTP ne l'aurait pas détecté, il faut regarder l'image.

**Correctif** : `src/components/reseller-map.tsx` passe au fond **Esri « World
Light Gray »**, qui ne demande pas de clé et rend le même gris clair. Les
libellés de villes y sont sur une couche séparée (`World_Light_Gray_Reference`),
posée par-dessus le fond — sans elle, la carte n'affiche que les pays.

⚠️ Attention à l'ordre des coordonnées : ArcGIS sert ses tuiles en
`/tile/{z}/{y}/{x}`, **pas** `{z}/{x}/{y}` comme la plupart des fournisseurs.

Si le rendu exact de CARTO redevenait nécessaire, une clé gratuite suffit
(compte CARTO, paramètre `?api_key=`). Le reste de la carte — marqueurs,
popups, cadrage, geste à deux doigts sur mobile — est inchangé.

De fines lignes blanches apparaissent entre les tuiles sur les grandes étendues
de mer. **Ce défaut préexistait avec CARTO** (vérifié par capture de la
production avant bascule) : ce n'est pas une régression du changement de fond.

## 25. Page presse — logos complétés, vraies photos, 14 parutions (01/09/2026)

Trois retours client sur `/presse`, traités ensemble.

**Les trois logos manquants.** Le client en comptait 36 dans son dossier, le
site en affichait 33. Les fichiers sources sont des SVG simplement numérotés :
il a fallu les rendre en planche pour les identifier. Manquaient `1.svg`
**Fait en France**, `22.svg` **48 Collagen Café** et `35.svg` **My Beauty
Factory** — trois entrées qui ne sont pas des titres de presse (un label, un
café partenaire, un institut), ce qui explique sans doute leur mise à l'écart le
29/08. Le client les veut : elles figurent dans son `PRESSE.docx` au même titre
que les autres.

Repris au même traitement que les 33 autres. Deux pièges :

- le détourage du fond blanc doit se faire **par remplissage depuis les bords**,
  jamais sur toute l'image : le logo chromé de 48 Collagen Café est plein de
  reflets blancs qui seraient devenus des trous ;
- My Beauty Factory est un logo **carré**. Dans le canevas commun 720 × 280, il
  tombait à 280 px de large quand les autres en font 720, et devenait illisible.
  Il est recadré sur son seul bloc de texte (bbox des pixels sombres).

**Les visuels de droite.** Le client ne les aimait pas ; le problème allait
au-delà du goût :

- `/brand/product-calm.jpg` et consorts sont des **images générées** montrant un
  flacon blanc à couvercle doré **qui n'existe pas au catalogue** — les vrais
  pots sont des dégradés colorés siglés BIEN. La page presse montrait donc un
  produit imaginaire ;
- les vignettes libellées « La parution » n'étaient **pas des scans** mais des
  cartes fabriquées : fond dégradé rose-violet, logo du magazine, texte de
  l'article retapé par-dessus. Le lien promettait la parution et ouvrait une
  reconstitution.

Les deux sont retirées. Chaque parution porte maintenant une photo du shooting
de la marque, choisie selon le produit dont parle l'article.

⚠️ Les faux packshots restent utilisés ailleurs : `FALLBACK_PRODUCTS` de la page
d'accueil, et le repli d'image des pages produit et panier. Ils ne s'affichent
que si Shopify ne répond pas — mais ce jour-là, l'accueil montrera quatre
produits qui n'existent pas. À remplacer par les vraies photos.

**Les parutions : 5 → 14.** Le `PRESSE.docx` compte 36 entrées, mais la plupart
pointent vers des dossiers Google Drive (parutions papier), inaccessibles depuis
l'environnement de travail. Les articles en ligne ont été relevés et rédigés :
Psychologies, BIBA, Beauté test, Les Nouvelles Esthétiques, TheDreamTeam, Fresh
Magazine, BiG média (Bpifrance), Mesinfos (Affiches Parisiennes) et Gazelle.
Leurs URL manquaient à `press.ts` : ces neuf logos sont désormais cliquables.

**Les scans du Drive étaient accessibles.** Les dossiers du `PRESSE.docx` sont
partagés publiquement : il suffit de lister chaque dossier (le blob
`window['_DRIVE_ivd']` de la page HTML donne id, nom et type de chaque entrée)
puis de tirer les fichiers par `uc?export=download&id=`. Aucun compte n'est
nécessaire. **Ne pas conclure trop vite qu'un partage Drive est hors d'atteinte.**

Piège du premier passage : le dossier « presse » contient **28 sous-dossiers**,
et le script sautait les entrées de type `application/vnd.google-apps.folder`.
Il n'en ramenait que les 7 fichiers de la racine. Il faut descendre récursivement.

97 fichiers récupérés. Quatorze parutions papier transcrites depuis ces scans :
Paris Match (« Tous sous champi ! », citation de la fondatrice sur le chaga),
Closer, Voici, Public, Femme Actuelle, Côté Santé, Pleine Vie, Magicmaman, Lyon
Capitale, Famille Mag (dosages exacts de POWER), Psycho Pour Elles, Vital,
Avantages, Cosmopolitan et Fait en France. **La page compte 29 parutions.**

Pour les PDF, `PyMuPDF` (déjà installé) extrait la couche texte quand elle
existe — plus fiable et plus économe qu'une lecture d'image. `pdftoppm` n'est pas
disponible sur la machine ; le rendu d'une page en PNG passe par `get_pixmap()`.

**Les vignettes venaient du client.** Le dossier Drive « POUR SITE » contient
19 visuels 1080 × 1350 : c'est de là que sortaient les cinq « fac-similés »
retirés plus haut — ils n'avaient donc pas été fabriqués côté agence, contrairement
à ce qui était écrit ici. Douze d'entre eux ne sont que le texte de l'article
recomposé sur un fond dégradé ; sept montrent un **vrai magazine ouvert**. Ces
derniers sont désormais posés sous la photo produit des parutions papier
concernées (Paris Match, Closer, Femme Actuelle, Côté Santé, Magicmaman, BIBA),
avec un lien « Voir la page ».

Restent sans fiche : **ELLE** (story Instagram) et **Fraîches** (reel) — aucun
texte à reprendre, ils gardent leur logo dans le mur du haut.

Deux détails relevés au passage : `bigmedia.bpifrance.fr` écrit « Bien » et non
« BIEN », d'où une détection à zéro au premier passage ; et Marie Claire a un
**second** article (sélection ashwagandha, BIEN en 8ᵉ position) qui n'a pas été
ajouté — deux entrées du même titre casseraient la clé React de la liste.

## 26. Logos, packs et typographie — retours client du 01/09/2026 (soir)

**Les écarts entre logos.** Le canevas commun 720 × 280 posé le 29/08 alignait
la taille optique mais laissait des blancs latéraux très inégaux : un logo large
touchait les bords, un logo carré n'occupait que 280 px sur 720 et gardait
220 px de vide de chaque côté. Dans le bandeau défilant de l'accueil, l'écart
apparent doublait d'un logo à l'autre.

Les 36 fichiers sont régénérés avec une **hauteur commune (280) et une largeur
ajustée au dessin**. L'écart est alors porté par la seule marge CSS, donc
constant. La taille optique reste équilibrée en normalisant l'**aire** du
contenu (`h = √(aire / ratio)`, plafonnée à 200 px) et non sa hauteur : à
hauteur égale, un logo carré paraît deux fois plus lourd qu'un logo large.

Chaque entrée de `PRESS` porte désormais `w` et `h` — sans quoi le navigateur ne
peut pas réserver la place avant chargement, et la bande sauterait.

⚠️ Les 36 logos étaient bien en ligne : le client les croyait manquants parce
que le bandeau défile et n'en montre que sept à la fois.

**L'espace avalé dans les titres produit.** `tracking-tighter` (-0,05 em)
resserre aussi l'espace : dans la Season Serif, « MushGlow, la poudre » se
lisait « MushGlow,la poudre ». Les quatre titres de la section « À propos »
commencent tous par le nom du produit suivi d'une virgule. Passé en
`tracking-tight` (-0,025 em), vérifié en rendant la fonte réelle côte à côte.

**Les packs n'apparaissaient nulle part.** BOOST, FLOW, BALANCE et RESET ne
citent aucun produit dans leur titre, et tout le filtrage des collections se
faisait sur le titre : ils ne sortaient donc ni dans « gummies », ni dans
« poudres », ni dans les pages par besoin — seulement sur `/boutique`.

Une table `PACKS` déclare leur composition (BOOST = FOCUS + POWER, FLOW =
FOCUS + CALM, BALANCE = CALM + MUSHGLOW, RESET = FOCUS + POWER + CALM), et le
filtre lit désormais le contenu réel. Conséquences : nouvelle collection
`/collections/packs` (« Packs & duos », au menu desktop et mobile), et les
quatre pages par besoin listent les packs correspondants, après les formules
seules.

⚠️ Deux pièges rencontrés :
- `/collections/packs` était **redirigé en 301 vers la boutique** par la table
  des anciennes URL Shopify (31/08). La redirection est retirée : la collection
  existe maintenant côté site. Vérifier `next.config.ts` avant de créer une
  collection dont le slug figure dans cette table.
- sans bénéfice déclaré, la carte produit retombe sur le premier tag Shopify :
  BOOST s'annonçait « badge_-20% ». Les quatre packs ont leur phrase dans
  `BENEFITS`.
