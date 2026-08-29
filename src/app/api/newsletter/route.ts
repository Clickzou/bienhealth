import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

/**
 * Inscription newsletter (popup −10 %).
 *
 * Source de vérité = SHOPIFY : on crée un client abonné au marketing e-mail,
 * exactement comme le formulaire du thème live (clients « Newsletter Subscriber »
 * avec consentement). On POST vers l'endpoint public `/contact` du domaine
 * myshopify (form_type=customer) — server-side, sans token requis.
 *
 * Supabase reste un miroir optionnel (leads/CRM) si configuré.
 * Best-effort : on renvoie toujours `ok` pour ne jamais bloquer la délivrance
 * du code de bienvenue côté client.
 */
export async function POST(request: Request) {
  if (isRateLimited(request, "newsletter", 3)) return tooManyRequests();

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

  // 1) Shopify — création du client abonné au marketing (form_type=customer).
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (domain) {
    try {
      const form = new URLSearchParams();
      form.set("form_type", "customer");
      form.set("utf8", "✓");
      form.set("contact[email]", email);
      form.set("contact[tags]", "newsletter");
      await fetch(`https://${domain}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
        redirect: "manual",
      });
    } catch (err) {
      console.error("[newsletter] échec inscription Shopify:", err);
    }
  }

  // 2) Supabase — miroir CRM optionnel.
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("leads")
        .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
    } catch (err) {
      console.error("[newsletter] échec enregistrement lead Supabase:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
