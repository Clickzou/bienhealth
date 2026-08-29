import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

/**
 * Réception des demandes « Devenir revendeur ».
 * Enregistre dans Supabase (table `reseller_requests`) si configuré — best-effort :
 * on renvoie toujours OK côté UX même si le stockage échoue.
 *
 * L'écriture se fait avec la clé service role, qui contourne les politiques RLS :
 * tout ce qui entre ici finit donc en base sans filtre. D'où la validation
 * explicite ci-dessous — champs connus uniquement, types vérifiés, longueurs
 * bornées (audit sécurité du 29/08/2026, § 5). Sans elle, n'importe qui pouvait
 * insérer des objets arbitraires de plusieurs mégaoctets.
 */

/** Champs acceptés et longueur maximale de chacun. Tout le reste est ignoré. */
const FIELDS: Record<string, number> = {
  type: 60,
  company: 200,
  contact: 120,
  email: 200,
  phone: 40,
  location: 200,
  web: 300,
  message: 2000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Une valeur n'est retenue que si c'est une chaîne : un objet ou un tableau
 *  passerait tel quel dans la colonne texte de Supabase. */
function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: Request) {
  if (isRateLimited(req, "revendeur", 3)) return tooManyRequests();

  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const row: Record<string, string | null> = {};
  for (const [field, max] of Object.entries(FIELDS)) {
    row[field] = clean(payload[field], max);
  }

  // Sans e-mail valide, la demande est inexploitable commercialement : autant la
  // refuser tout de suite plutôt que d'encombrer la table.
  if (!row.email || !EMAIL.test(row.email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("reseller_requests").insert({ ...row, status: "pending" });
    } catch (e) {
      console.error("reseller_requests insert:", e);
    }
  } else {
    // Volontairement sans le contenu du formulaire : nom, e-mail et téléphone
    // n'ont rien à faire dans les logs Vercel, dont la durée de conservation
    // n'est pas celle décidée pour les données clients (RGPD).
    console.warn("[revendeur] demande reçue mais Supabase n'est pas configuré : elle est perdue.");
  }

  return NextResponse.json({ ok: true });
}
