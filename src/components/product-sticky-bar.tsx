"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import AddToCart from "./add-to-cart";
import type { CartItem } from "@/lib/cart";

/**
 * Barre d'achat sticky en bas de la fiche produit (apparaît au scroll).
 * Fond vert (bien-forest), texte crème, bouton or.
 */
export default function ProductStickyBar({
  title,
  price,
  available,
  item,
  lang,
  ctaLabel = "Ajouter au panier",
  anchorId = "reviews-start",
}: {
  title: string;
  price: string;
  available: boolean;
  item: Omit<CartItem, "qty">;
  lang: string;
  ctaLabel?: string;
  anchorId?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // La barre apparaît quand le trait de séparation au-dessus des avis
    // entre dans le viewport (et reste visible ensuite), pas avant.
    const onScroll = () => {
      const el = document.getElementById(anchorId);
      if (!el) {
        setShow(false);
        return;
      }
      setShow(el.getBoundingClientRect().top <= window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [anchorId]);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}
      aria-hidden={!show}
    >
      <div className="bg-bien-forest text-bien-cream border-t border-bien-cream/10 bien-shadow">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-bien-cream leading-tight truncate">{title}</p>
            <p className="text-sm text-bien-cream/70">{price}</p>
          </div>
          {available ? (
            <AddToCart
              item={item}
              lang={lang}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-bien-forest px-6 sm:px-9 py-3 font-bold hover:brightness-105 transition bien-shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{ctaLabel}</span>
            </AddToCart>
          ) : (
            <button type="button" disabled className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-bien-forest px-6 sm:px-9 py-3 font-bold opacity-50 cursor-not-allowed">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === "en" ? "Back soon" : "Bientôt de retour"}</span>
              <span className="sm:hidden">{lang === "en" ? "Soon" : "Bientôt"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
