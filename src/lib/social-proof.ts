/**
 * Preuve sociale — source unique de vérité.
 *
 * Trois chiffres cohabitaient sur une même page (4,4/5 · +100 avis Trustpilot
 * dans le header, 5,0 sur 23 avis Loox sur la fiche, « +23 clients satisfaits »,
 * « +1000 clients » dans la réassurance). Chaque nombre doit venir d'ici et
 * dire explicitement ce qu'il mesure :
 *
 *  - HAPPY_CLIENTS → nombre de clients (base client, PAS un nombre d'avis)
 *  - SHOP_RATING   → note affichée pour la boutique
 *  - getReviewCount() → nombre d'avis clients, lu chez Loox via Shopify
 *
 * Trustpilot a été retiré du site le 24/08/2026 : la boutique n'y collectait
 * rien, alors que Loox porte les vrais avis clients, photos comprises.
 */

/* ------------------------------ Note affichée ------------------------------ */

/**
 * Note boutique affichée partout (header, cartes, fiches, page Avis).
 *
 * Fixée à 4,9 à la demande du client, alors que la moyenne pondérée réelle des
 * avis Loox tourne autour de 4,98 : on affiche donc **moins** que la réalité,
 * jamais plus. C'est ce qui rend le chiffre défendable — annoncer une note
 * supérieure à celle de la source, ou ne garder que les meilleurs avis, serait
 * une pratique commerciale trompeuse (directive Omnibus) et expose au
 * déréférencement des rich snippets Google, dont le balisage doit correspondre
 * à une source vérifiable.
 *
 * `getShopRating()` plus bas donne la moyenne réelle : à comparer de temps en
 * temps, et à relever si elle passait durablement sous 4,9.
 */
export const SHOP_RATING = 4.9;

export const HAPPY_CLIENTS = 500;

/** Nombre d'avis servi si Shopify est injoignable (dernier relevé : 24/08/2026). */
export const REVIEWS_FALLBACK = 78;

/* ------------------------------ Avis Loox ---------------------------------- */

/**
 * Loox recopie ses notes dans les metafields Shopify standard
 * `reviews.rating` / `reviews.rating_count`, lisibles avec le token Storefront
 * du catalogue : pas d'API ni de clé supplémentaire à gérer.
 */
const REVIEW_METAFIELDS = `metafields(identifiers: [
  { namespace: "reviews", key: "rating" }
  { namespace: "reviews", key: "rating_count" }
]) { key value }`;

type ReviewedProduct = { metafields: ({ key: string; value: string } | null)[] };

export type ShopReviews = {
  /** Somme des avis de tous les produits. */
  count: number;
  /** Moyenne pondérée réelle — sert de garde-fou, pas d'affichage direct. */
  average: number;
};

/**
 * Agrège les avis Loox de tout le catalogue. Revalidé toutes les heures : le
 * chiffre bouge de quelques unités par semaine, inutile d'interroger Shopify à
 * chaque rendu.
 */
export async function getShopReviews(): Promise<ShopReviews> {
  const { shopifyFetch, isShopifyConfigured } = await import("./shopify");
  if (!isShopifyConfigured) return { count: REVIEWS_FALLBACK, average: SHOP_RATING };
  try {
    const data = await shopifyFetch<{ products: { nodes: ReviewedProduct[] } }>({
      query: `{ products(first: 100) { nodes { ${REVIEW_METAFIELDS} } } }`,
      revalidate: 3600,
    });
    let count = 0;
    let weighted = 0;
    for (const p of data.products.nodes) {
      const rating = p.metafields.find((m) => m?.key === "rating");
      const ratingCount = p.metafields.find((m) => m?.key === "rating_count");
      if (!rating || !ratingCount) continue; // produit sans avis (accessoires)
      const value = Number(JSON.parse(rating.value).value);
      const n = Number.parseInt(ratingCount.value, 10);
      if (!Number.isFinite(value) || !Number.isFinite(n) || n <= 0) continue;
      count += n;
      weighted += value * n;
    }
    if (count === 0) return { count: REVIEWS_FALLBACK, average: SHOP_RATING };
    return { count, average: weighted / count };
  } catch {
    // Un catalogue injoignable ne doit pas faire tomber une page : on sert le
    // dernier chiffre connu plutôt qu'un zéro qui ferait disparaître la preuve.
    return { count: REVIEWS_FALLBACK, average: SHOP_RATING };
  }
}

/** Nombre d'avis clients, pour les composants qui n'ont besoin que de ça. */
export async function getReviewCount(): Promise<number> {
  return (await getShopReviews()).count;
}

/* -------------------------------- Libellés --------------------------------- */

/** « 4,9 » en français, « 4.9 » en anglais. */
export function ratingLabel(lang: string): string {
  return lang === "en" ? String(SHOP_RATING) : String(SHOP_RATING).replace(".", ",");
}

/** « +500 clients satisfaits » / « +500 happy customers ». */
export function happyClientsLabel(lang: string): string {
  return lang === "en" ? `+${HAPPY_CLIENTS} happy customers` : `+${HAPPY_CLIENTS} clients satisfaits`;
}
