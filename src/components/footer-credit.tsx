"use client";

import { usePathname } from "next/navigation";

/** Crédit agence — affiché uniquement sur la page d'accueil. */
export default function FooterCredit({ lang }: { lang: string }) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  if (!isHome) return null;

  return (
    <p className="mt-3 text-xs text-bien-cream/55">
      Clickzou :{" "}
      <a
        href="https://clickzou.fr/agence-e-commerce-toulouse/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-bien-gold"
      >
        Création site e-commerce sur-mesure
      </a>
    </p>
  );
}
