"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Effet « machine à écrire » : le texte s'écrit caractère par caractère
 * lorsqu'il entre dans le viewport, avec un soulignement doré une fois
 * terminé. Respecte prefers-reduced-motion.
 */
export default function Typewriter({
  text,
  className = "",
  speed = 75,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Déclenchement au scroll (ou immédiat si reduced-motion)
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text.length);
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text.length]);

  // Frappe caractère par caractère
  useEffect(() => {
    if (!started || shown >= text.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), speed);
    return () => clearTimeout(t);
  }, [started, shown, text.length, speed]);

  const done = shown >= text.length;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span className="underline decoration-bien-leaf decoration-2 underline-offset-[6px]" aria-hidden>
        {text.slice(0, shown)}
      </span>
      {/* Curseur affiché pendant la frappe seulement : une fois le texte
          écrit, il continuait à clignoter en fin de phrase indéfiniment. */}
      {!done && (
        <span
          aria-hidden
          className="inline-block ml-[3px] h-[1em] w-[2px] translate-y-[2px] bg-bien-leaf"
        />
      )}
    </span>
  );
}
