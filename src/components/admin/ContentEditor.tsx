"use client";

import { useState, useTransition } from "react";
import type { ContentSectionDef } from "@/lib/content-registry";
import { updateContentBlockAction } from "@/lib/actions/content-actions";
import { setSectionVisibilityAction } from "@/lib/actions/section-actions";

export function ContentEditor({
  sections,
  initialContent,
  initialVisibility,
}: {
  sections: ContentSectionDef[];
  initialContent: Record<string, Record<string, string>>;
  initialVisibility: Record<string, boolean>;
}) {
  const [content, setContent] = useState(initialContent);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateField(section: string, field: string, value: string) {
    setContent((c) => ({ ...c, [section]: { ...c[section], [field]: value } }));
  }

  function saveSection(def: ContentSectionDef) {
    startTransition(async () => {
      const values = content[def.section] ?? {};
      await Promise.all(
        def.fields.map((f) => updateContentBlockAction("home", def.section, f.field, values[f.field] ?? ""))
      );
      setSavedSection(def.section);
      setTimeout(() => setSavedSection(null), 1800);
    });
  }

  function toggleVisibility(section: string, next: boolean) {
    setVisibility((v) => ({ ...v, [section]: next }));
    startTransition(async () => {
      await setSectionVisibilityAction(section, next);
    });
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:px-8">
      {sections.map((def) => (
        <details key={def.section} className="group rounded-xl border border-border bg-bg open:pb-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <span className="text-[15px] font-semibold text-ink-950">{def.sectionLabel}</span>
            <div className="flex items-center gap-3">
              {def.toggleable && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-xs font-medium text-ink-500"
                >
                  <input
                    type="checkbox"
                    checked={visibility[def.section] !== false}
                    onChange={(e) => toggleVisibility(def.section, e.target.checked)}
                    className="h-4 w-4 accent-red-700"
                  />
                  Visible
                </label>
              )}
              <span className="text-ink-400 transition-transform group-open:rotate-180">▾</span>
            </div>
          </summary>

          <div className="flex flex-col gap-4 border-t border-border px-5 pt-4">
            {def.fields.map((field) => (
              <div key={field.field}>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={content[def.section]?.[field.field] ?? ""}
                    onChange={(e) => updateField(def.section, field.field, e.target.value)}
                    className="w-full rounded-md border border-border-strong bg-surface p-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
                  />
                ) : (
                  <input
                    value={content[def.section]?.[field.field] ?? ""}
                    onChange={(e) => updateField(def.section, field.field, e.target.value)}
                    className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => saveSection(def)}
              disabled={pending}
              className="w-fit rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {savedSection === def.section ? "Cambios guardados ✓" : "Guardar"}
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}
