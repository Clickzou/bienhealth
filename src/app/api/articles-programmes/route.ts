import { NextResponse } from "next/server";
import { ARTICLES, type Article } from "@/lib/blog";
import { articleLinks } from "@/lib/blog-links";
import { estPublie } from "@/lib/blog-publication";
import { cheminApercu } from "@/lib/blog-apercu";
import { COLLECTIONS } from "@/lib/shop";
import { SITE_URL } from "@/lib/seo";
import { ENTETES_TABLEAU_DE_BORD, refusTableauDeBord } from "@/lib/tableau-de-bord";

/**
 * GET /api/articles-programmes — la liste des articles pour le tableau de bord
 * client Clickzou (clickzou.fr/espace-client, onglet « Articles programmés »),
 * au format `ArticleClient` de Clickzou (`src/lib/espace-client/articles.ts` du
 * dépôt clickzou-v2). Pas de barre finale : le site n'en met nulle part.
 *
 * Pour chaque article : statut (publié / programmé selon sa date, à Paris),
 * lien public ou lien d'aperçu signé, et la matière des posts (chapô, requête
 * cible, collection servie). Version française : la langue de référence.
 * Accès : `Authorization: Bearer <TABLEAU_DE_BORD_CLE>` (503 sans clé
 * configurée, 401 clé absente ou fausse) ; les sujets à venir ne sortent pas.
 */
export const dynamic = "force-dynamic";

/** Texte brut : retire le HTML léger des articles (liens, gras, italique). */
function brut(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** La page qui vend, servie par l'article : la collection de son bloc « Pour aller plus loin ». */
function pilier(a: Article): { href: string; ancre: string } {
  const liens = articleLinks(a.slug, a.category);
  const col = liens ? COLLECTIONS[liens.collection] : undefined;
  return col ? { href: `/fr/collections/${col.slug}`, ancre: col.label } : { href: "/fr/boutique", ancre: "boutique BIEN health" };
}

export async function GET(req: Request) {
  const refus = refusTableauDeBord(req);
  if (refus) return refus;

  // `url` : l'adresse définitive (bien.health), celle qu'on diffuse ;
  // `urlActuelle` / `apercuUrl` / `image` : le domaine réellement servi.
  const base = new URL(req.url).origin;

  const articles = [...ARTICLES]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => {
      const publie = estPublie(a);
      const chemin = `/fr/blog/${a.slug}`;
      const apercu = publie ? null : cheminApercu(a.slug, "fr");
      return {
        slug: a.slug,
        titre: a.title,
        datePublication: a.date.slice(0, 10),
        statut: publie ? "publie" : "programme",
        url: `${SITE_URL}${chemin}`,
        urlActuelle: `${base}${chemin}`,
        image: `${base}${a.cover}`,
        apercuUrl: apercu ? `${base}${apercu}` : null,
        auteur: "BIEN",
        motCle: a.motCle,
        motsClesSecondaires: a.motsClesSecondaires ?? [],
        metaDescription: a.metaDescription,
        chapo: brut(a.intro),
        // Pas de « points clés » dans le gabarit du blog : la réponse directe
        // est l'introduction (gabarit du 30/08/2026).
        essentiel: { reponse: brut(a.intro), points: [] as string[] },
        pilier: pilier(a),
      };
    });

  return NextResponse.json({ ok: true, site: "BIEN health", articles }, { headers: ENTETES_TABLEAU_DE_BORD });
}
