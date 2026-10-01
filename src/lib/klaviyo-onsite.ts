/**
 * Suivi Klaviyo côté navigateur — helpers partagés.
 *
 * `lib/klaviyo.ts` inscrit des emails depuis le serveur ; ce fichier-ci envoie
 * les évènements de navigation (« Viewed Product », « Added to Cart ») dont les
 * flux Klaviyo de relance ont besoin. Sur l'ancienne boutique, c'est l'app
 * Klaviyo du thème Shopify qui les émettait : depuis la bascule vers le site
 * headless, plus personne ne le faisait, et le flux « Browse Abandonment »,
 * pourtant actif, ne recevait plus personne (constat du 01/10/2026, voir
 * docs/reponse-client-2026-10-01.md).
 *
 * Même règle que le pixel Meta : rien ne part sans consentement « all ». Mais
 * contrairement à `trackMeta`, on n'attend pas que le script soit chargé : la
 * file d'attente officielle de Klaviyo (`_klOnsite`) est posée ici, et
 * klaviyo.js la vide à son arrivée. Sans cela, l'évènement d'une fiche produit
 * ouverte en première page serait perdu — l'effet du composant s'exécute avant
 * que le script ne soit inséré.
 *
 * À savoir : Klaviyo n'attache ces évènements qu'à un visiteur qu'il sait
 * identifier (arrivé par un lien d'e-mail, ou inscrit sur le site — voir
 * `identifyKlaviyo`). Un visiteur anonyme ne déclenche aucun flux.
 *
 * ID = NEXT_PUBLIC_KLAVIYO_COMPANY_ID si défini, sinon repli sur la clé
 * publique du compte en PRODUCTION uniquement — même logique que le pixel Meta.
 */
import { getConsent } from "./consent";

type KlaviyoObject = {
  track: (event: string, properties?: Record<string, unknown>) => unknown;
  identify: (properties: Record<string, unknown>) => unknown;
};

declare global {
  interface Window {
    klaviyo?: KlaviyoObject;
    _klOnsite?: unknown[];
  }
}

// Clé publique du compte « Bien Health » (GO-LIVE.md § 23) : elle est faite
// pour être lue par le navigateur.
const KLAVIYO_COMPANY_FALLBACK = "TVsaPf";

export const KLAVIYO_COMPANY_ID =
  process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ||
  (process.env.NODE_ENV === "production" ? KLAVIYO_COMPANY_FALLBACK : "");

/** Évènements envoyés par le site, sous le nom exact des indicateurs Klaviyo. */
export type KlaviyoEvent = "Viewed Product" | "Added to Cart";

/**
 * Objet `klaviyo` utilisable avant le chargement du script : reprise du
 * fragment officiel, qui range chaque appel dans `_klOnsite`. klaviyo.js le
 * remplace par le vrai objet en arrivant. `null` sans consentement ou sans ID.
 */
function klaviyo(): KlaviyoObject | null {
  if (typeof window === "undefined" || !KLAVIYO_COMPANY_ID || getConsent() !== "all") return null;
  if (!window.klaviyo) {
    const queue = (window._klOnsite = window._klOnsite || []);
    const call =
      (method: string) =>
      (...args: unknown[]) =>
        new Promise((resolve) => queue.push([method, ...args, resolve]));
    window.klaviyo = { track: call("track"), identify: call("identify") };
  }
  return window.klaviyo;
}

/** Renvoie `true` si l'évènement est parti (ou mis en file), `false` sans consentement. */
export function trackKlaviyo(event: KlaviyoEvent, properties: Record<string, unknown>): boolean {
  const k = klaviyo();
  if (!k) return false;
  k.track(event, properties);
  return true;
}

/**
 * Rattache le navigateur à une adresse e-mail. Appelé quand le visiteur la
 * donne lui-même (popup, footer, diagnostic) : c'est ce qui permet ensuite à
 * Klaviyo de lui attribuer ses visites de fiches et ses ajouts au panier.
 */
export function identifyKlaviyo(email: string): void {
  klaviyo()?.identify({ email });
}
