import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";
import { COLLECTIONS } from "@/lib/shop";
import { COLLECTION_SEO } from "@/lib/collection-seo";
import { PRODUCT_FACTS, PACK_FACTS, productFactLine } from "@/lib/brand-facts";

/**
 * `/llms-full.txt` — le contenu éditorial du site en un seul fichier texte.
 *
 * Complément de `/llms.txt` (le sommaire) : les moteurs génératifs qui le lisent
 * obtiennent en une requête les 18 guides, leurs FAQ et les fiches de gamme,
 * sans avoir à rendre 50 pages de HTML. C'est la matière qu'ils citent.
 *
 * Généré depuis les mêmes sources que les pages : il ne peut pas diverger du
 * site. Version française seulement, la langue de référence du contenu.
 */
export const dynamic = "force-static";

/** Retire le HTML léger des articles (liens, gras) sans perdre le texte. */
function plain(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  if (!IS_INDEXABLE) {
    return new Response("# Environnement de préproduction — ne pas indexer.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const out: string[] = [];
  out.push(
    "# BIEN health — contenu intégral",
    "",
    "> Marque française de compléments alimentaires à base de champignons fonctionnels et de plantes adaptogènes. Gummies et poudre fabriqués en France. Éditeur : BIEN Health France SAS, Albi. Fondatrice : Carla Debard.",
    "",
    `Sommaire : ${SITE_URL}/llms.txt`,
    "",
    "Les compléments alimentaires ne se substituent pas à une alimentation variée et équilibrée ni à un mode de vie sain. Ils ne préviennent, ne traitent et ne guérissent aucune maladie.",
    "",
    "## La gamme",
    "",
    ...PRODUCT_FACTS.map((p) => productFactLine(p, SITE_URL)),
    "",
    `Packs : ${PACK_FACTS.map((p) => `${p.name} (${p.content}, ${SITE_URL}/fr/products/${p.handle})`).join(", ")}.`,
    "",
  );

  for (const [slug, seo] of Object.entries(COLLECTION_SEO)) {
    const col = COLLECTIONS[slug];
    if (!col) continue;
    out.push(`## Collection ${col.label}`, "", `URL : ${SITE_URL}/fr/collections/${slug}`, "");
    out.push(...seo.intro.map(plain), "");
    for (const b of seo.blocks) out.push(`### ${b.h}`, "", ...b.p.map(plain), "");
    if (seo.table) {
      out.push(`### ${seo.table.caption}`, "");
      for (const row of seo.table.rows) out.push(`- ${row.map((cell, i) => `${seo.table!.head[i]} : ${cell}`).join(" ; ")}`);
      if (seo.table.note) out.push("", seo.table.note);
      out.push("");
    }
    if (seo.faq?.length) {
      out.push("### Questions fréquentes", "");
      for (const f of seo.faq) out.push(`**${f.q}** ${f.a}`, "");
    }
  }

  out.push("## Guides du Journal", "");
  for (const a of ARTICLES) {
    out.push(
      `### ${a.title}`,
      "",
      `URL : ${SITE_URL}/fr/blog/${a.slug} · Catégorie : ${a.category} · Publié le ${a.date}${a.updated ? ` · Mis à jour le ${a.updated}` : ""}`,
      "",
      plain(a.intro),
      "",
    );
    for (const b of a.blocks) {
      if ("h2" in b) out.push(`#### ${plain(b.h2)}`, "");
      else if ("h3" in b) out.push(`##### ${plain(b.h3)}`, "");
      else if ("p" in b) out.push(plain(b.p), "");
      else out.push(...b.ul.map((li) => `- ${plain(li)}`), "");
    }
    if (a.faq.length) {
      out.push("#### Questions fréquentes", "");
      for (const f of a.faq) out.push(`**${plain(f.q)}** ${plain(f.a)}`, "");
    }
  }

  return new Response(out.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
