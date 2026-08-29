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
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((a) => (a.startsWith("http") ? a : `${SITE}${a.startsWith("/") ? a : `/${a}`}`))
  : await urlsFromSitemap();

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
