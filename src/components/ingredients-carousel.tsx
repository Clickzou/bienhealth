"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Ingredient = {
  name: string;
  latin: string;
  img: string;
  virtue: string; // mot-clé de la meilleure vertu
  text: string;
};

const INGREDIENTS: Ingredient[] = [
  { name: "Lion's Mane", latin: "Hericium erinaceus", img: "/brand/lions-mane.png", virtue: "Concentration", text: "Soutient la mémoire et la fonction cognitive." },
  { name: "Reishi", latin: "Ganoderma lucidum", img: "/brand/reishi.png", virtue: "Immunité", text: "Favorise la relaxation et l'équilibre." },
  { name: "Cordyceps", latin: "Cordyceps militaris", img: "/brand/cordyceps.png", virtue: "Énergie", text: "Endurance et oxygénation cellulaire." },
  { name: "Chaga", latin: "Inonotus obliquus", img: "/brand/chaga.png", virtue: "Antioxydant", text: "Immunité et éclat de la peau." },
  { name: "Ashwagandha", latin: "Withania somnifera", img: "/brand/ashwagandha.png", virtue: "Anti-stress", text: "Réduit le cortisol, favorise la sérénité." },
  { name: "Rhodiola Rosea", latin: "Rhodiola rosea", img: "/brand/rhodiola.png", virtue: "Anti-fatigue", text: "Clarté mentale et vigueur." },
  { name: "Maca", latin: "Lepidium meyenii", img: "/brand/maca.png", virtue: "Endurance", text: "Équilibre hormonal et tonus." },
  { name: "L-Théanine", latin: "Acide aminé", img: "/brand/l-theanine.png", virtue: "Calme", text: "Concentration apaisée (ondes alpha)." },
  { name: "Panax Ginseng", latin: "Panax ginseng", img: "/brand/panax-ginseng.png", virtue: "Vitalité", text: "Cognition et anti-fatigue." },
  { name: "Safran", latin: "Crocus sativus", img: "/brand/saffron.png", virtue: "Humeur", text: "Équilibre émotionnel positif." },
  { name: "Collagène", latin: "Protéine", img: "/brand/collagen.png", virtue: "Peau", text: "Élasticité et santé des articulations." },
];

export default function IngredientsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 600), behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      {/* Flèches */}
      <div className="absolute -top-16 right-0 hidden sm:flex gap-2">
        <button onClick={() => scroll(-1)} aria-label="Précédent" className="grid place-items-center h-11 w-11 rounded-full bg-bien-cream/10 text-bien-cream ring-1 ring-bien-cream/20 hover:bg-bien-gold hover:text-black transition">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => scroll(1)} aria-label="Suivant" className="grid place-items-center h-11 w-11 rounded-full bg-bien-cream/10 text-bien-cream ring-1 ring-bien-cream/20 hover:bg-bien-gold hover:text-black transition">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {INGREDIENTS.map((ing) => (
          <article
            key={ing.name}
            className="snap-start shrink-0 w-[80%] sm:w-[46%] lg:w-[calc((100%-8rem)/5)] text-center"
          >
            <div className="relative aspect-square w-1/2 mx-auto max-w-[150px] rounded-full overflow-hidden ring-1 ring-bien-cream/15 bg-bien-forest/40 group">
              <Image src={ing.img} alt={`${ing.name} (${ing.latin})`} fill loading="lazy" sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="mt-5 font-display text-xl text-bien-cream">{ing.name}</h3>
            <p className="italic text-sm text-bien-cream/55">{ing.latin}</p>
            <span className="mt-3 inline-block rounded-full bg-bien-citrus/15 text-bien-citrus px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {ing.virtue}
            </span>
            <p className="mt-2 text-sm text-bien-cream/70 leading-relaxed px-2">{ing.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
