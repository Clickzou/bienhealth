/**
 * Intro éditoriale SEO par produit (affichée sur la fiche produit).
 * Clé = identifiant produit (keyFor : MUSHGLOW, CALM, FOCUS, POWER).
 * Bilingue FR / EN.
 */
export type ProductSeo = {
  heading: string;
  paragraphs: string[];
  en: { heading: string; paragraphs: string[] };
};

export function localizeProductSeo(seo: ProductSeo, lang: string) {
  return lang === "en" ? seo.en : { heading: seo.heading, paragraphs: seo.paragraphs };
}

export const PRODUCT_SEO: Record<string, ProductSeo> = {
  MUSHGLOW: {
    heading: "MushGlow, la poudre adaptogène tout-en-un",
    paragraphs: [
      "MushGlow est une poudre adaptogène premium, pensée comme un supermix 6-en-1 pour simplifier votre routine bien-être. Elle réunit six actifs cliniquement dosés — Lion's Mane, Cordyceps, Chaga, Maca, L-Théanine et collagène de membrane d'œuf — pour soutenir en une seule cuillère la clarté mentale, l'énergie naturelle, la résilience au stress, l'immunité et l'éclat de la peau.",
      "Sans caféine, sans sucre et sans gluten, cette poudre de champignons fonctionnels au goût neutre se mélange facilement à votre café, votre matcha ou votre smoothie. Fabriquée en France et 100 % naturelle, MushGlow est le complément idéal des athlètes de la vie qui veulent tout regrouper dans un geste quotidien simple et efficace.",
    ],
    en: {
      heading: "MushGlow, the all-in-one adaptogenic powder",
      paragraphs: [
        "MushGlow is a premium adaptogenic powder, designed as a 6-in-1 supermix to simplify your wellness routine. It brings together six clinically dosed actives — Lion's Mane, Cordyceps, Chaga, Maca, L-Theanine and eggshell-membrane collagen — to support mental clarity, natural energy, stress resilience, immunity and skin radiance in a single spoon.",
        "Caffeine-free, sugar-free and gluten-free, this neutral-tasting functional-mushroom powder blends easily into your coffee, matcha or smoothie. Made in France and 100% natural, MushGlow is the ideal supplement for life's athletes who want to combine everything in one simple, effective daily ritual.",
      ],
    },
  },
  CALM: {
    heading: "CALM, des gummies anti-stress pour un sommeil réparateur",
    paragraphs: [
      "CALM est un complément alimentaire naturel sous forme de gummies, formulé pour apaiser le stress, relâcher les tensions et favoriser un sommeil réparateur. Sa synergie associe trois actifs de référence : l'Ashwagandha, adaptogène étudié pour son action sur le cortisol, le Reishi, champignon fonctionnel de la détente, et le Safran, reconnu pour son effet positif sur l'humeur.",
      "Deux gummies CALM le soir, en cure régulière de 30 jours, offrent une alternative douce à la mélatonine — sans accoutumance ni somnolence au réveil. Vegan, sans sucre et fabriqués en France, ces gummies anti-stress accompagnent en douceur vos moments de tension et la préparation au sommeil.",
    ],
    en: {
      heading: "CALM, anti-stress gummies for restorative sleep",
      paragraphs: [
        "CALM is a natural food supplement in gummy form, formulated to soothe stress, release tension and promote restorative sleep. Its synergy combines three reference actives: Ashwagandha, an adaptogen studied for its action on cortisol; Reishi, the functional mushroom of relaxation; and Saffron, recognised for its positive effect on mood.",
        "Two CALM gummies in the evening, as a regular 30-day programme, offer a gentle alternative to melatonin — without dependency or morning grogginess. Vegan, sugar-free and made in France, these anti-stress gummies gently support your moments of tension and your wind-down before sleep.",
      ],
    },
  },
  FOCUS: {
    heading: "FOCUS, des gummies concentration & clarté mentale",
    paragraphs: [
      "FOCUS est un complément alimentaire en gummies conçu pour soutenir la concentration, la mémoire et la clarté mentale, sans nervosité ni coup de barre. Sa formule combine le Lion's Mane, champignon reconnu pour la fonction cognitive, la Rhodiola Rosea, adaptogène anti-fatigue mentale, et la L-Théanine, qui apaise sans endormir.",
      "Deux gummies FOCUS le matin installent une concentration plus intense et plus durable — beaucoup y trouvent une alternative à leur second café. Au goût fruité, vegan et sans sucre, ces gummies focus sont l'allié quotidien des étudiants, entrepreneurs et créatifs, même en pleine surcharge mentale.",
    ],
    en: {
      heading: "FOCUS, focus & mental-clarity gummies",
      paragraphs: [
        "FOCUS is a food supplement in gummy form designed to support focus, memory and mental clarity, without jitters or crashes. Its formula combines Lion's Mane, a mushroom recognised for cognitive function; Rhodiola Rosea, an adaptogen against mental fatigue; and L-Theanine, which calms without causing drowsiness.",
        "Two FOCUS gummies in the morning establish more intense and longer-lasting concentration — many find them an alternative to their second coffee. Fruity, vegan and sugar-free, these focus gummies are the daily ally of students, entrepreneurs and creatives, even under heavy mental load.",
      ],
    },
  },
  POWER: {
    heading: "POWER, des gummies énergie & performance",
    paragraphs: [
      "POWER est un complément alimentaire naturel en gummies formulé pour renforcer l'énergie, l'endurance et la récupération, tout en réduisant la fatigue. Il associe le Cordyceps, champignon de l'endurance, la Rhodiola Rosea, adaptogène anti-fatigue, et le Panax Ginseng, référence de la vitalité — pour un vrai coup de boost, sans contre-coup ni nervosité.",
      "Deux gummies POWER au goût de fruit de la passion, le matin ou avant une activité physique, pour aborder la journée avec tonus. Vegan, sans sucre et fabriqués en France, ces gummies énergie soutiennent durablement les sportifs, parents et entrepreneurs qui mènent leurs journées tambour battant.",
    ],
    en: {
      heading: "POWER, energy & performance gummies",
      paragraphs: [
        "POWER is a natural food supplement in gummy form, formulated to boost energy, stamina and recovery while reducing fatigue. It combines Cordyceps, the mushroom of endurance; Rhodiola Rosea, an anti-fatigue adaptogen; and Panax Ginseng, a benchmark for vitality — for a real boost, without any rebound or jitters.",
        "Two passion-fruit-flavoured POWER gummies, in the morning or before physical activity, to take on the day with energy. Vegan, sugar-free and made in France, these energy gummies provide lasting support for athletes, parents and entrepreneurs who power through busy days.",
      ],
    },
  },
};
