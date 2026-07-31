"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, X, ShoppingBag, ArrowRight } from "lucide-react";
import { addToCart, type CartItem } from "@/lib/cart";
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
}: {
  item: Omit<CartItem, "qty">;
  lang: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const en = lang === "en";
  const t = en
    ? { added: "Your item has been added to the cart", close: "Close", cont: "Continue shopping", view: "View cart", aria: "Item added to cart" }
    : { added: "Votre article a été ajouté au panier", close: "Fermer", cont: "Continuer mes achats", view: "Voir le panier", aria: "Article ajouté au panier" };

  function add() {
    addToCart(item);
    // Conversion Meta (ne part que si le pixel est chargé, donc après consentement).
    trackMeta("AddToCart", {
      content_ids: [item.handle],
      content_name: item.title,
      content_type: "product",
      value: item.price,
      currency: item.currency || "EUR",
    });
    setOpen(true);
  }

  const price = new Intl.NumberFormat(en ? "en-IE" : "fr-FR", { style: "currency", currency: item.currency || "EUR" }).format(item.price);

  return (
    <>
      <button type="button" onClick={add} className={className}>
        {children}
      </button>

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
                <p className="text-sm text-black/60">{price}</p>
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
