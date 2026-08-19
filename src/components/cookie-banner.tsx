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
      {/* Fond clair et bouton vert : en bleu nuit, le bandeau se superposait au
          hero — lui aussi bleu nuit — et le « Tout accepter » en bleu ciel sur
          bleu nuit se lisait mal sur téléphone (retour client du 19/08/2026).
          Off-white + green est une association autorisée par la charte (p. 24),
          et le bandeau se détache maintenant de toutes les pages. */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-bien-offwhite text-black ring-1 ring-border bien-shadow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-black/70 leading-relaxed flex-1">
          {t.text}{" "}
          <Link href={`/${lang}/cookies`} className="underline text-black hover:text-bien-leaf">{t.more}</Link>.
        </p>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full ring-1 ring-black/20 text-black px-5 py-2.5 text-sm font-semibold hover:bg-black/5 transition-colors"
          >
            {t.refuse}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-bien-leaf text-bien-offwhite px-5 py-2.5 text-sm font-bold hover:brightness-110 transition"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
