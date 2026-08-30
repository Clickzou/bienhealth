import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import BlogListing from "@/components/blog-listing";
import { blogPageCount } from "@/lib/blog-pages";
import { ARTICLES, localizeArticle } from "@/lib/blog";

/**
 * Index du blog, partagé par `/blog` et `/blog/page/N`.
 *
 * La pagination passe par de vraies URL, et non par un bouton « voir plus » :
 * un chargement en JavaScript n'ajoute rien au HTML servi, si bien que les
 * articles au-delà de la première page n'étaient reliés à cette page par aucun
 * lien explorable — Google ne les atteignait que par le sitemap.
 */

export function blogHero(lang: string) {
  return lang === "en"
    ? {
        eyebrow: "The Journal",
        intro: "Insights, tips and science on adaptogens and functional mushrooms, to live everyday life better.",
      }
    : {
        eyebrow: "Le Journal",
        intro: "Décryptages, conseils et science des adaptogènes et champignons fonctionnels, pour mieux vivre le quotidien.",
      };
}

export default function BlogIndex({ lang, page }: { lang: string; page: number }) {
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";
  const hero = blogHero(lang);

  const items = ARTICLES.map((base) => {
    const a = localizeArticle(base, lang);
    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      date: a.date,
      readingMinutes: a.readingMinutes,
      cover: a.cover,
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 sm:pt-20 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.55_0.13_75)]">
          <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
        </span>
        <h1 className="mt-5 font-hero text-[clamp(2.2rem,5.28vw,3.96rem)] leading-[0.95] text-black">
          {en ? "The " : "Le "}
          <span className="text-bien-leaf">{en ? "BIEN Journal" : "Journal BIEN"}</span>
          {page > 1 && <span className="text-black/35"> — {en ? `page ${page}` : `page ${page}`}</span>}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">{hero.intro}</p>
      </section>

      {/* Recherche + tri + grille paginée */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-14 sm:mt-20 mb-24">
        <BlogListing items={items} lang={lang} page={page} totalPages={blogPageCount()} />
      </section>
    </div>
  );
}
