import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Conditions générales de vente · BIEN",
  description: "Conditions d'utilisation et de vente de Bien Health SAS (bien.health).",
};

export default async function CgvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <LegalLayout lang={lang} title="Conditions générales de vente">
      <h2>Présentation générale (France)</h2>
      <p>
        Ce site internet est exploité par <strong>Bien Health SAS</strong>, immatriculée en France sous le numéro SIRET
        99412112700017, dont le siège social est situé 100 Rue du Verbial, 81000 Albi, France, et dont le numéro de TVA
        est FR35994121127, représentée par sa Présidente Carla Debard (« Bien.Health » ou la « Société »). Sur ce site,
        les termes « nous », « notre » et « nos » font référence à Bien.Health.
      </p>
      <p>
        Bien.Health met à votre disposition ce site internet, incluant l&apos;ensemble des informations, outils et
        services accessibles sur celui-ci, sous réserve de votre acceptation de l&apos;ensemble des conditions,
        politiques et mentions indiquées ici.
      </p>
      <p>
        En visitant ce site et/ou en effectuant un achat auprès de nous, vous utilisez nos services et acceptez
        d&apos;être lié(e) par les présentes conditions générales (les « Conditions Générales »), y compris les
        conditions, politiques et mentions complémentaires auxquelles il est fait référence. Ces Conditions Générales
        s&apos;appliquent à tous les utilisateurs du site (visiteurs, fournisseurs, clients, commerçants et/ou
        contributeurs de contenu).
      </p>
      <p>
        Veuillez lire attentivement ces Conditions Générales avant d&apos;accéder ou d&apos;utiliser ce site. Si vous
        n&apos;acceptez pas l&apos;ensemble des termes et conditions, vous ne pourrez pas passer commande sur ce site.
      </p>

      <h2>Loi applicable et juridiction</h2>
      <p>
        Les présentes Conditions Générales sont régies et interprétées conformément au droit français. Tout litige
        relatif aux présentes Conditions Générales sera soumis à la compétence des juridictions françaises compétentes.
      </p>
      <p>
        Nous ne formulons aucune déclaration quant à la conformité légale des produits et/ou services dans d&apos;autres
        pays. Il appartient à l&apos;utilisateur de se conformer aux lois et réglementations locales applicables dans son
        pays.
      </p>

      <h2>Champ d&apos;application</h2>
      <p>
        Les présentes Conditions Générales s&apos;appliquent à toute offre de la Société ainsi qu&apos;à tout contrat
        conclu entre la Société et le consommateur. Avant la conclusion du contrat, elles sont mises à disposition du
        consommateur sur le site <a href="https://bien.health" target="_blank" rel="noopener noreferrer">bien.health</a>{" "}
        et doivent être expressément acceptées avant toute commande.
      </p>

      <h2>Les prix</h2>
      <p>
        Les prix indiqués sur ce site sont exprimés en euros (€) et incluent toutes les taxes applicables (TTC), sauf
        indication contraire.
      </p>

      <h2>Réclamations</h2>
      <p>
        Toute réclamation doit être adressée à la Société dans un délai raisonnable par e-mail à{" "}
        <a href="mailto:info@bien.health">info@bien.health</a>. Conformément au droit de la consommation français, le
        consommateur peut également recourir gratuitement à un service de médiation de la consommation.
      </p>

      <h2>Litiges</h2>
      <p>
        En cas de litige, le consommateur peut d&apos;abord contacter la Société afin de rechercher une solution amiable.
        À défaut d&apos;accord, le litige sera porté devant les juridictions françaises compétentes.
      </p>

      <p className="pt-4 text-black/50">© Bien Health SAS — 2026</p>
    </LegalLayout>
  );
}
