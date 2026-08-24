# Checklist de mise en ligne — bien.health

Tout ce qui doit être vérifié, configuré ou décidé **avant** la bascule du site
headless sur `bien.health`. Dernière mise à jour : 19 août 2026.

Convention : `[ ]` à faire · `[~]` en attente d'une info ou d'une décision client ·
`[x]` fait et vérifié.

---

## 1. Bloquants — le site ne doit pas être mis en ligne sans ça

### [ ] Domaine du checkout Shopify (risque de tunnel de vente cassé)

`src/lib/cart.ts` construit l'URL de paiement à partir de
`NEXT_PUBLIC_SHOPIFY_DOMAIN`. **Si cette variable est absente**, le code retombe
sur `NEXT_PUBLIC_SITE_URL` (= `https://bien.health`) — or ce domaine sera occupé
par le nouveau front. Le bouton « Passer au paiement » enverrait alors les
clients sur une page inexistante du site headless au lieu du checkout.

→ Définir `NEXT_PUBLIC_SHOPIFY_DOMAIN=b3a79e-89.myshopify.com` dans Vercel
(Production **et** Preview) et tester un passage en caisse de bout en bout.
Cette variable manque aussi dans `.env.local.example`.

### [ ] Passage du site en indexable

Le site est volontairement en `noindex` tant qu'il tourne sur `*.vercel.app`
(protection contre le contenu dupliqué). Après branchement du domaine :

- `NEXT_PUBLIC_SITE_URL=https://bien.health` dans Vercel ;
- domaine `bien.health` branché sur le projet Vercel (production) ;
- vérifier `https://bien.health/robots.txt` → doit autoriser le crawl ;
- vérifier le `<meta name="robots">` d'une page → doit être `index, follow` ;
- vérifier `https://bien.health/sitemap.xml`.

### [ ] Scope Shopify manquant : `unauthenticated_read_product_inventory`

Le build affiche des erreurs `ACCESS_DENIED` sur `quantityAvailable`. Conséquence :
les badges de stock (« Bientôt épuisé — plus que N en stock », pré-commande)
ne fonctionnent pas. → Ajouter le scope à l'app Storefront dans l'admin Shopify.

### [ ] Pixel Meta — ID à renseigner

`NEXT_PUBLIC_META_PIXEL_ID` (15-16 chiffres) dans Vercel.
Meta Events Manager → Sources de données → le pixel → Paramètres → ID du pixel.
Sans ID, le pixel ne se charge pas du tout. Le code est prêt et n'envoie rien
avant acceptation des cookies.

### [ ] Événement `Purchase` côté Shopify

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
- [ ] **Redirections des anciennes URLs Shopify** : seule
      `/collections/accessories` → `/boutique` est traitée. Auditer les URLs
      indexées de l'ancien site (Search Console / export Shopify) et ajouter les
      301 manquantes dans `next.config.ts`.
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
