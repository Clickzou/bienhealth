/**
 * Périodes du tableau de bord et période de comparaison associée.
 *
 * Toutes les dates sont calculées en Europe/Paris — le serveur Vercel est en
 * UTC, et sans ce recalage le « 7 derniers jours » sautait un jour entre 00h et
 * 02h. Les API Google attendent des dates au format YYYY-MM-DD.
 *
 * La veille sert de dernier jour : GA4 et Search Console ne consolident pas la
 * journée en cours (Search Console a même deux à trois jours de retard), un
 * dashboard qui l'inclut affiche une chute de trafic qui n'existe pas.
 */
export const PERIODS = {
  "7d": { days: 7, label: "7 jours" },
  "28d": { days: 28, label: "28 jours" },
  "90d": { days: 90, label: "3 mois" },
  "365d": { days: 365, label: "12 mois" },
} as const;

export type PeriodKey = keyof typeof PERIODS;
export const DEFAULT_PERIOD: PeriodKey = "28d";

export function isPeriodKey(v: string | undefined): v is PeriodKey {
  return !!v && v in PERIODS;
}

export type Range = { start: string; end: string };
export type Period = {
  key: PeriodKey;
  label: string;
  days: number;
  current: Range;
  /** Même durée, juste avant : la base des « +12 % » affichés sur les cartes. */
  previous: Range;
};

function parisToday(): Date {
  const now = new Date();
  // `sv-SE` donne directement YYYY-MM-DD, ce qui évite un formatage manuel.
  const iso = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(now);
  return new Date(`${iso}T00:00:00Z`);
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shift(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function resolvePeriod(key: PeriodKey): Period {
  const { days, label } = PERIODS[key];
  const end = shift(parisToday(), -1); // hier
  const start = shift(end, -(days - 1));
  const prevEnd = shift(start, -1);
  const prevStart = shift(prevEnd, -(days - 1));

  return {
    key,
    label,
    days,
    current: { start: iso(start), end: iso(end) },
    previous: { start: iso(prevStart), end: iso(prevEnd) },
  };
}

/** Variation en pourcentage, `null` quand la période précédente est vide —
 *  passer de 0 à 12 n'est pas « +1200 % », c'est un démarrage. */
export function variation(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}
