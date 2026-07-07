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

/** Bannière de consentement aux cookies (RGPD) — s'affiche jusqu'au premier choix. */
export default function CookieBanner({ lang }: { lang: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      /* localStorage indisponible */
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
    <div className="fixed bottom-0 inset-x-0 z-[120] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl rounded-2xl bg-bien-forest text-bien-cream ring-1 ring-bien-cream/15 bien-shadow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-bien-cream/85 leading-relaxed flex-1">
          {t.text}{" "}
          <Link href={`/${lang}/cookies`} className="underline text-bien-cream hover:text-bien-gold">{t.more}</Link>.
        </p>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full ring-1 ring-bien-cream/30 text-bien-cream px-5 py-2.5 text-sm font-semibold hover:bg-bien-cream/10 transition-colors"
          >
            {t.refuse}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-bien-gold text-bien-forest px-5 py-2.5 text-sm font-bold hover:brightness-105 transition"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
