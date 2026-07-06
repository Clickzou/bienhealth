import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, Leaf, HeartPulse, MapPin } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Notre histoire — BIEN",
  description:
    "BIEN HEALTH, marque française de compléments naturels née du parcours d'une ancienne sportive de haut niveau. Adaptogènes et champignons fonctionnels pour les athlètes de la vie.",
};

const VALUES = [
  { icon: Leaf, title: "Naturel & clean", text: "Vegan, sans sucre ni colorants artificiels, sans gluten, riches en fibres prébiotiques." },
  { icon: MapPin, title: "Fabriqué en France", text: "Formulé et fabriqué en France, avec des contrôles qualité à chaque étape." },
  { icon: HeartPulse, title: "Dosé par la science", text: "Adaptogènes et champignons fonctionnels aux dosages transparents, déclarés à la DGAL." },
];

export default async function HistoirePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-10 sm:pt-14">
        <div className="relative hero-gradient rounded-3xl lg:rounded-[2.5rem] overflow-hidden bien-shadow grid lg:grid-cols-2 items-stretch">
          <div className="text-bien-cream p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">Notre histoire</p>
            <h1 className="mt-4 font-display font-black tracking-tighter text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.98]">
              Aider les athlètes de la vie à mieux vivre le quotidien.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-bien-cream/85 leading-relaxed">
              BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est
              d&apos;accompagner chacun à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental,
              troubles de la mémoire, manque d&apos;énergie.
            </p>
          </div>
          <div className="relative min-h-[300px] lg:min-h-[520px]">
            <Image src="/brand/story.jpg" alt="L'histoire de BIEN" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Récit */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bien-shadow">
            <Image src="/brand/founder.jpg" alt="La fondatrice de BIEN" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">D&apos;où vient BIEN</p>
            <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(1.75rem,4vw,3rem)] leading-[1] text-black">
              Née du sport de haut niveau.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed">
              La marque est née du parcours d&apos;une ancienne sportive de haut niveau, qui a utilisé les plantes
              adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et
              mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.
            </p>
            <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed">
              Notre corps et notre esprit méritent des solutions naturelles pour performer durablement. Habituée aux
              exigences du sport de haut niveau, la clarté mentale, la récupération et la vitalité ont toujours été au
              cœur de mes préoccupations.
            </p>
            <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed">
              Quand j&apos;ai découvert les champignons adaptogènes, j&apos;ai trouvé la réponse naturelle et cohérente
              que je cherchais pour m&apos;accompagner dans mes challenges quotidiens, bien au-delà du sport : soutenir
              mon organisme, renforcer ma concentration et optimiser mon énergie, sans compromis.
            </p>
            <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed">
              Aujourd&apos;hui, c&apos;est dans cette culture de la performance consciente que l&apos;on fait grandir
              BIEN, en respectant l&apos;équilibre, la santé et la résilience sur le long terme.
            </p>
            <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed">
              Accompagnés par un laboratoire scientifique français, nous développons des compléments adaptogènes conçus
              pour soutenir le corps et l&apos;esprit face aux défis du quotidien. Pensés pour les athlètes de la vie —
              entrepreneurs, créatifs, sportifs, parents, leaders — notre gamme s&apos;inscrit dans une vision moderne,
              transparente et fonctionnelle du bien-être.
            </p>
            <p className="mt-5 font-display font-black text-black">Carla, CEO BIEN Health</p>
            <ul className="mt-7 space-y-3">
              {[
                "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
                "Vegan, sans sucre ni colorants, sans gluten — fabriqué en France",
                "Riches en fibres prébiotiques pour l'équilibre du microbiote",
                "Plantes adaptogènes & champignons médicinaux, dosages transparents",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-black">
                  <span className="mt-1 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-gold text-black"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display font-black text-lg text-black leading-tight">{title}</h3>
              <p className="mt-2 text-sm text-black/70 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-16 sm:mt-24 mb-24 text-center">
        <h2 className="font-display font-black tracking-tighter text-[clamp(1.75rem,4vw,3rem)] leading-[1] text-black">
          Prêt·e à découvrir votre rituel ?
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
            Voir la boutique <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${lang}/diagnostic`} className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-8 py-4 font-bold hover:bg-bien-forest hover:text-bien-cream transition-colors">
            Faire le diagnostic
          </Link>
        </div>
      </section>
    </div>
  );
}
