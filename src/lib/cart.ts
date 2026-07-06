/**
 * Panier local (client) — stocké en localStorage.
 *
 * En headless sans token Storefront, on gère le panier côté navigateur puis on
 * bascule vers le checkout Shopify via un permalink multi-articles
 * (/cart/{variant}:{qty},{variant}:{qty}). Un évènement `bien-cart-change` est
 * émis à chaque modification pour rafraîchir le badge et la page panier.
 */

export type CartItem = {
  variantId: string;
  handle: string;
  title: string;
  price: number;
  currency: string;
  image?: string | null;
  qty: number;
};

const KEY = "bien-cart";
export const CART_EVENT = "bien-cart-change";
export const SHOPIFY_STORE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bien.health").replace(/\/$/, "");

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = getCart();
  const found = items.find((i) => i.variantId === item.variantId);
  if (found) found.qty += qty;
  else items.push({ ...item, qty });
  save(items);
}

export function setQty(variantId: string, qty: number) {
  let items = getCart();
  if (qty <= 0) items = items.filter((i) => i.variantId !== variantId);
  else items = items.map((i) => (i.variantId === variantId ? { ...i, qty } : i));
  save(items);
}

export function removeItem(variantId: string) {
  save(getCart().filter((i) => i.variantId !== variantId));
}

export function clearCart() {
  save([]);
}

export function cartCount(items = getCart()): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items = getCart()): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

/** Id numérique de variante (le permalink Shopify n'accepte pas les GID). */
function numericVariantId(variantId: string): string {
  return variantId.split("/").pop() ?? variantId;
}

/** Permalink de checkout Shopify pour tous les articles du panier. */
export function checkoutUrl(items = getCart()): string {
  const line = items.map((i) => `${numericVariantId(i.variantId)}:${i.qty}`).join(",");
  return `${SHOPIFY_STORE}/cart/${line}`;
}
