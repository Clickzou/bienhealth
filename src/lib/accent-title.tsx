import type { ReactNode } from "react";

/**
 * Met le dernier mot d'un titre en rose.
 *
 * La charte V2 réserve 5 % de la palette au pink : c'est un accent, pas une
 * couleur de titre. On ne teinte donc qu'un mot, en fin de titre, là où l'œil
 * termine sa lecture.
 *
 * Deux teintes selon le fond, parce que le pink de charte (#ffb2ce) ne passe
 * pas en texte sur fond clair :
 *   fond clair  → `--color-bien-pink-deep` (5,7:1 sur blanc)
 *   fond sombre → pink de charte, autorisé sur navy par la charte (p. 24)
 *
 * La ponctuation finale reste collée au mot accentué : « préférés. » passe en
 * rose avec son point, sinon le point orphelin en noir se voit.
 */
export function accentLastWord(title: string, { onDark = false } = {}): ReactNode {
  const cut = title.trimEnd().lastIndexOf(" ");
  if (cut === -1) return title;

  const head = title.slice(0, cut);
  const tail = title.slice(cut + 1);
  const color = onDark ? "text-bien-pink" : "text-bien-pink-deep";

  return (
    <>
      {head} <span className={color}>{tail}</span>
    </>
  );
}
