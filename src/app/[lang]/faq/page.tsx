import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import ReassuranceBand from "@/components/reassurance-band";
import JsonLd from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en"
    ? { title: "FAQ — Your questions about BIEN", description: "All the answers about MushGlow, our gummies (CALM, FOCUS, POWER), shipping, returns and how to use BIEN supplements." }
    : { title: "FAQ — Vos questions sur BIEN", description: "Toutes les réponses sur MushGlow, nos gummies (CALM, FOCUS, POWER), la livraison, les retours et l'utilisation des compléments BIEN." };
}

type QA = { q: string; a: string };
type Section = { title: string; items: QA[] };

const T = {
  fr: {
    eyebrow: "Aide & questions", h1: "Questions fréquentes.",
    introPre: "Tout ce qu'il faut savoir sur nos produits, leur utilisation, la livraison et les retours. Une autre question ? Écrivez-nous à ",
    ctaTitle: "Vous ne savez pas quel produit choisir ?", ctaText: "Faites le diagnostic en moins d'une minute.", cta: "Faire le diagnostic",
  },
  en: {
    eyebrow: "Help & questions", h1: "Frequently asked questions.",
    introPre: "Everything you need to know about our products, how to use them, shipping and returns. Another question? Email us at ",
    ctaTitle: "Not sure which product to choose?", ctaText: "Take the quiz in under a minute.", cta: "Take the quiz",
  },
} as const;

const SECTIONS_FR: Section[] = [
  {
    title: "MushGlow",
    items: [
      { q: "Qu'est-ce que MushGlow ?", a: "MushGlow est une poudre adaptogène premium formulée pour soutenir la clarté mentale, booster l'énergie naturelle, améliorer la gestion du stress et révéler l'éclat de la peau — grâce à des champignons fonctionnels, des adaptogènes et du collagène de membrane d'œuf." },
      { q: "Comment utiliser MushGlow ?", a: "Ajoutez simplement une cuillère (incluse) à la boisson de votre choix, chaude ou froide : café, matcha, smoothie… Mélangez bien, ou utilisez un mousseur pour une texture ultra-lisse." },
      { q: "Quel goût a MushGlow ?", a: "MushGlow a une subtile touche terreuse provenant des champignons et des adaptogènes, et reste neutre dans les boissons aromatisées. Nous ne le recommandons pas avec de l'eau seule." },
      { q: "Quand dois-je prendre MushGlow ?", a: "À chaque fois que vous avez besoin de concentration, d'énergie, de résistance au stress et d'une peau éclatante. La plupart des gens le préfèrent le matin." },
      { q: "Quels sont les ingrédients de MushGlow ?", a: "Lion's Mane 750 mg (fonction cognitive), Cordyceps 500 mg (énergie, endurance), Chaga 500 mg (antioxydants), L-Théanine 200 mg (concentration), Maca 750 mg (hormones, humeur) et Collagène 450 mg (hydratation de la peau)." },
      { q: "Quels sont les bienfaits de MushGlow ?", a: "MushGlow est conçu pour vous aider à rester productif, concentré et résilient au stress, tout en favorisant une peau radieuse : clarté mentale, énergie soutenue, réduction du stress, peau hydratée, cheveux et ongles plus forts." },
      { q: "Puis-je prendre MushGlow si je suis enceinte ?", a: "Consultez un médecin avant utilisation pendant la grossesse ou l'allaitement, afin de vous assurer de sa compatibilité avec vos besoins individuels." },
      { q: "MushGlow contient-il de la caféine ?", a: "Non, MushGlow est sans caféine. Il se marie bien avec un café ou un matcha, mais reste tout à fait compatible avec un smoothie." },
      { q: "MushGlow convient-il aux végans ?", a: "MushGlow contient du collagène dérivé de la membrane de la coquille d'œuf : il est végétarien, mais pas vegan." },
      { q: "MushGlow est-il sans gluten et sans lactose ?", a: "Oui ! MushGlow est sans gluten, sans produits laitiers et fabriqué à partir d'ingrédients naturels." },
      { q: "Puis-je prendre MushGlow tous les jours ?", a: "Oui ! MushGlow est conçu pour un usage quotidien. Les adaptogènes fonctionnent d'ailleurs mieux lorsqu'ils sont pris régulièrement." },
      { q: "Combien de portions contient MushGlow ?", a: "Chaque paquet contient 30 portions, soit de quoi couvrir un mois d'utilisation quotidienne." },
    ],
  },
  {
    title: "Gummies (CALM, FOCUS, POWER)",
    items: [
      { q: "Pourquoi des gummies ?", a: "La forme n'est pas seulement plus savoureuse, elle est aussi plus efficace. Absorbées en partie dans la bouche, les gummies agissent environ 30 % plus vite que les pilules. Et 80 % des personnes terminent une cure sous forme de gommes, contre seulement 50 % pour les pilules." },
      { q: "Quel gummy me convient le mieux ?", a: "FOCUS (Lion's Mane + Rhodiola + L-Théanine) pour la concentration et la mémoire. POWER (Cordyceps + Rhodiola + Panax Ginseng) pour l'énergie et l'endurance. CALM (Reishi + Ashwagandha + Safran) pour le stress et le sommeil." },
      { q: "Où sont fabriqués nos gummies ?", a: "Fabriqués en France, nos gummies sont sans sucre, sans gluten, végétaliens et sans ingrédients artificiels, selon des normes de qualité élevées." },
      { q: "Où dois-je conserver mes gummies ?", a: "Conservez vos gummies dans un endroit frais et sec, à l'abri de la lumière directe du soleil, de la chaleur et de l'humidité. Aucune réfrigération n'est nécessaire." },
      { q: "Que sont les champignons adaptogènes ?", a: "Les champignons adaptogènes sont une catégorie de champignons fonctionnels connus pour leur capacité à soutenir la résilience du corps face au stress, et à améliorer la fonction cognitive et le bien-être général." },
      { q: "Quand dois-je prendre mes gummies ?", a: "FOCUS : 2 gummies le matin pour la concentration. POWER : 2 gummies le matin pour l'énergie. CALM : 2 gummies le matin ou le soir pour la relaxation." },
      { q: "Puis-je prendre des gummies si je suis enceinte ?", a: "Consultez votre médecin avant toute utilisation pendant la grossesse ou l'allaitement." },
      { q: "Nos gummies sont-ils végans ?", a: "Oui ! Nos gummies sont 100 % vegan, à base d'ingrédients végétaux, sans gélatine ni produits laitiers." },
      { q: "Nos gummies sont-ils sans sucre ?", a: "Oui ! Nos gummies sont entièrement sans sucre." },
      { q: "Nos gummies sont-ils sans gluten ?", a: "Oui ! Nos gummies sont 100 % sans gluten, grâce à une sélection soigneuse des ingrédients." },
    ],
  },
  {
    title: "Livraison, retours & suivi",
    items: [
      { q: "Offrez-vous la livraison gratuite ?", a: "Livraison offerte en Point Relais dès 69 € d'achat, expédiée le jour même pour toute commande passée avant 13h.\n\nFrance : Point Relais 4 € (3 à 5 jours), Standard à domicile 5,90 € (2 à 4 jours), Express 11,50 € (1 à 2 jours). Europe : les tarifs sont affichés à l'étape de paiement." },
      { q: "Retours et remboursements", a: "Vous disposez d'un droit de rétractation de 14 jours après réception, pour les produits inutilisés et non ouverts. Contactez notre service client à info@bien.health avec votre numéro de commande pour initier un retour. Le remboursement intervient sous 7 à 10 jours ouvrables. Les frais de port de retour sont à la charge du client, sauf erreur de notre part. Pour un produit endommagé, contactez-nous sous 3 jours." },
      { q: "Livraison discrète", a: "Vos commandes sont expédiées dans une boîte simple et sans marque, afin de minimiser tout risque de vol et de préserver votre confidentialité." },
      { q: "Où puis-je suivre ma commande ?", a: "Après avoir passé commande, vous recevez des mises à jour par e-mail en temps réel à chaque étape de l'expédition." },
    ],
  },
];

const SECTIONS_EN: Section[] = [
  {
    title: "MushGlow",
    items: [
      { q: "What is MushGlow?", a: "MushGlow is a premium adaptogenic powder formulated to support mental clarity, boost natural energy, improve stress management and reveal radiant skin — thanks to functional mushrooms, adaptogens and eggshell-membrane collagen." },
      { q: "How do I use MushGlow?", a: "Simply add one spoon (included) to the drink of your choice, hot or cold: coffee, matcha, smoothie… Stir well, or use a frother for an ultra-smooth texture." },
      { q: "What does MushGlow taste like?", a: "MushGlow has a subtle earthy note from the mushrooms and adaptogens, and stays neutral in flavoured drinks. We don't recommend it with plain water." },
      { q: "When should I take MushGlow?", a: "Whenever you need focus, energy, stress resilience and glowing skin. Most people prefer it in the morning." },
      { q: "What are the ingredients in MushGlow?", a: "Lion's Mane 750 mg (cognitive function), Cordyceps 500 mg (energy, stamina), Chaga 500 mg (antioxidants), L-Theanine 200 mg (focus), Maca 750 mg (hormones, mood) and Collagen 450 mg (skin hydration)." },
      { q: "What are the benefits of MushGlow?", a: "MushGlow is designed to help you stay productive, focused and stress-resilient, while supporting radiant skin: mental clarity, sustained energy, reduced stress, hydrated skin, stronger hair and nails." },
      { q: "Can I take MushGlow if I'm pregnant?", a: "Consult a doctor before use during pregnancy or breastfeeding, to ensure it's compatible with your individual needs." },
      { q: "Does MushGlow contain caffeine?", a: "No, MushGlow is caffeine-free. It pairs well with a coffee or matcha, but is perfectly fine in a smoothie too." },
      { q: "Is MushGlow suitable for vegans?", a: "MushGlow contains collagen derived from eggshell membrane: it is vegetarian, but not vegan." },
      { q: "Is MushGlow gluten-free and lactose-free?", a: "Yes! MushGlow is gluten-free, dairy-free and made from natural ingredients." },
      { q: "Can I take MushGlow every day?", a: "Yes! MushGlow is designed for daily use. Adaptogens actually work best when taken regularly." },
      { q: "How many servings does MushGlow contain?", a: "Each pack contains 30 servings — enough for a month of daily use." },
    ],
  },
  {
    title: "Gummies (CALM, FOCUS, POWER)",
    items: [
      { q: "Why gummies?", a: "The format isn't just tastier, it's also more effective. Partly absorbed in the mouth, gummies act about 30% faster than pills. And 80% of people finish a course in gummy form, versus only 50% for pills." },
      { q: "Which gummy is right for me?", a: "FOCUS (Lion's Mane + Rhodiola + L-Theanine) for focus and memory. POWER (Cordyceps + Rhodiola + Panax Ginseng) for energy and stamina. CALM (Reishi + Ashwagandha + Saffron) for stress and sleep." },
      { q: "Where are our gummies made?", a: "Made in France, our gummies are sugar-free, gluten-free, vegan and free from artificial ingredients, to high quality standards." },
      { q: "Where should I store my gummies?", a: "Keep your gummies in a cool, dry place, away from direct sunlight, heat and humidity. No refrigeration needed." },
      { q: "What are adaptogenic mushrooms?", a: "Adaptogenic mushrooms are a category of functional mushrooms known for their ability to support the body's resilience to stress, and to improve cognitive function and overall wellbeing." },
      { q: "When should I take my gummies?", a: "FOCUS: 2 gummies in the morning for focus. POWER: 2 gummies in the morning for energy. CALM: 2 gummies in the morning or evening for relaxation." },
      { q: "Can I take gummies if I'm pregnant?", a: "Consult your doctor before any use during pregnancy or breastfeeding." },
      { q: "Are our gummies vegan?", a: "Yes! Our gummies are 100% vegan, plant-based, with no gelatine or dairy." },
      { q: "Are our gummies sugar-free?", a: "Yes! Our gummies are entirely sugar-free." },
      { q: "Are our gummies gluten-free?", a: "Yes! Our gummies are 100% gluten-free, thanks to careful ingredient selection." },
    ],
  },
  {
    title: "Shipping, returns & tracking",
    items: [
      { q: "Do you offer free shipping?", a: "Free Point Relais delivery on orders over €69, shipped the same day for orders placed before 1 pm.\n\nFrance: Point Relais €4 (3 to 5 days), Standard home €5.90 (2 to 4 days), Express €11.50 (1 to 2 days). Europe: rates are shown at checkout." },
      { q: "Returns and refunds", a: "You have a 14-day right of withdrawal after receipt, for unused and unopened products. Contact our customer service at info@bien.health with your order number to start a return. Refunds are processed within 7 to 10 business days. Return shipping costs are the customer's responsibility, except in the event of our error. For a damaged product, contact us within 3 days." },
      { q: "Discreet delivery", a: "Your orders are shipped in a plain, unbranded box, to minimise any risk of theft and protect your privacy." },
      { q: "Where can I track my order?", a: "After placing your order, you'll receive real-time email updates at every stage of shipping." },
    ],
  },
];

const getSections = (lang: string) => (lang === "en" ? SECTIONS_EN : SECTIONS_FR);

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];
  const SECTIONS = getSections(lang);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SECTIONS.flatMap((s) =>
            s.items.map((qa) => ({
              "@type": "Question",
              name: qa.q,
              acceptedAnswer: { "@type": "Answer", text: qa.a },
            })),
          ),
        }}
      />


      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-16 text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">
          <HelpCircle className="h-4 w-4" /> {t.eyebrow}
        </p>
        <h1 className="mt-3 font-hero text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-black">
          {t.h1}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-black/70 leading-relaxed">
          {t.introPre}<a href="mailto:info@bien.health" className="text-bien-leaf underline">info@bien.health</a>.
        </p>
      </section>

      {/* Sections FAQ — pleine largeur, 3 colonnes */}
      <div className="px-4 sm:px-6 lg:px-[100px] mt-12 sm:mt-16 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display tracking-tight text-2xl text-black mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-start">
              {section.items.map((qa) => (
                <details key={qa.q} className="group bg-card rounded-2xl ring-1 ring-border bien-shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4">
                    <span className="font-display text-black">{qa.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 -mt-0.5 text-sm sm:text-[15px] text-black/75 leading-relaxed whitespace-pre-line">{qa.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA diagnostic */}
        <div className="rounded-3xl bg-bien-cream p-8 sm:p-10 text-center">
          <h2 className="font-display tracking-tighter text-2xl sm:text-3xl text-black">{t.ctaTitle}</h2>
          <p className="mt-2 text-black/70">{t.ctaText}</p>
          <Link href={`/${lang}/diagnostic`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-7 py-3.5 font-bold hover:bg-bien-leaf transition-colors bien-shadow-sm">
            {t.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ReassuranceBand lang={lang} />
    </div>
  );
}
