"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogIn, UserPlus } from "lucide-react";

const inputCls =
  "mt-1.5 w-full rounded-xl bg-white ring-1 ring-border px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-bien-gold transition";

const T = {
  fr: {
    title: "Mon compte", sub: "Connectez-vous ou créez votre compte BIEN.",
    login: "Se connecter", register: "Créer un compte", error: "Une erreur est survenue.", unavailable: "Service indisponible. Réessayez.",
    email: "Email", password: "Mot de passe", firstName: "Prénom", lastName: "Nom",
    loggingIn: "Connexion…", creating: "Création…", createMy: "Créer mon compte",
    marketing: "Je souhaite recevoir la newsletter et les offres BIEN.",
  },
  en: {
    title: "My account", sub: "Log in or create your BIEN account.",
    login: "Log in", register: "Create an account", error: "Something went wrong.", unavailable: "Service unavailable. Please try again.",
    email: "Email", password: "Password", firstName: "First name", lastName: "Last name",
    loggingIn: "Logging in…", creating: "Creating…", createMy: "Create my account",
    marketing: "I'd like to receive the BIEN newsletter and offers.",
  },
} as const;

export default function AccountAuth({ lang = "fr" }: { lang?: string }) {
  const t = T[lang === "en" ? "en" : "fr"];
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>, path: "login" | "register") {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch(`/api/account/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
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

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-bien-cream text-black"><User className="h-6 w-6" /></span>
        <h1 className="mt-4 font-hero text-[clamp(1.75rem,4vw,2.5rem)] leading-[1] text-black">{t.title}</h1>
        <p className="mt-2 text-black/65">{t.sub}</p>
      </div>

      {/* Onglets */}
      <div className="mt-7 grid grid-cols-2 gap-1 rounded-full bg-bien-cream p-1">
        <button onClick={() => { setTab("login"); setError(null); }} className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${tab === "login" ? "bg-white text-black bien-shadow-sm" : "text-black/60"}`}>{t.login}</button>
        <button onClick={() => { setTab("register"); setError(null); }} className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${tab === "register" ? "bg-white text-black bien-shadow-sm" : "text-black/60"}`}>{t.register}</button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</p>}

      {tab === "login" ? (
        <form onSubmit={(e) => submit(e, "login")} className="mt-6 space-y-4">
          <label className="block"><span className="text-sm font-semibold text-black">{t.email}</span><input name="email" type="email" required autoComplete="email" className={inputCls} /></label>
          <label className="block"><span className="text-sm font-semibold text-black">{t.password}</span><input name="password" type="password" required autoComplete="current-password" className={inputCls} /></label>
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-6 py-3.5 font-bold hover:bg-bien-leaf transition-colors disabled:opacity-50">
            <LogIn className="h-4 w-4" /> {busy ? t.loggingIn : t.login}
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => submit(e, "register")} className="mt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="text-sm font-semibold text-black">{t.firstName}</span><input name="firstName" className={inputCls} /></label>
            <label className="block"><span className="text-sm font-semibold text-black">{t.lastName}</span><input name="lastName" className={inputCls} /></label>
          </div>
          <label className="block"><span className="text-sm font-semibold text-black">{t.email}</span><input name="email" type="email" required autoComplete="email" className={inputCls} /></label>
          <label className="block"><span className="text-sm font-semibold text-black">{t.password}</span><input name="password" type="password" required minLength={5} autoComplete="new-password" className={inputCls} /></label>
          <label className="flex items-center gap-2.5 text-sm text-black/70">
            <input name="acceptsMarketing" type="checkbox" value="true" className="h-4 w-4 rounded accent-bien-forest" /> {t.marketing}
          </label>
          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-bien-forest text-bien-cream px-6 py-3.5 font-bold hover:bg-bien-leaf transition-colors disabled:opacity-50">
            <UserPlus className="h-4 w-4" /> {busy ? t.creating : t.createMy}
          </button>
        </form>
      )}
    </div>
  );
}
