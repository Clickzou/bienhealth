# SEO MASTER CLICKZOU

> **SOURCE DE VERITE ABSOLUE** pour tout le SEO du projet Clickzou.
> Ce fichier remplace et consolide : `CLICKZOU_SEO_SOURCE_OF_TRUTH.md`, `editorial-strategy-clickzou.md`, `seo-audit-playbook-clickzou.md`.
> A relire OBLIGATOIREMENT avant toute modification de contenu, de structure, de generateur ou de strategie.

**Version** : 2.6
**Derniere mise a jour** : 2026-07-26 (ajout § 12 — veille tendances obligatoire avant tout audit/correctif)
**Maintenu par** : Clickzou + Claude

---

## TABLE DES MATIERES

1. [Vision & strategie SEO globale](#1-vision--strategie-seo-globale)
2. [Architecture SEO du site](#2-architecture-seo-du-site)
3. [Silos semantiques](#3-silos-semantiques)
4. [Regles de maillage interne](#4-regles-de-maillage-interne)
5. [Systeme SEO programmatique V2.5](#5-systeme-seo-programmatique-v25)
6. [Templates & generateurs](#6-templates--generateurs)
7. [Regles redactionnelles SEO](#7-regles-redactionnelles-seo)
8. [Systeme de conversion & business](#8-systeme-de-conversion--business)
9. [Tests, optimisations & apprentissages](#9-tests-optimisations--apprentissages)
10. [Roadmap SEO](#10-roadmap-seo)
11. [Strategie 2026 : separation d'intention, GEO/LLM & webapp](#11-strategie-2026--separation-dintention-geollm--webapp)
12. [Veille obligatoire : tendances SEO & SEO local (temps d'avance)](#12-veille-obligatoire--tendances-seo--seo-local-temps-davance)

---

## 1. VISION & STRATEGIE SEO GLOBALE

### Positionnement

- **URL** : https://clickzou.fr
- **Activite** : Agence web specialisee creation, refonte, SEO, SEA
- **Siege** : 5 impasse de la Colombette, 31000 Toulouse
- **Cible** : TPE, PME, professions liberales, artisans — France entiere
- **Langue** : Francais uniquement
- **Positionnement prix** : tarifs de province, qualite agence — 500 EUR HT + 90 EUR HT/mois (vitrine), 2 100 EUR HT + 180 EUR HT/mois (haut de gamme)

### Objectifs business

1. **Acquisition organique** : capter les recherches transactionnelles et locales via 1 250+ pages
2. **Autorite thematique** : devenir la reference SEO francophone pour les TPE/PME
3. **Conversion** : chaque page du site doit avoir un objectif mesurable (lead, devis, audit)
4. **Scalabilite** : systeme programmatique industrialise pour couvrir 50 villes x 6 types + 128 metiers

### Strategie d'acquisition

```
Trafic organique (SEO local + national)
    |
    v
Pages programmatiques (300 locales + 128 metiers = 428 pages)
    +
Pages editoriales (527 articles)
    +
Linkable assets (20 etudes/templates/comparatifs)
    |
    v
Maillage interne → Pages business (10 pages de conversion)
    |
    v
CTA → Devis / Audit gratuit / Contact
```

### Canaux complementaires

| Canal | Role | Rythme |
|-------|------|--------|
| SEO organique | Acquisition principale | Permanent |
| Google Ads | Acquisition immediate | Budget mensuel |
| LinkedIn | Notoriete + trafic referral | 5 posts/semaine |
| Parasite SEO (Medium, Dev.to, Reddit) | Backlinks + visibilite | 1-2/mois |
| Newsletter (Brevo) | Retention + nurturing | Mensuelle |

---

## 2. ARCHITECTURE SEO DU SITE

### Vue d'ensemble

| Categorie | Nombre | Source |
|-----------|--------|--------|
| Pages statiques (App Router) | 50 | `src/app/*/page.tsx` |
| Articles editoriaux | 527 | `src/lib/articles/*.ts` (57 fichiers) |
| Pages programmatiques locales | 300 | `silo-pages-locales.ts` (50 villes x 6 types) |
| Pages programmatiques metiers | 128 | `silo-creation-metier.ts` (1 hub + 127 metiers) |
| Pages programmatiques autres | 348 | refonte-type, seo-metier, ads-metier, agence-web, outils |
| **TOTAL** | **~1 353** | |

### Structure technique

```
src/app/
├── page.tsx                          → Accueil (/)
├── [slug]/page.tsx                   → Articles dynamiques (1 200+ routes)
├── agence-creation-site-internet/    → Page pilier creation
├── agence-refonte-site-internet/     → Page pilier refonte
├── optimisation-seo-site-web/        → Page pilier SEO
├── agence-referencement-payant-sea/  → Page pilier Ads
├── referencement-google-my-business/ → Page pilier local
├── tarifs-site-internet/             → Page tarifs
├── audit-seo/                        → Lead magnet
├── devis/                            → Conversion finale
├── contact/                          → Conversion finale
├── blog/                             → Listing blog
├── etudes-seo/                       → Hub etudes
├── outils-seo/                       → Hub outils
└── ... (50 routes statiques)
```

### Regles SEO techniques

#### Trailing slash — OBLIGATOIRE PARTOUT
- `next.config.ts` : `trailingSlash: true`
- Tous les liens internes, canonical, sitemap : avec trailing slash
- Helper centralise : `src/lib/url-helpers.ts`
- Format : `https://clickzou.fr/page-slug/`

#### Canonical
- Auto-referent sur chaque page indexable
- Jamais de canonical croise (sauf redirection 301)

#### Redirections
- 301 uniquement (pas de 302)
- Pas de chaines A → B → C
- Gestion dans `src/app/*/page.tsx` avec `redirect()`

#### Sitemap
- 7 sitemaps segmentes + 1 index `/sitemap.xml`
- Source : `src/lib/sitemap-data.ts`
- Exclusions : draft, scheduled, noindex

#### Robots.txt
- `Allow: /`
- `Disallow: /api/`
- Sitemap : `https://clickzou.fr/sitemap.xml`

#### Meta tags
- metaTitle : max 60 caracteres, mot-cle principal en debut
- metaDescription : max 150 caracteres, avec benefice ou CTA
- noindex : uniquement mentions legales, CGU, cookies, draft, scheduled

#### Donnees structurees JSON-LD
- Pages service : `@graph` avec Service, LocalBusiness, BreadcrumbList, FAQPage
- Articles : Article + BreadcrumbList (genere automatiquement)
- Tarifs : `priceRange: "EUR EUR"` + AggregateRating (5/5, 36 avis reels — voir regle anti-regression du nb d'avis)

#### GEO — Optimisation pour moteurs generatifs (LLM) — REGLE PERMANENTE

**OBLIGATOIRE** : a CHAQUE audit SEO et a CHAQUE evolution du site Clickzou, prendre
en compte la dimension **GEO (Generative Engine Optimization)** = etre lu, compris et
**cite** par ChatGPT, Perplexity, Gemini (Google AI Overviews), Claude. Ce n'est pas
optionnel : c'est un axe au meme titre que le SEO classique.

Checklist GEO a verifier/appliquer systematiquement :
1. **Acces crawlers IA** : `robots.ts` autorise explicitement GPTBot, OAI-SearchBot,
   ChatGPT-User, PerplexityBot, Perplexity-User, Google-Extended, ClaudeBot,
   Claude-User, CCBot, Applebot-Extended (memes exclusions que `*`).
2. **Entite forte** : `Organization` + `sameAs` (tous profils) + `contactPoint`,
   NAP coherent, fiche Google complete. Cf. `src/lib/seo/organization-schema.ts`.
3. **Contenu citable** : reponses directes (Q&A), definitions, comparatifs, listes,
   et surtout **donnees chiffrees sourcees** (les LLM citent en priorite les stats
   sourcees). Schema `FAQPage` sur les pages a forte intention question.
4. **Mentions tierces** : presence sur Reddit/Quora/Medium/LinkedIn/YouTube et
   annuaires/listicles ("meilleure agence web Toulouse") — les LLM recommandent
   les marques citees sur de nombreuses sources. Levier = module parasite SEO.
5. **Bing** : ChatGPT s'appuie sur Bing -> verifier l'indexation (Bing Webmaster Tools).
6. **Mesure** : suivre le trafic de reference depuis chatgpt.com / perplexity.ai ;
   tester regulierement "quelle agence web a Toulouse recommandes-tu ?".

Tout rapport d'audit DOIT inclure une section "GEO / LLM" evaluant ces 6 points.

#### Mesure & analyse GEO (citations IA) — panneau dashboard

La visibilite IA se MESURE. Panneau dedie **"Visibilite IA (GEO)"** dans le
dashboard : **Stats SEO** (`src/components/dashboard/seo/AiCitationsPanel.tsx`),
avec courbe citations + pages citees (toggle 7j/30j/3M), top pages citees et
top grounding queries.

**Sources de donnees** :
1. **Bing AI Performance** (vraies citations Microsoft Copilot & partenaires) :
   export CSV depuis Bing Webmaster Tools (onglets Overview / Pages / Grounding
   Queries) -> deposer dans `data/bing-ai/` -> `node scripts/import-bing-ai-citations.mjs`
   regenere `src/lib/seo/ai-citations-data.ts`. Bing ne garde que ~3 mois -> reimporter
   regulierement. C'est aujourd'hui la SEULE source first-party de vraies citations
   (GSC NE separe PAS les AI Overviews ; ils sont fondus dans le rapport Performance).
2. **Traqueur multi-LLM** (en place / a etendre) : un cron hebdo interroge
   OpenAI (web search) + Claude (web search) + Google AI Overview (via SerpAPI) sur
   une liste de requetes cibles et detecte si `clickzou.fr` est cite -> table
   `geo_citation_checks`. Pas de cle Perplexity/Gemini pour l'instant. ATTENTION budget
   SerpAPI : le plan Developer = 5000 req/mois, deja bien consomme par `ranking-pull`
   (passe en HEBDO le 2026-06-12) -> limiter les probes Google AIO aux requetes prioritaires.

**Comment exploiter la donnee (PILOTAGE)** : les **grounding queries** et **pages
citees** disent ce que les IA reprennent chez nous -> prioriser en consequence la
**creation d'articles**, le **Content Refresh**, les **posts sociaux** et **GMB**.
Enseignement cle (donnees 2026-06, 667 citations) : le cluster **IA / no-code**
domine de loin (`limites-creation-site-internet-ia` = 146 citations,
`creer-site-internet-claude-code` = 82). Les **etudes chiffrees** et les pages
**"comment ca marche"** se font aussi citer. Donc : etendre en priorite le cluster
IA/no-code (honnete + chiffre + FAQ) et publier des etudes data-driven.

#### Performance
- Images : WebP, lazy loading, dimensions explicites
- Fonts : Plus Jakarta Sans + Space Grotesk (preload)
- Score Lighthouse cible : >80 Performance, >90 SEO, >90 Accessibilite

### Publication progressive

| Statut | Dev local | Production |
|--------|----------|-----------|
| `published` | Visible | Visible |
| `scheduled` (futur) | Visible + badge bleu | 404 + noindex |
| `scheduled` (passe) | Visible | Visible |
| `draft` | Visible + badge orange | 404 + noindex |

### Regle longueur minimale — 2000 mots (OBLIGATOIRE)

Tout article editorial **visible en production** doit faire au moins **2000 mots de contenu** (texte des blocs paragraph, heading, list, callout, quote, cta apres strip HTML). Un article `scheduled` qui passe automatiquement en ligne au jour J est aussi soumis a la regle.

**Exemptions** : pages programmatiques (silos `silo-*.ts`, generateurs `gen-*.ts`, `prog-*.ts`, villes `*-villes*.ts`, metiers `par-metier-v[23].ts`, `satellites-metiers.ts`).

**Mise en application** :
- Script de verification : `scripts/check-article-word-counts.ts`
- Commandes : `npm run words:check` (par defaut : visible+editorial), `npm run words:check:everything` (inclut drafts), `npm run words:check:show-all`
- **Le `prebuild` execute le check et bloque le `next build` si un article visible est sous 2000 mots.** Ne JAMAIS contourner ce check.
- Pour un nouvel article : viser **2200+ mots** des la redaction (marge de securite face au compteur strict).

---

## 3. SILOS SEMANTIQUES

Le site est structure en **7 silos** pour construire l'autorite thematique.

### Silo 1 — Creation de site internet

| Element | Valeur |
|---------|--------|
| Page pilier | `/agence-creation-site-internet/` |
| Pages programmatiques | `silo-creation-metier.ts` (128 pages) + creation-vitrine dans `silo-pages-locales.ts` (50 pages) |
| Articles satellites | creation par metier, par ville, guides complets |
| Mots-cles | creation site internet, site web sur-mesure, creer un site |

### Silo 2 — Refonte de site internet

| Element | Valeur |
|---------|--------|
| Page pilier | `/agence-refonte-site-internet/` |
| Pages programmatiques | `silo-refonte-type.ts` (77) + refonte dans `silo-pages-locales.ts` (50) |
| Mots-cles | refonte site internet, moderniser site web, migration SEO |

### Silo 3 — SEO / Referencement naturel

| Element | Valeur |
|---------|--------|
| Page pilier | `/optimisation-seo-site-web/` |
| Pages programmatiques | `silo-seo-metier.ts` (109) + agence-seo dans `silo-pages-locales.ts` (50) |
| Mots-cles | referencement naturel, optimisation SEO, audit SEO |

### Silo 4 — Google Ads / SEA

| Element | Valeur |
|---------|--------|
| Page pilier | `/agence-referencement-payant-sea/` |
| Pages programmatiques | `silo-google-ads-metier.ts` (92) + google-ads dans `silo-pages-locales.ts` (50) |
| Mots-cles | google ads, referencement payant, campagne SEA |

### Silo 5 — SEO local / Google My Business

| Element | Valeur |
|---------|--------|
| Page pilier | `/referencement-google-my-business/` |
| Pages programmatiques | `silo-pages-locales.ts` (300 pages, 50 villes x 6 types) |
| Mots-cles | SEO local, google my business, fiche etablissement |

### Silo 6 — Agence web

| Element | Valeur |
|---------|--------|
| Pages programmatiques | `silo-agence-web.ts` (50) + agence-web dans `silo-pages-locales.ts` (50) + `agences-villes-v2.ts` |
| Mots-cles | agence web [ville], meilleure agence web |

### Silo 7 — Outils SEO

| Element | Valeur |
|---------|--------|
| Page pilier | `/outils-seo/` |
| Pages programmatiques | `silo-outils-seo.ts` (20) |
| Mots-cles | outil SEO gratuit, analyse SEO |

### Hierarchie de circulation SEO

```
Homepage (autorite maximale)
    |
    v
Pages piliers (5 services + 2 hubs)
    |
    v
Articles editoriaux (satellites → piliers)
    |
    v
Pages programmatiques (locales + metiers)
    |
    v
Maillage horizontal (villes ↔ villes, metiers ↔ metiers)
```

---

## 4. REGLES DE MAILLAGE INTERNE

### Pages piliers et leurs URLs

| Silo | URL pilier |
|------|-----------|
| Creation | `/agence-creation-site-internet/` |
| Refonte | `/agence-refonte-site-internet/` |
| SEO | `/optimisation-seo-site-web/` |
| SEA | `/agence-referencement-payant-sea/` |
| Local | `/referencement-google-my-business/` |

### Mapping pilier par type de page programmatique

```typescript
const pillarUrls: Record<PageType, string> = {
  prix:     "/agence-creation-site-internet/",
  seo:      "/optimisation-seo-site-web/",
  web:      "/agence-creation-site-internet/",
  ads:      "/agence-referencement-payant-sea/",
  creation: "/agence-creation-site-internet/",
  refonte:  "/agence-refonte-site-internet/",
};
```

### Regles operationnelles — par page

#### Lien intro (obligatoire)
- 1 lien vers le pilier du silo dans le premier paragraphe
- Ancre naturelle variee : "Clickzou", "notre agence", "notre approche SEO"
- Jamais d'ancre exacte sur-optimisee

#### Lien corps (SEO + Ads obligatoire)
- Pages SEO : 1 lien vers `/optimisation-seo-site-web/` dans sectionBudgetROI
- Pages Ads : 1 lien vers `/agence-referencement-payant-sea/` dans sectionBudgetROI
- Ancres : "notre approche SEO", "notre gestion de campagnes Google Ads"

#### Liens verticaux (silo)
- Chaque page locale → 5 autres types de la meme ville (crossLinkBlock)
- Chaque page metier → hub + 3 metiers du meme secteur
- Chaque article → page pilier de son silo

#### Liens horizontaux
- Pages locales → 5 villes proches (nearbyCitiesBlock)
- Pages metier → metiers du meme secteur

#### Lien conclusion
- Footer de chaque page : lien vers `/`, `/tarifs-site-internet/`, `/audit-seo-site-web-gratuit/`, `/contact/`
- 3 variantes de footer selectionnees par hash

### Regles quantitatives

| Regle | Valeur |
|-------|--------|
| Liens internes minimum par page | 3 |
| Maximum vers la meme page par article | 2 |
| Ratio intra-silo / cross-silo | 70% / 30% |
| Tous les href | Avec trailing slash |
| Liens vers pages noindex | INTERDIT |
| Profondeur de clic maximum | 3 depuis l'accueil |

### Regles anti-pattern maillage

- Pas de liens "cliquez ici" ou "en savoir plus"
- Pas de listes de liens en fin d'article (seulement contextuels)
- Pas de lien depuis un article draft vers un article publie
- Pas de lien depuis un article publie vers un article draft/scheduled
- Ne jamais forcer un lien bidirectionnel si le contexte ne le justifie pas

### Liens externes — OBLIGATOIRES (E-E-A-T)

Tout article (statique ou auto-genere) doit citer **au minimum 3 liens externes** vers des sources fiables tierces. C'est un signal E-E-A-T critique pour Google : un article sans references vers des sources d'autorite est traite comme du contenu auto-publicitaire.

**Liens externes a integrer systematiquement quand le contenu s'y prete** :

| Categorie | Source(s) recommandee(s) | Quand citer |
|---|---|---|
| **Outils de mesure** | `pagespeed.web.dev`, `search.google.com/test/mobile-friendly`, `developers.google.com/web/tools/lighthouse` | Toute mention de vitesse / performance / mobile |
| **Plateformes Google** | `search.google.com/search-console`, `business.google.com`, `analytics.google.com` | Toute mention de SEO / GMB / Analytics |
| **Outils SEO tiers** | `ahrefs.com`, `semrush.com`, `screamingfrog.co.uk/seo-spider`, `gtmetrix.com` | Audit, backlinks, mots-cles |
| **Donnees & etudes** | `insee.fr`, `cci.fr`, source de toute statistique citee | Chiffres / benchmarks |
| **Standards & docs** | `developers.google.com/search`, `web.dev`, `w3.org` | Bonnes pratiques techniques |

**Format technique obligatoire** :
```html
<a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">Google PageSpeed Insights</a>
```
- `target="_blank"` : ouvre dans un nouvel onglet (ne pas perdre le lecteur sur clickzou.fr)
- `rel="noopener noreferrer"` : securise + n'envoie pas le PageRank vers la cible (preserve le jus interne)
- Ancre = nom de la source (ex. "Google PageSpeed Insights"), jamais l'URL nue

**Regles anti-pattern** :
- INTERDIT : linker vers des concurrents directs (autres agences web, freelances SEO).
- INTERDIT : linker vers des contenus payants (whitepapers a inscrire), Pinterest, Quora et autres reseaux non-autorites.
- INTERDIT : forcer un lien externe sans valeur informative pour le lecteur (Google Quality Raters detectent les liens promotionnels deguises).
- Distribuer les 3+ liens externes dans l'article (pas tous au meme endroit).

**Verification post-publication** : si un article publie a moins de 3 liens externes, il faut le refresher avant tout autre travail dessus. Le pipeline auto-genere applique deja cette regle dans son prompt, mais il faut auditer regulierement les articles statiques (cf. `scripts/audit-external-links.mjs` a creer).

---

## 5. SYSTEME SEO PROGRAMMATIQUE V2.5

### 5.1 Pages locales (300 pages)

#### Infrastructure

| Element | Fichier |
|---------|---------|
| Donnees villes | `src/lib/articles/local-city-data.ts` (50 villes) |
| Generateur | `scripts/generate-local-pages.ts` |
| Sortie | `src/lib/articles/silo-pages-locales.ts` |
| Script d'injection batch | `scripts/inject-refonte-data.ts` |

#### 6 types de pages par ville

| Type | Slug | Intention |
|------|------|-----------|
| prix | `prix-site-internet-{ville}` | Budget, cout, ROI |
| seo | `agence-seo-{ville}` | Visibilite, trafic, positionnement Google |
| web | `agence-web-{ville}` | Partenaire digital, accompagnement |
| ads | `google-ads-agence-{ville}` | Leads rapides, ROI publicitaire |
| creation | `creation-site-internet-vitrine-{ville}` | Lancer sa presence en ligne |
| refonte | `refonte-site-internet-{ville}` | Moderniser un site vieillissant |

#### 3 templates structurels

| Template | Profil ville | Structure |
|----------|-------------|-----------|
| A "marche local" | Petites villes, longue traine | hook → tarifs → preuve → disruption → middle |
| B "storytelling" | Grandes villes, conversion | hook → cas client → preuve → tarifs → middle |
| C "guide expert" | Villes SEO concurrentielles | hook guide → preuve → tarifs → erreurs → cas client |

Repartition : A=102 pages (17 villes), B=120 pages (20 villes), C=78 pages (13 villes)

#### Donnees obligatoires par ville (CityData)

```typescript
interface CityData {
  name: string;                    // "Toulouse"
  slug: string;                    // "toulouse"
  region: string;                  // "Occitanie"
  departement: string;
  population: number;
  gentile: string;                 // "Toulousains"
  sectors: string[];               // 3-5 secteurs economiques reels
  economicContext: string;         // UNIQUE — utilise 1 seule fois (intro)
  digitalChallenge: string;        // UNIQUE — utilise 1 seule fois
  localOrganization: string;
  localAid: string;                // Aides locales reelles (CCI, Region)
  nearbyCities: string[];          // Pour maillage horizontal
  zones: string[];                 // Quartiers/zones REELLES (pas villes voisines)
  templateVariant: "A" | "B" | "C";
  localStat: string;               // Chiffre credible unique
  whyClickzou: string;             // Argument localise
  caseStudy: { sector, problem, solution, result, timeline };
  uniqueFaq: { question, answer }[];

  // V2.5 — Donnees refonte specifiques
  caseStudyRefonte?: { sector, problem, solution, result, timeline };
  uniqueFaqRefonte?: { question, answer }[];
  whyClickzouRefonte?: string;
}
```

### 5.2 Cloisonnement strict des intentions (V2.5)

#### Filtre par type de page

```typescript
const intentRules: Record<PageType, IntentRule> = {
  prix:     { showTarifs: true,  showBudgetROI: false, showComparaison: true,  showServices: true },
  seo:      { showTarifs: false, showBudgetROI: true,  showComparaison: true,  showServices: true },
  web:      { showTarifs: true,  showBudgetROI: false, showComparaison: true,  showServices: true },
  ads:      { showTarifs: false, showBudgetROI: true,  showComparaison: true,  showServices: true },
  creation: { showTarifs: true,  showBudgetROI: true,  showComparaison: true,  showServices: true },
  refonte:  { showTarifs: true,  showBudgetROI: true,  showComparaison: true,  showServices: true },
};
```

**Regles strictes** :
- Pages SEO : JAMAIS de tarifs globaux de creation de site ("Formule Essentielle 500EUR")
- Pages Ads : JAMAIS de tarifs globaux — uniquement budget publicitaire
- Pages prix : parle UNIQUEMENT de budget/cout/ROI — pas de strategie SEO ni Ads
- Pages web : parle UNIQUEMENT d'accompagnement/partenariat

#### Sections interdites par type

| Type | INTERDIT |
|------|----------|
| seo | sectionTarifs (tarifs creation), contenu creation de site, contenu Google Ads |
| ads | sectionTarifs (tarifs creation), contenu SEO technique, contenu creation de site |
| prix | contenu SEO technique detaille, contenu campagnes Ads |
| web | budget SEO specifique, budget Ads specifique |

### 5.3 CaseStudy — 6 cas uniques par ville

#### Architecture

| Type | Source | Secteur |
|------|--------|---------|
| creation | `city.caseStudy` (city-data) | Secteur principal de la ville |
| refonte | `city.caseStudyRefonte` (city-data, 50 dedies) | Secteur different de creation |
| prix | Genere synthetiquement | `city.sectors[1]` |
| seo | Genere synthetiquement | `city.sectors[2]` |
| web | Genere synthetiquement | `city.sectors[3]` |
| ads | Genere synthetiquement | `city.sectors[0]` |

#### Regles anti-duplication caseStudy

- Chaque type utilise un secteur DIFFERENT de la ville → zero collision
- 4 variantes d'intro par type (selectionnees par hash ville + template)
- Chiffres varies par hash (leads, ROI, timeline)
- Types d'entreprise varies (independant, PME, artisan, commerce, cabinet, entreprise familiale)
- CMS varies (Wix, WordPress, Jimdo, HTML statique, Squarespace, page Facebook)

#### Fonctions d'elision grammaticale

```typescript
leSecteur("aeroalimentaire")   → "l'agroalimentaire"
leSecteur("sante")             → "la sante"
leSecteur("biotechnologies")   → "les biotechnologies"
dansLeSecteur("aeronautique")  → "dans l'aeronautique"
duSecteur("tourisme")          → "du tourisme"
```

Maps : `SECTEURS_FEMININS` (17), `SECTEURS_PLURIELS` (12), `SECTEURS_COMPOSE` (32 cas speciaux)

### 5.4 FAQ — 6 pools distincts par type

| Type | Exemples de questions | Pool |
|------|----------------------|------|
| prix | "Quel est le vrai prix...", "Pourquoi les prix varient...", "Couts caches" | 6 questions |
| seo | "Combien de temps pour Google...", "SEO local vs classique", "Mesurer l'efficacite" | 6 questions |
| web | "Choisir une agence...", "Local vs distance", "Bon accompagnement" | 6 questions |
| ads | "Budget minimum...", "Rentabilite PME", "Delai resultats" | 6 questions |
| creation | FAQ ville originales (city-data `uniqueFaq`) | 3-4 questions |
| refonte | FAQ refonte (city-data `uniqueFaqRefonte` ou fallback) | 3 questions |

Selection : 3 questions parmi 6 par hash → 20 combinaisons possibles → zero pattern inter-villes

### 5.5 Systeme de variation avancee (anti-pattern V2.5)

#### Hooks SEO (intro)
- 10 hooks par type (creation, refonte)
- 10 hooks par type (prix, seo, web, ads)
- Hash : `ville + template + type` pour rotation optimale
- Max ~12 pages par hook sur 50

#### Stats variees
- Chaque type a ses propres metriques
- Chiffres varies par `hashCity()` (aucun identique entre villes)
- Exemples prix : mal references 65-79%, slow 50-65%, no CTA 35-46%
- Exemples SEO : sites optimises 2-5, page 2-3, fiches incompletes 50-69%
- Exemples Ads : CPC varies par population, conversion 2.8-4.0%, ROI 3-10x

#### Blocs de disruption
- **Friction commerciale** : 4 variantes par type, ~60% des pages
- **Insight local** : 4 variantes par type, ~40% des pages (exclusif avec friction)
- Jamais les deux sur la meme page
- Position differente selon le template

#### Paragraphes varies
- sectionPourquoi : 4 variantes par type
- sectionComparaison : 4 variantes par type
- sectionBudgetROI : closing lines variees
- ctaByPageType : 4 CTA + 3 footers varies

#### Tarifs — 3 layouts par template

| Template | Layout | Presentation |
|----------|--------|-------------|
| A | Liste simple | 5 items tarifs directs |
| B | Storytelling ROI | 3 formules nommees (Essentielle/Performance/Sur Mesure) |
| C | Comparaison marche | Freelance vs Clickzou vs Agence premium |

### 5.6 Pages metiers (128 pages)

#### Infrastructure

| Element | Fichier |
|---------|---------|
| Donnees | `src/lib/articles/metier-data.ts` (154 metiers) |
| Generateur | `scripts/generate-metier-pages.ts` |
| Sortie | `src/lib/articles/silo-creation-metier.ts` |

#### Donnees obligatoires par metier

- features : 5 fonctionnalites web SPECIFIQUES au metier
- constraints : contraintes reglementaires REELLES
- clientJourney : parcours client specifique
- sectorStat : statistique sectorielle unique
- caseStudy : cas client unique (secteur different pour chaque metier)
- faq : 3 questions uniques specifiques
- whyClickzou : argument adapte au metier

---

## 6. TEMPLATES & GENERATEURS

### Pages locales

| Fichier | Commande | Pages |
|---------|----------|-------|
| `scripts/generate-local-pages.ts` | `npx tsx scripts/generate-local-pages.ts` | 300 |
| Options | `--dry-run`, `--limit N`, `--city slug` | |
| Sortie | `src/lib/articles/silo-pages-locales.ts` | 4 674 KB |

### Pages metiers

| Fichier | Commande | Pages |
|---------|----------|-------|
| `scripts/generate-metier-pages.ts` | `npx tsx scripts/generate-metier-pages.ts` | 128 |

### Images manquantes

| Fichier | Commande |
|---------|----------|
| `scripts/generate-missing-images.ts` | `npx tsx scripts/generate-missing-images.ts [--dry-run]` |
| API | OpenAI DALL-E 3, 1792x1024, style natural |
| Sortie | `public/blog/*.webp` |

### Injection batch refonte data

| Fichier | Usage |
|---------|-------|
| `scripts/inject-refonte-data.ts` | Injection unique des 45 caseStudyRefonte dans city-data |

### Protocole avant regeneration

1. Relire ce fichier
2. `npx tsx scripts/generate-local-pages.ts --dry-run` (verification)
3. `npx tsx scripts/generate-local-pages.ts` (generation)
4. `npx next build` (verification build)
5. Verifier les slugs, la duplication, les liens
6. `git commit` avec message descriptif
7. `git push origin main` (deploy auto Vercel)

---

## 7. REGLES REDACTIONNELLES SEO

### Structure de contenu — Pyramide de Minto

1. **Conclusion d'abord** : reponse directe a l'intention de recherche dans le premier paragraphe
2. **Arguments cles** : H2 structurant les preuves principales
3. **Details et donnees** : H3, listes, chiffres, cas clients
4. **CTA** : action concrete en fin de section et en conclusion

### Methode MECE (Mutuellement Exclusive, Collectivement Exhaustive)

- Chaque H2 couvre un angle UNIQUE (pas de chevauchement)
- L'ensemble des H2 couvre TOUT le sujet (pas de lacune)
- Une section "prix" ne parle pas de SEO technique
- Une section "SEO" ne parle pas de tarifs creation

### Densite SEO

| Element | Regle |
|---------|-------|
| metaTitle | Max 60 chars, mot-cle principal en debut |
| metaDescription | Max 150 chars, avec benefice ou CTA implicite |
| H1 | = title de l'article, mot-cle principal present |
| H2 | Mot-cle secondaire ou variante, 6-10 par article long |
| H3 | 2-4 par H2, specifiques |
| Premier paragraphe | Mot-cle principal dans les 100 premiers mots |
| Pas de saut Hn | H1 → H2 → H3 (jamais H1 → H3) |

### Longueurs cibles

| Type | Mots |
|------|------|
| Guide complet / Etude | 3 000 - 5 000 |
| Comparatif | 2 000 - 3 500 |
| Article support | 2 000 - 2 500 |
| Page service | 1 500 - 3 000+ |
| Page programmatique | 800 - 1 500 |
| Definition | 2 000 - 3 000 |

### Regle plancher absolue — 2 000 mots minimum pour tout article editorial

**Aucun article editorial publie (status `published`) ne doit descendre sous 2 000 mots de contenu reel.**

Cette regle s'applique a tous les fichiers `src/lib/articles/*.ts` HORS silos programmatiques (`silo-pages-locales.ts`, `silo-creation-metier.ts`, `silo-refonte-type.ts`, `silo-seo-metier.ts`, `silo-google-ads-metier.ts`, `silo-agence-web.ts`, `silo-outils-seo.ts`). Les pages programmatiques gardent leur cible 800-1 500 mots (structure industrialisee, cloisonnement V2.5).

**Pourquoi** : un contenu court signale a Google un manque de valeur et de profondeur. L'utilisateur a rappele cette regle apres avoir constate des articles <500 mots publies en production. Objectif : densite editoriale, autorite thematique, potentiel backlinks.

**Regles d'application** :
- Avant toute publication (`status: "draft"` -> `"published"` ou `"scheduled"` -> `"published"`), verifier le nombre de mots du champ `content`
- Si un article existant publie passe sous 2 000 mots suite a une suppression de section, **enrichir avant merge**
- Comptage : utiliser `scripts/count-article-words.ts` (si disponible) ou script Node ad-hoc parcourant le `content[]`
- Contenu reel = paragraphs + list items + callouts + quotes + FAQ questions/answers (hors metaTitle, metaDescription, excerpt, tags, alt)
- Ne JAMAIS faire du remplissage : chaque paragraphe ajoute doit apporter une information, un exemple, une donnee ou un conseil actionnable
- Si un sujet ne justifie pas 2 000 mots, **fusionner** avec un article voisin plutot que publier court

**Exceptions autorisees** :
- Outils SEO (hub `/outils-seo/` et pages outil `src/app/outils-seo/*`) : le contenu utile est l'outil lui-meme, pas le texte — mais la page doit quand meme presenter un minimum de 500 mots de contexte pedagogique
- Pages legales (mentions, CGU, cookies) : non soumises a la regle
- Pages de conversion pures (`/devis/`, `/contact/`, `/demande-audit/`) : non soumises a la regle

**Etat au 2026-04-23** : 99 articles editoriaux sur 179 sont sous 2 000 mots. Chantier de rattrapage en cours.

### Ton redactionnel Clickzou

- **Professionnel** mais accessible (pas de jargon sans explication)
- **Data-driven** : toujours des chiffres, jamais de "amelioration significative"
- **Direct** : pas de tournures passives, pas de conditionnel excessif
- **Conversationnel** : tutoiement interdit, vouvoiement naturel
- **Auteur** : toujours "Clickzou" (jamais de prenom)
- **Pas d'emojis** dans le contenu (sauf si demande explicite)

### Images

- Format obligatoire : WebP
- Alt text : descriptif, mot-cle si pertinent, jamais vide
- Dimensions : toujours specifier width/height (CLS)
- Generation : OpenAI DALL-E (gpt-image-1), style photorealiste
- Interdit : flat design, cartoon, vector, isometric, texte dans l'image

---

## 8. SYSTEME DE CONVERSION & BUSINESS

### CTA orientes action (pas generiques)

| BON | MAUVAIS |
|-----|---------|
| "Lancer mon audit SEO" | "Contact" |
| "Estimer mon projet" | "Devis gratuit" |
| "Diagnostiquer mon site" | "En savoir plus" |
| "Reserver un echange 15 min" | "Nous contacter" |

### Structure CTA par page

| Position | CTA | URL |
|----------|-----|-----|
| Intro | Lien pilier + proposition de valeur | Pilier du silo |
| Mid (apres friction/insight) | Action immediate | `/audit-seo-site-web-gratuit/` ou `/devis/` |
| Final | Conversion directe | `/devis/` ou `/contact/` |

4 variantes de CTA final par type, selectionnees par hash.

### Blocs preuve

- Stats locales variees par hash (pas de chiffres identiques entre villes)
- Cas clients avec resultats concrets (chiffres, timeline, secteur local)
- 6 cas clients uniques par ville (1 par type)
- Pas de promesses vagues

### Friction commerciale

- Identifier les erreurs courantes du prospect
- Montrer le cout de l'inaction (chiffres)
- Creer l'urgence sans manipulation
- 4 variantes par type, ~60% des pages
- Position differente selon le template

### Offres de conversion

| Offre | URL | Objectif |
|-------|-----|----------|
| Audit SEO gratuit | `/audit-seo-site-web-gratuit/` | Lead qualification |
| Devis gratuit 24h | `/devis/` | Lead conversion |
| Echange 15 min | `/contact/` | Lead nurturing |
| Tarifs transparents | `/tarifs-site-internet/` | Qualification budget |

---

## 9. TESTS, OPTIMISATIONS & APPRENTISSAGES

### Ce qui a ete teste et valide (V2.5)

| Test | Resultat | Decision |
|------|----------|----------|
| CaseStudy identique sur 6 types/ville | Duplication massive detectee | **Corrige** : 6 cas uniques par ville |
| FAQ identique sur 6 types/ville | Cannibalisation FAQ dans SERP | **Corrige** : 6 pools de FAQ par intention |
| Stats identiques inter-villes (72%/58%/45%) | Pattern programmatique detectable | **Corrige** : hash-variation par ville |
| sectionTarifs sur pages SEO/Ads | Melange d'intentions | **Corrige** : intentRules filtre les sections |
| 4 hooks par type | Collision sur 80% des pages | **Corrige** : 10 hooks + hash template-aware |
| Bloc tarifs identique 300 pages | Signal contenu auto-genere | **Corrige** : 3 layouts (A/B/C) |
| "le creation" / "la google ads" | Fautes grammaticales | **Corrige** : h2Variants par type + elision |
| Lien pilier refonte → creation | Maillage casse | **Corrige** : pillarUrls par type |
| Intro caseStudy identique par type | Pattern sur 50 pages | **Corrige** : 4 variantes intro par type |

### Ce qui fonctionne

- Hash deterministe pour variation : reproductible, debuggable, zero collision
- Templates A/B/C pour variation structurelle : ordre de sections different
- Donnees enrichies par ville (city-data) : contenu unique verifiable
- Filtre d'intention (intentRules) : cloisonnement strict verifie
- Elision grammaticale (leSecteur/dansLeSecteur) : 0 faute sur 300 pages

### Ce qui doit etre evite

| Anti-pattern | Pourquoi |
|-------------|----------|
| find/replace du nom de ville | Contenu thin detecte par Google |
| Memes stats sur toutes les villes | Pattern programmatique |
| Memes FAQ sur tous les types | Cannibalisation SERP |
| Liens bidirectionnels forces | Sur-optimisation maillage |
| CTA generiques ("Contact", "En savoir plus") | Taux de conversion faible |
| Section tarifs globaux sur pages SEO/Ads | Melange d'intentions |
| Ancres sur-optimisees | Penalite Google |

---

## 10. ROADMAP SEO

### Court terme (Q1-Q2 2026)

- [x] V2.5 du generateur programmatique deploye
- [x] 50 caseStudyRefonte enrichis
- [x] 134 images hero manquantes generees
- [ ] Publier les 3 etudes SEO en draft (linkable assets)
- [ ] Publier les 17 linkable assets schedules (calendrier Mars-Mai)
- [ ] Enrichir les caseStudy des pages prix/seo/web/ads avec des donnees city-data (au lieu de synthetiques)

### Moyen terme (Q3-Q4 2026)

- [ ] Etendre le generateur a 100 villes (actuellement 50)
- [ ] Ajouter les 26 metiers restants (154 dans data, 128 generes)
- [ ] Creer un generateur de pages par departement
- [ ] Implementer un systeme de variation du bloc sectionBudgetROI (closing identique sur 50 pages)
- [ ] A/B tester les layouts tarifs (A vs B vs C) en production

### Backlinks

- Publier 2 etudes data-driven par trimestre (linkable assets)
- 1-2 publications Parasite SEO par mois (Medium, Dev.to, Reddit)
- Outreach cible sur les etudes pour obtenir des citations
- Objectif : 20 backlinks de qualite par trimestre

### Axes d'amelioration identifies

| Axe | Priorite | Impact |
|-----|----------|--------|
| CaseStudy prix/seo/web/ads avec donnees city-data (au lieu de synthetiques) | HAUTE | Credibilite + unicite |
| sectionBudgetROI closing varie | MOYENNE | Anti-pattern |
| pricingItems() Layout A filtrable par type | FAIBLE | Purete intention |
| Pages locales : ajout de 50 villes supplementaires | HAUTE | Volume SEO |
| Audit qualite pages metiers (meme methodologie que locales) | HAUTE | Qualite globale |

---

## 11. STRATEGIE 2026 : SEPARATION D'INTENTION, GEO/LLM & WEBAPP

> Section ajoutee le 2026-07-17 (audit + directives client). **Priorite nº1 rappelee : etre positionne sur la CREATION et la REFONTE de site a TOULOUSE + le SEO local.** Tout le reste (GEO, webapp, national) est au service de cette priorite.

### 11.1 Separation d'intention : home vs pages dediees (REGLE STRUCTURANTE)

Constat 2026-07-17 : la **home ecrasait ses propres pages dediees** sur les termes commerciaux (ex. « creation site internet toulouse » : home pos 12, page dediee pos 85). Une home ne peut ranker nº1 que sur 1-2 termes ; en absorbant creation+refonte+SEO+web+digitale+IA elle se dilue et plafonne partout.

**Carte d'intention officielle (1 intention = 1 page) :**

| Intention / requete | Page proprietaire |
|---------------------|-------------------|
| agence digitale Toulouse, agence IA Toulouse, agence web Toulouse | **HOME** (`/`) |
| creation site internet Toulouse | `/agence-creation-site-internet-toulouse/` |
| refonte site internet Toulouse | `/agence-refonte-site-internet-toulouse/` |
| agence SEO / referencement Toulouse | `/optimisation-seo-site-web-toulouse/` |
| Google Ads / SEA Toulouse | `/agence-referencement-payant-sea-toulouse/` |
| site e-commerce Toulouse | `/agence-e-commerce-toulouse/` |
| tarifs / prix site internet Toulouse | `/tarifs-site-internet-toulouse/` |
| Google My Business Toulouse | `/agence-google-my-business-toulouse/` |

**Regles :**
- La HOME reste sur son identite « agence digitale et IA a Toulouse ». Elle NE DOIT PAS cibler les termes commerciaux en signal H1 (le `sr-only` du Hero a ete recentre le 2026-07-17). Ses mentions de services pointent en **lien ancre-exacte vers la page dediee**, pas en texte brut.
- **NE PAS creer** de page `agence-digitale-toulouse` ni `agence-ia-toulouse` : la home les possede, les creer la cannibaliserait.
- Pour faire passer une page dediee DEVANT la home : autorite editoriale (backlinks) + on-page exact + de-emphase de la home. Le maillage interne (menu + footer ancre-exacte) est deja en place ; ce n'est pas le levier manquant.

### 11.2 Perimetre geographique (3 cercles)

Donnees : Toulouse = pages en page 2 (a portee) ; « agence web occitanie » deja pos 6 ; villes lointaines (Paris/Lyon/Bordeaux) pos 40+, 0 clic pour 36k impressions (aucune autorite hors zone).

1. **Coeur (80 % de l'effort) — Toulouse ville** : les 6-7 tetes de requete commerciales.
2. **Extension (15 %) — Toulouse Metropole + Occitanie** : hub `agence-web-toulouse-agglomeration`.
3. **Maintenance (5 %) — metier + Toulouse** : deja top 10, faible volume, on entretient.
4. **ARRET** des villes lointaines hors Occitanie (deja partiellement en noindex). Ne plus y investir.

### 11.3 GEO / LLM : etre cite par les IA

Etat 2026-07-17 : ChatGPT **25 %**, Claude **16 %**, Google AI Overviews **0 %**. La liste des requetes sondees est dans `src/lib/seo/geo-queries.ts` (elargie a 33 le 2026-07-17).

**Principe cle : GEO et Google = le meme combat.** Les AI Overviews puisent dans l'index Google ; ChatGPT/Perplexity citent ce qui a de l'autorite et ranke. Donc indexation + autorite + position servent les 3 a la fois. Le 0 % en AIO est cause par le deficit d'indexation (58 % « crawled - not indexed ») et le classement page 2.

**Checklist GEO (obligatoire sur toute page/article a fort potentiel de citation) :**
1. **Reponse directe** en tete : une phrase factuelle et autonome qui repond a la requete exacte (extractible par un LLM). Modele en place : bloc « l'essentiel » sur `/agence-refonte-site-internet-toulouse/`.
2. **Donnees et comparatifs reutilisables** : tableaux, chiffres, « X vs Y » tranches. C'est ce qui fait citer `limites-creation-site-internet-ia`.
3. **FAQ structuree** ciblee sur les requetes reelles (donnees GSC).
4. **Fraicheur visible** (date de mise a jour) + **autorite** (cf. netlinking).
5. **Presence hors-site** : etre dans les listicles/annuaires que les IA agregent (« top agences web Toulouse ») — cf. 11.4.
6. **Angle differenciant IA** : le cluster IA/no-code est le seul actif GEO qui performe ; c'est la signature « agence IA » a muscler.

### 11.4 Netlinking : priorites (autorite REELLE, hors clients, 301 resolus)

Deux regles de calcul imperatives (erreurs commises et corrigees le 2026-07-17) :
- **Resoudre les redirections 301** avant de compter l'autorite (les liens vers un slug redirige alimentent la canonique — rien n'est « perdu »).
- **EXCLURE les 21 domaines clients** (footers « site cree par Clickzou », dont sop-events 1 555 liens sitewide) : devalues par Google, ils gonflent artificiellement l'autorite. Liste = URLs de `src/components/Portfolio.tsx`.

Priorites backlinks editoriaux (au 2026-07-17, hors clients) : **agence-web (0 dom.), refonte (3), SEO (4)** = les vrais manques. Creation (9) et tarifs (5) sont proches/a la cible. Detail affiche sur `/dashboard/seo/netlinking`. Toujours : domaines DISTINCTS > volume, ancre exacte + variantes, viser la canonique 200 en direct. Un backlink editorial depuis un « top agences Toulouse » sert double (SEO + GEO).

### 11.5 Reprise de la generation d'articles (cadre STRICT)

Cadre operationnel arrete le 2026-07-17. **Rythme : 2 articles/semaine MAXIMUM** (peu mais cible ; le desastre venait de 12-15/sem aveugles). Reactivation = poser `ARTICLE_GENERATION_ENABLED=true` en env Vercel + redeploiement.

**3 flux avec quotas :**
1. **Toulouse creation/refonte/SEO** = **40 % (PRIORITE)** — ex. « refonte site internet [metier] Toulouse ».
2. **Webapp metier** = **35 %** (nouveau pilier) — ex. « application [besoin] pour [metier] » -> pointe vers /webapp.
3. **IA / GEO** = **25 %** — « creer un site avec ChatGPT/Claude », comparatifs « X vs Y ».

**Garde-fous CODES (en place depuis 2026-07-17) :**
- **Anti-doublon par empreinte de SUJET** : `src/lib/article-engine/dedup-empreinte.ts` (`findEmpreinteConflict`). Branche AUX DEUX points de publication (`src/jobs/publish-articles.ts` + `src/app/api/articles/publish/route.ts`). Refuse (status=rejected, reason_code=`dup_empreinte`) tout article dont l'empreinte de titre (tokens hors mots-vides, y compris 1 seul token signifiant) collisionne avec un article DEJA publie a slug different. Le guard same-slug historique ne couvrait QUE les slugs identiques.
- **Budget hebdo PARTAGE** entre les 2 branches d'enqueue (`WEEKLY_TARGET=2` dans `publish/route.ts`). Avant, la branche orchestration (§3) n'etait pas bornee et contournait le cap -> 12-15 articles/sem. Desormais §3 puis §4 consomment un seul `weeklyBudget`.

**Regles de contenu :**
- **Chaque article pointe vers une money page Toulouse** + la webapp/service concerne (maillage descendant).
- **Format citable obligatoire** (cf. 11.3) : reponse directe + tableau/donnees + FAQ.
- **Aucun chiffre invente** : sourcage honnete uniquement (regle perenne).

**Mesure de la reprise** : tracker GEO elargi (33 requetes, `geo-queries.ts`) + GSC (cron repare). Si un flux ne se fait pas citer/ranker sous quelques semaines, reallouer.

### 11.6 Vision WEBAPP (differenciation pionniere)

Onglet webapp : proposer des **applications metier** (pas seulement des sites). Coherent avec le positionnement « agence IA / outils propriétaires ». Roles : monte le panier moyen, cree du contenu unique et citable (SEO+GEO sur un espace de mots-cles quasi vide), renforce l'identite IA. **C'est une couche par-dessus le coeur creation/refonte, pas un remplacement.**

Approche produit : **productiser 6-7 briques horizontales** (construites une fois, revendues a des dizaines de metiers) + sur-mesure pour le reste. Briques prioritaires : prise de RDV, espace client/suivi, click & collect, chatbot IA metier, carte de fidelite, simulateur de devis, assistant IA de contenu. Liste des ~25 webapps proposees : voir historique de session / a formaliser en page `/webapp` + cluster d'articles « application metier [secteur] ».

---

## 12. VEILLE OBLIGATOIRE : TENDANCES SEO & SEO LOCAL (TEMPS D'AVANCE)

> **REGLE ABSOLUE (ajoutee le 2026-07-26 a la demande du user).**
> **Avant tout audit SEO, et avant toute application de correctifs issus d'un audit**, Claude doit faire une
> **recherche web fraiche** sur les dernieres tendances SEO / SEO local / GEO.

### 12.1 Ce qui est attendu (et ce qui ne l'est PAS)

**INTERDIT** — ne jamais restituer ce que Clickzou fait deja et qui est du standard de marche :
« optimiser les balises title », « creer du contenu de qualite », « soigner sa fiche Google Business Profile »,
« le mobile-first », « E-E-A-T c'est important », « le SEO local convertit mieux ». Ce type de sortie est
considere comme un echec de la tache : ca ne donne aucun avantage concurrentiel.

**ATTENDU** — uniquement des elements qui donnent un **temps d'avance** :
1. **Mecanique nouvelle** d'un moteur (Google AI Mode, AIO, ChatGPT Search, Perplexity, Copilot) — comment le
   systeme selectionne/cite techniquement, pas ce qu'il « prefere » en general.
2. **Changement date** (core update, changement GBP, nouveau crawler, nouvelle SERP feature) avec sa
   consequence operationnelle concrete sur Clickzou.
3. **Pratique invalidee** par la donnee — ce qu'il faut ARRETER de faire (aussi precieux que ce qu'il faut faire).
4. **Fenetre d'opportunite temporaire** (ex : deploiement IA retarde en France/UE, feature en beta, espace de
   mots-cles encore vide) — a exploiter avant les concurrents.
5. **Seuils / chiffres actionnables** issus d'etudes (longueur de passage, poids d'un signal, fenetre de recence)
   plutot que des principes vagues.

### 12.2 Procedure

1. **Minimum 4 recherches web** ciblees, dont au moins :
   - 1 sur les **mecaniques des moteurs IA** (retrieval, chunking, citation, grounding) ;
   - 1 sur le **SEO local / local pack / GBP** (facteurs de classement, changements produit) ;
   - 1 sur les **derniers core updates** et leur impact reel mesure ;
   - 1 sur les **pratiques invalidees / mythes demontes** par des tests recents.
2. **Requetes en anglais autorisees et encouragees** (l'information de pointe sort d'abord en anglais).
3. **Chaque trouvaille doit etre qualifiee** : `[PROUVE]` (etude/test chiffre), `[OBSERVE]` (consensus de
   praticiens), `[HYPOTHESE]` (piste non validee). Ne jamais presenter une hypothese comme un fait.
4. **Chaque trouvaille retenue doit etre traduite en action Clickzou** — sinon elle ne figure pas dans le rendu.
   Format : `Tendance -> ce que ca change pour nous -> action concrete -> effort/impact`.
5. **Section dediee obligatoire** dans le rendu de l'audit : « Veille & temps d'avance ».
6. **Consigner les acquis** : les tendances validees et appliquees sont ajoutees en 12.3 pour ne pas les
   rechercher deux fois et pour tracer ce qui a ete teste.

### 12.3 Acquis de veille (journal — le plus recent en premier)

**2026-07-26** (audit complet) :
- `[PROUVE]` **Retrieval par passage, pas par page** : Google AI Mode (Gemini) eclate une requete en 8-12
  sous-requetes (*query fan-out*) et note des **chunks** independamment de la page. Consequence : un paragraphe
  auto-suffisant d'un petit site peut battre un guide de 5 000 mots. -> Action : structurer chaque H2 comme une
  reponse autonome de **130-170 mots** contenant l'entite + le lieu + le chiffre (le chunk doit se comprendre
  hors contexte, car le titre de section voyage avec lui a l'embedding).
- `[PROUVE]` **AIO local = sous-ensemble du map pack** : les entreprises citees dans les AI Overviews locales
  sont celles qui rankent deja dans le pack local. -> Action : nos 0 citation Google AIO ne se corrigent PAS par
  du contenu ; elles se corrigent par le **classement dans le pack local** (GBP + avis + proximite).
- `[PROUVE]` **Recence des avis** : le poids de la recence des avis a ete multiplie par ~2,3 en 2026 ; 20 avis
  des 90 derniers jours battent 200 avis de 2 ans. -> Action : passer d'une logique « nombre d'avis » a une
  logique de **flux continu d'avis** (objectif : quelques avis frais chaque mois, jamais 0 sur 90 jours).
- `[PROUVE]` **Ce qui ne sert a rien** : geotagging des photos GBP et bourrage de mots-cles dans les Google
  Posts — aucun effet mesure (test sur 441 mots-cles / 9 semaines). -> Action : ne pas investir la dedans ;
  les Posts servent la fraicheur du profil, pas le ranking par mot-cle.
- `[OBSERVE]` **Fraicheur du profil GBP** : au-dela de ~30 jours sans nouvelle photo/post/reponse, la visibilite
  locale decroche. -> Action : cadence minimale garantie sur la fiche, y compris hors campagne.
- `[PROUVE]` **llms.txt est inutile aujourd'hui** : sur 500 M de visites de bots IA observees, 408 seulement ont
  lu le fichier ; Google declare ne pas le supporter. -> Action : le garder (cout nul) mais **ne compter que sur
  l'acces des crawlers de recherche** (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) — deja autorises
  dans `src/app/robots.ts`. Ne jamais bloquer un *search bot* en croyant bloquer un *training bot*.
- `[OBSERVE]` **Core updates 2026** : la « preuve » est recompensee (donnees proprietaires, methodologie
  explicite, sources tangibles) ; les contenus qui compilent du public sans matiere originale reculent.
  -> Action : chaque nouveau contenu doit contenir au moins un element non copiable (donnee client anonymisee,
  mesure faite par nous, capture d'un test).
- `[OBSERVE]` **Fenetre France/UE** : le deploiement massif de certaines features IA de Google est ralenti en
  France pour raisons reglementaires (droits voisins). -> Action : c'est notre fenetre pour installer l'entite
  avant que la SERP locale ne se referme.

---

## FICHIERS CLES

| Fichier | Role |
|---------|------|
| `src/lib/articles/local-city-data.ts` | Donnees 50 villes (economie, secteurs, zones, caseStudy, FAQ, refonte) |
| `src/lib/articles/metier-data.ts` | Donnees 154 metiers |
| `scripts/generate-local-pages.ts` | Generateur pages locales V2.5 (300 pages, intent-driven) |
| `scripts/generate-metier-pages.ts` | Generateur pages metier (128 pages) |
| `scripts/generate-missing-images.ts` | Generateur images DALL-E 3 |
| `scripts/inject-refonte-data.ts` | Injection batch donnees refonte |
| `src/lib/articles/silo-pages-locales.ts` | Pages locales generees (4 674 KB) |
| `src/lib/articles/silo-creation-metier.ts` | Pages metier generees |
| `src/lib/sitemap-data.ts` | Configuration sitemap |
| `src/lib/url-helpers.ts` | Helpers URL (trailing slash, canonical) |
| `next.config.ts` | Config Next.js (trailingSlash, redirects) |
| `src/app/robots.ts` | Configuration robots.txt |
| `docs/seo/editorial-strategy-clickzou.md` | Strategie editoriale detaillee (silos, backlinks, parasite SEO, calendrier) |
| `docs/seo/seo-audit-playbook-clickzou.md` | Procedure d'audit SEO (19 sections) |
| `docs/seo/image-generation-guidelines.md` | Regles generation images DALL-E |

---

> **Ce fichier est la reference absolue.** Toute action SEO, toute creation de contenu, toute modification du generateur doit etre coherente avec ce document. En cas de conflit avec un autre fichier, c'est SEO_MASTER_CLICKZOU.md qui fait autorite.

---

## BLOCS MACHINE-READABLE

Les blocs YAML ci-dessous sont parses automatiquement par `src/lib/seo/source-of-truth-parser.ts`.
Ne pas modifier le format des commentaires `# ── MACHINE-READABLE: ... ──`.

### Silos

```yaml
# ── MACHINE-READABLE: SILOS ──
silos:
  - name: creation-site
    slug_prefix: creation-site
    pillar: /agence-creation-site-internet/
    priority: 95
    min_articles: 10
    ideal_articles: 20
    description: Creation de sites internet, technologies, process

  - name: refonte
    slug_prefix: refonte
    pillar: /agence-refonte-site-internet/
    priority: 85
    min_articles: 8
    ideal_articles: 15
    description: Refonte, migration, modernisation de sites

  - name: seo
    slug_prefix: seo
    pillar: /optimisation-seo-site-web/
    priority: 90
    min_articles: 12
    ideal_articles: 25
    description: Referencement naturel, technique, strategie SEO

  - name: sea
    slug_prefix: sea
    pillar: /agence-referencement-payant-sea/
    priority: 70
    min_articles: 5
    ideal_articles: 10
    description: Google Ads, publicite en ligne, ROI ads

  - name: local
    slug_prefix: local
    pillar: /referencement-google-my-business/
    priority: 80
    min_articles: 6
    ideal_articles: 12
    description: SEO local, Google Business Profile, visibilite locale

  - name: agence
    slug_prefix: agence
    pillar: /agence-web-toulouse/
    priority: 60
    min_articles: 4
    ideal_articles: 8
    description: L'agence Clickzou, equipe, methode, valeurs

  - name: outils
    slug_prefix: outils
    pillar: /outils-seo/
    priority: 50
    min_articles: 3
    ideal_articles: 6
    description: Outils SEO, guides techniques, tutoriels
```

### Business Pages

```yaml
# ── MACHINE-READABLE: BUSINESS PAGES ──
business_pages:
  - slug: /creation-site-internet-toulouse/
    priority: 98
    type: local_flagship
    target: conversion
    silo: creation-site
    support_articles_needed: true
    min_backlinks: 15

  - slug: /agence-creation-site-internet/
    priority: 95
    type: pillar
    target: authority
    silo: creation-site
    support_articles_needed: true
    min_backlinks: 20

  - slug: /optimisation-seo-site-web/
    priority: 92
    type: pillar
    target: authority
    silo: seo
    support_articles_needed: true
    min_backlinks: 18

  - slug: /agence-refonte-site-internet/
    priority: 85
    type: pillar
    target: authority
    silo: refonte
    support_articles_needed: true
    min_backlinks: 12

  - slug: /agence-referencement-payant-sea/
    priority: 75
    type: pillar
    target: authority
    silo: sea
    support_articles_needed: true
    min_backlinks: 8

  - slug: /referencement-google-my-business/
    priority: 80
    type: pillar
    target: authority
    silo: local
    support_articles_needed: true
    min_backlinks: 10

  - slug: /tarifs-site-internet/
    priority: 88
    type: conversion
    target: conversion
    silo: creation-site
    support_articles_needed: false
    min_backlinks: 5
```

### Article Rules

```yaml
# ── MACHINE-READABLE: ARTICLE RULES ──
article_rules:
  support_top3:
    enabled: true
    max_articles_per_page: 3
    reason_code: ARTICLE_SUPPORT_TOP3_PAGE
    description: Creer des articles qui renforcent le maillage vers les pages top 3

  silo_expansion:
    enabled: true
    min_cluster_size: 5
    reason_code: ARTICLE_SILO_EXPANSION
    description: Si un silo a moins de min_cluster_size articles, le renforcer en priorite

  internal_link_support:
    enabled: true
    reason_code: ARTICLE_INTERNAL_LINK_SUPPORT
    description: Creer des articles qui servent de relais pour le maillage interne

  topical_authority:
    enabled: true
    reason_code: ARTICLE_TOPICAL_AUTHORITY
    description: Creer des articles de fond pour renforcer l'expertise sur un silo

  anti_cannibalization:
    enabled: true
    reason_code: ARTICLE_ANTI_CANNIBALIZATION
    description: Verifier qu'un nouvel article ne concurrence pas une page existante
    rules:
      - "Chaque article a une intention de recherche unique"
      - "Pas de doublon de title ou de H1"
      - "Pas 2 articles ciblant le meme mot-cle principal"
      - "Verifier via grep dans le codebase avant creation"
```

### Linking Rules

```yaml
# ── MACHINE-READABLE: LINKING RULES ──
linking_rules:
  min_internal_links_per_page: 3
  max_links_to_same_page: 2
  intra_silo_ratio: 0.70
  cross_silo_ratio: 0.30
  trailing_slash_mandatory: true
  no_links_to_noindex: true
  local_vertical: "Chaque page locale lie vers les 5 autres types de la meme ville"
  local_horizontal: "Liens vers nearbyCities"
  metier_vertical: "Chaque page metier lie vers le hub et 3 metiers du meme secteur"
  article_to_pillar: "Chaque article lie vers sa page pilier"
  article_cross_link: "1-2 liens vers articles du meme silo"
  pillar_pages:
    - /agence-creation-site-internet/
    - /optimisation-seo-site-web/
    - /agence-referencement-payant-sea/
    - /agence-refonte-site-internet/
    - /referencement-google-my-business/
```

### Netlinking

```yaml
# ── MACHINE-READABLE: NETLINKING ──
netlinking:
  monthly_budget_cap: 2000
  weekly_budget_cap: 500
  max_pipeline_runs_per_day: 3
  # Calcul d'autorite (2026-07-17) : RESOUDRE les 301 + EXCLURE les 21 domaines
  # clients (footers "site cree par Clickzou"). Chiffres = domaines uniques hors clients.
  authority_rules:
    resolve_redirects: true
    exclude_client_domains: true
    metric: unique_referring_domains
  # Priorites backlinks editoriaux au 2026-07-17 (manque = cible - autorite hors clients)
  target_priorities:
    - { slug: /agence-web-toulouse/, authority: 0, target: 10, priority: 1, anchor: "agence web Toulouse" }
    - { slug: /agence-refonte-site-internet-toulouse/, authority: 3, target: 10, priority: 1, anchor: "refonte site internet Toulouse" }
    - { slug: /optimisation-seo-site-web-toulouse/, authority: 4, target: 10, priority: 2, anchor: "agence SEO Toulouse" }
    - { slug: /agence-referencement-payant-sea-toulouse/, authority: 3, target: 8, priority: 2, anchor: "agence Google Ads Toulouse" }
    - { slug: /agence-creation-site-internet-toulouse/, authority: 9, target: 12, priority: 3, anchor: "creation site internet Toulouse" }
    - { slug: /agence-e-commerce-toulouse/, authority: 2, target: 5, priority: 3, anchor: "site e-commerce Toulouse" }
    - { slug: /tarifs-site-internet-toulouse/, authority: 5, target: 5, priority: 0, anchor: "maintenir (cible atteinte)" }
  strategies:
    aggressive:
      label: Offensive
      backlinks_per_month: 6
      exact_match_ratio: 0.30
    balanced:
      label: Equilibree
      backlinks_per_month: 3
      exact_match_ratio: 0.20
    defensive:
      label: Maintenance
      backlinks_per_month: 2
      exact_match_ratio: 0.15
    kill:
      label: Arret
      backlinks_per_month: 0
      exact_match_ratio: 0
```

### Portefeuille backlinks acquis (off-site)

> **Source de verite LIVE** : table Supabase `backlink_purchases` + dashboard `/dashboard/seo/netlinking/purchases` (positions SerpAPI + verdict winner/stale par lien). Le snapshot ci-dessous est date — pour l'analyse statistique a jour, requeter la base. **Regle** : a chaque nouvel achat/publication, renseigner le `live_url` (l'article partenaire) — il promeut auto le lien en `live` ; cette section est mise a jour a chaque audit netlinking.

**Snapshot 2026-06-13** — 17 backlinks, plateforme eReferer, budget engage 1 520,90 € (moy. 89 €/lien). Statuts : 15 `live`, 2 `ordered`.

Par page cible (URL Clickzou ← article partenaire | ancre [type]) :

| Page cible Clickzou | Liens | Articles partenaires & ancres |
|---------------------|-------|-------------------------------|
| `/prix-site-internet-toulouse/` | 4 | menow.fr « en savoir plus » [generic] · learnyclub.com « Clickzou » [brand] · pointblog.com « Clickzou » [brand] · clubformationdigital.fr « Clickzou » [brand] |
| `/agence-seo-toulouse/` | 2 | networkedblogs.com « Clickzou » [brand] · formezvousrapidement.fr « agence-seo-toulouse » [exact] |
| `/creation-site-internet-vitrine-toulouse/` | 2 | site-internet-qualite.fr « en savoir plus » [generic] · zoneformationbusiness.fr « agence web a Toulouse » [partial] |
| `/agence-creation-site-internet-toulouse/` | 1 | upsidecom.fr (ancre URL nue) [url] |
| `/agence-refonte-site-internet-toulouse/` | 1 | scienceline.net « agence web a Toulouse » [partial] |
| `/refonte-site-internet-toulouse/` | 1 | formanovadigital.fr « Clickzou » [brand] |
| `/agence-referencement-payant-sea-toulouse/` | 1 | yesweblog.fr (ancre URL nue) [url] |
| `/google-ads-agence-toulouse/` | 1 | lespenseesdigitales.fr « agence web a Toulouse » [partial] |
| `/optimisation-seo-site-web-toulouse/` | 1 | pepseo.fr « Clickzou » [brand] |
| `/tarifs-site-internet-toulouse/` | 1 | webcible.com « Clickzou » [brand] |
| `/agence-e-commerce/` | 1 | formationfacile.com « Clickzou » [brand] (page nationale, pas -toulouse) |
| `/creation-site-internet-vitrine-lyon/` | 1 | wks.fr « Clickzou » [brand] (hors priorite Toulouse) |

**Distribution des ancres** (anti-Penguin) : brand 9 (53 %), partial 3 (18 %), url 2 (12 %), generic 2 (12 %), exact 1 (6 %). Profil sain — dominante brand, exact-match tres bas (< 10 %, sous le cap `balanced` de 20 %). **A surveiller** : ne pas multiplier les ancres exactes/partielles « agence web a Toulouse » sur des pages differentes (risque de signal sur-optimise sur cette expression).

**Lectures strategiques** (a recroiser avec le brain SerpAPI dashboard) :
- Concentration max sur `/prix-site-internet-toulouse/` (4 liens) — proche du cap haut ; verifier le verdict winner/stale avant d'en racheter.
- 2 liens sortent de la priorite locale Toulouse : `agence-e-commerce` (national) et `creation-site-internet-vitrine-lyon` (autre ville). Acceptables pour la diversite, mais le budget netlinking doit rester pondere vers les pages -toulouse (cf. priorite n°1 locale).
- Plusieurs pages piliers Toulouse n'ont encore aucun backlink : prioriser les prochaines acquisitions vers les pages tier 1 sans lien et celles « hors top 10 SerpAPI » remontees par le brain.
- **GEO/LLM** : ces backlinks editoriaux (articles thematiques web/SEO Toulouse) renforcent aussi la probabilite de citation par les LLM — privilegier des articles partenaires riches et contextualises plutot que des liens d'annuaire.

### Prioritization

```yaml
# ── MACHINE-READABLE: PRIORITIZATION ──
prioritization:
  tiers:
    - tier: 1
      label: "Pages piliers + flagship local"
      priority_range: [90, 100]
      action: "Budget max, netlinking agressif, articles support"
    - tier: 2
      label: "Pages locales top villes + articles strategiques"
      priority_range: [70, 89]
      action: "Budget modere, netlinking equilibre"
    - tier: 3
      label: "Pages metier + articles secondaires"
      priority_range: [40, 69]
      action: "Budget minimal, maintenance"
    - tier: 4
      label: "Pages faibles, long-tail pur"
      priority_range: [0, 39]
      action: "Evaluation kill ou abandon"
```

### Engine Reason Codes

```yaml
# ── MACHINE-READABLE: ENGINE REASON CODES ──
engine_reason_codes:
  WEEKLY_HIGH_MOMENTUM: "Page en forte progression — pousser"
  WEEKLY_STABLE_PERFORMER: "Page stable et performante — maintenir"
  WEEKLY_DECLINING_PERFORMANCE: "Page en baisse — reduire"
  WEEKLY_LOW_ROI: "ROI faible — envisager arret"
  WEEKLY_NO_TRACTION: "Aucune traction — stopper"
  MONTHLY_HIGH_ROI_SCALER: "Fort ROI — scaler"
  MONTHLY_STABLE_PROTECT: "Stable et rentable — proteger"
  MONTHLY_BUDGET_REDUCE: "Budget disproportionne — reduire"
  MONTHLY_LOW_ROI_STOP: "ROI trop faible — stopper"
  ARTICLE_SUPPORT_TOP3_PAGE: "Article support pour page top 3"
  ARTICLE_SILO_EXPANSION: "Expansion silo faible"
  ARTICLE_INTERNAL_LINK_SUPPORT: "Support maillage interne"
  ARTICLE_TOPICAL_AUTHORITY: "Renforcement autorite topique"
  ARTICLE_ANTI_CANNIBALIZATION: "Verification anti-cannibalisation"
  ANTI_CANNIBALIZATION_CHECK: "Verification anti-cannibalisation obligatoire"
```
