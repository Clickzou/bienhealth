import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "confidentialite",
    title: lang === "en" ? "Privacy policy · BIEN" : "Politique de confidentialité · BIEN",
    description: lang === "en" ? "How Bien Health collects, uses and discloses your personal information on bien.health." : "Comment Bien Health collecte, utilise et divulgue vos informations personnelles sur bien.health.",
  });
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  if (lang === "en") {
    return (
      <LegalLayout lang={lang} title="Privacy policy" updated="1 April 2026">
        <p>
          This privacy policy explains how Bien Health (the “Site”, “we”, “our” or “us”) collects, uses and discloses your
          personal information when you visit, use our services or make a purchase on bien.health (the “Site”) or otherwise
          communicate with us about the Site (together, the “Services”). For the purposes of this privacy policy, “you”
          and “your” refer to you as a user of the Services, whether you are a customer, a website visitor or another
          person whose information we have collected in accordance with this privacy policy.
        </p>
        <p>Please read this privacy policy carefully.</p>

        <h2>Changes to this privacy policy</h2>
        <p>
          We may update this privacy policy from time to time, including to reflect changes to our practices or for other
          operational, legal or regulatory reasons. We will post the revised privacy policy on the Site, update the “Last
          updated” date and take any other steps required by applicable law.
        </p>

        <h2>How we collect and use your personal information</h2>
        <p>
          To provide the Services, we collect personal information about you from various sources, as set out below. The
          information we collect and use varies depending on how you interact with us.
        </p>
        <p>
          In addition to the specific uses set out below, we may use the information we collect about you to communicate
          with you, provide or improve the Services, comply with any applicable legal obligation, enforce applicable terms
          of service and protect or defend the Services, our rights and the rights of our users or others.
        </p>

        <h2>Personal information we collect</h2>
        <p>
          The types of personal information we obtain about you depend on how you interact with our Site and use our
          Services. When we use the term “personal information”, we refer to information that identifies, relates to,
          describes or can be associated with you.
        </p>
        <h3>Information we collect directly from you</h3>
        <ul>
          <li>Contact details, including your name, address, phone number and email.</li>
          <li>Order information, including your name, billing address, shipping address, payment confirmation, email and phone number.</li>
          <li>Account information, including your username, password, security questions and other information used for account security.</li>
          <li>Customer service information, including the information you choose to include in your communications with us.</li>
        </ul>
        <h3>Information we collect about your use</h3>
        <p>
          We may also automatically collect certain information about your interaction with the Services (“Usage Data”)
          using cookies, pixels and similar technologies. This data may include information about your device, browser,
          network connection, IP address and interaction with the Services.
        </p>
        <h3>Information we obtain from third parties</h3>
        <p>
          We may obtain information about you from third parties, including suppliers and providers who collect information
          on our behalf, such as the companies that support our Site (like Shopify) and our payment processors. Any
          information obtained from third parties will be handled in accordance with this privacy policy.
        </p>

        <h2>How we use your personal information</h2>
        <ul>
          <li><strong>Providing Products and Services</strong> — process your payments, fulfil your orders, manage your account, arrange shipping and facilitate returns and exchanges.</li>
          <li><strong>Marketing and advertising</strong> — send you marketing communications by email, SMS or post and show you relevant ads (art. 6 (1) (f) GDPR in the EEA).</li>
          <li><strong>Security and fraud prevention</strong> — detect and prevent fraudulent, illegal or malicious activity.</li>
          <li><strong>Communicating and improving the Services</strong> — provide you with customer service and improve our Services.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Like many websites, we use cookies on our Site. For more information about the cookies used with Shopify, see{" "}
          <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer">shopify.com/legal/cookies</a>.
          We use them to operate and improve our Site, remember your preferences and carry out analytics. Most browsers
          accept cookies by default, but you can delete or reject them via your browser settings.
        </p>

        <h2>How we disclose personal information</h2>
        <ul>
          <li>Suppliers and third parties who perform services on our behalf (IT, payment, analytics, customer service, cloud, order processing and shipping).</li>
          <li>Business and marketing partners.</li>
          <li>With your consent, when you ask us to disclose certain information.</li>
          <li>With our affiliates or within our group of companies.</li>
          <li>As part of a business transaction or to comply with our legal obligations.</li>
        </ul>
        <p>
          We do not use or disclose sensitive personal information without your consent or for the purpose of inferring
          characteristics about you.
        </p>

        <h2>User-generated content</h2>
        <p>
          The Services may allow you to post reviews. Any content submitted in a public area will be accessible to all. We
          are not responsible for the privacy or security of information you make public.
        </p>

        <h2>Third-party websites and links</h2>
        <p>
          Our Site may provide links to sites operated by third parties. We do not guarantee and are not responsible for
          the privacy or security of those sites. Please review their own policies.
        </p>

        <h2>Children's data</h2>
        <p>
          The Services are not intended for children and we do not knowingly collect their information. A parent or
          guardian may contact us to request the deletion of a child's information.
        </p>

        <h2>Security and retention of your information</h2>
        <p>
          No security measure is perfect: we cannot guarantee absolute security. How long we keep your information depends
          on the need to maintain your account, provide the Services, meet our legal obligations and resolve any disputes.
        </p>

        <h2>Your rights</h2>
        <ul>
          <li><strong>Right to access / to know</strong>, <strong>to delete</strong>, <strong>to correct</strong> and <strong>to portability</strong> of your personal information.</li>
          <li><strong>Right to opt out</strong> of the sale, sharing or targeted advertising.</li>
          <li><strong>Restriction of processing</strong> and <strong>withdrawal of consent</strong>.</li>
          <li><strong>Appeal</strong> our decision and <strong>manage communication preferences</strong> (unsubscribe).</li>
        </ul>
        <p>
          You can exercise these rights by contacting us using the details below. We will not discriminate against you for
          exercising these rights.
        </p>

        <h2>Complaints</h2>
        <p>
          For any complaint, contact us using the details below. Depending on where you live, you may appeal our decision
          or file a complaint with your local data protection authority.
        </p>

        <h2>International users</h2>
        <p>
          We may transfer, store and process your information outside your country. Where information is transferred
          outside Europe, we use recognised mechanisms (standard contractual clauses).
        </p>

        <h2>Contact</h2>
        <p>
          For any question or to exercise your rights, email us at <a href="mailto:info@bien.health">info@bien.health</a>{" "}
          or contact us at 100 Rue du Verbial, Albi, 81000, France. Unless stated otherwise, we are the controller of your
          personal information.
        </p>
      </LegalLayout>
    );
  }

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
