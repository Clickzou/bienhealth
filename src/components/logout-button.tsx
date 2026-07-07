"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ lang = "fr" }: { lang?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/account/logout", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-5 py-2.5 text-sm font-semibold hover:bg-bien-forest hover:text-bien-cream transition-colors disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" /> {busy ? "…" : lang === "en" ? "Log out" : "Se déconnecter"}
    </button>
  );
}
