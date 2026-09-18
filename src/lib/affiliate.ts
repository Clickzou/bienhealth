/**
 * Suivi d'affiliation — du lien de l'affilié jusqu'à la caisse Shopify.
 *
 * Le site est headless : les pages sont servies par Next sur `bien.health`, le
 * paiement se conclut sur `shop.bien.health`. Une application d'affiliation
 * installée sur Shopify ne voit donc **que** la caisse ; le script qu'elle pose
 * d'ordinaire sur les pages boutique n'existe nulle part ici, et le code de
 * l'affilié — présent dans l'URL d'arrivée — se perdrait en chemin.
 *
 * Ce module comble ce trou, sans dépendre d'une application précise :
 *
 *   1. il reconnaît le code dans l'URL d'arrivée (`?ref=`, `?aff=`, `?sca_ref=`
 *      — les paramètres d'UpPromote, GoAffPro et Refersion) ;
 *   2. il le conserve trente jours, la durée d'attribution usuelle ;
 *   3. il le réinjecte dans le permalink de caisse, sous trois formes : les
 *      paramètres `ref` et `sca_ref`, que les applications relisent, et un
 *      **attribut de commande** que Shopify affiche sur la commande dans
 *      l'admin. Ce dernier ne dépend d'aucune application : même sans app, la
 *      commande porte le nom de l'affilié, lisible à l'œil et exportable.
 *
 * ## Cookies et consentement
 *
 * Le code est conservé trente jours **quel que soit le choix fait dans la
 * bannière** : décision du client du 18/09/2026, qui veut que l'affilié soit
 * rémunéré dans tous les cas. Le cookie est donc traité comme fonctionnel — il
 * n'identifie pas la personne, il n'existe que pour attribuer une commande à
 * celui qui l'a amenée, et il ne sert à aucun profilage ni à aucune publicité.
 *
 * Ce classement se défend, mais il n'est pas neutre : la CNIL range en général
 * l'affiliation parmi les traceurs soumis au consentement. La contrepartie
 * minimale, et elle est en place, est qu'il figure nommément dans la politique
 * de cookies du site, parmi les cookies essentiels.
 *
 * Le cookie est posé sur le domaine parent (`.bien.health`) pour que la caisse,
 * hébergée sur `shop.bien.health`, puisse le lire elle aussi.
 */

/** Paramètres d'URL reconnus, par ordre de priorité. */
const PARAMS = ["sca_ref", "ref", "aff", "affiliate"] as const;

export const AFFILIATE_KEY = "bien-affiliate";
/** Nom du cookie, lisible depuis la caisse Shopify. */
export const AFFILIATE_COOKIE = "bien_aff";
/** Durée d'attribution — trente jours, le standard des programmes d'affiliation. */
export const AFFILIATE_MAX_AGE_DAYS = 30;

const MAX_AGE_MS = AFFILIATE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

type Stored = { code: string; at: number };

/**
 * Codes acceptés : lettres, chiffres, tiret, point et souligné, 64 caractères
 * au plus. Le code part dans une URL et s'affiche dans l'admin Shopify ; on ne
 * recopie pas tel quel ce qu'un lien peut contenir.
 */
function clean(raw: string | null): string {
  if (!raw) return "";
  const code = raw.trim().slice(0, 64);
  return /^[A-Za-z0-9._-]+$/.test(code) ? code : "";
}

/** `.bien.health` en production, rien ailleurs — un cookie de domaine posé
 *  depuis `localhost` ou `*.vercel.app` est refusé sans le moindre message. */
function cookieDomain(): string {
  const host = window.location.hostname;
  return host === "bien.health" || host.endsWith(".bien.health") ? "; Domain=.bien.health" : "";
}

function writeCookie(code: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${AFFILIATE_COOKIE}=${encodeURIComponent(code)}; Path=/; Max-Age=${AFFILIATE_MAX_AGE_DAYS * 86400}` +
    `; SameSite=Lax${secure}${cookieDomain()}`;
}

function readCookie(): string {
  const found = document.cookie.split("; ").find((c) => c.startsWith(`${AFFILIATE_COOKIE}=`));
  return found ? clean(decodeURIComponent(found.slice(AFFILIATE_COOKIE.length + 1))) : "";
}

function remember(code: string) {
  const payload = JSON.stringify({ code, at: Date.now() } satisfies Stored);
  // Trois supports : la visite en cours, la mémoire longue, et le cookie — seul
  // des trois à être lisible depuis la caisse, sur l'autre domaine.
  try {
    sessionStorage.setItem(AFFILIATE_KEY, payload);
  } catch {
    /* navigation privée, stockage saturé : le code vivra dans l'URL seulement */
  }
  try {
    localStorage.setItem(AFFILIATE_KEY, payload);
  } catch {
    /* idem */
  }
  writeCookie(code);
}

function readStore(store: Storage): string {
  try {
    const raw = store.getItem(AFFILIATE_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (typeof parsed.code !== "string" || typeof parsed.at !== "number") return "";
    // Une attribution expirée doit disparaître : la vente revient à la marque.
    if (Date.now() - parsed.at > MAX_AGE_MS) {
      store.removeItem(AFFILIATE_KEY);
      return "";
    }
    return clean(parsed.code);
  } catch {
    return "";
  }
}

/**
 * Lit le code de l'URL courante et le mémorise. À appeler à chaque navigation :
 * le lien d'un affilié peut pointer vers n'importe quelle page du site.
 */
export function captureAffiliate(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  for (const name of PARAMS) {
    const code = clean(params.get(name));
    if (code) {
      remember(code);
      return code;
    }
  }
  return getAffiliateCode();
}

/** Code retenu pour cette visite, s'il y en a un. */
export function getAffiliateCode(): string {
  if (typeof window === "undefined") return "";
  return readStore(sessionStorage) || readStore(localStorage) || readCookie();
}

/**
 * Paramètres à accrocher au permalink de caisse. Chaîne vide s'il n'y a pas de
 * code : l'URL de paiement ne doit pas se mettre à traîner des points
 * d'interrogation inutiles.
 */
export function affiliateCheckoutParams(code = getAffiliateCode()): string {
  if (!code) return "";
  const value = encodeURIComponent(code);
  return [
    `ref=${value}`,
    `sca_ref=${value}`,
    // Attribut de commande : Shopify l'enregistre et l'affiche sur la commande
    // dans l'admin, ce qui rend l'attribution vérifiable sans application.
    `attributes[affiliate]=${value}`,
  ].join("&");
}
