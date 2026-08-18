"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Faq } from "@/lib/queries";
import { saveFaqAction, deleteFaqAction, reorderFaqsAction } from "@/lib/actions/faq-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge } from "@/components/ui/Badge";
import { CloseIcon } from "@/components/ui/icons";

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Faq | "new" | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function openNew() {
    setQuestion("");
    setAnswer("");
    setEditing("new");
  }

  function openEdit(f: Faq) {
    setQuestion(f.question);
    setAnswer(f.answer);
    setEditing(f);
  }

  function save(status: "draft" | "published") {
    startTransition(async () => {
      const id = editing !== "new" && editing ? editing.id : null;
      await saveFaqAction(id, question, answer, status);
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteFaqAction(id);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...faqs];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderFaqsAction(next.map((f) => f.id));
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:px-8">
      <button
        type="button"
        onClick={openNew}
        className="w-fit rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
      >
        + Nueva pregunta
      </button>

      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={f.id} className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-4 sm:flex-row sm:items-start">
            <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === faqs.length - 1 || pending}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-ink-950">{f.question}</p>
                <Badge tone={f.status === "published" ? "ink" : "outline"}>
                  {f.status === "published" ? "Publicado" : "Oculto"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-ink-500">{f.answer}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => openEdit(f)}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
              >
                Editar
              </button>
              <ConfirmButton
                label="Eliminar"
                confirmDescription="Esta pregunta dejará de mostrarse en el sitio."
                onConfirm={() => remove(f.id)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              />
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center">
            <p className="text-sm text-ink-500">Todavía no hay preguntas frecuentes.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-(--z-modal) flex items-end justify-center bg-ink-950/60 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl border border-border bg-bg p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">
                {editing === "new" ? "Nueva pregunta" : "Editar pregunta"}
              </p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <label className="mb-1.5 block text-sm font-medium text-ink-700">Pregunta</label>
            <input
              autoFocus
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mb-3 w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900"
            />
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Respuesta</label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900"
            />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={pending}
                className="flex-1 rounded-md border border-border-strong bg-surface py-2.5 text-sm font-semibold text-ink-900 disabled:opacity-60"
              >
                Guardar oculto
              </button>
              <button
                type="button"
                onClick={() => save("published")}
                disabled={pending}
                className="flex-1 rounded-md bg-red-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
