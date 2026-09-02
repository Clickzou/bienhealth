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
/**
 * Ne laisse passer que des paires clé/valeur textuelles et bornées : ces
 * propriétés partent telles quelles chez Klaviyo, elles viennent du navigateur
 * et ne doivent ni gonfler la requête ni y injecter des structures.
 */
function sanitizeProperties(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (Object.keys(out).length >= 30) break;
    if (!/^[a-z0-9_]{1,60}$/i.test(key)) continue;
    if (typeof value !== "string" && typeof value !== "number") continue;
    const text = String(value).trim();
    if (text) out[key] = text.slice(0, 500);
  }
  return out;
}

export async function POST(request: Request) {
  if (isRateLimited(request, "newsletter", 3)) return tooManyRequests();

  let email = "";
  let source = "newsletter_popup";
  let properties: Record<string, string> = {};
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (typeof body.source === "string" && body.source) source = body.source;
    properties = sanitizeProperties(body.properties);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Horodatage du diagnostic, posé ici et non par le navigateur : c'est la
  // seule date fiable, et surtout la seule qui dise QUAND le questionnaire a
  // été rempli. Klaviyo ne donne sinon que la date d'entrée dans la liste, qui
  // ne bouge plus pour quelqu'un déjà inscrit — un habitué qui refait le quiz
  // restait alors invisible dans le tableau de bord.
  if (source === "diagnostic" && Object.keys(properties).length > 0) {
    properties.diagnostic_date = new Date().toISOString();
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // 1) Klaviyo — inscription à la liste (CRM + envoi du code de bienvenue).
  // La liste dépend de `source` : le diagnostic a la sienne (cf. lib/klaviyo).
  let klaviyo = false;
  if (isKlaviyoConfigured) {
    klaviyo = await subscribeToKlaviyo(email, source, properties);
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

  // 3) Supabase — miroir CRM optionnel, et pour l'instant théorique : les trois
  // variables sont vides en local comme en production (cf. GO-LIVE § 23), donc
  // ce bloc ne s'exécute pas. Il reste écrit et à jour — réponses du diagnostic
  // comprises — pour que le jour où la base est provisionnée, la marque ait sa
  // propre copie des leads sans repasser par ici.
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      // `upsert` ne lève pas : une colonne manquante ou un refus RLS revient
      // dans `error` et passait jusqu'ici inaperçu — d'où un miroir qu'on
      // croyait actif alors qu'il n'écrivait rien.
      const { error } = await supabase
        .from("leads")
        .upsert(
          { email, source, ...(Object.keys(properties).length ? { properties } : {}) },
          { onConflict: "email", ignoreDuplicates: false },
        );
      if (error) console.error("[newsletter] Supabase a refusé le lead:", error.message);
    } catch (err) {
      console.error("[newsletter] échec enregistrement lead Supabase:", err);
    }
  }

  return NextResponse.json({ ok: true, klaviyo });
}
