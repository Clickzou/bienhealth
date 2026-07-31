import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import DiagnosticQuiz from "@/components/diagnostic-quiz";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "diagnostic",
    title: lang === "en" ? "BIEN Diagnostic — find your formula in 1 minute" : "Diagnostic BIEN — trouvez votre formule en 1 minute",
    description: lang === "en" ? "Answer a few questions about your needs (sleep, focus, energy, skin) and discover the BIEN formula made for you. Free quiz, under a minute." : "Répondez à quelques questions sur vos besoins (sommeil, concentration, énergie, peau) et découvrez la formule BIEN faite pour vous. Diagnostic gratuit, moins d'une minute.",
  });
}

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
          <ShieldCheck className="h-5 w-5" /> {lang === "en" ? "See certified reviews" : "Voir les avis certifiés"}
        </Link>
      </section>
    </div>
  );
}
