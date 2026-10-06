import { createHmac, timingSafeEqual } from "node:crypto";
import { cleTableauDeBord } from "./tableau-de-bord";

/**
 * Liens d'aperçu des articles programmés (relecture par la cliente avant
 * parution, depuis l'onglet « Articles programmés » de son espace Clickzou).
 *
 * Un article programmé répond 404 sur /fr/blog/<slug> ; il n'est lisible que
 * par /fr/blog/apercu/<slug>?sig=<signature> (ou /en/…, même signature). La
 * signature est un HMAC-SHA256 du slug, en base64url, avec la clé
 * `TABLEAU_DE_BORD_CLE` (celle de l'API du tableau de bord) : un lien ne se
 * devine pas et ne sert pas pour un autre article. Les liens sont fabriqués ici
 * et transmis par /api/articles-programmes : la clé ne quitte jamais le serveur.
 */

function signer(slug: string, secret: string): string {
  return createHmac("sha256", secret).update(slug).digest("base64url");
}

/** Chemin d'aperçu signé (sans le domaine) ; `null` si la clé n'est pas configurée. */
export function cheminApercu(slug: string, lang: "fr" | "en" = "fr"): string | null {
  const secret = cleTableauDeBord();
  return secret ? `/${lang}/blog/apercu/${slug}?sig=${signer(slug, secret)}` : null;
}

/** Vrai si la signature correspond au slug. Comparaison à temps constant. */
export function apercuValide(slug: string, sig: string | undefined): boolean {
  const secret = cleTableauDeBord();
  if (!secret || !sig) return false;
  const attendu = Buffer.from(signer(slug, secret));
  const recu = Buffer.from(sig);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu);
}
