/**
 * Consentement cookies (RGPD) — partagé entre la bannière et les scripts tiers.
 * "all" = mesure d'audience autorisée (Google Analytics) ; "essential" = refus.
 */
export const CONSENT_KEY = "bien-cookie-consent";
export const CONSENT_EVENT = "bien-consent-change";

export type Consent = "all" | "essential";

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}
