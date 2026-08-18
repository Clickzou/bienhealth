import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Package, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import AccountAuth from "@/components/account-auth";
import AccountEdit from "@/components/account-edit";
import LogoutButton from "@/components/logout-button";
import { getCustomer, isCustomerAuthConfigured, CUSTOMER_COOKIE } from "@/lib/shopify-customer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    ...pageMetadata({
      lang,
      path: "compte",
      title: lang === "en" ? "My account | BIEN health" : "Mon compte | BIEN health",
      description: lang === "en" ? "Log in to your BIEN health account: orders, addresses and personal details." : "Connectez-vous à votre compte BIEN health : commandes, adresses et informations personnelles.",
    }),
    // Espace privé : jamais indexé.
    robots: { index: false, follow: false },
  };
}

function fmtDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
function fmtMoney(m: { amount: string; currencyCode: string }, lang: string) {
  return new Intl.NumberFormat(lang === "en" ? "en-IE" : "fr-FR", { style: "currency", currency: m.currencyCode || "EUR" }).format(Number(m.amount));
}
const FULFILLMENT: Record<string, { fr: string; en: string }> = {
  FULFILLED: { fr: "Expédiée", en: "Shipped" }, UNFULFILLED: { fr: "En préparation", en: "Preparing" },
  PARTIALLY_FULFILLED: { fr: "Partiellement expédiée", en: "Partially shipped" },
  IN_PROGRESS: { fr: "En cours", en: "In progress" }, ON_HOLD: { fr: "En attente", en: "On hold" },
  SCHEDULED: { fr: "Programmée", en: "Scheduled" }, RESTOCKED: { fr: "Réintégrée", en: "Restocked" },
};

const T = {
  fr: {
    hello: "Bonjour", welcome: "Bienvenue dans votre espace BIEN.", myOrders: "Mes commandes",
    noOrders: "Vous n'avez pas encore passé de commande.", discoverShop: "Découvrir la boutique",
    order: "Commande", track: "Suivre la commande", myInfo: "Mes informations",
  },
  en: {
    hello: "Hello", welcome: "Welcome to your BIEN account.", myOrders: "My orders",
    noOrders: "You haven't placed any orders yet.", discoverShop: "Discover the shop",
    order: "Order", track: "Track order", myInfo: "My details",
  },
} as const;

export default async function ComptePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];

  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  const customer = token && isCustomerAuthConfigured ? await getCustomer(token) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {!customer ? (
          <AccountAuth lang={lang} />
        ) : (
          <div>
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-hero text-[clamp(1.76rem,4.4vw,2.64rem)] leading-[1] text-black">
                  {t.hello}{customer.firstName ? `, ${customer.firstName}` : ""}
                </h1>
                <p className="mt-2 text-black/65">{t.welcome}</p>
              </div>
              <LogoutButton lang={lang} />
            </div>

            <div className="mt-10 grid lg:grid-cols-[1fr_300px] gap-8 items-start">
              {/* Commandes */}
              <section>
                <h2 className="font-display text-xl text-black flex items-center gap-2"><Package className="h-5 w-5 text-bien-leaf" /> {t.myOrders}</h2>
                {customer.orders.length === 0 ? (
                  <p className="mt-4 text-black/60">{t.noOrders}{" "}
                    <Link href={`/${lang}/boutique`} className="text-bien-leaf underline">{t.discoverShop}</Link>.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {customer.orders.map((o) => (
                      <li key={o.orderNumber} className="bg-card rounded-2xl ring-1 ring-border bien-shadow-sm p-5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <span className="font-display text-black">{t.order} #{o.orderNumber}</span>
                          <span className="text-sm text-black/55">{fmtDate(o.processedAt, lang)}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap text-sm">
                          <span className="inline-flex items-center rounded-full bg-bien-leaf/12 text-bien-leaf px-2.5 py-0.5 text-xs font-semibold">{FULFILLMENT[o.fulfillmentStatus]?.[en ? "en" : "fr"] ?? o.fulfillmentStatus}</span>
                          <span className="text-black/55">·</span>
                          <span className="font-semibold text-black">{fmtMoney(o.total, lang)}</span>
                        </div>
                        <p className="mt-2 text-sm text-black/70">{o.items.map((i) => `${i.quantity}× ${i.title}`).join(", ")}</p>
                        {o.statusUrl && (
                          <a href={o.statusUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bien-leaf hover:underline">
                            {t.track} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Infos */}
              <aside className="bg-card rounded-2xl ring-1 ring-border bien-shadow-sm p-5 space-y-4">
                <h2 className="font-display text-lg text-black">{t.myInfo}</h2>
                <p className="text-sm text-black/75 flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-bien-leaf shrink-0" /> {customer.email}</p>
                {customer.phone && <p className="text-sm text-black/75 flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-bien-leaf shrink-0" /> {customer.phone}</p>}
                {customer.defaultAddress && (
                  <p className="text-sm text-black/75 flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-bien-leaf shrink-0" /> <span className="whitespace-pre-line">{customer.defaultAddress.formatted.join("\n")}</span></p>
                )}
                <div className="pt-3 border-t border-border">
                  <AccountEdit customer={customer} lang={lang} />
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
