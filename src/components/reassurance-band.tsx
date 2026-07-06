import { Truck, ShieldCheck, Star, HeartPulse, Leaf, RefreshCw } from "lucide-react";

/** Bande de réassurance (bas de page) — reprise de la boutique live. */
const ITEMS = [
  { icon: Truck, title: "Livraison offerte", sub: "dès 49 € d'achat" },
  { icon: ShieldCheck, title: "Paiement sécurisé", sub: "Visa, Mastercard" },
  { icon: Star, title: "+1000 clients", sub: "satisfaits" },
  { icon: RefreshCw, title: "Satisfait ou remboursé", sub: "sous 30 jours" },
  { icon: Leaf, title: "Naturel & vegan", sub: "fabriqué en France" },
  { icon: HeartPulse, title: "Dosé selon la science", sub: "actifs cliniquement dosés" },
];

export default function ReassuranceBand() {
  return (
    <section className="mt-16 sm:mt-20 bg-muted/60 border-y border-border">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[100px] py-10 sm:py-12">
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8">
          {ITEMS.map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex flex-col items-center text-center gap-2">
              <span className="grid place-items-center h-11 w-11 rounded-full bg-bien-leaf/15 text-bien-leaf">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-black leading-tight">{title}</span>
              <span className="text-xs text-black/55 leading-tight">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
