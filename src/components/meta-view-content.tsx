"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta-pixel";

/**
 * Envoie l'évènement Meta `ViewContent` à l'affichage d'une fiche produit
 * (audience de reciblage « a vu ce produit »). Ne rend rien ; sans pixel
 * chargé (pas d'ID ou pas de consentement), l'appel est ignoré.
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
  }, [handle, title, price, currency]);

  return null;
}
