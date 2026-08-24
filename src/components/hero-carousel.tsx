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
          priority={i === 0}
          loading={i === 0 ? undefined : "lazy"}
          sizes="(max-width:1024px) 100vw, 50vw"
          className={`object-cover ${img.pos ?? "object-center"} transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
