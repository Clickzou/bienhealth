"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, ShoppingBag, User, ArrowRight } from "lucide-react";
import { ui } from "@/lib/i18n";

/** Menu mobile (drawer) — navigation complète sous le breakpoint lg. */
export default function MobileMenu({ lang }: { lang: string }) {
  const t = ui(lang).chrome;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Verrouille le scroll de la page quand le menu est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const l = (p: string) => `/${lang}${p}`;

  const BY_TYPE = [
    { label: t.gummies, href: l("/collections/gummies") },
    { label: t.powders, href: l("/collections/nos-poudres") },
    { label: t.accessories, href: l("/collections/nos-accessoires") },
    { label: t.allProducts, href: l("/boutique") },
  ];
  const BY_NEED = [
    { label: t.needPerformance, href: l("/collections/performance-et-vitalite") },
    { label: t.needSleep, href: l("/collections/serenite") },
    { label: t.needFocus, href: l("/collections/concentration") },
    { label: t.needBeauty, href: l("/collections/beaute-et-bien-etre") },
  ];
  const ABOUT = [
    { label: t.story, href: l("/histoire") },
    { label: t.press, href: l("/presse") },
    { label: t.resellers, href: l("/revendeurs") },
  ];
  const SIMPLE = [
    { label: t.ingredients, href: l("/ingredients") },
    { label: t.compliance, href: l("/certifications") },
    { label: t.diagnostic, href: l("/diagnostic") },
    { label: t.reviews, href: l("/avis") },
    { label: t.blog, href: l("/blog") },
  ];

  return (
    <>
      <button
        aria-label={t.openMenu}
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-full hover:bg-bien-cream"
      >
        <Menu className="h-5 w-5 text-black" />
      </button>

      {open && mounted && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100]">
          <button aria-label={t.closeMenu} onClick={() => setOpen(false)} className="absolute inset-0 bg-bien-forest/40 backdrop-blur-sm" />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-background shadow-xl flex flex-col animate-[bien-fade-up_0.25s_ease]">
            <div className="flex items-center justify-between px-5 h-16 border-b border-border">
              <span className="font-display text-black">{t.menu}</span>
              <button aria-label={t.closeMenu} onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-bien-cream">
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
              <a href={l("/boutique")} className="flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-5 py-3 font-bold">
                <ShoppingBag className="h-4 w-4" /> {t.shop}
              </a>

              <MobileGroup title={t.products}>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-bien-sage">{t.byType}</p>
                {BY_TYPE.map((i) => <MobileLink key={i.href} {...i} />)}
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-bien-sage">{t.byNeed}</p>
                {BY_NEED.map((i) => <MobileLink key={i.href} {...i} />)}
              </MobileGroup>

              <MobileGroup title={t.about}>
                {ABOUT.map((i) => <MobileLink key={i.href} {...i} />)}
              </MobileGroup>

              <div className="mt-2 border-t border-border pt-2">
                {SIMPLE.map((i) => (
                  <a key={i.href} href={i.href} className="block py-3 font-display text-black">{i.label}</a>
                ))}
              </div>

              <div className="mt-2 border-t border-border pt-4 flex items-center gap-3">
                <a href={l("/compte")} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-border px-4 py-2.5 text-sm font-semibold text-black">
                  <User className="h-4 w-4" /> {t.account}
                </a>
                <a href={l("/cart")} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-border px-4 py-2.5 text-sm font-semibold text-black">
                  <ShoppingBag className="h-4 w-4" /> {t.cart}
                </a>
              </div>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border">
      <summary className="flex items-center justify-between gap-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-3.5 font-display text-black">
        {title}
        <ChevronDown className="h-5 w-5 text-bien-leaf transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}

function MobileLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="flex items-center justify-between gap-2 py-2 text-[15px] text-black/80">
      {label}
      <ArrowRight className="h-4 w-4 text-black/30" />
    </a>
  );
}
