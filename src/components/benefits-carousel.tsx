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

  /** Positions de chaque carte dans la piste, gouttières comprises. Se fier à
   *  `clientWidth` comme pas de défilement était faux : le `gap-5` s'ajoute à
   *  chaque carte, et l'écart cumulé finissait par couper la carte affichée
   *  (bug signalé sur téléphone). */
  const offsets = () => {
    const el = track.current;
    if (!el) return [];
    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return [];
    const origin = items[0].offsetLeft;
    return items.map((it) => it.offsetLeft - origin);
  };

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const lefts = offsets();
    // Piste non débordante = pile verticale (sm) ou grille (lg) : une seule vue.
    if (el.scrollWidth <= el.clientWidth + 4) return setPage(0);
    let closest = 0;
    lefts.forEach((left, i) => {
      if (Math.abs(left - el.scrollLeft) < Math.abs(lefts[closest] - el.scrollLeft)) closest = i;
    });
    setPage(closest);
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
    const lefts = offsets();
    if (!el || !lefts.length) return;
    // Boucle : après la dernière carte on revient à la première, sinon la
    // flèche paraît morte au bout de la piste.
    const next = (page + dir + lefts.length) % lefts.length;
    el.scrollTo({ left: lefts[next], behavior: "smooth" });
  };

  const arrow =
    "sm:hidden shrink-0 grid place-items-center h-9 w-9 rounded-full bg-card text-black ring-1 ring-border bien-shadow-sm hover:ring-bien-gold/60 transition";

  return (
    /* `min-w-0` : la piste vit dans une grille, et un élément de grille refuse
       par défaut de descendre sous la largeur intrinsèque de son contenu — les
       quatre cartes mises bout à bout. Le bloc débordait donc de l'écran et la
       carte affichée était coupée à droite (signalé sur téléphone). */
    <div className="min-w-0 flex items-center gap-2 sm:block lg:contents">
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
