/**
 * Contenu éditorial SEO (long-form) affiché en bas des pages collections.
 * Structure Hn réelle (H2/H3) pour optimiser les mots-clés catégorie.
 * Bilingue FR / EN. Server-only (importé par la page collection).
 */
export type SeoBlock = { h: string; p: string[] };
/** Tableau comparatif : les faits d'une gamme en lignes, la forme que les
 *  moteurs génératifs extraient et citent le plus volontiers. */
export type SeoTable = { caption: string; head: string[]; rows: string[][]; note?: string };
export type SeoBody = {
  intro: string[];
  blocks: SeoBlock[];
  table?: SeoTable;
  /** Questions fréquentes, affichées et balisées en FAQPage. */
  faq?: { q: string; a: string }[];
};
export type CollectionSeo = SeoBody & {
  en: SeoBody;
  /** Slugs d'articles du blog à proposer en lecture (maillage). */
  related?: string[];
};

/** Renvoie le corps SEO localisé d'une collection. */
export function localizeCollectionSeo(seo: CollectionSeo, lang: string): SeoBody {
  return lang === "en" ? seo.en : { intro: seo.intro, blocks: seo.blocks, table: seo.table, faq: seo.faq };
}

export const COLLECTION_SEO: Record<string, CollectionSeo> = {
  // Réécrit le 22/09/2026 (audit SEO) : 535 mots → environ 1 000, tableau
  // comparatif et FAQ balisée. Deux affirmations sans source ont été retirées
  // (« absorbés dès la mastication, ils agissent plus vite », « la majorité
  // termine sa cure ») : ni défendables, ni citables par un moteur génératif.
  // Doses, goûts et précautions reprennent mot pour mot les fiches produit.
  gummies: {
    intro: [
      "Les gummies BIEN health sont des compléments alimentaires à mâcher, formulés à partir de champignons fonctionnels et de plantes adaptogènes. Trois formules composent la gamme : CALM pour la sérénité et le sommeil, FOCUS pour la concentration, POWER pour l'énergie. Chacune associe trois actifs extraits et dosés, se prend à raison de deux gummies par jour, et un pot de 60 couvre une cure d'un mois. Les trois sont fabriqués en France, sans sucre ajouté, vegan et sans gluten.",
    ],
    blocks: [
      {
        h: "Qu'est-ce qu'un gummy adaptogène ?",
        p: [
          "Un adaptogène est une plante ou un champignon traditionnellement utilisé pour aider l'organisme à faire face aux sollicitations du quotidien : stress, fatigue, rythme irrégulier. L'ashwagandha, la rhodiola, le reishi ou le cordyceps en sont les plus étudiés. Le gummy n'est qu'un format : une gomme à mâcher qui remplace la gélule.",
          "Ce format a un intérêt très concret : on oublie moins une prise qui ressemble à une friandise qu'une gélule de plus. Il impose aussi une limite, que nous préférons dire : une gomme ne contient que quelques centaines de milligrammes d'actifs. C'est pourquoi nous utilisons des extraits concentrés et standardisés plutôt que de la poudre brute.",
        ],
      },
      {
        h: "CALM, FOCUS, POWER : trois formules, trois moments",
        p: [
          "CALM réunit reishi, ashwagandha et safran. Il se prend dans la journée pour accompagner les moments de tension, ou le soir pour préparer le coucher, et a un goût de mûre.",
          "FOCUS associe lion's mane, L-théanine issue du thé vert et rhodiola rosea. Il se prend le matin ou en début d'après-midi, quand l'attention décroche, et a un goût d'ananas.",
          "POWER combine cordyceps, panax ginseng et rhodiola rosea. Il se prend le matin ou avant une activité physique, au goût de fruit de la passion.",
          "Le tableau ci-dessous détaille la dose de chaque actif par prise journalière. Vous hésitez entre deux formules ? Le diagnostic en ligne vous oriente en une minute.",
        ],
      },
      {
        h: "Des extraits dosés et contrôlés",
        p: [
          "Chaque actif est un extrait dont la concentration est indiquée : 120 mg de lion's mane concentré entre 8:1 et 12:1 dans FOCUS, l'équivalent d'environ 1 200 mg de champignon sec ; 80 mg d'ashwagandha standardisée à au moins 5 % de withanolides dans CALM ; 200 mg de cordyceps concentré 4:1 dans POWER. Les extraits sont contrôlés pour les métaux lourds, la microbiologie et, selon les actifs, les pesticides et les résidus de solvants.",
          "Les trois formules sont déclarées auprès de la DGAL et enregistrées sur Compl'Alim, la base officielle des compléments alimentaires en France. Les numéros de déclaration sont publics sur notre page Certifications.",
        ],
      },
      {
        h: "Comment prendre vos gummies",
        p: [
          "Deux gummies par jour, à mâcher, sans dépasser cette dose. Comme pour tous les adaptogènes, c'est la régularité qui compte : nous recommandons une cure d'au moins 30 jours, soit un pot. Les packs FLOW, BOOST et RESET associent plusieurs formules pour couvrir deux ou trois besoins à la fois, à un prix plus doux.",
          "Les gummies sont déconseillés aux femmes enceintes ou allaitantes, et aux personnes sous traitement médical sans avis de leur médecin. Un complément alimentaire ne remplace ni une alimentation variée et équilibrée, ni un mode de vie sain.",
        ],
      },
    ],
    table: {
      caption: "Les gummies BIEN health en un coup d'œil (dose par prise journalière de 2 gummies)",
      head: ["Formule", "Actifs et doses", "Goût", "Quand la prendre"],
      rows: [
        ["CALM", "Reishi 80 mg (extrait 10:1) · Ashwagandha 80 mg (≥ 5 % withanolides) · Safran 16 mg (≥ 2 % safranal)", "Mûre", "Dans la journée ou le soir"],
        ["FOCUS", "Lion's mane 120 mg (extrait 8:1 à 12:1) · Extrait de thé vert 80 mg (40 % L-théanine) · Rhodiola rosea 30 mg (3 % rosavines)", "Ananas", "Le matin ou l'après-midi"],
        ["POWER", "Cordyceps 200 mg (extrait 4:1) · Panax ginseng 100 mg (4 % ginsénosides) · Rhodiola rosea 30 mg (3 % rosavines)", "Fruit de la passion", "Le matin ou avant l'effort"],
      ],
      note: "Pot de 60 gummies = 30 jours · 39 € · sans sucre ajouté, vegan, sans gluten · fabriqué en France.",
    },
    faq: [
      { q: "Quelle différence entre les gummies CALM, FOCUS et POWER ?", a: "Ils répondent à trois besoins. CALM (reishi, ashwagandha, safran) accompagne la détente et le sommeil. FOCUS (lion's mane, L-théanine, rhodiola) accompagne la concentration. POWER (cordyceps, panax ginseng, rhodiola) accompagne l'énergie et l'effort physique. Tous se prennent à raison de deux gummies par jour." },
      { q: "Les gummies BIEN contiennent-ils du sucre ?", a: "Non : les trois formules sont sans sucre ajouté. Elles sont aussi vegan et sans gluten." },
      { q: "Peut-on prendre deux formules en même temps ?", a: "Oui, c'est le principe de nos packs : FLOW associe FOCUS et CALM, BOOST associe FOCUS et POWER, RESET réunit les trois. Respectez deux gummies par jour et par formule. En cas de traitement médical, demandez l'avis de votre médecin." },
      { q: "Au bout de combien de temps ressent-on les effets ?", a: "Certaines personnes perçoivent une différence dès les premiers jours, mais les adaptogènes s'apprécient sur la durée : nous recommandons une cure d'au moins 30 jours, soit un pot de 60 gummies." },
      { q: "Qui ne doit pas prendre de gummies adaptogènes ?", a: "Ils sont déconseillés aux femmes enceintes ou allaitantes, aux enfants, et aux personnes sous traitement médical sans avis de leur médecin, en particulier avec des sédatifs ou des anxiolytiques pour CALM." },
      { q: "Où sont fabriqués les gummies BIEN ?", a: "En France. Les formules sont déclarées auprès de la DGAL et enregistrées sur Compl'Alim ; les attestations sont consultables sur la page Certifications du site." },
    ],
    related: ["gummies-vs-gelules", "quest-ce-quun-adaptogene", "ashwagandha", "lions-mane", "reishi-cordyceps-chaga", "gerer-le-stress-naturellement"],
    en: {
      intro: [
        "BIEN health gummies are chewable food supplements made from functional mushrooms and adaptogenic plants. The range has three formulas: CALM for calm and sleep, FOCUS for concentration, POWER for energy. Each combines three dosed extracts, is taken as two gummies a day, and one jar of 60 covers a one-month course. All three are made in France, with no added sugar, vegan and gluten-free.",
      ],
      blocks: [
        {
          h: "What is an adaptogenic gummy?",
          p: [
            "An adaptogen is a plant or mushroom traditionally used to help the body cope with everyday demands: stress, fatigue, irregular routines. Ashwagandha, rhodiola, reishi and cordyceps are the most studied. A gummy is simply a format: a chewable that replaces the capsule.",
            "The format has a very practical benefit: a dose that feels like a treat is harder to forget than one more capsule. It also has a limit we would rather state plainly: a gummy holds only a few hundred milligrams of actives. That is why we use concentrated, standardised extracts rather than raw powder.",
          ],
        },
        {
          h: "CALM, FOCUS, POWER: three formulas, three moments",
          p: [
            "CALM combines reishi, ashwagandha and saffron. Take it during the day to accompany tense moments, or in the evening before bed. It tastes of blackberry.",
            "FOCUS pairs lion's mane, L-theanine from green tea and rhodiola rosea. Take it in the morning or early afternoon, when attention drops. It tastes of pineapple.",
            "POWER blends cordyceps, panax ginseng and rhodiola rosea. Take it in the morning or before physical activity. It tastes of passion fruit.",
            "The table below gives the dose of each active per daily serving. Torn between two formulas? Our online quiz points you in the right direction in a minute.",
          ],
        },
        {
          h: "Dosed, tested extracts",
          p: [
            "Every active is an extract with a stated concentration: 120 mg of lion's mane concentrated 8:1 to 12:1 in FOCUS, the equivalent of about 1,200 mg of dried mushroom; 80 mg of ashwagandha standardised to at least 5% withanolides in CALM; 200 mg of cordyceps concentrated 4:1 in POWER. Extracts are tested for heavy metals, microbiology and, depending on the active, pesticides and solvent residues.",
            "All three formulas are declared to the French DGAL and registered on Compl'Alim, France's official food supplement database. Declaration numbers are public on our Certifications page.",
          ],
        },
        {
          h: "How to take your gummies",
          p: [
            "Two gummies a day, chewed, without exceeding this dose. As with all adaptogens, consistency is what matters: we recommend a course of at least 30 days, which is one jar. The FLOW, BOOST and RESET packs combine several formulas to cover two or three needs at once, at a better price.",
            "The gummies are not recommended for pregnant or breastfeeding women, or for people under medical treatment without their doctor's advice. A food supplement does not replace a varied, balanced diet or a healthy lifestyle.",
          ],
        },
      ],
      table: {
        caption: "BIEN health gummies at a glance (dose per daily serving of 2 gummies)",
        head: ["Formula", "Actives and doses", "Flavour", "When to take it"],
        rows: [
          ["CALM", "Reishi 80 mg (10:1 extract) · Ashwagandha 80 mg (≥ 5% withanolides) · Saffron 16 mg (≥ 2% safranal)", "Blackberry", "During the day or in the evening"],
          ["FOCUS", "Lion's mane 120 mg (8:1 to 12:1 extract) · Green tea extract 80 mg (40% L-theanine) · Rhodiola rosea 30 mg (3% rosavins)", "Pineapple", "Morning or afternoon"],
          ["POWER", "Cordyceps 200 mg (4:1 extract) · Panax ginseng 100 mg (4% ginsenosides) · Rhodiola rosea 30 mg (3% rosavins)", "Passion fruit", "Morning or before exercise"],
        ],
        note: "Jar of 60 gummies = 30 days · €39 · no added sugar, vegan, gluten-free · made in France.",
      },
      faq: [
        { q: "What is the difference between CALM, FOCUS and POWER gummies?", a: "They address three needs. CALM (reishi, ashwagandha, saffron) supports relaxation and sleep. FOCUS (lion's mane, L-theanine, rhodiola) supports concentration. POWER (cordyceps, panax ginseng, rhodiola) supports energy and physical effort. All are taken as two gummies a day." },
        { q: "Do BIEN gummies contain sugar?", a: "No: all three formulas have no added sugar. They are also vegan and gluten-free." },
        { q: "Can I take two formulas at the same time?", a: "Yes, that is the idea behind our packs: FLOW pairs FOCUS and CALM, BOOST pairs FOCUS and POWER, RESET brings all three together. Stick to two gummies a day per formula. If you are under medical treatment, ask your doctor." },
        { q: "How long before I feel the effects?", a: "Some people notice a difference within the first days, but adaptogens are best judged over time: we recommend a course of at least 30 days, which is one jar of 60 gummies." },
        { q: "Who should not take adaptogenic gummies?", a: "They are not recommended for pregnant or breastfeeding women, children, or people under medical treatment without their doctor's advice, particularly with sedatives or anxiolytics for CALM." },
        { q: "Where are BIEN gummies made?", a: "In France. The formulas are declared to the DGAL and registered on Compl'Alim; the certificates are available on the site's Certifications page." },
      ],
    },
  },

  serenite: {
    intro: [
      "Stress chronique, tensions, nuits agitées : le quotidien met le système nerveux à rude épreuve. La collection Sérénité & Sommeil de BIEN health rassemble des compléments alimentaires naturels pensés pour apaiser le mental, réduire le stress et retrouver un sommeil réparateur, sans accoutumance ni somnolence au réveil.",
    ],
    blocks: [
      {
        h: "Retrouver un sommeil réparateur, naturellement",
        p: [
          "Bien dormir ne devrait pas être un luxe. Plutôt que la mélatonine de synthèse, nos formules misent sur des plantes adaptogènes et des champignons fonctionnels qui aident l'organisme à réguler sa réponse au stress, cause fréquente des troubles de l'endormissement. Le résultat : un esprit plus posé le soir, et des nuits de meilleure qualité.",
        ],
      },
      {
        h: "Ashwagandha, Reishi, Safran : le trio anti-stress",
        p: [
          "Notre gummy CALM concentre trois actifs de référence. L'Ashwagandha, adaptogène ancestral, est étudié pour son action sur le cortisol, l'hormone du stress. Le Reishi, champignon fonctionnel, soutient la détente et l'équilibre émotionnel. Le Safran, enfin, est reconnu pour son effet positif sur l'humeur. Ensemble, ils forment une réponse naturelle et complète à la charge mentale.",
          "Pour une approche globale, la poudre MushGlow complète cette routine en soutenant à la fois l'équilibre nerveux, l'énergie et l'éclat de la peau.",
        ],
      },
      {
        h: "Votre routine sérénité au quotidien",
        p: [
          "Deux gummies CALM le soir, environ une heure avant le coucher, pour relâcher la pression de la journée. Comme tous les adaptogènes, l'effet se construit avec la régularité : une cure de 30 jours permet de constater une sérénité plus durable et un sommeil plus profond. Une alternative douce, sans sucre et vegan, pour reprendre le contrôle de vos nuits.",
        ],
      },
    ],
    en: {
      intro: [
        "Chronic stress, tension, restless nights: everyday life puts the nervous system to the test. BIEN health's Calm & Sleep collection brings together natural food supplements designed to soothe the mind, reduce stress and restore restful sleep, without dependency or morning grogginess.",
      ],
      blocks: [
        {
          h: "Restore restful sleep, naturally",
          p: [
            "Sleeping well shouldn't be a luxury. Rather than synthetic melatonin, our formulas rely on adaptogenic plants and functional mushrooms that help the body regulate its stress response, a frequent cause of difficulty falling asleep. The result: a calmer mind in the evening, and better-quality nights.",
          ],
        },
        {
          h: "Ashwagandha, Reishi, Saffron: the anti-stress trio",
          p: [
            "Our CALM gummy concentrates three reference actives. Ashwagandha, an ancestral adaptogen, is studied for its action on cortisol, the stress hormone. Reishi, a functional mushroom, supports relaxation and emotional balance. And Saffron is recognised for its positive effect on mood. Together, they form a natural, complete response to mental load.",
            "For a holistic approach, the MushGlow powder complements this routine by supporting nervous balance, energy and skin radiance all at once.",
          ],
        },
        {
          h: "Your everyday calm routine",
          p: [
            "Two CALM gummies in the evening, about an hour before bed, to release the day's pressure. Like all adaptogens, the effect builds with regularity: a 30-day course lets you notice more lasting serenity and deeper sleep. A gentle, sugar-free and vegan alternative to take back control of your nights.",
          ],
        },
      ],
    },
  },

  "nos-poudres": {
    intro: [
      "Notre poudre réunit le meilleur des champignons fonctionnels, des adaptogènes et du collagène dans un format 6-en-1. Une cuillère suffit pour transformer votre petit-déjeuner en un véritable rituel bien-être. Naturelle, sans sucre et fabriquée en France, la poudre adaptogène BIEN health simplifie votre routine tout en agissant sur plusieurs fronts : énergie, concentration, gestion du stress et éclat de la peau.",
    ],
    blocks: [
      {
        h: "La poudre, le format 6-en-1",
        p: [
          "Pourquoi multiplier les compléments quand une seule dose peut tout regrouper ? La forme poudre permet de concentrer plusieurs actifs cliniquement dosés en une prise quotidienne, sans avaler une poignée de gélules. Elle se marie naturellement à votre routine du matin : yaourts, œufs, boissons…",
        ],
      },
      {
        h: "MushGlow : le supermix 6-en-1",
        p: [
          "Notre poudre MushGlow associe Lion's Mane, Cordyceps, Chaga, Maca, L-Théanine et collagène de membrane d'œuf. Ce supermix soutient à la fois la clarté mentale, l'énergie naturelle, la résilience au stress, l'immunité et l'éclat de la peau. Une synergie unique, 100 % naturelle, sans caféine ni sucre ajouté.",
        ],
      },
      {
        h: "Comment consommer votre poudre ?",
        p: [
          "Ajouter 1 cuillère à soupe rase par jour (environ 4 g) dans vos préparations, froides ou chaudes, jusqu'à 200 °C au four. Formule 100 % actifs, sans agents de liaison : de légers grumeaux peuvent apparaître. Bien mélanger pour obtenir une texture homogène.",
          "Idéal dans les yaourts, smoothies, jus de légumes, soupes ou préparations épaisses. Convient aussi en cuisine : gâteaux, omelettes… Adapter la quantité selon le nombre de portions. À consommer de préférence le matin. Premiers résultats visibles dès le 1er mois, à prolonger pour des effets durables.",
        ],
      },
    ],
    en: {
      intro: [
        "Our powder brings together the best of functional mushrooms, adaptogens and collagen in a 6-in-1 format. One spoon is enough to turn your breakfast into a real wellness ritual. Natural, sugar-free and made in France, the BIEN health adaptogenic powder simplifies your routine while acting on several fronts: energy, focus, stress management and skin radiance.",
      ],
      blocks: [
        {
          h: "Powder, the 6-in-1 format",
          p: [
            "Why pile up supplements when a single dose can bring everything together? The powder format concentrates several clinically dosed actives in one daily serving, without swallowing a handful of capsules. It blends naturally into your morning routine: yoghurts, eggs, drinks…",
          ],
        },
        {
          h: "MushGlow: the 6-in-1 supermix",
          p: [
            "Our MushGlow powder combines Lion's Mane, Cordyceps, Chaga, Maca, L-Theanine and eggshell-membrane collagen. This supermix supports mental clarity, natural energy, stress resilience, immunity and skin radiance all at once. A unique, 100% natural synergy, with no caffeine or added sugar.",
          ],
        },
        {
          h: "How to take your powder?",
          p: [
            "Add 1 level tablespoon a day (about 4 g) to your preparations, cold or hot, up to 200 °C in the oven. A 100% active formula with no binding agents: slight lumps may appear. Stir well for an even texture.",
            "Ideal in yoghurts, smoothies, vegetable juices, soups or thick preparations. It also works in cooking: cakes, omelettes… Adjust the amount to the number of servings. Best taken in the morning. First results visible from the 1st month, to be continued for lasting effects.",
          ],
        },
      ],
    },
  },

  concentration: {
    intro: [
      "Brouillard mental, difficultés à rester concentré, baisse de mémoire : la surcharge cognitive fait partie du quotidien. La collection Concentration & Clarté mentale de BIEN health rassemble des compléments alimentaires naturels formulés pour soutenir l'attention, la mémoire et la clarté d'esprit, sans nervosité ni baisse de régime.",
    ],
    blocks: [
      {
        h: "Booster sa concentration, naturellement",
        p: [
          "Plutôt que la caféine et ses effets yo-yo, nos formules s'appuient sur des champignons fonctionnels et des adaptogènes qui nourrissent la fonction cognitive en profondeur. Une aide précieuse pour les étudiants, entrepreneurs, créatifs et tous ceux qui doivent rester focus sur la durée.",
        ],
      },
      {
        h: "Lion's Mane, Rhodiola et L-Théanine",
        p: [
          "Le gummy FOCUS combine trois actifs de choix. Le Lion's Mane, champignon reconnu pour son soutien de la mémoire et de la fonction cognitive. La Rhodiola Rosea, adaptogène qui aide à lutter contre la fatigue mentale. Et la L-Théanine, qui apaise sans endormir et améliore la clarté d'esprit. Pour une approche complète, la poudre MushGlow prolonge cet effet focus au fil de la journée.",
        ],
      },
      {
        h: "Rester focus au quotidien",
        p: [
          "Deux gummies FOCUS le matin suffisent à installer une concentration plus intense et plus durable, sans crash. Beaucoup y trouvent une alternative, ou un complément, à leur second café. Comme toujours avec les adaptogènes, la régularité est la clé : une cure de 30 jours révèle tout leur potentiel.",
        ],
      },
    ],
    en: {
      intro: [
        "Mental fog, difficulty staying focused, memory dips: cognitive overload is part of everyday life. BIEN health's Focus & Mental Clarity collection brings together natural food supplements formulated to support attention, memory and clarity of mind, without jitters or dips.",
      ],
      blocks: [
        {
          h: "Boost your focus, naturally",
          p: [
            "Rather than caffeine and its yo-yo effects, our formulas rely on functional mushrooms and adaptogens that nourish cognitive function in depth. A valuable help for students, entrepreneurs, creatives and anyone who needs to stay focused over time.",
          ],
        },
        {
          h: "Lion's Mane, Rhodiola and L-Theanine",
          p: [
            "The FOCUS gummy combines three prime actives. Lion's Mane, a mushroom recognised for supporting memory and cognitive function. Rhodiola Rosea, an adaptogen that helps fight mental fatigue. And L-Theanine, which calms without causing drowsiness and improves clarity of mind. For a complete approach, the MushGlow powder extends this focus effect throughout the day.",
          ],
        },
        {
          h: "Stay focused every day",
          p: [
            "Two FOCUS gummies in the morning are enough to establish more intense and longer-lasting concentration, without a crash. Many find them an alternative, or a complement, to their second coffee. As always with adaptogens, regularity is key: a 30-day course reveals their full potential.",
          ],
        },
      ],
    },
  },

  "performance-et-vitalite": {
    intro: [
      "Baisse d'énergie en milieu de journée, énergie en dents de scie, récupération difficile : le corps aussi a besoin de soutien. La collection Performance & Vitalité de BIEN health réunit des compléments alimentaires naturels conçus pour renforcer l'énergie, l'endurance et la résistance à l'effort, sans excitants ni sensation de nervosité.",
    ],
    blocks: [
      {
        h: "De l'énergie durable, sans nervosité",
        p: [
          "Nos formules privilégient une vitalité saine et progressive plutôt qu'un shot d'énergie suivi d'une chute. Les adaptogènes aident l'organisme à mieux gérer l'effort physique et mental, pour tenir la distance, du matin au soir.",
        ],
      },
      {
        // Les trois produits de la collection sont désormais présentés : le
        // texte ne parlait que de POWER (correction client).
        h: "POWER, FOCUS et MUSHGLOW : trois soutiens complémentaires",
        p: [
          "Les gummies POWER associent trois actifs de la performance. Le Cordyceps, champignon prisé pour l'énergie et l'endurance. La Rhodiola Rosea, adaptogène anti-fatigue. Et le Panax Ginseng, référence de la vitalité. Un vrai coup de boost, sans contre-coup.",
          "Les gummies FOCUS prennent le relais sur le versant mental : Lion's Mane, Rhodiola Rosea et L-Théanine soutiennent la concentration et la clarté d'esprit quand la journée s'allonge. La poudre MUSHGLOW, supermix 6-en-1, complète la routine en soutenant l'énergie globale, la résilience au stress et la récupération.",
        ],
      },
      {
        h: "Pensé pour les athlètes de la vie",
        p: [
          "Deux gummies POWER le matin ou avant une activité physique, pour aborder la journée avec tonus. Sportifs, parents, entrepreneurs : cette collection accompagne tous ceux qui mènent leurs journées tambour battant. Une cure régulière de 30 jours permet d'installer une vitalité durable et naturelle.",
        ],
      },
    ],
    en: {
      intro: [
        "A mid-day dip, up-and-down energy, difficult recovery: the body needs support too. BIEN health's Performance & Vitality collection brings together natural food supplements designed to boost energy, stamina and resistance to effort, without stimulants or any jittery feeling.",
      ],
      blocks: [
        {
          h: "Lasting energy, without the jitters",
          p: [
            "Our formulas favour healthy, gradual vitality rather than an energy shot followed by a drop. Adaptogens help the body better manage physical and mental effort, to go the distance, from morning to evening.",
          ],
        },
        {
          h: "POWER, FOCUS and MUSHGLOW: three complementary allies",
          p: [
            "POWER gummies combine three performance actives. Cordyceps, a mushroom prized for energy and stamina. Rhodiola Rosea, an anti-fatigue adaptogen. And Panax Ginseng, a benchmark for vitality. A real boost, without the rebound.",
            "FOCUS gummies take over on the mental side: Lion's Mane, Rhodiola Rosea and L-Theanine support concentration and clarity of mind when the day stretches on. The MUSHGLOW powder, a 6-in-1 supermix, completes the routine by supporting overall energy, stress resilience and recovery.",
          ],
        },
        {
          h: "Made for life's athletes",
          p: [
            "Two POWER gummies in the morning or before physical activity, to take on the day with energy. Athletes, parents, entrepreneurs: this collection supports everyone who powers through busy days. A regular 30-day course helps establish lasting, natural vitality.",
          ],
        },
      ],
    },
  },

  "beaute-et-bien-etre": {
    intro: [
      "Une peau éclatante et des cheveux forts commencent de l'intérieur. La collection Beauté & bien-être de BIEN health rassemble des compléments alimentaires naturels riches en collagène et en actifs antioxydants, pour nourrir la peau, soutenir les cheveux et les ongles, et retrouver un équilibre global, le tout dans une routine simple et gourmande.",
    ],
    blocks: [
      {
        h: "La beauté vient de l'intérieur",
        p: [
          "Crèmes et soins topiques ne font qu'une partie du travail. En agissant de l'intérieur, les compléments beauté nourrissent la peau à la source, en apportant les nutriments essentiels à son hydratation et à son éclat. Une approche complémentaire, naturelle et durable.",
        ],
      },
      {
        h: "Collagène et actifs antioxydants",
        p: [
          "Notre poudre MushGlow contient entre autre du collagène de membrane d'œuf, reconnu pour améliorer l'hydratation, l'élasticité et l'éclat de la peau, et du Chaga, champignon aux puissantes propriétés antioxydantes qui protègent les cellules du stress oxydatif. Les gummies CALM complètent cet équilibre en apaisant le stress, souvent responsable des déséquilibres cutanés.",
        ],
      },
      {
        h: "Un rituel beauté au quotidien",
        p: [
          // MushGlow contient du collagène de membrane d'œuf : végétarienne,
          // pas vegan (correction client).
          "Une cuillère de MushGlow chaque matin dans votre boisson, en cure régulière, pour révéler l'éclat naturel de votre peau au fil des semaines. Naturelle, végétarienne, sans sucre et fabriqué en France, ce rituel beauté s'intègre sans effort à votre routine bien-être.",
        ],
      },
    ],
    en: {
      intro: [
        "Radiant skin and strong hair start from within. BIEN health's Beauty & Wellbeing collection brings together natural food supplements rich in collagen and antioxidant actives, to nourish the skin, support hair and nails, and restore overall balance, all in a simple, enjoyable routine.",
      ],
      blocks: [
        {
          h: "Beauty comes from within",
          p: [
            "Creams and topical care only do part of the job. By acting from within, beauty supplements nourish the skin at the source, providing the nutrients essential to its hydration and radiance. A complementary, natural and lasting approach.",
          ],
        },
        {
          h: "Collagen and antioxidant actives",
          p: [
            "Our MushGlow powder contains, among others, eggshell-membrane collagen, recognised for improving skin hydration, elasticity and radiance, and Chaga, a mushroom with powerful antioxidant properties that protect cells from oxidative stress. The CALM gummies complete this balance by soothing stress, which is often responsible for skin imbalances.",
          ],
        },
        {
          h: "A daily beauty ritual",
          p: [
            "One spoon of MushGlow every morning in your drink, as a regular course, to reveal your skin's natural radiance over the weeks. Natural, vegetarian, sugar-free and made in France, this beauty ritual fits effortlessly into your wellness routine.",
          ],
        },
      ],
    },
  },
};
