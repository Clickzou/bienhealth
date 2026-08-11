import ReviewForm from "./review-form";
import ReviewsList, { type Review } from "./reviews-list";
import StarRating from "./star-rating";
import { TRUSTPILOT_RATING, ratingLabel } from "@/lib/social-proof";

/**
 * Section avis produit (pleine largeur) : note globale + bouton « Écrire un avis »
 * (popup) + liste paginée. Avis spécifiques par produit ; masquée si aucun avis.
 */

export const REVIEWS: Record<string, Review[]> = {
  MUSHGLOW: [
    { name: "Marie-elise M.", date: "11/12/2025", verified: true, photo: "https://images.loox.io/uploads/2025/12/11/wgf-wkwUS.jpg", text: "Première fois que je teste ce genre de produit et je dois dire que la promesse est tenue :\n- j'ai plus d'énergie\n- ma peau semble plus lisse\n- je me concentre plus facilement sur la durée\n- j'ai eu des journées bien productives !\n- mon stress semble être moins présent 🤩", textEn: "First time I try this kind of product and I have to say the promise is kept:\n- I have more energy\n- my skin looks smoother\n- I concentrate more easily over time\n- I've had really productive days!\n- my stress seems less present 🤩" },
    { name: "Rabenja T.", date: "25/09/2025", verified: true, text: "Mélanger avec un déca le matin, et sur la journée, ça aide vraiment à dissiper le brouillard mental, et à récupérer physiquement 💫", textEn: "Mixed with a decaf in the morning, and throughout the day, it really helps clear the mental fog and recover physically 💫" },
    { name: "Marion C.", date: "05/05/2025", text: "J'ai intégré mushglow à ma routine et je suis super contente des effets. Très facile à utiliser. Je recommande vivement !", textEn: "I added MushGlow to my routine and I'm super happy with the effects. Very easy to use. Highly recommend!" },
    { name: "Justine Q.", date: "23/04/2025", verified: true, text: "Suis vraiment convaincue, focus, énergie et ma peau semble avoir plus d'éclat.", textEn: "I'm really convinced: focus, energy, and my skin seems to have more glow." },
    { name: "Anais M.", date: "20/04/2025", verified: true, text: "Une dose par jour, trop facile à mélanger dans mon smoothie. J'adore mushglow !", textEn: "One dose a day, so easy to mix into my smoothie. I love MushGlow!" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Je me sens juste mieux depuis que j'ai intégré mushglow à ma routine. Plus posée, et beaucoup plus d'énergie.", textEn: "I just feel better since I added MushGlow to my routine. Calmer, and much more energy." },
    { name: "Orianne G.", date: "19/04/2025", verified: true, text: "Je suis hyper contente, j'ai arrêté le café récemment et je cherchais quelque chose qui me donne de l'énergie sans le crash après café. Franchement top !", textEn: "I'm really happy: I recently quit coffee and was looking for something to give me energy without the coffee crash. Honestly great!" },
    { name: "Sophie B.", date: "18/04/2025", verified: true, text: "Je ne saurais pas expliquer exactement comment, mais je me sens juste mieux. Du coup je prends une cuillère tous les jours.", textEn: "I couldn't explain exactly how, but I just feel better. So I take a spoonful every day." },
    { name: "Jade T.", date: "16/04/2025", verified: true, text: "C'est plus économique et le produit est vraiment bien ! Je recommande :)", textEn: "It's more economical and the product is really good! I recommend :)" },
    { name: "Laura S.", date: "13/04/2025", verified: true, text: "J'adore le fait qu'il y ait 6 ingrédients en une dose, avec le collagène en plus c'est top !", textEn: "I love that there are 6 ingredients in one dose, and with collagen on top it's great!" },
    { name: "Manon K.", date: "12/04/2025", verified: true, text: "Je cherchais un produit qui soit un peu tout en un, du coup une dose et c'est suffisant !", textEn: "I was looking for an all-in-one product, so one dose and it's enough!" },
    { name: "Marco A.", date: "10/04/2025", verified: true, text: "Je suis trop focus depuis que je prends cette poudre !", textEn: "I'm so focused since I started taking this powder!" },
    { name: "Camille V.", date: "06/04/2025", verified: true, text: "Je le prends le matin dans mon yaourt, j'aime bien ce petit goût subtil.", textEn: "I take it in the morning in my yogurt, I like the subtle taste." },
    { name: "Victor J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Je ressens vraiment les effets surtout après une semaine.", textEn: "Honestly I love it! I really feel the effects, especially after a week." },
    { name: "Zoé C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !", textEn: "It's great, I recommend!" },
    { name: "Guillaume B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins dans mon café. J'ai effectivement moins de stress et je suis plus concentré.", textEn: "I take it every morning in my coffee. I do have less stress and I'm more focused." },
    { name: "Marie L.", date: "15/03/2025", verified: true, text: "Je prenais trop de compléments différents, là plus besoin d'avaler trop de pilules ! Top !", textEn: "I used to take too many different supplements, and now no need to swallow so many pills! Great!" },
    { name: "Paola H.", date: "13/03/2025", verified: true, text: "J'ai clairement vu un avant/après sur ma peau et mon mood. C'est devenu mon petit rituel.", textEn: "I clearly saw a before/after on my skin and my mood. It's become my little ritual." },
    { name: "Hugo C.", date: "11/03/2025", verified: true, text: "Je récupère mieux après le sport, je me sens focus toute la journée.", textEn: "I recover better after sport, I feel focused all day." },
    { name: "Arthur D.", date: "08/03/2025", verified: true, text: "Franchement trop bien ! Je vais refaire une cure.", textEn: "Honestly so good! I'm going to do another course." },
    { name: "Jeanne V.", date: "06/03/2025", verified: true, text: "Je pensais que c'était du bluff, mais non. J'ai vraiment ressenti les effets, suis moins fatiguée, moins stressée et mon teint est au top !", textEn: "I thought it was a bluff, but no. I really felt the effects: less tired, less stressed and my complexion is great!" },
    { name: "Lucas T.", date: "04/03/2025", verified: true, text: "Trop bien d'avoir tout en un. J'ai viré mes autres compléments. Et le goût passe nickel dans mon smoothie.", textEn: "So good to have everything in one. I ditched my other supplements. And the taste is perfect in my smoothie." },
    { name: "Julie M.", date: "02/03/2025", verified: true, text: "Je mets MushGlow dans mon matcha, je suis accro.", textEn: "I put MushGlow in my matcha, I'm hooked." },
  ],
  CALM: [
    { name: "Aleksandra N.", date: "18/05/2026", verified: true, text: "Il faut 15 jours d'utilisation minimum pour que ça marche. Les effets sont très satisfaisants.", textEn: "You need at least 15 days of use for it to work. The effects are very satisfying." },
    { name: "Sandrine A.", date: "21/12/2025", verified: true, text: "Produit au top !!!", textEn: "Top product!!!" },
    { name: "Alice J.", date: "22/04/2025", text: "WOW j'ai vu une vrai différence sur mon sommeil. Bravo BIEN !", textEn: "WOW I saw a real difference in my sleep. Well done BIEN!" },
    { name: "Catherine T.", date: "20/04/2025", text: "J'ai toujours eu beaucoup d'anxiété, le mélange d'ingrédients est top je me sens beaucoup mieux !", textEn: "I've always had a lot of anxiety, and the blend of ingredients is great, I feel much better!" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Vraiment BIEN !", textEn: "Really BIEN!" },
    { name: "Eva S.", date: "13/04/2025", verified: true, text: "Bon goût et trop contente des effets !", textEn: "Good taste and so happy with the effects!" },
    { name: "Camille K.", date: "12/04/2025", verified: true, text: "Je viens de finir la cure, je vais en recommander une asap !", textEn: "I just finished the course, I'll reorder one asap!" },
    { name: "Robin A.", date: "10/04/2025", verified: true, text: "J'ai beaucoup moins de problème à m'endormir, je recommande !", textEn: "I have far fewer problems falling asleep, I recommend!" },
    { name: "Emma V.", date: "06/04/2025", verified: true, text: "J'ai des soucis de sommeil et franchement ça m'aide !", textEn: "I have sleep issues and honestly this helps!" },
    { name: "Alex J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !", textEn: "Honestly I love it! Great product!" },
    { name: "Fanny C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !", textEn: "It's great, I recommend!" },
    { name: "Florian B.", date: "17/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. Je suis plus tendue, plus irritable. Ça calme direct.", textEn: "I feel the difference when I forget it. I'm more tense, more irritable. It calms me right away." },
    { name: "Joanna L.", date: "15/03/2025", verified: true, text: "J'ai grave réduit le stress grâce à ces gummies, franchement BIEN :)", textEn: "I really cut down my stress thanks to these gummies, honestly BIEN :)" },
    { name: "Lola H.", date: "13/03/2025", verified: true, text: "J'étais sceptique mais ça marche. Je suis plus posée, moins en tension.", textEn: "I was sceptical but it works. I'm calmer, less tense." },
    { name: "Matthieu G.", date: "11/03/2025", verified: true, text: "Je le prends tous les jours, je me sens plus équilibrée.", textEn: "I take it every day, I feel more balanced." },
    { name: "Jean D.", date: "08/03/2025", verified: true, text: "BIEN BIEN BIEN :) j'suis trop chill maintenant haha", textEn: "BIEN BIEN BIEN :) I'm so chill now haha" },
    { name: "Margaux V.", date: "06/03/2025", verified: true, text: "Wow je pensais pas que ça me ferait cet effet, mais je suis vraiment + relax depuis que je les prends.", textEn: "Wow I didn't think it would have this effect, but I'm really more relaxed since I started taking them." },
    { name: "Thomas T.", date: "04/03/2025", verified: true, text: "Je viens de finir ma boîte, je vais en reprendre direct !", textEn: "I just finished my jar, I'll get more right away!" },
    { name: "Justine M.", date: "02/03/2025", verified: true, text: "Trop bien ces gummies, je les prends quand je sens que je suis stressée. Effet apaisant direct.", textEn: "These gummies are so good, I take them when I feel stressed. Instant calming effect." },
  ],
  FOCUS: [
    { name: "Alexandra G.", date: "31/03/2026", text: "J'utilise ce produit depuis presque deux semaines. Les effets sur la concentration, la clarté et le calme sont légers mais réels. Il ne s'agit pas d'un produit miracle, mais plutôt d'un léger coup de boost.", textEn: "I've been using this product for almost two weeks. The effects on focus, clarity and calm are subtle but real. It's not a miracle product, more of a gentle boost." },
    { name: "Magali L.", date: "03/01/2026", verified: true, text: "Un rituel plaisir avec des effets encourageants :\nJ'ai testé ces gummies pour booster ma concentration et voici mon retour après quelques semaines d'utilisation :\n- le goût et la prise : c'est un gros point positif car ils ont un très bon goût, ce qui facilite la prise contrairement à des gélules classiques.\n- efficacité : j'ai l'impression d'avoir moins de petits « trous de mémoire » instantanés et je me sens concentrée plus longtemps. Je recommande vivement. J'ai hâte de tester les autres produits…", textEn: "A pleasant ritual with encouraging effects:\nI tried these gummies to boost my focus and here's my feedback after a few weeks:\n- taste and intake: a big plus, they taste really good, which makes them easier to take than classic capsules.\n- effectiveness: I feel like I have fewer little instant memory blanks and I stay focused for longer. Highly recommend. Can't wait to try the other products…" },
    { name: "Guillaume N.", date: "24/08/2025", verified: true, text: "J'ai essayé les Gummies Focus pour « tester ». Les premiers jours, je n'ai pas ressenti de différence flagrante, mais après 3-4 jours à prendre 2 gummies tous les matins, j'ai remarqué à quel point ma concentration était plus intense et surtout plus longue. Par la même occasion, j'ai réduit légèrement ma consommation de café.\nBref, je suis très content d'avoir adopté BIEN dans ma routine !\nJe recommande !", textEn: "I tried the Focus gummies just to \"test\". The first few days I didn't feel an obvious difference, but after 3-4 days of taking 2 gummies every morning, I noticed how much more intense and, above all, longer my focus was. At the same time, I slightly cut down my coffee intake.\nIn short, I'm very glad I added BIEN to my routine!\nI recommend!" },
    { name: "Agathe T.", date: "01/06/2025", verified: true, text: "Super efficace !", textEn: "Super effective!" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "Vraiment BIEN :)", textEn: "Really BIEN :)" },
    { name: "Laura S.", date: "13/04/2025", verified: true, text: "Je l'utilise en mode « booster » quand j'ai une grosse journée.", textEn: "I use it as a \"booster\" when I have a big day." },
    { name: "Manon K.", date: "12/04/2025", verified: true, text: "J'ai remplacé le 2e café par un Focus. Ça m'évite de trop consommer de café.", textEn: "I replaced my second coffee with a Focus. It stops me drinking too much coffee." },
    { name: "Marco A.", date: "10/04/2025", verified: true, text: "Je suis trop focus depuis que je prends ces gummies !", textEn: "I'm so focused since I started taking these gummies!" },
    { name: "Camille V.", date: "06/04/2025", verified: true, text: "J'ai une meilleure clarté mentale depuis que je le prends. Je me sens plus en contrôle.", textEn: "I have better mental clarity since I take it. I feel more in control." },
    { name: "Baptiste J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !", textEn: "Honestly I love it! Great product!" },
    { name: "Zoé C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !", textEn: "It's great, I recommend!" },
    { name: "Marc B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins, j'adore les effets !", textEn: "I take it every morning, I love the effects!" },
    { name: "Marie L.", date: "15/03/2025", verified: true, text: "J'étais sceptique, mais ça marche vraiment. Un coup de pouce mental, sans nervosité.", textEn: "I was sceptical, but it really works. A mental boost, without the jitters." },
    { name: "Paola H.", date: "13/03/2025", verified: true, text: "Depuis que je prends Focus, je procrastine moins. J'arrive à rester sur mes tâches.", textEn: "Since I take Focus, I procrastinate less. I manage to stay on my tasks." },
    { name: "Hugo C.", date: "11/03/2025", verified: true, text: "J'aime le fait que ce soit naturel et que ça marche. Juste ce qu'il faut pour rester dans le flow.", textEn: "I like that it's natural and that it works. Just what I need to stay in the flow." },
    { name: "Arthur D.", date: "08/03/2025", verified: true, text: "Je le prends avant les réunions ou quand j'ai beaucoup à faire. Mental plus net, pas de crash.", textEn: "I take it before meetings or when I have a lot to do. Clearer mind, no crash." },
    { name: "Maria V.", date: "06/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. J'suis plus lente, moins claire. Ça booste sans m'énerver.", textEn: "I feel the difference when I forget it. I'm slower, less clear. It boosts me without making me jittery." },
    { name: "Enzo T.", date: "04/03/2025", verified: true, text: "J'ai un cerveau qui part dans tous les sens, ça m'aide à rester focus sans stress.", textEn: "My brain goes in every direction, and it helps me stay focused without stress." },
    { name: "Caroune M.", date: "02/03/2025", verified: true, text: "Je prends un Focus le matin avant de bosser, j'suis beaucoup + concentrée. Moins dans le brouillard.", textEn: "I take a Focus in the morning before working, I'm much more focused. Less foggy." },
  ],
  POWER: [
    { name: "Isabelle C.", date: "27/04/2026", verified: true, text: "Excellent, une belle énergie pour la journée.", textEn: "Excellent, lovely energy for the day." },
    { name: "Nicolas A.", date: "31/05/2025", verified: true, text: "Top ! Tout est ok !", textEn: "Great! Everything's fine!" },
    { name: "Marion F.", date: "19/04/2025", verified: true, text: "BIEN BIEN BIEN :)", textEn: "BIEN BIEN BIEN :)" },
    { name: "Eva S.", date: "13/04/2025", verified: true, text: "Trop bien ces gummies, je les prends en mode « booster » quand j'ai une grosse journée.", textEn: "These gummies are so good, I take them as a \"booster\" when I have a big day." },
    { name: "Camille K.", date: "12/04/2025", verified: true, text: "Je viens de finir la cure, je vais en recommander une asap !", textEn: "I just finished the course, I'll reorder one asap!" },
    { name: "Robin A.", date: "10/04/2025", verified: true, text: "Wow je pensais pas que ça me ferait cet effet-là, mais le boost d'énergie est dingo !", textEn: "Wow I didn't think it would have this effect, but the energy boost is crazy!" },
    { name: "Emma V.", date: "06/04/2025", verified: true, text: "Honnêtement, je sens que je tiens mieux mes journées. C'est pas un truc miracle, mais c'est super efficace.", textEn: "Honestly, I feel I get through my days better. It's not a miracle thing, but it's super effective." },
    { name: "Alex J.", date: "04/04/2025", verified: true, text: "Franchement j'adore ! Super produit !", textEn: "Honestly I love it! Great product!" },
    { name: "Fanny C.", date: "23/03/2025", verified: true, text: "C'est top je recommande !", textEn: "It's great, I recommend!" },
    { name: "Florian B.", date: "17/03/2025", verified: true, text: "Je le prends tous les matins, j'adore les effets !", textEn: "I take it every morning, I love the effects!" },
    { name: "Joanna L.", date: "15/03/2025", verified: true, text: "J'étais sceptique, mais ça marche vraiment. Un coup de boost que j'adore !", textEn: "I was sceptical, but it really works. A boost I love!" },
    { name: "Lola H.", date: "13/03/2025", verified: true, text: "J'ai bien calmé le café grâce à ces gummies, franchement BIEN :)", textEn: "I really cut down my coffee thanks to these gummies, honestly BIEN :)" },
    { name: "Matthieu G.", date: "11/03/2025", verified: true, text: "Le goût est trop bon ! Du coup je n'oublie jamais de le prendre.", textEn: "The taste is so good! So I never forget to take it." },
    { name: "Jean D.", date: "08/03/2025", verified: true, text: "Je le prends avant mes séances de sport ou quand j'ai besoin d'envoyer. Franchement, ça aide.", textEn: "I take it before my workouts or when I need to deliver. Honestly, it helps." },
    { name: "Margaux V.", date: "06/03/2025", verified: true, text: "Je sens la diff quand je l'oublie. J'ai moins d'énergie, ça marche !", textEn: "I feel the difference when I forget it. I have less energy: it works!" },
    { name: "Thomas T.", date: "04/03/2025", verified: true, text: "Je prends Power le matin quand j'ai une grosse journée, ça me donne un bon coup de boost !", textEn: "I take Power in the morning when I have a big day, it gives me a good boost!" },
    { name: "Justine M.", date: "02/03/2025", verified: true, text: "Top produit, j'ai trop la forme. Je reco !", textEn: "Top product, I feel great. Recommend!" },
  ],
};

export default function ProductReviews({
  productKey,
  productHandle,
  productTitle,
  lang = "fr",
}: {
  productKey: string | null;
  productHandle: string;
  productTitle: string;
  lang?: string;
}) {
  const reviews = productKey ? REVIEWS[productKey] ?? [] : [];
  if (reviews.length === 0) return null;
  const en = lang === "en";
  // Une seule note sur toute la page : celle du header (Trustpilot boutique).
  // La fiche affichait « 5,0 » avec cinq étoiles pleines pendant que le header
  // annonçait 4,4 — trois chiffres différents au même endroit (retour client).
  const t = en
    ? { title: "Reviews of this product", basedPre: "Based on ", reviewsWord: "reviews", basedSuf: " for this product", shopRating: "Shop rating on Trustpilot" }
    : { title: "Les avis sur ce produit", basedPre: "Basé sur ", reviewsWord: "avis", basedSuf: " sur ce produit", shopRating: "Note de la boutique sur Trustpilot" };

  return (
    <section className="mt-16 sm:mt-24 border-t border-border pt-12 sm:pt-16">
      <h3 className="font-display tracking-tighter text-2xl sm:text-3xl text-black mb-6">
        {t.title}
      </h3>
      {/* En-tête : note globale + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl text-black leading-none">{ratingLabel(lang)}</span>
          <span>
            <StarRating value={TRUSTPILOT_RATING} className="h-5 w-5" />
            <span className="mt-1 block text-sm text-black/60">{t.shopRating}</span>
            <span className="block text-sm text-black/60">{t.basedPre}<span className="font-semibold text-black">{reviews.length} {t.reviewsWord}</span>{t.basedSuf}</span>
          </span>
        </div>
        <ReviewForm productHandle={productHandle} productTitle={productTitle} lang={lang} />
      </div>

      {/* Liste (6 affichés, puis « Voir plus ») */}
      <div className="mt-10">
        <ReviewsList reviews={reviews} lang={lang} />
      </div>
    </section>
  );
}
