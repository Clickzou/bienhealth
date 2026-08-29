import { cookies } from "next/headers";
import Link from "next/link";
import { isValidSession, SEO_COOKIE } from "@/lib/seo-dashboard/auth";
import { DEFAULT_PERIOD, PERIODS, isPeriodKey, resolvePeriod, variation, type PeriodKey } from "@/lib/seo-dashboard/periods";
import { fetchGa4, isGa4Configured, ga4PropertyId } from "@/lib/seo-dashboard/ga4";
import { fetchGsc, isGscConfigured, gscSiteUrl } from "@/lib/seo-dashboard/gsc";
import { fetchSales, isSalesConfigured } from "@/lib/seo-dashboard/shopify-sales";
import LoginForm from "./login-form";
import KeywordTable from "./keyword-table";
import RealtimePanel from "./realtime";
import {
  BarList,
  Card,
  Empty,
  Kpi,
  LineChart,
  NotConnected,
  SectionTitle,
  StatusDot,
  Table,
  duration,
  longDate,
  money,
  num,
  pct,
} from "./ui";

/**
 * Tableau de bord « SEO by Clickzou ».
 *
 * Trois sources, interrogées en parallèle et indépendantes les unes des autres :
 * Google Analytics 4 (audience, pages, canaux), Search Console (mots-clés et
 * positions) et l'Admin Shopify (ventes réelles, le checkout étant hébergé chez
 * Shopify). Chaque source absente affiche sa procédure de branchement — on
 * n'affiche jamais de chiffres de démonstration, qui donneraient l'illusion
 * d'un suivi qui n'existe pas.
 */

const CHART_BLUE = "#7ccdf4";
const CHART_GREEN = "#34d399";
const CHART_PINK = "#ffb2ce";

export default async function SeoDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const session = (await cookies()).get(SEO_COOKIE)?.value;
  if (!isValidSession(session)) return <LoginForm />;

  const { period: periodParam } = await searchParams;
  const key: PeriodKey = isPeriodKey(periodParam) ? periodParam : DEFAULT_PERIOD;
  const period = resolvePeriod(key);

  const [ga4, gsc, sales] = await Promise.all([fetchGa4(period), fetchGsc(period), fetchSales(period)]);

  const t = ga4?.totals;
  const p = ga4?.previousTotals;
  const commerce = ga4?.commerce;

  return (
    <div className="min-h-screen">
      {/* -------------------------------------------------------- en-tête */}
      <header className="sticky top-0 z-20 bg-[#050d1c]/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="mr-auto">
              <p className="text-[10px] uppercase tracking-[0.22em] text-bien-sky">Clickzou</p>
              <h1 className="text-xl font-semibold tracking-tight leading-tight">SEO by Clickzou</h1>
            </div>

            <nav className="flex gap-1" aria-label="Période">
              {(Object.keys(PERIODS) as PeriodKey[]).map((k) => (
                <Link
                  key={k}
                  href={`/seo?period=${k}`}
                  prefetch={false}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] transition ${
                    k === key ? "bg-bien-sky text-bien-navy font-semibold" : "bg-white/[0.06] text-white/60 hover:text-white"
                  }`}
                >
                  {PERIODS[k].label}
                </Link>
              ))}
            </nav>

            <form action="/api/seo/logout" method="post">
              <button type="submit" className="rounded-full px-3.5 py-1.5 text-[12px] bg-white/[0.06] text-white/60 hover:text-white transition">
                Déconnexion
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2.5">
            <p className="text-[11px] text-white/45">
              bien.health · du <strong className="text-white/70 font-medium">{longDate(period.current.start)}</strong> au{" "}
              <strong className="text-white/70 font-medium">{longDate(period.current.end)}</strong>
            </p>
            <StatusDot ok={!!ga4} label="Analytics" />
            <StatusDot ok={!!gsc} label="Search Console" />
            <StatusDot ok={!!sales} label="Ventes Shopify" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        {/* --------------------------------------------------- temps réel */}
        <div className="mt-6">
          <RealtimePanel enabled />
        </div>

        {/* ------------------------------------------------------ synthèse */}
        <SectionTitle hint="Les chiffres comparent la période choisie à la période immédiatement précédente, de même durée.">
          Vue d&apos;ensemble
        </SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            label="Visiteurs"
            value={t ? num(t.users) : "—"}
            delta={t && p ? variation(t.users, p.users) : undefined}
            hint={t ? undefined : "Analytics non connecté"}
          />
          <Kpi
            label="Clics depuis Google"
            value={gsc ? num(gsc.totals.clicks) : "—"}
            delta={gsc ? variation(gsc.totals.clicks, gsc.previousTotals.clicks) : undefined}
            hint={gsc ? undefined : "Search Console non connectée"}
          />
          <Kpi
            label="Position moyenne"
            value={gsc ? gsc.totals.position.toFixed(1) : "—"}
            delta={gsc ? variation(gsc.totals.position, gsc.previousTotals.position) : undefined}
            invert
            hint={gsc ? undefined : "Search Console non connectée"}
          />
          <Kpi
            label="Chiffre d'affaires"
            value={sales ? money(sales.current.revenue, sales.current.currency) : commerce?.revenue ? money(commerce.revenue) : "—"}
            delta={sales ? variation(sales.current.revenue, sales.previous.revenue) : undefined}
            hint={sales ? undefined : "Ventes non connectées"}
          />
        </div>

        {/* ------------------------------------------------------ audience */}
        <SectionTitle hint="Source : Google Analytics 4">Audience du site</SectionTitle>
        {ga4 && t && p ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Sessions" value={num(t.sessions)} delta={variation(t.sessions, p.sessions)} />
              <Kpi label="Nouveaux visiteurs" value={num(t.newUsers)} delta={variation(t.newUsers, p.newUsers)} />
              <Kpi label="Pages vues" value={num(t.pageViews)} delta={variation(t.pageViews, p.pageViews)} />
              <Kpi label="Pages par session" value={t.sessions ? (t.pageViews / t.sessions).toFixed(1) : "—"} hint="Profondeur de visite" />
              <Kpi label="Taux de rebond" value={pct(t.bounceRate)} delta={variation(t.bounceRate, p.bounceRate)} invert />
              <Kpi label="Taux d'engagement" value={pct(t.engagementRate)} delta={variation(t.engagementRate, p.engagementRate)} />
              <Kpi label="Durée moyenne" value={duration(t.avgSessionDuration)} delta={variation(t.avgSessionDuration, p.avgSessionDuration)} />
              <Kpi
                label="Ajouts au panier"
                value={commerce ? num(commerce.addToCarts) : "—"}
                delta={commerce && ga4.previousCommerce ? variation(commerce.addToCarts, ga4.previousCommerce.addToCarts) : undefined}
              />
            </div>

            <div className="mt-3">
              <Card title="Trafic jour par jour">
                <LineChart
                  labels={ga4.timeseries.map((d) => d.date)}
                  series={[
                    { label: "Sessions", color: CHART_BLUE, points: ga4.timeseries.map((d) => d.sessions) },
                    { label: "Visiteurs", color: CHART_GREEN, points: ga4.timeseries.map((d) => d.users) },
                  ]}
                />
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-3 mt-3">
              <Card title="D'où vient le trafic" subtitle="Sessions par canal">
                <BarList rows={ga4.channels.map((c) => ({ label: c.label, value: c.values[0] }))} />
              </Card>
              <Card title="Pays" subtitle="Sessions">
                <BarList rows={ga4.countries.map((c) => ({ label: c.label, value: c.values[0] }))} />
              </Card>
              <Card title="Appareils" subtitle="Sessions">
                <BarList rows={ga4.devices.map((d) => ({ label: d.label, value: d.values[0] }))} />
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-3 mt-3">
              <Card title="Pages les plus vues" subtitle="Toutes sources confondues">
                <Table
                  head={["Page", "Vues", "Visiteurs", "Rebond"]}
                  rows={ga4.topPages.map((row) => [
                    <span key="p" title={row.extra} className="block truncate">
                      {row.label}
                    </span>,
                    num(row.values[0]),
                    num(row.values[1]),
                    pct(row.values[2] * 100),
                  ])}
                />
              </Card>
              <Card title="Pages d'entrée SEO" subtitle="Sessions arrivées par la recherche organique">
                <Table
                  head={["Page d'entrée", "Sessions", "Visiteurs", "Rebond"]}
                  rows={ga4.organicLandings.map((row) => [
                    <span key="p" className="block truncate">
                      {row.label}
                    </span>,
                    num(row.values[0]),
                    num(row.values[1]),
                    pct(row.values[2] * 100),
                  ])}
                />
              </Card>
            </div>
          </>
        ) : (
          <NotConnected
            title="Google Analytics 4 n'est pas encore relié au tableau de bord"
            why="Le site envoie bien ses données à GA4 (identifiant G-GQFWQF5085), mais lire ces données depuis une autre application demande un accès en lecture, distinct du suivi. Quinze minutes de configuration, une seule fois."
            steps={[
              "Dans <strong>Google Cloud</strong> (console.cloud.google.com), créer un projet, puis activer les API <em>Google Analytics Data API</em> et <em>Google Search Console API</em>.",
              "Créer un <strong>compte de service</strong> (IAM &amp; Admin → Comptes de service), lui ajouter une clé au format JSON et télécharger le fichier.",
              "Dans <strong>GA4</strong> → Admin → Gestion des accès à la propriété, ajouter l'adresse du compte de service (…@….iam.gserviceaccount.com) avec le rôle <strong>Lecteur</strong>.",
              "Dans <strong>Search Console</strong> → Paramètres → Utilisateurs et autorisations, ajouter la même adresse en <strong>Lecteur complet</strong>.",
              "Renseigner dans Vercel : <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> (le contenu du fichier JSON, encodé en base64) et <code>GA4_PROPERTY_ID</code> (l'identifiant numérique de la propriété, Admin → Détails de la propriété), puis redéployer.",
              `État actuel : identifiant de propriété ${ga4PropertyId() ? `<code>${ga4PropertyId()}</code> renseigné` : "<strong>absent</strong>"}, compte de service ${isGa4Configured() ? "lu correctement" : "<strong>absent ou illisible</strong>"}.`,
            ]}
          />
        )}

        {/* ------------------------------------------------ search console */}
        <SectionTitle hint="Source : Google Search Console — deux à trois jours de décalage, les tout derniers jours sont incomplets">
          Référencement Google
        </SectionTitle>
        {gsc ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Clics" value={num(gsc.totals.clicks)} delta={variation(gsc.totals.clicks, gsc.previousTotals.clicks)} />
              <Kpi label="Impressions" value={num(gsc.totals.impressions)} delta={variation(gsc.totals.impressions, gsc.previousTotals.impressions)} />
              <Kpi label="CTR" value={pct(gsc.totals.ctr)} delta={variation(gsc.totals.ctr, gsc.previousTotals.ctr)} />
              <Kpi label="Position moyenne" value={gsc.totals.position.toFixed(1)} delta={variation(gsc.totals.position, gsc.previousTotals.position)} invert />
            </div>

            <div className="mt-3">
              <Card title="Clics et impressions jour par jour">
                <LineChart
                  labels={gsc.timeseries.map((d) => d.date)}
                  series={[
                    { label: "Clics", color: CHART_BLUE, points: gsc.timeseries.map((d) => d.clicks) },
                    { label: "Impressions", color: CHART_PINK, points: gsc.timeseries.map((d) => d.impressions) },
                  ]}
                />
              </Card>
            </div>

            <div className="mt-3">
              <Card
                title="Mots-clés et positions"
                subtitle={`Propriété ${gsc.siteUrl} — la flèche verte signale une position qui remonte`}
              >
                <KeywordTable rows={gsc.queries} />
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-3 mt-3">
              <Card title="Pages qui rapportent des clics" subtitle="Résultats de recherche">
                <Table
                  head={["Page", "Clics", "Impr.", "CTR", "Position"]}
                  rows={gsc.pages.map((row) => [
                    <span key="p" className="block truncate" title={row.page}>
                      {row.page.replace(/^https?:\/\/[^/]+/, "") || "/"}
                    </span>,
                    num(row.clicks),
                    num(row.impressions),
                    pct(row.ctr),
                    row.position.toFixed(1),
                  ])}
                />
              </Card>
              <div className="grid gap-3">
                <Card title="Pays" subtitle="Clics dans les résultats de recherche">
                  <BarList rows={gsc.countries.map((c) => ({ label: c.country.toUpperCase(), value: c.clicks }))} />
                </Card>
                <Card title="Appareils" subtitle="Clics dans les résultats de recherche">
                  <BarList rows={gsc.devices.map((d) => ({ label: d.device.toLowerCase(), value: d.clicks }))} />
                </Card>
              </div>
            </div>
          </>
        ) : (
          <NotConnected
            title="Search Console n'est pas encore reliée au tableau de bord"
            why="C'est la seule source des mots-clés et des positions : Analytics ne sait pas sur quelles requêtes le site ressort. La propriété de domaine bien.health est validée depuis la bascule, il ne manque que l'accès en lecture pour l'application."
            steps={[
              "Suivre les étapes 1 à 5 du bloc Analytics ci-dessus (le même compte de service sert aux deux).",
              "Dans <strong>Search Console</strong> → Paramètres → Utilisateurs et autorisations → Ajouter un utilisateur : l'adresse du compte de service, autorisation <strong>Complète</strong>.",
              `Propriété interrogée : <code>${gscSiteUrl() || "non déterminée"}</code>. Si la propriété validée est différente (préfixe d'URL plutôt que domaine), renseigner <code>GSC_SITE_URL</code> dans Vercel.`,
              `État actuel : compte de service ${isGscConfigured() ? "lu correctement, mais l'API n'a rien renvoyé — vérifier l'autorisation dans Search Console" : "<strong>absent ou illisible</strong>"}.`,
            ]}
          />
        )}

        {/* --------------------------------------------------------- ventes */}
        <SectionTitle hint="Source : Shopify Admin — le tunnel de paiement étant hébergé par Shopify, c'est la seule mesure fiable des ventes">
          Ventes
        </SectionTitle>
        {sales ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Commandes" value={num(sales.current.orders)} delta={variation(sales.current.orders, sales.previous.orders)} />
              <Kpi
                label="Chiffre d'affaires"
                value={money(sales.current.revenue, sales.current.currency)}
                delta={variation(sales.current.revenue, sales.previous.revenue)}
              />
              <Kpi
                label="Panier moyen"
                value={money(sales.current.averageOrder, sales.current.currency)}
                delta={variation(sales.current.averageOrder, sales.previous.averageOrder)}
              />
              <Kpi label="Articles vendus" value={num(sales.current.items)} delta={variation(sales.current.items, sales.previous.items)} />
            </div>

            {sales.current.truncated && (
              <p className="mt-2 text-[11px] text-amber-300">
                Plus de 1 000 commandes sur la période : les totaux ci-dessus sont plafonnés à ce nombre. Choisir une période plus courte pour un total exact.
              </p>
            )}

            <div className="grid lg:grid-cols-2 gap-3 mt-3">
              <Card title="Chiffre d'affaires jour par jour">
                {sales.daily.length > 1 ? (
                  <LineChart
                    labels={sales.daily.map((d) => d.date)}
                    series={[
                      { label: "CA (€)", color: CHART_GREEN, points: sales.daily.map((d) => d.revenue) },
                      { label: "Commandes", color: CHART_BLUE, points: sales.daily.map((d) => d.orders) },
                    ]}
                  />
                ) : (
                  <Empty>Pas assez de commandes sur la période pour tracer une courbe.</Empty>
                )}
              </Card>
              <Card title="Produits les plus vendus" subtitle="Par quantité">
                <Table
                  head={["Produit", "Quantité", "CA"]}
                  rows={sales.products.map((row) => [
                    <span key="p" className="block truncate">
                      {row.title}
                    </span>,
                    num(row.quantity),
                    money(row.revenue, sales.current.currency),
                  ])}
                />
              </Card>
            </div>
          </>
        ) : (
          <NotConnected
            title="Les ventes ne sont pas encore reliées au tableau de bord"
            why="Le paiement se fait sur Shopify : ni le site ni Analytics ne voient passer les commandes. Il faut donc lire les ventes directement dans l'admin Shopify, avec un jeton différent de celui qui sert déjà à afficher les produits."
            steps={[
              "Dans l'admin Shopify → Paramètres → <strong>Applications et canaux de vente</strong> → Développer des applications → Créer une application.",
              "Onglet <strong>Configuration</strong> → Admin API : cocher le scope <code>read_orders</code> (et <code>read_products</code> si l'on veut détailler les produits).",
              "Installer l'application, puis copier le jeton <code>shpat_…</code>.",
              "Le renseigner dans Vercel sous <code>SHOPIFY_ADMIN_API_TOKEN</code>, puis redéployer.",
              `État actuel : jeton d'administration ${isSalesConfigured() ? "présent, mais l'API n'a rien renvoyé — vérifier le scope <code>read_orders</code>" : "<strong>absent</strong>"}.`,
            ]}
          />
        )}

        {/* Rappel : ce que le tableau de bord ne peut pas encore mesurer. */}
        {ga4 && (!commerce || commerce.transactions === 0) && (
          <p className="mt-8 text-[12px] text-white/40 max-w-3xl leading-relaxed">
            Analytics ne rapporte aucun achat sur cette période. C&apos;est attendu tant que le canal Google du back-office
            Shopify n&apos;envoie pas les commandes à GA4 : le tunnel de paiement quitte bien.health, la mesure s&apos;arrête donc
            à l&apos;ajout au panier. Les ventes réelles se lisent dans la section précédente, alimentée par Shopify.
          </p>
        )}

        <footer className="mt-12 pt-6 border-t border-white/10 text-[11px] text-white/35">
          SEO by Clickzou — compteur temps réel toutes les 20 secondes, tableaux rechargés toutes les 5 minutes,
          sans aucune mise en cache.
          {" "}Période de comparaison : du {longDate(period.previous.start)} au {longDate(period.previous.end)}.
        </footer>
      </main>
    </div>
  );
}
