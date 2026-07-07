import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import BlogListing from "@/components/blog-listing";
import { ARTICLES, localizeArticle } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en"
    ? { title: "The BIEN Journal — adaptogens & wellbeing", description: "Insights, tips and science on adaptogens and functional mushrooms by BIEN: stress, sleep, focus, energy and natural beauty." }
    : { title: "Le Journal BIEN — adaptogènes & bien-être", description: "Décryptages, conseils et science des adaptogènes et champignons fonctionnels par BIEN : stress, sommeil, concentration, énergie et beauté au naturel." };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";

  const items = ARTICLES.map((base) => {
    const a = localizeArticle(base, lang);
    return { slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category, date: a.date, readingMinutes: a.readingMinutes, cover: a.cover };
  });

  const hero = en
    ? { eyebrow: "The Journal", intro: "Insights, tips and science on adaptogens and functional mushrooms — to live everyday life better." }
    : { eyebrow: "Le Journal", intro: "Décryptages, conseils et science des adaptogènes et champignons fonctionnels — pour mieux vivre le quotidien." };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-20 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.55_0.13_75)]">
          <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
        </span>
        <h1 className="mt-5 font-display font-black tracking-tighter text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-black">
          {en ? "The " : "Le "}<span className="text-bien-leaf">{en ? "BIEN Journal" : "Journal BIEN"}</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          {hero.intro}
        </p>
      </section>

      {/* Recherche + tri + grille (client) */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-14 sm:mt-20 mb-24">
        <BlogListing items={items} lang={lang} />
      </section>
    </div>
  );
}
