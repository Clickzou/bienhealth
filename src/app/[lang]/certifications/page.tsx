import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, ExternalLink, FileText, BadgeCheck, MapPin, ChevronDown } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "certifications",
    title: lang === "en" ? "Certifications & declarations | BIEN health" : "Certifications & déclarations | BIEN health",
    description: lang === "en" ? "All BIEN health supplements are declared to the DGAL (French Ministry of Agriculture) and registered on COMPL'ALIM. Verifiable declaration numbers and downloadable certificates." : "Compléments BIEN health déclarés à la DGAL et enregistrés sur COMPL'ALIM : numéros vérifiables et attestations téléchargeables.",
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
    declaredOn: { fr: "22 mai 2026", en: "22 May 2026" },
    number: "353738",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/353738",
    pdf: "/attestations/mushglow.pdf",
    actifs: {
      fr: ["Crinière de lion (Hericium erinaceus) : 750 mg", "Maca (Lepidium meyenii) : 750 mg", "Chaga (Inonotus obliquus) : 500 mg", "Cordyceps (Ophiocordyceps sinensis) : 500 mg", "Théanine : 500 mg", "Collagène : 300 mg"],
      en: ["Lion's Mane (Hericium erinaceus): 750 mg", "Maca (Lepidium meyenii): 750 mg", "Chaga (Inonotus obliquus): 500 mg", "Cordyceps (Ophiocordyceps sinensis): 500 mg", "Theanine: 500 mg", "Collagen: 300 mg"],
    },
  },
  {
    name: "CALM",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/calm.jpg",
    declaredOn: { fr: "22 janvier 2026", en: "22 January 2026" },
    number: "353706",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/353706",
    pdf: "/attestations/calm.pdf",
    actifs: {
      fr: ["Ashwagandha (Withania somnifera) : 80 mg", "Reishi (Ganoderma lucidum) : 80 mg", "Safran (Crocus sativus) : 16 mg"],
      en: ["Ashwagandha (Withania somnifera): 80 mg", "Reishi (Ganoderma lucidum): 80 mg", "Saffron (Crocus sativus): 16 mg"],
    },
  },
  {
    name: "FOCUS",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/focus.jpg",
    declaredOn: { fr: "23 janvier 2026", en: "23 January 2026" },
    number: "353734",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/353734",
    pdf: "/attestations/focus.pdf",
    actifs: {
      fr: ["Crinière de lion (Hericium erinaceus) : 120 mg", "Thé vert (Camellia sinensis) : 80 mg", "Rhodiola (Sedum roseum) : 30 mg"],
      en: ["Lion's Mane (Hericium erinaceus): 120 mg", "Green tea (Camellia sinensis): 80 mg", "Rhodiola (Sedum roseum): 30 mg"],
    },
  },
  {
    name: "POWER",
    form: { fr: "Gomme", en: "Gummy" },
    img: "/power.jpg",
    declaredOn: { fr: "22 janvier 2026", en: "22 January 2026" },
    number: "353739",
    url: "https://compl-alim.beta.gouv.fr/mes-declarations/353739",
    pdf: "/attestations/power.pdf",
    actifs: {
      fr: ["Cordyceps (Ophiocordyceps sinensis) : 200 mg", "Ginseng (Panax ginseng) : 100 mg", "Rhodiola (Sedum roseum) : 30 mg"],
      en: ["Cordyceps (Ophiocordyceps sinensis): 200 mg", "Ginseng (Panax ginseng): 100 mg", "Rhodiola (Sedum roseum): 30 mg"],
    },
  },
];

const T = {
  fr: {
    eyebrow: "Transparence & conformité", h1: "Des produits déclarés en France.",
    intro: "Chaque complément BIEN health fait l'objet d'une <strong>déclaration officielle auprès de la DGAL</strong> (Direction générale de l'alimentation, Ministère de l'Agriculture), enregistrée sur la plateforme <strong>COMPL'ALIM</strong>. Chaque déclaration porte un numéro vérifiable publiquement et l'attestation est téléchargeable ci-dessous.",
    badges: ["Déclaré auprès de la DGAL", "Dosages transparents", "Fabriqué en France"],
    declaration: "Déclaration DGAL n°", declaredActives: "Actifs déclarés (par DJR)",
    verify: "Vérifier sur COMPL'ALIM", pdf: "Attestation PDF",
    aboutTitle: "À propos de ces attestations",
    aboutText: "Les attestations de déclaration sont délivrées par la DGAL au titre de l'article 15 du décret n°2006-352. Conformément à leur mention officielle, une attestation de déclaration ne constitue ni une garantie de conformité aux dispositions en vigueur, ni une autorisation de mise sur le marché : elle atteste que la déclaration du complément alimentaire a bien été effectuée et enregistrée. Les informations restent consultables publiquement via les liens COMPL'ALIM ci-dessus.",
    back: "Retour à l'accueil",
  },
  en: {
    eyebrow: "Transparency & compliance", h1: "Products declared in France.",
    intro: "Every BIEN health supplement is <strong>officially declared to the DGAL</strong> (French Directorate General for Food, Ministry of Agriculture), registered on the <strong>COMPL'ALIM</strong> platform. Each declaration carries a publicly verifiable number and the certificate is downloadable below.",
    badges: ["Declared to the DGAL", "Transparent dosages", "Made in France"],
    declaration: "DGAL declaration no.", declaredActives: "Declared actives (per RDI)",
    verify: "Verify on COMPL'ALIM", pdf: "PDF certificate",
    aboutTitle: "About these certificates",
    aboutText: "Declaration certificates are issued by the DGAL under article 15 of decree no. 2006-352. In accordance with their official wording, a declaration certificate is neither a guarantee of compliance with applicable provisions nor a marketing authorisation: it certifies that the food supplement's declaration has been made and registered. The information remains publicly accessible via the COMPL'ALIM links above.",
    back: "Back to home",
  },
} as const;

/** Les actifs déclarés d'un produit — même liste pour le dépliant du téléphone
 *  et pour l'affichage direct des grands écrans. */
function ActivesList({ lines }: { lines: readonly string[] }) {
  return (
    <ul className="mt-2 sm:mt-2.5 space-y-1 sm:space-y-1.5">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-2 text-[11px] sm:text-sm text-black/80">
          <span className="mt-1.5 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-bien-gold shrink-0" />
          <span className="leading-snug">{line}</span>
        </li>
      ))}
    </ul>
  );
}

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

      {/* Espacements resserrés (recos client) : la page tenait sur trop de
          hauteur avant d'arriver aux attestations. */}
      {/* Pleine largeur avec 100 px de marge sur grand écran (demande client du
          01/09/2026) : dans un conteneur de 1280 px, les cartes d'attestation
          étaient trop étroites pour leurs deux boutons, et « Attestation PDF »
          arrivait tronqué sur ordinateur. */}
      <main className="px-4 sm:px-6 lg:px-12 xl:px-[100px] py-10 lg:py-14">
        {/* Intro */}
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <MapPin className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(1.76rem,4.4vw,3.08rem)] leading-[1] text-black">
          {t.h1}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: t.intro }} />

        {/* Bandeau garanties */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
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
        {/* Deux attestations par ligne dès le téléphone (demande client) : les
            quatre produits tiennent alors dans un écran. */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5">
          {ATTESTATIONS.map((a) => (
            <article key={a.name} className="group bg-card rounded-2xl sm:rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col lg:flex-row">
              {/* Photo produit en colonne, dans un cadre proche du portrait
                  natif des visuels (2:3). En bannière 16/10, `object-cover`
                  ne gardait que 42 % de la hauteur : le sachet MUSHGLOW était
                  coupé en deux et son nom disparaissait du cadre. */}
              <div className="relative shrink-0 aspect-[4/5] lg:aspect-auto lg:w-[38%] bg-bien-cream overflow-hidden">
                <Image src={a.img} alt={a.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 20vw" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold text-bien-navy bg-white/90 backdrop-blur rounded-full px-2 py-0.5 sm:px-3 sm:py-1">{a.form[en ? "en" : "fr"]}</span>
              </div>

              <div className="flex flex-1 flex-col p-3 sm:p-5 lg:p-6">
                {/* Nom et n° de déclaration sortis de la photo : en surimpression,
                    ils imposaient un recadrage large et un dégradé sur le produit. */}
                <h2 className="font-display text-lg sm:text-2xl lg:text-3xl text-black leading-none">{a.name}</h2>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-black/60">
                  {t.declaration} <span className="font-semibold text-black">{a.number}</span> · {a.declaredOn[en ? "en" : "fr"]}
                </p>

                {/* Actifs déclarés. Sous sm la liste doublait à elle seule la
                    hauteur de la carte : elle y passe dans un dépliant, fermé
                    par défaut. Rien n'est retiré, tout est à un appui. Un
                    `<details>` ne pouvant être ouvert par media query, la liste
                    est rendue à part au-dessus de sm — d'où les deux blocs. */}
                <details className="mt-3 group/actifs sm:hidden">
                  <summary className="flex items-center gap-1.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[10px] uppercase tracking-[0.15em] text-bien-leaf font-semibold">
                    {t.declaredActives}
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-open/actifs:rotate-180" />
                  </summary>
                  <ActivesList lines={a.actifs[en ? "en" : "fr"]} />
                </details>
                <div className="hidden sm:block">
                  <p className="mt-4 text-xs uppercase tracking-[0.15em] text-bien-leaf font-semibold">{t.declaredActives}</p>
                  <ActivesList lines={a.actifs[en ? "en" : "fr"]} />
                </div>

                {/* Les deux boutons ne se partagent une ligne que si chacun a la
                    place d'afficher son libelle en entier (~14 rem) ; sinon ils
                    passent l'un sous l'autre. Sur un portable 1440, la carte reste
                    trop etroite pour les tenir cote a cote. */}
                <div className="mt-auto pt-3 sm:pt-5 flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-bien-leaf text-white px-2.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold hover:brightness-110 transition flex-1 min-w-0 sm:basis-56"
                  >
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> <span className="truncate">{t.verify}</span>
                  </a>
                  <a
                    href={a.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-bien-gold text-black px-2.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-sm font-bold hover:brightness-105 transition flex-1 min-w-0 sm:basis-56"
                  >
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> <span className="truncate">{t.pdf}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mention légale exacte */}
        <div className="mt-8 rounded-2xl bg-bien-cream/60 ring-1 ring-border p-5 sm:p-6 text-sm text-black/65 leading-relaxed">
          <p className="font-semibold text-black">{t.aboutTitle}</p>
          <p className="mt-2">
            {t.aboutText}
          </p>
        </div>

        <div className="mt-10">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </Link>
        </div>
      </main>
    </div>
  );
}
