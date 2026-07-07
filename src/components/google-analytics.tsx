"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

/**
 * Google Analytics 4 (gtag.js) — conforme RGPD.
 * Ne charge RIEN tant que l'utilisateur n'a pas accepté les cookies de mesure
 * via la bannière (consentement « all »). Réagit en direct au choix, sans
 * rechargement, grâce à l'évènement CONSENT_EVENT.
 *
 * ID = NEXT_PUBLIC_GA_ID si défini (Vercel / .env.local), sinon repli sur
 * l'ID public en PRODUCTION uniquement — GA fonctionne donc automatiquement
 * sur bien.health sans config Vercel, tout en gardant le localhost propre
 * (le dev n'est tracké que si NEXT_PUBLIC_GA_ID est présent en local).
 */
const GA_FALLBACK = "G-GQFWQF5085";

export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID || (process.env.NODE_ENV === "production" ? GA_FALLBACK : undefined);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const check = () => setGranted(getConsent() === "all");
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  if (!id || !granted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
