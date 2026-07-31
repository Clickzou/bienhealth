import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Plus, ArrowRight } from "lucide-react";
import { hasLocale } from "../dictionaries";
import { getProducts, formatPrice } from "@/lib/shopify-products";
import SiteHeader from "@/components/site-header";
import CartView from "@/components/cart-view";

// Page privée : titre localisé et jamais indexée.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Your cart — BIEN" : "Votre panier — BIEN",
    description: lang === "en" ? "Your BIEN cart." : "Votre panier BIEN.",
    alternates: { canonical: `/${lang}/cart` },
    robots: { index: false, follow: false },
  };
}

/**
 * Page Panier. Le panier / checkout est géré par Shopify (architecture headless) :
 * tant que le Storefront cart n'est pas branché, on affiche l'état vide + des
 * suggestions produits, comme sur bien.health/cart. Les actions d'ajout renvoient
 * vers la fiche produit (où se fait l'ajout / le checkout Shopify).
 */
export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const EXCLUDE = new Set(["mousseur-a-lait", "bien-totebag"]);
  const suggestions = (await getProducts(12)).filter((p) => !EXCLUDE.has(p.handle)).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <CartView lang={lang} />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mt-16">
            <h2 className="text-center text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
              Vous aimerez aussi
            </h2>
            <ul className="mt-6 divide-y divide-border rounded-3xl ring-1 ring-border bg-card overflow-hidden">
              {suggestions.map((p) => {
                const href = `/${lang}/products/${p.handle}`;
                return (
                  <li key={p.id} className="flex items-center gap-4 p-4 hover:bg-bien-cream/40 transition-colors">
                    <Link href={href} className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-bien-cream ring-1 ring-border">
                      <Image
                        src={p.featuredImage?.url ?? "/brand/product-mushglow.jpg"}
                        alt={p.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={href}>
                        <h3 className="font-display text-black leading-tight hover:text-bien-leaf transition-colors">{p.title}</h3>
                      </Link>
                      <p className="mt-0.5 text-sm text-black/60">{p.tags[0] ?? "Complément naturel"}</p>
                      <p className="mt-1 font-semibold text-black">{formatPrice(p.price)}</p>
                    </div>
                    <Link
                      href={href}
                      aria-label={`Ajouter ${p.title}`}
                      className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-bien-forest text-bien-cream hover:bg-bien-leaf transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href={`/${lang}/boutique`}
                className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm"
              >
                Continuer mes achats <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
