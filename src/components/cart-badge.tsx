"use client";

import { useEffect, useState } from "react";
import { getCart, cartCount, CART_EVENT } from "@/lib/cart";

/** Pastille du nombre d'articles sur l'icône panier (se met à jour en direct). */
export default function CartBadge() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const update = () => setN(cartCount(getCart()));
    update();
    window.addEventListener(CART_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <span className="absolute top-0 right-0 grid place-items-center h-4 w-4 rounded-full bg-bien-gold text-black text-[10px] font-bold">
      {n}
    </span>
  );
}
