/**
 * Maillage article → collection → fiches produit.
 *
 * Audit du 22/09/2026 : chaque article ne liait qu'une ou deux fiches, et les
 * collections gummies, poudres et packs ne recevaient que deux liens depuis le
 * contenu. Un article renvoie désormais, en fin de lecture, vers la collection
 * qui répond à son sujet et vers les produits qu'elle met en avant.
 */
export type ArticleLinks = { collection: string; products: { handle: string; name: string }[] };

const P = {
  calm: { handle: "calm", name: "CALM" },
  focus: { handle: "focus", name: "FOCUS" },
  power: { handle: "power", name: "POWER" },
  mushglow: { handle: "mushglow", name: "MUSHGLOW" },
  flow: { handle: "flow", name: "FLOW" },
  boost: { handle: "boost", name: "BOOST" },
  balance: { handle: "balance", name: "BALANCE" },
};

const BY_CATEGORY: Record<string, ArticleLinks> = {
  "Sommeil & stress": { collection: "serenite", products: [P.calm, P.balance] },
  Concentration: { collection: "concentration", products: [P.focus, P.flow] },
  "Énergie & performance": { collection: "performance-et-vitalite", products: [P.power, P.boost] },
  "Beauté & bien-être": { collection: "beaute-et-bien-etre", products: [P.mushglow, P.balance] },
  "Ingrédients & science": { collection: "gummies", products: [P.calm, P.focus, P.power] },
};

/** Articles dont le sujet appelle une autre collection que celle de leur catégorie. */
const BY_SLUG: Record<string, ArticleLinks> = {
  "cafe-champignons-mushroom-coffee": { collection: "nos-poudres", products: [P.mushglow] },
  "lions-mane": { collection: "concentration", products: [P.focus, P.mushglow] },
  ashwagandha: { collection: "serenite", products: [P.calm] },
  "reishi-cordyceps-chaga": { collection: "gummies", products: [P.calm, P.power, P.mushglow] },
};

/** Catégorie en français : les versions anglaises partagent le slug, pas la catégorie. */
export function articleLinks(slug: string, frCategory: string): ArticleLinks | null {
  return BY_SLUG[slug] ?? BY_CATEGORY[frCategory] ?? null;
}
