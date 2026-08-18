"use client";

import Link from "next/link";
import { useEditMode } from "@/components/admin/EditModeContext";

export function EditModeToggle() {
  const { isAdmin, editMode, setEditMode } = useEditMode();
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 left-5 z-(--z-sticky) flex items-center gap-2 rounded-full border border-border-strong bg-bg py-1.5 pl-1.5 pr-3 shadow-lg shadow-black/10">
      <Link
        href="/admin"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink-700 hover:bg-surface"
        title="Ir al panel"
      >
        ⚙
      </Link>
      <button
        type="button"
        onClick={() => setEditMode(!editMode)}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          editMode ? "bg-red-700 text-white" : "bg-surface-2 text-ink-700"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${editMode ? "bg-white" : "bg-ink-400"}`} />
        {editMode ? "Editando sitio" : "Editar sitio"}
      </button>
    </div>
  );
}
