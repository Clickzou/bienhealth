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
   * En-têtes de sécurité (audit du 29/08/2026, § 1). Aucun n'était posé : le
   * site pouvait notamment être chargé dans une iframe tierce, ce qui ouvre la
   * porte au clickjacking sur l'espace compte et le panier.
   *
   * `Content-Security-Policy` n'est volontairement PAS ici : le site charge GA,
   * le pixel Meta, Loox et des images Shopify, et une CSP trop stricte les
   * couperait en silence. Elle se déploie en `-Report-Only`, s'observe une
   * semaine, puis se durcit — chantier à part entière.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // `includeSubDomains` couvre les futurs sous-domaines (shop.bien.health).
          // À ne garder que si TOUS servent bien du HTTPS.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
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
