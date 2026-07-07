import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_PATHS } from "@/lib/seo";
import { getAllHandles } from "@/lib/shopify-products";
import { COLLECTIONS } from "@/lib/shop";
import { ARTICLES } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const handles = await getAllHandles().catch(() => [] as string[]);

  const paths = [
    ...STATIC_PATHS,
    ...Object.keys(COLLECTIONS).map((slug) => `collections/${slug}`),
    ...handles.map((h) => `products/${h}`),
    ...ARTICLES.map((a) => `blog/${a.slug}`),
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
