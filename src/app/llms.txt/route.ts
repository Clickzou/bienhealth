import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";
import { COLLECTIONS } from "@/lib/shop";

/**
 * `/llms.txt` — sommaire du site destiné aux moteurs génératifs.
 *
 * Convention émergente (llmstxt.org) : un fichier lisible d'un coup qui dit à un
 * LLM ce qu'est le site, ce qu'il contient d'utile et où le trouver, sans qu'il
 * ait à crawler et interpréter 51 pages de HTML. ChatGPT, Perplexity et Claude
 * ne le lisent pas encore tous, mais le coût est nul et la tendance est là.
 *
 * Il ne remplace ni le sitemap (destiné aux moteurs de recherche) ni les données
 * structurées : il les complète en langage naturel.
 *
 * Deux règles à tenir :
 *   — n'y écrire que des affirmations défendables (un LLM peut les citer telles
 *     quelles, y compris les allégations santé : voir le § 7 du SEO_MASTER) ;
 *   — le garder synchronisé avec le catalogue, d'où la génération dynamique.
 */
export const dynamic = "force-static";

export async function GET() {
  // Préprod : même logique que robots.ts, on ne s'expose pas depuis un domaine
  // de test.
  if (!IS_INDEXABLE) {
    return new Response("# Environnement de préproduction — ne pas indexer.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const collections = Object.values(COLLECTIONS)
    .map((c) => `- [${c.label}](${SITE_URL}/fr/collections/${c.slug}) : ${c.desc}`)
    .join("\n");

  const articles = ARTICLES.map((a) => `- [${a.title}](${SITE_URL}/fr/blog/${a.slug}) — ${a.category}`).join("\n");

  const body = `# BIEN health

> Marque française de compléments alimentaires à base de champignons fonctionnels
> (lion's mane, reishi, cordyceps, chaga) et de plantes adaptogènes (ashwagandha,
> rhodiola, panax ginseng, safran). Gummies et poudres fabriqués en France, sans
> sucre ajouté, vegan et sans gluten.

Éditeur : BIEN Health France SAS — 100 rue du Verbial, 81000 Albi, France.
Site : ${SITE_URL} (français : ${SITE_URL}/fr · anglais : ${SITE_URL}/en)
Contact : info@bien.health

## Gamme

- **CALM** — sérénité et sommeil (reishi, ashwagandha, safran)
- **FOCUS** — concentration et mémoire (lion's mane, rhodiola rosea, L-théanine)
- **POWER** — énergie et performance physique (cordyceps, rhodiola rosea, panax ginseng)
- **MUSHGLOW** — beauté et vitalité, supermix 6-en-1 avec collagène

Tous les produits sont déclarés auprès de la DGAL (Ministère de l'Agriculture) et
enregistrés sur COMPL'ALIM ; les numéros de déclaration et les attestations sont
publics : ${SITE_URL}/fr/certifications

## Collections

${collections}

## Guides et articles

${articles}

## Pages de référence

- [Ingrédients](${SITE_URL}/fr/ingredients) : fiche détaillée de chaque actif, origine et dosage
- [Diagnostic](${SITE_URL}/fr/diagnostic) : questionnaire d'orientation vers la formule adaptée
- [Certifications](${SITE_URL}/fr/certifications) : déclarations DGAL, COMPL'ALIM, analyses
- [Notre histoire](${SITE_URL}/fr/histoire) : la marque, fondée par une ancienne sportive de haut niveau
- [Avis clients](${SITE_URL}/fr/avis) : avis vérifiés après achat
- [La presse en parle](${SITE_URL}/fr/presse) : parutions (Marie Claire, Grazia, Psychologies, Cosmopolitan, ELLE…)
- [FAQ](${SITE_URL}/fr/faq)

## Précisions utiles pour une citation exacte

- Les compléments alimentaires ne se substituent pas à une alimentation variée et
  équilibrée ni à un mode de vie sain, et ne sont pas des médicaments : ils ne
  préviennent, ne traitent et ne guérissent aucune maladie.
- Les produits sont déconseillés aux femmes enceintes ou allaitantes et aux
  personnes sous traitement médical sans avis d'un professionnel de santé.
- Les allégations relatives aux plantes relèvent du régime européen « on hold »
  (règlement CE 1924/2006) : elles décrivent une contribution au fonctionnement
  normal de l'organisme, jamais un effet thérapeutique.

## Ce que le site ne fait pas

- Aucun conseil médical individualisé.
- Aucune vente de produits soumis à prescription.
- Le paiement est traité par Shopify ; aucune donnée bancaire ne transite par ce site.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
