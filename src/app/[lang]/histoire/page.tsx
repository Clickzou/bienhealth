import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, Leaf, HeartPulse, MapPin } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "histoire",
    title: lang === "en" ? "Our story — BIEN" : "Notre histoire — BIEN",
    description: lang === "en" ? "BIEN HEALTH, a French brand of natural supplements born from the journey of a former elite athlete. Adaptogens and functional mushrooms for life's athletes." : "BIEN HEALTH, marque française de compléments naturels née du parcours d'une ancienne sportive de haut niveau. Adaptogènes et champignons fonctionnels pour les athlètes de la vie.",
  });
}

const VALUE_ICONS = [Leaf, MapPin, HeartPulse];

const T = {
  fr: {
    eyebrow: "Notre histoire",
    h1: "Aider les athlètes de la vie à mieux vivre le quotidien.",
    heroText: "BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est d'accompagner chacun à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental, troubles de la mémoire, manque d'énergie.",
    fromEyebrow: "D'où vient BIEN", fromTitle: "Née du sport de haut niveau.",
    story: [
      "La marque est née du parcours d'une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.",
      "Notre corps et notre esprit méritent des solutions naturelles pour performer durablement. Habituée aux exigences du sport de haut niveau, la clarté mentale, la récupération et la vitalité ont toujours été au cœur de mes préoccupations.",
      "Quand j'ai découvert les champignons adaptogènes, j'ai trouvé la réponse naturelle et cohérente que je cherchais pour m'accompagner dans mes challenges quotidiens, bien au-delà du sport : soutenir mon organisme, renforcer ma concentration et optimiser mon énergie, sans compromis.",
      "Aujourd'hui, c'est dans cette culture de la performance consciente que l'on fait grandir BIEN, en respectant l'équilibre, la santé et la résilience sur le long terme.",
      "Accompagnés par un laboratoire scientifique français, nous développons des compléments adaptogènes conçus pour soutenir le corps et l'esprit face aux défis du quotidien. Pensés pour les athlètes de la vie — entrepreneurs, créatifs, sportifs, parents, leaders — notre gamme s'inscrit dans une vision moderne, transparente et fonctionnelle du bien-être.",
    ],
    ceo: "Carla, CEO BIEN Health",
    list: [
      "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
      "Vegan, sans sucre ni colorants, sans gluten — fabriqué en France",
      "Riches en fibres prébiotiques pour l'équilibre du microbiote",
      "Plantes adaptogènes & champignons médicinaux, dosages transparents",
    ],
    values: [
      { title: "Naturel & clean", text: "Vegan, sans sucre ni colorants artificiels, sans gluten, riches en fibres prébiotiques." },
      { title: "Fabriqué en France", text: "Formulé et fabriqué en France, avec des contrôles qualité à chaque étape." },
      { title: "Dosé par la science", text: "Adaptogènes et champignons fonctionnels aux dosages transparents, déclarés à la DGAL." },
    ],
    ctaTitle: "Prêt·e à découvrir votre rituel ?", seeShop: "Voir la boutique", quiz: "Faire le diagnostic",
  },
  en: {
    eyebrow: "Our story",
    h1: "Helping life's athletes live better every day.",
    heroText: "BIEN HEALTH is a French brand of natural food supplements on a mission to help everyone better handle everyday challenges: stress, sleep, mental fog, memory issues and low energy.",
    fromEyebrow: "Where BIEN comes from", fromTitle: "Born from elite sport.",
    story: [
      "The brand was born from the journey of a former elite athlete who used adaptogenic plants and medicinal mushrooms (ashwagandha, saffron…) to optimise her physical and mental preparation — before creating a brand that's more effective, natural and accessible every day.",
      "Our body and mind deserve natural solutions to perform sustainably. Used to the demands of elite sport, mental clarity, recovery and vitality have always been at the heart of my concerns.",
      "When I discovered adaptogenic mushrooms, I found the natural, coherent answer I was looking for to support me through my daily challenges, well beyond sport: supporting my body, strengthening my focus and optimising my energy, with no compromise.",
      "Today, it's within this culture of conscious performance that we grow BIEN, respecting balance, health and resilience over the long term.",
      "Supported by a French scientific laboratory, we develop adaptogenic supplements designed to support body and mind against everyday challenges. Made for life's athletes — entrepreneurs, creatives, athletes, parents, leaders — our range embodies a modern, transparent and functional vision of wellbeing.",
    ],
    ceo: "Carla, CEO BIEN Health",
    list: [
      "4 natural products: 3 gummies + 1 all-in-one powder",
      "Vegan, no sugar or colourings, gluten-free — made in France",
      "Rich in prebiotic fibres for a balanced microbiome",
      "Adaptogenic plants & medicinal mushrooms, transparent dosages",
    ],
    values: [
      { title: "Natural & clean", text: "Vegan, no sugar or artificial colourings, gluten-free, rich in prebiotic fibres." },
      { title: "Made in France", text: "Formulated and made in France, with quality controls at every step." },
      { title: "Science-based dosing", text: "Adaptogens and functional mushrooms with transparent dosages, declared to the DGAL." },
    ],
    ctaTitle: "Ready to discover your ritual?", seeShop: "Visit the shop", quiz: "Take the quiz",
  },
} as const;

export default async function HistoirePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];
  const VALUES = t.values.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-10 sm:pt-14">
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow grid lg:grid-cols-2 items-stretch">
          <div className="text-bien-cream p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">{t.eyebrow}</p>
            <h1 className="mt-4 font-hero text-[clamp(1.98rem,4.84vw,3.52rem)] leading-[0.98]">
              {t.h1}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-bien-cream/85 leading-relaxed">
              {t.heroText}
            </p>
          </div>
          <div className="relative min-h-[300px] lg:min-h-[520px]">
            <Image src="/brand/story.jpg" alt="L'histoire de BIEN" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Récit */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bien-shadow">
            <Image src="/brand/founder.jpg" alt="La fondatrice de BIEN" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{t.fromEyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.54rem,3.52vw,2.64rem)] leading-[1] text-black">
              {t.fromTitle}
            </h2>
            {t.story.map((para, i) => (
              <p key={i} className={`${i === 0 ? "mt-5" : "mt-4"} text-base sm:text-lg text-black/75 leading-relaxed`}>{para}</p>
            ))}
            <p className="mt-5 font-display text-black">{t.ceo}</p>
            <ul className="mt-7 space-y-3">
              {t.list.map((line) => (
                <li key={line} className="flex items-start gap-3 text-black">
                  <span className="mt-1 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-gold text-black"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-lg text-black leading-tight">{title}</h3>
              <p className="mt-2 text-sm text-black/70 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24 mb-24 text-center">
        <h2 className="font-display tracking-tighter text-[clamp(1.54rem,3.52vw,2.64rem)] leading-[1] text-black">
          {t.ctaTitle}
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
            {t.seeShop} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${lang}/diagnostic`} className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-8 py-4 font-bold hover:bg-bien-forest hover:text-bien-cream transition-colors">
            {t.quiz}
          </Link>
        </div>
      </section>
    </div>
  );
}
