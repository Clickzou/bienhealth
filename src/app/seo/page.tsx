import { cookies } from "next/headers";
import Link from "next/link";
import { isValidSession, SEO_COOKIE } from "@/lib/seo-dashboard/auth";
import { DEFAULT_PERIOD, PERIODS, isPeriodKey, resolvePeriod, variation, type PeriodKey } from "@/lib/seo-dashboard/periods";
import { fetchGa4, isGa4Configured, ga4PropertyId } from "@/lib/seo-dashboard/ga4";
import { fetchGsc, isGscConfigured, gscSiteUrl } from "@/lib/seo-dashboard/gsc";
import { fetchShopifySales } from "@/lib/seo-dashboard/shopify-sales";
import { fetchDiagnostics } from "@/lib/seo-dashboard/diagnostics";
import LoginForm from "./login-form";
import KeywordTable from "./keyword-table";
import RealtimePanel from "./realtime";
import {
  BarList,
  Card,
  Kpi,
  LineChart,
  NotConnected,
  PageCell,
  SectionTitle,
  StatusDot,
  Table,
  duration,
  longDate,
  money,
  num,
  pct,
} from "./ui";
import { channelLabel, countryLabel, deviceLabel } from "./labels";

/**
 * Tableau de bord « SEO by Clickzou ».
 *
 * Deux sources, interrogées en parallèle et indépendantes l'une de l'autre :
 * Google Analytics 4 (audience, pages, canaux) et Search Console (mots-clés et
 * positions). Une source absente affiche sa procédure de branchement — on
 * n'affiche jamais de chiffres de démonstration, qui donneraient l'illusion
 * d'un suivi qui n'existe pas.
 */

// Teintes de marque assombries pour le fond clair : le bleu ciel et le rose du
// site sont calibrés sur fond sombre ; en trait de 2 px sur blanc, ils disparaissent.
const CHART_BLUE = "#1379b0";
const CHART_GREEN = "#238f5e";
const CHART_PINK = "#d4568e";
const CHART_AMBER = "#c2760b";

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

  const [ga4, gsc, shopify, diagnostics] = await Promise.all([
    fetchGa4(period),
    fetchGsc(period),
    fetchShopifySales(period),
    fetchDiagnostics(period),
  ]);

  // Search Console publie avec deux à trois jours de retard, et la période
  // choisie déborde donc toujours sur des jours qu'elle n'a pas encore. On
  // affiche les dates réellement couvertes plutôt que celles demandées.
  const gscDays = gsc?.timeseries.map((d) => d.date).sort() ?? [];
  const gscRange = gscDays.length
    ? `Données arrêtées au ${longDate(gscDays[gscDays.length - 1])} (premier jour : ${longDate(gscDays[0])})`
    : null;

  // Courbe commerce. Deux séries de fiabilité inégale, d'où leur séparation :
  // l'ajout au panier se produit sur le site, Analytics le compte exactement ;
  // la vente, elle, se conclut sur Shopify, et Analytics n'en voit que ce que
  // Shopify veut bien lui renvoyer — aujourd'hui presque rien. On trace donc
  // toujours le panier, et la vente seulement quand il y en a, sans jamais
  // laisser croire que cette courbe est le chiffre d'affaires réel.
  const byDay = new Map((ga4?.commerceSeries ?? []).map((d) => [d.date, d]));
  const hasCartSeries = (ga4?.commerceSeries ?? []).some((d) => d.addToCarts > 0);

  // Les commandes Shopify sont datées « 2026-08-29 », les jours d'Analytics
  // « 20260829 » : on aligne sur le format d'Analytics, qui porte les abscisses.
  const sales = shopify.data;
  const salesByDay = new Map((sales?.daily ?? []).map((d) => [d.date.replace(/-/g, ""), d]));
  const hasSalesSeries = (sales?.daily ?? []).some((d) => d.orders > 0);

  const t = ga4?.totals;
  const p = ga4?.previousTotals;
  const commerce = ga4?.commerce;

  return (
    <div className="min-h-screen">
      {/* -------------------------------------------------------- en-tête */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-black/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="mr-auto">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#1379b0]">Clickzou</p>
              <h1 className="text-xl font-semibold tracking-tight leading-tight">SEO by Clickzou</h1>
            </div>

            <nav className="flex gap-1" aria-label="Période">
              {(Object.keys(PERIODS) as PeriodKey[]).map((k) => (
                <Link
                  key={k}
                  href={`/seo?period=${k}`}
                  prefetch={false}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] transition ${
                    k === key ? "bg-bien-sky text-bien-navy font-semibold" : "bg-black/[0.04] text-[#5a6472] hover:text-[#00112b]"
                  }`}
                >
                  {PERIODS[k].label}
                </Link>
              ))}
            </nav>

            <form action="/api/seo/logout" method="post">
              <button type="submit" className="rounded-full px-3.5 py-1.5 text-[12px] bg-black/[0.04] text-[#5a6472] hover:text-[#00112b] transition">
                Déconnexion
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2.5">
            <p className="text-[11px] text-[#77808e]">
              bien.health · du <strong className="text-[#465269] font-medium">{longDate(period.current.start)}</strong> au{" "}
              <strong className="text-[#465269] font-medium">{longDate(period.current.end)}</strong>
            </p>
            <StatusDot ok={!!ga4} label="Analytics" />
            <StatusDot ok={!!gsc} label="Search Console" />
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
          {/* Dernier repère de la ligne : l'ajout au panier, dernière action que le
              site mesure lui-même. Au-delà, le visiteur est chez Shopify. */}
          <Kpi
            label="Ajouts au panier"
            value={commerce ? num(commerce.addToCarts) : "—"}
            delta={commerce && ga4?.previousCommerce ? variation(commerce.addToCarts, ga4.previousCommerce.addToCarts) : undefined}
            hint={commerce ? undefined : "Analytics non connecté"}
          />
        </div>

        {/* -------------------------------------------------------- ventes */}
        <SectionTitle hint="Source : administration Shopify — commandes réelles, hors commandes annulées et commandes de test">
          Ventes
        </SectionTitle>
        {sales ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi
                label="Chiffre d'affaires"
                value={money(sales.totals.revenue, sales.totals.currency)}
                delta={variation(sales.totals.revenue, sales.previousTotals.revenue)}
              />
              <Kpi
                label="Commandes"
                value={num(sales.totals.orders)}
                delta={variation(sales.totals.orders, sales.previousTotals.orders)}
              />
              <Kpi
                label="Panier moyen"
                value={money(sales.totals.averageOrder, sales.totals.currency)}
                delta={variation(sales.totals.averageOrder, sales.previousTotals.averageOrder)}
              />
              {/* Le taux de conversion se calcule sur les visites du site headless,
                  pas sur celles que compte Shopify : les deux outils ne mesurent pas
                  la même chose, l'écart avec l'admin Shopify est normal. */}
              <Kpi
                label="Taux de conversion"
                value={t && t.sessions ? pct((sales.totals.orders / t.sessions) * 100) : "—"}
                hint="Commandes rapportées aux visites du site"
              />
            </div>

            {sales.capped && (
              <p className="mt-3 text-[12px] text-[#8a5a2b] bg-[#fdf4e7] ring-1 ring-amber-500/30 rounded-lg px-3 py-2 max-w-4xl">
                Le nombre de commandes de cette période dépasse ce que le tableau de bord lit en une fois : les totaux
                ci-dessus sont donc partiels. À signaler pour relever la limite de lecture.
              </p>
            )}

            {sales.truncated && sales.coveredFrom && (
              <p className="mt-3 text-[12px] text-[#8a5a2b] bg-[#fdf4e7] ring-1 ring-amber-500/30 rounded-lg px-3 py-2 max-w-4xl">
                Shopify ne donne accès qu&apos;aux soixante derniers jours de commandes : les ventes affichées démarrent
                au {longDate(sales.coveredFrom)}, alors que le trafic couvre toute la période. Lever cette limite demande
                l&apos;autorisation <code>read_all_orders</code> dans la configuration de l&apos;application.
              </p>
            )}

            {sales.topProducts.length > 0 && (
              <div className="mt-3">
                <Card title="Produits vendus" subtitle="Sur la période, par chiffre d'affaires">
                  <Table
                    head={["Produit", "Quantité", "Chiffre d'affaires"]}
                    rows={sales.topProducts.map((row) => [
                      <span key="p" className="block truncate" title={row.title}>
                        {row.title}
                      </span>,
                      num(row.quantity),
                      money(row.revenue, sales.totals.currency),
                    ])}
                  />
                </Card>
              </div>
            )}
          </>
        ) : (
          <NotConnected
            title={
              shopify.status === "app-not-installed"
                ? "L'application Clickzou n'est pas encore installée sur la boutique"
                : shopify.status === "bad-credentials"
                  ? "Shopify refuse l'identifiant ou le secret de l'application"
                  : shopify.status === "forbidden"
                    ? "L'application n'a pas l'autorisation de lire les commandes"
                    : shopify.status === "not-configured"
                      ? "Les identifiants de l'application Shopify ne sont pas renseignés"
                      : "Shopify n'a pas répondu"
            }
            why={
              shopify.status === "app-not-installed"
                ? "L'application existe et ses identifiants sont bons — Shopify le confirme en répondant « app_not_installed » plutôt que « invalid_request ». Il manque uniquement son installation sur la boutique, qui se fait en deux clics et une seule fois."
                : shopify.status === "bad-credentials"
                  ? "L'échange des identifiants contre un jeton d'accès est refusé. Le secret a peut-être été régénéré depuis sa copie dans Vercel."
                  : shopify.status === "forbidden"
                    ? "Le jeton est valide mais l'application ne dispose pas de l'autorisation de lecture des commandes."
                    : shopify.status === "not-configured"
                      ? "Le chiffre d'affaires se lit avec l'identifiant et le secret d'une application Shopify, distincts du jeton public qui sert à afficher les produits."
                      : "L'appel à l'API d'administration a échoué. Si cela persiste, vérifier que la boutique est bien accessible."
            }
            steps={
              shopify.status === "app-not-installed"
                ? [
                    "Ouvrir le <strong>Dev Dashboard</strong> Shopify, application « Tableau de bord Clickzou », page <strong>Home</strong> (et non Settings).",
                    "Descendre jusqu'à <strong>Install app</strong>, choisir la boutique Bien Health, puis <strong>Install</strong>.",
                    "Vérifier dans l'admin Shopify : <em>Paramètres → Applications et canaux de vente → Installées</em>.",
                    "Recharger cette page : les ventes apparaissent sans autre manipulation.",
                  ]
                : shopify.status === "bad-credentials"
                  ? [
                      "Dans le Dev Dashboard, ouvrir l'application puis <strong>Client credentials</strong>.",
                      "Recopier <code>Client ID</code> et <code>Client secret</code> dans <code>SHOPIFY_APP_CLIENT_ID</code> et <code>SHOPIFY_APP_CLIENT_SECRET</code>, dans Vercel et dans <code>.env.local</code>.",
                      "Redéployer, puis recharger cette page.",
                    ]
                  : shopify.status === "forbidden"
                    ? [
                        "Dans la configuration de l'application, ajouter l'autorisation <code>read_orders</code> (et <code>read_products</code>).",
                        "Publier une nouvelle version de l'application, puis la réinstaller sur la boutique pour que les nouvelles autorisations prennent effet.",
                        "Au-delà de soixante jours d'historique, demander également <code>read_all_orders</code>.",
                      ]
                    : [
                        "Créer ou ouvrir l'application dans le <strong>Dev Dashboard</strong> Shopify (les applications personnalisées de l'ancien admin, et leurs jetons <code>shpat_…</code>, ont été supprimées le 1<sup>er</sup> janvier 2026).",
                        "Renseigner <code>SHOPIFY_APP_CLIENT_ID</code> et <code>SHOPIFY_APP_CLIENT_SECRET</code> dans Vercel et dans <code>.env.local</code>.",
                        "Installer l'application sur la boutique, puis recharger cette page.",
                      ]
            }
          />
        )}

        {/* --------------------------------------------------- diagnostics */}
        {/* Ce que les gens répondent au quiz. Klaviyo fait office de base : le
            site n'en a pas d'autre, et le quiz y inscrit déjà chaque personne
            avec ses réponses en propriétés de profil. La liste contient aussi
            les contacts importés de Typeform — sans réponses, donc écartés en
            amont : on ne montre que les diagnostics remplis sur le site. */}
        <SectionTitle hint='Source : liste Klaviyo « EMAIL - Contacts typeform "Ton diagnostic personnalisé <3" » — réponses au quiz /diagnostic'>
          Diagnostics remplis
        </SectionTitle>
        {diagnostics.data ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Sur la période" value={num(diagnostics.data.count)} hint="Aujourd'hui compris — Klaviyo répond en temps réel" />
              <Kpi
                label="Produit le plus recommandé"
                value={diagnostics.data.byResult[0]?.label ?? "—"}
                hint={diagnostics.data.byResult[0] ? `${diagnostics.data.byResult[0].value} fois` : undefined}
              />
              <Kpi
                label="Profils lus dans la liste"
                value={num(diagnostics.data.listTotal)}
                hint={diagnostics.data.capped ? "Lecture bornée : total partiel" : "Contacts Typeform inclus"}
              />
            </div>

            {diagnostics.data.byResult.length > 0 && (
              <Card title="Répartition des recommandations" className="mt-3">
                <BarList rows={diagnostics.data.byResult} />
              </Card>
            )}

            {/* Pas un tableau : `Table` aligne à droite et interdit le retour à la
                ligne, ce qui convient aux chiffres mais étirait la page sur une
                seule ligne de réponses. Chaque diagnostic est donc une fiche —
                l'adresse et la recommandation en tête, les réponses dessous. */}
            <Card title="Derniers diagnostics" className="mt-3">
              <ul className="divide-y divide-black/[0.06]">
                {diagnostics.data.items.slice(0, 40).map((d) => (
                  <li key={`${d.email}-${d.joinedAt ?? ""}`} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[13px] font-medium text-[#00112b]">{d.email}</span>
                      <span className="text-[11px] uppercase tracking-[0.1em] text-[#818a97]">
                        {d.day ? longDate(d.day) : "—"}
                      </span>
                      {d.result && (
                        <span className="ml-auto inline-flex items-center rounded-full bg-[#238f5e]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#1c7a4f]">
                          {d.result}
                        </span>
                      )}
                    </div>
                    {d.answers.length > 0 && (
                      <dl className="mt-1.5 grid sm:grid-cols-2 gap-x-8 gap-y-0.5 text-[12.5px] leading-snug">
                        {d.answers.map((a) => (
                          <div key={a.question} className="flex gap-1.5">
                            <dt className="shrink-0 text-[#818a97]">{a.question} :</dt>
                            <dd className="text-[#243348]">{a.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        ) : (
          <NotConnected
            title={
              diagnostics.status === "bad-credentials"
                ? "Klaviyo refuse la clé privée"
                : diagnostics.status === "forbidden"
                  ? "La clé privée n'a pas le droit de lire les profils"
                  : diagnostics.status === "list-not-found"
                    ? "Klaviyo ne trouve pas la liste du diagnostic"
                    : diagnostics.status === "not-configured"
                      ? "La clé de lecture Klaviyo n'est pas renseignée"
                      : "Klaviyo n'a pas répondu"
            }
            why={
              diagnostics.status === "bad-credentials"
                ? "La clé a peut-être été révoquée ou recopiée incomplètement. Une clé privée commence par <code>pk_</code>."
                : diagnostics.status === "forbidden"
                  ? "La clé existe mais ses autorisations ne couvrent pas la lecture des profils et des listes."
                  : diagnostics.status === "list-not-found"
                    ? "L'identifiant de liste ne correspond à rien dans ce compte Klaviyo. Il se lit dans l'URL de la liste, après <code>/list/</code>."
                    : diagnostics.status === "not-configured"
                      ? "Le site écrit déjà les diagnostics dans Klaviyo avec la clé publique du compte. Les relire demande une clé privée, qui reste côté serveur et ne part jamais au navigateur."
                      : "L'appel à l'API Klaviyo a échoué. Si cela persiste, vérifier l'état du service."
            }
            steps={
              diagnostics.status === "forbidden"
                ? [
                    "Dans Klaviyo : <em>Settings → API keys</em>, ouvrir la clé utilisée.",
                    "Lui donner l'accès <strong>Read</strong> sur <code>Profiles</code> et sur <code>Lists</code>.",
                    "Recharger cette page.",
                  ]
                : diagnostics.status === "list-not-found"
                  ? [
                      "Ouvrir la liste dans Klaviyo et relever l'identifiant dans l'URL (<code>klaviyo.com/list/<strong>XXXXXX</strong></code>).",
                      "Le renseigner dans <code>KLAVIYO_DIAGNOSTIC_LIST_ID</code> sur Vercel, puis redéployer.",
                    ]
                  : [
                      "Dans Klaviyo : <em>Settings → API keys → Create private key</em>.",
                      "Autorisations : <strong>Read</strong> sur <code>Profiles</code> et sur <code>Lists</code> — rien de plus.",
                      "Copier la clé (<code>pk_…</code>, affichée une seule fois) dans <code>KLAVIYO_PRIVATE_API_KEY</code>, sur Vercel et dans <code>.env.local</code>.",
                      "Redéployer, puis recharger cette page.",
                    ]
            }
          />
        )}

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

            <p className="mt-3 text-[12px] text-[#6b7482] leading-relaxed max-w-4xl">
              <strong className="font-medium text-[#465269]">Sessions</strong> : les visites, une même personne pouvant
              revenir plusieurs fois. <strong className="font-medium text-[#465269]">Visiteurs</strong> : les personnes
              distinctes. <strong className="font-medium text-[#465269]">Taux de rebond</strong> : la part des visites
              qui s&apos;arrêtent à une seule page. <strong className="font-medium text-[#465269]">Taux d&apos;engagement</strong> :
              à l&apos;inverse, la part des visites qui durent, chargent plusieurs pages ou déclenchent une action.
            </p>

            <div className="mt-3">
              <Card
                title={hasSalesSeries ? "Trafic et ventes jour par jour" : "Trafic et ajouts au panier jour par jour"}
                subtitle={
                  hasSalesSeries
                    ? "Visites et ajouts au panier mesurés sur le site, commandes lues dans Shopify."
                    : "Le paiement se conclut sur Shopify : la dernière étape mesurable ici est l'ajout au panier."
                }
              >
                <LineChart
                  labels={ga4.timeseries.map((d) => d.date)}
                  series={[
                    { label: "Sessions", color: CHART_BLUE, points: ga4.timeseries.map((d) => d.sessions) },
                    { label: "Visiteurs", color: CHART_GREEN, points: ga4.timeseries.map((d) => d.users) },
                    ...(hasCartSeries
                      ? [
                          {
                            label: "Ajouts au panier",
                            color: CHART_AMBER,
                            points: ga4.timeseries.map((d) => byDay.get(d.date)?.addToCarts ?? 0),
                          },
                        ]
                      : []),
                    ...(hasSalesSeries
                      ? [
                          {
                            label: "Commandes",
                            color: CHART_PINK,
                            points: ga4.timeseries.map((d) => salesByDay.get(d.date)?.orders ?? 0),
                          },
                        ]
                      : []),
                  ]}
                />
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-3 mt-3">
              <Card title="D'où vient le trafic" subtitle="Sessions par canal">
                <BarList rows={ga4.channels.map((c) => ({ label: channelLabel(c.label), value: c.values[0] }))} />
              </Card>
              <Card title="Pays" subtitle="Sessions">
                <BarList rows={ga4.countries.map((c) => ({ label: countryLabel(c.label), value: c.values[0] }))} />
              </Card>
              <Card title="Appareils" subtitle="Sessions">
                <BarList rows={ga4.devices.map((d) => ({ label: deviceLabel(d.label), value: d.values[0] }))} />
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-3 mt-3">
              <Card title="Pages les plus vues" subtitle="Toutes sources confondues">
                <Table
                  head={["Page", "Vues", "Visiteurs", "Taux de rebond"]}
                  rows={ga4.topPages.map((row) => [
                    <PageCell key="p" path={row.label} title={row.extra} />,
                    num(row.values[0]),
                    num(row.values[1]),
                    pct(row.values[2] * 100),
                  ])}
                />
              </Card>
              <Card title="Pages d'entrée SEO" subtitle="Sessions arrivées par la recherche organique">
                <Table
                  head={["Page d'entrée", "Visites", "Visiteurs", "Taux de rebond"]}
                  rows={ga4.organicLandings.map((row) => [
                    <PageCell key="p" path={row.label} />,
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
        <SectionTitle
          hint={
            gscRange
              ? `Source : Google Search Console. ${gscRange} — Google publie avec deux à trois jours de retard, les tout derniers jours sont donc incomplets.`
              : "Source : Google Search Console — deux à trois jours de décalage, les tout derniers jours sont incomplets"
          }
        >
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

            <p className="mt-3 text-[12px] text-[#6b7482] leading-relaxed max-w-4xl">
              <strong className="font-medium text-[#465269]">Impressions</strong> : le nombre de fois où une page du site
              est apparue dans les résultats de Google. <strong className="font-medium text-[#465269]">Clics</strong> :
              les visites qui en ont découlé. <strong className="font-medium text-[#465269]">CTR</strong> : la part des
              impressions transformées en clic. <strong className="font-medium text-[#465269]">Position moyenne</strong> :
              le rang moyen dans les résultats — 1 correspond à la première place, 11 au début de la deuxième page.
            </p>

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
                  head={["Page", "Clics", "Impressions", "Taux de clic", "Position"]}
                  rows={gsc.pages.map((row) => [
                    <PageCell key="p" path={row.page.replace(/^https?:\/\/[^/]+/, "") || "/"} title={row.page} />,
                    num(row.clicks),
                    num(row.impressions),
                    pct(row.ctr),
                    row.position.toFixed(1),
                  ])}
                />
              </Card>
              <div className="grid gap-3">
                <Card title="Pays" subtitle="Clics dans les résultats de recherche">
                  <BarList rows={gsc.countries.map((c) => ({ label: countryLabel(c.country), value: c.clicks }))} />
                </Card>
                <Card title="Appareils" subtitle="Clics dans les résultats de recherche">
                  <BarList rows={gsc.devices.map((d) => ({ label: deviceLabel(d.device), value: d.clicks }))} />
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

        {/* Deux mesures se recoupent ici, et l'écart entre elles est normal : le
            site compte ce qu'il voit jusqu'au panier, Shopify compte les commandes
            payées. Les nommer distinctement évite de prendre l'une pour l'autre. */}
        <p className="mt-10 text-[12px] text-[#818a97] max-w-3xl leading-relaxed">
          Le chiffre d&apos;affaires vient des commandes de l&apos;administration Shopify. Le tunnel de paiement quittant
          bien.health, la mesure faite par le site s&apos;arrête, elle, à l&apos;ajout au panier
          {commerce
            ? ` : ${num(commerce.addToCarts)} sur la période, dont ${num(commerce.checkouts)} passage${
                commerce.checkouts > 1 ? "s" : ""
              } au paiement.`
            : "."}
          {" "}Les visites comptées par Shopify diffèrent de celles d&apos;Analytics : les deux outils ne mesurent pas la
          même chose, et le taux de conversion affiché ici se rapporte aux visites du site.
        </p>

        <footer className="mt-12 pt-6 border-t border-black/[0.08] text-[11px] text-[#8c94a1]">
          SEO by Clickzou — compteur temps réel toutes les 20 secondes, tableaux rechargés toutes les 5 minutes,
          sans aucune mise en cache.
          {" "}Période de comparaison : du {longDate(period.previous.start)} au {longDate(period.previous.end)}.
        </footer>
      </main>
    </div>
  );
}
