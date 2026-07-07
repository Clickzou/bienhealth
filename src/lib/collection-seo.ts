/**
 * Contenu éditorial SEO (long-form) affiché en bas des pages collections.
 * Structure Hn réelle (H2/H3) pour optimiser les mots-clés catégorie.
 * Bilingue FR / EN. Server-only (importé par la page collection).
 */
export type SeoBlock = { h: string; p: string[] };
export type SeoBody = { intro: string[]; blocks: SeoBlock[] };
export type CollectionSeo = SeoBody & { en: SeoBody };

/** Renvoie le corps SEO localisé (intro + blocks) d'une collection. */
export function localizeCollectionSeo(seo: CollectionSeo, lang: string): SeoBody {
  return lang === "en" ? seo.en : { intro: seo.intro, blocks: seo.blocks };
}

export const COLLECTION_SEO: Record<string, CollectionSeo> = {
  gummies: {
    intro: [
      "Les gummies BIEN réinventent le complément alimentaire du quotidien. Formulées avec des champignons fonctionnels et des plantes adaptogènes, ces gommes à mâcher offrent une alternative gourmande, efficace et facile à adopter aux traditionnelles gélules. Fabriqués en France, sans sucre, sans gluten et 100 % vegan, nos gummies adaptogènes accompagnent votre concentration, votre énergie et votre sérénité, jour après jour.",
    ],
    blocks: [
      {
        h: "Pourquoi choisir des gummies adaptogènes ?",
        p: [
          "La forme gummy n'est pas qu'une question de plaisir : elle est aussi plus efficace. En partie absorbés dès la bouche, les actifs agissent plus rapidement qu'une pilule classique. Surtout, l'observance est bien meilleure — la majorité des personnes terminent leur cure sous forme de gommes, contre à peine la moitié pour les comprimés.",
          "Nos gummies concentrent des adaptogènes reconnus (ashwagandha, rhodiola, safran) et des champignons fonctionnels (lion's mane, reishi, cordyceps), dosés selon la littérature scientifique. Une manière simple et naturelle de soutenir votre organisme face au stress, à la fatigue mentale et aux baisses d'énergie.",
        ],
      },
      {
        h: "CALM, FOCUS, POWER : à chaque besoin son gummy",
        p: [
          "Trois formules complémentaires composent notre gamme de gummies. CALM associe Reishi, Ashwagandha et Safran pour apaiser le stress et favoriser un sommeil réparateur. FOCUS réunit Lion's Mane, Rhodiola et L-Théanine pour la concentration et la clarté mentale, sans nervosité. POWER, enrichi en Cordyceps, Rhodiola Rosea et Panax Ginseng, soutient l'énergie et l'endurance, sans coup de barre.",
          "Vous hésitez ? Notre diagnostic personnalisé vous oriente en moins d'une minute vers la formule la plus adaptée à votre rythme et à vos objectifs.",
        ],
      },
      {
        h: "Comment intégrer les gummies à votre routine ?",
        p: [
          "Deux gummies par jour suffisent. À mâcher le matin pour un coup de focus ou d'énergie, ou le soir pour préparer un sommeil apaisé. Les adaptogènes révélant tout leur potentiel avec la régularité, une cure de 30 jours minimum est recommandée pour constater des effets durables. Naturels, vegan et sans sucre ajouté, nos gummies se glissent facilement dans le quotidien des athlètes de la vie.",
        ],
      },
    ],
    en: {
      intro: [
        "BIEN gummies reinvent the everyday food supplement. Formulated with functional mushrooms and adaptogenic plants, these chewable gummies offer a tasty, effective and easy-to-adopt alternative to traditional capsules. Made in France, sugar-free, gluten-free and 100% vegan, our adaptogenic gummies support your focus, energy and calm, day after day.",
      ],
      blocks: [
        {
          h: "Why choose adaptogenic gummies?",
          p: [
            "The gummy format isn't just about pleasure — it's also more effective. Partly absorbed in the mouth, the actives work faster than a classic pill. Above all, adherence is much better: most people finish their course in gummy form, versus barely half for tablets.",
            "Our gummies concentrate well-known adaptogens (ashwagandha, rhodiola, saffron) and functional mushrooms (lion's mane, reishi, cordyceps), dosed according to scientific literature. A simple, natural way to support your body against stress, mental fatigue and energy dips.",
          ],
        },
        {
          h: "CALM, FOCUS, POWER: a gummy for every need",
          p: [
            "Three complementary formulas make up our gummy range. CALM combines Reishi, Ashwagandha and Saffron to soothe stress and promote restorative sleep. FOCUS brings together Lion's Mane, Rhodiola and L-Theanine for focus and mental clarity, without jitters. POWER, enriched with Cordyceps, Rhodiola Rosea and Panax Ginseng, supports energy and stamina, without the crash.",
            "Not sure? Our personalised quiz points you in under a minute to the formula best suited to your lifestyle and goals.",
          ],
        },
        {
          h: "How to add gummies to your routine?",
          p: [
            "Two gummies a day are enough. Chew them in the morning for a focus or energy boost, or in the evening to prepare for restful sleep. As adaptogens reveal their full potential with regularity, a course of at least 30 days is recommended for lasting effects. Natural, vegan and with no added sugar, our gummies slip easily into the daily life of life's athletes.",
          ],
        },
      ],
    },
  },

  serenite: {
    intro: [
      "Stress chronique, tensions, nuits agitées : le quotidien met le système nerveux à rude épreuve. La collection Sérénité & Sommeil de BIEN rassemble des compléments alimentaires naturels pensés pour apaiser le mental, réduire le stress et retrouver un sommeil réparateur — sans accoutumance ni somnolence au réveil.",
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
        "Chronic stress, tension, restless nights: everyday life puts the nervous system to the test. BIEN's Calm & Sleep collection brings together natural food supplements designed to soothe the mind, reduce stress and restore restful sleep — without dependency or morning grogginess.",
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
      "Nos poudres réunissent le meilleur des champignons fonctionnels, des adaptogènes et du collagène dans un format tout-en-un. Une cuillère suffit pour transformer votre café, votre matcha ou votre smoothie en un véritable rituel bien-être. Clean, sans sucre et fabriquée en France, la poudre adaptogène BIEN simplifie votre routine tout en agissant sur plusieurs fronts : énergie, concentration, gestion du stress et éclat de la peau.",
    ],
    blocks: [
      {
        h: "La poudre, le format tout-en-un",
        p: [
          "Pourquoi multiplier les compléments quand une seule dose peut tout regrouper ? La forme poudre permet de concentrer plusieurs actifs cliniquement dosés en une prise quotidienne, sans avaler une poignée de gélules. Elle se marie naturellement à vos boissons et se fond dans votre routine du matin.",
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
          "Ajoutez une cuillère (incluse) à la boisson de votre choix, chaude ou froide, et mélangez — un mousseur donne une texture ultra-lisse. Au goût neutre et légèrement terreux, la poudre se prend idéalement le matin. Comptez une cure régulière de 30 jours pour profiter pleinement des bienfaits des adaptogènes et du collagène.",
        ],
      },
    ],
    en: {
      intro: [
        "Our powders bring together the best of functional mushrooms, adaptogens and collagen in an all-in-one format. One spoon is enough to turn your coffee, matcha or smoothie into a real wellness ritual. Clean, sugar-free and made in France, the BIEN adaptogenic powder simplifies your routine while acting on several fronts: energy, focus, stress management and skin radiance.",
      ],
      blocks: [
        {
          h: "Powder, the all-in-one format",
          p: [
            "Why pile up supplements when a single dose can bring everything together? The powder format concentrates several clinically dosed actives in one daily serving, without swallowing a handful of capsules. It naturally blends into your drinks and fits into your morning routine.",
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
            "Add one spoon (included) to the drink of your choice, hot or cold, and stir — a frother gives an ultra-smooth texture. With a neutral, slightly earthy taste, the powder is ideally taken in the morning. Allow a regular 30-day course to fully enjoy the benefits of adaptogens and collagen.",
          ],
        },
      ],
    },
  },

  concentration: {
    intro: [
      "Brouillard mental, difficultés à rester concentré, baisse de mémoire : la surcharge cognitive fait partie du quotidien. La collection Concentration & Clarté mentale de BIEN rassemble des compléments alimentaires naturels formulés pour soutenir l'attention, la mémoire et la clarté d'esprit — sans nervosité ni coup de barre.",
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
          "Deux gummies FOCUS le matin suffisent à installer une concentration plus intense et plus durable, sans crash. Beaucoup y trouvent une alternative — ou un complément — à leur second café. Comme toujours avec les adaptogènes, la régularité est la clé : une cure de 30 jours révèle tout leur potentiel.",
        ],
      },
    ],
    en: {
      intro: [
        "Mental fog, difficulty staying focused, memory dips: cognitive overload is part of everyday life. BIEN's Focus & Mental Clarity collection brings together natural food supplements formulated to support attention, memory and clarity of mind — without jitters or crashes.",
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
            "Two FOCUS gummies in the morning are enough to establish more intense and longer-lasting concentration, without a crash. Many find them an alternative — or a complement — to their second coffee. As always with adaptogens, regularity is key: a 30-day course reveals their full potential.",
          ],
        },
      ],
    },
  },

  "performance-et-vitalite": {
    intro: [
      "Coup de fatigue en milieu de journée, énergie en dents de scie, récupération difficile : le corps aussi a besoin de soutien. La collection Performance & Vitalité de BIEN réunit des compléments alimentaires naturels conçus pour renforcer l'énergie, l'endurance et la résistance à l'effort — sans excitants ni sensation de nervosité.",
    ],
    blocks: [
      {
        h: "De l'énergie durable, sans coup de barre",
        p: [
          "Nos formules privilégient une vitalité saine et progressive plutôt qu'un shot d'énergie suivi d'un crash. Les adaptogènes aident l'organisme à mieux gérer l'effort physique et mental, pour tenir la distance, du matin au soir.",
        ],
      },
      {
        h: "Cordyceps, Rhodiola Rosea et Panax Ginseng",
        p: [
          "Le gummy POWER associe trois actifs de la performance. Le Cordyceps, champignon prisé pour l'énergie et l'endurance. La Rhodiola Rosea, adaptogène anti-fatigue. Et le Panax Ginseng, référence de la vitalité. Un vrai coup de boost, sans contre-coup. La poudre MushGlow complète cette routine en soutenant l'énergie globale et la récupération.",
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
        "A mid-day slump, up-and-down energy, difficult recovery: the body needs support too. BIEN's Performance & Vitality collection brings together natural food supplements designed to boost energy, stamina and resistance to effort — without stimulants or any jittery feeling.",
      ],
      blocks: [
        {
          h: "Lasting energy, without the crash",
          p: [
            "Our formulas favour healthy, gradual vitality rather than an energy shot followed by a crash. Adaptogens help the body better manage physical and mental effort, to go the distance, from morning to evening.",
          ],
        },
        {
          h: "Cordyceps, Rhodiola Rosea and Panax Ginseng",
          p: [
            "The POWER gummy combines three performance actives. Cordyceps, a mushroom prized for energy and stamina. Rhodiola Rosea, an anti-fatigue adaptogen. And Panax Ginseng, a benchmark for vitality. A real boost, without the rebound. The MushGlow powder complements this routine by supporting overall energy and recovery.",
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
      "Une peau éclatante et des cheveux forts commencent de l'intérieur. La collection Beauté & Bien-être de BIEN rassemble des compléments alimentaires naturels riches en collagène et en actifs antioxydants, pour nourrir la peau, soutenir les cheveux et les ongles, et retrouver un équilibre global — le tout dans une routine simple et gourmande.",
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
          "Notre poudre MushGlow contient du collagène de membrane d'œuf, reconnu pour améliorer l'hydratation, l'élasticité et l'éclat de la peau, ainsi que du Chaga, champignon aux puissantes propriétés antioxydantes qui protègent les cellules du stress oxydatif. Le gummy CALM complète cet équilibre en apaisant le stress, souvent responsable des déséquilibres cutanés.",
        ],
      },
      {
        h: "Un rituel beauté au quotidien",
        p: [
          "Une cuillère de MushGlow chaque matin dans votre boisson, en cure régulière, pour révéler l'éclat naturel de votre peau au fil des semaines. Vegan, sans sucre et fabriqué en France, ce rituel beauté s'intègre sans effort à votre routine bien-être.",
        ],
      },
    ],
    en: {
      intro: [
        "Radiant skin and strong hair start from within. BIEN's Beauty & Wellbeing collection brings together natural food supplements rich in collagen and antioxidant actives, to nourish the skin, support hair and nails, and restore overall balance — all in a simple, enjoyable routine.",
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
            "Our MushGlow powder contains eggshell-membrane collagen, recognised for improving skin hydration, elasticity and radiance, as well as Chaga, a mushroom with powerful antioxidant properties that protect cells from oxidative stress. The CALM gummy completes this balance by soothing stress, which is often responsible for skin imbalances.",
          ],
        },
        {
          h: "A daily beauty ritual",
          p: [
            "One spoon of MushGlow every morning in your drink, as a regular course, to reveal your skin's natural radiance over the weeks. Vegan, sugar-free and made in France, this beauty ritual fits effortlessly into your wellness routine.",
          ],
        },
      ],
    },
  },
};
