import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidSession, SEO_COOKIE } from "@/lib/seo-dashboard/auth";
import { fetchAllDiagnostics, QUESTION_LABELS } from "@/lib/seo-dashboard/diagnostics";
import { buildDiagnosticsCsv } from "@/lib/seo-dashboard/diagnostics-csv";

/**
 * Export de **tous** les diagnostics remplis depuis la mise en ligne du
 * questionnaire — une ligne par personne, une colonne par question.
 *
 * Le tableau de bord n'affiche que la période choisie, et seulement les
 * quarante derniers ; cet export répond au besoin inverse : tout relire dans un
 * tableur, sans passer par l'interface de Klaviyo. La mise en forme du fichier
 * est dans `diagnostics-csv`, cette route ne fait que l'authentification et
 * l'en-tête de téléchargement.
 *
 * Protégée par le cookie de session du tableau de bord : le fichier contient
 * des adresses email et des réponses personnelles.
 */
export async function GET() {
  const session = (await cookies()).get(SEO_COOKIE)?.value;
  if (!isValidSession(session)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { status, items } = await fetchAllDiagnostics();
  if (status !== "ok") {
    // Le bouton n'apparaît que lorsque la section fonctionne ; arriver ici
    // signale une panne côté Klaviyo, qu'il vaut mieux nommer qu'exporter vide.
    return NextResponse.json({ error: status }, { status: status === "not-configured" ? 503 : 502 });
  }

  const csv = buildDiagnosticsCsv(items, Object.values(QUESTION_LABELS));
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(new Date());

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="diagnostics-bien-health-${today}.csv"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
