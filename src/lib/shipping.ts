/**
 * Conditions de livraison — source unique de vérité.
 *
 * Le seuil de livraison offerte était annoncé à deux valeurs différentes selon
 * les pages (49 € sur l'accueil, 69 € sur la fiche produit et la page
 * Livraison). Toute mention du seuil doit désormais passer par ces constantes.
 */
export const FREE_SHIPPING_THRESHOLD = 49;

/** « 49 € » (fr) / « €49 » (en) — formaté selon la locale. */
export function freeShippingAmount(lang: string): string {
  return lang === "en" ? `€${FREE_SHIPPING_THRESHOLD}` : `${FREE_SHIPPING_THRESHOLD} €`;
}

/** Phrase complète de réassurance, utilisée dans les pages et les accordéons. */
export function freeShippingSentence(lang: string): string {
  return lang === "en"
    ? `Free Point Relais delivery on orders over ${freeShippingAmount("en")}, shipped the same day (for orders placed before 1 pm).`
    : `Livraison offerte en Point Relais dès ${freeShippingAmount("fr")} d'achat, expédiée le jour même (pour toute commande passée avant 13h).`;
}
