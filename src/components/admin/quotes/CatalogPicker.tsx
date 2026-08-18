"use client";

import { useMemo, useState } from "react";
import type { QuoteCatalogItem } from "@/lib/quote-queries";
import { catalogCategoryLabels, catalogKindLabels } from "@/lib/quote-constants";
import { formatCLP } from "@/lib/format";

export function CatalogPicker({
  items,
  onSelect,
}: {
  items: QuoteCatalogItem[];
  onSelect: (item: QuoteCatalogItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 30);
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.sizeLabel.toLowerCase().includes(q) ||
          catalogCategoryLabels[item.category]?.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [items, query]);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-ink-700">Producto o servicio</label>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar por nombre, código o categoría… ej: extintor 4kg"
        className="h-12 w-full rounded-md border border-border-strong bg-surface px-3.5 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
      />

      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar búsqueda"
            className="fixed inset-0 z-(--z-dropdown)"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-(--z-dropdown) mt-1.5 max-h-80 w-full overflow-y-auto rounded-lg border border-border-strong bg-bg shadow-lg">
            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-ink-500">Sin resultados para &quot;{query}&quot;.</p>
            )}
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-950">
                    {item.name} <span className="text-ink-500">· {item.sizeLabel}</span>
                  </p>
                  <p className="text-xs text-ink-500">
                    {item.code} · {catalogCategoryLabels[item.category] ?? item.category} ·{" "}
                    {catalogKindLabels[item.kind]}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink-900">{formatCLP(item.netPrice)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
