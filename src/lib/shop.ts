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
export const BENEFITS: Record<string, string> = {
  CALM: "Sérénité & sommeil — apaise le stress et favorise un sommeil réparateur.",
  FOCUS: "Concentration & mémoire — clarté mentale et focus durable.",
  POWER: "Énergie & performance — tonus physique sans coup de barre.",
  MUSHGLOW: "Beauté & éclat — peau, cheveux et vitalité, 6-en-1.",
};

export function benefitFor(name: string, fallback: string): string {
  const key = Object.keys(BENEFITS).find((k) => name.toUpperCase().includes(k));
  return key ? BENEFITS[key] : fallback;
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
  match: (p: ShopifyProduct) => boolean;
};

const byName = (keys: string[]) => (p: ShopifyProduct) =>
  keys.some((k) => p.title.toUpperCase().includes(k));

export const COLLECTIONS: Record<string, Collection> = {
  // Par besoin
  "performance-et-vitalite": {
    slug: "performance-et-vitalite",
    eyebrow: "Par besoin",
    label: "Performance & Vitalité",
    desc: "Améliorez vos performances physiques et mentales grâce à des compléments naturels adaptés à vos besoins en énergie et vitalité.",
    match: byName(["MUSHGLOW", "FOCUS", "POWER"]),
  },
  "serenite": {
    slug: "serenite",
    eyebrow: "Par besoin",
    label: "Sérénité & Sommeil",
    desc: "Apaisez le mental, relâchez les tensions et retrouvez un sommeil profond et réparateur.",
    match: byName(["CALM", "MUSHGLOW"]),
  },
  "concentration": {
    slug: "concentration",
    eyebrow: "Par besoin",
    label: "Concentration & Clarté mentale",
    desc: "Soutenez la mémoire, la concentration et la clarté mentale, sans nervosité ni coup de barre.",
    match: byName(["FOCUS", "MUSHGLOW"]),
  },
  "beaute-et-bien-etre": {
    slug: "beaute-et-bien-etre",
    eyebrow: "Par besoin",
    label: "Beauté & Bien-être",
    desc: "Peau, cheveux et équilibre hormonal naturel, grâce à des actifs dosés selon la science.",
    match: byName(["MUSHGLOW", "CALM"]),
  },
  // Par type (slugs SEO du live)
  "gummies": {
    slug: "gummies",
    eyebrow: "Par type de produit",
    label: "Gummies",
    desc: "Nos compléments naturels à mâcher — actifs dosés selon la science, sans sucre ajouté, vegan.",
    match: (p) => typeOf(p) === "gummies",
  },
  "nos-poudres": {
    slug: "nos-poudres",
    eyebrow: "Par type de produit",
    label: "Poudres",
    desc: "Nos mélanges en poudre tout-en-un, à intégrer à votre boisson quotidienne.",
    match: (p) => typeOf(p) === "poudres",
  },
  "nos-accessoires": {
    slug: "nos-accessoires",
    eyebrow: "Par type de produit",
    label: "Accessoires",
    desc: "Les accessoires BIEN pour sublimer votre rituel bien-être au quotidien.",
    match: (p) => typeOf(p) === "accessoires",
  },
  // « Tous les produits » — collection « accessories » du live (nom historique).
  "accessories": {
    slug: "accessories",
    eyebrow: "La gamme BIEN",
    label: "Tous les produits",
    desc: "Toute la gamme BIEN : gummies, poudres et accessoires. Adaptogènes et champignons fonctionnels, dosés selon la science, fabriqués en France.",
    match: () => true,
  },
};
