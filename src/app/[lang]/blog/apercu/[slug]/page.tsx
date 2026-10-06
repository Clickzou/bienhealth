import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "../../../dictionaries";
import { ARTICLES } from "@/lib/blog";
import { estPublie } from "@/lib/blog-publication";
import { apercuValide } from "@/lib/blog-apercu";
import VueArticle from "@/components/vue-article";

/**
 * `/[lang]/blog/apercu/[slug]?sig=…` — aperçu d'un article programmé, pour la
 * relecture par la cliente depuis son espace Clickzou (onglet « Articles
 * programmés »). Voir `src/lib/blog-apercu.ts`.
 *
 * Jamais indexable :
 *   - lien signé : sans signature valide → 404, rien ne fuit, pas même le titre ;
 *   - balise robots noindex/nofollow, pas de canonical ni de hreflang ;
 *   - en-têtes X-Robots-Tag et Referrer-Policy no-referrer (posés par
 *     `proxy.ts`) : la signature ne part pas dans l'en-tête Referer ;
 *   - absent du sitemap, aucune donnée structurée.
 *
 * Seule page publique qui lit `ARTICLES` directement : c'est son rôle de
 * montrer ce qui n'est pas encore publié.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aperçu d'article",
  // Le layout pose des alternates par défaut : on les annule ici.
  alternates: { canonical: null, languages: {} },
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function ApercuArticle({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ sig?: string | string[] }>;
}) {
  const { lang, slug } = await params;
  const { sig } = await searchParams;
  if (!hasLocale(lang)) notFound();
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article || !apercuValide(article.slug, typeof sig === "string" ? sig : undefined)) notFound();

  // Déjà en ligne : l'aperçu n'a plus lieu d'être, on renvoie vers la vraie page.
  if (estPublie(article)) redirect(`/${lang}/blog/${article.slug}`);

  return <VueArticle base={article} lang={lang} apercu />;
}
