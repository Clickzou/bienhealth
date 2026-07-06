import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "./dictionaries";
import { getProducts, formatPrice } from "@/lib/shopify-products";
import IngredientsCarousel from "@/components/ingredients-carousel";
import RevealController from "@/components/reveal-controller";
import Typewriter from "@/components/typewriter";
import TrustpilotWidget, { TRUSTPILOT_URL } from "@/components/trustpilot";
import ProductsCarousel from "@/components/products-carousel";
import SiteHeader from "@/components/site-header";

const TP_BUSINESS_UNIT_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESSUNIT_ID;
const TP_TEMPLATE_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_ID;
import {
  Star, Truck, ShieldCheck, MapPin, RefreshCw, Moon, Brain, Zap,
  Sparkles, ShoppingBag, Check, ArrowRight, ArrowUpRight, Leaf, HeartPulse,
  ChevronDown,
} from "lucide-react";

const FAQ = [
  {
    q: "Vos produits sont-ils déclarés et conformes à la réglementation ?",
    a: "Oui. Chaque complément BIEN fait l'objet d'une déclaration officielle auprès de la DGAL (Ministère de l'Agriculture), enregistrée sur la plateforme COMPL'ALIM avec un numéro vérifiable publiquement. Vous retrouvez toutes les attestations sur notre page Conformité & certifications.",
  },
  {
    q: "Où sont fabriqués vos compléments ?",
    a: "Nos produits sont formulés et fabriqués en France, avec des contrôles qualité à chaque étape de production.",
  },
  {
    q: "Les dosages sont-ils transparents ?",
    a: "Absolument. Nous communiquons la composition complète et les dosages exacts (par dose journalière recommandée) de chaque actif — plantes adaptogènes, champignons fonctionnels et substances — directement sur nos attestations et fiches produit.",
  },
  {
    q: "Vos gummies sont-ils vegan, sans sucre et sans gluten ?",
    a: "Oui. Nos 3 gummies sont vegan, sans sucre ni colorants artificiels, sans gluten, et riches en fibres prébiotiques pour soutenir l'équilibre du microbiote. La poudre MUSHGLOW est 100 % naturelle et tout-en-un.",
  },
  {
    q: "Au bout de combien de temps ressent-on les effets ?",
    a: "Cela varie selon les personnes et le produit. Beaucoup ressentent les premiers effets dès la première semaine, mais nous recommandons une cure de 6 semaines pour bénéficier de tous les effets des adaptogènes, suivie d'une pause avant de recommencer.",
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: "Les compléments alimentaires ne se substituent pas à une alimentation variée et équilibrée. En cas de grossesse, d'allaitement, de traitement médical ou de doute, demandez conseil à un professionnel de santé avant toute cure. Ne pas dépasser la dose journalière recommandée.",
  },
  {
    q: "Livraison et satisfaction : quelles garanties ?",
    a: "Livraison offerte dès 49 € et paiement 100 % sécurisé. Nos produits sont satisfait ou remboursé sous 30 jours.",
  },
];
import type { ComponentType } from "react";

/** Page d'accueil BIEN — design porté de la maquette Lovable validée. */

const PRESS = [
  { name: "Doit in Paris", href: "https://www.doitinparis.com/fr/boissons-detox-paris-27378" },
  { name: "Gala", href: "https://www.moncarnet-gala.fr/articles/view/BIEN" },
  { name: "BIBA", href: "https://www.bibamagazine.fr/lifestyle/sante/adieu-le-cafe-cette-boisson-naturelle-a-base-de-champignons-est-le-secret-pour-se-reveiller-sans-doper-son-cortisol-498845.html" },
  { name: "L'Officiel", href: "https://www.lofficiel.com/beaute/10-produits-de-beaute-a-acheter-en-janvier-2026" },
  { name: "Beauté test", href: "https://www.beaute-test.com/mag/jai-teste-pour-vous-ces-gummies-anti-stress-sans-melatonine-qui-apaisent-vraiment.php" },
  { name: "Snake Twist", href: "https://www.instagram.com/p/DUIVTzWjQAn/?igsh=MTU0dXNnZ2hnOTJ6cg%3D%3D" },
];

const RITUALS = [
  { title: "Sérénité & Sommeil", desc: "Apaiser le mental, retrouver un sommeil profond.", icon: Moon, tint: "bg-bien-leaf/15 text-bien-leaf" },
  { title: "Concentration & Clarté mentale", desc: "Soutenir la mémoire et la focus quotidienne.", icon: Brain, tint: "bg-bien-gold/20 text-[oklch(0.55_0.13_75)]" },
  { title: "Énergie & Performance", desc: "Endurance physique et tonus durable.", icon: Zap, tint: "bg-bien-forest/10 text-black" },
  { title: "Beauté & équilibre", desc: "Peau, cheveux, équilibre hormonal naturel.", icon: Sparkles, tint: "bg-bien-sage/20 text-bien-sage" },
];

// Avis réels Trustpilot (fr.trustpilot.com/review/bien.health)
const REVIEWS = [
  { text: "Bluffée alors que j'y croyais pas. Dès la première prise, j'ai enchaîné une semaine intense de travail créatif en étant hyper focus, lucide, sans m'éparpiller et sans stress.", name: "Elvirash", date: "26 sept. 2024" },
  { text: "Nette amélioration de ma concentration et de ma clarté mentale, plus une vraie sensation de calme et de bien-être. Naturel, je recommande vivement.", name: "Carla", date: "5 nov. 2024" },
  { text: "Mon stress a largement diminué, m'aidant à dormir et à retrouver un quotidien apaisé. L'accompagnement de l'équipe BIEN a été parfait. Je recommande les yeux fermés !", name: "Lucie Nocerino", date: "20 sept. 2024" },
  { text: "Des produits de qualité et faciles à prendre. Après 4 prises, je sens petit à petit les effets bénéfiques concrets.", name: "Romain Guichard", date: "24 nov. 2024" },
  { text: "J'utilise le micro-dosing depuis 14 jours et j'ai ressenti dès la première semaine les avantages : bien plus focus et organisé dans mes réflexions.", name: "Grégoire Proux", date: "5 sept. 2024" },
  { text: "100% satisfaite pour la productivité.", name: "Victoria Faur", date: "11 juin 2025" },
];

const PRODUCTS = [
  { name: "CALM", tagline: "Sommeil & Sérénité", price: "39 €", img: "/brand/product-calm.jpg" },
  { name: "FOCUS", tagline: "Clarté mentale", price: "39 €", img: "/brand/product-focus.jpg" },
  { name: "POWER", tagline: "Énergie durable", price: "39 €", img: "/brand/product-power.jpg" },
  { name: "MUSHGLOW", tagline: "Peau & Éclat", price: "49 €", img: "/brand/product-mushglow.jpg" },
];

const REASSURANCE = [
  { icon: Truck, label: "Livraison offerte dès 49 €" },
  { icon: ShieldCheck, label: "Paiement sécurisé" },
  { icon: MapPin, label: "Fabriqué en France" },
  { icon: RefreshCw, label: "Satisfait ou remboursé 30 j" },
];

/** Affiche une note sur 5 avec demi-étoiles (ex. 4,4 → ~4,5 étoiles). */
function StarRating({ value, className = "h-5 w-5" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex align-middle" aria-label={`${value} sur 5`}>
      <span className="flex text-bien-gold/25">
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current`} />)}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="inline-flex text-bien-gold">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current shrink-0`} />)}
        </span>
      </span>
    </span>
  );
}

function Bubble({ item, side, note, anim, delay = 0 }: {
  item: { title: string; desc: string; icon: ComponentType<{ className?: string }> };
  side: "left" | "right";
  note: number;
  anim: "left" | "right" | "up" | "down";
  delay?: number;
}) {
  const Icon = item.icon;
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative z-10 w-full max-w-[23rem] reveal-dir reveal-from-${anim} ${side === "left" ? "lg:mr-auto" : "lg:ml-auto"}`}
    >
      <a href="#produits" className="block bg-card rounded-[1.75rem] p-7 text-center ring-1 ring-border bien-shadow hover:-translate-y-1.5 hover:ring-bien-gold/60 transition-all">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-leaf text-bien-cream group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <Icon className="h-8 w-8" />
        </span>
        <h3 className="mt-4 font-display font-black text-xl text-black leading-tight">
          {item.title}<sup className="text-bien-leaf text-xs ml-0.5">{note}</sup>
        </h3>
        <p className="mt-2 text-sm text-black/70 leading-relaxed">{item.desc}</p>
      </a>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Vrais produits Shopify (repli sur la démo tant que le token n'est pas configuré)
  // On exclut les accessoires (mousseur, tote bag) pour ne garder que les compléments.
  const EXCLUDE_HANDLES = new Set(["mousseur-a-lait", "bien-totebag"]);
  const shopProducts = (await getProducts(12)).filter((p) => !EXCLUDE_HANDLES.has(p.handle));
  const products = shopProducts.length
    ? shopProducts.map((p) => ({
        name: p.title,
        tagline: p.tags[0] ?? "Complément naturel",
        price: formatPrice(p.price),
        img: p.featuredImage?.url ?? "/brand/product-mushglow.jpg",
        handle: p.handle as string | null,
        available: p.available,
      }))
    : PRODUCTS.map((p) => ({ ...p, handle: null as string | null, available: true }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RevealController />
      <SiteHeader lang={lang} />

      {/* 3. HERO */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-10">
        <div className="relative hero-gradient rounded-3xl lg:rounded-[2.75rem] overflow-hidden bien-shadow">
          <div className="grid lg:grid-cols-2 items-stretch">
            <div className="anim-up text-bien-cream p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-start gap-2 rounded-2xl bg-bien-cream/10 backdrop-blur px-4 py-2.5 text-xs sm:text-sm text-bien-cream/90 ring-1 ring-bien-cream/20 max-w-md">
                <Leaf className="h-4 w-4 shrink-0 mt-0.5 text-bien-gold" />
                <span className="leading-snug">Adaptogènes et champignons fonctionnels, dosés selon la science. Formulés et fabriqués en France pour soutenir votre quotidien.</span>
              </div>
              <h1 className="mt-5 font-display font-black tracking-tighter leading-[0.95] text-[clamp(2.5rem,7vw,5.25rem)]">
                Le bien-être,<br /><span className="text-bien-gold">naturellement.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-bien-cream/90 max-w-xl leading-relaxed">
                BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est d&apos;accompagner les athlètes de la vie à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental, troubles de la mémoire, manque d&apos;énergie.
              </p>
              <p className="mt-3 text-sm sm:text-base text-bien-cream/70 max-w-xl leading-relaxed">
                Née du parcours d&apos;une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                <a href="#produits" className="inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-7 py-4 text-base font-semibold hover:brightness-95 transition bien-shadow-sm">
                  Découvrir nos produits <ArrowRight className="h-4 w-4" />
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-bien-cream/85"><Check className="h-4 w-4 text-bien-gold" /> Satisfait ou remboursé 30 jours</span>
                <span className="inline-flex items-center gap-2 text-sm text-bien-cream/85"><Check className="h-4 w-4 text-bien-gold" /> Marque française</span>
              </div>
            </div>
            <div className="anim-up anim-delay-1 relative h-72 sm:h-96 lg:h-auto lg:min-h-[920px]">
              <Image src="/brand/bien-health.png" alt="Produits BIEN — compléments naturels" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              {/* Carte points clés flottante par-dessus la photo */}
              <div className="absolute bottom-20 left-4 right-4 sm:bottom-24 sm:left-6 sm:right-6 lg:bottom-28">
                <div className="rounded-2xl bg-card/90 backdrop-blur-md ring-1 ring-bien-cream/40 bien-shadow px-4 py-3.5 sm:px-5 sm:py-4">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                    {[
                      "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
                      "Vegan, sans sucre ni colorants, sans gluten — fabriqué en France",
                      "Riches en fibres prébiotiques pour le microbiote",
                      "Adaptogènes & champignons, dosages transparents",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-black font-medium">
                        <span className="mt-0.5 shrink-0 grid place-items-center h-4 w-4 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-2.5 w-2.5" /></span>
                        <span className="leading-snug">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Reassurance card (overlapping) */}
        <div className="relative -mt-8 sm:-mt-10 lg:-mt-14 mx-2 sm:mx-6 lg:mx-12 bg-card rounded-3xl bien-shadow p-5 sm:p-7">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {REASSURANCE.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 grid place-items-center h-11 w-11 rounded-full bg-bien-leaf/15 text-bien-leaf"><Icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-black leading-tight">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Press */}
      <section id="presse" className="reveal px-4 sm:px-6 lg:px-[100px] pt-16 sm:pt-20 scroll-mt-24">
        {/* Certifications de confiance — remplacer par les logos officiels (PNG/SVG) quand dispo */}
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
            <span className="text-[13px] font-semibold text-black">Avis Vérifiés</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/55">Certifié</span>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Voir tous nos avis sur Trustpilot"
            className="group inline-flex items-center gap-3 sm:gap-4 rounded-full bg-card ring-1 ring-border bien-shadow px-5 sm:px-7 py-3 hover:ring-bien-gold/60 hover:-translate-y-0.5 transition-all"
          >
            <StarRating value={4.4} className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-display font-black text-xl sm:text-2xl text-black leading-none">4,4/5</span>
            <span className="h-5 w-px bg-border" />
            <span className="text-sm sm:text-base text-black/65"><span className="font-semibold text-black">+100</span> avis</span>
            <ArrowUpRight className="h-4 w-4 text-bien-leaf opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>
        <p className="mt-10 mb-[30px] text-center text-xs uppercase tracking-[0.2em] text-bien-sage font-semibold">
          <Typewriter text="Ils parlent de nous" />
        </p>
        <p className="text-center text-[13px] font-bold text-black/60">Cliquez sur un média pour lire l&apos;article ↗</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {PRESS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Lire l'article — ${p.name}`}
              className="group inline-flex items-center gap-1.5 font-display font-black text-3xl sm:text-4xl text-black hover:text-bien-leaf transition-colors tracking-tight underline-offset-[8px] decoration-2 decoration-bien-gold hover:underline"
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
            Conformité &amp; transparence
            <ArrowRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
          </a>
        </div>
      </section>

      {/* 6. Bénéfices — bulles reliées à l'image centrale */}
      <section id="diagnostic" className="reveal bg-bien-cream mt-20 sm:mt-28 px-4 sm:px-6 lg:px-[200px] py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">Soutenez votre bien-être</p>
          <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">Une réponse pour chaque besoin.</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70">
            Des actifs dosés selon la science, pour cibler ce qui compte vraiment.
          </p>
        </div>

        <div className="mt-16 relative grid lg:grid-cols-[1fr_minmax(360px,560px)_1fr] gap-y-14 lg:gap-x-8 items-center">
          {/* Anneau pointillé décoratif : relie les 4 bulles et passe derrière la photo */}
          <svg
            aria-hidden
            viewBox="0 0 1000 680"
            preserveAspectRatio="xMidYMid meet"
            className="hidden lg:block absolute inset-0 m-auto w-full max-w-[1180px] h-auto text-bien-leaf/45 pointer-events-none z-0"
            fill="none"
          >
            <ellipse cx="500" cy="340" rx="478" ry="300" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 11" strokeLinecap="round" />
            {[
              [118, 168], [882, 168], [118, 512], [882, 512],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" fill="currentColor" className="text-bien-leaf" />
            ))}
          </svg>

          {/* Colonne gauche */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start gap-y-16">
            <Bubble item={RITUALS[0]} side="left" note={1} anim="left" delay={0} />
            <Bubble item={RITUALS[1]} side="left" note={2} anim="down" delay={150} />
          </div>

          {/* Image centrale */}
          <div className="order-1 lg:order-2 relative z-10 aspect-[3/4] w-full max-w-[34rem] mx-auto rounded-[2.25rem] overflow-hidden bien-shadow ring-4 ring-background">
            <Image src="/brand/produit-benefices.png" alt="Produits BIEN — bénéfices" fill sizes="(max-width:1024px) 80vw, 360px" className="object-cover" />
          </div>

          {/* Colonne droite */}
          <div className="order-3 flex flex-col items-center lg:items-end gap-y-16">
            <Bubble item={RITUALS[2]} side="right" note={3} anim="right" delay={300} />
            <Bubble item={RITUALS[3]} side="right" note={4} anim="up" delay={450} />
          </div>
        </div>

        <div className="mt-14 text-center max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">Diagnostic</p>
          <p className="mt-3 text-lg text-black/80 leading-relaxed">
            En 30 secondes, découvrez le produit BIEN qui répond vraiment à votre problématique.
          </p>
          <a href={`/${lang}/diagnostic`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm">
            Faire le test <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 7. Reviews */}
      <section id="avis" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-cream rounded-3xl lg:rounded-[2.5rem] p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left lg:border-r lg:border-bien-forest/10 lg:pr-12 shrink-0">
              <div className="font-display font-black text-7xl lg:text-8xl text-black leading-none">4,4</div>
              <div className="mt-3 flex items-center justify-center lg:justify-start">
                <StarRating value={4.4} className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm text-black/70">Basé sur <span className="font-semibold">+100 avis Trustpilot</span></p>
              <a
                href={TRUSTPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Voir tous nos avis sur Trustpilot"
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
              {REVIEWS.map((r) => (
                <article key={r.name} className="bg-card rounded-2xl p-5 bien-shadow-sm flex flex-col">
                  <div className="flex gap-1">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-bien-gold text-bien-gold" />)}</div>
                  <p className="mt-3 text-sm text-black/85 leading-relaxed flex-1">« {r.text} »</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span><span className="font-semibold text-black">{r.name}</span><span className="ml-2 text-black/45">{r.date}</span></span>
                    <span className="inline-flex items-center gap-1 text-bien-leaf"><Check className="h-3 w-3" /> Vérifié</span>
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
              Voir tous nos avis sur Trustpilot
              <ArrowUpRight className="h-4 w-4 -translate-x-0.5 group-hover:translate-x-0 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 8. Ingredients */}
      <section id="ingredients" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-forest text-bien-cream rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-gold font-semibold">Ingrédients nobles</p>
            <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1]">
              La force du vivant, <br className="hidden sm:block" /><span className="text-bien-gold">dosée par la science.</span>
            </h2>
          </div>
          <IngredientsCarousel />
        </div>
      </section>

      {/* 9. Best-sellers */}
      <section id="produits" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">Best-sellers</p>
            <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">Nos rituels préférés.</h2>
          </div>
          <a href="#" className="text-sm font-semibold text-bien-leaf inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">Voir tous les produits <ArrowRight className="h-4 w-4" /></a>
        </div>
        <ProductsCarousel products={products} lang={lang} />
      </section>

      {/* 10. Diagnostic block */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="bg-bien-gold rounded-3xl lg:rounded-[2.75rem] p-8 sm:p-12 lg:p-16 text-black">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">Diagnostic gratuit · 60 secondes</p>
            <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,5vw,4rem)] leading-[1]">Quel est votre besoin ?</h2>
            <p className="mt-4 text-base sm:text-lg opacity-85 max-w-xl">Répondez à quelques questions et recevez la formule BIEN qui correspond à votre rythme.</p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RITUALS.map(({ title, icon: Icon }) => (
              <a key={title} href={`/${lang}/diagnostic`} className="group bg-bien-forest text-bien-cream rounded-2xl px-5 py-5 text-left hover:bg-bien-leaf transition-colors flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-bien-cream/10 shrink-0"><Icon className="h-5 w-5" /></span>
                <span className="font-display font-black text-base leading-tight">{title}</span>
              </a>
            ))}
          </div>
          <p className="mt-7 text-sm font-semibold inline-flex items-center gap-2 bg-bien-forest text-bien-cream rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-bien-gold" /> −10 % sur votre première commande
          </p>
        </div>
      </section>

      {/* 11. Notre mission */}
      <section id="mission" className="reveal px-4 sm:px-6 lg:px-[100px] mt-20 sm:mt-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[710px] bien-shadow lg:sticky lg:top-28">
            <Image src="/brand/mission-homme.png" alt="BIEN — compléments naturels fabriqués en France" fill loading="lazy" sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">Notre mission</p>
            <h2 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] text-black">Aider les athlètes de la vie à mieux vivre le quotidien.</h2>
            <p className="mt-5 text-base sm:text-lg text-black/75 leading-relaxed">
              BIEN HEALTH est une marque française de compléments alimentaires naturels dont la mission est d&apos;accompagner les athlètes de la vie à mieux vivre les défis du quotidien : stress, sommeil, brouillard mental, troubles de la mémoire, manque d&apos;énergie.
            </p>
            <p className="mt-4 text-base text-black/75 leading-relaxed">
              La marque est née du parcours d&apos;une ancienne sportive de haut niveau, qui a utilisé les plantes adaptogènes et champignons médicinaux (ashwagandha, safran…) pour optimiser sa préparation physique et mentale — avant de créer une marque plus efficace, naturelle et accessible au quotidien.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "4 produits naturels : 3 gummies + 1 poudre tout-en-un",
                "Vegan, sans sucre ni colorants artificiels, sans gluten — fabriqué en France",
                "Riches en fibres prébiotiques pour l'équilibre du microbiote",
                "Plantes adaptogènes & champignons médicinaux, dosages transparents",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-black">
                  <span className="mt-1 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>

            {/* Notre approche — 2 cartes */}
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Leaf,
                  img: "/brand/bien-gamme.png",
                  title: "Une gamme courte et ciblée",
                  text: "4 produits seulement : 3 gummies naturels — sans sucre, sans colorants, vegan, sans gluten, fabriqués en France et riches en fibres prébiotiques ; et une poudre 100 % naturelle tout-en-un.",
                },
                {
                  icon: HeartPulse,
                  img: "/brand/produits-bien-health.png",
                  title: "Une approche globale de la santé",
                  text: "Formules naturelles, qualité des ingrédients, transparence des dosages et vision globale (microbiote, nutrition fonctionnelle). Nos actifs aident l'organisme à mieux se réguler.",
                },
              ].map(({ icon: Icon, img, title, text }) => (
                <article key={title} className="group bg-card rounded-3xl ring-1 ring-border bien-shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={img} alt={title} fill loading="lazy" sizes="(max-width:1024px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="px-5 pb-6 pt-0">
                    <span className="relative -mt-7 grid place-items-center h-14 w-14 rounded-2xl bg-bien-gold text-black ring-4 ring-card shadow">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-4 font-display font-black text-lg text-black leading-tight">{title}</h3>
                    <p className="mt-2 text-sm text-black/75 leading-relaxed">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ — réassurance & conformité */}
        <div className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">FAQ</p>
            <h3 className="mt-3 font-display font-black tracking-tighter text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-black">Vos questions, nos garanties.</h3>
            <p className="mt-3 text-black/70">Transparence, conformité et qualité — tout ce qu&apos;il faut savoir avant de commencer votre cure.</p>
          </div>
          <div className="mt-8 space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group bg-card rounded-2xl ring-1 ring-border bien-shadow-sm px-5 sm:px-6 open:ring-bien-leaf/40 transition-all">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4 sm:py-5 font-display font-black text-base sm:text-lg text-black">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="pb-5 -mt-0.5 text-sm sm:text-base text-black/75 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href={`/${lang}/certifications`} className="inline-flex items-center gap-2 rounded-full bg-bien-leaf text-white px-6 py-3 text-sm font-bold hover:brightness-110 transition">
              <ShieldCheck className="h-4 w-4" /> Voir nos attestations de conformité
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ.map(({ q, a }) => ({
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
      <a href="#produits" className="sm:hidden fixed bottom-4 inset-x-4 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-6 py-4 text-base font-bold bien-shadow">
        <ShoppingBag className="h-4 w-4" /> Découvrir nos produits
      </a>
    </div>
  );
}
