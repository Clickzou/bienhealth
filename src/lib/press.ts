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
export const PRESS: { name: string; logo: string; href?: string }[] = [
  { name: "Do It In Paris", logo: "/brand/presse/logos/do-it-in-paris.webp", href: "https://www.doitinparis.com/fr/boissons-detox-paris-27378" },
  { name: "Marie Claire", logo: "/brand/presse/logos/marie-claire.webp", href: "https://avis-beaute.marieclaire.fr/stress-ces-gummies-vont-devenir-vos-meilleurs-allies-pour-retrouver-calme-et-serenite,16515.asp" },
  { name: "Grazia", logo: "/brand/presse/logos/grazia.webp", href: "https://www.grazia.fr/beaute/forme-minceur/la-science-est-formelle-ces-plantes-meconnues-permettent-de-dire-adieu-au-stress-a-vous-le-meilleur-equilibre-emotionnel-1220480.html" },
  { name: "Psychologies", logo: "/brand/presse/logos/psychologies.webp", href: "https://www.psychologies.com/bien-etre/stress/gestion-du-stress/Voici-le-nouvel-allie-anti-stress-dont-tout-le-monde-parle-et-ce-nest-pas-du-magnesium-622813" },
  { name: "Gala", logo: "/brand/presse/logos/gala.webp", href: "https://photo.gala.fr/mode/tendances_mode/shopping-stanley-lululemon-alo-les-32-cadeaux-les-plus-desirables-a-offrir-a-un-sportif-pour-les-fetes-20251210#photo-10" },
  { name: "L'Officiel", logo: "/brand/presse/logos/lofficiel.webp", href: "https://www.lofficiel.com/beaute/10-produits-de-beaute-a-acheter-en-janvier-2026" },
  { name: "BIBA", logo: "/brand/presse/logos/biba.webp", href: "https://www.bibamagazine.fr/lifestyle/sante/adieu-le-cafe-cette-boisson-naturelle-a-base-de-champignons-est-le-secret-pour-se-reveiller-sans-doper-son-cortisol-498845.html" },
  { name: "Sud Radio", logo: "/brand/presse/logos/sud-radio.webp", href: "https://www.sudradio.fr/emission/cest-ca-la-france-378" },
  { name: "Beauté test", logo: "/brand/presse/logos/beaute-test.webp", href: "https://www.beaute-test.com/mag/jai-teste-pour-vous-ces-gummies-anti-stress-sans-melatonine-qui-apaisent-vraiment.php" },
  { name: "Snake & Twist", logo: "/brand/presse/logos/snake-twist.webp", href: "https://www.instagram.com/p/DUIVTzWjQAn/?igsh=MTU0dXNnZ2hnOTJ6cg%3D%3D" },
  // Parutions papier : le client les a listées « PRINT, cf dossier », sans URL.
  // Elles restent affichées mais non cliquables.
  { name: "ELLE", logo: "/brand/presse/logos/elle.webp" },
  { name: "Paris Match", logo: "/brand/presse/logos/paris-match.webp" },
  { name: "Femme Actuelle", logo: "/brand/presse/logos/femme-actuelle.webp" },
  { name: "Voici", logo: "/brand/presse/logos/voici.webp" },
  { name: "Closer", logo: "/brand/presse/logos/closer.webp" },
  { name: "Public", logo: "/brand/presse/logos/public.webp" },
  { name: "Pleine Vie", logo: "/brand/presse/logos/pleine-vie.webp" },
  { name: "Magicmaman", logo: "/brand/presse/logos/magicmaman.webp" },
  { name: "Vital", logo: "/brand/presse/logos/vital.webp" },
  { name: "Côté Santé", logo: "/brand/presse/logos/cote-sante.webp" },
  // Titres ajoutés avec la livraison de logos du 29/08/2026, également sans URL
  // d'article communiquée.
  { name: "Cosmopolitan", logo: "/brand/presse/logos/cosmopolitan.webp" },
  { name: "Avantages", logo: "/brand/presse/logos/avantages.webp" },
  { name: "Gazelle", logo: "/brand/presse/logos/gazelle.webp" },
  { name: "Fraîches", logo: "/brand/presse/logos/fraiches.webp" },
  { name: "Lyon Capitale", logo: "/brand/presse/logos/lyon-capitale.webp" },
  { name: "Les Nouvelles Esthétiques", logo: "/brand/presse/logos/nouvelles-esthetiques.webp" },
  { name: "Psycho Pour Elles", logo: "/brand/presse/logos/psycho-pour-elles.webp" },
  { name: "Famille Mag", logo: "/brand/presse/logos/famille-mag.webp" },
  { name: "BiG média", logo: "/brand/presse/logos/big-media.webp" },
  { name: "Fresh Magazine", logo: "/brand/presse/logos/fresh-magazine.webp" },
  { name: "TheDreamTeam", logo: "/brand/presse/logos/thedreamteam.webp" },
  { name: "Mesinfos", logo: "/brand/presse/logos/mesinfos.webp" },
  { name: "Mag'in France", logo: "/brand/presse/logos/mag-in-france.webp" },
];

/** Retrouve un média par son nom, quelle que soit la casse d'écriture — les
 *  parutions détaillées orthographient « marie claire », la liste « Marie
 *  Claire ». */
export function pressMedia(name: string) {
  const key = name.toLowerCase();
  return PRESS.find((m) => m.name.toLowerCase() === key);
}
