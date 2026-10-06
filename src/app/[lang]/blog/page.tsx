import type { Metadata } from "next";
import BlogIndex from "./blog-index";
import { blogMetadata } from "./metadata";

// Publication à date (blog-publication.ts) : l'index se régénère au plus toutes les heures,
// pour qu'un article y entre à sa date sans redéploiement.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return blogMetadata(lang, 1);
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BlogIndex lang={lang} page={1} />;
}
