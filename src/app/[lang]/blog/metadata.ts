import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/**
 * Métadonnées de l'index du blog, page 1 comprise.
 *
 * Chaque page paginée porte sa propre canonique — `/fr/blog/page/2` se désigne
 * elle-même, et non la page 1 : elles n'ont pas le même contenu, et faire
 * pointer la seconde vers la première reviendrait à demander à Google d'ignorer
 * la moitié des articles.
 */
export function blogMetadata(lang: string, page: number): Metadata {
  const en = lang === "en";
  const path = page > 1 ? `blog/page/${page}` : "blog";

  const title = en
    ? page > 1
      ? `The Journal: adaptogens & wellbeing — page ${page} | BIEN health`
      : "The Journal: adaptogens & wellbeing | BIEN health"
    : page > 1
      ? `Le Journal : adaptogènes & bien-être — page ${page} | BIEN health`
      : "Le Journal : adaptogènes & bien-être | BIEN health";

  const description = en
    ? "Insights, tips and science on adaptogens and functional mushrooms by BIEN health: stress, sleep, focus, energy and natural beauty."
    : "Décryptages, conseils et science des adaptogènes et champignons fonctionnels par BIEN health : stress, sommeil, concentration, énergie et beauté au naturel.";

  return pageMetadata({ lang, path, title, description });
}
