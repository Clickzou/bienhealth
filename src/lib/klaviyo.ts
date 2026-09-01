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

export const isKlaviyoConfigured = Boolean(companyId && listId);

/**
 * Abonne `email` à la liste configurée. Renvoie `true` si Klaviyo a accepté
 * (202), `false` sinon — l'appelant décide quoi en faire, aucune exception
 * n'est propagée.
 */
export async function subscribeToKlaviyo(
  email: string,
  source: string,
): Promise<boolean> {
  if (!companyId || !listId) return false;

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
                    properties: { source },
                  },
                },
              },
            },
            relationships: {
              list: { data: { type: "list", id: listId } },
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
