import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify-products";
import { benefitFor } from "@/lib/shop";

/** Carte produit réutilisée par la boutique et les pages « collections ». */
export default function ProductCard({ p, lang }: { p: ShopifyProduct; lang: string }) {
  const href = `/${lang}/products/${p.handle}`;
  return (
    <article className="group bg-card rounded-3xl ring-1 ring-border hover:ring-bien-leaf/40 hover:-translate-y-1 transition-all bien-shadow-sm overflow-hidden flex flex-col">
      <Link href={href} className="relative aspect-square bg-bien-cream overflow-hidden block">
        {!p.available ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-black text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            Épuisé
          </span>
        ) : p.currentlyNotInStock ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-bien-gold text-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            Pré-commande
          </span>
        ) : p.quantityAvailable != null && p.quantityAvailable > 0 && p.quantityAvailable <= 10 ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-red-500 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            Plus que {p.quantityAvailable}
          </span>
        ) : null}
        <Image
          src={p.featuredImage?.url ?? "/brand/product-mushglow.jpg"}
          alt={`Complément ${p.title}`}
          fill
          loading="lazy"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 22vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-bien-gold text-bien-gold" />)}</div>
        <Link href={href}><h3 className="mt-2 font-display font-black text-xl text-black hover:text-bien-leaf transition-colors">{p.title}</h3></Link>
        <p className="mt-1 text-sm text-black/65 leading-snug flex-1">{benefitFor(p.title, p.tags[0] ?? "Complément naturel")}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display font-black text-lg text-black">{formatPrice(p.price)}</span>
          <Link href={href} className="inline-flex items-center gap-1.5 rounded-full bg-bien-forest text-bien-cream px-3.5 py-2 text-xs font-semibold hover:bg-bien-leaf transition-colors">
            <ShoppingBag className="h-3.5 w-3.5" /> {p.available ? "Voir" : "Précommander"}
          </Link>
        </div>
      </div>
    </article>
  );
}
