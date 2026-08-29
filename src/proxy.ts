import { NextResponse, type NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function getLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept.split(",")[0]?.split("-")[0]?.toLowerCase();
  return locales.includes(preferred ?? "") ? (preferred as string) : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // `seo` est exclu au même titre que `api` : le tableau de bord
  // « SEO by Clickzou » vit hors du site multilingue, une redirection vers
  // /fr/seo le rendrait introuvable.
  matcher: ["/((?!_next|api|seo|.*\\..*).*)"],
};
