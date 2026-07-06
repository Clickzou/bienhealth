import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { User, ShieldCheck, Package, Heart, ArrowRight } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mon compte — BIEN",
  description: "Connectez-vous à votre compte BIEN pour suivre vos commandes et gérer vos informations.",
};

const ACCOUNT_URL = "https://bien.health/account";

/**
 * Page Compte. L'authentification et les comptes clients sont gérés par
 * Shopify Customer Accounts (source unique, cf. PLAN-REFONTE) — on ne recrée pas
 * d'auth. Cette page est une entrée de marque qui redirige vers la connexion
 * Shopify sécurisée.
 */
const PERKS = [
  { icon: Package, title: "Suivi de commandes", desc: "Retrouvez l'historique et le statut de vos commandes." },
  { icon: Heart, title: "Vos favoris & cures", desc: "Gérez vos produits préférés et vos réachats." },
  { icon: ShieldCheck, title: "Infos & adresses", desc: "Mettez à jour vos informations en toute sécurité." },
];

export default async function ComptePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center">
          <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-cream text-black">
            <User className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display font-black tracking-tighter text-[clamp(2rem,5vw,3rem)] leading-[1] text-black">
            Mon compte
          </h1>
          <p className="mt-3 text-black/70">
            Connectez-vous ou créez votre compte pour suivre vos commandes et gérer vos informations.
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="mt-8 rounded-3xl bg-card ring-1 ring-border bien-shadow-sm p-6 sm:p-8 text-center">
          <a
            href={ACCOUNT_URL}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-8 py-4 text-base font-semibold hover:bg-bien-leaf transition-colors bien-shadow-sm"
          >
            Se connecter / Créer un compte <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-black/55">
            <ShieldCheck className="h-3.5 w-3.5 text-bien-leaf" />
            Connexion sécurisée via Shopify — vos données restent protégées.
          </p>
        </div>

        {/* Avantages du compte */}
        <ul className="mt-10 grid sm:grid-cols-3 gap-4">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="rounded-2xl bg-card ring-1 ring-border p-5">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-bien-leaf/12 text-bien-leaf">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-display font-black text-black leading-tight">{title}</h2>
              <p className="mt-1.5 text-sm text-black/65 leading-relaxed">{desc}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
