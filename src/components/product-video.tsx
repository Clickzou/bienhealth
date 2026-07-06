"use client";

import { useRef } from "react";

/**
 * Vidéo produit : affiche en aperçu la frame à l'instant `at` (vignette),
 * mais démarre la lecture à 0 au premier clic sur play.
 */
export default function ProductVideo({
  src,
  at,
  className,
}: {
  src: string;
  at: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const started = useRef(false);

  // Le fragment #t affiche de façon fiable la frame d'aperçu (vignette).
  function handlePlay() {
    const v = ref.current;
    if (v && !started.current) {
      started.current = true;
      v.currentTime = 0; // première lecture → repart du début
    }
  }

  return (
    <video
      ref={ref}
      src={`${src}#t=${at}`}
      controls
      playsInline
      preload="metadata"
      onPlay={handlePlay}
      className={className}
    />
  );
}
