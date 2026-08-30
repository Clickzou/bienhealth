import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import NewsletterPopup from "@/components/newsletter-popup";
import SiteFooter from "@/components/site-footer";
import CookieBanner from "@/components/cookie-banner";
import JsonLd from "@/components/json-ld";
import GoogleAnalytics from "@/components/google-analytics";
import MetaPixel from "@/components/meta-pixel";

// Fontes de la charte « Brand Refresh V2 » — auto-hébergées via next/font/local.
// Licences dans src/app/fonts/LICENSES/.
// Dahlia Medium Condensed (H1) — source otf, next/font génère le woff2.
const display = localFont({
  src: "../fonts/Dahlia-MediumCondensed.otf",
  variable: "--font-dahlia",
  weight: "500",
  display: "swap",
});

// Season Serif Regular — police display de la marque, utilisée en poids 500
// (hero H1, titres de section H2/H3, titres sous icônes).
const title = localFont({
  src: "../fonts/SeasonSerif-Regular.otf",
  variable: "--font-season",
  weight: "500",
  display: "swap",
});

// Moderat (H4, corps de texte, boutons) — Regular / Italic / Bold.
const body = localFont({
  src: [
    { path: "../fonts/Moderat-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Moderat-Regular-Italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/Moderat-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-moderat",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  // Valeurs par défaut du site. Chaque page redéfinit ses propres canonical /
  // Open Graph via `pageMetadata` (cf. src/lib/seo.ts).
  return {
    applicationName: "BIEN health",
    ...pageMetadata({
      lang,
      path: "",
      title: dict.meta.title,
      description: dict.meta.description,
      imageAlt: "BIEN health, compléments naturels",
    }),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${display.variable} ${title.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "BIEN health",
            legalName: "BIEN Health France SAS",
            url: SITE_URL,
            logo: `${SITE_URL}/brand/logo-bien.png`,
            email: "info@bien.health",
            telephone: "+33638621213",
            // sameAs sert autant à Google qu'aux moteurs génératifs : c'est ce qui
            // relie la marque à ses profils et en fait une entité identifiable.
            sameAs: [
              "https://www.instagram.com/bien.health/",
              "https://www.tiktok.com/@bien.health",
              "https://fr.linkedin.com/company/bien-health",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "100 Rue du Verbial",
              postalCode: "81000",
              addressLocality: "Albi",
              addressCountry: "FR",
            },
          }}
        />
        {/* <main> et non <div> : c'est le repère principal attendu par les
            lecteurs d'écran pour sauter directement au contenu. */}
        <main className="flex-1">{children}</main>
        <SiteFooter lang={lang} />
        <NewsletterPopup />
        <CookieBanner lang={lang} />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
