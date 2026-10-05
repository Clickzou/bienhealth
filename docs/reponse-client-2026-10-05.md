# Réponse au client — page revendeurs et formulaire « Devenir revendeur », 05/10/2026

Contexte : le 05/10/2026, Carla demande que le bouton « Commander en ligne » de
la page Nos revendeurs renvoie vers son lien de parrainage Ankorstore, et
signale qu'après avoir rempli le formulaire « Devenir revendeur » elle ne reçoit
aucun e-mail. Elle indique ensuite l'adresse de réception voulue :
`administration@bien.health`.

**Diagnostic** : la route `/api/revendeur` n'envoyait aucun e-mail et
n'écrivait que dans Supabase, jamais configuré en production. Elle répondait
« OK » et le formulaire remerciait le visiteur. Demandes du 29/08 au 05/10
perdues, irrécupérables. Détail et correctif : GO-LIVE.md, § 34 ; commits
`3642132` (Ankorstore), `996b3ae` (envoi Resend), `526b6ea` (configuration).

**Vérifications avant envoi** : lien Ankorstore présent sur
`bien.health/fr/revendeurs` ; envois réels acceptés par Resend en local et en
production (réponse 200), expéditeur `formulaire@bien.health`. Réception dans
la boîte `administration@bien.health` : demandée à Carla dans le message.

## Message envoyé

**Objet : Page revendeurs : bouton Ankorstore et formulaire réparé**

Bonjour Carla,

Les deux points de votre message sont réglés et en ligne.

**1. Bouton « Commander en ligne »**
Sur la page Nos revendeurs, il renvoie maintenant vers votre lien Ankorstore
(https://fr.ankorstore.com/r/bien-health-2N1x). Il s'ouvre dans un nouvel onglet.

**2. Formulaire « Devenir revendeur »**
Vous avez bien fait de le tester. En vérifiant, j'ai découvert que depuis la
mise en ligne du nouveau site, fin août, le formulaire affichait un message de
remerciement mais ne transmettait les demandes nulle part. Votre test n'a donc
pas été reçu, et les demandes éventuellement envoyées par des professionnels
entre le 29 août et aujourd'hui n'ont pas pu être récupérées. Si vous savez que
des établissements l'ont rempli pendant cette période, je vous conseille de les
recontacter directement.

C'est corrigé :
- chaque demande arrive désormais par e-mail sur **administration@bien.health**,
  envoyée par formulaire@bien.health ;
- il vous suffit de cliquer sur « Répondre » pour écrire directement au
  professionnel ;
- si un envoi échoue, le visiteur le voit tout de suite et l'adresse
  administration@bien.health lui est indiquée.

J'ai fait plusieurs essais. Vous devriez trouver dans votre boîte des messages
intitulés « Demande revendeur : TEST Clickzou… à ignorer ». Pouvez-vous me
confirmer qu'ils sont bien arrivés, en regardant aussi dans les spams ? Vous
pourrez ensuite les supprimer.

N'hésitez pas à refaire un essai de votre côté.

Bonne journée,
Jean-Christophe

## En attente

- confirmation par Carla de la réception des mails de test dans
  `administration@bien.health` ;
- suppression du compte Resend créé par erreur avec `administration@bien.health`
  (ne jamais y vérifier bien.health, cf. GO-LIVE.md § 34).
