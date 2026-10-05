import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";
import { escapeHtml, sendMail } from "@/lib/resend";

/**
 * Réception des demandes « Devenir revendeur ».
 *
 * La demande part par e-mail à la marque (Resend), et s'enregistre en plus dans
 * Supabase (table `reseller_requests`) si celui-ci est configuré. Jusqu'au
 * 05/10/2026, Supabase était la seule voie : jamais configuré en production, il
 * laissait la route répondre « OK » en perdant tout (GO-LIVE.md, § 34). Désormais
 * la route ne répond OK que si au moins une des deux voies a abouti ; sinon le
 * formulaire affiche une erreur et l'adresse à laquelle écrire.
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

/** Destinataire des demandes, donné par la marque le 05/10/2026. */
const NOTIFY_TO = process.env.RESELLER_NOTIFY_TO?.trim() || "administration@bien.health";

/** Libellés de l'e-mail, dans l'ordre du formulaire. */
const LABELS: Record<string, string> = {
  type: "Type d'établissement",
  company: "Établissement",
  contact: "Contact",
  email: "E-mail",
  phone: "Téléphone",
  location: "Ville / Pays",
  web: "Site web / Instagram",
  message: "Message",
};

function notification(row: Record<string, string | null>) {
  const filled = Object.entries(LABELS).filter(([field]) => row[field]);
  const text = filled.map(([field, label]) => `${label} : ${row[field]}`).join("\n");
  const html = `<p>Nouvelle demande reçue par le formulaire « Devenir revendeur » de bien.health.</p>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${filled
  .map(
    ([field, label]) =>
      `<tr><td style="color:#666;vertical-align:top">${label}</td><td style="white-space:pre-wrap">${escapeHtml(row[field] as string)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="color:#666;font-size:12px">Répondre à ce message écrit directement au demandeur.</p>`;
  return {
    to: NOTIFY_TO,
    subject: `Demande revendeur : ${row.company ?? row.contact ?? row.email}${row.location ? ` (${row.location})` : ""}`,
    text: `Nouvelle demande reçue par le formulaire « Devenir revendeur » de bien.health.

${text}

Répondre à ce message écrit directement au demandeur.`,
    html,
    replyTo: row.email as string,
  };
}

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

  const mailed = await sendMail(notification(row));

  let stored = false;
  if (isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("reseller_requests").insert({ ...row, status: "pending" });
      if (error) throw error;
      stored = true;
    } catch (e) {
      console.error("reseller_requests insert:", e);
    }
  }

  if (!mailed && !stored) {
    // Volontairement sans le contenu du formulaire : nom, e-mail et téléphone
    // n'ont rien à faire dans les logs Vercel, dont la durée de conservation
    // n'est pas celle décidée pour les données clients (RGPD).
    console.error("[revendeur] demande ni envoyée ni enregistrée : le visiteur voit une erreur.");
    return NextResponse.json({ ok: false, error: "not_delivered" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
