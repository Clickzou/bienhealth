# Réponse au client — flux Klaviyo qui ne partent pas, 01/10/2026

Contexte : le 01/10/2026 à 12 h 17, Carla signale sur WhatsApp que ses flux
Klaviyo (« paniers abandonnés etc., une petite dizaine ») ne s'envoient pas
alors qu'ils sont réglés dans Klaviyo.

**Diagnostic (01/10/2026)**, d'après le code et trois captures du compte Klaviyo :

- le compte compte 20 flux : **5 actifs, 15 en brouillon**. Deux séries jumelles,
  « SE - … » (10 flux, tous en brouillon, non modifiés depuis le 26/04/2025) et
  « SHOPIFY SE - … » (10 flux, dont les 5 actifs) ;
- sur 7 jours, trois flux actifs envoient : Welcome Series TYPEFORM (new) 6,
  Welcome Series Sign Up Form 2, Post Purchase 2. L'intégration Shopify ↔ Klaviyo
  fonctionne donc toujours (« Placed Order » arrive) ;
- **SHOPIFY SE - Browse Abandonment** (déclencheur « Viewed Product ») : actif,
  zéro envoi. Cause côté site : le front headless n'envoie aucun évènement de
  navigation à Klaviyo. `src/lib/klaviyo.ts` ne fait qu'inscrire des emails ;
  l'ajout au panier ne prévient que Meta et GA4 (`src/components/add-to-cart.tsx`) ;
  le panier vit en localStorage (`src/lib/cart.ts`). Sur l'ancienne boutique,
  c'est l'app Klaviyo du thème Shopify qui émettait « Viewed Product »,
  « Added to Cart » et « Active on Site » ;
- **SHOPIFY SE - Abandoned Cart** (déclencheur « Checkout Started ») : actif,
  bien construit (attente 2 h, trois e-mails en cours), zéro envoi sur 7 jours.
  **Non tranché** : panne ou simple volume (environ 6 commandes par mois). Le
  déclencheur porte des filtres de profils non relevés ;
- « SE - Abandoned Cart » part de « Started Checkout », indicateur distinct de
  « Checkout Started » (Shopify) : à vérifier avant de compter dessus ;
- la clé privée Klaviyo du projet n'a ni `flows:read` ni `metrics:read` (403) :
  l'état des flux ne se lit pas par l'API, seulement dans l'interface.

**Message envoyé à Carla (WhatsApp, 01/10/2026)** :

> Carla, j'ai regardé votre Klaviyo. Vos flux partent bien : les deux séries de
> bienvenue et le post-achat ont envoyé cette semaine. En revanche, sur vos 20
> flux, 15 sont en « Brouillon » (relance clients, demande d'avis, post-achat par
> produit, toute la série « SE - »), et un brouillon n'envoie rien. Dites-moi
> lesquels vous voulez voir partir : je vérifie qu'ils ne font pas doublon avec
> ceux déjà actifs avant de les activer.
>
> Deux points de mon côté : le flux « navigation abandonnée » ne se déclenche
> plus depuis le nouveau site, je le rebranche. Et je vérifie le panier
> abandonné, qui est actif mais n'a rien envoyé cette semaine.

**Suite de la journée (01/10/2026)**, d'après les captures suivantes :

- « Checkout Started » arrive bien depuis le nouveau site (une vingtaine sur 30
  jours) ; le déclencheur du flux est sain (réintégration après 30 jours, filtre
  « Placed Order zéro fois depuis le début du flux ») ;
- **le panier abandonné envoie** : sur 30 jours, 3 / 3 / 4 e-mails remis pour
  11 / 11 / 13 exclus. Les « Filtres supplémentaires » de chaque e-mail n'ont
  pas été relevés : à regarder, ils expliquent sans doute une partie des exclus ;
- les 15 brouillons sont à laisser tels quels : la série « SE - » est l'ancienne
  version (ses indicateurs viennent de WooCommerce), la question posée à Carla
  sur les brouillons n'avait pas lieu d'être ;
- **rebranchement fait** : `src/lib/klaviyo-onsite.ts` et
  `src/components/klaviyo-onsite.tsx` envoient « Viewed Product » et « Added to
  Cart », et identifient le visiteur à l'inscription (popup, footer,
  diagnostic), le tout après consentement. Vérifié dans klaviyo.js : le compte
  ne charge aucun module de formulaire (pas de second popup), et la file
  `_klOnsite` est vidée au format utilisé.

**Pixel Meta, vérifié le même jour avant la relance des pubs** :

- `PageView` et `ViewContent` partent bien en arrivée directe sur une fiche
  (test navigateur sur bien.health) ;
- la caisse est sur `shop.bien.health` : les cookies `_fbc` / `_fbp` du pixel,
  posés sur `.bien.health`, y sont lisibles. Seul trou mesuré : un visiteur venu
  d'une pub qui change de page avant d'accepter les cookies perdait son
  `fbclid`. Corrigé dans `src/lib/meta-pixel.ts` (`captureFbclid`, `restoreFbc`) ;
- non vérifié : que Shopify transmet `_fbc` à Meta sur `Purchase`. À confirmer
  par un achat test suivi dans Meta → Tester les évènements ;
- le site envoie le handle (« focus ») en `content_ids`, le catalogue Shopify
  des identifiants numériques : sans effet sur des campagnes de conversion,
  gênant pour des pubs catalogue.

**Preuve de bout en bout (01/10/2026, 13 h 06)** : après mise en ligne (commit
`4f452ae`), test réel avec `jc@clickzou.fr` — inscription par le pied de page,
fiche produit, ajout au panier. Le profil Klaviyo affiche « Activité sur le
site » (13 h 05), « Viewed Product » et « Added to Cart » (13 h 06). Le
rebranchement fonctionne. Non observé : la réception de l'e-mail de navigation
abandonnée (le testeur ayant ajouté au panier, un filtre du flux peut l'écarter).

**Promis au client, reste à faire** (le point 1 est fait, voir ci-dessus) :

1. rebrancher « Viewed Product » et « Added to Cart » du site vers Klaviyo,
   derrière la bannière cookies (comme GA et le pixel Meta). Limite à rappeler :
   Klaviyo ne relance que les visiteurs dont il connaît déjà l'e-mail ;
2. trancher sur le panier abandonné : Analyse → Indicateurs → « Checkout
   Started » sur 90 jours, onglet Analyses des flux sur 90 jours, filtres du
   déclencheur. Si l'indicateur est vide, test réel (panier, e-mail saisi à la
   caisse, abandon) ;
3. à sa réponse, activer les brouillons qu'elle désigne **sans doublon** entre
   les deux séries (précédent : le double mail de bienvenue du 01/09, § 23 de
   GO-LIVE.md).
