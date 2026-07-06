import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Capture d'un lead newsletter (popup −10 %).
 * Enregistre dans la table Supabase `leads` (source unique des leads,
 * cf. PLAN-REFONTE). Best-effort : si Supabase n'est pas configuré ou si
 * l'insertion échoue, on renvoie tout de même `ok` — le code de bienvenue
 * est délivré côté client et le tunnel de conversion n'est jamais bloqué.
 */
export async function POST(request: Request) {
  let email = "";
  let source = "newsletter_popup";
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (typeof body.source === "string" && body.source) source = body.source;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      // upsert sur l'email pour éviter les doublons si le visiteur revient.
      await supabase
        .from("leads")
        .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
    } catch (err) {
      // On loggue mais on ne bloque pas la délivrance du code.
      console.error("[newsletter] échec enregistrement lead Supabase:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
