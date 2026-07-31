import type { MetadataRoute } from "next";
import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Préprod (*.vercel.app, déploiement preview) : on bloque tout le crawl pour
  // éviter le contenu dupliqué avec le domaine final.
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pages sans valeur SEO / privées.
      disallow: ["/api/", "/fr/cart", "/en/cart", "/fr/compte", "/en/compte"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
