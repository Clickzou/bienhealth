"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** `virtue` = mot-clé de la meilleure vertu. Le nom latin est localisé lui aussi :
 *  « Acide aminé » et « Protéine » ne sont pas des binômes latins. */
type Loc = { name: string; latin: string; virtue: string; text: string };
type Ingredient = { img: string; fr: Loc; en: Loc };

const INGREDIENTS: Ingredient[] = [
  { img: "/brand/lions-mane.png",
    fr: { name: "Lion's Mane", latin: "Hericium erinaceus", virtue: "Concentration", text: "Soutient la mémoire et la fonction cognitive." },
    en: { name: "Lion's Mane", latin: "Hericium erinaceus", virtue: "Focus", text: "Supports memory and cognitive function." } },
  { img: "/brand/reishi.png",
    fr: { name: "Reishi", latin: "Ganoderma lucidum", virtue: "Immunité", text: "Favorise la relaxation et l'équilibre." },
    en: { name: "Reishi", latin: "Ganoderma lucidum", virtue: "Immunity", text: "Promotes relaxation and balance." } },
  { img: "/brand/cordyceps.png",
    fr: { name: "Cordyceps", latin: "Cordyceps militaris", virtue: "Énergie", text: "Endurance et oxygénation cellulaire." },
    en: { name: "Cordyceps", latin: "Cordyceps militaris", virtue: "Energy", text: "Stamina and cellular oxygenation." } },
  { img: "/brand/chaga.png",
    fr: { name: "Chaga", latin: "Inonotus obliquus", virtue: "Antioxydant", text: "Immunité et éclat de la peau." },
    en: { name: "Chaga", latin: "Inonotus obliquus", virtue: "Antioxidant", text: "Immunity and skin radiance." } },
  { img: "/brand/ashwagandha.png",
    fr: { name: "Ashwagandha", latin: "Withania somnifera", virtue: "Anti-stress", text: "Réduit le cortisol, favorise la sérénité." },
    en: { name: "Ashwagandha", latin: "Withania somnifera", virtue: "Anti-stress", text: "Lowers cortisol, promotes calm." } },
  { img: "/brand/rhodiola.png",
    fr: { name: "Rhodiola Rosea", latin: "Rhodiola rosea", virtue: "Anti-fatigue", text: "Clarté mentale et vigueur." },
    en: { name: "Rhodiola Rosea", latin: "Rhodiola rosea", virtue: "Anti-fatigue", text: "Mental clarity and drive." } },
  { img: "/brand/maca.png",
    fr: { name: "Maca", latin: "Lepidium meyenii", virtue: "Endurance", text: "Équilibre hormonal et tonus." },
    en: { name: "Maca", latin: "Lepidium meyenii", virtue: "Endurance", text: "Hormonal balance and vitality." } },
  { img: "/brand/l-theanine.png",
    fr: { name: "L-Théanine", latin: "Acide aminé", virtue: "Calme", text: "Concentration apaisée (ondes alpha)." },
    en: { name: "L-Theanine", latin: "Amino acid", virtue: "Calm", text: "Calm focus (alpha waves)." } },
  { img: "/brand/panax-ginseng.png",
    fr: { name: "Panax Ginseng", latin: "Panax ginseng", virtue: "Vitalité", text: "Cognition et anti-fatigue." },
    en: { name: "Panax Ginseng", latin: "Panax ginseng", virtue: "Vitality", text: "Cognition and anti-fatigue." } },
  { img: "/brand/saffron.png",
    fr: { name: "Safran", latin: "Crocus sativus", virtue: "Humeur", text: "Équilibre émotionnel positif." },
    en: { name: "Saffron", latin: "Crocus sativus", virtue: "Mood", text: "Positive emotional balance." } },
  { img: "/brand/collagen.png",
    fr: { name: "Collagène", latin: "Protéine", virtue: "Peau", text: "Élasticité et santé des articulations." },
    en: { name: "Collagen", latin: "Protein", virtue: "Skin", text: "Elasticity and joint health." } },
];

const T = {
  fr: { prev: "Précédent", next: "Suivant" },
  en: { prev: "Previous", next: "Next" },
} as const;

export default function IngredientsCarousel({ lang }: { lang: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 600), behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      {/* Flèches */}
      <div className="absolute -top-16 right-0 hidden sm:flex gap-2">
        <button onClick={() => scroll(-1)} aria-label={t.prev} className="grid place-items-center h-11 w-11 rounded-full bg-bien-cream/10 text-bien-cream ring-1 ring-bien-cream/20 hover:bg-bien-gold hover:text-black transition">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={() => scroll(1)} aria-label={t.next} className="grid place-items-center h-11 w-11 rounded-full bg-bien-cream/10 text-bien-cream ring-1 ring-bien-cream/20 hover:bg-bien-gold hover:text-black transition">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {INGREDIENTS.map((ingredient) => {
          const ing = ingredient[en ? "en" : "fr"];
          return (
          <article
            key={ingredient.img}
            className="snap-start shrink-0 w-[80%] sm:w-[46%] lg:w-[calc((100%-8rem)/5)] text-center"
          >
            <div className="relative aspect-square w-1/2 mx-auto max-w-[150px] rounded-full overflow-hidden ring-1 ring-bien-cream/15 bg-bien-forest/40 group">
              <Image src={ingredient.img} alt={`${ing.name} (${ing.latin})`} fill loading="lazy" sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="mt-5 font-display text-xl text-bien-cream">{ing.name}</h3>
            <p className="italic text-sm text-bien-cream/55">{ing.latin}</p>
            <span className="mt-3 inline-block rounded-full bg-bien-citrus/15 text-bien-citrus px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {ing.virtue}
            </span>
            <p className="mt-2 text-sm text-bien-cream/70 leading-relaxed px-2">{ing.text}</p>
          </article>
          );
        })}
      </div>
    </div>
  );
}
