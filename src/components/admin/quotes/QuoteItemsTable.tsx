"use client";

import { useState } from "react";
import { formatCLP } from "@/lib/format";
import { calculateLineTotal } from "@/lib/quote-calculations";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import type { DiscountType } from "@/lib/quote-constants";

export interface LocalQuoteItem {
  localId: string;
  catalogItemId: number | null;
  kind: "producto" | "servicio";
  code: string;
  name: string;
  unit: string;
  sizeLabel?: string;
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
}

export function QuoteItemsTable({
  items,
  onChange,
  onRemove,
}: {
  items: LocalQuoteItem[];
  onChange: (localId: string, patch: Partial<LocalQuoteItem>) => void;
  onRemove: (localId: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-10 text-center">
        <p className="text-sm text-ink-500">Todavía no agregas productos ni servicios.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ItemRow key={item.localId} item={item} onChange={onChange} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: LocalQuoteItem;
  onChange: (localId: string, patch: Partial<LocalQuoteItem>) => void;
  onRemove: (localId: string) => void;
}) {
  const [qtyText, setQtyText] = useState(String(item.quantity));
  const lineTotal = calculateLineTotal({
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountType: item.discountType,
    discountValue: item.discountValue,
  });

  function commitQuantity(raw: string) {
    const n = Math.floor(Number(raw));
    const safe = Number.isFinite(n) && n >= 1 ? n : 1;
    setQtyText(String(safe));
    onChange(item.localId, { quantity: safe });
  }

  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-950">
            {item.name} {item.sizeLabel ? <span className="font-normal text-ink-500">· {item.sizeLabel}</span> : null}
          </p>
          <p className="text-xs text-ink-500">
            {item.code} · {formatCLP(item.unitPrice)} / {item.unit}
          </p>
        </div>
        <ConfirmButton
          label="Quitar"
          confirmTitle="¿Eliminar este ítem?"
          confirmDescription={`Se quitará "${item.name}" de la cotización.`}
          onConfirm={() => onRemove(item.localId)}
          className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-ink-400 hover:bg-red-50 hover:text-red-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Cantidad</label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => commitQuantity(String(item.quantity - 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-strong text-ink-700 hover:bg-surface-2"
              aria-label="Restar"
            >
              −
            </button>
            <input
              inputMode="numeric"
              value={qtyText}
              onChange={(e) => setQtyText(e.target.value.replace(/[^0-9]/g, ""))}
              onBlur={(e) => commitQuantity(e.target.value)}
              className="h-10 w-full min-w-0 rounded-md border border-border-strong bg-surface px-2 text-center text-[15px] text-ink-900"
            />
            <button
              type="button"
              onClick={() => commitQuantity(String(item.quantity + 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-strong text-ink-700 hover:bg-surface-2"
              aria-label="Sumar"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Descuento</label>
          <select
            value={item.discountType}
            onChange={(e) => onChange(item.localId, { discountType: e.target.value as DiscountType, discountValue: 0 })}
            className="h-10 w-full rounded-md border border-border-strong bg-surface px-2 text-sm text-ink-900"
          >
            <option value="none">Sin descuento</option>
            <option value="percent">%</option>
            <option value="amount">$</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">
            {item.discountType === "percent" ? "% descuento" : item.discountType === "amount" ? "$ descuento" : "—"}
          </label>
          <input
            inputMode="numeric"
            disabled={item.discountType === "none"}
            value={item.discountType === "none" ? "" : String(item.discountValue)}
            onChange={(e) => {
              const n = Math.max(0, Math.floor(Number(e.target.value.replace(/[^0-9]/g, "")) || 0));
              onChange(item.localId, { discountValue: n });
            }}
            className="h-10 w-full rounded-md border border-border-strong bg-surface px-2 text-sm text-ink-900 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Subtotal</label>
          <p className="flex h-10 items-center justify-end rounded-md bg-surface-2 px-2 text-sm font-semibold text-ink-950">
            {formatCLP(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
