import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

/**
 * Accès des routes lues par le tableau de bord client Clickzou
 * (clickzou.fr/espace-client) : ventes (`/api/tableau-de-bord/ventes`) et
 * articles (`/api/articles-programmes`, `/api/articles-programmes/contenu`).
 *
 * `Authorization: Bearer <TABLEAU_DE_BORD_CLE>` ; la même valeur est posée côté
 * Clickzou (`BIENHEALTH_TABLEAU_DE_BORD_CLE`). Clé absente ou de moins de 32
 * caractères : 503, plutôt qu'une API ouverte par oubli. Comparaison à temps
 * constant.
 */

/** En-têtes de toutes les réponses : jamais en cache, jamais indexées. */
export const ENTETES_TABLEAU_DE_BORD = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

/** La clé, si elle est configurée (32 caractères au moins). */
export function cleTableauDeBord(): string | null {
  const cle = process.env.TABLEAU_DE_BORD_CLE;
  return cle && cle.length >= 32 ? cle : null;
}

function autorise(req: Request, cle: string): boolean {
  const attendu = Buffer.from(`Bearer ${cle}`);
  const donne = Buffer.from(req.headers.get("authorization") ?? "");
  return attendu.length === donne.length && timingSafeEqual(attendu, donne);
}

/**
 * `null` si la requête est autorisée ; sinon la réponse à renvoyer telle quelle
 * (503 clé non configurée, 401 clé absente ou fausse).
 */
export function refusTableauDeBord(req: Request): NextResponse | null {
  const cle = cleTableauDeBord();
  if (!cle) return NextResponse.json({ erreur: "Accès non configuré" }, { status: 503, headers: ENTETES_TABLEAU_DE_BORD });
  if (!autorise(req, cle)) return NextResponse.json({ erreur: "Non autorisé" }, { status: 401, headers: ENTETES_TABLEAU_DE_BORD });
  return null;
}
