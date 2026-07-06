import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Leaf } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ingrédients — Adaptogènes & champignons fonctionnels · BIEN",
  description:
    "Lion's Mane, Reishi, Cordyceps, Chaga, Ashwagandha, Rhodiola, Safran… Découvrez les actifs nobles des formules BIEN, dosés selon la science.",
};

type Ingredient = { name: string; hook: string; desc: string; img: string; family: string };

const INGREDIENTS: Ingredient[] = [
  { name: "Lion's Mane", family: "Champignon", img: "/brand/lions-mane.png", hook: "Le meilleur ami du cerveau.", desc: "Puissant champignon adaptogène connu pour favoriser la concentration, la mémoire et la fonction cognitive en stimulant le facteur de croissance nerveuse (NGF)." },
  { name: "Reishi", family: "Champignon", img: "/brand/reishi.png", hook: "Le champignon ultime pour apaiser le stress.", desc: "Vénéré comme le « champignon de l'immortalité » pour sa capacité à soutenir le système immunitaire, favoriser la relaxation et rétablir l'équilibre." },
  { name: "Cordyceps", family: "Champignon", img: "/brand/cordyceps.png", hook: "Le carburant de la nature pour l'énergie.", desc: "Champignon adaptogène qui améliore l'utilisation de l'oxygène, l'endurance et l'énergie cellulaire (production d'ATP). Parfait pour une vitalité soutenue sans le crash." },
  { name: "Chaga", family: "Champignon", img: "/brand/chaga.png", hook: "Le défenseur contre le stress oxydatif.", desc: "Riche en bêta-glucanes, polyphénols et mélanine pour soutenir la fonction immunitaire, combattre le stress oxydatif et favoriser une peau éclatante." },
  { name: "Ashwagandha", family: "Adaptogène", img: "/brand/ashwagandha.png", hook: "Restez cool, calme et serein.", desc: "L'un des adaptogènes les plus puissants, aidant à réduire les niveaux de cortisol, à favoriser la relaxation et à soutenir la résilience globale au stress." },
  { name: "Rhodiola Rosea", family: "Adaptogène", img: "/brand/rhodiola.png", hook: "Votre bouclier naturel contre le stress.", desc: "Racine arctique utilisée depuis des siècles pour combattre la fatigue, améliorer la clarté mentale et garder l'esprit vif sous pression." },
  { name: "Maca", family: "Adaptogène", img: "/brand/maca.png", hook: "Une puissance brute, ancrée dans la tradition.", desc: "Adaptogène puissant connu pour améliorer l'endurance, équilibrer les hormones et aiguiser la clarté mentale. Une énergie durable, sans pics ni chutes." },
  { name: "L-Théanine", family: "Actif", img: "/brand/l-theanine.png", hook: "Une concentration zen en un seul actif.", desc: "Favorise une concentration calme et claire en augmentant les ondes cérébrales alpha. En synergie avec la caféine pour atténuer la nervosité." },
  { name: "Panax Ginseng", family: "Adaptogène", img: "/brand/panax-ginseng.png", hook: "Une racine légendaire pour l'énergie.", desc: "Utilisé depuis des siècles pour améliorer la fonction cognitive, stimuler l'endurance et combattre la fatigue." },
  { name: "Safran", family: "Actif", img: "/brand/saffron.png", hook: "Un booster d'humeur en or.", desc: "Scientifiquement étudié pour sa capacité à améliorer l'humeur, soutenir l'équilibre émotionnel et promouvoir un état d'esprit positif." },
  { name: "Collagène", family: "Actif", img: "/brand/collagen.png", hook: "La base de la force et de l'éclat.", desc: "Protéine essentielle qui soutient l'élasticité de la peau et la santé des articulations : beauté et force, de l'intérieur vers l'extérieur." },
];

export default async function IngredientsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-16 text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <Leaf className="h-4 w-4" /> Ingrédients nobles
        </p>
        <h1 className="mt-3 font-display font-black tracking-tighter text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-black">
          La force du vivant, <span className="text-bien-leaf">dosée par la science.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          Adaptogènes et champignons fonctionnels sélectionnés pour leur efficacité, avec des dosages transparents à chaque formule.
        </p>
      </section>

      {/* Grille ingrédients */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-12 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {INGREDIENTS.map((ing) => (
            <article key={ing.name} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:ring-bien-leaf/40 transition-all">
              <div className="relative h-32 w-32 mb-4">
                <Image src={ing.img} alt={ing.name} fill sizes="128px" className="object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-bien-sage">{ing.family}</span>
              <h2 className="mt-1 font-display font-black text-xl text-black">{ing.name}</h2>
              <p className="mt-1.5 text-sm font-semibold text-bien-leaf">{ing.hook}</p>
              <p className="mt-2.5 text-sm text-black/70 leading-relaxed">{ing.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-14 sm:mt-20 mb-24">
        <div className="bg-bien-forest text-bien-cream rounded-3xl lg:rounded-[2.5rem] p-8 sm:p-12 text-center">
          <h2 className="font-display font-black tracking-tighter text-[clamp(1.75rem,4vw,3rem)] leading-[1]">
            Des dosages transparents, déclarés en France.
          </h2>
          <p className="mt-3 text-bien-cream/80 max-w-xl mx-auto">
            Chaque actif est déclaré auprès de la DGAL, avec des numéros vérifiables publiquement.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition">
              Voir les produits <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${lang}/certifications`} className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-cream/30 text-bien-cream px-8 py-4 font-bold hover:bg-bien-cream/10 transition">
              Conformité & dosages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
