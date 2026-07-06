"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDown, ArrowRight, Truck, ShieldCheck, Star, RefreshCw } from "lucide-react";

/**
 * Navigation principale (desktop) avec deux méga-menus : « Nos produits »
 * (par type / par besoin + cartes + réassurance) et « À propos »
 * (histoire, presse, revendeurs + cartes). Les liens collection pointent vers
 * la boutique Shopify (bien.health/collections/*), source des produits pendant
 * la refonte.
 */

const REASSURANCE = [
  { icon: Truck, title: "Livraison offerte", sub: "dès 49 € d'achat" },
  { icon: ShieldCheck, title: "Paiement sécurisé", sub: "Visa, Mastercard" },
  { icon: Star, title: "+1000 clients", sub: "satisfaits" },
  { icon: RefreshCw, title: "Satisfait ou remboursé", sub: "sous 30 jours" },
];

type MenuKey = "shop" | "about" | null;

export default function HeaderNav({ lang }: { lang: string }) {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const closeTimer = useRef<number | null>(null);

  const BY_TYPE = [
    { label: "Gummies", href: `/${lang}/collections/gummies` },
    { label: "Poudres", href: `/${lang}/collections/nos-poudres` },
    { label: "Accessoires", href: `/${lang}/collections/nos-accessoires` },
    { label: "Tous les produits", href: `/${lang}/collections/accessories` },
  ];

  const BY_NEED = [
    { label: "Performance & Vitalité", href: `/${lang}/collections/performance-et-vitalite` },
    { label: "Sommeil & Gestion du stress", href: `/${lang}/collections/serenite` },
    { label: "Concentration & Clarté Mentale", href: `/${lang}/collections/concentration` },
    { label: "Beauté & Régulation Hormonale", href: `/${lang}/collections/beaute-et-bien-etre` },
  ];

  const SHOP_FEATURED = [
    { label: "FOCUS", cta: "Découvrir", href: `/${lang}/products/focus`, img: "/brand/focus.png" },
    { label: "POWER", cta: "Découvrir", href: `/${lang}/products/power`, img: "/brand/power.jpg" },
  ];

  const ABOUT_LINKS = [
    { label: "Notre histoire", href: `/${lang}/histoire` },
    { label: "La presse en parle", href: `/${lang}/presse` },
    { label: "Nos revendeurs", href: `/${lang}/revendeurs` },
  ];

  const ABOUT_FEATURED = [
    { label: "La presse en parle", cta: "Découvrir", href: `/${lang}/presse`, img: "/brand/calm.jpg" },
    { label: "Nos revendeurs", cta: "Découvrir", href: `/${lang}/revendeurs`, img: "/brand/produits-bien-health.png" },
  ];

  const LINKS = [
    { label: "Ingrédients", href: `/${lang}/ingredients` },
    { label: "Conformité", href: `/${lang}/certifications` },
    { label: "Diagnostic", href: `/${lang}/diagnostic` },
    { label: "Avis", href: `/${lang}/avis` },
    { label: "Blog", href: `/${lang}/blog` },
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
    <nav className="hidden lg:flex items-center justify-center gap-7">
      {/* Nos produits — méga-menu */}
      <div className="relative" onMouseEnter={() => open("shop")} onMouseLeave={scheduleClose}>
        <button
          type="button"
          aria-expanded={openMenu === "shop"}
          aria-haspopup="true"
          onClick={() => setOpenMenu((v) => (v === "shop" ? null : "shop"))}
          className="flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black transition-colors"
        >
          Nos produits
          <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "shop" ? "rotate-180" : ""}`} />
        </button>

        {openMenu === "shop" && (
          <div onMouseEnter={() => open("shop")} onMouseLeave={scheduleClose} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
            <div className="w-[min(1040px,92vw)] rounded-3xl bg-card ring-1 ring-border bien-shadow p-7 animate-[bien-fade-up_0.25s_ease]">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1.4fr] gap-7">
                {/* Par type de produits */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">Par type de produits</p>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">Par besoin</p>
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
                        <span className="block font-display font-black text-base leading-none">{card.label}</span>
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

      {/* À propos — méga-menu */}
      <div className="relative" onMouseEnter={() => open("about")} onMouseLeave={scheduleClose}>
        <button
          type="button"
          aria-expanded={openMenu === "about"}
          aria-haspopup="true"
          onClick={() => setOpenMenu((v) => (v === "about" ? null : "about"))}
          className="flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black transition-colors"
        >
          À propos
          <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === "about" ? "rotate-180" : ""}`} />
        </button>

        {openMenu === "about" && (
          <div onMouseEnter={() => open("about")} onMouseLeave={scheduleClose} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
            <div className="w-[min(880px,92vw)] rounded-3xl bg-card ring-1 ring-border bien-shadow p-7 grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-7 animate-[bien-fade-up_0.25s_ease]">
              {/* Liens */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bien-sage">La marque</p>
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
                      <span className="block font-display font-black text-sm leading-tight">{card.label}</span>
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
