"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

/**
 * Sélecteur de langue FR/EN. Conserve la page courante en remplaçant
 * le segment de locale dans l'URL (ex. /fr/blog → /en/blog).
 */

const LOCALES = ["fr", "en"] as const;

export default function LanguageToggle({ current }: { current: string }) {
  const pathname = usePathname() || `/${current}`;

  function hrefFor(loc: string): string {
    const parts = pathname.split("/");
    if (LOCALES.includes(parts[1] as (typeof LOCALES)[number])) {
      parts[1] = loc;
    } else {
      parts.splice(1, 0, loc);
    }
    return parts.join("/") || `/${loc}`;
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Globe className="h-3.5 w-3.5 opacity-70" aria-hidden />
      <div className="inline-flex rounded-full bg-bien-cream/10 p-0.5">
        {LOCALES.map((loc) => (
          <Link
            key={loc}
            href={hrefFor(loc)}
            aria-current={current === loc ? "true" : undefined}
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase transition-colors ${
              current === loc
                ? "bg-bien-gold text-black"
                : "text-bien-cream/75 hover:text-bien-cream"
            }`}
          >
            {loc}
          </Link>
        ))}
      </div>
    </div>
  );
}
