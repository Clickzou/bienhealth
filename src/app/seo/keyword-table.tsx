"use client";

import { useMemo, useState } from "react";
import type { GscQuery } from "@/lib/seo-dashboard/gsc";

/**
 * Tableau des mots-clés : c'est la vue qu'on utilise le plus longtemps, elle a
 * donc besoin d'être triable et filtrable côté client — les cent lignes sont
 * déjà chargées, un aller-retour serveur pour un tri serait absurde.
 *
 * L'évolution de position se lit à l'envers des autres colonnes : passer de la
 * position 14 à la position 8, c'est **−6**, et c'est une bonne nouvelle. La
 * flèche verte indique donc une position qui diminue.
 */
type SortKey = "clicks" | "impressions" | "ctr" | "position" | "delta";

const nf = new Intl.NumberFormat("fr-FR");
const nf1 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function KeywordTable({ rows }: { rows: GscQuery[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("clicks");
  const [top10Only, setTop10Only] = useState(false);

  const data = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = rows.filter(
      (r) => (!needle || r.query.toLowerCase().includes(needle)) && (!top10Only || r.position <= 10),
    );
    const delta = (r: GscQuery) => (r.previousPosition === null ? Number.POSITIVE_INFINITY : r.position - r.previousPosition);
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "position":
          return a.position - b.position;
        case "delta":
          return delta(a) - delta(b);
        case "ctr":
          return b.ctr - a.ctr;
        case "impressions":
          return b.impressions - a.impressions;
        default:
          return b.clicks - a.clicks;
      }
    });
  }, [rows, search, sort, top10Only]);

  function exportCsv() {
    const header = "Mot-cle;Clics;Impressions;CTR (%);Position;Position precedente";
    const lines = data.map((r) =>
      [
        `"${r.query.replace(/"/g, '""')}"`,
        Math.round(r.clicks),
        Math.round(r.impressions),
        r.ctr.toFixed(2).replace(".", ","),
        r.position.toFixed(1).replace(".", ","),
        r.previousPosition === null ? "" : r.previousPosition.toFixed(1).replace(".", ","),
      ].join(";"),
    );
    // BOM en tête : sans lui, Excel en français ouvre les accents en mojibake.
    const blob = new Blob([`﻿${header}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mots-cles-bien-health-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const sorts: { key: SortKey; label: string }[] = [
    { key: "clicks", label: "Clics" },
    { key: "impressions", label: "Impressions" },
    { key: "ctr", label: "CTR" },
    { key: "position", label: "Meilleure position" },
    { key: "delta", label: "Plus fortes progressions" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrer un mot-clé…"
          className="rounded-lg bg-black/30 ring-1 ring-white/15 focus:ring-bien-sky outline-none px-3 py-1.5 text-[13px] text-white placeholder:text-white/30 w-full sm:w-56"
        />
        <div className="flex flex-wrap gap-1">
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`rounded-full px-3 py-1.5 text-[12px] transition ${
                sort === s.key ? "bg-bien-sky text-bien-navy font-semibold" : "bg-white/[0.06] text-white/60 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTop10Only((v) => !v)}
          className={`rounded-full px-3 py-1.5 text-[12px] transition ${
            top10Only ? "bg-emerald-400 text-bien-navy font-semibold" : "bg-white/[0.06] text-white/60 hover:text-white"
          }`}
        >
          Page 1 seulement
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto rounded-full px-3 py-1.5 text-[12px] bg-white/[0.06] text-white/60 hover:text-white transition"
        >
          Export CSV
        </button>
      </div>

      <p className="text-[11px] text-white/35 mb-2">
        {data.length} mot{data.length > 1 ? "s" : ""}-clé{data.length > 1 ? "s" : ""} affiché{data.length > 1 ? "s" : ""} sur {rows.length} rapporté{rows.length > 1 ? "s" : ""} par Search Console.
      </p>

      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-white/40">
              <th className="pb-2 font-medium">Mot-clé</th>
              <th className="pb-2 font-medium text-right">Clics</th>
              <th className="pb-2 font-medium text-right">Impressions</th>
              <th className="pb-2 font-medium text-right">CTR</th>
              <th className="pb-2 font-medium text-right">Position</th>
              <th className="pb-2 font-medium text-right">Évolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((r) => {
              const delta = r.previousPosition === null ? null : r.position - r.previousPosition;
              return (
                <tr key={r.query} className="hover:bg-white/[0.03]">
                  <td className="py-2 text-white/85 max-w-[320px] truncate" title={r.query}>
                    {r.query}
                  </td>
                  <td className="py-2 text-right text-white tabular-nums">{nf.format(Math.round(r.clicks))}</td>
                  <td className="py-2 text-right text-white/70 tabular-nums">{nf.format(Math.round(r.impressions))}</td>
                  <td className="py-2 text-right text-white/70 tabular-nums">{nf1.format(r.ctr)} %</td>
                  <td className="py-2 text-right tabular-nums">
                    <span className={r.position <= 10 ? "text-emerald-400 font-medium" : r.position <= 20 ? "text-amber-300" : "text-white/70"}>
                      {nf1.format(r.position)}
                    </span>
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {delta === null ? (
                      <span className="text-bien-sky text-[11px]">nouveau</span>
                    ) : Math.abs(delta) < 0.3 ? (
                      <span className="text-white/30">=</span>
                    ) : (
                      <span className={delta < 0 ? "text-emerald-400" : "text-rose-400"}>
                        {delta < 0 ? "▲" : "▼"} {nf1.format(Math.abs(delta))}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!data.length && <p className="text-sm text-white/40 py-6 text-center">Aucun mot-clé ne correspond à ce filtre.</p>}
    </div>
  );
}
