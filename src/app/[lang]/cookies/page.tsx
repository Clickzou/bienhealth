import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import LegalLayout from "@/components/legal-layout";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "cookies",
    title: lang === "en" ? "Cookie policy | BIEN health" : "Politique de cookies | BIEN health",
    description: lang === "en" ? "How and why bien.health uses cookies, and how to manage them." : "Comment et pourquoi le site bien.health utilise des cookies, et comment les gérer.",
  });
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  if (lang === "en") {
    return (
      <LegalLayout lang={lang} title="Cookie policy">
        <p>
          This policy explains what cookies are, how bien.health uses them and how you can manage them. It complements our{" "}
          <a href={`/${lang}/confidentialite`}>Privacy policy</a>.
        </p>

        <h2>What is a cookie?</h2>
        <p>
          A cookie is a small text file placed on your device when you visit a website. It helps remember your actions and
          preferences, enables certain features and measures audience.
        </p>

        <h2>The cookies we use</h2>
        <ul>
          <li><strong>Essential cookies</strong>: necessary for the site to work (cart, security, language preferences). They cannot be disabled.</li>
          <li><strong>Analytics cookies</strong>: help us understand how the site is used so we can improve it (Google Analytics 4).</li>
          <li><strong>Marketing cookies</strong>: let us show you relevant content and ads, on our site and on others (Meta pixel, for Facebook and Instagram).</li>
        </ul>
        <p>
          Analytics and marketing cookies are only set once you accept them in the cookie banner. Decline and neither
          Google Analytics nor the Meta pixel is loaded.
        </p>
        <p>
          Our shop runs on Shopify. For details of the cookies set by Shopify, see{" "}
          <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer">shopify.com/legal/cookies</a>.
        </p>

        <h2>Your consent</h2>
        <p>
          On your first visit, a banner lets you accept or decline non-essential cookies. Your choice is stored on your
          device. Essential cookies remain active as they are indispensable to the site's operation.
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can delete or block cookies at any time via your browser settings. Blocking some cookies may however degrade
          your experience and make certain features unavailable.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about cookies, email us at <a href="mailto:info@bien.health">info@bien.health</a>.
        </p>
      </LegalLayout>
    );
  }

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
          <strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site (panier, sécurité, préférences de
          langue). Ils ne peuvent pas être désactivés.
        </li>
        <li>
          <strong>Cookies de mesure d&apos;audience</strong> : nous aident à comprendre comment le site est utilisé afin
          de l&apos;améliorer (Google Analytics 4).
        </li>
        <li>
          <strong>Cookies marketing</strong> : permettent de vous proposer des contenus et publicités adaptés, sur notre
          site et sur d&apos;autres sites (pixel Meta, pour Facebook et Instagram).
        </li>
      </ul>
      <p>
        Les cookies de mesure d&apos;audience et marketing ne sont déposés qu&apos;après votre acceptation dans la
        bannière. Si vous refusez, ni Google Analytics ni le pixel Meta ne sont chargés.
      </p>
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
