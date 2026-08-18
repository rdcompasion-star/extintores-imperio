"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

export function ConfirmButton({
  onConfirm,
  label = "Eliminar",
  confirmTitle = "¿Estás seguro?",
  confirmDescription = "Esta acción se puede deshacer luego desde la papelera.",
  className = "",
  confirmLabel = "Sí, eliminar",
}: {
  onConfirm: () => void | Promise<void>;
  label?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  className?: string;
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-ink-950/60 p-4">
          <div className="w-full max-w-xs rounded-xl border border-border bg-bg p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">{confirmTitle}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink-500">{confirmDescription}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md border border-border-strong bg-surface py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  await onConfirm();
                  setPending(false);
                  setOpen(false);
                }}
                className="flex-1 rounded-md bg-red-700 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {pending ? "..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
