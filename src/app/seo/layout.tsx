import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

/**
 * Racine autonome du tableau de bord.
 *
 * `/seo` vit hors du segment `[lang]` : pas d'en-tête, pas de pied de page, pas
 * de bannière cookies, et surtout **ni Analytics ni pixel Meta** — un outil de
 * mesure qui se mesure lui-même fausse les chiffres qu'il affiche.
 *
 * Ce fichier est donc un second layout racine (il porte `<html>` et `<body>`),
 * le premier étant celui du site public dans `[lang]/layout.tsx`.
 */
const display = localFont({
  src: "../fonts/Dahlia-MediumCondensed.otf",
  variable: "--font-dahlia",
  weight: "500",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../fonts/Moderat-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Moderat-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-moderat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO by Clickzou — bien.health",
  // Outil interne : jamais indexé, jamais suivi par un robot, même si l'URL fuit.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[#050d1c] text-white antialiased" style={{ fontFamily: "var(--font-moderat), ui-sans-serif, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
