import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles, ArrowRight } from "lucide-react";
import { hasLocale, locales } from "../../dictionaries";
import { getProducts } from "@/lib/shopify-products";
import { COLLECTIONS, localizeCollection, sortForCollection, isAccessory } from "@/lib/shop";
import { COLLECTION_SEO, localizeCollectionSeo } from "@/lib/collection-seo";
import { pageMetadata, metaDescription } from "@/lib/seo";
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
  const { lang, slug } = await params;
  const col = COLLECTIONS[slug];
  if (!col) return {};
  const c = localizeCollection(col, lang);
  return pageMetadata({
    lang,
    path: `collections/${slug}`,
    title: `${c.label} | BIEN health`,
    description: metaDescription(c.desc),
  });
}

const T = {
  fr: { product: "produit", products: "produits", seeAll: "Tout voir", findFormula: "Trouver ma formule", alsoDiscover: "Découvrez aussi", fullRange: "Toute la gamme", learnMore: "En savoir plus" },
  en: { product: "product", products: "products", seeAll: "See all", findFormula: "Find my formula", alsoDiscover: "You may also like", fullRange: "The full range", learnMore: "Learn more" },
} as const;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const col = COLLECTIONS[slug];
  if (!col) notFound();
  const seoRaw = COLLECTION_SEO[slug];
  const seo = seoRaw ? localizeCollectionSeo(seoRaw, lang) : undefined;
  const t = T[lang === "en" ? "en" : "fr"];
  const c = localizeCollection(col, lang);

  const all = await getProducts(24);
  const products = sortForCollection(col, all.filter(col.match));
  // « Découvrez aussi » : les produits qui ne sont pas déjà affichés plus haut.
  // Les accessoires en sont exclus, sauf sur leur propre collection : le client
  // ne veut les voir que dans « tous les produits » — le mousseur et le tote bag
  // apparaissaient en bas des pages gummies et poudres.
  const shownHandles = new Set(products.map((p) => p.handle));
  const others = all.filter(
    (p) => !shownHandles.has(p.handle) && (col.slug === "nos-accessoires" || !isAccessory(p)),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero collection */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-10 sm:pt-14">
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">{c.eyebrow}</p>
          <h1 className="mt-3 font-hero text-bien-cream text-[clamp(2.2rem,5.28vw,3.96rem)] leading-[0.95]">
            {c.label}
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-bien-cream/85 leading-relaxed">{c.desc}</p>
        </div>
      </section>

      {/* Grille produits de la collection */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-display tracking-tight text-2xl text-black">{c.label}</h2>
            <span className="text-sm text-black/50">{products.length} {products.length > 1 ? t.products : t.product}</span>
            <Link href={`/${lang}/boutique`} className="text-sm font-semibold text-bien-leaf hover:underline">{t.seeAll}</Link>
          </div>
          <Link href={`/${lang}/diagnostic`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            <Sparkles className="h-4 w-4" /> {t.findFormula}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
        </div>
      </section>

      {/* Découvrez aussi — les autres produits */}
      {others.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display tracking-tight text-2xl sm:text-3xl text-black">{t.alsoDiscover}</h2>
            <Link href={`/${lang}/boutique`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              {t.fullRange} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {others.map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
          </div>
        </section>
      )}

      {/* Contenu éditorial SEO */}
      {seo && (
        <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-16 sm:mt-24">
          <div className="rounded-3xl lg:rounded-[2.5rem] bg-bien-cream/50 ring-1 ring-border p-7 sm:p-12 lg:p-16">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{t.learnMore}</p>
            <div className="mt-4 max-w-3xl space-y-4">
              {seo.intro.map((p, i) => (
                <p key={i} className="text-[15px] sm:text-base text-black/80 leading-relaxed font-medium text-justify hyphens-auto">{p}</p>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-x-12 gap-y-9">
              {seo.blocks.map((b) => (
                <article key={b.h}>
                  <h2 className="font-display tracking-tight text-lg sm:text-xl text-black flex items-start gap-3">
                    <span className="mt-1.5 h-4 w-1 rounded-full bg-bien-gold shrink-0" />
                    {b.h}
                  </h2>
                  <div className="mt-3 pl-4 space-y-3">
                    {b.p.map((p, i) => (
                      <p key={i} className="text-[15px] text-black/70 leading-relaxed text-justify hyphens-auto">{p}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA diagnostic */}
      <DiagnosticCTA lang={lang} />

      {/* Réassurance (bas de page) */}
      <ReassuranceBand lang={lang} />
    </div>
  );
}
