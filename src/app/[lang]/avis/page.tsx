import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Check, ArrowUpRight, Quote } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { TRUSTPILOT_URL } from "@/components/trustpilot";
import { TRUSTPILOT_REVIEWS, ratingLabel } from "@/lib/social-proof";
import { pageMetadata } from "@/lib/seo";
import { accentLastWord } from "@/lib/accent-title";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "avis",
    title: lang === "en" ? "Customer reviews | BIEN health" : "Avis clients | BIEN health",
    description: lang === "en" ? "Verified customer reviews of BIEN health supplements: focus, calm, energy, sleep. Rated 4.4/5 across 100+ Trustpilot reviews." : "Les avis vérifiés de nos clients sur les compléments BIEN health : concentration, sérénité, énergie, sommeil. Note 4,4/5 sur plus de 100 avis Trustpilot.",
  });
}

const T = {
  fr: { eyebrow: "Ils ont testé BIEN", h1: "Vos avis, notre fierté.", reviewsTp: "avis Trustpilot", seeAll: "Voir tous les avis sur Trustpilot", verified: "Vérifié", reply: "Réponse de BIEN" },
  en: { eyebrow: "They tried BIEN", h1: "Your reviews, our pride.", reviewsTp: "Trustpilot reviews", seeAll: "See all reviews on Trustpilot", verified: "Verified", reply: "Reply from BIEN" },
} as const;

type Review = {
  name: string;
  country: string; // code ISO pour l'emoji drapeau
  date: string;
  rating: number;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
  verified?: boolean;
  reply?: string;
  replyEn?: string;
};

const FLAG: Record<string, string> = { FR: "🇫🇷", GP: "🇬🇵", GB: "🇬🇧", BE: "🇧🇪", CH: "🇨🇭" };

const REVIEWS: Review[] = [
  {
    name: "Victoria Faur", country: "FR", date: "11 juin 2025", rating: 5, verified: true,
    title: "100% satisfaite pour la productivité",
    titleEn: "100% satisfied for productivity",
    text: "100% satisfaite pour la productivité.",
    textEn: "100% satisfied for productivity.",
  },
  {
    name: "Romain Guichard", country: "FR", date: "24 nov. 2024", rating: 5,
    title: "J'avais déjà fait une cure de micro-dose",
    titleEn: "I'd already done a micro-dose course",
    text: "J'avais déjà fait une cure de micro-dose et BIEN a vraiment des produits de qualité et faciles à prendre. Cela fait 4 prises et je sens petit à petit les effets bénéfiques concrets. Il faut mieux partir sur 6 semaines pour avoir tous les effets bénéfiques de la cure. Pause. Puis de nouveau 6 semaines.",
    textEn: "I'd already done a micro-dose course and BIEN really has quality products that are easy to take. It's been 4 doses and I'm gradually feeling concrete benefits. Better to plan for 6 weeks to get all the benefits of the course. Break. Then 6 weeks again.",
  },
  {
    name: "Franck Matifas", country: "FR", date: "22 nov. 2024", rating: 5,
    title: "Super produits doux et très efficaces",
    titleEn: "Great gentle and very effective products",
    text: "Supers produits doux et efficaces pour la concentration. Je recommande.",
    textEn: "Great products, gentle and effective for focus. I recommend.",
  },
  {
    name: "Marie Truchot", country: "FR", date: "21 nov. 2024", rating: 5,
    title: "Je souffre d'un SSPT et j'ai pris la cure",
    titleEn: "I have PTSD and I took the course",
    text: "Je souffre d'un SSPT et j'ai pris la cure Peace in the chaos sur 6 semaines. J'ai ressenti les effets relaxants dès les premières prises, mais c'est vraiment au bout de deux semaines que j'ai vu une amélioration de ma concentration, de ma productivité et de ma créativité. J'avais plein d'idées mais surtout je les réalisais :) Je pouvais enfin de nouveau rester concentrée sur une tâche plusieurs heures… un soulagement ! :)",
    textEn: "I have PTSD and I took the Peace in the Chaos course over 6 weeks. I felt the relaxing effects from the first doses, but it was really after two weeks that I saw an improvement in my focus, productivity and creativity. I had lots of ideas but above all I was making them happen :) I could finally stay focused on a task for several hours again… a relief! :)",
  },
  {
    name: "Carla", country: "FR", date: "5 nov. 2024", rating: 5,
    title: "FOCUS pour rester focus",
    titleEn: "FOCUS to stay focused",
    text: "Je suis vraiment impressionnée par les effets du complément alimentaire à base de Lion's Mane ! Depuis que j'ai commencé à l'utiliser, j'ai constaté une nette amélioration de ma concentration et de ma clarté mentale. Là où je peinais à rester focalisée sur mes tâches auparavant, je ressens maintenant une meilleure capacité à rester concentrée pendant de longues périodes sans être facilement distraite. En plus de l'effet sur ma concentration, j'ai aussi noté une sensation générale de bien-être et de calme, ce qui me permet d'aborder mes journées avec plus de sérénité. J'apprécie beaucoup la qualité de ce complément, et le fait qu'il soit naturel est un énorme plus pour moi. Je recommande vivement !",
    textEn: "I'm really impressed by the effects of the Lion's Mane supplement! Since I started using it, I've noticed a clear improvement in my focus and mental clarity. Where I used to struggle to stay focused on my tasks, I now feel a better ability to stay concentrated for long periods without being easily distracted. Beyond the effect on my focus, I've also noticed a general feeling of wellbeing and calm, which lets me approach my days with more serenity. I really appreciate the quality of this supplement, and the fact that it's natural is a huge plus for me. Highly recommend!",
  },
  {
    name: "Romain Dahan", country: "FR", date: "19 oct. 2024", rating: 5,
    title: "Expérience bienveillante",
    titleEn: "A caring experience",
    text: "Expérience bienveillante et satisfaisante depuis la découverte et la commande jusqu'à la cure. Je suis satisfait des effets qui m'ont apporté du calme et de la concentration au quotidien. Service client top.",
    textEn: "A caring and satisfying experience from discovery and ordering through to the course. I'm happy with the effects, which brought me calm and focus day to day. Great customer service.",
  },
  {
    name: "Pierre", country: "FR", date: "8 oct. 2024", rating: 5,
    title: "Feel much better",
    titleEn: "Feel much better",
    text: "Feel much better. I keep focus and finish task in a much more productive way!",
    textEn: "Feel much better. I keep focus and finish tasks in a much more productive way!",
  },
  {
    name: "Elvirash", country: "FR", date: "26 sept. 2024", rating: 5,
    title: "Bluffée alors que j'y croyais pas",
    titleEn: "Blown away even though I didn't believe in it",
    text: "Au départ j'ai pensé à une arnaque sur Instagram et franchement dès la première prise, j'ai exécuté une semaine intense de travail créatif en étant hyper focus, lucide, sans m'éparpiller comme d'habitude et sans stress. Après, j'ai essayé une autre marque et je n'ai rien ressenti du tout ! Donc je viens d'y retourner et de leur acheter un pack. C'est vraiment des petits champignons avec un goût de terre acide dans un emballage hyper solide et joli.",
    textEn: "At first I thought it was an Instagram scam and honestly, from the very first dose, I powered through an intense week of creative work being hyper-focused, clear-headed, without scattering as usual and without stress. Then I tried another brand and felt nothing at all! So I just went back and bought a pack from them. It's really little mushrooms with an earthy, tangy taste in very sturdy, pretty packaging.",
  },
  {
    name: "Catherine Moumin", country: "FR", date: "23 sept. 2024", rating: 5,
    title: "Bravo à Alice !!!",
    titleEn: "Well done Alice!!!",
    text: "Bravo à Alice !!!! Le micro dosing est très efficace. Je l'associe aux Gummies Lion. Je constate une vivacité intellectuelle accrue et une vitalité, une énergie décuplée depuis le microdosing. Génial !!!!!",
    textEn: "Well done Alice!!!! The micro-dosing is very effective. I pair it with the Lion gummies. I notice increased mental sharpness and vitality, tenfold energy since micro-dosing. Amazing!!!!!",
  },
  {
    name: "Lucie Nocerino", country: "FR", date: "20 sept. 2024", rating: 5,
    title: "Expérience incroyable",
    titleEn: "Incredible experience",
    text: "Cette expérience a été incroyable : mon stress a largement diminué, m'aidant à dormir et à retrouver un quotidien apaisé. L'accompagnement de l'équipe BIEN a été 100% pertinent tout le long du process. Je recommande les yeux fermés !",
    textEn: "This experience was incredible: my stress dropped significantly, helping me sleep and regain a calmer daily life. The BIEN team's support was 100% on point throughout the process. I recommend it without hesitation!",
  },
  {
    name: "Juliette", country: "FR", date: "17 sept. 2024", rating: 5,
    title: "N'hésitez pas !!!!",
    titleEn: "Don't hesitate!!!!",
    text: "Livraison rapide, packaging très sympa et produit exceptionnel ! Je ne pensais pas que cela me donnerait autant d'énergie, de clarté et moins d'anxiété. Plus besoin d'anxio !",
    textEn: "Fast delivery, lovely packaging and an exceptional product! I didn't think it would give me so much energy, clarity and less anxiety. No more anti-anxiety meds!",
  },
  {
    name: "Joanna Fernandez Da Silva", country: "GP", date: "13 sept. 2024", rating: 5,
    title: "Très efficace je recommande vivement !",
    titleEn: "Very effective, highly recommend!",
    text: "De nature très anxieuse et stressée, cette cure m'a beaucoup aidée. Elle m'a permis de mieux gérer mon stress notamment dans mon poste où j'ai pu nettement accroître mes capacités. Plus concentrée et focus que jamais.",
    textEn: "Being very anxious and stressed by nature, this course helped me a lot. It let me manage my stress better, especially at work where I clearly increased my capacity. More focused than ever.",
  },
  {
    name: "Justine Lo", country: "GB", date: "9 sept. 2024", rating: 5,
    title: "Première expérience...",
    titleEn: "First experience...",
    text: "Je suis de nature très anxieuse, et après avoir essayé de multiples remèdes afin de diminuer mon stress, BIEN a été une réelle découverte pour moi ! Je me sens beaucoup plus apaisée, il est plus facile de me concentrer. J'ai été très réticente à l'utilisation au début, mais grâce à l'accompagnement en ligne, j'ai rapidement fait confiance à l'équipe et à la marque pour trouver un dosage qui me convient !",
    textEn: "I'm very anxious by nature, and after trying multiple remedies to reduce my stress, BIEN was a real discovery for me! I feel much calmer, it's easier to concentrate. I was very reluctant to use it at first, but thanks to the online support, I quickly trusted the team and the brand to find a dosage that suits me!",
  },
  {
    name: "Catherine Duspeaux", country: "FR", date: "9 sept. 2024", rating: 5,
    title: "Meilleure cure ever",
    titleEn: "Best course ever",
    text: "Meilleure cure ever. Je me sens revivre, je ne me suis jamais sentie aussi en forme et alignée. C'est simple, BIEN a changé mon quotidien. Je suis en pause de deux semaines avant de repartir sur une nouvelle cure, qui m'attend déjà, j'ai hâte de voir comment les effets se prolongent. Je recommande d'arrêter le café et l'alcool pendant cette cure pour vraiment sentir les effets qui sont immédiats et à effet prolongé dans la journée, c'est épatant. Mon moral est aussi sorti vainqueur de l'expérience. Comment ai-je pu faire sans jusque-là ?",
    textEn: "Best course ever. I feel reborn, I've never felt so fit and aligned. Simply put, BIEN changed my daily life. I'm on a two-week break before starting a new course, which is already waiting for me, and I can't wait to see how the effects continue. I recommend quitting coffee and alcohol during this course to really feel the effects, which are immediate and long-lasting through the day, it's amazing. My mood also came out a winner from the experience. How did I manage without it until now?",
  },
  {
    name: "Tom Ptz", country: "FR", date: "9 sept. 2024", rating: 5,
    title: "Excellente expérience !",
    titleEn: "Excellent experience!",
    text: "Bien que sceptique au départ, je dois dire qu'après cette première cure mon avis a complètement changé. Cette première expérience m'a permis de réduire mon anxiété ainsi que de m'aider avec quelques problèmes de sommeil. L'équipe de BIEN a été là dès le début afin de répondre à mes questions et me guider au mieux, donc n'hésitez pas à les solliciter si le moindre doute subsiste. Je renouvellerai très probablement l'expérience et j'invite tout le monde à essayer !",
    textEn: "Although sceptical at first, I have to say that after this first course my opinion completely changed. This first experience helped me reduce my anxiety as well as with some sleep issues. The BIEN team was there from the start to answer my questions and guide me as best as possible, so don't hesitate to reach out if you have any doubt. I'll very likely do it again and I invite everyone to try!",
  },
  {
    name: "Frédéric Perrin", country: "FR", date: "7 sept. 2024", rating: 3, verified: true,
    title: "Vos produits sont trop chers",
    titleEn: "Your products are too expensive",
    text: "Vos produits sont trop chers. C'est tout.",
    textEn: "Your products are too expensive. That's all.",
    reply: "Bonjour Frédéric, merci pour votre avis. Nous comprenons que le prix puisse surprendre, mais il reflète l'efficacité de nos formulations. Nos produits sont développés avec soin pour offrir des résultats concrets et durables. Nous serions ravis d'échanger avec vous pour mieux comprendre votre expérience. Cordialement, l'équipe BIEN.",
    replyEn: "Hello Frédéric, thank you for your review. We understand the price can be surprising, but it reflects the effectiveness of our formulations. Our products are carefully developed to deliver concrete, lasting results. We'd be happy to talk with you to better understand your experience. Best regards, the BIEN team.",
  },
  {
    name: "Catherine Taburet", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "J'ai un TDA depuis toujours",
    titleEn: "I've had ADD forever",
    text: "J'ai un TDA depuis toujours et j'ai découvert les gummies ! J'étais sceptique au départ mais cela m'aide au quotidien à me concentrer et à me sentir plus confiante.",
    textEn: "I've had ADD forever and I discovered the gummies! I was sceptical at first but they help me every day to focus and feel more confident.",
  },
  {
    name: "Grégoire Proux", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "Effets bluffants",
    titleEn: "Impressive effects",
    text: "J'utilise le micro dosing depuis 14 jours et j'ai ressenti dès la première semaine les avantages. J'ai l'impression d'être bien plus processé et focus dans mes réflexions et mon organisation. Le travail que je pouvais abattre en 3h avant, je le fais en moitié moins de temps maintenant. Je crois que mon cerveau est plus optimisé 😁",
    textEn: "I've been micro-dosing for 14 days and felt the benefits from the very first week. I feel far more methodical and focused in my thinking and organisation. Work that used to take me 3 hours now takes half the time. I think my brain is more optimised 😁",
  },
  {
    name: "Emma Anizan", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "Je viens de finir la cure de 6 semaines",
    titleEn: "I just finished the 6-week course",
    text: "Je viens de finir la cure de 6 semaines. Je me sens beaucoup moins anxieuse ce qui aide énormément à améliorer ma concentration. Je n'hésiterai pas à refaire une seconde cure bientôt.",
    textEn: "I just finished the 6-week course. I feel much less anxious, which hugely helps improve my focus. I won't hesitate to do a second course soon.",
  },
  {
    name: "Martin Carchet", country: "FR", date: "4 sept. 2024", rating: 5,
    title: "Produit remarquable !",
    titleEn: "Remarkable product!",
    text: "J'ai rapidement senti des effets positifs tels que la diminution du stress, une meilleure productivité et une concentration accrue. J'ai hâte de commencer ma deuxième cure !",
    textEn: "I quickly felt positive effects such as reduced stress, better productivity and increased focus. Can't wait to start my second course!",
  },
  {
    name: "Cortet Claire", country: "FR", date: "4 sept. 2024", rating: 4,
    title: "More relaxed but very little effect",
    titleEn: "More relaxed but very little effect",
    text: "More relaxed but very little effect.",
    textEn: "More relaxed but very little effect.",
    reply: "Hi Claire, thanks for your review! The « little effect » might be due to the dosage. Could you confirm that you've been taking a full dose of 1g? Feel free to book a free online consultation directly on our website: we would be happy to guide you! The BIEN team.",
    replyEn: "Hi Claire, thanks for your review! The “little effect” might be due to the dosage. Could you confirm that you've been taking a full dose of 1g? Feel free to book a free online consultation directly on our website: we would be happy to guide you! The BIEN team.",
  },
  {
    name: "Lola Policand", country: "FR", date: "4 sept. 2024", rating: 5,
    title: "Ça m'a énormément aidé pour mes exams",
    titleEn: "It helped me a lot for my exams",
    text: "Ça m'a énormément aidé pour mes exams et ma concentration.",
    textEn: "It helped me a lot for my exams and my focus.",
  },
  {
    name: "Raphaelle Lapeyre", country: "FR", date: "24 juil. 2024", rating: 5,
    title: "Première et super expérience",
    titleEn: "First and great experience",
    text: "Première expérience et super expérience ! Le rdv en amont avec Alice permet de répondre aux questions importantes pour chacun pour bien entamer la cure. Le suivi par la suite avec l'application est top. Et surtout les effets attendus avec la cure sont super satisfaisants. Je ne suis qu'au début de ma cure mais je suis ravie des effets, je me sens plus apaisée, à l'écoute et en forme. Je recommande fortement cette cure ! Et je recommencerais.",
    textEn: "First experience and a great one! The appointment beforehand with Alice answers the important questions for everyone to start the course well. The follow-up afterwards with the app is great. And above all the expected effects of the course are very satisfying. I'm only at the start of my course but I'm delighted with the effects, I feel calmer, more attuned and fit. I strongly recommend this course! And I'd do it again.",
  },
  {
    name: "Carine Moussaoui", country: "FR", date: "19 juil. 2024", rating: 5,
    title: "Je vous recommande de tenter l'expérience",
    titleEn: "I recommend giving it a try",
    text: "J'avais besoin de trouver un complément pour m'aider à gérer des périodes parfois fatigantes et stressantes dans ma vie pro/perso. Ça m'aide à rester focus, gérer les urgences sans me sentir débordée. M'aide à relativiser sur des réactions que j'avais parfois excessives. J'avais un peu peur au début mais je n'ai pas eu d'effet secondaire ni de mauvaise sensation. Je vous recommande de tenter l'expérience et vous pourrez, comme moi, en juger par vous-même !",
    textEn: "I needed a supplement to help me handle sometimes tiring and stressful periods in my work/personal life. It helps me stay focused, manage urgent things without feeling overwhelmed. Helps me put into perspective reactions that were sometimes excessive. I was a bit worried at first but had no side effects or bad feelings. I recommend giving it a try and, like me, you'll be able to judge for yourself!",
  },
  {
    name: "Manon Moums", country: "FR", date: "5 avr. 2024", rating: 5,
    title: "Du BIEN in my life !",
    titleEn: "Some BIEN in my life!",
    text: "C'est une alternative très douce permettant d'évoluer et d'améliorer certains points de personnalité et de comportement : anxiété diminuée, concentration prononcée, apaisement sur des situations stressantes. Facile à prendre, aucun problème de digestion, aucun goût donc non impactant. Je prends BIEN depuis quelques semaines dû à un changement d'activité et le lancement d'un très gros projet professionnel. Je suis ravie du résultat, et surtout en pleine confiance puisque cela a été un process étudié, accompagné par des professionnels de la santé, avec une équipe à disposition pour la moindre question. L'accompagnement est parfait. Merci BIEN.",
    textEn: "It's a very gentle alternative that helps you evolve and improve certain personality and behaviour traits: reduced anxiety, sharper focus, calm in stressful situations. Easy to take, no digestion issues, no taste so no impact. I've been taking BIEN for a few weeks due to a career change and the launch of a very big professional project. I'm delighted with the result, and above all fully confident since it was a carefully studied process, supported by health professionals, with a team on hand for any question. The support is perfect. Thank you BIEN.",
  },
];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i < value ? "fill-bien-star text-bien-star" : "fill-bien-forest/15 text-black/15"}`} />
      ))}
    </div>
  );
}

export default async function AvisPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const en = lang === "en";
  const t = T[en ? "en" : "fr"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero résumé */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 sm:pt-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">{t.eyebrow}</p>
          <h1 className="mt-3 font-hero text-[clamp(1.98rem,4.4vw,3.3rem)] leading-[1] text-black">
            {accentLastWord(t.h1)}
          </h1>
          <div className="mt-6 inline-flex items-center gap-4 rounded-2xl bg-card ring-1 ring-border bien-shadow-sm px-6 py-4">
            <span className="font-display text-4xl text-black leading-none">{ratingLabel(lang)}</span>
            <span className="h-10 w-px bg-border" />
            <span className="text-left">
              <StarRow value={4} />
              <span className="mt-1 block text-sm text-black/65"><span className="font-semibold text-black">+{TRUSTPILOT_REVIEWS}</span> {t.reviewsTp}</span>
            </span>
          </div>
          <div className="mt-5">
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#00b67a] text-white px-6 py-3 text-sm font-bold hover:brightness-105 transition"
            >
              {t.seeAll} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Liste des avis (colonnes façon mur d'avis) */}
      <section className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-12 sm:mt-16 mb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 [column-fill:_balance]">
          {REVIEWS.map((r) => (
            <article key={`${r.name}-${r.date}`} className="mb-5 sm:mb-6 break-inside-avoid bg-card rounded-2xl ring-1 ring-border bien-shadow-sm p-5">
              <div className="flex items-center justify-between gap-2">
                <StarRow value={r.rating} />
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-bien-leaf">
                    <Check className="h-3.5 w-3.5" /> {t.verified}
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-display text-black leading-tight">{en ? r.titleEn : r.title}</h2>
              <p className="mt-2 text-sm text-black/80 leading-relaxed">{en ? r.textEn : r.text}</p>

              {r.reply && (
                <div className="mt-4 rounded-xl bg-bien-cream/60 ring-1 ring-border p-3.5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-bien-leaf">
                    <Quote className="h-3.5 w-3.5" /> {t.reply}
                  </p>
                  <p className="mt-1.5 text-[13px] text-black/75 leading-relaxed">{en ? (r.replyEn ?? r.reply) : r.reply}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-black/55">
                <span className="font-semibold text-black">{FLAG[r.country] ?? "🌍"} {r.name}</span>
                <span>{r.date}</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Trustpilot après tous les avis */}
        <div className="mt-10 flex justify-center">
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#00b67a] text-white px-7 py-3.5 text-sm font-bold hover:brightness-105 transition"
          >
            {t.seeAll} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
