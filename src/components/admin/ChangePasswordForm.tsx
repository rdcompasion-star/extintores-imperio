"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/settings-actions";

const inputClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700";
const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-ink-950">Seguridad</h2>
      <form action={formAction} className="flex flex-col gap-4 sm:max-w-sm">
        <div>
          <label className={labelClasses}>Contraseña actual</label>
          <input type="password" name="current" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Nueva contraseña</label>
          <input type="password" name="next" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Repetir nueva contraseña</label>
          <input type="password" name="confirm" className={inputClasses} />
        </div>
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state?.ok && <p className="text-sm font-medium text-green-700">Contraseña actualizada ✓</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-surface-2 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </section>
  );
}
