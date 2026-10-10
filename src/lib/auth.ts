/**
 * Protezione opzionale con password, pensata per quando l'app è pubblicata online.
 * Se la variabile d'ambiente APP_PASSWORD non è impostata (uso in locale) l'app è aperta.
 * Dopo l'accesso il browser riceve un cookie che contiene solo un'impronta della password.
 */
export const AUTH_COOKIE = "carico_accesso";

export function authEnabled(): boolean {
  return !!process.env.APP_PASSWORD;
}

/** Impronta SHA-256 della password (Web Crypto: funziona sia nel proxy sia nelle server action). */
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`carico:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Confronto a tempo costante tra due stringhe della stessa lunghezza. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
