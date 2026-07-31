import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, ExternalLink, FileText, BadgeCheck, MapPin } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "certifications",
    title: lang === "en" ? "Certifications & official declarations — BIEN" : "Certifications & déclarations officielles — BIEN",
    description: lang === "en" ? "All BIEN HEALTH supplements are declared to the DGAL (French Ministry of Agriculture) and registered on COMPL'ALIM. Verifiable declaration numbers and downloadable certificates." : "Tous les compléments BIEN HEALTH sont déclarés auprès de la DGAL (Ministère de l'Agriculture) et enregistrés sur COMPL'ALIM. Numéros de déclaration vérifiables et attestations téléchargeables.",
  });
}

type Attestation = {
  name: string;
  form: { fr: string; en: string };
  img: string;
  declaredOn: { fr: string; en: string };
  number: string;
  url: string;
  pdf: string;
  actifs: { fr: string[]; en: string[] };
};

const ATTESTATIONS: Attestation[] = [
  {
    name: "MUSHGLOW",
    form: { fr: "Poudre", en: "Powder" },
    img: "/mushglow.jpg",
    declaredOn: { fr: "4 avril 2025", en: "4 April 2025" },
    number: "260541",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/260541",
    pdf: "/attestations/mushglow.pdf",
    actifs: {
      fr: ["Crinière de lion (Hericium erinaceus) — 750 mg", "Maca (Lepidium meyenii) — 750 mg", "Chaga (Inonotus obliquus) — 500 mg", "Cordyceps (Ophiocordyceps sinensis) — 500 mg", "Collagène — 450 mg", "Théanine — 200 mg · Inulines — 200 mg"],
      en: ["Lion's Mane (Hericium erinaceus) — 750 mg", "Maca (Lepidium meyenii) — 750 mg", "Chaga (Inonotus obliquus) — 500 mg", "Cordyceps (Ophiocordyceps sinensis) — 500 mg", "Collagen — 450 mg", "Theanine — 200 mg · Inulin — 200 mg"],
    },
  },
  {
    name: "CALM",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/calm.jpg",
    declaredOn: { fr: "19 mars 2025", en: "19 March 2025" },
    number: "257758",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257758",
    pdf: "/attestations/calm.pdf",
    actifs: {
      fr: ["Ashwagandha (Withania somnifera) — 70 mg", "Reishi (Ganoderma lucidum) — 70 mg", "Safran (Crocus sativus) — 16 mg"],
      en: ["Ashwagandha (Withania somnifera) — 70 mg", "Reishi (Ganoderma lucidum) — 70 mg", "Saffron (Crocus sativus) — 16 mg"],
    },
  },
  {
    name: "FOCUS",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/focus.jpg",
    declaredOn: { fr: "19 mars 2025", en: "19 March 2025" },
    number: "257824",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257824",
    pdf: "/attestations/focus.pdf",
    actifs: {
      fr: ["Crinière de lion (Hericium erinaceus) — 1200 mg", "Rhodiola (Sedum roseum) — 160 mg", "Théanine — 6 mg"],
      en: ["Lion's Mane (Hericium erinaceus) — 1200 mg", "Rhodiola (Sedum roseum) — 160 mg", "Theanine — 6 mg"],
    },
  },
  {
    name: "POWER",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/power.jpg",
    declaredOn: { fr: "19 mars 2025", en: "19 March 2025" },
    number: "257810",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/257810",
    pdf: "/attestations/power.pdf",
    actifs: {
      fr: ["Cordyceps (Ophiocordyceps sinensis) — 1000 mg", "Ginseng (Panax ginseng) — 240 mg", "Rhodiola (Sedum roseum) — 128 mg"],
      en: ["Cordyceps (Ophiocordyceps sinensis) — 1000 mg", "Ginseng (Panax ginseng) — 240 mg", "Rhodiola (Sedum roseum) — 128 mg"],
    },
  },
];

const T = {
  fr: {
    eyebrow: "Transparence & conformité", h1: "Des produits déclarés en France.",
    intro: "Chaque complément BIEN HEALTH fait l'objet d'une <strong>déclaration officielle auprès de la DGAL</strong> (Direction générale de l'alimentation — Ministère de l'Agriculture), enregistrée sur la plateforme <strong>COMPL'ALIM</strong>. Chaque déclaration porte un numéro vérifiable publiquement et l'attestation est téléchargeable ci-dessous.",
    badges: ["Déclaré auprès de la DGAL", "Dosages transparents", "Fabriqué en France"],
    declaration: "Déclaration DGAL n°", declaredActives: "Actifs déclarés (par DJR)",
    verify: "Vérifier sur COMPL'ALIM", pdf: "Attestation PDF",
    aboutTitle: "À propos de ces attestations",
    aboutText: "Les attestations de déclaration sont délivrées par la DGAL au titre de l'article 15 du décret n°2006-352. Conformément à leur mention officielle, une attestation de déclaration ne constitue ni une garantie de conformité aux dispositions en vigueur, ni une autorisation de mise sur le marché : elle atteste que la déclaration du complément alimentaire a bien été effectuée et enregistrée. Les informations restent consultables publiquement via les liens COMPL'ALIM ci-dessus.",
    back: "Retour à l'accueil",
  },
  en: {
    eyebrow: "Transparency & compliance", h1: "Products declared in France.",
    intro: "Every BIEN HEALTH supplement is <strong>officially declared to the DGAL</strong> (French Directorate General for Food — Ministry of Agriculture), registered on the <strong>COMPL'ALIM</strong> platform. Each declaration carries a publicly verifiable number and the certificate is downloadable below.",
    badges: ["Declared to the DGAL", "Transparent dosages", "Made in France"],
    declaration: "DGAL declaration no.", declaredActives: "Declared actives (per RDI)",
    verify: "Verify on COMPL'ALIM", pdf: "PDF certificate",
    aboutTitle: "About these certificates",
    aboutText: "Declaration certificates are issued by the DGAL under article 15 of decree no. 2006-352. In accordance with their official wording, a declaration certificate is neither a guarantee of compliance with applicable provisions nor a marketing authorisation: it certifies that the food supplement's declaration has been made and registered. The information remains publicly accessible via the COMPL'ALIM links above.",
    back: "Back to home",
  },
} as const;

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];
  const BADGE_ICONS = [ShieldCheck, BadgeCheck, MapPin];

  return (
    <div className="min-h-screen bg-background text-foreground bg-[url('/brand/certif-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <SiteHeader lang={lang} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-[100px] py-12 lg:py-20">
        {/* Intro */}
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <MapPin className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(1.76rem,4.4vw,3.08rem)] leading-[1] text-black">
          {t.h1}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: t.intro }} />

        {/* Bandeau garanties */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {t.badges.map((label, i) => {
            const Icon = BADGE_ICONS[i];
            return (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-bien-cream ring-1 ring-border px-4 py-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-bien-leaf text-bien-cream shrink-0"><Icon className="h-4 w-4" /></span>
              <span className="text-sm font-semibold text-black">{label}</span>
            </div>
            );
          })}
        </div>

        {/* Cartes attestations */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {ATTESTATIONS.map((a) => (
            <article key={a.name} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col">
              {/* Grande photo produit en bannière */}
              <div className="relative aspect-[16/10] bg-bien-cream overflow-hidden">
                <Image src={a.img} alt={a.name} fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span className="absolute top-4 right-4 text-[11px] uppercase tracking-wider font-semibold text-bien-navy bg-white/90 backdrop-blur rounded-full px-3 py-1">{a.form[en ? "en" : "fr"]}</span>
                <div className="absolute inset-x-5 sm:inset-x-6 bottom-4 sm:bottom-5">
                  <h2 className="font-display text-3xl sm:text-4xl text-white leading-none drop-shadow-sm">{a.name}</h2>
                  <p className="mt-2 text-xs text-white/85">
                    {t.declaration} <span className="font-semibold text-white">{a.number}</span> · {a.declaredOn[en ? "en" : "fr"]}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1">
                <p className="text-xs uppercase tracking-[0.15em] text-bien-leaf font-semibold">{t.declaredActives}</p>
                <ul className="mt-3 space-y-1.5">
                  {a.actifs[en ? "en" : "fr"].map((line) => (
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
                  <ExternalLink className="h-4 w-4" /> {t.verify}
                </a>
                <a
                  href={a.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-4 py-2.5 text-sm font-bold hover:brightness-105 transition flex-1"
                >
                  <FileText className="h-4 w-4" /> {t.pdf}
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Mention légale exacte */}
        <div className="mt-10 rounded-2xl bg-bien-cream/60 ring-1 ring-border p-5 sm:p-6 text-sm text-black/65 leading-relaxed">
          <p className="font-semibold text-black">{t.aboutTitle}</p>
          <p className="mt-2">
            {t.aboutText}
          </p>
        </div>

        <div className="mt-12">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </Link>
        </div>
      </main>
    </div>
  );
}
