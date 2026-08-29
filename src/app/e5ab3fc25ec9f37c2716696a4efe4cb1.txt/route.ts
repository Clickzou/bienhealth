/**
 * Clé de vérification IndexNow.
 *
 * IndexNow est un protocole soutenu par Bing, Yandex, Naver et Seznam : au lieu
 * d'attendre le passage d'un robot, on **notifie** les moteurs qu'une URL a
 * changé, et l'indexation tombe en heures plutôt qu'en semaines.
 *
 * L'enjeu ici dépasse Bing : **ChatGPT s'appuie sur l'index Bing** pour ses
 * recherches web. Être indexé vite dans Bing, c'est devenir citable par ChatGPT
 * vite. Google, lui, ne participe pas à IndexNow et garde son propre rythme.
 *
 * Le protocole exige que la clé soit servie en clair à la racine du domaine,
 * dans un fichier portant son nom : c'est ce que fait cette route. Elle prouve
 * que celui qui soumet les URLs contrôle bien le site.
 *
 * Soumission : `node scripts/indexnow.mjs` (voir ce fichier).
 */
export const dynamic = "force-static";

const KEY = "e5ab3fc25ec9f37c2716696a4efe4cb1";

export async function GET() {
  return new Response(KEY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
