/**
 * Ventes réelles — Shopify Admin API (GraphQL).
 *
 * Le tunnel de paiement est hébergé par Shopify : le site ne voit jamais une
 * commande passer, et GA4 ne mesure donc aucun achat tant que le canal
 * Facebook/Google n'est pas configuré côté boutique. La seule source fiable du
 * chiffre d'affaires est l'Admin API.
 *
 * Elle exige un jeton **différent** du jeton Storefront déjà en place : une app
 * personnalisée dans l'admin Shopify (Paramètres → Applications et canaux de
 * vente → Développer des applications), avec le scope `read_orders`, donne un
 * jeton `shpat_…` à mettre dans SHOPIFY_ADMIN_API_TOKEN. Sans lui, la carte
 * « Ventes » affiche son mode d'emploi plutôt que des chiffres inventés.
 *
 * Les commandes sont paginées par 250 et plafonnées à 1 000 : au-delà, le
 * tableau de bord mettrait plusieurs secondes à s'afficher. Le plafond est
 * signalé dans le retour (`truncated`) pour ne pas présenter un total partiel
 * comme un total.
 */
const MAX_ORDERS = 1000;
const PAGE_SIZE = 250;

const domain = () => process.env.SHOPIFY_STORE_DOMAIN;
const adminToken = () => process.env.SHOPIFY_ADMIN_API_TOKEN;
const version = () => process.env.SHOPIFY_ADMIN_API_VERSION ?? process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-04";

export function isSalesConfigured(): boolean {
  return Boolean(domain() && adminToken());
}

export type SalesTotals = {
  orders: number;
  revenue: number;
  averageOrder: number;
  items: number;
  currency: string;
  truncated: boolean;
};

export type SalesData = {
  current: SalesTotals;
  previous: SalesTotals;
  /** Chiffre d'affaires par jour, pour la courbe. */
  daily: { date: string; revenue: number; orders: number }[];
  /** Produits les plus vendus sur la période, par quantité. */
  products: { title: string; quantity: number; revenue: number }[];
};

type OrderNode = {
  processedAt: string;
  currentTotalPriceSet?: { shopMoney?: { amount?: string; currencyCode?: string } };
  lineItems?: { nodes?: { title?: string; quantity?: number; originalTotalSet?: { shopMoney?: { amount?: string } } }[] };
};

type OrdersResponse = {
  data?: { orders?: { nodes?: OrderNode[]; pageInfo?: { hasNextPage?: boolean; endCursor?: string } } };
  errors?: unknown;
};

const ORDERS_QUERY = `
  query Orders($first: Int!, $after: String, $query: String!) {
    orders(first: $first, after: $after, query: $query, sortKey: PROCESSED_AT) {
      nodes {
        processedAt
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        lineItems(first: 25) {
          nodes { title quantity originalTotalSet { shopMoney { amount } } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

async function fetchOrders(start: string, end: string): Promise<{ orders: OrderNode[]; truncated: boolean } | null> {
  const host = domain();
  const token = adminToken();
  if (!host || !token) return null;

  const orders: OrderNode[] = [];
  let after: string | undefined;
  let truncated = false;

  // `financial_status:paid` écarte les commandes annulées ou en attente : on
  // affiche le chiffre d'affaires encaissé, pas les paniers abandonnés.
  const filter = `processed_at:>='${start}' AND processed_at:<='${end}' AND financial_status:paid`;

  while (orders.length < MAX_ORDERS) {
    let json: OrdersResponse;
    try {
      const res = await fetch(`https://${host}/admin/api/${version()}/graphql.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
        body: JSON.stringify({ query: ORDERS_QUERY, variables: { first: PAGE_SIZE, after, query: filter } }),
        cache: "no-store",
      });
      if (!res.ok) return null;
      json = (await res.json()) as OrdersResponse;
    } catch {
      return null;
    }
    if (json.errors && !json.data?.orders) return null;

    const page = json.data?.orders;
    orders.push(...(page?.nodes ?? []));
    if (!page?.pageInfo?.hasNextPage) break;
    after = page.pageInfo.endCursor;
    if (orders.length >= MAX_ORDERS) truncated = true;
  }

  return { orders, truncated };
}

function totals(orders: OrderNode[], truncated: boolean): SalesTotals {
  let revenue = 0;
  let items = 0;
  let currency = "EUR";

  for (const order of orders) {
    const money = order.currentTotalPriceSet?.shopMoney;
    revenue += Number(money?.amount ?? 0);
    if (money?.currencyCode) currency = money.currencyCode;
    for (const line of order.lineItems?.nodes ?? []) items += line.quantity ?? 0;
  }

  return {
    orders: orders.length,
    revenue,
    averageOrder: orders.length ? revenue / orders.length : 0,
    items,
    currency,
    truncated,
  };
}

export async function fetchSales(period: {
  current: { start: string; end: string };
  previous: { start: string; end: string };
}): Promise<SalesData | null> {
  if (!isSalesConfigured()) return null;

  const [cur, prev] = await Promise.all([
    fetchOrders(period.current.start, period.current.end),
    fetchOrders(period.previous.start, period.previous.end),
  ]);
  if (!cur) return null;

  const daily = new Map<string, { revenue: number; orders: number }>();
  const products = new Map<string, { quantity: number; revenue: number }>();

  for (const order of cur.orders) {
    const day = order.processedAt.slice(0, 10);
    const bucket = daily.get(day) ?? { revenue: 0, orders: 0 };
    bucket.revenue += Number(order.currentTotalPriceSet?.shopMoney?.amount ?? 0);
    bucket.orders += 1;
    daily.set(day, bucket);

    for (const line of order.lineItems?.nodes ?? []) {
      const title = line.title ?? "—";
      const entry = products.get(title) ?? { quantity: 0, revenue: 0 };
      entry.quantity += line.quantity ?? 0;
      entry.revenue += Number(line.originalTotalSet?.shopMoney?.amount ?? 0);
      products.set(title, entry);
    }
  }

  return {
    current: totals(cur.orders, cur.truncated),
    previous: totals(prev?.orders ?? [], prev?.truncated ?? false),
    daily: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v })),
    products: [...products.entries()]
      .map(([title, v]) => ({ title, ...v }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10),
  };
}
