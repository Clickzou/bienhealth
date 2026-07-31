import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "cgv",
    title: lang === "en" ? "Terms and conditions of sale · BIEN" : "Conditions générales de vente · BIEN",
    description: lang === "en" ? "Terms of use and sale of Bien Health SAS (bien.health)." : "Conditions d'utilisation et de vente de Bien Health SAS (bien.health).",
  });
}

export default async function CgvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  if (lang === "en") {
    return (
      <LegalLayout lang={lang} title="Terms and conditions of sale">
        <h2>General presentation (France)</h2>
        <p>
          This website is operated by <strong>Bien Health SAS</strong>, registered in France under SIRET number
          99412112700017, with its registered office at 100 Rue du Verbial, 81000 Albi, France, and VAT number
          FR35994121127, represented by its President Carla Debard (“Bien.Health” or the “Company”). On this site, the
          terms “we”, “our” and “us” refer to Bien.Health.
        </p>
        <p>
          Bien.Health provides you with this website, including all information, tools and services available on it,
          subject to your acceptance of all the terms, policies and notices stated here.
        </p>
        <p>
          By visiting this site and/or making a purchase from us, you use our services and agree to be bound by these
          general terms and conditions (the “Terms”), including any additional terms, policies and notices referred to.
          These Terms apply to all users of the site (visitors, suppliers, customers, merchants and/or content
          contributors).
        </p>
        <p>
          Please read these Terms carefully before accessing or using this site. If you do not accept all the terms and
          conditions, you will not be able to place an order on this site.
        </p>

        <h2>Applicable law and jurisdiction</h2>
        <p>
          These Terms are governed by and construed in accordance with French law. Any dispute relating to these Terms
          shall be subject to the jurisdiction of the competent French courts.
        </p>
        <p>
          We make no representation as to the legal compliance of the products and/or services in other countries. It is
          the user's responsibility to comply with the local laws and regulations applicable in their country.
        </p>

        <h2>Scope</h2>
        <p>
          These Terms apply to any offer by the Company and to any contract concluded between the Company and the
          consumer. Before the contract is concluded, they are made available to the consumer on{" "}
          <a href="https://bien.health" target="_blank" rel="noopener noreferrer">bien.health</a> and must be expressly
          accepted before any order.
        </p>

        <h2>Prices</h2>
        <p>
          Prices shown on this site are in euros (€) and include all applicable taxes, unless otherwise stated.
        </p>

        <h2>Complaints</h2>
        <p>
          Any complaint must be sent to the Company within a reasonable time by email to{" "}
          <a href="mailto:info@bien.health">info@bien.health</a>. In accordance with French consumer law, the consumer may
          also use a free consumer mediation service.
        </p>

        <h2>Disputes</h2>
        <p>
          In the event of a dispute, the consumer may first contact the Company to seek an amicable solution. Failing
          agreement, the dispute will be brought before the competent French courts.
        </p>

        <p className="pt-4 text-black/50">© Bien Health SAS — 2026</p>
      </LegalLayout>
    );
  }

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
