/**
 * Client Shopify Storefront API (headless).
 * Lit les produits, collections et gère le panier.
 * Le paiement reste géré par Shopify (checkout hébergé).
 *
 * Variables d'environnement requises (voir .env.local.example) :
 *   SHOPIFY_STORE_DOMAIN              ex: b3a79e-89.myshopify.com
 *   SHOPIFY_STOREFRONT_API_TOKEN      jeton public Storefront API
 *   SHOPIFY_STOREFRONT_API_VERSION    ex: 2025-04
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-04";

export type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  // Revalidation ISR (secondes) — synchro produits/stock
  revalidate?: number;
};

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 60,
}: ShopifyFetchOptions): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Shopify non configuré : définissez SHOPIFY_STORE_DOMAIN et SHOPIFY_STOREFRONT_API_TOKEN dans .env.local",
    );
  }

  const res = await fetch(
    `https://${domain}/api/${version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    },
  );

  if (!res.ok) {
    throw new Error(`Shopify Storefront API: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { data: T | null; errors?: unknown };
  // Tolérance aux erreurs de CHAMP (ex. quantityAvailable sans le scope inventaire) :
  // si des données sont présentes malgré des erreurs, on log et on renvoie les données.
  if (json.errors) {
    if (json.data) {
      console.warn("Shopify Storefront API (erreurs partielles, ignorées):", JSON.stringify(json.errors));
    } else {
      throw new Error(`Shopify Storefront API: ${JSON.stringify(json.errors)}`);
    }
  }
  return json.data as T;
}

export const isShopifyConfigured = Boolean(domain && token);
