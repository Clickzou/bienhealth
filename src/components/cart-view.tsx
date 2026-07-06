"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import {
  getCart, setQty, removeItem, cartTotal, checkoutUrl, CART_EVENT, type CartItem,
} from "@/lib/cart";

export default function CartView({ lang }: { lang: string }) {
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

  const total = cartTotal(items);
  const fmt = (n: number, c = "EUR") => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(n);

  if (!ready) return null;

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-cream text-black"><ShoppingBag className="h-7 w-7" /></span>
        <h1 className="mt-5 font-display font-black tracking-tighter text-[clamp(2rem,5vw,3rem)] leading-[1] text-black">Panier</h1>
        <p className="mt-3 text-black/70">Votre panier est vide.</p>
        <Link href={`/${lang}/collections/accessories`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
          Découvrir la boutique <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency || "EUR";

  return (
    <div>
      <h1 className="font-display font-black tracking-tighter text-[clamp(2rem,5vw,3rem)] leading-[1] text-black">Votre panier</h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
        {/* Lignes */}
        <ul className="divide-y divide-border rounded-3xl ring-1 ring-border bg-card overflow-hidden">
          {items.map((it) => (
            <li key={it.variantId} className="flex items-center gap-4 p-4 sm:p-5">
              <Link href={`/${lang}/products/${it.handle}`} className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-bien-cream ring-1 ring-border">
                {it.image ? <Image src={it.image} alt={it.title} fill sizes="80px" className="object-cover" /> : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/${lang}/products/${it.handle}`}><h3 className="font-display font-black text-black leading-tight hover:text-bien-leaf transition-colors">{it.title}</h3></Link>
                <p className="mt-0.5 text-sm text-black/60">{fmt(it.price, it.currency)}</p>
                <div className="mt-2 inline-flex items-center rounded-full ring-1 ring-border">
                  <button aria-label="Retirer un" onClick={() => setQty(it.variantId, it.qty - 1)} className="grid place-items-center h-8 w-8 text-black hover:bg-bien-cream rounded-l-full transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-8 text-center text-sm font-semibold text-black">{it.qty}</span>
                  <button aria-label="Ajouter un" onClick={() => setQty(it.variantId, it.qty + 1)} className="grid place-items-center h-8 w-8 text-black hover:bg-bien-cream rounded-r-full transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-black">{fmt(it.price * it.qty, it.currency)}</p>
                <button onClick={() => removeItem(it.variantId)} className="mt-2 inline-flex items-center gap-1 text-xs text-black/50 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /> Retirer</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Récap */}
        <aside className="rounded-3xl ring-1 ring-border bg-card p-6 bien-shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display font-black text-lg text-black">Récapitulatif</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-black/60">Sous-total</span>
            <span className="font-semibold text-black">{fmt(total, currency)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-black/60">Livraison</span>
            <span className="text-black/60">Calculée au paiement</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="font-display font-black text-black">Total</span>
            <span className="font-display font-black text-xl text-black">{fmt(total, currency)}</span>
          </div>
          <a href={checkoutUrl(items)} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-6 py-4 font-bold hover:bg-bien-leaf transition-colors bien-shadow-sm">
            Passer au paiement <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-2 text-xs text-black/50 text-center">Paiement sécurisé Shopify · Satisfait ou remboursé 30 jours.</p>
          <Link href={`/${lang}/collections/accessories`} className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-bien-leaf hover:underline">
            <ArrowLeft className="h-4 w-4" /> Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}
