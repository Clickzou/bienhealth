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

/** Fac-similés fournis par le client, une page de magazine par parution. */
const CARD_IMG: Record<string, string> = {
  "Grazia": "/brand/presse/grazia.jpg",
  "marie claire": "/brand/presse/marie-claire.jpg",
  "Do It in Paris": "/brand/presse/do-it-paris.jpg",
  "L'Officiel": "/brand/presse/officiel.jpg",
  "Gala": "/brand/presse/gala.jpg",
};

const UI = {
  fr: {
    mediaEyebrow: "Ils ont parlé de BIEN",
    featuresEyebrow: "Les parutions",
    featuresTitle: "Ce que la presse a écrit",
    read: "Lire l'article",
    print: "Parution papier",
    clipping: "La parution",
    inFrench: null as string | null,
  },
  en: {
    mediaEyebrow: "They wrote about BIEN",
    featuresEyebrow: "Coverage",
    featuresTitle: "What the press wrote",
    read: "Read the article",
    print: "Print feature",
    clipping: "The clipping",
    // Les articles sont parus dans la presse française : les extraits restent
    // dans leur langue d'origine plutôt que d'être retraduits.
    inFrench: "Excerpt from the original French article",
  },
} as const;

/**
 * Une parution.
 *
 * Le texte de l'article tient désormais la carte ; le fac-similé n'est plus
 * qu'une vignette de preuve dans la colonne de droite (demande client — en
 * pleine largeur, les pages de magazine faisaient à elles seules tout le
 * contenu de la page, démesurées et illisibles).
 */
function Feature({ f, i, lang }: { f: Feature; i: number; lang: string }) {
  const t = UI[lang === "en" ? "en" : "fr"];
  const media = pressMedia(f.magazine);
  const clipping = CARD_IMG[f.magazine];
  const quote = lang === "en" ? f.quoteEn : f.quote;

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
            {f.paragraphs.map((para, j) => (
              <p key={j} className="mb-4 break-inside-avoid text-[15px] text-black/75 leading-relaxed text-justify hyphens-auto">
                {para}
              </p>
            ))}
          </div>

          {(f.note || t.inFrench) && (
            <div className="flex flex-wrap items-center gap-3">
              {f.note && (
                <span className="inline-flex items-center rounded-full bg-bien-gold/20 px-4 py-1.5 text-sm font-semibold text-black">{f.note}</span>
              )}
              {t.inFrench && <span className="text-xs text-black/45">{t.inFrench}</span>}
            </div>
          )}
        </div>

        {/* Colonne de preuve : le produit cité, puis le fac-similé en aperçu.
            Le dégradé signale que la page est tronquée et invite au clic. */}
        <div className="flex gap-4 px-6 pb-6 sm:px-9 sm:pb-9 lg:flex-col lg:p-11 lg:pl-0">
          {f.product && (
            <div className="relative h-28 w-28 shrink-0 lg:h-auto lg:w-full lg:aspect-square rounded-2xl overflow-hidden ring-1 ring-border bg-bien-cream">
              <Image src={f.product.src} alt={f.product.alt} fill sizes="(max-width:1024px) 112px, 240px" className="object-cover" />
            </div>
          )}
          {clipping && (
            <a href={clipping} target="_blank" rel="noopener noreferrer" className="group min-w-0 flex-1 lg:flex-none">
              <span className="relative block h-28 lg:h-56 rounded-2xl overflow-hidden ring-1 ring-border bg-bien-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={clipping} alt={`BIEN vu dans ${f.magazine}`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent" />
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-bien-leaf group-hover:gap-2.5 transition-all">
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
                <Image src={m.logo} alt={m.name} width={240} height={60} className="h-6 sm:h-7 w-auto max-w-full object-contain mx-auto opacity-70 hover:opacity-100 transition-opacity" />
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
