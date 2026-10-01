"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta-pixel";
import { trackGa } from "@/lib/ga";
import { CONSENT_EVENT } from "@/lib/consent";
import { trackKlaviyo } from "@/lib/klaviyo-onsite";

/**
 * Envoie l'évènement Meta `ViewContent` et son équivalent GA4 `view_item` à
 * l'affichage d'une fiche produit (audience de reciblage « a vu ce produit »,
 * premier palier de l'entonnoir d'achat). Ne rend rien ; sans consentement,
 * les appels sont ignorés.
 *
 * Envoie aussi `Viewed Product` à Klaviyo, qui déclenche le flux de navigation
 * abandonnée. Si le consentement arrive alors que la fiche est déjà affichée,
 * l'évènement part à ce moment-là, une seule fois.
 */
export default function MetaViewContent({
  handle,
  title,
  price,
  currency = "EUR",
  productId,
  image,
}: {
  handle: string;
  title: string;
  price: number;
  currency?: string;
  /** Id numérique du produit Shopify, tel que le thème l'envoyait à Klaviyo. */
  productId?: string;
  image?: string | null;
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

  useEffect(() => {
    const send = () =>
      trackKlaviyo("Viewed Product", {
        ProductName: title,
        ProductID: productId ?? handle,
        SKU: handle,
        ImageURL: image ?? undefined,
        URL: window.location.origin + window.location.pathname,
        Brand: "BIEN health",
        Price: price,
      });
    if (send()) return;
    const onConsent = () => {
      if (send()) window.removeEventListener(CONSENT_EVENT, onConsent);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [handle, title, price, productId, image]);

  return null;
}
