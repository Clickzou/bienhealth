# Demande de déclassement — Orange Cyberfiltre

Contexte : le 02/09/2026, `bien.health` est bloqué par Orange Cyberfiltre sur
une ligne mobile Orange (écran « Alerte page malveillante »). Le site est sain :
voir la section 27 de `GO-LIVE.md` pour le diagnostic complet.

**Où l'envoyer**, dans l'ordre :

1. le lien **« En savoir plus »** en bas de la page de blocage Cyberfiltre —
   c'est le point d'entrée officiel, il porte la référence du filtrage ;
2. à défaut, le **support Orange Business** de la ligne (Cyberfiltre est une
   option professionnelle), en demandant explicitement une revue de
   classification et non une simple désactivation de l'option ;
3. si la ligne appartient à une flotte, **l'administrateur de la flotte** peut
   ajouter une exception immédiatement — mais cela ne corrige pas le classement
   pour les autres.

Avant d'envoyer : joindre **deux** captures d'écran et remplacer les champs
entre crochets.

1. la page de blocage Cyberfiltre (obtenue sur `www.bien.health`) — elle
   identifie le service responsable ;
2. l'écran d'erreur de Chrome sur `bien.health`, **volet « Paramètres avancés »
   déplié** — Chrome y écrit que « des identifiants inhabituels et incorrects
   ont été retournés » et que le site est « inaccessible, car il utilise la
   technologie HSTS ». C'est la pièce la plus importante : elle prouve que
   l'utilisateur n'a aucun moyen de passer outre.

---

## Objet

Signalement de faux positif — déclassement du domaine bien.health

## Corps du message

Bonjour,

Je vous signale ce que je pense être une erreur de classification de votre
service Cyberfiltre concernant le domaine **bien.health**.

Depuis une ligne mobile Orange, l'accès à ce site déclenche un écran
« Alerte page malveillante — Orange a détecté une page potentiellement
dangereuse pour vos données ». Une capture d'écran est jointe à ce message.

**Le site en question est le site officiel d'une société française :**

- Éditeur : SAS BIEN HEALTH FRANCE
- Siège social : 100 rue du Verbial, 81000 Albi, France
- SIRET : 994 121 127 00017
- TVA intracommunautaire : FR35994121127
- Présidente et directrice de la publication : Carla Debard
- Domaine : bien.health, enregistré depuis le 14 décembre 2021
- Activité : vente en ligne de compléments alimentaires de marque française

Il s'agit d'un site marchand légitime, dont les mentions légales, CGV et
politique de confidentialité sont publiées et accessibles publiquement. La
marque a fait l'objet de plusieurs parutions dans la presse nationale
(notamment Cosmopolitan et Lyon Capitale).

**Éléments techniques vérifiés le 2 septembre 2026 :**

- le site est hébergé chez Vercel Inc. et servi exclusivement en HTTPS ;
- son certificat TLS Let's Encrypt est valide et correctement émis au nom du
  domaine bien.health ;
- la résolution DNS est cohérente et sans anomalie chez l'ensemble des
  résolveurs publics testés (Google, Cloudflare, Quad9) ;
- le site n'héberge aucun contenu téléchargeable, aucun formulaire de collecte
  d'identifiants bancaires (le paiement est délégué à Shopify Inc.), et n'est
  signalé par aucun service public de réputation à notre connaissance.

**Conséquence pour les utilisateurs : le site devient totalement inaccessible.**
Sur le domaine racine bien.health, le blocage ne s'affiche pas comme un filtrage
mais comme une erreur de sécurité du navigateur (« Votre connexion n'est pas
privée », NET::ERR_CERT_COMMON_NAME_INVALID). Le site appliquant la politique
HSTS, Chrome refuse toute poursuite de la navigation : l'utilisateur ne dispose
d'aucun bouton lui permettant de continuer, même en connaissance de cause. Il en
retire l'impression que le site est compromis, alors qu'il est parfaitement sain.

Je vous remercie de bien vouloir procéder à une revue de cette classification
et au déclassement du domaine bien.health, ainsi que de ses sous-domaines
www.bien.health et shop.bien.health.

Si le blocage résulte d'un classement par catégorie (« santé » ou
« parapharmacie ») plutôt que d'une détection de dangerosité, je vous serais
reconnaissant de me le préciser : le message affiché aux utilisateurs
(« page potentiellement dangereuse pour vos données ») porte alors un préjudice
d'image sans rapport avec la nature réelle du site.

Restant à votre disposition pour tout élément complémentaire.

Cordialement,

[Votre nom]
[Votre fonction — ex. : responsable du site bien.health]
[Votre email] — [Votre téléphone]
Ligne mobile concernée : [numéro de la ligne Orange]
