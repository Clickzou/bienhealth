import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { register, login, CUSTOMER_COOKIE as COOKIE } from "@/lib/shopify-customer";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(request, "account-register", 3)) return tooManyRequests();

  let email = "", password = "", firstName = "", lastName = "", acceptsMarketing = false;
  try {
    const b = await request.json();
    email = String(b.email ?? "").trim().toLowerCase();
    password = String(b.password ?? "");
    firstName = String(b.firstName ?? "").trim();
    lastName = String(b.lastName ?? "").trim();
    acceptsMarketing = Boolean(b.acceptsMarketing);
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  if (!email || !password || password.length < 5) {
    return NextResponse.json({ ok: false, error: "Email et mot de passe (5 caractères min.) requis." }, { status: 400 });
  }

  try {
    const { errors } = await register({ email, password, firstName, lastName, acceptsMarketing });
    if (errors.length) {
      const taken = errors.some((e) => e.code === "TAKEN" || e.code === "CUSTOMER_DISABLED");
      return NextResponse.json(
        { ok: false, error: taken ? "Un compte existe déjà avec cet email. Connectez-vous." : errors[0].message },
        { status: 400 },
      );
    }
    // Connexion automatique après inscription.
    const { token, expiresAt } = await login(email, password);
    if (token) {
      const maxAge = expiresAt ? Math.max(60, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : 60 * 60 * 24 * 13;
      (await cookies()).set(COOKIE, token, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Inscription indisponible pour le moment." }, { status: 500 });
  }
}
