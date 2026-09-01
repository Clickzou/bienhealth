import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne pas annoncer la technologie du serveur : c'est le premier renseignement
  // que cherche un scanner pour cibler des exploits connus.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.myshopify.com" },
      { protocol: "https", hostname: "bien.health" },
    ],
    // Plafonne la plus grande variante générée à 2048 px : le 3840 px par
    // défaut n'apporte rien de visible sur ce site (photos produit / lifestyle)
    // et alourdit inutilement les pages sur écrans larges.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Vignettes (cartes ingrédients, produits liés…) : petites largeurs
    // dédiées pour ne jamais servir une variante « pleine largeur ».
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
  /**
   * En-têtes de sécurité.
   *
   * La politique de contenu est calibrée sur ce que le site charge réellement,
   * inventorié le 30/08/2026 : GA4 (googletagmanager), le pixel Meta
   * (connect.facebook.net) et les images Shopify — rien d'autre. Aucune iframe,
   * aucun chat, aucune carte, et les polices sont auto-hébergées.
   *
   * Deux arbitrages assumés :
   *
   * 1. `script-src` garde `'unsafe-inline'`. Le site émet du JSON-LD sur quinze
   *    pages, avec des prix et des notes d'avis : ces blocs inline changent à
   *    chaque déploiement, les hachages SHA-256 sont donc impraticables. La
   *    solution propre serait un nonce par requête, mais elle rendrait toutes
   *    les pages dynamiques et ferait perdre le pré-rendu statique — cher payé
   *    pour un site dont aucune zone sensible n'est authentifiée. La liste
   *    blanche conserve l'essentiel : un script tiers compromis ne pourra pas
   *    charger de code depuis un domaine non autorisé.
   *
   * 2. `style-src` garde `'unsafe-inline'` : six composants utilisent
   *    `style={{…}}` pour des valeurs calculées (hauteurs de barres, couleurs
   *    de séries du tableau de bord). Les retirer demanderait de les réécrire
   *    sans bénéfice de sécurité réel.
   *
   * Déployée d'abord en **Report-Only** : les violations s'affichent dans la
   * console du navigateur sans rien casser. À basculer en
   * `Content-Security-Policy` (même valeur) après une semaine d'observation, en
   * vérifiant le tunnel d'achat, la bannière cookies, GA et le pixel.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      // googletagmanager sert gtag.js, connect.facebook.net sert fbevents.js.
      // vercel.live n'apparaît que sur les déploiements de prévisualisation.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      // Polices auto-hébergées : aucun domaine tiers.
      "font-src 'self'",
      // data: pour les aperçus floutés de next/image, blob: pour les exports.
      "img-src 'self' data: blob: https://cdn.shopify.com https://*.myshopify.com https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com https://www.google.com https://www.google.fr https://www.google.es https://www.google.be https://www.google.ch",
      // GA4 poste ses mesures sur *.google-analytics.com et les régions analytics.
      // stats.g.doubleclick.net et les pixels www.google.<tld>/ads/ga-audiences ne
      // relèvent pas de la mesure mais de Google Signals (remarketing). Ils sont
      // autorisés pour ne rien casser de l existant ; les désactiver dans GA4
      // (Admin > Paramètres des données > Google signals) rendrait ces entrées
      // inutiles et allégerait le volet publicitaire côté RGPD.
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com https://stats.g.doubleclick.net https://vercel.live",
      // Le site n'a aucune iframe ; le pixel Meta peut en insérer une.
      "frame-src https://www.facebook.com https://vercel.live",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      // Les formulaires ne postent que vers les routes API du site. Le passage au
      // checkout Shopify est une navigation par lien, pas une soumission de
      // formulaire : il n'a pas à figurer ici.
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Le filtre XSS des anciens navigateurs est obsolète et a lui-même
          // introduit des failles : la valeur 0 le désactive explicitement.
          { key: "X-XSS-Protection", value: "0" },
          /*
           * PAS de `includeSubDomains` : vérifié le 30/08/2026, cinq sous-domaines
           * ne répondent qu'en HTTP — mail, webmail, cpanel, ftp et autodiscover.
           * Posée la veille, la directive les rendait inaccessibles à tout
           * navigateur ayant visité bien.health. Ne la remettre que le jour où ces
           * hôtes serviront du HTTPS valide, et le vérifier avant.
           */
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },
  /**
   * Redirections des URL de l'ancienne boutique Shopify.
   *
   * Inventaire fait le 31/08/2026 en interrogeant l'API Storefront (collections,
   * pages, blogs) puis en testant chaque URL en production. Les collections dont
   * le handle a été repris à l'identique répondaient déjà — seules celles qui ont
   * disparu, **toutes** les pages `/pages/*`, les blogs et les URL de compte
   * tombaient en 404. Ce sont précisément les adresses que Google et Bing ont en
   * mémoire : un 404 y perd le visiteur et l'autorité accumulée.
   *
   * Toutes en 301 (`permanent`) : le contenu a bougé pour de bon, c'est ce qui
   * transfère le classement à la nouvelle adresse.
   *
   * Les destinations visent `/fr/…` sans passer par le proxy de langue : ces URL
   * venaient d'une boutique française, et un seul saut vaut mieux qu'une chaîne.
   */
  async redirects() {
    const page = (from: string, to: string) => [
      { source: `/pages/${from}`, destination: `/fr/${to}`, permanent: true },
      { source: `/:lang(fr|en)/pages/${from}`, destination: `/:lang/${to}`, permanent: true },
    ];
    const collection = (from: string, to: string) => [
      { source: `/collections/${from}`, destination: `/fr/${to}`, permanent: true },
      { source: `/:lang(fr|en)/collections/${from}`, destination: `/:lang/${to}`, permanent: true },
    ];

    return [
      // --- Pages Shopify : les neuf existantes, aucune ne répondait ---------
      ...page("contact", "contact"),
      ...page("faq-1", "faq"),
      ...page("ingredients", "ingredients"),
      ...page("diagnostic", "diagnostic"),
      ...page("presse", "presse"),
      ...page("nos-revendeurs", "revendeurs"),
      // « Trouver un magasin » : c'est la carte des points de vente, portée par
      // la page revendeurs.
      ...page("trouver-un-magasin", "revendeurs"),
      // « BEHIND BIEN » racontait la marque : c'est devenu la page Histoire.
      ...page("behind-bien", "histoire"),
      ...page("medical-terms-and-conditions", "cgv"),

      // --- Collections disparues -------------------------------------------
      // « accessories » désignait en réalité toute la gamme dans le template.
      ...collection("accessories", "boutique"),
      ...collection("all", "boutique"),
      ...collection("nos-produits", "boutique"),
      // « packs » n'est plus une collection disparue : elle existe sur le site
      // depuis le 01/09/2026 (BOOST, FLOW, BALANCE, RESET). La rediriger vers
      // la boutique renvoyait le menu « Packs & duos » sur la gamme entière.
      ...collection("easygift-all-products", "boutique"),
      // « energie » a été renommée en cours de route.
      ...collection("energie", "collections/performance-et-vitalite"),
      // La collection « frontpage » ne contenait que MUSHGLOW : la fiche produit
      // est l'équivalent le plus proche, pas la boutique entière.
      ...collection("frontpage", "products/mushglow"),

      // --- Blogs Shopify ----------------------------------------------------
      // Sept blogs existaient (news, learn, lions-mane, microdosing…), tous vides
      // côté API : impossible de faire correspondre les articles un à un. L'index
      // du blog est la destination la plus pertinente qui reste.
      { source: "/blogs/:blog", destination: "/fr/blog", permanent: true },
      { source: "/blogs/:blog/:article", destination: "/fr/blog", permanent: true },
      { source: "/:lang(fr|en)/blogs/:blog", destination: "/:lang/blog", permanent: true },
      { source: "/:lang(fr|en)/blogs/:blog/:article", destination: "/:lang/blog", permanent: true },

      // --- Espace client ----------------------------------------------------
      { source: "/account", destination: "/fr/compte", permanent: true },
      { source: "/account/:path*", destination: "/fr/compte", permanent: true },

      // --- Pages de politique générées par Shopify --------------------------
      { source: "/policies/refund-policy", destination: "/fr/retours", permanent: true },
      { source: "/policies/privacy-policy", destination: "/fr/confidentialite", permanent: true },
      { source: "/policies/terms-of-service", destination: "/fr/cgv", permanent: true },
      { source: "/policies/legal-notice", destination: "/fr/mentions-legales", permanent: true },
      { source: "/policies/shipping-policy", destination: "/fr/livraison", permanent: true },
      { source: "/policies/:path*", destination: "/fr/mentions-legales", permanent: true },
    ];
  },
};

export default nextConfig;
