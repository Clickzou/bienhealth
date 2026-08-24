import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { hasLocale } from "./dictionaries";
import { getProducts, formatPrice } from "@/lib/shopify-products";
import { benefitFor } from "@/lib/shop";
import { accentLastWord } from "@/lib/accent-title";
import IngredientsCarousel from "@/components/ingredients-carousel";
import HeroCarousel from "@/components/hero-carousel";
import RevealController from "@/components/reveal-controller";
import Typewriter from "@/components/typewriter";
import StarRating from "@/components/star-rating";
import { SHOP_RATING, getShopReviews, ratingLabel } from "@/lib/social-proof";
import ProductsCarousel from "@/components/products-carousel";
import PressMarquee from "@/components/press-marquee";
import BenefitsCarousel from "@/components/benefits-carousel";
import SiteHeader from "@/components/site-header";
import { PRESS } from "@/lib/press";
import {
  Star, Truck, ShieldCheck, MapPin, RefreshCw, Moon, Brain, Zap,
  Sparkles, ShoppingBag, Check, ArrowRight, ArrowUpRight, Leaf, HeartPulse,
  ChevronDown,
} from "lucide-react";


/** Page d'accueil BIEN — contenu bilingue (FR / EN) co-localisé. */


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
      // Accroche courte et orientée bénéfice : le récit de marque est développé
      // plus bas dans la section « Notre mission » (ne pas dupliquer le texte).
      p1: "Stress qui s'installe, nuits trop courtes, brouillard mental, énergie en dents de scie : nos formules courtes répondent à un besoin précis, sans promesse miracle.",
      p2: "Adaptogènes et champignons fonctionnels dosés selon la science, formulés et fabriqués en France, pensés pour tenir dans un café, un smoothie ou une poignée de secondes le matin.",
      cta: "Découvrir nos produits",
      // Tics « clean » plutôt que « Satisfait ou remboursé » / « Marque
      // française » : ces deux garanties figurent déjà dans la carte de
      // réassurance juste en dessous (doublon signalé par le client).
      g1: "Sans sucre ni additifs artificiels",
      g2: "Sans gluten, gummies vegan",
      keyPointsTitle: "L'essentiel",
      keyPoints: [
        "4 produits naturels : 3 gummies + 1 poudre 6-en-1",
        "Sans sucre ni additifs artificiels, sans gluten, gummies vegan et poudre végétarienne, fabriqué en France",
        "Riches en fibres prébiotiques pour nourrir le microbiote",
        "Adaptogènes & champignons, dosages transparents",
      ],
    },
    reassurance: ["Livraison offerte dès 49 €", "Paiement sécurisé", "Fabriqué en France", "Satisfait ou remboursé 30 j"],
    press: {
      verified: "Avis Vérifiés",
      certified: "Certifié",
      purchase: "Achat vérifié",
      seeAllTitle: "Voir tous les avis de nos clients",
      reviews: "avis",
      featured: "Ils parlent de nous",
      clickHint: "Les logos cliquables renvoient vers l'article ↗",
      readArticle: (n: string) => `Lire l'article : ${n}`,
      compliance: "Voir nos attestations officielles",
    },
    benefits: {
      eyebrow: "Soutenez votre bien-être",
      title: "Une réponse pour chaque besoin.",
      sub: "Des actifs dosés selon la science, pour cibler ce qui compte vraiment.",
      prev: "Bénéfice précédent",
      next: "Bénéfice suivant",
    },
    rituals: [
      { title: "Sérénité & Sommeil", desc: "Apaiser le mental, retrouver un sommeil profond." },
      { title: "Concentration & Clarté mentale", desc: "Soutenir la mémoire et le focus quotidien." },
      { title: "Énergie & Performance", desc: "Endurance physique et vitalité durable." },
      { title: "Beauté & équilibre", desc: "Peau, cheveux, équilibre hormonal naturel." },
    ],
    reviews: {
      basedOnPre: "Basé sur ",
      basedOnStrong: (n: number) => `${n} avis clients vérifiés`,
      verified: "Vérifié",
      seeAll: "Voir tous les avis clients",
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
      p2: "La marque est née du parcours d'une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale, avant de créer une marque plus efficace, naturelle et accessible au quotidien.",
      list: [
        "4 produits naturels : 3 gummies + 1 poudre 6-en-1",
        "Sans sucre ni additifs artificiels, sans gluten, gummies vegan et poudre végétarienne, fabriqué en France",
        "Riches en fibres prébiotiques pour nourrir le microbiote",
        "Plantes adaptogènes & champignons médicinaux, dosages transparents",
      ],
      cards: [
        { title: "Une gamme courte et ciblée", text: "4 produits seulement : 3 gummies naturels (sans sucre, sans additifs artificiels, sans gluten, végan, fabriqués en France et riches en fibres prébiotiques) ; et une poudre 100 % naturelle 6-en-1." },
        { title: "Une approche globale de la santé", text: "Formules naturelles, qualité des ingrédients, transparence des dosages et vision globale (microbiote, nutrition fonctionnelle). Nos actifs aident l'organisme à mieux se réguler." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Vos questions, nos garanties.",
      sub: "Transparence, conformité et qualité : tout ce qu'il faut savoir avant de commencer votre cure.",
      cta: "Voir nos attestations de conformité",
      seeMore: "Voir toutes les questions",
      seeLess: "Réduire",
      items: [
        { q: "Vos produits sont-ils déclarés et conformes à la réglementation ?", a: "Oui. Chaque complément BIEN fait l'objet d'une déclaration officielle auprès de la DGAL (Ministère de l'Agriculture), enregistrée sur la plateforme COMPL'ALIM avec un numéro vérifiable publiquement. Vous retrouvez toutes les attestations sur notre page Conformité & certifications." },
        { q: "Où sont fabriqués vos compléments ?", a: "Nos produits sont formulés et fabriqués en France, avec des contrôles qualité à chaque étape de production." },
        { q: "Les dosages sont-ils transparents ?", a: "Absolument. Nous communiquons la composition complète et les dosages exacts (par dose journalière recommandée) de chaque actif (plantes adaptogènes, champignons fonctionnels et substances) directement sur nos attestations et fiches produit." },
        { q: "Vos produits sont-ils sans sucre, sans gluten et végan ?", a: "Nos 3 gummies sont sans sucre, sans additifs artificiels, sans gluten et vegan. Ils sont riches en fibres prébiotiques pour soutenir l'équilibre du microbiote. La poudre MUSHGLOW est 100 % naturelle et 6-en-1." },
        { q: "Au bout de combien de temps ressent-on les effets ?", a: "Cela varie selon les personnes et le produit. Beaucoup ressentent les premiers effets dès la première semaine, mais nous recommandons une cure de 8 semaines pour bénéficier de tous les effets des adaptogènes, suivie d'une pause avant de recommencer." },
        { q: "Y a-t-il des contre-indications ?", a: "Les compléments alimentaires ne se substituent pas à une alimentation variée et équilibrée. En cas de grossesse, d'allaitement, de traitement médical ou de doute, demandez conseil à un professionnel de santé avant toute cure. Ne pas dépasser la dose journalière recommandée." },
        { q: "Livraison et satisfaction : quelles garanties ?", a: "Livraison offerte dès 49 € et paiement 100 % sécurisé. Nos produits sont satisfaits ou remboursés sous 30 jours." },
      ],
    },
    mobileCta: "Découvrir nos produits",
  },
  en: {
    hero: {
      badge: "Adaptogens and functional mushrooms, dosed according to science. Formulated and made in France to support your everyday life.",
      title1: "Wellness,",
      title2: "naturally.",
      p1: "Creeping stress, short nights, mental fog, energy swings: our short formulas answer one precise need, with no miracle promises.",
      p2: "Adaptogens and functional mushrooms dosed according to science, formulated and made in France, designed to fit into a coffee, a smoothie or a few seconds of your morning.",
      cta: "Discover our products",
      g1: "No sugar, no artificial additives",
      g2: "Gluten-free, vegan gummies",
      keyPointsTitle: "The essentials",
      keyPoints: [
        "4 natural products: 3 gummies + 1 6-in-1 powder",
        "No sugar, no artificial additives, gluten-free, vegan gummies and vegetarian powder, made in France",
        "Rich in prebiotic fibres to nourish the microbiome",
        "Adaptogens & mushrooms, transparent dosages",
      ],
    },
    reassurance: ["Free shipping over €49", "Secure payment", "Made in France", "30-day money-back"],
    press: {
      verified: "Verified Reviews",
      certified: "Certified",
      purchase: "Verified purchase",
      seeAllTitle: "See all our customer reviews",
      reviews: "reviews",
      featured: "As featured in",
      clickHint: "Clickable logos link through to the article ↗",
      readArticle: (n: string) => `Read the article: ${n}`,
      compliance: "See our official certifications",
    },
    benefits: {
      eyebrow: "Support your wellbeing",
      title: "A solution for every need.",
      sub: "Active ingredients dosed according to science, to target what really matters.",
      prev: "Previous benefit",
      next: "Next benefit",
    },
    rituals: [
      { title: "Calm & Sleep", desc: "Soothe the mind, restore deep sleep." },
      { title: "Focus & Mental clarity", desc: "Support memory and everyday focus." },
      { title: "Energy & Performance", desc: "Physical endurance and lasting vitality." },
      { title: "Beauty & Balance", desc: "Skin, hair and natural hormonal balance." },
    ],
    reviews: {
      basedOnPre: "Based on ",
      basedOnStrong: (n: number) => `${n} verified customer reviews`,
      verified: "Verified",
      seeAll: "See all customer reviews",
      items: [
        { text: "Blown away, even though I didn't believe in it. From the very first dose, I powered through an intense week of creative work feeling hyper-focused, clear-headed, without scattering and without stress.", name: "Elvirash", date: "Sep 26, 2024" },
        { text: "A clear improvement in my focus and mental clarity, plus a real feeling of calm and wellbeing. Natural, and I highly recommend it.", name: "Carla", date: "Nov 5, 2024" },
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
      p2: "The brand was born from the journey of a former elite athlete who used adaptogenic plants and medicinal mushrooms (ashwagandha, saffron…) to optimise her physical and mental preparation, before creating a brand that's more effective, natural and accessible every day.",
      list: [
        "4 natural products: 3 gummies + 1 6-in-1 powder",
        "No sugar, no artificial additives, gluten-free, vegan gummies and vegetarian powder, made in France",
        "Rich in prebiotic fibres to nourish the microbiome",
        "Adaptogenic plants & medicinal mushrooms, transparent dosages",
      ],
      cards: [
        { title: "A short, focused range", text: "Just 4 products: 3 natural gummies (sugar-free, free from artificial additives, gluten-free, vegan, made in France and rich in prebiotic fibres); and a 100% natural 6-in-1 powder." },
        { title: "A holistic approach to health", text: "Natural formulas, ingredient quality, dosage transparency and a holistic vision (microbiome, functional nutrition). Our actives help the body regulate itself better." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Your questions, our guarantees.",
      sub: "Transparency, compliance and quality: everything to know before starting your programme.",
      cta: "See our compliance certificates",
      seeMore: "See all questions",
      seeLess: "Show less",
      items: [
        { q: "Are your products declared and compliant with regulations?", a: "Yes. Every BIEN supplement is officially declared to the DGAL (French Ministry of Agriculture), registered on the COMPL'ALIM platform with a publicly verifiable number. You'll find all the certificates on our Compliance & certifications page." },
        { q: "Where are your supplements made?", a: "Our products are formulated and made in France, with quality controls at every stage of production." },
        { q: "Are the dosages transparent?", a: "Absolutely. We disclose the full composition and exact dosages (per recommended daily dose) of every active (adaptogenic plants, functional mushrooms and other substances) directly on our certificates and product pages." },
        { q: "Are your products sugar-free, gluten-free and vegan?", a: "Our 3 gummies are sugar-free, free from artificial additives, gluten-free and vegan. They are rich in prebiotic fibres to support a balanced microbiome. The MUSHGLOW powder is 100% natural and 6-in-1." },
        { q: "How long before you feel the effects?", a: "It varies from person to person and by product. Many feel the first effects within the first week, but we recommend an 8-week programme to benefit from the full effects of adaptogens, followed by a break before starting again." },
        { q: "Are there any contraindications?", a: "Food supplements do not replace a varied and balanced diet. If you are pregnant, breastfeeding, under medical treatment or in doubt, seek advice from a healthcare professional before any programme. Do not exceed the recommended daily dose." },
        { q: "Shipping and satisfaction: what guarantees?", a: "Free shipping over €49 and 100% secure payment. Our products come with a 30-day money-back guarantee." },
      ],
    },
    mobileCta: "Discover our products",
  },
} as const;

function Bubble({ item, side, anim, delay = 0, lang, className = "" }: {
  item: { title: string; desc: string; icon: ComponentType<{ className?: string }>; tint: string };
  side: "left" | "right";
  anim: "left" | "right" | "up" | "down";
  delay?: number;
  lang: string;
  /** Placement dans la grille desktop (colonne/rangée). */
  className?: string;
}) {
  const Icon = item.icon;
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      /* Téléphone : une carte pleine largeur par vue, aimantée — les flèches
         sont posées à côté de la piste, donc rien ne recouvre la carte et il
         n'y a plus d'aperçu de la suivante. `max-w` ne s'applique qu'à partir
         de `sm`, où la carte reprend sa largeur de pile. */
      className={`group relative z-10 w-full shrink-0 snap-center sm:shrink sm:max-w-[23rem] reveal-dir reveal-from-${anim} ${side === "left" ? "lg:mr-auto" : "lg:ml-auto"} ${className}`}
    >
      {/* `h-full` + colonne : les cartes d'une même rangée (ou d'une même vue
          de carrousel) finissent à la même hauteur, quel que soit le nombre de
          lignes du titre. Le descriptif absorbe la différence en `flex-1`, si
          bien que le « Découvrir » reste aligné d'une carte à l'autre. */}
      {/* Ni ombre ni contour tant que la carte est dans la piste du carrousel :
          posée sur le fond crème, l'ombre y traînait un liseré gris sous la
          carte, et le `ring` gris qui restait était lu comme un reste d'ombre
          (retour client). La carte blanche se détache alors du crème par son
          seul fond. Les deux reviennent dès sm, où les cartes redeviennent une
          pile. */}
      <a href={`/${lang}/boutique`} className="flex h-full flex-col bg-card rounded-[1.75rem] p-7 text-center ring-1 ring-transparent sm:ring-border sm:bien-shadow hover:-translate-y-1.5 hover:ring-bien-gold/60 transition-all">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-navy text-bien-cream group-hover:bg-bien-sky group-hover:text-bien-navy group-hover:scale-110 group-hover:rotate-6 transition-all">
          <Icon className="h-8 w-8" />
        </span>
        <h3 className="mt-4 font-display text-xl text-black leading-tight">
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-black/70 leading-relaxed">{item.desc}</p>
        <span className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-bien-leaf group-hover:text-bien-navy group-hover:gap-2.5 transition-all">
          {lang === "en" ? "Discover" : "Découvrir"} <ArrowRight className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const c = CONTENT[lang === "en" ? "en" : "fr"];
  const rituals = c.rituals.map((r, i) => ({ ...r, icon: RITUAL_ICONS[i], tint: RITUAL_TINTS[i] }));
  // Nombre d'avis clients réel (Loox, via les metafields Shopify) : « +100 »
  // était un ordre de grandeur que rien ne permettait de vérifier.
  const { count: reviewCount } = await getShopReviews();

  // Vrais produits Shopify (repli sur la démo tant que le token n'est pas configuré)
  // On exclut les accessoires (mousseur, tote bag) pour ne garder que les compléments.
  const EXCLUDE_HANDLES = new Set(["mousseur-a-lait", "bien-totebag"]);
  const shopProducts = (await getProducts(12)).filter((p) => !EXCLUDE_HANDLES.has(p.handle));
  const products = shopProducts.length
    ? shopProducts.map((p) => ({
        name: p.title,
        // Bienfait résolu ici (côté serveur) et non dans le carrousel : celui-ci
        // en gardait une copie française en dur, qui restait en français sur /en.
        tagline: benefitFor(p.title, p.tags[0] ?? c.best.fallbackTag, lang),
        price: formatPrice(p.price),
        img: p.featuredImage?.url ?? "/brand/product-mushglow.jpg",
        handle: p.handle as string | null,
        available: p.available,
      }))
    : FALLBACK_PRODUCTS.map((p) => ({ ...p, tagline: benefitFor(p.name, c.best.fallbackTag, lang), handle: null as string | null, available: true }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RevealController />
      <SiteHeader lang={lang} />

      {/* 3. HERO */}
      {/* Gouttière alignée sur celle du header (lg:px-12 / xl:px-16) plutôt que
          les 100px d'origine : le hero gagne en largeur et la bande blanche de
          chaque côté ne mange plus l'écran (demande client). */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-6 sm:pt-10 lg:pt-6">
        <div className="relative hero-surface rounded-3xl lg:rounded-[2.75rem] overflow-hidden bien-shadow">
          <div className="grid lg:grid-cols-[calc(50%_+_100px)_1fr] items-stretch">
            {/* Hero compact : produit, promesse et CTA visibles sans défiler
                (le bloc faisait 920px de haut, le CTA passait sous la ligne
                de flottaison sur un portable). */}
            <div className="anim-up text-bien-cream p-6 sm:p-8 lg:px-10 lg:py-8 xl:px-12 flex flex-col justify-center">
              <div className="inline-flex items-start gap-2 rounded-2xl bg-bien-cream/10 backdrop-blur px-3.5 py-1.5 text-xs sm:text-[13px] text-bien-cream/90 ring-1 ring-bien-cream/20 max-w-md">
                <Leaf className="h-4 w-4 shrink-0 mt-0.5 text-bien-gold" />
                <span className="leading-snug">{c.hero.badge}</span>
              </div>
              <h1 className="mt-3.5 font-display font-medium leading-[0.95] text-[clamp(2rem,4.3vw,3.25rem)]">
                {c.hero.title1}<br /><span className="text-bien-gold">{c.hero.title2}</span>
              </h1>
              <p className="mt-3 text-[15px] sm:text-base text-bien-cream/90 max-w-xl leading-relaxed">
                {c.hero.p1}
              </p>
              {/* Second paragraphe réservé au grand écran : sur mobile il
                  repousserait le CTA hors de l'écran. */}
              <p className="mt-2.5 hidden lg:block text-sm text-bien-cream/70 max-w-xl leading-relaxed">
                {c.hero.p2}
              </p>
              {/* `flex-wrap` : les garanties passent à la ligne au lieu d'être
                  rognées par le bord du bloc (« Marque française » était coupé). */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={`/${lang}/boutique`} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-6 py-3 text-[15px] font-semibold hover:brightness-95 transition bien-shadow-sm">
                  {c.hero.cta} <ArrowRight className="h-4 w-4" />
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-bien-cream/85"><Check className="h-4 w-4 shrink-0 text-bien-gold" /> {c.hero.g1}</span>
                <span className="inline-flex items-center gap-2 text-sm text-bien-cream/85"><Check className="h-4 w-4 shrink-0 text-bien-gold" /> {c.hero.g2}</span>
              </div>
            </div>
            {/* Visuels : uniquement des photos où le produit est identifiable
                (le bol de fruits rouges ne disait rien de la marque).
                Hauteur pilotée par le viewport et non plus fixée à 680px :
                le hero + la carte de réassurance tiennent ainsi dans le premier
                écran, y compris sur un 13" (demande client). `min-h` et non
                `h` : si le texte de gauche est plus haut (traduction longue),
                la ligne s'étire au lieu de rogner le contenu. */}
            <div className="anim-up anim-delay-1 relative h-72 sm:h-96 lg:h-auto lg:min-h-[clamp(360px,calc(100svh-300px),540px)]">
              <HeroCarousel
                images={[
                  { src: "/bien-health-bien-etre.jpg", alt: lang === "en" ? "BIEN health POWER gummies, energy and performance" : "Gummies BIEN health POWER, énergie et performance" },
                  { src: "/mushglow.jpg", alt: lang === "en" ? "MUSHGLOW, mushroom, adaptogen and collagen supermix" : "MUSHGLOW, supermix champignons, adaptogènes et collagène" },
                  { src: "/ArcParis-4.jpg", alt: lang === "en" ? "BIEN health FOCUS gummies, focus and memory" : "Gummies BIEN health FOCUS, concentration et mémoire", pos: "object-bottom" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* 4. Carte de réassurance — chevauchement volontaire mais discret
            (24px) : l'effet de profondeur de la maquette est conservé sans
            mordre sur la rangée de CTA et de garanties du hero. */}
        <div className="relative -mt-6 mx-2 sm:mx-6 lg:mx-8 bg-card rounded-3xl ring-1 ring-border bien-shadow p-5 sm:p-6">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {c.reassurance.map((label, i) => {
              const Icon = REASSURANCE_ICONS[i];
              return (
                <li key={label} className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-bien-leaf/15 text-bien-leaf"><Icon className="h-5 w-5" /></span>
                  <span className="text-sm font-semibold text-black leading-tight">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 5. Best-sellers — premiers après le hero (demande client). */}
      <section id="produits" className="reveal px-4 sm:px-6 lg:px-12 xl:px-16 pt-9 sm:pt-11">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.best.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.76rem,3.96vw,3.08rem)] leading-[1] text-black">{accentLastWord(c.best.title)}</h2>
          </div>
          <Link href={`/${lang}/boutique`} className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">{c.best.seeAll} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ProductsCarousel products={products} lang={lang} />
      </section>

      {/* 6. Press — placée après les best-sellers : les produits arrivent en premier. */}
      <section id="presse" className="reveal px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14 scroll-mt-24">
        {/* Les avis viennent de Loox (achat vérifié, photos), plus de
            Trustpilot où la boutique ne collectait rien : le bandeau porte donc
            les étoiles de la marque et non la signature d'un tiers. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-7">
          <div className="inline-flex items-center gap-2">
            <StarRating value={SHOP_RATING} className="h-4 w-4" />
            <span className="font-semibold text-[15px] text-black tracking-tight">{c.press.verified}</span>
          </div>
          <span className="hidden sm:block h-6 w-px bg-border" />
          <div className="inline-flex items-center gap-2 rounded-full bg-card ring-1 ring-border px-3.5 py-1.5">
            <span className="grid place-items-center h-5 w-5 rounded-full bg-[#2bb3a3] text-white"><Check className="h-3 w-3" /></span>
            <span className="text-[13px] font-semibold text-black">{c.press.purchase}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href={`/${lang}/avis`}
            title={c.press.seeAllTitle}
            className="group inline-flex items-center gap-3 sm:gap-4 rounded-full bg-card ring-1 ring-border bien-shadow px-5 sm:px-7 py-3 hover:ring-bien-gold/60 hover:-translate-y-0.5 transition-all"
          >
            <StarRating value={SHOP_RATING} className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-display text-xl sm:text-2xl text-black leading-none">{ratingLabel(lang)}/5</span>
            <span className="h-5 w-px bg-border" />
            <span className="text-sm sm:text-base text-black/65"><span className="font-semibold text-black">{reviewCount}</span> {c.press.reviews}</span>
            <ArrowUpRight className="h-4 w-4 text-bien-leaf opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>
        <p className="mt-8 mb-2 text-center text-xs uppercase tracking-[0.2em] text-bien-sage font-semibold underline decoration-bien-sky decoration-2 underline-offset-4">
          <Typewriter text={c.press.featured} />
        </p>
        <p className="text-center text-[13px] font-bold text-black/60">{c.press.clickHint}</p>
        {/* Grille et non `flex-wrap` : sur mobile les logos, de largeurs très
            inégales, se chevauchaient. Chaque logo occupe désormais une cellule
            de hauteur fixe, et le filtre niveaux de gris rattrape leurs
            colorimétries hétérogènes (couleur au survol). */}
        {/* Défilement continu : vingt logos ne tenaient pas en grille sans
            occuper quatre rangées. La liste est rendue deux fois — la seconde
            copie, invisible pour les lecteurs d'écran, referme la boucle (voir
            `components/press-marquee.tsx`, qui porte aussi les flèches de
            navigation manuelle). Chaque logo vit dans une case de taille fixe
            et remplit en `object-contain` : les fichiers n'ont ni la même
            hauteur ni le même rapport de forme. */}
        <div className="mt-6">
          <PressMarquee>
            {/* L'écart entre logos est porté par une marge sur chaque case et non
                par un `gap` : la largeur d'une copie vaut alors exactement la
                moitié de la piste, et la boucle se referme sans décalage. */}
            <div className="flex w-max items-center">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center" aria-hidden={copy === 1 ? true : undefined}>
                  {PRESS.map((p) => {
                    const logo = (
                      <Image src={p.logo} alt={copy === 1 ? "" : p.name} fill sizes="160px" className="object-contain" />
                    );
                    const shell = "relative block h-12 sm:h-14 w-28 sm:w-36 shrink-0 mr-8 sm:mr-12 grayscale opacity-65 transition-all";
                    return p.href && copy === 0 ? (
                      <a
                        key={p.name}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={c.press.readArticle(p.name)}
                        className={`${shell} hover:grayscale-0 hover:opacity-100`}
                      >
                        {logo}
                      </a>
                    ) : (
                      <div key={p.name} className={shell}>
                        {logo}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </PressMarquee>
        </div>
      </section>

      {/* 7. Bénéfices — bulles reliées à l'image centrale.
          Sur téléphone, les bénéfices remontent AVANT « L'essentiel » (demande
          client) : c'est la promesse produit qui doit arriver en premier, la
          liste des points clés vient l'appuyer ensuite. `flex flex-col` +
          `order` le temps du mobile, retour au flux du DOM à partir de lg où
          les cartes entourent la photo. */}
      <section id="diagnostic" className="reveal bg-bien-cream mt-10 sm:mt-14 px-4 sm:px-6 lg:px-24 xl:px-32 py-12 lg:py-16 flex flex-col lg:block">
        <div className="order-1 text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.benefits.eyebrow}</p>
          <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.76rem,3.96vw,3.08rem)] leading-[1] text-black">{accentLastWord(c.benefits.title)}</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70">
            {c.benefits.sub}
          </p>
        </div>

        {/* L'essentiel — points clés (déplacé depuis le hero) */}
        <div className="order-3 mt-10 max-w-[1268px] mx-auto rounded-[1.75rem] bg-card ring-1 ring-border bien-shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-center gap-2 pb-3">
            <span className="h-2 w-2 rounded-full bg-bien-pink" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-bien-leaf">{c.hero.keyPointsTitle}</p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {c.hero.keyPoints.map((line, i) => {
              const Icon = KEYPOINT_ICONS[i];
              return (
                <li key={line} className="flex items-center gap-3 rounded-2xl px-2 py-2">
                  <span className={`shrink-0 grid place-items-center h-9 w-9 rounded-xl ${KEYPOINT_TINTS[i]}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-black font-semibold leading-snug text-left">{line}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="order-2 mt-10 lg:mt-16 relative grid lg:grid-cols-[1fr_minmax(360px,560px)_1fr] gap-y-14 lg:gap-x-8 items-stretch">
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

          {/* Image centrale — masquée sur téléphone (demande client) : au
              format 3/4 elle occupait un écran entier avant d'arriver aux
              bénéfices. À partir de lg elle reprend sa place au centre, entre
              les deux colonnes de cartes. */}
          <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center relative z-10 aspect-[3/4] w-full max-w-[34rem] mx-auto rounded-[2.25rem] overflow-hidden bien-shadow ring-4 ring-background">
            <Image src="/prelude-bien-health.jpg" alt={lang === "en" ? "BIEN health products, benefits" : "Produits BIEN health, bénéfices"} fill sizes="(max-width:1024px) 80vw, 360px" className="object-cover" />
          </div>

          {/* Bénéfices — carrousel sur téléphone uniquement (demande client) :
              empilées, les quatre cartes faisaient quatre écrans de défilement.
              Sur téléphone la piste ouvre la section, la photo étant masquée.
              À partir de `sm` on retrouve la pile, et sur lg le composant
              s'efface (`contents`) : les cartes deviennent enfants directs de
              la grille, deux à gauche et deux à droite de la photo. */}
          <BenefitsCarousel prevLabel={c.benefits.prev} nextLabel={c.benefits.next}>
            <Bubble item={rituals[0]} side="left" anim="left" delay={0} lang={lang} className="lg:col-start-1 lg:row-start-1" />
            <Bubble item={rituals[1]} side="left" anim="down" delay={150} lang={lang} className="lg:col-start-1 lg:row-start-2" />
            <Bubble item={rituals[2]} side="right" anim="right" delay={300} lang={lang} className="lg:col-start-3 lg:row-start-1" />
            <Bubble item={rituals[3]} side="right" anim="up" delay={450} lang={lang} className="lg:col-start-3 lg:row-start-2" />
          </BenefitsCarousel>
        </div>

        {/* L'appel au diagnostic était répété ici ET dans le grand bloc
            « Quel est votre besoin ? » plus bas. Un seul endroit suffit :
            celui qui porte aussi les 4 besoins et la promo. */}

        {/* Attestations : déplacé depuis la section presse pour arriver après
            « Soutenez votre bien-être » (demande client) — la preuve de
            conformité suit ainsi les bénéfices annoncés. */}
        <div className="order-4 mt-14 flex justify-center">
          <a
            href={`/${lang}/certifications`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-bien-leaf text-white bien-shadow-sm px-7 py-3.5 text-[15px] font-bold hover:brightness-110 hover:-translate-y-0.5 transition-all"
          >
            <span className="grid place-items-center h-6 w-6 rounded-full bg-white/15 text-white"><ShieldCheck className="h-3.5 w-3.5" /></span>
            {c.press.compliance}
            <ArrowRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
          </a>
        </div>
      </section>

      {/* 8. Reviews */}
      <section id="avis" className="reveal px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="bg-bien-cream rounded-3xl lg:rounded-[2.5rem] p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left lg:border-r lg:border-bien-forest/10 lg:pr-12 shrink-0">
              <div className="font-display text-7xl lg:text-8xl text-black leading-none">{ratingLabel(lang)}</div>
              <div className="mt-3 flex items-center justify-center lg:justify-start">
                <StarRating value={SHOP_RATING} className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm text-black/70">{c.reviews.basedOnPre}<span className="font-semibold">{c.reviews.basedOnStrong(reviewCount)}</span></p>
              <a
                href={`/${lang}/avis`}
                title={c.reviews.seeAll}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:opacity-80 transition-opacity"
              >
                {c.reviews.seeAll}
                <ArrowUpRight className="h-4 w-4" />
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

          <div className="mt-8 flex justify-center">
            <a
              href={`/${lang}/avis`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-bien-forest text-bien-cream px-6 py-3 text-sm font-bold hover:bg-bien-leaf transition-colors"
            >
              <StarRating value={SHOP_RATING} className="h-4 w-4" />
              {c.reviews.seeAll}
              <ArrowUpRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. Ingredients */}
      <section id="ingredients" className="reveal px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="bg-bien-leaf text-bien-cream rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-citrus font-semibold">{c.ingredients.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.76rem,3.96vw,3.08rem)] leading-[1]">
              {c.ingredients.titleA} <br className="hidden sm:block" /><span className="text-bien-citrus">{c.ingredients.titleB}</span>
            </h2>
          </div>
          <IngredientsCarousel lang={lang} />
        </div>
      </section>

      {/* 10. Diagnostic block */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="bg-bien-gold rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16 text-black">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">{c.diagBlock.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.76rem,4.4vw,3.52rem)] leading-[1]">{c.diagBlock.title}</h2>
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
      <section id="mission" className="reveal px-4 sm:px-6 lg:px-12 xl:px-16 mt-10 sm:mt-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[710px] bien-shadow lg:sticky lg:top-28">
            <Image src="/athletes-bien-health.jpg" alt={lang === "en" ? "BIEN health, natural supplements made in France" : "BIEN health, compléments naturels fabriqués en France"} fill loading="lazy" sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.mission.eyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-[clamp(1.76rem,3.96vw,3.08rem)] leading-[1] text-black">{accentLastWord(c.mission.title)}</h2>
            {/* Texte justifié avec césure : le drapeau à droite laissait des
                bords très irréguliers sur mobile (demande client). */}
            <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed text-justify hyphens-auto">
              {c.mission.p1}
            </p>
            <p className="mt-4 text-base text-black/75 leading-relaxed text-justify hyphens-auto">
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
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{c.faq.eyebrow}</p>
            <h3 className="mt-3 font-display tracking-tighter text-[clamp(1.54rem,3.52vw,2.42rem)] leading-[1.05] text-black">{accentLastWord(c.faq.title)}</h3>
            <p className="mt-3 text-black/70">{c.faq.sub}</p>
          </div>
          {/* Quatre questions visibles, le reste replié derrière « voir plus » :
              la liste complète allongeait beaucoup le bas de l'accueil,
              surtout sur mobile (demande client). Tout reste dans le DOM,
              donc indexable. */}
          <div className="mt-8 space-y-3">
            {c.faq.items.slice(0, 4).map(({ q, a }) => (
              <details key={q} className="group bg-card rounded-2xl ring-1 ring-border bien-shadow-sm px-5 sm:px-6 open:ring-bien-leaf/40 transition-all">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4 sm:py-5 font-display text-base sm:text-lg text-black">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 -mt-0.5 text-sm sm:text-base text-black/75 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          {c.faq.items.length > 4 && (
            <details className="group mt-3">
              <summary className="flex items-center justify-center gap-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-3 text-sm font-bold text-bien-leaf hover:underline">
                <span className="group-open:hidden">{c.faq.seeMore}</span>
                <span className="hidden group-open:inline">{c.faq.seeLess}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-3 space-y-3">
                {c.faq.items.slice(4).map(({ q, a }) => (
                  <details key={q} className="group/item bg-card rounded-2xl ring-1 ring-border bien-shadow-sm px-5 sm:px-6 open:ring-bien-leaf/40 transition-all">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4 sm:py-5 font-display text-base sm:text-lg text-black">
                      {q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open/item:rotate-180" />
                    </summary>
                    <p className="pb-5 -mt-0.5 text-sm sm:text-base text-black/75 leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </details>
          )}
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

      {/* 13. Mobile sticky CTA — la marge basse suit la zone sûre du téléphone,
             sinon la barre d'adresse d'iOS recouvre le bouton. */}
      <a href={`/${lang}/boutique`} className="sm:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-6 py-4 text-base font-bold bien-shadow">
        <ShoppingBag className="h-4 w-4" /> {c.mobileCta}
      </a>
    </div>
  );
}
