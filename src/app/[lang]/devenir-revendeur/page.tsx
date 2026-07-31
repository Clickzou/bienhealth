import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Handshake, ArrowLeft, Truck, Store, HeartPulse } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ResellerForm from "@/components/reseller-form";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "devenir-revendeur",
    title: lang === "en" ? "Become a BIEN reseller — Trade enquiry" : "Devenir revendeur BIEN — Demande professionnelle",
    description: lang === "en" ? "Are you a professional (café, studio, pharmacy, concept store…)? Join the BIEN reseller network and offer our natural supplements to your customers." : "Vous êtes un professionnel (café, studio, pharmacie, concept-store…) ? Rejoignez le réseau de revendeurs BIEN et proposez nos compléments naturels à vos clients.",
  });
}

const PERK_ICONS = [Store, HeartPulse, Truck];

const T = {
  fr: {
    back: "Nos revendeurs", eyebrow: "Espace professionnels", h1: "Devenez revendeur BIEN.",
    intro: "Café, studio, pharmacie, concept-store, spa… Proposez à vos clients une gamme de compléments naturels aux adaptogènes et champignons fonctionnels, dosés selon la science.",
    perks: [
      { title: "Une marque premium", text: "Des compléments naturels, clean et fabriqués en France qui valorisent votre offre." },
      { title: "Un accompagnement dédié", text: "Conseils produits, supports de vente et interlocuteur unique." },
      { title: "Conditions pros", text: "Tarifs revendeurs, réassort simple et livraison rapide." },
    ],
  },
  en: {
    back: "Our resellers", eyebrow: "Trade area", h1: "Become a BIEN reseller.",
    intro: "Café, studio, pharmacy, concept store, spa… Offer your customers a range of natural supplements with adaptogens and functional mushrooms, dosed according to science.",
    perks: [
      { title: "A premium brand", text: "Natural, clean supplements made in France that elevate your offering." },
      { title: "Dedicated support", text: "Product advice, sales materials and a single point of contact." },
      { title: "Trade terms", text: "Reseller pricing, easy restocking and fast delivery." },
    ],
  },
} as const;

export default async function DevenirRevendeurPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];
  const PERKS = t.perks.map((p, i) => ({ ...p, icon: PERK_ICONS[i] }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <main className="px-4 sm:px-6 lg:px-[100px] py-10 sm:py-14">
        <Link href={`/${lang}/revendeurs`} className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black mb-8">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Présentation */}
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
              <Handshake className="h-4 w-4" /> {t.eyebrow}
            </p>
            <h1 className="mt-3 font-hero text-[clamp(1.98rem,4.4vw,3.08rem)] leading-[0.95] text-black">
              {t.h1}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
              {t.intro}
            </p>

            <ul className="mt-8 space-y-5">
              {PERKS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="shrink-0 grid place-items-center h-11 w-11 rounded-2xl bg-bien-gold text-bien-forest"><Icon className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-display text-black leading-tight">{title}</h2>
                    <p className="mt-1 text-sm text-black/70 leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulaire */}
          <div>
            <ResellerForm lang={lang} />
          </div>
        </div>
      </main>
    </div>
  );
}
