import Image from "next/image";
import FooterCredit from "./footer-credit";

/**
 * Pied de page global du site (partagé par toutes les pages via le layout).
 * Palette forêt/crème, coordonnées légales, liens d'aide & mentions, sélecteur de langue.
 */
export default function SiteFooter({ lang }: { lang: string }) {
  return (
    <footer className="mt-24 bg-bien-forest text-bien-cream">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <Image src="/brand/logo-bien.png" alt="BIEN" width={130} height={41} className="h-9 w-auto invert brightness-0" />
            <p className="mt-4 text-sm text-bien-cream/70 leading-relaxed max-w-xs">Compléments naturels aux adaptogènes et champignons fonctionnels, fabriqués en France.</p>
            <div className="mt-6 text-sm text-bien-cream/70 space-y-1.5">
              <p className="font-semibold text-bien-cream">SAS BIEN HEALTH FRANCE</p>
              <p>100 Rue du Verbial, 81000 Albi</p>
              <p><a href="tel:+33638621213" className="hover:text-bien-gold">+33 6 38 62 12 13</a></p>
              <p><a href="mailto:info@bien.health" className="hover:text-bien-gold">info@bien.health</a></p>
            </div>
          </div>
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-bien-gold">Aide</h4>
            <ul className="mt-5 space-y-3 text-sm text-bien-cream/80">
              <li><a href={`/${lang}/compte`} className="hover:text-bien-gold">Contact</a></li>
              <li><a href={`/${lang}/certifications`} className="hover:text-bien-gold">Livraison</a></li>
              <li><a href={`/${lang}/certifications`} className="hover:text-bien-gold">Retours</a></li>
              <li><a href={`/${lang}#faq`} className="hover:text-bien-gold">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-bien-gold">Légal</h4>
            <ul className="mt-5 space-y-3 text-sm text-bien-cream/80">
              <li><a href={`/${lang}/certifications`} className="hover:text-bien-gold">Conformité &amp; certifications</a></li>
              <li><a href={`/${lang}/mentions-legales`} className="hover:text-bien-gold">Mentions légales</a></li>
              <li><a href={`/${lang}/cgv`} className="hover:text-bien-gold">CGV</a></li>
              <li><a href={`/${lang}/confidentialite`} className="hover:text-bien-gold">Confidentialité</a></li>
              <li><a href={`/${lang}/cookies`} className="hover:text-bien-gold">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-bien-gold">Langue</h4>
            <div className="mt-5 inline-flex rounded-full bg-bien-cream/10 p-1 text-sm">
              <a href="/fr" className={`rounded-full px-3.5 py-1.5 ${lang === "fr" ? "bg-bien-gold text-black font-semibold" : "text-bien-cream/80 hover:text-bien-cream"}`}>FR</a>
              <a href="/en" className={`rounded-full px-3.5 py-1.5 ${lang === "en" ? "bg-bien-gold text-black font-semibold" : "text-bien-cream/80 hover:text-bien-cream"}`}>EN</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-bien-cream/15 text-xs text-bien-cream/55 leading-relaxed">
          <p>Compléments alimentaires. Ne se substituent pas à une alimentation variée et équilibrée. Ne pas dépasser la dose journalière recommandée. Allégations conformes au règlement EFSA.</p>
          <p className="mt-3">© 2026 BIEN Health France — Tous droits réservés.</p>
          <FooterCredit lang={lang} />
        </div>
      </div>
    </footer>
  );
}
