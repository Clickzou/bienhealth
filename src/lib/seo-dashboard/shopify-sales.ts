/**
 * Ventes réelles, lues dans l'administration Shopify (Admin GraphQL API).
 *
 * Analytics ne peut pas mesurer le chiffre d'affaires de ce site : le paiement
 * se conclut sur `shop.bien.health`, hors du domaine mesuré. Les seules ventes
 * exactes sont donc celles que Shopify connaît, et c'est ce module qui va les
 * chercher.
 *
 * ## Authentification — attention aux tutoriels périmés
 *
 * Depuis le 1er janvier 2026, Shopify a supprimé les « custom apps » de l'admin
 * et avec elles le jeton statique `shpat_…`. Toute documentation décrivant
 * « Développer des applications → Installer → révéler le jeton » ne s'applique
 * plus. Une app créée dans le Dev Dashboard s'authentifie par **client
 * credentials** : on échange l'identifiant et le secret contre un jeton d'accès
 * valable 24 heures, renouvelé ici automatiquement.
 *
 * Prérequis, dans cet ordre :
 *   1. l'app doit être **installée sur la boutique** (Dev Dashboard → page Home
 *      de l'app → Install app). Sans cette étape, l'échange répond
 *      `app_not_installed` — c'est le symptôme, et le seul, d'une app créée mais
 *      jamais installée ; le secret peut être parfaitement valide ;
 *   2. `SHOPIFY_APP_CLIENT_ID` et `SHOPIFY_APP_CLIENT_SECRET` dans Vercel et
 *      dans `.env.local` ;
 *   3. les scopes `read_orders` (et `read_products` pour les libellés).
 *
 * ## Limite d'historique
 *
 * `read_orders` seul ne donne accès qu'aux **60 derniers jours** de commandes.
 * Au-delà, Shopify demande `read_all_orders`, soumis à son approbation. Le module
 * ne devine pas : il **demande à Shopify les scopes réellement accordés** à
 * l'installation et adapte la fenêtre en conséquence. Tant que `read_all_orders`
 * n'est pas accordé, les périodes « 3 mois » et « 12 mois » sont tronquées à
 * soixante jours et `truncated` le signale, plutôt que de laisser croire à un
 * effondrement des ventes.
 */
import type { Period } from "./periods";

const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2025-04";

/** Fenêtre par défaut de `read_orders`. Au-delà, Shopify exige `read_all_orders`. */
const HISTORY_DAYS = 60;

function storeDomain(): string {
  return (process.env.SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/+$/, "").trim();
}

function clientId(): string {
  return (process.env.SHOPIFY_APP_CLIENT_ID || "").trim();
}

function clientSecret(): string {
  return (process.env.SHOPIFY_APP_CLIENT_SECRET || "").trim();
}

export function isShopifySalesConfigured(): boolean {
  return storeDomain() !== "" && clientId() !== "" && clientSecret() !== "";
}

/**
 * Pourquoi la carte des ventes n'affiche rien. Le message dépend de la cause :
 * une app non installée et un secret erroné demandent deux gestes différents,
 * et les confondre fait tourner en rond pendant des heures.
 */
export type ShopifyStatus =
  | "ok"
  | "not-configured"
  | "app-not-installed"
  | "bad-credentials"
  | "forbidden"
  | "error";

export type ShopifySalesTotals = {
  orders: number;
  revenue: number;
  averageOrder: number;
  items: number;
  currency: string;
};

export type ShopifySales = {
  totals: ShopifySalesTotals;
  previousTotals: ShopifySalesTotals;
  /** Une entrée par jour de la période courante, en heure de Paris. */
  daily: { date: string; orders: number; revenue: number }[];
  topProducts: { title: string; quantity: number; revenue: number }[];
  /** Vrai quand la période demandée dépasse l'historique autorisé. */
  truncated: boolean;
  /** Vrai si la pagination a buté sur sa borne : le total est alors partiel. */
  capped: boolean;
  /** Premier jour réellement couvert quand `truncated` est vrai. */
  coveredFrom: string | null;
};

export type ShopifySalesResult = { status: ShopifyStatus; data: ShopifySales | null };

/* ------------------------------------------------------------------ jeton */

/** Jeton d'accès, valable 24 h côté Shopify ; on le renouvelle une minute avant. */
let cachedToken: { token: string; expiresAt: number } | null = null;
/** Dernière cause d'échec de l'échange, pour distinguer les messages. */
let lastTokenError: ShopifyStatus = "error";

async function adminToken(): Promise<string | null> {
  if (!isShopifySalesConfigured()) {
    lastTokenError = "not-configured";
    return null;
  }
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  try {
    const res = await fetch(`https://${storeDomain()}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        client_id: clientId(),
        client_secret: clientSecret(),
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      // Shopify renvoie une page HTML dont le titre porte la cause exacte.
      const body = await res.text();
      lastTokenError = /app_not_installed/i.test(body)
        ? "app-not-installed"
        : /invalid_request|invalid_client|unauthorized_client/i.test(body)
          ? "bad-credentials"
          : "error";
      return null;
    }

    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) {
      lastTokenError = "error";
      return null;
    }

    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + Math.max(60, (data.expires_in ?? 86400) - 60) * 1000,
    };
    return cachedToken.token;
  } catch {
    lastTokenError = "error";
    return null;
  }
}

/* -------------------------------------------------------------- requêtes */

type GraphQlResponse<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

async function adminGraphQl<T>(query: string, variables: Record<string, unknown>): Promise<GraphQlResponse<T> | null> {
  const token = await adminToken();
  if (!token) return null;

  try {
    const res = await fetch(`https://${storeDomain()}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      // Le jeton a pu être révoqué entre deux lectures : on le jette pour que
      // l'appel suivant en redemande un plutôt que de rejouer un jeton mort.
      cachedToken = null;
      lastTokenError = "forbidden";
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as GraphQlResponse<T>;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- scopes */

const SCOPES_QUERY = `
  query DashboardScopes {
    currentAppInstallation {
      accessScopes { handle }
    }
  }
`;

type ScopesResponse = { currentAppInstallation: { accessScopes: { handle: string }[] } | null };

/** Scopes réellement accordés, en cache : ils ne changent qu'à une réinstallation. */
let cachedScopes: string[] | null = null;

async function grantedScopes(): Promise<string[]> {
  if (cachedScopes) return cachedScopes;
  const res = await adminGraphQl<ScopesResponse>(SCOPES_QUERY, {});
  const handles = res?.data?.currentAppInstallation?.accessScopes?.map((s) => s.handle);
  if (!handles?.length) return [];
  cachedScopes = handles;
  return handles;
}

/**
 * Vrai quand l'app peut lire tout l'historique. On interroge Shopify plutôt que
 * de recopier la liste des scopes demandés : ce qui compte est ce qui a été
 * *accordé*, et `read_all_orders` peut très bien être demandé sans être obtenu.
 */
export async function hasFullOrderHistory(): Promise<boolean> {
  return (await grantedScopes()).includes("read_all_orders");
}

/* ----------------------------------------------------------------- dates */

/** Décalage horaire de Paris ce jour-là, « +02:00 » l'été, « +01:00 » l'hiver. */
function parisOffset(isoDate: string): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "longOffset",
  }).format(new Date(`${isoDate}T12:00:00Z`));
  const match = formatted.match(/GMT([+-]\d{2}:\d{2})/);
  return match ? match[1] : "+01:00";
}

/** Jour civil parisien d'un instant ISO — c'est la journée du commerçant, pas celle d'UTC. */
function parisDay(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(new Date(iso));
}

/** Borne de recherche Shopify : la journée parisienne complète, fuseau compris. */
function range(start: string, end: string): string {
  return `created_at:>='${start}T00:00:00${parisOffset(start)}' AND created_at:<='${end}T23:59:59${parisOffset(end)}'`;
}

/* ------------------------------------------------------------- agrégation */

type OrderNode = {
  createdAt: string;
  test: boolean;
  cancelledAt: string | null;
  currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } } | null;
  lineItems: { nodes: { title: string; currentQuantity: number; discountedTotalSet: { shopMoney: { amount: string } } | null }[] };
};

const ORDERS_QUERY = `
  query DashboardOrders($first: Int!, $after: String, $q: String!) {
    orders(first: $first, after: $after, query: $q, sortKey: CREATED_AT) {
      pageInfo { hasNextPage endCursor }
      nodes {
        createdAt
        test
        cancelledAt
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        lineItems(first: 20) {
          nodes {
            title
            currentQuantity
            discountedTotalSet { shopMoney { amount } }
          }
        }
      }
    }
  }
`;

/** Une commande annulée ou passée en mode test n'est pas un chiffre d'affaires. */
function counts(order: OrderNode): boolean {
  return !order.test && !order.cancelledAt;
}

type OrdersPage = {
  orders: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: OrderNode[] };
};

/** Vingt-cinq pages de cent commandes. Une borne dure vaut mieux qu'une boucle
 *  qui paginerait indéfiniment sur une API tierce ; `capped` dit si on l'a
 *  atteinte, pour que l'écran ne présente jamais un total incomplet comme
 *  complet. */
const MAX_PAGES = 25;

async function fetchOrders(start: string, end: string): Promise<{ orders: OrderNode[]; capped: boolean } | null> {
  const all: OrderNode[] = [];
  let after: string | null = null;
  let capped = false;

  for (let page = 0; page < MAX_PAGES; page++) {
    // Le curseur passe par une variable typée à part : glissé directement dans
    // l'objet de variables, il enferme TypeScript dans un cycle d'inférence
    // (le type de la réponse dépendrait de l'argument qu'elle produit).
    const variables: Record<string, unknown> = { first: 100, after, q: range(start, end) };
    const res: GraphQlResponse<OrdersPage> | null = await adminGraphQl<OrdersPage>(ORDERS_QUERY, variables);

    if (!res) return null;
    if (res.errors?.length) {
      const denied = res.errors.some((e) => /access denied|not approved|permission/i.test(e.message));
      if (denied) lastTokenError = "forbidden";
      return null;
    }

    const orders: OrdersPage["orders"] | undefined = res.data?.orders;
    if (!orders) return null;

    all.push(...orders.nodes);
    if (!orders.pageInfo.hasNextPage) break;
    after = orders.pageInfo.endCursor;
    capped = page === MAX_PAGES - 1;
  }

  return { orders: all, capped };
}

function totalsOf(orders: OrderNode[]): ShopifySalesTotals {
  let revenue = 0;
  let items = 0;
  let currency = "EUR";

  for (const order of orders) {
    const money = order.currentTotalPriceSet?.shopMoney;
    revenue += Number(money?.amount ?? 0);
    if (money?.currencyCode) currency = money.currencyCode;
    for (const line of order.lineItems.nodes) items += line.currentQuantity ?? 0;
  }

  return {
    orders: orders.length,
    revenue,
    averageOrder: orders.length ? revenue / orders.length : 0,
    items,
    currency,
  };
}

/**
 * Ventes de la période et de la période de comparaison.
 *
 * Renvoie toujours un statut : le tableau de bord affiche une marche à suivre
 * quand la source n'est pas joignable, et jamais de chiffres inventés.
 */
export async function fetchShopifySales(period: Period): Promise<ShopifySalesResult> {
  if (!isShopifySalesConfigured()) return { status: "not-configured", data: null };

  // Sans `read_all_orders`, l'historique s'arrête à soixante jours : demander
  // plus ne renvoie pas d'erreur, seulement un vide silencieux qu'on prendrait
  // pour une chute des ventes.
  const full = await hasFullOrderHistory();
  const limit = new Date();
  limit.setUTCDate(limit.getUTCDate() - HISTORY_DAYS);
  const floor = full ? "" : limit.toISOString().slice(0, 10);

  const truncated = !full && period.current.start < floor;
  const currentStart = truncated ? floor : period.current.start;

  const [current, previous] = await Promise.all([
    fetchOrders(currentStart, period.current.end),
    // Inutile d'interroger une période de comparaison entièrement hors historique.
    !full && period.previous.end < floor
      ? Promise.resolve({ orders: [], capped: false })
      : fetchOrders(period.previous.start, period.previous.end),
  ]);

  if (!current) return { status: lastTokenError, data: null };

  const kept = current.orders.filter(counts);
  const byDay = new Map<string, { orders: number; revenue: number }>();
  const byProduct = new Map<string, { quantity: number; revenue: number }>();

  for (const order of kept) {
    const day = parisDay(order.createdAt);
    const slot = byDay.get(day) ?? { orders: 0, revenue: 0 };
    slot.orders += 1;
    slot.revenue += Number(order.currentTotalPriceSet?.shopMoney.amount ?? 0);
    byDay.set(day, slot);

    for (const line of order.lineItems.nodes) {
      if (!line.currentQuantity) continue;
      const entry = byProduct.get(line.title) ?? { quantity: 0, revenue: 0 };
      entry.quantity += line.currentQuantity;
      entry.revenue += Number(line.discountedTotalSet?.shopMoney.amount ?? 0);
      byProduct.set(line.title, entry);
    }
  }

  return {
    status: "ok",
    data: {
      totals: totalsOf(kept),
      previousTotals: totalsOf((previous?.orders ?? []).filter(counts)),
      daily: [...byDay.entries()]
        .map(([date, v]) => ({ date, ...v }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      topProducts: [...byProduct.entries()]
        .map(([title, v]) => ({ title, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10),
      truncated,
      capped: current.capped,
      coveredFrom: truncated ? currentStart : null,
    },
  };
}
