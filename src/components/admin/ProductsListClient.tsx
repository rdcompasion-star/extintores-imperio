"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/queries";
import { setProductStatusAction, duplicateProductAction, deleteProductAction } from "@/lib/actions/product-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge } from "@/components/ui/Badge";

export function ProductsListClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  function toggleStatus(p: Product) {
    startTransition(async () => {
      await setProductStatusAction(p.id, p.status === "published" ? "draft" : "published");
      router.refresh();
    });
  }

  function duplicate(id: number) {
    startTransition(async () => {
      await duplicateProductAction(id);
      router.refresh();
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteProductAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:px-8">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        className="h-11 w-full rounded-md border border-border-strong bg-bg px-3.5 text-[15px] text-ink-900 sm:max-w-sm"
      />

      <div className="flex flex-col gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] text-ink-400">Sin foto</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[15px] font-semibold text-ink-950">{p.name}</p>
                <Badge tone={p.status === "published" ? "ink" : "outline"}>
                  {p.status === "published" ? "Publicado" : "Borrador"}
                </Badge>
              </div>
              <p className="text-xs text-ink-500">
                {p.categoryLabel} · {p.capacityLabel}
                {p.certification ? ` · ${p.certification}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/productos/${p.id}`}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => duplicate(p.id)}
                disabled={pending}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
              >
                Duplicar
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(p)}
                disabled={pending}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
              >
                {p.status === "published" ? "Ocultar" : "Publicar"}
              </button>
              <ConfirmButton
                label="Eliminar"
                confirmDescription={`"${p.name}" se moverá a la papelera y dejará de mostrarse en el sitio.`}
                onConfirm={() => remove(p.id)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center">
            <p className="text-sm text-ink-500">No hay productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
