"use client";

import { useRef, useState } from "react";
import type { Media } from "@/lib/media";
import { uploadMediaAction } from "@/lib/actions/media-actions";
import { CloseIcon } from "@/components/ui/icons";

export function ImagePicker({
  label,
  folder,
  value,
  onChange,
  initialLibrary,
}: {
  label: string;
  folder: string;
  value: { id: number; src: string } | null;
  onChange: (media: Media | null) => void;
  initialLibrary: Media[];
}) {
  const [open, setOpen] = useState(false);
  const [library, setLibrary] = useState<Media[]>(initialLibrary.filter((m) => m.folder === folder));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    setOpen(true);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    const res = await uploadMediaAction(fd);
    setUploading(false);
    if (res.ok) {
      onChange(res.media);
      setLibrary((prev) => (prev ? [res.media, ...prev] : [res.media]));
      setOpen(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.src} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-ink-400">Sin foto</span>
          )}
        </div>
        <button
          type="button"
          onClick={openPicker}
          className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-2"
        >
          {value ? "Cambiar imagen" : "Elegir imagen"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm font-medium text-red-700"
          >
            Quitar
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-(--z-modal) flex items-end justify-center bg-ink-950/60 p-4 sm:items-center">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-bg">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-semibold text-ink-900">Biblioteca de imágenes</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-border px-5 py-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {uploading ? "Subiendo..." : "Subir nueva imagen"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {library.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {library.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onChange(m);
                        setOpen(false);
                      }}
                      className="aspect-square overflow-hidden rounded-lg border border-border hover:border-red-500"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.thumbSrc} alt={m.alt} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-500">No hay imágenes en esta carpeta todavía. Sube la primera.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
