/**
 * Diagnostics remplis sur le site, relus dans Klaviyo.
 *
 * Le quiz `/diagnostic` inscrit chaque personne dans la liste « EMAIL -
 * Contacts typeform "Ton diagnostic personnalisé <3" » et pose ses réponses en
 * propriétés du profil (voir `src/lib/klaviyo.ts`). Klaviyo est donc la base :
 * le site n'en a pas d'autre — les variables Supabase sont vides en local comme
 * en production — et c'est là que la marque lit déjà ses contacts.
 *
 * ## Authentification
 *
 * L'inscription depuis le navigateur passe par l'endpoint « client », qui ne
 * demande que la clé publique. **Relire** des profils demande au contraire une
 * clé privée, à créer dans Klaviyo → Settings → API keys → *Create private
 * key*, avec les droits **lecture** sur *Profiles* et *Lists*. Elle se met dans
 * `KLAVIYO_PRIVATE_API_KEY` (Vercel + `.env.local`) et ne doit jamais partir au
 * navigateur : ce module ne s'exécute que côté serveur, dans une page protégée
 * par mot de passe.
 */
import type { Period } from "./periods";
import { klaviyoListFor, klaviyoPrivateKey } from "@/lib/klaviyo";

const API_REVISION = "2024-10-15";
/** 100 = maximum accepté par Klaviyo. Cinq pages suffisent largement au volume. */
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/** Même clé que celle qui sert à inscrire : voir `lib/klaviyo`. */
const privateKey = klaviyoPrivateKey;

export function isDiagnosticsConfigured(): boolean {
  return privateKey() !== "" && Boolean(klaviyoListFor("diagnostic"));
}

/** Pourquoi la section n'affiche rien — chaque cause appelle un geste différent. */
export type DiagnosticsStatus =
  | "ok"
  | "not-configured"
  | "bad-credentials"
  | "forbidden"
  | "list-not-found"
  | "error";

export type Diagnostic = {
  email: string;
  /** Date d'entrée dans la liste, ISO. `null` si Klaviyo ne la donne pas. */
  joinedAt: string | null;
  /** Même date, ramenée au jour parisien (YYYY-MM-DD) — c'est elle qu'on affiche. */
  day: string | null;
  /** Produit recommandé à l'issue du questionnaire (`diagnostic_resultat`). */
  result: string | null;
  /** Réponses, libellé de question déduit de la clé → réponse. */
  answers: { question: string; answer: string }[];
};

export type DiagnosticsData = {
  /** Diagnostics de la période, du plus récent au plus ancien. */
  items: Diagnostic[];
  /** Nombre de diagnostics sur la période. */
  count: number;
  /** Nombre de profils lus dans la liste, toutes dates confondues. */
  listTotal: number;
  /** Répartition par produit recommandé, du plus fréquent au moins fréquent. */
  byResult: { label: string; value: number }[];
  /** Vrai si la pagination a buté sur sa borne : les totaux sont partiels. */
  capped: boolean;
};

export type DiagnosticsResult = { status: DiagnosticsStatus; data: DiagnosticsData | null };

type KlaviyoProfile = {
  attributes?: {
    email?: string | null;
    created?: string | null;
    joined_group_at?: string | null;
    properties?: Record<string, unknown> | null;
  };
};

/**
 * Libellés des questions du quiz, dans l'ordre où elles sont posées. Les clés
 * suivent `diagnostic_<id de question>` (cf. `diagnosticProperties` dans
 * components/diagnostic-quiz.tsx) ; une clé inconnue reste affichée, telle
 * quelle, plutôt que masquée — mieux vaut une étiquette brute qu'une réponse
 * perdue.
 */
const QUESTION_LABELS: Record<string, string> = {
  diagnostic_age: "Âge",
  diagnostic_genre: "Genre",
  diagnostic_concentration: "Concentration",
  diagnostic_energie: "Énergie au réveil",
  diagnostic_sommeil: "Sommeil / charge mentale",
  diagnostic_peau: "Peau",
  diagnostic_journee: "En journée",
  diagnostic_routine: "Routine bien-être",
  diagnostic_objectifs: "Objectifs",
  diagnostic_langue: "Langue",
};

/** Ordre d'affichage des réponses : celui du questionnaire, pas celui de l'objet. */
const QUESTION_ORDER = Object.keys(QUESTION_LABELS);

/** Jour parisien d'un horodatage ISO. `sv-SE` donne directement YYYY-MM-DD. */
const PARIS_DAY = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" });
function parisDay(iso: string): string | null {
  const time = Date.parse(iso);
  return Number.isNaN(time) ? null : PARIS_DAY.format(new Date(time));
}

function toDiagnostic(profile: KlaviyoProfile): Diagnostic | null {
  const attributes = profile.attributes ?? {};
  const email = typeof attributes.email === "string" ? attributes.email : "";
  if (!email) return null;

  const properties = attributes.properties ?? {};
  const answers: { question: string; answer: string }[] = [];
  const keys = Object.keys(properties)
    .filter((k) => k.startsWith("diagnostic_") && k !== "diagnostic_resultat")
    .sort((a, b) => {
      const ia = QUESTION_ORDER.indexOf(a);
      const ib = QUESTION_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  for (const key of keys) {
    const value = properties[key];
    if (typeof value !== "string" && typeof value !== "number") continue;
    const answer = String(value).trim();
    if (answer) answers.push({ question: QUESTION_LABELS[key] ?? key, answer });
  }

  const result = properties.diagnostic_resultat;
  const joinedAt = attributes.joined_group_at || attributes.created || null;
  return {
    email,
    joinedAt,
    day: joinedAt ? parisDay(joinedAt) : null,
    result: typeof result === "string" && result ? result : null,
    answers,
  };
}

/**
 * Lit la liste du diagnostic et ne garde que les profils portant au moins une
 * réponse : la liste contient aussi les 246 contacts importés de Typeform, qui
 * n'ont pas d'historique de réponses côté site.
 */
export async function fetchDiagnostics(period: Period): Promise<DiagnosticsResult> {
  const key = privateKey();
  const listId = klaviyoListFor("diagnostic");
  if (!key || !listId) return { status: "not-configured", data: null };

  const profiles: KlaviyoProfile[] = [];
  let url:
    | string
    | null = `https://a.klaviyo.com/api/lists/${encodeURIComponent(listId)}/profiles/?page[size]=${PAGE_SIZE}&sort=-joined_group_at`;
  let capped = false;

  try {
    for (let page = 0; page < MAX_PAGES && url; page++) {
      const res: Response = await fetch(url, {
        headers: {
          Authorization: `Klaviyo-API-Key ${key}`,
          revision: API_REVISION,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) return { status: "bad-credentials", data: null };
        if (res.status === 403) return { status: "forbidden", data: null };
        if (res.status === 404) return { status: "list-not-found", data: null };
        const detail = await res.text().catch(() => "");
        console.error(`[diagnostics] Klaviyo HTTP ${res.status} : ${detail.slice(0, 400)}`);
        return { status: "error", data: null };
      }

      const json = (await res.json()) as { data?: KlaviyoProfile[]; links?: { next?: string | null } };
      profiles.push(...(json.data ?? []));
      url = json.links?.next ?? null;
      if (url && page === MAX_PAGES - 1) capped = true;
    }
  } catch (err) {
    console.error("[diagnostics] appel Klaviyo impossible :", err);
    return { status: "error", data: null };
  }

  const all = profiles
    .map(toDiagnostic)
    .filter((d): d is Diagnostic => d !== null && d.answers.length > 0)
    .sort((a, b) => (b.joinedAt ?? "").localeCompare(a.joinedAt ?? ""));

  // Klaviyo horodate en UTC (« 2026-09-02T15:16:55+00:00 ») alors que les bornes
  // de période sont des jours calendaires parisiens, comme partout ailleurs dans
  // ce tableau de bord. On ramène donc chaque date au jour parisien avant de
  // comparer, sinon une inscription de 00 h 30 tomberait la veille.
  //
  // La borne haute est **aujourd'hui**, et non la fin de période. Celle-ci
  // s'arrête à hier parce que GA4 et Search Console publient avec un jour ou
  // deux de retard ; Klaviyo, lui, répond en temps réel. Sans cette exception,
  // un diagnostic rempli le matin même n'apparaissait pas avant le lendemain —
  // et la section semblait vide alors qu'elle venait d'en recevoir un.
  const today = PARIS_DAY.format(new Date());
  const items = all.filter((d) => d.day !== null && d.day >= period.current.start && d.day <= today);

  const tally = new Map<string, number>();
  for (const d of items) tally.set(d.result ?? "Sans résultat", (tally.get(d.result ?? "Sans résultat") ?? 0) + 1);

  return {
    status: "ok",
    data: {
      items,
      count: items.length,
      listTotal: profiles.length,
      byResult: [...tally.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      capped,
    },
  };
}
