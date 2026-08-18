# Checklist de mise en ligne — bien.health

Tout ce qui doit être vérifié, configuré ou décidé **avant** la bascule du site
headless sur `bien.health`. Dernière mise à jour : 18 août 2026.

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
- [~] **Note Trustpilot du header** : affichée seulement à partir de 1536 px
      (`2xl`). En dessous, ses ~155 px poussaient la nav hors de l'axe central.
      À valider : la preuve sociale reste visible sur la page (bandeau avis,
      fiches produit), mais plus dans le header sur un 13"/15".
- [ ] **Mobile** : parcours complet sur téléphone (menu, fiche, panier).

---

## 3. En attente d'une info ou d'une décision client

- [~] **Fond du favicon** — la marque est désormais découpée dans le vrai logo
      (`public/brand/logo-bien.png`, le B avec le champignon en contre-forme),
      posée sur le Deep Blue de la charte, comme la pastille du site actuel du
      client. Il écrivait « en noir sur fond blanc » en décrivant le fichier
      qu'il joignait : si c'est bien le rendu voulu dans l'onglet, la variante
      noir sur blanc se régénère avec le même script (voir le commit).
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
- [~] **Code promo `BACKTOMUSH`** — vérifier qu'il est actif dans Shopify.
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
- [~] **Note Trustpilot de la page Ingrédients** — il précise que la note
      n'apparaît sur la bannière qu'après dézoom, et qu'elle se comporte
      autrement sur un autre poste. Piste : le seuil `2xl` (1536 px) au-delà
      duquel la note revient dans le header. À reproduire aux deux zooms.

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
