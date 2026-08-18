"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { QuoteSummary } from "@/lib/quote-queries";
import { duplicateQuoteAction, deleteQuoteAction } from "@/lib/actions/quote-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge } from "@/components/ui/Badge";
import { formatCLP } from "@/lib/format";
import { formatDate } from "@/lib/format";
import { quoteStatusLabels } from "@/lib/quote-constants";

const statusTone: Record<string, "red" | "ink" | "outline"> = {
  borrador: "outline",
  enviada: "ink",
  aceptada: "red",
  rechazada: "outline",
};

export function QuotesListClient({ quotes }: { quotes: QuoteSummary[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const filtered = quotes.filter(
    (q) =>
      q.number.toLowerCase().includes(query.toLowerCase()) ||
      q.clientName.toLowerCase().includes(query.toLowerCase())
  );

  function duplicate(id: number) {
    startTransition(async () => {
      await duplicateQuoteAction(id);
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteQuoteAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:px-8">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por número o cliente..."
        className="h-11 w-full rounded-md border border-border-strong bg-bg px-3.5 text-[15px] text-ink-900 sm:max-w-sm"
      />

      <div className="flex flex-col gap-3">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[15px] font-semibold text-ink-950">{q.number}</p>
                <Badge tone={statusTone[q.status] ?? "outline"}>{quoteStatusLabels[q.status]}</Badge>
              </div>
              <p className="text-xs text-ink-500">
                {q.clientName || "Sin cliente"} · {formatDate(q.issueDate)} · {formatCLP(q.total)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/cotizaciones/${q.id}`}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
              >
                Abrir
              </Link>
              <a
                href={`/api/cotizaciones/${q.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
              >
                PDF
              </a>
              <button
                type="button"
                onClick={() => duplicate(q.id)}
                disabled={pending}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
              >
                Duplicar
              </button>
              <ConfirmButton
                label="Eliminar"
                confirmDescription={`La cotización ${q.number} se eliminará del historial.`}
                onConfirm={() => remove(q.id)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center">
            <p className="text-sm text-ink-500">No hay cotizaciones que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
