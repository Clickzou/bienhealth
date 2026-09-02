import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify-products";
import { benefitFor, BEST_SELLERS } from "@/lib/shop";
import StarRating from "./star-rating";
import { SHOP_RATING } from "@/lib/social-proof";
import { splitProductTitle } from "@/lib/product-title";

const T = {
  fr: { soldOut: "Épuisé", preorder: "Pré-commande", onlyLeft: (n: number) => `Plus que ${n}`, fallbackTag: "Complément naturel", see: "Voir", preorderCta: "Précommander", bestSeller: "Best-seller" },
  en: { soldOut: "Sold out", preorder: "Pre-order", onlyLeft: (n: number) => `Only ${n} left`, fallbackTag: "Natural supplement", see: "View", preorderCta: "Pre-order", bestSeller: "Best-seller" },
} as const;

/**
 * Carte produit réutilisée par la boutique et les pages « collections ».
 *
 * Deux cartes par ligne dès le téléphone (demande client, calée sur la
 * concurrence) : tout ce qui suit la photo est donc resserré sous `sm` — une
 * carte pleine largeur laissait voir un seul produit à la fois.
 */
export default function ProductCard({ p, lang }: { p: ShopifyProduct; lang: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const href = `/${lang}/products/${p.handle}`;
  // Le badge « Best-seller » n'existait que sur le carrousel de l'accueil : il
  // manquait sur la page où l'on voit tous les produits (demande client).
  const isBestSeller = p.available && BEST_SELLERS.some((k) => p.title.toUpperCase().includes(k));
  const { main: titleMain, sub: titleSub } = splitProductTitle(p.title);
  // Prix barré : Shopify porte un « prix comparé » sur les packs, remisés par
  // rapport à la somme des unités. Il n'apparaissait que sur la fiche produit,
  // si bien que la grille des packs affichait la remise sans la montrer
  // (demande client). Ignoré quand il n'est pas supérieur au prix de vente.
  const compareAt =
    p.compareAtPrice && Number(p.compareAtPrice.amount) > Number(p.price.amount) ? p.compareAtPrice : null;
  return (
    <article className="group bg-card rounded-2xl sm:rounded-3xl ring-1 ring-border hover:ring-bien-leaf/40 hover:-translate-y-1 transition-all bien-shadow-sm overflow-hidden flex flex-col">
      <Link href={href} className="relative aspect-square bg-bien-cream overflow-hidden block">
        {isBestSeller && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 inline-flex items-center rounded-full bg-bien-gold text-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            {t.bestSeller}
          </span>
        )}
        {!p.available ? (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 inline-flex items-center rounded-full bg-black text-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            {t.soldOut}
          </span>
        ) : p.currentlyNotInStock ? (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 inline-flex items-center rounded-full bg-bien-gold text-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            {t.preorder}
          </span>
        ) : p.quantityAvailable != null && p.quantityAvailable > 0 && p.quantityAvailable <= 10 ? (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 inline-flex items-center rounded-full bg-red-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
            {t.onlyLeft(p.quantityAvailable)}
          </span>
        ) : null}
        <Image
          src={p.featuredImage?.url ?? "/mushglow.jpg"}
          alt={p.title}
          fill
          loading="lazy"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 22vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {/* Même note que le header (4,4/5) : cinq étoiles pleines en dur
            contredisaient le chiffre affiché partout ailleurs. */}
        <StarRating value={SHOP_RATING} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {/* Le descriptif qui suit le tiret (« MUSHGLOW - Supermix 6-en-1 »)
            reste sur la ligne du nom, à sa droite, mais à la moitié de son
            corps (demande client) : au même corps, il faisait passer le titre
            sur deux lignes et la carte MUSHGLOW était plus haute que ses
            voisines. */}
        <Link href={href}>
          <h3 className="mt-1.5 sm:mt-2 font-display text-base sm:text-xl leading-tight text-black hover:text-bien-leaf transition-colors">
            {titleMain}
            {titleSub && <span className="ml-1.5 text-[0.5em] leading-tight font-normal text-black/60">{titleSub}</span>}
          </h3>
        </Link>
        <p className="mt-1 text-xs sm:text-sm text-black/65 leading-snug flex-1 line-clamp-3 sm:line-clamp-none">{benefitFor(p.title, p.tags[0] ?? t.fallbackTag, lang)}</p>
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
          <span className="min-w-0 flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-display text-base sm:text-lg text-black">{formatPrice(p.price)}</span>
            {compareAt && (
              <span className="text-xs sm:text-sm text-black/45 line-through">{formatPrice(compareAt)}</span>
            )}
          </span>
          <Link href={href} className="shrink-0 inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-bien-forest text-bien-cream px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold hover:bg-bien-leaf transition-colors">
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {p.available ? t.see : t.preorderCta}
          </Link>
        </div>
      </div>
    </article>
  );
}
