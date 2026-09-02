/**
 * Inscription d'un email dans Klaviyo (CRM e-mailing de la marque).
 *
 * On utilise l'endpoint « client » `/client/subscriptions/`, qui ne demande que
 * la clé PUBLIQUE du compte (le « company ID » / Site ID, 6 caractères, visible
 * dans Klaviyo → Settings → API keys). Aucun secret n'est donc stocké côté
 * serveur, et le comportement d'inscription (simple ou double opt-in) reste
 * celui réglé sur la liste dans Klaviyo — c'est aussi ce qui déclenche le flow
 * « Welcome » qui envoie le code de bienvenue par mail.
 *
 * Variables d'environnement (voir .env.local.example) :
 *   KLAVIYO_COMPANY_ID  clé publique du compte (ex. `AbC123`)
 *   KLAVIYO_LIST_ID     identifiant de la liste destinataire (ex. `XyZ789`)
 */

const API_REVISION = "2024-10-15";

const companyId = process.env.KLAVIYO_COMPANY_ID;
const listId = process.env.KLAVIYO_LIST_ID;

/**
 * Liste « EMAIL - Contacts typeform "Ton diagnostic personnalisé <3" », qui
 * reçoit historiquement les contacts du questionnaire (246 profils au
 * 02/09/2026). Le quiz du site les envoyait dans la liste newsletter, à côté
 * des inscriptions du popup et du footer : impossible d'écrire au seul public
 * du diagnostic. Repli en dur sur le même principe que le pixel Meta, pour que
 * la production marche sans attendre une variable Vercel ; `KLAVIYO_DIAGNOSTIC_LIST_ID`
 * la remplace si un jour la liste change.
 */
const DIAGNOSTIC_LIST_FALLBACK = "Y9itLF";
const diagnosticListId = process.env.KLAVIYO_DIAGNOSTIC_LIST_ID || DIAGNOSTIC_LIST_FALLBACK;

/** Liste destinataire selon l'origine de l'inscription. */
export function klaviyoListFor(source: string): string | undefined {
  return source === "diagnostic" ? diagnosticListId : listId;
}

export const isKlaviyoConfigured = Boolean(companyId);

/**
 * Abonne `email` à la liste correspondant à `source`. `properties` est posé sur
 * le profil Klaviyo : c'est ainsi que les réponses du diagnostic voyagent avec
 * l'adresse, et qu'on peut segmenter dessus. Renvoie `true` si Klaviyo a
 * accepté (202), `false` sinon — l'appelant décide quoi en faire, aucune
 * exception n'est propagée.
 */
export async function subscribeToKlaviyo(
  email: string,
  source: string,
  properties: Record<string, string> = {},
): Promise<boolean> {
  const list = klaviyoListFor(source);
  if (!companyId || !list) return false;

  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(companyId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          revision: API_REVISION,
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              // Trace l'origine de l'inscription dans le profil Klaviyo
              // (popup −10 %, footer, quiz diagnostic…).
              custom_source: source,
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    email,
                    properties: { source, ...properties },
                  },
                },
              },
            },
            relationships: {
              list: { data: { type: "list", id: list } },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[klaviyo] inscription refusée (${response.status}) : ${detail.slice(0, 500)}`,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[klaviyo] appel impossible :", err);
    return false;
  }
}
