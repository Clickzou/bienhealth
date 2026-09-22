"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta-pixel";
import { trackGa } from "@/lib/ga";

/**
 * Envoie l'évènement Meta `ViewContent` et son équivalent GA4 `view_item` à
 * l'affichage d'une fiche produit (audience de reciblage « a vu ce produit »,
 * premier palier de l'entonnoir d'achat). Ne rend rien ; sans consentement,
 * les appels sont ignorés.
 */
export default function MetaViewContent({
  handle,
  title,
  price,
  currency = "EUR",
}: {
  handle: string;
  title: string;
  price: number;
  currency?: string;
}) {
  useEffect(() => {
    trackMeta("ViewContent", {
      content_ids: [handle],
      content_name: title,
      content_type: "product",
      value: price,
      currency,
    });
    trackGa("view_item", {
      currency,
      value: price,
      items: [{ item_id: handle, item_name: title, price, quantity: 1 }],
    });
  }, [handle, title, price, currency]);

  return null;
}
