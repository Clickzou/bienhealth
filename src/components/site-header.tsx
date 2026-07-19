import Image from "next/image";
import { Star, Search, User, ShoppingBag } from "lucide-react";
import HeaderNav from "./header-nav";
import LanguageToggle from "./language-toggle";
import CartBadge from "./cart-badge";
import MobileMenu from "./mobile-menu";
import { ui } from "@/lib/i18n";

/**
 * En-tête global du site (barre d'offre + header sticky avec méga-menu).
 * Partagé entre l'accueil, la conformité, le blog… pour une navigation cohérente.
 */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SiteHeader({ lang }: { lang: string }) {
  const t = ui(lang).chrome;
  return (
    <>
      {/* Barre d'offre */}
      <div className="w-full bg-bien-forest text-bien-cream text-[11px] sm:text-sm">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-[100px] py-2.5 flex items-center gap-2 sm:gap-4">
          {/* Espaceur gauche pour équilibrer le centrage (desktop) */}
          <div className="hidden sm:block shrink-0 w-[64px]" aria-hidden />
          <span className="flex-1 min-w-0 font-medium text-center leading-snug">
            {t.offer1}
            <span className="opacity-60 mx-1.5 sm:mx-2">·</span>
            <span className="hidden sm:inline">{t.offer2}<span className="opacity-60 mx-2">·</span></span>
            {t.offerCode} <span className="font-bold text-bien-citrus tracking-wider">BACKTOMUSH</span>
          </span>
          <div className="shrink-0 flex items-center gap-3 sm:gap-4">
            <LanguageToggle current={lang} />
            <a
              href="https://www.instagram.com/bien.health/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram BIEN"
              className="hover:text-bien-gold transition-colors"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] h-16 sm:h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <a href={`/${lang}`} className="flex items-center" aria-label="BIEN — accueil">
            <Image src="/brand/logo-bien.png" alt="BIEN" width={118} height={37} priority className="h-6 sm:h-7 w-auto" />
          </a>
          <div className="flex items-center justify-center">
            <HeaderNav lang={lang} />
            <MobileMenu lang={lang} />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden xl:flex items-center gap-2 rounded-full bg-bien-cream px-3 py-1.5 mr-1">
              <Star className="h-4 w-4 fill-bien-star text-bien-star" />
              <span className="text-xs font-semibold text-black">4,4/5 · <span className="font-normal opacity-70">+100 {t.reviewsBadge}</span></span>
            </div>
            <a href={`/${lang}/collections/accessories`} className="hidden lg:inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-4 lg:px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition bien-shadow-sm">{t.shop}</a>
            <button aria-label={t.search} className="hidden lg:inline-flex p-2 rounded-full hover:bg-bien-cream transition-colors"><Search className="h-5 w-5 text-black" /></button>
            <a href={`/${lang}/compte`} aria-label={t.account} className="p-2 rounded-full hover:bg-bien-cream transition-colors"><User className="h-5 w-5 text-black" /></a>
            <a href={`/${lang}/cart`} aria-label={t.cart} className="relative p-2 rounded-full hover:bg-bien-cream transition-colors">
              <ShoppingBag className="h-5 w-5 text-black" />
              <CartBadge />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
