import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ReassuranceBand from "@/components/reassurance-band";
import { pageMetadata } from "@/lib/seo";
import { accentLastWord } from "@/lib/accent-title";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "presse",
    title: lang === "en" ? "As seen in the press | BIEN health" : "La presse en parle | BIEN health",
    description: lang === "en" ? "BIEN health in the press: Grazia, Marie Claire, Do It In Paris, L'Officiel, Gala… Discover what the media say about our natural adaptogen supplements." : "BIEN health dans la presse : Grazia, Marie Claire, Do It In Paris, L'Officiel, Gala… Découvrez ce que les médias disent de nos compléments naturels aux adaptogènes.",
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
  heading: string;
  paragraphs: string[];
  note?: string;
  product?: { src: string; alt: string };
};

const FEATURES: Feature[] = [
  {
    magazine: "Grazia",
    quote: "La science est formelle : ces plantes méconnues permettent de dire adieu au stress",
    quoteEn: "Science is clear: these little-known plants let you say goodbye to stress",
    heading:
      "La science est formelle : ces plantes méconnues permettent de dire adieu au stress (à vous le meilleur équilibre émotionnel)",
    paragraphs: [
      "Les plantes adaptogènes permettent de rééquilibrer les hormones, et notamment celles liées au stress et à l'anxiété. Elles favorisent également un meilleur sommeil. Parmi les plantes les plus connues, on retrouve l'ashwagandha, la rhodiola rosea, le ginseng ou encore le reishi, un champignon. La marque de compléments alimentaires BIEN en a justement fait son credo : proposer une solution efficace au stress et à la fatigue, avec des plantes naturelles.",
      "Selon des études scientifiques, l'ashwagandha et la rhodiola réduisent le stress de 30 % à 42 %, tandis que le reishi et la rhodiola améliorent le sommeil de 20 %. En combinant plusieurs plantes adaptogènes dans une gamme de produits variés, cela permet de calmer la charge mentale et de retrouver l'apaisement.",
    ],
  },
  {
    magazine: "marie claire",
    quote: "Stress : ces gummies vont devenir vos meilleurs alliés pour retrouver calme et sérénité",
    quoteEn: "Stress: these gummies are set to become your best allies for calm and serenity",
    heading: "Stress : ces gummies vont devenir vos meilleurs alliés pour retrouver calme et sérénité",
    paragraphs: [
      "Si vous vous sentez stressée ou anxieuse, les compléments alimentaires comme les gummies peuvent être vos alliés. Prescription Beauté vous dévoile les gummies anti-stress à adopter.",
      "Si l'Ashwagandha est utilisée empiriquement depuis des millénaires, la science commence à valider certaines de ses propriétés. Plusieurs études cliniques ont démontré son action sur la réduction du cortisol, l'hormone du stress. Une méta-analyse publiée en 2021 confirme ainsi son effet anxiolytique significatif.",
      "D'autres recherches suggèrent une amélioration de la qualité du sommeil, une augmentation de l'énergie et même un soutien des fonctions cognitives.",
      "L'Ashwagandha serait également bénéfique pour réguler la glycémie et soutenir la fonction thyroïdienne. Toutefois, la communauté scientifique appelle à poursuivre les recherches.",
    ],
    product: { src: "/brand/product-calm.jpg", alt: "BIEN health CALM, gummies sérénité & sommeil" },
  },
  {
    magazine: "Do It in Paris",
    quote: "Pour soutenir énergie, clarté mentale et équilibre émotionnel",
    quoteEn: "To support energy, mental clarity and emotional balance",
    heading: "BIEN",
    paragraphs: [
      "À mi-chemin entre science et traditions ancestrales, les compléments alimentaires de BIEN associent champignons fonctionnels, adaptogènes et collagène pour soutenir énergie, clarté mentale et équilibre émotionnel. Face aux défis du quotidien, BIEN propose une approche naturelle et complète, sans promesses miracles mais avec des formules efficaces et faciles à intégrer dans la vie de tous les jours.",
      "Made in France, vegan et sans sucre, BIEN accompagne chaque journée d'une dose de résilience et de beauté naturelle. Et pour les lectrices de DO IT, 20 % de réduction au pop-up !",
      "Nos coups de cœur : les gummies FOCUS, CALM et POWER (dès 39 €) ou la poudre Mushglow (dès 49 €), qui s'intègrent facilement au quotidien dans un café ou un smoothie, pour un effet visible en quelques jours.",
      "Retrouvez toute la collection sur bien.health",
    ],
  },
  {
    magazine: "L'Officiel",
    quote: "Votre allié quotidien pour retrouver un esprit clair, concentré et résilient",
    quoteEn: "Your everyday ally for a clear, focused and resilient mind",
    heading: "Bien Health",
    paragraphs: [
      "FOCUS, c'est votre allié quotidien pour retrouver un esprit clair, concentré et résilient — même en pleine surcharge mentale.",
      "Formulés avec Lion's Mane, Rhodiola et L-Théanine, ces gummies goût ananas boostent la clarté mentale, soutiennent l'attention et favorisent le focus — sans nervosité, ni crash.",
    ],
    note: "FOCUS, 39 € le pot de 60 gummies",
    product: { src: "/brand/product-focus.jpg", alt: "BIEN health FOCUS, gummies concentration & mémoire" },
  },
  {
    magazine: "Gala",
    quote: "Des champignons pour booster et retrouver l'équilibre",
    quoteEn: "Mushrooms to boost energy and restore balance",
    heading: "Des champignons pour booster et retrouver l'équilibre !",
    paragraphs: [
      "Issue du sport de haut niveau — d'abord l'équitation puis la course automobile — Carla s'intéresse depuis longtemps aux vertus bien-être des champignons adaptogènes. Elle reprend BIEN avec passion et en porte fièrement les valeurs. Made in France, vegan, sans sucre et sans gluten, les gummies BIEN sont de véritables boosters au quotidien.",
      "Les gummies Focus, formulés avec Lion's Mane, Rhodiola et L-Théanine, aident à rester clair et concentré. Pour favoriser la détente et un sommeil apaisé, Calm associe Reishi, Ashwagandha et Safran. Quant aux gummies Power, enrichis en Cordyceps, Rhodiola Rosea et Panax Ginseng, ils offrent un vrai coup de boost, sans contre-coup. À noter : les adaptogènes utilisés dans ces formules montrent en moyenne 30 % de réduction du stress dans les études cliniques.",
      "Pour les adeptes du format poudre, Mushglow est un supermix clean à base de champignons, d'adaptogènes et de collagène. Sa saveur légèrement vanillée accompagne facilement un café, un matcha ou un lait végétal. Résultat : énergie renouvelée et éclat naturel de la peau.",
      "Pour les fêtes de fin d'année, bénéficiez de 20 % de réduction avec le code GALA20, valable jusqu'au 31/12. Essayez, savourez, performez !",
    ],
  },
];

const CARD_IMG: Record<string, string> = {
  "Grazia": "/brand/presse/grazia.jpg",
  "marie claire": "/brand/presse/marie-claire.jpg",
  "Do It in Paris": "/brand/presse/do-it-paris.jpg",
  "L'Officiel": "/brand/presse/officiel.jpg",
  "Gala": "/brand/presse/gala.jpg",
};

/** Fac-similé d'une parution.
 *
 *  Largeur bornée à la moitié de la demi-colonne (demande client) : étirée,
 *  la page de magazine dépassait les 1200 px de haut sur grand écran et
 *  écrasait la citation posée en face. Sous cette borne — donc sur téléphone —
 *  `w-full` l'emporte et l'image reste pleine largeur.
 */
function MagazineCard({ f }: { f: Feature }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CARD_IMG[f.magazine]}
      alt={`BIEN vu dans ${f.magazine}`}
      loading="lazy"
      className="w-full max-w-md mx-auto h-auto rounded-3xl bien-shadow"
    />
  );
}

function Quote({ f, lang }: { f: Feature; lang: string }) {
  return (
    <div className="flex items-center justify-center px-2 sm:px-6 py-8">
      <p className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug text-black text-center max-w-lg">
        «&nbsp;{lang === "en" ? f.quoteEn : f.quote}&nbsp;» <span className="text-black/60">{f.magazine}</span>
      </p>
    </div>
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

      {/* Parutions presse */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-20">
        {FEATURES.map((f, i) => {
          const reversed = i % 2 === 1;
          return (
            <section key={f.magazine} className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              <div className={reversed ? "lg:order-2" : ""}><Quote f={f} lang={lang} /></div>
              <div className={reversed ? "lg:order-1" : ""}><MagazineCard f={f} /></div>
            </section>
          );
        })}
      </div>

      {/* Réassurance (bas de page) */}
      <ReassuranceBand lang={lang} />
    </div>
  );
}
