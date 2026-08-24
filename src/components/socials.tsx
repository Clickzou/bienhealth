/**
 * Comptes sociaux de la marque, partagés par la barre d'offre et le footer :
 * les deux affichaient les mêmes liens, l'un d'eux finissait toujours par
 * dériver. Les paramètres de suivi collés par le client au bout de l'URL
 * TikTok (`is_from_webapp`, `sender_device`) sont retirés : ils décrivent sa
 * propre navigation, pas celle des visiteurs.
 */

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.4 8.75 22 11.1 22 14.16V21h-4v-6.06c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.2V21h-3.9V9Z" />
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.2-2.65V9.4a5.9 5.9 0 1 0 5.2 5.85V8.9a7.2 7.2 0 0 0 4 1.22V7.06a4.2 4.2 0 0 1-4-4.06V2Z" />
    </svg>
  );
}

export const SOCIALS = [
  { href: "https://www.instagram.com/bien.health/", label: "Instagram BIEN health", icon: InstagramIcon },
  { href: "https://www.tiktok.com/@bien.health", label: "TikTok BIEN health", icon: TikTokIcon },
  { href: "https://fr.linkedin.com/company/bien-health", label: "LinkedIn BIEN health", icon: LinkedInIcon },
] as const;
