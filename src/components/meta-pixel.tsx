"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";
import { META_PIXEL_ID, trackMeta } from "@/lib/meta-pixel";

/**
 * Pixel Meta (Facebook / Instagram) — conforme RGPD, même logique que
 * GoogleAnalytics : rien n'est chargé tant que l'utilisateur n'a pas accepté
 * les cookies de mesure, et le choix est pris en compte en direct via
 * CONSENT_EVENT (sans rechargement).
 *
 * ID : NEXT_PUBLIC_META_PIXEL_ID, sinon repli sur l'ID public en production
 * (voir lib/meta-pixel.ts). Sans ID, le composant ne rend rien.
 *
 * Le PageView initial est envoyé par le script d'init ; les navigations
 * suivantes (App Router, côté client) sont suivies via `usePathname`.
 */
export default function MetaPixel() {
  const [granted, setGranted] = useState(false);
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    const check = () => setGranted(getConsent() === "all");
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  // Navigations internes : le script d'init a déjà compté la première page.
  useEffect(() => {
    if (!granted) return;
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    trackMeta("PageView");
  }, [granted, pathname]);

  if (!META_PIXEL_ID || !granted) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
