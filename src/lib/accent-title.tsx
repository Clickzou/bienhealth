import type { ReactNode } from "react";

/**
 * Accentue le dernier mot d'un titre avec le rose de la charte (#ffb2ce).
 *
 * La charte V2 réserve 5 % de la palette au pink : c'est un accent, pas une
 * couleur de titre. On ne marque donc qu'un mot, en fin de titre, là où l'œil
 * termine sa lecture.
 *
 * Le rose de charte ne tient pas comme couleur de texte sur fond clair (1,6:1),
 * et le client tient à ce rose exact — pas de variante assombrie. Deux
 * traitements selon le fond :
 *   fond sombre → le mot passe en rose (11:1 sur navy, association autorisée p. 24)
 *   fond clair  → le mot reste noir et reçoit un filet rose sous la ligne de base
 *
 * La ponctuation finale reste collée au mot accentué : « préférés. » est
 * souligné avec son point, sinon le point orphelin se voit.
 */
export function accentLastWord(title: string, { onDark = false } = {}): ReactNode {
  const cut = title.trimEnd().lastIndexOf(" ");
  if (cut === -1) return title;

  const head = title.slice(0, cut);
  const tail = title.slice(cut + 1);
  const accent = onDark ? "text-bien-pink" : "bien-accent-underline";

  return (
    <>
      {head} <span className={accent}>{tail}</span>
    </>
  );
}
