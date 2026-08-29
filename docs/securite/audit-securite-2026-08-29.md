# Audit de sécurité — bien.health

**Date** : 29/08/2026 · **Auditeur** : Clickzou + Claude
**Périmètre** : application Next.js 16.2.9 déployée sur Vercel (`src/`), routes API,
gestion des secrets, en-têtes HTTP en production, dépendances npm.
**Hors périmètre** : la sécurité de Shopify (checkout, paiement, comptes clients) et
de Supabase eux-mêmes, qui relèvent de leurs éditeurs ; l'infrastructure Vercel ;
l'audit de la zone DNS.

---

## Verdict

**Aucune faille exploitable à distance n'a été trouvée.** Les bases sont correctes :
les secrets ne sont pas dans le dépôt, la clé Supabase à privilèges élevés reste
côté serveur, les cookies de session sont `httpOnly` + `Secure` + `SameSite=Lax`, et
le paiement — donc les données bancaires — ne transite jamais par le site.

Trois points méritent cependant d'être traités rapidement, dans cet ordre :

| # | Constat | Gravité | Effort |
|---|---|---|---|
| 1 | Aucun en-tête de sécurité HTTP (CSP, X-Frame-Options, etc.) | **Élevée** | 1 h |
| 2 | Aucune limitation de débit sur les routes API publiques | **Élevée** | 2 h |
| 3 | 6 vulnérabilités npm « high », dont Next.js lui-même | **Élevée** | 30 min |
| 4 | JSON-LD injecté sans échappement de `<` | Moyenne | 10 min |
| 5 | Route « revendeur » sans validation, écriture en clé service role | Moyenne | 1 h |
| 6 | `X-Powered-By: Next.js` exposé | Faible | 2 min |
| 7 | HSTS sans `includeSubDomains` ni `preload` | Faible | 15 min |
| 8 | Données personnelles écrites dans les logs | Faible (RGPD) | 10 min |

---

## 1. Aucun en-tête de sécurité HTTP — gravité élevée

**Constat.** Réponse de `https://bien.health/fr` :

```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=63072000
X-Powered-By: Next.js
...
```

Sont **absents** : `Content-Security-Policy`, `X-Content-Type-Options`,
`X-Frame-Options` (ou `frame-ancestors`), `Referrer-Policy`, `Permissions-Policy`.

**Ce que ça permet concrètement.**
- **Clickjacking** : n'importe quel site peut charger bien.health dans une `iframe`
  invisible et superposer ses propres boutons. Sur un site marchand avec un espace
  compte, c'est le scénario le plus réaliste.
- **Aucune barrière en profondeur contre le XSS** : si un script tiers est compromis
  (Loox, le pixel Meta, GA), rien ne limite ce qu'il peut charger ou exfiltrer.
- **Fuite de référent** vers les domaines tiers, faute de `Referrer-Policy`.
- **MIME sniffing** possible sans `X-Content-Type-Options: nosniff`.

**Correctif** — dans `next.config.ts` :

```ts
async headers() {
  return [{
    source: "/:path*",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ],
  }];
}
```

**Sur la CSP** : elle mérite une étape séparée. Le site charge Google Analytics, le
pixel Meta, Loox et des images Shopify ; une CSP trop stricte casserait la mesure ou
les avis clients, en silence. Méthode recommandée : déployer d'abord en
`Content-Security-Policy-Report-Only`, observer une semaine, puis basculer en mode
bloquant. À ne pas improviser un vendredi.

---

## 2. Aucune limitation de débit sur les routes API publiques — gravité élevée

**Constat.** Quatre routes ouvertes sur Internet, sans compteur ni délai :

| Route | Ce qu'elle fait | Risque |
|---|---|---|
| `/api/account/login` | authentifie un client Shopify | **Attaque par force brute** sur les comptes clients, et bourrage d'identifiants (*credential stuffing*) |
| `/api/account/register` | crée un compte client Shopify | Création massive de faux comptes |
| `/api/newsletter` | crée un client Shopify abonné | Pollution de la base marketing, atteinte à la réputation d'expéditeur |
| `/[lang]/api/revendeur` | insère dans Supabase | Remplissage de la table, coût de stockage |

Aucune de ces routes n'est protégée par un captcha, un jeton de formulaire ou une
temporisation. Sur `/api/account/login`, c'est le point le plus sensible : rien
n'empêche des milliers de tentatives par minute depuis une même adresse.

**Correctif immédiat** (une heure) : le même compteur en mémoire que celui écrit
pour le tableau de bord — voir `src/app/api/seo/login/route.ts`, fonction
`tooManyAttempts()` — appliqué aux quatre routes. Limite suggérée : 8 tentatives par
minute et par IP sur `login`, 3 par minute sur `register`, `newsletter` et
`revendeur`.

**Limite connue de ce correctif** : le compteur vit dans la mémoire de l'instance
Vercel, il ne survit pas à un redémarrage et n'est pas partagé entre régions. Il
rend l'attaque coûteuse, il ne la rend pas impossible. Pour une protection
robuste : Vercel Firewall (règles de débit, incluses dans le plan Pro) ou un
Upstash Redis partagé. À arbitrer selon le budget.

---

## 3. Six vulnérabilités « high » dans les dépendances — gravité élevée

`npm audit` au 29/08/2026 : **0 critique, 6 high, 0 moderate**.

| Paquet | Avis |
|---|---|
| **next** (16.2.9) | Contournement du middleware/proxy en App Router (Turbopack, locale unique) · DoS via Server Actions · SSRF sur serveur personnalisé · confusion de cache sur les réponses à corps de requête |
| sharp | CVE libvips 2026-33327/33328/35590/35591 (traitement d'images) |
| postcss | XSS via `</style>` non échappé (chaîne de build) |
| js-yaml | Consommation CPU quadratique (`!!omap`) |
| brace-expansion | DoS par expansion exponentielle |
| nanoid | Boucle infinie sur taille négative |

L'avis le plus important concerne **Next.js lui-même** : le contournement de
middleware touche les applications App Router, or `src/proxy.ts` est précisément ce
qui redirige les visiteurs vers `/fr` et exclut `/api` et `/seo`. Un contournement
signifierait qu'une requête forgée peut atteindre une route en sautant cette
logique. Le tableau de bord `/seo` ne dépend heureusement **pas** du proxy pour son
authentification : il vérifie le cookie dans le composant serveur, ce qui reste
correct même si le proxy est contourné. C'est une bonne propriété qu'il faut
conserver — ne jamais déplacer un contrôle d'accès dans `proxy.ts`.

**Correctif** : `npm i next@16.3.3` (dernière version publiée), puis `npm audit`
pour vérifier ce qui subsiste, puis build + parcours de recette complet. Les autres
paquets sont transitifs et suivront.

---

## 4. JSON-LD injecté sans échappement — gravité moyenne

**Constat.** `src/components/json-ld.tsx` :

```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
```

`JSON.stringify` n'échappe pas le caractère `<`. Si une donnée venue de Shopify ou
des avis Loox contenait la chaîne `</script>`, le navigateur fermerait la balise et
interpréterait la suite comme du HTML — soit une **XSS stockée**, déclenchée par un
simple titre de produit ou un avis client.

Aujourd'hui les données sont saisies par l'équipe, la probabilité est faible ; mais
les avis clients sont du contenu tiers, et le coût du correctif est nul :

```tsx
const safe = JSON.stringify(data).replace(/</g, "\\u003c");
```

Les six autres usages de `dangerouslySetInnerHTML` (contenus du blog, page
certifications, tableau de bord) portent sur des chaînes écrites dans le dépôt,
donc sans entrée utilisateur : pas de risque à ce jour. La règle à tenir : **aucune
donnée d'origine externe ne doit rejoindre un `dangerouslySetInnerHTML` sans
échappement**.

---

## 5. Route « revendeur » : aucune validation, écriture en clé service role — gravité moyenne

**Constat.** `src/app/[lang]/api/revendeur/route.ts` insère directement le corps de
la requête dans Supabase :

```ts
const supabase = getSupabaseAdmin();   // clé service role : contourne les RLS
await supabase.from("reseller_requests").insert({
  type: payload.type ?? null,
  company: payload.company ?? null,
  ...
});
```

Trois problèmes distincts :
1. **Aucune validation** : ni format d'e-mail, ni longueur maximale, ni type. Un
   champ de 5 Mo passe.
2. **Clé service role** : l'écriture contourne toute politique RLS. Si demain la
   table est lue par un back-office, du HTML ou du JavaScript stocké ici s'y
   affichera — XSS stockée par rebond.
3. **Aucune limite de débit** (cf. § 2).

**Correctif** : valider explicitement chaque champ (type `string`, longueur max
200 pour les champs courts, 2 000 pour le message, expression d'e-mail), rejeter en
400 sinon, et n'insérer que les champs attendus. Le `?? null` actuel laisse passer
n'importe quel type JSON, objets compris.

---

## 6. `X-Powered-By: Next.js` — gravité faible

Indique la technologie et facilite le ciblage d'exploits connus. À désactiver dans
`next.config.ts` : `poweredByHeader: false`.

---

## 7. HSTS incomplet — gravité faible

`Strict-Transport-Security: max-age=63072000` est présent, mais sans
`includeSubDomains` (les sous-domaines, dont un futur `shop.bien.health`, ne sont
pas couverts) ni `preload` (le tout premier accès reste vulnérable au
rétrogradage). Correctif inclus dans le bloc d'en-têtes du § 1.

Attention avant `includeSubDomains` : vérifier que **tous** les sous-domaines
servent bien du HTTPS, sinon ils deviennent inaccessibles.

---

## 8. Données personnelles dans les logs — gravité faible (RGPD)

`src/app/[lang]/api/revendeur/route.ts` journalise le formulaire complet quand
Supabase n'est pas configuré :

```ts
console.log("[revendeur] demande reçue (Supabase non configuré) :", payload);
```

Nom, e-mail et téléphone se retrouvent alors dans les logs Vercel, avec une durée de
conservation qui n'est pas celle décidée pour les données clients, et accessibles à
toute personne ayant accès au projet. Remplacer par un log sans contenu
(`console.warn("[revendeur] demande reçue, Supabase non configuré")`), ou par les
seuls champs non identifiants.

---

## 9. Ce qui est correct — à préserver

Ces points sont notés pour qu'une évolution future ne les défasse pas :

- **Secrets hors du dépôt** : `.gitignore` couvre `.env*` sauf l'exemple ; aucun
  jeton, aucune clé privée dans les fichiers suivis par git ni dans l'historique.
- **Clé Supabase service role** strictement côté serveur (`src/lib/supabase.ts`,
  utilisée seulement dans deux routes API). Aucune fuite dans le bundle client.
- **Cookies de session** : `httpOnly`, `secure` en production, `sameSite: "lax"`,
  chemin explicite. Le `SameSite=Lax` fait aussi office de protection CSRF sur les
  POST inter-sites.
- **Paiement délégué à Shopify** : aucune donnée bancaire ne transite par le site,
  ce qui retire du périmètre la partie la plus risquée d'un e-commerce.
- **Préprod non indexable** (`IS_INDEXABLE`), ce qui évite l'exposition publique des
  déploiements de test.
- **Tableau de bord `/seo`** : mot de passe stocké sous forme d'empreinte scrypt (le
  mot de passe en clair n'est nulle part dans le dépôt), session signée en HMAC et
  bornée à 12 h, comparaisons à temps constant, limitation de débit sur la
  connexion, `noindex` + `Disallow`, contrôle d'accès dans le composant serveur et
  non dans le proxy.
- **Route `/api/account/update`** : vérifie le jeton client avant toute écriture.

---

## 10. Recommandations complémentaires

| Sujet | Recommandation |
|---|---|
| Rotation des secrets | Le jeton Storefront et `FAL_KEY` sont en clair dans le `.env.local` du poste de développement. Les faire tourner si le poste change de mains, et ne jamais les coller dans un canal de discussion. |
| Comptes clients | La politique de mot de passe et l'éventuel MFA dépendent de Shopify : vérifier que la boutique impose une longueur minimale correcte. |
| Surveillance | Activer les alertes Vercel sur les pics d'erreurs 4xx/5xx : c'est le signal le plus simple d'une attaque par force brute. |
| Dépendances | Ajouter `npm audit --audit-level=high` au `prebuild`, ou activer Dependabot, pour ne plus découvrir six avis d'un coup. |
| RGPD | Documenter la durée de conservation de `reseller_requests` et des clients « Newsletter Subscriber », et prévoir la procédure d'effacement sur demande. |

---

## 11. Méthodologie

- Lecture du code : routes API (`src/app/api/**`, `src/app/[lang]/api/**`),
  `src/lib/supabase.ts`, `src/lib/shopify*.ts`, `src/lib/seo-dashboard/**`,
  `src/proxy.ts`, `src/components/json-ld.tsx`, `next.config.ts`.
- Recherche de secrets dans les fichiers suivis par git et dans l'historique.
- Inventaire des usages de `dangerouslySetInnerHTML` et de leurs sources de données.
- `npm audit` sur l'arbre de dépendances installé.
- Analyse des en-têtes HTTP de réponse en production.
- **Non réalisé** : test d'intrusion actif, fuzzing des routes, test de charge. Ce
  document est une revue de configuration et de code, pas un pentest. Les envois
  vers les API tierces (Shopify, Supabase) n'ont pas été déclenchés depuis
  l'extérieur pour ne pas polluer les données de production.
