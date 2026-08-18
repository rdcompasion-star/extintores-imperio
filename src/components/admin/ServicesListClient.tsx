"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/queries";
import { deleteServiceAction, reorderServicesAction } from "@/lib/actions/service-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge } from "@/components/ui/Badge";

export function ServicesListClient({ services }: { services: Service[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove(id: number) {
    startTransition(async () => {
      await deleteServiceAction(id);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...services];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderServicesAction(next.map((s) => s.id));
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-6 sm:px-8">
      {services.map((s, i) => (
        <div key={s.id} className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0 || pending}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
              aria-label="Subir"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === services.length - 1 || pending}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
              aria-label="Bajar"
            >
              ↓
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold text-ink-950">{s.title}</p>
              <Badge tone={s.status === "published" ? "ink" : "outline"}>
                {s.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
            </div>
            <p className="truncate text-xs text-ink-500">{s.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/servicios/${s.id}`}
              className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
            >
              Editar
            </Link>
            <ConfirmButton
              label="Eliminar"
              confirmDescription={`"${s.title}" dejará de mostrarse en el sitio.`}
              onConfirm={() => remove(s.id)}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
            />
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center">
          <p className="text-sm text-ink-500">Todavía no hay servicios.</p>
        </div>
      )}
    </div>
  );
}
