"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import type { Customer } from "@/lib/shopify-customer";

const inputCls =
  "mt-1 w-full rounded-xl bg-white ring-1 ring-border px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-bien-gold transition";

const T = {
  fr: {
    edit: "Modifier mes informations", close: "Fermer", title: "Mes informations", error: "Une erreur est survenue.", unavailable: "Service indisponible. Réessayez.",
    firstName: "Prénom", lastName: "Nom", phone: "Téléphone", defaultAddress: "Adresse par défaut", address: "Adresse", addressPh: "12 rue…",
    complement: "Complément", optional: "(optionnel)", zip: "Code postal", city: "Ville", country: "Pays", saving: "Enregistrement…", save: "Enregistrer", cancel: "Annuler",
  },
  en: {
    edit: "Edit my details", close: "Close", title: "My details", error: "Something went wrong.", unavailable: "Service unavailable. Please try again.",
    firstName: "First name", lastName: "Last name", phone: "Phone", defaultAddress: "Default address", address: "Address", addressPh: "12 Main St…",
    complement: "Address line 2", optional: "(optional)", zip: "Postcode", city: "City", country: "Country", saving: "Saving…", save: "Save", cancel: "Cancel",
  },
} as const;

export default function AccountEdit({ customer, lang = "fr" }: { customer: Customer; lang?: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const a = customer.defaultAddress;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.unavailable);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-bien-leaf hover:underline">
        <Pencil className="h-3.5 w-3.5" /> {t.edit}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label={t.close} onClick={() => setOpen(false)} className="absolute inset-0 bg-bien-forest/45 backdrop-blur-sm" />
      <form onSubmit={submit} className="relative w-full max-w-lg rounded-[1.5rem] bg-white ring-1 ring-border bien-shadow p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
        <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute top-4 right-4 grid place-items-center h-8 w-8 rounded-full text-black/60 hover:bg-bien-cream transition-colors"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-xl text-black">{t.title}</h2>

        {error && <p className="mt-3 rounded-xl bg-red-50 text-red-600 px-4 py-2.5 text-sm">{error}</p>}

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-semibold text-black">{t.firstName}</span><input name="firstName" defaultValue={customer.firstName ?? ""} className={inputCls} /></label>
          <label className="block"><span className="text-sm font-semibold text-black">{t.lastName}</span><input name="lastName" defaultValue={customer.lastName ?? ""} className={inputCls} /></label>
        </div>
        <label className="block mt-4"><span className="text-sm font-semibold text-black">{t.phone}</span><input name="phone" type="tel" defaultValue={customer.phone ?? ""} className={inputCls} /></label>

        <h3 className="mt-6 font-display text-black">{t.defaultAddress}</h3>
        <input type="hidden" name="addressId" value={a?.id ?? ""} />
        <label className="block mt-3"><span className="text-sm font-semibold text-black">{t.address}</span><input name="address1" defaultValue={a?.address1 ?? ""} placeholder={t.addressPh} className={inputCls} /></label>
        <label className="block mt-3"><span className="text-sm font-semibold text-black">{t.complement} <span className="text-black/40 font-normal">{t.optional}</span></span><input name="address2" defaultValue={a?.address2 ?? ""} className={inputCls} /></label>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-semibold text-black">{t.zip}</span><input name="zip" defaultValue={a?.zip ?? ""} className={inputCls} /></label>
          <label className="block"><span className="text-sm font-semibold text-black">{t.city}</span><input name="city" defaultValue={a?.city ?? ""} className={inputCls} /></label>
        </div>
        <label className="block mt-3"><span className="text-sm font-semibold text-black">{t.country}</span><input name="country" defaultValue={a?.country ?? "France"} className={inputCls} /></label>

        <div className="mt-6 flex items-center gap-3">
          <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-6 py-3 font-bold hover:bg-bien-leaf transition-colors disabled:opacity-50">
            <Check className="h-4 w-4" /> {busy ? t.saving : t.save}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-black/60 hover:text-black">{t.cancel}</button>
        </div>
      </form>
    </div>
  );
}
