# Checklist de mise en ligne — bien.health

Tout ce qui doit être vérifié, configuré ou décidé **avant** la bascule du site
headless sur `bien.health`. Dernière mise à jour : 31 juillet 2026.

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
- [ ] **Mobile** : parcours complet sur téléphone (menu, fiche, panier).

---

## 3. En attente d'une info ou d'une décision client

- [~] **Logos associatifs** — Team for the Planet et Hôpital Sourire sont
      affichés en texte dans le footer. Manquent : les fichiers logos (PNG/SVG)
      et les URL officielles des deux associations.
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
