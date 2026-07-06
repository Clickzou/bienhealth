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
  name: string; handle: string; tagline: string; price: string; img: string; bullets: string[];
}> = {
  CALM: {
    name: "CALM", handle: "calm", tagline: "Sérénité & Sommeil", price: "39 €", img: "/brand/calm.jpg",
    bullets: ["Apaise le stress et le mental", "Favorise un sommeil profond et réparateur", "Retrouve une sérénité durable au quotidien"],
  },
  FOCUS: {
    name: "FOCUS", handle: "focus", tagline: "Concentration & Mémoire", price: "39 €", img: "/brand/focus.png",
    bullets: ["Soutient la concentration et la mémoire", "Clarté mentale, sans coup de barre", "Reste focus plus longtemps"],
  },
  POWER: {
    name: "POWER", handle: "power", tagline: "Énergie & Performance", price: "39 €", img: "/brand/power.jpg",
    bullets: ["Booste ton énergie physique naturellement", "Endurance et tonus durables", "Fini les coups de mou de 11 h et 15 h"],
  },
  MUSHGLOW: {
    name: "MUSHGLOW", handle: "mushglow", tagline: "6-en-1 · Beauté & Vitalité", price: "49 €", img: "/brand/mushglow.jpg",
    bullets: ["Soutient ton énergie et ta clarté mentale sans excitation", "Renforce ta résilience au stress chronique", "Illumine ta peau de l'intérieur, naturellement"],
  },
};

type Score = Partial<Record<Product, number>>;
type Option = { id: string; label: string; score?: Score };

type Question =
  | { id: string; kind: "number"; title: string; placeholder: string }
  | { id: string; kind: "single" | "multi"; title: string; subtitle?: string; options: Option[] }
  | { id: string; kind: "email"; title: string; subtitle: string };

const QUESTIONS: Question[] = [
  { id: "age", kind: "number", title: "Quel est ton âge ?", placeholder: "Ton âge" },
  {
    id: "genre", kind: "single", title: "Avec quel genre t'identifies-tu ?", subtitle: "Choix unique",
    options: [
      { id: "femme", label: "Femme" },
      { id: "homme", label: "Homme" },
      { id: "nb", label: "Non binaire" },
      { id: "na", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "concentration", kind: "single",
    title: "Sur les 7 derniers jours, à quelle fréquence as-tu ressenti des difficultés de concentration ?",
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
    id: "energie", kind: "single", title: "Ton niveau d'énergie au réveil est généralement…", subtitle: "Choix unique",
    options: [
      { id: "excellent", label: "Excellent, je me lève sans souci" },
      { id: "correct", label: "Correct mais fluctuant", score: { POWER: 1 } },
      { id: "faible", label: "Faible, je me sens ralenti(e)", score: { POWER: 2 } },
      { id: "tres-faible", label: "Très faible, je dois lutter pour sortir du lit", score: { POWER: 3 } },
    ],
  },
  {
    id: "sommeil", kind: "multi",
    title: "As-tu actuellement des troubles du sommeil ou une sensation de surcharge mentale ?",
    subtitle: "Choix multiple",
    options: [
      { id: "endormir", label: "Je mets du temps à m'endormir", score: { CALM: 2 } },
      { id: "reveils", label: "Je me réveille la nuit / sommeil non réparateur", score: { CALM: 2 } },
      { id: "pression", label: "Je me sens sous pression émotionnelle constante", score: { CALM: 2 } },
      { id: "serein", label: "Non, je dors bien et je suis serein(e)" },
    ],
  },
  {
    id: "peau", kind: "multi", title: "Ta peau te semble…", subtitle: "Choix multiple",
    options: [
      { id: "lisse", label: "Lisse et lumineuse" },
      { id: "terne", label: "Un peu terne, fatiguée", score: { MUSHGLOW: 2 } },
      { id: "marquee", label: "Marquée ou sujette à des imperfections", score: { MUSHGLOW: 2 } },
      { id: "ferme", label: "Moins ferme ou moins souple qu'avant", score: { MUSHGLOW: 2 } },
    ],
  },
  {
    id: "journee", kind: "multi", title: "En journée, tu as tendance à :", subtitle: "Choix multiple",
    options: [
      { id: "mou", label: "Avoir des coups de mou vers 11 h ou 15 h", score: { POWER: 2 } },
      { id: "focus", label: "Avoir du mal à rester focus longtemps", score: { FOCUS: 2 } },
      { id: "agite", label: "Être agité(e) intérieurement même au repos", score: { CALM: 2 } },
      { id: "grignoter", label: "Grignoter ou boire café/matcha pour tenir", score: { POWER: 1 } },
    ],
  },
  {
    id: "routine", kind: "single", title: "As-tu l'habitude de prendre soin de ta santé ?", subtitle: "Choix unique",
    options: [
      { id: "oui", label: "Oui, j'ai une routine bien-être installée" },
      { id: "essaie", label: "J'essaie mais je manque de constance" },
      { id: "non", label: "Non, mais je souhaite m'y mettre" },
    ],
  },
  {
    id: "objectifs", kind: "multi", title: "As-tu actuellement un ou plusieurs de ces objectifs ?", subtitle: "Choix multiple",
    options: [
      { id: "cognitif", label: "Optimiser mes performances cognitives", score: { FOCUS: 3 } },
      { id: "emotionnel", label: "Retrouver un équilibre émotionnel", score: { CALM: 3 } },
      { id: "energie", label: "Booster naturellement mon énergie physique", score: { POWER: 3 } },
      { id: "peau", label: "Améliorer l'éclat et la qualité de ma peau", score: { MUSHGLOW: 3 } },
    ],
  },
  {
    id: "email", kind: "email",
    title: "−10 % sur ta première commande si tu t'inscris à notre newsletter 🍄",
    subtitle: "Promis, que du mush love dans ta boîte mail — reçois aussi ton résultat par email.",
  },
];

function recommend(answers: Record<string, string[]>): Product {
  const scores: Record<Product, number> = { CALM: 0, FOCUS: 0, POWER: 0, MUSHGLOW: 0 };
  for (const q of QUESTIONS) {
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
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [numberValue, setNumberValue] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((step / total) * 100);

  function goNext() {
    if (step < total - 1) setStep((s) => s + 1);
  }
  function goBack() {
    if (step > 0) {
      setStep((s) => s - 1);
      const prev = QUESTIONS[step - 1];
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
    setResult(recommend(answers));
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
    return (
      <section className="hero-gradient min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-[100px] py-12 sm:py-16 flex items-center">
        <div className="mx-auto w-full max-w-4xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-bien-cream order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-bien-gold" /> Ta formule idéale
            </span>
            <h1 className="mt-4 font-display font-black tracking-tighter text-[clamp(2.5rem,6vw,4rem)] leading-[0.95]">
              {p.name}
            </h1>
            <p className="mt-1 text-bien-gold font-semibold">{p.tagline}</p>
            <ul className="mt-6 space-y-3">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-bien-cream/90">
                  <span className="mt-0.5 shrink-0 grid place-items-center h-5 w-5 rounded-full bg-bien-gold text-black"><Check className="h-3 w-3" /></span>
                  <span className="text-sm sm:text-base leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            {/* Code de bienvenue */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={`/${lang}/products/${p.handle}`} className="inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-7 py-4 text-base font-bold hover:brightness-105 transition bien-shadow-sm">
                Découvrir {p.name} <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={copyCode} className="group inline-flex items-center gap-2 rounded-full border-2 border-dashed border-bien-gold/70 px-4 py-3 hover:bg-bien-cream/5 transition">
                <span className="font-display font-black tracking-wider text-bien-cream">{PROMO_CODE}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-bien-gold">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copié" : "−10 %"}
                </span>
              </button>
            </div>
            <p className="mt-3 text-xs text-bien-cream/60">Ton résultat et ton code viennent aussi de t'être envoyés par email.</p>
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
      <section className="hero-gradient min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-[100px] py-12 flex items-center">
        <div className="mx-auto max-w-2xl text-center text-bien-cream">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-bien-gold" /> Diagnostic gratuit · moins d'une minute
          </span>
          <h1 className="mt-5 font-display font-black tracking-tighter text-[clamp(2.25rem,6vw,4rem)] leading-[0.98]">
            Tu ne sais pas quel produit <span className="text-bien-gold">BIEN</span> est fait pour toi ?
          </h1>
          <p className="mt-5 text-base sm:text-lg text-bien-cream/85 leading-relaxed">
            Ce diagnostic personnalisé analyse tes besoins et symptômes pour t'orienter vers la routine idéale — naturelle, ciblée, efficace.
          </p>
          <button onClick={() => setStarted(true)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-8 py-4 text-base font-bold hover:brightness-105 transition bien-shadow-sm">
            Commencer le diagnostic <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  // --- Écran question ---
  return (
    <section className="hero-gradient min-h-[calc(100vh-6.5rem)] px-4 sm:px-6 lg:px-[100px] py-10 flex flex-col">
      {/* Progression */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="h-1.5 w-full rounded-full bg-bien-cream/15 overflow-hidden">
          <div className="h-full rounded-full bg-bien-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-bien-cream/70 text-xs">
          <button onClick={goBack} disabled={step === 0} className="inline-flex items-center gap-1 disabled:opacity-30 hover:text-bien-cream transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Précédent
          </button>
          <span>{step + 1} / {total}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col justify-center py-8">
        <div className="flex items-start gap-3">
          <span className="mt-1 shrink-0 grid place-items-center h-7 w-7 rounded-lg bg-bien-gold text-black font-display font-black text-sm">{step + 1}</span>
          <div>
            <h2 className="font-display font-black tracking-tight text-bien-cream text-[clamp(1.4rem,3.5vw,2rem)] leading-[1.1]">{q.title}</h2>
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
                OK <ArrowRight className="h-4 w-4" />
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
                  Continuer <ArrowRight className="h-4 w-4" />
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
                placeholder="ton@email.com"
                className="w-full rounded-xl bg-bien-cream/10 ring-1 ring-bien-cream/25 px-5 py-3.5 text-bien-cream placeholder:text-bien-cream/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition"
              />
              <button type="submit" disabled={sending} className="mt-4 inline-flex items-center gap-2 rounded-full bg-bien-gold text-black px-7 py-3.5 text-sm font-bold hover:brightness-105 transition disabled:opacity-60">
                {sending ? "Calcul en cours…" : "Voir mon résultat"} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-[11px] text-bien-cream/50">En continuant, tu acceptes de recevoir nos emails. Désinscription à tout moment.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
