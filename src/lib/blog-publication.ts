import { ARTICLES, type Article } from "./blog";

/**
 * Publication à date des articles du blog (demande de JC, 6 octobre 2026, sur
 * le modèle d'Alps Ski Transfers).
 *
 * Un article dont le champ `date` (AAAA-MM-JJ) est dans le futur est
 * « programmé » : il répond 404, et il est absent de l'index du blog, de la
 * pagination, du sitemap, de `llms.txt`, de `llms-full.txt` et des articles
 * liés des collections. Il paraît à sa date SANS redéploiement : toutes ces
 * pages se régénèrent au plus toutes les heures (`revalidate = 3600`). Avant sa
 * date, il n'est lisible que par l'aperçu signé (`blog-apercu.ts`).
 *
 * Seule porte d'entrée publique vers les articles : une page ne lit jamais
 * `ARTICLES` directement.
 */

/**
 * La date du jour à Paris, en AAAA-MM-JJ. Pas `toISOString()`, qui donne la
 * date UTC : entre minuit et 2 h à Paris, un article du jour paraîtrait en
 * retard. Le format `en-CA` est précisément AAAA-MM-JJ.
 */
export function aujourdhuiParis(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Vrai si la date de l'article est atteinte à Paris. */
export function estPublie(a: Pick<Article, "date">): boolean {
  return a.date.slice(0, 10) <= aujourdhuiParis();
}

/** Les articles en ligne, dans l'ordre du registre (inchangé pour l'index). */
export function articlesPublies(): Article[] {
  return ARTICLES.filter(estPublie);
}

/** Les articles programmés, le prochain à paraître en premier. */
export function articlesProgrammes(): Article[] {
  return ARTICLES.filter((a) => !estPublie(a)).sort((a, b) => a.date.localeCompare(b.date));
}

/** L'article s'il est en ligne ; `undefined` s'il n'existe pas ou n'est pas encore paru. */
export function getArticlePublie(slug: string): Article | undefined {
  const a = ARTICLES.find((x) => x.slug === slug);
  return a && estPublie(a) ? a : undefined;
}
