import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import { getProducts } from "@/lib/shopify-products";
import { COLLECTIONS, localizeCollection } from "@/lib/shop";
import SiteHeader from "@/components/site-header";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en"
    ? { title: "Sitemap · BIEN", description: "All the pages of the BIEN site: shop, collections, products, about, help and legal notices." }
    : { title: "Plan du site · BIEN", description: "Toutes les pages du site BIEN : boutique, collections, produits, à propos, aide et mentions légales." };
}

const T = {
  fr: {
    h1: "Plan du site", intro: "Retrouvez ici l'ensemble des pages du site BIEN.",
    shop: "Boutique", home: "Accueil", shopLink: "Boutique", products: "Produits",
    about: "À propos", story: "Notre histoire", press: "La presse en parle", resellers: "Nos revendeurs", becomeReseller: "Devenir revendeur", ingredients: "Ingrédients", compliance: "Conformité & certifications",
    help: "Aide & compte", diagnostic: "Diagnostic", reviews: "Avis clients", faq: "FAQ", blog: "Blog", account: "Mon compte", cart: "Panier",
    legal: "Légal", legalNotice: "Mentions légales", cgv: "Conditions générales de vente", privacy: "Politique de confidentialité", cookies: "Politique de cookies",
  },
  en: {
    h1: "Sitemap", intro: "Find all the pages of the BIEN site here.",
    shop: "Shop", home: "Home", shopLink: "Shop", products: "Products",
    about: "About", story: "Our story", press: "As seen in the press", resellers: "Our resellers", becomeReseller: "Become a reseller", ingredients: "Ingredients", compliance: "Compliance & certifications",
    help: "Help & account", diagnostic: "Diagnostic", reviews: "Customer reviews", faq: "FAQ", blog: "Blog", account: "My account", cart: "Cart",
    legal: "Legal", legalNotice: "Legal notice", cgv: "Terms and conditions of sale", privacy: "Privacy policy", cookies: "Cookie policy",
  },
} as const;

export default async function PlanDuSitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = T[lang === "en" ? "en" : "fr"];

  const products = await getProducts(24).catch(() => []);
  const p = (path: string) => `/${lang}${path ? `/${path}` : ""}`;

  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t.shop,
      links: [
        { label: t.home, href: p("") },
        { label: t.shopLink, href: p("boutique") },
        ...Object.values(COLLECTIONS).map((c) => ({ label: localizeCollection(c, lang).label, href: p(`collections/${c.slug}`) })),
      ],
    },
    {
      title: t.products,
      links: products.map((prod) => ({ label: prod.title, href: p(`products/${prod.handle}`) })),
    },
    {
      title: t.about,
      links: [
        { label: t.story, href: p("histoire") },
        { label: t.press, href: p("presse") },
        { label: t.resellers, href: p("revendeurs") },
        { label: t.becomeReseller, href: p("devenir-revendeur") },
        { label: t.ingredients, href: p("ingredients") },
        { label: t.compliance, href: p("certifications") },
      ],
    },
    {
      title: t.help,
      links: [
        { label: t.diagnostic, href: p("diagnostic") },
        { label: t.reviews, href: p("avis") },
        { label: t.faq, href: p("faq") },
        { label: t.blog, href: p("blog") },
        { label: t.account, href: p("compte") },
        { label: t.cart, href: p("cart") },
      ],
    },
    {
      title: t.legal,
      links: [
        { label: t.legalNotice, href: p("mentions-legales") },
        { label: t.cgv, href: p("cgv") },
        { label: t.privacy, href: p("confidentialite") },
        { label: t.cookies, href: p("cookies") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h1 className="font-display font-black tracking-tighter text-[clamp(2rem,5vw,3.25rem)] leading-[1] text-black">{t.h1}</h1>
        <p className="mt-3 text-black/65">{t.intro}</p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="font-display font-black text-lg text-black border-b border-border pb-2">{g.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-black/75 hover:text-bien-leaf hover:underline transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
