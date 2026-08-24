import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Truck, ShieldCheck, MapPin, ArrowLeft, Leaf,
  Zap, HeartPulse, RefreshCw, ChevronDown, Plus,
} from "lucide-react";
import { hasLocale } from "../../dictionaries";
import { getProduct, getProducts, formatPrice } from "@/lib/shopify-products";
import SiteHeader from "@/components/site-header";
import ProductGallery from "@/components/product-gallery";
import ProductVideo from "@/components/product-video";
import ProductReviews, { REVIEWS } from "@/components/product-reviews";
import ProductStickyBar from "@/components/product-sticky-bar";
import ReviewsSwitch from "@/components/reviews-switch";
import DiagnosticCTA from "@/components/diagnostic-cta";
import AddToCart from "@/components/add-to-cart";
import DeliveryEstimate from "@/components/delivery-estimate";
import JsonLd from "@/components/json-ld";
import { SITE_URL, pageMetadata, metaDescription } from "@/lib/seo";
import { PRODUCT_SEO, localizeProductSeo } from "@/lib/product-seo";
import { freeShippingAmount, freeShippingSentence } from "@/lib/shipping";
import { SHOP_RATING, ratingLabel, happyClientsLabel } from "@/lib/social-proof";
import StarRating from "@/components/star-rating";
import MetaViewContent from "@/components/meta-view-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>;
}): Promise<Metadata> {
  const { lang, handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: lang === "en" ? "Product not found | BIEN health" : "Produit introuvable | BIEN health" };
  const key = keyFor(product.title);
  const seo = key ? localizeProductSeo(PRODUCT_SEO[key], lang) : null;
  return pageMetadata({
    lang,
    path: `products/${handle}`,
    title: `${product.title} | BIEN health`,
    // Description propre au produit, coupée sur une frontière de mot.
    description: metaDescription(seo?.paragraphs[0] || product.description || seo?.heading || product.title),
    image: product.featuredImage?.url ?? product.images[0]?.url ?? null,
    imageAlt: product.title,
  });
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
    category: "SÉRÉNITÉ & SOMMEIL", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Des extraits de Reishi, Ashwagandha et Safran aux doses cliniquement efficaces." },
      { icon: Zap, text: "Soutenir l'équilibre émotionnel, favoriser la détente, et retrouver un sommeil réparateur, sans somnolence." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ni additif, vegan et sans gluten." },
      { icon: RefreshCw, text: "2 gummies au goût mûre, dans la journée pour se détendre ou le soir pour un sommeil de qualité." },
    ],
  },
  FOCUS: {
    category: "CONCENTRATION & MÉMOIRE", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Des extraits de Lion's Mane, L-Théanine et Rhodiola Rosea aux doses cliniquement efficaces." },
      { icon: Zap, text: "Soutenir la concentration, favoriser la clarté mentale et réduire la fatigue cognitive, sans stress." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ni additif, vegan et sans gluten." },
      { icon: RefreshCw, text: "2 gummies au goût ananas à prendre le matin, pour stimuler l'attention et avoir un esprit vif." },
    ],
  },
  POWER: {
    category: "ÉNERGIE & PERFORMANCE", reviews: 17,
    rows: [
      { icon: HeartPulse, text: "Des extraits de Cordyceps, Rhodiola et Panax Ginseng aux doses cliniquement efficaces." },
      { icon: Zap, text: "Soutenir l'énergie naturelle, optimiser les performances physiques et favoriser la résistance à l'effort, sans sensation de nervosité." },
      { icon: Leaf, text: "Une formule naturelle et clean, sans sucre ajouté ni additif, pour une vitalité saine et durable." },
      { icon: RefreshCw, text: "2 gummies au fruit de la passion à mâcher le matin, pour démarrer la journée avec plaisir et énergie." },
    ],
  },
  MUSHGLOW: {
    category: "ÉQUILIBRE GLOBAL", reviews: 23,
    rows: [
      { icon: HeartPulse, text: "Lion's Mane, Cordyceps, Chaga, Maca, L-Théanine et Collagène aux doses cliniquement efficaces." },
      { icon: Zap, text: "Favoriser l'énergie, la concentration, la résilience au stress, l'immunité et une peau éclatante." },
      { icon: Leaf, text: "Une formule 100% naturelle, sans sucres, sans gluten, sans lactose, sans additifs, sans caféine et veggie." },
      { icon: RefreshCw, text: "1 cuillère à soupe rase, de préférence le matin, pour un geste complet qui agit sur l'équilibre de l'organisme." },
    ],
  },
};

const DEFAULT_INFO: ProductInfo = {
  category: "BIEN-ÊTRE", reviews: 100,
  rows: [
    { icon: Leaf, text: "Adaptogènes et champignons fonctionnels dosés selon la science." },
    { icon: ShieldCheck, text: "Une formule naturelle et clean, fabriquée en France." },
  ],
};

const HIGHLIGHTS_EN: Record<string, ProductInfo> = {
  CALM: {
    category: "CALM & SLEEP", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Reishi, Ashwagandha and Saffron extracts at clinically effective doses." },
      { icon: Zap, text: "Support emotional balance, encourage relaxation and restore restful sleep, without drowsiness." },
      { icon: Leaf, text: "A natural, clean formula: no sugar or additives, vegan and gluten-free." },
      { icon: RefreshCw, text: "2 blackberry gummies, during the day to unwind or in the evening for quality sleep." },
    ],
  },
  FOCUS: {
    category: "FOCUS & MEMORY", reviews: 19,
    rows: [
      { icon: HeartPulse, text: "Lion's Mane, L-Theanine and Rhodiola extracts at clinically effective doses." },
      { icon: Zap, text: "Support focus, encourage mental clarity and reduce cognitive fatigue, without stress." },
      { icon: Leaf, text: "A natural, clean formula: no sugar or additives, vegan and gluten-free." },
      { icon: RefreshCw, text: "2 pineapple gummies in the morning, to sharpen attention and keep the mind alert." },
    ],
  },
  POWER: {
    category: "ENERGY & PERFORMANCE", reviews: 17,
    rows: [
      { icon: HeartPulse, text: "Cordyceps, Rhodiola and Panax Ginseng extracts at clinically effective doses." },
      { icon: Zap, text: "Support natural energy, optimise physical performance and boost stamina, without any jittery feeling." },
      { icon: Leaf, text: "A natural, clean formula: no added sugar or additives, for healthy, lasting vitality." },
      { icon: RefreshCw, text: "2 passion-fruit gummies to chew in the morning, to start the day with pleasure and energy." },
    ],
  },
  MUSHGLOW: {
    category: "OVERALL BALANCE", reviews: 23,
    rows: [
      { icon: HeartPulse, text: "Lion's Mane, Cordyceps, Chaga, Maca, L-Theanine and Collagen at clinically effective doses." },
      { icon: Zap, text: "Support energy, focus, stress resilience, immunity and radiant skin." },
      { icon: Leaf, text: "A 100% natural formula: no sugar, gluten, lactose, additives or caffeine, and veggie." },
      { icon: RefreshCw, text: "1 level tablespoon, ideally in the morning, for a complete ritual that supports the body's balance." },
    ],
  },
};

const DEFAULT_INFO_EN: ProductInfo = {
  category: "WELLBEING", reviews: 100,
  rows: [
    { icon: Leaf, text: "Adaptogens and functional mushrooms dosed according to science." },
    { icon: ShieldCheck, text: "A natural, clean formula, made in France." },
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

const LIVRAISON = `${freeShippingSentence("fr")}

France
• Point Relais (3 à 5 jours ouvrés) : 4 €
• Livraison standard à domicile (2 à 4 jours ouvrés) : 5,90 €
• Livraison express à domicile (1 à 2 jours ouvrés) : 11,50 €

Europe
Les options et tarifs de livraison sont affichés à l'étape de validation de commande.`;

const LIVRAISON_EN = `${freeShippingSentence("en")}

France
• Point Relais pick-up (3 to 5 business days): €4
• Standard home delivery (2 to 4 business days): €5.90
• Express home delivery (1 to 2 business days): €11.50

Europe
Delivery options and rates are shown at checkout.`;

type Accordion = { q: string; a: string };

const MUSHGLOW_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients & Bienfaits",
    a: `Lion's Mane, 750 mg : soutient la mémoire, la concentration et la fonction cognitive.
Cordyceps, 500 mg : booste l'énergie, la vitalité et l'endurance physique.
Chaga, 500 mg : antioxydant puissant, protège les cellules et soutient l'immunité.
L-Théanine, 200 mg : apaise sans endormir, améliore la clarté mentale et le focus.
Maca, 750 mg : équilibre hormonal et bien-être émotionnel, améliore l'humeur.
Collagène, 450 mg : améliore l'hydratation, l'élasticité et l'éclat de la peau.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Goût neutre et légèrement terreux, facile à intégrer : la poudre se fond dans un yaourt, un smoothie, un jus de légumes ou une soupe, sans dominer la préparation.`,
  },
  {
    // Conseils revus : la poudre laisse un dépôt dans le café, elle est donc
    // orientée vers les préparations épaisses (texte fourni par le client).
    q: "Comment le préparer ?",
    a: `Ajouter 1 cuillère à soupe rase par jour (environ 4 g) dans vos préparations, froides ou chaudes, jusqu'à 200 °C au four. Formule 100 % actifs, sans agents de liaison : de légers grumeaux peuvent apparaître. Bien mélanger pour obtenir une texture homogène.

Idéal dans les yaourts, smoothies, jus de légumes, soupes ou préparations épaisses. Convient aussi en cuisine : gâteaux, omelettes… Adapter la quantité selon le nombre de portions.

À consommer de préférence le matin. Premiers résultats visibles dès le 1er mois, à prolonger pour des effets durables.`,
  },
  {
    q: "Traçabilité et Qualité",
    a: `Formulé sur la base de recherches publiées dans des revues scientifiques internationales

• Lion's Mane : améliore la cognition et l'humeur chez l'adulte sain (Surendran et al., 2025).
• Cordyceps : améliore la tolérance à l'effort et la performance physique (Hirsch et al., 2017).
• Chaga : protège les cellules de la peau du stress oxydatif et inflammatoire (Park et al., 2023).
• Maca : agit sur l'humeur, l'énergie et l'équilibre hormonal (Zhang et al., 2023).
• L-Théanine : réduit efficacement le stress perçu (Moulin et al., 2024).
• Collagène (Ovolux™) : améliore visiblement la peau, les cheveux et les ongles (Ruff et al., 2024).`,
  },
  { q: "Livraison", a: LIVRAISON },
];

const CALM_ACCORDIONS: Accordion[] = [
  {
    q: "Ingrédients & Bienfaits",
    a: `Grâce au Reishi, à l'Ashwagandha et au Safran, CALM aide à relâcher la pression, retrouver de la sérénité et libérer les tensions tout en contribuant à un sommeil réparateur.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût mûre, agréables à mâcher, sans sucre ajouté.`,
  },
  {
    q: "Posologie",
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
    q: "Ingrédients & Bienfaits",
    a: `Grâce au Lion's Mane, au Thé vert riche en L-Théanine et à la Rhodiola Rosea, FOCUS soutient les performances intellectuelles, favorise la clarté mentale et aide à retrouver un esprit léger.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût ananas, agréables à mâcher, sans sucre ajouté.`,
  },
  {
    q: "Posologie",
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
    q: "Ingrédients & Bienfaits",
    a: `Grâce au Cordyceps, au Panax Ginseng et à la Rhodiola Rosea, POWER favorise la vitalité, l'endurance et la récupération tout en réduisant la fatigue.`,
  },
  {
    q: "Quel goût a-t-il ?",
    a: `Des gummies moelleux au goût fruité de fruit de la passion, agréables à mâcher, sans sucre ajouté.`,
  },
  {
    q: "Posologie",
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

const MUSHGLOW_ACCORDIONS_EN: Accordion[] = [
  {
    q: "Ingredients & Benefits",
    a: `Lion's Mane, 750 mg: supports memory, focus and cognitive function.
Cordyceps, 500 mg: boosts energy, vitality and physical stamina.
Chaga, 500 mg: powerful antioxidant, protects cells and supports immunity.
L-Theanine, 200 mg: calms without drowsiness, improves mental clarity and focus.
Maca, 750 mg: hormonal balance and emotional wellbeing, improves mood.
Collagen, 450 mg: improves skin hydration, elasticity and radiance.`,
  },
  {
    q: "What does it taste like?",
    a: `A neutral, slightly earthy taste that's easy to work with: the powder blends into a yoghurt, a smoothie, a vegetable juice or a soup without overpowering it.`,
  },
  {
    q: "How do I prepare it?",
    a: `Add 1 level tablespoon a day (about 4 g) to your preparations, cold or hot, up to 200 °C in the oven. A 100% active formula with no binding agents: slight lumps may appear. Stir well for an even texture.

Ideal in yoghurts, smoothies, vegetable juices, soups or thick preparations. It also works in cooking: cakes, omelettes… Adjust the amount to the number of servings.

Best taken in the morning. First results visible from the 1st month, to be continued for lasting effects.`,
  },
  {
    q: "Traceability and Quality",
    a: `Formulated based on research published in international scientific journals

• Lion's Mane: improves cognition and mood in healthy adults (Surendran et al., 2025).
• Cordyceps: improves exercise tolerance and physical performance (Hirsch et al., 2017).
• Chaga: protects skin cells from oxidative and inflammatory stress (Park et al., 2023).
• Maca: acts on mood, energy and hormonal balance (Zhang et al., 2023).
• L-Theanine: effectively reduces perceived stress (Moulin et al., 2024).
• Collagen (Ovolux™): visibly improves skin, hair and nails (Ruff et al., 2024).`,
  },
  { q: "Shipping", a: LIVRAISON_EN },
];

const CALM_ACCORDIONS_EN: Accordion[] = [
  {
    q: "Ingredients & Benefits",
    a: `Thanks to Reishi, Ashwagandha and Saffron, CALM helps release pressure, restore serenity and ease tension while contributing to restorative sleep.`,
  },
  {
    q: "What does it taste like?",
    a: `Soft blackberry gummies, pleasant to chew, with no added sugar.`,
  },
  {
    q: "Dosage",
    a: `2 gummies a day, to chew. Adapt to the rhythm of your day: to support moments of stress, or as a wind-down before sleep in the evening.`,
  },
  {
    q: "Traceability and Quality",
    a: `REISHI (GANODERMA LUCIDUM)
• Dose: 80 mg per daily serving
• Concentration: 10:1 concentrated extract (equivalent to 800 mg of dried mushroom)
• Extraction process: hydroalcoholic extraction
• Part used: reishi fruiting body (origin: China)
• Quality & purity: tested (heavy metals, microbiology, pesticides, polycyclic aromatic hydrocarbons, solvent residues), non-irradiated, GMO-free
• Certification & compliance: manufacturing compliant with European standards (Eur. Ph., Reg. EU 2023/915), BSE/TSE-free
• Allergens: vegan, free from major allergens

ASHWAGANDHA (WITHANIA SOMNIFERA)
• Dose: 80 mg per daily serving
• Standardisation: ≥ 5% withanolides
• Concentration: 18:1 concentrated extract (equivalent to 1,440 mg of dried ashwagandha)
• Extraction process: extract obtained via purified water and food-grade ethanol
• Part used: ashwagandha root (origin: India)
• Quality & purity: tested (heavy metals, microbiology, pesticides, solvent residues)
• Certification & compliance: manufacturing compliant with European standards (French Plant Order Annex II, USP), BSE/TSE-free
• Allergens: vegan, free from major allergens

SAFFRON (CROCUS SATIVUS)
• Dose: 16 mg per daily serving
• Standardisation: ≥ 2% safranal + ≥ 2% crocin
• Extraction process: standardised UV extraction
• Part used: saffron flower (origin: China)
• Quality & purity: tested (heavy metals, microbiology, pesticides, PAH), non-irradiated, GMO-free
• Certification & compliance: manufacturing compliant with European standards (Eur. Ph., Reg. EU 2023/915), BSE/TSE-free
• Allergens: vegan, free from major allergens`,
  },
  {
    q: "How long before you feel the effects?",
    a: `The first calming effects can be felt within the first few days. For lasting serenity and better sleep quality, a regular programme of at least 30 days is recommended.`,
  },
  {
    q: "Are there any contraindications?",
    a: `Not recommended for pregnant or breastfeeding women or people on medical treatment (particularly sedatives or anxiolytics) without medical advice. Do not exceed the recommended daily dose. Keep out of reach of children. Does not replace a varied and balanced diet.`,
  },
  { q: "Shipping", a: LIVRAISON_EN },
];

const FOCUS_ACCORDIONS_EN: Accordion[] = [
  {
    q: "Ingredients & Benefits",
    a: `Thanks to Lion's Mane, green tea rich in L-Theanine and Rhodiola Rosea, FOCUS supports intellectual performance, promotes mental clarity and helps you feel light-headed clarity.`,
  },
  {
    q: "What does it taste like?",
    a: `Soft pineapple gummies, pleasant to chew, with no added sugar.`,
  },
  {
    q: "Dosage",
    a: `2 gummies a day, to chew. Adapt to the rhythm of your day, according to your attention and focus needs: in the morning, after lunch or in the afternoon.`,
  },
  {
    q: "Traceability and Quality",
    a: `LION'S MANE (HERICIUM ERINACEUS)
• Dose: 120 mg per daily serving
• Standardisation: ≥ 30% polysaccharides
• Concentration: concentrated extract between 8:1 and 12:1 (equivalent to about 1,200 mg of dried mushroom)
• Extraction process: gentle aqueous extraction, without harsh chemical solvents
• Part used: (young) fruiting body of Hericium erinaceus (origin: China)
• Quality & purity: tested (heavy metals, microbiology), GMO-free, non-irradiated
• Certification & compliance: certified organic ingredient, compliant with European regulations (pesticides, mycotoxins, contaminants), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens

L-THEANINE (GREEN TEA)
• Dose: 80 mg per daily serving
• Standardisation: 40% L-theanine
• Concentration: 25:1 concentrated extract
• Extraction process: green tea extract obtained via purified water
• Part used: Camellia sinensis leaf
• Quality & purity: tested (heavy metals, microbiology, solvent residues), GMO-free, non-irradiated
• Certification & compliance: manufacturing compliant with European standards (GMP, HACCP, ISO 9001, ISO 22000), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens

RHODIOLA ROSEA
• Dose: 30 mg per daily serving
• Standardisation: 3% rosavins and 1% salidroside (clinical standard)
• Extraction process: purified water and food-grade ethanol
• Part used: root (origin: Siberia, sustainable harvest)
• Quality & purity: verified identity (DNA + phytochemical profile), tested (heavy metals, pesticides, microbiology), non-irradiated, GMO-free
• Certification & compliance: manufacturing compliant with European standards (GMP, FSSC 22000), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens`,
  },
  {
    q: "How long before you feel the effects?",
    a: `The first effects on focus and mental clarity can be felt over the first few days. For a lastingly clear and focused mind, a regular programme of at least 30 days is recommended.`,
  },
  {
    q: "Are there any contraindications?",
    a: `Not recommended for pregnant or breastfeeding women or people on medical treatment without medical advice. Do not exceed the recommended daily dose. Keep out of reach of children. Does not replace a varied and balanced diet.`,
  },
  { q: "Shipping", a: LIVRAISON_EN },
];

const POWER_ACCORDIONS_EN: Accordion[] = [
  {
    q: "Ingredients & Benefits",
    a: `Thanks to Cordyceps, Panax Ginseng and Rhodiola Rosea, POWER promotes vitality, stamina and recovery while reducing fatigue.`,
  },
  {
    q: "What does it taste like?",
    a: `Soft gummies with a fruity passion-fruit taste, pleasant to chew, with no added sugar.`,
  },
  {
    q: "Dosage",
    a: `2 gummies a day, to chew. Adapt to the rhythm of your day and your energy variations: in the morning, after lunch or before physical activity.`,
  },
  {
    q: "Traceability and Quality",
    a: `CORDYCEPS
• Dose: 200 mg per daily serving
• Concentration: 4:1 concentrated extract (equivalent to 800 mg of dried mushroom)
• Extraction process: gentle aqueous extraction, without harsh chemical solvents
• Part used: cordyceps fruiting body (Cordyceps sinensis Berkeley)
• Quality & purity: tested (heavy metals, microbiology), non-irradiated
• Certification & compliance: manufacturing compliant with European standards (GMP, ISO 9001, ISO 22000, HACCP), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens

PANAX GINSENG
• Dose: 100 mg per daily serving
• Standardisation: 4% ginsenosides
• Concentration: 3:1 concentrated extract (equivalent to 300 mg of dried Panax ginseng)
• Extraction process: purified water and food-grade ethanol
• Part used: aerial parts (stems and leaves) of ginseng
• Quality & purity: tested (heavy metals, microbiology, solvent residues), non-irradiated
• Certification & compliance: manufacturing compliant with European standards (GMP, ISO 9001, ISO 22000, HACCP), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens

RHODIOLA ROSEA
• Dose: 30 mg per daily serving
• Standardisation: 3% rosavins and 1% salidroside (clinical standard)
• Extraction process: purified water and food-grade ethanol
• Part used: root (origin: Siberia, sustainable harvest)
• Quality & purity: verified identity (DNA + phytochemical profile), tested (heavy metals, pesticides, microbiology), non-irradiated, GMO-free
• Certification & compliance: manufacturing compliant with European standards (GMP, FSSC 22000), BSE/TSE-free
• Allergens: vegan, gluten-free, free from major allergens`,
  },
  {
    q: "How long before you feel the effects?",
    a: `The first effects on energy and vitality can be felt over the first few days. For lasting vitality and better recovery, a regular programme of at least 30 days is recommended.`,
  },
  {
    q: "Are there any contraindications?",
    a: `Not recommended for pregnant or breastfeeding women or people on medical treatment without medical advice. Do not exceed the recommended daily dose. Keep out of reach of children. Does not replace a varied and balanced diet.`,
  },
  { q: "Shipping", a: LIVRAISON_EN },
];

function buildAccordions(key: string | null, info: ProductInfo, isPowder: boolean, lang: string): Accordion[] {
  const en = lang === "en";
  if (key === "MUSHGLOW") return en ? MUSHGLOW_ACCORDIONS_EN : MUSHGLOW_ACCORDIONS;
  if (key === "CALM") return en ? CALM_ACCORDIONS_EN : CALM_ACCORDIONS;
  if (key === "FOCUS") return en ? FOCUS_ACCORDIONS_EN : FOCUS_ACCORDIONS;
  if (key === "POWER") return en ? POWER_ACCORDIONS_EN : POWER_ACCORDIONS;
  // Accessoires (mousseur, tote bag) : aucun `key`. Ils n'ont ni goût, ni
  // posologie, ni actifs — seule la livraison les concerne (correction client).
  if (!key) return [{ q: en ? "Shipping" : "Livraison", a: en ? LIVRAISON_EN : LIVRAISON }];
  return en
    ? [
        { q: "Ingredients, Benefits and Dosage", a: info.rows.map((r) => "• " + r.text).join("\n\n") },
        { q: "What does it taste like?", a: isPowder ? "Neutral taste, blends easily into any hot or cold drink." : "Fruity, delicious gummies, pleasant to chew, with no added sugar." },
        { q: isPowder ? "How do I take it?" : "Dosage", a: info.rows[info.rows.length - 1]?.text ?? "" },
        { q: "Traceability and Quality", a: "Formulated and made in France, with quality controls at every step. Declared to the DGAL (COMPL'ALIM platform), with a publicly verifiable declaration number. Actives dosed according to scientific literature." },
        { q: "Shipping", a: LIVRAISON_EN },
      ]
    : [
        { q: "Ingrédients, Bienfaits et Posologie", a: info.rows.map((r) => "• " + r.text).join("\n\n") },
        { q: "Quel goût a-t-il ?", a: isPowder ? "Goût neutre, se mélange facilement à toute boisson chaude ou froide." : "Des gummies au goût fruité et gourmand, agréables à mâcher, sans sucre ajouté." },
        { q: isPowder ? "Comment le préparer ?" : "Posologie", a: info.rows[info.rows.length - 1]?.text ?? "" },
        { q: "Traçabilité et Qualité", a: "Formulé et fabriqué en France, avec des contrôles qualité à chaque étape. Déclaré auprès de la DGAL (plateforme COMPL'ALIM), avec un numéro de déclaration vérifiable publiquement. Actifs dosés selon la littérature scientifique." },
        { q: "Livraison", a: LIVRAISON },
      ];
}

function keyFor(title: string): string | null {
  return Object.keys(ACTIVES).find((k) => title.toUpperCase().includes(k)) ?? null;
}

/** « 11/12/2025 » → « 2025-12-11 » pour le JSON-LD (null si format inattendu). */
function isoDate(date?: string): string | null {
  const m = date?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

const UI = {
  fr: {
    allProducts: "Tous les produits",
    happyClients: (n: number) => `+${n} clients satisfaits`,
    taxIncluded: "Taxes incluses.",
    cureLabelGummies: "Cure d'1 mois : 60 gummies",
    cureLabelPowder: "Cure d'1 mois : 30 portions",
    preorderNote: "Pré-commande : expédiée dès réception du stock",
    lowStock: (n: number) => `Bientôt épuisé : plus que ${n} en stock`,
    pressEyebrow: "La presse en parle",
    pressQuote: "« Les champignons s'apprêtent à envahir vos routines bien-être, et c'est une bonne chose ! »",
    addToCart: "Ajouter au panier",
    preorderCta: "Précommander",
    backSoon: "Bientôt de retour",
    guarantee: "Satisfaits ou remboursés sous 30 jours · Paiement sécurisé.",
    reassurance: [`Livraison offerte dès ${freeShippingAmount("fr")}`, "Paiement sécurisé", "Fabriqué en France"],
    videoTitle: "Vu en vidéo",
    routineTitle: "Complétez votre routine",
    add: (t: string) => `Ajouter ${t}`,
    aboutEyebrow: "À propos",
    backToShop: "Retour à la boutique",
    notFound: "Produit introuvable | BIEN health",
  },
  en: {
    allProducts: "All products",
    happyClients: (n: number) => `+${n} happy customers`,
    taxIncluded: "Taxes included.",
    cureLabelGummies: "1-month course: 60 gummies",
    cureLabelPowder: "1-month course: 30 servings",
    preorderNote: "Pre-order: ships as soon as stock arrives",
    lowStock: (n: number) => `Almost sold out: only ${n} left in stock`,
    pressEyebrow: "As seen in the press",
    pressQuote: "“Mushrooms are about to take over your wellness routines, and that's a good thing!”",
    addToCart: "Add to cart",
    preorderCta: "Pre-order",
    backSoon: "Back soon",
    guarantee: "30-day money-back guarantee · Secure payment.",
    reassurance: [`Free shipping over ${freeShippingAmount("en")}`, "Secure payment", "Made in France"],
    videoTitle: "Seen on video",
    routineTitle: "Complete your routine",
    add: (t: string) => `Add ${t}`,
    aboutEyebrow: "About",
    backToShop: "Back to the shop",
    notFound: "Product not found | BIEN health",
  },
} as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>;
}) {
  const { lang, handle } = await params;
  if (!hasLocale(lang)) notFound();
  const product = await getProduct(handle);
  if (!product) notFound();

  const en = lang === "en";
  const ui = en ? UI.en : UI.fr;
  const key = keyFor(product.title);
  const info = key ? (en ? HIGHLIGHTS_EN : HIGHLIGHTS)[key] : (en ? DEFAULT_INFO_EN : DEFAULT_INFO);
  const isPowder = key === "MUSHGLOW";
  const videos = key ? VIDEOS[key] ?? [] : [];
  const accordions = buildAccordions(key, info, isPowder, lang);

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
  const ctaLabel = preorder ? ui.preorderCta : ui.addToCart;
  const productSeo = key ? localizeProductSeo(PRODUCT_SEO[key], lang) : null;

  // Données structurées produit (SEO / rich results).
  // Les avis repris ici sont ceux affichés sur la page (règle Google : pas de
  // balisage d'avis invisibles).
  const productReviews = key ? REVIEWS[key] ?? [] : [];
  const reviewLd = productReviews.slice(0, 10).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    ...(isoDate(r.date) ? { datePublished: isoDate(r.date) } : {}),
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    reviewBody: (en && r.textEn ? r.textEn : r.text).replace(/\s+/g, " ").trim(),
  }));

  const availability = !product.available ? "OutOfStock" : preorder ? "PreOrder" : "InStock";
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.length ? product.images.map((i) => i.url) : product.featuredImage ? [product.featuredImage.url] : [],
    description: (product.description || info.category).slice(0, 320),
    brand: { "@type": "Brand", name: "BIEN health" },
    sku: handle,
    offers: {
      "@type": "Offer",
      price: product.price.amount,
      priceCurrency: product.price.currencyCode || "EUR",
      availability: `https://schema.org/${availability}`,
      url: `${SITE_URL}/${lang}/products/${handle}`,
    },
    // Balisage AggregateRating : note et volume RÉELS du produit chez Loox
    // (metafields Shopify). Un « 5 » forfaitaire ne correspondait à aucune
    // source vérifiable — c'est ce que Google exige pour garder l'étoile en
    // résultat de recherche.
    ...(product.rating && product.ratingCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(product.rating),
            bestRating: "5",
            reviewCount: String(product.ratingCount),
          },
        }
      : {}),
    ...(reviewLd.length ? { review: reviewLd } : {}),
  };

  // Fil d'Ariane (rich result « breadcrumb » dans les SERP).
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BIEN health", item: `${SITE_URL}/${lang}` },
      { "@type": "ListItem", position: 2, name: en ? "Shop" : "Boutique", item: `${SITE_URL}/${lang}/boutique` },
      { "@type": "ListItem", position: 3, name: product.title, item: `${SITE_URL}/${lang}/products/${handle}` },
    ],
  };

  const EXCLUDE = new Set(["mousseur-a-lait", "bien-totebag"]);
  const related = (await getProducts(12))
    .filter((p) => p.handle !== handle && !EXCLUDE.has(p.handle))
    .slice(0, 2);

  const galleryImages = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [{ url: "/brand/product-mushglow.jpg", altText: product.title }];

  const reassuranceIcons = [Truck, ShieldCheck, MapPin];
  const reassurance = ui.reassurance.map((label, i) => ({ icon: reassuranceIcons[i], label }));

  // Nom principal / descriptif : « MUSHGLOW — Supermix 6-en-1 » se coupe au
  // premier tiret (long ou court) entouré d'espaces.
  const [titleMain, titleSub] = (() => {
    const m = product.title.match(/^(.+?)\s+[—–-]\s+(.+)$/);
    return m ? [m[1], m[2]] : [product.title, null];
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <MetaViewContent handle={handle} title={product.title} price={Number(product.price.amount)} currency={product.price.currencyCode || "EUR"} />

      {/* Gouttière haute resserrée : sur un 13", la marge blanche au-dessus de
          la photo repoussait le bloc « Équilibre global » hors de l'écran. */}
      <main className="px-4 sm:px-6 lg:px-12 xl:px-16 py-5 lg:py-7">
        <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black mb-4">
          <ArrowLeft className="h-4 w-4" /> {ui.allProducts}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Galerie — sticky pendant que la colonne droite défile */}
          <div className="lg:sticky lg:top-24 self-start">
            <ProductGallery images={galleryImages} title={product.title} bestSeller={key === "MUSHGLOW"} autoPlayMs={0} />
          </div>

          {/* Colonne droite — défile */}
          <div>
            {/* En-tête : le nom du produit ouvre la fiche, la preuve sociale
                et la garantie se rangent à sa droite (demande client du
                24/08/2026). Auparavant elles occupaient les deux premières
                lignes et le nom n'arrivait qu'en troisième position.
                Sous 640 px la colonne reprend le dessus : le nom en premier,
                la preuve sociale juste dessous. */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
              {/* Le nom Shopify porte souvent un descriptif après un tiret
                  (« MUSHGLOW — Supermix 6-en-1 ») : le descriptif passe en
                  sous-titre plus discret sous le nom, au lieu de s'afficher au
                  même corps que la marque (demande client). */}
              <h1 className="min-w-0 font-hero text-[clamp(1.76rem,3.52vw,2.64rem)] leading-[1] text-black">
                {titleMain}
                {titleSub && (
                  <span className="mt-1.5 block font-display text-base sm:text-lg font-normal text-black/60">{titleSub}</span>
                )}
              </h1>

              {/* Preuve sociale : la note affichée est celle de la boutique
                  (identique au header) et le compteur parle de clients, pas
                  d'avis — les avis de CE produit sont plus bas. Le libellé mène
                  à la page Avis, qui porte le mur d'avis clients. */}
              <div className="sm:shrink-0 sm:text-right sm:pt-1">
                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                  <StarRating value={SHOP_RATING} className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold text-black">{ratingLabel(lang)}/5</span>
                  <span className="text-black/30">·</span>
                  <Link
                    href={`/${lang}/avis`}
                    className="text-sm text-black/70 hover:text-black underline-offset-2 hover:underline"
                  >
                    {happyClientsLabel(lang)}
                  </Link>
                </div>
                {/* Garantie remontée avec la preuve sociale : sous le CTA, elle
                    séparait le bouton de la réassurance juste en dessous. */}
                <p className="mt-1.5 text-xs text-black/50">{ui.guarantee}</p>
              </div>
            </div>

            {/* État du stock */}
            {preorder ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-bien-gold/20 text-black px-3 py-1.5 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-bien-gold" /> {ui.preorderNote}
              </p>
            ) : lowStock ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-sm font-semibold">
                <Zap className="h-4 w-4" /> {ui.lowStock(product.quantityAvailable!)}
              </p>
            ) : null}

            {/* Disponibilité + fenêtre de livraison estimée : pour un
                complément, elle est passée JUSTE SOUS le bouton d'ajout
                (demande client du 24/08/2026 ; elle était au-dessus depuis le
                19/08, et tout en haut de la colonne avant cela). Les
                accessoires la gardent ici, leur bloc d'achat tenant sur une
                seule ligne. */}
            {product.available && !key && <DeliveryEstimate lang={lang} inStock={!preorder} />}

            {/* Infos clés produit — remontées au-dessus du bloc d'achat : le
                client veut lire ce que fait le produit avant de voir le prix
                et le bouton. Masqué pour les accessoires (mousseur, tote bag) :
                le texte générique leur prêtait des adaptogènes et des
                champignons qu'ils ne contiennent pas. */}
            {key && (
              /* Replié par défaut (demande client du 19/08/2026) : déployé, ce
                 bloc repoussait le bouton d'ajout sous la ligne de flottaison.
                 Seul l'intitulé reste visible, le contenu s'ouvre au clic. */
              <details className="group mt-5 rounded-3xl bg-bien-forest text-bien-cream bien-shadow-sm">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 sm:px-6 py-4">
                  <h2 className="font-display text-bien-gold tracking-wide">{info.category}</h2>
                  <ChevronDown className="h-5 w-5 shrink-0 text-bien-cream/70 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4">
                  {info.rows.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3.5">
                      <span className="shrink-0 grid place-items-center h-10 w-10 rounded-xl bg-bien-cream/15 text-bien-cream"><Icon className="h-5 w-5" /></span>
                      <p className="text-sm text-bien-cream/90 leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Achat. Pour un complément, le choix de la cure (1/2/3/6 mois avec
                les remises Shopify) prend toute la largeur et le CTA passe en
                dessous. Pour un accessoire, on garde prix et CTA sur la même
                ligne : le CTA pleine largeur sous le prix coûtait une centaine
                de pixels de haut sur un 13". */}
            <div className={`mt-5 ${key ? "" : "flex flex-wrap items-center gap-x-6 gap-y-3"}`}>
              <div>
                {/* Sur un complément, le prix unitaire n'est plus répété ici :
                    chaque ligne du choix de la cure porte déjà son total, son
                    prix barré et son prix à la journée (demande client du
                    19/08/2026). Il reste affiché pour les accessoires, qui
                    n'ont pas ce tableau. */}
                {!key && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-bold text-black">{formatPrice(product.price)}</span>
                    {product.compareAtPrice &&
                      Number(product.compareAtPrice.amount) > Number(product.price.amount) && (
                        <span className="text-sm text-black/45 line-through">{formatPrice(product.compareAtPrice)}</span>
                      )}
                  </div>
                )}
                <p className={`text-xs text-black/50 ${key ? "" : "mt-1"}`}>
                  {ui.taxIncluded}
                  {/* Format de la cure : 60 gummies à 2/jour et 30 portions de
                      poudre couvrent un mois — l'information manquait près du prix. */}
                  {key && <> · <span className="font-semibold text-black/70">{isPowder ? ui.cureLabelPowder : ui.cureLabelGummies}</span></>}
                </p>
              </div>

              {/* Largeur du CTA calée sur son libellé (pleine largeur seulement
                  sur mobile) : étiré sur l'espace restant, il faisait deux fois
                  la largeur nécessaire. `ml-auto` le plaque au bord droit de la
                  colonne, aligné sur les blocs en dessous. */}
              <div className={key ? "mt-5" : "w-full sm:w-auto sm:ml-auto"}>
                {product.available ? (
                  <AddToCart
                    item={cartItem}
                    lang={lang}
                    cureSelector={Boolean(key)}
                    quantitySelector={!key}
                    afterButton={key ? <div className="mt-4"><DeliveryEstimate lang={lang} inStock={!preorder} /></div> : undefined}
                    className={`${key ? "w-full" : "flex-1 sm:flex-none"} inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-8 py-3.5 font-bold hover:brightness-105 transition bien-shadow-sm`}
                  >
                    {ctaLabel}
                  </AddToCart>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-bien-gold text-black px-10 py-3.5 font-bold opacity-50 cursor-not-allowed"
                  >
                    {ui.backSoon}
                  </button>
                )}
              </div>
            </div>

            {/* Réassurance */}
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reassurance.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[13px] text-black/80">
                  <span className="shrink-0 grid place-items-center h-8 w-8 rounded-full bg-bien-leaf/12 text-bien-leaf"><Icon className="h-4 w-4" /></span>
                  {label}
                </li>
              ))}
            </ul>

            {/* La presse en parle — citation + logos magazines. Masqué sur les
                accessoires : la citation parle des champignons adaptogènes,
                hors sujet sur un mousseur ou un tote bag (demande client). */}
            {key && (
            <div className="mt-6 rounded-2xl bg-bien-cream/60 ring-1 ring-border px-5 py-5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">{ui.pressEyebrow}</p>
              <p className="mt-2.5 text-sm text-black/85 leading-snug">
                {ui.pressQuote}
              </p>
              <div className="mt-4 grid grid-cols-4 gap-x-3 items-center">
                {PRESS.map((p) => (
                  <span key={p} className="text-center font-display text-lg sm:text-2xl tracking-wide text-black">{p}</span>
                ))}
              </div>
            </div>
            )}

            {/* Vu en vidéo */}
            {videos.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-lg text-black">{ui.videoTitle}</h2>
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
                <h2 className="font-display text-lg text-black">{ui.routineTitle}</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((p) => {
                    const href = `/${lang}/products/${p.handle}`;
                    return (
                      <li key={p.id} className="flex items-center gap-4 rounded-2xl ring-1 ring-border bg-card p-3.5">
                        <Link href={href} tabIndex={-1} aria-hidden className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-bien-cream ring-1 ring-border">
                          <Image src={p.featuredImage?.url ?? "/brand/product-mushglow.jpg"} alt={p.title} fill sizes="64px" className="object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link href={href}><h3 className="font-display text-black leading-tight hover:text-bien-leaf transition-colors">{p.title}</h3></Link>
                          <p className="mt-0.5 font-semibold text-black">{formatPrice(p.price)}</p>
                        </div>
                        <Link href={href} className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-bien-forest text-bien-cream hover:bg-bien-leaf transition-colors">
                          <Plus className="h-5 w-5" />
                          <span className="sr-only">{ui.add(p.title)}</span>
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
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-4">
                    <h3 className="font-display text-black">{q}</h3>
                    <ChevronDown className="h-5 w-5 shrink-0 text-bien-leaf transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 -mt-0.5 text-sm text-black/75 leading-relaxed whitespace-pre-line">{a}</p>
                </details>
              ))}
            </section>
          </div>
        </div>

        {/* Intro éditoriale SEO produit */}
        {productSeo && (
          <section className="mt-16 sm:mt-24 rounded-3xl lg:rounded-[2.5rem] bg-bien-cream/50 ring-1 ring-border p-7 sm:p-12 lg:p-16">
            <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{ui.aboutEyebrow}</p>
            <h2 className="mt-3 font-display tracking-tighter text-2xl sm:text-3xl text-black max-w-2xl">{productSeo.heading}</h2>
            <div className="mt-5 grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-5xl">
              {productSeo.paragraphs.map((para, i) => (
                <p key={i} className="text-[15px] sm:text-base text-black/75 leading-relaxed text-justify hyphens-auto">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Avis produit — pleine largeur.
            Sur bien.health : vrai widget Loox natif (collecte → dashboard Loox).
            En dev/preview : affichage maison en repli (Loox bloque hors domaine). */}
        <ReviewsSwitch productId={product.id.split("/").pop() ?? product.id}>
          <ProductReviews productKey={key} productHandle={handle} productTitle={product.title} lang={lang} />
        </ReviewsSwitch>

        <div className="mt-12">
          <Link href={`/${lang}/boutique`} className="inline-flex items-center gap-2 text-sm font-semibold text-bien-leaf hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> {ui.backToShop}
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
