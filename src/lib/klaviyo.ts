/**
 * Inscription d'un email dans Klaviyo (CRM e-mailing de la marque).
 *
 * ## Deux voies, et pourquoi la voie serveur est la bonne
 *
 * L'endpoint `/client/subscriptions/` ne demande que la clé PUBLIQUE du compte.
 * C'est celui qui a été branché le 01/09/2026, faute de clé privée. Il est
 * conçu pour le **navigateur** : Klaviyo y contrôle le domaine appelant, et il
 * répond `202 Accepted` sans jamais dire ce qu'il a fait de la demande. Appelé
 * depuis un serveur, il a fini par tout avaler en silence — le 02/09/2026,
 * trois inscriptions de test via trois chemins différents ont reçu 202 sans
 * qu'aucun profil n'apparaisse dans le compte. Une panne invisible, exactement
 * celle que le § 23 de GO-LIVE.md racontait déjà.
 *
 * Depuis qu'une clé privée existe (pour le tableau de bord), on passe donc par
 * `/api/profile-subscription-bulk-create-jobs/`, l'API **serveur** : elle est
 * authentifiée, indépendante du domaine appelant, et surtout elle refuse
 * franchement — un scope manquant renvoie un 403 qui nomme le scope. L'endpoint
 * client reste en repli tant qu'aucune clé privée n'est configurée.
 *
 * Scopes requis sur la clé privée : accès complet sur Listes, Profils et
 * Abonnements (`lists:write`, `profiles:write`, `subscriptions:write`) — la
 * lecture, dont se sert le tableau de bord, y est comprise. Ces autorisations
 * ne se modifient pas après coup dans Klaviyo : il faut cloner la clé.
 *
 * Variables d'environnement (voir .env.local.example) :
 *   KLAVIYO_COMPANY_ID           clé publique du compte (ex. `AbC123`)
 *   KLAVIYO_LIST_ID              liste newsletter (popup, footer)
 *   KLAVIYO_DIAGNOSTIC_LIST_ID   liste du quiz (optionnel, repli plus bas)
 *   KLAVIYO_PRIVATE_API_KEY      clé privée `pk_…` (voie serveur)
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

/**
 * `KLAVIYO_PRIVATE_API_KEY` est le nom retenu ; `KLAVIYO_API_KEY` est accepté
 * parce que c'est celui sous lequel la clé a d'abord été posée, et qu'une
 * inscription muette à cause d'un nom de variable est le genre de panne qui
 * coûte une heure pour rien.
 */
export function klaviyoPrivateKey(): string {
  return (process.env.KLAVIYO_PRIVATE_API_KEY || process.env.KLAVIYO_API_KEY || "").trim();
}

/** Liste destinataire selon l'origine de l'inscription. */
export function klaviyoListFor(source: string): string | undefined {
  return source === "diagnostic" ? diagnosticListId : listId;
}

export const isKlaviyoConfigured = Boolean(companyId || klaviyoPrivateKey());

/**
 * Abonne `email` à la liste correspondant à `source`. `properties` est posé sur
 * le profil Klaviyo : c'est ainsi que les réponses du diagnostic voyagent avec
 * l'adresse, et qu'on peut segmenter dessus. Renvoie `true` si Klaviyo a
 * accepté, `false` sinon — l'appelant décide quoi en faire, aucune exception
 * n'est propagée.
 */
export async function subscribeToKlaviyo(
  email: string,
  source: string,
  properties: Record<string, string> = {},
): Promise<boolean> {
  const list = klaviyoListFor(source);
  if (!list) {
    console.error(`[klaviyo] aucune liste configurée pour la source « ${source} ».`);
    return false;
  }

  const key = klaviyoPrivateKey();
  if (key && (await subscribeServerSide(key, list, email, source, properties))) return true;

  // Repli : sans clé privée, ou si la voie serveur a échoué, on tente encore
  // l'endpoint client — mieux vaut une chance de plus qu'une adresse perdue.
  return subscribeClientSide(list, email, source, properties);
}

/**
 * Voie serveur, authentifiée par la clé privée. C'est la voie normale, et elle
 * demande **deux** appels : l'abonnement en masse n'accepte que l'adresse et le
 * consentement — il rejette `properties` avec un 400 explicite. Les réponses du
 * diagnostic passent donc d'abord par `profile-import`, qui crée ou met à jour
 * le profil par son email, avant l'abonnement à la liste.
 *
 * L'abonnement est tenté même si l'import échoue : une adresse sans ses
 * réponses vaut toujours mieux qu'une adresse perdue.
 */
async function subscribeServerSide(
  key: string,
  list: string,
  email: string,
  source: string,
  properties: Record<string, string>,
): Promise<boolean> {
  const headers = {
    Authorization: `Klaviyo-API-Key ${key}`,
    "Content-Type": "application/json",
    revision: API_REVISION,
  };

  await klaviyoPost(
    "https://a.klaviyo.com/api/profile-import/",
    headers,
    { data: { type: "profile", attributes: { email, properties: { source, ...properties } } } },
    "import du profil",
  );

  return klaviyoPost(
    "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
    headers,
    {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          // Trace l'origine de l'inscription dans le profil Klaviyo
          // (popup −10 %, footer, quiz diagnostic…).
          custom_source: source,
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                },
              },
            ],
          },
        },
        relationships: { list: { data: { type: "list", id: list } } },
      },
    },
    "abonnement à la liste",
  );
}

/** POST authentifié qui ne lève pas et dit franchement ce que Klaviyo a répondu. */
async function klaviyoPost(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  what: string,
): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[klaviyo] ${what} refusé (${response.status}) : ${detail.slice(0, 500)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[klaviyo] ${what} impossible :`, err);
    return false;
  }
}

/**
 * Voie navigateur, sans secret. Conservée pour le cas où aucune clé privée
 * n'est configurée — mais son 202 ne prouve rien : voir l'en-tête du fichier.
 */
async function subscribeClientSide(
  list: string,
  email: string,
  source: string,
  properties: Record<string, string>,
): Promise<boolean> {
  if (!companyId) return false;
  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(companyId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", revision: API_REVISION },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              custom_source: source,
              profile: {
                data: {
                  type: "profile",
                  attributes: { email, properties: { source, ...properties } },
                },
              },
            },
            relationships: { list: { data: { type: "list", id: list } } },
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[klaviyo] voie client refusée (${response.status}) : ${detail.slice(0, 500)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[klaviyo] voie client impossible :", err);
    return false;
  }
}
