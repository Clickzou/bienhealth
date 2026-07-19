import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { hasLocale } from "./dictionaries";
import { getProducts, formatPrice } from "@/lib/shopify-products";
import IngredientsCarousel from "@/components/ingredients-carousel";
import RevealController from "@/components/reveal-controller";
import Typewriter from "@/components/typewriter";
import TrustpilotWidget, { TRUSTPILOT_URL } from "@/components/trustpilot";
import ProductsCarousel from "@/components/products-carousel";
import SiteHeader from "@/components/site-header";
import {
  Star, Truck, ShieldCheck, MapPin, RefreshCw, Moon, Brain, Zap,
  Sparkles, ShoppingBag, Check, ArrowRight, ArrowUpRight, Leaf, HeartPulse,
  ChevronDown,
} from "lucide-react";

const TP_BUSINESS_UNIT_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESSUNIT_ID;
const TP_TEMPLATE_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID;

/** Page d'accueil BIEN — contenu bilingue (FR / EN) co-localisé. */

const PRESS = [
  { name: "Doit in Paris", href: "https://www.doitinparis.com/fr/boissons-detox-paris-27378" },
  { name: "Gala", href: "https://www.moncarnet-gala.fr/articles/view/BIEN" },
  { name: "BIBA", href: "https://www.bibamagazine.fr/lifestyle/sante/adieu-le-cafe-cette-boisson-naturelle-a-base-de-champignons-est-le-secret-pour-se-reveiller-sans-doper-son-cortisol-498845.html" },
  { name: "L'Officiel", href: "https://www.lofficiel.com/beaute/10-produits-de-beaute-a-acheter-en-janvier-2026" },
  { name: "Beauté test", href: "https://www.beaute-test.com/mag/jai-teste-pour-vous-ces-gummies-anti-stress-sans-melatonine-qui-apaisent-vraiment.php" },
  { name: "Snake Twist", href: "https://www.instagram.com/p/DUIVTzWjQAn/?igsh=MTU0dXNnZ2hnOTJ6cg%3D%3D" },
];

const RITUAL_ICONS = [Moon, Brain, Zap, Sparkles];
const RITUAL_TINTS = [
  "bg-bien-leaf/15 text-bien-leaf",
  "bg-bien-gold/20 text-[oklch(0.55_0.13_75)]",
  "bg-bien-forest/10 text-black",
  "bg-bien-sage/20 text-bien-sage",
];
const REASSURANCE_ICONS = [Truck, ShieldCheck, MapPin, RefreshCw];
const KEYPOINT_ICONS = [ShoppingBag, Leaf, HeartPulse, Sparkles];
const KEYPOINT_TINTS = [
  "bg-bien-leaf text-bien-cream",
  "bg-bien-leaf text-bien-cream",
  "bg-bien-leaf text-bien-cream",
  "bg-bien-leaf text-bien-cream",
];

const FALLBACK_PRODUCTS = [
  { name: "CALM", img: "/brand/product-calm.jpg", price: "39 €" },
  { name: "FOCUS", img: "/brand/product-focus.jpg", price: "39 €" },
  { name: "POWER", img: "/brand/product-power.jpg", price: "39 €" },
  { name: "MUSHGLOW", img: "/brand/product-mushglow.jpg", price: "49 €" },
];

const CONTENT = {
  fr: {
    hero: {
      badge: "Adaptogènes et champignons fonctionnels, dosés selon la science. Formulés et fabriqués en France pour soutenir votre quotidien.",
      title1: "Le bien-être,",
      title2: "naturellement.",
      p1: "BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est d'accompagner les athlètes de la vie à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental, troubles de la mémoire, manque d'énergie.",
      p2: "Née du parcours d'une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.",
      cta: "Découvrir nos produits",
      g1: "Satisfait ou remboursé 30 jours",
      g2: "Marque française",
      keyPointsTitle: "L'essentiel",
      keyPoints: [
        "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
        "Vegan, sans sucre ni colorants, sans gluten — fabriqué en France",
        "Riches en fibres prébiotiques pour le microbiote",
        "Adaptogènes & champignons, dosages transparents",
      ],
    },
    reassurance: ["Livraison offerte dès 49 €", "Paiement sécurisé", "Fabriqué en France", "Satisfait ou remboursé 30 j"],
    press: {
      verified: "Avis Vérifiés",
      certified: "Certifié",
      seeAllTitle: "Voir tous nos avis sur Trustpilot",
      reviews: "avis",
      featured: "Ils parlent de nous",
      clickHint: "Cliquez sur un média pour lire l'article ↗",
      readArticle: (n: string) => `Lire l'article — ${n}`,
      compliance: "Conformité & transparence",
    },
    benefits: {
      eyebrow: "Soutenez votre bien-être",
      title: "Une réponse pour chaque besoin.",
      sub: "Des actifs dosés selon la science, pour cibler ce qui compte vraiment.",
      diagEyebrow: "Diagnostic",
      diagText: "En 30 secondes, découvrez le produit BIEN qui répond vraiment à votre problématique.",
      diagCta: "Faire le test",
    },
    rituals: [
      { title: "Sérénité & Sommeil", desc: "Apaiser le mental, retrouver un sommeil profond." },
      { title: "Concentration & Clarté mentale", desc: "Soutenir la mémoire et la focus quotidienne." },
      { title: "Énergie & Performance", desc: "Endurance physique et tonus durable." },
      { title: "Beauté & équilibre", desc: "Peau, cheveux, équilibre hormonal naturel." },
    ],
    reviews: {
      basedOnPre: "Basé sur ",
      basedOnStrong: "+100 avis Trustpilot",
      verified: "Vérifié",
      seeAll: "Voir tous nos avis sur Trustpilot",
      items: [
        { text: "Bluffée alors que j'y croyais pas. Dès la première prise, j'ai enchaîné une semaine intense de travail créatif en étant hyper focus, lucide, sans m'éparpiller et sans stress.", name: "Elvirash", date: "26 sept. 2024" },
        { text: "Nette amélioration de ma concentration et de ma clarté mentale, plus une vraie sensation de calme et de bien-être. Naturel, je recommande vivement.", name: "Carla", date: "5 nov. 2024" },
        { text: "Mon stress a largement diminué, m'aidant à dormir et à retrouver un quotidien apaisé. L'accompagnement de l'équipe BIEN a été parfait. Je recommande les yeux fermés !", name: "Lucie Nocerino", date: "20 sept. 2024" },
        { text: "Des produits de qualité et faciles à prendre. Après 4 prises, je sens petit à petit les effets bénéfiques concrets.", name: "Romain Guichard", date: "24 nov. 2024" },
        { text: "J'utilise le micro-dosing depuis 14 jours et j'ai ressenti dès la première semaine les avantages : bien plus focus et organisé dans mes réflexions.", name: "Grégoire Proux", date: "5 sept. 2024" },
        { text: "100% satisfaite pour la productivité.", name: "Victoria Faur", date: "11 juin 2025" },
      ],
    },
    ingredients: { eyebrow: "Ingrédients nobles", titleA: "La force du vivant,", titleB: "dosée par la science." },
    best: { eyebrow: "Best-sellers", title: "Nos rituels préférés.", seeAll: "Voir tous les produits", fallbackTag: "Complément naturel" },
    diagBlock: {
      eyebrow: "Diagnostic gratuit · 60 secondes",
      title: "Quel est votre besoin ?",
      text: "Répondez à quelques questions et recevez la formule BIEN qui correspond à votre rythme.",
      promo: "−10 % sur votre première commande",
    },
    mission: {
      eyebrow: "Notre mission",
      title: "Aider les athlètes de la vie à mieux vivre le quotidien.",
      p1: "BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est d'accompagner les athlètes de la vie à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental, troubles de la mémoire, manque d'énergie.",
      p2: "La marque est née du parcours d'une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.",
      list: [
        "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
        "Vegan, sans sucre ni colorants artificiels, sans gluten — fabriqué en France",
        "Riches en fibres prébiotiques pour l'équilibre du microbiote",
        "Plantes adaptogènes & champignons médicinaux, dosages transparents",
      ],
      cards: [
        { title: "Une gamme courte et ciblée", text: "4 produits seulement : 3 gummies naturels — sans sucre, sans colorants, vegan, sans gluten, fabriqués en France et riches en fibres prébiotiques ; et une poudre 100 % naturelle tout-en-un." },
        { title: "Une approche globale de la santé", text: "Formules naturelles, qualité des ingrédients, transparence des dosages et vision globale (microbiote, nutrition fonctionnelle). Nos actifs aident l'organisme à mieux se réguler." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Vos questions, nos garanties.",
      sub: "Transparence, conformité et qualité — tout ce qu'il faut savoir avant de commencer votre cure.",
      cta: "Voir nos attestations de conformité",
      items: [
        { q: "Vos produits sont-ils déclarés et conformes à la réglementation ?", a: "Oui. Chaque complément BIEN fait l'objet d'une déclaration officielle auprès de la DGAL (Ministère de l'Agriculture), enregistrée sur la plateforme COMPL'ALIM avec un numéro vérifiable publiquement. Vous retrouvez toutes les attestations sur notre page Conformité & certifications." },
        { q: "Où sont fabriqués vos compléments ?", a: "Nos produits sont formulés et fabriqués en France, avec des contrôles qualité à chaque étape de production." },
        { q: "Les dosages sont-ils transparents ?", a: "Absolument. Nous communiquons la composition complète et les dosages exacts (par dose journalière recommandée) de chaque actif — plantes adaptogènes, champignons fonctionnels et substances — directement sur nos attestations et fiches produit." },
        { q: "Vos gummies sont-ils vegan, sans sucre et sans gluten ?", a: "Oui. Nos 3 gummies sont vegan, sans sucre ni colorants artificiels, sans gluten, et riches en fibres prébiotiques pour soutenir l'équilibre du microbiote. La poudre MUSHGLOW est 100 % naturelle et tout-en-un." },
        { q: "Au bout de combien de temps ressent-on les effets ?", a: "Cela varie selon les personnes et le produit. Beaucoup ressentent les premiers effets dès la première semaine, mais nous recommandons une cure de 6 semaines pour bénéficier de tous les effets des adaptogènes, suivie d'une pause avant de recommencer." },
        { q: "Y a-t-il des contre-indications ?", a: "Les compléments alimentaires ne se substituent pas à une alimentation variée et équilibrée. En cas de grossesse, d'allaitement, de traitement médical ou de doute, demandez conseil à un professionnel de santé avant toute cure. Ne pas dépasser la dose journalière recommandée." },
        { q: "Livraison et satisfaction : quelles garanties ?", a: "Livraison offerte dès 49 € et paiement 100 % sécurisé. Nos produits sont satisfait ou remboursé sous 30 jours." },
      ],
    },
    mobileCta: "Découvrir nos produits",
  },
  en: {
    hero: {
      badge: "Adaptogens and functional mushrooms, dosed according to science. Formulated and made in France to support your everyday life.",
      title1: "Wellness,",
      title2: "naturally.",
      p1: "BIEN HEALTH is a French brand of natural food supplements on a mission to help life's athletes better handle everyday challenges: stress, sleep, mental fog, memory issues and low energy.",
      p2: "Born from the journey of a former elite athlete who used adaptogenic plants and medicinal mushrooms (ashwagandha, saffron…) to optimise her physical and mental preparation — before creating a brand that's more effective, natural and accessible every day.",
      cta: "Discover our products",
      g1: "30-day money-back guarantee",
      g2: "French brand",
      keyPointsTitle: "The essentials",
      keyPoints: [
        "4 natural products: 3 gummies + 1 all-in-one powder",
        "Vegan, no sugar or colourings, gluten-free — made in France",
        "Rich in prebiotic fibres for the microbiome",
        "Adaptogens & mushrooms, transparent dosages",
      ],
    },
    reassurance: ["Free shipping over €49", "Secure payment", "Made in France", "30-day money-back"],
    press: {
      verified: "Verified Reviews",
      certified: "Certified",
      seeAllTitle: "See all our reviews on Trustpilot",
      reviews: "reviews",
      featured: "As featured in",
      clickHint: "Click a media outlet to read the article ↗",
      readArticle: (n: string) => `Read the article — ${n}`,
      compliance: "Compliance & transparency",
    },
    benefits: {
      eyebrow: "Support your wellbeing",
      title: "A solution for every need.",
      sub: "Active ingredients dosed according to science, to target what really matters.",
      diagEyebrow: "Quiz",
      diagText: "In 30 seconds, find the BIEN product that truly answers your need.",
      diagCta: "Take the test",
    },
    rituals: [
      { title: "Calm & Sleep", desc: "Soothe the mind, restore deep sleep." },
      { title: "Focus & Mental clarity", desc: "Support memory and everyday focus." },
      { title: "Energy & Performance", desc: "Physical endurance and lasting vitality." },
      { title: "Beauty & Balance", desc: "Skin, hair and natural hormonal balance." },
    ],
    reviews: {
      basedOnPre: "Based on ",
      basedOnStrong: "+100 Trustpilot reviews",
      verified: "Verified",
      seeAll: "See all our reviews on Trustpilot",
      items: [
        { text: "Blown away, even though I didn't believe in it. From the very first dose, I powered through an intense week of creative work feeling hyper-focused, clear-headed, without scattering and without stress.", name: "Elvirash", date: "Sep 26, 2024" },
        { text: "A clear improvement in my focus and mental clarity, plus a real feeling of calm and wellbeing. Natural — I highly recommend it.", name: "Carla", date: "Nov 5, 2024" },
        { text: "My stress dropped significantly, helping me sleep and regain a calmer daily life. The support from the BIEN team was perfect. I recommend it wholeheartedly!", name: "Lucie Nocerino", date: "Sep 20, 2024" },
        { text: "Quality products that are easy to take. After 4 doses, I can gradually feel the real benefits.", name: "Romain Guichard", date: "Nov 24, 2024" },
        { text: "I've been micro-dosing for 14 days and felt the benefits from the very first week: far more focused and organised in my thinking.", name: "Grégoire Proux", date: "Sep 5, 2024" },
        { text: "100% satisfied when it comes to productivity.", name: "Victoria Faur", date: "Jun 11, 2025" },
      ],
    },
    ingredients: { eyebrow: "Premium ingredients", titleA: "The power of nature,", titleB: "measured by science." },
    best: { eyebrow: "Best-sellers", title: "Our favourite rituals.", seeAll: "See all products", fallbackTag: "Natural supplement" },
    diagBlock: {
      eyebrow: "Free quiz · 60 seconds",
      title: "What do you need?",
      text: "Answer a few questions and get the BIEN formula that matches your lifestyle.",
      promo: "−10% on your first order",
    },
    mission: {
      eyebrow: "Our mission",
      title: "Helping life's athletes live better every day.",
      p1: "BIEN HEALTH is a French brand of natural food supplements on a mission to help life's athletes better handle everyday challenges: stress, sleep, mental fog, memory issues and low energy.",
      p2: "The brand was born from the journey of a former elite athlete who used adaptogenic plants and medicinal mushrooms (ashwagandha, saffron…) to optimise her physical and mental preparation — before creating a brand that's more effective, natural and accessible every day.",
      list: [
        "4 natural products: 3 gummies + 1 all-in-one powder",
        "Vegan, no sugar or artificial colourings, gluten-free — made in France",
        "Rich in prebiotic fibres for a balanced microbiome",
        "Adaptogenic plants & medicinal mushrooms, transparent dosages",
      ],
      cards: [
        { title: "A short, focused range", text: "Just 4 products: 3 natural gummies — sugar-free, colouring-free, vegan, gluten-free, made in France and rich in prebiotic fibres; and a 100% natural all-in-one powder." },
        { title: "A holistic approach to health", text: "Natural formulas, ingredient quality, dosage transparency and a holistic vision (microbiome, functional nutrition). Our actives help the body regulate itself better." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Your questions, our guarantees.",
      sub: "Transparency, compliance and quality — everything to know before starting your programme.",
      cta: "See our compliance certificates",
      items: [
        { q: "Are your products declared and compliant with regulations?", a: "Yes. Every BIEN supplement is officially declared to the DGAL (French Ministry of Agriculture), registered on the COMPL'ALIM platform with a publicly verifiable number. You'll find all the certificates on our Compliance & certifications page." },
        { q: "Where are your supplements made?", a: "Our products are formulated and made in France, with quality controls at every stage of production." },
        { q: "Are the dosages transparent?", a: "Absolutely. We disclose the full composition and exact dosages (per recommended daily dose) of every active — adaptogenic plants, functional mushrooms and other substances — directly on our certificates and product pages." },
        { q: "Are your gummies vegan, sugar-free and gluten-free?", a: "Yes. Our 3 gummies are vegan, free from sugar and artificial colourings, gluten-free, and rich in prebiotic fibres to support a balanced microbiome. The MUSHGLOW powder is 100% natural and all-in-one." },
        { q: "How long before you feel the effects?", a: "It varies from person to person and by product. Many feel the first effects within the first week, but we recommend a 6-week programme to benefit from the full effects of adaptogens, followed by a break before starting again." },
        { q: "Are there any contraindications?", a: "Food supplements do not replace a varied and balanced diet. If you are pregnant, breastfeeding, under medical treatment or in doubt, seek advice from a healthcare professional before any programme. Do not exceed the recommended daily dose." },
        { q: "Shipping and satisfaction: what guarantees?", a: "Free shipping over €49 and 100% secure payment. Our products come with a 30-day money-back guarantee." },
      ],
    },
    mobileCta: "Discover our products",
  },
} as const;

/** Affiche une note sur 5 avec demi-étoiles (ex. 4,4 → ~4,5 étoiles). */
function StarRating({ value, className = "h-5 w-5" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex align-middle" aria-label={`${value} / 5`}>
      <span className="flex text-bien-star/25">
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current`} />)}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="inline-flex text-bien-star">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current shrink-0`} />)}
        </span>
      </span>
    </span>
  );
}

function Bubble({ item, side, note, anim, delay = 0, lang }: {
  item: { title: string; desc: string; icon: ComponentType<{ className?: string }>; tint: string };
  side: "left" | "right";
  note: number;
  anim: "left" | "right" | "up" | "down";
  delay?: number;
  lang: string;
}) {
  const Icon = item.icon;
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative z-10 w-full max-w-[23rem] reveal-dir reveal-from-${anim} ${side === "left" ? "lg:mr-auto" : "lg:ml-auto"}`}
    >
      <a href={`/${lang}/collections/accessories`} className="block bg-card rounded-[1.75rem] p-7 text-center ring-1 ring-border bien-shadow hover:-translate-y-1.5 hover:ring-bien-gold/60 transition-all">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-navy text-bien-cream group-hover:bg-bien-sky group-hover:text-bien-navy group-hover:scale-110 group-hover:rotate-6 transition-all">
          <Icon className="h-8 w-8" />
        </span>
        <h3 className="mt-4 font-display text-xl text-black leading-tight">
          {item.title}<sup className="text-bien-pink text-xs ml-0.5">{note}</sup>
        </h3>
        <p className="mt-2 text-sm text-black/70 leading-relaxed">{item.desc}</p>
      </a>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const c = CONTENT[lang === "en" ? "en" : "fr"];
  const rituals = c.rituals.map((r, i) => ({ ...r, icon: RITUAL_ICONS[i], tint: RITUAL_TINTS[i] }));

  // Vrais produits Shopify (repli sur la démo tant que le token n'est pas configuré)
  // On exclut les accessoires (mousseur, tote bag) pour ne garder que les compléments.
  const EXCLUDE_HANDLES = new Set(["mousseur-a-lait", "bien-totebag"]);
  const shopProducts = (await getProducts(12)).filter((p) => !EXCLUDE_HANDLES.has(p.handle));
  const products = shopProducts.length
    ? shopProducts.map((p) => ({
        name: p.title,
        tagline: p.tags[0] ?? c.best.fallbackTag,
        price: formatPrice(p.price),
        img: p.featuredImage?.url ?? "/brand/product-mushglow.jpg",
        handle: p.handle as string | null,
        available: p.available,
      }))
    : FALLBACK_PRODUCTS.map((p) => ({ ...p, tagline: c.best.fallbackTag, handle: null as string | null, available: true }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RevealController />
      <SiteHeader lang={lang} />

      {/* 3. HERO */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-10">
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.75rem] overflow-hidden bien-shadow">
          <div className="grid lg:grid-cols-[calc(50%_+_100px)_1fr] items-stretch">
            <div className="anim-up text-bien-cream p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-start gap-2 rounded-2xl bg-bien-cream/10 backdrop-blur px-4 py-2.5 text-xs sm:text-sm text-bien-cream/90 ring-1 ring-bien-cream/20 max-w-md">
                <Leaf className="h-4 w-4 shrink-0 mt-0.5 text-bien-gold" />
                <span className="leading-snug">{c.hero.badge}</span>
              </div>
              <h1 className="mt-5 font-hero leading-[0.95] text-[clamp(2.5rem,7vw,5.25rem)]">
                {c.hero.title1}<br /><span className="text-bien-gold">{c.hero.title2}</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-bien-cream/90 max-w-xl leading-relaxed">
                {c.hero.p1}
              </p>
              <p className="mt-3 text-sm sm:text-base text-bien-cream/70 max-w-xl leading-relaxed">
                {c.hero.p2}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:flex-nowrap gap-x-4 gap-y-3">
                <a href={`/${lang}/collections/accessories`} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-7 py-4 text-base font-semibold hover:brightness-95 transition bien-shadow-sm">
                  {c.hero.cta} <ArrowRight className="h-4 w-4" />
                </a>
                <span className="shrink-0 inline-flex items-center gap-2 text-sm text-bien-cream/85 whitespace-nowrap"><Check className="h-4 w-4 text-bien-gold" /> {c.hero.g1}</span>
                <span className="shrink-0 inline-flex items-center gap-2 text-sm text-bien-cream/85 whitespace-nowrap"><Check className="h-4 w-4 text-bien-gold" /> {c.hero.g2}</span>
              </div>
            </div>
            <div className="anim-up anim-delay-1 relative h-72 sm:h-96 lg:h-auto lg:min-h-[920px]">
              <Image src="/bien-health-bien-etre.jpg" alt="Produits BIEN — compléments naturels" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              {/* Carte points clés flottante par-dessus la photo */}
              <div className="absolute bottom-20 left-4 right-4 sm:bottom-24 sm:left-6 sm:right-6 lg:bottom-28">
                <div className="rounded-[1.75rem] bg-card/70 backdrop-blur-2xl ring-1 ring-white/60 shadow-2xl shadow-bien-forest/20 p-3.5 sm:p-4">
                  <div className="flex items-center gap-2 px-1.5 pb-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-bien-gold" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-bien-leaf">{c.hero.keyPointsTitle}</p>
                  </div>
                  <ul className="space-y-0.5">
                    {c.hero.keyPoints.map((line, i) => {
                      const Icon = KEYPOINT_ICONS[i];
                      return (
                        <li key={line} className="group flex items-center gap-3 rounded-2xl px-1.5 py-1.5 hover:bg-bien-cream/70 transition-colors">
                          <span className={`shrink-0 grid place-items-center h-8 w-8 rounded-xl ${KEYPOINT_TINTS[i]} group-hover:scale-105 transition-transform`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-[13px] sm:text-sm text-black font-semibold leading-snug">{line}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Reassurance card (overlapping) */}
        <div className="relative -mt-8 sm:-mt-10 lg:-mt-14 mx-2 sm:mx-6 lg:mx-12 bg-card rounded-3xl bien-shadow p-5 sm:p-7">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {c.reassurance.map((label, i) => {
              const Icon = REASSURANCE_ICONS[i];
              return (
                <li key={label} className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-bien-leaf/15 text-bien-leaf"><Icon className="h-5 w-5" /></span>
                  <span className="text-sm font-semibold text-black leading-tight">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 5. Press */}
      <section id="presse" className="reveal px-4 sm:px-6 lg:px-[100px] pt-16 sm:pt-20 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-7">
          <div className="inline-flex items-center gap-2">
            <span className="font-semibold text-[15px] text-black tracking-tight">Trustpilot</span>
            <span className="inline-flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="grid place-items-center h-5 w-5 rounded-[3px] bg-[#00b67a]">
                  <Star className="h-3 w-3 fill-white text-white" />
                </span>
              ))}
            </span>
          </div>
          <span className="hidden sm:block h-6 w-px bg-border" />
          <div className="inline-flex items-center gap-2 rounded-full bg-card ring-1 ring-border px-3.5 py-1.5">
            <span className="grid place-items-center h-5 w-5 rounded-full bg-[#2bb3a3] text-white"><Check className="h-3 w-3" /></span>
            <span className="text-[13px] font-semibold text-black">{c.press.verified}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/55">{c.press.certified}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={c.press.seeAllTitle}
            className="group inline-flex items-center gap-3 sm:gap-4 rounded-full bg-card ring-1 ring-border bien-shadow px-5 sm:px-7 py-3 hover:ring-bien-gold/60 hover:-translate-y-0.5 transition-all"
          >
            <StarRating value={4.4} className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-display text-xl sm:text-2xl text-black leading-none">4,4/5</span>
            <span className="h-5 w-px bg-border" />
            <span className="text-sm sm:text-base text-black/65"><span className="font-semibold text-black">+100</span> {c.press.reviews}</span>
            <ArrowUpRight className="h-4 w-4 text-bien-leaf opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>
        <p className="mt-10 mb-[30px] text-center text-xs uppercase tracking-[0.2em] text-bien-sage font-semibold underline decoration-bien-sky decoration-2 underline-offset-4">
          <Typewriter text={c.press.featured} />
        </p>
        <p className="text-center text-[13px] font-bold text-black/60">{c.press.clickHint}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {PRESS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={c.press.readArticle(p.name)}
              className="group inline-flex items-center gap-1.5 font-display text-3xl sm:text-4xl text-black hover:text-bien-leaf transition-colors tracking-tight underline-offset-[8px] decoration-2 decoration-bien-gold hover:underline"
            >
              {p.name}
              <ArrowUpRight className="h-6 w-6 text-bien-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href={`/${lang}/certifications`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-bien-leaf text-white bien-shadow-sm px-8 py-4 text-base font-bold hover:brightness-110 hover:-translate-y-0.5 transition-all"
          >
            <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15 text-white"><ShieldCheck className="h-3.5 w-3.5" /></span>
            {c.press.compliance}
            <ArrowRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
          </a>
        </div>
      </section>

      {/* 6. Bénéfices — bulles reliées à l'image centrale */}
      <section id="diagnostic" className="reveal bg-bien-cream mt-20 sm:mt-28 px-4 sm:px-6 lg:px-[200px] py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.benefits.eyebrow}</p>
          <h2 className="mt-3 font-display tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">{c.benefits.title}</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70">
            {c.benefits.sub}
          </p>
        </div>

        <div className="mt-16 relative grid lg:grid-cols-[1fr_minmax(360px,560px)_1fr] gap-y-14 lg:gap-x-8 items-center">
          <svg
            aria-hidden
            viewBox="0 0 1000 680"
            preserveAspectRatio="xMidYMid meet"
            className="hidden lg:block absolute inset-0 m-auto w-full max-w-[1180px] h-auto text-bien-pink/70 pointer-events-none z-0"
            fill="none"
          >
            <ellipse cx="500" cy="340" rx="478" ry="300" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 11" strokeLinecap="round" />
            {[
              [118, 168], [882, 168], [118, 512], [882, 512],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill="currentColor" className="text-bien-pink" />
            ))}
          </svg>

          {/* Colonne gauche */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start gap-y-16">
            <Bubble item={rituals[0]} side="left" note={1} anim="left" delay={0} lang={lang} />
            <Bubble item={rituals[1]} side="left" note={2} anim="down" delay={150} lang={lang} />
          </div>

          {/* Image centrale */}
          <div className="order-1 lg:order-2 relative z-10 aspect-[3/4] w-full max-w-[34rem] mx-auto rounded-[2.25rem] overflow-hidden bien-shadow ring-4 ring-background">
            <Image src="/prelude-bien-health.jpg" alt="Produits BIEN — bénéfices" fill sizes="(max-width:1024px) 80vw, 360px" className="object-cover" />
          </div>

          {/* Colonne droite */}
          <div className="order-3 flex flex-col items-center lg:items-end gap-y-16">
            <Bubble item={rituals[2]} side="right" note={3} anim="right" delay={300} lang={lang} />
            <Bubble item={rituals[3]} side="right" note={4} anim="up" delay={450} lang={lang} />
          </div>
        </div>

        <div className="mt-14 text-center max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.benefits.diagEyebrow}</p>
          <p className="mt-3 text-lg text-black/80 leading-relaxed">
            {c.benefits.diagText}
          </p>
          <a href={`/${lang}/diagnostic`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
            {c.benefits.diagCta} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 7. Reviews */}
      <section id="avis" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-cream rounded-3xl lg:rounded-[2.5rem] p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left lg:border-r lg:border-bien-forest/10 lg:pr-12 shrink-0">
              <div className="font-display text-7xl lg:text-8xl text-black leading-none">4,4</div>
              <div className="mt-3 flex items-center justify-center lg:justify-start">
                <StarRating value={4.4} className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm text-black/70">{c.reviews.basedOnPre}<span className="font-semibold">{c.reviews.basedOnStrong}</span></p>
              <a
                href={TRUSTPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={c.reviews.seeAll}
                className="mt-5 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="font-semibold text-sm text-black tracking-tight">Trustpilot</span>
                <span className="inline-flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="grid place-items-center h-4 w-4 rounded-[3px] bg-[#00b67a]">
                      <Star className="h-2.5 w-2.5 fill-white text-white" />
                    </span>
                  ))}
                </span>
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {c.reviews.items.map((r) => (
                <article key={r.name} className="bg-card rounded-2xl p-5 bien-shadow-sm flex flex-col">
                  <div className="flex gap-1">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-bien-star text-bien-star" />)}</div>
                  <p className="mt-3 text-sm text-black/85 leading-relaxed flex-1">« {r.text} »</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span><span className="font-semibold text-black">{r.name}</span><span className="ml-2 text-black/45">{r.date}</span></span>
                    <span className="inline-flex items-center gap-1 text-bien-leaf"><Check className="h-3 w-3" /> {c.reviews.verified}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Widget Trustpilot live (rendu dès que les identifiants sont configurés) */}
          {TP_BUSINESS_UNIT_ID && TP_TEMPLATE_ID && (
            <div className="mt-8 border-t border-bien-forest/10 pt-8">
              <TrustpilotWidget templateId={TP_TEMPLATE_ID} businessUnitId={TP_BUSINESS_UNIT_ID} height="140px" />
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#00b67a] text-white px-6 py-3 text-sm font-bold hover:brightness-105 transition"
            >
              <span className="inline-flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="grid place-items-center h-4 w-4 rounded-[3px] bg-white/25">
                    <Star className="h-2.5 w-2.5 fill-white text-white" />
                  </span>
                ))}
              </span>
              {c.reviews.seeAll}
              <ArrowUpRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 8. Ingredients */}
      <section id="ingredients" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-leaf text-bien-cream rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-citrus font-semibold">{c.ingredients.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1]">
              {c.ingredients.titleA} <br className="hidden sm:block" /><span className="text-bien-citrus">{c.ingredients.titleB}</span>
            </h2>
          </div>
          <IngredientsCarousel />
        </div>
      </section>

      {/* 9. Best-sellers */}
      <section id="produits" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.best.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">{c.best.title}</h2>
          </div>
          <Link href={`/${lang}/collections/accessories`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">{c.best.seeAll} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ProductsCarousel products={products} lang={lang} />
      </section>

      {/* 10. Diagnostic block */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-gold rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16 text-black">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">{c.diagBlock.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(2rem,5vw,4rem)] leading-[1]">{c.diagBlock.title}</h2>
            <p className="mt-4 text-base sm:text-lg opacity-85 max-w-xl">{c.diagBlock.text}</p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rituals.map(({ title, icon: Icon }) => (
              <a key={title} href={`/${lang}/diagnostic`} className="group bg-bien-forest text-bien-cream rounded-2xl px-5 py-5 text-left hover:bg-bien-leaf transition-colors flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-bien-cream/10 shrink-0"><Icon className="h-5 w-5" /></span>
                <span className="font-display text-base leading-tight">{title}</span>
              </a>
            ))}
          </div>
          <p className="mt-7 text-sm font-semibold inline-flex items-center gap-2 bg-bien-forest text-bien-cream rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-bien-citrus" /> {c.diagBlock.promo}
          </p>
        </div>
      </section>

      {/* 11. Notre mission */}
      <section id="mission" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[710px] bien-shadow lg:sticky lg:top-28">
            <Image src="/athletes-bien-health.jpg" alt="BIEN — compléments naturels fabriqués en France" fill loading="lazy" sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.mission.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">{c.mission.title}</h2>
            <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed">
              {c.mission.p1}
            </p>
            <p className="mt-4 text-base text-black/75 leading-relaxed">
              {c.mission.p2}
            </p>
            <ul className="mt-7 space-y-3">
              {c.mission.list.map((line) => (
                <li key={line} className="flex items-start gap-3 text-black">
                  <span className="mt-1 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>

            {/* Notre approche — 2 cartes */}
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {c.mission.cards.map((card, i) => {
                const Icon = i === 0 ? Leaf : HeartPulse;
                const img = i === 0 ? "/gamme-courte-ciblee.jpg" : "/approch-globale-sante.jpg";
                return (
                  <article key={card.title} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={img} alt={card.title} fill loading="lazy" sizes="(max-width:1024px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="px-5 pb-6 pt-0">
                      <span className="relative -mt-7 grid place-items-center h-14 w-14 rounded-2xl bg-bien-gold text-black ring-4 ring-card shadow">
                        <Icon className="h-7 w-7" />
                      </span>
                      <h3 className="mt-4 font-display text-lg text-black leading-tight">{card.title}</h3>
                      <p className="mt-2 text-sm text-black/75 leading-relaxed">{card.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ — réassurance & conformité */}
        <div className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.faq.eyebrow}</p>
            <h3 className="mt-3 font-display tracking-tighter text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-black">{c.faq.title}</h3>
            <p className="mt-3 text-black/70">{c.faq.sub}</p>
          </div>
          <div className="mt-8 space-y-3">
            {c.faq.items.map(({ q, a }) => (
              <details key={q} className="group bg-card rounded-2xl ring-1 ring-border bien-shadow-sm px-5 sm:px-6 open:ring-bien-leaf/40 transition-all">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4 sm:py-5 font-display text-base sm:text-lg text-black">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 -mt-0.5 text-sm sm:text-base text-black/75 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href={`/${lang}/certifications`} className="inline-flex items-center gap-2 rounded-full bg-bien-leaf text-white px-6 py-3 text-sm font-bold hover:brightness-110 transition">
              <ShieldCheck className="h-4 w-4" /> {c.faq.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: c.faq.items.map(({ q, a }) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* Footer : désormais global (rendu par le layout). */}

      {/* 13. Mobile sticky CTA */}
      <a href={`/${lang}/collections/accessories`} className="sm:hidden fixed bottom-4 inset-x-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-6 py-4 text-base font-bold bien-shadow">
        <ShoppingBag className="h-4 w-4" /> {c.mobileCta}
      </a>
    </div>
  );
}
