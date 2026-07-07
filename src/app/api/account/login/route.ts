import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login, CUSTOMER_COOKIE as COOKIE } from "@/lib/shopify-customer";

export async function POST(request: Request) {
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
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Connexion indisponible pour le moment." }, { status: 500 });
  }
}
