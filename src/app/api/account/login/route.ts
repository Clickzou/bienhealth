import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login, CUSTOMER_COOKIE as COOKIE } from "@/lib/shopify-customer";
import { isRateLimited, resetRateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Sans ce garde-fou, rien n'empêchait des milliers de tentatives par minute
  // sur des comptes clients réels (cf. audit sécurité du 29/08/2026, § 2).
  if (isRateLimited(request, "account-login", 8)) return tooManyRequests();

  let email = "", password = "";
  try {
    const b = await request.json();
    email = String(b.email ?? "").trim().toLowerCase();
    password = String(b.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  if (!email || !password) return NextResponse.json({ ok: false, error: "Email et mot de passe requis." }, { status: 400 });

  try {
    const { token, expiresAt, errors } = await login(email, password);
    if (!token) {
      return NextResponse.json({ ok: false, error: errors[0]?.message || "Identifiants incorrects." }, { status: 401 });
    }
    const maxAge = expiresAt ? Math.max(60, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : 60 * 60 * 24 * 13;
    (await cookies()).set(COOKIE, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge,
    });
    // Connexion réussie : on rend son quota à l'utilisateur légitime qui
    // s'était trompé une ou deux fois avant.
    resetRateLimit(request, "account-login");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Connexion indisponible pour le moment." }, { status: 500 });
  }
}
