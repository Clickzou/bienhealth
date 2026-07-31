import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
