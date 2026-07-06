import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";

/**
 * Réception des demandes « Devenir revendeur ».
 * Enregistre dans Supabase (table `reseller_requests`) si configuré — best-effort :
 * on renvoie toujours OK côté UX même si le stockage échoue.
 */
export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("reseller_requests").insert({
        type: payload.type ?? null,
        company: payload.company ?? null,
        contact: payload.contact ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        location: payload.location ?? null,
        web: payload.web ?? null,
        message: payload.message ?? null,
        status: "pending",
      });
    } catch (e) {
      console.error("reseller_requests insert:", e);
    }
  } else {
    console.log("[revendeur] demande reçue (Supabase non configuré) :", payload);
  }

  return NextResponse.json({ ok: true });
}
