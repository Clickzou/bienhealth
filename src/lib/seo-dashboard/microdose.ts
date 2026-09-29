import "server-only";

/**
 * Onglet « Microdose » du tableau de bord : bien-microdose.com, second site de BIEN.
 *
 * Mêmes blocs que l'onglet BIEN Health, trois sources différentes :
 * - Analytics : la propriété GA4 de bien-microdose.com (`MICRODOSE_GA4_PROPERTY_ID`,
 *   identifiant numérique), lue avec le même compte de service Google ;
 * - Search Console : `MICRODOSE_GSC_SITE_URL`, par défaut `sc-domain:bien-microdose.com` ;
 * - Ventes : pas de Shopify côté Microdose — le paiement passe par le site, les
 *   commandes sont dans sa base Supabase. On les lit via son point d'accès
 *   `/api/seo/sales`, protégé par un jeton partagé (`MICRODOSE_DASHBOARD_TOKEN`,
 *   même valeur que `SEO_DASHBOARD_API_TOKEN` sur le projet Microdose). La clé de
 *   service de la base Microdose ne quitte donc jamais son projet.
 */

export function microdoseGa4PropertyId(): string {
  return (process.env.MICRODOSE_GA4_PROPERTY_ID || "").replace(/^properties\//, "").trim();
}

export function microdoseGscSiteUrl(): string {
  return process.env.MICRODOSE_GSC_SITE_URL?.trim() || "sc-domain:bien-microdose.com";
}

/** Adresse du site Microdose : l'alias Vercel reste valable après la bascule du domaine. */
function microdoseUrl(): string {
  return (process.env.MICRODOSE_SITE_URL || "https://microdose-lyart.vercel.app").replace(/\/+$/, "");
}

export type SalesTotals = { orders: number; revenue: number; averageOrder: number; items: number; currency: string };

export type RecentOrder = {
  number: number;
  /** Jour du paiement, en heure de Paris (YYYY-MM-DD). */
  paidDay: string;
  name: string;
  country: string;
  total: number;
  status: string;
};

export type MicrodoseSales = {
  totals: SalesTotals;
  previousTotals: SalesTotals;
  refunded: { orders: number; revenue: number };
  daily: { date: string; orders: number; revenue: number }[];
  topProducts: { title: string; quantity: number; revenue: number }[];
  recent: RecentOrder[];
};

export type MicrodoseSalesStatus = "ok" | "not-configured" | "error";
export type MicrodoseSalesResult = { status: MicrodoseSalesStatus; data: MicrodoseSales | null };

/** Ventes de la période, demandées au site Microdose avec les paramètres de la page. */
export async function fetchMicrodoseSales(params: { period?: string; start?: string; end?: string }): Promise<MicrodoseSalesResult> {
  const token = process.env.MICRODOSE_DASHBOARD_TOKEN?.trim();
  if (!token) return { status: "not-configured", data: null };

  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  try {
    const res = await fetch(`${microdoseUrl()}/api/seo/sales?${q}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("seo: ventes Microdose", res.status, (await res.text()).slice(0, 200));
      return { status: res.status === 401 ? "not-configured" : "error", data: null };
    }
    return (await res.json()) as MicrodoseSalesResult;
  } catch (e) {
    console.error("seo: ventes Microdose", e);
    return { status: "error", data: null };
  }
}
