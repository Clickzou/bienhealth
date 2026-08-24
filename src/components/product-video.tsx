"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/** L'API plein écran d'iPhone, absente du typage standard : Safari mobile
 *  refuse `requestFullscreen()` sur une vidéo mais accepte celle-ci, qui ouvre
 *  le lecteur natif — avec son, plein écran et barre de progression. */
type Fullscreenable = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Vidéo produit, affichée en vignette verticale.
 *
 * Au repos la vignette est trop étroite (un tiers de la colonne) pour que les
 * contrôles natifs y soient lisibles : elle n'affiche qu'un bouton lecture, et
 * le clic ouvre le lecteur plein écran, où le son et la progression retrouvent
 * leur place (retour client). Les contrôles reviennent dès que la vidéo joue,
 * sans quoi rien ne permet de la mettre en pause après une sortie du plein
 * écran (ou quand le navigateur le refuse).
 *
 * L'aperçu montre la frame de l'instant `at` via le fragment `#t`, mais la
 * lecture repart de zéro.
 */
export default function ProductVideo({
  src,
  at,
  playLabel,
  className = "",
}: {
  src: string;
  at: number;
  playLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Une fois la vidéo lancée, le lecteur natif reste en place : une pause ne
  // doit pas rendre la main au bouton, qui relancerait tout depuis le début.
  const [started, setStarted] = useState(false);

  function open() {
    const v = ref.current as Fullscreenable | null;
    if (!v) return;
    setStarted(true);
    v.currentTime = 0; // la vignette s'arrêtait sur `at` : la lecture, elle, part du début
    v.muted = false;
    if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else v.requestFullscreen?.().catch(() => {});
    void v.play();
  }

  return (
    /* Le rayon et le fond noir portent sur ce cadre, pas sur la vidéo :
       appliqués à l'élément <video> lui-même, Safari iOS les composite de
       travers et laisse apparaître la vidéo en mosaïque hors de son cadre. */
    <div className={`relative overflow-hidden rounded-2xl bg-black ring-1 ring-border ${className}`}>
      <video
        ref={ref}
        src={`${src}#t=${at}`}
        playsInline
        preload="metadata"
        controls={started}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={open}
          aria-label={playLabel}
          className="absolute inset-0 grid place-items-center bg-black/10 transition hover:bg-black/20"
        >
          <span className="grid place-items-center h-11 w-11 rounded-full bg-white/90 text-black bien-shadow-sm">
            <Play className="h-5 w-5 translate-x-px fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
