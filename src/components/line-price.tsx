"use client";

import { useEffect, useState } from "react";
import { CURE_EVENT, discountPercent, lineTotal, type CureChange } from "@/lib/discounts";

/**
 * Prix affiché à côté du sélecteur de quantité (packs et accessoires).
 *
 * Il était rendu côté serveur, donc figé : changer la quantité ne changeait
 * rien à l'écran alors que le panier, lui, suivait (retour client du
 * 03/09/2026). Le sélecteur diffuse déjà son choix sur `window` pour la barre
 * d'achat collante — ce composant s'accroche au même signal.
 *
 * Le prix montré est le total de la ligne, remises de quantité comprises
 * (celles de Shopify, cf. lib/discounts.ts), et le prix barré la valeur de
 * référence pour cette même quantité.
 */
export default function LinePrice({
  handle,
  price,
  compareAtPrice,
  currency,
  lang,
  className = "",
}: {
  handle: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  lang: string;
  className?: string;
}) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const onCure = (e: Event) => {
      const detail = (e as CustomEvent<CureChange>).detail;
      if (!detail || detail.handle !== handle) return;
      setQty(detail.qty);
    };
    window.addEventListener(CURE_EVENT, onCure);
    return () => window.removeEventListener(CURE_EVENT, onCure);
  }, [handle]);

  // Mêmes décimales que `formatPrice` : les prix ronds s'écrivent « 78 € »
  // partout sur le site, pas « 78,00 € ».
  const money = (value: number) =>
    new Intl.NumberFormat(lang === "en" ? "en-IE" : "fr-FR", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);

  const total = lineTotal(price, qty);
  const before = Math.round((compareAtPrice ?? price) * qty * 100) / 100;
  const off = discountPercent(qty);

  return (
    <div className={`flex items-baseline gap-3 flex-wrap ${className}`}>
      <span className="text-base font-bold text-black">{money(total)}</span>
      {before > total && <span className="text-sm text-black/45 line-through">{money(before)}</span>}
      {off > 0 && (
        <span className="rounded-full bg-bien-leaf/15 text-bien-leaf text-[11px] font-bold px-2 py-0.5">-{off}%</span>
      )}
    </div>
  );
}
