/**
 * Contenu éditorial du blog (SEO).
 * Server-only. Les paragraphes/listes acceptent du HTML léger maîtrisé
 * (<strong>, <a href> internes) — contenu de confiance rédigé en interne.
 *
 * `lang` réservé pour l'internationalisation future (articles FR pour l'instant).
 */
export type Block = { h2: string } | { h3: string } | { p: string } | { ul: string[] };

/** Champs traduisibles d'un article (le reste — slug, date, cover… — est commun). */
export type ArticleL10n = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  intro: string;
  blocks: Block[];
  faq: { q: string; a: string }[];
};

export type Article = ArticleL10n & {
  slug: string;
  date: string; // ISO
  readingMinutes: number;
  cover: string;
  en?: ArticleL10n; // version anglaise (repli FR si absente)
};

const l = (path: string) => `/fr${path}`; // liens internes FR
const le = (path: string) => `/en${path}`; // liens internes EN

/** Renvoie l'article avec ses champs localisés (repli FR si pas de version EN). */
export function localizeArticle(a: Article, lang: string): Article {
  return lang === "en" && a.en ? { ...a, ...a.en } : a;
}

export const ARTICLES: Article[] = [
  {
    slug: "champignons-adaptogenes-guide-complet",
    title: "Champignons adaptogènes : bienfaits et guide complet",
    metaTitle: "Champignons adaptogènes : le guide complet",
    metaDescription:
      "Lion's mane, reishi, cordyceps, chaga : ce que fait chaque champignon adaptogène, comment le choisir, à quelle dose et avec quelles précautions.",
    excerpt:
      "Lion's mane, reishi, cordyceps, chaga : bienfaits, différences, dosages et précautions. Le guide complet pour choisir le bon champignon adaptogène.",
    category: "Ingrédients & science",
    date: "2026-07-28",
    readingMinutes: 10,
    cover: "/brand/blog/cover-adaptogenes.jpg",
    intro:
      "Les <strong>champignons adaptogènes</strong> — lion's mane, reishi, cordyceps, chaga — sont des champignons dits fonctionnels : on ne les mange pas pour leur goût mais pour les composés qu'ils contiennent. Chacun a son terrain de prédilection, et les confondre est l'erreur la plus courante. Ce guide explique ce que fait chacun, comment reconnaître un extrait de qualité, à quelle dose et pendant combien de temps, et où s'arrête ce qu'on peut honnêtement en dire.",
    blocks: [
      { h2: "Ce qu'est un champignon adaptogène" },
      { p: "Un <a href=\"" + l("/blog/quest-ce-quun-adaptogene") + "\">adaptogène</a> est une substance naturelle qui aide l'organisme à mieux composer avec les contraintes, en favorisant un retour à l'équilibre plutôt qu'en stimulant. Appliqué aux champignons, le terme désigne une poignée d'espèces non comestibles au sens culinaire, utilisées depuis des siècles en Asie et consommées aujourd'hui sous forme d'extraits." },
      { p: "Leur particularité tient à leur paroi cellulaire, riche en <strong>bêta-glucanes</strong> — des polysaccharides qui font l'objet de recherches, notamment sur l'immunité. C'est d'ailleurs sur leur teneur en bêta-glucanes que se juge la qualité d'un extrait, bien plus que sur le poids affiché." },

      { h2: "Lion's mane : la mémoire et la clarté mentale" },
      { p: "<em>Hericium erinaceus</em>, ou crinière de lion, est le plus étudié sur le versant cognitif. Les travaux référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> s'intéressent à ses composés, hericénones et érinacines, sur des protocoles de huit à seize semaines." },
      { p: "C'est celui qu'on associe à la concentration et à la clarté d'esprit. Il se prend le matin ou en début d'après-midi, sans effet stimulant de type caféine. Détails et dosages dans notre fiche <a href=\"" + l("/blog/lions-mane") + "\">Lion's Mane</a>." },

      { h2: "Reishi : la détente et le sommeil" },
      { p: "<em>Ganoderma lucidum</em> est appelé « champignon de l'immortalité » dans la tradition chinoise. Amer, impossible à consommer en cuisine, il se prend en extrait ou en infusion, plutôt le soir." },
      { p: "C'est le champignon de la fin de journée : on l'associe à l'apaisement et à la préparation au sommeil, souvent en complément d'une plante comme l'ashwagandha. Il entre dans notre formule <a href=\"" + l("/products/calm") + "\">CALM</a>." },

      { h2: "Cordyceps : l'endurance et le souffle" },
      { p: "<em>Cordyceps sinensis</em>, aujourd'hui cultivé sous la forme <em>Cordyceps militaris</em>, est traditionnellement associé à l'endurance et à l'oxygénation des tissus. C'est le plus étudié des quatre sur le terrain de la performance physique." },
      { p: "Il se prend le matin ou avant l'effort, jamais le soir. C'est l'actif principal de nos gummies <a href=\"" + l("/products/power") + "\">POWER</a>, et il est détaillé dans notre comparatif <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps, Chaga</a>." },

      { h2: "Chaga : l'antioxydant" },
      { p: "<em>Inonotus obliquus</em> pousse sur les bouleaux des forêts boréales. Il présente une teneur remarquable en composés antioxydants, ce qui explique sa place dans les formules orientées beauté et vitalité — dont notre supermix <a href=\"" + l("/products/mushglow") + "\">MUSHGLOW</a>." },
      { p: "Un point de vigilance rarement mentionné : le chaga est riche en oxalates, ce qui le déconseille aux personnes ayant des antécédents de calculs rénaux." },

      { h2: "Comment reconnaître un extrait de qualité" },
      { p: "C'est là que se joue l'essentiel, et c'est là que les produits diffèrent le plus. Quatre critères permettent de trancher :" },
      {
        ul: [
          "<strong>La partie utilisée</strong> : le carpophore (le champignon lui-même) plutôt que le mycélium sur grain, beaucoup moins concentré en bêta-glucanes.",
          "<strong>Le taux de bêta-glucanes</strong>, affiché en pourcentage. S'il n'est pas indiqué, c'est rarement bon signe.",
          "<strong>Le ratio d'extraction</strong> (10:1, 15:1…) : il dit combien de matière première a servi à produire l'extrait.",
          "<strong>L'origine et les analyses</strong> : les champignons concentrent les métaux lourds du substrat, d'où l'importance des contrôles. Les nôtres sont documentés sur la page <a href=\"" + l("/certifications") + "\">conformité</a>.",
        ],
      },
      { p: "Méfiez-vous de la mention « poudre de champignon » sans autre précision : elle recouvre aussi bien un extrait concentré qu'un substrat broyé contenant très peu d'actifs." },

      { h2: "Dosage, durée, moment de la prise" },
      { p: "Les protocoles d'étude portent le plus souvent sur des prises quotidiennes de huit à douze semaines. En pratique, une cure d'un mois minimum est le seuil en deçà duquel il ne se passe généralement rien de perceptible." },
      { p: "Le moment compte : lion's mane et cordyceps le matin, reishi le soir, chaga indifféremment. Et la régularité prime sur la dose — mieux vaut une prise quotidienne modeste qu'une forte dose deux fois par semaine." },

      { h2: "Ce que la réglementation permet d'affirmer" },
      { p: "Les allégations de santé sont encadrées par le règlement européen (CE) n° 1924/2006, et celles portant sur les plantes et champignons restent <strong>en attente d'évaluation</strong> par l'EFSA — consultables au <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen des allégations</a>." },
      { p: "Concrètement : un complément alimentaire ne peut revendiquer aucune propriété de prévention, de traitement ou de guérison. Les formulations honnêtes parlent de contribution au fonctionnement normal de l'organisme. Toute marque qui promet de « soigner » quoi que ce soit est en infraction." },

      { h2: "Précautions" },
      { p: "Les champignons adaptogènes sont déconseillés aux femmes enceintes et allaitantes. Le reishi peut interagir avec les traitements anticoagulants et antihypertenseurs ; le chaga est déconseillé en cas d'antécédents de calculs rénaux et avec les anticoagulants. En cas de traitement en cours ou de maladie auto-immune, demandez l'avis d'un professionnel de santé." },
      { p: "Ils ne remplacent ni une alimentation variée et équilibrée, ni un mode de vie sain, ni un avis médical." },

      { h2: "Lequel choisir pour commencer" },
      { p: "Partez du besoin : clarté mentale et concentration → lion's mane ; sommeil et tension nerveuse → reishi ; énergie physique et endurance → cordyceps ; peau et vitalité → chaga, associé au collagène." },
      { p: "Si vous hésitez, le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> vous oriente en une minute, et la <a href=\"" + l("/boutique") + "\">boutique</a> présente les quatre formules avec leur composition détaillée." },
    ],
    faq: [
      { q: "Quel est le meilleur champignon adaptogène ?", a: "Il n'y en a pas : chacun a son terrain. Lion's mane pour la clarté mentale, reishi pour la détente et le sommeil, cordyceps pour l'endurance, chaga pour son apport antioxydant. Le bon choix part du besoin." },
      { q: "Peut-on prendre plusieurs champignons ensemble ?", a: "Oui, c'est la logique des formules combinées. Évitez seulement de cumuler plusieurs produits contenant le même actif, pour ne pas dépasser les doses journalières." },
      { q: "Combien de temps dure une cure ?", a: "Un à trois mois, suivis d'une pause. En dessous d'un mois, il ne se passe généralement rien de perceptible : les études portent sur huit à douze semaines." },
      { q: "Comment reconnaître un bon extrait ?", a: "Carpophore plutôt que mycélium sur grain, taux de bêta-glucanes affiché, ratio d'extraction indiqué, et analyses de métaux lourds disponibles. L'absence de ces informations est en soi un signal." },
      { q: "Les champignons adaptogènes sont-ils dangereux ?", a: "Non aux doses usuelles, mais ils ne sont pas anodins : déconseillés pendant la grossesse et l'allaitement, interactions possibles avec les anticoagulants pour le reishi et le chaga, prudence en cas de maladie auto-immune." },
      { q: "À quel moment de la journée les prendre ?", a: "Lion's mane et cordyceps le matin, reishi le soir, chaga indifféremment. La régularité compte davantage que la dose." },
    ],
    en: {
      title: "Adaptogenic mushrooms: benefits and complete guide",
      metaTitle: "Adaptogenic mushrooms: the complete guide",
      metaDescription: "Lion's mane, reishi, cordyceps, chaga: what each adaptogenic mushroom does, how to choose one, at what dose and with which precautions.",
      excerpt: "Lion's mane, reishi, cordyceps, chaga: benefits, differences, doses and precautions. The complete guide to choosing the right adaptogenic mushroom.",
      category: "Ingredients & science",
      intro: "<strong>Adaptogenic mushrooms</strong> — lion's mane, reishi, cordyceps, chaga — are so-called functional mushrooms: you don't eat them for their taste but for the compounds they contain. Each has its own ground, and confusing them is the most common mistake. This guide explains what each one does, how to recognise a quality extract, at what dose and for how long, and where honest claims stop.",
      blocks: [
        { h2: "What an adaptogenic mushroom is" },
        { p: "An <a href=\"" + le("/blog/quest-ce-quun-adaptogene") + "\">adaptogen</a> is a natural substance that helps the body cope with demands, favouring a return to balance rather than stimulating. Applied to mushrooms, the term covers a handful of species that aren't culinary, used for centuries in Asia and consumed today as extracts." },
        { p: "Their particularity lies in their cell wall, rich in <strong>beta-glucans</strong> — polysaccharides under research, notably for immunity. Extract quality is judged on beta-glucan content far more than on the weight printed on the label." },

        { h2: "Lion's mane: memory and mental clarity" },
        { p: "<em>Hericium erinaceus</em>, or lion's mane, is the most studied on the cognitive side. The work indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> looks at its compounds, hericenones and erinacines, over eight to sixteen week protocols." },
        { p: "It's the one associated with focus and mental clarity. Take it in the morning or early afternoon; it has no caffeine-like stimulant effect. Details and doses in our page on <a href=\"" + le("/blog/lions-mane") + "\">Lion's Mane</a>." },

        { h2: "Reishi: relaxation and sleep" },
        { p: "<em>Ganoderma lucidum</em> is called the «\u00a0mushroom of immortality\u00a0» in Chinese tradition. Bitter and impossible to cook with, it's taken as an extract or infusion, rather in the evening." },
        { p: "It's the end-of-day mushroom: associated with calming and preparing for sleep, often alongside a plant such as ashwagandha. It's part of our <a href=\"" + le("/products/calm") + "\">CALM</a> formula." },

        { h2: "Cordyceps: endurance and breath" },
        { p: "<em>Cordyceps sinensis</em>, today grown as <em>Cordyceps militaris</em>, is traditionally associated with endurance and tissue oxygenation. It's the most studied of the four on physical performance." },
        { p: "Take it in the morning or before exercise, never in the evening. It's the main active in our <a href=\"" + le("/products/power") + "\">POWER</a> gummies, and is covered in our comparison of <a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps and Chaga</a>." },

        { h2: "Chaga: the antioxidant" },
        { p: "<em>Inonotus obliquus</em> grows on birches in boreal forests. It has a remarkable antioxidant compound content, which explains its place in beauty and vitality formulas — including our <a href=\"" + le("/products/mushglow") + "\">MUSHGLOW</a> supermix." },
        { p: "One rarely mentioned caveat: chaga is high in oxalates, which makes it unsuitable for people with a history of kidney stones." },

        { h2: "How to recognise a quality extract" },
        { p: "This is where most of it is decided, and where products differ most. Four criteria settle the question:" },
        {
          ul: [
            "<strong>The part used</strong>: the fruiting body rather than grain-grown mycelium, which is far less concentrated in beta-glucans.",
            "<strong>The beta-glucan content</strong>, shown as a percentage. If it isn't stated, that's rarely a good sign.",
            "<strong>The extraction ratio</strong> (10:1, 15:1…): it tells you how much raw material went into the extract.",
            "<strong>Origin and testing</strong>: mushrooms concentrate heavy metals from their substrate, hence the importance of controls. Ours are documented on our <a href=\"" + le("/certifications") + "\">compliance</a> page.",
          ],
        },
        { p: "Be wary of «\u00a0mushroom powder\u00a0» with no further detail: it covers both a concentrated extract and ground substrate containing very little active material." },

        { h2: "Dose, duration, timing" },
        { p: "Study protocols mostly involve daily intake over eight to twelve weeks. In practice, a one-month course is the threshold below which nothing perceptible generally happens." },
        { p: "Timing matters: lion's mane and cordyceps in the morning, reishi in the evening, chaga any time. And regularity beats dose — a modest daily intake does more than a large dose twice a week." },

        { h2: "What regulation allows you to claim" },
        { p: "Health claims are governed by EU regulation (EC) No 1924/2006, and those relating to plants and mushrooms remain <strong>pending evaluation</strong> by EFSA — searchable in the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register of claims</a>." },
        { p: "In practice: a food supplement cannot claim any property of preventing, treating or curing. Honest wording speaks of contributing to the normal function of the body. Any brand promising to «\u00a0cure\u00a0» anything is in breach." },

        { h2: "Precautions" },
        { p: "Adaptogenic mushrooms are not advised during pregnancy or breastfeeding. Reishi may interact with anticoagulant and antihypertensive treatments; chaga is not advised with a history of kidney stones or alongside anticoagulants. With ongoing treatment or an autoimmune condition, seek advice from a healthcare professional." },
        { p: "They replace neither a varied, balanced diet, nor a healthy lifestyle, nor medical advice." },

        { h2: "Which one to start with" },
        { p: "Start from the need: mental clarity and focus → lion's mane; sleep and nervous tension → reishi; physical energy and endurance → cordyceps; skin and vitality → chaga, paired with collagen." },
        { p: "If you're hesitating, the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> points you in a minute, and the <a href=\"" + le("/boutique") + "\">shop</a> shows the four formulas with their full composition." },
      ],
      faq: [
        { q: "Which adaptogenic mushroom is best?", a: "There isn't one: each has its ground. Lion's mane for mental clarity, reishi for calm and sleep, cordyceps for endurance, chaga for its antioxidant contribution. The right choice starts from the need." },
        { q: "Can you take several mushrooms together?", a: "Yes, that's the logic of combined formulas. Just avoid stacking several products containing the same active, so as not to exceed daily doses." },
        { q: "How long should a course last?", a: "One to three months, followed by a break. Below a month, nothing perceptible usually happens: studies run eight to twelve weeks." },
        { q: "How do you spot a good extract?", a: "Fruiting body rather than grain-grown mycelium, stated beta-glucan content, published extraction ratio, and available heavy-metal testing. The absence of that information is itself a signal." },
        { q: "Are adaptogenic mushrooms dangerous?", a: "Not at usual doses, but they aren't harmless: not advised during pregnancy and breastfeeding, possible interactions with anticoagulants for reishi and chaga, and caution with autoimmune conditions." },
        { q: "When in the day should you take them?", a: "Lion's mane and cordyceps in the morning, reishi in the evening, chaga any time. Regularity matters more than dose." },
      ],
    },
  },
  {
    slug: "gerer-le-stress-naturellement",
    title: "Comment gérer le stress naturellement : 7 solutions qui marchent",
    metaTitle: "Gérer le stress naturellement : 7 solutions",
    metaDescription:
      "Respiration, sommeil, alimentation, plantes adaptogènes : 7 leviers concrets pour gérer le stress naturellement, avec les dosages et les précautions à connaître.",
    excerpt:
      "Respiration, activité physique, sommeil, adaptogènes… 7 solutions naturelles et concrètes pour réduire le stress et retrouver votre sérénité au quotidien.",
    category: "Sommeil & stress",
    date: "2026-07-05",
    readingMinutes: 9,
    cover: "/brand/blog/cover-stress.jpg",
    intro:
      "Si vous ne deviez retenir qu'une chose : le stress se régule par des gestes quotidiens répétés, pas par une solution unique. La respiration agit en quelques minutes, l'activité physique et le sommeil en quelques jours, les plantes adaptogènes en quelques semaines. Voici sept leviers pour <strong>gérer le stress naturellement</strong>, ce qu'on sait de leur efficacité, et les précautions qui vont avec.",
    blocks: [
      { h2: "Ce qui se passe dans votre corps quand vous êtes stressé" },
      { p: "Le stress n'est pas une faiblesse de caractère, c'est une réaction physiologique. Face à une contrainte, l'organisme libère de l'adrénaline puis du <strong>cortisol</strong>, une hormone qui mobilise l'énergie disponible : le rythme cardiaque s'accélère, la vigilance monte, la digestion ralentit. Ce mécanisme est utile — il nous a permis de survivre — et parfaitement sain lorsqu'il est ponctuel." },
      { p: "Le problème commence quand la contrainte ne s'arrête plus. L'<a href=\"https://www.inserm.fr/dossier/stress/\" target=\"_blank\" rel=\"noopener noreferrer\">Inserm</a> distingue nettement le stress aigu, adaptatif, du stress chronique, qui entretient un niveau de cortisol élevé en continu. C'est ce second cas qui fatigue : sommeil fragmenté, irritabilité, difficulté à récupérer, fringales sucrées en fin de journée." },
      { p: "Comprendre ce mécanisme change la façon d'agir. On ne « supprime » pas le stress : on aide l'organisme à revenir plus vite à son état de repos après chaque pic. Tous les leviers ci-dessous vont dans ce sens. Pour aller plus loin sur l'hormone elle-même, lisez notre article sur le <a href=\"" + l("/blog/cortisol-stress") + "\">cortisol et sa régulation</a>." },

      { h2: "1. Respirer : le seul levier qui agit en trois minutes" },
      { p: "La respiration est le raccourci le plus direct vers le système nerveux parasympathique, celui qui commande le retour au calme. Elle a un avantage décisif sur tout le reste : elle est gratuite, disponible partout, et son effet se ressent immédiatement." },
      { h3: "Le protocole de cohérence cardiaque" },
      { p: "La méthode la plus documentée tient en trois chiffres : <strong>3 fois par jour, 6 respirations par minute, pendant 5 minutes</strong>. Concrètement : inspirez 5 secondes par le nez, expirez 5 secondes par la bouche, sans forcer, en laissant le ventre se gonfler à l'inspiration." },
      { p: "Le moment compte autant que la technique. Une session au réveil pose la journée, une avant le déjeuner coupe la montée de tension du matin, une en fin d'après-midi évite d'emporter le stress professionnel à la maison. Si vous ne devez en garder qu'une, choisissez celle de 17 h : c'est elle qui protège la soirée et l'endormissement." },
      { h3: "Quand la respiration ne suffit pas" },
      { p: "Un exercice respiratoire calme une montée d'anxiété ; il ne règle pas une situation de surcharge durable. Si vous devez y recourir plusieurs fois par jour pendant des semaines, le problème est en amont — charge de travail, conflit, épuisement — et c'est là qu'il faut agir." },

      { h2: "2. Bouger, même peu, même mal" },
      { p: "L'activité physique fait baisser le cortisol circulant et libère des endorphines. L'effet est mesurable dès la séance suivante et se cumule avec la régularité. Il n'est pas question de performance : la marche rapide, le vélo du quotidien, le jardinage ou une séance de yoga produisent le même bénéfice sur l'équilibre nerveux." },
      { p: "L'<a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> recommande au moins 30 minutes d'activité dynamique cinq fois par semaine chez l'adulte, et surtout de rompre les périodes assises toutes les deux heures. Sur le stress, c'est cette régularité qui compte, pas l'intensité." },
      { p: "Un point de vigilance : l'entraînement intensif tardif élève la température corporelle et le cortisol au moment où le corps devrait redescendre. Si vous vous entraînez fort, essayez de terminer trois heures avant le coucher. Les sportifs trouveront des repères plus complets dans notre guide des <a href=\"" + l("/blog/complement-recuperation-sport") + "\">compléments pour la récupération sportive</a>." },

      { h2: "3. Protéger le sommeil, parce que tout en dépend" },
      { p: "Stress et sommeil s'alimentent l'un l'autre : le stress retarde l'endormissement, et la dette de sommeil augmente la réactivité au stress dès le lendemain. C'est le cercle le plus fréquent, et souvent le premier à casser." },
      { p: "Trois réglages font l'essentiel du travail :" },
      {
        ul: [
          "<strong>Des horaires stables</strong>, y compris le week-end : l'horloge biologique se cale sur la régularité, pas sur la durée.",
          "<strong>Une chambre fraîche</strong>, entre 18 et 19 °C : la baisse de température corporelle est le signal d'endormissement.",
          "<strong>Une heure sans écran</strong> avant le coucher, ou à défaut sans contenu qui active (messagerie professionnelle, actualités, réseaux sociaux).",
        ],
      },
      { p: "Ces trois points paraissent banals ; ils sont pourtant plus efficaces que n'importe quel complément si le terrain n'est pas préparé. Notre guide <a href=\"" + l("/blog/mieux-dormir-naturellement") + "\">mieux dormir naturellement</a> détaille les huit leviers du sommeil, y compris la question de la lumière et des siestes." },

      { h2: "4. Ajuster l'alimentation, surtout le soir" },
      { p: "Aucun aliment ne « traite » le stress, mais certains choix pèsent nettement sur l'équilibre nerveux et la qualité des nuits." },
      { h3: "Ce qui aggrave" },
      { p: "La caféine a une demi-vie de cinq à six heures : un café à 16 h agit encore à 22 h. L'alcool, souvent utilisé pour se détendre, fragmente la seconde moitié de nuit et dégrade la récupération. Les pics de sucre rapide, enfin, entretiennent les variations d'humeur en fin de journée." },
      { h3: "Ce qui soutient" },
      { p: "Le <strong>magnésium</strong> contribue au fonctionnement normal du système nerveux et à la réduction de la fatigue — c'est l'une des rares allégations de santé autorisées par le <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen des allégations</a>. On le trouve dans les fruits à coque, le chocolat noir, les légumineuses et les eaux minérales riches en magnésium." },
      { p: "Les oméga-3 (poissons gras, huile de colza, noix) et les fibres complètent utilement le tableau. L'idée n'est pas de manger « anti-stress », mais d'éviter que l'alimentation ne travaille contre vous." },

      { h2: "5. S'appuyer sur les plantes et champignons adaptogènes" },
      { p: "Les <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogènes</a> forment une famille de plantes et de champignons dont la caractéristique commune est d'aider l'organisme à mieux composer avec les contraintes, sans effet stimulant direct. Leur action est progressive : on parle de semaines, pas de minutes." },
      { h3: "Ashwagandha" },
      { p: "C'est la plante la plus étudiée du groupe sur le sujet du stress. Plusieurs essais cliniques référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=ashwagandha+stress+cortisol\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> se sont intéressés à son effet sur le cortisol salivaire chez des adultes soumis à un stress chronique, sur des durées de 8 à 12 semaines. Les extraits utilisés sont généralement standardisés en withanolides. Notre fiche <a href=\"" + l("/blog/ashwagandha") + "\">ashwagandha : bienfaits, dosage et précautions</a> détaille les formes et les contre-indications." },
      { h3: "Reishi" },
      { p: "Champignon traditionnellement associé à la détente, le reishi est apprécié pour son usage en fin de journée. Il s'intègre facilement à une routine du soir, en infusion ou en complément. Les trois champignons majeurs sont comparés dans notre article <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps, Chaga</a>." },
      { h3: "Safran" },
      { p: "Le safran est étudié pour son effet sur l'humeur. Il présente l'intérêt d'être actif à faible dose, ce qui le rend facile à associer sans alourdir une formule." },
      { p: "Ces trois actifs sont réunis dans nos gummies <a href=\"" + l("/products/calm") + "\">CALM</a>, pensés pour la sérénité et le sommeil. Comme pour tout adaptogène, comptez une cure d'au moins 30 jours : c'est la régularité qui fait la différence, pas la dose ponctuelle." },

      { h2: "6. Ménager de vraies pauses, pas des micro-distractions" },
      { p: "Consulter son téléphone entre deux réunions n'est pas une pause : le cerveau reste en traitement d'information. Une vraie pause suppose un changement de registre — marcher dehors, regarder loin, ne rien faire, méditer quelques minutes." },
      { p: "Dix minutes de pause réelle valent mieux qu'une heure de temps flottant devant un écran. C'est aussi le moment où l'attention se reconstitue : si vos journées sont longues, notre article sur le <a href=\"" + l("/blog/brouillard-mental") + "\">brouillard mental</a> explique pourquoi la fatigue cognitive et le stress se nourrissent mutuellement." },

      { h2: "7. Installer une routine, l'arme la plus sous-estimée" },
      { p: "Le système nerveux aime la prévisibilité. Une séquence répétée chaque soir — même très courte — devient un signal d'apaisement par simple conditionnement : une tisane, cinq minutes de respiration, deux gummies CALM une heure avant le coucher, lumière tamisée." },
      { p: "L'important n'est pas le contenu de la routine mais sa stabilité. Une routine tenue quatre soirs sur sept produit plus d'effet qu'un protocole parfait abandonné au bout de trois jours." },

      { h2: "Quand consulter un professionnel de santé" },
      { p: "Les leviers naturels ont un périmètre. Certains signaux justifient un avis médical sans attendre : un stress qui dure depuis plus de plusieurs semaines sans amélioration, une insomnie installée, des crises d'angoisse, une perte d'appétit ou de poids marquée, des idées noires, ou un retentissement net sur le travail et les relations." },
      { p: "Les compléments alimentaires ne sont pas des médicaments : ils ne préviennent, ne traitent et ne guérissent aucune maladie. Ils s'inscrivent dans une hygiène de vie et ne remplacent ni un avis médical, ni un traitement en cours. Les personnes enceintes ou allaitantes, les personnes sous traitement (notamment thyroïdien, anxiolytique ou anticoagulant) et les personnes atteintes d'une maladie auto-immune doivent demander l'avis d'un professionnel de santé avant toute prise d'adaptogènes." },

      { h2: "Par où commencer concrètement" },
      { p: "Si vous partez de zéro, prenez les leviers dans cet ordre : la respiration dès aujourd'hui, parce qu'elle ne coûte rien et agit tout de suite ; les horaires de sommeil cette semaine, parce que tout en dépend ; l'alimentation du soir la semaine suivante ; les adaptogènes en parallèle, sur une cure d'un mois, pour laisser le temps aux effets de s'installer." },
      { p: "Pour savoir quelle formule correspond à votre situation, faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> — une minute de questions — ou parcourez la collection <a href=\"" + l("/collections/serenite") + "\">Sérénité &amp; Sommeil</a>." },
    ],
    faq: [
      { q: "Quelle plante pour gérer le stress ?", a: "L'ashwagandha est la plus étudiée sur ce sujet, notamment pour son action sur le cortisol. Le reishi et le safran la complètent bien : ces trois actifs sont réunis dans les gummies CALM de BIEN. Comptez une cure d'au moins 30 jours." },
      { q: "Combien de temps avant de ressentir les effets ?", a: "Cela dépend du levier. La respiration agit en quelques minutes, l'activité physique et le sommeil en quelques jours, les adaptogènes en trois à quatre semaines de prise régulière." },
      { q: "Le stress peut-il empêcher de dormir ?", a: "Oui, c'est l'une des premières causes de difficulté d'endormissement, et la relation fonctionne dans les deux sens : moins on dort, plus on est réactif au stress le lendemain. Agir sur le stress améliore souvent directement la qualité des nuits." },
      { q: "Peut-on prendre des adaptogènes tous les jours ?", a: "Les adaptogènes s'utilisent en cure, généralement d'un à trois mois, suivie d'une pause. Respectez la dose journalière indiquée et demandez l'avis d'un professionnel de santé en cas de traitement en cours, de grossesse ou d'allaitement." },
      { q: "Le magnésium aide-t-il vraiment contre le stress ?", a: "Le magnésium contribue au fonctionnement normal du système nerveux et à la réduction de la fatigue — deux allégations autorisées au niveau européen. Ce n'est pas un anti-stress à proprement parler, mais une carence entretient la fatigue nerveuse." },
      { q: "Quand faut-il consulter ?", a: "Si le stress dure plusieurs semaines sans amélioration, s'il s'accompagne d'insomnie installée, de crises d'angoisse, d'une perte d'appétit marquée ou d'idées noires, un avis médical s'impose sans attendre." },
    ],
    en: {
      title: "How to manage stress naturally: 7 solutions that work",
      metaTitle: "Manage stress naturally: 7 solutions",
      metaDescription: "Breathing, sleep, diet, adaptogenic plants: 7 concrete levers to manage stress naturally, with the doses and precautions you should know.",
      excerpt: "Breathing, physical activity, sleep, adaptogens… 7 natural, concrete solutions to reduce stress and regain your everyday calm.",
      category: "Sleep & stress",
      intro: "If you only remember one thing: stress is managed through repeated daily habits, not a single fix. Breathing works within minutes, exercise and sleep within days, adaptogenic plants within weeks. Here are seven levers to <strong>manage stress naturally</strong>, what we know about how well they work, and the precautions that come with them.",
      blocks: [
        { h2: "What happens in your body when you're stressed" },
        { p: "Stress isn't a character flaw, it's a physiological response. Faced with a demand, the body releases adrenaline and then <strong>cortisol</strong>, a hormone that mobilises available energy: heart rate rises, alertness increases, digestion slows. This mechanism is useful — it kept our species alive — and perfectly healthy when it's occasional." },
        { p: "The trouble starts when the demand never stops. France's <a href=\"https://www.inserm.fr/dossier/stress/\" target=\"_blank\" rel=\"noopener noreferrer\">Inserm</a> draws a clear line between acute, adaptive stress and chronic stress, which keeps cortisol elevated continuously. That second case is what wears you down: fragmented sleep, irritability, poor recovery, late-afternoon sugar cravings." },
        { p: "Understanding this changes how you act. You don't «\u00a0remove\u00a0» stress: you help the body return to rest faster after each peak. Every lever below works towards that. For more on the hormone itself, read our article on <a href=\"" + le("/blog/cortisol-stress") + "\">cortisol and how to regulate it</a>." },

        { h2: "1. Breathing: the only lever that works in three minutes" },
        { p: "Breathing is the most direct shortcut to the parasympathetic nervous system, the one that commands the return to calm. It has a decisive advantage over everything else: it's free, available anywhere, and its effect is felt immediately." },
        { h3: "The cardiac coherence protocol" },
        { p: "The best-documented method comes down to three numbers: <strong>3 times a day, 6 breaths per minute, for 5 minutes</strong>. In practice: breathe in through the nose for 5 seconds, out through the mouth for 5 seconds, without forcing, letting the belly rise on the inhale." },
        { p: "Timing matters as much as technique. A morning session sets up the day, one before lunch cuts the morning build-up, and one in the late afternoon stops you carrying work stress home. If you keep only one, choose 5 pm: that's the one that protects your evening and your sleep onset." },
        { h3: "When breathing isn't enough" },
        { p: "A breathing exercise calms a spike of anxiety; it doesn't fix sustained overload. If you need it several times a day for weeks, the problem lies upstream — workload, conflict, exhaustion — and that's where to act." },

        { h2: "2. Move, even a little, even badly" },
        { p: "Physical activity lowers circulating cortisol and releases endorphins. The effect is measurable from the next session and compounds with regularity. Performance isn't the point: brisk walking, everyday cycling, gardening or a yoga session all produce the same benefit for nervous balance." },
        { p: "France's food safety agency <a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> recommends at least 30 minutes of dynamic activity five times a week for adults, and above all breaking up sitting time every two hours. For stress, it's that regularity that counts, not intensity." },
        { p: "One caveat: hard late training raises body temperature and cortisol just when the body should be winding down. If you train hard, try to finish three hours before bed. Athletes will find fuller guidance in our guide to <a href=\"" + le("/blog/complement-recuperation-sport") + "\">supplements for sports recovery</a>." },

        { h2: "3. Protect your sleep, because everything depends on it" },
        { p: "Stress and sleep feed each other: stress delays sleep onset, and sleep debt increases stress reactivity the very next day. It's the most common vicious circle, and often the first one to break." },
        { p: "Three adjustments do most of the work:" },
        {
          ul: [
            "<strong>Stable hours</strong>, weekends included: the body clock locks onto regularity, not duration.",
            "<strong>A cool bedroom</strong>, 18 to 19 °C: the drop in body temperature is the sleep-onset signal.",
            "<strong>One screen-free hour</strong> before bed, or at least no activating content (work email, news, social media).",
          ],
        },
        { p: "These three points sound obvious; they are nonetheless more effective than any supplement if the ground isn't prepared. Our guide on <a href=\"" + le("/blog/mieux-dormir-naturellement") + "\">sleeping better naturally</a> covers the eight sleep levers, including light exposure and napping." },

        { h2: "4. Adjust your diet, especially in the evening" },
        { p: "No food «\u00a0treats\u00a0» stress, but some choices weigh clearly on nervous balance and sleep quality." },
        { h3: "What makes it worse" },
        { p: "Caffeine has a half-life of five to six hours: a 4 pm coffee is still working at 10 pm. Alcohol, often used to unwind, fragments the second half of the night and degrades recovery. Fast-sugar spikes, finally, sustain late-day mood swings." },
        { h3: "What supports it" },
        { p: "<strong>Magnesium</strong> contributes to the normal function of the nervous system and to the reduction of tiredness — one of the few health claims authorised in the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register of claims</a>. You'll find it in nuts, dark chocolate, pulses and magnesium-rich mineral waters." },
        { p: "Omega-3 (oily fish, rapeseed oil, walnuts) and fibre usefully complete the picture. The goal isn't to eat «\u00a0anti-stress\u00a0», but to stop your diet working against you." },

        { h2: "5. Lean on adaptogenic plants and mushrooms" },
        { p: "<a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">Adaptogens</a> are a family of plants and mushrooms whose common trait is helping the body cope with demands, without a direct stimulant effect. Their action is gradual: think weeks, not minutes." },
        { h3: "Ashwagandha" },
        { p: "It's the most studied plant in the group on the subject of stress. Several clinical trials indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=ashwagandha+stress+cortisol\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> have looked at its effect on salivary cortisol in adults under chronic stress, over 8 to 12 weeks. The extracts used are generally standardised in withanolides. Our page on <a href=\"" + le("/blog/ashwagandha") + "\">ashwagandha: benefits, dosage and precautions</a> covers the forms and contraindications." },
        { h3: "Reishi" },
        { p: "A mushroom traditionally associated with relaxation, reishi is valued for evening use. It fits easily into a wind-down routine, as an infusion or a supplement. The three major mushrooms are compared in our article on <a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps and Chaga</a>." },
        { h3: "Saffron" },
        { p: "Saffron is studied for its effect on mood. It has the advantage of being active at low doses, which makes it easy to combine without weighing down a formula." },
        { p: "These three actives come together in our <a href=\"" + le("/products/calm") + "\">CALM</a> gummies, designed for calm and sleep. As with any adaptogen, allow a course of at least 30 days: regularity makes the difference, not the occasional dose." },

        { h2: "6. Take real breaks, not micro-distractions" },
        { p: "Checking your phone between two meetings isn't a break: the brain stays in information-processing mode. A real break means changing register — walking outside, looking into the distance, doing nothing, meditating for a few minutes." },
        { p: "Ten minutes of genuine break beats an hour of drifting in front of a screen. It's also when attention rebuilds itself: if your days run long, our article on <a href=\"" + le("/blog/brouillard-mental") + "\">brain fog</a> explains why cognitive fatigue and stress feed each other." },

        { h2: "7. Build a routine, the most underrated tool" },
        { p: "The nervous system likes predictability. A sequence repeated every evening — however short — becomes a calming signal through simple conditioning: herbal tea, five minutes of breathing, two CALM gummies an hour before bed, dimmed lights." },
        { p: "What matters isn't the content of the routine but its stability. A routine kept four evenings out of seven does more than a perfect protocol abandoned after three days." },

        { h2: "When to see a healthcare professional" },
        { p: "Natural levers have a scope. Some signals warrant medical advice without delay: stress lasting several weeks without improvement, established insomnia, panic attacks, marked loss of appetite or weight, dark thoughts, or a clear impact on work and relationships." },
        { p: "Food supplements are not medicines: they do not prevent, treat or cure any disease. They belong within a healthy lifestyle and replace neither medical advice nor ongoing treatment. Pregnant or breastfeeding women, people on medication (particularly thyroid, anxiolytic or anticoagulant treatments) and people with an autoimmune condition should seek professional advice before taking adaptogens." },

        { h2: "Where to start, concretely" },
        { p: "If you're starting from scratch, take the levers in this order: breathing today, because it costs nothing and works straight away; sleep timing this week, because everything depends on it; evening diet the following week; adaptogens in parallel, on a one-month course, to let the effects settle." },
        { p: "To find which formula fits your situation, take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> — one minute of questions — or browse the <a href=\"" + le("/collections/serenite") + "\">Calm &amp; Sleep</a> collection." },
      ],
      faq: [
        { q: "Which plant helps manage stress?", a: "Ashwagandha is the most studied on this subject, particularly for its action on cortisol. Reishi and saffron complement it well: these three actives are combined in BIEN's CALM gummies. Allow a course of at least 30 days." },
        { q: "How long before you feel the effects?", a: "It depends on the lever. Breathing works within minutes, exercise and sleep within days, adaptogens within three to four weeks of regular use." },
        { q: "Can stress stop you sleeping?", a: "Yes, it's one of the leading causes of difficulty falling asleep, and the relationship runs both ways: the less you sleep, the more reactive to stress you are the next day. Acting on stress often directly improves sleep quality." },
        { q: "Can you take adaptogens every day?", a: "Adaptogens are taken in courses, usually one to three months, followed by a break. Respect the stated daily dose and seek professional advice if you are on medication, pregnant or breastfeeding." },
        { q: "Does magnesium really help with stress?", a: "Magnesium contributes to the normal function of the nervous system and to the reduction of tiredness — two claims authorised at EU level. It isn't an anti-stress agent as such, but a deficiency sustains nervous fatigue." },
        { q: "When should you seek help?", a: "If stress lasts several weeks without improvement, or comes with established insomnia, panic attacks, marked loss of appetite or dark thoughts, medical advice is needed without delay." },
      ],
    },
  },
  {
    slug: "ameliorer-sa-concentration",
    title: "Améliorer sa concentration : méthodes et compléments naturels",
    metaTitle: "Améliorer sa concentration : le guide",
    metaDescription:
      "Attention fragmentée, fatigue mentale : les leviers qui améliorent vraiment la concentration, et ce que valent lion's mane, rhodiola et L-théanine.",
    excerpt:
      "Distractions, fatigue mentale, brouillard : méthodes concrètes et compléments naturels pour améliorer votre concentration et votre clarté d'esprit.",
    category: "Concentration",
    date: "2026-06-18",
    readingMinutes: 9,
    cover: "/brand/blog/cover-concentration.jpg",
    intro:
      "La concentration n'est pas une qualité qu'on aurait ou non : c'est une ressource qui se dépense, se restaure et s'organise. Avant de chercher un complément, il faut savoir ce qui la vide — notifications, dette de sommeil, multitâche — et dans quel ordre agir. Voici les leviers qui fonctionnent, du plus immédiat au plus long, et ce que valent réellement les actifs vendus pour <strong>améliorer la concentration</strong>.",
    blocks: [
      { h2: "Pourquoi votre attention décroche" },
      { p: "L'attention soutenue repose sur le cortex préfrontal, la région la plus coûteuse en énergie du cerveau. Elle fatigue vite, et surtout elle ne supporte pas d'être interrompue : après une coupure, il faut plusieurs minutes pour retrouver le fil de ce qu'on faisait. Une journée à quinze interruptions n'est pas une journée de travail amputée de quinze minutes, mais une journée où l'on n'atteint jamais la profondeur." },
      { p: "Trois facteurs expliquent l'essentiel des difficultés de concentration : le manque de sommeil, qui dégrade l'attention dès la première nuit écourtée ; le stress chronique, qui mobilise les ressources cognitives pour surveiller l'environnement ; et le multitâche, qui n'existe pas — le cerveau alterne, il ne parallélise pas." },
      { p: "Si vos difficultés s'accompagnent d'une sensation de tête cotonneuse, de mots qui ne viennent plus ou d'une lenteur inhabituelle, lisez plutôt notre article sur le <a href=\"" + l("/blog/brouillard-mental") + "\">brouillard mental</a> : le mécanisme et les solutions n'y sont pas les mêmes." },

      { h2: "1. Récupérer du sommeil avant tout le reste" },
      { p: "C'est le levier le plus puissant et le plus négligé. Une seule nuit à cinq heures suffit à réduire l'attention soutenue de façon mesurable, et l'effet s'accumule : après une semaine de dette, les performances chutent sans que la personne s'en rende compte — c'est le piège, la perception de sa propre vigilance se dégrade en même temps qu'elle." },
      { p: "Avant d'ajouter quoi que ce soit, retirez la dette : horaires réguliers, chambre fraîche, dernière caféine avant 14 h. Notre guide <a href=\"" + l("/blog/mieux-dormir-naturellement") + "\">mieux dormir naturellement</a> détaille les huit leviers concrets." },

      { h2: "2. Organiser l'attention plutôt que la forcer" },
      { h3: "Des blocs, pas des heures" },
      { p: "Travaillez par blocs de 45 à 90 minutes sur une seule tâche, suivis d'une vraie pause. Le format exact importe peu — Pomodoro, blocs longs, sessions du matin — ce qui compte est l'engagement : une tâche à la fois, notifications coupées, téléphone hors de vue et non retourné sur le bureau." },
      { h3: "La règle des deux minutes de démarrage" },
      { p: "La difficulté à se concentrer est souvent une difficulté à commencer. Engagez-vous sur deux minutes seulement : ouvrir le document, écrire une phrase. L'élan fait le reste dans la grande majorité des cas, et cette astuce coûte moins d'énergie que la volonté brute." },
      { h3: "Protéger le matin" },
      { p: "Chez la plupart des adultes, la capacité d'attention est maximale dans les trois à quatre heures qui suivent le réveil. Y placer la tâche la plus exigeante, et repousser les réunions et les e-mails à l'après-midi, change davantage la donne que n'importe quel complément." },

      { h2: "3. Bouger, s'oxygéner, s'exposer à la lumière" },
      { p: "Vingt minutes de marche améliorent les performances cognitives dans l'heure qui suit. L'exposition à la lumière naturelle le matin, elle, cale l'horloge biologique et améliore la vigilance de la journée entière. Ces deux gestes ne coûtent rien et agissent le jour même." },
      { p: "L'<a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> rappelle qu'il faut rompre les périodes assises toutes les deux heures : se lever cinq minutes fait partie du travail, pas de la pause." },

      { h2: "4. Revoir sa relation au café" },
      { p: "La caféine bloque les récepteurs de l'adénosine, la molécule qui signale la fatigue. Elle ne crée pas d'énergie : elle masque le besoin de repos, qui revient d'un coup quand l'effet retombe. D'où les fins de journée en dents de scie chez les gros consommateurs." },
      { p: "Trois ajustements suffisent le plus souvent : attendre 60 à 90 minutes après le réveil avant le premier café, plafonner à trois tasses, et arrêter avant 14 h — la demi-vie de la caféine est de cinq à six heures. Pour les alternatives, voyez notre article sur les <a href=\"" + l("/blog/alternative-cafe-focus") + "\">alternatives naturelles au café</a>." },

      { h2: "5. Les actifs étudiés pour la fonction cognitive" },
      { p: "Aucun complément ne remplace le sommeil ni l'organisation. En revanche, certains actifs sont documentés sur la clarté mentale et l'attention, avec une action progressive." },
      { h3: "Lion's mane (Hericium erinaceus)" },
      { p: "C'est le champignon le plus étudié sur le versant cognitif. Les travaux référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus+cognitive\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> portent sur des durées de huit à seize semaines et des extraits standardisés. La régularité est déterminante : sur trois jours, il ne se passe rien. Notre fiche <a href=\"" + l("/blog/lions-mane") + "\">Lion's Mane : bienfaits, mémoire et concentration</a> détaille les formes et les dosages." },
      { h3: "Rhodiola rosea" },
      { p: "Plante adaptogène étudiée sur la fatigue mentale, particulièrement dans les périodes de charge soutenue. Elle se prend plutôt le matin : en fin de journée, elle peut gêner l'endormissement chez les personnes sensibles." },
      { h3: "L-théanine" },
      { p: "Acide aminé du thé vert, associé à un état de calme attentif. Son intérêt tient surtout à son association avec la caféine : elle en atténue la nervosité sans en réduire l'effet d'éveil — d'où sa présence fréquente dans les formules dédiées au focus." },
      { p: "Ces trois actifs composent nos gummies <a href=\"" + l("/products/focus") + "\">FOCUS</a>. Comme pour tout adaptogène, comptez une cure d'au moins 30 jours ; leur composition détaillée figure sur la page <a href=\"" + l("/ingredients") + "\">ingrédients</a>." },

      { h2: "6. Nourrir le cerveau correctement" },
      { p: "Le cerveau consomme environ 20 % de l'énergie du corps. Deux points pèsent réellement sur l'attention : la stabilité de la glycémie — un déjeuner très sucré programme le coup de barre de 15 h — et les apports en oméga-3, dont le <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen des allégations</a> reconnaît la contribution au fonctionnement normal du cerveau pour le DHA." },
      { p: "L'hydratation compte aussi, davantage qu'on ne le croit : une perte hydrique de 2 % suffit à dégrader l'attention. Une gourde sur le bureau règle le problème mieux que n'importe quelle résolution." },

      { h2: "7. Accepter que l'attention se restaure" },
      { p: "Une pause n'est pas un temps perdu, c'est la condition du bloc suivant. Mais toutes les pauses ne se valent pas : faire défiler un fil d'actualité maintient le cerveau en traitement d'information. Marcher, regarder au loin, ne rien faire pendant dix minutes restaure réellement." },

      { h2: "Quand consulter un professionnel de santé" },
      { p: "Des difficultés de concentration installées depuis plusieurs mois, une gêne marquée au travail ou dans les études, des oublis inhabituels, ou une fatigue qui ne cède pas au repos justifient un avis médical. Certaines causes se traitent et n'ont rien à voir avec l'hygiène de vie : carence en fer ou en vitamine B12, trouble thyroïdien, apnée du sommeil, dépression, trouble de l'attention non diagnostiqué." },
      { p: "Les compléments alimentaires ne sont pas des médicaments : ils ne préviennent, ne traitent et ne guérissent aucune maladie, et ne remplacent ni une alimentation variée, ni un avis médical. Les personnes enceintes ou allaitantes et les personnes sous traitement demandent l'avis d'un professionnel de santé avant toute prise d'adaptogènes." },

      { h2: "Par où commencer" },
      { p: "Dans l'ordre d'efficacité : réglez le sommeil cette semaine, organisez vos blocs de travail la semaine suivante, ajustez le café en parallèle. Les compléments viennent en soutien de ce socle, pas à sa place — sur une cure d'un mois, pour laisser le temps aux effets de s'installer." },
      { p: "Pour identifier la formule adaptée à votre situation, faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> ou parcourez la collection <a href=\"" + l("/collections/concentration") + "\">Concentration &amp; Clarté mentale</a>." },
    ],
    faq: [
      { q: "Quel complément pour la concentration ?", a: "Le lion's mane est le plus étudié sur le versant cognitif, souvent associé à la rhodiola et à la L-théanine — la combinaison retenue dans les gummies FOCUS. Comptez une cure d'au moins 30 jours : ces actifs agissent progressivement." },
      { q: "Combien de temps pour ressentir un effet ?", a: "Les leviers d'hygiène de vie agissent en quelques jours pour le sommeil, le jour même pour la marche et la lumière. Les adaptogènes demandent trois à quatre semaines de prise régulière." },
      { q: "Le café nuit-il à la concentration ?", a: "Pas en soi : il masque la fatigue sans la supprimer. Le problème vient de l'excès et de l'heure. Premier café 60 à 90 minutes après le réveil, trois tasses maximum, rien après 14 h." },
      { q: "Peut-on associer lion's mane et café ?", a: "Oui, les deux n'agissent pas sur les mêmes mécanismes. La L-théanine, souvent présente dans les formules focus, atténue même la nervosité liée à la caféine." },
      { q: "Pourquoi je n'arrive pas à me concentrer plus de dix minutes ?", a: "Le plus souvent à cause des interruptions et de la dette de sommeil, pas d'un manque de volonté. Coupez les notifications, travaillez par blocs sur une seule tâche, et regardez d'abord vos nuits." },
      { q: "Quand faut-il consulter ?", a: "Si la difficulté dure depuis plusieurs mois, gêne nettement le travail, ou s'accompagne d'oublis inhabituels et d'une fatigue qui ne cède pas au repos. Plusieurs causes médicales se traitent." },
    ],
    en: {
      title: "Improving focus: methods and natural supplements",
      metaTitle: "Improving your focus: the guide",
      metaDescription: "Fragmented attention, mental fatigue: the levers that really improve focus, and what lion's mane, rhodiola and L-theanine are worth.",
      excerpt: "Distractions, mental fatigue, brain fog: concrete methods and natural supplements to improve your focus and mental clarity.",
      category: "Focus",
      intro: "Focus isn't a quality you either have or lack: it's a resource that gets spent, restored and organised. Before reaching for a supplement, you need to know what drains it — notifications, sleep debt, multitasking — and in which order to act. Here are the levers that work, from the most immediate to the slowest, and what the actives sold to <strong>improve focus</strong> are really worth.",
      blocks: [
        { h2: "Why your attention slips" },
        { p: "Sustained attention relies on the prefrontal cortex, the most energy-hungry region of the brain. It tires quickly, and above all it doesn't tolerate interruption: after a break, it takes several minutes to find the thread again. A day with fifteen interruptions isn't a workday short of fifteen minutes — it's a day that never reaches any depth." },
        { p: "Three factors explain most focus problems: lack of sleep, which degrades attention from the very first short night; chronic stress, which ties up cognitive resources monitoring the environment; and multitasking, which doesn't exist — the brain alternates, it doesn't parallelise." },
        { p: "If your difficulties come with a cotton-wool head, words that won't come or unusual slowness, read our article on <a href=\"" + le("/blog/brouillard-mental") + "\">brain fog</a> instead: the mechanism and the answers aren't the same." },

        { h2: "1. Clear your sleep debt before anything else" },
        { p: "This is the most powerful and most neglected lever. A single five-hour night measurably reduces sustained attention, and the effect accumulates: after a week of debt, performance drops without the person noticing — that's the trap, self-assessment of alertness degrades along with alertness itself." },
        { p: "Before adding anything, remove the debt: regular hours, a cool bedroom, last caffeine before 2 pm. Our guide on <a href=\"" + le("/blog/mieux-dormir-naturellement") + "\">sleeping better naturally</a> covers the eight concrete levers." },

        { h2: "2. Organise attention rather than force it" },
        { h3: "Blocks, not hours" },
        { p: "Work in blocks of 45 to 90 minutes on a single task, followed by a real break. The exact format matters little — Pomodoro, long blocks, morning sessions — what counts is the commitment: one task at a time, notifications off, phone out of sight rather than face down on the desk." },
        { h3: "The two-minute start rule" },
        { p: "Difficulty focusing is often difficulty starting. Commit to two minutes only: open the document, write one sentence. Momentum does the rest in the vast majority of cases, and it costs far less energy than raw willpower." },
        { h3: "Protect the morning" },
        { p: "For most adults, attention peaks in the three to four hours after waking. Putting the most demanding task there, and pushing meetings and email to the afternoon, changes more than any supplement." },

        { h2: "3. Move, breathe, get daylight" },
        { p: "Twenty minutes of walking improves cognitive performance within the hour. Morning daylight exposure sets the body clock and improves alertness for the whole day. Both cost nothing and work the same day." },
        { p: "France's food safety agency <a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> stresses breaking up sitting time every two hours: standing up for five minutes is part of the work, not of the break." },

        { h2: "4. Rethink your relationship with coffee" },
        { p: "Caffeine blocks adenosine receptors, the molecule that signals tiredness. It doesn't create energy: it masks the need for rest, which returns all at once when the effect wears off. Hence the jagged late afternoons of heavy drinkers." },
        { p: "Three adjustments usually suffice: wait 60 to 90 minutes after waking for the first coffee, cap it at three cups, and stop before 2 pm — caffeine's half-life is five to six hours. For alternatives, see our article on <a href=\"" + le("/blog/alternative-cafe-focus") + "\">natural alternatives to coffee</a>." },

        { h2: "5. The actives studied for cognitive function" },
        { p: "No supplement replaces sleep or organisation. That said, some actives are documented on mental clarity and attention, with a gradual action." },
        { h3: "Lion's mane (Hericium erinaceus)" },
        { p: "It's the most studied mushroom on the cognitive side. The work indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus+cognitive\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> covers eight to sixteen weeks and standardised extracts. Regularity is decisive: over three days, nothing happens. Our page on <a href=\"" + le("/blog/lions-mane") + "\">Lion's Mane: benefits, memory and focus</a> covers forms and doses." },
        { h3: "Rhodiola rosea" },
        { p: "An adaptogenic plant studied for mental fatigue, particularly through sustained workloads. Take it in the morning: later in the day it can interfere with falling asleep in sensitive people." },
        { h3: "L-theanine" },
        { p: "An amino acid from green tea, associated with a state of calm alertness. Its value lies mainly in pairing with caffeine: it softens the jitters without reducing the wakefulness — hence its frequent presence in focus formulas." },
        { p: "These three actives make up our <a href=\"" + le("/products/focus") + "\">FOCUS</a> gummies. As with any adaptogen, allow a course of at least 30 days; the full composition is on the <a href=\"" + le("/ingredients") + "\">ingredients</a> page." },

        { h2: "6. Feed the brain properly" },
        { p: "The brain uses around 20% of the body's energy. Two things really weigh on attention: blood sugar stability — a very sugary lunch programmes the 3 pm slump — and omega-3 intake, where the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register of claims</a> recognises DHA's contribution to normal brain function." },
        { p: "Hydration matters more than people think: a 2% water loss is enough to degrade attention. A bottle on the desk solves it better than any resolution." },

        { h2: "7. Accept that attention restores itself" },
        { p: "A break isn't lost time, it's the condition for the next block. But not all breaks are equal: scrolling a feed keeps the brain in information-processing mode. Walking, looking into the distance, doing nothing for ten minutes genuinely restores." },

        { h2: "When to see a healthcare professional" },
        { p: "Focus problems lasting several months, marked difficulty at work or in study, unusual forgetfulness, or fatigue that doesn't yield to rest all warrant medical advice. Some causes are treatable and have nothing to do with lifestyle: iron or B12 deficiency, thyroid disorder, sleep apnoea, depression, undiagnosed attention disorder." },
        { p: "Food supplements are not medicines: they do not prevent, treat or cure any disease, and replace neither a varied diet nor medical advice. Pregnant or breastfeeding women and people on medication should seek professional advice before taking adaptogens." },

        { h2: "Where to start" },
        { p: "In order of effectiveness: fix your sleep this week, organise your work blocks the following one, adjust coffee in parallel. Supplements support that foundation, they don't replace it — on a one-month course, to let the effects settle." },
        { p: "To find the formula that fits your situation, take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> or browse the <a href=\"" + le("/collections/concentration") + "\">Focus &amp; Mental clarity</a> collection." },
      ],
      faq: [
        { q: "Which supplement for focus?", a: "Lion's mane is the most studied on the cognitive side, often paired with rhodiola and L-theanine — the combination used in FOCUS gummies. Allow a course of at least 30 days: these actives act gradually." },
        { q: "How long before you feel an effect?", a: "Lifestyle levers work within days for sleep, the same day for walking and daylight. Adaptogens need three to four weeks of regular use." },
        { q: "Does coffee harm focus?", a: "Not in itself: it masks tiredness without removing it. The problem is quantity and timing. First coffee 60 to 90 minutes after waking, three cups maximum, none after 2 pm." },
        { q: "Can you combine lion's mane and coffee?", a: "Yes, they don't act on the same mechanisms. L-theanine, often present in focus formulas, even softens the jitters caffeine can cause." },
        { q: "Why can't I focus for more than ten minutes?", a: "Usually because of interruptions and sleep debt, not a lack of willpower. Turn off notifications, work in blocks on a single task, and look at your nights first." },
        { q: "When should you seek advice?", a: "If the difficulty has lasted several months, clearly hampers your work, or comes with unusual forgetfulness and fatigue that doesn't yield to rest. Several medical causes are treatable." },
      ],
    },
  },
  {
    slug: "retrouver-de-l-energie-naturellement",
    title: "Retrouver de l'énergie naturellement : les vraies solutions",
    metaTitle: "Retrouver de l'énergie naturellement",
    metaDescription:
      "Coup de barre de 15 h, fatigue qui s'installe : les causes réelles du manque d'énergie et les leviers qui fonctionnent, sommeil, alimentation et adaptogènes.",
    excerpt:
      "Le coup de barre de 15 h, la fatigue persistante : comment retrouver de l'énergie naturellement, du sommeil à l'alimentation en passant par les adaptogènes.",
    category: "Énergie & performance",
    date: "2026-06-02",
    readingMinutes: 9,
    cover: "/brand/blog/cover-energie.jpg",
    intro:
      "Le manque d'énergie a rarement une cause unique, et presque jamais celle qu'on croit. Avant de chercher un stimulant, il faut distinguer la fatigue de récupération — qui se répare en dormant — de la fatigue installée, qui demande de regarder le sommeil, l'alimentation, le mouvement et parfois une prise de sang. Voici comment <strong>retrouver de l'énergie naturellement</strong>, dans l'ordre où c'est efficace.",
    blocks: [
      { h2: "D'où vient vraiment la fatigue" },
      { p: "L'énergie disponible dépend de trois choses : la qualité du sommeil, la stabilité de l'apport en carburant, et l'efficacité des mitochondries — ces usines cellulaires qui transforment ce que vous mangez en énergie utilisable. Un déficit sur l'un des trois se ressent, et les trois interagissent." },
      { p: "S'y ajoute un facteur souvent sous-estimé : le stress chronique. Maintenir un niveau de cortisol élevé en continu coûte cher en ressources, et explique une bonne part des fatigues qui résistent au repos. Si c'est votre cas, commencez plutôt par notre guide pour <a href=\"" + l("/blog/gerer-le-stress-naturellement") + "\">gérer le stress naturellement</a>." },
      { p: "Enfin, une fatigue qui dure depuis plus de six mois, ne cède pas au repos et s'accompagne d'autres symptômes relève d'une consultation, pas d'un complément : voyez notre article sur la <a href=\"" + l("/blog/fatigue-chronique-solution") + "\">fatigue chronique</a>." },

      { h2: "1. Dormir assez, mais surtout au bon rythme" },
      { p: "La durée compte moins que la régularité. Se coucher et se lever à heures fixes, y compris le week-end, stabilise l'horloge biologique — et c'est elle qui décide de votre niveau d'énergie à 10 h comme à 16 h. Un décalage de deux heures le samedi produit, le lundi, l'équivalent d'un décalage horaire." },
      { p: "Deux repères concrets : une chambre entre 18 et 19 °C, et de la lumière naturelle dans l'heure qui suit le réveil. Le reste est détaillé dans <a href=\"" + l("/blog/mieux-dormir-naturellement") + "\">mieux dormir naturellement</a>." },

      { h2: "2. Comprendre le coup de barre de 15 h" },
      { p: "Il a deux causes qui se cumulent. La première est biologique : la vigilance connaît un creux naturel en début d'après-midi, indépendamment du déjeuner. La seconde est alimentaire : un repas riche en sucres rapides provoque un pic de glycémie suivi d'une chute, et c'est cette chute qu'on ressent." },
      { h3: "Ce qui aide" },
      {
        ul: [
          "Un déjeuner avec des <strong>protéines et des fibres</strong> plutôt qu'un plat de féculents seul.",
          "Une <strong>marche de dix minutes</strong> après le repas : elle atténue nettement le pic glycémique.",
          "Une <strong>sieste de 10 à 20 minutes</strong> si c'est possible — au-delà, on se réveille plus vaseux qu'avant.",
          "<strong>Pas de café après 14 h</strong> : il masquera le creux, mais dégradera la nuit et entretiendra le cycle.",
        ],
      },

      { h2: "3. Manger pour tenir, pas pour se relancer" },
      { p: "Trois nutriments sont directement liés à la fatigue, et leurs allégations sont reconnues au <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen des allégations de santé</a> : le <strong>fer</strong> et le <strong>magnésium</strong> contribuent à réduire la fatigue, les <strong>vitamines du groupe B</strong> au métabolisme énergétique normal." },
      { p: "Cela ne signifie pas qu'il faut se supplémenter à l'aveugle. Une carence en fer se diagnostique par une prise de sang, et un excès de fer n'est pas anodin. Le réflexe utile est alimentaire : légumineuses, fruits à coque, légumes verts, poissons gras, et suffisamment de protéines à chaque repas." },
      { p: "Et l'hydratation, encore : une perte hydrique de 2 % suffit à faire chuter la performance physique et l'attention. Beaucoup de fatigues de fin de matinée sont d'abord des déshydratations." },

      { h2: "4. Bouger, même quand on est fatigué" },
      { p: "C'est contre-intuitif mais bien documenté : l'activité physique régulière augmente le niveau d'énergie ressenti, y compris chez les personnes qui se plaignent de fatigue. L'<a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> recommande 30 minutes d'activité dynamique cinq fois par semaine." },
      { p: "L'erreur classique consiste à viser trop haut. Commencez par la marche quotidienne : elle produit l'essentiel du bénéfice, sans le coût de récupération d'un entraînement intense qui, mal placé, aggraverait la fatigue." },

      { h2: "5. Les adaptogènes de la sphère énergie" },
      { p: "Contrairement aux stimulants, les <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogènes</a> ne poussent pas l'organisme : ils l'aident à mieux gérer ses ressources. Leur effet se construit sur plusieurs semaines, et ne se ressent pas comme un café." },
      { h3: "Cordyceps" },
      { p: "Champignon traditionnellement associé à l'endurance et à l'oxygénation. C'est le plus étudié des trois sur le versant de la performance physique ; il est détaillé dans notre comparatif <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps, Chaga</a>." },
      { h3: "Rhodiola rosea" },
      { p: "Étudiée sur la fatigue mentale liée aux périodes de charge. Elle se prend le matin : en fin de journée, elle peut gêner l'endormissement." },
      { h3: "Panax ginseng" },
      { p: "L'un des toniques les plus anciennement documentés, employé pour le tonus général. À éviter en fin de journée, et à ne pas associer sans avis médical à un traitement anticoagulant ou antidiabétique." },
      { p: "Ces trois actifs composent nos gummies <a href=\"" + l("/products/power") + "\">POWER</a>. Pour la récupération après l'effort, voyez plutôt notre guide des <a href=\"" + l("/blog/complement-recuperation-sport") + "\">compléments pour la récupération sportive</a>." },

      { h2: "6. Réduire ce qui pompe l'énergie" },
      { p: "On cherche souvent quoi ajouter alors que le levier le plus rapide est de retirer. L'alcool, même modéré, dégrade la seconde partie de nuit. Le café tardif décale l'endormissement. Les écrans en soirée retardent la sécrétion de mélatonine. Et le multitâche permanent épuise sans produire grand-chose." },

      { h2: "Quand consulter un professionnel de santé" },
      { p: "Une fatigue qui persiste plus de six semaines malgré un sommeil correct, s'accompagne d'un essoufflement, d'une pâleur, d'une perte de poids, de fièvre ou d'une humeur durablement basse doit être explorée médicalement. Anémie, hypothyroïdie, apnée du sommeil, diabète, dépression : ces causes sont fréquentes et se traitent." },
      { p: "Les compléments alimentaires ne préviennent, ne traitent et ne guérissent aucune maladie. Ils ne remplacent ni une alimentation variée et équilibrée, ni un avis médical. Les personnes enceintes ou allaitantes et les personnes sous traitement demandent conseil à un professionnel de santé avant toute prise d'adaptogènes." },

      { h2: "Par où commencer" },
      { p: "Semaine 1 : régularisez les horaires de sommeil et supprimez le café après 14 h. Semaine 2 : ajoutez la marche quotidienne et revoyez la composition du déjeuner. Semaine 3 : si la fatigue persiste sans cause médicale, une cure d'adaptogènes d'un mois prend son sens — pas avant, parce qu'elle ne compenserait pas un socle défaillant." },
      { p: "Pour cibler la formule qui correspond à votre situation, faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> ou découvrez la collection <a href=\"" + l("/collections/performance-et-vitalite") + "\">Performance &amp; Vitalité</a>." },
    ],
    faq: [
      { q: "Quel complément pour retrouver de l'énergie ?", a: "Le cordyceps, la rhodiola et le panax ginseng sont les plus documentés sur le tonus et l'endurance — la combinaison des gummies POWER. Ils agissent progressivement, sur une cure d'au moins 30 jours, et ne remplacent pas le sommeil." },
      { q: "Pourquoi ai-je un coup de barre à 15 h ?", a: "Deux causes se cumulent : un creux de vigilance biologique en début d'après-midi, et la chute de glycémie qui suit un déjeuner riche en sucres rapides. Un repas plus protéiné et dix minutes de marche après le repas suffisent souvent." },
      { q: "Le café donne-t-il vraiment de l'énergie ?", a: "Non, il masque la fatigue en bloquant les récepteurs de l'adénosine. L'énergie revient d'un coup quand l'effet retombe. Utile ponctuellement, contre-productif en usage permanent." },
      { q: "Faut-il prendre du fer contre la fatigue ?", a: "Seulement en cas de carence avérée, diagnostiquée par une prise de sang. Un excès de fer n'est pas anodin. En revanche, une alimentation riche en fer, magnésium et vitamines B soutient le métabolisme énergétique." },
      { q: "Le sport fatigue-t-il ou donne-t-il de l'énergie ?", a: "Les deux, selon la dose. L'activité régulière et modérée augmente l'énergie ressentie ; l'entraînement intense mal récupéré la diminue. Commencez par la marche quotidienne." },
      { q: "Quand s'inquiéter d'une fatigue ?", a: "Au-delà de six semaines malgré un sommeil correct, ou si elle s'accompagne d'essoufflement, de pâleur, de perte de poids, de fièvre ou d'une humeur basse. Ces signes justifient une consultation." },
    ],
    en: {
      title: "Regaining energy naturally: what actually works",
      metaTitle: "Regaining energy naturally",
      metaDescription: "The 3pm slump, fatigue that settles in: the real causes of low energy and the levers that work — sleep, diet and adaptogens.",
      excerpt: "The 3pm slump, persistent fatigue: how to regain energy naturally, from sleep to diet to adaptogens.",
      category: "Energy & performance",
      intro: "Low energy rarely has a single cause, and almost never the one you assume. Before reaching for a stimulant, separate recovery fatigue — which sleep repairs — from settled fatigue, which calls for a look at sleep, diet, movement and sometimes a blood test. Here's how to <strong>regain energy naturally</strong>, in the order that works.",
      blocks: [
        { h2: "Where fatigue actually comes from" },
        { p: "Available energy depends on three things: sleep quality, steady fuel intake, and how efficiently your mitochondria — the cellular plants that turn what you eat into usable energy — do their job. A shortfall in any one shows, and all three interact." },
        { p: "Add a widely underestimated factor: chronic stress. Keeping cortisol elevated continuously is expensive in resources, and explains a good share of the fatigue that resists rest. If that's your case, start with our guide to <a href=\"" + le("/blog/gerer-le-stress-naturellement") + "\">managing stress naturally</a>." },
        { p: "Finally, fatigue lasting more than six months, not yielding to rest and coming with other symptoms calls for a consultation, not a supplement: see our article on <a href=\"" + le("/blog/fatigue-chronique-solution") + "\">chronic fatigue</a>." },

        { h2: "1. Sleep enough, but above all on rhythm" },
        { p: "Duration matters less than regularity. Going to bed and getting up at fixed times, weekends included, stabilises the body clock — and it's the clock that decides your energy at 10 am as at 4 pm. A two-hour shift on Saturday produces, by Monday, the equivalent of jet lag." },
        { p: "Two concrete markers: a bedroom at 18 to 19 °C, and daylight within the hour after waking. The rest is covered in <a href=\"" + le("/blog/mieux-dormir-naturellement") + "\">sleeping better naturally</a>." },

        { h2: "2. Understanding the 3pm slump" },
        { p: "It has two causes that stack. The first is biological: alertness naturally dips in the early afternoon, regardless of lunch. The second is dietary: a meal high in fast sugars causes a blood-sugar spike followed by a drop — and it's that drop you feel." },
        { h3: "What helps" },
        {
          ul: [
            "A lunch with <strong>protein and fibre</strong> rather than starch alone.",
            "A <strong>ten-minute walk</strong> after the meal: it clearly blunts the glucose spike.",
            "A <strong>10 to 20 minute nap</strong> if possible — beyond that you wake groggier than before.",
            "<strong>No coffee after 2 pm</strong>: it will mask the dip, but degrade the night and sustain the cycle.",
          ],
        },

        { h2: "3. Eat to last, not to rebound" },
        { p: "Three nutrients are directly linked to fatigue, with claims recognised in the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register of health claims</a>: <strong>iron</strong> and <strong>magnesium</strong> contribute to the reduction of tiredness, and <strong>B vitamins</strong> to normal energy metabolism." },
        { p: "That doesn't mean supplementing blindly. Iron deficiency is diagnosed by a blood test, and excess iron is not harmless. The useful reflex is dietary: pulses, nuts, green vegetables, oily fish, and enough protein at every meal." },
        { p: "And hydration again: a 2% water loss is enough to reduce physical performance and attention. Many late-morning slumps are dehydration first." },

        { h2: "4. Move, even when you're tired" },
        { p: "It's counter-intuitive but well documented: regular physical activity raises perceived energy, including in people who complain of fatigue. France's <a href=\"https://www.anses.fr/fr/content/manger-bouger\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES</a> recommends 30 minutes of dynamic activity five times a week." },
        { p: "The classic mistake is aiming too high. Start with a daily walk: it delivers most of the benefit, without the recovery cost of hard training which, badly placed, would deepen the fatigue." },

        { h2: "5. The adaptogens of the energy sphere" },
        { p: "Unlike stimulants, <a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogens</a> don't push the body: they help it manage its resources. Their effect builds over weeks, and doesn't feel like a coffee." },
        { h3: "Cordyceps" },
        { p: "A mushroom traditionally associated with endurance and oxygenation. It's the most studied of the three on physical performance; it's covered in our comparison of <a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps and Chaga</a>." },
        { h3: "Rhodiola rosea" },
        { p: "Studied for mental fatigue during demanding periods. Take it in the morning: later in the day it can interfere with falling asleep." },
        { h3: "Panax ginseng" },
        { p: "One of the longest-documented tonics, used for general vitality. Avoid it late in the day, and don't combine it with anticoagulant or antidiabetic treatment without medical advice." },
        { p: "These three actives make up our <a href=\"" + le("/products/power") + "\">POWER</a> gummies. For post-exercise recovery, see our guide to <a href=\"" + le("/blog/complement-recuperation-sport") + "\">supplements for sports recovery</a> instead." },

        { h2: "6. Remove what drains you" },
        { p: "People look for what to add when the fastest lever is to remove. Alcohol, even moderate, degrades the second half of the night. Late coffee delays sleep onset. Evening screens push back melatonin. And permanent multitasking exhausts without producing much." },

        { h2: "When to see a healthcare professional" },
        { p: "Fatigue persisting beyond six weeks despite decent sleep, or accompanied by breathlessness, pallor, weight loss, fever or a persistently low mood, should be investigated medically. Anaemia, hypothyroidism, sleep apnoea, diabetes, depression: these causes are common and treatable." },
        { p: "Food supplements do not prevent, treat or cure any disease. They replace neither a varied, balanced diet nor medical advice. Pregnant or breastfeeding women and people on medication should consult a healthcare professional before taking adaptogens." },

        { h2: "Where to start" },
        { p: "Week 1: regularise sleep times and cut coffee after 2 pm. Week 2: add the daily walk and rethink lunch. Week 3: if fatigue persists with no medical cause, a one-month adaptogen course makes sense — not before, because it wouldn't compensate for a shaky foundation." },
        { p: "To target the formula that fits your situation, take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> or discover the <a href=\"" + le("/collections/performance-et-vitalite") + "\">Performance &amp; Vitality</a> collection." },
      ],
      faq: [
        { q: "Which supplement to regain energy?", a: "Cordyceps, rhodiola and panax ginseng are the best documented for vitality and endurance — the combination in POWER gummies. They act gradually, over a course of at least 30 days, and don't replace sleep." },
        { q: "Why do I slump at 3pm?", a: "Two causes stack: a biological dip in early-afternoon alertness, and the blood-sugar drop that follows a lunch high in fast sugars. A more protein-rich meal and a ten-minute walk afterwards often suffice." },
        { q: "Does coffee really give you energy?", a: "No, it masks fatigue by blocking adenosine receptors. The energy debt returns all at once when the effect wears off. Useful occasionally, counter-productive as a permanent habit." },
        { q: "Should you take iron for fatigue?", a: "Only for a confirmed deficiency, diagnosed by a blood test. Excess iron is not harmless. A diet rich in iron, magnesium and B vitamins does support energy metabolism." },
        { q: "Does exercise cause or cure fatigue?", a: "Both, depending on the dose. Regular moderate activity raises perceived energy; hard training poorly recovered lowers it. Start with a daily walk." },
        { q: "When should fatigue worry you?", a: "Beyond six weeks despite decent sleep, or if it comes with breathlessness, pallor, weight loss, fever or low mood. Those signs warrant a consultation." },
      ],
    },
  },
  {
    slug: "quest-ce-quun-adaptogene",
    title: "Qu'est-ce qu'un adaptogène ? Définition, plantes et bienfaits",
    metaTitle: "Qu'est-ce qu'un adaptogène ? Définition",
    metaDescription:
      "Définition d'un adaptogène, critères historiques, plantes et champignons concernés, ce que dit la réglementation européenne et comment les utiliser.",
    excerpt:
      "Définition, critères, plantes concernées : tout comprendre aux adaptogènes, ces végétaux qui aident l'organisme à faire face aux contraintes.",
    category: "Ingrédients & science",
    date: "2026-05-20",
    readingMinutes: 8,
    cover: "/brand/blog/cover-adaptogene-def.jpg",
    intro:
      "Un <strong>adaptogène</strong> est une substance naturelle — plante ou champignon — qui aide l'organisme à mieux faire face aux contraintes physiques, mentales ou environnementales, en favorisant un retour à l'équilibre plutôt qu'en stimulant. C'est cette nuance qui fait toute la différence avec un excitant, et c'est elle qu'on va détailler ici : d'où vient le terme, quels critères une plante doit remplir, lesquelles sont concernées, et ce que la réglementation autorise à en dire.",
    blocks: [
      { h2: "La définition, et d'où elle vient" },
      { p: "Le mot a été forgé en 1947 par le pharmacologue russe Nikolaï Lazarev, puis précisé en 1968 par Israel Brekhman. Trois critères devaient être réunis pour qu'une substance soit dite adaptogène : être non toxique aux doses usuelles, augmenter la résistance non spécifique de l'organisme — c'est-à-dire face à des contraintes de nature variée — et exercer une action normalisatrice, qui ramène vers l'équilibre plutôt qu'elle ne pousse dans un sens." },
      { p: "Ce troisième critère est le plus intéressant. Un stimulant pousse toujours dans la même direction, quel que soit votre état. Un adaptogène est décrit comme modulateur : le même actif est associé à un apaisement chez une personne tendue et à un soutien du tonus chez une personne épuisée." },
      { p: "Il faut être clair sur un point : « adaptogène » est un terme issu de la pharmacologie, pas une catégorie réglementaire européenne. Aucune définition juridique ne l'encadre dans l'Union, ce qui explique qu'on le trouve sur des produits très inégaux." },

      { h2: "Comment ils agissent, en l'état des connaissances" },
      { p: "Le mécanisme le plus documenté concerne l'axe hypothalamo-hypophyso-surrénalien, celui qui pilote la réponse au stress et la sécrétion de cortisol. Plusieurs adaptogènes sont étudiés pour leur influence sur cet axe : les travaux référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=adaptogen+stress+response\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> portent surtout sur l'ashwagandha, la rhodiola et l'éleuthérocoque." },
      { p: "S'y ajoutent, selon les espèces, des composés antioxydants et, pour les champignons, des bêta-glucanes — des polysaccharides de paroi qui font l'objet de recherches sur l'immunité. La qualité des preuves est très variable d'un actif à l'autre : solide sur certains, préliminaire sur d'autres. Un article honnête doit le dire." },
      { p: "Dernier point : leur action est <strong>progressive</strong>. Rien ne se passe en trois jours. Les protocoles d'étude s'étalent généralement sur huit à douze semaines, ce qui explique la recommandation d'usage en cure d'au moins un mois." },

      { h2: "Les plantes et champignons les plus étudiés" },
      { h3: "Ashwagandha (Withania somnifera)" },
      { p: "La plus documentée sur le stress et le cortisol. Racine utilisée en médecine ayurvédique, aujourd'hui standardisée en withanolides. Détails, formes et contre-indications dans notre fiche <a href=\"" + l("/blog/ashwagandha") + "\">ashwagandha</a>." },
      { h3: "Rhodiola rosea" },
      { p: "Étudiée sur la fatigue mentale et les périodes de charge soutenue. À prendre le matin, car elle peut gêner l'endormissement." },
      { h3: "Panax ginseng" },
      { p: "Le tonique le plus anciennement documenté, employé pour le tonus général. À éviter en association avec certains traitements sans avis médical." },
      { h3: "Les champignons fonctionnels" },
      { p: "Reishi, cordyceps, chaga et lion's mane forment la famille des champignons dits adaptogènes ou fonctionnels. Ils sont comparés en détail dans notre <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">guide des champignons adaptogènes</a> et, pour les trois principaux, dans <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps, Chaga</a>." },
      { h3: "Safran, éleuthérocoque, schisandra" },
      { p: "Moins connus du grand public, ils complètent la famille. Le safran est étudié sur l'humeur et présente l'avantage d'être actif à faible dose." },

      { h2: "Ce que la réglementation permet d'en dire" },
      { p: "C'est le point que la plupart des articles passent sous silence. Dans l'Union européenne, les allégations de santé sont encadrées par le règlement (CE) n° 1924/2006 : seules celles inscrites au <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen</a> peuvent être utilisées." },
      { p: "Or les allégations portant sur les plantes — les « botaniques » — sont toujours <strong>en attente d'évaluation</strong> par l'EFSA. Elles sont tolérées dans leur formulation déposée, ce qui interdit de les reformuler librement et explique la prudence de langage des marques sérieuses : on lit « contribue à » ou « participe à », jamais « soigne » ni « traite »." },
      { p: "Un complément alimentaire n'est pas un médicament. Il ne peut, par définition légale, revendiquer aucune propriété de prévention, de traitement ou de guérison d'une maladie. Une marque qui l'affirme est en infraction, et la <a href=\"https://www.economie.gouv.fr/dgccrf\" target=\"_blank\" rel=\"noopener noreferrer\">DGCCRF</a> contrôle ce champ." },

      { h2: "Comment les utiliser concrètement" },
      {
        ul: [
          "<strong>En cure</strong> d'un à trois mois, suivie d'une pause : c'est le schéma le plus courant.",
          "<strong>Au bon moment</strong> : rhodiola et ginseng le matin, reishi et ashwagandha plutôt le soir.",
          "<strong>Sur un extrait standardisé</strong> quand il existe : c'est ce qui garantit une teneur constante en actifs, contrairement à une poudre de plante brute.",
          "<strong>Avec régularité</strong> plutôt qu'à forte dose : les études portent sur des prises quotidiennes, pas sur des pics.",
        ],
      },
      { p: "Le format compte moins que l'observance : la meilleure forme est celle que vous prendrez tous les jours pendant un mois. C'est le sujet de notre comparatif <a href=\"" + l("/blog/gummies-vs-gelules") + "\">gummies ou gélules</a>." },

      { h2: "Précautions et contre-indications" },
      { p: "Non toxique ne signifie pas anodin. Les adaptogènes sont déconseillés aux femmes enceintes et allaitantes, et demandent un avis médical en cas de traitement en cours — en particulier thyroïdien, anticoagulant, antidiabétique, anxiolytique ou immunosuppresseur. L'ashwagandha est également déconseillée en cas de maladie auto-immune." },
      { p: "Respectez la dose journalière indiquée, ne cumulez pas plusieurs produits contenant le même actif, et signalez toute prise à votre médecin ou pharmacien, au même titre qu'un médicament." },

      { h2: "Par où commencer" },
      { p: "Partez du besoin, pas de l'ingrédient. Sommeil et tension nerveuse orientent vers l'ashwagandha, le reishi et le safran ; concentration vers le lion's mane et la rhodiola ; énergie physique vers le cordyceps et le ginseng. Le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> fait ce tri en une minute, et la page <a href=\"" + l("/ingredients") + "\">ingrédients</a> détaille chaque actif utilisé dans nos formules." },
    ],
    faq: [
      { q: "Qu'est-ce qu'un adaptogène, simplement ?", a: "Une plante ou un champignon qui aide l'organisme à mieux résister aux contraintes — stress, fatigue, effort — en favorisant un retour à l'équilibre, sans effet stimulant direct comme la caféine." },
      { q: "Quels sont les adaptogènes les plus connus ?", a: "L'ashwagandha, la rhodiola, le panax ginseng, l'éleuthérocoque et le safran côté plantes ; le reishi, le cordyceps, le chaga et le lion's mane côté champignons." },
      { q: "Combien de temps faut-il pour ressentir les effets ?", a: "Comptez trois à quatre semaines de prise régulière. Les études cliniques s'étalent le plus souvent sur huit à douze semaines : rien ne se joue en quelques jours." },
      { q: "Les adaptogènes sont-ils reconnus scientifiquement ?", a: "Le terme vient de la pharmacologie et plusieurs actifs font l'objet d'essais cliniques, avec une qualité de preuve variable selon les espèces. En revanche, « adaptogène » n'est pas une catégorie réglementaire européenne, et les allégations sur les plantes restent en attente d'évaluation par l'EFSA." },
      { q: "Peut-on prendre plusieurs adaptogènes ensemble ?", a: "Oui, c'est même la logique des formules combinées, qui associent des actifs complémentaires. Évitez en revanche de cumuler plusieurs produits contenant le même actif, pour ne pas dépasser les doses." },
      { q: "Y a-t-il des contre-indications ?", a: "Grossesse, allaitement, traitements thyroïdiens, anticoagulants, antidiabétiques, anxiolytiques ou immunosuppresseurs, et maladies auto-immunes pour l'ashwagandha. Demandez l'avis d'un professionnel de santé." },
    ],
    en: {
      title: "What is an adaptogen? Definition, plants and benefits",
      metaTitle: "What is an adaptogen? Definition",
      metaDescription: "The definition of an adaptogen, its historical criteria, the plants and mushrooms involved, what EU regulation allows, and how to use them.",
      excerpt: "Definition, criteria, plants involved: understanding adaptogens, the botanicals that help the body cope with demands.",
      category: "Ingredients & science",
      intro: "An <strong>adaptogen</strong> is a natural substance — plant or mushroom — that helps the body cope with physical, mental or environmental demands, by favouring a return to balance rather than by stimulating. That nuance is what separates it from a stimulant, and it's what we'll unpack here: where the term comes from, which criteria a plant must meet, which ones qualify, and what regulation allows you to say about them.",
      blocks: [
        { h2: "The definition, and where it comes from" },
        { p: "The word was coined in 1947 by the Russian pharmacologist Nikolai Lazarev, then refined in 1968 by Israel Brekhman. Three criteria had to be met: being non-toxic at usual doses, increasing the body's non-specific resistance — that is, to demands of varied nature — and having a normalising action that returns towards balance rather than pushing in one direction." },
        { p: "That third criterion is the interesting one. A stimulant always pushes the same way, whatever your state. An adaptogen is described as a modulator: the same active is associated with calming in a tense person and with supporting vitality in an exhausted one." },
        { p: "One point must be clear: «\u00a0adaptogen\u00a0» is a pharmacology term, not an EU regulatory category. No legal definition frames it in the Union, which is why you find it on wildly uneven products." },

        { h2: "How they work, as far as we know" },
        { p: "The best-documented mechanism concerns the hypothalamic-pituitary-adrenal axis, which drives the stress response and cortisol secretion. Several adaptogens are studied for their influence on it: the work indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=adaptogen+stress+response\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> focuses mainly on ashwagandha, rhodiola and eleuthero." },
        { p: "Depending on the species, antioxidant compounds are added and, for mushrooms, beta-glucans — cell-wall polysaccharides under research for immunity. The quality of evidence varies a great deal between actives: solid for some, preliminary for others. An honest article has to say so." },
        { p: "One last point: their action is <strong>gradual</strong>. Nothing happens in three days. Study protocols generally run eight to twelve weeks, which is why a course of at least a month is recommended." },

        { h2: "The most studied plants and mushrooms" },
        { h3: "Ashwagandha (Withania somnifera)" },
        { p: "The best documented on stress and cortisol. A root used in Ayurvedic medicine, now standardised in withanolides. Forms and contraindications in our page on <a href=\"" + le("/blog/ashwagandha") + "\">ashwagandha</a>." },
        { h3: "Rhodiola rosea" },
        { p: "Studied for mental fatigue and demanding periods. Take it in the morning, as it can interfere with falling asleep." },
        { h3: "Panax ginseng" },
        { p: "The longest-documented tonic, used for general vitality. Avoid combining it with certain treatments without medical advice." },
        { h3: "Functional mushrooms" },
        { p: "Reishi, cordyceps, chaga and lion's mane form the family of so-called adaptogenic or functional mushrooms. They're compared in detail in our <a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">guide to adaptogenic mushrooms</a> and, for the main three, in <a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Reishi, Cordyceps and Chaga</a>." },
        { h3: "Saffron, eleuthero, schisandra" },
        { p: "Less known to the public, they complete the family. Saffron is studied for mood and has the advantage of being active at low doses." },

        { h2: "What regulation allows you to say" },
        { p: "This is the part most articles skip. In the European Union, health claims are governed by regulation (EC) No 1924/2006: only those listed in the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register</a> may be used." },
        { p: "Claims relating to plants — «\u00a0botanicals\u00a0» — are still <strong>pending evaluation</strong> by EFSA. They are tolerated in their filed wording, which forbids rephrasing them freely and explains the careful language of serious brands: you read «\u00a0contributes to\u00a0» or «\u00a0supports\u00a0», never «\u00a0cures\u00a0» or «\u00a0treats\u00a0»." },
        { p: "A food supplement is not a medicine. By legal definition it cannot claim any property of preventing, treating or curing a disease. A brand that says otherwise is in breach, and France's <a href=\"https://www.economie.gouv.fr/dgccrf\" target=\"_blank\" rel=\"noopener noreferrer\">DGCCRF</a> enforces this field." },

        { h2: "How to use them, concretely" },
        {
          ul: [
            "<strong>In courses</strong> of one to three months, followed by a break: that's the usual pattern.",
            "<strong>At the right time</strong>: rhodiola and ginseng in the morning, reishi and ashwagandha rather in the evening.",
            "<strong>On a standardised extract</strong> where one exists: it guarantees a constant active content, unlike raw plant powder.",
            "<strong>With regularity</strong> rather than at high doses: studies are built on daily intake, not on peaks.",
          ],
        },
        { p: "Format matters less than adherence: the best form is the one you'll actually take every day for a month. That's the subject of our comparison, <a href=\"" + le("/blog/gummies-vs-gelules") + "\">gummies or capsules</a>." },

        { h2: "Precautions and contraindications" },
        { p: "Non-toxic doesn't mean harmless. Adaptogens are not advised during pregnancy or breastfeeding, and require medical advice alongside ongoing treatment — particularly thyroid, anticoagulant, antidiabetic, anxiolytic or immunosuppressant. Ashwagandha is also not advised in autoimmune conditions." },
        { p: "Respect the stated daily dose, don't stack several products containing the same active, and mention what you take to your doctor or pharmacist, exactly as you would a medicine." },

        { h2: "Where to start" },
        { p: "Start from the need, not the ingredient. Sleep and nervous tension point to ashwagandha, reishi and saffron; focus to lion's mane and rhodiola; physical energy to cordyceps and ginseng. The <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> sorts this in a minute, and the <a href=\"" + le("/ingredients") + "\">ingredients</a> page details every active used in our formulas." },
      ],
      faq: [
        { q: "What is an adaptogen, simply put?", a: "A plant or mushroom that helps the body resist demands — stress, fatigue, effort — by favouring a return to balance, without the direct stimulant effect of caffeine." },
        { q: "Which adaptogens are best known?", a: "Ashwagandha, rhodiola, panax ginseng, eleuthero and saffron among plants; reishi, cordyceps, chaga and lion's mane among mushrooms." },
        { q: "How long before you feel the effects?", a: "Allow three to four weeks of regular use. Clinical studies usually run eight to twelve weeks: nothing is decided in a few days." },
        { q: "Are adaptogens scientifically recognised?", a: "The term comes from pharmacology and several actives are the subject of clinical trials, with evidence quality varying by species. However, «\u00a0adaptogen\u00a0» is not an EU regulatory category, and claims on plants remain pending EFSA evaluation." },
        { q: "Can you take several adaptogens together?", a: "Yes — that's the logic of combined formulas, which pair complementary actives. Avoid stacking several products containing the same active, so as not to exceed doses." },
        { q: "Are there contraindications?", a: "Pregnancy, breastfeeding, thyroid, anticoagulant, antidiabetic, anxiolytic or immunosuppressant treatments, and autoimmune conditions for ashwagandha. Seek advice from a healthcare professional." },
      ],
    },
  },
  {
    slug: "collagene-bienfaits-peau",
    title: "Collagène : bienfaits pour la peau et comment en profiter",
    metaTitle: "Collagène : bienfaits pour la peau",
    metaDescription:
      "Ce que fait vraiment le collagène pour la peau, ce que valent les compléments, quelle forme choisir et à quelle dose, sources scientifiques à l'appui.",
    excerpt:
      "Hydratation, élasticité, éclat : ce que le collagène apporte à la peau, ce que valent les compléments et comment en tirer parti au quotidien.",
    category: "Beauté & bien-être",
    date: "2026-05-06",
    readingMinutes: 9,
    cover: "/brand/blog/cover-collagene.jpg",
    intro:
      "Le <strong>collagène</strong> est la protéine la plus abondante du corps humain : il représente environ un tiers de nos protéines totales et forme l'armature du derme. Sa production diminue à partir de la vingtaine, d'environ 1 % par an, et cette baisse s'accélère à la ménopause. D'où l'intérêt pour les compléments — mais tous ne se valent pas, et l'essentiel se joue sur la forme et la dose. Voici ce qu'on sait, et ce qu'on ne sait pas.",
    blocks: [
      { h2: "Ce que fait le collagène dans la peau" },
      { p: "Le derme, couche profonde de la peau, est constitué d'un maillage de fibres de collagène et d'élastine baignant dans l'acide hyaluronique. Le collagène apporte la résistance et la fermeté, l'élastine la souplesse, l'acide hyaluronique la rétention d'eau. Quand le maillage se raréfie, la peau perd en densité : les rides s'installent, le teint paraît plus terne." },
      { p: "Chez l'humain, on dénombre une trentaine de types de collagène. Trois comptent pour ce sujet : le <strong>type I</strong>, majoritaire dans la peau, les os et les tendons ; le <strong>type II</strong>, spécifique du cartilage ; le <strong>type III</strong>, présent dans les tissus jeunes et les vaisseaux. Un complément orienté peau contient logiquement du type I, seul ou associé au III." },

      { h2: "Pourquoi il diminue, et ce qui accélère la perte" },
      { p: "La baisse liée à l'âge est inévitable, mais son rythme dépend beaucoup du mode de vie. Quatre facteurs pèsent nettement :" },
      {
        ul: [
          "<strong>L'exposition solaire</strong> sans protection : les UV dégradent directement les fibres de collagène. C'est, de loin, le premier facteur de vieillissement cutané.",
          "<strong>Le tabac</strong>, qui réduit la vascularisation du derme et la synthèse de collagène.",
          "<strong>Les excès de sucre</strong>, par le phénomène de glycation : les protéines se rigidifient et perdent leur souplesse.",
          "<strong>Le manque de sommeil</strong> et le stress chronique, qui perturbent la réparation cellulaire nocturne.",
        ],
      },
      { p: "Autrement dit, protéger le collagène existant est au moins aussi utile que d'en apporter. Une crème solaire quotidienne fait davantage pour votre peau que n'importe quel complément." },

      { h2: "Les compléments : ce que dit la recherche" },
      { p: "L'objection est connue : une protéine avalée est digérée, découpée en acides aminés, et rien ne garantit qu'elle reparte former du collagène cutané. C'est exact pour du collagène natif." },
      { p: "Les produits actuels utilisent donc des <strong>peptides de collagène hydrolysés</strong> : la protéine est prédécoupée en fragments courts, plus facilement absorbés. Plusieurs essais cliniques référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=collagen+peptides+skin+elasticity\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> ont mesuré l'élasticité et l'hydratation cutanées après 8 à 12 semaines de prise quotidienne." },
      { p: "Ce qu'il faut retenir avec honnêteté : les résultats existent mais restent modestes, les protocoles varient beaucoup, et une partie des études est financée par les fabricants. Il n'existe par ailleurs <strong>aucune allégation santé autorisée</strong> pour le collagène au <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen</a> — raison pour laquelle aucune marque sérieuse ne promet un effet anti-rides." },

      { h2: "Bien choisir son collagène" },
      { h3: "La forme" },
      { p: "Cherchez la mention <strong>peptides de collagène hydrolysés</strong>, avec un poids moléculaire indiqué — généralement 2 000 à 5 000 daltons. Plus les fragments sont courts, mieux ils sont absorbés." },
      { h3: "La source" },
      { p: "Marin (poisson) ou bovin, principalement. Le collagène marin est majoritairement de type I, donc plutôt orienté peau ; le bovin apporte des types I et III. Il n'existe pas de collagène végétal : les produits « vegan » apportent en réalité des nutriments qui soutiennent la synthèse endogène, ce qui est un mécanisme différent et doit être annoncé comme tel." },
      { h3: "La dose" },
      { p: "Les études utilisent le plus souvent 2,5 à 10 g par jour. En dessous de 2,5 g, l'intérêt n'est pas démontré — un point à vérifier sur l'étiquette, car certains produits affichent une belle image et 500 mg de collagène." },
      { h3: "Les cofacteurs" },
      { p: "La <strong>vitamine C</strong> est indispensable : elle contribue à la formation normale de collagène pour un fonctionnement normal de la peau — l'une des rares allégations autorisées dans ce champ. Le zinc et le cuivre participent également au maintien d'une peau normale." },

      { h2: "Ce qui compte autant que la supplémentation" },
      { p: "Un apport protéique suffisant à chaque repas fournit les acides aminés de base — glycine, proline, hydroxyproline. Une alimentation riche en vitamine C (agrumes, kiwi, poivron, persil) permet leur assemblage. L'hydratation, le sommeil et la protection solaire font le reste." },
      { p: "Les antioxydants complètent le tableau en limitant le stress oxydatif qui dégrade les fibres : c'est le rôle du <strong>chaga</strong> dans notre supermix <a href=\"" + l("/products/mushglow") + "\">MUSHGLOW</a>, qui associe collagène marin, champignons et vitamines. Notre guide des <a href=\"" + l("/blog/complement-peau-guide") + "\">compléments pour une belle peau</a> détaille les autres actifs utiles." },

      { h2: "Combien de temps avant de voir quelque chose" },
      { p: "Le renouvellement du derme est lent. Les études qui observent un effet le mesurent après 8 à 12 semaines de prise quotidienne : c'est le délai minimal à se donner. Une cure de trois semaines ne permet de conclure à rien, ni dans un sens ni dans l'autre." },
      { p: "Et il faut poser la limite clairement : un complément ne comble pas une ride, ne remplace pas une protection solaire et ne rattrape pas un sommeil chroniquement insuffisant." },

      { h2: "Précautions" },
      { p: "Le collagène marin est contre-indiqué en cas d'allergie au poisson ou aux crustacés. Comme tout complément alimentaire, il ne se substitue pas à une alimentation variée et équilibrée ni à un mode de vie sain, et ne prévient, ne traite ni ne guérit aucune maladie. En cas de grossesse, d'allaitement ou de traitement en cours, demandez l'avis d'un professionnel de santé." },

      { h2: "En pratique" },
      { p: "Un apport de 2,5 à 10 g de peptides hydrolysés par jour, associé à de la vitamine C, sur au moins deux mois, dans le cadre d'une alimentation correcte et avec une protection solaire quotidienne. C'est l'ensemble qui fait le résultat, pas le complément seul." },
      { p: "Pour trouver la formule adaptée à votre situation, faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> ou parcourez la collection <a href=\"" + l("/collections/beaute-et-bien-etre") + "\">Beauté &amp; Bien-être</a>." },
    ],
    faq: [
      { q: "Le collagène en complément fonctionne-t-il vraiment ?", a: "Les peptides hydrolysés font l'objet d'essais cliniques montrant des effets modestes sur l'élasticité et l'hydratation après 8 à 12 semaines. Les résultats sont réels mais mesurés, et aucune allégation santé n'est autorisée au niveau européen pour le collagène." },
      { q: "Quelle dose de collagène par jour ?", a: "Les études utilisent 2,5 à 10 g par jour. En dessous de 2,5 g, l'intérêt n'est pas démontré : vérifiez la quantité réelle sur l'étiquette, pas seulement la présence du mot collagène." },
      { q: "Marin ou bovin ?", a: "Le marin est majoritairement de type I, celui de la peau. Le bovin apporte des types I et III. Les deux conviennent ; le marin est contre-indiqué en cas d'allergie au poisson." },
      { q: "Existe-t-il du collagène vegan ?", a: "Non. Le collagène est une protéine animale. Les produits dits vegan apportent des nutriments qui soutiennent la synthèse naturelle — vitamine C, acides aminés, zinc — ce qui est un mécanisme différent." },
      { q: "Faut-il de la vitamine C avec ?", a: "Oui, elle est nécessaire à la formation du collagène : c'est d'ailleurs l'une des rares allégations autorisées dans ce domaine. La plupart des bonnes formules l'intègrent." },
      { q: "Au bout de combien de temps voit-on un effet ?", a: "Comptez 8 à 12 semaines de prise quotidienne. En dessous de deux mois, aucune conclusion n'est possible." },
    ],
    en: {
      title: "Collagen: benefits for skin and how to make the most of it",
      metaTitle: "Collagen: benefits for the skin",
      metaDescription: "What collagen really does for your skin, what supplements are worth, which form to choose and at what dose, with the science to back it.",
      excerpt: "Hydration, elasticity, radiance: what collagen brings to the skin, what supplements are worth and how to benefit day to day.",
      category: "Beauty & wellbeing",
      intro: "<strong>Collagen</strong> is the most abundant protein in the human body: about a third of our total protein, and the scaffolding of the dermis. Production declines from our twenties, by roughly 1% a year, and the drop accelerates at menopause. Hence the interest in supplements — but they aren't equal, and everything hinges on form and dose. Here's what we know, and what we don't.",
      blocks: [
        { h2: "What collagen does in the skin" },
        { p: "The dermis, the skin's deep layer, is a mesh of collagen and elastin fibres bathed in hyaluronic acid. Collagen provides strength and firmness, elastin suppleness, hyaluronic acid water retention. As the mesh thins, skin loses density: lines settle in, complexion looks duller." },
        { p: "Humans have around thirty types of collagen. Three matter here: <strong>type I</strong>, dominant in skin, bone and tendon; <strong>type II</strong>, specific to cartilage; <strong>type III</strong>, found in young tissue and blood vessels. A skin-oriented supplement logically contains type I, alone or with III." },

        { h2: "Why it declines, and what speeds it up" },
        { p: "Age-related decline is unavoidable, but its pace depends heavily on lifestyle. Four factors weigh clearly:" },
        {
          ul: [
            "<strong>Unprotected sun exposure</strong>: UV directly degrades collagen fibres. By far the leading cause of skin ageing.",
            "<strong>Smoking</strong>, which reduces dermal blood supply and collagen synthesis.",
            "<strong>Excess sugar</strong>, through glycation: proteins stiffen and lose their suppleness.",
            "<strong>Lack of sleep</strong> and chronic stress, which disrupt overnight cellular repair.",
          ],
        },
        { p: "In other words, protecting existing collagen is at least as useful as adding more. Daily sunscreen does more for your skin than any supplement." },

        { h2: "Supplements: what the research says" },
        { p: "The objection is well known: a protein you swallow is digested, cut into amino acids, and nothing guarantees it reassembles as skin collagen. That's true of native collagen." },
        { p: "Current products therefore use <strong>hydrolysed collagen peptides</strong>: the protein is pre-cut into short fragments that are absorbed more readily. Several clinical trials indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=collagen+peptides+skin+elasticity\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a> have measured skin elasticity and hydration after 8 to 12 weeks of daily intake." },
        { p: "What honesty requires: results exist but stay modest, protocols vary a great deal, and part of the research is manufacturer-funded. There is moreover <strong>no authorised health claim</strong> for collagen in the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register</a> — which is why no serious brand promises an anti-wrinkle effect." },

        { h2: "Choosing your collagen" },
        { h3: "The form" },
        { p: "Look for <strong>hydrolysed collagen peptides</strong>, with a stated molecular weight — generally 2,000 to 5,000 daltons. The shorter the fragments, the better they're absorbed." },
        { h3: "The source" },
        { p: "Marine (fish) or bovine, mainly. Marine collagen is predominantly type I, so skin-oriented; bovine provides types I and III. There is no plant collagen: «\u00a0vegan\u00a0» products actually supply nutrients that support your own synthesis, which is a different mechanism and should be stated as such." },
        { h3: "The dose" },
        { p: "Studies mostly use 2.5 to 10 g a day. Below 2.5 g, the benefit isn't demonstrated — worth checking on the label, since some products pair a beautiful image with 500 mg of collagen." },
        { h3: "The cofactors" },
        { p: "<strong>Vitamin C</strong> is essential: it contributes to normal collagen formation for the normal function of skin — one of the few authorised claims in this field. Zinc and copper also contribute to the maintenance of normal skin." },

        { h2: "What matters as much as supplementing" },
        { p: "Enough protein at each meal supplies the base amino acids — glycine, proline, hydroxyproline. A diet rich in vitamin C (citrus, kiwi, peppers, parsley) allows them to be assembled. Hydration, sleep and sun protection do the rest." },
        { p: "Antioxidants complete the picture by limiting the oxidative stress that degrades the fibres: that's the role of <strong>chaga</strong> in our <a href=\"" + le("/products/mushglow") + "\">MUSHGLOW</a> supermix, which combines marine collagen, mushrooms and vitamins. Our guide to <a href=\"" + le("/blog/complement-peau-guide") + "\">supplements for beautiful skin</a> covers the other useful actives." },

        { h2: "How long before you see anything" },
        { p: "Dermal renewal is slow. Studies that observe an effect measure it after 8 to 12 weeks of daily intake: that's the minimum to allow. A three-week course proves nothing, either way." },
        { p: "And the limit has to be stated plainly: a supplement doesn't fill a wrinkle, doesn't replace sun protection, and doesn't make up for chronically insufficient sleep." },

        { h2: "Precautions" },
        { p: "Marine collagen is contraindicated with fish or shellfish allergy. Like any food supplement, it doesn't replace a varied, balanced diet or a healthy lifestyle, and it neither prevents, treats nor cures any disease. If pregnant, breastfeeding or on medication, seek advice from a healthcare professional." },

        { h2: "In practice" },
        { p: "2.5 to 10 g of hydrolysed peptides a day, with vitamin C, for at least two months, alongside a decent diet and daily sun protection. It's the whole that produces the result, not the supplement alone." },
        { p: "To find the formula that fits your situation, take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> or browse the <a href=\"" + le("/collections/beaute-et-bien-etre") + "\">Beauty &amp; Wellbeing</a> collection." },
      ],
      faq: [
        { q: "Do collagen supplements really work?", a: "Hydrolysed peptides are the subject of clinical trials showing modest effects on elasticity and hydration after 8 to 12 weeks. The results are real but measured, and no health claim is authorised for collagen at EU level." },
        { q: "How much collagen per day?", a: "Studies use 2.5 to 10 g a day. Below 2.5 g the benefit isn't demonstrated: check the actual amount on the label, not just the presence of the word collagen." },
        { q: "Marine or bovine?", a: "Marine is predominantly type I, the skin type. Bovine supplies types I and III. Both work; marine is contraindicated with fish allergy." },
        { q: "Is there vegan collagen?", a: "No. Collagen is an animal protein. So-called vegan products supply nutrients that support your own synthesis — vitamin C, amino acids, zinc — which is a different mechanism." },
        { q: "Do you need vitamin C with it?", a: "Yes, it's required for collagen formation: that's one of the few authorised claims in this field. Most good formulas include it." },
        { q: "How long before an effect shows?", a: "Allow 8 to 12 weeks of daily intake. Below two months, no conclusion is possible." },
      ],
    },
  },
  {
    slug: "lions-mane",
    title: "Lion's Mane : ce que la recherche montre vraiment sur la mémoire et la concentration",
    metaTitle: "Lion's Mane : bienfaits, dosage & preuves",
    metaDescription:
      "Lion's Mane (hydne hérisson) : le mécanisme des héricénones, ce que montrent les essais cliniques et leurs limites, la dose utile, comment reconnaître un bon extrait.",
    excerpt:
      "Mémoire, concentration, clarté mentale : ce que les études disent réellement du Lion's Mane, à quelle dose, pendant combien de temps, et comment reconnaître un extrait qui vaut son prix.",
    category: "Ingrédients & science",
    date: "2026-06-30",
    readingMinutes: 9,
    cover: "/brand/blog/cover-lions-mane.jpg",
    intro:
      "Réponse courte : le <strong>Lion's Mane</strong> (<em>Hericium erinaceus</em>) est le champignon fonctionnel le mieux documenté sur le terrain cognitif, mais les essais cliniques restent peu nombreux et menés sur de petits effectifs. Ce n'est pas un médicament, ce n'est pas un stimulant, et aucune allégation santé n'est aujourd'hui autorisée en Europe le concernant. Ce qui suit détaille le mécanisme, ce que les études ont mesuré, ce qu'elles n'ont pas démontré, et comment distinguer un extrait sérieux d'une poudre de riz vendue au prix d'un champignon.",
    blocks: [
      { h2: "Ce qu'est le Lion's Mane" },
      { p: "L'hydne hérisson est un champignon comestible européen et asiatique, reconnaissable à ses longues aiguilles blanches qui lui valent son surnom de crinière de lion. On le mange en poêlée depuis toujours au Japon et en Chine ; sa carrière de complément, elle, est récente et tient à deux familles de molécules découvertes dans les années 1990." },
      { p: "Il appartient au groupe des <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">champignons adaptogènes</a>, dont il partage la logique : une action de fond, progressive, qui n'a rien du coup de fouet." },

      { h2: "Le mécanisme : héricénones, érinacines et facteur de croissance nerveuse" },
      { p: "Deux familles de composés portent l'intérêt scientifique. Les <strong>héricénones</strong> se trouvent dans le chapeau, la partie visible du champignon ; les <strong>érinacines</strong>, dans le mycélium, sa partie souterraine. Les deux ont montré <em>in vitro</em> et chez l'animal une capacité à stimuler la synthèse du <strong>NGF</strong> (<em>nerve growth factor</em>), une protéine qui participe à l'entretien et à la croissance des neurones." },
      { p: "Deux réserves s'imposent immédiatement, et elles sont rarement mentionnées. D'abord, un résultat obtenu sur des cellules en boîte ou sur des rongeurs ne se transpose pas automatiquement à l'humain. Ensuite, le NGF est une grosse molécule qui ne franchit pas la barrière hémato-encéphalique : l'hypothèse retenue est que ce sont les composés du champignon, eux, qui la franchissent et stimulent la production locale de NGF. C'est plausible et documenté chez l'animal, ce n'est pas établi chez l'humain." },

      { h2: "Ce que montrent les essais cliniques, et ce qu'ils ne montrent pas" },
      { p: "L'essai le plus cité est japonais, publié en 2009 : trente adultes de 50 à 80 ans présentant un déficit cognitif léger ont reçu 3 g de poudre de Lion's Mane par jour pendant seize semaines. Les scores cognitifs se sont améliorés par rapport au placebo — et sont redescendus quatre semaines après l'arrêt. Trente participants, c'est peu ; mais le protocole était contrôlé et le résultat reste la référence du domaine." },
      { p: "Des travaux plus récents, référencés sur <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus+cognitive\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a>, ont porté sur des adultes jeunes et en bonne santé : ils rapportent une vitesse de traitement de l'information légèrement meilleure une heure après une prise unique, et une baisse du stress ressenti après quatre semaines. Là encore, effectifs réduits et effets modestes." },
      { p: "Ce qu'on peut honnêtement en conclure : un faisceau d'indices convergents, cohérent avec le mécanisme, mais pas la démonstration d'un effet spectaculaire. Personne n'a montré que le Lion's Mane rendait plus intelligent, prévenait une maladie neurodégénérative ou remplaçait le sommeil. Toute page qui l'affirme dépasse les données." },

      { h2: "Ce que la réglementation autorise à écrire" },
      { p: "En Europe, les allégations de santé sont encadrées par le <strong>règlement CE n° 1924/2006</strong>. Les substances végétales et fongiques — dont les champignons — font l'objet d'allégations dites « en attente » : elles n'ont été ni validées ni rejetées par l'EFSA, et leur usage reste transitoirement toléré, sans figurer au <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">registre européen des allégations autorisées</a>." },
      { p: "Conséquence pratique : une marque sérieuse écrit que le Lion's Mane est traditionnellement utilisé pour le soutien cognitif, jamais qu'il « améliore la mémoire » ou « traite » quoi que ce soit. Nos formules concentration s'appuient d'ailleurs sur des nutriments dont les allégations sont autorisées — comme les vitamines B5 et B12, qui contribuent à des performances intellectuelles normales et à la réduction de la fatigue." },

      { h2: "Reconnaître un extrait qui vaut son prix" },
      { h3: "Corps fructifère ou mycélium sur grain" },
      { p: "C'est le point le plus important, et le plus mal signalé. Une partie des produits du marché, surtout nord-américains, utilisent du <strong>mycélium cultivé sur grain</strong> — riz ou avoine — puis broyé avec son substrat. Le résultat contient majoritairement de l'amidon. Cherchez la mention <strong>corps fructifère</strong> (<em>fruiting body</em>) : si l'étiquette reste floue, l'information manque rarement par hasard." },
      { h3: "Le taux de bêta-glucanes" },
      { p: "Les bêta-glucanes sont les polysaccharides caractéristiques des champignons ; leur taux, quand il est indiqué, sert d'indicateur de qualité. Un extrait correct en titre au moins 25 %. Méfiez-vous de la mention « polysaccharides totaux » : elle englobe l'amidon du substrat et gonfle artificiellement le chiffre." },
      { h3: "Le mode d'extraction" },
      { p: "Les bêta-glucanes s'extraient à l'eau chaude, les héricénones à l'alcool. Une <strong>double extraction</strong> — eau puis éthanol — récupère donc les deux familles, là où une extraction aqueuse seule laisse une partie des composés dans le champignon." },

      { h2: "Dose et durée : le protocole raisonnable" },
      { p: "Les études cognitives utilisent 3 g de poudre de champignon entier par jour, ou 500 mg à 1 g d'extrait concentré — un extrait 8:1 concentrant huit kilos de champignon frais en un kilo de poudre. Comparer une dose de poudre à une dose d'extrait n'a donc aucun sens : c'est l'équivalence en champignon qui compte." },
      { p: "Sur la durée, l'essai de référence mesurait à seize semaines, et les effets s'estompaient un mois après l'arrêt. Retenez deux repères : <strong>quatre semaines</strong> avant d'espérer remarquer quoi que ce soit, <strong>deux à trois mois</strong> pour juger honnêtement. Une prise le matin, régulière, vaut mieux qu'une dose double un jour sur trois." },

      { h2: "Ce qui compte autant que le complément" },
      { p: "Aucun champignon ne compense une nuit de cinq heures. Le sommeil profond est le moment où le cerveau consolide la mémoire et évacue ses déchets métaboliques ; c'est le premier levier, très loin devant tout le reste. Viennent ensuite l'activité physique, qui augmente le débit sanguin cérébral, et la réduction du morcellement de l'attention — notifications, tâches simultanées." },
      { p: "Nous détaillons ces leviers dans notre article sur <a href=\"" + l("/blog/ameliorer-sa-concentration") + "\">l'amélioration de la concentration</a>, et les causes possibles d'un <a href=\"" + l("/blog/brouillard-mental") + "\">brouillard mental</a> persistant." },

      { h2: "Quand consulter un professionnel de santé" },
      { p: "Un complément n'a pas sa place face à certains signaux. Consultez un médecin si vous constatez des oublis qui inquiètent votre entourage, une désorientation, une perte de mots inhabituelle, ou une baisse cognitive installée depuis plusieurs mois." },
      { p: "De même, une difficulté de concentration récente accompagnée de fatigue persistante mérite un bilan avant toute supplémentation : une carence en fer ou en vitamine B12, une thyroïde ralentie, une apnée du sommeil ou un état dépressif produisent exactement ces symptômes, et se traitent — ce qu'aucun champignon ne fera." },

      { h2: "Précautions" },
      { p: "Le Lion's Mane est bien toléré aux doses usuelles. De rares réactions cutanées ou respiratoires ont été rapportées, principalement chez des personnes sensibles aux moisissures et aux champignons : l'allergie aux champignons constitue une contre-indication. Par manque de données, il est déconseillé pendant la grossesse et l'allaitement." },
      { p: "En cas de traitement anticoagulant, de chirurgie programmée ou de maladie auto-immune, demandez l'avis de votre médecin avant d'en prendre. Tout effet indésirable lié à un complément alimentaire peut être signalé au dispositif de <a href=\"https://www.anses.fr/fr/content/nutrivigilance\" target=\"_blank\" rel=\"noopener noreferrer\">nutrivigilance de l'ANSES</a>. Comme tout complément, il ne se substitue pas à une alimentation variée et équilibrée ni à un mode de vie sain." },

      { h2: "En pratique, chez BIEN" },
      { p: "Le Lion's Mane est l'actif central de nos formules cognitives : les gummies <a href=\"" + l("/products/focus") + "\">FOCUS</a>, pensés pour la concentration au quotidien, et la poudre <a href=\"" + l("/products/mushglow") + "\">MUSHGLOW</a>, qui l'associe à d'autres champignons et au collagène. Le détail des actifs et de leurs dosages figure sur la page <a href=\"" + l("/ingredients") + "\">Ingrédients</a>." },
      { p: "Si vous hésitez entre plusieurs formules, le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> oriente en quelques questions, et la collection <a href=\"" + l("/collections/concentration") + "\">Concentration</a> rassemble les produits concernés." },
    ],
    faq: [
      { q: "Le Lion's Mane est-il un excitant ?", a: "Non. Il ne contient pas de caféine et n'agit pas comme un stimulant : pas de coup de fouet, pas de redescente, et aucun effet sur l'endormissement. C'est précisément ce qui le distingue du café." },
      { q: "Au bout de combien de temps ressent-on quelque chose ?", a: "Comptez quatre semaines de prise quotidienne au minimum, et deux à trois mois pour juger honnêtement. L'essai clinique de référence mesurait ses effets à seize semaines." },
      { q: "Quelle dose de Lion's Mane par jour ?", a: "Les études utilisent 3 g de poudre de champignon entier, ou 500 mg à 1 g d'extrait concentré. Ne comparez jamais une dose de poudre à une dose d'extrait sans regarder le ratio de concentration indiqué." },
      { q: "Comment savoir si un produit est de qualité ?", a: "Trois repères : la mention « corps fructifère » plutôt que mycélium sur grain, un taux de bêta-glucanes d'au moins 25 % (et non de « polysaccharides totaux »), et une double extraction eau et alcool." },
      { q: "Peut-on associer Lion's Mane et café ?", a: "Oui, et c'est même le principe du café aux champignons. Le champignon n'atténue pas la caféine, mais beaucoup de personnes rapportent une stimulation plus régulière. Notre article sur le mushroom coffee détaille le sujet." },
      { q: "Le Lion's Mane améliore-t-il vraiment la mémoire ?", a: "Les données existantes sont encourageantes mais limitées : petits effectifs, effets modestes, aucune allégation de santé autorisée en Europe. Il est traditionnellement utilisé en soutien des fonctions cognitives ; parler de traitement de la mémoire serait faux." },
    ],
    en: {
      title: "Lion's Mane: what the research actually shows about memory and focus",
      metaTitle: "Lion's Mane: benefits, dosage & evidence",
      metaDescription:
        "Lion's Mane (Hericium erinaceus): how hericenones work, what the clinical trials show and where they stop, the useful dose, and how to spot a genuine extract.",
      excerpt:
        "Memory, focus, mental clarity: what the studies really say about Lion's Mane, at what dose, for how long, and how to recognise an extract worth its price.",
      category: "Ingredients & science",
      intro:
        "Short answer: <strong>Lion's Mane</strong> (<em>Hericium erinaceus</em>) is the best-documented functional mushroom on cognitive ground, but the clinical trials remain few and small. It is not a medicine, it is not a stimulant, and no health claim is currently authorised for it in Europe. What follows sets out the mechanism, what the studies measured, what they did not demonstrate, and how to tell a serious extract from rice powder sold at mushroom prices.",
      blocks: [
        { h2: "What Lion's Mane is" },
        { p: "Lion's Mane is an edible European and Asian mushroom, recognisable by the long white spines that earned it its name. It has been eaten pan-fried in Japan and China for centuries; its career as a supplement is recent, and rests on two families of molecules identified in the 1990s." },
        { p: "It belongs to the <a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogenic mushrooms</a>, whose logic it shares: a gradual, background action, nothing like a jolt." },

        { h2: "The mechanism: hericenones, erinacines and nerve growth factor" },
        { p: "Two families of compounds carry the scientific interest. <strong>Hericenones</strong> sit in the cap, the visible part of the mushroom; <strong>erinacines</strong> in the mycelium, its underground part. Both have shown, <em>in vitro</em> and in animals, an ability to stimulate synthesis of <strong>NGF</strong> (nerve growth factor), a protein involved in maintaining and growing neurons." },
        { p: "Two caveats apply immediately, and they are rarely mentioned. First, a result obtained in a dish or in rodents does not transpose automatically to humans. Second, NGF is a large molecule that does not cross the blood-brain barrier: the working hypothesis is that the mushroom's compounds cross it and stimulate local NGF production. That is plausible and documented in animals; it is not established in humans." },

        { h2: "What the clinical trials show, and what they don't" },
        { p: "The most cited trial is Japanese, published in 2009: thirty adults aged 50 to 80 with mild cognitive impairment took 3 g of Lion's Mane powder daily for sixteen weeks. Cognitive scores improved against placebo — and fell back four weeks after stopping. Thirty participants is few; but the protocol was controlled, and the result remains the field's reference." },
        { p: "More recent work, indexed on <a href=\"https://pubmed.ncbi.nlm.nih.gov/?term=hericium+erinaceus+cognitive\" target=\"_blank\" rel=\"noopener noreferrer\">PubMed</a>, has looked at young healthy adults: it reports slightly better processing speed an hour after a single dose, and lower self-reported stress after four weeks. Again, small samples and modest effects." },
        { p: "What can honestly be concluded: a converging set of indications, consistent with the mechanism, but not the demonstration of a dramatic effect. Nobody has shown that Lion's Mane makes you smarter, prevents a neurodegenerative disease or replaces sleep. Any page claiming so goes beyond the data." },

        { h2: "What the regulations allow you to write" },
        { p: "In Europe, health claims fall under <strong>Regulation (EC) No 1924/2006</strong>. Botanical and fungal substances — mushrooms among them — are covered by so-called « on hold » claims: neither validated nor rejected by EFSA, tolerated transitionally, and absent from the <a href=\"https://ec.europa.eu/food/safety/labelling-nutrition/claims/register/public/\" target=\"_blank\" rel=\"noopener noreferrer\">EU register of authorised claims</a>." },
        { p: "In practice: a serious brand writes that Lion's Mane is traditionally used for cognitive support, never that it « improves memory » or « treats » anything. Our focus formulas lean on nutrients whose claims are authorised — such as vitamins B5 and B12, which contribute to normal psychological function and to the reduction of tiredness." },

        { h2: "Spotting an extract worth its price" },
        { h3: "Fruiting body or grain-grown mycelium" },
        { p: "This is the most important point, and the worst signposted. Part of the market, North American products especially, uses <strong>mycelium grown on grain</strong> — rice or oats — then milled with its substrate. The result is mostly starch. Look for <strong>fruiting body</strong>: when a label stays vague, the information is rarely missing by accident." },
        { h3: "Beta-glucan content" },
        { p: "Beta-glucans are the polysaccharides characteristic of mushrooms; where stated, their level serves as a quality marker. A decent extract states at least 25%. Be wary of « total polysaccharides »: that figure includes the substrate's starch and inflates the number." },
        { h3: "The extraction method" },
        { p: "Beta-glucans are extracted in hot water, hericenones in alcohol. A <strong>dual extraction</strong> — water then ethanol — therefore recovers both families, where a water-only extraction leaves part of the compounds behind." },

        { h2: "Dose and duration: the sensible protocol" },
        { p: "Cognitive studies use 3 g of whole mushroom powder a day, or 500 mg to 1 g of concentrated extract — an 8:1 extract condensing eight kilos of fresh mushroom into one kilo of powder. Comparing a powder dose with an extract dose is therefore meaningless: what counts is the mushroom equivalent." },
        { p: "On duration, the reference trial measured at sixteen weeks, and effects faded a month after stopping. Keep two markers: <strong>four weeks</strong> before expecting to notice anything, <strong>two to three months</strong> to judge honestly. A regular morning dose beats a double dose every third day." },

        { h2: "What matters as much as the supplement" },
        { p: "No mushroom compensates for a five-hour night. Deep sleep is when the brain consolidates memory and clears its metabolic waste; it is the first lever, far ahead of anything else. Then comes physical activity, which raises cerebral blood flow, and reducing the fragmentation of attention — notifications, parallel tasks." },
        { p: "We cover those levers in our article on <a href=\"" + le("/blog/ameliorer-sa-concentration") + "\">improving focus</a>, and the possible causes of persistent <a href=\"" + le("/blog/brouillard-mental") + "\">mental fog</a>." },

        { h2: "When to see a healthcare professional" },
        { p: "A supplement has no place against certain signals. See a doctor if you notice lapses that worry those around you, disorientation, unusual word-finding difficulty, or a cognitive decline settled in over several months." },
        { p: "Likewise, recent difficulty concentrating alongside persistent fatigue deserves a check-up before any supplementation: iron or vitamin B12 deficiency, an underactive thyroid, sleep apnoea or a depressive state produce exactly these symptoms — and can be treated, which no mushroom will do." },

        { h2: "Precautions" },
        { p: "Lion's Mane is well tolerated at usual doses. Rare skin or respiratory reactions have been reported, mainly in people sensitive to moulds and fungi: mushroom allergy is a contraindication. For lack of data, it is not recommended during pregnancy or breastfeeding." },
        { p: "If you are on anticoagulants, have surgery scheduled or live with an autoimmune condition, ask your doctor before taking it. In France, any adverse effect linked to a food supplement can be reported to <a href=\"https://www.anses.fr/fr/content/nutrivigilance\" target=\"_blank\" rel=\"noopener noreferrer\">ANSES nutrivigilance</a>. Like any supplement, it does not replace a varied, balanced diet or a healthy lifestyle." },

        { h2: "In practice, at BIEN" },
        { p: "Lion's Mane is the core active of our cognitive formulas: the <a href=\"" + le("/products/focus") + "\">FOCUS</a> gummies, designed for everyday concentration, and the <a href=\"" + le("/products/mushglow") + "\">MUSHGLOW</a> powder, which pairs it with other mushrooms and collagen. Actives and their dosages are detailed on the <a href=\"" + le("/ingredients") + "\">Ingredients</a> page." },
        { p: "If you are hesitating between formulas, the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> points you in a few questions, and the <a href=\"" + le("/collections/concentration") + "\">Focus</a> collection gathers the relevant products." },
      ],
      faq: [
        { q: "Is Lion's Mane a stimulant?", a: "No. It contains no caffeine and does not act as a stimulant: no jolt, no crash, and no effect on falling asleep. That is precisely what sets it apart from coffee." },
        { q: "How long before you feel anything?", a: "Allow four weeks of daily intake at minimum, and two to three months to judge honestly. The reference clinical trial measured its effects at sixteen weeks." },
        { q: "How much Lion's Mane per day?", a: "Studies use 3 g of whole mushroom powder, or 500 mg to 1 g of concentrated extract. Never compare a powder dose with an extract dose without checking the stated concentration ratio." },
        { q: "How can I tell whether a product is good quality?", a: "Three markers: « fruiting body » rather than grain-grown mycelium, a beta-glucan content of at least 25% (not « total polysaccharides »), and a dual water-and-alcohol extraction." },
        { q: "Can you combine Lion's Mane and coffee?", a: "Yes, and that is the very principle of mushroom coffee. The mushroom does not blunt caffeine, but many people report steadier stimulation. Our mushroom coffee article covers the subject." },
        { q: "Does Lion's Mane really improve memory?", a: "The existing data are encouraging but limited: small samples, modest effects, no authorised health claim in Europe. It is traditionally used to support cognitive function; calling it a memory treatment would be false." },
      ],
    },
  },
  {
    slug: "ashwagandha",
    title: "Ashwagandha : bienfaits, dosage et précautions",
    metaTitle: "Ashwagandha : bienfaits, dosage & avis",
    metaDescription:
      "Ashwagandha : bienfaits sur le stress, le cortisol et le sommeil, dosage recommandé, moment de prise et précautions. Le guide complet de cette plante adaptogène.",
    excerpt:
      "Stress, cortisol, sommeil : l'ashwagandha est la plante adaptogène star. Bienfaits, dosage, moment de prise et précautions dans ce guide complet.",
    category: "Ingrédients & science",
    date: "2026-06-29",
    readingMinutes: 7,
    cover: "/brand/blog/cover-ashwagandha.jpg",
    intro:
      "Reine de l'Ayurveda, l'<strong>ashwagandha</strong> (<em>Withania somnifera</em>) est l'une des plantes adaptogènes les plus étudiées au monde. Son terrain de prédilection : le stress. On vous explique ses bienfaits, la bonne dose, le meilleur moment pour la prendre et les précautions à connaître.",
    blocks: [
      { h2: "Qu'est-ce que l'ashwagandha ?" },
      { p: "L'ashwagandha est un petit arbuste dont on utilise surtout la racine. Classée parmi les <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogènes</a>, elle aide l'organisme à mieux résister aux différentes formes de stress physique et mental." },
      { h2: "Les bienfaits de l'ashwagandha" },
      { ul: [
        "<strong>Stress et anxiété</strong> : action documentée sur la réduction du <a href=\"" + l("/blog/cortisol-stress") + "\">cortisol</a>, l'hormone du stress.",
        "<strong>Sommeil</strong> : elle favorise l'endormissement et un sommeil plus réparateur.",
        "<strong>Énergie et récupération</strong> : soutien de la vitalité et de la résistance à l'effort.",
        "<strong>Équilibre émotionnel</strong> : un mental plus stable au quotidien.",
      ] },
      { h2: "Dosage et moment de prise" },
      { p: "Les études utilisent le plus souvent 300 à 600 mg d'extrait de racine standardisé par jour. Pour l'effet sur le stress, une prise en journée convient ; pour le sommeil, on la privilégie le soir. Comme pour tout adaptogène, la régularité prime : visez une cure d'au moins 4 à 8 semaines." },
      { h2: "L'ashwagandha chez BIEN" },
      { p: "L'ashwagandha est l'un des actifs clés de nos gummies <a href=\"" + l("/products/calm") + "\">CALM</a>, associée au reishi et au safran pour une action complète sur la sérénité et le sommeil. Une manière simple et gourmande d'en profiter au quotidien." },
      { h2: "Précautions" },
      { p: "L'ashwagandha est généralement bien tolérée. Elle est déconseillée en cas de grossesse, d'allaitement, de maladie auto-immune ou de troubles thyroïdiens sans avis médical. En cas de traitement, parlez-en à votre médecin." },
      { h2: "Par où commencer ?" },
      { p: "Pour apaiser le stress et mieux dormir, découvrez la collection <a href=\"" + l("/collections/serenite") + "\">Sérénité &amp; Sommeil</a> ou lisez nos <a href=\"" + l("/blog/gerer-le-stress-naturellement") + "\">7 solutions pour gérer le stress naturellement</a>." },
    ],
    faq: [
      { q: "Quand prendre l'ashwagandha, matin ou soir ?", a: "Les deux sont possibles. Le matin ou en journée pour l'effet anti-stress, le soir pour favoriser le sommeil. Dans les gummies CALM, on la prend idéalement une heure avant le coucher." },
      { q: "L'ashwagandha fait-elle grossir ?", a: "Non. En réduisant le stress et en améliorant le sommeil, elle peut au contraire aider à limiter les fringales liées au stress." },
      { q: "Peut-on prendre l'ashwagandha tous les jours ?", a: "Oui, elle se prend en cure régulière. Certains font des pauses ponctuelles, mais une prise quotidienne sur plusieurs semaines est la norme." },
    ],
    en: {
      title: "Ashwagandha: benefits, dosage and precautions",
      metaTitle: "Ashwagandha: benefits, dosage & review",
      metaDescription: "Ashwagandha: benefits for stress, cortisol and sleep, recommended dosage, timing and precautions. The complete guide to this adaptogenic plant.",
      excerpt: "Stress, cortisol, sleep: ashwagandha is the star adaptogenic plant. Benefits, dosage, timing and precautions in this complete guide.",
      category: "Ingredients & science",
      intro: "The queen of Ayurveda, <strong>ashwagandha</strong> (<em>Withania somnifera</em>) is one of the most studied adaptogenic plants in the world. Its speciality: stress. We explain its benefits, the right dose, the best time to take it and the precautions to know.",
      blocks: [
        { h2: "What is ashwagandha?" },
        { p: "Ashwagandha is a small shrub whose root is mainly used. Classed among the <a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">adaptogens</a>, it helps the body better resist various forms of physical and mental stress." },
        { h2: "The benefits of ashwagandha" },
        { ul: [
          "<strong>Stress and anxiety</strong>: documented action on reducing <a href=\"" + le("/blog/cortisol-stress") + "\">cortisol</a>, the stress hormone.",
          "<strong>Sleep</strong>: it promotes falling asleep and more restorative sleep.",
          "<strong>Energy and recovery</strong>: support for vitality and resistance to effort.",
          "<strong>Emotional balance</strong>: a more stable mind day to day.",
        ] },
        { h2: "Dosage and timing" },
        { p: "Studies most often use 300 to 600 mg of standardised root extract per day. For the stress effect, a daytime dose works; for sleep, it's preferred in the evening. As with any adaptogen, regularity is key: aim for a course of at least 4 to 8 weeks." },
        { h2: "Ashwagandha at BIEN" },
        { p: "Ashwagandha is one of the key actives in our <a href=\"" + le("/products/calm") + "\">CALM</a> gummies, combined with reishi and saffron for a complete action on calm and sleep. A simple, tasty way to enjoy it daily." },
        { h2: "Precautions" },
        { p: "Ashwagandha is generally well tolerated. It's not recommended in cases of pregnancy, breastfeeding, autoimmune disease or thyroid disorders without medical advice. If you're on treatment, talk to your doctor." },
        { h2: "Where to start?" },
        { p: "To soothe stress and sleep better, discover the <a href=\"" + le("/collections/serenite") + "\">Calm &amp; Sleep</a> collection or read our <a href=\"" + le("/blog/gerer-le-stress-naturellement") + "\">7 solutions to manage stress naturally</a>." },
      ],
      faq: [
        { q: "When to take ashwagandha, morning or evening?", a: "Both are possible. Morning or daytime for the anti-stress effect, evening to promote sleep. In the CALM gummies, it's ideally taken an hour before bed." },
        { q: "Does ashwagandha make you gain weight?", a: "No. By reducing stress and improving sleep, it can on the contrary help limit stress-related cravings." },
        { q: "Can you take ashwagandha every day?", a: "Yes, it's taken as a regular course. Some take occasional breaks, but daily intake over several weeks is the norm." },
      ],
    },
  },
  {
    slug: "reishi-cordyceps-chaga",
    title: "Reishi, Cordyceps, Chaga : le trio des champignons santé",
    metaTitle: "Reishi, Cordyceps, Chaga : le trio santé",
    metaDescription:
      "Reishi, Cordyceps et Chaga : bienfaits, différences et comment les associer. Le guide des trois champignons fonctionnels incontournables du bien-être.",
    excerpt:
      "Détente, énergie, immunité, antioxydants : Reishi, Cordyceps et Chaga forment un trio complémentaire. Bienfaits, différences et associations.",
    category: "Ingrédients & science",
    date: "2026-06-28",
    readingMinutes: 8,
    cover: "/brand/blog/cover-trio-champignons.jpg",
    intro:
      "Aux côtés du Lion's Mane, trois champignons reviennent sans cesse dans l'univers du bien-être : le <strong>Reishi</strong>, le <strong>Cordyceps</strong> et le <strong>Chaga</strong>. Chacun a sa spécialité. On vous présente ce trio, leurs bienfaits respectifs et comment les associer intelligemment.",
    blocks: [
      { h2: "Le Reishi, champignon de la détente" },
      { p: "Surnommé « champignon de l'immortalité », le Reishi est apprécié pour son action apaisante. Il favorise la détente, soutient le sommeil et participe à l'équilibre du système immunitaire. C'est l'allié des périodes de stress et des soirées où l'on cherche à relâcher la pression." },
      { h2: "Le Cordyceps, champignon de l'énergie" },
      { p: "Le Cordyceps est le champignon de la vitalité et de la performance. Traditionnellement utilisé pour soutenir l'endurance et l'oxygénation, il est plébiscité par les sportifs et par toutes les personnes en quête d'un regain d'<a href=\"" + l("/blog/retrouver-de-l-energie-naturellement") + "\">énergie naturelle</a>." },
      { h2: "Le Chaga, champignon antioxydant" },
      { p: "Le Chaga est l'un des aliments les plus riches en antioxydants. Il aide à protéger les cellules du stress oxydatif, soutient l'immunité et participe à l'éclat de la peau. Un précieux allié beauté et bien-être global." },
      { h2: "Faut-il les associer ?" },
      { p: "Oui, car leurs actions sont complémentaires : détente (Reishi), énergie (Cordyceps) et protection (Chaga). C'est toute la logique des formules « supermix ». Notre poudre <a href=\"" + l("/products/mushglow") + "\">MushGlow</a> réunit d'ailleurs ces champignons avec le Lion's Mane, le Maca et le collagène pour un <a href=\"" + l("/blog/quest-ce-quun-adaptogene") + "\">équilibre</a> global." },
      { h2: "Comment les consommer ?" },
      { p: "En poudre à diluer dans une boisson, en gélules ou en gummies. L'important reste la régularité : une prise quotidienne sur plusieurs semaines pour laisser les actifs agir en profondeur." },
      { h2: "Par où commencer ?" },
      { p: "Pour découvrir ces champignons dans une formule complète, explorez la collection <a href=\"" + l("/collections/performance-et-vitalite") + "\">Performance &amp; Vitalité</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Quel champignon pour l'énergie ?", a: "Le Cordyceps est le plus indiqué : il soutient l'endurance et la vitalité. On le retrouve dans MushGlow et dans nos formules énergie." },
      { q: "Peut-on prendre Reishi, Cordyceps et Chaga ensemble ?", a: "Oui, leurs effets sont complémentaires. Les formules supermix comme MushGlow les combinent volontairement." },
      { q: "Ces champignons sont-ils psychoactifs ?", a: "Non, aucun. Ce sont des champignons fonctionnels alimentaires, sans effet psychotrope." },
    ],
    en: {
      title: "Reishi, Cordyceps, Chaga: the trio of health mushrooms",
      metaTitle: "Reishi, Cordyceps, Chaga: the health trio",
      metaDescription: "Reishi, Cordyceps and Chaga: benefits, differences and how to combine them. The guide to the three must-have functional mushrooms for wellbeing.",
      excerpt: "Relaxation, energy, immunity, antioxidants: Reishi, Cordyceps and Chaga form a complementary trio. Benefits, differences and combinations.",
      category: "Ingredients & science",
      intro: "Alongside Lion's Mane, three mushrooms keep coming up in the wellness world: <strong>Reishi</strong>, <strong>Cordyceps</strong> and <strong>Chaga</strong>. Each has its speciality. We introduce this trio, their respective benefits and how to combine them wisely.",
      blocks: [
        { h2: "Reishi, the relaxation mushroom" },
        { p: "Nicknamed the \"mushroom of immortality\", Reishi is valued for its soothing action. It promotes relaxation, supports sleep and contributes to immune system balance. It's the ally of stressful periods and evenings when you want to release pressure." },
        { h2: "Cordyceps, the energy mushroom" },
        { p: "Cordyceps is the mushroom of vitality and performance. Traditionally used to support stamina and oxygenation, it's popular with athletes and anyone seeking a boost of <a href=\"" + le("/blog/retrouver-de-l-energie-naturellement") + "\">natural energy</a>." },
        { h2: "Chaga, the antioxidant mushroom" },
        { p: "Chaga is one of the foods richest in antioxidants. It helps protect cells from oxidative stress, supports immunity and contributes to skin radiance. A precious ally for beauty and overall wellbeing." },
        { h2: "Should you combine them?" },
        { p: "Yes, because their actions are complementary: relaxation (Reishi), energy (Cordyceps) and protection (Chaga). That's the whole logic of \"supermix\" formulas. Our <a href=\"" + le("/products/mushglow") + "\">MushGlow</a> powder actually combines these mushrooms with Lion's Mane, Maca and collagen for overall <a href=\"" + le("/blog/quest-ce-quun-adaptogene") + "\">balance</a>." },
        { h2: "How to take them?" },
        { p: "As a powder to dilute in a drink, in capsules or gummies. What matters is regularity: daily intake over several weeks to let the actives work deeply." },
        { h2: "Where to start?" },
        { p: "To discover these mushrooms in a complete formula, explore the <a href=\"" + le("/collections/performance-et-vitalite") + "\">Performance &amp; Vitality</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "Which mushroom for energy?", a: "Cordyceps is the most suitable: it supports stamina and vitality. You'll find it in MushGlow and our energy formulas." },
        { q: "Can you take Reishi, Cordyceps and Chaga together?", a: "Yes, their effects are complementary. Supermix formulas like MushGlow deliberately combine them." },
        { q: "Are these mushrooms psychoactive?", a: "No, none of them. They are functional food mushrooms, with no psychotropic effect." },
      ],
    },
  },
  {
    slug: "mieux-dormir-naturellement",
    title: "Mieux dormir naturellement : 8 conseils qui marchent",
    metaTitle: "Mieux dormir naturellement : 8 conseils",
    metaDescription:
      "Comment mieux dormir naturellement ? 8 conseils concrets (routine, écrans, alimentation, plantes adaptogènes) pour un sommeil profond et réparateur sans médicament.",
    excerpt:
      "Endormissement difficile, réveils nocturnes ? 8 conseils naturels et concrets pour retrouver un sommeil profond et réparateur, sans médicament.",
    category: "Sommeil & stress",
    date: "2026-06-27",
    readingMinutes: 7,
    cover: "/brand/blog/cover-sommeil.jpg",
    intro:
      "Un bon sommeil est le socle de la santé, de l'énergie et de l'humeur. Pourtant, difficultés d'endormissement et réveils nocturnes touchent une grande partie d'entre nous. Voici 8 conseils pour <strong>mieux dormir naturellement</strong>, sans somnifère, en agissant sur les vraies causes.",
    blocks: [
      { h2: "1. Des horaires réguliers" },
      { p: "Se coucher et se lever à heures fixes, même le week-end, synchronise l'horloge biologique. C'est le levier le plus puissant, et le plus sous-estimé, d'un sommeil de qualité." },
      { h2: "2. Couper les écrans plus tôt" },
      { p: "La lumière bleue des écrans retarde la sécrétion de mélatonine, l'hormone du sommeil. Idéalement, on éteint 60 minutes avant le coucher, ou on active un filtre de lumière chaude." },
      { h2: "3. Une chambre fraîche et sombre" },
      { p: "Le corps s'endort plus facilement dans une pièce autour de 18 °C, sombre et silencieuse. Investir dans de bons rideaux occultants change souvent la donne." },
      { h2: "4. Attention aux excitants" },
      { p: "Café, thé, énergisants et alcool perturbent le sommeil. La caféine reste active plusieurs heures : mieux vaut l'éviter après 14-15 h. Découvrez nos <a href=\"" + l("/blog/alternative-cafe-focus") + "\">alternatives naturelles au café</a>." },
      { h2: "5. Bouger dans la journée" },
      { p: "L'activité physique améliore la profondeur du sommeil, à condition de ne pas la pratiquer trop tard le soir, car elle est stimulante." },
      { h2: "6. Gérer le stress" },
      { p: "Le stress est l'ennemi n°1 de l'endormissement. Respiration, méditation, journaling : tout ce qui apaise le mental prépare au sommeil. Nos <a href=\"" + l("/blog/gerer-le-stress-naturellement") + "\">solutions anti-stress</a> vous y aideront." },
      { h2: "7. Une routine du soir apaisante" },
      { p: "Tisane, lecture, lumière tamisée : un rituel régulier envoie au cerveau le signal qu'il est temps de ralentir. La répétition crée le réflexe." },
      { h2: "8. S'appuyer sur les plantes adaptogènes" },
      { p: "L'<a href=\"" + l("/blog/ashwagandha") + "\">ashwagandha</a>, le reishi et le safran sont étudiés pour favoriser la détente et un sommeil réparateur. Nos gummies <a href=\"" + l("/products/calm") + "\">CALM</a> les réunissent dans un rituel du soir simple et gourmand, à prendre environ une heure avant le coucher." },
      { h2: "Par où commencer ?" },
      { p: "Choisissez deux ou trois conseils et tenez-les une semaine. Pour un soutien ciblé, découvrez la collection <a href=\"" + l("/collections/serenite") + "\">Sérénité &amp; Sommeil</a>." },
    ],
    faq: [
      { q: "Quelle plante pour mieux dormir ?", a: "L'ashwagandha et le reishi sont parmi les plus étudiées pour la détente et le sommeil. On les retrouve, avec le safran, dans les gummies CALM." },
      { q: "Les gummies CALM remplacent-ils un somnifère ?", a: "Non. Ce sont des compléments alimentaires qui soutiennent la détente et le sommeil naturellement. En cas de troubles sévères et persistants, consultez un professionnel de santé." },
      { q: "Combien d'heures de sommeil faut-il ?", a: "La plupart des adultes ont besoin de 7 à 9 heures. La qualité compte autant que la quantité." },
    ],
    en: {
      title: "Sleeping better naturally: 8 tips that work",
      metaTitle: "Sleep better naturally: 8 tips",
      metaDescription: "How to sleep better naturally? 8 concrete tips (routine, screens, diet, adaptogenic plants) for deep, restorative sleep without medication.",
      excerpt: "Trouble falling asleep, night-time waking? 8 natural, concrete tips to regain deep, restorative sleep, without medication.",
      category: "Sleep & stress",
      intro: "Good sleep is the foundation of health, energy and mood. Yet difficulty falling asleep and night-time waking affect a large share of us. Here are 8 tips to <strong>sleep better naturally</strong>, without sleeping pills, by acting on the real causes.",
      blocks: [
        { h2: "1. Regular hours" },
        { p: "Going to bed and getting up at fixed times, even at the weekend, synchronises the body clock. It's the most powerful, and most underestimated, lever for quality sleep." },
        { h2: "2. Cut screens earlier" },
        { p: "The blue light of screens delays the secretion of melatonin, the sleep hormone. Ideally, switch off 60 minutes before bed, or enable a warm-light filter." },
        { h2: "3. A cool, dark bedroom" },
        { p: "The body falls asleep more easily in a room around 18°C, dark and quiet. Investing in good blackout curtains often makes all the difference." },
        { h2: "4. Watch out for stimulants" },
        { p: "Coffee, tea, energy drinks and alcohol disrupt sleep. Caffeine stays active for several hours: better to avoid it after 2-3pm. Discover our <a href=\"" + le("/blog/alternative-cafe-focus") + "\">natural alternatives to coffee</a>." },
        { h2: "5. Move during the day" },
        { p: "Physical activity improves the depth of sleep, provided you don't do it too late in the evening, as it's stimulating." },
        { h2: "6. Manage stress" },
        { p: "Stress is the number one enemy of falling asleep. Breathing, meditation, journaling: anything that soothes the mind prepares for sleep. Our <a href=\"" + le("/blog/gerer-le-stress-naturellement") + "\">anti-stress solutions</a> will help." },
        { h2: "7. A soothing evening routine" },
        { p: "Herbal tea, reading, dim light: a regular ritual sends the brain the signal that it's time to slow down. Repetition creates the reflex." },
        { h2: "8. Rely on adaptogenic plants" },
        { p: "<a href=\"" + le("/blog/ashwagandha") + "\">Ashwagandha</a>, reishi and saffron are studied for promoting relaxation and restorative sleep. Our <a href=\"" + le("/products/calm") + "\">CALM</a> gummies bring them together in a simple, tasty evening ritual, to take about an hour before bed." },
        { h2: "Where to start?" },
        { p: "Choose two or three tips and stick to them for a week. For targeted support, discover the <a href=\"" + le("/collections/serenite") + "\">Calm &amp; Sleep</a> collection." },
      ],
      faq: [
        { q: "Which plant to sleep better?", a: "Ashwagandha and reishi are among the most studied for relaxation and sleep. You'll find them, with saffron, in the CALM gummies." },
        { q: "Do CALM gummies replace a sleeping pill?", a: "No. They are food supplements that support relaxation and sleep naturally. For severe, persistent issues, consult a healthcare professional." },
        { q: "How many hours of sleep do you need?", a: "Most adults need 7 to 9 hours. Quality matters as much as quantity." },
      ],
    },
  },
  {
    slug: "cortisol-stress",
    title: "Cortisol : comprendre et réguler l'hormone du stress",
    metaTitle: "Cortisol : réguler l'hormone du stress",
    metaDescription:
      "Le cortisol, hormone du stress : rôle, signes d'un excès, et solutions naturelles pour le réguler (sommeil, alimentation, ashwagandha). Le guide complet.",
    excerpt:
      "À quoi sert le cortisol, comment reconnaître un excès et surtout comment le réguler naturellement grâce au mode de vie et aux adaptogènes.",
    category: "Sommeil & stress",
    date: "2026-06-26",
    readingMinutes: 6,
    cover: "/brand/blog/cover-cortisol.jpg",
    intro:
      "On l'appelle « l'hormone du stress », mais le <strong>cortisol</strong> n'est pas un ennemi : il est vital. Le problème, c'est son excès chronique. Comprendre son rôle et savoir le réguler naturellement est la clé d'un mental apaisé et d'une meilleure énergie.",
    blocks: [
      { h2: "À quoi sert le cortisol ?" },
      { p: "Sécrété par les glandes surrénales, le cortisol suit un rythme naturel : élevé le matin pour nous réveiller, bas le soir pour préparer le sommeil. Il mobilise l'énergie, régule l'inflammation et nous aide à réagir face à une menace. En soi, il est indispensable." },
      { h2: "Quand le cortisol pose problème" },
      { p: "C'est le stress <em>chronique</em> qui dérègle tout. Un cortisol durablement élevé peut se traduire par :" },
      { ul: [
        "Fatigue persistante, surtout au réveil",
        "Troubles du sommeil et réveils nocturnes",
        "Fringales sucrées et prise de poids abdominale",
        "Irritabilité, anxiété, <a href=\"" + l("/blog/brouillard-mental") + "\">brouillard mental</a>",
      ] },
      { h2: "Comment réguler son cortisol naturellement" },
      { p: "Bonne nouvelle : le mode de vie a un impact direct. Les leviers les plus efficaces sont le sommeil, l'activité physique modérée, une alimentation stable en sucres et la réduction des excitants. Nos <a href=\"" + l("/blog/gerer-le-stress-naturellement") + "\">7 solutions anti-stress</a> détaillent chacun de ces points." },
      { h2: "Le rôle des adaptogènes" },
      { p: "Les plantes adaptogènes aident l'organisme à mieux réguler sa réponse au stress. L'<a href=\"" + l("/blog/ashwagandha") + "\">ashwagandha</a> est particulièrement documentée pour son action sur le cortisol. On la retrouve, avec le reishi et le safran, dans nos gummies <a href=\"" + l("/products/calm") + "\">CALM</a>." },
      { h2: "Par où commencer ?" },
      { p: "Commencez par le sommeil et la réduction des excitants, puis ajoutez un soutien adaptogène. Découvrez la collection <a href=\"" + l("/collections/serenite") + "\">Sérénité &amp; Sommeil</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Comment savoir si mon cortisol est trop élevé ?", a: "Fatigue au réveil, troubles du sommeil, fringales sucrées et irritabilité sont des signes évocateurs. Seule une analyse médicale permet de le mesurer précisément." },
      { q: "L'ashwagandha fait-elle baisser le cortisol ?", a: "Plusieurs études suggèrent une réduction du cortisol avec une prise régulière d'ashwagandha. C'est l'un de ses effets les plus documentés." },
      { q: "Le sport augmente-t-il le cortisol ?", a: "Une activité intense et prolongée peut l'augmenter ponctuellement. Une activité modérée et régulière aide au contraire à mieux le réguler." },
    ],
    en: {
      title: "Cortisol: understanding and regulating the stress hormone",
      metaTitle: "Cortisol: regulate the stress hormone",
      metaDescription: "Cortisol, the stress hormone: role, signs of excess, and natural solutions to regulate it (sleep, diet, ashwagandha). The complete guide.",
      excerpt: "What cortisol is for, how to recognise an excess and, above all, how to regulate it naturally through lifestyle and adaptogens.",
      category: "Sleep & stress",
      intro: "It's called \"the stress hormone\", but <strong>cortisol</strong> isn't an enemy: it's vital. The problem is its chronic excess. Understanding its role and knowing how to regulate it naturally is the key to a calmer mind and better energy.",
      blocks: [
        { h2: "What is cortisol for?" },
        { p: "Secreted by the adrenal glands, cortisol follows a natural rhythm: high in the morning to wake us up, low in the evening to prepare for sleep. It mobilises energy, regulates inflammation and helps us react to a threat. In itself, it's essential." },
        { h2: "When cortisol becomes a problem" },
        { p: "It's <em>chronic</em> stress that throws everything off. Persistently high cortisol can show up as:" },
        { ul: [
          "Persistent fatigue, especially on waking",
          "Sleep problems and night-time waking",
          "Sugar cravings and abdominal weight gain",
          "Irritability, anxiety, <a href=\"" + le("/blog/brouillard-mental") + "\">mental fog</a>",
        ] },
        { h2: "How to regulate your cortisol naturally" },
        { p: "Good news: lifestyle has a direct impact. The most effective levers are sleep, moderate physical activity, a diet stable in sugars and reducing stimulants. Our <a href=\"" + le("/blog/gerer-le-stress-naturellement") + "\">7 anti-stress solutions</a> detail each of these points." },
        { h2: "The role of adaptogens" },
        { p: "Adaptogenic plants help the body better regulate its stress response. <a href=\"" + le("/blog/ashwagandha") + "\">Ashwagandha</a> is particularly documented for its action on cortisol. You'll find it, with reishi and saffron, in our <a href=\"" + le("/products/calm") + "\">CALM</a> gummies." },
        { h2: "Where to start?" },
        { p: "Start with sleep and reducing stimulants, then add adaptogen support. Discover the <a href=\"" + le("/collections/serenite") + "\">Calm &amp; Sleep</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "How do I know if my cortisol is too high?", a: "Fatigue on waking, sleep problems, sugar cravings and irritability are telling signs. Only a medical test can measure it precisely." },
        { q: "Does ashwagandha lower cortisol?", a: "Several studies suggest a reduction in cortisol with regular ashwagandha intake. It's one of its most documented effects." },
        { q: "Does exercise raise cortisol?", a: "Intense, prolonged activity can raise it temporarily. Moderate, regular activity, on the contrary, helps regulate it better." },
      ],
    },
  },
  {
    slug: "brouillard-mental",
    title: "Brouillard mental : causes et solutions naturelles",
    metaTitle: "Brouillard mental : causes & solutions",
    metaDescription:
      "Brouillard mental : d'où vient cette sensation de tête embrumée et comment y remédier naturellement (sommeil, alimentation, Lion's Mane). Le guide complet.",
    excerpt:
      "Tête embrumée, difficultés à se concentrer, mémoire en berne ? Comprenez les causes du brouillard mental et découvrez des solutions naturelles.",
    category: "Concentration",
    date: "2026-06-25",
    readingMinutes: 6,
    cover: "/brand/blog/cover-brouillard-mental.jpg",
    intro:
      "Cette sensation de tête « dans le coton », de pensées lentes et de mémoire capricieuse porte un nom : le <strong>brouillard mental</strong>. Rarement grave, il est souvent le symptôme d'un déséquilibre de mode de vie. Voici ses causes et des solutions concrètes pour retrouver un esprit clair.",
    blocks: [
      { h2: "Qu'est-ce que le brouillard mental ?" },
      { p: "Le brouillard mental n'est pas une maladie mais un ensemble de symptômes : difficulté à se concentrer, à trouver ses mots, mémoire à court terme défaillante, sensation de lenteur. Il fluctue selon la fatigue, le stress et l'hygiène de vie." },
      { h2: "Les causes les plus fréquentes" },
      { ul: [
        "<strong>Manque de sommeil</strong> : la cause n°1 (voir <a href=\"" + l("/blog/mieux-dormir-naturellement") + "\">mieux dormir naturellement</a>).",
        "<strong>Stress chronique</strong> et excès de <a href=\"" + l("/blog/cortisol-stress") + "\">cortisol</a>.",
        "<strong>Alimentation déséquilibrée</strong> : pics de sucre, déshydratation, carences.",
        "<strong>Surcharge numérique</strong> : multitâche et notifications permanentes.",
      ] },
      { h2: "Les solutions naturelles" },
      { p: "La bonne nouvelle : le brouillard mental se dissipe souvent en agissant sur les bases. Priorisez le sommeil, l'hydratation, une alimentation stable en sucres, l'activité physique et des pauses sans écran. Le mono-tâche fait aussi des merveilles." },
      { h2: "Le soutien des champignons fonctionnels" },
      { p: "Pour un coup de pouce ciblé, le <a href=\"" + l("/blog/lions-mane") + "\">Lion's Mane</a> est le champignon de référence pour la clarté mentale et la mémoire. Associé à la rhodiola et à la L-théanine, il compose nos gummies <a href=\"" + l("/products/focus") + "\">FOCUS</a>, pensés pour un esprit net sans nervosité." },
      { h2: "Par où commencer ?" },
      { p: "Traitez d'abord le sommeil et le stress, puis ajoutez un soutien cognitif. Découvrez la collection <a href=\"" + l("/collections/concentration") + "\">Concentration</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Le brouillard mental est-il grave ?", a: "Le plus souvent non : il traduit un déséquilibre de mode de vie (sommeil, stress, alimentation). S'il est persistant ou soudain, un avis médical est recommandé." },
      { q: "Quel complément contre le brouillard mental ?", a: "Le Lion's Mane est le plus indiqué pour la clarté mentale. On le retrouve dans les gummies FOCUS et la poudre MushGlow." },
      { q: "Combien de temps pour retrouver un esprit clair ?", a: "En agissant sur le sommeil et le stress, l'amélioration est souvent rapide. Le soutien des adaptogènes s'apprécie, lui, sur quelques semaines." },
    ],
    en: {
      title: "Mental fog: causes and natural solutions",
      metaTitle: "Mental fog: causes & solutions",
      metaDescription: "Mental fog: where that hazy-headed feeling comes from and how to remedy it naturally (sleep, diet, Lion's Mane). The complete guide.",
      excerpt: "Hazy head, trouble concentrating, memory at a low? Understand the causes of mental fog and discover natural solutions.",
      category: "Focus",
      intro: "That feeling of a head \"in cotton wool\", slow thoughts and a capricious memory has a name: <strong>mental fog</strong>. Rarely serious, it's often the symptom of a lifestyle imbalance. Here are its causes and concrete solutions to regain a clear mind.",
      blocks: [
        { h2: "What is mental fog?" },
        { p: "Mental fog isn't an illness but a set of symptoms: difficulty concentrating, finding words, faltering short-term memory, a feeling of slowness. It fluctuates with fatigue, stress and lifestyle." },
        { h2: "The most common causes" },
        { ul: [
          "<strong>Lack of sleep</strong>: the number one cause (see <a href=\"" + le("/blog/mieux-dormir-naturellement") + "\">sleep better naturally</a>).",
          "<strong>Chronic stress</strong> and excess <a href=\"" + le("/blog/cortisol-stress") + "\">cortisol</a>.",
          "<strong>Unbalanced diet</strong>: sugar spikes, dehydration, deficiencies.",
          "<strong>Digital overload</strong>: multitasking and constant notifications.",
        ] },
        { h2: "The natural solutions" },
        { p: "The good news: mental fog often clears by acting on the basics. Prioritise sleep, hydration, a diet stable in sugars, physical activity and screen-free breaks. Single-tasking also works wonders." },
        { h2: "The support of functional mushrooms" },
        { p: "For a targeted boost, <a href=\"" + le("/blog/lions-mane") + "\">Lion's Mane</a> is the reference mushroom for mental clarity and memory. Combined with rhodiola and L-theanine, it makes up our <a href=\"" + le("/products/focus") + "\">FOCUS</a> gummies, designed for a clear mind without jitters." },
        { h2: "Where to start?" },
        { p: "First address sleep and stress, then add cognitive support. Discover the <a href=\"" + le("/collections/concentration") + "\">Focus</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "Is mental fog serious?", a: "Most often no: it reflects a lifestyle imbalance (sleep, stress, diet). If it's persistent or sudden, a medical opinion is recommended." },
        { q: "Which supplement for mental fog?", a: "Lion's Mane is the most suitable for mental clarity. You'll find it in the FOCUS gummies and the MushGlow powder." },
        { q: "How long to regain a clear mind?", a: "By acting on sleep and stress, improvement is often quick. Adaptogen support, meanwhile, is felt over a few weeks." },
      ],
    },
  },
  {
    slug: "alternative-cafe-focus",
    title: "5 alternatives naturelles au café pour rester focus",
    metaTitle: "5 alternatives naturelles au café",
    metaDescription:
      "Envie de réduire le café sans perdre en concentration ? 5 alternatives naturelles (matcha, Lion's Mane, rhodiola, mushroom coffee) pour rester focus sans nervosité.",
    excerpt:
      "Réduire le café sans perdre en énergie ni en focus, c'est possible. Voici 5 alternatives naturelles pour une concentration stable, sans crash.",
    category: "Concentration",
    date: "2026-06-24",
    readingMinutes: 6,
    cover: "/brand/blog/cover-alternative-cafe.jpg",
    intro:
      "Le café a ses vertus, mais son revers est connu : nervosité, palpitations, sommeil perturbé et fameux « crash » de l'après-midi. Si vous cherchez à lever le pied sans perdre en concentration, voici 5 <strong>alternatives naturelles au café</strong> pour rester focus tout en douceur.",
    blocks: [
      { h2: "1. Le matcha" },
      { p: "Le thé matcha apporte de la caféine, mais associée à la L-théanine : le résultat est une énergie plus stable et prolongée, sans le pic-puis-chute du café. Idéal pour une matinée concentrée." },
      { h2: "2. Le Lion's Mane" },
      { p: "Sans aucune caféine, le <a href=\"" + l("/blog/lions-mane") + "\">Lion's Mane</a> soutient la mémoire et la clarté mentale sur le fond. C'est l'alternative parfaite pour ceux qui veulent du focus sans stimulant." },
      { h2: "3. La rhodiola" },
      { p: "Cette plante adaptogène aide à lutter contre la fatigue mentale et à maintenir la performance cognitive en cas de stress. Un allié précieux dans les journées chargées." },
      { h2: "4. Le café aux champignons" },
      { p: "Le <a href=\"" + l("/blog/cafe-champignons-mushroom-coffee") + "\">mushroom coffee</a> combine (moins de) café et champignons fonctionnels : on garde le plaisir du café en réduisant la nervosité. Un excellent compromis pour une transition en douceur." },
      { h2: "5. La L-théanine" },
      { p: "Cet acide aminé du thé favorise un état de concentration calme. Associée au Lion's Mane et à la rhodiola, elle compose nos gummies <a href=\"" + l("/products/focus") + "\">FOCUS</a>, pour un focus net, sans jitters ni redescente." },
      { h2: "Réduire le café, mode d'emploi" },
      { p: "Inutile de tout arrêter d'un coup. Réduisez progressivement, remplacez une tasse par une alternative, et surveillez surtout la caféine de l'après-midi pour protéger votre <a href=\"" + l("/blog/mieux-dormir-naturellement") + "\">sommeil</a>." },
      { h2: "Par où commencer ?" },
      { p: "Pour un focus durable sans excitant, découvrez la collection <a href=\"" + l("/collections/concentration") + "\">Concentration</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Quelle est la meilleure alternative au café pour la concentration ?", a: "Pour un focus sans caféine, le Lion's Mane est idéal. Pour garder un peu d'énergie, le matcha ou le mushroom coffee sont d'excellents compromis." },
      { q: "Les gummies FOCUS contiennent-ils de la caféine ?", a: "Non. FOCUS soutient la concentration via le Lion's Mane, la rhodiola et la L-théanine, sans caféine ni excitant." },
      { q: "Peut-on vraiment se passer de café ?", a: "Oui, en procédant progressivement. Beaucoup constatent une énergie plus stable et un meilleur sommeil après avoir réduit le café." },
    ],
    en: {
      title: "5 natural alternatives to coffee to stay focused",
      metaTitle: "5 natural alternatives to coffee",
      metaDescription: "Want to cut down on coffee without losing focus? 5 natural alternatives (matcha, Lion's Mane, rhodiola, mushroom coffee) to stay focused without jitters.",
      excerpt: "Cutting down on coffee without losing energy or focus is possible. Here are 5 natural alternatives for stable focus, without the crash.",
      category: "Focus",
      intro: "Coffee has its virtues, but its downside is well known: jitters, palpitations, disrupted sleep and the famous afternoon \"crash\". If you're looking to ease off without losing focus, here are 5 <strong>natural alternatives to coffee</strong> to stay focused, gently.",
      blocks: [
        { h2: "1. Matcha" },
        { p: "Matcha tea provides caffeine, but combined with L-theanine: the result is more stable, prolonged energy, without coffee's spike-then-drop. Ideal for a focused morning." },
        { h2: "2. Lion's Mane" },
        { p: "With no caffeine at all, <a href=\"" + le("/blog/lions-mane") + "\">Lion's Mane</a> supports memory and mental clarity on the underlying level. It's the perfect alternative for those who want focus without a stimulant." },
        { h2: "3. Rhodiola" },
        { p: "This adaptogenic plant helps fight mental fatigue and maintain cognitive performance under stress. A precious ally on busy days." },
        { h2: "4. Mushroom coffee" },
        { p: "<a href=\"" + le("/blog/cafe-champignons-mushroom-coffee") + "\">Mushroom coffee</a> combines (less) coffee and functional mushrooms: you keep the pleasure of coffee while reducing the jitters. An excellent compromise for a gentle transition." },
        { h2: "5. L-theanine" },
        { p: "This amino acid from tea promotes a state of calm focus. Combined with Lion's Mane and rhodiola, it makes up our <a href=\"" + le("/products/focus") + "\">FOCUS</a> gummies: clear focus, without jitters or a comedown." },
        { h2: "Cutting down on coffee, how-to" },
        { p: "No need to stop everything at once. Reduce gradually, replace a cup with an alternative, and above all watch afternoon caffeine to protect your <a href=\"" + le("/blog/mieux-dormir-naturellement") + "\">sleep</a>." },
        { h2: "Where to start?" },
        { p: "For lasting focus without stimulants, discover the <a href=\"" + le("/collections/concentration") + "\">Focus</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "What's the best alternative to coffee for focus?", a: "For caffeine-free focus, Lion's Mane is ideal. To keep a little energy, matcha or mushroom coffee are excellent compromises." },
        { q: "Do FOCUS gummies contain caffeine?", a: "No. FOCUS supports focus via Lion's Mane, rhodiola and L-theanine, without caffeine or stimulants." },
        { q: "Can you really do without coffee?", a: "Yes, by going gradually. Many notice more stable energy and better sleep after cutting down on coffee." },
      ],
    },
  },
  {
    slug: "fatigue-chronique-solution",
    title: "Fatigue chronique : causes et solutions naturelles",
    metaTitle: "Fatigue chronique : causes & solutions",
    metaDescription:
      "Fatigue chronique : comprendre les causes d'un épuisement persistant et découvrir des solutions naturelles (sommeil, alimentation, Cordyceps) pour retrouver de l'énergie.",
    excerpt:
      "Fatigue qui s'installe malgré le repos ? Identifiez les causes possibles et découvrez des solutions naturelles pour retrouver durablement votre énergie.",
    category: "Énergie & performance",
    date: "2026-06-23",
    readingMinutes: 7,
    cover: "/brand/blog/cover-fatigue.jpg",
    intro:
      "Se sentir épuisé de temps en temps est normal. Mais lorsque la fatigue s'installe et résiste au repos, on parle de <strong>fatigue chronique</strong>. Avant de la subir, il faut en comprendre les causes, souvent multiples, pour agir efficacement et retrouver de l'énergie durablement.",
    blocks: [
      { h2: "Fatigue passagère ou chronique ?" },
      { p: "Une fatigue est dite chronique quand elle dure plusieurs semaines et n'est pas soulagée par une bonne nuit de sommeil. Elle s'accompagne souvent de baisse de motivation, de <a href=\"" + l("/blog/brouillard-mental") + "\">brouillard mental</a> et d'une sensibilité accrue au stress." },
      { h2: "Les causes les plus fréquentes" },
      { ul: [
        "<strong>Dette de sommeil</strong> : nuits trop courtes ou de mauvaise qualité.",
        "<strong>Stress chronique</strong> et excès de <a href=\"" + l("/blog/cortisol-stress") + "\">cortisol</a>.",
        "<strong>Alimentation déséquilibrée</strong> et carences (fer, magnésium, vitamine D…).",
        "<strong>Sédentarité</strong> : paradoxalement, moins on bouge, plus on se sent fatigué.",
      ] },
      { h2: "Quand consulter ?" },
      { p: "Une fatigue intense, soudaine ou qui s'aggrave mérite un avis médical pour écarter une cause sous-jacente (thyroïde, anémie, etc.). Les conseils qui suivent concernent la fatigue « fonctionnelle » liée au mode de vie." },
      { h2: "Les solutions naturelles" },
      { p: "Retrouver de l'énergie passe par les fondamentaux : sommeil réparateur, alimentation dense en nutriments, hydratation et activité physique régulière. Notre guide <a href=\"" + l("/blog/retrouver-de-l-energie-naturellement") + "\">retrouver de l'énergie naturellement</a> détaille chaque levier." },
      { h2: "Le soutien des adaptogènes" },
      { p: "Le <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Cordyceps</a> est le champignon de la vitalité par excellence, soutenant l'endurance et l'oxygénation. Associé au Maca et au ginseng, il compose nos gummies <a href=\"" + l("/products/power") + "\">POWER</a>, pensés pour un regain d'énergie sans excitant." },
      { h2: "Par où commencer ?" },
      { p: "Commencez par le sommeil, puis ajoutez un soutien énergie. Découvrez la collection <a href=\"" + l("/collections/performance-et-vitalite") + "\">Performance &amp; Vitalité</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Quel complément contre la fatigue ?", a: "Le Cordyceps, le Maca et le ginseng sont réputés pour soutenir la vitalité. On les retrouve dans les gummies POWER. En cas de carence avérée, un complément ciblé (fer, vitamine D) peut être nécessaire sur avis médical." },
      { q: "Pourquoi suis-je fatigué même après avoir dormi ?", a: "La qualité du sommeil compte autant que la durée. Stress, écrans, apnée ou alimentation peuvent altérer un sommeil pourtant long. Si cela persiste, consultez." },
      { q: "Les adaptogènes donnent-ils un coup de fouet immédiat ?", a: "Non, ce ne sont pas des excitants. Ils soutiennent l'énergie sur le fond, avec des effets qui s'installent sur plusieurs semaines." },
    ],
    en: {
      title: "Chronic fatigue: causes and natural solutions",
      metaTitle: "Chronic fatigue: causes & solutions",
      metaDescription: "Chronic fatigue: understand the causes of persistent exhaustion and discover natural solutions (sleep, diet, Cordyceps) to regain energy.",
      excerpt: "Fatigue that sets in despite rest? Identify the possible causes and discover natural solutions to regain your energy for good.",
      category: "Energy & performance",
      intro: "Feeling exhausted from time to time is normal. But when fatigue sets in and resists rest, we talk about <strong>chronic fatigue</strong>. Before enduring it, you need to understand its causes, often multiple, to act effectively and regain energy for good.",
      blocks: [
        { h2: "Temporary or chronic fatigue?" },
        { p: "Fatigue is called chronic when it lasts several weeks and isn't relieved by a good night's sleep. It often comes with lower motivation, <a href=\"" + le("/blog/brouillard-mental") + "\">mental fog</a> and heightened sensitivity to stress." },
        { h2: "The most common causes" },
        { ul: [
          "<strong>Sleep debt</strong>: nights that are too short or poor quality.",
          "<strong>Chronic stress</strong> and excess <a href=\"" + le("/blog/cortisol-stress") + "\">cortisol</a>.",
          "<strong>Unbalanced diet</strong> and deficiencies (iron, magnesium, vitamin D…).",
          "<strong>Sedentary lifestyle</strong>: paradoxically, the less you move, the more tired you feel.",
        ] },
        { h2: "When to see a doctor?" },
        { p: "Intense, sudden or worsening fatigue warrants a medical opinion to rule out an underlying cause (thyroid, anaemia, etc.). The tips that follow concern \"functional\" fatigue linked to lifestyle." },
        { h2: "The natural solutions" },
        { p: "Regaining energy comes down to the fundamentals: restorative sleep, a nutrient-dense diet, hydration and regular physical activity. Our guide on <a href=\"" + le("/blog/retrouver-de-l-energie-naturellement") + "\">regaining energy naturally</a> details each lever." },
        { h2: "The support of adaptogens" },
        { p: "<a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Cordyceps</a> is the vitality mushroom par excellence, supporting stamina and oxygenation. Combined with Maca and ginseng, it makes up our <a href=\"" + le("/products/power") + "\">POWER</a> gummies, designed for an energy boost without stimulants." },
        { h2: "Where to start?" },
        { p: "Start with sleep, then add energy support. Discover the <a href=\"" + le("/collections/performance-et-vitalite") + "\">Performance &amp; Vitality</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "Which supplement for fatigue?", a: "Cordyceps, Maca and ginseng are known to support vitality. You'll find them in the POWER gummies. In the case of a confirmed deficiency, a targeted supplement (iron, vitamin D) may be needed on medical advice." },
        { q: "Why am I tired even after sleeping?", a: "Sleep quality matters as much as duration. Stress, screens, apnoea or diet can impair even long sleep. If it persists, see a doctor." },
        { q: "Do adaptogens give an immediate jolt?", a: "No, they aren't stimulants. They support energy on the underlying level, with effects that build over several weeks." },
      ],
    },
  },
  {
    slug: "complement-recuperation-sport",
    title: "Compléments pour la récupération sportive : le guide",
    metaTitle: "Récupération sportive : quels compléments ?",
    metaDescription:
      "Quels compléments pour mieux récupérer après le sport ? Protéines, magnésium, Cordyceps, collagène : le guide des solutions naturelles pour la récupération musculaire.",
    excerpt:
      "Mieux récupérer, c'est mieux progresser. Le guide des compléments utiles à la récupération sportive : protéines, magnésium, Cordyceps, collagène.",
    category: "Énergie & performance",
    date: "2026-06-22",
    readingMinutes: 7,
    cover: "/brand/blog/cover-recuperation-sport.jpg",
    intro:
      "La performance ne se joue pas qu'à l'entraînement : elle se construit aussi pendant la <strong>récupération</strong>. Bien récupérer réduit les courbatures, prévient les blessures et permet de progresser. Tour d'horizon des compléments réellement utiles, sans marketing.",
    blocks: [
      { h2: "Les bases : sommeil et alimentation" },
      { p: "Avant tout complément, deux piliers : le sommeil, où se produit l'essentiel de la réparation musculaire, et une alimentation apportant assez de protéines et de glucides. Aucun complément ne compense des nuits trop courtes." },
      { h2: "Les protéines" },
      { p: "Elles fournissent les acides aminés nécessaires à la reconstruction musculaire. L'idéal est de répartir ses apports sur la journée. La whey ou les protéines végétales sont des options pratiques autour de l'effort." },
      { h2: "Le magnésium" },
      { p: "Impliqué dans la fonction musculaire et nerveuse, le magnésium est souvent déficitaire chez les sportifs. Il contribue à réduire fatigue et crampes, et soutient un sommeil réparateur." },
      { h2: "Le Cordyceps" },
      { p: "Champignon adaptogène de l'endurance, le <a href=\"" + l("/blog/reishi-cordyceps-chaga") + "\">Cordyceps</a> soutient l'oxygénation et la vitalité. On le retrouve, avec le Maca et le ginseng, dans nos gummies <a href=\"" + l("/products/power") + "\">POWER</a>, pratiques à emporter en sac de sport." },
      { h2: "Le collagène" },
      { p: "Pour les articulations et les tendons mis à rude épreuve, le <a href=\"" + l("/blog/collagene-bienfaits-peau") + "\">collagène</a> est un allié. Notre poudre <a href=\"" + l("/products/mushglow") + "\">MushGlow</a> en contient, associé au Chaga antioxydant." },
      { h2: "Par où commencer ?" },
      { p: "Sécurisez d'abord sommeil et protéines, puis complétez selon vos besoins. Découvrez la collection <a href=\"" + l("/collections/performance-et-vitalite") + "\">Performance &amp; Vitalité</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Quel est le meilleur complément pour récupérer après le sport ?", a: "Il n'y en a pas un seul : les protéines pour le muscle, le magnésium contre la fatigue et les crampes, le Cordyceps pour l'endurance et le collagène pour les articulations forment un ensemble cohérent." },
      { q: "Le Cordyceps est-il dopant ?", a: "Non. C'est un champignon fonctionnel alimentaire, sans substance interdite. Il soutient naturellement l'endurance et la vitalité." },
      { q: "Faut-il des compléments quand on fait du sport en loisir ?", a: "Pas nécessairement. Une bonne alimentation suffit souvent. Les compléments sont un plus, surtout en cas d'entraînement intense ou de carence." },
    ],
    en: {
      title: "Supplements for sports recovery: the guide",
      metaTitle: "Sports recovery: which supplements?",
      metaDescription: "Which supplements to recover better after sport? Protein, magnesium, Cordyceps, collagen: the guide to natural solutions for muscle recovery.",
      excerpt: "Recovering better means progressing better. The guide to supplements useful for sports recovery: protein, magnesium, Cordyceps, collagen.",
      category: "Energy & performance",
      intro: "Performance isn't only decided in training: it's also built during <strong>recovery</strong>. Recovering well reduces soreness, prevents injury and lets you progress. An overview of the genuinely useful supplements, without the marketing.",
      blocks: [
        { h2: "The basics: sleep and diet" },
        { p: "Before any supplement, two pillars: sleep, where most muscle repair happens, and a diet providing enough protein and carbs. No supplement compensates for nights that are too short." },
        { h2: "Protein" },
        { p: "It provides the amino acids needed for muscle rebuilding. Ideally, spread your intake across the day. Whey or plant proteins are practical options around exercise." },
        { h2: "Magnesium" },
        { p: "Involved in muscle and nerve function, magnesium is often deficient in athletes. It helps reduce fatigue and cramps, and supports restorative sleep." },
        { h2: "Cordyceps" },
        { p: "An endurance adaptogenic mushroom, <a href=\"" + le("/blog/reishi-cordyceps-chaga") + "\">Cordyceps</a> supports oxygenation and vitality. You'll find it, with Maca and ginseng, in our <a href=\"" + le("/products/power") + "\">POWER</a> gummies, handy to keep in your gym bag." },
        { h2: "Collagen" },
        { p: "For joints and tendons under strain, <a href=\"" + le("/blog/collagene-bienfaits-peau") + "\">collagen</a> is an ally. Our <a href=\"" + le("/products/mushglow") + "\">MushGlow</a> powder contains it, combined with antioxidant Chaga." },
        { h2: "Where to start?" },
        { p: "First secure sleep and protein, then supplement according to your needs. Discover the <a href=\"" + le("/collections/performance-et-vitalite") + "\">Performance &amp; Vitality</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "What's the best supplement to recover after sport?", a: "There isn't just one: protein for muscle, magnesium against fatigue and cramps, Cordyceps for stamina and collagen for joints form a coherent whole." },
        { q: "Is Cordyceps a doping agent?", a: "No. It's a functional food mushroom, with no banned substances. It naturally supports stamina and vitality." },
        { q: "Do you need supplements for recreational sport?", a: "Not necessarily. A good diet is often enough. Supplements are a plus, especially with intense training or a deficiency." },
      ],
    },
  },
  {
    slug: "complement-peau-guide",
    title: "Compléments pour une belle peau : le guide complet",
    metaTitle: "Compléments belle peau : le guide",
    metaDescription:
      "Quels compléments pour une belle peau ? Collagène, antioxydants (Chaga), zinc, oméga-3 : le guide des nutriments qui soutiennent l'éclat et l'hydratation de la peau.",
    excerpt:
      "Éclat, hydratation, fermeté : la beauté de la peau se nourrit de l'intérieur. Le guide des compléments et nutriments qui font vraiment la différence.",
    category: "Beauté & bien-être",
    date: "2026-06-21",
    readingMinutes: 7,
    cover: "/brand/blog/cover-peau-guide.jpg",
    intro:
      "Une belle peau ne se joue pas qu'en surface : elle se nourrit aussi de l'intérieur. Hydratation, éclat, fermeté… certains nutriments et compléments soutiennent réellement la santé de la peau. Voici le guide des actifs qui comptent, sans fausses promesses.",
    blocks: [
      { h2: "Les fondations : sommeil, eau et alimentation" },
      { p: "Avant tout complément, la peau reflète l'hygiène de vie. Sommeil réparateur, bonne hydratation et alimentation riche en fruits, légumes et bons gras posent les bases de l'éclat. Le reste vient en soutien." },
      { h2: "Le collagène" },
      { p: "Protéine de structure de la peau, le <a href=\"" + l("/blog/collagene-bienfaits-peau") + "\">collagène</a> soutient fermeté et hydratation. Sa production diminuant avec l'âge, une supplémentation régulière peut aider à préserver l'élasticité cutanée." },
      { h2: "Les antioxydants" },
      { p: "Ils protègent la peau du stress oxydatif, responsable du vieillissement prématuré. Le <strong>Chaga</strong>, l'un des aliments les plus riches en antioxydants, est un allié beauté de choix. Vitamine C et polyphénols complètent l'action." },
      { h2: "Le zinc et les oméga-3" },
      { p: "Le zinc soutient les peaux à tendance imparfaite et la cicatrisation. Les oméga-3 nourrissent le film hydrolipidique et apaisent les peaux réactives. Deux nutriments souvent sous-consommés." },
      { h2: "L'approche BIEN" },
      { p: "Notre poudre <a href=\"" + l("/products/mushglow") + "\">MushGlow</a> combine collagène et Chaga antioxydant à d'autres champignons fonctionnels : un geste beauté complet, de l'intérieur, en une cuillère par jour. Retrouvez le détail sur la page <a href=\"" + l("/ingredients") + "\">Ingrédients</a>." },
      { h2: "Par où commencer ?" },
      { p: "Misez sur la régularité et une routine globale. Découvrez la collection <a href=\"" + l("/collections/beaute-et-bien-etre") + "\">Beauté &amp; Bien-être</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Quel est le meilleur complément pour la peau ?", a: "Le collagène pour la fermeté et l'hydratation, associé à des antioxydants comme le Chaga pour protéger la peau. C'est l'association proposée dans MushGlow." },
      { q: "En combien de temps voit-on les résultats sur la peau ?", a: "Les effets d'une supplémentation s'apprécient généralement sur 4 à 12 semaines de prise régulière." },
      { q: "Les compléments remplacent-ils une crème ?", a: "Non, ils sont complémentaires : les compléments agissent de l'intérieur, les soins topiques en surface. L'idéal est de combiner les deux." },
    ],
    en: {
      title: "Supplements for beautiful skin: the complete guide",
      metaTitle: "Beautiful-skin supplements: the guide",
      metaDescription: "Which supplements for beautiful skin? Collagen, antioxidants (Chaga), zinc, omega-3: the guide to nutrients that support skin radiance and hydration.",
      excerpt: "Radiance, hydration, firmness: skin beauty is nourished from within. The guide to supplements and nutrients that really make a difference.",
      category: "Beauty & wellbeing",
      intro: "Beautiful skin isn't only about the surface: it's also nourished from within. Hydration, radiance, firmness… certain nutrients and supplements genuinely support skin health. Here's the guide to the actives that matter, without false promises.",
      blocks: [
        { h2: "The foundations: sleep, water and diet" },
        { p: "Before any supplement, skin reflects your lifestyle. Restorative sleep, good hydration and a diet rich in fruit, vegetables and healthy fats lay the foundations of radiance. The rest comes as support." },
        { h2: "Collagen" },
        { p: "A structural skin protein, <a href=\"" + le("/blog/collagene-bienfaits-peau") + "\">collagen</a> supports firmness and hydration. As its production declines with age, regular supplementation can help preserve skin elasticity." },
        { h2: "Antioxidants" },
        { p: "They protect the skin from oxidative stress, responsible for premature ageing. <strong>Chaga</strong>, one of the foods richest in antioxidants, is a prime beauty ally. Vitamin C and polyphenols complete the action." },
        { h2: "Zinc and omega-3" },
        { p: "Zinc supports blemish-prone skin and healing. Omega-3 nourish the hydrolipidic film and soothe reactive skin. Two often under-consumed nutrients." },
        { h2: "The BIEN approach" },
        { p: "Our <a href=\"" + le("/products/mushglow") + "\">MushGlow</a> powder combines collagen and antioxidant Chaga with other functional mushrooms: a complete beauty gesture, from within, in one spoon a day. See the details on the <a href=\"" + le("/ingredients") + "\">Ingredients</a> page." },
        { h2: "Where to start?" },
        { p: "Rely on regularity and a holistic routine. Discover the <a href=\"" + le("/collections/beaute-et-bien-etre") + "\">Beauty &amp; Wellbeing</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "What's the best supplement for the skin?", a: "Collagen for firmness and hydration, combined with antioxidants like Chaga to protect the skin. That's the combination offered in MushGlow." },
        { q: "How long before you see results on the skin?", a: "The effects of supplementation are generally seen over 4 to 12 weeks of regular use." },
        { q: "Do supplements replace a cream?", a: "No, they're complementary: supplements act from within, topical care on the surface. The ideal is to combine the two." },
      ],
    },
  },
  {
    slug: "gummies-vs-gelules",
    title: "Gummies ou gélules : que choisir pour ses compléments ?",
    metaTitle: "Gummies ou gélules : que choisir ?",
    metaDescription:
      "Gummies ou gélules pour vos compléments alimentaires ? Avantages, limites, absorption, dosage et observance : le comparatif pour bien choisir sa forme.",
    excerpt:
      "Gummies gourmands ou gélules classiques ? On compare les deux formes de compléments (absorption, dosage, plaisir, observance) pour vous aider à choisir.",
    category: "Ingrédients & science",
    date: "2026-06-20",
    readingMinutes: 5,
    cover: "/brand/blog/cover-gummies-gelules.jpg",
    intro:
      "Face au rayon des compléments alimentaires, une question revient : <strong>gummies ou gélules</strong> ? Les deux formes ont leurs atouts. Absorption, dosage, plaisir de prise et régularité : voici un comparatif clair pour choisir la forme qui vous convient vraiment.",
    blocks: [
      { h2: "Les gummies : plaisir et observance" },
      { p: "Les gummies séduisent par leur goût et leur facilité de prise, sans eau. Leur principal avantage est souvent sous-estimé : l'<strong>observance</strong>. Un complément qu'on prend avec plaisir est un complément qu'on n'oublie pas, et la régularité est la clé de l'efficacité des adaptogènes." },
      { h2: "Les gélules : concentration et neutralité" },
      { p: "Les gélules permettent des dosages parfois plus élevés et n'apportent ni sucre ni arôme. Elles conviennent aux formules très concentrées ou aux actifs au goût prononcé. En revanche, elles sont parfois moins agréables à avaler et plus faciles à oublier." },
      { h2: "Et l'absorption ?" },
      { p: "Contrairement à une idée reçue, une gummie bien formulée assure une bonne assimilation des actifs. La forme compte moins que la qualité de la formule, le dosage réel et la régularité de la prise." },
      { h2: "Le point sur le sucre" },
      { p: "Le vrai critère de vigilance pour les gummies, c'est le sucre. Chez BIEN health, nos gummies <a href=\"" + l("/products/calm") + "\">CALM</a>, <a href=\"" + l("/products/focus") + "\">FOCUS</a> et <a href=\"" + l("/products/power") + "\">POWER</a> sont formulés sans sucres ajoutés, vegan et aux dosages étudiés : le plaisir sans le compromis." },
      { h2: "Alors, que choisir ?" },
      { p: "Si vous cherchez la simplicité et la régularité au quotidien, les gummies sont idéales. Pour des dosages très élevés ou des cures pointues, les gélules gardent leur intérêt. Et pour un geste complet, la poudre <a href=\"" + l("/products/mushglow") + "\">MushGlow</a> à diluer offre une troisième voie, riche et modulable." },
      { h2: "Par où commencer ?" },
      { p: "Le meilleur complément reste celui que vous prenez régulièrement. Faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a> pour trouver la formule et la forme adaptées à votre objectif." },
    ],
    faq: [
      { q: "Les gummies sont-elles moins efficaces que les gélules ?", a: "Non, à formule et dosage équivalents. Une gummie bien conçue assure une bonne assimilation. L'efficacité dépend surtout de la qualité des actifs et de la régularité." },
      { q: "Les gummies BIEN contiennent-elles du sucre ?", a: "Nos gummies CALM, FOCUS et POWER sont formulées sans sucres ajoutés et 100 % vegan." },
      { q: "Combien de gummies par jour ?", a: "Cela dépend de la formule : suivez la posologie indiquée sur chaque produit, généralement deux gummies par jour." },
    ],
    en: {
      title: "Gummies or capsules: which to choose for your supplements?",
      metaTitle: "Gummies or capsules: which to choose?",
      metaDescription: "Gummies or capsules for your food supplements? Advantages, limits, absorption, dosage and adherence: the comparison to choose the right format.",
      excerpt: "Tasty gummies or classic capsules? We compare the two supplement formats (absorption, dosage, pleasure, adherence) to help you choose.",
      category: "Ingredients & science",
      intro: "Facing the supplement aisle, one question keeps coming up: <strong>gummies or capsules</strong>? Both formats have their strengths. Absorption, dosage, pleasure of taking and regularity: here's a clear comparison to choose the format that really suits you.",
      blocks: [
        { h2: "Gummies: pleasure and adherence" },
        { p: "Gummies win people over with their taste and ease of taking, without water. Their main advantage is often underestimated: <strong>adherence</strong>. A supplement you enjoy taking is one you don't forget, and regularity is the key to adaptogens' effectiveness." },
        { h2: "Capsules: concentration and neutrality" },
        { p: "Capsules allow sometimes higher dosages and add neither sugar nor flavouring. They suit very concentrated formulas or strong-tasting actives. On the other hand, they're sometimes less pleasant to swallow and easier to forget." },
        { h2: "What about absorption?" },
        { p: "Contrary to popular belief, a well-formulated gummy ensures good absorption of the actives. The format matters less than the quality of the formula, the real dosage and the regularity of intake." },
        { h2: "A word on sugar" },
        { p: "The real point of vigilance for gummies is sugar. At BIEN health, our <a href=\"" + le("/products/calm") + "\">CALM</a>, <a href=\"" + le("/products/focus") + "\">FOCUS</a> and <a href=\"" + le("/products/power") + "\">POWER</a> gummies are formulated with no added sugar, vegan and at studied dosages: pleasure without the compromise." },
        { h2: "So, which to choose?" },
        { p: "If you're after simplicity and everyday regularity, gummies are ideal. For very high dosages or specialised courses, capsules keep their appeal. And for a complete gesture, the <a href=\"" + le("/products/mushglow") + "\">MushGlow</a> powder to dilute offers a third way, rich and adjustable." },
        { h2: "Where to start?" },
        { p: "The best supplement is the one you take regularly. Take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a> to find the formula and format suited to your goal." },
      ],
      faq: [
        { q: "Are gummies less effective than capsules?", a: "No, at equivalent formula and dosage. A well-designed gummy ensures good absorption. Effectiveness mainly depends on the quality of the actives and regularity." },
        { q: "Do BIEN gummies contain sugar?", a: "Our CALM, FOCUS and POWER gummies are formulated with no added sugar and 100% vegan." },
        { q: "How many gummies a day?", a: "It depends on the formula: follow the dosage indicated on each product, generally two gummies a day." },
      ],
    },
  },
  {
    slug: "cafe-champignons-mushroom-coffee",
    title: "Café aux champignons (mushroom coffee) : le guide",
    metaTitle: "Café aux champignons : le guide",
    metaDescription:
      "Café aux champignons (mushroom coffee) : qu'est-ce que c'est, quels bienfaits, quel goût et comment le préparer ? Le guide complet de cette alternative tendance.",
    excerpt:
      "Moins de nervosité, plus de focus : le café aux champignons séduit. Bienfaits, goût, préparation et champignons utilisés : le guide complet.",
    category: "Ingrédients & science",
    date: "2026-06-19",
    readingMinutes: 6,
    cover: "/brand/blog/cover-mushroom-coffee.jpg",
    intro:
      "Le <strong>café aux champignons</strong>, ou « mushroom coffee », s'est imposé comme l'une des grandes tendances bien-être. L'idée : garder le plaisir du café tout en réduisant sa nervosité, grâce aux champignons fonctionnels. On vous explique ce que c'est, ses bienfaits, son goût et comment le préparer.",
    blocks: [
      { h2: "Qu'est-ce que le mushroom coffee ?" },
      { p: "C'est un mélange de café (souvent en quantité réduite) et d'extraits de <a href=\"" + l("/blog/champignons-adaptogenes-guide-complet") + "\">champignons fonctionnels</a> comme le Lion's Mane, le Reishi, le Cordyceps ou le Chaga. Le but : bénéficier d'un peu de caféine et des vertus des adaptogènes en une seule boisson." },
      { h2: "Quels bienfaits ?" },
      { ul: [
        "<strong>Moins de nervosité</strong> : moins de caféine, donc moins de jitters et de palpitations.",
        "<strong>Plus de focus</strong> : le <a href=\"" + l("/blog/lions-mane") + "\">Lion's Mane</a> soutient la clarté mentale.",
        "<strong>Une énergie plus stable</strong> : moins de pic-puis-crash de l'après-midi.",
        "<strong>Des antioxydants</strong> apportés par le Chaga.",
      ] },
      { h2: "Quel goût ça a ?" },
      { p: "Bonne surprise : le goût reste très proche d'un café classique, avec des notes légèrement plus terreuses selon les champignons. Les extraits de qualité passent presque inaperçus au palais." },
      { h2: "Comment le préparer ?" },
      { p: "Le plus simple est d'utiliser une poudre prête à l'emploi, à diluer dans de l'eau chaude ou du lait végétal. Vous pouvez aussi ajouter une poudre de champignons à votre café habituel. Une tasse le matin suffit." },
      { h2: "L'alternative BIEN" },
      { p: "Pas fan du goût café ? Notre poudre <a href=\"" + l("/products/mushglow") + "\">MushGlow</a> réunit Lion's Mane, Cordyceps, Chaga, Maca et collagène dans une boisson gourmande au goût neutre, à préparer comme un latte. Le même esprit que le mushroom coffee, sans forcément le café. Découvrez aussi nos autres <a href=\"" + l("/blog/alternative-cafe-focus") + "\">alternatives au café</a>." },
      { h2: "Par où commencer ?" },
      { p: "Pour tester l'univers des champignons fonctionnels, explorez la collection <a href=\"" + l("/collections/performance-et-vitalite") + "\">Performance &amp; Vitalité</a> ou faites le <a href=\"" + l("/diagnostic") + "\">diagnostic BIEN</a>." },
    ],
    faq: [
      { q: "Le café aux champignons contient-il de la caféine ?", a: "Oui, mais généralement moins qu'un café classique. C'est justement ce qui réduit la nervosité tout en gardant un léger effet stimulant." },
      { q: "Quel goût a le mushroom coffee ?", a: "Très proche d'un café normal, avec des notes légèrement terreuses. Les extraits de champignons de qualité sont quasi imperceptibles." },
      { q: "MushGlow est-il un café aux champignons ?", a: "MushGlow s'en inspire mais ne contient pas de café : c'est une boisson aux champignons fonctionnels et collagène, au goût neutre, à préparer comme un latte." },
    ],
    en: {
      title: "Mushroom coffee: the guide",
      metaTitle: "Mushroom coffee: the guide",
      metaDescription: "Mushroom coffee: what it is, what benefits, what taste and how to prepare it? The complete guide to this trending alternative.",
      excerpt: "Less jitters, more focus: mushroom coffee is winning people over. Benefits, taste, preparation and mushrooms used: the complete guide.",
      category: "Ingredients & science",
      intro: "<strong>Mushroom coffee</strong> has become one of the big wellness trends. The idea: keep the pleasure of coffee while reducing its jitters, thanks to functional mushrooms. We explain what it is, its benefits, its taste and how to prepare it.",
      blocks: [
        { h2: "What is mushroom coffee?" },
        { p: "It's a blend of coffee (often in reduced quantity) and extracts of <a href=\"" + le("/blog/champignons-adaptogenes-guide-complet") + "\">functional mushrooms</a> like Lion's Mane, Reishi, Cordyceps or Chaga. The goal: enjoy a little caffeine and the virtues of adaptogens in a single drink." },
        { h2: "What benefits?" },
        { ul: [
          "<strong>Less jitters</strong>: less caffeine, so fewer jitters and palpitations.",
          "<strong>More focus</strong>: <a href=\"" + le("/blog/lions-mane") + "\">Lion's Mane</a> supports mental clarity.",
          "<strong>More stable energy</strong>: less of the afternoon spike-then-crash.",
          "<strong>Antioxidants</strong> provided by Chaga.",
        ] },
        { h2: "What does it taste like?" },
        { p: "Good surprise: the taste stays very close to a classic coffee, with slightly earthier notes depending on the mushrooms. Quality extracts go almost unnoticed on the palate." },
        { h2: "How to prepare it?" },
        { p: "The simplest way is to use a ready-to-use powder, to dilute in hot water or plant milk. You can also add a mushroom powder to your usual coffee. One cup in the morning is enough." },
        { h2: "The BIEN alternative" },
        { p: "Not a fan of the coffee taste? Our <a href=\"" + le("/products/mushglow") + "\">MushGlow</a> powder combines Lion's Mane, Cordyceps, Chaga, Maca and collagen in a tasty, neutral-flavoured drink, to prepare like a latte. The same spirit as mushroom coffee, without necessarily the coffee. Discover our other <a href=\"" + le("/blog/alternative-cafe-focus") + "\">alternatives to coffee</a> too." },
        { h2: "Where to start?" },
        { p: "To try the world of functional mushrooms, explore the <a href=\"" + le("/collections/performance-et-vitalite") + "\">Performance &amp; Vitality</a> collection or take the <a href=\"" + le("/diagnostic") + "\">BIEN quiz</a>." },
      ],
      faq: [
        { q: "Does mushroom coffee contain caffeine?", a: "Yes, but generally less than a classic coffee. That's precisely what reduces the jitters while keeping a mild stimulating effect." },
        { q: "What does mushroom coffee taste like?", a: "Very close to a normal coffee, with slightly earthy notes. Quality mushroom extracts are almost imperceptible." },
        { q: "Is MushGlow a mushroom coffee?", a: "MushGlow is inspired by it but contains no coffee: it's a drink of functional mushrooms and collagen, neutral-flavoured, to prepare like a latte." },
      ],
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
