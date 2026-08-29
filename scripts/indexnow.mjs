/**
 * Soumission des URLs du site à IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Pourquoi ça compte ici : ChatGPT interroge l'index Bing. Une page que Bing
 * n'a pas encore vue n'existe pas pour ChatGPT, quel que soit son classement
 * dans Google. IndexNow réduit ce délai de plusieurs semaines à quelques heures.
 *
 * Usage :
 *   node scripts/indexnow.mjs                      → toutes les URLs du sitemap
 *   node scripts/indexnow.mjs /fr/blog/lions-mane  → une ou plusieurs URLs précises
 *
 * À lancer après chaque déploiement qui ajoute ou modifie des pages. Inutile de
 * le faire plus d'une fois par jour : soumettre en boucle les mêmes URLs
 * inchangées est considéré comme un abus par le protocole.
 *
 * Google ne participe pas à IndexNow : pour lui, le sitemap et les liens restent
 * les seuls leviers.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://bien.health";
const KEY = "e5ab3fc25ec9f37c2716696a4efe4cb1";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const host = new URL(SITE).host;

/** Récupère les URLs du sitemap publié — source de vérité, plutôt que de
 *  recomposer la liste à la main et d'oublier la moitié du catalogue. */
async function urlsFromSitemap() {
  // Un 403 ici ne vient pas du sitemap : c'est le pare-feu Vercel qui a mis
  // l'adresse IP appelante au défi, après trop de requêtes automatisées depuis
  // le même poste. Le site répond normalement aux visiteurs — il suffit
  // d'attendre que le défi retombe, ou de vérifier dans Vercel → Firewall
  // qu'aucun mode de challenge n'a été activé à la main.
  const res = await fetch(`${SITE}/sitemap.xml`, {
    headers: { "User-Agent": "Clickzou-IndexNow/1.0 (+https://bien.health)" },
  });
  if (res.status === 403) {
    const body = await res.text().catch(() => "");
    throw new Error(
      /Security Checkpoint|challenge/i.test(body)
        ? "le pare-feu Vercel a mis cette adresse IP au défi (403). Le site reste accessible aux visiteurs. Réessayez plus tard, ou passez les URLs en argument : npm run indexnow -- /fr /fr/boutique"
        : "sitemap : HTTP 403",
    );
  }
  if (!res.ok) throw new Error(`sitemap : HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
let urlList;
try {
  urlList = args.length
    ? args.map((a) => (a.startsWith("http") ? a : `${SITE}${a.startsWith("/") ? a : `/${a}`}`))
    : await urlsFromSitemap();
} catch (e) {
  console.error(`IndexNow : ${e.message}`);
  process.exit(1);
}

if (!urlList.length) {
  console.error("Aucune URL à soumettre.");
  process.exit(1);
}

// IndexNow plafonne à 10 000 URLs par envoi ; on reste très en deçà, mais la
// borne évite une mauvaise surprise si le catalogue explose.
const payload = {
  host,
  key: KEY,
  keyLocation: `${SITE}/${KEY}.txt`,
  urlList: urlList.slice(0, 10000),
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

// 200 = accepté, 202 = accepté et clé en cours de vérification. 422 signale
// généralement une clé introuvable à `keyLocation` : vérifier que le
// déploiement contenant la route de la clé est bien en ligne.
console.log(`IndexNow : HTTP ${res.status} pour ${payload.urlList.length} URL(s) sur ${host}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
