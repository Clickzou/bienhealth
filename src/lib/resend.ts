/**
 * Envoi d'e-mails transactionnels du site via Resend (https://resend.com).
 *
 * Mis en place le 05/10/2026 pour le formulaire « Devenir revendeur » : la
 * route n'écrivait que dans Supabase, jamais configuré en production, et toutes
 * les demandes reçues depuis la bascule du 29/08/2026 ont été perdues sans que
 * personne le voie (GO-LIVE.md, § 34).
 *
 * Appel HTTP direct plutôt que le SDK : une seule requête, aucune dépendance.
 * Resend répond franchement — 200 avec un `id`, sinon un 4xx dont le `message`
 * nomme la cause (clé invalide, domaine non vérifié…). On ne renvoie donc
 * « envoyé » que sur un 200.
 *
 * Variables d'environnement (voir .env.local.example) :
 *   RESEND_API_KEY   clé `re_…`, droit « Sending access » suffit
 *   RESEND_FROM      expéditeur, sur un domaine vérifié dans Resend
 */

const DEFAULT_FROM = "Site BIEN Health <formulaire@bien.health>";

export const isResendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Adresse à laquelle répond le destinataire : celle du demandeur. */
  replyTo?: string;
};

/** Envoie le message ; `true` seulement si Resend l'a accepté. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM?.trim() || DEFAULT_FROM,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });
    if (res.ok) return true;
    // Le message d'erreur de Resend décrit la configuration, jamais le contenu
    // du mail : on peut le journaliser sans y faire entrer de données client.
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    console.error(`[resend] ${res.status} : ${body.message ?? "réponse illisible"}`);
    return false;
  } catch (e) {
    console.error("[resend] échec réseau :", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Échappe une saisie de formulaire avant de l'insérer dans un e-mail HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
