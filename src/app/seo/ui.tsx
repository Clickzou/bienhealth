/**
 * Briques d'affichage du tableau de bord « SEO by Clickzou ».
 *
 * Composants serveur, sans dépendance de graphes : les courbes sont du SVG
 * calculé ici même. Une bibliothèque de charts pèserait plus lourd que tout le
 * reste de la page pour deux tracés, et le rendu serveur évite le clignotement
 * au chargement.
 *
 * Palette sombre assumée : l'outil interne doit se distinguer au premier coup
 * d'œil du site public, qui est clair.
 */
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ format */

const nf = new Intl.NumberFormat("fr-FR");
const nf1 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function num(value: number): string {
  return nf.format(Math.round(value));
}

export function pct(value: number): string {
  return `${nf1.format(value)} %`;
}

export function money(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function duration(seconds: number): string {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`;
}

export function shortDate(isoDate: string): string {
  // GA4 renvoie « 20260829 », Search Console « 2026-08-29 ».
  const clean = isoDate.includes("-") ? isoDate : `${isoDate.slice(0, 4)}-${isoDate.slice(4, 6)}-${isoDate.slice(6, 8)}`;
  const d = new Date(`${clean}T00:00:00Z`);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", timeZone: "UTC" }).format(d);
}

export function longDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/* -------------------------------------------------------------- conteneurs */

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-5 sm:p-6 ${className}`}>
      {title && (
        <header className="mb-4">
          <h2 className="text-[15px] font-semibold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-white/45">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-10 mb-4">
      <h2 className="text-lg font-semibold text-white tracking-tight">{children}</h2>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

/* --------------------------------------------------------------------- KPI */

/** Variation affichée à côté d'un chiffre. `invert` pour les métriques où
 *  baisser est bon (taux de rebond, position moyenne dans Google). */
export function Delta({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null || !Number.isFinite(value)) {
    return <span className="text-[11px] text-white/35">pas de comparaison</span>;
  }
  const good = invert ? value < 0 : value > 0;
  const flat = Math.abs(value) < 0.5;
  const color = flat ? "text-white/45" : good ? "text-emerald-400" : "text-rose-400";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`text-[11px] font-medium ${color}`}>
      {sign}
      {nf1.format(value)} % vs période précédente
    </span>
  );
}

export function Kpi({
  label,
  value,
  delta,
  invert,
  hint,
}: {
  label: string;
  value: string;
  delta?: number | null;
  invert?: boolean;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 px-4 py-3.5">
      <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-white tabular-nums tracking-tight">{value}</p>
      <div className="mt-1">{delta !== undefined ? <Delta value={delta} invert={invert} /> : hint ? <span className="text-[11px] text-white/35">{hint}</span> : null}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ courbe */

export type Series = { label: string; color: string; points: number[] };

/**
 * Courbe multi-séries. Chaque série est normalisée sur sa propre échelle :
 * superposer des impressions (milliers) et des clics (dizaines) sur un axe
 * commun écraserait la seconde courbe sur la ligne du bas.
 */
export function LineChart({ labels, series, height = 160 }: { labels: string[]; series: Series[]; height?: number }) {
  const width = 900;
  const pad = { top: 10, right: 8, bottom: 22, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const count = labels.length;

  if (count < 2) {
    return <p className="text-sm text-white/40 py-6 text-center">Pas assez de jours sur cette période pour tracer une courbe.</p>;
  }

  const x = (i: number) => pad.left + (i / (count - 1)) * innerW;

  const paths = series.map((s) => {
    const max = Math.max(...s.points, 1);
    const y = (v: number) => pad.top + innerH - (v / max) * innerH;
    const d = s.points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const area = `${d} L${x(count - 1).toFixed(1)},${(pad.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`;
    return { ...s, d, area, max };
  });

  // Quatre repères de date au maximum : au-delà, ils se chevauchent sur mobile.
  const ticks = [0, Math.floor((count - 1) / 3), Math.floor((2 * (count - 1)) / 3), count - 1].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={series.map((s) => s.label).join(", ")}>
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1={pad.left} x2={width - pad.right} y1={pad.top + innerH * r} y2={pad.top + innerH * r} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
        ))}
        {paths.map((p) => (
          <g key={p.label}>
            <path d={p.area} fill={p.color} opacity={0.1} />
            <path d={p.d} fill="none" stroke={p.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === count - 1 ? "end" : "middle"} fontSize={11} fill="rgba(255,255,255,0.4)">
            {shortDate(labels[i])}
          </text>
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 mt-2">
        {paths.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.label} <span className="text-white/35">(max {num(p.max)})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- listes/tables */

export function BarList({ rows, unit = "" }: { rows: { label: string; value: number; extra?: string }[]; unit?: string }) {
  if (!rows.length) return <Empty />;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-bien-sky/20" style={{ width: `${(r.value / max) * 100}%` }} />
          <div className="relative flex items-center justify-between gap-3 px-3 py-2">
            <span className="text-[13px] text-white/85 truncate">{r.label || "(non défini)"}</span>
            <span className="text-[13px] font-medium text-white tabular-nums shrink-0">
              {num(r.value)}
              {unit && <span className="text-white/40 text-[11px] ml-1">{unit}</span>}
              {r.extra && <span className="text-white/40 text-[11px] ml-2">{r.extra}</span>}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
      <table className="w-full min-w-[560px] text-[13px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-white/40">
            {head.map((h, i) => (
              <th key={h} className={`pb-2 font-medium ${i === 0 ? "" : "text-right"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.03]">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 ${j === 0 ? "text-white/85 max-w-[420px]" : "text-right text-white tabular-nums whitespace-nowrap"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Empty({ children = "Aucune donnée sur cette période." }: { children?: ReactNode }) {
  return <p className="text-sm text-white/40 py-6 text-center">{children}</p>;
}

/* ------------------------------------------------- sources non configurées */

/** Carte affichée à la place d'un bloc dont la source n'est pas connectée.
 *  On préfère un mode d'emploi à des chiffres de démonstration : un tableau de
 *  bord qui invente des données est pire qu'un tableau de bord vide. */
export function NotConnected({ title, why, steps }: { title: string; why: string; steps: string[] }) {
  return (
    <Card className="border-dashed">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
        <div>
          <h3 className="text-[15px] font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/55 max-w-2xl">{why}</p>
          <ol className="mt-3 space-y-1.5 text-[13px] text-white/70 list-decimal pl-4 max-w-2xl">
            {steps.map((s) => (
              <li key={s} dangerouslySetInnerHTML={{ __html: s }} />
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}

export function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/55">
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`} />
      {label}
    </span>
  );
}
