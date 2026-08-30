/**
 * Pagination de l'index du blog.
 *
 * Cette constante vit dans un module neutre, et non dans le composant de
 * listing : celui-ci porte `"use client"`, et Next remplace **tous** les exports
 * d'un module client par des références client lorsqu'un composant serveur les
 * importe. La constante n'y valait donc pas 9 côté serveur mais un proxy, et le
 * nombre de pages calculé à partir d'elle tombait silencieusement à `NaN` — la
 * pagination disparaissait du HTML sans la moindre erreur.
 */
import { ARTICLES } from "./blog";

/** Articles par page de l'index. */
export const BLOG_PAGE_SIZE = 9;

/** Nombre total de pages, au moins une même si le blog est vide. */
export function blogPageCount(): number {
  return Math.max(1, Math.ceil(ARTICLES.length / BLOG_PAGE_SIZE));
}
