/** Config SEO partagée (URL canonique, langues). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bien.health").replace(/\/$/, "");
export const LOCALES = ["fr", "en"] as const;
export const DEFAULT_LOCALE = "fr";

/** Pages statiques indexables (hors pages privées panier/compte). */
export const STATIC_PATHS = [
  "", // accueil
  "boutique",
  "avis",
  "ingredients",
  "histoire",
  "presse",
  "revendeurs",
  "devenir-revendeur",
  "diagnostic",
  "certifications",
  "blog",
  "faq",
  "confidentialite",
  "cgv",
  "mentions-legales",
  "cookies",
  "plan-du-site",
];
