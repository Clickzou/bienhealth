import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Vérification Bing Webmaster Tools servie aussi sous `/fr` et `/en`.
 *
 * Le fichier vit à la racine (`public/BingSiteAuth.xml`), ce qui suffit pour une
 * propriété déclarée sur `https://bien.health/`. Mais Bing accepte aussi des
 * propriétés « préfixe d'URL » comme `https://bien.health/fr`, et il cherche
 * alors le fichier dans ce préfixe — où il n'existait pas.
 *
 * Plutôt que de dupliquer le jeton, on relit le fichier public : une seule
 * source, impossible de la voir diverger le jour où Bing en régénère un.
 *
 * La propriété racine reste préférable : elle couvre `/fr` **et** `/en`, alors
 * qu'une propriété `/fr` ignore tout le reste du site.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export async function GET() {
  const xml = readFileSync(join(process.cwd(), "public", "BingSiteAuth.xml"), "utf8");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
