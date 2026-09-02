import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ReassuranceBand from "@/components/reassurance-band";
import { pageMetadata } from "@/lib/seo";
import { accentLastWord } from "@/lib/accent-title";
import { PRESS, pressMedia } from "@/lib/press";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "presse",
    title: lang === "en" ? "As seen in the press | BIEN health" : "La presse en parle | BIEN health",
    description: lang === "en" ? "BIEN health in the press: Grazia, Marie Claire, Do It In Paris, L'Officiel, Gala… Discover what the media say about our natural adaptogen supplements." : "Grazia, Marie Claire, Cosmopolitan, L'Officiel, Gala : ce que la presse dit des compléments naturels aux adaptogènes BIEN health.",
  });
}

const HERO = {
  fr: {
    h1: "Quand le bien-être devient simple, la presse suit.",
    p1: "BIEN, c'est une autre idée du complément alimentaire. Pas de promesses miracles. Pas de discours anxiogène. Juste des formules clean, fonctionnelles, pensées pour le quotidien.",
    p2: "Une approche qui a naturellement trouvé écho dans la presse.",
  },
  en: {
    h1: "When wellness becomes simple, the press follows.",
    p1: "BIEN is a different take on food supplements. No miracle promises. No fear-mongering. Just clean, functional formulas, designed for everyday life.",
    p2: "An approach that naturally resonated with the press.",
  },
} as const;

type Feature = {
  magazine: string;
  quote: string;
  quoteEn: string;
  /** Extraits de l'article, traduits pour la version anglaise : la page sert de
   *  preuve sociale, et quatre paragraphes en français n'en sont pas une pour un
   *  lecteur anglophone. La mention sous l'extrait rappelle que l'original est
   *  en français. */
  paragraphs: string[];
  paragraphsEn: string[];
  note?: string;
  noteEn?: string;
  product?: { src: string; alt: string };
  /** Photo de la parution papier ouverte, fournie par le client (dossier
   *  « POUR SITE »). Seules les vraies pages de magazine sont reprises : les
   *  visuels du meme dossier qui ne sont que le texte de l'article recompose
   *  sur un fond degrade ne prouvent rien et ont ete ecartes. */
  clipping?: { src: string; alt: string };
};

const FEATURES: Feature[] = [
  {
    magazine: "Grazia",
    product: { src: "/gamme-courte-ciblee.jpg", alt: "Les gummies FOCUS, POWER et CALM de BIEN health" },
    quote: "La science est formelle : ces plantes méconnues permettent de dire adieu au stress",
    quoteEn: "Science is clear: these little-known plants let you say goodbye to stress",
    paragraphs: [
      "Les plantes adaptogènes permettent de rééquilibrer les hormones, et notamment celles liées au stress et à l'anxiété. Elles favorisent également un meilleur sommeil. Parmi les plantes les plus connues, on retrouve l'ashwagandha, la rhodiola rosea, le ginseng ou encore le reishi, un champignon. La marque de compléments alimentaires BIEN en a justement fait son credo : proposer une solution efficace au stress et à la fatigue, avec des plantes naturelles.",
      "Selon des études scientifiques, l'ashwagandha et la rhodiola réduisent le stress de 30 % à 42 %, tandis que le reishi et la rhodiola améliorent le sommeil de 20 %. En combinant plusieurs plantes adaptogènes dans une gamme de produits variés, cela permet de calmer la charge mentale et de retrouver l'apaisement.",
    ],
    paragraphsEn: [
      "Adaptogenic plants help rebalance hormones, particularly those tied to stress and anxiety. They also support better sleep. Among the best known are ashwagandha, rhodiola rosea, ginseng and reishi, a mushroom. The supplement brand BIEN has made this its credo: offering an effective answer to stress and fatigue with natural plants.",
      "According to scientific studies, ashwagandha and rhodiola reduce stress by 30% to 42%, while reishi and rhodiola improve sleep by 20%. Combining several adaptogenic plants across a varied range helps calm mental load and restore a sense of ease.",
    ],
  },
  {
    magazine: "marie claire",
    quote: "Stress : ces gummies vont devenir vos meilleurs alliés pour retrouver calme et sérénité",
    quoteEn: "Stress: these gummies are set to become your best allies for calm and serenity",
    paragraphs: [
      "Si vous vous sentez stressée ou anxieuse, les compléments alimentaires comme les gummies peuvent être vos alliés. Prescription Beauté vous dévoile les gummies anti-stress à adopter.",
      "Si l'Ashwagandha est utilisée empiriquement depuis des millénaires, la science commence à valider certaines de ses propriétés. Plusieurs études cliniques ont démontré son action sur la réduction du cortisol, l'hormone du stress. Une méta-analyse publiée en 2021 confirme ainsi son effet anxiolytique significatif.",
      "D'autres recherches suggèrent une amélioration de la qualité du sommeil, une augmentation de l'énergie et même un soutien des fonctions cognitives.",
      "L'Ashwagandha serait également bénéfique pour réguler la glycémie et soutenir la fonction thyroïdienne. Toutefois, la communauté scientifique appelle à poursuivre les recherches.",
    ],
    paragraphsEn: [
      "If you feel stressed or anxious, supplements such as gummies can be your allies. Prescription Beauté reveals the anti-stress gummies to adopt.",
      "While ashwagandha has been used empirically for millennia, science is beginning to validate some of its properties. Several clinical trials have shown its action on reducing cortisol, the stress hormone. A meta-analysis published in 2021 confirms a significant anxiolytic effect.",
      "Other research suggests improved sleep quality, increased energy and even support for cognitive function.",
      "Ashwagandha may also help regulate blood sugar and support thyroid function. The scientific community, however, calls for further research.",
    ],
    product: { src: "/approch-globale-sante.jpg", alt: "Gummies BIEN health dans une coupelle" },
  },
  {
    magazine: "Do It in Paris",
    product: { src: "/prelude-bien-health.jpg", alt: "La gamme BIEN health au complet" },
    quote: "Pour soutenir énergie, clarté mentale et équilibre émotionnel",
    quoteEn: "To support energy, mental clarity and emotional balance",
    paragraphs: [
      "À mi-chemin entre science et traditions ancestrales, les compléments alimentaires de BIEN associent champignons fonctionnels, adaptogènes et collagène pour soutenir énergie, clarté mentale et équilibre émotionnel. Face aux défis du quotidien, BIEN propose une approche naturelle et complète, sans promesses miracles mais avec des formules efficaces et faciles à intégrer dans la vie de tous les jours.",
      "Made in France, vegan et sans sucre, BIEN accompagne chaque journée d'une dose de résilience et de beauté naturelle. Et pour les lectrices de DO IT, 20 % de réduction au pop-up !",
      "Nos coups de cœur : les gummies FOCUS, CALM et POWER (dès 39 €) ou la poudre Mushglow (dès 49 €), qui s'intègrent facilement au quotidien dans un café ou un smoothie, pour un effet visible en quelques jours.",
      "Retrouvez toute la collection sur bien.health",
    ],
    paragraphsEn: [
      "Halfway between science and ancestral tradition, BIEN's supplements combine functional mushrooms, adaptogens and collagen to support energy, mental clarity and emotional balance. Faced with everyday demands, BIEN offers a natural, complete approach — no miracle promises, but effective formulas that slot easily into daily life.",
      "Made in France, vegan and sugar-free, BIEN brings a dose of resilience and natural beauty to every day. And for DO IT readers, 20% off at the pop-up!",
      "Our favourites: the FOCUS, CALM and POWER gummies (from €39) or the Mushglow powder (from €49), which work easily into a coffee or a smoothie, for visible effects within days.",
      "Find the full collection at bien.health",
    ],
  },
  {
    magazine: "L'Officiel",
    quote: "Votre allié quotidien pour retrouver un esprit clair, concentré et résilient",
    quoteEn: "Your everyday ally for a clear, focused and resilient mind",
    paragraphs: [
      "FOCUS, c'est votre allié quotidien pour retrouver un esprit clair, concentré et résilient — même en pleine surcharge mentale.",
      "Formulés avec Lion's Mane, Rhodiola et L-Théanine, ces gummies goût ananas boostent la clarté mentale, soutiennent l'attention et favorisent le focus — sans nervosité, ni crash.",
    ],
    paragraphsEn: [
      "FOCUS is your everyday ally for a clear, focused and resilient mind — even under mental overload.",
      "Formulated with Lion's Mane, Rhodiola and L-theanine, these pineapple-flavoured gummies boost mental clarity, support attention and sharpen focus — without jitters or a crash.",
    ],
    note: "FOCUS, 39 € le pot de 60 gummies",
    noteEn: "FOCUS, €39 for a jar of 60 gummies",
    product: { src: "/focus.jpg", alt: "BIEN health FOCUS, gummies concentration & mémoire" },
  },
  {
    magazine: "Gala",
    product: { src: "/power.jpg", alt: "BIEN health POWER, gummies énergie & endurance" },
    quote: "Des champignons pour booster et retrouver l'équilibre",
    quoteEn: "Mushrooms to boost energy and restore balance",
    paragraphs: [
      "Issue du sport de haut niveau — d'abord l'équitation puis la course automobile — Carla s'intéresse depuis longtemps aux vertus bien-être des champignons adaptogènes. Elle reprend BIEN avec passion et en porte fièrement les valeurs. Made in France, vegan, sans sucre et sans gluten, les gummies BIEN sont de véritables boosters au quotidien.",
      "Les gummies Focus, formulés avec Lion's Mane, Rhodiola et L-Théanine, aident à rester clair et concentré. Pour favoriser la détente et un sommeil apaisé, Calm associe Reishi, Ashwagandha et Safran. Quant aux gummies Power, enrichis en Cordyceps, Rhodiola Rosea et Panax Ginseng, ils offrent un vrai coup de boost, sans contre-coup. À noter : les adaptogènes utilisés dans ces formules montrent en moyenne 30 % de réduction du stress dans les études cliniques.",
      "Pour les adeptes du format poudre, Mushglow est un supermix clean à base de champignons, d'adaptogènes et de collagène. Sa saveur légèrement vanillée accompagne facilement un café, un matcha ou un lait végétal. Résultat : énergie renouvelée et éclat naturel de la peau.",
      "Pour les fêtes de fin d'année, bénéficiez de 20 % de réduction avec le code GALA20, valable jusqu'au 31/12. Essayez, savourez, performez !",
    ],
    paragraphsEn: [
      "Coming from elite sport — equestrian first, then motor racing — Carla has long been interested in the wellbeing virtues of adaptogenic mushrooms. She has taken over BIEN with passion and proudly carries its values. Made in France, vegan, sugar-free and gluten-free, BIEN gummies are genuine everyday boosters.",
      "The Focus gummies, formulated with Lion's Mane, Rhodiola and L-theanine, help you stay clear and focused. For relaxation and restful sleep, Calm combines Reishi, Ashwagandha and Saffron. As for the Power gummies, enriched with Cordyceps, Rhodiola Rosea and Panax Ginseng, they deliver a real lift with no comedown. Note: the adaptogens used in these formulas show an average 30% reduction in stress in clinical studies.",
      "For powder fans, Mushglow is a clean supermix of mushrooms, adaptogens and collagen. Its lightly vanilla flavour works easily into a coffee, a matcha or a plant-based milk. The result: renewed energy and natural skin radiance.",
      "For the festive season, enjoy 20% off with the code GALA20, valid until 31/12. Try it, savour it, perform!",
    ],
  },
  {
    magazine: "Psychologies",
    product: { src: "/bien-health-bien-etre.jpg", alt: "Un pot BIEN health en main" },
    quote: "Le nouvel allié anti-stress dont tout le monde parle (et ce n’est pas du magnésium)",
    quoteEn: "The new anti-stress ally everyone is talking about (and it is not magnesium)",
    paragraphs: [
      "En France, selon l’Ifop, 95 % des Français se disaient anxieux et stressés en 2022. Les conséquences du stress chronique sont pourtant lourdes : troubles dépressifs, surcharge émotionnelle, problèmes cardiaques, risques de diabète de type 2 ou d’hypertension.",
      "La marque BIEN s’est attaquée à ce problème et a trouvé la solution pour aider les Français à réduire leur anxiété, mais surtout à accéder à une sérénité et un épanouissement durables et stables. Comment ? En proposant des compléments alimentaires à base de champignons adaptogènes et de plantes fonctionnelles.",
      "Selon les champignons adaptogènes, les effets varient : l’ashwagandha et la rhodiola assurent une réduction du stress de 30 à 42 %, et l’ashwagandha réduit aussi l’anxiété de 28 à 41 %.",
      "« J’utilise ces plantes depuis une dizaine d’années et elles m’ont vraiment aidée, que ce soit dans ma vie professionnelle, sportive ou même personnelle », confie Carla Debard, fondatrice de BIEN.",
    ],
    paragraphsEn: [
      "In France, according to Ifop, 95% of people described themselves as anxious and stressed in 2022. The consequences of chronic stress are heavy: depressive disorders, emotional overload, heart problems, and a higher risk of type 2 diabetes or hypertension.",
      "BIEN took on that problem and found a way to help people lower their anxiety and, above all, reach a lasting, stable sense of calm — through supplements built on adaptogenic mushrooms and functional plants.",
      "Effects vary from one adaptogen to another: ashwagandha and rhodiola deliver a 30% to 42% reduction in stress, and ashwagandha also reduces anxiety by 28% to 41%.",
      "“I have used these plants for about ten years and they have genuinely helped me — professionally, in sport and personally,” says Carla Debard, founder of BIEN.",
    ],
  },
  {
    magazine: "BIBA",
    clipping: { src: "/brand/presse/parutions/biba.webp", alt: "La page BIBA consacrée à Mushglow" },
    product: { src: "/mushglow.jpg", alt: "Mushglow, le supermix en poudre de BIEN health" },
    quote: "Adieu le café : cette boisson à base de champignons réveille sans doper le cortisol",
    quoteEn: "Goodbye coffee: this mushroom-based drink wakes you up without spiking cortisol",
    paragraphs: [
      "Le café, on l’aime… jusqu’au moment où il ne fait plus vraiment le job. Nervosité, coup de fatigue en milieu de matinée, esprit un peu trop agité pour être vraiment concentrée. De plus en plus de femmes cherchent autre chose pour démarrer la journée : pas un énième booster, mais une énergie plus stable, plus douce, qui ne joue pas aux montagnes russes.",
      "Là où le café agit vite — parfois trop vite — Mushglow joue la carte de la régularité. Une cuillère par jour dans une boisson chaude, un smoothie ou un yaourt, et le rituel s’installe sans bouleverser les habitudes : concentration plus fluide, moins de fatigue mentale, énergie plus constante. Sans nervosité, sans cœur qui s’emballe, sans dépendance.",
      "Autre différence notable avec le café : l’impact sur la peau. En intégrant du collagène et des actifs antioxydants, Mushglow s’inscrit aussi dans une logique de beauté de l’intérieur. Un effet discret, progressif, mais bien réel pour celles qui tiennent la cure sur plusieurs semaines.",
    ],
    paragraphsEn: [
      "We love coffee… until it stops doing the job. Jitters, a mid-morning slump, a mind too busy to actually focus. More and more women are looking for another way to start the day: not yet another booster, but steadier, gentler energy without the rollercoaster.",
      "Where coffee acts fast — sometimes too fast — Mushglow plays the long game. One spoonful a day in a hot drink, a smoothie or a yoghurt, and the ritual settles in without upending your habits: smoother focus, less mental fatigue, steadier energy. No jitters, no racing heart, no dependency.",
      "Another notable difference from coffee: the effect on skin. With collagen and antioxidant actives, Mushglow also works as beauty from within — a discreet, gradual, but very real effect for those who keep the course going for several weeks.",
    ],
    note: "Mushglow, supermix 6-en-1, 30 doses, 49 €",
    noteEn: "Mushglow, 6-in-1 supermix, 30 servings, €49",
  },
  {
    magazine: "Beauté test",
    product: { src: "/calm.jpg", alt: "BIEN health CALM, gummies sérénité & sommeil" },
    quote: "J’ai testé ces gummies anti-stress sans mélatonine qui apaisent vraiment",
    quoteEn: "I tried these melatonin-free anti-stress gummies that genuinely calm you down",
    paragraphs: [
      "Charge mentale qui déborde, nervosité diffuse, sommeil trop léger… Quand le stress s’invite jusque dans nos nuits, on cherche souvent une solution rapide. Mais entre les compléments trop dosés, la mélatonine mal tolérée et les formules peu transparentes, difficile de s’y retrouver.",
      "C’est précisément sur ce terrain que la marque BIEN a décidé d’intervenir avec CALM, des gummies adaptogènes pensés pour apaiser durablement le système nerveux — sans mélatonine, sans accoutumance, et sans effet « coup de massue » en journée.",
      "Reishi pour aider à réguler le cortisol, ashwagandha pour la résistance au stress, safran pour l’humeur et la clarté mentale : la formule agit sur la gestion du stress sans forcer l’endormissement ni perturber les cycles naturels du sommeil.",
      "Avec CALM, BIEN propose une vision plus moderne du complément anti-stress : moins intrusive, plus respectueuse du corps, et réellement agréable à consommer.",
    ],
    paragraphsEn: [
      "Mental load spilling over, a diffuse restlessness, sleep that never quite deepens… When stress follows us into the night, we tend to look for a quick fix. But between over-dosed supplements, poorly tolerated melatonin and opaque formulas, it is hard to know where to turn.",
      "That is exactly where BIEN stepped in with CALM, adaptogenic gummies designed to settle the nervous system for the long run — no melatonin, no habituation, and no knocked-out feeling during the day.",
      "Reishi to help regulate cortisol, ashwagandha for stress resilience, saffron for mood and mental clarity: the formula works on stress management without forcing sleep or disrupting natural sleep cycles.",
      "With CALM, BIEN offers a more modern take on the anti-stress supplement: less intrusive, gentler on the body, and genuinely pleasant to take.",
    ],
  },
  {
    magazine: "Les Nouvelles Esthétiques",
    product: { src: "/brand/bien-health-complements-champignons-adaptogenes.jpg", alt: "La gamme BIEN health" },
    quote: "Quand les plantes adaptogènes réinventent le bien-être",
    quoteEn: "When adaptogenic plants reinvent everyday wellbeing",
    paragraphs: [
      "Pour formuler ses compléments, Carla a challengé de nombreux laboratoires afin d’en faire ressortir les formules les plus hautement dosées possibles, développées avec des médecins et des naturopathes.",
      "« Les adaptogènes sont utilisés depuis des décennies, mais ce n’était pas exploité, explique-t-elle. Pour la petite anecdote, le Cordyceps, un champignon contenu dans nos gummies Power, a été consommé en 1993 par l’équipe chinoise pour la préparation aux Jeux Olympiques. Les résultats ont été si élevés qu’on a cru à un dopage. »",
      "« Proposer des blends d’actifs permet d’en optimiser les effets. Nous avons régularisé les quantités d’actifs pour que cela soit optimal », détaille la fondatrice. Les compléments BIEN Health sont fabriqués en France et 100 % naturels.",
      "Un choix qui convainc : les clients rachètent dans 80 % des cas.",
    ],
    paragraphsEn: [
      "To formulate her supplements, Carla challenged a long list of laboratories to push the dosages as high as possible, working with doctors and naturopaths.",
      "“Adaptogens have been used for decades, but nobody was making the most of them,” she explains. “As an aside: Cordyceps, one of the mushrooms in our Power gummies, was taken by the Chinese team in 1993 while preparing for the Olympics. The results were so high that people suspected doping.”",
      "“Blending actives optimises their effects. We standardised the quantities so that the balance is optimal,” the founder explains. BIEN Health supplements are made in France and 100% natural.",
      "The approach convinces: 80% of customers reorder.",
    ],
  },
  {
    magazine: "TheDreamTeam",
    product: { src: "/gamme-courte-ciblee.jpg", alt: "Les trois gummies BIEN health" },
    quote: "Les champignons adaptogènes révolutionnent « BIEN » notre équilibre quotidien",
    quoteEn: "Adaptogenic mushrooms are quietly revolutionising our daily balance",
    paragraphs: [
      "Stress chronique, fatigue persistante, troubles du sommeil… Dans une société où près de 6 Français sur 10 se déclarent stressés, les solutions naturelles pour retrouver un équilibre corps-esprit gagnent en popularité. BIEN mise sur le pouvoir des champignons adaptogènes et des plantes fonctionnelles pour répondre à ces enjeux modernes.",
      "Les actifs utilisés dans les produits BIEN sont soutenus par des études cliniques reconnues : le Lion’s Mane améliore la mémoire et réduit le stress perçu de 28 %, tandis que le Reishi renforce l’immunité en augmentant les cellules NK de 30 %.",
      "Disponibles en pharmacies, sur bien.health et dans certains studios de Pilates et concept stores, les produits BIEN offrent une réponse naturelle aux défis du quotidien.",
    ],
    paragraphsEn: [
      "Chronic stress, lingering fatigue, disrupted sleep… In a country where nearly 6 in 10 people describe themselves as stressed, natural ways to restore body-mind balance are gaining ground. BIEN bets on adaptogenic mushrooms and functional plants to answer those modern pressures.",
      "The actives used in BIEN products are backed by recognised clinical studies: Lion’s Mane improves memory and reduces perceived stress by 28%, while Reishi supports immunity by increasing NK cells by 30%.",
      "Available in pharmacies, on bien.health and in selected Pilates studios and concept stores, BIEN products offer a natural answer to everyday demands.",
    ],
  },
  {
    magazine: "Fresh Magazine",
    product: { src: "/prelude-bien-health.jpg", alt: "La gamme BIEN health au complet" },
    quote: "La gamme BIEN à la recherche du bien-être moderne",
    quoteEn: "The BIEN range, in search of modern wellbeing",
    paragraphs: [
      "Selon une étude publiée par la Fondation Ramsay Santé, 59 % des Français déclarent être stressés en 2025, contre 51 % en 2017. Parmi eux, 31 % ont déjà eu recours à des plantes adaptogènes pour mieux gérer leur équilibre émotionnel.",
      "Au-delà d’une simple marque, BIEN incarne une philosophie du bien-être. En alliant science et traditions ancestrales, elle mise sur une approche naturelle et complète, sans promesses irréalistes : champignons adaptogènes, plantes fonctionnelles hautement dosées, collagène et antioxydants premium.",
      "Soutenue par un laboratoire scientifique français, la marque a pour mission d’offrir l’opportunité d’affronter les défis du quotidien de manière naturelle, simple, avec des résultats concrets — une cure de 1 à 3 mois, pour des effets visibles dès 10 jours.",
      "« Parce que le vrai bien-être, ce n’est pas tout changer. C’est être toi, en mieux. »",
    ],
    paragraphsEn: [
      "According to a study published by the Ramsay Santé Foundation, 59% of French people described themselves as stressed in 2025, up from 51% in 2017. Among them, 31% have already turned to adaptogenic plants to manage their emotional balance.",
      "More than a brand, BIEN embodies a philosophy of wellbeing. Combining science and ancestral traditions, it takes a natural, complete approach with no unrealistic promises: adaptogenic mushrooms, highly dosed functional plants, premium collagen and antioxidants.",
      "Backed by a French scientific laboratory, the brand aims to let people meet everyday challenges naturally and simply, with concrete results — a one to three month course, with visible effects from day ten.",
      "“Real wellbeing isn’t about changing everything. It’s about being you, at your best.”",
    ],
  },
  {
    magazine: "BiG média",
    product: { src: "/brand/founder.jpg", alt: "Carla Debard, fondatrice de BIEN health" },
    quote: "Bien, la marque de plantes adaptogènes qui pilote votre forme",
    quoteEn: "Bien, the adaptogenic plant brand that steers your form",
    paragraphs: [
      "À 25 ans, Carla Debard lance BIEN, une marque de compléments alimentaires à base de champignons adaptogènes. Forte de son passé de sportive de haut niveau, elle mise sur l’efficacité, le goût et l’expérience client pour s’affirmer sur un marché encore émergent en France.",
      "« Dans le cadre de ma préparation, les spécialistes me conseillaient les champignons adaptogènes. Un jour, j’ai rencontré un entrepreneur qui avait lancé sa marque aux Pays-Bas, où ce genre de produits sont déjà bien plus développés qu’en France. Ici, on en est encore aux balbutiements », se souvient-elle.",
      "« Quand je prenais des compléments alimentaires, j’avais l’impression d’être malade et de prendre un médicament. Il était donc essentiel pour moi de travailler le marketing de mon produit pour le rendre le plus désirable possible. » Six mois de recherche et développement et un démarchage laboratoire par laboratoire auront été nécessaires.",
    ],
    paragraphsEn: [
      "At 25, Carla Debard launched BIEN, a supplement brand built on adaptogenic mushrooms. Drawing on her past as an elite athlete, she bets on efficacy, taste and customer experience to stand out in a market still emerging in France.",
      "“During my training, specialists recommended adaptogenic mushrooms. One day I met an entrepreneur who had launched his brand in the Netherlands, where these products are far more developed than in France. Here, we are still at the very beginning,” she recalls.",
      "“When I took supplements, I felt like I was ill, taking medicine. So it was essential for me to work on the marketing and make the product as desirable as possible.” It took six months of R&D and a laboratory-by-laboratory search.",
    ],
  },
  {
    magazine: "Mesinfos",
    product: { src: "/athletes-bien-health.jpg", alt: "BIEN health, du sport de haut niveau au quotidien" },
    quote: "BIEN Health veut démocratiser le pouvoir des champignons et adaptogènes",
    quoteEn: "BIEN Health wants to bring the power of mushrooms and adaptogens to everyone",
    paragraphs: [
      "Après avoir dû mettre fin à sa carrière sportive pour des raisons de santé, Carla Debard, CEO de BIEN Health, a choisi de transformer cette épreuve en opportunité. Son ambition : proposer des solutions naturelles, efficaces, accessibles et fabriquées dans l’Hexagone.",
      "« Nous travaillons avec un laboratoire basé dans le sud de la France. Cette collaboration nous permet de mener des recherches continues avec des équipes scientifiques afin d’améliorer constamment nos formules. »",
      "« Nous ne sommes pas malades : notre objectif est simplement d’être une meilleure version de nous-mêmes. Nous avons donc conçu des produits efficaces, mais aussi plaisants à consommer. Il est important d’écouter son corps : Calm peut être pris le soir, tandis que les autres produits sont plutôt conseillés en début de journée. »",
    ],
    paragraphsEn: [
      "After having to end her sporting career for health reasons, Carla Debard, CEO of BIEN Health, chose to turn the setback into an opportunity. Her ambition: natural, effective, accessible solutions, made in France.",
      "“We work with a laboratory in the south of France. That partnership lets us run continuous research with scientific teams and keep improving our formulas.”",
      "“We are not ill: our goal is simply to be a better version of ourselves. So we designed products that are effective but also pleasant to take. Listening to your body matters: Calm can be taken in the evening, while the others are better early in the day.”",
    ],
  },
  {
    magazine: "Gazelle",
    product: { src: "/power.jpg", alt: "BIEN health POWER, gummies énergie & endurance" },
    quote: "Un parfait équilibre mental et physique",
    quoteEn: "A perfect mental and physical balance",
    paragraphs: [
      "Ces gummies gourmands ne contiennent pas d’ingrédients controversés comme le sucre et le gluten. Par ailleurs, ils s’adaptent très bien aux régimes végétariens.",
      "Ils permettent de maintenir un parfait équilibre mental et physique, ainsi qu’une meilleure résistance au stress et à la fatigue.",
    ],
    paragraphsEn: [
      "These moreish gummies contain no controversial ingredients such as sugar or gluten, and they suit vegetarian diets well.",
      "They help maintain a perfect mental and physical balance, along with better resilience to stress and fatigue.",
    ],
    note: "POWER, 39 € la cure d’un mois",
    noteEn: "POWER, €39 for a one-month course",
  },
  {
    magazine: "Paris Match",
    clipping: { src: "/brand/presse/parutions/paris-match.webp", alt: "La double page de Paris Match consacrée aux champignons adaptogènes" },
    product: { src: "/mushglow.jpg", alt: "Mushglow, le supermix en poudre de BIEN health" },
    quote: "Tous sous champi !",
    quoteEn: "Everyone’s on mushrooms!",
    paragraphs: [
      "Les sportifs ne jurent plus que par eux. Les reishi, chaga ou shiitaké sont les dernières substances licites hautement recommandées pour être en bonne santé. Ces complexes fongiques aident le corps à mieux répondre au stress.",
      "Carla Debard, fondatrice de BIEN, marque spécialisée dans les compléments adaptogènes, met en lumière un champion de la détox : le chaga. « Exceptionnellement riche en antioxydants, il neutralise les radicaux libres, réduit le stress oxydatif et soutient les défenses naturelles », résume-t-elle.",
      "Elle le considère aussi comme un allié digestif précieux, capable d’apaiser le système gastro-intestinal et d’accompagner les phases de surcharge alimentaire. Son action sur le foie en fait un ingrédient de choix pour les protocoles détox ou les périodes de grande préparation sportive.",
      "À tester : Mushglow Supermix 6-en-1, un cocktail clean à base de champignons adaptogènes et de collagène pour soutenir la détox et booster la concentration et l’énergie.",
    ],
    paragraphsEn: [
      "Athletes swear by them. Reishi, chaga and shiitake are the latest legal substances highly recommended for good health. These fungal complexes help the body respond better to stress.",
      "Carla Debard, founder of BIEN, a brand specialising in adaptogenic supplements, highlights a detox champion: chaga. “Exceptionally rich in antioxidants, it neutralises free radicals, reduces oxidative stress and supports natural defences,” she sums up.",
      "She also sees it as a valuable digestive ally, able to soothe the gastro-intestinal system and support periods of dietary overload. Its action on the liver makes it a prime ingredient for detox protocols or intense training phases.",
      "Worth trying: Mushglow Supermix 6-in-1, a clean blend of adaptogenic mushrooms and collagen to support detox and boost focus and energy.",
    ],
    note: "Paris Match, 5 au 11 mars 2026 — Mushglow, 49 € le sachet de 30 portions",
    noteEn: "Paris Match, 5–11 March 2026 — Mushglow, €49 for 30 servings",
  },
  {
    magazine: "Closer",
    clipping: { src: "/brand/presse/parutions/closer.webp", alt: "La page Closer « Rituels bien-être »" },
    product: { src: "/prelude-bien-health.jpg", alt: "La gamme BIEN health au complet" },
    quote: "Rituels bien-être",
    quoteEn: "Wellbeing rituals",
    paragraphs: [
      "BIEN est une marque de compléments naturels fabriquée en France. Elle propose 4 produits naturels et efficaces (3 gummies sans sucre et une poudre), faciles à intégrer au quotidien : Focus pour la concentration, la clarté mentale et la mémoire, Calm pour la sérénité, la gestion du stress et le sommeil, Power pour l’énergie et l’endurance, et Mushglow, un supermix 6-en-1 en poudre pour un boost cognitif, la résilience au stress et un éclat naturel, pour rayonner.",
      "Vegan, sans sucre, sans colorants artificiels ni gluten.",
    ],
    paragraphsEn: [
      "BIEN is a natural supplement brand made in France. It offers four effective natural products (three sugar-free gummies and a powder), easy to fit into daily life: Focus for concentration, mental clarity and memory, Calm for serenity, stress management and sleep, Power for energy and endurance, and Mushglow, a 6-in-1 powder supermix for a cognitive boost, stress resilience and natural radiance.",
      "Vegan, sugar-free, with no artificial colouring and no gluten.",
    ],
  },
  {
    magazine: "Voici",
    product: { src: "/calm.jpg", alt: "BIEN health CALM, gummies sérénité & sommeil" },
    quote: "Quand la nuit porte conseil",
    quoteEn: "When the night knows best",
    paragraphs: [
      "Pendant votre sommeil, la peau se régénère… et bien plus encore, surtout si vous suivez notre guide !",
      "Le trio spécial bien-être — reishi, ashwagandha et safran — calme la charge mentale, chasse l’anxiété et favorise la détente.",
      "La bonne dose : deux gummies par jour. La cure fait effet au bout de 10 jours.",
    ],
    paragraphsEn: [
      "While you sleep, your skin regenerates… and much more besides, especially if you follow our guide!",
      "The wellbeing trio — reishi, ashwagandha and saffron — calms mental load, clears anxiety and encourages relaxation.",
      "The right dose: two gummies a day. The course takes effect after ten days.",
    ],
    note: "Calm, Sérénité Sommeil, 60 gummies, 39 €",
    noteEn: "Calm, Serenity & Sleep, 60 gummies, €39",
  },
  {
    magazine: "Public",
    product: { src: "/approch-globale-sante.jpg", alt: "Gummies BIEN health dans une coupelle" },
    quote: "Cortisol, quand le stress veut ta peau",
    quoteEn: "Cortisol: when stress comes for your skin",
    paragraphs: [
      "Le cortisol ne tape pas que les nerfs. Cette hormone du stress met la beauté sous pression. Zoom sur les soins qui assurent la paix intérieure autant que le calme cutané.",
      "Le stress prolongé agit comme un accélérateur de fatigue sur la peau. Cortisol élevé rime souvent avec traits froissés, cernes plus visibles, teint plus terne, risque d’inflammations et d’imperfections. C’est un terreau fertile du vieillissement cutané.",
      "La beauté anticortisol mise autant sur les compléments alimentaires que sur les soins topiques. Ashwagandha, rhodiola, magnésium, L-théanine ou reishi figurent parmi les actifs stars.",
    ],
    paragraphsEn: [
      "Cortisol does not only hit the nerves. The stress hormone puts beauty under pressure too. A look at the products that deliver inner peace as much as calm skin.",
      "Prolonged stress acts as a fatigue accelerator on the skin. High cortisol often means a crumpled look, more visible dark circles, a duller complexion, and a higher risk of inflammation and blemishes — fertile ground for skin ageing.",
      "Anti-cortisol beauty relies on supplements as much as on topical care. Ashwagandha, rhodiola, magnesium, L-theanine and reishi are among the star actives.",
    ],
    note: "Sélection « Beauté in » — Gummies Calm, BIEN, cure de 1 mois, 39 €",
    noteEn: "“Beauty in” selection — Calm gummies, BIEN, one-month course, €39",
  },
  {
    magazine: "Femme Actuelle",
    clipping: { src: "/brand/presse/parutions/femme-actuelle.webp", alt: "La sélection bien-être de Femme Actuelle" },
    product: { src: "/gamme-courte-ciblee.jpg", alt: "Les gummies FOCUS, POWER et CALM de BIEN health" },
    quote: "La gamme BIEN dans la sélection bien-être",
    quoteEn: "The BIEN range in the wellbeing selection",
    paragraphs: [
      "Les compléments BIEN figurent parmi la sélection bien-être du magazine : trois gummies ciblés sans sucre — Focus, Calm et Power — et le supermix Mushglow en poudre.",
      "Des formules à base de champignons et de plantes adaptogènes, fabriquées en France, pensées pour s’intégrer simplement à une routine quotidienne.",
    ],
    paragraphsEn: [
      "BIEN supplements feature in the magazine’s wellbeing selection: three targeted sugar-free gummies — Focus, Calm and Power — and the Mushglow powder supermix.",
      "Formulas built on adaptogenic mushrooms and plants, made in France, designed to slot simply into a daily routine.",
    ],
  },
  {
    magazine: "Côté Santé",
    clipping: { src: "/brand/presse/parutions/cote-sante.webp", alt: "Le dossier champignons de Côté Santé" },
    product: { src: "/power.jpg", alt: "BIEN health POWER, gummies énergie & endurance" },
    quote: "Les pouvoirs cachés des champignons",
    quoteEn: "The hidden powers of mushrooms",
    paragraphs: [
      "Fatigue persistante, motivation en berne, besoin d’un vrai coup de boost ? Ces gummies à base de Cordyceps, un champignon adaptogène, associé à la Rhodiola et au Panax Ginseng, aide à retrouver tonus et vitalité sans caféine et sans fébrilité.",
    ],
    paragraphsEn: [
      "Lingering fatigue, flagging motivation, in need of a real lift? These gummies built on Cordyceps, an adaptogenic mushroom, combined with Rhodiola and Panax Ginseng, help restore tone and vitality without caffeine and without the jitters.",
    ],
    note: "Coup de pouce n° 1 — Gummies POWER, BIEN, 39 € / 60 gummies",
    noteEn: "Pick no. 1 — POWER gummies, BIEN, €39 / 60 gummies",
  },
  {
    magazine: "Pleine Vie",
    product: { src: "/brand/bien-health-complements-champignons-adaptogenes.jpg", alt: "La gamme BIEN health" },
    quote: "Mieux-être quotidien",
    quoteEn: "Everyday wellbeing",
    paragraphs: [
      "BIEN est une marque de compléments naturels, fabriquée en France. Elle propose 4 produits efficaces (3 gummies sans sucre et une poudre), faciles à intégrer au quotidien : FOCUS pour la concentration, la clarté mentale et la mémoire, CALM pour la sérénité, la gestion du stress et le sommeil, POWER pour l’énergie et l’endurance, sans caféine, et MUSHGLOW, un supermix 6-en-1 en poudre pour un boost cognitif, la résilience au stress et un éclat naturel, pour rayonner.",
      "Vegan, sans sucre, sans colorants artificiels ni gluten.",
    ],
    paragraphsEn: [
      "BIEN is a natural supplement brand made in France. It offers four effective products (three sugar-free gummies and a powder), easy to fit into daily life: FOCUS for concentration, mental clarity and memory, CALM for serenity, stress management and sleep, POWER for caffeine-free energy and endurance, and MUSHGLOW, a 6-in-1 powder supermix for a cognitive boost, stress resilience and natural radiance.",
      "Vegan, sugar-free, with no artificial colouring and no gluten.",
    ],
    note: "Pleine Vie n° 478, avril 2026",
    noteEn: "Pleine Vie no. 478, April 2026",
  },
  {
    magazine: "Magicmaman",
    clipping: { src: "/brand/presse/parutions/magicmaman.webp", alt: "La « magic liste » de Magicmaman" },
    product: { src: "/calm.jpg", alt: "BIEN health CALM, gummies sérénité & sommeil" },
    quote: "Calme intérieur",
    quoteEn: "Inner calm",
    paragraphs: [
      "Pour les mamans pressées du matin, les fatiguées chroniques, celles qui rêvent de cocooning ou celles qui veulent rayonner même avec trois heures de sommeil !",
      "Ces gummies goût mûres réduisent le stress, stabilisent l’humeur et favorisent un sommeil plus profond.",
    ],
    paragraphsEn: [
      "For mums in a morning rush, the chronically tired, those dreaming of cocooning — or those who want to shine on three hours’ sleep!",
      "These blackberry-flavoured gummies reduce stress, steady mood and encourage deeper sleep.",
    ],
    note: "Calm, Sérénité & sommeil, BIEN, cure de 30 jours, 39 €",
    noteEn: "Calm, Serenity & Sleep, BIEN, 30-day course, €39",
  },
  {
    magazine: "Lyon Capitale",
    product: { src: "/mushglow.jpg", alt: "Mushglow, le supermix en poudre de BIEN health" },
    quote: "Routine bien-être",
    quoteEn: "A wellbeing routine",
    paragraphs: [
      "Vous vous sentez fatigué, stressé, surmené ? Il est temps de tester les champignons et plantes adaptogènes, véritables coups de pouce pour mieux gérer son équilibre émotionnel.",
      "En format poudre à intégrer dans sa boisson ou son yaourt, ce complément naturel au goût légèrement vanillé est développé dans un laboratoire français et fabriqué en Dordogne. À consommer si vous souhaitez booster votre énergie et votre clarté mentale, illuminer votre peau et diminuer votre stress.",
    ],
    paragraphsEn: [
      "Feeling tired, stressed, overworked? Time to try adaptogenic mushrooms and plants — real helpers for managing emotional balance.",
      "In powder form, to stir into a drink or a yoghurt, this natural supplement with a lightly vanilla taste is developed in a French laboratory and made in the Dordogne. For anyone wanting to boost energy and mental clarity, brighten the skin and lower stress.",
    ],
    note: "Lyon Capitale n° 863, mars 2026 — Mushglow, 49 € les 30 doses",
    noteEn: "Lyon Capitale no. 863, March 2026 — Mushglow, €49 for 30 servings",
  },
  {
    magazine: "Famille Mag",
    product: { src: "/power.jpg", alt: "BIEN health POWER, gummies énergie & endurance" },
    quote: "La nouvelle génération de compléments aux champignons adaptogènes",
    quoteEn: "The new generation of adaptogenic mushroom supplements",
    paragraphs: [
      "Face à un quotidien toujours plus intense, stress chronique, fatigue mentale, surcharge informationnelle, la quête d’un bien-être naturel et durable n’a jamais été aussi forte. C’est dans ce contexte que s’inscrit BIEN, une marque française qui remet les champignons adaptogènes au cœur de l’équilibre corps et esprit.",
      "Développées en laboratoire français, les formules BIEN associent champignons adaptogènes, plantes fonctionnelles hautement dosées et actifs premium, sans agents de charge ni caféine. La fabrication est française, réalisée en Dordogne, avec une exigence élevée en matière de traçabilité et de qualité.",
      "Parmi les quatre références de la gamme, les gummies POWER s’adressent à celles et ceux qui ressentent une fatigue persistante ou une baisse de motivation : Cordyceps (10:1) 50 mg pour stimuler la production d’ATP, Rhodiola Rosea (8:1) 8 mg pour la récupération mentale et physique, Panax Ginseng (8:1) 15 mg pour l’énergie globale et la vitalité.",
    ],
    paragraphsEn: [
      "In an ever more intense daily life — chronic stress, mental fatigue, information overload — the search for natural, lasting wellbeing has never been stronger. That is the context BIEN steps into, a French brand putting adaptogenic mushrooms back at the heart of body-mind balance.",
      "Developed in a French laboratory, BIEN formulas combine adaptogenic mushrooms, highly dosed functional plants and premium actives, with no bulking agents and no caffeine. Manufacturing is French, in the Dordogne, with high standards of traceability and quality.",
      "Among the range’s four products, the POWER gummies are for those facing lingering fatigue or flagging motivation: Cordyceps (10:1) 50 mg to stimulate ATP production, Rhodiola Rosea (8:1) 8 mg for mental and physical recovery, Panax Ginseng (8:1) 15 mg for overall energy and vitality.",
    ],
    note: "Famille Mag n° 92 — POWER, 2 gummies par jour, 60 gummies, 39 €",
    noteEn: "Famille Mag no. 92 — POWER, 2 gummies a day, 60 gummies, €39",
  },
  {
    magazine: "Psycho Pour Elles",
    product: { src: "/focus.jpg", alt: "BIEN health FOCUS, gummies concentration & mémoire" },
    quote: "Et si vous pouviez donner un coup de fouet à votre mémoire ?",
    quoteEn: "What if you could give your memory a lift?",
    paragraphs: [
      "Les gummies Focus de la marque BIEN associent champignons adaptogènes, plantes fonctionnelles et L-théanine pour stimuler mémoire, concentration et clarté mentale tout en réduisant le stress perçu.",
      "Une solution pratique à intégrer à votre routine quotidienne, qui accompagne votre esprit surchargé avec douceur et efficacité, pour une journée plus lucide, plus vive… plus légère.",
    ],
    paragraphsEn: [
      "BIEN’s Focus gummies combine adaptogenic mushrooms, functional plants and L-theanine to support memory, concentration and mental clarity while reducing perceived stress.",
      "A practical addition to a daily routine, supporting an overloaded mind gently and effectively, for a clearer, sharper — lighter — day.",
    ],
    note: "FOCUS concentration et mémoire, 39 € le mois",
    noteEn: "FOCUS concentration and memory, €39 a month",
  },
  {
    magazine: "Vital",
    product: { src: "/athletes-bien-health.jpg", alt: "BIEN health, du sport de haut niveau au quotidien" },
    quote: "Des champignons qui vous veulent du BIEN",
    quoteEn: "Mushrooms that mean you well",
    paragraphs: [
      "Les champignons adaptogènes sont la nouvelle tendance dans le monde des compléments alimentaires. BIEN s’engouffre donc dans la brèche avec ses trois recettes de gummies dont les effets sont censés être bénéfiques pour la concentration comme pour la gestion du stress ou l’endurance.",
    ],
    paragraphsEn: [
      "Adaptogenic mushrooms are the new trend in the supplement world. BIEN steps straight into it with three gummy recipes whose effects are meant to benefit concentration as much as stress management or endurance.",
    ],
    note: "Power, 39 € (30 jours), BIEN",
    noteEn: "Power, €39 (30 days), BIEN",
  },
  {
    magazine: "Avantages",
    product: { src: "/prelude-bien-health.jpg", alt: "La gamme BIEN health au complet" },
    quote: "Adoptez chaque jour une dose de BIEN",
    quoteEn: "A daily dose of BIEN",
    paragraphs: [
      "Découvrez la gamme de compléments naturels BIEN à base de champignons et de plantes adaptogènes : 3 gummies ciblés sans sucre ni lactose — Focus pour la clarté mentale et la concentration, Power pour l’énergie et la performance, Calm pour la sérénité, le sommeil et la gestion du stress — et la poudre Mushglow 6-en-1 au goût légèrement vanillé pour un boost cognitif, à ajouter dans une boisson ou un yaourt.",
      "Ces compléments alimentaires associent champignons, plantes adaptogènes et collagène pour booster l’énergie, la concentration et la sérénité au quotidien. Sans sucre, sans colorants artificiels ni gluten, fabrication française.",
    ],
    paragraphsEn: [
      "Discover the BIEN range of natural supplements based on adaptogenic mushrooms and plants: three targeted gummies with no sugar and no lactose — Focus for mental clarity and concentration, Power for energy and performance, Calm for serenity, sleep and stress management — plus the 6-in-1 Mushglow powder with its light vanilla taste for a cognitive boost, to stir into a drink or a yoghurt.",
      "These supplements combine mushrooms, adaptogenic plants and collagen to boost energy, focus and calm day to day. Sugar-free, with no artificial colouring and no gluten, made in France.",
    ],
    note: "Opération lectrices — 4 packs BIEN d’une valeur de 166 €",
    noteEn: "Reader giveaway — four BIEN packs worth €166",
  },
  {
    magazine: "Cosmopolitan",
    product: { src: "/mushglow.jpg", alt: "Mushglow, le supermix en poudre de BIEN health" },
    quote: "Adoptez chaque jour une dose de BIEN",
    quoteEn: "A daily dose of BIEN",
    paragraphs: [
      "Adoptez chaque jour une dose de BIEN avec les gummies Focus, Calm, Power et la poudre Mushglow.",
      "Ces compléments alimentaires associent champignons adaptogènes et collagène pour booster l’énergie, la concentration et la sérénité au quotidien. Végans, sans sucre, sans colorants artificiels ni gluten, fabrication française.",
    ],
    paragraphsEn: [
      "Add a daily dose of BIEN with the Focus, Calm and Power gummies and the Mushglow powder.",
      "These supplements combine adaptogenic mushrooms and collagen to boost energy, focus and calm day to day. Vegan, sugar-free, with no artificial colouring and no gluten, made in France.",
    ],
    note: "Cosmopolitan, février 2026 — opération lectrices, 3 packs BIEN d’une valeur de 170 €",
    noteEn: "Cosmopolitan, February 2026 — reader giveaway, three BIEN packs worth €170",
  },
  {
    magazine: "Fait en France",
    product: { src: "/calm.jpg", alt: "BIEN health CALM, gummies sérénité & sommeil" },
    quote: "La santé made in France mise sur la qualité, la traçabilité et l’expertise",
    quoteEn: "French-made health betting on quality, traceability and expertise",
    paragraphs: [
      "Laboratoires, marques engagées et innovations locales : la santé made in France mise sur la qualité, la traçabilité et l’expertise pour prendre soin de vous en toute confiance.",
      "Dans cette sélection figurent les gummies CALM de BIEN — reishi, ashwagandha et safran — pour la sérénité et le sommeil.",
    ],
    paragraphsEn: [
      "Laboratories, committed brands and local innovation: French-made health is betting on quality, traceability and expertise to look after you with confidence.",
      "The selection includes BIEN’s CALM gummies — reishi, ashwagandha and saffron — for serenity and sleep.",
    ],
    note: "Fait en France n° 25, printemps-été 2026 — CALM, 60 gummies, 39 €",
    noteEn: "Fait en France no. 25, Spring–Summer 2026 — CALM, 60 gummies, €39",
  },
];

const UI = {
  fr: {
    mediaEyebrow: "Ils ont parlé de BIEN",
    featuresEyebrow: "Les parutions",
    featuresTitle: "Ce que la presse a écrit",
    read: "Lire l'article",
    print: "Parution papier",
    clipping: "Voir la page",
    inFrench: null as string | null,
  },
  en: {
    mediaEyebrow: "They wrote about BIEN",
    featuresEyebrow: "Coverage",
    featuresTitle: "What the press wrote",
    read: "Read the article",
    print: "Print feature",
    clipping: "See the page",
    // Les extraits sont traduits, mais la parution reste française : la mention
    // le dit, pour qu'un lecteur qui suivrait le lien ne soit pas surpris de
    // tomber sur un article en français.
    inFrench: "Translated from the original French article",
  },
} as const;

/**
 * Une parution.
 *
 * Le texte de l'article tient la carte ; la colonne de droite n'accueille plus
 * qu'une photo du produit dont parle la parution.
 */
function Feature({ f, i, lang }: { f: Feature; i: number; lang: string }) {
  const t = UI[lang === "en" ? "en" : "fr"];
  const media = pressMedia(f.magazine);
  const quote = lang === "en" ? f.quoteEn : f.quote;
  const paragraphs = lang === "en" ? f.paragraphsEn : f.paragraphs;
  const note = lang === "en" ? (f.noteEn ?? f.note) : f.note;

  return (
    <article className={`overflow-hidden rounded-3xl lg:rounded-[2rem] ring-1 ring-border bien-shadow-sm ${i % 2 === 1 ? "bg-bien-cream/40" : "bg-card"}`}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_15rem] xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="p-6 sm:p-9 lg:p-11">
          {/* Filet de tête : numéro de parution, puis le lien vers l'article
              d'origine — ou la mention « papier » pour les titres arrivés sans
              URL, qu'on ne renvoie pas vers une home de magazine. */}
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-black/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="h-px flex-1 bg-border" />
            {media?.href ? (
              <a
                href={media.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-bien-leaf hover:gap-2.5 transition-all"
              >
                {t.read} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-xs font-semibold text-black/40">{t.print}</span>
            )}
          </div>

          {/* Le logo du média l'identifie mieux que son nom composé. */}
          {media ? (
            <Image src={media.logo} alt={media.name} width={240} height={60} className="mt-5 h-7 sm:h-8 w-auto object-contain object-left" />
          ) : (
            <p className="mt-5 font-display text-2xl text-black">{f.magazine}</p>
          )}

          <blockquote className="mt-4 font-serif text-[1.35rem] sm:text-[1.7rem] lg:text-[1.9rem] leading-[1.15] text-black">
            &laquo;&nbsp;{quote}&nbsp;&raquo;
          </blockquote>

          {/* Deux colonnes dès sm : sur une seule, les articles les plus longs
              donnaient des lignes de 120 caractères. */}
          <div className="mt-6 sm:columns-2 sm:gap-8">
            {paragraphs.map((para, j) => (
              <p key={j} className="mb-4 break-inside-avoid text-[15px] text-black/75 leading-relaxed text-justify hyphens-auto">
                {para}
              </p>
            ))}
          </div>

          {(note || t.inFrench) && (
            <div className="flex flex-wrap items-center gap-3">
              {note && (
                <span className="inline-flex items-center rounded-full bg-bien-gold/20 px-4 py-1.5 text-sm font-semibold text-black">{note}</span>
              )}
              {t.inFrench && <span className="text-xs text-black/45">{t.inFrench}</span>}
            </div>
          )}
        </div>

        {/* Colonne de droite : la photo du produit dont parle la parution,
            prise dans le shooting de la marque. Y vivaient auparavant un
            packshot généré — un flacon blanc à couvercle doré absent du
            catalogue — et une vignette « La parution » qui n'était pas un scan
            mais une carte fabriquée, dégradé et texte retapé (retour client du
            01/09/2026). */}
        {/* Sur téléphone, la photo produit était rognée en vignette carrée de
            112 px et le scan de parution, en portrait, écrasé dans une bande
            de la même hauteur : les deux arrivaient mal cadrés (retour client
            du 02/09/2026). Ils gardent désormais partout le format 4/5 du
            bureau — côte à côte à parts égales sur téléphone, empilés dès lg. */}
        <div className="flex gap-4 px-6 pb-6 sm:px-9 sm:pb-9 lg:flex-col lg:p-11 lg:pl-0">
          {f.product && (
            <div className="relative flex-1 min-w-0 aspect-[4/5] lg:w-full lg:flex-none rounded-2xl overflow-hidden ring-1 ring-border bg-bien-cream">
              <Image src={f.product.src} alt={f.product.alt} fill sizes="(max-width:1024px) 45vw, 272px" className="object-cover" />
            </div>
          )}
          {f.clipping && (
            <a href={f.clipping.src} target="_blank" rel="noopener noreferrer" className="group/clip min-w-0 flex-1 lg:flex-none">
              <span className="relative block aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-border bg-bien-cream">
                <Image src={f.clipping.src} alt={f.clipping.alt} fill sizes="(max-width:1024px) 45vw, 272px" className="object-cover transition-transform duration-500 group-hover/clip:scale-105" />
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-bien-leaf group-hover/clip:gap-2.5 transition-all">
                {t.clipping} <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function PressePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const h = HERO[lang === "en" ? "en" : "fr"];
  const t = UI[lang === "en" ? "en" : "fr"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="grid lg:grid-cols-2 items-center">
        {/* Bandeau raccourci (demande client du 19/08/2026 : seule la page
            d'accueil garde un grand hero). */}
        <div className="relative h-56 sm:h-72 lg:h-[400px] order-1 lg:order-none">
          <Image src="/brand/presse-sud-radio.jpeg" alt="BIEN health sur Sud Radio" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
          <h1 className="font-hero text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-black">
            {accentLastWord(h.h1)}
          </h1>
          <p className="mt-4 text-base text-black/75 leading-relaxed max-w-xl">
            {h.p1}
          </p>
          <p className="mt-3 text-base text-black/75 leading-relaxed max-w-xl">
            {h.p2}
          </p>
        </div>
      </section>

      {/* Mur de logos — la preuve d'un coup d'œil, avant d'entrer dans le détail
          des parutions. Les titres arrivés sans lien d'article restent affichés
          mais ne sont pas cliquables. */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="rounded-3xl lg:rounded-[2.5rem] bg-bien-cream/50 ring-1 ring-border px-5 sm:px-10 py-8 sm:py-10">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold text-center">{t.mediaEyebrow}</p>
            <span className="h-px w-8 bg-border" />
          </div>
          <div className="mt-7 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-x-6 gap-y-8 items-center">
            {PRESS.map((m) => {
              const logo = (
                /* Hauteur commune, largeur propre à chaque logo : leur taille
                   relative est réglée à la génération du fichier (aire du dessin
                   normalisée), pas par un canevas partagé qui laissait des blancs
                   latéraux très inégaux. */
                <Image src={m.logo} alt={m.name} width={m.w} height={m.h} className="h-9 sm:h-11 w-auto mx-auto opacity-70 hover:opacity-100 transition-opacity" />
              );
              return m.href ? (
                <a key={m.name} href={m.href} target="_blank" rel="noopener noreferrer" aria-label={m.name} className="min-w-0">{logo}</a>
              ) : (
                <span key={m.name} className="min-w-0">{logo}</span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parutions détaillées */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-14 sm:mt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{t.featuresEyebrow}</p>
        <h2 className="mt-2 font-display tracking-tight text-2xl sm:text-3xl text-black">{t.featuresTitle}</h2>
        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          {FEATURES.map((f, i) => (
            <Feature key={f.magazine} f={f} i={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* Réassurance (bas de page) */}
      <div className="mt-16 sm:mt-24">
        <ReassuranceBand lang={lang} />
      </div>
    </div>
  );
}
