import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { SITE_URL } from "@/lib/seo";
import NewsletterPopup from "@/components/newsletter-popup";
import SiteFooter from "@/components/site-footer";
import CookieBanner from "@/components/cookie-banner";
import JsonLd from "@/components/json-ld";
import GoogleAnalytics from "@/components/google-analytics";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang={lang} className={`${display.variable} ${body.variable} h-full`}>
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
