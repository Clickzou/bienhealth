"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAffiliate } from "@/lib/affiliate";

/**
 * Capte le code de l'affilié présent dans l'URL d'arrivée et le garde jusqu'au
 * passage en caisse (voir `lib/affiliate` pour le mécanisme et la question du
 * consentement). Ce composant n'affiche rien.
 *
 * Il relit l'URL à chaque changement de page : le lien d'un affilié peut viser
 * n'importe quelle page — un article, une fiche produit, une collection — et
 * pas seulement l'accueil.
 *
 * `usePathname` plutôt que `useSearchParams` : le second force toute la page
 * dans une frontière Suspense et désactive le rendu statique, alors que le
 * paramètre se lit très bien dans `window.location` une fois le composant monté.
 */
export default function AffiliateTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureAffiliate();
  }, [pathname]);

  return null;
}
