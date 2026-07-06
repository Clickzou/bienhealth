import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, ExternalLink, FileText, BadgeCheck, MapPin } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Certifications & déclarations officielles — BIEN",
  description:
    "Tous les compléments BIEN HEALTH sont déclarés auprès de la DGAL (Ministère de l'Agriculture) et enregistrés sur COMPL'ALIM. Numéros de déclaration vérifiables et attestations téléchargeables.",
};

type Attestation = {
  name: string;
  form: string;
  img: string;
  declaredOn: string;
  number: string;
  url: string;
  pdf: string;
  actifs: string[];
};

const ATTESTATIONS: Attestation[] = [
  {
    name: "MUSHGLOW",
    form: "Poudre",
    img: "/brand/product-mushglow.jpg",
    declaredOn: "4 avril 2025",
    number: "260541",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/260541",
    pdf: "/attestations/mushglow.pdf",
    actifs: [
      "Crinière de lion (Hericium erinaceus) — 750 mg",
      "Maca (Lepidium meyenii) — 750 mg",
      "Chaga (Inonotus obliquus) — 500 mg",
      "Cordyceps (Ophiocordyceps sinensis) — 500 mg",
      "Collagène — 450 mg",
      "Théanine — 200 mg · Inulines — 200 mg",
    ],
  },
  {
    name: "CALM",
    form: "Gomme",
    img: "/brand/product-calm.jpg",
    declaredOn: "19 mars 2025",
    number: "257758",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257758",
    pdf: "/attestations/calm.pdf",
    actifs: [
      "Ashwagandha (Withania somnifera) — 70 mg",
      "Reishi (Ganoderma lucidum) — 70 mg",
      "Safran (Crocus sativus) — 16 mg",
    ],
  },
  {
    name: "FOCUS",
    form: "Gomme",
    img: "/brand/product-focus.jpg",
    declaredOn: "19 mars 2025",
    number: "257824",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257824",
    pdf: "/attestations/focus.pdf",
    actifs: [
      "Crinière de lion (Hericium erinaceus) — 1200 mg",
      "Rhodiola (Sedum roseum) — 160 mg",
      "Théanine — 6 mg",
    ],
  },
  {
    name: "POWER",
    form: "Gomme",
    img: "/brand/product-power.jpg",
    declaredOn: "19 mars 2025",
    number: "257810",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257810",
    pdf: "/attestations/power.pdf",
    actifs: [
      "Cordyceps (Ophiocordyceps sinensis) — 1000 mg",
      "Ginseng (Panax ginseng) — 240 mg",
      "Rhodiola (Sedum roseum) — 128 mg",
    ],
  },
];

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground bg-[url('/brand/certif-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <SiteHeader lang={lang} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-[100px] py-12 lg:py-20">
        {/* Intro */}
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <MapPin className="h-4 w-4" /> Transparence &amp; conformité
        </p>
        <h1 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,5vw,3.5rem)] leading-[1] text-black">
          Des produits déclarés en France.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed max-w-2xl">
          Chaque complément BIEN HEALTH fait l&apos;objet d&apos;une <strong>déclaration officielle auprès de la
          DGAL</strong> (Direction générale de l&apos;alimentation — Ministère de l&apos;Agriculture), enregistrée sur la
          plateforme <strong>COMPL&apos;ALIM</strong>. Chaque déclaration porte un numéro vérifiable publiquement
          et l&apos;attestation est téléchargeable ci-dessous.
        </p>

        {/* Bandeau garanties */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "Déclaré auprès de la DGAL" },
            { icon: BadgeCheck, label: "Dosages transparents" },
            { icon: MapPin, label: "Fabriqué en France" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-bien-cream ring-1 ring-border px-4 py-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-bien-leaf text-bien-cream shrink-0"><Icon className="h-4 w-4" /></span>
              <span className="text-sm font-semibold text-black">{label}</span>
            </div>
          ))}
        </div>

        {/* Cartes attestations */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {ATTESTATIONS.map((a) => (
            <article key={a.name} className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-border">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-bien-cream ring-1 ring-border shrink-0">
                  <Image src={a.img} alt={a.name} fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-2xl text-black leading-none">{a.name}</h2>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-bien-leaf bg-bien-leaf/10 rounded-full px-2 py-0.5">{a.form}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-black/55">
                    Déclaration DGAL n° <span className="font-semibold text-black">{a.number}</span> · {a.declaredOn}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1">
                <p className="text-xs uppercase tracking-[0.15em] text-bien-leaf font-semibold">Actifs déclarés (par DJR)</p>
                <ul className="mt-3 space-y-1.5">
                  {a.actifs.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-black/80">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-bien-gold shrink-0" />
                      <span className="leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 sm:p-6 pt-0 flex flex-col sm:flex-row gap-3">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-bien-leaf text-white px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition flex-1"
                >
                  <ExternalLink className="h-4 w-4" /> Vérifier sur COMPL&apos;ALIM
                </a>
                <a
                  href={a.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-4 py-2.5 text-sm font-bold hover:brightness-105 transition flex-1"
                >
                  <FileText className="h-4 w-4" /> Attestation PDF
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Mention légale exacte */}
        <div className="mt-10 rounded-2xl bg-bien-cream/60 ring-1 ring-border p-5 sm:p-6 text-sm text-black/65 leading-relaxed">
          <p className="font-semibold text-black">À propos de ces attestations</p>
          <p className="mt-2">
            Les attestations de déclaration sont délivrées par la DGAL au titre de l&apos;article 15 du décret
            n°2006-352. Conformément à leur mention officielle, une attestation de déclaration ne constitue ni une
            garantie de conformité aux dispositions en vigueur, ni une autorisation de mise sur le marché : elle atteste
            que la déclaration du complément alimentaire a bien été effectuée et enregistrée. Les informations restent
            consultables publiquement via les liens COMPL&apos;ALIM ci-dessus.
          </p>
        </div>

        <div className="mt-12">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
