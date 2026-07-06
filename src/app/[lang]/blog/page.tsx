import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Le Journal BIEN — bien-être, adaptogènes & science",
  description:
    "Conseils, décryptages et science des adaptogènes et champignons fonctionnels par BIEN HEALTH. Le contenu éditorial arrive prochainement.",
};

/**
 * Index du blog « Le Journal BIEN ».
 * Placeholder soigné : le contenu éditorial sera servi depuis Supabase
 * (source unique du contenu, cf. PLAN-REFONTE). Les catégories reprennent
 * les univers de la marque.
 */

const CATEGORIES = [
  { title: "Adaptogènes", desc: "Ashwagandha, rhodiola, safran… ce que dit la science.", img: "/brand/ing-ashwagandha.jpg" },
  { title: "Champignons fonctionnels", desc: "Crinière de lion, reishi, cordyceps, chaga.", img: "/brand/ing-reishi.jpg" },
  { title: "Rituels & bien-être", desc: "Sommeil, focus, énergie, équilibre au quotidien.", img: "/brand/ing-lionsmane.jpg" },
];

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-20 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.55_0.13_75)]">
          <Sparkles className="h-3.5 w-3.5" /> Le Journal
        </span>
        <h1 className="mt-5 font-display font-black tracking-tighter text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-black">
          Le Journal <span className="text-bien-leaf">BIEN</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          Décryptages, conseils et science des adaptogènes et champignons fonctionnels.
          Nos premiers articles arrivent très bientôt.
        </p>
      </section>

      {/* Catégories à venir */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-14 sm:mt-20">
        <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {CATEGORIES.map((cat) => (
            <article key={cat.title} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={cat.img} alt={cat.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 rounded-full bg-bien-cream/90 px-3 py-1 text-[11px] font-semibold text-black">Bientôt</span>
              </div>
              <div className="p-5">
                <h2 className="font-display font-black text-lg text-black leading-tight">{cat.title}</h2>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">{cat.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA retour boutique */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24 mb-24">
        <div className="max-w-3xl mx-auto text-center bg-bien-cream rounded-3xl p-8 sm:p-12">
          <h2 className="font-display font-black tracking-tighter text-[clamp(1.5rem,3.5vw,2.25rem)] leading-[1.05] text-black">
            En attendant, découvrez nos rituels.
          </h2>
          <p className="mt-3 text-black/70">Des formules naturelles, dosées selon la science.</p>
          <Link href={`/${lang}#produits`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
            Voir la boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
