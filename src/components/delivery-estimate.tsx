"use client";

import { useEffect, useState } from "react";

/**
 * « En stock — Livré chez vous entre le 10 et le 13 août ».
 *
 * Rendu côté client : la fenêtre dépend de la date du jour, qui ne peut pas
 * être figée dans une page statique (elle resterait bloquée sur la date du
 * build). Rien n'est affiché au premier rendu, ce qui évite tout écart
 * d'hydratation.
 */

const DAYS_MIN = 2;
const DAYS_MAX = 5;

/** Ajoute `n` jours ouvrés (samedi et dimanche exclus) à une date. */
function addBusinessDays(from: Date, n: number): Date {
  const d = new Date(from);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

export default function DeliveryEstimate({ lang, inStock }: { lang: string; inStock: boolean }) {
  const [range, setRange] = useState<string | null>(null);
  const en = lang === "en";

  useEffect(() => {
    const now = new Date();
    const from = addBusinessDays(now, DAYS_MIN);
    const to = addBusinessDays(now, DAYS_MAX);
    const locale = en ? "en-GB" : "fr-FR";
    const day = (d: Date) => d.toLocaleDateString(locale, { day: "numeric" });
    const dayMonth = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "long" });
    // « entre le 10 et le 13 août » si même mois, sinon les deux mois.
    // La plage dépend de la date du navigateur : elle ne peut pas être
    // calculée au rendu initial sans provoquer un écart d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRange(
      from.getMonth() === to.getMonth()
        ? `${en ? day(from) : `${day(from)}`} ${en ? "and" : "et le"} ${dayMonth(to)}`
        : `${dayMonth(from)} ${en ? "and" : "et le"} ${dayMonth(to)}`,
    );
  }, [en]);

  if (!range) return null;

  return (
    <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black/75">
      <span className={`h-2 w-2 rounded-full ${inStock ? "bg-bien-leaf" : "bg-bien-gold"}`} />
      <span className="font-semibold text-black">{inStock ? (en ? "In stock" : "En stock") : en ? "Pre-order" : "Précommande"}</span>
      <span className="text-black/40">·</span>
      {en ? `Delivered between ${range}` : `Livré chez vous entre le ${range}`}
    </p>
  );
}
