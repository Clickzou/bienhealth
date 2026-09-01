import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { isKlaviyoConfigured, subscribeToKlaviyo } from "@/lib/klaviyo";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

/**
 * Inscription newsletter (popup −10 %, footer, quiz diagnostic).
 *
 * Source de vérité = KLAVIYO : c'est la base CRM e-mailing de la marque, et
 * c'est elle qui envoie le code de bienvenue promis dans le popup (flow
 * « Welcome » déclenché par l'ajout à la liste).
 *
 * Shopify reste un miroir best-effort. Attention : le POST sur l'endpoint
 * public `/contact` échoue tant que `SHOPIFY_STORE_DOMAIN` pointe sur le
 * domaine `.myshopify.com`, qui redirige (301) vers le domaine principal et
 * répond 403 aux POST. Le statut est désormais loggué au lieu d'être avalé.
 *
 * Supabase reste un miroir optionnel (table `leads`) si configuré.
 * On renvoie toujours 200 pour ne jamais bloquer la délivrance du code côté
 * client, mais le corps indique ce qui a réellement abouti (diagnostic).
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

  // 1) Klaviyo — inscription à la liste (CRM + envoi du code de bienvenue).
  let klaviyo = false;
  if (isKlaviyoConfigured) {
    klaviyo = await subscribeToKlaviyo(email, source);
  } else {
    console.error(
      "[newsletter] Klaviyo non configuré : définissez KLAVIYO_COMPANY_ID et KLAVIYO_LIST_ID.",
    );
  }

  // 2) Shopify — création du client abonné au marketing (form_type=customer).
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (domain) {
    try {
      const form = new URLSearchParams();
      form.set("form_type", "customer");
      form.set("utf8", "✓");
      form.set("contact[email]", email);
      form.set("contact[tags]", "newsletter");
      const response = await fetch(`https://${domain}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
        redirect: "manual",
      });
      // 302 = succès habituel du thème ; 301 (redirection de domaine) et 403
      // signifient que rien n'a été enregistré.
      if (response.status !== 302 && response.status !== 200) {
        console.error(
          `[newsletter] Shopify n'a pas enregistré l'inscription (HTTP ${response.status} sur https://${domain}/contact).`,
        );
      }
    } catch (err) {
      console.error("[newsletter] échec inscription Shopify:", err);
    }
  }

  // 3) Supabase — miroir CRM optionnel.
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

  return NextResponse.json({ ok: true, klaviyo });
}
