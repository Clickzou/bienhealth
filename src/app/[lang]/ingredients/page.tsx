import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Leaf } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "ingredients",
    title: lang === "en" ? "Ingredients: adaptogens & mushrooms | BIEN health" : "Ingrédients : adaptogènes & champignons | BIEN health",
    description: lang === "en" ? "Lion's Mane, Reishi, Cordyceps, Chaga, Ashwagandha, Rhodiola, Saffron… Discover the premium actives of BIEN health formulas, dosed according to science." : "Lion's Mane, Reishi, Cordyceps, Chaga, Ashwagandha, Rhodiola, Safran… Découvrez les actifs nobles des formules BIEN health, dosés selon la science.",
  });
}

type Loc = { family: string; hook: string; desc: string };
type Ingredient = { name: string; img: string; fr: Loc; en: Loc };

const INGREDIENTS: Ingredient[] = [
  { name: "Lion's Mane", img: "/brand/lions-mane.png",
    fr: { family: "Champignon", hook: "Le meilleur ami du cerveau.", desc: "Puissant champignon adaptogène connu pour favoriser la concentration, la mémoire et la fonction cognitive en stimulant le facteur de croissance nerveuse (NGF)." },
    en: { family: "Mushroom", hook: "The brain's best friend.", desc: "A powerful adaptogenic mushroom known to support focus, memory and cognitive function by stimulating nerve growth factor (NGF)." } },
  { name: "Reishi", img: "/brand/reishi.png",
    fr: { family: "Champignon", hook: "Le champignon ultime pour apaiser le stress.", desc: "Vénéré comme le « champignon de l'immortalité » pour sa capacité à soutenir le système immunitaire, favoriser la relaxation et rétablir l'équilibre." },
    en: { family: "Mushroom", hook: "The ultimate stress-soothing mushroom.", desc: "Revered as the “mushroom of immortality” for its ability to support the immune system, promote relaxation and restore balance." } },
  { name: "Cordyceps", img: "/brand/cordyceps.png",
    fr: { family: "Champignon", hook: "Le carburant de la nature pour l'énergie.", desc: "Champignon adaptogène qui améliore l'utilisation de l'oxygène, l'endurance et l'énergie cellulaire (production d'ATP). Parfait pour une vitalité soutenue sans le crash." },
    en: { family: "Mushroom", hook: "Nature's fuel for energy.", desc: "An adaptogenic mushroom that improves oxygen use, stamina and cellular energy (ATP production). Perfect for sustained vitality without the crash." } },
  { name: "Chaga", img: "/brand/chaga.png",
    fr: { family: "Champignon", hook: "Le défenseur contre le stress oxydatif.", desc: "Riche en bêta-glucanes, polyphénols et mélanine pour soutenir la fonction immunitaire, combattre le stress oxydatif et favoriser une peau éclatante." },
    en: { family: "Mushroom", hook: "The defender against oxidative stress.", desc: "Rich in beta-glucans, polyphenols and melanin to support immune function, fight oxidative stress and promote radiant skin." } },
  { name: "Ashwagandha", img: "/brand/ashwagandha.png",
    fr: { family: "Adaptogène", hook: "Restez cool, calme et serein.", desc: "L'un des adaptogènes les plus puissants, aidant à réduire les niveaux de cortisol, à favoriser la relaxation et à soutenir la résilience globale au stress." },
    en: { family: "Adaptogen", hook: "Stay cool, calm and collected.", desc: "One of the most powerful adaptogens, helping to reduce cortisol levels, promote relaxation and support overall stress resilience." } },
  { name: "Rhodiola Rosea", img: "/brand/rhodiola.png",
    fr: { family: "Adaptogène", hook: "Votre bouclier naturel contre le stress.", desc: "Racine arctique utilisée depuis des siècles pour combattre la fatigue, améliorer la clarté mentale et garder l'esprit vif sous pression." },
    en: { family: "Adaptogen", hook: "Your natural shield against stress.", desc: "An Arctic root used for centuries to fight fatigue, improve mental clarity and keep the mind sharp under pressure." } },
  { name: "Maca", img: "/brand/maca.png",
    fr: { family: "Adaptogène", hook: "Une puissance brute, ancrée dans la tradition.", desc: "Adaptogène puissant connu pour améliorer l'endurance, équilibrer les hormones et aiguiser la clarté mentale. Une énergie durable, sans pics ni chutes." },
    en: { family: "Adaptogen", hook: "Raw power, rooted in tradition.", desc: "A powerful adaptogen known to improve stamina, balance hormones and sharpen mental clarity. Lasting energy, without spikes or crashes." } },
  { name: "L-Théanine", img: "/brand/l-theanine.png",
    fr: { family: "Actif", hook: "Une concentration zen en un seul actif.", desc: "Favorise une concentration calme et claire en augmentant les ondes cérébrales alpha. En synergie avec la caféine pour atténuer la nervosité." },
    en: { family: "Active", hook: "Zen focus in a single active.", desc: "Promotes calm, clear focus by increasing alpha brain waves. Works in synergy with caffeine to smooth out jitters." } },
  { name: "Panax Ginseng", img: "/brand/panax-ginseng.png",
    fr: { family: "Adaptogène", hook: "Une racine légendaire pour l'énergie.", desc: "Utilisé depuis des siècles pour améliorer la fonction cognitive, stimuler l'endurance et combattre la fatigue." },
    en: { family: "Adaptogen", hook: "A legendary root for energy.", desc: "Used for centuries to improve cognitive function, boost stamina and fight fatigue." } },
  { name: "Safran", img: "/brand/saffron.png",
    fr: { family: "Actif", hook: "Un booster d'humeur en or.", desc: "Scientifiquement étudié pour sa capacité à améliorer l'humeur, soutenir l'équilibre émotionnel et promouvoir un état d'esprit positif." },
    en: { family: "Active", hook: "A golden mood booster.", desc: "Scientifically studied for its ability to improve mood, support emotional balance and promote a positive mindset." } },
  { name: "Collagène", img: "/brand/collagen.png",
    fr: { family: "Actif", hook: "La base de la force et de l'éclat.", desc: "Protéine essentielle qui soutient l'élasticité de la peau et la santé des articulations : beauté et force, de l'intérieur vers l'extérieur." },
    en: { family: "Active", hook: "The foundation of strength and glow.", desc: "An essential protein that supports skin elasticity and joint health: beauty and strength, from the inside out." } },
];

const T = {
  fr: {
    eyebrow: "Ingrédients nobles", h1a: "La force du vivant, ", h1b: "dosée par la science.",
    intro: "Adaptogènes et champignons fonctionnels sélectionnés pour leur efficacité, avec des dosages transparents à chaque formule.",
    ctaTitle: "Des dosages transparents, déclarés en France.",
    ctaText: "Chaque actif est déclaré auprès de la DGAL, avec des numéros vérifiables publiquement.",
    seeProducts: "Voir les produits", compliance: "Conformité & dosages",
  },
  en: {
    eyebrow: "Premium ingredients", h1a: "The power of nature, ", h1b: "measured by science.",
    intro: "Adaptogens and functional mushrooms selected for their effectiveness, with transparent dosages in every formula.",
    ctaTitle: "Transparent dosages, declared in France.",
    ctaText: "Every active is declared to the DGAL, with publicly verifiable numbers.",
    seeProducts: "See the products", compliance: "Compliance & dosages",
  },
} as const;

export default async function IngredientsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 sm:pt-16 text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <Leaf className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(2.2rem,5.28vw,3.52rem)] leading-[0.95] text-black">
          {t.h1a}<span className="text-bien-leaf">{t.h1b}</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          {t.intro}
        </p>
      </section>

      {/* Grille ingrédients */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {INGREDIENTS.map((ing) => {
            const loc = en ? ing.en : ing.fr;
            return (
            <article key={ing.name} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:ring-bien-leaf/40 transition-all">
              <div className="relative h-32 w-32 mb-4">
                <Image src={ing.img} alt={ing.name} fill sizes="128px" className="object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-bien-sage">{loc.family}</span>
              <h2 className="mt-1 font-display text-xl text-black">{ing.name}</h2>
              <p className="mt-1.5 text-sm font-semibold text-bien-leaf">{loc.hook}</p>
              <p className="mt-2.5 text-sm text-black/70 leading-relaxed">{loc.desc}</p>
            </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-14 sm:mt-20 mb-24">
        <div className="bg-bien-leaf text-bien-cream rounded-3xl lg:rounded-[2.5rem] p-8 sm:p-12 text-center">
          <h2 className="font-display tracking-tighter text-[clamp(1.54rem,3.52vw,2.64rem)] leading-[1]">
            {t.ctaTitle}
          </h2>
          <p className="mt-3 text-bien-cream/80 max-w-xl mx-auto">
            {t.ctaText}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition">
              {t.seeProducts} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${lang}/certifications`} className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-cream/30 text-bien-cream px-8 py-4 font-bold hover:bg-bien-cream/10 transition">
              {t.compliance}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
