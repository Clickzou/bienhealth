/**
 * Accès produits.
 * - Si le Storefront API est configuré (token) → on l'utilise (permet le panier).
 * - Sinon → repli sur l'endpoint PUBLIC Shopify (products.json) pour AFFICHER
 *   les vrais produits sans token (lecture seule, pas de panier).
 */
import { shopifyFetch, isShopifyConfigured } from "./shopify";

const PUBLIC_STORE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bien.health").replace(/\/$/, "");

// Ordre d'affichage préféré sur la home
const PREFERRED = ["mushglow", "calm", "focus", "power", "mousseur-a-lait", "bien-totebag"];

export type Money = { amount: string; currencyCode: string };

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { url: string; altText: string | null }[];
  price: Money;
  compareAtPrice: Money | null;
  available: boolean;
  variantId: string | null;
  quantityAvailable: number | null; // stock exact (null si scope inventaire absent)
  currentlyNotInStock: boolean;     // vrai = 0 en stock (mais peut rester vendable en pré-commande)
};

/* ----------------------------- Storefront API ----------------------------- */

type ProductNode = {
  id: string; handle: string; title: string; description: string; descriptionHtml: string; tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money | null };
  variants: { nodes: { id: string; availableForSale: boolean; quantityAvailable: number | null; currentlyNotInStock: boolean }[] };
};

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml tags
  featuredImage { url altText }
  images(first: 10) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) { nodes { id availableForSale quantityAvailable currentlyNotInStock } }
`;

function normalizeNode(p: ProductNode): ShopifyProduct {
  const v = p.variants?.nodes?.[0];
  return {
    id: p.id, handle: p.handle, title: p.title,
    description: p.description, descriptionHtml: p.descriptionHtml,
    tags: p.tags ?? [],
    featuredImage: p.featuredImage,
    images: p.images?.nodes ?? [],
    price: p.priceRange.minVariantPrice,
    compareAtPrice: p.compareAtPriceRange?.minVariantPrice ?? null,
    available: v?.availableForSale ?? false,
    variantId: v?.id ?? null,
    quantityAvailable: v?.quantityAvailable ?? null,
    currentlyNotInStock: v?.currentlyNotInStock ?? false,
  };
}

/* ------------------------------ Public JSON -------------------------------- */

type PublicVariant = { id: number; price: string; compare_at_price: string | null; available: boolean };
type PublicImage = { src: string; alt: string | null };
type PublicProduct = {
  id: number; handle: string; title: string; body_html: string; tags: string[];
  variants: PublicVariant[]; images: PublicImage[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePublic(p: PublicProduct): ShopifyProduct {
  const v = p.variants?.[0];
  return {
    id: String(p.id), handle: p.handle, title: p.title,
    description: stripHtml(p.body_html || "").slice(0, 600),
    descriptionHtml: p.body_html || "",
    tags: p.tags ?? [],
    featuredImage: p.images?.[0] ? { url: p.images[0].src, altText: p.images[0].alt } : null,
    images: (p.images ?? []).map((i) => ({ url: i.src, altText: i.alt })),
    price: { amount: v?.price ?? "0", currencyCode: "EUR" },
    compareAtPrice: v?.compare_at_price ? { amount: v.compare_at_price, currencyCode: "EUR" } : null,
    available: p.variants?.some((x) => x.available !== false) ?? true,
    variantId: v ? String(v.id) : null,
    quantityAvailable: null, // non exposé par products.json public
    currentlyNotInStock: v ? v.available === false : false,
  };
}

async function fetchPublicProducts(): Promise<ShopifyProduct[]> {
  try {
    const res = await fetch(`${PUBLIC_STORE_URL}/products.json?limit=250`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { products: PublicProduct[] };
    const list = json.products.map(normalizePublic);
    list.sort((a, b) => {
      const ia = PREFERRED.indexOf(a.handle); const ib = PREFERRED.indexOf(b.handle);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return list;
  } catch (e) {
    console.error("fetchPublicProducts:", e);
    return [];
  }
}

/* -------------------------------- API publique ----------------------------- */

export async function getProducts(count = 4): Promise<ShopifyProduct[]> {
  if (isShopifyConfigured) {
    try {
      const data = await shopifyFetch<{ products: { nodes: ProductNode[] } }>({
        query: `query Products($n:Int!){ products(first:$n, sortKey: BEST_SELLING){ nodes { ${PRODUCT_FIELDS} } } }`,
        variables: { n: count }, revalidate: 60,
      });
      return data.products.nodes.map(normalizeNode);
    } catch (e) { console.error("getProducts(storefront):", e); }
  }
  return (await fetchPublicProducts()).slice(0, count);
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  if (isShopifyConfigured) {
    try {
      const data = await shopifyFetch<{ product: ProductNode | null }>({
        query: `query Product($h:String!){ product(handle:$h){ ${PRODUCT_FIELDS} } }`,
        variables: { h: handle }, revalidate: 60,
      });
      if (data.product) return normalizeNode(data.product);
    } catch (e) { console.error("getProduct(storefront):", e); }
  }
  try {
    const res = await fetch(`${PUBLIC_STORE_URL}/products/${handle}.json`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { product: PublicProduct };
    return json.product ? normalizePublic(json.product) : null;
  } catch (e) {
    console.error("getProduct(public):", e);
    return null;
  }
}

/** Tous les handles publiés (pour generateStaticParams). */
export async function getAllHandles(): Promise<string[]> {
  return (await fetchPublicProducts()).map((p) => p.handle);
}

export function formatPrice(money: Money): string {
  const n = Number(money.amount);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: money.currencyCode || "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}
