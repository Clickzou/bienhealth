"use client";

import { useEffect } from "react";

/**
 * Widget Loox natif (affichage des avis + bouton « Écrire un avis » officiel).
 *
 * Le loader est propre à la boutique (clientId I2aPPJvqTz). Loox n'autorise le
 * rendu que sur les domaines whitelistés (« External domains ») — donc sur
 * bien.health en production. Les avis soumis via ce widget arrivent
 * directement dans le dashboard Loox pour modération, comme sur l'ancien site.
 */

const LOOX_LOADER = "https://loox.io/widget/I2aPPJvqTz/loox.js";

declare global {
  interface Window {
    LOOX?: {
      showReviewForm?: (productId: string) => void;
      renderReviews?: () => void;
      init?: () => void;
    };
  }
}

export default function LooxReviews({ productId }: { productId: string }) {
  useEffect(() => {
    // Injecte le loader Loox une seule fois pour toute la session.
    let script = document.querySelector<HTMLScriptElement>("script[data-loox-loader]");
    if (!script) {
      script = document.createElement("script");
      script.src = LOOX_LOADER;
      script.defer = true;
      script.setAttribute("data-loox-loader", "1");
      document.body.appendChild(script);
    } else {
      // Déjà chargé (navigation SPA) → on redemande un rendu du conteneur.
      window.LOOX?.renderReviews?.();
      window.LOOX?.init?.();
    }
  }, [productId]);

  return (
    <div
      id="looxReviews"
      data-product-id={productId}
      data-write-btn="true"
      data-header="true"
      data-paging="true"
    />
  );
}
