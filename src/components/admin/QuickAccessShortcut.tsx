"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth-actions";
import { CloseIcon, ShieldIcon } from "@/components/ui/icons";

export function QuickAccessShortcut() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onSecretTrigger() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("eimp:open-admin-access", onSecretTrigger);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("eimp:open-admin-access", onSecretTrigger);
    };
  }, []);

  useEffect(() => {
    if (state && state.error === "") {
      setOpen(false);
      router.push("/admin");
    }
  }, [state, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-ink-950/60 p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setOpen(false)}
        className="absolute inset-0 z-(--z-modal-backdrop)"
      />
      <div className="relative z-(--z-modal) w-full max-w-xs rounded-xl border border-border bg-bg p-6 shadow-xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:bg-surface-2"
          aria-label="Cerrar"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-700 text-white">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-base font-semibold text-ink-950">Administración</h2>
        </div>

        <form action={formAction} className="mt-5 flex flex-col gap-3">
          <input type="hidden" name="username" value="admin" />
          <input
            type="password"
            name="password"
            autoFocus
            placeholder="Contraseña"
            className="h-12 w-full rounded-md border border-border-strong bg-surface px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700"
          />
          {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-md bg-red-700 text-[15px] font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
