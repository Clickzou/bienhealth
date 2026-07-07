/**
 * Dictionnaire d'interface (UI) bilingue FR / EN.
 * Utilisable côté serveur ET client (pas de `server-only`).
 * Les URLs (slugs) restent identiques ; seul le texte est traduit.
 *
 * Usage : `const t = ui(lang); t.chrome.shop`
 */

export type Lang = "fr" | "en";

export const isLang = (l: string): l is Lang => l === "fr" || l === "en";

const DICT = {
  fr: {
    chrome: {
      // Barre d'offre
      offer1: "Pré-ventes MUSHGLOW ouvertes",
      offer2: "1 mousseur offert pour les 100 premières commandes",
      offerCode: "code",
      // Header / actions
      shop: "Boutique",
      search: "Rechercher",
      account: "Mon compte",
      cart: "Panier",
      menu: "Menu",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      reviewsBadge: "avis",
      // Méga-menus
      products: "Nos produits",
      about: "À propos",
      byType: "Par type de produits",
      byNeed: "Par besoin",
      brand: "La marque",
      discover: "Découvrir",
      // Liens simples
      ingredients: "Ingrédients",
      compliance: "Conformité",
      diagnostic: "Diagnostic",
      reviews: "Avis",
      blog: "Blog",
      // Sous-menu « par type »
      gummies: "Gummies",
      powders: "Poudres",
      accessories: "Accessoires",
      allProducts: "Tous les produits",
      // Sous-menu « par besoin »
      needPerformance: "Performance & Vitalité",
      needSleep: "Sommeil & Gestion du stress",
      needFocus: "Concentration & Clarté Mentale",
      needBeauty: "Beauté & Régulation Hormonale",
      // À propos
      story: "Notre histoire",
      press: "La presse en parle",
      resellers: "Nos revendeurs",
      // Réassurance
      reassurance: [
        { title: "Livraison offerte", sub: "dès 49 € d'achat" },
        { title: "Paiement sécurisé", sub: "Visa, Mastercard" },
        { title: "+1000 clients", sub: "satisfaits" },
        { title: "Satisfait ou remboursé", sub: "sous 30 jours" },
      ],
    },
    footer: {
      tagline: "Compléments naturels aux adaptogènes et champignons fonctionnels, fabriqués en France.",
      helpTitle: "Aide",
      contact: "Contact",
      shipping: "Livraison",
      returns: "Retours",
      faq: "FAQ",
      legalTitle: "Légal",
      compliance: "Conformité & certifications",
      legalNotice: "Mentions légales",
      cgv: "CGV",
      privacy: "Confidentialité",
      cookies: "Cookies",
      sitemap: "Plan du site",
      languageTitle: "Langue",
      socialTitle: "Réseau social",
      newsletterTitle: "Rejoignez la newsletter",
      newsletterText: "Conseils bien-être, nouveautés et offres exclusives — et −10 % sur votre première commande.",
      newsletterPlaceholder: "Votre adresse email",
      newsletterCta: "S'inscrire",
      newsletterLoading: "Un instant…",
      newsletterDone: "Merci ! Surveillez votre boîte mail.",
      newsletterConsent: "En vous inscrivant, vous acceptez de recevoir nos emails. Désinscription à tout moment.",
      disclaimer:
        "Compléments alimentaires. Ne se substituent pas à une alimentation variée et équilibrée. Ne pas dépasser la dose journalière recommandée. Allégations conformes au règlement EFSA.",
      rights: "© 2026 BIEN Health France — Tous droits réservés.",
    },
  },
  en: {
    chrome: {
      offer1: "MUSHGLOW pre-orders now open",
      offer2: "Free milk frother for the first 100 orders",
      offerCode: "code",
      shop: "Shop",
      search: "Search",
      account: "My account",
      cart: "Cart",
      menu: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      reviewsBadge: "reviews",
      products: "Our products",
      about: "About",
      byType: "By product type",
      byNeed: "By need",
      brand: "The brand",
      discover: "Discover",
      ingredients: "Ingredients",
      compliance: "Compliance",
      diagnostic: "Diagnostic",
      reviews: "Reviews",
      blog: "Blog",
      gummies: "Gummies",
      powders: "Powders",
      accessories: "Accessories",
      allProducts: "All products",
      needPerformance: "Performance & Vitality",
      needSleep: "Sleep & Stress management",
      needFocus: "Focus & Mental clarity",
      needBeauty: "Beauty & Hormonal balance",
      story: "Our story",
      press: "As seen in the press",
      resellers: "Our resellers",
      reassurance: [
        { title: "Free shipping", sub: "on orders over €49" },
        { title: "Secure payment", sub: "Visa, Mastercard" },
        { title: "+1000 customers", sub: "satisfied" },
        { title: "Money-back guarantee", sub: "within 30 days" },
      ],
    },
    footer: {
      tagline: "Natural supplements with adaptogens and functional mushrooms, made in France.",
      helpTitle: "Help",
      contact: "Contact",
      shipping: "Shipping",
      returns: "Returns",
      faq: "FAQ",
      legalTitle: "Legal",
      compliance: "Compliance & certifications",
      legalNotice: "Legal notice",
      cgv: "Terms of sale",
      privacy: "Privacy",
      cookies: "Cookies",
      sitemap: "Sitemap",
      languageTitle: "Language",
      socialTitle: "Social media",
      newsletterTitle: "Join the newsletter",
      newsletterText: "Wellness tips, new products and exclusive offers — plus −10% off your first order.",
      newsletterPlaceholder: "Your email address",
      newsletterCta: "Subscribe",
      newsletterLoading: "One moment…",
      newsletterDone: "Thank you! Check your inbox.",
      newsletterConsent: "By subscribing, you agree to receive our emails. Unsubscribe anytime.",
      disclaimer:
        "Food supplements. Do not replace a varied and balanced diet. Do not exceed the recommended daily dose. Claims comply with EFSA regulation.",
      rights: "© 2026 BIEN Health France — All rights reserved.",
    },
  },
} as const;

export function ui(lang: string) {
  return DICT[isLang(lang) ? lang : "fr"];
}
