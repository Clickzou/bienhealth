"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles, Copy } from "lucide-react";

/**
 * Diagnostic BIEN — quiz natif (porté du Typeform bien.health/pages/diagnostic).
 * 10 étapes → recommandation produit par scoring de besoin :
 *   concentration → FOCUS, sommeil/stress → CALM, énergie → POWER,
 *   peau/multi-besoin → MUSHGLOW (le 6-en-1).
 * L'étape email enregistre le lead (Supabase, best-effort) et délivre le code −10 %.
 */

type Product = "CALM" | "FOCUS" | "POWER" | "MUSHGLOW";

const PROMO_CODE = "WELCOMETOBIEN10";

const PRODUCTS: Record<Product, {
  name: string; handle: string; price: string; img: string;
  fr: { tagline: string; bullets: string[] };
  en: { tagline: string; bullets: string[] };
}> = {
  CALM: {
    name: "CALM", handle: "calm", price: "39 €", img: "/brand/calm.jpg",
    fr: { tagline: "Sérénité & Sommeil", bullets: ["Apaise le stress et le mental", "Favorise un sommeil profond et réparateur", "Retrouve une sérénité durable au quotidien"] },
    en: { tagline: "Calm & Sleep", bullets: ["Soothes stress and the mind", "Promotes deep, restorative sleep", "Regain lasting daily serenity"] },
  },
  FOCUS: {
    name: "FOCUS", handle: "focus", price: "39 €", img: "/brand/focus.png",
    fr: { tagline: "Concentration & Mémoire", bullets: ["Soutient la concentration et la mémoire", "Clarté mentale, sans nervosité", "Reste focus plus longtemps"] },
    en: { tagline: "Focus & Memory", bullets: ["Supports focus and memory", "Mental clarity, without the crash", "Stay focused for longer"] },
  },
  POWER: {
    name: "POWER", handle: "power", price: "39 €", img: "/brand/power.jpg",
    fr: { tagline: "Énergie & Performance", bullets: ["Booste votre énergie physique naturellement", "Endurance et tonus durables", "Fini les coups de mou de 11 h et 15 h"] },
    en: { tagline: "Energy & Performance", bullets: ["Naturally boosts your physical energy", "Lasting stamina and vitality", "No more 11 am and 3 pm slumps"] },
  },
  MUSHGLOW: {
    name: "MUSHGLOW", handle: "mushglow", price: "49 €", img: "/brand/mushglow.jpg",
    fr: { tagline: "6-en-1 · Beauté & Vitalité", bullets: ["Soutient votre énergie et votre clarté mentale sans excitation", "Renforce votre résilience au stress chronique", "Illumine votre peau de l'intérieur, naturellement"] },
    en: { tagline: "6-in-1 · Beauty & Vitality", bullets: ["Supports your energy and mental clarity without overstimulation", "Strengthens your resilience to chronic stress", "Brightens your skin from within, naturally"] },
  },
};

type Score = Partial<Record<Product, number>>;
type Option = { id: string; label: string; score?: Score };

type Question =
  | { id: string; kind: "number"; title: string; placeholder: string }
  | { id: string; kind: "single" | "multi"; title: string; subtitle?: string; options: Option[] }
  | { id: string; kind: "email"; title: string; subtitle: string };

const QUESTIONS_FR: Question[] = [
  { id: "age", kind: "number", title: "Quel est votre âge ?", placeholder: "Votre âge" },
  {
    id: "genre", kind: "single", title: "Avec quel genre vous identifiez-vous ?", subtitle: "Choix unique",
    options: [
      { id: "femme", label: "Femme" },
      { id: "homme", label: "Homme" },
      { id: "nb", label: "Non binaire" },
      { id: "na", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "concentration", kind: "single",
    title: "Sur les 7 derniers jours, à quelle fréquence avez-vous ressenti des difficultés de concentration ?",
    subtitle: "Choix unique",
    options: [
      { id: "jamais", label: "Jamais" },
      { id: "rarement", label: "Rarement" },
      { id: "parfois", label: "Parfois", score: { FOCUS: 1 } },
      { id: "souvent", label: "Souvent", score: { FOCUS: 2 } },
      { id: "constamment", label: "Quasi constamment", score: { FOCUS: 3 } },
    ],
  },
  {
    id: "energie", kind: "single", title: "Votre niveau d'énergie au réveil est généralement…", subtitle: "Choix unique",
    options: [
      { id: "excellent", label: "Excellent, je me lève sans souci" },
      { id: "correct", label: "Correct mais fluctuant", score: { POWER: 1 } },
      { id: "faible", label: "Faible, je me sens ralenti(e)", score: { POWER: 2 } },
      { id: "tres-faible", label: "Très faible, je dois lutter pour sortir du lit", score: { POWER: 3 } },
    ],
  },
  {
    id: "sommeil", kind: "multi",
    title: "Avez-vous actuellement des troubles du sommeil ou une sensation de surcharge mentale ?",
    subtitle: "Choix multiple",
    options: [
      { id: "endormir", label: "Je mets du temps à m'endormir", score: { CALM: 2 } },
      { id: "reveils", label: "Je me réveille la nuit / sommeil non réparateur", score: { CALM: 2 } },
      { id: "pression", label: "Je me sens sous pression émotionnelle constante", score: { CALM: 2 } },
      { id: "serein", label: "Non, je dors bien et je suis serein(e)" },
    ],
  },
  {
    id: "peau", kind: "multi", title: "Votre peau vous semble…", subtitle: "Choix multiple",
    options: [
      { id: "lisse", label: "Lisse et lumineuse" },
      { id: "terne", label: "Un peu terne, fatiguée", score: { MUSHGLOW: 2 } },
      { id: "marquee", label: "Marquée ou sujette à des imperfections", score: { MUSHGLOW: 2 } },
      { id: "ferme", label: "Moins ferme ou moins souple qu'avant", score: { MUSHGLOW: 2 } },
    ],
  },
  {
    id: "journee", kind: "multi", title: "En journée, vous avez tendance à :", subtitle: "Choix multiple",
    options: [
      { id: "mou", label: "Avoir des coups de mou vers 11 h ou 15 h", score: { POWER: 2 } },
      { id: "focus", label: "Avoir du mal à rester focus longtemps", score: { FOCUS: 2 } },
      { id: "agite", label: "Être agité(e) intérieurement même au repos", score: { CALM: 2 } },
      { id: "grignoter", label: "Grignoter ou boire café/matcha pour tenir", score: { POWER: 1 } },
    ],
  },
  {
    id: "routine", kind: "single", title: "Avez-vous l'habitude de prendre soin de votre santé ?", subtitle: "Choix unique",
    options: [
      { id: "oui", label: "Oui, j'ai une routine bien-être installée" },
      { id: "essaie", label: "J'essaie mais je manque de constance" },
      { id: "non", label: "Non, mais je souhaite m'y mettre" },
    ],
  },
  {
    id: "objectifs", kind: "multi", title: "Avez-vous actuellement un ou plusieurs de ces objectifs ?", subtitle: "Choix multiple",
    options: [
      { id: "cognitif", label: "Optimiser mes performances cognitives", score: { FOCUS: 3 } },
      { id: "emotionnel", label: "Retrouver un équilibre émotionnel", score: { CALM: 3 } },
      { id: "energie", label: "Booster naturellement mon énergie physique", score: { POWER: 3 } },
      { id: "peau", label: "Améliorer l'éclat et la qualité de ma peau", score: { MUSHGLOW: 3 } },
    ],
  },
  {
    id: "email", kind: "email",
    title: "−10 % sur votre première commande si vous vous inscrivez à notre newsletter 🍄",
    subtitle: "Promis, que du mush love dans votre boîte mail : vous recevez aussi votre résultat par email.",
  },
];

const QUESTIONS_EN: Question[] = [
  { id: "age", kind: "number", title: "How old are you?", placeholder: "Your age" },
  {
    id: "genre", kind: "single", title: "Which gender do you identify with?", subtitle: "Single choice",
    options: [
      { id: "femme", label: "Woman" },
      { id: "homme", label: "Man" },
      { id: "nb", label: "Non-binary" },
      { id: "na", label: "I'd rather not say" },
    ],
  },
  {
    id: "concentration", kind: "single",
    title: "Over the last 7 days, how often have you had trouble concentrating?",
    subtitle: "Single choice",
    options: [
      { id: "jamais", label: "Never" },
      { id: "rarement", label: "Rarely" },
      { id: "parfois", label: "Sometimes", score: { FOCUS: 1 } },
      { id: "souvent", label: "Often", score: { FOCUS: 2 } },
      { id: "constamment", label: "Almost constantly", score: { FOCUS: 3 } },
    ],
  },
  {
    id: "energie", kind: "single", title: "Your energy level when you wake up is usually…", subtitle: "Single choice",
    options: [
      { id: "excellent", label: "Excellent, I get up with no trouble" },
      { id: "correct", label: "Okay but fluctuating", score: { POWER: 1 } },
      { id: "faible", label: "Low, I feel sluggish", score: { POWER: 2 } },
      { id: "tres-faible", label: "Very low, I struggle to get out of bed", score: { POWER: 3 } },
    ],
  },
  {
    id: "sommeil", kind: "multi",
    title: "Do you currently have sleep issues or a feeling of mental overload?",
    subtitle: "Multiple choice",
    options: [
      { id: "endormir", label: "I take a long time to fall asleep", score: { CALM: 2 } },
      { id: "reveils", label: "I wake up at night / non-restorative sleep", score: { CALM: 2 } },
      { id: "pression", label: "I feel under constant emotional pressure", score: { CALM: 2 } },
      { id: "serein", label: "No, I sleep well and feel calm" },
    ],
  },
  {
    id: "peau", kind: "multi", title: "Your skin feels…", subtitle: "Multiple choice",
    options: [
      { id: "lisse", label: "Smooth and radiant" },
      { id: "terne", label: "A bit dull, tired", score: { MUSHGLOW: 2 } },
      { id: "marquee", label: "Marked or prone to blemishes", score: { MUSHGLOW: 2 } },
      { id: "ferme", label: "Less firm or supple than before", score: { MUSHGLOW: 2 } },
    ],
  },
  {
    id: "journee", kind: "multi", title: "During the day, you tend to:", subtitle: "Multiple choice",
    options: [
      { id: "mou", label: "Have energy dips around 11 am or 3 pm", score: { POWER: 2 } },
      { id: "focus", label: "Struggle to stay focused for long", score: { FOCUS: 2 } },
      { id: "agite", label: "Feel restless inside even at rest", score: { CALM: 2 } },
      { id: "grignoter", label: "Snack or drink coffee/matcha to keep going", score: { POWER: 1 } },
    ],
  },
  {
    id: "routine", kind: "single", title: "Are you used to taking care of your health?", subtitle: "Single choice",
    options: [
      { id: "oui", label: "Yes, I have a wellness routine in place" },
      { id: "essaie", label: "I try but I lack consistency" },
      { id: "non", label: "No, but I'd like to start" },
    ],
  },
  {
    id: "objectifs", kind: "multi", title: "Do you currently have one or more of these goals?", subtitle: "Multiple choice",
    options: [
      { id: "cognitif", label: "Optimise my cognitive performance", score: { FOCUS: 3 } },
      { id: "emotionnel", label: "Regain emotional balance", score: { CALM: 3 } },
      { id: "energie", label: "Naturally boost my physical energy", score: { POWER: 3 } },
      { id: "peau", label: "Improve my skin's radiance and quality", score: { MUSHGLOW: 3 } },
    ],
  },
  {
    id: "email", kind: "email",
    title: "−10% off your first order when you join our newsletter 🍄",
    subtitle: "Promise, only mush love in your inbox: you'll also get your result by email.",
  },
];

const getQuestions = (lang: string) => (lang === "en" ? QUESTIONS_EN : QUESTIONS_FR);

const SCREEN = {
  fr: {
    idealFormula: "Votre formule idéale",
    discover: (n: string) => `Découvrir ${n}`,
    copied: "Copié",
    promo: "−10 %",
    emailedResult: "Votre résultat et votre code viennent aussi de vous être envoyés par email.",
    introBadge: "Diagnostic gratuit · moins d'une minute",
    introH1Pre: "Vous ne savez pas quel produit ",
    introH1Post: " est fait pour vous ?",
    introText: "Ce diagnostic personnalisé analyse vos besoins et symptômes pour vous orienter vers la routine idéale : naturelle, ciblée, efficace.",
    start: "Commencer le diagnostic",
    previous: "Précédent",
    ok: "OK",
    continue: "Continuer",
    calculating: "Calcul en cours…",
    seeResult: "Voir mon résultat",
    emailPlaceholder: "votre@email.com",
    emailConsent: "En continuant, vous acceptez de recevoir nos emails. Désinscription à tout moment.",
  },
  en: {
    idealFormula: "Your ideal formula",
    discover: (n: string) => `Discover ${n}`,
    copied: "Copied",
    promo: "−10%",
    emailedResult: "Your result and your code have also just been emailed to you.",
    introBadge: "Free quiz · under a minute",
    introH1Pre: "Not sure which ",
    introH1Post: " product is right for you?",
    introText: "This personalised quiz analyses your needs and symptoms to point you to the ideal routine: natural, targeted, effective.",
    start: "Start the quiz",
    previous: "Previous",
    ok: "OK",
    continue: "Continue",
    calculating: "Calculating…",
    seeResult: "See my result",
    emailPlaceholder: "your@email.com",
    emailConsent: "By continuing, you agree to receive our emails. Unsubscribe anytime.",
  },
} as const;

function recommend(answers: Record<string, string[]>, questions: Question[]): Product {
  const scores: Record<Product, number> = { CALM: 0, FOCUS: 0, POWER: 0, MUSHGLOW: 0 };
  for (const q of questions) {
    if (q.kind !== "single" && q.kind !== "multi") continue;
    const selected = answers[q.id] ?? [];
    for (const opt of q.options) {
      if (!selected.includes(opt.id) || !opt.score) continue;
      for (const [p, v] of Object.entries(opt.score)) {
        scores[p as Product] += v as number;
      }
    }
  }
  // MUSHGLOW si multi-besoin : ≥ 2 besoins ciblés forts.
  const strong = (["CALM", "FOCUS", "POWER"] as Product[]).filter((p) => scores[p] >= 3);
  if (strong.length >= 2) return "MUSHGLOW";

  let best: Product = "MUSHGLOW";
  let bestScore = -1;
  for (const p of ["FOCUS", "CALM", "POWER", "MUSHGLOW"] as Product[]) {
    if (scores[p] > bestScore) { best = p; bestScore = scores[p]; }
  }
  return bestScore <= 0 ? "MUSHGLOW" : best;
}

export default function DiagnosticQuiz({ lang }: { lang: string }) {
  const en = lang === "en";
  const s = SCREEN[en ? "en" : "fr"];
  const questions = getQuestions(lang);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [numberValue, setNumberValue] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);

  const q = questions[step];
  const total = questions.length;
  const progress = Math.round((step / total) * 100);

  function goNext() {
    if (step < total - 1) setStep((st) => st + 1);
  }
  function goBack() {
    if (step > 0) {
      setStep((st) => st - 1);
      const prev = questions[step - 1];
      if (prev.kind === "number") setNumberValue(answers[prev.id]?.[0] ?? "");
    }
  }

  function selectSingle(qid: string, optId: string) {
    setAnswers((a) => ({ ...a, [qid]: [optId] }));
    window.setTimeout(goNext, 220);
  }
  function toggleMulti(qid: string, optId: string) {
    setAnswers((a) => {
      const cur = new Set(a[qid] ?? []);
      if (cur.has(optId)) cur.delete(optId);
      else cur.add(optId);
      return { ...a, [qid]: Array.from(cur) };
    });
  }
  function submitNumber() {
    if (!numberValue.trim()) return;
    setAnswers((a) => ({ ...a, [q.id]: [numberValue.trim()] }));
    setNumberValue("");
    goNext();
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "diagnostic" }),
      });
    } catch {
      /* best-effort */
    }
    setResult(recommend(answers, questions));
    setSending(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  // --- Écran résultat ---
  if (result) {
    const p = PRODUCTS[result];
    const loc = en ? p.en : p.fr;
    return (
      <section className="hero-surface min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-12 xl:px-16 py-12 sm:py-16 flex items-center">
        <div className="mx-auto w-full max-w-4xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-bien-cream order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-bien-gold" /> {s.idealFormula}
            </span>
            <h1 className="mt-4 font-hero text-[clamp(2.2rem,5.28vw,3.52rem)] leading-[0.95]">
              {p.name}
            </h1>
            <p className="mt-1 text-bien-gold font-semibold">{loc.tagline}</p>
            <ul className="mt-6 space-y-3">
              {loc.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-bien-cream/90">
                  <span className="mt-0.5 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-gold text-black"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            {/* Code de bienvenue */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={`/${lang}/products/${p.handle}`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-7 py-4 text-base font-bold hover:brightness-105 transition bien-shadow-sm">
                {s.discover(p.name)} <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={copyCode} className="group inline-flex items-center gap-2 rounded-full border-2 border-dashed border-bien-gold/70 px-4 py-3 hover:bg-bien-cream/5 transition">
                <span className="font-display tracking-wider text-bien-cream">{PROMO_CODE}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-bien-gold">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? s.copied : s.promo}
                </span>
              </button>
            </div>
            <p className="mt-3 text-xs text-bien-cream/60">{s.emailedResult}</p>
          </div>

          <div className="order-1 lg:order-2 relative aspect-square w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden ring-4 ring-bien-cream/20 bien-shadow">
            <Image src={p.img} alt={p.name} fill sizes="(max-width:1024px) 80vw, 400px" className="object-cover" priority />
          </div>
        </div>
      </section>
    );
  }

  // --- Écran intro ---
  if (!started) {
    return (
      <section className="hero-surface min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-12 xl:px-16 py-12 flex items-center">
        <div className="mx-auto max-w-2xl text-center text-bien-cream">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-bien-gold" /> {s.introBadge}
          </span>
          <h1 className="mt-5 font-hero text-[clamp(1.98rem,5.28vw,3.52rem)] leading-[0.98]">
            {s.introH1Pre}<span className="text-bien-gold">BIEN</span>{s.introH1Post}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-bien-cream/85 leading-relaxed">
            {s.introText}
          </p>
          <button onClick={() => setStarted(true)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 text-base font-bold hover:brightness-105 transition bien-shadow-sm">
            {s.start} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  // --- Écran question ---
  return (
    <section className="hero-surface min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-12 xl:px-16 py-10 flex flex-col">
      {/* Progression */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="h-1.5 w-full rounded-full bg-bien-cream/15 overflow-hidden">
          <div className="h-full rounded-full bg-bien-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-bien-cream/70 text-xs">
          <button onClick={goBack} disabled={step === 0} className="inline-flex items-center gap-1 disabled:opacity-30 hover:text-bien-cream transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {s.previous}
          </button>
          <span>{step + 1} / {total}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col justify-center py-8">
        <div className="flex items-start gap-3">
          <span className="mt-1 shrink-0 grid place-items-center h-7 w-7 rounded-lg bg-bien-gold text-black font-display text-sm">{step + 1}</span>
          <div>
            <h2 className="font-display tracking-tight text-bien-cream text-[clamp(1.232rem,3.08vw,1.76rem)] leading-[1.1]">{q.title}</h2>
            {"subtitle" in q && q.subtitle && <p className="mt-1.5 text-sm text-bien-cream/60">{q.subtitle}</p>}
          </div>
        </div>

        <div className="mt-7 pl-0 sm:pl-10">
          {q.kind === "number" && (
            <div className="max-w-sm">
              <input
                type="number" inputMode="numeric" autoFocus
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitNumber(); }}
                placeholder={q.placeholder}
                className="w-full rounded-xl bg-bien-cream/10 ring-1 ring-bien-cream/25 px-5 py-3.5 text-bien-cream placeholder:text-bien-cream/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition"
              />
              <button onClick={submitNumber} disabled={!numberValue.trim()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-6 py-3 text-sm font-bold hover:brightness-105 transition disabled:opacity-50">
                {s.ok} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {(q.kind === "single" || q.kind === "multi") && (
            <>
              <div className="grid gap-2.5 max-w-lg">
                {q.options.map((opt, i) => {
                  const selected = (answers[q.id] ?? []).includes(opt.id);
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => (q.kind === "single" ? selectSingle(q.id, opt.id) : toggleMulti(q.id, opt.id))}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left ring-1 transition-all ${
                        selected
                          ? "bg-bien-gold text-black ring-bien-gold"
                          : "bg-bien-cream/8 text-bien-cream ring-bien-cream/20 hover:ring-bien-cream/50 hover:bg-bien-cream/12"
                      }`}
                    >
                      <span className={`shrink-0 grid place-items-center h-6 w-6 rounded-md text-xs font-bold ${selected ? "bg-bien-forest text-bien-cream" : "bg-bien-cream/15 text-bien-cream"}`}>
                        {selected && q.kind === "multi" ? <Check className="h-3.5 w-3.5" /> : letter}
                      </span>
                      <span className="text-sm sm:text-[15px] font-medium leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {q.kind === "multi" && (
                <button onClick={goNext} className="mt-5 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-6 py-3 text-sm font-bold hover:brightness-105 transition">
                  {s.continue} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {q.kind === "email" && (
            <form onSubmit={submitEmail} className="max-w-md">
              <input
                type="email" required autoFocus autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={s.emailPlaceholder}
                className="w-full rounded-xl bg-bien-cream/10 ring-1 ring-bien-cream/25 px-5 py-3.5 text-bien-cream placeholder:text-bien-cream/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition"
              />
              <button type="submit" disabled={sending} className="mt-4 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-7 py-3.5 text-sm font-bold hover:brightness-105 transition disabled:opacity-60">
                {sending ? s.calculating : s.seeResult} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-[11px] text-bien-cream/50">{s.emailConsent}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
