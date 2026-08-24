"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingBag, ArrowRight } from "lucide-react";
import { addToCart, type CartItem } from "@/lib/cart";
import { CURE_QUANTITIES, BEST_VALUE_QUANTITY, MAX_QUANTITY, discountPercent, emitCureChange, lineSubtotal, lineTotal } from "@/lib/discounts";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { trackMeta } from "@/lib/meta-pixel";

/** Quantités du menu « autre quantité » (compléments) et du menu « 6+ » (accessoires). */
const FREE_QUANTITIES = Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1);
const BULK_QUANTITIES = FREE_QUANTITIES.filter((n) => n >= 6);

/**
 * Bouton « Ajouter au panier » : ajoute l'article au panier local et ouvre une
 * popup de confirmation (« Continuer mes achats » / « Voir le panier »).
 */
export default function AddToCart({
  item,
  lang,
  className,
  children,
  /** Affiche un sélecteur de quantité devant le bouton (accessoires). */
  quantitySelector = false,
  /**
   * Affiche le choix de la cure (1, 2, 3 ou 6 mois) avec les remises Shopify,
   * à la place du sélecteur ci-dessus. Réservé aux compléments : une « cure de
   * 3 mois » n'a aucun sens pour un mousseur à lait.
   */
  cureSelector = false,
  /**
   * Nombre de jours couverts par une unité (60 gummies à 2/jour comme 30
   * portions de poudre = 30 jours). Sert à ramener le prix à la journée, que
   * le client trouve plus parlant que le prix au mois.
   */
  daysPerUnit = 30,
  /**
   * Glissé JUSTE SOUS le bouton : le client y veut la disponibilité et la
   * fenêtre de livraison (demande du 24/08/2026). Elles étaient auparavant
   * au-dessus du bouton, et avant cela tout en haut de la colonne.
   */
  afterButton,
  /**
   * Quantité imposée de l'extérieur (barre d'achat collante) : elle suit alors
   * le choix de cure fait plus haut dans la fiche, au lieu d'ajouter
   * obstinément une unité.
   */
  quantity,
}: {
  item: Omit<CartItem, "qty">;
  lang: string;
  className?: string;
  children: React.ReactNode;
  quantitySelector?: boolean;
  cureSelector?: boolean;
  daysPerUnit?: number;
  afterButton?: React.ReactNode;
  quantity?: number;
}) {
  const [open, setOpen] = useState(false);
  const [ownQty, setOwnQty] = useState(1);
  // Une quantité imposée gagne : c'est le cas de la barre collante, qui reflète
  // le choix de cure du sélecteur principal.
  const qty = quantity ?? ownQty;
  const setQty = setOwnQty;
  /** Le second menu (6 à 15) n'apparaît qu'après un clic sur « 6+ ». */
  const [moreQty, setMoreQty] = useState(false);
  const en = lang === "en";
  const t = en
    ? {
        added: "Your item has been added to the cart", close: "Close", cont: "Continue shopping", view: "View cart",
        aria: "Item added to cart", quantity: "Quantity",
        cureTitle: "Choose your course", month: "month", months: "months", unit: "item", units: "items",
        perDay: "per day", bestValue: "Best value", freeShipping: "Free shipping",
        otherQty: "Another quantity", pick: "Choose a quantity",
      }
    : {
        added: "Votre article a été ajouté au panier", close: "Fermer", cont: "Continuer mes achats", view: "Voir le panier",
        aria: "Article ajouté au panier", quantity: "Quantité",
        cureTitle: "Choisissez votre cure", month: "mois", months: "mois", unit: "produit", units: "produits",
        perDay: "par jour", bestValue: "Meilleure offre", freeShipping: "Livraison offerte",
        otherQty: "Autre quantité", pick: "Choisir une quantité",
      };

  // Seule l'instance qui porte un sélecteur diffuse son choix : la barre
  // collante écoute, elle ne parle pas (sinon les deux se répondraient).
  const broadcasts = cureSelector || quantitySelector;
  useEffect(() => {
    if (!broadcasts) return;
    emitCureChange({ handle: item.handle, qty });
  }, [broadcasts, item.handle, qty]);

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
                      {n} {n > 1 ? t.units : t.unit} · {money(total / (n * daysPerUnit))} {t.perDay}
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
          {/* Quantité libre : les quatre cures couvrent les paliers de remise
              Shopify, mais rien ne permettait d'en commander cinq (demande
              client du 19/08/2026). Le menu reprend la remise du palier
              atteint, la ligne sélectionnée ci-dessus se dé-surligne d'elle-même
              quand la quantité n'est plus l'une des quatre. */}
          <label className="mt-2.5 flex items-center gap-2.5 text-xs text-black/55">
            {t.otherQty}
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              aria-label={t.pick}
              className="rounded-full ring-1 ring-border bg-card px-3 py-1.5 text-sm font-semibold text-black"
            >
              {FREE_QUANTITIES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      <div className={quantitySelector ? "flex items-center gap-3" : "contents"}>
        {quantitySelector && (
          /* 1 à 5 puis « 6+ », qui déplie un menu jusqu'à 15 : le trio 1/2/3
             ne permettait pas de commander plus de trois mousseurs (demande
             client du 19/08/2026). */
          <div className="shrink-0 flex items-center gap-2">
            <div className="inline-flex items-center rounded-full ring-1 ring-border bg-card p-1" role="group" aria-label={t.quantity}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setQty(n); setMoreQty(false); }}
                  aria-pressed={qty === n && !moreQty}
                  className={`h-9 w-9 rounded-full text-sm font-bold transition ${qty === n && !moreQty ? "bg-bien-forest text-bien-cream" : "text-black/70 hover:bg-bien-cream"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setMoreQty(true); setQty(6); }}
                aria-pressed={moreQty}
                className={`h-9 px-3 rounded-full text-sm font-bold transition ${moreQty ? "bg-bien-forest text-bien-cream" : "text-black/70 hover:bg-bien-cream"}`}
              >
                6+
              </button>
            </div>
            {moreQty && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                aria-label={t.pick}
                className="h-9 rounded-full ring-1 ring-border bg-card px-3 text-sm font-semibold text-black"
              >
                {BULK_QUANTITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            )}
          </div>
        )}
        <button type="button" onClick={add} className={className}>
          {children}
        </button>
      </div>

      {afterButton}

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
