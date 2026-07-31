import SiteHeader from "@/components/site-header";

/** Gabarit commun des pages légales (titre + contenu « prose »). */
export default function LegalLayout({
  lang,
  title,
  updated,
  children,
}: {
  lang: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h1 className="font-hero text-[clamp(1.76rem,4.4vw,2.86rem)] leading-[1] text-black">{title}</h1>
        {updated && <p className="mt-3 text-sm text-black/50">{lang === "en" ? "Last updated" : "Dernière mise à jour"} : {updated}</p>}
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-black/75 [&_h2]:font-display [&_h2]:text-black [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-1 [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-bien-leaf [&_a]:underline [&_strong]:text-black">
          {children}
        </div>
      </main>
    </div>
  );
}
