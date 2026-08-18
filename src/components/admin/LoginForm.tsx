"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth-actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state && state.error === "") {
      router.push(redirectTo);
      router.refresh();
    }
  }, [state, redirectTo, router]);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3">
      <input type="hidden" name="username" value="admin" />
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoFocus
          className="h-12 w-full rounded-md border border-border-strong bg-surface px-3.5 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700"
        />
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 w-full rounded-md bg-red-700 text-[15px] font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
