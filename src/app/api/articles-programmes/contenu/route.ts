import { NextResponse } from "next/server";
import { ARTICLES } from "@/lib/blog";
import { estPublie } from "@/lib/blog-publication";
import { FICHIER_CORRECTIONS, champsEditables } from "@/lib/blog-edition-client";
import { ENTETES_TABLEAU_DE_BORD, refusTableauDeBord } from "@/lib/tableau-de-bord";

/**
 * GET /api/articles-programmes/contenu?slug=<slug> — les textes modifiables
 * d'un article (français puis anglais), pour l'éditeur de l'espace client
 * Clickzou. Même clé et même contrat qu'Alps et Un Seul Souffle
 * (`ContenuArticle` de clickzou-v2/src/lib/espace-client/edition-article.ts).
 * Les textes renvoyés intègrent les corrections déjà enregistrées ; Clickzou
 * écrit les suivantes dans `fichierCorrections` (commit sur main).
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const refus = refusTableauDeBord(req);
  if (refus) return refus;

  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return NextResponse.json({ ok: false, erreur: "Article introuvable" }, { status: 404, headers: ENTETES_TABLEAU_DE_BORD });
  }

  return NextResponse.json(
    {
      ok: true,
      slug: article.slug,
      titre: article.title,
      datePublication: article.date.slice(0, 10),
      statut: estPublie(article) ? "publie" : "programme",
      fichierCorrections: FICHIER_CORRECTIONS,
      champs: champsEditables(article),
    },
    { headers: ENTETES_TABLEAU_DE_BORD },
  );
}
