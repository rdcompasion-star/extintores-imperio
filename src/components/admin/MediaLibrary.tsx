"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Media } from "@/lib/media";
import { mediaFolders } from "@/lib/media";
import { uploadMediaAction, deleteMediaAction, updateMediaAltAction } from "@/lib/actions/media-actions";
import { CloseIcon } from "@/components/ui/icons";

export function MediaLibrary({ initialMedia }: { initialMedia: Media[] }) {
  const [items, setItems] = useState(initialMedia);
  const [folder, setFolder] = useState<string>("all");
  const [uploadFolder, setUploadFolder] = useState<string>("general");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Media | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = folder === "all" ? items : items.filter((m) => m.folder === folder);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", uploadFolder);
      const res = await uploadMediaAction(fd);
      if (res.ok) {
        setItems((prev) => [res.media, ...prev]);
      } else {
        setError(res.error);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const res = await deleteMediaAction(id);
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(res.error);
      }
    });
  }

  function handleSaveAlt(id: number, alt: string) {
    startTransition(async () => {
      await updateMediaAltAction(id, alt);
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, alt } : m)));
      setEditing(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <div className="rounded-xl border border-dashed border-border-strong bg-bg p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Carpeta destino</label>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 sm:w-56"
            >
              {mediaFolders.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-11 rounded-md bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {uploading ? "Subiendo..." : "Subir foto"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
        <p className="mt-2 text-xs text-ink-400">JPG, PNG, WEBP, AVIF o SVG. Máximo 10MB por imagen.</p>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFolder("all")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
            folder === "all" ? "bg-red-700 text-white" : "bg-surface-2 text-ink-700"
          }`}
        >
          Todas
        </button>
        {mediaFolders.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFolder(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              folder === f.value ? "bg-red-700 text-white" : "bg-surface-2 text-ink-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-16 text-center">
          <p className="text-sm text-ink-500">Todavía no hay imágenes en esta carpeta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-lg border border-border bg-bg">
              <div className="flex aspect-square items-center justify-center bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.thumbSrc} alt={m.alt || m.originalName} className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-ink-700">{m.originalName}</p>
                <p className="truncate text-[11px] text-ink-400">{m.alt || "Sin texto alternativo"}</p>
              </div>
              <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditing(m)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-ink-700 shadow"
                  title="Editar texto alternativo"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={pending}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-red-700 shadow"
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-ink-950/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-bg p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">Texto alternativo</p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <img src={editing.thumbSrc} alt="" className="mb-3 h-32 w-full rounded-md object-cover" />
            <input
              autoFocus
              defaultValue={editing.alt}
              placeholder="Ej: Extintor PQS ABC de 6 kilos"
              className="w-full rounded-md border border-border-strong bg-surface p-3 text-sm text-ink-900"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAlt(editing.id, (e.target as HTMLInputElement).value);
              }}
              id="alt-input"
            />
            <button
              type="button"
              onClick={() => handleSaveAlt(editing.id, (document.getElementById("alt-input") as HTMLInputElement).value)}
              className="mt-3 w-full rounded-md bg-red-700 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
