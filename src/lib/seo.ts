import type { Metadata } from "next";

/** Config SEO partagée (URL canonique, langues). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bien.health").replace(/\/$/, "");
export const LOCALES = ["fr", "en"] as const;
export const DEFAULT_LOCALE = "fr";

/**
 * Le site n'est indexable que sur le domaine final et en production.
 * Sur une préprod (*.vercel.app, déploiement preview), on force `noindex` pour
 * éviter le contenu dupliqué avec bien.health — voir aussi src/app/robots.ts.
 *
 * Trois garde-fous, dans l'ordre :
 *  1. l'URL canonique doit être sur bien.health ;
 *  2. le déploiement doit être un déploiement de production (pas un preview) ;
 *  3. le domaine de production du projet ne doit pas être un *.vercel.app —
 *     c'est le cas tant que le domaine final n'est pas branché sur Vercel.
 * `NEXT_PUBLIC_ALLOW_INDEXING=false` permet de forcer le noindex à la main.
 */
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "";

export const IS_INDEXABLE =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false" &&
  /(^|\.)bien\.health$/.test(hostOf(SITE_URL)) &&
  (process.env.VERCEL_ENV ?? "production") === "production" &&
  !vercelProductionHost.endsWith(".vercel.app");

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

/** Image Open Graph par défaut : photo de la gamme (Mushglow, POWER, FOCUS,
 *  CALM) fournie par le client le 29/08/2026, recadrée en 1200x630 — le format
 *  attendu par Facebook, LinkedIn et WhatsApp. Nom de fichier porteur de sens
 *  pour le référencement des images. */
export const DEFAULT_OG_IMAGE = "/brand/bien-health-complements-champignons-adaptogenes.jpg";

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
  "contact",
  "livraison",
  "retours",
  "confidentialite",
  "cgv",
  "mentions-legales",
  "cookies",
  "plan-du-site",
];

type PageMetadataInput = {
  lang: string;
  /** Chemin sans la locale ni le slash initial. `""` pour l'accueil. */
  path: string;
  title: string;
  description: string;
  /** Visuel de partage propre à la page (chemin relatif ou URL absolue). */
  image?: string | null;
  imageAlt?: string;
  ogType?: "website" | "article";
};

/**
 * Construit les métadonnées d'une page : canonical propre, alternates fr/en et
 * balises Open Graph / Twitter spécifiques.
 *
 * À utiliser dans CHAQUE `generateMetadata` : Next fusionne les métadonnées par
 * clé de premier niveau, donc une page qui ne déclare que `title` hérite du
 * canonical et de l'Open Graph du layout — c'est ce qui faisait pointer toutes
 * les pages vers https://bien.health/fr.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  image,
  imageAlt,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const suffix = clean ? `/${clean}` : "";
  const url = `/${lang}${suffix}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `/fr${suffix}`,
        en: `/en${suffix}`,
        "x-default": `/fr${suffix}`,
      },
    },
    robots: IS_INDEXABLE
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: ogType,
      siteName: "BIEN health",
      locale: lang === "en" ? "en_US" : "fr_FR",
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Coupe une description à la limite recommandée (~160 caractères) sans casser
 * un mot, et ajoute une ellipse. Évite les meta descriptions tronquées en
 * pleine phrase.
 */
export function metaDescription(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" ! "), cut.lastIndexOf(" ? "));
  // Phrase complète si elle occupe au moins la moitié de la longueur cible.
  if (lastStop > max * 0.5) return cut.slice(0, lastStop + 1).trim();
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
}
