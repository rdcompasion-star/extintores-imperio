"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/lib/queries";
import { saveMenuItemAction, deleteMenuItemAction, reorderMenuItemsAction } from "@/lib/actions/menu-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CloseIcon } from "@/components/ui/icons";

export function MenuManager({ items }: { items: MenuItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<MenuItem | "new" | null>(null);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [visible, setVisible] = useState(true);

  function openNew() {
    setLabel("");
    setHref("/");
    setVisible(true);
    setEditing("new");
  }

  function openEdit(item: MenuItem) {
    setLabel(item.label);
    setHref(item.href);
    setVisible(item.visible);
    setEditing(item);
  }

  function save() {
    startTransition(async () => {
      const id = editing !== "new" && editing ? editing.id : null;
      await saveMenuItemAction(id, label, href, visible);
      setEditing(null);
      router.refresh();
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteMenuItemAction(id);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderMenuItemsAction(next.map((i) => i.id));
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
        + Agregar elemento
      </button>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-bg p-3">
            <div className="flex shrink-0 flex-col gap-1">
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
                disabled={i === items.length - 1 || pending}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-[15px] font-semibold ${item.visible ? "text-ink-950" : "text-ink-400"}`}>
                {item.label} {!item.visible && "(oculto)"}
              </p>
              <p className="truncate text-xs text-ink-500">{item.href}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-xs font-medium text-ink-700 hover:bg-surface-2"
              >
                Editar
              </button>
              <ConfirmButton
                label="Eliminar"
                confirmDescription={`"${item.label}" se quitará del menú.`}
                onConfirm={() => remove(item.id)}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-(--z-modal) flex items-end justify-center bg-ink-950/60 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-xl border border-border bg-bg p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">
                {editing === "new" ? "Nuevo elemento" : "Editar elemento"}
              </p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <label className="mb-1.5 block text-sm font-medium text-ink-700">Nombre</label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mb-3 w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900"
            />
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Enlace</label>
            <input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="/productos"
              className="mb-3 w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900"
            />
            <label className="mb-4 flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="h-4 w-4 accent-red-700"
              />
              Visible en el menú
            </label>

            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="w-full rounded-md bg-red-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
