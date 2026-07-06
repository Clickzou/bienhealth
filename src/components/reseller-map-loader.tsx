"use client";

import dynamic from "next/dynamic";

/**
 * Charge la carte des revendeurs uniquement côté client (Leaflet accède à `window`).
 */
const ResellerMap = dynamic(() => import("./reseller-map"), {
  ssr: false,
  loading: () => (
    <div className="grid place-items-center h-[400px] lg:h-[600px] rounded-3xl ring-1 ring-border bg-muted text-black/50 text-sm">
      Chargement de la carte…
    </div>
  ),
});

export default ResellerMap;
