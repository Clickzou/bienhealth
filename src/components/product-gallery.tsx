"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

type GalleryImage = { url: string; altText: string | null };

/**
 * Galerie produit interactive :
 * - image principale CARRÉE (les visuels produits sont carrés) ;
 * - miniatures VERTICALES à gauche (4 visibles), pagination manuelle (flèches haut/bas) ;
 * - la miniature active suit la photo du haut (défilement auto de l'image principale, pause au survol).
 */
export default function ProductGallery({
  images,
  title,
  autoPlayMs = 4000,
  bestSeller = false,
}: {
  images: GalleryImage[];
  title: string;
  autoPlayMs?: number;
  bestSeller?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // autoPlayMs <= 0 → pas de défilement automatique (navigation aux flèches).
    if (count <= 1 || paused || autoPlayMs <= 0) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), autoPlayMs);
    return () => window.clearInterval(id);
  }, [count, paused, autoPlayMs]);

  useEffect(() => {
    // Recentre la miniature active DANS sa bande uniquement (scroll du conteneur,
    // jamais de la fenêtre) — sinon scrollIntoView fait remonter toute la page.
    const container = thumbsRef.current;
    const el = container?.children[active] as HTMLElement | undefined;
    if (!container || !el) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const delta = eRect.top - cRect.top - (container.clientHeight - el.clientHeight) / 2;
    container.scrollBy({ top: delta, behavior: "smooth" });
  }, [active]);

  if (count === 0) return null;
  const go = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count);
  const pageThumbs = (dir: 1 | -1) => {
    const el = thumbsRef.current;
    if (el) el.scrollBy({ top: dir * el.clientHeight * 0.8, behavior: "smooth" });
  };

  return (
    <div className="flex items-start gap-3 sm:gap-4" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Miniatures verticales à gauche */}
      {count > 1 && (
        <div className="flex flex-col gap-2 w-16 sm:w-20 shrink-0">
          {count > 4 && (
            <button onClick={() => pageThumbs(-1)} aria-label="Miniatures précédentes" className="grid place-items-center h-7 rounded-lg bg-card text-black ring-1 ring-border hover:bg-bien-cream transition">
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
          <div ref={thumbsRef} className="max-h-[21.5rem] flex flex-col gap-2 overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => setActive(i)}
                aria-label={`Voir l'image ${i + 1}`}
                className={`relative shrink-0 aspect-square rounded-xl overflow-hidden bg-bien-cream ring-2 transition ${i === active ? "ring-bien-gold" : "ring-border hover:ring-bien-leaf/50"}`}
              >
                <Image src={img.url} alt={img.altText ?? title} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          {count > 4 && (
            <button onClick={() => pageThumbs(1)} aria-label="Miniatures suivantes" className="grid place-items-center h-7 rounded-lg bg-card text-black ring-1 ring-border hover:bg-bien-cream transition">
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Image principale carrée */}
      <div className="group relative flex-1 aspect-square rounded-3xl overflow-hidden bg-bien-cream ring-1 ring-border">
        {/* Bandeau diagonal Best-seller (haut droite) — uniquement pour le best-seller */}
        {bestSeller && (
          <span className="pointer-events-none absolute top-5 -right-11 z-20 rotate-45 bg-bien-gold text-black text-[11px] font-bold uppercase tracking-wider px-12 py-1 bien-shadow-sm">
            Best seller
          </span>
        )}
        {images.map((img, i) => (
          <Image
            key={img.url + i}
            src={img.url}
            alt={img.altText ?? title}
            fill
            priority={i === 0}
            sizes="(max-width:1024px) 100vw, 45vw"
            className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {count > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Image précédente" className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-card/85 text-black ring-1 ring-border bien-shadow opacity-0 group-hover:opacity-100 hover:bg-bien-gold transition">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} aria-label="Image suivante" className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-card/85 text-black ring-1 ring-border bien-shadow opacity-0 group-hover:opacity-100 hover:bg-bien-gold transition">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Voir l'image ${i + 1}`} className={`h-2 rounded-full transition-all ${i === active ? "w-5 bg-bien-forest" : "w-2 bg-bien-forest/30 hover:bg-bien-forest/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
