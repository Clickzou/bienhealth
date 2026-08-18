"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingBag, ArrowRight } from "lucide-react";
import { addToCart, type CartItem } from "@/lib/cart";
import { CURE_QUANTITIES, BEST_VALUE_QUANTITY, discountPercent, lineSubtotal, lineTotal } from "@/lib/discounts";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { trackMeta } from "@/lib/meta-pixel";

/**
 * Bouton « Ajouter au panier » : ajoute l'article au panier local et ouvre une
 * popup de confirmation (« Continuer mes achats » / « Voir le panier »).
 */
export default function AddToCart({
  item,
  lang,
  className,
  children,
  /** Affiche un sélecteur 1 / 2 / 3 devant le bouton (accessoires). */
  quantitySelector = false,
  /**
   * Affiche le choix de la cure (1, 2, 3 ou 6 mois) avec les remises Shopify,
   * à la place du sélecteur ci-dessus. Réservé aux compléments : une « cure de
   * 3 mois » n'a aucun sens pour un mousseur à lait.
   */
  cureSelector = false,
}: {
  item: Omit<CartItem, "qty">;
  lang: string;
  className?: string;
  children: React.ReactNode;
  quantitySelector?: boolean;
  cureSelector?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const en = lang === "en";
  const t = en
    ? {
        added: "Your item has been added to the cart", close: "Close", cont: "Continue shopping", view: "View cart",
        aria: "Item added to cart", quantity: "Quantity",
        cureTitle: "Choose your course", month: "month", months: "months", unit: "item", units: "items",
        perMonth: "per month", bestValue: "Best value", freeShipping: "Free shipping",
      }
    : {
        added: "Votre article a été ajouté au panier", close: "Fermer", cont: "Continuer mes achats", view: "Voir le panier",
        aria: "Article ajouté au panier", quantity: "Quantité",
        cureTitle: "Choisissez votre cure", month: "mois", months: "mois", unit: "produit", units: "produits",
        perMonth: "par mois", bestValue: "Meilleure offre", freeShipping: "Livraison offerte",
      };

  const currency = item.currency || "EUR";
  const money = (value: number) =>
    new Intl.NumberFormat(en ? "en-IE" : "fr-FR", { style: "currency", currency }).format(value);

  function add() {
    addToCart(item, qty);
    // Conversion Meta (ne part que si le pixel est chargé, donc après consentement).
    // La valeur envoyée est celle réellement payée : les remises par quantité
    // sont appliquées par Shopify au checkout.
    trackMeta("AddToCart", {
      content_ids: [item.handle],
      content_name: item.title,
      content_type: "product",
      value: lineTotal(item.price, qty),
      currency,
    });
    setOpen(true);
  }

  const price = money(lineTotal(item.price, qty));

  return (
    <>
      {cureSelector && (
        /* Les remises viennent de Shopify (voir lib/discounts.ts) : le site les
           réaffiche, il ne les invente pas. Le prix barré est donc celui qui
           sera bien remisé au paiement. */
        <fieldset className="mb-4">
          <legend className="text-xs font-bold uppercase tracking-[0.18em] text-black/50 mb-2.5">{t.cureTitle}</legend>
          <div className="space-y-2" role="radiogroup" aria-label={t.cureTitle}>
            {CURE_QUANTITIES.map((n) => {
              const total = lineTotal(item.price, n);
              const before = lineSubtotal(item.price, n);
              const off = discountPercent(n);
              const selected = qty === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setQty(n)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-colors ${
                    selected ? "bg-bien-cream ring-2 ring-bien-forest" : "bg-card ring-1 ring-border hover:bg-bien-cream/50"
                  }`}
                >
                  <span className={`shrink-0 grid place-items-center h-4 w-4 rounded-full ring-1 ${selected ? "ring-bien-forest" : "ring-border"}`}>
                    {selected && <span className="h-2 w-2 rounded-full bg-bien-forest" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-bold text-black">{n} {n > 1 ? t.months : t.month}</span>
                      {off > 0 && (
                        <span className="rounded-full bg-bien-leaf/15 text-bien-leaf text-[11px] font-bold px-2 py-0.5">-{off}%</span>
                      )}
                      {n === BEST_VALUE_QUANTITY && (
                        <span className="rounded-full bg-bien-forest text-bien-cream text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">{t.bestValue}</span>
                      )}
                    </span>
                    <span className="block text-[11px] text-black/55 mt-0.5">
                      {n} {n > 1 ? t.units : t.unit} · {money(total / n)} {t.perMonth}
                      {total >= FREE_SHIPPING_THRESHOLD && <> · <span className="text-bien-leaf font-semibold">{t.freeShipping}</span></>}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-black">{money(total)}</span>
                    {off > 0 && <span className="block text-[11px] text-black/45 line-through">{money(before)}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className={quantitySelector ? "flex items-center gap-3" : "contents"}>
        {quantitySelector && (
          <div className="shrink-0 inline-flex items-center rounded-full ring-1 ring-border bg-card p-1" role="group" aria-label={t.quantity}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQty(n)}
                aria-pressed={qty === n}
                className={`h-9 w-9 rounded-full text-sm font-bold transition ${qty === n ? "bg-bien-forest text-bien-cream" : "text-black/70 hover:bg-bien-cream"}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <button type="button" onClick={add} className={className}>
          {children}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.aria}>
          <button aria-label={t.close} onClick={() => setOpen(false)} className="absolute inset-0 bg-bien-forest/45 backdrop-blur-sm" />

          <div className="relative w-full max-w-md rounded-[1.75rem] bg-white ring-1 ring-border bien-shadow p-6 sm:p-8 animate-[bien-fade-up_0.3s_ease]">
            <button onClick={() => setOpen(false)} aria-label={t.close} className="absolute top-4 right-4 grid place-items-center h-8 w-8 rounded-full text-black/60 hover:bg-bien-cream transition-colors">
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-bien-leaf font-semibold">
              <span className="grid place-items-center h-7 w-7 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-4 w-4" /></span>
              {t.added}
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-bien-cream/60 ring-1 ring-border p-3">
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="grid place-items-center h-full w-full text-black/40"><ShoppingBag className="h-6 w-6" /></span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display text-black leading-tight truncate">{item.title}</p>
                <p className="text-sm text-black/60">{qty > 1 && <span className="font-semibold text-black">×{qty} · </span>}{price}</p>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-5 py-3 text-sm font-semibold hover:bg-bien-cream transition-colors"
              >
                {t.cont}
              </button>
              <Link
                href={`/${lang}/cart`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-5 py-3 text-sm font-semibold hover:bg-bien-leaf transition-colors"
              >
                {t.view} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
