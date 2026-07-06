"use client";

import { useState } from "react";
import { Check, Handshake } from "lucide-react";

const TYPES = [
  "Café / Restaurant",
  "Studio / Salle de sport",
  "Pharmacie / Parapharmacie",
  "Concept-store / Boutique",
  "Spa / Institut",
  "Autre",
];

export default function ResellerForm({ lang }: { lang: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [form, setForm] = useState({
    type: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    location: "",
    web: "",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.company.trim() && form.contact.trim() && form.email.trim() && form.phone.trim() && form.location.trim();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    try {
      await fetch(`/${lang}/api/revendeur`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      /* best-effort : on confirme quand même côté UX */
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-8 sm:p-12 text-center">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-8 w-8" /></span>
        <h2 className="mt-5 font-display font-black tracking-tight text-2xl text-black">Demande envoyée !</h2>
        <p className="mt-2 text-black/70 max-w-md mx-auto leading-relaxed">
          Merci pour votre intérêt. Notre équipe revendeurs revient vers vous sous 48&nbsp;h ouvrées pour étudier votre demande.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl bg-white ring-1 ring-border px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition";

  return (
    <form onSubmit={submit} className="bg-card rounded-3xl ring-1 ring-border bien-shadow-sm p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-black">Type d&apos;établissement</span>
          <select value={form.type} onChange={set("type")} className={`mt-1.5 ${inputCls}`}>
            <option value="">Sélectionnez…</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Nom de l&apos;établissement <span className="text-red-500">*</span></span>
          <input required value={form.company} onChange={set("company")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Nom &amp; prénom du contact <span className="text-red-500">*</span></span>
          <input required value={form.contact} onChange={set("contact")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Email <span className="text-red-500">*</span></span>
          <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Téléphone <span className="text-red-500">*</span></span>
          <input required type="tel" value={form.phone} onChange={set("phone")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Ville / Pays <span className="text-red-500">*</span></span>
          <input required value={form.location} onChange={set("location")} placeholder="Paris, France" className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">Site web / Instagram <span className="text-black/40 font-normal">(optionnel)</span></span>
          <input value={form.web} onChange={set("web")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-black">Votre message <span className="text-black/40 font-normal">(optionnel)</span></span>
          <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Parlez-nous de votre établissement et de votre projet…" className={`mt-1.5 ${inputCls} resize-none`} />
        </label>
      </div>

      <button
        type="submit"
        disabled={!valid || status === "sending"}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-8 py-3.5 font-bold hover:bg-bien-leaf transition-colors disabled:opacity-50 bien-shadow-sm"
      >
        <Handshake className="h-4 w-4" /> {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="mt-3 text-xs text-black/50">
        Ce formulaire est réservé aux demandes professionnelles pour devenir revendeur BIEN.
      </p>
    </form>
  );
}
