import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";
import { freeShippingAmount } from "@/lib/shipping";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  return pageMetadata({
    lang,
    path: "livraison",
    title: en ? "Shipping — Times & rates · BIEN" : "Livraison — Délais & tarifs · BIEN",
    description: en
      ? `Free Point Relais delivery on orders over ${freeShippingAmount("en")}, shipped the same day. Delivery times and rates for France and Europe.`
      : `Livraison offerte en Point Relais dès ${freeShippingAmount("fr")} d'achat, expédiée le jour même. Délais et tarifs de livraison France et Europe.`,
  });
}

export default async function LivraisonPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";

  if (en) {
    return (
      <LegalLayout lang={lang} title="Shipping">
        <p>
          Free <strong>Point Relais delivery on orders over {freeShippingAmount("en")}</strong>, shipped the same day for any order placed
          before 1 pm.
        </p>

        <h2>France 🇫🇷</h2>
        <ul>
          <li><strong>Point Relais pick-up</strong> (3 to 5 business days) — €4</li>
          <li><strong>Standard home delivery</strong> (2 to 4 business days) — €5.90</li>
          <li><strong>Express home delivery</strong> (1 to 2 business days) — €11.50</li>
        </ul>

        <h2>Europe 🌍</h2>
        <p>Delivery options and rates are shown at checkout.</p>

        <h2>Discreet delivery</h2>
        <p>
          Your orders are shipped in a plain, unbranded box, to minimise any risk of theft and protect your privacy.
        </p>

        <h2>Order tracking</h2>
        <p>
          After placing your order, you'll receive real-time email updates at every stage of shipping. You can also
          track your orders from your <a href={`/${lang}/compte`}>account area</a>.
        </p>

        <h2>A question?</h2>
        <p>
          Email us at <a href="mailto:info@bien.health">info@bien.health</a> or check our{" "}
          <a href={`/${lang}/faq`}>FAQ</a>.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout lang={lang} title="Livraison">
      <p>
        Livraison offerte en <strong>Point Relais dès {freeShippingAmount("fr")} d&apos;achat</strong>, expédiée le jour même pour toute
        commande passée avant 13h.
      </p>

      <h2>France 🇫🇷</h2>
      <ul>
        <li><strong>Point Relais</strong> (3 à 5 jours ouvrés) — 4 €</li>
        <li><strong>Livraison standard à domicile</strong> (2 à 4 jours ouvrés) — 5,90 €</li>
        <li><strong>Livraison express à domicile</strong> (1 à 2 jours ouvrés) — 11,50 €</li>
      </ul>

      <h2>Europe 🌍</h2>
      <p>Les options et tarifs de livraison sont affichés à l&apos;étape de validation de commande.</p>

      <h2>Livraison discrète</h2>
      <p>
        Vos commandes sont expédiées dans une boîte simple et sans marque, afin de minimiser tout risque de vol et de
        préserver votre confidentialité.
      </p>

      <h2>Suivi de commande</h2>
      <p>
        Après avoir passé commande, vous recevez des mises à jour par e-mail en temps réel à chaque étape de
        l&apos;expédition. Vous pouvez également suivre vos commandes depuis votre{" "}
        <a href={`/${lang}/compte`}>espace compte</a>.
      </p>

      <h2>Une question ?</h2>
      <p>
        Écrivez-nous à <a href="mailto:info@bien.health">info@bien.health</a> ou consultez notre{" "}
        <a href={`/${lang}/faq`}>FAQ</a>.
      </p>
    </LegalLayout>
  );
}
