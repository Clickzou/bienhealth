"use client";

import { useState } from "react";
import { Check, Handshake } from "lucide-react";

const COPY = {
  fr: {
    types: ["Café / Restaurant", "Studio / Salle de sport", "Pharmacie / Parapharmacie", "Concept-store / Boutique", "Spa / Institut", "Autre"],
    sentTitle: "Demande envoyée !",
    sentText: "Merci pour votre intérêt. Notre équipe revendeurs revient vers vous sous 48 h ouvrées pour étudier votre demande.",
    establishmentType: "Type d'établissement", select: "Sélectionnez…",
    companyName: "Nom de l'établissement", contactName: "Nom & prénom du contact", email: "Email", phone: "Téléphone",
    cityCountry: "Ville / Pays", cityCountryPh: "Paris, France", web: "Site web / Instagram", optional: "(optionnel)",
    message: "Votre message", messagePh: "Parlez-nous de votre établissement et de votre projet…",
    sending: "Envoi…", send: "Envoyer ma demande",
    note: "Ce formulaire est réservé aux demandes professionnelles pour devenir revendeur BIEN.",
  },
  en: {
    types: ["Café / Restaurant", "Studio / Gym", "Pharmacy / Parapharmacy", "Concept store / Shop", "Spa / Salon", "Other"],
    sentTitle: "Enquiry sent!",
    sentText: "Thank you for your interest. Our reseller team will get back to you within 48 business hours to review your enquiry.",
    establishmentType: "Type of business", select: "Select…",
    companyName: "Business name", contactName: "Contact full name", email: "Email", phone: "Phone",
    cityCountry: "City / Country", cityCountryPh: "Paris, France", web: "Website / Instagram", optional: "(optional)",
    message: "Your message", messagePh: "Tell us about your business and your project…",
    sending: "Sending…", send: "Send my enquiry",
    note: "This form is for trade enquiries to become a BIEN reseller only.",
  },
} as const;

export default function ResellerForm({ lang }: { lang: string }) {
  const c = COPY[lang === "en" ? "en" : "fr"];
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
        <h2 className="mt-5 font-display font-black tracking-tight text-2xl text-black">{c.sentTitle}</h2>
        <p className="mt-2 text-black/70 max-w-md mx-auto leading-relaxed">
          {c.sentText}
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
          <span className="text-sm font-semibold text-black">{c.establishmentType}</span>
          <select value={form.type} onChange={set("type")} className={`mt-1.5 ${inputCls}`}>
            <option value="">{c.select}</option>
            {c.types.map((ty) => <option key={ty} value={ty}>{ty}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.companyName} <span className="text-red-500">*</span></span>
          <input required value={form.company} onChange={set("company")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.contactName} <span className="text-red-500">*</span></span>
          <input required value={form.contact} onChange={set("contact")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.email} <span className="text-red-500">*</span></span>
          <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.phone} <span className="text-red-500">*</span></span>
          <input required type="tel" value={form.phone} onChange={set("phone")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.cityCountry} <span className="text-red-500">*</span></span>
          <input required value={form.location} onChange={set("location")} placeholder={c.cityCountryPh} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-black">{c.web} <span className="text-black/40 font-normal">{c.optional}</span></span>
          <input value={form.web} onChange={set("web")} className={`mt-1.5 ${inputCls}`} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-black">{c.message} <span className="text-black/40 font-normal">{c.optional}</span></span>
          <textarea value={form.message} onChange={set("message")} rows={4} placeholder={c.messagePh} className={`mt-1.5 ${inputCls} resize-none`} />
        </label>
      </div>

      <button
        type="submit"
        disabled={!valid || status === "sending"}
        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-8 py-3.5 font-bold hover:bg-bien-leaf transition-colors disabled:opacity-50 bien-shadow-sm"
      >
        <Handshake className="h-4 w-4" /> {status === "sending" ? c.sending : c.send}
      </button>
      <p className="mt-3 text-xs text-black/50">
        {c.note}
      </p>
    </form>
  );
}
