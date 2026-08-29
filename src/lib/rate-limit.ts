/**
 * Limitation de débit des routes API publiques.
 *
 * Compteur en mémoire, par adresse IP et par route. Volontairement rustique :
 * il ne survit pas au redémarrage d'une instance Vercel et ne se partage pas
 * entre régions. Il ne prétend donc pas *empêcher* une attaque distribuée — il
 * rend impraticable le cas réel et fréquent : un script qui martèle
 * `/api/account/login` depuis une machine.
 *
 * Pour une protection robuste (plusieurs instances, plusieurs régions), la
 * suite est le pare-feu Vercel ou un compteur Redis partagé — voir
 * `docs/securite/audit-securite-2026-08-29.md`, § 2.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Purge paresseuse : sans elle, la table grossirait indéfiniment sur une
 *  instance longue durée, chaque IP laissant une entrée derrière elle. */
function sweep(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/** Adresse de l'appelant. Derrière Vercel, `x-forwarded-for` porte la vraie IP
 *  en première position ; en local il n'existe pas, d'où le repli. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}

/**
 * Consomme un jeton pour `scope` + IP. Renvoie `true` quand la limite est
 * dépassée, c'est-à-dire quand l'appel doit être refusé (429).
 *
 * @param limit   nombre d'appels autorisés dans la fenêtre
 * @param windowMs durée de la fenêtre glissante, en millisecondes
 */
export function isRateLimited(request: Request, scope: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  sweep(now);

  const key = `${scope}:${clientIp(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

/** Remet le compteur à zéro — à appeler après une opération légitime réussie,
 *  pour qu'un utilisateur qui se trompe deux fois puis réussit ne traîne pas
 *  son quota entamé. */
export function resetRateLimit(request: Request, scope: string): void {
  buckets.delete(`${scope}:${clientIp(request)}`);
}

/** Réponse 429 standard, avec `Retry-After` pour que les clients corrects
 *  attendent au lieu de réessayer en boucle. */
export function tooManyRequests(message = "Trop de tentatives. Réessayez dans une minute.") {
  return Response.json(
    { ok: false, error: message },
    { status: 429, headers: { "Retry-After": "60" } },
  );
}
