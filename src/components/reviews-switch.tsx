"use client";

import { useEffect, useState } from "react";
import LooxReviews from "./loox-reviews";

/**
 * Aiguille l'affichage des avis :
 *  - sur bien.health (domaine autorisé par Loox) → vrai widget Loox natif
 *    (avis live + formulaire d'avis officiel → dashboard Loox).
 *  - ailleurs (localhost, preview Vercel) → notre affichage maison (children),
 *    car Loox bloque son widget hors des domaines whitelistés.
 *
 * Le forçage `?loox=1` permet de tester le widget natif même hors prod.
 */
export default function ReviewsSwitch({
  productId,
  children,
}: {
  productId: string;
  children: React.ReactNode;
}) {
  const [useLoox, setUseLoox] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const forced = new URLSearchParams(window.location.search).get("loox") === "1";
    if (forced || host === "bien.health" || host.endsWith(".bien.health")) {
      setUseLoox(true);
    }
  }, []);

  return (
    <div id="reviews-start" className="scroll-mt-24">
      {useLoox ? (
        <section className="mt-16 sm:mt-24 border-t border-border pt-12 sm:pt-16">
          <LooxReviews productId={productId} />
        </section>
      ) : (
        children
      )}
    </div>
  );
}
