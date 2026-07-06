import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Check, ArrowUpRight, Quote } from "lucide-react";
import { hasLocale } from "../dictionaries";
import SiteHeader from "@/components/site-header";
import { TRUSTPILOT_URL } from "@/components/trustpilot";

export const metadata: Metadata = {
  title: "Avis clients — BIEN",
  description:
    "Les avis vérifiés de nos clients sur les compléments BIEN : concentration, sérénité, énergie, sommeil. Note 4,4/5 sur plus de 100 avis Trustpilot.",
};

type Review = {
  name: string;
  country: string; // code ISO pour l'emoji drapeau
  date: string;
  rating: number;
  title: string;
  text: string;
  verified?: boolean;
  reply?: string;
};

const FLAG: Record<string, string> = { FR: "🇫🇷", GP: "🇬🇵", GB: "🇬🇧", BE: "🇧🇪", CH: "🇨🇭" };

const REVIEWS: Review[] = [
  {
    name: "Victoria Faur", country: "FR", date: "11 juin 2025", rating: 5, verified: true,
    title: "100% satisfaite pour la productivité",
    text: "100% satisfaite pour la productivité.",
  },
  {
    name: "Romain Guichard", country: "FR", date: "24 nov. 2024", rating: 5,
    title: "J'avais déjà fait une cure de micro-dose",
    text: "J'avais déjà fait une cure de micro-dose et BIEN a vraiment des produits de qualité et faciles à prendre. Cela fait 4 prises et je sens petit à petit les effets bénéfiques concrets. Il faut mieux partir sur 6 semaines pour avoir tous les effets bénéfiques de la cure. Pause. Puis de nouveau 6 semaines.",
  },
  {
    name: "Franck Matifas", country: "FR", date: "22 nov. 2024", rating: 5,
    title: "Super produits doux et très efficaces",
    text: "Supers produits doux et efficaces pour la concentration. Je recommande.",
  },
  {
    name: "Marie Truchot", country: "FR", date: "21 nov. 2024", rating: 5,
    title: "Je souffre d'un SSPT et j'ai pris la cure",
    text: "Je souffre d'un SSPT et j'ai pris la cure Peace in the chaos sur 6 semaines. J'ai ressenti les effets relaxants dès les premières prises, mais c'est vraiment au bout de deux semaines que j'ai vu une amélioration de ma concentration, de ma productivité et de ma créativité. J'avais plein d'idées mais surtout je les réalisais :) Je pouvais enfin de nouveau rester concentrée sur une tâche plusieurs heures… un soulagement ! :)",
  },
  {
    name: "Carla", country: "FR", date: "5 nov. 2024", rating: 5,
    title: "FOCUS pour rester focus",
    text: "Je suis vraiment impressionnée par les effets du complément alimentaire à base de Lion's Mane ! Depuis que j'ai commencé à l'utiliser, j'ai constaté une nette amélioration de ma concentration et de ma clarté mentale. Là où je peinais à rester focalisée sur mes tâches auparavant, je ressens maintenant une meilleure capacité à rester concentrée pendant de longues périodes sans être facilement distraite. En plus de l'effet sur ma concentration, j'ai aussi noté une sensation générale de bien-être et de calme, ce qui me permet d'aborder mes journées avec plus de sérénité. J'apprécie beaucoup la qualité de ce complément, et le fait qu'il soit naturel est un énorme plus pour moi. Je recommande vivement !",
  },
  {
    name: "Romain Dahan", country: "FR", date: "19 oct. 2024", rating: 5,
    title: "Expérience bienveillante",
    text: "Expérience bienveillante et satisfaisante depuis la découverte et la commande jusqu'à la cure. Je suis satisfait des effets qui m'ont apporté du calme et de la concentration au quotidien. Service client top.",
  },
  {
    name: "Pierre", country: "FR", date: "8 oct. 2024", rating: 5,
    title: "Feel much better",
    text: "Feel much better. I keep focus and finish task in a much more productive way!",
  },
  {
    name: "Elvirash", country: "FR", date: "26 sept. 2024", rating: 5,
    title: "Bluffée alors que j'y croyais pas",
    text: "Au départ j'ai pensé à une arnaque sur Instagram et franchement dès la première prise, j'ai exécuté une semaine intense de travail créatif en étant hyper focus, lucide, sans m'éparpiller comme d'habitude et sans stress. Après, j'ai essayé une autre marque et je n'ai rien ressenti du tout ! Donc je viens d'y retourner et de leur acheter un pack. C'est vraiment des petits champignons avec un goût de terre acide dans un emballage hyper solide et joli.",
  },
  {
    name: "Catherine Moumin", country: "FR", date: "23 sept. 2024", rating: 5,
    title: "Bravo à Alice !!!",
    text: "Bravo à Alice !!!! Le micro dosing est très efficace. Je l'associe aux Gummies Lion. Je constate une vivacité intellectuelle accrue et une vitalité, une énergie décuplée depuis le microdosing. Génial !!!!!",
  },
  {
    name: "Lucie Nocerino", country: "FR", date: "20 sept. 2024", rating: 5,
    title: "Expérience incroyable",
    text: "Cette expérience a été incroyable : mon stress a largement diminué, m'aidant à dormir et à retrouver un quotidien apaisé. L'accompagnement de l'équipe BIEN a été 100% pertinent tout le long du process. Je recommande les yeux fermés !",
  },
  {
    name: "Juliette", country: "FR", date: "17 sept. 2024", rating: 5,
    title: "N'hésitez pas !!!!",
    text: "Livraison rapide, packaging très sympa et produit exceptionnel ! Je ne pensais pas que cela me donnerait autant d'énergie, de clarté et moins d'anxiété. Plus besoin d'anxio !",
  },
  {
    name: "Joanna Fernandez Da Silva", country: "GP", date: "13 sept. 2024", rating: 5,
    title: "Très efficace je recommande vivement !",
    text: "De nature très anxieuse et stressée, cette cure m'a beaucoup aidée. Elle m'a permis de mieux gérer mon stress notamment dans mon poste où j'ai pu nettement accroître mes capacités. Plus concentrée et focus que jamais.",
  },
  {
    name: "Justine Lo", country: "GB", date: "9 sept. 2024", rating: 5,
    title: "Première expérience...",
    text: "Je suis de nature très anxieuse, et après avoir essayé de multiples remèdes afin de diminuer mon stress, BIEN a été une réelle découverte pour moi ! Je me sens beaucoup plus apaisée, il est plus facile de me concentrer. J'ai été très réticente à l'utilisation au début, mais grâce à l'accompagnement en ligne, j'ai rapidement fait confiance à l'équipe et à la marque pour trouver un dosage qui me convient !",
  },
  {
    name: "Catherine Duspeaux", country: "FR", date: "9 sept. 2024", rating: 5,
    title: "Meilleure cure ever",
    text: "Meilleure cure ever. Je me sens revivre, je ne me suis jamais sentie aussi en forme et alignée. C'est simple, BIEN a changé mon quotidien. Je suis en pause de deux semaines avant de repartir sur une nouvelle cure, qui m'attend déjà, j'ai hâte de voir comment les effets se prolongent. Je recommande d'arrêter le café et l'alcool pendant cette cure pour vraiment sentir les effets qui sont immédiats et à effet prolongé dans la journée, c'est épatant. Mon moral est aussi sorti vainqueur de l'expérience. Comment ai-je pu faire sans jusque-là ?",
  },
  {
    name: "Tom Ptz", country: "FR", date: "9 sept. 2024", rating: 5,
    title: "Excellente expérience !",
    text: "Bien que sceptique au départ, je dois dire qu'après cette première cure mon avis a complètement changé. Cette première expérience m'a permis de réduire mon anxiété ainsi que de m'aider avec quelques problèmes de sommeil. L'équipe de BIEN a été là dès le début afin de répondre à mes questions et me guider au mieux, donc n'hésitez pas à les solliciter si le moindre doute subsiste. Je renouvellerai très probablement l'expérience et j'invite tout le monde à essayer !",
  },
  {
    name: "Frédéric Perrin", country: "FR", date: "7 sept. 2024", rating: 3, verified: true,
    title: "Vos produits sont trop chers",
    text: "Vos produits sont trop chers. C'est tout.",
    reply: "Bonjour Frédéric, merci pour votre avis. Nous comprenons que le prix puisse surprendre, mais il reflète l'efficacité de nos formulations. Nos produits sont développés avec soin pour offrir des résultats concrets et durables. Nous serions ravis d'échanger avec vous pour mieux comprendre votre expérience. Cordialement, l'équipe BIEN.",
  },
  {
    name: "Catherine Taburet", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "J'ai un TDA depuis toujours",
    text: "J'ai un TDA depuis toujours et j'ai découvert les gummies ! J'étais sceptique au départ mais cela m'aide au quotidien à me concentrer et à me sentir plus confiante.",
  },
  {
    name: "Grégoire Proux", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "Effets bluffants",
    text: "J'utilise le micro dosing depuis 14 jours et j'ai ressenti dès la première semaine les avantages. J'ai l'impression d'être bien plus processé et focus dans mes réflexions et mon organisation. Le travail que je pouvais abattre en 3h avant, je le fais en moitié moins de temps maintenant. Je crois que mon cerveau est plus optimisé 😁",
  },
  {
    name: "Emma Anizan", country: "FR", date: "5 sept. 2024", rating: 5,
    title: "Je viens de finir la cure de 6 semaines",
    text: "Je viens de finir la cure de 6 semaines. Je me sens beaucoup moins anxieuse ce qui aide énormément à améliorer ma concentration. Je n'hésiterai pas à refaire une seconde cure bientôt.",
  },
  {
    name: "Martin Carchet", country: "FR", date: "4 sept. 2024", rating: 5,
    title: "Produit remarquable !",
    text: "J'ai rapidement senti des effets positifs tels que la diminution du stress, une meilleure productivité et une concentration accrue. J'ai hâte de commencer ma deuxième cure !",
  },
  {
    name: "Cortet Claire", country: "FR", date: "4 sept. 2024", rating: 4,
    title: "More relaxed but very little effect",
    text: "More relaxed but very little effect.",
    reply: "Hi Claire, thanks for your review! The « little effect » might be due to the dosage. Could you confirm that you've been taking a full dose of 1g? Feel free to book a free online consultation directly on our website — we would be happy to guide you! The BIEN team.",
  },
  {
    name: "Lola Policand", country: "FR", date: "4 sept. 2024", rating: 5,
    title: "Ça m'a énormément aidé pour mes exams",
    text: "Ça m'a énormément aidé pour mes exams et ma concentration.",
  },
  {
    name: "Raphaelle Lapeyre", country: "FR", date: "24 juil. 2024", rating: 5,
    title: "Première et super expérience",
    text: "Première expérience et super expérience ! Le rdv en amont avec Alice permet de répondre aux questions importantes pour chacun pour bien entamer la cure. Le suivi par la suite avec l'application est top. Et surtout les effets attendus avec la cure sont super satisfaisants. Je ne suis qu'au début de ma cure mais je suis ravie des effets, je me sens plus apaisée, à l'écoute et en forme. Je recommande fortement cette cure ! Et je recommencerais.",
  },
  {
    name: "Carine Moussaoui", country: "FR", date: "19 juil. 2024", rating: 5,
    title: "Je vous recommande de tenter l'expérience",
    text: "J'avais besoin de trouver un complément pour m'aider à gérer des périodes parfois fatigantes et stressantes dans ma vie pro/perso. Ça m'aide à rester focus, gérer les urgences sans me sentir débordée. M'aide à relativiser sur des réactions que j'avais parfois excessives. J'avais un peu peur au début mais je n'ai pas eu d'effet secondaire ni de mauvaise sensation. Je vous recommande de tenter l'expérience et vous pourrez, comme moi, en juger par vous-même !",
  },
  {
    name: "Manon Moums", country: "FR", date: "5 avr. 2024", rating: 5,
    title: "Du BIEN in my life !",
    text: "C'est une alternative très douce permettant d'évoluer et d'améliorer certains points de personnalité et de comportement : anxiété diminuée, concentration prononcée, apaisement sur des situations stressantes. Facile à prendre, aucun problème de digestion, aucun goût donc non impactant. Je prends BIEN depuis quelques semaines dû à un changement d'activité et le lancement d'un très gros projet professionnel. Je suis ravie du résultat, et surtout en pleine confiance puisque cela a été un process étudié, accompagné par des professionnels de la santé, avec une équipe à disposition pour la moindre question. L'accompagnement est parfait. Merci BIEN.",
  },
];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i < value ? "fill-bien-gold text-bien-gold" : "fill-bien-forest/15 text-black/15"}`} />
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang} />

      {/* Hero résumé */}
      <section className="px-4 sm:px-6 lg:px-[100px] pt-12 sm:pt-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-bien-leaf font-semibold">Ils ont testé BIEN</p>
          <h1 className="mt-3 font-display font-black tracking-tighter text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] text-black">
            Vos avis, notre fierté.
          </h1>
          <div className="mt-6 inline-flex items-center gap-4 rounded-2xl bg-card ring-1 ring-border bien-shadow-sm px-6 py-4">
            <span className="font-display font-black text-4xl text-black leading-none">4,4</span>
            <span className="h-10 w-px bg-border" />
            <span className="text-left">
              <StarRow value={4} />
              <span className="mt-1 block text-sm text-black/65"><span className="font-semibold text-black">+100</span> avis Trustpilot</span>
            </span>
          </div>
          <div className="mt-5">
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#00b67a] text-white px-6 py-3 text-sm font-bold hover:brightness-105 transition"
            >
              Voir tous les avis sur Trustpilot <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Liste des avis (colonnes façon mur d'avis) */}
      <section className="px-4 sm:px-6 lg:px-[100px] mt-12 sm:mt-16 mb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 [column-fill:_balance]">
          {REVIEWS.map((r) => (
            <article key={`${r.name}-${r.date}`} className="mb-5 sm:mb-6 break-inside-avoid bg-card rounded-2xl ring-1 ring-border bien-shadow-sm p-5">
              <div className="flex items-center justify-between gap-2">
                <StarRow value={r.rating} />
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-bien-leaf">
                    <Check className="h-3.5 w-3.5" /> Vérifié
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-display font-black text-black leading-tight">{r.title}</h2>
              <p className="mt-2 text-sm text-black/80 leading-relaxed">{r.text}</p>

              {r.reply && (
                <div className="mt-4 rounded-xl bg-bien-cream/60 ring-1 ring-border p-3.5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-bien-leaf">
                    <Quote className="h-3.5 w-3.5" /> Réponse de BIEN
                  </p>
                  <p className="mt-1.5 text-[13px] text-black/75 leading-relaxed">{r.reply}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-black/55">
                <span className="font-semibold text-black">{FLAG[r.country] ?? "🌍"} {r.name}</span>
                <span>{r.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
