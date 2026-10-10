import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, authToken, safeEqual } from "@/lib/auth";

/** Se APP_PASSWORD è impostata, tutte le pagine e le API richiedono l'accesso. */
export async function proxy(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) return NextResponse.next();

  const cookie = request.cookies.get(AUTH_COOKIE)?.value ?? "";
  if (cookie && safeEqual(cookie, await authToken(password))) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) return new NextResponse("Accesso richiesto", { status: 401 });
  const url = request.nextUrl.clone();
  url.pathname = "/accesso";
  url.search = `?da=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Restano pubblici: pagina di accesso, risorse statiche, immagini degli esercizi
  // (pubblico dominio), icone, manifest e service worker della PWA, pagina offline.
  matcher: [
    "/((?!accesso|offline|_next/|exercises/|icons/|sw\\.js|manifest\\.webmanifest|favicon\\.ico).*)",
  ],
};
