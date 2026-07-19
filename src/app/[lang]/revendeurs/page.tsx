import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Store, ArrowRight, Handshake } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ResellerMap from "@/components/reseller-map-loader";
import type { Reseller } from "@/components/reseller-map";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en"
    ? { title: "Our resellers — Where to find BIEN", description: "Find BIEN supplements at our partner stores in France, Switzerland and Portugal. Become a BIEN reseller." }
    : { title: "Nos revendeurs — Où trouver BIEN", description: "Retrouvez les compléments BIEN dans nos points de vente partenaires en France, en Suisse et au Portugal. Devenez revendeur BIEN." };
}

const T = {
  fr: {
    eyebrow: "Points de vente", h1: "Où trouver BIEN.",
    intro: (n: number) => `Retrouvez nos compléments chez nos ${n} partenaires en France, en Suisse et au Portugal — ou commandez en ligne, livraison offerte dès 49 €.`,
    note: "Liste non exhaustive — de nouveaux points de vente rejoignent BIEN régulièrement.",
    proTitle: "Vous êtes un professionnel ?",
    proText: "Café, studio, pharmacie, concept-store… Rejoignez le réseau de revendeurs BIEN et proposez nos compléments à vos clients.",
    become: "Devenir revendeur", order: "Commander en ligne",
  },
  en: {
    eyebrow: "Stockists", h1: "Where to find BIEN.",
    intro: (n: number) => `Find our supplements at our ${n} partners in France, Switzerland and Portugal — or order online, free shipping over €49.`,
    note: "Non-exhaustive list — new stockists join BIEN regularly.",
    proTitle: "Are you a professional?",
    proText: "Café, studio, pharmacy, concept store… Join the BIEN reseller network and offer our supplements to your customers.",
    become: "Become a reseller", order: "Order online",
  },
} as const;

const RESELLERS: Reseller[] = [
  { name: "48 Collagen Café", address: "48, Rue La Fayette", city: "75009 Paris", country: "France", lat: 48.8757, lng: 2.341 },
  { name: "Bonnes Paris", address: "10, avenue Teissonnière", city: "92600 Asnières-sur-Seine", country: "France", lat: 48.92, lng: 2.285 },
  { name: "Hera — Barre Studio", address: "87 Rue de Longchamp", city: "75116 Paris", country: "France", lat: 48.866, lng: 2.283 },
  { name: "Maison Mirabile", address: "29 Rue Francœur", city: "75018 Paris", country: "France", lat: 48.89, lng: 2.343 },
  { name: "ORA, Salle de sport", address: "178 Rue du Faubourg Saint-Honoré", city: "75008 Paris", country: "France", lat: 48.873, lng: 2.308 },
  { name: "Pharmacie Anglaise des Champs-Élysées", address: "62, Avenue des Champs-Élysées", city: "75008 Paris", country: "France", lat: 48.87, lng: 2.305 },
  { name: "The New Me — Pilates Reformer", address: "18 Boulevard Bineau", city: "92300 Levallois-Perret", country: "France", lat: 48.893, lng: 2.282 },
  { name: "Superkure", address: "50 Bd Stalingrad", city: "06300 Nice", country: "France", lat: 43.705, lng: 7.286 },
  { name: "Happy Officine", address: "1, Route de la Mortigue", city: "1072 Forel", country: "Suisse", lat: 46.506, lng: 6.736 },
  { name: "Vinent & Miller Lda", address: "Rua de São Bento 106 B", city: "1200-820 Lisboa", country: "Portugal", lat: 38.7139, lng: -9.1522 },
];

export default async function RevendeursPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-16 text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <Store className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-black">
          {t.h1}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          {t.intro(RESELLERS.length)}
        </p>
      </section>

      {/* Carte interactive + liste */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-10 sm:mt-14">
        <ResellerMap resellers={RESELLERS} />
        <p className="mt-6 text-center text-sm text-black/55">
          {t.note}
        </p>
      </section>

      {/* Devenir revendeur */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24 mb-24">
        <div className="bg-bien-cream rounded-3xl lg:rounded-[2.5rem] p-8 sm:p-12 text-center">
          <h2 className="font-display tracking-tighter text-[clamp(1.75rem,4vw,3rem)] leading-[1] text-black">
            {t.proTitle}
          </h2>
          <p className="mt-3 text-black/75 max-w-xl mx-auto">
            {t.proText}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={`/${lang}/devenir-revendeur`} className="inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-8 py-4 font-bold hover:bg-bien-leaf transition-colors bien-shadow-sm">
              <Handshake className="h-4 w-4" /> {t.become}
            </Link>
            <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-8 py-4 font-bold hover:bg-bien-forest hover:text-bien-cream transition-colors">
              {t.order} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
