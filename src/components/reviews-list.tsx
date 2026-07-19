"use client";

import { useState } from "react";
import { Star, Check, ChevronDown, X } from "lucide-react";

export type Review = {
  name: string;
  date?: string;
  verified?: boolean;
  text: string;
  textEn?: string;
  photo?: string;
};

const INITIAL = 6;

function Stars({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <span className="inline-flex text-bien-star">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-bien-star`} />)}
    </span>
  );
}

function Header({ r, verifiedLabel }: { r: Review; verifiedLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-display text-black">{r.name}</span>
      {r.verified && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-bien-leaf shrink-0">
          <Check className="h-3.5 w-3.5" /> {verifiedLabel}
        </span>
      )}
    </div>
  );
}

export default function ReviewsList({ reviews, lang = "fr" }: { reviews: Review[]; lang?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Review | null>(null);
  const en = lang === "en";
  const t = en
    ? { verified: "Verified", withPhoto: "Review with photo", seeLess: "See less", seeAll: (n: number) => `See all ${n} reviews`, close: "Close", reviewOf: (n: string) => `Review by ${n}`, photoOf: (n: string) => `Photo from ${n}'s review` }
    : { verified: "Vérifié", withPhoto: "Avis avec photo", seeLess: "Voir moins", seeAll: (n: number) => `Voir les ${n} avis`, close: "Fermer", reviewOf: (n: string) => `Avis de ${n}`, photoOf: (n: string) => `Photo de l'avis de ${n}` };
  const body = (r: Review) => (en && r.textEn ? r.textEn : r.text);

  const featured = reviews.filter((r) => r.photo);
  const rest = reviews.filter((r) => !r.photo);
  const shownRest = expanded ? rest : rest.slice(0, INITIAL);
  const hasMore = rest.length > INITIAL;

  return (
    <div>
      {/* Avis mis en avant (avec photo) — carte ~demi-page : texte à gauche, photo à droite qui remplit son cadre */}
      {featured.map((r) => (
        <button
          key={r.name + r.date}
          type="button"
          onClick={() => setActive(r)}
          className="group text-left mb-6 w-full lg:max-w-[42rem] grid grid-cols-[1fr_9rem] sm:grid-cols-[1fr_12rem] overflow-hidden bg-card rounded-3xl ring-1 ring-border bien-shadow-sm hover:bien-shadow transition-all"
        >
          <div className="p-6 sm:p-7 flex flex-col">
            <Header r={r} verifiedLabel={t.verified} />
            <div className="mt-1.5 flex items-center gap-2">
              <Stars className="h-4 w-4" />
              <span className="text-xs text-black/45">{r.date}</span>
            </div>
            <p className="mt-3 text-sm sm:text-[15px] text-black/80 leading-relaxed whitespace-pre-line">{body(r)}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-bien-leaf">
              <Star className="h-3.5 w-3.5 fill-bien-leaf" /> {t.withPhoto}
            </span>
          </div>
          <div className="relative overflow-hidden">
            {/* object-cover : la photo remplit sa colonne, aucun fond visible */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.photo}
              alt={t.photoOf(r.name)}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </button>
      ))}

      {/* Autres avis — grille masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6">
        {shownRest.map((r) => (
          <button
            key={r.name + r.date}
            type="button"
            onClick={() => setActive(r)}
            className="w-full text-left mb-5 sm:mb-6 break-inside-avoid bg-card rounded-2xl ring-1 ring-border bien-shadow-sm p-5 hover:ring-bien-leaf/50 hover:bien-shadow transition-all cursor-pointer"
          >
            <Header r={r} verifiedLabel={t.verified} />
            <div className="mt-1.5 flex items-center gap-2">
              <Stars />
              <span className="text-xs text-black/45">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-black/80 leading-relaxed whitespace-pre-line line-clamp-5">{body(r)}</p>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-7 py-3.5 text-sm font-semibold hover:bg-bien-leaf transition-colors"
          >
            {expanded ? t.seeLess : t.seeAll(reviews.length)}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      {/* Modale d'avis complet */}
      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={t.reviewOf(active.name)}>
          <button aria-label={t.close} onClick={() => setActive(null)} className="absolute inset-0 bg-bien-forest/50 backdrop-blur-sm" />

          <div className={`relative bg-white rounded-[1.5rem] ring-1 ring-border bien-shadow overflow-hidden animate-[bien-fade-up_0.3s_ease] max-h-[92vh] w-full ${active.photo ? "max-w-3xl grid sm:grid-cols-2" : "max-w-lg"}`}>
            <button onClick={() => setActive(null)} aria-label={t.close} className="absolute top-3 right-3 z-10 grid place-items-center h-9 w-9 rounded-full bg-white/90 text-black ring-1 ring-border hover:bg-bien-cream transition-colors">
              <X className="h-5 w-5" />
            </button>

            {active.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.photo} alt={t.photoOf(active.name)} className="w-full h-56 sm:h-full object-cover" />
            )}

            <div className="p-6 sm:p-8 overflow-y-auto">
              <Header r={active} verifiedLabel={t.verified} />
              <div className="mt-2 flex items-center gap-2">
                <Stars className="h-4 w-4" />
                <span className="text-xs text-black/45">{active.date}</span>
              </div>
              <p className="mt-4 text-[15px] text-black/85 leading-relaxed whitespace-pre-line">{body(active)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
