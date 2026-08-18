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
    fr: "Sérénité & sommeil : apaise le stress et favorise un sommeil réparateur.",
    en: "Calm & sleep: soothes stress and promotes restorative sleep.",
  },
  FOCUS: {
    fr: "Concentration & mémoire : clarté mentale et focus durable.",
    en: "Focus & memory: mental clarity and lasting concentration.",
  },
  POWER: {
    fr: "Énergie & performance : tonus physique et endurance durables.",
    en: "Energy & performance: lasting physical vitality and stamina.",
  },
  MUSHGLOW: {
    fr: "Beauté & éclat : peau, cheveux et vitalité, 6-en-1.",
    en: "Beauty & glow: skin, hair and vitality, 6-in-1.",
  },
};

export function benefitFor(name: string, fallback: string, lang = "fr"): string {
  const key = Object.keys(BENEFITS).find((k) => name.toUpperCase().includes(k));
  return key ? BENEFITS[key][lang === "en" ? "en" : "fr"] : fallback;
}

/** Produits portant le badge « Best-seller » (carrousel accueil, boutique,
 *  collections). Source unique : le badge doit dire la même chose partout. */
export const BEST_SELLERS = ["MUSHGLOW", "CALM"];

/* --- Type de produit --- */
export type ProductType = "gummies" | "poudres" | "accessoires";

/**
 * Accessoires connus, par handle. Ce garde-fou reste là pour le mousseur, qui
 * ne porte aucun tag dans Shopify — mais **la bonne façon de déclarer un
 * nouvel accessoire est de lui poser le tag « Accessories » dans l'admin**,
 * sinon il sera pris pour un complément.
 */
export const ACCESSOIRES = new Set(["mousseur-a-lait", "bien-totebag"]);
const ACCESSORY_TAGS = ["accessories", "accessoires", "accessoire", "accessory"];

/** Noms de la gamme. Un pack en cite un ou plusieurs dans son titre. */
const GUMMY_NAMES = ["CALM", "FOCUS", "POWER"];
const POWDER_NAMES = ["MUSHGLOW"];

type Classifiable = { handle: string; title: string; tags?: string[] };

const named = (p: Classifiable, names: string[]) =>
  names.some((k) => p.title.toUpperCase().includes(k));

export function isAccessory(p: Classifiable): boolean {
  return (
    ACCESSOIRES.has(p.handle) ||
    (p.tags ?? []).some((t) => ACCESSORY_TAGS.includes(t.trim().toLowerCase()))
  );
}

/**
 * Contient au moins un gummy (ou une poudre) : un pack « CALM + MUSHGLOW »
 * appartient donc aux deux familles, comme le veut le client. Un produit qui
 * ne cite aucun nom de la gamme n'apparaît dans aucune des deux plutôt que de
 * tomber par défaut dans les gummies.
 */
export const hasGummies = (p: Classifiable) => !isAccessory(p) && named(p, GUMMY_NAMES);
export const hasPowder = (p: Classifiable) => !isAccessory(p) && named(p, POWDER_NAMES);

/** Famille principale d'un produit (badge, tri, libellés). */
export function typeOf(p: Classifiable): ProductType {
  if (isAccessory(p)) return "accessoires";
  if (named(p, POWDER_NAMES)) return "poudres";
  return "gummies";
}

/* --- Registre des collections (slugs SEO) --- */
export type Collection = {
  slug: string;
  eyebrow: string;
  label: string;
  desc: string;
  en: { eyebrow: string; label: string; desc: string };
  match: (p: ShopifyProduct) => boolean;
  /** Ordre d'affichage imposé (le plus pertinent d'abord). Sans lui, l'ordre
   *  était celui de Shopify, qui ne suivait pas la logique de la collection. */
  order?: string[];
};

const byName = (keys: string[]) => (p: ShopifyProduct) =>
  keys.some((k) => p.title.toUpperCase().includes(k));

/** Renvoie les champs localisés (eyebrow/label/desc) d'une collection. */
export function localizeCollection(col: Collection, lang: string) {
  return lang === "en" ? col.en : { eyebrow: col.eyebrow, label: col.label, desc: col.desc };
}

/**
 * Trie les produits selon `col.order`. Ce qui n'y figure pas est renvoyé
 * ensuite, dans l'ordre d'origine.
 */
export function sortForCollection<T extends { title: string }>(col: Collection, products: T[]): T[] {
  const order = col.order;
  if (!order) return products;
  const rank = (p: T) => {
    const i = order.findIndex((k) => p.title.toUpperCase().includes(k));
    return i === -1 ? order.length : i;
  };
  return [...products].sort((a, b) => rank(a) - rank(b));
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
    order: ["POWER", "FOCUS", "MUSHGLOW"],
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
    order: ["CALM", "MUSHGLOW"],
  },
  "concentration": {
    slug: "concentration",
    eyebrow: "Par besoin",
    label: "Concentration & Clarté mentale",
    desc: "Soutenez la mémoire, la concentration et la clarté mentale, sans nervosité ni baisse de régime.",
    en: {
      eyebrow: "By need",
      label: "Focus & Mental clarity",
      desc: "Support memory, focus and mental clarity, without jitters or dips.",
    },
    match: byName(["FOCUS", "MUSHGLOW"]),
    order: ["FOCUS", "MUSHGLOW"],
  },
  "beaute-et-bien-etre": {
    slug: "beaute-et-bien-etre",
    eyebrow: "Par besoin",
    label: "Beauté & bien-être",
    desc: "Peau, cheveux et équilibre hormonal naturel, grâce à des actifs dosés selon la science.",
    en: {
      eyebrow: "By need",
      label: "Beauty & Wellbeing",
      desc: "Skin, hair and natural hormonal balance, thanks to science-based active ingredients.",
    },
    match: byName(["MUSHGLOW", "CALM"]),
    order: ["MUSHGLOW", "CALM"],
  },
  // Par type (slugs SEO du live)
  "gummies": {
    slug: "gummies",
    eyebrow: "Par type de produit",
    label: "Gummies",
    desc: "Nos compléments naturels à mâcher : actifs dosés selon la science, sans sucre ajouté ni additifs artificiels et vegan.",
    en: {
      eyebrow: "By product type",
      label: "Gummies",
      desc: "Our natural chewable supplements: science-based dosages, no added sugar, no artificial additives and vegan.",
    },
    match: hasGummies,
  },
  "nos-poudres": {
    slug: "nos-poudres",
    eyebrow: "Par type de produit",
    label: "Poudres",
    desc: "Notre poudre 6-en-1, à intégrer à vos préparations du matin.",
    en: {
      eyebrow: "By product type",
      label: "Powders",
      desc: "Our 6-in-1 powder, to add to your morning preparations.",
    },
    match: hasPowder,
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
    match: isAccessory,
  },
};

// « Tous les produits » vit désormais sur /[lang]/boutique : l'ancienne
// collection « accessories » (nom hérité du template Shopify, mauvais pour le
// SEO et doublon de la boutique) est redirigée en 301 dans next.config.ts.
