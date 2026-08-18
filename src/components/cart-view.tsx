"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import {
  getCart, setQty, removeItem, cartTotal, cartSubtotal, cartSavings, checkoutUrl, CART_EVENT, type CartItem,
} from "@/lib/cart";
import { discountPercent, lineSubtotal, lineTotal } from "@/lib/discounts";
import { trackMeta } from "@/lib/meta-pixel";

const T = {
  fr: {
    cart: "Panier", empty: "Votre panier est vide.", discover: "Découvrir la boutique",
    yourCart: "Votre panier", removeOne: "Retirer un", addOne: "Ajouter un", remove: "Retirer",
    summary: "Récapitulatif", subtotal: "Sous-total", shipping: "Livraison", shippingCalc: "Calculée au paiement",
    total: "Total", checkout: "Passer au paiement", secure: "Paiement sécurisé · Satisfaits ou remboursés sous 30 jours.",
    continue: "Continuer mes achats", savings: "Remise quantité",
  },
  en: {
    cart: "Cart", empty: "Your cart is empty.", discover: "Discover the shop",
    yourCart: "Your cart", removeOne: "Remove one", addOne: "Add one", remove: "Remove",
    summary: "Summary", subtotal: "Subtotal", shipping: "Shipping", shippingCalc: "Calculated at checkout",
    total: "Total", checkout: "Proceed to checkout", secure: "Secure payment · 30-day money-back guarantee.",
    continue: "Continue shopping", savings: "Quantity discount",
  },
} as const;

export default function CartView({ lang }: { lang: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    setReady(true);
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Sous-total avant remises, remises par quantité, total réellement payé :
  // les mêmes chiffres que Shopify appliquera au checkout (lib/discounts.ts).
  const subtotal = cartSubtotal(items);
  const savings = cartSavings(items);
  const total = cartTotal(items);
  const fmt = (n: number, c = "EUR") => new Intl.NumberFormat(lang === "en" ? "en-IE" : "fr-FR", { style: "currency", currency: c }).format(n);

  if (!ready) return null;

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-cream text-black"><ShoppingBag className="h-7 w-7" /></span>
        <h1 className="mt-5 font-hero text-[clamp(1.76rem,4.4vw,2.64rem)] leading-[1] text-black">{t.cart}</h1>
        <p className="mt-3 text-black/70">{t.empty}</p>
        <Link href={`/${lang}/boutique`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
          {t.discover} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency || "EUR";

  return (
    <div>
      <h1 className="font-hero text-[clamp(1.76rem,4.4vw,2.64rem)] leading-[1] text-black">{t.yourCart}</h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
        {/* Lignes */}
        <ul className="divide-y divide-border rounded-3xl ring-1 ring-border bg-card overflow-hidden">
          {items.map((it) => (
            <li key={it.variantId} className="flex items-center gap-4 p-4 sm:p-5">
              <Link href={`/${lang}/products/${it.handle}`} className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-bien-cream ring-1 ring-border">
                {it.image ? <Image src={it.image} alt={it.title} fill sizes="80px" className="object-cover" /> : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/${lang}/products/${it.handle}`}><h3 className="font-display text-black leading-tight hover:text-bien-leaf transition-colors">{it.title}</h3></Link>
                <p className="mt-0.5 text-sm text-black/60">{fmt(it.price, it.currency)}</p>
                <div className="mt-2 inline-flex items-center rounded-full ring-1 ring-border">
                  <button aria-label={t.removeOne} onClick={() => setQty(it.variantId, it.qty - 1)} className="grid place-items-center h-8 w-8 text-black hover:bg-bien-cream rounded-l-full transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-8 text-center text-sm font-semibold text-black">{it.qty}</span>
                  <button aria-label={t.addOne} onClick={() => setQty(it.variantId, it.qty + 1)} className="grid place-items-center h-8 w-8 text-black hover:bg-bien-cream rounded-r-full transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-black">{fmt(lineTotal(it.price, it.qty), it.currency)}</p>
                {discountPercent(it.qty) > 0 && (
                  <p className="text-xs text-black/45">
                    <span className="line-through">{fmt(lineSubtotal(it.price, it.qty), it.currency)}</span>
                    <span className="ml-1.5 font-semibold text-bien-leaf">-{discountPercent(it.qty)}%</span>
                  </p>
                )}
                <button onClick={() => removeItem(it.variantId)} className="mt-2 inline-flex items-center gap-1 text-xs text-black/50 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /> {t.remove}</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Récap */}
        <aside className="rounded-3xl ring-1 ring-border bg-card p-6 bien-shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-black">{t.summary}</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-black/60">{t.subtotal}</span>
            <span className="font-semibold text-black">{fmt(subtotal, currency)}</span>
          </div>
          {savings > 0 && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-bien-leaf">{t.savings}</span>
              <span className="font-semibold text-bien-leaf">-{fmt(savings, currency)}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-black/60">{t.shipping}</span>
            <span className="text-black/60">{t.shippingCalc}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="font-display text-black">{t.total}</span>
            <span className="font-display text-xl text-black">{fmt(total, currency)}</span>
          </div>
          <a
            href={checkoutUrl(items)}
            onClick={() =>
              // Départ vers le checkout Shopify : dernière conversion mesurable
              // côté site (le tunnel Shopify a son propre pixel).
              trackMeta("InitiateCheckout", {
                content_ids: items.map((i) => i.handle),
                content_type: "product",
                num_items: items.reduce((n, i) => n + i.qty, 0),
                value: total,
                currency: currency || "EUR",
              })
            }
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-6 py-4 font-bold hover:bg-bien-leaf transition-colors bien-shadow-sm"
          >
            {t.checkout} <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-2 text-xs text-black/50 text-center">{t.secure}</p>
          <Link href={`/${lang}/boutique`} className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-bien-leaf hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t.continue}
          </Link>
        </aside>
      </div>
    </div>
  );
}
