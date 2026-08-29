# SEO MASTER — BIEN HEALTH

> **SOURCE DE VÉRITÉ** pour tout le SEO de bien.health.
> À relire **avant** toute création de contenu, toute modification de structure d'URL,
> tout ajout de page ou toute décision de netlinking.
>
> Adapté du référentiel `SEO_MASTER_CLICKZOU.md` (v2.6, Clickzou) — copie d'origine
> conservée à côté sous `SEO_MASTER_CLICKZOU.source.md` pour comparaison. Ce qui
> relevait du métier d'agence web (SEO programmatique par ville, silos création /
> refonte / Ads, netlinking Toulouse) a été remplacé par le métier réel de
> bien.health : un e-commerce de compléments alimentaires à base de champignons
> fonctionnels et de plantes adaptogènes. Ce qui relevait de la **méthode** — règles
> techniques, maillage, rédaction, GEO/LLM, veille, blocs machine-readable — a été
> conservé et transposé.

**Version** : 1.0 (adaptation initiale)
**Dernière mise à jour** : 2026-08-29
**Maintenu par** : Clickzou + Claude
**Audit de référence** : [`audit-seo-2026-08-29.md`](./audit-seo-2026-08-29.md)

---

## TABLE DES MATIÈRES

1. [Vision & stratégie SEO globale](#1-vision--stratégie-seo-globale)
2. [Architecture SEO du site](#2-architecture-seo-du-site)
3. [Silos sémantiques](#3-silos-sémantiques)
4. [Règles de maillage interne](#4-règles-de-maillage-interne)
5. [Contenu programmatique : ce qui est légitime ici](#5-contenu-programmatique--ce-qui-est-légitime-ici)
6. [Règles rédactionnelles SEO](#6-règles-rédactionnelles-seo)
7. [Conformité réglementaire — la contrainte n°1 du secteur](#7-conformité-réglementaire--la-contrainte-n1-du-secteur)
8. [Conversion & business](#8-conversion--business)
9. [GEO / LLM : être cité par les IA](#9-geo--llm--être-cité-par-les-ia)
10. [Mesure & pilotage](#10-mesure--pilotage)
11. [Roadmap SEO](#11-roadmap-seo)
12. [Veille obligatoire](#12-veille-obligatoire)
13. [Blocs machine-readable](#blocs-machine-readable)

---

## 1. VISION & STRATÉGIE SEO GLOBALE

### Positionnement

- **URL** : https://bien.health (bascule le 28/08/2026, sortie du noindex la même nuit)
- **Activité** : e-commerce de compléments alimentaires — champignons fonctionnels
  (lion's mane, reishi, cordyceps, chaga) et plantes adaptogènes (ashwagandha,
  rhodiola, ginseng, safran), en gummies et en poudres
- **Gamme** : CALM (sérénité, sommeil), FOCUS (concentration, mémoire),
  POWER (énergie, performance), MUSHGLOW (beauté, collagène, 6-en-1)
- **Fabrication** : France · sans sucre · vegan · sans gluten
- **Éditeur** : BIEN Health France SAS, 100 rue du Verbial, 81000 Albi
- **Cible** : adultes actifs 25-55 ans, sportifs amateurs, actifs urbains sous
  charge mentale, intérêt pour le naturel et la performance douce
- **Langues** : français (principal) + anglais (`/en`, marché secondaire)
- **Architecture** : Next.js headless devant Shopify (catalogue + checkout)

### Ce qui distingue ce SEO de celui d'une agence

| | Agence (Clickzou) | E-commerce (bien.health) |
|---|---|---|
| Intention dominante | transactionnelle locale | **informationnelle** puis transactionnelle |
| Volume de pages | 1 350 pages programmatiques | ~50 pages + blog, pas de scaling par ville |
| Levier principal | pages locales × métiers | **contenu éditorial** → pages produit |
| Conversion | devis / lead | **achat direct** (panier Shopify) |
| Contrainte forte | aucune | **réglementation des allégations santé** |

La conséquence est structurante : ici, **le blog n'est pas un accessoire, c'est le
moteur d'acquisition**. Personne ne tape « acheter lion's mane bien health » avant
de connaître la marque ; les gens tapent « lion's mane bienfaits », « comment mieux
dormir naturellement », « alternative au café ». Le trafic se gagne sur ces
requêtes, puis se convertit par le maillage vers les fiches produit.

### Objectifs business

1. **Acquisition organique** : capter les requêtes informationnelles du champ
   « adaptogènes / champignons fonctionnels / stress-sommeil-focus-énergie »
2. **Autorité thématique** : devenir une référence francophone crédible et
   *conforme* sur les champignons fonctionnels — sujet où la concurrence oscille
   entre contenus creux et promesses illégales
3. **Conversion** : chaque article doit mener à une collection ou une fiche produit
4. **Rétention** : diagnostic, newsletter, abonnement — le SEO amène, le CRM garde

### Entonnoir cible

```
Requêtes informationnelles (blog : « ashwagandha bienfaits », « mieux dormir »)
    │
    ▼
Articles piliers + articles support (18 articles aujourd'hui, cible 40+)
    │  maillage interne contextuel
    ▼
Pages besoin (collections : sérénité, performance, beauté)
    │
    ▼
Fiches produit (CALM, FOCUS, POWER, MUSHGLOW)
    │
    ▼
Panier → checkout Shopify
```

---

## 2. ARCHITECTURE SEO DU SITE

### Inventaire réel (29/08/2026)

| Catégorie | Nombre | Source |
|---|---|---|
| Pages statiques indexables | 21 | `STATIC_PATHS` dans `src/lib/seo.ts` |
| Collections | 7 | `COLLECTIONS` dans `src/lib/shop.ts` |
| Fiches produit | 6 | Shopify, via `getAllHandles()` |
| Articles de blog | 18 | `src/lib/blog.ts` |
| **Total sitemap** | **51 URLs** (× 2 langues) | `src/app/sitemap.ts` |

### Structure technique

```
src/app/
├── [lang]/                       → tout le site public, fr | en
│   ├── page.tsx                  → accueil
│   ├── boutique/                 → listing catalogue
│   ├── collections/[slug]/       → 7 collections (par besoin, par format)
│   ├── products/[handle]/        → fiches produit (Shopify)
│   ├── blog/ + blog/[slug]/      → 18 articles
│   ├── ingredients/              → page pilier ingrédients
│   ├── diagnostic/               → quiz d'orientation produit
│   ├── avis, presse, histoire, certifications, revendeurs…
│   └── cgv, mentions-legales, confidentialite, cookies (indexables, faible priorité)
├── seo/                          → tableau de bord interne « SEO by Clickzou » (noindex)
├── api/                          → routes serveur (noindex, Disallow)
├── sitemap.ts · robots.ts        → générés
└── proxy.ts                      → redirection de locale
```

### Règles SEO techniques

#### URLs
- **Pas de trailing slash** — convention inverse de Clickzou, assumée : Next.js
  App Router sert les URLs sans slash final, et `trailingSlash: true` créerait une
  migration de 51 URLs sans bénéfice. **Règle : ne jamais mélanger les deux.**
- Toujours préfixées de la locale : `/fr/...`, `/en/...`
- Slugs en français sur `/fr` (`/fr/blog/mieux-dormir-naturellement`), identiques
  sur `/en` : à terme, traduire aussi les slugs anglais (voir roadmap)

#### Canonical
- Auto-référent sur chaque page, généré par `pageMetadata()` (`src/lib/seo.ts`)
- Jamais de canonical croisé entre `/fr` et `/en` — ce sont deux pages distinctes
  liées par `hreflang`, pas des doublons

#### hreflang
- `fr`, `en` et `x-default` (= `/fr`) sur **toutes** les pages — vérifié 51/51
- Toute nouvelle page doit passer par `pageMetadata()` : c'est lui qui pose les
  alternates. Une page qui écrit ses `metadata` à la main perd le hreflang.

#### Redirections
- 301/308 permanentes uniquement pour les changements d'URL définitifs
- La redirection de locale (`/` → `/fr`) est un **307** produit par `proxy.ts` :
  acceptable pour une négociation de langue, mais à surveiller (cf. audit)
- Pas de chaîne A → B → C
- `www.bien.health` doit rediriger en 301 vers l'apex (à corriger côté Vercel)

#### Sitemap
- Un seul `/sitemap.xml`, généré depuis `STATIC_PATHS` + collections + produits + articles
- URLs `/fr` en `<loc>`, `/en` en `alternates`
- Toute nouvelle page statique doit être ajoutée à `STATIC_PATHS`, sinon elle
  n'entre jamais dans le sitemap. C'est l'oubli le plus fréquent.

#### Robots.txt
- `Allow: /` en production, `Disallow: /` sur les préviews `*.vercel.app`
  (`IS_INDEXABLE`) — mécanisme à ne jamais contourner
- `Disallow` : `/api/`, `/seo`, panier, compte

#### Meta tags
- `metaTitle` : **50-60 caractères**, mot-clé principal en tête, marque en fin
- `metaDescription` : **140-160 caractères**, un bénéfice + une raison de cliquer
- `noindex` : réservé au panier, au compte et au tableau de bord `/seo`

#### Données structurées JSON-LD
| Type de page | Schémas attendus |
|---|---|
| Toutes | `Organization` (layout) |
| Produit | `Product` + `Offer` + `AggregateRating` + `Review` + `Brand` + `BreadcrumbList` |
| Article | `Article` + `BreadcrumbList` |
| FAQ, pages à questions | `FAQPage` |
| Collection | `ItemList` **(manquant — à ajouter)** |
| Accueil | `WebSite` + `SearchAction` **(manquant — à ajouter)** |

Règle anti-régression : `AggregateRating` doit refléter des avis **réels**
(Loox / metafields Shopify). Jamais de note inventée — c'est un motif de
suppression des rich snippets et une pratique commerciale trompeuse.

#### Performance
- Images : AVIF/WebP via `next/image`, largeurs plafonnées à 2048 px
- Fontes : Dahlia, Season Serif, Moderat auto-hébergées (`next/font/local`)
- Cibles : LCP < 2,5 s en 4G mobile, CLS < 0,1, poids page < 1 Mo
- Mesure de référence (29/08/2026, mobile bridé CPU ×4) : accueil 719 ko / FCP 1,95 s

---

## 3. SILOS SÉMANTIQUES

Six silos, alignés sur les besoins d'achat et non sur les ingrédients — un
visiteur cherche « mieux dormir », pas « reishi ».

### Silo 1 — Stress & sommeil *(pilier commercial : CALM)*
Requêtes : gérer le stress naturellement, cortisol, mieux dormir, ashwagandha,
reishi, complément anti-stress sans mélatonine, sommeil réparateur.
Pilier éditorial : `/fr/blog/gerer-le-stress-naturellement`
Pilier commercial : `/fr/collections/serenite`

### Silo 2 — Concentration & clarté mentale *(FOCUS)*
Requêtes : améliorer sa concentration, brouillard mental, lion's mane, mémoire,
alternative au café, L-théanine, rhodiola.
Pilier éditorial : `/fr/blog/ameliorer-sa-concentration`
Pilier commercial : `/fr/collections/concentration`

### Silo 3 — Énergie & performance *(POWER)*
Requêtes : retrouver de l'énergie, fatigue chronique, cordyceps, ginseng,
récupération sportive, endurance naturelle.
Pilier éditorial : `/fr/blog/retrouver-de-l-energie-naturellement`
Pilier commercial : `/fr/collections/performance-et-vitalite`

### Silo 4 — Beauté & collagène *(MUSHGLOW)*
Requêtes : collagène bienfaits peau, compléments belle peau, cheveux,
chaga antioxydant, éclat du teint.
Pilier éditorial : `/fr/blog/collagene-bienfaits-peau`
Pilier commercial : `/fr/collections/beaute-et-bien-etre`

### Silo 5 — Champignons & adaptogènes (savoir) — **silo d'autorité**
Requêtes : qu'est-ce qu'un adaptogène, champignons adaptogènes, reishi cordyceps
chaga, café aux champignons, mushroom coffee, extraction, dosage, bêta-glucanes.
Pilier éditorial : `/fr/blog/champignons-adaptogenes-guide-complet`
Pilier commercial : `/fr/ingredients`
C'est le silo qui construit l'E-E-A-T et qui se fait citer par les IA.

### Silo 6 — Formats & usage
Requêtes : gummies ou gélules, comment prendre un complément, cure de 30 jours,
sans sucre, vegan, fabriqué en France.
Pilier éditorial : `/fr/blog/gummies-vs-gelules`
Pilier commercial : `/fr/boutique`

### Circulation
```
Article support ──▶ Article pilier du silo ──▶ Collection du silo ──▶ Fiche produit
      │                                                  ▲
      └────────── /fr/ingredients (silo 5, transversal) ──┘
```

---

## 4. RÈGLES DE MAILLAGE INTERNE

C'est **le chantier prioritaire** du site : l'audit du 29/08/2026 montre des pages
à 18 liens internes uniques, soit exactement le contenu de l'en-tête et du pied de
page. Autrement dit : **zéro lien contextuel** dans le corps des contenus.

### Règles opérationnelles — par article

| Position | Règle |
|---|---|
| Introduction | 1 lien vers le pilier éditorial du silo (ancre naturelle) |
| Corps | 2 à 4 liens contextuels : articles du même silo, page `/ingredients` |
| Section « solution » | 1 lien vers la **collection** du silo |
| Conclusion | 1 lien vers la **fiche produit** correspondante ou le `/diagnostic` |

### Règles opérationnelles — par page commerciale

| Page | Liens sortants attendus |
|---|---|
| Fiche produit | ingrédients (ancre = nom de l'actif), 2 articles du silo, collection parente |
| Collection | 3 articles du silo, fiches produit de la collection |
| `/ingredients` | fiches produit contenant l'actif + articles qui le détaillent |
| Accueil | 4 collections, 4 best-sellers, 3 articles récents, diagnostic |

### Règles quantitatives

| Règle | Valeur |
|---|---|
| Liens internes contextuels minimum par article | **4** (hors en-tête/pied de page) |
| Maximum vers la même page depuis un article | 2 |
| Ratio intra-silo / cross-silo | 70 % / 30 % |
| Profondeur de clic maximum depuis l'accueil | 3 |
| Liens vers une page noindex | interdit |

### Anti-patterns
- Pas d'ancres « cliquez ici », « en savoir plus », « notre boutique »
- Pas de bloc de liens en fin d'article à la place de liens contextuels
- Pas d'ancre exacte répétée (« gummies anti-stress » 6 fois dans un article)
- Ne jamais lier vers une page en rupture de stock durable sans le signaler

### Liens externes — obligatoires (E-E-A-T)

Tout article doit citer **au minimum 3 sources externes fiables**. Dans ce
secteur, c'est encore plus déterminant qu'ailleurs : Google applique aux sujets
santé les critères **YMYL** (*Your Money or Your Life*), et un contenu santé sans
source est traité comme de l'auto-promotion.

| Catégorie | Sources recommandées |
|---|---|
| Réglementaire | `efsa.europa.eu`, `economie.gouv.fr/dgccrf`, `anses.fr` |
| Recherche | `pubmed.ncbi.nlm.nih.gov`, `ncbi.nlm.nih.gov/pmc`, `cochranelibrary.com` |
| Institutionnel santé | `who.int`, `inserm.fr`, `vidal.fr` |
| Nutrition & sport | `ciqual.anses.fr`, `insep.fr` |

Format : `<a href="…" target="_blank" rel="noopener noreferrer">Nom de la source</a>`.
Ancre = nom de la source, jamais l'URL nue. Interdit : liens vers des concurrents
directs (autres marques de compléments), vers des contenus payants, ou vers des
études prédatrices non indexées.

---

## 5. CONTENU PROGRAMMATIQUE : CE QUI EST LÉGITIME ICI

Le système de Clickzou (300 pages villes × 6 types) **n'a pas d'équivalent ici** :
un complément alimentaire ne se vend pas « à Toulouse ». Générer des pages
« ashwagandha Bordeaux » produirait du spam pur, sanctionné et inutile.

Les seules déclinaisons programmatiques légitimes pour bien.health :

| Axe | Volume réaliste | Condition |
|---|---|---|
| **Ingrédient** (1 page par actif : lion's mane, reishi, cordyceps, chaga, ashwagandha, rhodiola, ginseng, safran, L-théanine, collagène, maca) | ~11 pages | contenu réellement distinct, 1 500 mots+, sources propres |
| **Ingrédient × bénéfice** (« ashwagandha et sommeil ») | ~15 pages | uniquement si volume de recherche réel vérifié dans Search Console |
| **Comparatifs** (« lion's mane ou rhodiola », « gummies ou poudre ») | ~8 pages | tableau comparatif réel, pas de duplication |
| **Questions** (« quand prendre… », « combien de temps… ») | ~12 pages | réponse directe en tête, format FAQ |

**Règle absolue** : pas de génération sans données de recherche. Avant d'écrire une
page, vérifier dans Search Console (onglet « Mots-clés » du tableau de bord
`/seo`) que la requête existe déjà en impressions, ou la valider dans un outil
tiers. Une page sans demande est une page morte qui dilue l'autorité.

---

## 6. RÈGLES RÉDACTIONNELLES SEO

### Structure — pyramide de Minto
1. **Réponse d'abord** : la réponse à l'intention dans le premier paragraphe
2. **Arguments** : H2 structurant les preuves
3. **Détails** : H3, listes, chiffres, sources
4. **Action** : lien produit / diagnostic en fin de section utile

### MECE
Chaque H2 couvre un angle unique ; l'ensemble couvre tout le sujet. Une section
« posologie » ne parle pas d'histoire du champignon.

### Densité et forme

| Élément | Règle |
|---|---|
| metaTitle | 50-60 car., mot-clé en tête |
| metaDescription | 140-160 car., bénéfice + raison de cliquer |
| H1 | unique, = titre, contient le mot-clé principal |
| H2 | 6 à 10 par article long, mot-clé secondaire |
| H3 | 2 à 4 par H2 |
| Premier paragraphe | mot-clé principal dans les 100 premiers mots |
| Hiérarchie | jamais de saut H1 → H3 |

### Longueurs cibles

| Type | Mots |
|---|---|
| Guide pilier (silo) | 2 500 - 4 000 |
| Article support | 1 500 - 2 000 |
| Page ingrédient | 1 200 - 1 800 |
| Comparatif | 1 500 - 2 500 |
| Fiche produit (texte hors specs) | 600 - 1 000 |
| Page collection (bloc SEO) | 500 - 800 |

**Plancher applicable à bien.health : 1 500 mots pour un article de blog**
(et non 2 000 comme chez Clickzou). La raison est assumée : les 18 articles
actuels tournent autour de **550-700 mots**, un plancher à 2 000 rendrait tout le
stock non conforme d'un coup et bloquerait la publication. 1 500 mots est déjà
2,5× l'existant, et reste au-dessus du seuil où Google considère un contenu santé
comme superficiel. Les **piliers de silo**, eux, visent 2 500 mots minimum.

Ne jamais remplir pour atteindre le compte : chaque paragraphe ajoute une
information, un exemple, une donnée sourcée ou un conseil actionnable. Si un sujet
ne justifie pas 1 500 mots, le **fusionner** avec un article voisin.

### Ton BIEN health
- **Vouvoiement** (homogénéisé sur tout le site, décision client)
- **Sobre et factuel** : pas de promesse miracle, pas de superlatif
- **Prudent par construction** : « contribue à », « participe à », « soutient »
  — jamais « guérit », « traite », « supprime » (cf. § 7)
- **Incarné** : la marque parle, pas un rédacteur anonyme
- Pas d'emoji dans le contenu éditorial

### Images
- WebP/AVIF, `next/image`, `width`/`height` explicites (CLS)
- `alt` descriptif systématique ; `alt=""` **uniquement** pour une image purement
  décorative doublée par du texte adjacent
- Nom de fichier porteur de sens : `lions-mane-champignon-frais.webp`, pas `IMG_2043.png`

---

## 7. CONFORMITÉ RÉGLEMENTAIRE — LA CONTRAINTE N°1 DU SECTEUR

Cette section n'existe pas dans le master Clickzou. Elle est **prioritaire sur
toute considération SEO** : une allégation non conforme expose à une sanction
DGCCRF et à un déréférencement, et aucun gain de position ne compense cela.

### Cadre
- **Règlement (CE) n° 1924/2006** : les allégations nutritionnelles et de santé
  doivent figurer au registre européen des allégations autorisées
- **Article 7 du règlement (UE) 1169/2011** : pas d'information trompeuse
- Les allégations sur les **plantes** (*botanicals*) sont en attente d'évaluation
  (« on hold ») : elles restent tolérées **dans la formulation exacte déposée**,
  ce qui interdit de les reformuler librement
- **Interdiction absolue** : attribuer à un complément une propriété de
  prévention, de traitement ou de guérison d'une maladie humaine

### Règles d'écriture
| Interdit | Formulation conforme |
|---|---|
| « soigne l'anxiété » | « contribue au maintien d'un état de calme » (allégation on hold) |
| « guérit l'insomnie » | « participe à un sommeil de qualité » |
| « booste l'immunité » | « contribue au fonctionnement normal du système immunitaire » (si l'actif porte l'allégation autorisée, ex. vitamine C) |
| « anti-dépresseur naturel » | jamais — champ thérapeutique |
| « prouvé scientifiquement » sans source | citer l'étude, ou retirer |

### Mentions obligatoires sur toute page produit ou article prescriptif
- Ne se substitue pas à une alimentation variée et équilibrée ni à un mode de vie sain
- Ne pas dépasser la dose journalière recommandée
- Tenir hors de portée des enfants
- Déconseillé aux femmes enceintes/allaitantes et aux personnes sous traitement,
  sans avis médical (spécifiquement pour ashwagandha, rhodiola, ginseng)

### Contrôle avant publication
Tout nouvel article passe par cette question : **« si la DGCCRF lit ce paragraphe
seul, hors contexte, est-il défendable ? »** Si la réponse hésite, reformuler.

---

## 8. CONVERSION & BUSINESS

### CTA orientés action

| Bon | Mauvais |
|---|---|
| « Trouver ma formule en 1 minute » | « Découvrir » |
| « Voir CALM (sérénité & sommeil) » | « Nos produits » |
| « Commencer ma cure de 30 jours » | « Acheter » |
| « Comparer gummies et poudres » | « En savoir plus » |

### Structure CTA par type de page

| Position | CTA | Cible |
|---|---|---|
| Article — après la section « comment faire » | orientation | `/fr/diagnostic` |
| Article — conclusion | produit du silo | fiche produit |
| Collection — après le bloc SEO | produit | fiche produit |
| Fiche produit | ajout au panier | panier |

### Blocs preuve
- Avis vérifiés Loox (note réelle, photos) — jamais de note inventée
- Bandeau presse (33 médias) : preuve d'autorité, à garder au-dessus de la ligne
  de flottaison sur l'accueil
- Certifications et fabrication française : page dédiée liée depuis les fiches

---

## 9. GEO / LLM : ÊTRE CITÉ PAR LES IA

Règle permanente, reprise du master Clickzou et **encore plus pertinente ici** :
sur les questions santé, une part croissante des recherches se termine dans
ChatGPT, Perplexity ou les AI Overviews de Google, sans clic.

Checklist à vérifier à chaque audit :
1. **Accès des crawlers IA** : `robots.ts` doit autoriser explicitement GPTBot,
   OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, CCBot,
   Applebot-Extended — **non fait aujourd'hui** (le `*` les couvre, mais une
   autorisation explicite est plus robuste face aux futures restrictions)
2. **Entité forte** : `Organization` + `sameAs` (Instagram, LinkedIn, TikTok) +
   `contactPoint`, NAP cohérent avec la fiche Google
3. **Contenu citable** : définitions nettes, réponses directes, comparatifs,
   **données chiffrées sourcées** — les LLM citent en priorité ce qui est sourcé
4. **Mentions tierces** : presse (33 médias déjà), Reddit, forums santé, annuaires
5. **Bing** : ChatGPT s'appuie sur Bing — vérifier l'indexation dans Bing Webmaster
6. **Mesure** : suivre les référents `chatgpt.com` / `perplexity.ai` dans le
   tableau de bord, et tester régulièrement « quels compléments à base de lion's
   mane recommandes-tu ? »

Tout rapport d'audit **doit** inclure une section GEO évaluant ces 6 points.

---

## 10. MESURE & PILOTAGE

### Tableau de bord « SEO by Clickzou » — `/seo`

Outil interne du projet (accès protégé, `noindex`). Il agrège :
- **Google Analytics 4** : visiteurs, sessions, rebond, pages, canaux, appareils
- **Search Console** : clics, impressions, CTR, position moyenne, mots-clés avec
  évolution de position, pages qui rapportent des clics
- **Shopify Admin** : commandes, chiffre d'affaires, panier moyen, top produits
- **Temps réel** : visiteurs actifs, minute par minute, pages consultées

Périodes : 7 jours, 28 jours, 3 mois, 12 mois, chacune comparée à la période
précédente de même durée. Documentation de branchement : `docs/seo/dashboard-seo.md`.

### Rituel de pilotage

| Fréquence | Action |
|---|---|
| Hebdomadaire | Lire les mots-clés en progression et en recul ; corriger les titres/descriptions des pages qui perdent du CTR |
| Mensuel | Choisir les 2 articles à écrire d'après les requêtes en impressions sans clic (positions 8-25) |
| Trimestriel | Audit complet (technique + contenu + GEO + netlinking) |

### Règle d'or
Une décision SEO se prend sur une donnée du tableau de bord, jamais sur une
intuition. « Position 14 sur *café aux champignons*, 15 200 impressions, 1,2 % de
CTR » est un motif d'action ; « il faudrait écrire sur le café » n'en est pas un.

---

## 11. ROADMAP SEO

### Immédiat (septembre 2026) — dettes bloquantes
1. **Enrichir les 18 articles** à 1 500 mots minimum (ils sont à ~550-700)
2. **Maillage contextuel** : 4 liens internes minimum par article
3. Corriger les 12 meta descriptions trop longues et les 6 titres trop courts
4. `www` → apex en 301 ; passer la redirection de locale en 308
5. Ajouter `ItemList` (collections) et `WebSite`+`SearchAction` (accueil)

### Court terme (Q4 2026)
6. 11 pages ingrédient (silo 5), 1 200-1 800 mots chacune
7. Traduire les slugs `/en` et vérifier la qualité des traductions
8. Autoriser explicitement les crawlers IA dans `robots.ts`
9. Brancher les 3 sources du tableau de bord (comptes de service Google + Shopify)

### Moyen terme (2027)
10. 12 pages « questions » (format FAQ, réponse directe)
11. Netlinking : presse santé, blogs nutrition, annuaires de marques françaises
12. Programme d'avis clients photo (preuve + contenu frais sur les fiches)

---

## 12. VEILLE OBLIGATOIRE

Avant tout audit ou chantier SEO d'ampleur, vérifier ce qui a bougé côté moteurs
**et côté réglementation** — c'est la spécificité de ce projet.

À surveiller :
- **Google** : mises à jour core et *helpful content*, traitement YMYL des sujets
  santé, évolution des AI Overviews sur les requêtes santé
- **EFSA / DGCCRF** : évolution du statut des allégations *on hold* sur les plantes,
  nouvelles interdictions d'ingrédients
- **Concurrence** : positionnement des marques du secteur sur les mêmes requêtes
- **Shopify / Next.js** : changements qui affectent le rendu ou les URLs

Journal de veille : ajouter une entrée datée en tête de cette section à chaque
constat, avec sa source et la décision prise.

---

## BLOCS MACHINE-READABLE

Format conservé depuis le master Clickzou pour rester exploitable par un script.

### Silos

```yaml
# ── MACHINE-READABLE: SILOS ──
silos:
  - name: stress-sommeil
    pillar_editorial: /fr/blog/gerer-le-stress-naturellement
    pillar_commercial: /fr/collections/serenite
    product: CALM
    priority: 95
    min_articles: 6
    ideal_articles: 12
    description: Stress, cortisol, sommeil, ashwagandha, reishi, safran

  - name: concentration
    pillar_editorial: /fr/blog/ameliorer-sa-concentration
    pillar_commercial: /fr/collections/concentration
    product: FOCUS
    priority: 90
    min_articles: 6
    ideal_articles: 12
    description: Concentration, memoire, brouillard mental, lion's mane, rhodiola, L-theanine

  - name: energie-performance
    pillar_editorial: /fr/blog/retrouver-de-l-energie-naturellement
    pillar_commercial: /fr/collections/performance-et-vitalite
    product: POWER
    priority: 85
    min_articles: 5
    ideal_articles: 10
    description: Energie, fatigue, cordyceps, ginseng, recuperation sportive

  - name: beaute-collagene
    pillar_editorial: /fr/blog/collagene-bienfaits-peau
    pillar_commercial: /fr/collections/beaute-et-bien-etre
    product: MUSHGLOW
    priority: 75
    min_articles: 4
    ideal_articles: 8
    description: Peau, cheveux, collagene, chaga, antioxydants

  - name: savoir-adaptogenes
    pillar_editorial: /fr/blog/champignons-adaptogenes-guide-complet
    pillar_commercial: /fr/ingredients
    product: null
    priority: 92
    min_articles: 8
    ideal_articles: 20
    description: Autorite thematique — definitions, science, extraction, dosages

  - name: formats-usage
    pillar_editorial: /fr/blog/gummies-vs-gelules
    pillar_commercial: /fr/boutique
    product: null
    priority: 60
    min_articles: 3
    ideal_articles: 6
    description: Formats, posologie, cure, made in France, sans sucre
```

### Pages business

```yaml
# ── MACHINE-READABLE: BUSINESS PAGES ──
business_pages:
  - slug: /fr/collections/serenite
    priority: 95
    type: collection
    silo: stress-sommeil
    target: conversion
  - slug: /fr/collections/concentration
    priority: 92
    type: collection
    silo: concentration
    target: conversion
  - slug: /fr/collections/performance-et-vitalite
    priority: 88
    type: collection
    silo: energie-performance
    target: conversion
  - slug: /fr/collections/beaute-et-bien-etre
    priority: 80
    type: collection
    silo: beaute-collagene
    target: conversion
  - slug: /fr/ingredients
    priority: 90
    type: pillar
    silo: savoir-adaptogenes
    target: authority
  - slug: /fr/diagnostic
    priority: 85
    type: tool
    silo: null
    target: qualification
  - slug: /fr/boutique
    priority: 82
    type: listing
    silo: formats-usage
    target: conversion
```

### Règles d'article

```yaml
# ── MACHINE-READABLE: ARTICLE RULES ──
article_rules:
  min_words: 1500
  min_words_pillar: 2500
  min_internal_links: 4
  min_external_sources: 3
  max_meta_title: 60
  max_meta_description: 160
  required_blocks:
    - direct_answer_first_paragraph
    - faq_section
    - internal_link_to_collection
    - regulatory_disclaimer_if_prescriptive
  forbidden_claims:
    - guerit
    - traite
    - soigne
    - previent la maladie
    - remplace un traitement
    - anti-depresseur
    - miracle
```

### Règles de maillage

```yaml
# ── MACHINE-READABLE: LINKING RULES ──
linking_rules:
  intra_silo_ratio: 0.70
  cross_silo_ratio: 0.30
  max_links_same_target_per_article: 2
  max_click_depth: 3
  forbid_links_to_noindex: true
  forbidden_anchors: ["cliquez ici", "en savoir plus", "ici", "notre site"]
  external_link_attrs: 'target="_blank" rel="noopener noreferrer"'
```

### Priorisation

```yaml
# ── MACHINE-READABLE: PRIORITIZATION ──
prioritization:
  tiers:
    - tier: 1
      label: "Piliers de silo + collections"
      priority_range: [85, 100]
      action: "Enrichissement prioritaire, netlinking, maillage entrant maximal"
    - tier: 2
      label: "Fiches produit + articles support forts"
      priority_range: [65, 84]
      action: "Optimisation on-page, avis, donnees structurees"
    - tier: 3
      label: "Articles support secondaires + pages ingredient"
      priority_range: [40, 64]
      action: "Publication reguliere, maillage entrant"
    - tier: 4
      label: "Pages legales et utilitaires"
      priority_range: [0, 39]
      action: "Maintenance, aucun investissement SEO"
```
