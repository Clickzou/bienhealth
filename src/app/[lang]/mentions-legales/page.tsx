import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "mentions-legales",
    title: lang === "en" ? "Legal notice | BIEN health" : "Mentions légales | BIEN health",
    description: lang === "en" ? "Legal notice for bien.health, published by Bien Health SAS, Albi, France." : "Mentions légales du site bien.health, édité par Bien Health SAS, Albi.",
  });
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  if (lang === "en") {
    return (
      <LegalLayout lang={lang} title="Legal notice">
        <h2>Site publisher</h2>
        <p>
          <strong>Bien Health SAS</strong>
          <br />Simplified joint-stock company with variable share capital
          <br />Registered office: 100 Rue du Verbial, 81000 Albi, France
          <br />SIRET: 994 121 127 00017
          <br />Intra-community VAT no.: FR35994121127
          <br />President: Carla Debard
          <br />Email: <a href="mailto:info@bien.health">info@bien.health</a>
          <br />Phone: <a href="tel:+33638621213">+33 6 38 62 12 13</a>
        </p>

        <h2>Publication director</h2>
        <p>Carla Debard, as President of Bien Health SAS.</p>

        <h2>Hosting</h2>
        <p>
          The site is hosted by <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA,{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
          <br />The shop and order processing are operated via <strong>Shopify Inc.</strong>, 151 O&apos;Connor Street,
          Ground floor, Ottawa, Ontario, K2P 2L8, Canada,{" "}
          <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer">shopify.com</a>.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All elements of the site (texts, visuals, logos, trademarks, illustrations, photographs) are the exclusive
          property of Bien Health SAS or its partners, and are protected by intellectual property law. Any reproduction,
          representation or exploitation, in whole or in part, without prior written authorisation, is prohibited.
        </p>

        <h2>Personal data</h2>
        <p>
          The processing of your personal data is detailed in our <a href={`/${lang}/confidentialite`}>Privacy policy</a>.
          Cookie management is described in our <a href={`/${lang}/cookies`}>Cookie policy</a>.
        </p>

        <h2>Food supplements</h2>
        <p>
          BIEN products are food supplements. They do not replace a varied and balanced diet or a healthy lifestyle. Do
          not exceed the recommended daily dose. Keep out of reach of children. Claims comply with the applicable EU
          regulation.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about the site or this legal notice, contact us at{" "}
          <a href="mailto:info@bien.health">info@bien.health</a>.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout lang={lang} title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        <strong>Bien Health SAS</strong>
        <br />Société par actions simplifiée au capital social variable
        <br />Siège social : 100 Rue du Verbial, 81000 Albi, France
        <br />SIRET : 994 121 127 00017
        <br />N° de TVA intracommunautaire : FR35994121127
        <br />Présidente : Carla Debard
        <br />E-mail : <a href="mailto:info@bien.health">info@bien.health</a>
        <br />Téléphone : <a href="tel:+33638621213">+33 6 38 62 12 13</a>
      </p>

      <h2>Directrice de la publication</h2>
      <p>Carla Debard, en qualité de Présidente de Bien Health SAS.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis,{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
        <br />La boutique et le traitement des commandes sont opérés via <strong>Shopify Inc.</strong>, 151 O&apos;Connor
        Street, Ground floor, Ottawa, Ontario, K2P 2L8, Canada,{" "}
        <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer">shopify.com</a>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (textes, visuels, logos, marques, illustrations, photographies) est la
        propriété exclusive de Bien Health SAS ou de ses partenaires, et est protégé par le droit de la propriété
        intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation
        écrite préalable, est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est détaillé dans notre{" "}
        <a href={`/${lang}/confidentialite`}>Politique de confidentialité</a>. La gestion des cookies est décrite dans
        notre <a href={`/${lang}/cookies`}>Politique de cookies</a>.
      </p>

      <h2>Compléments alimentaires</h2>
      <p>
        Les produits BIEN sont des compléments alimentaires. Ils ne se substituent pas à une alimentation variée et
        équilibrée ni à un mode de vie sain. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des
        enfants. Allégations conformes au règlement (UE) applicable.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site ou à ces mentions légales, contactez-nous à{" "}
        <a href="mailto:info@bien.health">info@bien.health</a>.
      </p>
    </LegalLayout>
  );
}
