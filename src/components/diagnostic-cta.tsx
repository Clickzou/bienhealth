import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Bandeau jaune « Hésitant·e ? Faites le diagnostic. » — CTA vers le diagnostic.
 * Partagé par la boutique et les fiches produits (bas de page).
 */
export default function DiagnosticCTA({ lang }: { lang: string }) {
  return (
    <section className="px-4 sm:px-6 lg:px-[100px] mt-14 sm:mt-20 mb-24">
      <div className="bg-bien-gold rounded-3xl lg:rounded-[2.5rem] p-8 sm:p-12 text-black text-center">
        <h2 className="font-display font-black tracking-tighter text-[clamp(1.75rem,4vw,3rem)] leading-[1]">
          Hésitant·e ? Faites le diagnostic.
        </h2>
        <p className="mt-3 text-base sm:text-lg opacity-85 max-w-xl mx-auto">
          En moins d&apos;une minute, découvrez la formule BIEN qui répond vraiment à votre besoin.
        </p>
        <Link href={`/${lang}/diagnostic`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-8 py-4 font-bold hover:bg-bien-leaf transition bien-shadow-sm">
          Faire le test <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
