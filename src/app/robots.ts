import type { MetadataRoute } from "next";
import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";

/**
 * Robots d'indexation des moteurs génératifs (ChatGPT, Perplexity, Claude,
 * Gemini, Copilot). Le `*` les couvre déjà, mais une autorisation nominative
 * les met à l'abri d'un durcissement futur de la règle générique, et vaut
 * déclaration explicite : la marque VEUT être citée par les IA — c'est un
 * canal de découverte à part entière sur les questions santé.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Préprod (*.vercel.app, déploiement preview) : on bloque tout le crawl pour
  // éviter le contenu dupliqué avec le domaine final.
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  // Mêmes exclusions pour tout le monde : ce qui est privé pour Google l'est
  // aussi pour les IA.
  const disallow = ["/api/", "/seo", "/fr/cart", "/en/cart", "/fr/compte", "/en/compte"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
