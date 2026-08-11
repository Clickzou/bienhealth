"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import StarRating from "./star-rating";
import { TRUSTPILOT_RATING } from "@/lib/social-proof";
import { BEST_SELLERS } from "@/lib/shop";

export type CarouselProduct = {
  name: string;
  tagline: string;
  price: string;
  img: string;
  handle: string | null;
  available: boolean;
};

/* `tagline` arrive déjà localisé de la page (benefitFor dans lib/shop.ts) :
   ce composant ne porte plus de copie des bienfaits. */

const T = {
  fr: { prev: "Produits précédents", next: "Produits suivants", bestSeller: "Best-seller", backSoon: "Bientôt de retour", see: "Voir", preorder: "Précommander", alt: (n: string) => `Complément ${n}`, page: "Page" },
  en: { prev: "Previous products", next: "Next products", bestSeller: "Best-seller", backSoon: "Back in stock soon", see: "View", preorder: "Pre-order", alt: (n: string) => `${n} supplement`, page: "Page" },
} as const;

export default function ProductsCarousel({
  products,
  lang,
}: {
  products: CarouselProduct[];
  lang: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const t = T[lang === "en" ? "en" : "fr"];
  // Points de pagination : les flèches sont masquées sous `sm`, rien
  // n'indiquait donc au doigt que la liste continuait (retour client mobile).
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  const goToPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      {/* Flèches */}
      <button
        onClick={() => scroll(-1)}
        aria-label={t.prev}
        className="absolute left-1 sm:-left-4 top-[36%] -translate-y-1/2 z-20 hidden sm:grid place-items-center h-11 w-11 rounded-full bg-card text-black ring-1 ring-border bien-shadow hover:bg-bien-gold transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label={t.next}
        className="absolute right-1 sm:-right-4 top-[36%] -translate-y-1/2 z-20 hidden sm:grid place-items-center h-11 w-11 rounded-full bg-card text-black ring-1 ring-border bien-shadow hover:bg-bien-gold transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={measure}
        className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => {
          const href = p.handle ? `/${lang}/products/${p.handle}` : "#";
          // Même liste de best-sellers que la boutique et les collections
          // (@/lib/shop) : le badge suivait ici la position dans le carrousel,
          // donc pas toujours les mêmes produits d'une page à l'autre. Les
          // produits indisponibles gardent leur propre pastille.
          const showBadge = !p.available || BEST_SELLERS.some((k) => p.name.toUpperCase().includes(k));
          return (
            <article
              key={p.name}
              className="snap-start shrink-0 w-[72%] sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)] group bg-card rounded-3xl ring-1 ring-border hover:ring-bien-leaf/40 hover:-translate-y-1 transition-all bien-shadow-sm overflow-hidden flex flex-col"
            >
              <a href={href} className="relative aspect-square bg-bien-cream overflow-hidden block">
                {showBadge && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-bien-gold text-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {p.available ? t.bestSeller : t.backSoon}
                  </span>
                )}
                <Image src={p.img} alt={t.alt(p.name)} fill loading="lazy" sizes="(max-width:1024px) 72vw, 22vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </a>
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* Note boutique (la même que le header) plutôt que cinq
                    étoiles pleines en dur, qui contredisaient le 4,4/5. */}
                <StarRating value={TRUSTPILOT_RATING} className="h-3.5 w-3.5" />
                <a href={href}><h3 className="mt-2 font-display text-xl text-black hover:text-bien-leaf transition-colors">{p.name}</h3></a>
                <p className="mt-1 text-sm text-black/65 leading-snug">{p.tagline}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-lg text-black">{p.price}</span>
                  <a href={href} className="inline-flex items-center gap-1.5 rounded-full bg-bien-forest text-bien-cream px-3.5 py-2 text-xs font-semibold hover:bg-bien-leaf transition-colors">
                    <ShoppingBag className="h-3.5 w-3.5" /> {p.available ? t.see : t.preorder}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {pages > 1 && (
        <div className="mt-1 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`${t.page} ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              className={`h-2 rounded-full bg-bien-forest transition-all ${i === page ? "w-6" : "w-2 opacity-25 hover:opacity-60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
