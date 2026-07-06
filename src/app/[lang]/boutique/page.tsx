import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { hasLocale } from "../dictionaries";
import { getProducts } from "@/lib/shopify-products";
import { typeOf } from "@/lib/shop";
import SiteHeader from "@/components/site-header";
import ProductCard from "@/components/product-card";
import ReassuranceBand from "@/components/reassurance-band";
import DiagnosticCTA from "@/components/diagnostic-cta";

export const metadata: Metadata = {
  title: "Boutique — Nos compléments naturels · BIEN",
  description:
    "Découvrez la gamme BIEN : 3 gummies (CALM, FOCUS, POWER) et la poudre MUSHGLOW. Adaptogènes et champignons fonctionnels, dosés selon la science, fabriqués en France.",
};

/** Chips « par besoin » → collections dédiées (URLs SEO). */
const NEEDS = [
  { label: "Sommeil & Sérénité", slug: "serenite" },
  { label: "Concentration", slug: "concentration" },
  { label: "Énergie", slug: "performance-et-vitalite" },
  { label: "Beauté & Équilibre", slug: "beaute-et-bien-etre" },
];

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Landing boutique : toute la gamme sauf les accessoires.
  const products = (await getProducts(24)).filter((p) => typeOf(p) !== "accessoires");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-10 sm:pt-14">
        <div className="relative hero-gradient rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">La gamme BIEN</p>
          <h1 className="mt-3 font-display font-black tracking-tighter text-bien-cream text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]">
            Nos produits.
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-bien-cream/85 leading-relaxed">
            3 gummies naturels et une poudre tout-en-un. Adaptogènes et champignons fonctionnels,
            dosés selon la science — vegan, sans sucre, fabriqués en France.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {NEEDS.map((n) => (
              <Link
                key={n.slug}
                href={`/${lang}/collections/${n.slug}`}
                className="inline-flex items-center rounded-full bg-bien-cream/12 text-bien-cream ring-1 ring-bien-cream/30 px-3.5 py-1.5 text-xs font-semibold hover:bg-bien-cream/25 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grille produits */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-10 sm:mt-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display font-black tracking-tight text-2xl text-black">
            {products.length} produit{products.length > 1 ? "s" : ""}
          </h2>
          <Link href={`/${lang}/diagnostic`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            <Sparkles className="h-4 w-4" /> Trouver ma formule
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
        </div>
      </section>

      {/* CTA diagnostic */}
      <DiagnosticCTA lang={lang} />

      {/* Réassurance (bas de page) */}
      <ReassuranceBand />
    </div>
  );
}
