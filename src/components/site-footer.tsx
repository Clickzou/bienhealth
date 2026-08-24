import Image from "next/image";
import { ExternalLink } from "lucide-react";
import FooterCredit from "./footer-credit";
import NewsletterForm from "./newsletter-form";
import { accentLastWord } from "@/lib/accent-title";
import { ui } from "@/lib/i18n";
import { SOCIALS } from "./socials";

/**
 * Associations soutenues par la marque. `label` pointe vers la traduction
 * (`ui(lang).footer`), les dimensions sont celles des fichiers détourés.
 */
const COMMITMENTS = [
  {
    href: "https://team-planet.com/fr",
    name: "Team for the Planet",
    logo: "/brand/assoc/team-for-the-planet.webp",
    width: 376,
    height: 299,
    label: "commitmentPlanet",
  },
  {
    href: "https://www.hopitalsourire.com",
    name: "Hôpital Sourire",
    logo: "/brand/assoc/hopital-sourire.webp",
    width: 271,
    height: 366,
    label: "commitmentChildren",
  },
] as const;

/**
 * Pied de page global du site (partagé par toutes les pages via le layout).
 * Palette forêt/crème, coordonnées légales, liens d'aide & mentions, sélecteur de langue.
 */
export default function SiteFooter({ lang }: { lang: string }) {
  const t = ui(lang).footer;
  return (
    <footer className="mt-24 bg-bien-forest text-bien-cream">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-16 py-14 lg:py-20">
        {/* Bandeau newsletter */}
        <div className="pb-12 mb-12 border-b border-bien-cream/15 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-md">
            {/* Fond navy : le rose de charte s'y lit à 11:1, c'est le seul
                endroit du site où il peut servir de couleur de texte. */}
            <h2 className="font-display tracking-tight text-2xl sm:text-3xl text-bien-cream">{accentLastWord(t.newsletterTitle, { onDark: true })}</h2>
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
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 text-bien-cream hover:bg-bien-gold hover:text-black hover:ring-bien-gold transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Engagements associatifs — logos officiels fournis par le client.
            Les deux fichiers sont sur fond blanc (aucune version détourée ni
            monochrome n'existe) : ils sont donc posés sur une pastille blanche
            plutôt que collés au navy, où le noir de « Team for the Planet »
            disparaîtrait. Chaque mention renvoie au site de l'association. */}
        <div className="mt-12 pt-8 border-t border-bien-cream/15 text-center">
          <h3 className="font-display text-sm uppercase tracking-wider text-bien-gold">{t.commitmentsTitle}</h3>
          <ul className="mt-5 flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-8 text-sm text-bien-cream/80">
            {COMMITMENTS.map((org) => (
              <li key={org.href}>
                <a
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl bg-bien-cream/5 ring-1 ring-bien-cream/10 p-2.5 pr-4 hover:bg-bien-cream/10 transition-colors"
                >
                  <span className="shrink-0 grid place-items-center h-14 w-14 rounded-xl bg-white p-2">
                    <Image src={org.logo} alt={org.name} width={org.width} height={org.height} className="max-h-full w-auto object-contain" />
                  </span>
                  <span className="text-left group-hover:text-bien-cream transition-colors">
                    {t[org.label]}
                    <ExternalLink className="inline-block ml-1.5 h-3.5 w-3.5 align-[-2px] opacity-60" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 pt-8 border-t border-bien-cream/15 text-xs text-bien-cream/55 leading-relaxed text-center">
          <p>{t.disclaimer}</p>
          <p className="mt-3">{t.rights}</p>
          <FooterCredit lang={lang} />
        </div>
      </div>
    </footer>
  );
}
