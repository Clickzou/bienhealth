# Réponse au client — cinq questions du 18/09/2026

Contexte : le client pose cinq questions (plages de dates du tableau de bord,
visibilité, export des diagnostics, factures Shopify, affiliation). Trois
demandaient du développement ; elles ont été livrées et déployées le jour même.
Détail technique en sections 29 à 31 de `GO-LIVE.md`.

**Deux points attendent une réponse du client** :

1. **la relecture des deux phrases ajoutées à la politique de cookies** (page
   Cookies, FR et EN) au sujet du cookie d'affiliation `bien_aff`. C'est la
   contrepartie de sa décision d'attribuer la vente même quand les cookies sont
   refusés : le texte l'engage, il doit le valider ;
2. **le choix de l'application d'affiliation** — UpPromote recommandé. Si le
   choix se porte ailleurs, le paramètre d'URL attendu par l'application est
   peut-être à ajouter dans `PARAMS` (`src/lib/affiliate.ts`).

Rappel d'une erreur corrigée dans cette réponse : une première version annonçait
que l'historique des ventes Shopify était limité à soixante jours et qu'une
démarche restait à faire. C'est faux — `read_all_orders` est accordé depuis le
30/08/2026, l'historique est complet.

---

Objet : Vos cinq questions — trois points déjà réglés, en ligne aujourd'hui

Bonjour Carla,

Très bien, merci — et merci pour vos questions, elles tombaient juste. Trois
d'entre elles demandaient du développement : c'est fait, déployé aujourd'hui.
Voici le point, dans votre ordre.

## 1. Choisir soi-même les dates sur le tableau de bord — c'est en ligne

À côté des raccourcis (7 jours, 28 jours, 3 mois, 12 mois), vous avez maintenant
un bouton **« Dates… »**. Il ouvre un petit panneau où vous choisissez une date
de début et une date de fin : une journée précise, deux semaines précises, un
mois passé, ce que vous voulez. Trois raccourcis pratiques sont également là :
**Hier**, **Ce mois-ci**, **Mois dernier**.

Deux choses utiles à savoir :

- la période choisie est **automatiquement comparée à la période équivalente qui
  la précède** — si vous regardez le 1er au 15 août, les évolutions affichées se
  rapportent au 17-31 juillet ;
- les données s'arrêtent à hier : Google ne consolide jamais la journée en
  cours. Pour le temps réel, le compteur en haut du tableau de bord reste votre
  repère.

Une précision, car je m'étais trompé dans ma première réponse : **l'historique de
vos ventes est complet**, sur douze mois et au-delà. Vous n'avez aucune démarche
à faire côté Shopify, contrairement à ce que j'avais indiqué.

## 2. Booster la visibilité

Le socle technique est en place (site indexable, sitemap, redirections, 18
articles, référencement dans les IA type ChatGPT). Le site est en ligne depuis le
28 août : en référencement naturel, les premiers résultats se voient à 3-6 mois.
Ce qui accélère vraiment, par ordre de rentabilité :

1. **Les liens depuis vos parutions presse.** Vous avez 14 retombées, dont
   beaucoup citent la marque sans lien cliquable vers bien.health. Redemander
   l'ajout du lien, article par article, est le meilleur levier : gratuit, et
   c'est ce que Google valorise le plus. Je peux vous préparer la liste et le
   message type.
2. **Les avis clients.** Le widget Trustpilot n'est pas branché (il manque deux
   identifiants à récupérer dans votre compte) et Loox n'affiche pas encore vos
   vrais avis. Des avis visibles font gagner à la fois en conversion et en
   visibilité.
3. **L'email.** Vous avez une base Klaviyo que le diagnostic alimente. Des
   scénarios automatiques — bienvenue, panier abandonné, relance après
   diagnostic — ramènent du trafic qualifié sans budget publicitaire. À mon sens,
   le meilleur retour sur temps investi aujourd'hui.
4. **Le rythme éditorial.** Un article par semaine sur des questions réellement
   tapées dans Google. Les 18 existants sont un socle ; c'est la régularité qui
   compte.
5. **La publicité.** Le pixel Meta est en place et les ventes remontent : le
   retargeting est le budget le plus rentable pour commencer.

Dites-moi si vous voulez un plan sur 90 jours avec qui fait quoi, dans quel
ordre.

## 3. Tous les diagnostics dans un fichier — c'est en ligne

Dans la section « Diagnostics remplis » du tableau de bord, un bouton
**« Exporter tous les diagnostics »**. Il ignore la période affichée et sort
**tout depuis le premier questionnaire** : une ligne par personne, une colonne
par question, plus l'email, la date, l'heure et le produit recommandé. Vous
cliquez, le fichier s'ouvre directement dans Excel.

Une réserve à connaître : les **246 contacts importés de Typeform** n'ont que
leur adresse email enregistrée, pas leurs réponses. Ils ne peuvent donc pas
figurer dans ce fichier. Si vous tenez à cet historique-là, il faut l'exporter
depuis Typeform — dites-moi si vous voulez que je m'en occupe.

## 4. Les factures de vos ventes

Vous avez cherché en vain parce que cela n'existe pas : **Shopify ne génère pas
de factures**. Il envoie une confirmation de commande, qui n'est pas une facture
au sens comptable. C'est un manque connu de la plateforme, pas un réglage que
vous auriez raté.

Ce que votre comptable peut obtenir dès aujourd'hui, sans rien installer :

- **Commandes → Exporter** : toutes les commandes d'une période, en fichier
  Excel ;
- **Analyses → Rapports** : le récapitulatif financier (ventes brutes, remises,
  retours, taxes, port) — c'est en général ce qu'il demande ;
- **Finances → Paiements** : les virements réellement reçus et les commissions
  prélevées, pour le rapprochement bancaire ;
- **Paramètres → Facturation** : les factures que Shopify vous adresse à vous
  (abonnement, applications) — souvent oubliées en comptabilité.

Pour de vraies factures numérotées, conformes à la TVA et envoyées
automatiquement au client, il faut une application. Les solutions françaises
sérieuses sont **Regulo**, **Bizyness** et **Facturii** : factures, avoirs,
ventilation de TVA et export direct pour le comptable.

Un point à anticiper avec lui : depuis le 1er septembre 2026, toute entreprise
doit pouvoir **recevoir** des factures électroniques, et l'obligation de les
**émettre** arrive en septembre 2027 pour les TPE et PME. Autant choisir tout de
suite une application qui sera conforme plutôt que d'en changer dans un an. Votre
comptable est le bon interlocuteur pour trancher.

## 5. L'affiliation — la partie technique est prête

Votre site et votre caisse sont deux systèmes distincts : une application
d'affiliation installée sur Shopify voit le paiement, mais pas la navigation sur
bien.health. Le lien d'un affilié risquait donc de « perdre » la vente en route.
**C'est réglé** : le code de l'affilié est maintenant reconnu à l'arrivée sur le
site, conservé 30 jours, et transmis jusqu'à la caisse. Il apparaîtra sur la
commande dans votre admin Shopify — vous pourrez donc vérifier l'attribution à
l'œil, même sans application installée.

Comme vous l'avez demandé, **l'attribution vaut dans tous les cas**, y compris si
le visiteur refuse les cookies : votre affilié sera rémunéré quoi qu'il arrive.
En contrepartie, j'ai ajouté ce cookie à votre **politique de cookies** (en
français et en anglais), avec sa durée et son objet — c'est ce qui rend ce choix
défendable en cas de contrôle. **Merci de relire ces deux phrases** sur la page
Cookies du site : c'est un texte juridique qui vous engage.

Il reste à **choisir l'application**. Ma recommandation : **UpPromote** (gratuit
jusqu'à 200 commandes par mois, la plus complète pour démarrer). **GoAffPro** est
une alternative très généreuse en version gratuite, **Refersion** vise les gros
programmes influenceurs. Démarrez avec des codes promo dédiés par affilié le
temps de valider que le programme intéresse du monde ; le suivi automatique, lui,
est déjà en place.

## Un mot sur le site lui-même

J'en ai profité pour uniformiser la navigation : le passage d'une page à l'autre
est désormais instantané, sans rechargement complet. Rien ne change
visuellement, c'est simplement plus fluide — n'hésitez pas à me dire si vous
constatez quoi que ce soit d'inhabituel.

Dites-moi ce que vous voulez que je lance en priorité : le plan visibilité sur 90
jours, l'installation de l'application d'affiliation, ou les avis Trustpilot et
Loox.

Bien à vous,
Jean-Christophe
