"use client";

import { useState, type ElementType } from "react";
import { useEditMode } from "@/components/admin/EditModeContext";
import { updateContentBlockAction } from "@/lib/actions/content-actions";
import { CloseIcon } from "@/components/ui/icons";

interface EditableTextProps {
  page: string;
  section: string;
  field: string;
  value: string;
  as?: ElementType;
  multiline?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableText({
  page,
  section,
  field,
  value,
  as: Tag = "span",
  multiline = false,
  label = "Editar texto",
  className = "",
  style,
}: EditableTextProps) {
  const { editMode } = useEditMode();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!editMode) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  function openEditor() {
    setDraft(value);
    setSaved(false);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const res = await updateContentBlockAction(page, section, field, draft);
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setOpen(false), 700);
    }
  }

  return (
    <span className="group/edit relative inline-block w-full align-top">
      <Tag
        role="button"
        tabIndex={0}
        onClick={openEditor}
        onKeyDown={(e: React.KeyboardEvent) => (e.key === "Enter" ? openEditor() : undefined)}
        className={`${className} cursor-pointer rounded-sm outline-dashed outline-2 outline-offset-4 outline-transparent transition-[outline-color] hover:outline-red-400`}
        style={style}
      >
        {value}
      </Tag>
      <span className="pointer-events-none absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white group-hover/edit:flex">
        ✎
      </span>

      {open && (
        <div
          className="fixed inset-0 z-(--z-modal) flex items-end justify-center bg-ink-950/60 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-bg p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">{label}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {multiline ? (
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
              />
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
              />
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-ink-500 hover:bg-surface-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {saved ? "Guardado ✓" : saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
