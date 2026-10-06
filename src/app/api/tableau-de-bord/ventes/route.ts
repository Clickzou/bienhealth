import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  adminGraphQl,
  hasFullOrderHistory,
  isShopifySalesConfigured,
  type GraphQlResponse,
} from "@/lib/seo-dashboard/shopify-sales";

/**
 * GET /api/tableau-de-bord/ventes?du=YYYY-MM-DD&au=YYYY-MM-DD — les ventes de
 * la période pour le tableau de bord client Clickzou (carte « Ventes et
 * chiffre d'affaires »). Lecture seule.
 *
 * Accès : `Authorization: Bearer <TABLEAU_DE_BORD_CLE>`, comparé à temps
 * constant. Clé absente ou de moins de 32 caractères : 503, plutôt qu'une API
 * ouverte par oubli.
 *
 * Source et périmètre de l'onglet Ventes de /seo (`shopify-sales.ts`) : l'API
 * Admin Shopify, via la même app ; commandes du site seul (source « web »),
 * hors commandes de test et annulées. En plus de ce qu'affiche /seo, seules les
 * commandes réellement payées comptent (statut financier), et le CA est ce qui
 * a été encaissé moins ce qui a été remboursé — pas le total commandé.
 *
 * Aucune donnée client ne sort : la requête ne demande ni nom, ni e-mail, ni
 * adresse.
 */
export const dynamic = "force-dynamic";

const JOURS_MAX = 400;
const MAX_PAGES = 40;
/** `read_orders` seul : soixante jours d'historique (cf. shopify-sales.ts). */
const JOURS_HISTORIQUE = 60;
const ENTETES = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

/** Statuts financiers d'une commande dont l'argent a été (au moins en partie) encaissé. */
const PAYEES = new Set(["PAID", "PARTIALLY_PAID", "PARTIALLY_REFUNDED", "REFUNDED"]);

type Montant = { shopMoney: { amount: string; currencyCode: string } } | null;
type Commande = {
  createdAt: string;
  test: boolean;
  cancelledAt: string | null;
  sourceName: string | null;
  displayFinancialStatus: string | null;
  totalReceivedSet: Montant;
  totalRefundedSet: Montant;
};
type Page = { orders: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: Commande[] } };
type Boutique = { shop: { currencyCode: string } };

const REQUETE = `
  query TableauDeBordVentes($first: Int!, $after: String, $q: String!) {
    orders(first: $first, after: $after, query: $q, sortKey: CREATED_AT) {
      pageInfo { hasNextPage endCursor }
      nodes {
        createdAt
        test
        cancelledAt
        sourceName
        displayFinancialStatus
        totalReceivedSet { shopMoney { amount currencyCode } }
        totalRefundedSet { shopMoney { amount currencyCode } }
      }
    }
  }
`;

const reponse = (corps: unknown, status = 200) => NextResponse.json(corps, { status, headers: ENTETES });

const jourParis = (iso: string) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(new Date(iso));

const centimes = (m: Montant) => Math.round(Number(m?.shopMoney.amount ?? 0) * 100);

function dateValide(texte: string | null): Date | null {
  if (!texte || !/^\d{4}-\d{2}-\d{2}$/.test(texte)) return null;
  const d = new Date(`${texte}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== texte ? null : d;
}

function autorise(req: Request, cle: string): boolean {
  const attendu = Buffer.from(`Bearer ${cle}`);
  const donne = Buffer.from(req.headers.get("authorization") ?? "");
  return attendu.length === donne.length && timingSafeEqual(attendu, donne);
}

const jourFr = (iso: string) => iso.split("-").reverse().join("/");

export async function GET(req: Request) {
  const cle = process.env.TABLEAU_DE_BORD_CLE;
  if (!cle || cle.length < 32) return reponse({ erreur: "Accès non configuré" }, 503);
  if (!autorise(req, cle)) return reponse({ erreur: "Non autorisé" }, 401);

  const q = new URL(req.url).searchParams;
  const du = dateValide(q.get("du"));
  const au = dateValide(q.get("au"));
  if (!du || !au || au < du) return reponse({ erreur: "Paramètres du et au attendus (YYYY-MM-DD, du ≤ au)" }, 400);
  if (Math.round((au.getTime() - du.getTime()) / 86_400_000) + 1 > JOURS_MAX) {
    return reponse({ erreur: `Période limitée à ${JOURS_MAX} jours` }, 400);
  }
  if (!isShopifySalesConfigured()) return reponse({ erreur: "Shopify non configuré" }, 503);

  const debut = q.get("du")!;
  const fin = q.get("au")!;

  // La devise de la boutique est la devise principale ; les autres ne sont pas converties.
  const boutique = await adminGraphQl<Boutique>(`query { shop { currencyCode } }`, {});
  const devise = boutique?.data?.shop?.currencyCode;
  if (!devise) return reponse({ erreur: "Shopify n'a pas répondu" }, 502);

  // Sans `read_all_orders`, Shopify ne rend que soixante jours, et un vide
  // silencieux au-delà : on borne, et `definition` le dit.
  let plancher: string | null = null;
  if (!(await hasFullOrderHistory())) {
    const limite = new Date();
    limite.setUTCDate(limite.getUTCDate() - JOURS_HISTORIQUE);
    const l = limite.toISOString().slice(0, 10);
    if (debut < l) plancher = l;
  }

  // Un jour de marge de chaque côté ; le tri exact se fait sur le jour parisien.
  const de = new Date(du.getTime() - 86_400_000).toISOString();
  const a = new Date(au.getTime() + 2 * 86_400_000).toISOString();
  const recherche = `created_at:>='${de}' AND created_at:<'${a}'`;

  const commandes: Commande[] = [];
  let apres: string | null = null;
  for (let page = 0; ; page++) {
    if (page === MAX_PAGES) return reponse({ erreur: "Trop de commandes sur la période" }, 502);
    const variables: Record<string, unknown> = { first: 100, after: apres, q: recherche };
    const res: GraphQlResponse<Page> | null = await adminGraphQl<Page>(REQUETE, variables);
    const lot: Page["orders"] | undefined = res?.data?.orders;
    if (!lot || res?.errors?.length) {
      console.error("tableau-de-bord: lecture Shopify", res?.errors);
      return reponse({ erreur: "Shopify n'a pas répondu" }, 502);
    }
    commandes.push(...lot.nodes);
    if (!lot.pageInfo.hasNextPage) break;
    apres = lot.pageInfo.endCursor;
  }

  const parJour = new Map<string, { ventes: number; centimes: number }>();
  for (let t = du.getTime(); t <= au.getTime(); t += 86_400_000) {
    parJour.set(new Date(t).toISOString().slice(0, 10), { ventes: 0, centimes: 0 });
  }

  let autresDevises = 0;
  for (const c of commandes) {
    const jour = parJour.get(jourParis(c.createdAt));
    if (!jour) continue;
    if (c.test || c.cancelledAt) continue;
    if (c.sourceName && c.sourceName !== "web") continue;
    if (!PAYEES.has(c.displayFinancialStatus ?? "")) continue;
    if ((c.totalReceivedSet?.shopMoney.currencyCode ?? devise) !== devise) {
      autresDevises += 1;
      continue;
    }
    const net = centimes(c.totalReceivedSet) - centimes(c.totalRefundedSet);
    if (net <= 0) continue; // intégralement remboursée
    jour.ventes += 1;
    jour.centimes += net;
  }

  const jours = [...parJour].map(([date, j]) => ({ date, ventes: j.ventes, ca: j.centimes / 100 }));

  let definition =
    "Vente = commande payée sur le site (boutique Shopify, hors grossistes et marketplaces, hors commandes de test et annulées), " +
    "datée au jour de la commande, payée en ligne au même moment (heure de Paris). " +
    "CA = montant TTC encaissé moins les remboursements de ces commandes ; une commande intégralement remboursée ne compte plus.";
  if (autresDevises > 0) {
    definition += ` Seuls les montants en ${devise} sont comptés : ${autresDevises} commande(s) dans une autre devise écartée(s).`;
  }
  if (plancher) {
    definition += ` Shopify ne donne accès qu'aux ${JOURS_HISTORIQUE} derniers jours : rien n'est compté avant le ${jourFr(plancher)}.`;
  }

  return reponse({
    devise,
    ventes: jours.reduce((s, j) => s + j.ventes, 0),
    ca: [...parJour.values()].reduce((s, j) => s + j.centimes, 0) / 100,
    parJour: jours,
    definition,
  });
}
