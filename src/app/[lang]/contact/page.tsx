import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "contact",
    title: "Contact | BIEN health",
    description: lang === "en" ? "Contact the BIEN health team: email, phone and address. We reply within 48 business hours." : "Contactez l'équipe BIEN health : email, téléphone et adresse. Nous répondons sous 48 h ouvrées.",
  });
}

const T = {
  fr: {
    eyebrow: "Nous contacter", h1: "Une question ? Écrivez-nous.",
    intro: "Notre équipe est là pour vous aider : commande, produit, conseil ou partenariat. Nous répondons généralement sous 48 h ouvrées.",
    emailTitle: "Par e-mail", emailSub: "La façon la plus rapide de nous joindre.",
    phoneTitle: "Par téléphone", phoneSub: "Du lundi au vendredi, 9h–18h.",
    addressTitle: "Adresse",
    trackTitle: "Suivi de commande", trackPre: "Retrouvez le suivi de vos commandes dans ", account: "votre compte", trackMid: ", ou consultez notre ", faq: "FAQ",
  },
  en: {
    eyebrow: "Contact us", h1: "A question? Write to us.",
    intro: "Our team is here to help: order, product, advice or partnership. We usually reply within 48 business hours.",
    emailTitle: "By email", emailSub: "The fastest way to reach us.",
    phoneTitle: "By phone", phoneSub: "Monday to Friday, 9am–6pm.",
    addressTitle: "Address",
    trackTitle: "Order tracking", trackPre: "Track your orders in ", account: "your account", trackMid: ", or check our ", faq: "FAQ",
  },
} as const;

export default async function ContactPage({
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
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <MessageCircle className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(1.98rem,4.4vw,3.08rem)] leading-[1] text-black">{t.h1}</h1>
        <p className="mt-4 text-base sm:text-lg text-black/70 leading-relaxed max-w-2xl">
          {t.intro}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <a href="mailto:info@bien.health" className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6 hover:ring-bien-leaf/40 transition-all">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-gold text-bien-forest"><Mail className="h-6 w-6" /></span>
            <h2 className="mt-4 font-display text-black">{t.emailTitle}</h2>
            <p className="mt-1 text-sm text-black/65">{t.emailSub}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bien-leaf">info@bien.health <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
          </a>

          <a href="tel:+33638621213" className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6 hover:ring-bien-leaf/40 transition-all">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-leaf/15 text-bien-leaf"><Phone className="h-6 w-6" /></span>
            <h2 className="mt-4 font-display text-black">{t.phoneTitle}</h2>
            <p className="mt-1 text-sm text-black/65">{t.phoneSub}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bien-leaf">+33 6 38 62 12 13</span>
          </a>

          <div className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-leaf/15 text-bien-leaf"><MapPin className="h-6 w-6" /></span>
            <h2 className="mt-4 font-display text-black">{t.addressTitle}</h2>
            <p className="mt-1 text-sm text-black/65 leading-relaxed">SAS BIEN Health France<br />100 Rue du Verbial<br />81000 Albi, France</p>
          </div>

          <div className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-bien-leaf/15 text-bien-leaf"><Clock className="h-6 w-6" /></span>
            <h2 className="mt-4 font-display text-black">{t.trackTitle}</h2>
            <p className="mt-1 text-sm text-black/65 leading-relaxed">{t.trackPre}
              <Link href={`/${lang}/compte`} className="text-bien-leaf underline">{t.account}</Link>{t.trackMid}
              <Link href={`/${lang}/faq`} className="text-bien-leaf underline">{t.faq}</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
