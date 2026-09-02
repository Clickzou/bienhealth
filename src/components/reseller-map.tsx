"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

export type Reseller = {
  name: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

/** Icône « pin » BIEN (SVG) — évite les images marqueur par défaut de Leaflet. */
function pinIcon(active: boolean) {
  const color = active ? "#f5b301" : "#20302a";
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="42" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 22 12 22s12-13.6 12-22C24 5.4 18.6 0 12 0z" fill="${color}"/>
      <circle cx="12" cy="12" r="4.5" fill="#fffdf9"/>
    </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

function directionsUrl(r: Reseller) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${r.address}, ${r.city}, ${r.country}`)}`;
}

export default function ResellerMap({ resellers }: { resellers: Reseller[] }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    // Sur écran tactile, le déplacement à un doigt est confié à la page : la
    // carte capturait le geste, on faisait glisser la carte au lieu de faire
    // défiler le site. Deux doigts déplacent et zooment la carte.
    const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const map = L.map(mapEl.current, {
      scrollWheelZoom: false,
      dragging: !touch,
    }).setView([47.5, 4.5], 5);
    if (touch) map.getContainer().style.touchAction = "pan-x pan-y";
    mapRef.current = map;

    // Fond de carte gris clair. CARTO (`basemaps.cartocdn.com/light_all`) a été
    // abandonné le 01/09/2026 : le service exige désormais une clé d'API et
    // sert aux appels anonymes une tuile barrée « API KEY REQUIRED », visible
    // en plein milieu de la carte des revendeurs. Le fond Esri « Light Gray »
    // rend la même chose et ne demande pas de clé. Les libellés de villes sont
    // sur une couche séparée, à poser par-dessus le fond.
    // `detectRetina` : les tuiles Esri sont des images 256 px prévues pour un
    // pixel physique par pixel CSS. Sur un écran HiDPI (ou avec le zoom du
    // navigateur) elles étaient étirées et les noms de villes ressortaient
    // flous (retour client). Leaflet demande alors les tuiles du niveau de
    // zoom suivant et les affiche à demi-taille : deux fois plus de pixels
    // pour la même surface, texte net.
    const esri = "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas";
    L.tileLayer(`${esri}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
      attribution: "&copy; Esri &copy; OpenStreetMap",
      maxZoom: 16,
      detectRetina: true,
    }).addTo(map);
    L.tileLayer(`${esri}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
      maxZoom: 16,
      detectRetina: true,
    }).addTo(map);

    resellers.forEach((r, i) => {
      const marker = L.marker([r.lat, r.lng], { icon: pinIcon(false) })
        .addTo(map)
        .bindPopup(
          `<strong>${r.name}</strong><br>${r.address}<br>${r.city}, ${r.country}` +
            `<br><a href="${directionsUrl(r)}" target="_blank" rel="noopener">Voir l'itinéraire</a>`,
        )
        .on("click", () => setActive(i));
      markersRef.current.push(marker);
    });

    // Cadre sur l'ensemble des points.
    const group = L.featureGroup(markersRef.current);
    map.fitBounds(group.getBounds().pad(0.2));

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [resellers]);

  // Met à jour la couleur des marqueurs + centre sur l'actif.
  useEffect(() => {
    markersRef.current.forEach((m, i) => m.setIcon(pinIcon(i === active)));
    if (active !== null && mapRef.current) {
      const r = resellers[active];
      mapRef.current.setView([r.lat, r.lng], 13, { animate: true });
      markersRef.current[active]?.openPopup();
    }
  }, [active, resellers]);

  return (
    /* `isolate` : Leaflet empile ses panneaux à des z-index de 400 à 1000, qui
       passaient au-dessus du header sticky (z-40) au défilement. Un contexte
       d'empilement local les confine dans ce bloc. */
    <div className="isolate relative z-0 grid lg:grid-cols-[360px_1fr] rounded-3xl overflow-hidden ring-1 ring-border bien-shadow-sm bg-card">
      {/* Liste — sous la carte sur téléphone (demande client) : au-dessus, sa
          zone défilante coupait la page en deux et l'on tombait sur une liste
          tronquée avant d'avoir vu la carte. L'ordre d'origine revient dès lg,
          où les deux sont côte à côte. */}
      <div className="order-2 lg:order-1 max-h-[320px] lg:max-h-[600px] overflow-y-auto divide-y divide-border">
        {resellers.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setActive(i)}
            className={`w-full text-left p-4 sm:p-5 flex gap-3 transition-colors ${i === active ? "bg-bien-cream" : "hover:bg-bien-cream/50"}`}
          >
            <span className={`shrink-0 grid place-items-center h-9 w-9 rounded-full ${i === active ? "bg-bien-gold text-bien-forest" : "bg-bien-leaf/12 text-bien-leaf"}`}>
              <MapPin className="h-4.5 w-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-black leading-tight">{r.name}</span>
              <span className="mt-1 block text-sm text-black/65 leading-snug">{r.address}<br />{r.city}, {r.country}</span>
              {i === active && (
                <a
                  href={directionsUrl(r)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-bien-leaf hover:underline"
                >
                  <Navigation className="h-3.5 w-3.5" /> Voir l&apos;itinéraire
                </a>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Carte */}
      <div ref={mapEl} className="order-1 lg:order-2 h-[360px] lg:h-[600px] w-full bg-muted" aria-label="Carte des revendeurs BIEN" />
    </div>
  );
}
