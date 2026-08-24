"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** `virtue` = mot-clé de la meilleure vertu. Le nom latin est localisé lui aussi :
 *  « Acide aminé » et « Protéine » ne sont pas des binômes latins. */
type Loc = { name: string; latin: string; virtue: string; text: string };
type Ingredient = { img: string; fr: Loc; en: Loc };

/**
 * Liste triée par ordre alphabétique (demande client). Le tri est le même en FR
 * et en EN : les seuls noms qui divergent (Safran/Saffron, Collagène/Collagen)
 * gardent leur rang dans les deux langues.
 */
const INGREDIENTS: Ingredient[] = [
  { img: "/brand/ashwagandha.png",
    fr: { name: "Ashwagandha", latin: "Withania somnifera", virtue: "Anti-stress", text: "Encourage la détente et l'harmonie intérieure." },
    en: { name: "Ashwagandha", latin: "Withania somnifera", virtue: "Anti-stress", text: "Encourages relaxation and inner balance." } },
  { img: "/brand/chaga.png",
    fr: { name: "Chaga", latin: "Inonotus obliquus", virtue: "Antioxydant", text: "Protège les cellules et révèle l'éclat de la peau." },
    en: { name: "Chaga", latin: "Inonotus obliquus", virtue: "Antioxidant", text: "Protects cells and reveals skin radiance." } },
  { img: "/brand/collagen.png",
    fr: { name: "Collagène de membrane d'œuf", latin: "Protéine", virtue: "Peau & articulations", text: "Préserve la souplesse de la peau et le confort articulaire." },
    en: { name: "Collagen (eggshell membrane)", latin: "Protein", virtue: "Skin & joints", text: "Preserves skin suppleness and joint comfort." } },
  { img: "/brand/cordyceps.png",
    fr: { name: "Cordyceps", latin: "Cordyceps militaris", virtue: "Énergie", text: "Développe l'endurance et la vitalité cellulaire." },
    en: { name: "Cordyceps", latin: "Cordyceps militaris", virtue: "Energy", text: "Builds stamina and cellular vitality." } },
  { img: "/brand/l-theanine.png",
    fr: { name: "L-Théanine", latin: "Acide aminé", virtue: "Énergie calme", text: "Accompagne la concentration et installe un état de calme mental." },
    en: { name: "L-Theanine", latin: "Amino acid", virtue: "Calm energy", text: "Supports focus and settles the mind." } },
  { img: "/brand/lions-mane.png",
    fr: { name: "Lion's Mane", latin: "Hericium erinaceus", virtue: "Concentration", text: "Soutient la mémoire et les fonctions cognitives." },
    en: { name: "Lion's Mane", latin: "Hericium erinaceus", virtue: "Focus", text: "Supports memory and cognitive function." } },
  { img: "/brand/maca.png",
    fr: { name: "Maca", latin: "Lepidium meyenii", virtue: "Endurance", text: "Stimule le tonus, l'équilibre hormonal et la force naturelle." },
    en: { name: "Maca", latin: "Lepidium meyenii", virtue: "Endurance", text: "Stimulates vitality, hormonal balance and natural strength." } },
  { img: "/brand/panax-ginseng.png",
    fr: { name: "Panax Ginseng", latin: "Panax ginseng", virtue: "Vitalité", text: "Optimise la résistance à la fatigue et le dynamisme quotidien." },
    en: { name: "Panax Ginseng", latin: "Panax ginseng", virtue: "Vitality", text: "Optimises resistance to fatigue and daily drive." } },
  { img: "/brand/reishi.png",
    fr: { name: "Reishi", latin: "Ganoderma lucidum", virtue: "Sérénité", text: "Favorise la relaxation et le bien-être général." },
    en: { name: "Reishi", latin: "Ganoderma lucidum", virtue: "Calm", text: "Promotes relaxation and overall wellbeing." } },
  { img: "/brand/rhodiola.png",
    fr: { name: "Rhodiola Rosea", latin: "Rhodiola rosea", virtue: "Anti-fatigue", text: "Renforce la vigilance, l'adaptation au stress et la résilience." },
    en: { name: "Rhodiola Rosea", latin: "Rhodiola rosea", virtue: "Anti-fatigue", text: "Boosts alertness, stress adaptation and resilience." } },
  { img: "/brand/saffron.png",
    fr: { name: "Safran", latin: "Crocus sativus", virtue: "Humeur", text: "Cultive l'équilibre émotionnel et la sérénité." },
    en: { name: "Saffron", latin: "Crocus sativus", virtue: "Mood", text: "Cultivates emotional balance and serenity." } },
];

const T = {
  fr: { prev: "Précédent", next: "Suivant", page: "Page" },
  en: { prev: "Previous", next: "Next", page: "Page" },
} as const;

export default function IngredientsCarousel({ lang }: { lang: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];
  // Pagination : sans elle, rien n'indiquait que la liste continuait au-delà
  // des cartes visibles (les flèches sont masquées sous `sm`).
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    // `ceil` et non `round` : avec 11 fiches affichées 5 par vue, l'arrondi
    // annonçait 2 pages (11/5 = 2,2) alors qu'il en faut bien 3 pour atteindre
    // la onzième. La dernière vue est partielle — elle s'arrête en butée de
    // scroll — mais elle existe, et le compteur doit la compter.
    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPages(total);
    // En butée, `scrollLeft / clientWidth` vaut 1,2 pour la 3ᵉ vue : arrondi à
    // 1, la dernière puce ne s'allumait jamais. La fin de course *est* la
    // dernière page.
    const max = el.scrollWidth - el.clientWidth;
    setPage(el.scrollLeft >= max - 1 ? total - 1 : Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const goToPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    // Borné à la fin de course, sinon la dernière page (partielle) demanderait
    // un scroll qui n'existe pas et la puce resterait éteinte.
    const target = Math.min(i * el.clientWidth, el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  };

  /* Les flèches avancent d'une page entière et non d'une fraction de largeur :
     autrement leur position de repos ne retombait jamais sur celle des puces,
     et le compteur sautait des numéros. */
  const scroll = (dir: 1 | -1) => goToPage(Math.min(Math.max(page + dir, 0), pages - 1));

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
        onScroll={measure}
        /* Sur téléphone, la carte s'aligne au centre et non au bord gauche :
           calée à gauche, l'ingrédient paraissait décalé dans le bloc vert
           (retour client du 19/08/2026).
           L'espace qui permet à la première et à la dernière carte de se
           centrer est porté par leurs propres marges, PAS par un `px-[7%]` sur
           la piste : le padding de fin d'un conteneur scrollable n'entre pas
           dans sa largeur de défilement, donc en butée la dernière carte
           collait au bord droit — décentrée, avec la fiche précédente qui
           réapparaissait à gauche (retour client du 24/08/2026).
           `gap-10` sur mobile : à 8 (2rem) l'écart était plus petit que les 7 %
           laissés de chaque côté d'une carte centrée, et la voisine mordait
           dans l'écran. */
        className="flex gap-10 sm:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {INGREDIENTS.map((ingredient) => {
          const ing = ingredient[en ? "en" : "fr"];
          return (
          <article
            key={ingredient.img}
            className="snap-center sm:snap-start shrink-0 w-[86%] sm:w-[46%] lg:w-[calc((100%-8rem)/5)] text-center first:ml-[7%] last:mr-[7%] sm:first:ml-0 sm:last:mr-0"
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

      {/* Indicateur de pages : le client ne voyait pas que la liste des
          11 ingrédients continuait au-delà des cartes affichées. */}
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`${t.page} ${i + 1}`}
                aria-current={i === page ? "true" : undefined}
                className={`h-2 rounded-full bg-bien-cream transition-all ${i === page ? "w-6" : "w-2 opacity-40 hover:opacity-70"}`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold tabular-nums text-bien-cream/60">
            {Math.min(page + 1, pages)} / {pages}
          </span>
        </div>
      )}
    </div>
  );
}
