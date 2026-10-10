// Crea il database SQLite e lo popola con il seed al primo avvio,
// così `npm install && npm run dev` (o il primo deploy) funziona senza passaggi manuali.
// Il percorso del database viene da DATABASE_URL (es. "file:./dev.db" o "file:/data/carico.db").
import { existsSync, copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.join(root, ".env");
if (!process.env.DATABASE_URL && !existsSync(envFile)) copyFileSync(path.join(root, ".env.example"), envFile);

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const match = readFileSync(envFile, "utf8").match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
  return match ? match[1] : "file:./dev.db";
}

// I percorsi relativi di SQLite in Prisma sono relativi alla cartella dello schema.
const dbFile = path.resolve(path.join(root, "prisma"), databaseUrl().replace(/^file:/, ""));
mkdirSync(path.dirname(dbFile), { recursive: true });
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

if (!existsSync(dbFile)) {
  console.log(`› Database non trovato (${dbFile}): lo creo e carico gli esercizi…`);
  run("npx prisma db push --skip-generate");
  run("npx prisma db seed");
} else {
  // Allinea lo schema in caso di aggiornamenti (non distruttivo).
  run("npx prisma db push --skip-generate");
}
