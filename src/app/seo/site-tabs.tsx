import Link from "next/link";

/** Onglets du tableau de bord : un par site de BIEN, même connexion, mêmes blocs. */
export default function SiteTabs({ active }: { active: "bien" | "microdose" }) {
  const tabs = [
    { key: "bien", href: "/seo", label: "BIEN Health" },
    { key: "microdose", href: "/seo/microdose", label: "Microdose" },
  ] as const;
  return (
    <nav className="flex gap-1 rounded-full bg-black/[0.04] p-1" aria-label="Site">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          prefetch={false}
          aria-current={t.key === active ? "page" : undefined}
          className={`rounded-full px-4 py-1.5 text-[13px] transition ${
            t.key === active ? "bg-white font-semibold text-[#00112b] shadow-sm" : "text-[#5a6472] hover:text-[#00112b]"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
