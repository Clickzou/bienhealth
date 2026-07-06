"use client";

import { useEffect, useRef } from "react";

/**
 * Widget officiel Trustpilot (TrustBox). La note et les avis se synchronisent
 * automatiquement depuis Trustpilot. Nécessite le Business Unit ID et un
 * Template ID (récupérables dans Trustpilot Business → Showcase → TrustBox).
 *
 * Si les identifiants ne sont pas fournis, le composant ne rend rien
 * (le site reste fonctionnel avec son affichage statique de repli).
 */

const TP_SCRIPT = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

export const TRUSTPILOT_URL = "https://fr.trustpilot.com/review/bien.health";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

export default function TrustpilotWidget({
  templateId,
  businessUnitId,
  height = "52px",
  width = "100%",
  theme = "light",
  stars = "4,5",
  className = "",
}: {
  templateId?: string;
  businessUnitId?: string;
  height?: string;
  width?: string;
  theme?: "light" | "dark";
  stars?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!businessUnitId || !templateId) return;

    const render = () => {
      if (window.Trustpilot && ref.current) window.Trustpilot.loadFromElement(ref.current, true);
    };

    if (window.Trustpilot) {
      render();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${TP_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = TP_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => script?.removeEventListener("load", render);
  }, [templateId, businessUnitId]);

  // Pas encore configuré → on ne rend rien (repli statique géré par la page)
  if (!businessUnitId || !templateId) return null;

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className}`}
      data-locale="fr-FR"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
      data-stars={stars}
    >
      <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
}
