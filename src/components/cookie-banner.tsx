"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "bien-cookie-consent";

/** Bannière de consentement aux cookies (RGPD) — s'affiche jusqu'au premier choix. */
export default function CookieBanner({ lang }: { lang: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage indisponible */
    }
  }, []);

  function choose(value: "all" | "essential") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[120] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl rounded-2xl bg-bien-forest text-bien-cream ring-1 ring-bien-cream/15 bien-shadow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-bien-cream/85 leading-relaxed flex-1">
          Nous utilisons des cookies pour faire fonctionner le site, mesurer l&apos;audience et améliorer votre
          expérience. Vous pouvez les accepter ou les refuser.{" "}
          <Link href={`/${lang}/cookies`} className="underline text-bien-cream hover:text-bien-gold">En savoir plus</Link>.
        </p>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full ring-1 ring-bien-cream/30 text-bien-cream px-5 py-2.5 text-sm font-semibold hover:bg-bien-cream/10 transition-colors"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-full bg-bien-gold text-bien-forest px-5 py-2.5 text-sm font-bold hover:brightness-105 transition"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
