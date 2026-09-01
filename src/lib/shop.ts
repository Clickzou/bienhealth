/**
 * Données & helpers partagés entre la boutique (/boutique) et les
 * pages « collections » (/collections/<slug>), avec des slugs SEO calqués
 * sur bien.health/collections/*.
 *
 * ⚠️ Server-only : COLLECTIONS contient des fonctions (match) — ne pas importer
 * depuis un composant client.
 */
import type { ShopifyProduct } from "./shopify-products";
import { splitProductTitle } from "./product-title";

/* --- Bienfaits courts par produit --- */

const BENEFITS: Record<string, { fr: string; en: string }> = {
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
  // Les packs n'avaient pas de bénéfice : la carte produit retombait alors sur
  // le premier tag Shopify, et BOOST s'annonçait « badge_-20% ».
  BOOST: {
    fr: "Clarté mentale & énergie physique : FOCUS et POWER en synergie.",
    en: "Mental clarity & physical energy: FOCUS and POWER in synergy.",
  },
  FLOW: {
    fr: "Concentration calme : FOCUS le matin, CALM le soir.",
    en: "Calm focus: FOCUS in the morning, CALM in the evening.",
  },
  BALANCE: {
    fr: "Rituel du soir : CALM pour le sommeil, MUSHGLOW pour l'éclat.",
    en: "Evening ritual: CALM for sleep, MUSHGLOW for glow.",
  },
  RESET: {
    fr: "La routine complète : FOCUS, POWER et CALM.",
    en: "The complete routine: FOCUS, POWER and CALM.",
  },
};

/**
 * Complément de titre SEO par produit.
 *
 * « CALM » ou « FOCUS » ne sont pas des mots-clés : personne ne les cherche.
 * Un <title> de 18 caractères gaspille le principal levier on-page, d'où ce
 * descripteur accolé au nom de gamme (audit SEO du 29/08/2026, § 3.2).
 */
const SEO_SUFFIX: Record<string, { fr: string; en: string }> = {
  CALM: { fr: "Gummies sérénité & sommeil", en: "Calm & sleep gummies" },
  FOCUS: { fr: "Gummies concentration & mémoire", en: "Focus & memory gummies" },
  POWER: { fr: "Gummies énergie & performance", en: "Energy & performance gummies" },
  MUSHGLOW: { fr: "Supermix beauté & collagène", en: "Beauty & collagen supermix" },
  MOUSSEUR: { fr: "Mousseur à lait rechargeable", en: "Rechargeable milk frother" },
  TOTEBAG: { fr: "Tote bag coton bio", en: "Organic cotton tote bag" },
};

/**
 * Titre de page d'une fiche produit : nom de gamme + bénéfice + marque.
 *
 * Borné à 60 caractères, la limite au-delà de laquelle Google et Bing tronquent.
 * Le cas qui l'impose : « MUSHGLOW - Supermix 6-en-1 » porte déjà son descripteur
 * dans son nom Shopify, et l'ajout du suffixe faisait 70 caractères — signalé par
 * Bing le 29/08/2026. Quand ça ne tient pas, on garde le nom et la marque : le
 * nom du produit prime toujours sur le bénéfice ajouté.
 */
/**
 * Meta description anglaise des produits sans contenu éditorial traduit.
 *
 * Les fiches CALM, FOCUS, POWER et MUSHGLOW ont leur version anglaise dans
 * PRODUCT_SEO. Les six autres — les packs et les accessoires — retombaient sur
 * la description Shopify, rédigée en français : /fr et /en servaient donc la
 * même meta description, ce que Bing a signalé le 29/08/2026.
 *
 * Volontairement sobre : on ne nomme la composition d'un pack que là où la fiche
 * française la nomme elle-même, pour ne rien affirmer d'invérifiable.
 */
const EN_META: Record<string, string> = {
  boost:
    "BOOST: mental clarity and physical energy in one adaptogenic routine — no caffeine, no jitters, no crash. Sugar-free, vegan, made in France.",
  flow:
    "FLOW: calm concentration for busy minds that need to move forward without being overwhelmed. Adaptogenic supplements, sugar-free and made in France.",
  balance:
    "BALANCE pairs CALM and MUSHGLOW: an evening ritual to slow down, breathe and glow. Adaptogenic supplements, sugar-free, vegan and made in France.",
  reset:
    "RESET: the complete adaptogenic routine to restore your mental, physical and emotional balance. Sugar-free, vegan supplements made in France.",
  "mousseur-a-lait":
    "The BIEN frother blends our wellbeing powders smoothly into coffee, milk or plant-based drinks. The essential tool for your daily adaptogenic ritual.",
  "bien-totebag":
    "The BIEN tote bag: a generous format, long comfortable handles and a quality finish. An everyday basic designed to keep up with your pace.",
};

/** Meta description anglaise d'un produit, si une version dédiée existe. */
export function productMetaEn(handle: string): string | null {
  return EN_META[handle] ?? null;
}
export function productPageTitle(name: string, lang = "fr"): string {
  const key = Object.keys(SEO_SUFFIX).find((k) => name.toUpperCase().includes(k));
  const suffix = key ? SEO_SUFFIX[key][lang === "en" ? "en" : "fr"] : "";
  if (!suffix) return `${name} | BIEN health`;

  const withSuffix = `${name} — ${suffix} | BIEN health`;
  if (withSuffix.length <= 60) return withSuffix;

  // Trop long : le nom Shopify porte déjà son propre descriptif — et celui-ci
  // est en français. Le garder tel quel donnait « MUSHGLOW - Supermix 6-en-1 »
  // en anglais comme en français. On remplace donc ce descriptif par celui de
  // la langue demandée, ce qui traduit le titre et le raccourcit du même coup.
  const { main } = splitProductTitle(name);
  const replaced = `${main} — ${suffix} | BIEN health`;
  return replaced.length <= 60 ? replaced : `${main} | BIEN health`;
}

export function benefitFor(name: string, fallback: string, lang = "fr"): string {
  const key = Object.keys(BENEFITS).find((k) => name.toUpperCase().includes(k));
  return key ? BENEFITS[key][lang === "en" ? "en" : "fr"] : fallback;
}

/** Produits portant le badge « Best-seller » (carrousel accueil, boutique,
 *  collections). Source unique : le badge doit dire la même chose partout. */
export const BEST_SELLERS = ["MUSHGLOW", "CALM"];

/* --- Type de produit --- */
export type ProductType = "gummies" | "poudres" | "packs" | "accessoires";

/**
 * Accessoires connus, par handle. Ce garde-fou reste là pour le mousseur, qui
 * ne porte aucun tag dans Shopify — mais **la bonne façon de déclarer un
 * nouvel accessoire est de lui poser le tag « Accessories » dans l'admin**,
 * sinon il sera pris pour un complément.
 */
export const ACCESSOIRES = new Set(["mousseur-a-lait", "bien-totebag"]);
const ACCESSORY_TAGS = ["accessories", "accessoires", "accessoire", "accessory"];

/** Noms de la gamme. */
const GUMMY_NAMES = ["CALM", "FOCUS", "POWER"];
const POWDER_NAMES = ["MUSHGLOW"];

/**
 * Composition des packs, par handle.
 *
 * Les packs s'appellent BOOST, FLOW, BALANCE et RESET : leur titre ne cite
 * aucun produit de la gamme. Un filtrage sur le seul titre les faisait donc
 * disparaître de toutes les collections — ni gummies, ni poudres, ni « par
 * besoin » — et ils n'étaient visibles que sur /boutique (retour client du
 * 01/09/2026). Cette table rattache chaque pack à ce qu'il contient
 * réellement, d'après sa fiche Shopify.
 */
export const PACKS: Record<string, string[]> = {
  boost: ["FOCUS", "POWER"],
  flow: ["FOCUS", "CALM"],
  balance: ["CALM", "MUSHGLOW"],
  reset: ["FOCUS", "POWER", "CALM"],
};

export const isPack = (p: Classifiable) => p.handle in PACKS;

/** Ce que contient un produit : son propre nom, ou le contenu du pack. */
const contents = (p: Classifiable): string[] =>
  PACKS[p.handle] ?? [p.title.toUpperCase()];

/** Le produit contient-il au moins un des noms demandés (pack compris) ? */
export const includesAny = (p: Classifiable, names: string[]) =>
  contents(p).some((c) => names.some((k) => c.includes(k)));

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
export const hasGummies = (p: Classifiable) => !isAccessory(p) && includesAny(p, GUMMY_NAMES);
export const hasPowder = (p: Classifiable) => !isAccessory(p) && includesAny(p, POWDER_NAMES);

/** Famille principale d'un produit (badge, tri, libellés). */
export function typeOf(p: Classifiable): ProductType {
  if (isAccessory(p)) return "accessoires";
  if (isPack(p)) return "packs";
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
  /** Titre de page, quand le libellé seul est trop court pour le référencement
   *  (« Gummies | BIEN health » ne cible aucune requête). */
  seoTitle?: string;
  match: (p: ShopifyProduct) => boolean;
  /** Ordre d'affichage imposé (le plus pertinent d'abord). Sans lui, l'ordre
   *  était celui de Shopify, qui ne suivait pas la logique de la collection. */
  order?: string[];
};

/**
 * Filtre d'une collection : le produit lui-même, ou un pack qui le contient.
 * Sans cela, BALANCE (CALM + MUSHGLOW) n'apparaissait ni dans « Sérénité »
 * ni dans « Beauté », alors qu'il répond aux deux besoins.
 */
const byName = (keys: string[]) => (p: ShopifyProduct) => includesAny(p, keys);

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
    order: ["POWER", "FOCUS", "MUSHGLOW", "BOOST", "RESET", "FLOW", "BALANCE"],
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
    order: ["CALM", "MUSHGLOW", "BALANCE", "FLOW", "RESET"],
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
    order: ["FOCUS", "MUSHGLOW", "FLOW", "BOOST", "RESET", "BALANCE"],
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
    order: ["MUSHGLOW", "CALM", "BALANCE", "FLOW", "RESET"],
  },
  // Par type (slugs SEO du live)
  "gummies": {
    slug: "gummies",
    eyebrow: "Par type de produit",
    label: "Gummies",
    seoTitle: "Gummies adaptogènes sans sucre",
    desc: "Nos compléments naturels à mâcher : actifs dosés selon la science, sans sucre ajouté ni additifs artificiels et vegan.",
    en: {
      eyebrow: "By product type",
      label: "Gummies",
      desc: "Our natural chewable supplements: science-based dosages, no added sugar, no artificial additives and vegan.",
    },
    match: hasGummies,
  },
  "packs": {
    slug: "packs",
    eyebrow: "Par type de produit",
    label: "Packs & duos",
    seoTitle: "Packs et duos de compléments adaptogènes",
    desc: "Nos formules réunies en rituels complets : deux ou trois produits qui travaillent en synergie, à prix doux.",
    en: {
      eyebrow: "By product type",
      label: "Packs & duos",
      desc: "Our formulas brought together as complete rituals: two or three products working in synergy, at a better price.",
    },
    match: isPack,
    order: ["BOOST", "FLOW", "BALANCE", "RESET"],
  },
  "nos-poudres": {
    slug: "nos-poudres",
    eyebrow: "Par type de produit",
    label: "Poudres",
    seoTitle: "Poudres de champignons adaptogènes",
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
    seoTitle: "Accessoires & mousseur à lait",
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
