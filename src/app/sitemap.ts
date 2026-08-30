import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_PATHS } from "@/lib/seo";
import { getAllHandles } from "@/lib/shopify-products";
import { COLLECTIONS } from "@/lib/shop";
import { ARTICLES } from "@/lib/blog";
import { blogPageCount } from "@/lib/blog-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const handles = await getAllHandles().catch(() => [] as string[]);

  const paths = [
    ...STATIC_PATHS,
    ...Object.keys(COLLECTIONS).map((slug) => `collections/${slug}`),
    ...handles.map((h) => `products/${h}`),
    ...ARTICLES.map((a) => `blog/${a.slug}`),
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
