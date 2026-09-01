/**
 * Médias qui ont parlé de la marque — partagé par la page d'accueil et par la
 * page « La presse en parle », qui en tire son mur de logos et le lien
 * d'article de chaque parution détaillée.
 *
 * Les logos viennent tous de `public/brand/presse/logos/`, régénérés le
 * 29/08/2026 depuis les SVG du client : rendu à haute résolution, marges
 * d'origine détourées, fond blanc rendu transparent, puis recentrage dans un
 * canevas commun de 720 × 280 px (le rapport de la case d'affichage). C'est ce
 * canevas partagé qui donne à tous la même présence à l'écran : sans lui, un
 * logo carré comme Sud Radio écrasait un logo large comme ELLE.
 *
 * `href` est optionnel : les médias arrivés sans lien d'article sont affichés
 * mais pas cliquables, plutôt que de renvoyer vers une page d'accueil de
 * magazine qui ne prouverait rien. Les entrées cliquables passent en premier.
 */
export const PRESS: { name: string; logo: string; href?: string; w: number; h: number }[] = [
  { name: "Do It In Paris", logo: "/brand/presse/logos/do-it-in-paris.webp", href: "https://www.doitinparis.com/fr/boissons-detox-paris-27378" , w: 598, h: 280 },
  { name: "Marie Claire", logo: "/brand/presse/logos/marie-claire.webp", href: "https://avis-beaute.marieclaire.fr/stress-ces-gummies-vont-devenir-vos-meilleurs-allies-pour-retrouver-calme-et-serenite,16515.asp" , w: 338, h: 280 },
  { name: "Grazia", logo: "/brand/presse/logos/grazia.webp", href: "https://www.grazia.fr/beaute/forme-minceur/la-science-est-formelle-ces-plantes-meconnues-permettent-de-dire-adieu-au-stress-a-vous-le-meilleur-equilibre-emotionnel-1220480.html" , w: 444, h: 280 },
  { name: "Psychologies", logo: "/brand/presse/logos/psychologies.webp", href: "https://www.psychologies.com/bien-etre/stress/gestion-du-stress/Voici-le-nouvel-allie-anti-stress-dont-tout-le-monde-parle-et-ce-nest-pas-du-magnesium-622813" , w: 572, h: 280 },
  { name: "Gala", logo: "/brand/presse/logos/gala.webp", href: "https://photo.gala.fr/mode/tendances_mode/shopping-stanley-lululemon-alo-les-32-cadeaux-les-plus-desirables-a-offrir-a-un-sportif-pour-les-fetes-20251210#photo-10" , w: 377, h: 280 },
  { name: "L'Officiel", logo: "/brand/presse/logos/lofficiel.webp", href: "https://www.lofficiel.com/beaute/10-produits-de-beaute-a-acheter-en-janvier-2026" , w: 338, h: 280 },
  { name: "BIBA", logo: "/brand/presse/logos/biba.webp", href: "https://www.bibamagazine.fr/lifestyle/sante/adieu-le-cafe-cette-boisson-naturelle-a-base-de-champignons-est-le-secret-pour-se-reveiller-sans-doper-son-cortisol-498845.html" , w: 424, h: 280 },
  { name: "Sud Radio", logo: "/brand/presse/logos/sud-radio.webp", href: "https://www.sudradio.fr/emission/cest-ca-la-france-378" , w: 221, h: 280 },
  { name: "Beauté test", logo: "/brand/presse/logos/beaute-test.webp", href: "https://www.beaute-test.com/mag/jai-teste-pour-vous-ces-gummies-anti-stress-sans-melatonine-qui-apaisent-vraiment.php" , w: 371, h: 280 },
  { name: "Les Nouvelles Esthétiques", logo: "/brand/presse/logos/nouvelles-esthetiques.webp", href: "https://www.nouvelles-esthetiques.com/articles/sante-medecine/bien-etre/bien-health-quand-les-plantes-adaptogenes-reinventent-le-bien-etre-4629" , w: 411, h: 280 },
  { name: "TheDreamTeam", logo: "/brand/presse/logos/thedreamteam.webp", href: "https://thedreamteam.fr/les-champignons-adaptogenes-revolutionnent-bien-notre-equilibre-quotidien/" , w: 692, h: 280 },
  { name: "Fresh Magazine", logo: "/brand/presse/logos/fresh-magazine.webp", href: "https://freshmagparis.com/la-gamme-bien-a-la-recherche-du-bien-etre-moderne/" , w: 358, h: 280 },
  { name: "BiG média", logo: "/brand/presse/logos/big-media.webp", href: "https://bigmedia.bpifrance.fr/nos-actualites/bien-la-marque-de-plantes-adaptogenes-qui-pilote-votre-forme" , w: 475, h: 280 },
  { name: "Mesinfos", logo: "/brand/presse/logos/mesinfos.webp", href: "https://mesinfos.fr/75000-paris/bien-health-veut-democratiser-le-pouvoir-des-champignons-et-adaptogenes-245656.html" , w: 556, h: 280 },
  { name: "Gazelle", logo: "/brand/presse/logos/gazelle.webp", href: "https://www.gazellemag.com/selection-dindispensables-pour-prendre-soin-de-soi-et-prevenir-les-petits-maux-du-quotidien" , w: 521, h: 280 },
  { name: "Fait en France", logo: "/brand/presse/logos/fait-en-france.webp", href: "https://www.instagram.com/p/DV1A6w3iKpm/" , w: 405, h: 280 },
  { name: "My Beauty Factory", logo: "/brand/presse/logos/my-beauty-factory.webp", href: "https://www.instagram.com/p/DVqG1hPjzy-/" , w: 439, h: 280 },
  { name: "Snake & Twist", logo: "/brand/presse/logos/snake-twist.webp", href: "https://www.instagram.com/p/DUIVTzWjQAn/?igsh=MTU0dXNnZ2hnOTJ6cg%3D%3D" , w: 282, h: 280 },
  // Parutions papier : le client les a listées « PRINT, cf dossier », sans URL.
  // Elles restent affichées mais non cliquables.
  { name: "ELLE", logo: "/brand/presse/logos/elle.webp" , w: 393, h: 280 },
  { name: "Paris Match", logo: "/brand/presse/logos/paris-match.webp" , w: 324, h: 280 },
  { name: "Femme Actuelle", logo: "/brand/presse/logos/femme-actuelle.webp" , w: 343, h: 280 },
  { name: "Voici", logo: "/brand/presse/logos/voici.webp" , w: 345, h: 280 },
  { name: "Closer", logo: "/brand/presse/logos/closer.webp" , w: 471, h: 280 },
  { name: "Public", logo: "/brand/presse/logos/public.webp" , w: 407, h: 280 },
  { name: "Pleine Vie", logo: "/brand/presse/logos/pleine-vie.webp" , w: 484, h: 280 },
  { name: "Magicmaman", logo: "/brand/presse/logos/magicmaman.webp" , w: 580, h: 280 },
  { name: "Vital", logo: "/brand/presse/logos/vital.webp" , w: 378, h: 280 },
  { name: "Côté Santé", logo: "/brand/presse/logos/cote-sante.webp" , w: 268, h: 280 },
  // Titres ajoutés avec la livraison de logos du 29/08/2026, également sans URL
  // d'article communiquée.
  { name: "Cosmopolitan", logo: "/brand/presse/logos/cosmopolitan.webp" , w: 575, h: 280 },
  { name: "Avantages", logo: "/brand/presse/logos/avantages.webp" , w: 407, h: 280 },
  { name: "Fraîches", logo: "/brand/presse/logos/fraiches.webp" , w: 491, h: 280 },
  { name: "Lyon Capitale", logo: "/brand/presse/logos/lyon-capitale.webp" , w: 357, h: 280 },
  { name: "Psycho Pour Elles", logo: "/brand/presse/logos/psycho-pour-elles.webp" , w: 412, h: 280 },
  { name: "Famille Mag", logo: "/brand/presse/logos/famille-mag.webp" , w: 386, h: 280 },
  { name: "Mag'in France", logo: "/brand/presse/logos/mag-in-france.webp" , w: 603, h: 280 },
  { name: "48 Collagen Café", logo: "/brand/presse/logos/48-collagen-cafe.webp" , w: 399, h: 280 },
];

/** Retrouve un média par son nom, quelle que soit la casse d'écriture — les
 *  parutions détaillées orthographient « marie claire », la liste « Marie
 *  Claire ». */
export function pressMedia(name: string) {
  const key = name.toLowerCase();
  return PRESS.find((m) => m.name.toLowerCase() === key);
}
