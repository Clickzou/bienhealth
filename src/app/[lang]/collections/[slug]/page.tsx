import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles, ArrowRight } from "lucide-react";
import { hasLocale, locales } from "../../dictionaries";
import { getProducts } from "@/lib/shopify-products";
import { COLLECTIONS } from "@/lib/shop";
import SiteHeader from "@/components/site-header";
import ProductCard from "@/components/product-card";
import ReassuranceBand from "@/components/reassurance-band";
import DiagnosticCTA from "@/components/diagnostic-cta";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    Object.keys(COLLECTIONS).map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTIONS[slug];
  if (!col) return {};
  return {
    title: `${col.label} · BIEN`,
    description: col.desc,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const col = COLLECTIONS[slug];
  if (!col) notFound();

  const all = await getProducts(24);
  const products = all.filter(col.match);
  // « Découvrez aussi » : les produits qui ne sont pas déjà affichés plus haut.
  const shownHandles = new Set(products.map((p) => p.handle));
  const others = all.filter((p) => !shownHandles.has(p.handle));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero collection */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-10 sm:pt-14">
        <div className="relative hero-gradient rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">{col.eyebrow}</p>
          <h1 className="mt-3 font-display font-black tracking-tighter text-bien-cream text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]">
            {col.label}
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-bien-cream/85 leading-relaxed">{col.desc}</p>
        </div>
      </section>

      {/* Grille produits de la collection */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-10 sm:mt-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-display font-black tracking-tight text-2xl text-black">{col.label}</h2>
            <span className="text-sm text-black/50">{products.length} produit{products.length > 1 ? "s" : ""}</span>
            <Link href={`/${lang}/collections/accessories`} className="text-sm font-semibold text-bien-leaf hover:underline">Tout voir</Link>
          </div>
          <Link href={`/${lang}/diagnostic`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            <Sparkles className="h-4 w-4" /> Trouver ma formule
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
        </div>
      </section>

      {/* Découvrez aussi — les autres produits */}
      {others.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display font-black tracking-tight text-2xl sm:text-3xl text-black">Découvrez aussi</h2>
            <Link href={`/${lang}/collections/accessories`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Toute la gamme <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {others.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
          </div>
        </section>
      )}

      {/* CTA diagnostic */}
      <DiagnosticCTA lang={lang} />

      {/* Réassurance (bas de page) */}
      <ReassuranceBand />
    </div>
  );
}
