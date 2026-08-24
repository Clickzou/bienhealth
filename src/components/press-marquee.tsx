"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Bandeau de logos presse : défilement continu + flèches de navigation
 * manuelle (demande client du 24/08/2026).
 *
 * Le défilement n'est plus une animation CSS sur `transform` mais un
 * `scrollLeft` piloté à la frame : c'est la seule façon d'avoir les deux — une
 * piste animée *et* des flèches qui la déplacent, puisqu'un `scrollBy` n'a
 * aucun effet sur un élément translaté par keyframes.
 *
 * La piste (`children`) contient la liste des logos deux fois : dès que le
 * défilement dépasse la première copie on retranche sa largeur, la seconde
 * occupe alors exactement la même place et la boucle est invisible.
 */

/** Vitesse de croisière, px/s — calée sur l'ancienne animation (70 s la copie). */
const SPEED = 41;
/** Pause après une action manuelle, le temps que le défilement doux se termine. */
const MANUAL_PAUSE_MS = 1200;
/** Pause après un geste tactile — bornée, pour que le bandeau reparte seul. */
const TOUCH_PAUSE_MS = 2500;

/** Vrai pointeur (souris/trackpad) : un écran tactile répond `false`. */
function canHover(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
}

export default function PressMarquee({ children }: { children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // Le défilement ignore volontairement `prefers-reduced-motion` (arbitrage
    // client du 24/08/2026) : sur les téléphones réglés sur « Réduire les
    // animations » — un réglage qu'énormément de gens ont sans le savoir, le
    // mode économie d'énergie d'Android l'active — le bandeau restait figé et
    // la marque paraissait avoir un site cassé. Le mouvement est lent (41 px/s)
    // et sans clignotement, donc à faible risque vestibulaire.

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = now - last;
      last = now;
      // `dt` borné : après un changement d'onglet, le premier delta vaut
      // plusieurs secondes et ferait sauter le bandeau.
      if (!hovered.current && now >= pausedUntil.current) {
        el.scrollLeft += (SPEED * Math.min(dt, 100)) / 1000;
      }
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    pausedUntil.current = performance.now() + MANUAL_PAUSE_MS;
    // Vers la gauche depuis le tout début : on repart de la fin de la première
    // copie, sinon le bouton paraît mort au chargement.
    if (dir === -1 && el.scrollLeft < 8) el.scrollLeft = el.scrollWidth / 2;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 480), behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <div
        ref={scroller}
        /* La pause au survol est réservée aux appareils à vrai pointeur : sur
           un écran tactile, un simple appui émule `mouseenter` sans jamais
           émettre le `mouseleave` correspondant — le bandeau restait figé pour
           le reste de la visite. Un doigt sur la piste met en pause le temps du
           geste, puis le défilement repart tout seul. */
        onMouseEnter={() => { if (canHover()) hovered.current = true; }}
        onMouseLeave={() => (hovered.current = false)}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") pausedUntil.current = performance.now() + TOUCH_PAUSE_MS; }}
        onTouchMove={() => (pausedUntil.current = performance.now() + TOUCH_PAUSE_MS)}
        /* Seul le focus clavier met en pause : après un appui sur un logo,
           `:focus` reste posé sur le lien et gelait le bandeau. */
        onFocusCapture={(e) => { if (e.target instanceof Element && e.target.matches(":focus-visible")) hovered.current = true; }}
        onBlurCapture={() => (hovered.current = false)}
        className="bien-marquee [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        {children}
      </div>

      {/* Flèches : hors du conteneur scrollable, sinon elles défileraient avec
          les logos. `bg-white/85` pour rester lisibles par-dessus un logo. */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => nudge(dir)}
          aria-label={dir === -1 ? "Logos précédents" : "Logos suivants"}
          className={`absolute top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur-sm ring-1 ring-border text-black hover:bg-white transition-colors ${
            dir === -1 ? "left-0" : "right-0"
          }`}
        >
          {dir === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}
