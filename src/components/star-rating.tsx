import { Star } from "lucide-react";

/**
 * Note sur 5 affichée en étoiles partiellement remplies (ex. 4,4 → 88 %).
 * Partagé par l'accueil et la fiche produit : afficher 5 étoiles pleines à côté
 * d'une note de 4,4/5 était l'une des incohérences relevées sur la fiche.
 */
export default function StarRating({
  value,
  className = "h-5 w-5",
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex align-middle" aria-label={`${value} / 5`}>
      <span className="flex text-bien-star/25">
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current`} />)}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="inline-flex text-bien-star">
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current shrink-0`} />)}
        </span>
      </span>
    </span>
  );
}
