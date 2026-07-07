/**
 * Données & helpers partagés entre la boutique (/boutique) et les
 * pages « collections » (/collections/<slug>), avec des slugs SEO calqués
 * sur bien.health/collections/*.
 *
 * ⚠️ Server-only : COLLECTIONS contient des fonctions (match) — ne pas importer
 * depuis un composant client.
 */
import type { ShopifyProduct } from "./shopify-products";

/* --- Bienfaits courts par produit --- */
export const BENEFITS: Record<string, { fr: string; en: string }> = {
  CALM: {
    fr: "Sérénité & sommeil — apaise le stress et favorise un sommeil réparateur.",
    en: "Calm & sleep — soothes stress and promotes restorative sleep.",
  },
  FOCUS: {
    fr: "Concentration & mémoire — clarté mentale et focus durable.",
    en: "Focus & memory — mental clarity and lasting concentration.",
  },
  POWER: {
    fr: "Énergie & performance — tonus physique sans coup de barre.",
    en: "Energy & performance — physical vitality without the crash.",
  },
  MUSHGLOW: {
    fr: "Beauté & éclat — peau, cheveux et vitalité, 6-en-1.",
    en: "Beauty & glow — skin, hair and vitality, 6-in-1.",
  },
};

export function benefitFor(name: string, fallback: string, lang = "fr"): string {
  const key = Object.keys(BENEFITS).find((k) => name.toUpperCase().includes(k));
  return key ? BENEFITS[key][lang === "en" ? "en" : "fr"] : fallback;
}

/* --- Type de produit --- */
export type ProductType = "gummies" | "poudres" | "accessoires";
export const ACCESSOIRES = new Set(["mousseur-a-lait", "bien-totebag"]);

export function typeOf(p: { handle: string; title: string }): ProductType {
  if (ACCESSOIRES.has(p.handle)) return "accessoires";
  if (p.title.toUpperCase().includes("MUSHGLOW")) return "poudres"; // MushGlow = poudre
  return "gummies"; // CALM, FOCUS, POWER
}

/* --- Registre des collections (slugs SEO) --- */
export type Collection = {
  slug: string;
  eyebrow: string;
  label: string;
  desc: string;
  en: { eyebrow: string; label: string; desc: string };
  match: (p: ShopifyProduct) => boolean;
};

const byName = (keys: string[]) => (p: ShopifyProduct) =>
  keys.some((k) => p.title.toUpperCase().includes(k));

/** Renvoie les champs localisés (eyebrow/label/desc) d'une collection. */
export function localizeCollection(col: Collection, lang: string) {
  return lang === "en" ? col.en : { eyebrow: col.eyebrow, label: col.label, desc: col.desc };
}

export const COLLECTIONS: Record<string, Collection> = {
  // Par besoin
  "performance-et-vitalite": {
    slug: "performance-et-vitalite",
    eyebrow: "Par besoin",
    label: "Performance & Vitalité",
    desc: "Améliorez vos performances physiques et mentales grâce à des compléments naturels adaptés à vos besoins en énergie et vitalité.",
    en: {
      eyebrow: "By need",
      label: "Performance & Vitality",
      desc: "Boost your physical and mental performance with natural supplements tailored to your energy and vitality needs.",
    },
    match: byName(["MUSHGLOW", "FOCUS", "POWER"]),
  },
  "serenite": {
    slug: "serenite",
    eyebrow: "Par besoin",
    label: "Sérénité & Sommeil",
    desc: "Apaisez le mental, relâchez les tensions et retrouvez un sommeil profond et réparateur.",
    en: {
      eyebrow: "By need",
      label: "Calm & Sleep",
      desc: "Soothe the mind, release tension and restore deep, restorative sleep.",
    },
    match: byName(["CALM", "MUSHGLOW"]),
  },
  "concentration": {
    slug: "concentration",
    eyebrow: "Par besoin",
    label: "Concentration & Clarté mentale",
    desc: "Soutenez la mémoire, la concentration et la clarté mentale, sans nervosité ni coup de barre.",
    en: {
      eyebrow: "By need",
      label: "Focus & Mental clarity",
      desc: "Support memory, focus and mental clarity — without jitters or crashes.",
    },
    match: byName(["FOCUS", "MUSHGLOW"]),
  },
  "beaute-et-bien-etre": {
    slug: "beaute-et-bien-etre",
    eyebrow: "Par besoin",
    label: "Beauté & Bien-être",
    desc: "Peau, cheveux et équilibre hormonal naturel, grâce à des actifs dosés selon la science.",
    en: {
      eyebrow: "By need",
      label: "Beauty & Wellbeing",
      desc: "Skin, hair and natural hormonal balance, thanks to science-based active ingredients.",
    },
    match: byName(["MUSHGLOW", "CALM"]),
  },
  // Par type (slugs SEO du live)
  "gummies": {
    slug: "gummies",
    eyebrow: "Par type de produit",
    label: "Gummies",
    desc: "Nos compléments naturels à mâcher — actifs dosés selon la science, sans sucre ajouté, vegan.",
    en: {
      eyebrow: "By product type",
      label: "Gummies",
      desc: "Our natural chewable supplements — science-based dosages, no added sugar, vegan.",
    },
    match: (p) => typeOf(p) === "gummies",
  },
  "nos-poudres": {
    slug: "nos-poudres",
    eyebrow: "Par type de produit",
    label: "Poudres",
    desc: "Nos mélanges en poudre tout-en-un, à intégrer à votre boisson quotidienne.",
    en: {
      eyebrow: "By product type",
      label: "Powders",
      desc: "Our all-in-one powder blends, to add to your daily drink.",
    },
    match: (p) => typeOf(p) === "poudres",
  },
  "nos-accessoires": {
    slug: "nos-accessoires",
    eyebrow: "Par type de produit",
    label: "Accessoires",
    desc: "Les accessoires BIEN pour sublimer votre rituel bien-être au quotidien.",
    en: {
      eyebrow: "By product type",
      label: "Accessories",
      desc: "BIEN accessories to elevate your everyday wellness ritual.",
    },
    match: (p) => typeOf(p) === "accessoires",
  },
  // « Tous les produits » — collection « accessories » du live (nom historique).
  "accessories": {
    slug: "accessories",
    eyebrow: "La gamme BIEN",
    label: "Tous les produits",
    desc: "Toute la gamme BIEN : gummies, poudres et accessoires. Adaptogènes et champignons fonctionnels, dosés selon la science, fabriqués en France.",
    en: {
      eyebrow: "The BIEN range",
      label: "All products",
      desc: "The full BIEN range: gummies, powders and accessories. Adaptogens and functional mushrooms, science-based dosages, made in France.",
    },
    match: () => true,
  },
};
