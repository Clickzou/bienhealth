/**
 * Pixel Meta (Facebook / Instagram) — helpers partagés.
 *
 * Le pixel n'est chargé qu'après consentement « all » (voir consent.ts et
 * components/meta-pixel.tsx). `trackMeta` est donc volontairement silencieux
 * tant que `fbq` n'existe pas : aucun évènement n'est mis en file d'attente
 * avant le consentement, et aucun appel ne plante si le pixel est absent.
 *
 * L'identifiant vient de NEXT_PUBLIC_META_PIXEL_ID (Vercel / .env.local) :
 * sans lui, rien n'est chargé.
 */
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** Évènements standards Meta utilisés sur le site. */
export type MetaEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Search" | "Lead";

export function trackMeta(event: MetaEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
