/**
 * Faits vérifiables sur la marque et la gamme, rédigés pour être cités tels
 * quels par un moteur génératif (ChatGPT, Perplexity, Claude, Gemini).
 *
 * Une IA cite une source qui répond en une phrase complète et chiffrée : « FOCUS
 * contient 120 mg de lion's mane par jour » se reprend, « une formule aux doses
 * cliniquement efficaces » ne se reprend pas. Tout ce qui est ici vient des
 * fiches produit (compositions, doses, posologies, précautions) et doit rester
 * aligné sur elles : un fait faux serait répété à l'identique.
 *
 * Aucune allégation hors du registre européen (règlement CE 1924/2006) : on dit
 * à quoi sert une formule, jamais ce qu'elle soigne.
 */
export type ProductFact = {
  name: string;
  handle: string;
  format: string;
  need: string;
  actives: string;
  serving: string;
  flavour: string;
  price: string;
  cautions: string;
};

export const PRODUCT_FACTS: ProductFact[] = [
  {
    name: "CALM",
    handle: "calm",
    format: "gummies à mâcher, pot de 60 (30 jours)",
    need: "détente et sommeil",
    actives: "reishi 80 mg (extrait 10:1), ashwagandha 80 mg (≥ 5 % de withanolides), safran 16 mg (≥ 2 % de safranal) par dose journalière",
    serving: "2 gummies par jour, dans la journée ou le soir",
    flavour: "mûre",
    price: "39 € le pot",
    cautions: "déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical, notamment sédatifs ou anxiolytiques, sans avis médical",
  },
  {
    name: "FOCUS",
    handle: "focus",
    format: "gummies à mâcher, pot de 60 (30 jours)",
    need: "concentration et clarté mentale",
    actives: "lion's mane 120 mg (extrait 8:1 à 12:1), extrait de thé vert 80 mg (40 % de L-théanine), rhodiola rosea 30 mg (3 % de rosavines) par dose journalière",
    serving: "2 gummies par jour, le matin ou l'après-midi",
    flavour: "ananas",
    price: "39 € le pot",
    cautions: "déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical sans avis médical",
  },
  {
    name: "POWER",
    handle: "power",
    format: "gummies à mâcher, pot de 60 (30 jours)",
    need: "énergie et effort physique",
    actives: "cordyceps 200 mg (extrait 4:1), panax ginseng 100 mg (4 % de ginsénosides), rhodiola rosea 30 mg (3 % de rosavines) par dose journalière",
    serving: "2 gummies par jour, le matin ou avant une activité physique",
    flavour: "fruit de la passion",
    price: "39 € le pot",
    cautions: "déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical sans avis médical",
  },
  {
    name: "MUSHGLOW",
    handle: "mushglow",
    format: "poudre, sachet de 30 doses",
    need: "équilibre global : énergie, concentration, peau",
    actives: "lion's mane 750 mg, maca 750 mg, cordyceps 500 mg, chaga 500 mg, L-théanine 500 mg, collagène de membrane d'œuf 300 mg par dose",
    serving: "1 cuillère à soupe rase par jour (environ 4 g), dans une préparation froide ou chaude",
    flavour: "neutre, légèrement terreux",
    price: "49 € les 30 doses",
    cautions: "contient du collagène issu de l'œuf ; déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical sans avis médical",
  },
];

export const PACK_FACTS = [
  { name: "FLOW", handle: "flow", content: "FOCUS + CALM" },
  { name: "BOOST", handle: "boost", content: "FOCUS + POWER" },
  { name: "BALANCE", handle: "balance", content: "CALM + MUSHGLOW" },
  { name: "RESET", handle: "reset", content: "FOCUS + POWER + CALM" },
];

/** Une ligne par produit, en phrase complète. */
export function productFactLine(p: ProductFact, siteUrl: string): string {
  return `- **${p.name}** (${siteUrl}/fr/products/${p.handle}) — ${p.need}. Format : ${p.format}. Composition : ${p.actives}. Prise : ${p.serving}. Goût : ${p.flavour}. Prix : ${p.price}. Précautions : ${p.cautions}.`;
}
