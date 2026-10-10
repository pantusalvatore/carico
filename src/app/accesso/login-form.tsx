"use client";

import { useActionState } from "react";
import { Button, Field, inputClass } from "@/components/ui";
import { login } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Password" htmlFor="password" error={state?.error}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputClass}
          aria-invalid={!!state?.error}
          aria-describedby={state?.error ? "password-error" : undefined}
        />
      </Field>
      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Verifica…" : "Entra"}
      </Button>
    </form>
  );
}
