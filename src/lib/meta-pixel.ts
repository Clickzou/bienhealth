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

/**
 * Identifiant de clic publicitaire (`fbclid`) — du lien de la pub jusqu'au pixel.
 *
 * Le pixel ne lit `fbclid` que dans l'URL de la page où il se charge. Un
 * visiteur venu d'une pub qui change de page **avant** d'accepter les cookies
 * le perdait donc : le pixel démarrait sur une URL sans `fbclid`, ne posait pas
 * le cookie `_fbc`, et l'achat ne pouvait plus être relié au clic (mesuré le
 * 01/10/2026 sur bien.health). Accepter dès la page d'arrivée ne posait, lui,
 * aucun problème.
 *
 * On retient donc le `fbclid` le temps de la visite (sessionStorage : il ne
 * quitte pas le navigateur et disparaît à la fermeture de l'onglet), et on
 * n'écrit `_fbc` qu'une fois le consentement « all » donné, au format que Meta
 * documente : `fb.1.<horodatage du clic en ms>.<fbclid>`. Le cookie est posé
 * sur `.bien.health`, comme le fait le pixel lui-même, pour rester lisible
 * depuis la caisse Shopify (`shop.bien.health`).
 */
const FBCLID_KEY = "bien-fbclid";
const FBC_MAX_AGE_DAYS = 90;

/** À appeler à l'arrivée sur le site : mémorise le `fbclid` de l'URL, s'il y en a un. */
export function captureFbclid(): void {
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid && /^[A-Za-z0-9_-]{1,500}$/.test(fbclid)) {
      sessionStorage.setItem(FBCLID_KEY, JSON.stringify({ fbclid, at: Date.now() }));
    }
  } catch {
    /* navigation privée, stockage indisponible : on ne retient rien */
  }
}

/**
 * À appeler une fois le consentement donné, avant le chargement du pixel :
 * pose `_fbc` à partir du clic retenu si le pixel ne l'a pas déjà fait.
 */
export function restoreFbc(): void {
  try {
    if (document.cookie.split("; ").some((c) => c.startsWith("_fbc="))) return;
    const stored = JSON.parse(sessionStorage.getItem(FBCLID_KEY) || "null") as { fbclid?: string; at?: number } | null;
    if (!stored || typeof stored.fbclid !== "string" || typeof stored.at !== "number") return;
    const host = window.location.hostname;
    const domain = host === "bien.health" || host.endsWith(".bien.health") ? "; Domain=.bien.health" : "";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `_fbc=fb.1.${stored.at}.${stored.fbclid}; Path=/; Max-Age=${FBC_MAX_AGE_DAYS * 86400}; SameSite=Lax${secure}${domain}`;
  } catch {
    /* rien à restaurer */
  }
}

/** Évènements standards Meta utilisés sur le site. */
export type MetaEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Search" | "Lead";

export function trackMeta(event: MetaEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
