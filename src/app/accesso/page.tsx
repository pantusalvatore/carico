import type { Metadata } from "next";
import { LogoMark } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Accesso" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ da?: string }> }) {
  const { da } = await searchParams;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <LogoMark size={56} />
      <div className="text-center">
        <h1 className="text-2xl font-black">Carico</h1>
        <p className="text-muted">Inserisci la password per accedere ai tuoi allenamenti.</p>
      </div>
      <LoginForm next={da ?? "/"} />
    </main>
  );
}
