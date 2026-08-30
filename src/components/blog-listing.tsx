"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Search, ChevronDown, X } from "lucide-react";

import { BLOG_PAGE_SIZE } from "@/lib/blog-pages";

export type BlogItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingMinutes: number;
  cover: string;
};

/* La taille de page vient de `lib/blog-pages` : exportée d'ici, elle serait
   illisible depuis un composant serveur (voir le commentaire de ce module). */

function fmtDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const T = {
  fr: { search: "Rechercher un article…", clear: "Effacer", filterCat: "Filtrer par catégorie", allCats: "Toutes les catégories", sortAria: "Trier les articles", recent: "Plus récents", older: "Plus anciens", az: "Ordre alphabétique", all: "Tout", article: "article", articles: "articles", none: "Aucun article ne correspond à votre recherche.", read: "Lire l'article", pagination: "Pages du journal", previous: "Précédent", next: "Suivant", pageLabel: "Page" },
  en: { search: "Search an article…", clear: "Clear", filterCat: "Filter by category", allCats: "All categories", sortAria: "Sort articles", recent: "Most recent", older: "Oldest", az: "Alphabetical", all: "All", article: "article", articles: "articles", none: "No article matches your search.", read: "Read the article", pagination: "Journal pages", previous: "Previous", next: "Next", pageLabel: "Page" },
} as const;

/** Adresse d'une page de l'index : la première n'est pas numérotée. */
function pageHref(lang: string, page: number): string {
  return page <= 1 ? `/${lang}/blog` : `/${lang}/blog/page/${page}`;
}

export default function BlogListing({
  items,
  lang,
  page = 1,
  totalPages = 1,
}: {
  items: BlogItem[];
  lang: string;
  page?: number;
  totalPages?: number;
}) {
  const t = T[lang === "en" ? "en" : "fr"];
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "ancien" | "az">("recent");

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [category, setCategory] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      const matchC = !category || a.category === category;
      return matchQ && matchC;
    });
    list = [...list].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, lang === "en" ? "en" : "fr");
      if (sort === "ancien") return a.date < b.date ? -1 : 1;
      return a.date < b.date ? 1 : -1; // recent
    });
    return list;
  }, [items, query, category, sort, lang]);

  // Une recherche, un filtre ou un tri manuel portent sur la totalité des
  // articles et sortent donc de la pagination : découper un résultat de
  // recherche en pages dont les URL ne correspondraient plus au contenu servi
  // tromperait le visiteur comme le moteur.
  const browsing = !query.trim() && !category && sort === "recent";
  const shown = browsing ? filtered.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE) : filtered;

  return (
    <>
      {/* Panneau de filtres */}
      <div className="rounded-3xl ring-1 ring-border bg-card p-4 sm:p-5 mb-10 bien-shadow-sm">
        {/* Ligne 1 : recherche + tri */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-full ring-1 ring-border bg-background pl-11 pr-10 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-bien-leaf/50"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label={t.clear} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-bien-cream">
                <X className="h-4 w-4 text-black/50" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="appearance-none w-full sm:w-auto rounded-full ring-1 ring-border bg-background pl-4 pr-10 py-3 text-sm font-medium text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-bien-leaf/50"
              aria-label={t.sortAria}
            >
              <option value="recent">{t.recent}</option>
              <option value="ancien">{t.older}</option>
              <option value="az">{t.az}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
          </div>
        </div>

        {/* Ligne 2 : catégories en pastilles */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${category === "" ? "bg-bien-forest text-bien-cream" : "ring-1 ring-border text-black/70 hover:bg-bien-cream"}`}
          >
            {t.all}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${category === c ? "bg-bien-forest text-bien-cream" : "ring-1 ring-border text-black/70 hover:bg-bien-cream"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Compteur de résultats */}
      <p className="mb-6 text-sm text-black/55">
        {filtered.length} {filtered.length > 1 ? t.articles : t.article}
        {category && (
          <>
            {" "}
            · <span className="font-medium text-black/75">{category}</span>
          </>
        )}
        {browsing && totalPages > 1 && (
          <>
            {" "}
            · {t.pageLabel} {page}/{totalPages}
          </>
        )}
      </p>

      {shown.length === 0 ? (
        <p className="text-center text-black/60 py-16">{t.none}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {shown.map((a) => (
            <article key={a.slug} className="group bg-card rounded-3xl ring-1 ring-border hover:ring-bien-leaf/40 hover:-translate-y-1 transition-all bien-shadow-sm overflow-hidden flex flex-col">
              <Link href={`/${lang}/blog/${a.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                <Image src={a.cover} alt={a.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 rounded-full bg-bien-cream/90 px-3 py-1 text-[11px] font-semibold text-black">{a.category}</span>
              </Link>
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <Link href={`/${lang}/blog/${a.slug}`}>
                  <h2 className="font-display text-lg sm:text-xl text-black leading-tight hover:text-bien-leaf transition-colors">{a.title}</h2>
                </Link>
                <p className="mt-2 text-sm text-black/70 leading-relaxed flex-1">{a.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-black/50">
                  <span>{fmtDate(a.date, lang)}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.readingMinutes} min</span>
                </div>
                <Link href={`/${lang}/blog/${a.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bien-leaf group-hover:gap-2.5 transition-all">
                  {t.read} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {browsing && totalPages > 1 && (
        <nav aria-label={t.pagination} className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={pageHref(lang, page - 1)}
              rel="prev"
              className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-border px-4 py-2.5 text-sm font-medium text-black/70 hover:bg-bien-cream transition"
            >
              <ArrowLeft className="h-4 w-4" /> {t.previous}
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span
                key={n}
                aria-current="page"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-bien-forest px-3.5 text-sm font-semibold text-bien-cream"
              >
                {n}
              </span>
            ) : (
              <Link
                key={n}
                href={pageHref(lang, n)}
                aria-label={`${t.pageLabel} ${n}`}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full ring-1 ring-border px-3.5 text-sm font-medium text-black/70 hover:bg-bien-cream transition"
              >
                {n}
              </Link>
            ),
          )}

          {page < totalPages && (
            <Link
              href={pageHref(lang, page + 1)}
              rel="next"
              className="inline-flex items-center gap-1.5 rounded-full bg-bien-forest text-bien-cream px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition"
            >
              {t.next} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
