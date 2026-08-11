import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "retours",
    title: lang === "en" ? "Returns & refunds | BIEN health" : "Retours & remboursements | BIEN health",
    description: lang === "en" ? "14-day right of withdrawal, return procedure and refunds for BIEN health orders." : "Droit de rétractation de 14 jours, procédure de retour et remboursement des commandes BIEN health.",
  });
}

export default async function RetoursPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  if (lang === "en") {
    return (
      <LegalLayout lang={lang} title="Returns & refunds">
        <h2>Right of withdrawal</h2>
        <p>
          You have a <strong>14-day right of withdrawal</strong> from the receipt of your order, for
          <strong> unused and unopened</strong> products.
        </p>

        <h2>How to start a return?</h2>
        <p>
          Contact our customer service at <a href="mailto:info@bien.health">info@bien.health</a> with your{" "}
          <strong>order number</strong>. We'll send you the steps to follow for your return.
        </p>

        <h2>Refund</h2>
        <p>
          Once your return is received and checked, the refund is processed within <strong>7 to 10 business days</strong>,
          to the payment method used for the order.
        </p>
        <p>
          Return shipping costs are the customer's responsibility, except in the event of our error.
        </p>

        <h2>Damaged product or error</h2>
        <p>
          If you receive a damaged product or an error in your order, contact us{" "}
          <strong>within 3 days</strong> of receipt at <a href="mailto:info@bien.health">info@bien.health</a>, attaching
          a photo if possible. We'll quickly find a solution.
        </p>

        <h2>Mediation</h2>
        <p>
          In accordance with French consumer law, you can also use a free consumer mediation service. See also our{" "}
          <a href={`/${lang}/cgv`}>terms and conditions of sale</a>.
        </p>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout lang={lang} title="Retours & remboursements">
      <h2>Droit de rétractation</h2>
      <p>
        Vous disposez d&apos;un <strong>droit de rétractation de 14 jours</strong> à compter de la réception de votre
        commande, pour les produits <strong>inutilisés et non ouverts</strong>.
      </p>

      <h2>Comment initier un retour ?</h2>
      <p>
        Contactez notre service client à <a href="mailto:info@bien.health">info@bien.health</a> en indiquant votre{" "}
        <strong>numéro de commande</strong>. Nous vous transmettons la marche à suivre pour votre retour.
      </p>

      <h2>Remboursement</h2>
      <p>
        Une fois votre retour reçu et vérifié, le remboursement est effectué sous <strong>7 à 10 jours ouvrables</strong>,
        sur le moyen de paiement utilisé lors de la commande.
      </p>
      <p>
        Les frais de port de retour sont à la charge du client, sauf en cas d&apos;erreur de notre part.
      </p>

      <h2>Produit endommagé ou erreur</h2>
      <p>
        Si vous recevez un produit endommagé ou une erreur dans votre commande, contactez-nous{" "}
        <strong>sous 3 jours</strong> après réception à <a href="mailto:info@bien.health">info@bien.health</a>, en
        joignant si possible une photo. Nous trouverons rapidement une solution.
      </p>

      <h2>Médiation</h2>
      <p>
        Conformément au droit de la consommation français, vous pouvez également recourir gratuitement à un service de
        médiation de la consommation. Voir aussi nos <a href={`/${lang}/cgv`}>conditions générales de vente</a>.
      </p>
    </LegalLayout>
  );
}
