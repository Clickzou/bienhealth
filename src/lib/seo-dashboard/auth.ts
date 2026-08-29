/**
 * Accès au tableau de bord « SEO by Clickzou » (/seo).
 *
 * Authentification volontairement minimale — un seul compte, pas de base de
 * données — mais vérifiée **côté serveur** : le mot de passe ne part jamais
 * dans le bundle client, et le cookie de session ne contient qu'une signature,
 * pas les identifiants.
 *
 * Le mot de passe n'est pas écrit en clair dans le dépôt : seule son empreinte
 * scrypt (sel + hash) l'est, ce qui suffit à vérifier une saisie sans permettre
 * de retrouver le mot de passe. `SEO_DASHBOARD_USER` / `SEO_DASHBOARD_PASSWORD`
 * (Vercel ou .env.local) prennent le dessus si on veut changer d'identifiants
 * sans redéployer de code.
 */
import { createHmac, createHash, scryptSync, timingSafeEqual } from "node:crypto";

export const SEO_COOKIE = "clickzou_seo";
/** Durée d'une session : une journée de travail, à refaire le lendemain. */
export const SESSION_MAX_AGE = 60 * 60 * 12;

const USER = process.env.SEO_DASHBOARD_USER || "carla07stats";
const PASSWORD_SALT = "33c1a207e88c2ee209d7013fe14c622e";
const PASSWORD_HASH = "07492d4a6d3905499bd95332d10fe76ad6d5eaff8e7c7882607cbcb08d571396";

/**
 * Clé de signature des sessions. Dérivée de l'empreinte du mot de passe faute
 * de secret dédié : changer le mot de passe invalide donc automatiquement les
 * sessions en cours, ce qui est le comportement attendu.
 */
function sessionSecret(): string {
  return process.env.SEO_DASHBOARD_SECRET || process.env.SEO_DASHBOARD_PASSWORD || PASSWORD_HASH;
}

/** Comparaison à temps constant, sur des empreintes de longueur fixe : deux
 *  chaînes de tailles différentes feraient lever `timingSafeEqual`. */
function sameSecret(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a.normalize("NFC")).digest();
  const hb = createHash("sha256").update(b.normalize("NFC")).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(user: string, password: string): boolean {
  if (!sameSecret(user.trim(), USER)) return false;

  const expected = process.env.SEO_DASHBOARD_PASSWORD;
  if (expected) return sameSecret(password, expected);

  const digest = scryptSync(password.normalize("NFC"), PASSWORD_SALT, 32).toString("hex");
  return sameSecret(digest, PASSWORD_HASH);
}

/** Jeton de session : date d'expiration + HMAC de cette date. Rien d'autre —
 *  il n'y a qu'un compte, il n'y a donc pas d'identité à transporter. */
export function createSession(): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const sig = createHmac("sha256", sessionSecret()).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!exp || !sig || Number.isNaN(exp) || exp < Date.now()) return false;
  const expected = createHmac("sha256", sessionSecret()).update(String(exp)).digest("hex");
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
