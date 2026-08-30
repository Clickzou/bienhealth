import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales } from "../../../dictionaries";
import BlogIndex from "../../blog-index";
import { blogPageCount } from "@/lib/blog-pages";
import { blogMetadata } from "../../metadata";

/**
 * Pages 2 et suivantes de l'index du blog.
 *
 * Segment statique `page`, donc sans conflit avec `/blog/[slug]` : une route
 * fixe l'emporte sur une route dynamique, et le nombre de segments diffère de
 * toute façon. La page 1 reste `/blog`, sans numéro, pour ne pas dédoubler
 * l'URL de l'index.
 */
export function generateStaticParams() {
  const pages = Array.from({ length: blogPageCount() - 1 }, (_, i) => String(i + 2));
  return locales.flatMap((lang) => pages.map((n) => ({ lang, n })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; n: string }> }): Promise<Metadata> {
  const { lang, n } = await params;
  const page = Number(n);
  // Hors bornes : pas de métadonnées, donc pas de canonique annoncée pour une
  // page qui répondra 404 quelques millisecondes plus tard.
  if (!/^\d+$/.test(n) || page < 2 || page > blogPageCount()) return {};
  return blogMetadata(lang, page);
}

export default async function BlogPaginated({ params }: { params: Promise<{ lang: string; n: string }> }) {
  const { lang, n } = await params;
  const page = Number(n);

  // Une page hors bornes n'existe pas : mieux vaut un 404 franc qu'une page
  // vide qui serait indexée puis signalée comme contenu pauvre.
  if (!/^\d+$/.test(n) || page < 2 || page > blogPageCount()) notFound();

  return <BlogIndex lang={lang} page={page} />;
}
