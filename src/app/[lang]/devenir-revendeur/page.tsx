import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Handshake, ArrowLeft, Truck, Store, HeartPulse } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ResellerForm from "@/components/reseller-form";

export const metadata: Metadata = {
  title: "Devenir revendeur BIEN — Demande professionnelle",
  description:
    "Vous êtes un professionnel (café, studio, pharmacie, concept-store…) ? Rejoignez le réseau de revendeurs BIEN et proposez nos compléments naturels à vos clients.",
};

const PERKS = [
  { icon: Store, title: "Une marque premium", text: "Des compléments naturels, clean et fabriqués en France qui valorisent votre offre." },
  { icon: HeartPulse, title: "Un accompagnement dédié", text: "Conseils produits, supports de vente et interlocuteur unique." },
  { icon: Truck, title: "Conditions pros", text: "Tarifs revendeurs, réassort simple et livraison rapide." },
];

export default async function DevenirRevendeurPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <main className="px-4 sm:px-6 lg:px-[100px] py-10 sm:py-14">
        <Link href={`/${lang}/revendeurs`} className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black mb-8">
          <ArrowLeft className="h-4 w-4" /> Nos revendeurs
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Présentation */}
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
              <Handshake className="h-4 w-4" /> Espace professionnels
            </p>
            <h1 className="mt-3 font-display font-black tracking-tighter text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] text-black">
              Devenez revendeur BIEN.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
              Café, studio, pharmacie, concept-store, spa… Proposez à vos clients une gamme de compléments naturels
              aux adaptogènes et champignons fonctionnels, dosés selon la science.
            </p>

            <ul className="mt-8 space-y-5">
              {PERKS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="shrink-0 grid place-items-center h-11 w-11 rounded-2xl bg-bien-gold text-bien-forest"><Icon className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-display font-black text-black leading-tight">{title}</h2>
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
