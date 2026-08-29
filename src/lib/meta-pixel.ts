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

const META_PIXEL_FALLBACK = "1675426639926228";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || (process.env.NODE_ENV === "production" ? META_PIXEL_FALLBACK : "");

/** Évènements standards Meta utilisés sur le site. */
export type MetaEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Search" | "Lead";

export function trackMeta(event: MetaEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
