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
  async redirects() {
    return [
      // Ancien slug hérité du template Shopify : « accessories » désignait en
      // réalité toute la gamme. Une seule URL boutique désormais : /[lang]/boutique.
      { source: "/:lang(fr|en)/collections/accessories", destination: "/:lang/boutique", permanent: true },
      { source: "/collections/accessories", destination: "/fr/boutique", permanent: true },
    ];
  },
};

export default nextConfig;
