"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Piste des quatre cartes de bénéfices.
 *
 * Trois mises en page pour un seul balisage :
 *  - téléphone : carrousel, une carte pleine largeur à la fois, encadrée par
 *    deux flèches posées À CÔTÉ de la carte et non par-dessus (demande client) ;
 *  - tablette  : la pile verticale d'origine ;
 *  - desktop   : `lg:contents` efface la piste ET son conteneur, les cartes
 *    deviennent enfants directs de la grille et reprennent leur place de part
 *    et d'autre de la photo.
 */
export default function BenefitsCarousel({
  children,
  prevLabel,
  nextLabel,
}: {
  children: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // Boucle : après la dernière carte on revient à la première, sinon la
    // flèche paraît morte au bout de la piste.
    const next = (page + dir + pages) % pages;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const arrow =
    "sm:hidden shrink-0 grid place-items-center h-9 w-9 rounded-full bg-card text-black ring-1 ring-border bien-shadow-sm hover:ring-bien-gold/60 transition";

  return (
    <div className="flex items-center gap-2 sm:block lg:contents">
      <button type="button" onClick={() => go(-1)} aria-label={prevLabel} className={arrow}>
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={track}
        onScroll={measure}
        className="flex-1 min-w-0 flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-col sm:items-center sm:gap-y-16 sm:overflow-visible lg:contents"
      >
        {children}
      </div>

      <button type="button" onClick={() => go(1)} aria-label={nextLabel} className={arrow}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
