"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";
import { KLAVIYO_COMPANY_ID } from "@/lib/klaviyo-onsite";

/**
 * Script Klaviyo (klaviyo.js) — conforme RGPD, même logique que MetaPixel :
 * rien n'est chargé tant que l'utilisateur n'a pas accepté les cookies de
 * mesure, et le choix est pris en compte en direct via CONSENT_EVENT.
 *
 * Le script reconnaît le visiteur (cookie `__kla_id`, lien d'e-mail) et envoie
 * les évènements mis en file par `lib/klaviyo-onsite.ts`. Sans ID, le composant
 * ne rend rien.
 */
export default function KlaviyoOnsite() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const check = () => setGranted(getConsent() === "all");
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  if (!KLAVIYO_COMPANY_ID || !granted) return null;

  return (
    <Script
      id="klaviyo-onsite"
      src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
      strategy="afterInteractive"
    />
  );
}
