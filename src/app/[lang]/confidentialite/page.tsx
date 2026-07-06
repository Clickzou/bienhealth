import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Politique de confidentialité · BIEN",
  description: "Comment Bien Health collecte, utilise et divulgue vos informations personnelles sur bien.health.",
};

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <LegalLayout lang={lang} title="Politique de confidentialité" updated="1 avril 2026">
      <p>
        Cette politique de confidentialité explique comment Bien Health (le « Site », « nous », « notre » ou « nos »)
        collecte, utilise et divulgue vos informations personnelles lorsque vous visitez, utilisez nos services ou
        effectuez un achat sur bien.health (le « Site ») ou communiquez autrement avec nous au sujet du Site
        (conjointement, les « Services »). Aux fins de la présente politique de confidentialité, « vous », « votre » et
        « vos » vous désignent en tant qu&apos;utilisateur des Services, que vous soyez un client, un visiteur du site web
        ou une autre personne dont nous avons collecté les informations conformément à la présente politique de
        confidentialité.
      </p>
      <p>Veuillez lire attentivement la présente politique de confidentialité.</p>

      <h2>Modifications de la présente politique de confidentialité</h2>
      <p>
        Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre, notamment pour refléter les
        changements apportés à nos pratiques ou pour d&apos;autres raisons opérationnelles, juridiques ou réglementaires.
        Nous publierons la politique de confidentialité révisée sur le Site, actualiserons la date de « Dernière mise à
        jour » et prendrons toute autre mesure requise par la législation en vigueur.
      </p>

      <h2>Comment nous collectons et utilisons vos informations personnelles</h2>
      <p>
        Pour fournir les Services, nous collectons des informations personnelles vous concernant issues de diverses
        sources, comme indiqué ci-dessous. Les informations que nous collectons et utilisons varient en fonction de la
        manière dont vous interagissez avec nous.
      </p>
      <p>
        En plus des utilisations spécifiques exposées ci-dessous, nous pouvons utiliser les informations que nous
        collectons à votre sujet pour communiquer avec vous, fournir ou améliorer les Services, nous conformer à toute
        obligation légale applicable, faire respecter les conditions de service applicables et protéger ou défendre les
        Services, nos droits et les droits de nos utilisateurs ou autres.
      </p>

      <h2>Informations personnelles que nous collectons</h2>
      <p>
        Les types d&apos;informations personnelles que nous obtenons à votre sujet dépendent de la manière dont vous
        interagissez avec notre Site et utilisez nos Services. Lorsque nous utilisons le terme « informations
        personnelles », nous faisons référence aux informations qui vous identifient, vous concernent, vous décrivent ou
        peuvent être associées à vous.
      </p>
      <h3>Informations que nous collectons directement auprès de vous</h3>
      <ul>
        <li>Des coordonnées, notamment votre nom, adresse, numéro de téléphone et e-mail.</li>
        <li>Des informations de commande, notamment votre nom, votre adresse de facturation, votre adresse d&apos;expédition, votre confirmation de paiement, votre e-mail et numéro de téléphone.</li>
        <li>Des informations du compte, notamment votre nom d&apos;utilisateur, votre mot de passe, vos questions de sécurité et d&apos;autres informations utilisées à des fins de sécurité du compte.</li>
        <li>Les informations sur le service à la clientèle, notamment les informations que vous choisissez d&apos;inclure dans vos communications avec nous.</li>
      </ul>
      <h3>Informations que nous collectons sur votre utilisation</h3>
      <p>
        Nous pouvons également collecter automatiquement certaines informations sur votre interaction avec les Services
        (« Données d&apos;utilisation ») à l&apos;aide de cookies, pixels et technologies similaires. Ces données peuvent
        inclure des informations sur l&apos;appareil, le navigateur, votre connexion réseau, votre adresse IP et votre
        interaction avec les Services.
      </p>
      <h3>Informations que nous obtenons de la part de tiers</h3>
      <p>
        Nous pouvons obtenir des informations vous concernant auprès de tiers, notamment des fournisseurs et prestataires
        qui collectent des informations en notre nom, tels que les entreprises qui prennent en charge notre Site (comme
        Shopify) et nos organismes de traitement des paiements. Toute information obtenue de tiers sera traitée
        conformément à la présente politique de confidentialité.
      </p>

      <h2>Comment nous utilisons vos informations personnelles</h2>
      <ul>
        <li><strong>Fourniture des Produits et Services</strong> — traiter vos paiements, exécuter vos commandes, gérer votre compte, organiser l&apos;expédition et faciliter retours et échanges.</li>
        <li><strong>Marketing et publicité</strong> — vous envoyer des communications marketing par e-mail, SMS ou courrier et vous présenter des publicités adaptées (art. 6 (1) (f) du RGPD dans l&apos;EEE).</li>
        <li><strong>Sécurité et prévention de la fraude</strong> — détecter et prévenir les activités frauduleuses, illégales ou malveillantes.</li>
        <li><strong>Communiquer et améliorer les Services</strong> — vous fournir le service client et améliorer nos Services.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Comme de nombreux sites web, nous utilisons des cookies sur notre Site. Pour plus d&apos;informations sur les
        cookies utilisés avec Shopify, consultez{" "}
        <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer">shopify.com/legal/cookies</a>.
        Nous les utilisons pour faire fonctionner et améliorer notre Site, mémoriser vos préférences et réaliser des
        analyses. La plupart des navigateurs acceptent les cookies par défaut, mais vous pouvez les supprimer ou les
        rejeter via les paramètres de votre navigateur.
      </p>

      <h2>Comment nous divulguons les informations personnelles</h2>
      <ul>
        <li>Des fournisseurs et tiers qui accomplissent des services en notre nom (informatique, paiement, analyse, service client, cloud, traitement des commandes et expédition).</li>
        <li>Des partenaires commerciaux et marketing.</li>
        <li>Avec votre consentement, lorsque vous nous demandez de divulguer certaines informations.</li>
        <li>Avec nos affiliés ou au sein de notre groupe d&apos;entreprises.</li>
        <li>Dans le cadre d&apos;une transaction commerciale ou pour nous conformer à nos obligations légales.</li>
      </ul>
      <p>
        Nous n&apos;utilisons et ne divulguons pas d&apos;informations personnelles sensibles sans votre consentement ou
        dans le but de déduire des caractéristiques vous concernant.
      </p>

      <h2>Contenu généré par l&apos;utilisateur</h2>
      <p>
        Les Services peuvent vous permettre de publier des avis. Tout contenu soumis dans une zone publique sera
        accessible à tous. Nous ne sommes pas responsables de la confidentialité ou de la sécurité des informations que
        vous rendez publiques.
      </p>

      <h2>Sites web et liens tiers</h2>
      <p>
        Notre Site peut fournir des liens vers des sites exploités par des tiers. Nous ne garantissons pas et ne sommes
        pas responsables de la confidentialité ou de la sécurité de ces sites. Consultez leurs propres politiques.
      </p>

      <h2>Données sur les enfants</h2>
      <p>
        Les Services ne sont pas destinés aux enfants et nous ne collectons pas sciemment leurs informations. Un parent
        ou tuteur peut nous contacter pour demander la suppression des informations d&apos;un enfant.
      </p>

      <h2>Sécurité et conservation de vos informations</h2>
      <p>
        Aucune mesure de sécurité n&apos;est parfaite : nous ne pouvons pas garantir une sécurité absolue. La durée de
        conservation de vos informations dépend de la nécessité de tenir votre compte, fournir les Services, respecter
        nos obligations légales et résoudre d&apos;éventuels litiges.
      </p>

      <h2>Vos droits</h2>
      <ul>
        <li><strong>Droit d&apos;accès / de savoir</strong>, <strong>de suppression</strong>, <strong>de correction</strong> et <strong>de portabilité</strong> de vos informations personnelles.</li>
        <li><strong>Droit de refuser</strong> la vente, le partage ou la publicité ciblée.</li>
        <li><strong>Restriction du traitement</strong> et <strong>retrait du consentement</strong>.</li>
        <li><strong>Appel</strong> de notre décision et <strong>gestion des préférences de communication</strong> (désabonnement).</li>
      </ul>
      <p>
        Vous pouvez exercer ces droits en nous contactant à l&apos;aide des coordonnées ci-dessous. Nous ne commettrons
        aucune discrimination si vous exercez ces droits.
      </p>

      <h2>Réclamations</h2>
      <p>
        Pour toute réclamation, contactez-nous à l&apos;aide des coordonnées ci-dessous. Selon votre lieu de résidence,
        vous pouvez faire appel de notre décision ou déposer une réclamation auprès de votre autorité locale de
        protection des données.
      </p>

      <h2>Utilisateurs internationaux</h2>
      <p>
        Nous pouvons transférer, stocker et traiter vos informations en dehors de votre pays. En cas de transfert hors
        d&apos;Europe, nous recourons à des mécanismes reconnus (clauses contractuelles types).
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou pour exercer vos droits, écrivez-nous à{" "}
        <a href="mailto:info@bien.health">info@bien.health</a> ou contactez-nous au 100 Rue du Verbial, Albi, 81000, FR.
        Sauf indication contraire, nous sommes le responsable du traitement de vos informations personnelles.
      </p>
    </LegalLayout>
  );
}
