"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * Carrousel d'images du hero : fondu automatique toutes les 5 s.
 * Sans puces de navigation — le client les trouvait parasites sur la photo ;
 * les images ne portent aucune information qu'on aurait besoin de rappeler.
 */
export default function HeroCarousel({ images }: { images: { src: string; alt: string; pos?: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          /* `preload` et non `priority` : depuis Next 16 cette dernière est dépréciée
             et sans effet. L'image du hero — l'élément LCP — partait donc sans
             préchargement, d'où un LCP à 3,5 s au relevé Lighthouse du 29/08/2026.
             La documentation déconseille de combiner `preload` avec `loading` ou
             `fetchPriority` ; les images suivantes restent simplement en lazy, qui
             est le défaut. */
          preload={i === 0}
          sizes="(max-width:1024px) 100vw, 50vw"
          className={`object-cover ${img.pos ?? "object-center"} transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
