import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_PATHS } from "@/lib/seo";
import { getAllHandles } from "@/lib/shopify-products";
import { COLLECTIONS } from "@/lib/shop";
import { articlesPublies } from "@/lib/blog-publication";
import { blogPageCount } from "@/lib/blog-pages";

// Publication à date (blog-publication.ts) : le sitemap se régénère au plus toutes les heures,
// pour qu'un article y entre à sa date sans redéploiement.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const handles = await getAllHandles().catch(() => [] as string[]);

  const paths = [
    ...STATIC_PATHS,
    ...Object.keys(COLLECTIONS).map((slug) => `collections/${slug}`),
    ...handles.map((h) => `products/${h}`),
    ...articlesPublies().map((a) => `blog/${a.slug}`),
    // Pages 2 et suivantes de l'index : sans elles, le sitemap ignorerait les
    // pages qui portent les liens vers les articles les plus anciens.
    ...Array.from({ length: blogPageCount() - 1 }, (_, i) => `blog/page/${i + 2}`),
  ];

  const now = new Date();
  return paths.map((p) => {
    const path = p ? `/${p}` : "";
    return {
      url: `${SITE_URL}/fr${path}`,
      lastModified: now,
      changeFrequency: p === "" ? "daily" : "weekly",
      priority: p === "" ? 1 : p.startsWith("products/") ? 0.8 : 0.6,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr${path}`,
          en: `${SITE_URL}/en${path}`,
        },
      },
    };
  });
}
