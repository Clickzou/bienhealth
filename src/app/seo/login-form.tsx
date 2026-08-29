"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Écran d'entrée du tableau de bord. Le formulaire ne fait que transmettre la
 * saisie : la vérification est entièrement côté serveur (`/api/seo/login`), et
 * le mot de passe n'existe nulle part dans le JavaScript envoyé au navigateur.
 */
export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/seo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      setError(res.status === 429 ? "Trop de tentatives. Réessayez dans une minute." : "Identifiant ou mot de passe incorrect.");
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bien-sky">Clickzou</p>
        <h1 className="mt-1 text-2xl font-semibold text-white tracking-tight">SEO by Clickzou</h1>
        <p className="mt-1.5 text-sm text-white/50">Tableau de bord de performance — bien.health</p>

        <label className="block mt-6 text-[13px] text-white/60" htmlFor="seo-user">
          Identifiant
        </label>
        <input
          id="seo-user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          autoFocus
          className="mt-1 w-full rounded-lg bg-black/30 ring-1 ring-white/15 focus:ring-bien-sky outline-none px-3 py-2.5 text-[15px] text-white"
        />

        <label className="block mt-4 text-[13px] text-white/60" htmlFor="seo-pass">
          Mot de passe
        </label>
        <input
          id="seo-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg bg-black/30 ring-1 ring-white/15 focus:ring-bien-sky outline-none px-3 py-2.5 text-[15px] text-white"
        />

        {error && <p className="mt-3 text-[13px] text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={busy || !user || !password}
          className="mt-6 w-full rounded-lg bg-bien-sky text-bien-navy font-semibold py-2.5 hover:brightness-105 disabled:opacity-50 transition"
        >
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
