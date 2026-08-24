/**
 * Remises par quantité — miroir des remises automatiques Shopify.
 *
 * Le client les a créées dans son admin Shopify le 18/08/2026 : −5 % dès
 * 2 unités d'un même produit, −10 % dès 3, −15 % dès 6, pour suivre la logique
 * des cures de 2, 3 et 6 mois.
 *
 * ATTENTION : ce fichier ne *crée* aucune remise, il ne fait que réafficher
 * celles de Shopify. C'est Shopify qui les applique au paiement. Si les taux
 * changent dans l'admin, ils doivent changer ici le même jour : un prix barré
 * sur le site qui ne se retrouve pas au checkout fait abandonner le panier.
 *
 * Les remises Shopify s'appliquent par ligne (quantité d'un même produit) et
 * non sur le total du panier : deux CALM déclenchent −5 %, un CALM + un FOCUS
 * ne déclenchent rien.
 */

/** Paliers, du plus avantageux au moins avantageux (l'ordre compte). */
export const QUANTITY_TIERS = [
  { min: 6, rate: 0.15 },
  { min: 3, rate: 0.1 },
  { min: 2, rate: 0.05 },
] as const;

/** Quantités proposées sur la fiche produit (1 unité = 1 mois de cure). */
export const CURE_QUANTITIES = [1, 2, 3, 6] as const;

/** Plafond des menus de quantité libre de la fiche produit (demande client :
 *  jusqu'à 15). Au-delà, c'est une commande revendeur, traitée par le
 *  formulaire dédié. */
export const MAX_QUANTITY = 15;

/** Quantité mise en avant comme « Meilleure offre » : la cure de 3 mois, qui
 *  est aussi la durée recommandée en FAQ. */
export const BEST_VALUE_QUANTITY = 3;

/** Taux de remise (0 à 1) appliqué à une ligne de `qty` unités. */
export function discountRate(qty: number): number {
  return QUANTITY_TIERS.find((t) => qty >= t.min)?.rate ?? 0;
}

/** Remise en pourcentage entier, pour l'affichage (« −10 % »). */
export function discountPercent(qty: number): number {
  return Math.round(discountRate(qty) * 100);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Total d'une ligne avant remise. */
export function lineSubtotal(unitPrice: number, qty: number): number {
  return round2(unitPrice * qty);
}

/** Total d'une ligne remise comprise. */
export function lineTotal(unitPrice: number, qty: number): number {
  return round2(unitPrice * qty * (1 - discountRate(qty)));
}

/** Montant économisé sur la ligne. */
export function lineSavings(unitPrice: number, qty: number): number {
  return round2(lineSubtotal(unitPrice, qty) - lineTotal(unitPrice, qty));
}

/**
 * Choix de cure diffusé par la fiche produit à la barre d'achat collante.
 *
 * Les deux boutons « Ajouter au panier » (celui de la fiche et celui de la
 * barre du bas) sont deux composants frères, sans parent client commun : la
 * barre ajoutait donc toujours une seule unité au prix de base, même après
 * avoir choisi « 2 mois » plus haut. Le sélecteur diffuse sa quantité sur
 * `window`, la barre s'y accroche.
 */
export const CURE_EVENT = "bien:cure-change";

export type CureChange = { handle: string; qty: number };

export function emitCureChange(detail: CureChange): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CureChange>(CURE_EVENT, { detail }));
}
