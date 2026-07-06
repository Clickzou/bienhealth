import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import DiagnosticQuiz from "@/components/diagnostic-quiz";

export const metadata: Metadata = {
  title: "Diagnostic BIEN — trouve ta formule en 1 minute",
  description:
    "Réponds à quelques questions sur tes besoins (sommeil, concentration, énergie, peau) et découvre la formule BIEN faite pour toi. Diagnostic gratuit, moins d'une minute.",
};

export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <DiagnosticQuiz lang={lang} />

      {/* Bandeau blanc — accès aux avis certifiés */}
      <section className="bg-background px-4 sm:px-6 lg:px-[100px] py-14 sm:py-20 text-center">
        <Link
          href={`/${lang}/avis`}
          className="inline-flex items-center gap-2 rounded-full bg-bien-forest text-white px-8 py-4 font-bold hover:bg-bien-leaf transition-colors bien-shadow-sm"
        >
          <ShieldCheck className="h-5 w-5" /> Voir les avis certifiés
        </Link>
      </section>
    </div>
  );
}
