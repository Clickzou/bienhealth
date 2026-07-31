import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ChevronDown, ArrowLeft } from "lucide-react";
import { hasLocale, locales } from "../../dictionaries";
import { ARTICLES, getArticle, localizeArticle } from "@/lib/blog";
import { SITE_URL, pageMetadata, metaDescription } from "@/lib/seo";
import SiteHeader from "@/components/site-header";
import DiagnosticCTA from "@/components/diagnostic-cta";
import JsonLd from "@/components/json-ld";

export function generateStaticParams() {
  return locales.flatMap((lang) => ARTICLES.map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const base = getArticle(slug);
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
    openGraph: { ...meta.openGraph, type: "article", publishedTime: a.date },
  };
}

function fmtDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const base = getArticle(slug);
  if (!base) notFound();
  const a = localizeArticle(base, lang);
  const ui = lang === "en"
    ? { home: "Home", journal: "The Journal", readTime: "min read", faqTitle: "Frequently asked questions", back: "Back to the Journal" }
    : { home: "Accueil", journal: "Le Journal", readTime: "min de lecture", faqTitle: "Questions fréquentes", back: "Retour au Journal" };

  const url = `${SITE_URL}/${lang}/blog/${slug}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.metaDescription,
          image: `${SITE_URL}${a.cover}`,
          datePublished: a.date,
          dateModified: a.date,
          author: { "@type": "Organization", name: "BIEN" },
          publisher: {
            "@type": "Organization",
            name: "BIEN",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-bien.png` },
          },
          mainEntityOfPage: url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: a.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: ui.home, item: `${SITE_URL}/${lang}` },
            { "@type": "ListItem", position: 2, name: ui.journal, item: `${SITE_URL}/${lang}/blog` },
            { "@type": "ListItem", position: 3, name: a.title, item: url },
          ],
        }}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <article className="mx-auto max-w-3xl">
          {/* Fil d'Ariane */}
          <nav className="text-sm text-black/55">
            <Link href={`/${lang}`} className="hover:text-black">{ui.home}</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/${lang}/blog`} className="hover:text-black">{ui.journal}</Link>
          </nav>

          {/* En-tête */}
          <p className="mt-6 inline-flex items-center rounded-full bg-bien-cream px-3 py-1 text-xs font-semibold text-black">{a.category}</p>
          <h1 className="mt-4 font-hero text-[clamp(1.76rem,4.4vw,3.08rem)] leading-[1.02] text-black">{a.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-black/55">
            <span>{fmtDate(a.date, lang)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {a.readingMinutes} {ui.readTime}</span>
          </div>

          {/* Couverture */}
          <div className="mt-7 relative aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-border bg-bien-cream">
            <Image src={a.cover} alt={a.title} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
          </div>

          {/* Corps */}
          <div className="mt-8 [&_a]:text-bien-leaf [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-black">
            <p className="text-lg text-black/80 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: a.intro }} />

            {a.blocks.map((b, i) => {
              if ("h2" in b) return <h2 key={i} className="mt-10 font-display tracking-tight text-2xl sm:text-3xl text-black">{b.h2}</h2>;
              if ("h3" in b) return <h3 key={i} className="mt-7 font-display text-lg sm:text-xl text-black">{b.h3}</h3>;
              if ("ul" in b)
                return (
                  <ul key={i} className="mt-4 space-y-2 list-disc pl-5 text-[15px] sm:text-base text-black/75 leading-relaxed">
                    {b.ul.map((li, j) => <li key={j} dangerouslySetInnerHTML={{ __html: li }} />)}
                  </ul>
                );
              return <p key={i} className="mt-4 text-[15px] sm:text-base text-black/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: b.p }} />;
            })}
          </div>

          {/* FAQ */}
          {a.faq.length > 0 && (
            <section className="mt-12 pt-10 border-t border-border">
              <h2 className="font-display tracking-tight text-2xl sm:text-3xl text-black">{ui.faqTitle}</h2>
              <div className="mt-5 space-y-3">
                {a.faq.map((f) => (
                  <details key={f.q} className="group bg-card rounded-2xl ring-1 ring-border px-5">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4">
                      <h3 className="font-display text-black">{f.q}</h3>
                      <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pb-5 -mt-0.5 text-sm text-black/75 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10">
            <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" /> {ui.back}
            </Link>
          </div>
        </article>
      </main>

      <DiagnosticCTA lang={lang} />
    </div>
  );
}
