import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSession, SEO_COOKIE, SESSION_MAX_AGE } from "@/lib/seo-dashboard/auth";
import { verifierLaissezPasser } from "@/lib/seo-dashboard/laissez-passer";

/**
 * GET /api/seo/sso/?jeton=… — connexion automatique au tableau de bord /seo
 * depuis clickzou.fr (laissez-passer signé, 2 min max) : même cookie de session
 * que la connexion par identifiant. Laissez-passer absent ou invalide : écran de
 * connexion habituel.
 */
export async function GET(requete: Request) {
  const url = new URL(requete.url);
  const tableau = new URL("/seo", url.origin);
  if (!verifierLaissezPasser(url.searchParams.get("jeton"), "bien.health")) return NextResponse.redirect(tableau);
  (await cookies()).set(SEO_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return NextResponse.redirect(tableau);
}
