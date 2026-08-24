import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Leaf } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import IngredientCard from "@/components/ingredient-card";
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

/*
  Textes repris mot pour mot de la page Ingrédients du site du client
  (bien.health/pages/ingredients), à sa demande. Seules les coquilles de la
  source ont été corrigées (« adaptogêne », « commeune ») et les guillemets
  passés en français. La version anglaise en est la traduction.
*/
const INGREDIENTS: Ingredient[] = [
  { name: "Lion's Mane", img: "/brand/lions-mane.png",
    fr: { family: "Champignon", hook: "Le meilleur ami du cerveau.", desc: "Le Lion's Mane est un puissant champignon adaptogène connu pour favoriser la concentration, la mémoire et la fonction cognitive en stimulant le facteur de croissance nerveuse (NGF). C'est comme une mise à niveau quotidienne pour votre esprit, vous gardant vif, créatif et lucide." },
    en: { family: "Mushroom", hook: "The brain's best friend.", desc: "Lion's Mane is a powerful adaptogenic mushroom known to support focus, memory and cognitive function by stimulating nerve growth factor (NGF). It's like a daily upgrade for your mind, keeping you sharp, creative and clear-headed." } },
  { name: "Reishi", img: "/brand/reishi.png",
    fr: { family: "Champignon", hook: "Le champignon ultime pour apaiser le stress.", desc: "Le Reishi est vénéré comme le « champignon de l'immortalité » pour sa capacité à soutenir le système immunitaire, à favoriser la relaxation et à rétablir l'équilibre. C'est votre solution de prédilection pour la sérénité, la résilience et le bien-être général." },
    en: { family: "Mushroom", hook: "The ultimate stress-soothing mushroom.", desc: "Reishi is revered as the “mushroom of immortality” for its ability to support the immune system, promote relaxation and restore balance. It's your go-to for serenity, resilience and overall wellbeing." } },
  { name: "Cordyceps", img: "/brand/cordyceps.png",
    fr: { family: "Champignon", hook: "Le carburant de la nature pour l'énergie et l'endurance.", desc: "Le cordyceps est un champignon adaptogène qui améliore l'utilisation de l'oxygène, l'endurance et l'énergie cellulaire (production d'ATP). Parfait pour une vitalité soutenue sans le crash." },
    en: { family: "Mushroom", hook: "Nature's fuel for energy and endurance.", desc: "Cordyceps is an adaptogenic mushroom that improves oxygen use, endurance and cellular energy (ATP production). Perfect for sustained vitality without the crash." } },
  { name: "Chaga", img: "/brand/chaga.png",
    fr: { family: "Champignon", hook: "Le défenseur ultime contre le stress oxydatif.", desc: "Le chaga est un champignon adaptogène riche en bêta-glucanes, en polyphénols et en mélanine pour soutenir la fonction immunitaire, combattre le stress oxydatif et favoriser une peau éclatante. Un coup de pouce quotidien pour la résilience de l'intérieur." },
    en: { family: "Mushroom", hook: "The ultimate defender against oxidative stress.", desc: "Chaga is an adaptogenic mushroom rich in beta-glucans, polyphenols and melanin to support immune function, fight oxidative stress and promote radiant skin. A daily boost for resilience from within." } },
  { name: "Ashwagandha", img: "/brand/ashwagandha.png",
    fr: { family: "Adaptogène", hook: "Restez cool, calme et serein.", desc: "L'Ashwagandha est l'un des adaptogènes les plus puissants, aidant à réduire les niveaux de cortisol, à favoriser la relaxation et à soutenir la résilience globale au stress. C'est comme une respiration profonde pour votre système nerveux." },
    en: { family: "Adaptogen", hook: "Stay cool, calm and collected.", desc: "Ashwagandha is one of the most powerful adaptogens, helping to lower cortisol levels, promote relaxation and support overall stress resilience. It's like a deep breath for your nervous system." } },
  { name: "Rhodiola Rosea", img: "/brand/rhodiola.png",
    fr: { family: "Adaptogène", hook: "Votre bouclier naturel contre le stress et votre booster d'endurance.", desc: "Cette racine arctique est utilisée depuis des siècles pour combattre la fatigue, améliorer la clarté mentale et garder votre esprit vif sous pression. Que vous vous attaquiez à une journée chargée ou que vous vous frayiez un chemin à travers une séance d'entraînement, la Rhodiola vous aide à rester fort, concentré et résilient." },
    en: { family: "Adaptogen", hook: "Your natural shield against stress and your endurance booster.", desc: "This Arctic root has been used for centuries to fight fatigue, improve mental clarity and keep your mind sharp under pressure. Whether you're tackling a busy day or powering through a workout, Rhodiola helps you stay strong, focused and resilient." } },
  { name: "Maca", img: "/brand/maca.png",
    fr: { family: "Adaptogène", hook: "Une puissance brute, ancrée dans la tradition.", desc: "La maca est un adaptogène puissant connu pour sa capacité à améliorer l'endurance, à équilibrer les hormones et à aiguiser la clarté mentale. Elle alimente une énergie durable, une résilience et une vitalité : pas de pics, pas de chutes, juste de l'endurance pure." },
    en: { family: "Adaptogen", hook: "Raw power, rooted in tradition.", desc: "Maca is a powerful adaptogen known for its ability to improve endurance, balance hormones and sharpen mental clarity. It fuels lasting energy, resilience and vitality: no spikes, no crashes, just pure stamina." } },
  { name: "L-Théanine", img: "/brand/l-theanine.png",
    fr: { family: "Actif", hook: "Une concentration zen dans un seul ingrédient.", desc: "La L-théanine favorise une concentration calme et claire en augmentant les ondes cérébrales alpha, le même état atteint lors d'une méditation profonde. Elle agit en synergie avec la caféine pour atténuer la nervosité, réduire le stress et vous permettre de rester concentré sans crash." },
    en: { family: "Active", hook: "Zen focus in a single ingredient.", desc: "L-theanine promotes calm, clear focus by increasing alpha brain waves, the same state reached in deep meditation. It works in synergy with caffeine to smooth out jitters, reduce stress and keep you focused without the crash." } },
  { name: "Panax Ginseng", img: "/brand/panax-ginseng.png",
    fr: { family: "Adaptogène", hook: "Une racine légendaire pour une énergie soutenue et des performances mentales.", desc: "Le Panax Ginseng est utilisé depuis des siècles pour améliorer la fonction cognitive, stimuler l'endurance et combattre la fatigue, vous donnant ainsi l'endurance nécessaire pour affronter n'importe quoi." },
    en: { family: "Adaptogen", hook: "A legendary root for sustained energy and mental performance.", desc: "Panax Ginseng has been used for centuries to improve cognitive function, boost stamina and fight fatigue, giving you the endurance to take on anything." } },
  { name: "Safran", img: "/brand/saffron.png",
    fr: { family: "Actif", hook: "Un booster d'humeur en or.", desc: "Le safran a été scientifiquement étudié pour sa capacité à améliorer l'humeur, à soutenir l'équilibre émotionnel et à promouvoir un état d'esprit positif. Un peu suffit pour une grande luminosité intérieure." },
    en: { family: "Active", hook: "A golden mood booster.", desc: "Saffron has been scientifically studied for its ability to improve mood, support emotional balance and promote a positive mindset. A little goes a long way for a lot of inner brightness." } },
  { name: "Collagène", img: "/brand/collagen.png",
    fr: { family: "Actif", hook: "La base de la force et de l'éclat.", desc: "Le collagène est la protéine essentielle qui soutient l'élasticité de la peau et la santé des articulations. Il aide à maintenir l'éclat de la peau, fortifie les cheveux et les ongles : beauté et force de l'intérieur vers l'extérieur." },
    en: { family: "Active", hook: "The foundation of strength and glow.", desc: "Collagen is the essential protein that supports skin elasticity and joint health. It helps maintain radiant skin and strengthens hair and nails: beauty and strength from the inside out." } },
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
        {/* Deux fiches par ligne dès le téléphone (demande client) : en pleine
            largeur, une seule tenait à l'écran. Tout ce qui suit se resserre
            donc sous sm. */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {INGREDIENTS.map((ing) => {
            const loc = en ? ing.en : ing.fr;
            return (
              <IngredientCard
                key={ing.name}
                img={ing.img}
                name={ing.name}
                family={loc.family}
                hook={loc.hook}
                desc={loc.desc}
                lang={lang}
              />
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
