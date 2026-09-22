/**
 * Google Analytics 4 — évènements e-commerce du site.
 *
 * GA4 n'est chargé qu'après consentement « all » (voir consent.ts et
 * components/google-analytics.tsx). Comme `trackMeta`, `trackGa` ne fait rien
 * sans consentement : aucun évènement n'est mis en file d'attente avant.
 *
 * Avant le 22/09/2026, le site n'envoyait aucun de ces évènements : la carte
 * « Ajouts au panier » du tableau de bord ne comptait que ceux des pages
 * Shopify, et comparait le nouveau site à l'ancienne boutique (−77 % factice).
 */
import { getConsent } from "./consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Évènements recommandés GA4 utilisés sur le site. */
export type GaEvent = "view_item" | "add_to_cart" | "begin_checkout";

export type GaItem = { item_id: string; item_name: string; price: number; quantity: number };

/**
 * `gtag` est défini par un script `afterInteractive` : à l'ouverture d'une
 * fiche, l'effet qui envoie `view_item` peut passer avant lui. On attend donc
 * jusqu'à cinq secondes, mais seulement si le consentement est acquis.
 */
export function trackGa(event: GaEvent, params: { currency: string; value: number; items: GaItem[] }): void {
  if (typeof window === "undefined" || getConsent() !== "all") return;
  let tries = 0;
  const send = () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (++tries <= 20) {
      window.setTimeout(send, 250);
    }
  };
  send();
}
