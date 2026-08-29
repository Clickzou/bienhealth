# Tableau de bord « SEO by Clickzou » — /seo

Outil interne de pilotage, hébergé par le site lui-même à l'adresse
**https://bien.health/seo**. Non indexé (`noindex` + `Disallow`), hors du site
multilingue, sans Analytics ni pixel — un outil de mesure qui se mesurerait
lui-même fausserait ses propres chiffres.

## Accès

Identifiant : `carla07stats`. Le mot de passe a été transmis par le client ; il
n'est **écrit nulle part dans le dépôt**, seule son empreinte scrypt figure dans
`src/lib/seo-dashboard/auth.ts`, ce qui permet de vérifier une saisie sans pouvoir
retrouver le mot de passe.

Pour changer de compte sans toucher au code, renseigner dans Vercel
`SEO_DASHBOARD_USER` et `SEO_DASHBOARD_PASSWORD` : elles prennent le dessus sur les
valeurs inscrites dans le code. Changer le mot de passe invalide automatiquement
les sessions ouvertes (la clé de signature en dérive).

La session dure 12 heures. La connexion est limitée à 8 tentatives par minute et
par adresse IP.

## Ce que le tableau de bord affiche

| Bloc | Source | Fraîcheur |
|---|---|---|
| **En ce moment** : visiteurs actifs, minute par minute, pages consultées, pays | GA4 Realtime API | 20 secondes |
| Vue d'ensemble : visiteurs, clics Google, position moyenne, CA | GA4 + Search Console + Shopify | 5 minutes |
| Audience : sessions, nouveaux visiteurs, pages vues, rebond, engagement, durée, ajouts au panier, courbe jour par jour, canaux, pays, appareils, top pages, pages d'entrée SEO | GA4 Data API | 5 minutes |
| Référencement : clics, impressions, CTR, position moyenne, courbe, **mots-clés avec évolution de position**, pages qui rapportent des clics | Search Console | 5 minutes |
| Ventes : commandes, chiffre d'affaires, panier moyen, articles, courbe, top produits | Shopify Admin API | 5 minutes |

Périodes : 7 jours, 28 jours, 3 mois, 12 mois. Chaque chiffre est comparé à la
période précédente de même durée. Le tableau des mots-clés se filtre, se trie et
s'exporte en CSV.

La veille sert de dernier jour : GA4 ne consolide pas la journée en cours et Search
Console a deux à trois jours de retard. Un tableau de bord qui inclut aujourd'hui
affiche une chute de trafic qui n'existe pas.

## Branchement des sources

Tant qu'une source n'est pas connectée, son bloc affiche sa procédure de
branchement — jamais de chiffres de démonstration.

### 1. Google Analytics 4 + Search Console (un seul compte de service pour les deux)

1. Sur [console.cloud.google.com](https://console.cloud.google.com), créer un projet,
   puis activer **Google Analytics Data API** et **Google Search Console API**.
2. IAM & Admin → Comptes de service → créer un compte, lui ajouter une **clé JSON**,
   télécharger le fichier.
3. Dans **GA4** → Admin → Gestion des accès à la propriété : ajouter l'adresse
   `…@….iam.gserviceaccount.com` avec le rôle **Lecteur**.
4. Dans **Search Console** → Paramètres → Utilisateurs et autorisations : ajouter la
   même adresse en autorisation **Complète**.
5. Dans Vercel, renseigner :
   - `GOOGLE_SERVICE_ACCOUNT_JSON` — le contenu du fichier JSON encodé en base64
     (`base64 -w0 cle.json`, ou `certutil -encode` sous Windows) ;
   - `GA4_PROPERTY_ID` — l'identifiant **numérique** de la propriété
     (Admin → Détails de la propriété). Ce n'est pas le `G-GQFWQF5085`, qui
     identifie le flux de données ;
   - `GSC_SITE_URL` seulement si la propriété validée n'est pas la propriété de
     domaine (par défaut : `sc-domain:bien.health`).
6. Redéployer.

### 2. Ventes Shopify

1. Admin Shopify → Paramètres → **Applications et canaux de vente** → Développer des
   applications → Créer une application.
2. Onglet Configuration → Admin API : cocher le scope **`read_orders`**.
3. Installer l'application, copier le jeton `shpat_…`.
4. Le renseigner dans Vercel sous `SHOPIFY_ADMIN_API_TOKEN`, puis redéployer.

Ce jeton est **différent** du jeton Storefront déjà en place : celui-ci lit le
catalogue, celui-là lit les commandes.

## Architecture

```
src/app/seo/
├── layout.tsx        racine autonome (pas d'en-tête site, pas de mesure)
├── page.tsx          composition des blocs, lecture des trois sources en parallèle
├── login-form.tsx    écran de connexion (client)
├── realtime.tsx      bandeau temps réel + rafraîchissement automatique (client)
├── keyword-table.tsx tableau des mots-clés : filtre, tri, export CSV (client)
└── ui.tsx            cartes, KPI, courbes SVG, tableaux

src/lib/seo-dashboard/
├── auth.ts           identifiants, session signée
├── google.ts         jeton OAuth d'un compte de service (JWT RS256, sans dépendance)
├── ga4.ts            rapports Analytics (lots) + rapport temps réel
├── gsc.ts            Search Analytics + positions comparées
├── shopify-sales.ts  commandes, CA, top produits
└── periods.ts        périodes et comparaisons (Europe/Paris)

src/app/api/seo/       login · logout · realtime
```

## Limites connues

- Les commandes sont plafonnées à 1 000 par période : au-delà, le tableau le signale
  plutôt que d'afficher un total faux.
- La limitation de débit de la connexion vit en mémoire : elle ne survit pas à un
  redémarrage d'instance et n'est pas partagée entre régions.
- Le rapport temps réel de GA4 couvre 30 minutes glissantes, c'est une limite de
  l'API et non du tableau de bord.
- Search Console limite l'export à 100 mots-clés par requête ici ; suffisant à ce
  stade du site, à augmenter quand le volume grandira.
