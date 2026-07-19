"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from "lucide-react";

export type CarouselProduct = {
  name: string;
  tagline: string;
  price: string;
  img: string;
  handle: string | null;
  available: boolean;
};

/** Bienfaits courts par produit (repli sur le tagline Shopify si inconnu). */
const BENEFITS: Record<string, string> = {
  CALM: "Sérénité & sommeil — apaise le stress et favorise un sommeil réparateur.",
  FOCUS: "Concentration & mémoire — clarté mentale et focus durable.",
  POWER: "Énergie & performance — tonus physique sans coup de barre.",
  MUSHGLOW: "Beauté & éclat — peau, cheveux et vitalité, 6-en-1.",
};

function benefitFor(name: string, fallback: string): string {
  const key = Object.keys(BENEFITS).find((k) => name.toUpperCase().includes(k));
  return key ? BENEFITS[key] : fallback;
}

export default function ProductsCarousel({
  products,
  lang,
}: {
  products: CarouselProduct[];
  lang: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      {/* Flèches */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Produits précédents"
        className="absolute left-1 sm:-left-4 top-[36%] -translate-y-1/2 z-20 hidden sm:grid place-items-center h-11 w-11 rounded-full bg-card text-black ring-1 ring-border bien-shadow hover:bg-bien-gold transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Produits suivants"
        className="absolute right-1 sm:-right-4 top-[36%] -translate-y-1/2 z-20 hidden sm:grid place-items-center h-11 w-11 rounded-full bg-card text-black ring-1 ring-border bien-shadow hover:bg-bien-gold transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => {
          const href = p.handle ? `/${lang}/products/${p.handle}` : "#";
          return (
            <article
              key={p.name}
              className="snap-start shrink-0 w-[72%] sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)] group bg-card rounded-3xl ring-1 ring-border hover:ring-bien-leaf/40 hover:-translate-y-1 transition-all bien-shadow-sm overflow-hidden flex flex-col"
            >
              <a href={href} className="relative aspect-square bg-bien-cream overflow-hidden block">
                <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-bien-gold text-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {p.available ? "Best-seller" : "Bientôt de retour"}
                </span>
                <Image src={p.img} alt={`Complément ${p.name}`} fill loading="lazy" sizes="(max-width:1024px) 72vw, 22vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </a>
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-bien-star text-bien-star" />)}</div>
                <a href={href}><h3 className="mt-2 font-display text-xl text-black hover:text-bien-leaf transition-colors">{p.name}</h3></a>
                <p className="mt-1 text-sm text-black/65 leading-snug">{benefitFor(p.name, p.tagline)}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-lg text-black">{p.price}</span>
                  <a href={href} className="inline-flex items-center gap-1.5 rounded-full bg-bien-forest text-bien-cream px-3.5 py-2 text-xs font-semibold hover:bg-bien-leaf transition-colors">
                    <ShoppingBag className="h-3.5 w-3.5" /> {p.available ? "Voir" : "Précommander"}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
