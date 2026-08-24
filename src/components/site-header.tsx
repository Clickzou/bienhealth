import Image from "next/image";
import { Star, Search, User, ShoppingBag } from "lucide-react";
import HeaderNav from "./header-nav";
import LanguageToggle from "./language-toggle";
import CartBadge from "./cart-badge";
import MobileMenu from "./mobile-menu";
import { ui } from "@/lib/i18n";
import { getReviewCount, ratingLabel } from "@/lib/social-proof";
import { SOCIALS } from "./socials";

/**
 * En-tête global du site (barre d'offre + header sticky avec méga-menu).
 * Partagé entre l'accueil, la conformité, le blog… pour une navigation cohérente.
 */


export default async function SiteHeader({ lang }: { lang: string }) {
  const t = ui(lang).chrome;
  // Nombre d'avis clients réel (Loox, via les metafields Shopify) : « +100 »
  // était un ordre de grandeur, invérifiable.
  const reviews = await getReviewCount();
  return (
    <>
      {/* Barre d'offre — réseaux à gauche, note boutique au centre, langues à
          droite (demande client du 24/08/2026). La note vivait dans le header,
          où elle ne s'affichait qu'au-delà de 1536 px : jamais sur un 13"/15",
          d'où le « toujours pas » du client. */}
      <div className="w-full bg-bien-forest text-bien-cream text-[11px] sm:text-sm">
        {/* Même gouttière que le header en dessous, sinon les langues ne
            s'alignent plus sur le panier. Les deux colonnes latérales sont en
            `flex-1` : sans cela la note serait centrée sur l'espace restant,
            pas sur l'axe de la page. */}
        <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-12 xl:px-16 py-2.5 flex items-center gap-2 sm:gap-4">
          <div className="flex-1 flex items-center gap-3 sm:gap-4">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-bien-gold transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a
            href={`/${lang}/avis`}
            className="shrink-0 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            title={t.reviewsTitle}
          >
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-bien-star text-bien-star" />
            <span className="font-semibold">{ratingLabel(lang)}/5</span>
            <span className="hidden md:inline opacity-70 font-normal">{reviews} {t.reviewsBadge}</span>
          </a>
          <div className="flex-1 flex justify-end">
            <LanguageToggle current={lang} />
          </div>
        </div>
      </div>

      {/* Signature de marque — second bandeau, rose sur texte noir (demande
          client) : le pink n'est interdit qu'en *texte* sur fond clair, en
          aplat sous du noir il monte à 13:1. Elle a quitté la barre navy, qui
          porte désormais réseaux / note / langues. */}
      <div className="w-full bg-bien-pink text-black text-[11px] sm:text-sm font-medium text-center leading-snug px-3 py-2">
        <span className="font-bold">{t.taglineBrand}</span> {t.taglineRest}
      </div>

      {/* Header */}
      {/* Fond opaque : en translucide, le titre du hero restait visible « au
          travers » du header et donnait l'impression d'être coupé en deux. */}
      <header className="sticky top-0 z-40 w-full bg-background border-b border-border/60">
        {/* La nav occupe la colonne `1fr` et s'y centre : elle est donc à égale
            distance du logo et du bloc de droite (demande client). Centrée sur
            l'axe de la page, elle laissait ~300px de blanc à gauche contre ~20px
            à droite, le bloc de droite étant bien plus large que le logo.
            La grille garantit aussi qu'aucune colonne ne peut en recouvrir une
            autre. `relative` sert d'ancre aux méga-menus : eux restent centrés
            sur ce conteneur, donc cadrés à l'écran sous 1600px. */}
        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-16 h-16 sm:h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <a href={`/${lang}`} className="flex items-center">
            <Image src="/brand/logo-bien.png" alt="BIEN" width={118} height={37} priority className="h-6 sm:h-7 w-auto" />
            <span className="sr-only">{t.home}</span>
          </a>
          <div className="flex items-center justify-center">
            <HeaderNav lang={lang} />
          </div>
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            {/* La note boutique vit maintenant dans la barre d'offre : ici elle
                ne s'affichait qu'au-delà de 1536 px et, en dessous, ses ~155 px
                poussaient la nav hors de l'axe central. */}
            <a href={`/${lang}/boutique`} className="hidden lg:inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-4 lg:px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition bien-shadow-sm">{t.shop}</a>
            {/* Les liens en icône seule portent un libellé `sr-only` : sans texte
                d'ancrage, lecteurs d'écran et crawlers affichent l'URL brute
                (« /fr/compte ») à la place du libellé. */}
            <button aria-label={t.search} className="hidden lg:inline-flex p-2 rounded-full hover:bg-bien-cream transition-colors"><Search className="h-5 w-5 text-black" /></button>
            <a href={`/${lang}/compte`} className="p-2 rounded-full hover:bg-bien-cream transition-colors">
              <User className="h-5 w-5 text-black" />
              <span className="sr-only">{t.account}</span>
            </a>
            <a href={`/${lang}/cart`} className="relative p-2 rounded-full hover:bg-bien-cream transition-colors">
              <ShoppingBag className="h-5 w-5 text-black" />
              <span className="sr-only">{t.cart}</span>
              <CartBadge />
            </a>
            {/* Burger à droite (convention mobile) : dans la colonne centrale,
                il se retrouvait seul au milieu de l'écran sous le breakpoint lg. */}
            <MobileMenu lang={lang} />
          </div>
        </div>
      </header>
    </>
  );
}
