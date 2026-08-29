/**
 * Accès produits.
 * - Si le Storefront API est configuré (token) → on l'utilise (permet le panier).
 * - Sinon → repli sur l'endpoint PUBLIC Shopify (products.json) pour AFFICHER
 *   les vrais produits sans token (lecture seule, pas de panier).
 */
import { shopifyFetch, isShopifyConfigured } from "./shopify";

/**
 * Domaine de la **boutique** pour le repli public (`products.json`).
 *
 * Il visait `NEXT_PUBLIC_SITE_URL` : correct tant que bien.health pointait sur
 * Shopify, mais depuis la bascule du 28/08/2026 ce domaine sert le site Next et
 * `/products.json` y répond 404. Le repli tombait donc dans le vide sans bruit,
 * et le sitemap a perdu les six fiches produit.
 */
const PUBLIC_STORE_URL = `https://${
  process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "b3a79e-89.myshopify.com"
}`;

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
  /** Note Loox du produit, recopiée par l'app dans les metafields Shopify
   *  standard `reviews.*`. `null` = aucun avis (accessoires). */
  rating: number | null;
  ratingCount: number;
};

/* ----------------------------- Storefront API ----------------------------- */

type ProductNode = {
  id: string; handle: string; title: string; description: string; descriptionHtml: string; tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money | null };
  variants: { nodes: { id: string; availableForSale: boolean; quantityAvailable: number | null; currentlyNotInStock: boolean }[] };
  metafields: ({ key: string; value: string } | null)[];
};

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml tags
  featuredImage { url altText }
  images(first: 10) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) { nodes { id availableForSale quantityAvailable currentlyNotInStock } }
  metafields(identifiers: [
    { namespace: "reviews", key: "rating" }
    { namespace: "reviews", key: "rating_count" }
  ]) { key value }
`;

/** `reviews.rating` arrive sérialisé : {"scale_min":"1.0","scale_max":"5.0","value":"4.9"}. */
function parseRating(metafields: ProductNode["metafields"]): { rating: number | null; ratingCount: number } {
  const raw = metafields?.find((m) => m?.key === "rating")?.value;
  const count = Number.parseInt(metafields?.find((m) => m?.key === "rating_count")?.value ?? "", 10);
  if (!raw) return { rating: null, ratingCount: 0 };
  try {
    const value = Number((JSON.parse(raw) as { value: string }).value);
    if (!Number.isFinite(value)) return { rating: null, ratingCount: 0 };
    return { rating: value, ratingCount: Number.isFinite(count) ? count : 0 };
  } catch {
    return { rating: null, ratingCount: 0 };
  }
}

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
    ...parseRating(p.metafields),
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
    // products.json public n'expose pas les metafields : sans avis, le site
    // n'affiche simplement pas de note produit.
    rating: null,
    ratingCount: 0,
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
/**
 * Handles de tous les produits — alimente le sitemap.
 *
 * Le Storefront API passe en premier : c'est la seule source qui ne renvoie que
 * les produits réellement publiés sur le canal headless. `products.json` liste
 * aussi des produits d'autres canaux, qui donneraient des 404 dans le sitemap.
 */
export async function getAllHandles(): Promise<string[]> {
  if (isShopifyConfigured) {
    try {
      const data = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>({
        query: `query Handles { products(first: 250) { nodes { handle } } }`,
        revalidate: 300,
      });
      const handles = data.products.nodes.map((n) => n.handle).filter(Boolean);
      if (handles.length) return handles;
      console.error("getAllHandles: le Storefront n'a renvoyé aucun produit");
    } catch (e) {
      console.error("getAllHandles(storefront):", e);
    }
  }
  return (await fetchPublicProducts()).map((p) => p.handle);
}

export function formatPrice(money: Money): string {
  const n = Number(money.amount);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: money.currencyCode || "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}
