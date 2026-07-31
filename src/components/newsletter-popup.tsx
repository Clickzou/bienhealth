"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, Sparkles, Check, Copy } from "lucide-react";

/**
 * Popup newsletter « −10 % première commande ».
 * - Apparition différée (2,5 s) au premier passage, une seule fois par visiteur.
 * - Capture l'email (best-effort vers /api/newsletter → Supabase leads) puis
 *   révèle le code de bienvenue réel WELCOMETOBIEN10 (issu de l'historique Shopify).
 * - Mémorise l'état (fermé / inscrit) dans localStorage pour ne pas réapparaître.
 */

const PROMO_CODE = "WELCOMETOBIEN10";
const STORAGE_KEY = "bien:newsletter-popup";
const SHOW_DELAY = 2500;

type Status = "idle" | "loading" | "done" | "error";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Affichage différé, une seule fois par visiteur.
  useEffect(() => {
    let state: string | null = null;
    try {
      state = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage indisponible (mode privé) → on affiche quand même */
    }
    if (state === "closed" || state === "subscribed") return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  // Fermeture au clavier (Échap) + focus initial.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function persist(value: "closed" | "subscribed") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }

  function close() {
    setOpen(false);
    // Ne pas écraser l'état « subscribed » par « closed ».
    if (status !== "done") persist("closed");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter_popup" }),
      });
    } catch {
      /* best-effort : on révèle le code même si l'enregistrement échoue */
    }
    setStatus("done");
    persist("subscribed");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
    >
      {/* Overlay */}
      <button
        aria-label="Fermer"
        onClick={close}
        className="absolute inset-0 bg-bien-forest/40 backdrop-blur-sm animate-[bien-fade-down_0.3s_ease]"
      />

      {/* Carte */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-card bien-shadow ring-1 ring-border grid sm:grid-cols-2 outline-none animate-[bien-fade-up_0.4s_ease]"
      >
        {/* Bouton fermer */}
        <button
          onClick={close}
          aria-label="Fermer la fenêtre"
          className="absolute top-3.5 right-3.5 z-10 grid place-items-center h-9 w-9 rounded-full bg-card/90 text-black ring-1 ring-border hover:bg-bien-cream transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Panneau texte */}
        <div className="order-2 sm:order-1 p-7 sm:p-9 flex flex-col justify-center text-center">
          {status !== "done" ? (
            <>
              <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-bien-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.55_0.13_75)]">
                <Sparkles className="h-3.5 w-3.5" /> Offre de bienvenue
              </span>
              <h2
                id="newsletter-title"
                className="mt-4 font-display tracking-tighter text-[clamp(1.408rem,2.64vw,1.848rem)] leading-[1.05] text-black"
              >
                −10 % offerts sur votre première commande
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] text-black/70 leading-relaxed">
                Recevez votre code de bienvenue par mail et suivez nos actualités
                avant tout le monde 💙
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ton adresse email"
                  autoComplete="email"
                  className="w-full rounded-full bg-card ring-1 ring-border px-5 py-3.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-bien-forest text-bien-cream px-5 py-3.5 text-sm font-semibold hover:bg-bien-leaf transition-colors disabled:opacity-60 bien-shadow-sm"
                >
                  {status === "loading" ? "Un instant…" : "Recevoir mon code"}
                </button>
              </form>
              <p className="mt-3 text-[11px] text-black/45 leading-relaxed">
                En vous inscrivant, vous acceptez de recevoir nos emails. Désinscription à tout moment.
              </p>
            </>
          ) : (
            <>
              <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-bien-leaf text-bien-cream">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="mt-4 font-display tracking-tighter text-[clamp(1.32rem,2.64vw,1.76rem)] leading-[1.05] text-black">
                C&apos;est tout bon !
              </h2>
              <p className="mt-2 text-sm text-black/70 leading-relaxed">
                Voici votre code −10 %, valable sur votre première commande.
                Il t&apos;est aussi envoyé par mail.
              </p>
              <button
                onClick={copyCode}
                className="group mt-5 mx-auto inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-bien-gold bg-bien-gold/10 px-6 py-3.5 transition hover:bg-bien-gold/20"
              >
                <span className="font-display text-xl tracking-wider text-black">
                  {PROMO_CODE}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-bien-leaf">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copié" : "Copier"}
                </span>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="mt-5 text-sm font-semibold text-black/60 hover:text-black transition-colors"
              >
                Continuer mes achats →
              </button>
            </>
          )}
        </div>

        {/* Panneau image — voile dégradé pink→sky (accent doux « bienvenue », charte V2) */}
        <div className="order-1 sm:order-2 relative h-40 sm:h-auto sm:min-h-[420px]">
          <Image
            src="/brand/hero-lifestyle.jpg"
            alt="BIEN — bien-être naturel"
            fill
            sizes="(max-width:640px) 100vw, 384px"
            className="object-cover"
          />
          <div className="absolute inset-0 bien-gradient-pink-sky opacity-30 mix-blend-soft-light" aria-hidden />
        </div>
      </div>
    </div>
  );
}
