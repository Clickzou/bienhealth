/**
 * Mise en tableau des diagnostics — une ligne par personne, une colonne par
 * question. Fonction pure, sans appel réseau : c'est ce qui la rend vérifiable.
 *
 * ## Pourquoi un CSV et pas un `.xlsx`
 *
 * Un vrai classeur Excel demanderait une dépendance de plusieurs mégaoctets
 * pour un tableau plat. Le fichier produit ici est calibré pour Excel en
 * français : BOM UTF-8 (sans lui, les accents sortent en `Ã©`), point-virgule
 * en séparateur (le français réserve la virgule aux décimales) et dates en
 * `JJ/MM/AAAA`, reconnues comme dates à l'ouverture. Un double-clic suffit.
 */

/** Ce que l'export attend d'un diagnostic — un sous-ensemble de `Diagnostic`. */
export type DiagnosticRow = {
  email: string;
  joinedAt: string | null;
  result: string | null;
  answers: { question: string; answer: string }[];
};

/** Les colonnes fixes précèdent les questions du quiz. */
export const FIXED_COLUMNS = ["Email", "Date", "Heure", "Produit recommandé"];

const PARIS_PARTS = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** `2026-09-02T15:16:55Z` → `["02/09/2026", "17:16"]`, heure de Paris. */
export function parisDateTime(value: string | null): [string, string] {
  if (!value) return ["", ""];
  const time = Date.parse(value);
  if (Number.isNaN(time)) return ["", ""];
  const parts = PARIS_PARTS.formatToParts(new Date(time));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return [`${get("day")}/${get("month")}/${get("year")}`, `${get("hour")}:${get("minute")}`];
}

/**
 * Échappement CSV, plus la protection contre les formules : un tableur exécute
 * une cellule qui commence par `=`, `+`, `-` ou `@`. Les réponses du quiz sont
 * fermées, mais l'adresse email reste une saisie libre, et ce fichier est fait
 * pour être ouvert dans Excel.
 */
export function cell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[";\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Colonnes de questions : celles du quiz dans l'ordre, puis les inattendues. */
export function questionColumns(items: DiagnosticRow[], known: string[]): string[] {
  const extra: string[] = [];
  for (const item of items) {
    for (const { question } of item.answers) {
      if (!known.includes(question) && !extra.includes(question)) extra.push(question);
    }
  }
  return [...known, ...extra];
}

export function buildDiagnosticsCsv(items: DiagnosticRow[], knownQuestions: string[]): string {
  const questions = questionColumns(items, knownQuestions);
  const lines = [[...FIXED_COLUMNS, ...questions].map(cell).join(";")];

  for (const item of items) {
    const [date, hour] = parisDateTime(item.joinedAt);
    const answers = new Map(item.answers.map((a) => [a.question, a.answer]));
    lines.push(
      [item.email, date, hour, item.result ?? "", ...questions.map((q) => answers.get(q) ?? "")]
        .map(cell)
        .join(";"),
    );
  }

  // Le BOM est ce qui décide Excel à lire le fichier en UTF-8.
  return `﻿${lines.join("\r\n")}\r\n`;
}
