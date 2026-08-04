"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDown, ArrowRight, Truck, ShieldCheck, Star, RefreshCw } from "lucide-react";
import { ui } from "@/lib/i18n";

/**
 * Navigation principale (desktop) avec deux méga-menus : « Nos produits »
 * (par type / par besoin + cartes + réassurance) et « À propos »
 * (histoire, presse, revendeurs + cartes). Les liens collection pointent vers
 * la boutique Shopify (bien.health/collections/*), source des produits pendant
 * la refonte.
 */

const REASSURANCE_ICONS = [Truck, ShieldCheck, Star, RefreshCw];

type MenuKey = "shop" | "about" | null;

export default function HeaderNav({ lang }: { lang: string }) {
  const t = ui(lang).chrome;
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const closeTimer = useRef<number | null>(null);

  const REASSURANCE = REASSURANCE_ICONS.map((icon, i) => ({ icon, ...t.reassurance[i] }));

  const BY_TYPE = [
    { label: t.gummies, href: `/${lang}/collections/gummies` },
    { label: t.powders, href: `/${lang}/collections/nos-poudres` },
    { label: t.accessories, href: `/${lang}/collections/nos-accessoires` },
    { label: t.allProducts, href: `/${lang}/boutique` },
  ];

  const BY_NEED = [
    { label: t.needPerformance, href: `/${lang}/collections/performance-et-vitalite` },
    { label: t.needSleep, href: `/${lang}/collections/serenite` },
    { label: t.needFocus, href: `/${lang}/collections/concentration` },
    { label: t.needBeauty, href: `/${lang}/collections/beaute-et-bien-etre` },
  ];

  const SHOP_FEATURED = [
    { label: "FOCUS", cta: t.discover, href: `/${lang}/products/focus`, img: "/brand/focus.png" },
    { label: "POWER", cta: t.discover, href: `/${lang}/products/power`, img: "/brand/power.jpg" },
  ];

  const ABOUT_LINKS = [
    { label: t.story, href: `/${lang}/histoire` },
    { label: t.press, href: `/${lang}/presse` },
    { label: t.resellers, href: `/${lang}/revendeurs` },
  ];

  const ABOUT_FEATURED = [
    { label: t.press, cta: t.discover, href: `/${lang}/presse`, img: "/brand/calm.jpg" },
    { label: t.resellers, cta: t.discover, href: `/${lang}/revendeurs`, img: "/revendeurs.jpg" },
  ];

  const LINKS = [
    { label: t.ingredients, href: `/${lang}/ingredients` },
    { label: t.compliance, href: `/${lang}/certifications` },
    { label: t.diagnostic, href: `/${lang}/diagnostic` },
    { label: t.reviews, href: `/${lang}/avis` },
    { label: t.blog, href: `/${lang}/blog` },
  ];

  function open(key: Exclude<MenuKey, null>) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }
  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
  }

  return (
    // gap réduit en lg : la nav est centrée sur l'axe de la page, elle doit
    // tenir entre le logo et le bloc de droite sur un 13".
    <nav className="flex items-center justify-center gap-5 xl:gap-7">
      {/* Nos produits — méga-menu.
          Le panneau n'est PAS positionné par rapport au bouton (il déborderait
          de l'écran) mais par rapport au conteneur de la nav, lui-même centré
          sur la page (site-header.tsx) : il reste donc toujours centré et cadré. */}
      <div onMouseEnter={() => open("shop")} onMouseLeave={scheduleClose}>
        <button
          type="button"
          aria-expanded={openMenu === "shop"}
          aria-haspopup="true"
          onClick={() => setOpenMenu((v) => (v === "shop" ? null : "shop"))}
          className="flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black transition-colors"
        >
          {t.products}
          <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "shop" ? "rotate-180" : ""}`} />
        </button>

        {openMenu === "shop" && (
          <div onMouseEnter={() => open("shop")} onMouseLeave={scheduleClose} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
            <div className="w-[min(1040px,calc(100vw-2rem))] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl bg-card ring-1 ring-border bien-shadow p-7 animate-[bien-fade-up_0.25s_ease]">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1.4fr] gap-7">
                {/* Par type de produits */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">{t.byType}</p>
                  <ul className="mt-4 space-y-2.5">
                    {BY_TYPE.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-black hover:text-bien-leaf transition-colors">
                          {item.label}
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Par besoin */}
                <div className="lg:border-l lg:border-border lg:pl-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">{t.byNeed}</p>
                  <ul className="mt-4 space-y-2.5">
                    {BY_NEED.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-black hover:text-bien-leaf transition-colors">
                          {item.label}
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cartes mises en avant */}
                <div className="grid grid-cols-2 gap-3">
                  {SHOP_FEATURED.map((card) => (
                    <a key={card.label} href={card.href} className="group relative overflow-hidden rounded-2xl ring-1 ring-border aspect-[3/4]">
                      <Image src={card.img} alt={card.label} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute inset-0 bg-gradient-to-t from-bien-forest/70 via-bien-forest/10 to-transparent" />
                      <span className="absolute bottom-3 left-3 right-3 text-bien-cream">
                        <span className="block font-display text-base leading-none">{card.label}</span>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-bien-cream/90">{card.cta} <ArrowRight className="h-3 w-3" /></span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Bande de réassurance */}
              <ul className="mt-7 pt-6 border-t border-border grid grid-cols-2 lg:grid-cols-4 gap-4">
                {REASSURANCE.map(({ icon: Icon, title, sub }) => (
                  <li key={title} className="flex items-center gap-3">
                    <span className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-bien-leaf/12 text-bien-leaf"><Icon className="h-4.5 w-4.5" /></span>
                    <span className="leading-tight">
                      <span className="block text-[13px] font-semibold text-black">{title}</span>
                      <span className="block text-[11px] text-black/55">{sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* À propos — méga-menu (même ancrage que « Nos produits »). */}
      <div onMouseEnter={() => open("about")} onMouseLeave={scheduleClose}>
        <button
          type="button"
          aria-expanded={openMenu === "about"}
          aria-haspopup="true"
          onClick={() => setOpenMenu((v) => (v === "about" ? null : "about"))}
          className="flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black transition-colors"
        >
          {t.about}
          <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "about" ? "rotate-180" : ""}`} />
        </button>

        {openMenu === "about" && (
          <div onMouseEnter={() => open("about")} onMouseLeave={scheduleClose} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
            <div className="w-[min(880px,calc(100vw-2rem))] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl bg-card ring-1 ring-border bien-shadow p-7 grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-7 animate-[bien-fade-up_0.25s_ease]">
              {/* Liens */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">{t.brand}</p>
                <ul className="mt-4 space-y-2.5">
                  {ABOUT_LINKS.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-black hover:text-bien-leaf transition-colors">
                        {item.label}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cartes mises en avant */}
              <div className="grid grid-cols-2 gap-3">
                {ABOUT_FEATURED.map((card) => (
                  <a key={card.label} href={card.href} className="group relative overflow-hidden rounded-2xl ring-1 ring-border aspect-[4/3]">
                    <Image src={card.img} alt={card.label} fill sizes="260px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute inset-0 bg-gradient-to-t from-bien-forest/70 via-bien-forest/10 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-bien-cream">
                      <span className="block font-display text-sm leading-tight">{card.label}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-bien-cream/90">{card.cta} <ArrowRight className="h-3 w-3" /></span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liens simples */}
      {LINKS.map((n) => (
        <a key={n.label} href={n.href} className="text-sm font-medium text-black/80 hover:text-black transition-colors">
          {n.label}
        </a>
      ))}
    </nav>
  );
}
