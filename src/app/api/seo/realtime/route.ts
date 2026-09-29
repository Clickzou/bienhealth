import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSession, SEO_COOKIE } from "@/lib/seo-dashboard/auth";
import { fetchGa4Realtime, isGa4Configured } from "@/lib/seo-dashboard/ga4";
import { microdoseGa4PropertyId } from "@/lib/seo-dashboard/microdose";

/**
 * Compteur temps réel du tableau de bord, interrogé toutes les vingt secondes
 * par le bandeau « en ce moment ».
 *
 * Endpoint séparé de la page pour ne rafraîchir que ce bloc : recharger toute
 * la page toutes les vingt secondes relancerait les dix rapports Analytics et
 * Search Console, pour rien — leurs chiffres ne bougent pas à cette cadence.
 *
 * Protégé par le même cookie de session que la page : sans lui, on ne diffuse
 * pas la fréquentation du site.
 */
export async function GET(req: Request) {
  const session = (await cookies()).get(SEO_COOKIE)?.value;
  if (!isValidSession(session)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Onglet Microdose : même compteur, sur la propriété GA4 de bien-microdose.com.
  const microdose = new URL(req.url).searchParams.get("site") === "microdose";
  if (microdose ? !microdoseGa4PropertyId() : !isGa4Configured()) return NextResponse.json({ configured: false }, { status: 200 });

  const data = await fetchGa4Realtime(microdose ? microdoseGa4PropertyId() : undefined);
  if (!data) return NextResponse.json({ configured: true, error: "unavailable" }, { status: 200 });

  return NextResponse.json(
    { configured: true, ...data },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
