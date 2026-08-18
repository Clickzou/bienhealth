import { Star } from "lucide-react";

/**
 * Note sur 5 affichée en étoiles partiellement remplies (ex. 4,4 → 88 %).
 * Partagé par l'accueil et la fiche produit : afficher 5 étoiles pleines à côté
 * d'une note de 4,4/5 était l'une des incohérences relevées sur la fiche.
 *
 * Deux détails de rendu, sinon les étoiles se déforment :
 *   - la couche pleine est positionnée en `inset-y-0 left-0` + largeur, et non
 *     en `inset-0` + largeur : avec left ET right ET width, la boîte est
 *     sur-contrainte et son contenu ne s'aligne plus sur celui du dessous ;
 *   - les deux couches sont en `flex` avec `leading-none`. En inline, les
 *     étoiles retombaient sur la ligne de base, qui les décalait vers le bas :
 *     le `overflow-hidden` de la couche pleine leur coupait alors les pointes.
 *
 * `strokeWidth={0}` : l'icône lucide est dessinée avec un contour de 2 px, très
 * lourd à 14 px d'affichage (le client les trouvait « trop marquées »). Seul le
 * remplissage est conservé.
 */
export default function StarRating({
  value,
  className = "h-5 w-5",
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const stars = (tone: string) =>
    [0, 1, 2, 3, 4].map((i) => (
      <Star key={i} strokeWidth={0} className={`${className} ${tone} shrink-0 fill-current`} />
    ));

  return (
    <span className="relative inline-flex align-middle leading-none" aria-label={`${value} / 5`}>
      <span className="flex leading-none">{stars("text-bien-star/30")}</span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden leading-none"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {stars("text-bien-star")}
      </span>
    </span>
  );
}
