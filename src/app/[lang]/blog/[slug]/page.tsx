import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale, locales } from "../../dictionaries";
import { localizeArticle } from "@/lib/blog";
import { articlesPublies, getArticlePublie } from "@/lib/blog-publication";
import { pageMetadata, metaDescription } from "@/lib/seo";
import VueArticle from "@/components/vue-article";

/*
  Publication à date (`blog-publication.ts`) : un article programmé répond 404
  jusqu'à sa date. Les articles déjà parus sont pré-rendus ; les autres sont
  rendus à la demande (`dynamicParams`), et chaque page se régénère au plus
  toutes les heures : un article paraît à sa date sans redéploiement.
*/
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.flatMap((lang) => articlesPublies().map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const base = getArticlePublie(slug);
  if (!base) return {};
  const a = localizeArticle(base, lang);
  const meta = pageMetadata({
    lang,
    path: `blog/${slug}`,
    title: a.metaTitle,
    description: metaDescription(a.metaDescription),
    image: a.cover,
    imageAlt: a.title,
    ogType: "article",
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: a.date, modifiedTime: a.updated ?? a.date },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const base = getArticlePublie(slug);
  if (!base) notFound();
  return <VueArticle base={base} lang={lang} />;
}
