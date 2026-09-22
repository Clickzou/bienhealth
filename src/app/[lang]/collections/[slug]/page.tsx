import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { hasLocale, locales } from "../../dictionaries";
import { getProducts } from "@/lib/shopify-products";
import { COLLECTIONS, localizeCollection, sortForCollection, isAccessory } from "@/lib/shop";
import JsonLd from "@/components/json-ld";
import { COLLECTION_SEO, localizeCollectionSeo } from "@/lib/collection-seo";
import { getArticle, localizeArticle } from "@/lib/blog";
import { SITE_URL, pageMetadata, metaDescription } from "@/lib/seo";
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
    title: `${col.seoTitle ?? c.label} | BIEN health`,
    description: metaDescription((lang === "en" ? col.en.metaDescription : col.metaDescription) ?? c.desc),
  });
}

const T = {
  fr: { product: "produit", products: "produits", seeAll: "Tout voir", findFormula: "Trouver ma formule", alsoDiscover: "Découvrez aussi", fullRange: "Toute la gamme", learnMore: "En savoir plus", faq: "Questions fréquentes", read: "À lire sur le Journal" },
  en: { product: "product", products: "products", seeAll: "See all", findFormula: "Find my formula", alsoDiscover: "You may also like", fullRange: "The full range", learnMore: "Learn more", faq: "Frequently asked questions", read: "Read on the Journal" },
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
  const related = (seoRaw?.related ?? [])
    .map((s) => getArticle(s))
    .filter((a) => a !== undefined)
    .map((a) => localizeArticle(a, lang));

  const all = await getProducts(24, lang);
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
      {/* ItemList : dit à Google que la page est une liste de produits ordonnée,
          et lesquels. Sans ça, une page collection reste un texte parmi d'autres. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.label,
          description: c.desc,
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/${lang}/products/${p.handle}`,
            name: p.title,
          })),
        }}
      />
      {seo?.faq && seo.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: seo.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
      <SiteHeader lang={lang} />

      {/* Hero collection */}
      {/* Bandeau aligné sur celui de la boutique : bas, pour que la grille
          produits apparaisse presque tout de suite (demande client du
          19/08/2026 — seule la page d'accueil garde un grand hero). */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-8 sm:pt-10">
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow px-6 sm:px-10 lg:px-12 py-7 sm:py-9">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">{c.eyebrow}</p>
          <h1 className="mt-2 font-hero text-bien-cream text-[clamp(1.9rem,4vw,2.9rem)] leading-[1]">
            {c.label}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-bien-cream/85 leading-relaxed">{c.desc}</p>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

            {/* Tableau comparatif : les doses et les usages en clair, lisibles
                d'un coup d'œil par un visiteur comme par un moteur génératif. */}
            {seo.table && (
              <div className="mt-12 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm border-separate border-spacing-0 rounded-2xl ring-1 ring-border bg-white overflow-hidden">
                  <caption className="caption-top text-left pb-3 font-display text-lg text-black">{seo.table.caption}</caption>
                  <thead>
                    <tr>
                      {seo.table.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-3 bg-bien-forest text-bien-cream font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {seo.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th key={i} scope="row" className="px-4 py-3 border-t border-border font-display text-black align-top">{cell}</th>
                          ) : (
                            <td key={i} className="px-4 py-3 border-t border-border text-black/75 align-top leading-relaxed">{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {seo.table.note && <p className="mt-3 text-sm text-black/60">{seo.table.note}</p>}
              </div>
            )}

            {seo.faq && seo.faq.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display tracking-tight text-xl sm:text-2xl text-black">{t.faq}</h2>
                <div className="mt-4 space-y-3 max-w-3xl">
                  {seo.faq.map((f) => (
                    <details key={f.q} className="group bg-white rounded-2xl ring-1 ring-border px-5">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4">
                        <h3 className="font-display text-black">{f.q}</h3>
                        <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="pb-5 -mt-0.5 text-sm text-black/75 leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display tracking-tight text-xl sm:text-2xl text-black">{t.read}</h2>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/${lang}/blog/${a.slug}`} className="inline-flex items-start gap-2 text-[15px] text-black/80 hover:text-bien-leaf">
                        <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-bien-leaf" />
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
