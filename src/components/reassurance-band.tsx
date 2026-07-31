import { Truck, ShieldCheck, Star, HeartPulse, Leaf, RefreshCw } from "lucide-react";
import { HAPPY_CLIENTS } from "@/lib/social-proof";
import { freeShippingAmount } from "@/lib/shipping";

/** Bande de réassurance (bas de page) — reprise de la boutique live. */
const ICONS = [Truck, ShieldCheck, Star, RefreshCw, Leaf, HeartPulse];
const ITEMS_BY_LANG = {
  fr: [
    { title: "Livraison offerte", sub: `dès ${freeShippingAmount("fr")} d'achat` },
    { title: "Paiement sécurisé", sub: "Visa, Mastercard" },
    { title: `+${HAPPY_CLIENTS} clients`, sub: "satisfaits" },
    { title: "Satisfait ou remboursé", sub: "sous 30 jours" },
    { title: "Naturel & vegan", sub: "fabriqué en France" },
    { title: "Dosé selon la science", sub: "actifs cliniquement dosés" },
  ],
  en: [
    { title: "Free shipping", sub: `on orders over ${freeShippingAmount("en")}` },
    { title: "Secure payment", sub: "Visa, Mastercard" },
    { title: `+${HAPPY_CLIENTS} customers`, sub: "satisfied" },
    { title: "Money-back guarantee", sub: "within 30 days" },
    { title: "Natural & vegan", sub: "made in France" },
    { title: "Science-based dosing", sub: "clinically dosed actives" },
  ],
} as const;

export default function ReassuranceBand({ lang = "fr" }: { lang?: string }) {
  const items = ITEMS_BY_LANG[lang === "en" ? "en" : "fr"];
  return (
    <section className="mt-16 sm:mt-20 bg-muted/60 border-y border-border">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] py-10 sm:py-12">
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8">
          {items.map(({ title, sub }, i) => {
            const Icon = ICONS[i];
            return (
            <li key={title} className="flex flex-col items-center text-center gap-2">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-bien-leaf/15 text-bien-leaf">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-black leading-tight">{title}</span>
                <span className="text-xs text-black/55 leading-tight">{sub}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
