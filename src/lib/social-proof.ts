/**
 * Preuve sociale — source unique de vérité.
 *
 * Trois chiffres cohabitaient sur une même page (4,4/5 · +100 avis Trustpilot
 * dans le header, 5,0 sur 23 avis Loox sur la fiche, « +23 clients satisfaits »,
 * « +1000 clients » dans la réassurance). Chaque nombre doit désormais venir
 * d'ici et dire explicitement ce qu'il mesure :
 *
 *  - HAPPY_CLIENTS      → nombre de clients (base client, PAS un nombre d'avis)
 *  - TRUSTPILOT_*       → note et volume d'avis BOUTIQUE (source nommée)
 *  - le nombre d'avis PRODUIT reste propre à chaque produit (widget Loox et
 *    balisage JSON-LD) : il ne doit jamais être présenté comme un nombre de
 *    clients, sous peine de rendre les trois chiffres contradictoires.
 */
export const HAPPY_CLIENTS = 500;

export const TRUSTPILOT_RATING = 4.4;
export const TRUSTPILOT_REVIEWS = 100;

/** « 4,4 » en français, « 4.4 » en anglais. */
export function ratingLabel(lang: string): string {
  return lang === "en"
    ? String(TRUSTPILOT_RATING)
    : String(TRUSTPILOT_RATING).replace(".", ",");
}

/** « +500 clients satisfaits » / « +500 happy customers ». */
export function happyClientsLabel(lang: string): string {
  return lang === "en" ? `+${HAPPY_CLIENTS} happy customers` : `+${HAPPY_CLIENTS} clients satisfaits`;
}
