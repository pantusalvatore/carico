"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, authToken, safeEqual } from "@/lib/auth";

/** Accetta solo percorsi interni, per evitare redirect verso altri siti. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "/";
  return next.startsWith("/") && !/^\/[\\/]/.test(next) ? next : "/";
}

export async function login(_prev: { error: string } | null, form: FormData): Promise<{ error: string } | null> {
  const expected = process.env.APP_PASSWORD;
  if (!expected) redirect("/");
  const given = String(form.get("password") ?? "");
  // Piccola attesa contro i tentativi a raffica.
  await new Promise((r) => setTimeout(r, 400));
  if (!safeEqual(await authToken(given), await authToken(expected))) return { error: "Password non corretta." };
  (await cookies()).set(AUTH_COOKIE, await authToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(safeNext(form.get("next")));
}
