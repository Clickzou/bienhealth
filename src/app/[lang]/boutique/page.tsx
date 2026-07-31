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
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "boutique",
    title: lang === "en" ? "Shop — Our natural supplements · BIEN" : "Boutique — Nos compléments naturels · BIEN",
    description: lang === "en" ? "Discover the BIEN range: 3 gummies (CALM, FOCUS, POWER) and the MUSHGLOW powder. Adaptogens and functional mushrooms, science-based dosages, made in France." : "Découvrez la gamme BIEN : 3 gummies (CALM, FOCUS, POWER) et la poudre MUSHGLOW. Adaptogènes et champignons fonctionnels, dosés selon la science, fabriqués en France.",
  });
}

const T = {
  fr: {
    eyebrow: "La gamme BIEN", h1: "Nos produits.",
    intro: "3 gummies naturels et une poudre tout-en-un. Adaptogènes et champignons fonctionnels, dosés selon la science — vegan, sans sucre, fabriqués en France.",
    needs: [{ label: "Sommeil & Sérénité", slug: "serenite" }, { label: "Concentration", slug: "concentration" }, { label: "Énergie", slug: "performance-et-vitalite" }, { label: "Beauté & Équilibre", slug: "beaute-et-bien-etre" }],
    product: "produit", products: "produits", findFormula: "Trouver ma formule",
  },
  en: {
    eyebrow: "The BIEN range", h1: "Our products.",
    intro: "3 natural gummies and one all-in-one powder. Adaptogens and functional mushrooms, dosed according to science — vegan, sugar-free, made in France.",
    needs: [{ label: "Sleep & Calm", slug: "serenite" }, { label: "Focus", slug: "concentration" }, { label: "Energy", slug: "performance-et-vitalite" }, { label: "Beauty & Balance", slug: "beaute-et-bien-etre" }],
    product: "product", products: "products", findFormula: "Find my formula",
  },
} as const;

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];

  // Landing boutique : toute la gamme sauf les accessoires.
  const products = (await getProducts(24)).filter((p) => typeOf(p) !== "accessoires");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-10 sm:pt-14">
        {/* Bandeau volontairement bas : la grille produits doit apparaître
            presque tout de suite (le bloc occupait tout l'écran d'accueil). */}
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow px-6 sm:px-10 lg:px-12 py-7 sm:py-9">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">{t.eyebrow}</p>
          <h1 className="mt-2 font-hero text-bien-cream text-[clamp(1.9rem,4vw,2.9rem)] leading-[1]">
            {t.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-bien-cream/85 leading-relaxed">
            {t.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {t.needs.map((n) => (
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
      <section className="px-4 sm:px-6 lg:px-[100px] mt-6 sm:mt-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-display tracking-tight text-2xl text-black">
            {products.length} {products.length > 1 ? t.products : t.product}
          </h2>
          <Link href={`/${lang}/diagnostic`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            <Sparkles className="h-4 w-4" /> {t.findFormula}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
        </div>
      </section>

      {/* CTA diagnostic */}
      <DiagnosticCTA lang={lang} />

      {/* Réassurance (bas de page) */}
      <ReassuranceBand lang={lang} />
    </div>
  );
}
