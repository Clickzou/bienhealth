import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Mentions légales · BIEN",
  description: "Mentions légales du site bien.health — Bien Health SAS, Albi.",
};

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

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
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
        <br />La boutique et le traitement des commandes sont opérés via <strong>Shopify Inc.</strong>, 151 O&apos;Connor
        Street, Ground floor, Ottawa, Ontario, K2P 2L8, Canada —{" "}
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
