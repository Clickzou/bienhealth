"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/** Carrousel d'images du hero : fondu automatique + points de navigation. */
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

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className={`h-2 rounded-full bg-white transition-all ${i === active ? "w-6" : "w-2 opacity-50 hover:opacity-80"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
