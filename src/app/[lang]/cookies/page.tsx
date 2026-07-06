import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Politique de cookies · BIEN",
  description: "Comment et pourquoi le site bien.health utilise des cookies, et comment les gérer.",
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <LegalLayout lang={lang} title="Politique de cookies">
      <p>
        Cette politique explique ce que sont les cookies, comment le site bien.health les utilise et comment vous pouvez
        les gérer. Elle complète notre <a href={`/${lang}/confidentialite`}>Politique de confidentialité</a>.
      </p>

      <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site web. Il permet de
        mémoriser vos actions et préférences, de faire fonctionner certaines fonctionnalités et de mesurer l&apos;audience.
      </p>

      <h2>Les cookies que nous utilisons</h2>
      <ul>
        <li>
          <strong>Cookies essentiels</strong> — nécessaires au fonctionnement du site (panier, sécurité, préférences de
          langue). Ils ne peuvent pas être désactivés.
        </li>
        <li>
          <strong>Cookies de mesure d&apos;audience</strong> — nous aident à comprendre comment le site est utilisé afin
          de l&apos;améliorer.
        </li>
        <li>
          <strong>Cookies marketing</strong> — permettent de vous proposer des contenus et publicités adaptés, sur notre
          site et sur d&apos;autres sites.
        </li>
      </ul>
      <p>
        Notre boutique s&apos;appuie sur Shopify. Pour le détail des cookies déposés par Shopify, consultez{" "}
        <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer">shopify.com/legal/cookies</a>.
      </p>

      <h2>Votre consentement</h2>
      <p>
        Lors de votre première visite, une bannière vous permet d&apos;accepter ou de refuser les cookies non essentiels.
        Votre choix est conservé sur votre appareil. Les cookies essentiels restent actifs car ils sont indispensables au
        fonctionnement du site.
      </p>

      <h2>Gérer les cookies</h2>
      <p>
        Vous pouvez à tout moment supprimer ou bloquer les cookies via les paramètres de votre navigateur. Le blocage de
        certains cookies peut toutefois dégrader votre expérience et rendre certaines fonctionnalités indisponibles.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative aux cookies, écrivez-nous à{" "}
        <a href="mailto:info@bien.health">info@bien.health</a>.
      </p>
    </LegalLayout>
  );
}
