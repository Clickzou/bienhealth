import { Star } from "lucide-react";
import ReviewForm from "./review-form";
import ReviewsList, { type Review } from "./reviews-list";

/**
 * Section avis produit (pleine largeur) : note globale + bouton « Écrire un avis »
 * (popup) + liste paginée. Avis spécifiques par produit ; masquée si aucun avis.
 */

const REVIEWS: Record<string, Review[]> = {
  MUSHGLOW: [
    { name: "Marie-elise M.", date: "11/12/2025", verified: true, photo: "https://images.loox.io/uploads/2025/12/11/wgf-wkwUS.jpg", text: "Première fois que je teste ce genre de produit et je dois dire que la promesse est tenue :\n- j'ai plus d'énergie\n- ma peau semble plus lisse\n- je me concentre plus facilement sur la durée\n- j'ai eu des journées bien productives !\n- mon stress semble être moins présent 🤩" },
    { name: "Rabenja T.", date: "25/09/2025", verified: true, text: "Mélanger avec un déca le matin, et sur la journée, ça aide vraiment à dissiper le brouillard mental, et à récupérer physiquement 💫" },
    { name: "Marion C.", date: "05/05/2025", text: "J'ai intégré mushglow à ma routine et je suis super contente des effets. Très facile à utiliser. Je recommande vivement !" },
    { name: "Justine Q.", date: "23/04/2025", verified: true, text: "Suis vraiment convaincue, focus, énergie et ma peau semble avoir plus d'éclat." },
    { name: "Anais M.", date: "20/04/2025", verified: true, text: "Une dose par jour, trop facile à mélanger dans mon smoothie. J'adore mushglow !" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Je me sens juste mieux depuis que j'ai intégré mushglow à ma routine. Plus posée, et beaucoup plus d'énergie." },
    { name: "Orianne G.", date: "19/04/2025", verified: true, text: "Je suis hyper contente, j'ai arrêté le café récemment et je cherchais quelque chose qui me donne de l'énergie sans le crash après café. Franchement top !" },
    { name: "Sophie B.", date: "18/04/2025", verified: true, text: "Je ne saurais pas expliquer exactement comment, mais je me sens juste mieux. Du coup je prends une cuillère tous les jours." },
    { name: "Jade T.", date: "16/04/2025", verified: true, text: "C'est plus économique et le produit est vraiment bien ! Je recommande :)" },
    { name: "Laura S.", date: "13/04/2025", verified: true, text: "J'adore le fait qu'il y ait 6 ingrédients en une dose, avec le collagène en plus c'est top !" },
    { name: "Manon K.", date: "12/04/2025", verified: true, text: "Je cherchais un produit qui soit un peu tout en un, du coup une dose et c'est suffisant !" },
    { name: "Marco A.", date: "10/04/2025", verified: true, text: "Je suis trop focus depuis que je prends cette poudre !" },
    { name: "Camille V.", date: "06/04/2025", verified: true, text: "Je le prends le matin dans mon yaourt, j'aime bien ce petit goût subtil." },
    { name: "Victor J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Je ressens vraiment les effets surtout après une semaine." },
    { name: "Zoé C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !" },
    { name: "Guillaume B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins dans mon café. J'ai effectivement moins de stress et je suis plus concentré." },
    { name: "Marie L.", date: "15/03/2025", verified: true, text: "Je prenais trop de compléments différents, là plus besoin d'avaler trop de pilules ! Top !" },
    { name: "Paola H.", date: "13/03/2025", verified: true, text: "J'ai clairement vu un avant/après sur ma peau et mon mood. C'est devenu mon petit rituel." },
    { name: "Hugo C.", date: "11/03/2025", verified: true, text: "Je récupère mieux après le sport, je me sens focus toute la journée." },
    { name: "Arthur D.", date: "08/03/2025", verified: true, text: "Franchement trop bien ! Je vais refaire une cure." },
    { name: "Jeanne V.", date: "06/03/2025", verified: true, text: "Je pensais que c'était du bluff, mais non. J'ai vraiment ressenti les effets, suis moins fatiguée, moins stressée et mon teint est au top !" },
    { name: "Lucas T.", date: "04/03/2025", verified: true, text: "Trop bien d'avoir tout en un. J'ai viré mes autres compléments. Et le goût passe nickel dans mon smoothie." },
    { name: "Julie M.", date: "02/03/2025", verified: true, text: "Je mets MushGlow dans mon matcha, je suis accro." },
  ],
  CALM: [
    { name: "Aleksandra N.", date: "18/05/2026", verified: true, text: "Il faut 15 jours d'utilisation minimum pour que ça marche. Les effets sont très satisfaisants." },
    { name: "Sandrine A.", date: "21/12/2025", verified: true, text: "Produit au top !!!" },
    { name: "Alice J.", date: "22/04/2025", text: "WOW j'ai vu une vrai différence sur mon sommeil. Bravo BIEN !" },
    { name: "Catherine T.", date: "20/04/2025", text: "J'ai toujours eu beaucoup d'anxiété, le mélange d'ingrédients est top je me sens beaucoup mieux !" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Vraiment BIEN !" },
    { name: "Eva S.", date: "13/04/2025", verified: true, text: "Bon goût et trop contente des effets !" },
    { name: "Camille K.", date: "12/04/2025", verified: true, text: "Je viens de finir la cure, je vais en recommander une asap !" },
    { name: "Robin A.", date: "10/04/2025", verified: true, text: "J'ai beaucoup moins de problème à m'endormir, je recommande !" },
    { name: "Emma V.", date: "06/04/2025", verified: true, text: "J'ai des soucis de sommeil et franchement ça m'aide !" },
    { name: "Alex J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !" },
    { name: "Fanny C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !" },
    { name: "Florian B.", date: "17/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. Je suis plus tendue, plus irritable. Ça calme direct." },
    { name: "Joanna L.", date: "15/03/2025", verified: true, text: "J'ai grave réduit le stress grâce à ces gummies, franchement BIEN :)" },
    { name: "Lola H.", date: "13/03/2025", verified: true, text: "J'étais sceptique mais ça marche. Je suis plus posée, moins en tension." },
    { name: "Matthieu G.", date: "11/03/2025", verified: true, text: "Je le prends tous les jours, je me sens plus équilibrée." },
    { name: "Jean D.", date: "08/03/2025", verified: true, text: "BIEN BIEN BIEN :) j'suis trop chill maintenant haha" },
    { name: "Margaux V.", date: "06/03/2025", verified: true, text: "Wow je pensais pas que ça me ferait cet effet, mais je suis vraiment + relax depuis que je les prends." },
    { name: "Thomas T.", date: "04/03/2025", verified: true, text: "Je viens de finir ma boîte, je vais en reprendre direct !" },
    { name: "Justine M.", date: "02/03/2025", verified: true, text: "Trop bien ces gummies, je les prends quand je sens que je suis stressée. Effet apaisant direct." },
  ],
  FOCUS: [
    { name: "Alexandra G.", date: "31/03/2026", text: "J'utilise ce produit depuis presque deux semaines. Les effets sur la concentration, la clarté et le calme sont légers mais réels. Il ne s'agit pas d'un produit miracle, mais plutôt d'un léger coup de boost." },
    { name: "Magali L.", date: "03/01/2026", verified: true, text: "Un rituel plaisir avec des effets encourageants :\nJ'ai testé ces gummies pour booster ma concentration et voici mon retour après quelques semaines d'utilisation :\n- le goût et la prise : c'est un gros point positif car ils ont un très bon goût, ce qui facilite la prise contrairement à des gélules classiques.\n- efficacité : j'ai l'impression d'avoir moins de petits « trous de mémoire » instantanés et je me sens concentrée plus longtemps. Je recommande vivement. J'ai hâte de tester les autres produits…" },
    { name: "Guillaume N.", date: "24/08/2025", verified: true, text: "J'ai essayé les Gummies Focus pour « tester ». Les premiers jours, je n'ai pas ressenti de différence flagrante, mais après 3-4 jours à prendre 2 gummies tous les matins, j'ai remarqué à quel point ma concentration était plus intense et surtout plus longue. Par la même occasion, j'ai réduit légèrement ma consommation de café.\nBref, je suis très content d'avoir adopté BIEN dans ma routine !\nJe recommande !" },
    { name: "Agathe T.", date: "01/06/2025", verified: true, text: "Super efficace !" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Vraiment BIEN :)" },
    { name: "Laura S.", date: "13/04/2025", verified: true, text: "Je l'utilise en mode « booster » quand j'ai une grosse journée." },
    { name: "Manon K.", date: "12/04/2025", verified: true, text: "J'ai remplacé le 2e café par un Focus. Ça m'évite de trop consommer de café." },
    { name: "Marco A.", date: "10/04/2025", verified: true, text: "Je suis trop focus depuis que je prends ces gummies !" },
    { name: "Camille V.", date: "06/04/2025", verified: true, text: "J'ai une meilleure clarté mentale depuis que je le prends. Je me sens plus en contrôle." },
    { name: "Baptiste J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !" },
    { name: "Zoé C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !" },
    { name: "Marc B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins, j'adore les effets !" },
    { name: "Marie L.", date: "15/03/2025", verified: true, text: "J'étais sceptique, mais ça marche vraiment. Un coup de pouce mental, sans nervosité." },
    { name: "Paola H.", date: "13/03/2025", verified: true, text: "Depuis que je prends Focus, je procrastine moins. J'arrive à rester sur mes tâches." },
    { name: "Hugo C.", date: "11/03/2025", verified: true, text: "J'aime le fait que ce soit naturel et que ça marche. Juste ce qu'il faut pour rester dans le flow." },
    { name: "Arthur D.", date: "08/03/2025", verified: true, text: "Je le prends avant les réunions ou quand j'ai beaucoup à faire. Mental plus net, pas de crash." },
    { name: "Maria V.", date: "06/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. J'suis plus lente, moins claire. Ça booste sans m'énerver." },
    { name: "Enzo T.", date: "04/03/2025", verified: true, text: "J'ai un cerveau qui part dans tous les sens, ça m'aide à rester focus sans stress." },
    { name: "Caroune M.", date: "02/03/2025", verified: true, text: "Je prends un Focus le matin avant de bosser, j'suis beaucoup + concentrée. Moins dans le brouillard." },
  ],
  POWER: [
    { name: "Isabelle C.", date: "27/04/2026", verified: true, text: "Excellent, une belle énergie pour la journée." },
    { name: "Nicolas A.", date: "31/05/2025", verified: true, text: "Top ! Tout est ok !" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "BIEN BIEN BIEN :)" },
    { name: "Eva S.", date: "13/04/2025", verified: true, text: "Trop bien ces gummies, je les prends en mode « booster » quand j'ai une grosse journée." },
    { name: "Camille K.", date: "12/04/2025", verified: true, text: "Je viens de finir la cure, je vais en recommander une asap !" },
    { name: "Robin A.", date: "10/04/2025", verified: true, text: "Wow je pensais pas que ça me ferait cet effet-là, mais le boost d'énergie est dingo !" },
    { name: "Emma V.", date: "06/04/2025", verified: true, text: "Honnêtement, je sens que je tiens mieux mes journées. C'est pas un truc miracle, mais c'est super efficace." },
    { name: "Alex J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !" },
    { name: "Fanny C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !" },
    { name: "Florian B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins, j'adore les effets !" },
    { name: "Joanna L.", date: "15/03/2025", verified: true, text: "J'étais sceptique, mais ça marche vraiment. Un coup de boost que j'adore !" },
    { name: "Lola H.", date: "13/03/2025", verified: true, text: "J'ai bien calmé le café grâce à ces gummies, franchement BIEN :)" },
    { name: "Matthieu G.", date: "11/03/2025", verified: true, text: "Le goût est trop bon ! Du coup je n'oublie jamais de le prendre." },
    { name: "Jean D.", date: "08/03/2025", verified: true, text: "Je le prends avant mes séances de sport ou quand j'ai besoin d'envoyer. Franchement, ça aide." },
    { name: "Margaux V.", date: "06/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. J'ai moins d'énergie, ça marche !" },
    { name: "Thomas T.", date: "04/03/2025", verified: true, text: "Je prends Power le matin quand j'ai une grosse journée, ça me donne un bon coup de boost !" },
    { name: "Justine M.", date: "02/03/2025", verified: true, text: "Top produit, j'ai trop la forme. Je reco !" },
  ],
};

export default function ProductReviews({
  productKey,
  productHandle,
  productTitle,
}: {
  productKey: string | null;
  productHandle: string;
  productTitle: string;
}) {
  const reviews = productKey ? REVIEWS[productKey] ?? [] : [];
  if (reviews.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 border-t border-border pt-12 sm:pt-16">
      {/* En-tête : note globale + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display font-black text-5xl text-black leading-none">5,0</span>
          <span>
            <span className="inline-flex text-bien-gold">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5 fill-bien-gold" />)}</span>
            <span className="mt-1 block text-sm text-black/60">Basé sur <span className="font-semibold text-black">{reviews.length} avis</span> clients</span>
          </span>
        </div>
        <ReviewForm productHandle={productHandle} productTitle={productTitle} />
      </div>

      {/* Liste (6 affichés, puis « Voir plus ») */}
      <div className="mt-10">
        <ReviewsList reviews={reviews} />
      </div>
    </section>
  );
}
