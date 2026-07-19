import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { SITE_URL } from "@/lib/seo";
import NewsletterPopup from "@/components/newsletter-popup";
import SiteFooter from "@/components/site-footer";
import CookieBanner from "@/components/cookie-banner";
import JsonLd from "@/components/json-ld";
import GoogleAnalytics from "@/components/google-analytics";

// Fontes de la charte « Brand Refresh V2 » — auto-hébergées via next/font/local.
// Licences dans src/app/fonts/LICENSES/.
// Dahlia Medium Condensed (H1) — fichier web woff2 fourni.
const display = localFont({
  src: "../fonts/Dahlia-MediumCondensed.woff2",
  variable: "--font-dahlia",
  weight: "500",
  display: "swap",
});

// Season Serif Regular (H2 / H3) — un seul graisse (400).
const title = localFont({
  src: "../fonts/SeasonSerif-Regular.otf",
  variable: "--font-season",
  weight: "400",
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
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: "BIEN",
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "BIEN",
      locale: lang === "en" ? "en_US" : "fr_FR",
      url: `/${lang}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/brand/bien-health.png", width: 1200, height: 630, alt: "BIEN — compléments naturels" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/brand/bien-health.png"],
    },
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
            name: "BIEN",
            legalName: "BIEN Health France SAS",
            url: SITE_URL,
            logo: `${SITE_URL}/brand/logo-bien.png`,
            email: "info@bien.health",
            telephone: "+33638621213",
            sameAs: ["https://www.instagram.com/bien.health/"],
            address: {
              "@type": "PostalAddress",
              streetAddress: "100 Rue du Verbial",
              postalCode: "81000",
              addressLocality: "Albi",
              addressCountry: "FR",
            },
          }}
        />
        <div className="flex-1">{children}</div>
        <SiteFooter lang={lang} />
        <NewsletterPopup />
        <CookieBanner lang={lang} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
