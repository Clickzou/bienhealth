"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Une mention toutes les 4 s : assez lent pour être lu, assez court pour que
 *  les trois passent avant que la page ne soit scrollée. */
const AUTOPLAY_MS = 4000;

/**
 * Bandeau de réassurance de la fiche produit (livraison, paiement, origine).
 *
 * Un seul balisage, deux mises en page :
 *  - téléphone : carrousel automatique, une mention pleine largeur à la fois,
 *    encadrée par deux flèches posées à côté (demande client) ;
 *  - sm et au-delà : la grille de trois colonnes d'origine, les flèches
 *    disparaissent et le défilement automatique se coupe de lui-même puisque
 *    la piste ne déborde plus.
 */
export default function ReassuranceCarousel({
  children,
  prevLabel,
  nextLabel,
  className = "",
}: {
  children: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
  className?: string;
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

  const go = useCallback(
    (dir: 1 | -1) => {
      const el = track.current;
      if (!el) return;
      // Boucle : après la dernière mention on revient à la première, sinon la
      // flèche paraît morte au bout de la piste.
      const next = (page + dir + pages) % pages;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [page, pages],
  );

  // Défilement automatique. `page` en dépendance : chaque avancée — auto ou au
  // doigt — relance le compte à rebours, donc une flèche pressée laisse bien
  // 4 s de lecture avant la suivante.
  useEffect(() => {
    if (pages < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [go, page, pages]);

  const arrow =
    "sm:hidden shrink-0 grid place-items-center h-8 w-8 rounded-full bg-card text-black/70 ring-1 ring-border bien-shadow-sm hover:ring-bien-gold/60 transition";

  return (
    <div className={`flex items-center gap-2 sm:block ${className}`}>
      <button type="button" onClick={() => go(-1)} aria-label={prevLabel} className={arrow}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={track}
        onScroll={measure}
        className="flex-1 min-w-0 flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible"
      >
        {children}
      </div>

      <button type="button" onClick={() => go(1)} aria-label={nextLabel} className={arrow}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
