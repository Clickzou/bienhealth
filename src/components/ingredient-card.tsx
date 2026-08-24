"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const T = {
  fr: { more: "Lire plus", close: "Fermer" },
  en: { more: "Read more", close: "Close" },
} as const;

/**
 * Fiche d'un ingrédient.
 *
 * Deux fiches par ligne sur téléphone : le descriptif y est coupé à cinq
 * lignes, sinon les cartes d'une même rangée n'ont plus la même hauteur. Un
 * « Lire plus » ouvre alors le texte entier dans un panneau posé par-dessus la
 * page (demande client). Le bouton n'apparaît que si le texte est réellement
 * tronqué — au-dessus de `sm`, où le descriptif est affiché en entier, il
 * disparaît de lui-même.
 */
export default function IngredientCard({
  img,
  name,
  family,
  hook,
  desc,
  lang,
}: {
  img: string;
  name: string;
  family: string;
  hook: string;
  desc: string;
  lang: string;
}) {
  const t = T[lang === "en" ? "en" : "fr"];
  const descEl = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = descEl.current;
    if (!el) return;
    // Le premier passage de l'observateur fait la mesure initiale : mesurer
    // ici, en direct, déclencherait un rendu en cascade.
    const ro = new ResizeObserver(() => setClamped(el.scrollHeight > el.clientHeight + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // La page ne doit pas défiler derrière le panneau.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <article className="group bg-card rounded-2xl sm:rounded-3xl ring-1 ring-border bien-shadow-sm p-3 sm:p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:ring-bien-leaf/40 transition-all">
        <div className="relative h-20 w-20 sm:h-32 sm:w-32 mb-3 sm:mb-4">
          <Image src={img} alt={name} fill sizes="(max-width:640px) 80px, 128px" className="object-contain group-hover:scale-105 transition-transform duration-500" />
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-bien-sage">{family}</span>
        <h2 className="mt-1 font-display text-base sm:text-xl leading-tight text-black">{name}</h2>
        <p className="mt-1.5 text-xs sm:text-sm font-semibold text-bien-leaf leading-snug">{hook}</p>
        <p ref={descEl} className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-black/70 leading-relaxed line-clamp-5 sm:line-clamp-none">
          {desc}
        </p>
        {clamped && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 text-xs font-semibold text-bien-leaf underline underline-offset-2 hover:text-bien-navy transition-colors"
          >
            {t.more}
          </button>
        )}
      </article>

      {open && (
        // Panneau à la hauteur de son texte, centré : en plein écran il laissait
        // un grand vide sous les fiches courtes (retour client). Le reste de la
        // page reste visible, flouté, tout autour.
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={name}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-md max-h-[85vh] flex-col overflow-y-auto rounded-3xl bg-card p-6 sm:p-8 text-center bien-shadow"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="absolute top-4 right-4 grid place-items-center h-9 w-9 rounded-full bg-card text-black ring-1 ring-border hover:bg-bien-cream transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative mx-auto mt-2 h-24 w-24 sm:h-28 sm:w-28 shrink-0">
              <Image src={img} alt={name} fill sizes="(max-width:640px) 96px, 112px" className="object-contain" />
            </div>
            <span className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-bien-sage">{family}</span>
            <h2 className="mt-1 font-display text-2xl leading-tight text-black">{name}</h2>
            <p className="mt-2 text-sm font-semibold text-bien-leaf">{hook}</p>
            <p className="mt-4 text-[15px] text-black/75 leading-relaxed text-left">{desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
