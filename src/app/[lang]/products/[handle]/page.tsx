import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Star, Truck, ShieldCheck, MapPin, ArrowLeft, Leaf,
  Zap, HeartPulse, RefreshCw, ChevronDown, Plus,
} from "lucide-react";
import { hasLocale } from "../../dictionaries";
import { getProduct, getProducts, formatPrice } from "@/lib/shopify-products";
import SiteHeader from "@/components/site-header";
import ProductGallery from "@/components/product-gallery";
import ProductVideo from "@/components/product-video";
import ProductReviews from "@/components/product-reviews";
import ProductStickyBar from "@/components/product-sticky-bar";
import ReviewsSwitch from "@/components/reviews-switch";
import DiagnosticCTA from "@/components/diagnostic-cta";
import AddToCart from "@/components/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Produit introuvable — BIEN" };
  return {
    title: `${product.title} — BIEN`,
    description: product.description.slice(0, 160),
  };
}

/** Presse (magazines) affichée dans la colonne d'achat. */
const PRESS = ["VOGUE", "GLAMOUR", "ELLE", "madame"];

/** Actifs clés par produit (preuve près du titre — reco CRO #3). */
const ACTIVES: Record<string, string[]> = {
  CALM: ["Ashwagandha", "Reishi", "Safran"],
  FOCUS: ["Lion's Mane", "Rhodiola", "L-Théanine"],
  POWER: ["Cordyceps", "Rhodiola", "Panax Ginseng"],
  MUSHGLOW: ["Lion's Mane", "Maca", "Chaga", "Cordyceps", "Collagène", "L-Théanine"],
};

/** Infos clés produit (comme sur la fiche du vrai site) : catégorie + 4 lignes. */
type Highlight = { icon: typeof Leaf; text: string };
type ProductInfo = { category: string; reviews: number; rows: Highlight[] };

const HIGHLIGHTS: Record<string, ProductInfo> = {
  CALM: {
    category: "SÉRÉNITÉ & SOMMEIL 🌙", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Ashwagandha, Reishi et Safran aux doses cliniquement efficaces." },
      { icon: Zap, text: "Favoriser la relaxation, réduire le stress et améliorer la qualité du sommeil." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ni additif, vegan et sans gluten." },
      { icon: RefreshCw, text: "2 gummies à mâcher en soirée, pour apaiser le mental et préparer un sommeil réparateur." },
    ],
  },
  FOCUS: {
    category: "CONCENTRATION & MÉMOIRE 🧠", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Lion's Mane, Rhodiola Rosea et L-Théanine aux doses cliniquement efficaces." },
      { icon: Zap, text: "Soutenir la concentration, la mémoire et la clarté mentale, sans nervosité ni coup de barre." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ni additif, vegan et sans gluten." },
      { icon: RefreshCw, text: "2 gummies à mâcher le matin, pour rester focus et productif toute la journée." },
    ],
  },
  POWER: {
    category: "ÉNERGIE & PERFORMANCE ⚡", reviews: 17,
    rows: [
      { icon: HeartPulse, text: "Des extraits de Cordyceps, Rhodiola Rosea et Panax Ginseng aux doses cliniquement efficaces." },
      { icon: Zap, text: "Soutenir l'énergie naturelle, optimiser les performances physiques et favoriser la résistance à l'effort, sans sensation de nervosité." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ajouté ni additif, pour une vitalité saine et durable." },
      { icon: RefreshCw, text: "2 gummies au fruit de la passion à mâcher le matin, pour démarrer la journée avec plaisir et énergie." },
    ],
  },
  MUSHGLOW: {
    category: "ÉQUILIBRE GLOBAL ✨", reviews: 23,
    rows: [
      { icon: HeartPulse, text: "Lion's Mane, Cordyceps, Chaga, Maca, L-Théanine et Collagène aux doses cliniquement efficaces." },
      { icon: Zap, text: "Favoriser l'énergie, la concentration, la résilience au stress, l'immunité et une peau éclatante." },
      { icon: Leaf, text: "Une formule 100% naturelle, sans sucres, sans gluten, sans lactose, sans additifs, sans caféine et veggie." },
      { icon: RefreshCw, text: "1 cuillère à soupe rase, de préférence le matin, pour un geste complet qui agit sur l'équilibre de l'organisme." },
    ],
  },
};

const DEFAULT_INFO: ProductInfo = {
  category: "BIEN-ÊTRE ✨", reviews: 100,
  rows: [
    { icon: Leaf, text: "Adaptogènes et champignons fonctionnels dosés selon la science." },
    { icon: ShieldCheck, text: "Une formule naturelle et clean, fabriquée en France." },
  ],
};

/** Vidéos produit (récupérées de la fiche Shopify). `at` = instant (s) de la vignette. */
const VIDEOS: Record<string, { url: string; at: number }[]> = {
  MUSHGLOW: [
    { url: "https://bien.health/cdn/shop/videos/c/vp/25228c2d76f04a97b18bfbc129c96f25/25228c2d76f04a97b18bfbc129c96f25.HD-1080p-2.5Mbps-73281772.mp4", at: 21 },
    { url: "https://bien.health/cdn/shop/videos/c/vp/a95feba7ee6445549f7952cd03529b3e/a95feba7ee6445549f7952cd03529b3e.HD-1080p-2.5Mbps-73281769.mp4", at: 10 },
  ],
  CALM: [
    { url: "/videos/calm-1.mp4", at: 3 },
  ],
  FOCUS: [
    { url: "/videos/focus-1.mp4", at: 3 },
    { url: "/videos/focus-2.mp4", at: 3 },
  ],
  POWER: [
    { url: "/videos/power-1.mp4", at: 3 },
  ],
};

const LIVRAISON = `Livraison offerte en point relais dès 69 € d'achat, expédiée le jour même (pour toute commande passée avant 13h).

France 🇫🇷
• Point Relais (3 à 5 jours ouvrés) — 4 €
• Livraison standard à domicile (2 à 4 jours ouvrés) — 5,90 €
• Livraison express à domicile (1 à 2 jours ouvrés) — 11,50 €

Europe 🌍
Les options et tarifs de livraison sont affichés à l'étape de validation de commande.`;

type Accordion = { q: string; a: string };

const MUSHGLOW_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients, Bienfaits et Posologie",
    a: `☕ Le meilleur allié de ton café — un supermix de champignons, adaptogènes et collagène pour booster focus, énergie et glow, en une cuillère par jour.

🌿 Formule clean & puissante — Lion's Mane, Cordyceps, Chaga, Maca, L-Théanine, collagène de membrane d'œuf. Des actifs cliniquement dosés, 100 % naturels.

🚫 Sans sucre. Sans additifs.

📆 Un rituel quotidien, des effets durables — résilience, clarté mentale et peau lumineuse, visibles avec une prise régulière.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `🥄 Goût neutre & ultra-facile à utiliser — se mélange parfaitement dans votre café, matcha, smoothie ou toute autre boisson chaude ou froide. Une touche subtile et naturelle de champignons.`,
  },
  {
    q: "Comment le préparer ?",
    a: `1. Ajoutez simplement 1 dose (cuillère incluse) dans la boisson de votre choix — chaude ou froide.
2. Mélangez.
3. Dégustez.
4. Profitez des effets.

💡 Astuce : utilisez un petit mousseur ou fouet pour une texture ultra-lisse.`,
  },
  {
    q: "Traçabilité et Qualité",
    a: `Formulé sur la base de recherches publiées dans des revues scientifiques internationales 👇

• Lion's Mane : améliore la cognition et l'humeur chez l'adulte sain (Surendran et al., 2025).
• Cordyceps : améliore la tolérance à l'effort et la performance physique (Hirsch et al., 2017).
• Chaga : protège les cellules de la peau du stress oxydatif et inflammatoire (Park et al., 2023).
• Maca : agit sur l'humeur, l'énergie et l'équilibre hormonal (Zhang et al., 2023).
• L-Théanine : réduit efficacement le stress perçu (Moulin et al., 2024).
• Collagène (Ovolux™) : améliore visiblement la peau, les cheveux et les ongles (Ruff et al., 2024).`,
  },
  {
    q: "Ingrédients & Bienfaits",
    a: `Lion's Mane — 750 mg : soutient la mémoire, la concentration et la fonction cognitive.
Cordyceps — 500 mg : booste l'énergie, la vitalité et l'endurance physique.
Chaga — 500 mg : antioxydant puissant, protège les cellules et soutient l'immunité.
L-Théanine — 200 mg : apaise sans endormir, améliore la clarté mentale et le focus.
Maca — 750 mg : équilibre hormonal et bien-être émotionnel, améliore l'humeur.
Collagène — 450 mg : améliore l'hydratation, l'élasticité et l'éclat de la peau.`,
  },
  { q: "Livraison", a: LIVRAISON },
];

const CALM_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients, Bienfaits et Posologie",
    a: `Grâce au Reishi, à l'Ashwagandha et au Safran, CALM aide à relâcher la pression, retrouver de la sérénité et libérer les tensions tout en contribuant à un sommeil réparateur.

CALM s'intègre facilement dans la routine quotidienne, avec 2 gummies par jour à adapter selon le rythme de la journée, en fonction des besoins de votre corps et de ses variations naturelles, pour accompagner les moments de stress ou la préparation au sommeil.

Une utilisation régulière pendant 30 jours permet de constater la différence et de retrouver une sérénité durable au quotidien.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût fruité et gourmand, agréables à mâcher — sans sucre ajouté.`,
  },
  {
    q: "Comment le préparer ?",
    a: `2 gummies par jour, à mâcher. À adapter selon le rythme de votre journée : pour accompagner les moments de stress, ou en préparation au sommeil le soir.`,
  },
  {
    q: "Traçabilité et Qualité",
    a: `REISHI (GANODERMA LUCIDUM)
• Dose : 80 mg par dose journalière
• Concentration : extrait concentré 10:1 (équivalent à 800 mg de champignon sec)
• Procédé d'extraction : extraction hydroalcoolique
• Partie utilisée : corps fructifère de reishi (origine Chine)
• Qualité & pureté : contrôlé (métaux lourds, microbiologie, pesticides, hydrocarbures aromatiques polycycliques, résidus de solvants), non irradié, sans OGM
• Certification & conformité : fabrication conforme aux normes européennes (Eur. Ph., Reg. EU 2023/915), sans BSE/TSE
• Allergènes : vegan, sans allergènes majeurs

ASHWAGANDHA (WITHANIA SOMNIFERA)
• Dose : 80 mg par dose journalière
• Standardisation : ≥ 5 % de withanolides
• Concentration : extrait concentré 18:1 (équivalent à 1 440 mg d'ashwagandha sec)
• Procédé d'extraction : extrait obtenu par extraction à l'eau purifiée et à l'éthanol alimentaire
• Partie utilisée : racine d'ashwagandha (origine Inde)
• Qualité & pureté : contrôlé (métaux lourds, microbiologie, pesticides, résidus de solvants)
• Certification & conformité : fabrication conforme aux normes européennes (Arrêté Plantes Annexe II – France, USP), sans BSE/TSE
• Allergènes : vegan, sans allergènes majeurs

SAFRAN (CROCUS SATIVUS)
• Dose : 16 mg par dose journalière
• Standardisation : ≥ 2 % safranal + ≥ 2 % crocine
• Procédé d'extraction : extraction standardisée UV
• Partie utilisée : fleur de safran (origine Chine)
• Qualité & pureté : contrôlé (métaux lourds, microbiologie, pesticides, PAH), non irradié, sans OGM
• Certification & conformité : fabrication conforme aux normes européennes (Eur. Ph., Reg. EU 2023/915), sans BSE/TSE
• Allergènes : vegan, sans allergènes majeurs`,
  },
  {
    q: "Au bout de combien de temps ressent-on les effets ?",
    a: `Les premiers effets apaisants peuvent se ressentir dès les premiers jours. Pour une sérénité durable et un sommeil de meilleure qualité, une cure régulière de 30 jours minimum est recommandée.`,
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: `Déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical (notamment sédatifs ou anxiolytiques) sans avis médical. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des enfants. Ne se substitue pas à une alimentation variée et équilibrée.`,
  },
  { q: "Livraison", a: LIVRAISON },
];

const FOCUS_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients, Bienfaits et Posologie",
    a: `Grâce au Lion's Mane, au Thé vert riche en L-Théanine et à la Rhodiole, FOCUS soutient les performances intellectuelles, favorise la clarté mentale et aide à retrouver un esprit léger.

FOCUS s'intègre facilement dans la routine quotidienne, avec 2 gummies par jour à adapter selon le rythme de la journée, en fonction de vos besoins d'attention et de concentration : le matin, après le déjeuner ou dans l'après-midi.

Une utilisation régulière pendant 30 jours permet de constater la différence et de profiter d'un esprit plus clair et pleinement concentré au quotidien.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût fruité et gourmand, agréables à mâcher — sans sucre ajouté.`,
  },
  {
    q: "Comment le préparer ?",
    a: `2 gummies par jour, à mâcher. À adapter selon le rythme de votre journée, en fonction de vos besoins d'attention et de concentration : le matin, après le déjeuner ou dans l'après-midi.`,
  },
  {
    q: "Traçabilité et Qualité",
    a: `LION'S MANE (HERICIUM ERINACEUS)
• Dose : 120 mg par dose journalière
• Standardisation : ≥ 30 % de polysaccharides
• Concentration : extrait concentré entre 8:1 et 12:1 (équivalent à environ 1200 mg de champignon sec)
• Procédé d'extraction : extraction aqueuse douce, sans solvants chimiques agressifs
• Partie utilisée : corps fructifère (jeune) de Hericium erinaceus (origine Chine)
• Qualité & pureté : contrôlé (métaux lourds, microbiologie), sans OGM, non irradié
• Certification & conformité : ingrédient certifié biologique, conforme aux réglementations européennes (pesticides, mycotoxines, contaminants), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs

L-THÉANINE (THÉ VERT)
• Dose : 80 mg par dose journalière
• Standardisation : 40 % L-théanine
• Concentration : extrait concentré 25:1
• Procédé d'extraction : extrait de thé vert obtenu par extraction à l'eau purifiée
• Partie utilisée : feuille de Camellia sinensis
• Qualité & pureté : contrôlé (métaux lourds, microbiologie, résidus de solvants), sans OGM, non irradié
• Certification & conformité : fabrication conforme aux normes européennes (GMP, HACCP, ISO 9001, ISO 22000), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs

RHODIOLA ROSEA
• Dose : 30 mg par dose journalière
• Standardisation : 3 % rosavines et 1 % salidroside (standard clinique)
• Procédé d'extraction : eau purifiée et éthanol alimentaire
• Partie utilisée : racine (origine Sibérie, récolte durable)
• Qualité & pureté : identité vérifiée (ADN + profil phytochimique), contrôlé (métaux lourds, pesticides, microbiologie), non irradié, sans OGM
• Certification & conformité : fabrication conforme aux normes européennes (GMP, FSSC 22000), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs`,
  },
  {
    q: "Au bout de combien de temps ressent-on les effets ?",
    a: `Les premiers effets sur la concentration et la clarté mentale peuvent se ressentir au fil des premiers jours. Pour un esprit durablement clair et focus, une cure régulière de 30 jours minimum est recommandée.`,
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: `Déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical sans avis médical. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des enfants. Ne se substitue pas à une alimentation variée et équilibrée.`,
  },
  { q: "Livraison", a: LIVRAISON },
];

const POWER_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients, Bienfaits et Posologie",
    a: `Grâce au Cordyceps, au Panax Ginseng et à la Rhodiola Rosea, POWER favorise la vitalité, l'endurance et la récupération tout en réduisant la fatigue.

POWER s'intègre naturellement dans la routine quotidienne, avec 2 gummies par jour à adapter selon le rythme de la journée, en fonction des besoins de votre corps et de ses variations d'énergie : le matin, après le déjeuner ou avant une activité physique.

Une utilisation régulière pendant 30 jours permet de constater la différence et de profiter d'une vitalité quotidienne naturelle et durable.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût fruité de fruit de la passion, agréables à mâcher — sans sucre ajouté.`,
  },
  {
    q: "Comment le préparer ?",
    a: `2 gummies par jour, à mâcher. À adapter selon le rythme de votre journée et vos variations d'énergie : le matin, après le déjeuner ou avant une activité physique.`,
  },
  {
    q: "Traçabilité et Qualité",
    a: `CORDYCEPS
• Dose : 200 mg par dose journalière
• Concentration : extrait concentré 4:1 (équivalent 800 mg de champignon sec)
• Procédé d'extraction : extraction aqueuse douce, sans solvants chimiques agressifs
• Partie utilisée : corps fructifère de cordyceps (Cordyceps sinensis Berkeley)
• Qualité & pureté : contrôlé (métaux lourds, microbiologie), non irradié
• Certification & conformité : fabrication conforme aux normes européennes (GMP, ISO 9001, ISO 22000, HACCP), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs

PANAX GINSENG
• Dose : 100 mg par dose journalière
• Standardisation : 4 % de ginsénosides
• Concentration : extrait concentré 3:1 (équivalent à 300 mg de Panax ginseng sec)
• Procédé d'extraction : eau purifiée et éthanol alimentaire
• Partie utilisée : parties aériennes (tiges et feuilles) de ginseng
• Qualité & pureté : contrôlé (métaux lourds, microbiologie, résidus de solvants), non irradié
• Certification & conformité : fabrication conforme aux normes européennes (GMP, ISO 9001, ISO 22000, HACCP), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs

RHODIOLA ROSEA
• Dose : 30 mg par dose journalière
• Standardisation : 3 % rosavines et 1 % salidroside (standard clinique)
• Procédé d'extraction : eau purifiée et éthanol alimentaire
• Partie utilisée : racine (origine Sibérie, récolte durable)
• Qualité & pureté : identité vérifiée (ADN + profil phytochimique), contrôlé (métaux lourds, pesticides, microbiologie), non irradié, sans OGM
• Certification & conformité : fabrication conforme aux normes européennes (GMP, FSSC 22000), sans BSE/TSE
• Allergènes : vegan, sans gluten, sans allergènes majeurs`,
  },
  {
    q: "Au bout de combien de temps ressent-on les effets ?",
    a: `Les premiers effets sur l'énergie et la vitalité peuvent se ressentir au fil des premiers jours. Pour une vitalité durable et une meilleure récupération, une cure régulière de 30 jours minimum est recommandée.`,
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: `Déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement médical sans avis médical. Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des enfants. Ne se substitue pas à une alimentation variée et équilibrée.`,
  },
  { q: "Livraison", a: LIVRAISON },
];

function buildAccordions(key: string | null, info: ProductInfo, isPowder: boolean): Accordion[] {
  if (key === "MUSHGLOW") return MUSHGLOW_ACCORDIONS;
  if (key === "CALM") return CALM_ACCORDIONS;
  if (key === "FOCUS") return FOCUS_ACCORDIONS;
  if (key === "POWER") return POWER_ACCORDIONS;
  return [
    { q: "Ingrédients, Bienfaits et Posologie", a: info.rows.map((r) => "• " + r.text).join("\n\n") },
    { q: "Quel goût a-t-il ?", a: isPowder ? "Goût neutre, se mélange facilement à toute boisson chaude ou froide." : "Des gummies au goût fruité et gourmand, agréables à mâcher — sans sucre ajouté." },
    { q: "Comment le préparer ?", a: info.rows[info.rows.length - 1]?.text ?? "" },
    { q: "Traçabilité et Qualité", a: "Formulé et fabriqué en France, avec des contrôles qualité à chaque étape. Déclaré auprès de la DGAL (plateforme COMPL'ALIM) — numéro de déclaration vérifiable publiquement. Actifs dosés selon la littérature scientifique." },
    { q: "Livraison", a: LIVRAISON },
  ];
}

function keyFor(title: string): string | null {
  return Object.keys(ACTIVES).find((k) => title.toUpperCase().includes(k)) ?? null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>;
}) {
  const { lang, handle } = await params;
  if (!hasLocale(lang)) notFound();
  const product = await getProduct(handle);
  if (!product) notFound();

  const key = keyFor(product.title);
  const info = key ? HIGHLIGHTS[key] : DEFAULT_INFO;
  const isPowder = key === "MUSHGLOW";
  const videos = key ? VIDEOS[key] ?? [] : [];
  const accordions = buildAccordions(key, info, isPowder);

  // Article pour le panier local (client) — le checkout Shopify est déclenché
  // depuis la page panier via un permalink multi-articles.
  const cartItem = {
    variantId: product.variantId ?? handle,
    handle,
    title: product.title,
    price: Number(product.price.amount),
    currency: product.price.currencyCode || "EUR",
    image: product.featuredImage?.url ?? product.images[0]?.url ?? null,
  };

  // Stock : pré-commande (0 en stock mais vendable) + stock faible.
  const LOW_STOCK_THRESHOLD = 10;
  const preorder = product.available && product.currentlyNotInStock;
  const lowStock =
    product.quantityAvailable != null &&
    product.quantityAvailable > 0 &&
    product.quantityAvailable <= LOW_STOCK_THRESHOLD;
  const ctaLabel = preorder ? "Précommander" : "Ajouter au panier";

  const EXCLUDE = new Set(["mousseur-a-lait", "bien-totebag"]);
  const related = (await getProducts(12))
    .filter((p) => p.handle !== handle && !EXCLUDE.has(p.handle))
    .slice(0, 2);

  const galleryImages = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [{ url: "/brand/product-mushglow.jpg", altText: product.title }];

  const reassurance = [
    { icon: Truck, label: "Livraison offerte dès 49 €" },
    { icon: ShieldCheck, label: "Paiement sécurisé" },
    { icon: MapPin, label: "Fabriqué en France" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      <main className="px-4 sm:px-6 lg:px-[100px] py-10 lg:py-14">
        <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black mb-6">
          <ArrowLeft className="h-4 w-4" /> Tous les produits
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Galerie — sticky pendant que la colonne droite défile */}
          <div className="lg:sticky lg:top-24 self-start">
            <ProductGallery images={galleryImages} title={product.title} bestSeller={key === "MUSHGLOW"} autoPlayMs={0} />
          </div>

          {/* Colonne droite — défile */}
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex text-bien-gold">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-bien-gold" />)}</span>
              <Link href={`/${lang}/avis`} className="text-sm text-black/70 hover:text-black underline-offset-2 hover:underline">+{info.reviews} clients satisfaits</Link>
            </div>
            <h1 className="mt-3 font-display font-black tracking-tighter text-[clamp(2rem,4vw,3rem)] leading-[1] text-black">{product.title}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display font-black text-2xl text-black">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-black/45 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-black/50">Taxes incluses.</p>

            {/* État du stock */}
            {preorder ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-bien-gold/20 text-black px-3 py-1.5 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-bien-gold" /> Pré-commande — expédiée dès réception du stock
              </p>
            ) : lowStock ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-sm font-semibold">
                <Zap className="h-4 w-4" /> Bientôt épuisé — plus que {product.quantityAvailable} en stock
              </p>
            ) : null}

            {/* Infos clés produit (comme le vrai site) */}
            <div className="mt-6 rounded-3xl bg-bien-forest text-bien-cream bien-shadow-sm p-5 sm:p-6">
              <p className="font-display font-black text-bien-gold tracking-wide">{info.category}</p>
              <ul className="mt-4 space-y-4">
                {info.rows.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3.5">
                    <span className="shrink-0 grid place-items-center h-10 w-10 rounded-xl bg-bien-cream/15 text-bien-cream"><Icon className="h-5 w-5" /></span>
                    <p className="text-sm text-bien-cream/90 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* La presse en parle — citation + logos magazines */}
            <div className="mt-6 rounded-2xl bg-bien-cream/60 ring-1 ring-border px-5 py-5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">La presse en parle</p>
              <p className="mt-2.5 text-sm text-black/85 leading-snug">
                « Les champignons s&apos;apprêtent à envahir vos routines bien-être, et c&apos;est une bonne chose ! »
              </p>
              <div className="mt-4 grid grid-cols-4 gap-x-3 items-center">
                {PRESS.map((p) => (
                  <span key={p} className="text-center font-display font-black text-lg sm:text-2xl tracking-wide text-black">{p}</span>
                ))}
              </div>
            </div>

            {product.available ? (
              <AddToCart
                item={cartItem}
                lang={lang}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold hover:brightness-105 transition bien-shadow-sm"
              >
                {ctaLabel}
              </AddToCart>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 font-bold opacity-50 cursor-not-allowed"
              >
                Bientôt de retour
              </button>
            )}
            <p className="mt-2 text-xs text-black/50 text-center">Satisfait ou remboursé 30 jours · Panier &amp; paiement Shopify.</p>

            {/* Réassurance */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reassurance.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[13px] text-black/80">
                  <span className="shrink-0 grid place-items-center h-8 w-8 rounded-full bg-bien-leaf/12 text-bien-leaf"><Icon className="h-4 w-4" /></span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Vu en vidéo */}
            {videos.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display font-black text-lg text-black">Vu en vidéo</h2>
                <div className={`mt-4 grid gap-4 ${videos.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-[16rem]"}`}>
                  {videos.map((v, i) => (
                    <ProductVideo
                      key={i}
                      src={v.url}
                      at={v.at}
                      className="w-full aspect-[9/16] object-cover rounded-2xl ring-1 ring-border bg-bien-cream"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Complétez votre routine */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display font-black text-lg text-black">Complétez votre routine</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((p) => {
                    const href = `/${lang}/products/${p.handle}`;
                    return (
                      <li key={p.id} className="flex items-center gap-4 rounded-2xl ring-1 ring-border bg-card p-3.5">
                        <Link href={href} className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-bien-cream ring-1 ring-border">
                          <Image src={p.featuredImage?.url ?? "/brand/product-mushglow.jpg"} alt={p.title} fill sizes="64px" className="object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link href={href}><h3 className="font-display font-black text-black leading-tight hover:text-bien-leaf transition-colors">{p.title}</h3></Link>
                          <p className="mt-0.5 font-semibold text-black">{formatPrice(p.price)}</p>
                        </div>
                        <Link href={href} aria-label={`Ajouter ${p.title}`} className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-bien-forest text-bien-cream hover:bg-bien-leaf transition-colors">
                          <Plus className="h-5 w-5" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Accordéons infos produit */}
            <section className="mt-12 space-y-3">
              {accordions.map(({ q, a }) => (
                <details key={q} className="group bg-card rounded-2xl ring-1 ring-border px-5 open:ring-bien-leaf/40 transition-all">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4 font-display font-black text-black">
                    {q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 -mt-0.5 text-sm text-black/75 leading-relaxed whitespace-pre-line">{a}</p>
                </details>
              ))}
            </section>
          </div>
        </div>

        {/* Avis produit — pleine largeur.
            Sur bien.health : vrai widget Loox natif (collecte → dashboard Loox).
            En dev/preview : affichage maison en repli (Loox bloque hors domaine). */}
        <ReviewsSwitch productId={product.id.split("/").pop() ?? product.id}>
          <ProductReviews productKey={key} productHandle={handle} productTitle={product.title} />
        </ReviewsSwitch>

        <div className="mt-12">
          <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> Retour à la boutique
          </Link>
        </div>
      </main>

      {/* Bandeau diagnostic (bas de page) */}
      <DiagnosticCTA lang={lang} />

      <ProductStickyBar
        title={product.title}
        price={formatPrice(product.price)}
        available={product.available}
        item={cartItem}
        lang={lang}
        ctaLabel={ctaLabel}
      />
    </div>
  );
}
