"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ui } from "@/lib/i18n";

/**
 * Formulaire d'inscription newsletter pour le footer.
 * Poste vers /api/newsletter (best-effort → Supabase leads / Shopify),
 * puis affiche un message de confirmation.
 */
export default function NewsletterForm({ lang }: { lang: string }) {
  const t = ui(lang).footer;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
    } catch {
      /* best-effort */
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="mt-4 inline-flex items-center gap-2 text-sm text-bien-cream">
        <span className="grid place-items-center h-6 w-6 rounded-full bg-bien-gold text-black"><Check className="h-4 w-4" /></span>
        {t.newsletterDone}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex items-center gap-2 rounded-full bg-bien-cream/10 ring-1 ring-bien-cream/20 p-1 focus-within:ring-bien-gold/60 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletterPlaceholder}
          autoComplete="email"
          className="flex-1 bg-transparent pl-4 py-2.5 text-sm text-bien-cream placeholder:text-bien-cream/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-bien-gold text-black px-4 py-2.5 text-sm font-semibold hover:brightness-95 transition disabled:opacity-60"
        >
          {status === "loading" ? t.newsletterLoading : (<>{t.newsletterCta} <ArrowRight className="h-4 w-4" /></>)}
        </button>
      </div>
      <p className="mt-2.5 text-[11px] text-bien-cream/45 leading-relaxed max-w-md">{t.newsletterConsent}</p>
    </form>
  );
}
