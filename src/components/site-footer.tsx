import Image from "next/image";
import FooterCredit from "./footer-credit";
import NewsletterForm from "./newsletter-form";
import { ui } from "@/lib/i18n";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Pied de page global du site (partagé par toutes les pages via le layout).
 * Palette forêt/crème, coordonnées légales, liens d'aide & mentions, sélecteur de langue.
 */
export default function SiteFooter({ lang }: { lang: string }) {
  const t = ui(lang).footer;
  return (
    <footer className="mt-24 bg-bien-forest text-bien-cream">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] py-14 lg:py-20">
        {/* Bandeau newsletter */}
        <div className="pb-12 mb-12 border-b border-bien-cream/15 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-md">
            <h2 className="font-display tracking-tight text-2xl sm:text-3xl text-bien-cream">{t.newsletterTitle}</h2>
            <p className="mt-2 text-sm text-bien-cream/70 leading-relaxed">{t.newsletterText}</p>
          </div>
          <div className="lg:flex-1 lg:max-w-md">
            <NewsletterForm lang={lang} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <Image src="/brand/logo-bien.png" alt="BIEN" width={130} height={41} className="h-9 w-auto invert brightness-0" />
            <p className="mt-4 text-sm text-bien-cream/70 leading-relaxed max-w-xs">{t.tagline}</p>
            <div className="mt-6 text-sm text-bien-cream/70 space-y-1.5">
              <p className="font-semibold text-bien-cream">SAS BIEN HEALTH FRANCE</p>
              <p>100 Rue du Verbial, 81000 Albi</p>
              <p><a href="tel:+33638621213" className="hover:text-bien-gold">+33 6 38 62 12 13</a></p>
              <p><a href="mailto:info@bien.health" className="hover:text-bien-gold">info@bien.health</a></p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-bien-gold">{t.helpTitle}</h3>
            <ul className="mt-5 space-y-3 text-sm text-bien-cream/80">
              <li><a href={`/${lang}/contact`} className="hover:text-bien-gold">{t.contact}</a></li>
              <li><a href={`/${lang}/livraison`} className="hover:text-bien-gold">{t.shipping}</a></li>
              <li><a href={`/${lang}/retours`} className="hover:text-bien-gold">{t.returns}</a></li>
              <li><a href={`/${lang}/faq`} className="hover:text-bien-gold">{t.faq}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-bien-gold">{t.legalTitle}</h3>
            <ul className="mt-5 space-y-3 text-sm text-bien-cream/80">
              <li><a href={`/${lang}/certifications`} className="hover:text-bien-gold">{t.compliance}</a></li>
              <li><a href={`/${lang}/mentions-legales`} className="hover:text-bien-gold">{t.legalNotice}</a></li>
              <li><a href={`/${lang}/cgv`} className="hover:text-bien-gold">{t.cgv}</a></li>
              <li><a href={`/${lang}/confidentialite`} className="hover:text-bien-gold">{t.privacy}</a></li>
              <li><a href={`/${lang}/cookies`} className="hover:text-bien-gold">{t.cookies}</a></li>
              <li><a href={`/${lang}/plan-du-site`} className="hover:text-bien-gold">{t.sitemap}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-bien-gold">{t.languageTitle}</h3>
            <div className="mt-5 inline-flex rounded-full bg-bien-cream/10 p-1 text-sm">
              <a href="/fr" className={`rounded-full px-3.5 py-1.5 ${lang === "fr" ? "bg-bien-gold text-black font-semibold" : "text-bien-cream/80 hover:text-bien-cream"}`}>FR</a>
              <a href="/en" className={`rounded-full px-3.5 py-1.5 ${lang === "en" ? "bg-bien-gold text-black font-semibold" : "text-bien-cream/80 hover:text-bien-cream"}`}>EN</a>
            </div>

            <h3 className="mt-8 font-display text-sm uppercase tracking-wider text-bien-gold">{t.socialTitle}</h3>
            <a
              href="https://www.instagram.com/bien.health/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram BIEN"
              className="mt-5 inline-flex items-center justify-center h-11 w-11 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 text-bien-cream hover:bg-bien-gold hover:text-black hover:ring-bien-gold transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-bien-cream/15 text-xs text-bien-cream/55 leading-relaxed text-center">
          <p>{t.disclaimer}</p>
          <p className="mt-3">{t.rights}</p>
          <FooterCredit lang={lang} />
        </div>
      </div>
    </footer>
  );
}
