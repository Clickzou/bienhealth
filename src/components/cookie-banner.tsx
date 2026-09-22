"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY, CONSENT_EVENT, type Consent } from "@/lib/consent";

const T = {
  fr: {
    text: "Nous utilisons des cookies pour faire fonctionner le site, mesurer l'audience et améliorer votre expérience. Vous pouvez les accepter ou les refuser.",
    more: "En savoir plus",
    refuse: "Refuser",
    accept: "Tout accepter",
  },
  en: {
    text: "We use cookies to run the site, measure our audience and improve your experience. You can accept or decline them.",
    more: "Learn more",
    refuse: "Decline",
    accept: "Accept all",
  },
} as const;

/**
 * Bannière de consentement aux cookies (RGPD) — s'affiche jusqu'au premier choix.
 *
 * Rendue dès le serveur (22/09/2026). Montée seulement après l'hydratation,
 * elle apparaissait vers 3,5 s sur mobile — et, plus grand bloc de texte de
 * l'écran, c'est elle que Google retenait comme LCP de l'accueil. Le choix du
 * visiteur n'existant que dans son navigateur, c'est `CONSENT_BOOT` (script en
 * tête de <body>) qui pose `has-consent` sur <html> avant le premier rendu, et
 * la CSS qui masque alors la bannière : pas de clignotement chez ceux qui ont
 * déjà répondu.
 */
/** Pose `has-consent` sur <html> avant le premier rendu si le visiteur a déjà choisi. */
export const CONSENT_BOOT = `try{if(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}))document.documentElement.classList.add("has-consent")}catch(e){}`;

export default function CookieBanner({ lang }: { lang: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(CONSENT_KEY)) setShow(false);
    } catch {
      /* localStorage indisponible : la bannière reste, comme avant */
    }
  }, []);

  function choose(value: Consent) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    // Prévient les scripts tiers (Google Analytics) du choix, en direct.
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-banner fixed bottom-0 inset-x-0 z-[120] p-3 sm:p-4">
      {/* Fond rose de la charte (demande client), celui du bandeau d'annonce.
          Il ne se confond avec aucune page — l'off-white précédent se fondait
          dans les fonds clairs, et le bleu nuit d'avant se superposait au hero.
          Sur ce rose, tout le texte passe en noir plein et le « Tout accepter »
          en bleu nuit : c'est le contraste le plus fort de la palette, là où le
          vert d'avant se serait éteint. */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-bien-pink text-black ring-1 ring-black/10 bien-shadow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-black/80 leading-relaxed flex-1">
          {t.text}{" "}
          <Link href={`/${lang}/cookies`} className="underline font-semibold text-black hover:text-bien-navy">{t.more}</Link>.
        </p>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full ring-1 ring-black/35 text-black px-5 py-2.5 text-sm font-semibold hover:bg-black/10 transition-colors"
          >
            {t.refuse}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-bien-navy text-bien-cream px-5 py-2.5 text-sm font-bold hover:brightness-150 transition"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
