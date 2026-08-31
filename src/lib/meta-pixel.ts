/**
 * Pixel Meta (Facebook / Instagram) — helpers partagés.
 *
 * Le pixel n'est chargé qu'après consentement « all » (voir consent.ts et
 * components/meta-pixel.tsx). `trackMeta` est donc volontairement silencieux
 * tant que `fbq` n'existe pas : aucun évènement n'est mis en file d'attente
 * avant le consentement, et aucun appel ne plante si le pixel est absent.
 *
 * ID = NEXT_PUBLIC_META_PIXEL_ID si défini (Vercel / .env.local), sinon repli
 * sur l'ID public en PRODUCTION uniquement — même logique que GoogleAnalytics :
 * le pixel marche sur bien.health sans config Vercel, et le localhost reste
 * propre (le dev n'est tracké que si NEXT_PUBLIC_META_PIXEL_ID est présent).
 */
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
  }
}

// Dataset Meta « Bien.Health NEW » (propriété du Business Manager Bien.ai),
// relevé le 31/08/2026 dans Shopify → canal Facebook & Instagram → Settings.
// C'est le même dataset que celui alimenté par la Conversions API de Shopify
// depuis le checkout : le site et Shopify doivent écrire au même endroit, sinon
// Meta ne peut pas relier une visite produit à la vente qui en découle.
// L'ancienne valeur (1675426639926228) était un identifiant de compte
// publicitaire, pas un pixel — les évènements du site partaient dans le vide.
const META_PIXEL_FALLBACK = "848968707348964";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || (process.env.NODE_ENV === "production" ? META_PIXEL_FALLBACK : "");

/** Évènements standards Meta utilisés sur le site. */
export type MetaEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Search" | "Lead";

export function trackMeta(event: MetaEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
