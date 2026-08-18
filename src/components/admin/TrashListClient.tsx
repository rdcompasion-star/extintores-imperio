"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/queries";
import { restoreProductAction } from "@/lib/actions/product-actions";

export function TrashListClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function restore(id: number) {
    startTransition(async () => {
      await restoreProductAction(id);
      router.refresh();
    });
  }

  if (products.length === 0) {
    return (
      <div className="mx-5 rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center sm:mx-8">
        <p className="text-sm text-ink-500">La papelera está vacía.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-6 sm:px-8">
      {products.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg p-4">
          <div>
            <p className="text-[15px] font-semibold text-ink-950">{p.name}</p>
            <p className="text-xs text-ink-500">{p.categoryLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => restore(p.id)}
            disabled={pending}
            className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
          >
            Restaurar
          </button>
        </div>
      ))}
    </div>
  );
}
