"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ClientLogo } from "@/lib/queries";
import { uploadMediaAction } from "@/lib/actions/media-actions";
import {
  addClientLogoAction,
  updateClientLogoAction,
  replaceClientLogoMediaAction,
  deleteClientLogoAction,
  reorderClientLogosAction,
} from "@/lib/actions/client-logo-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

interface StagedFile {
  localId: string;
  file: File;
  previewUrl: string;
  name: string;
}

let localIdSeq = 0;
function nextLocalId() {
  localIdSeq += 1;
  return `staged-${Date.now()}-${localIdSeq}`;
}

export function ClientLogosManager({ logos }: { logos: ClientLogo[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<number | null>(null);

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next: StagedFile[] = files.map((file) => ({
      localId: nextLocalId(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name.replace(/\.[^.]+$/, ""),
    }));
    setStaged((prev) => [...prev, ...next]);
    e.target.value = "";
  }

  function removeStaged(localId: string) {
    setStaged((prev) => {
      const target = prev.find((s) => s.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((s) => s.localId !== localId);
    });
  }

  function renameStaged(localId: string, name: string) {
    setStaged((prev) => prev.map((s) => (s.localId === localId ? { ...s, name } : s)));
  }

  async function confirmUpload() {
    setUploadProgress({ done: 0, total: staged.length });
    for (const item of staged) {
      const fd = new FormData();
      fd.set("file", item.file);
      fd.set("folder", "clientes");
      const res = await uploadMediaAction(fd);
      if (res.ok) {
        await addClientLogoAction(res.media.id, item.name);
      }
      setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
      URL.revokeObjectURL(item.previewUrl);
    }
    setStaged([]);
    setUploadProgress(null);
    router.refresh();
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteClientLogoAction(id);
      router.refresh();
    });
  }

  function saveName(id: number, name: string) {
    startTransition(async () => {
      await updateClientLogoAction(id, name);
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...logos];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderClientLogosAction(next.map((l) => l.id));
      router.refresh();
    });
  }

  function triggerReplace(id: number) {
    replacingId.current = id;
    replaceInputRef.current?.click();
  }

  function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const id = replacingId.current;
    if (!file || id == null) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "clientes");
      const res = await uploadMediaAction(fd);
      if (res.ok) await replaceClientLogoMediaAction(id, res.media.id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <section className="rounded-xl border border-border bg-bg p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-950">Agregar logos nuevos</h2>
        <p className="mb-4 text-xs text-ink-500">
          Selecciona una o varias imágenes. Podrás revisar la vista previa y el nombre de cada una antes de guardar.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-2"
        >
          + Elegir imágenes
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />

        {staged.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {staged.map((item) => (
                <div key={item.localId} className="rounded-lg border border-border bg-surface p-2.5">
                  <div className="mb-2 flex h-16 items-center justify-center rounded-md bg-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt="" className="h-full w-full object-contain p-1" />
                  </div>
                  <input
                    value={item.name}
                    onChange={(e) => renameStaged(item.localId, e.target.value)}
                    placeholder="Nombre del cliente"
                    className="mb-1.5 w-full rounded-md border border-border-strong bg-bg px-2 py-1.5 text-xs text-ink-900"
                  />
                  <button
                    type="button"
                    onClick={() => removeStaged(item.localId)}
                    className="w-full rounded-md px-2 py-1 text-xs font-medium text-ink-400 hover:bg-red-50 hover:text-red-700"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={confirmUpload}
              disabled={!!uploadProgress}
              className="w-fit rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {uploadProgress
                ? `Subiendo ${uploadProgress.done}/${uploadProgress.total}...`
                : `Guardar ${staged.length} logo${staged.length === 1 ? "" : "s"}`}
            </button>
          </div>
        )}
      </section>

      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFile} />

      {logos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong bg-bg px-6 py-14 text-center">
          <p className="text-sm text-ink-500">Todavía no hay logos cargados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {logos.map((logo, i) => (
            <div key={logo.id} className="rounded-lg border border-border bg-bg p-3">
              <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.media.thumbSrc} alt={logo.name} className="h-full w-full object-contain p-2" />
              </div>
              <input
                defaultValue={logo.name}
                onBlur={(e) => {
                  if (e.target.value !== logo.name) saveName(logo.id, e.target.value);
                }}
                placeholder="Nombre del cliente"
                className="mb-2 w-full rounded-md border border-border-strong bg-surface px-2 py-1.5 text-xs text-ink-900"
              />
              <div className="mb-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || pending}
                  className="flex h-7 flex-1 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === logos.length - 1 || pending}
                  className="flex h-7 flex-1 items-center justify-center rounded-md bg-surface-2 text-ink-500 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerReplace(logo.id)}
                  disabled={pending}
                  className="flex-1 rounded-md border border-border-strong bg-surface px-2 py-1.5 text-xs font-medium text-ink-700 hover:bg-surface-2"
                >
                  Reemplazar
                </button>
                <ConfirmButton
                  label="Eliminar"
                  confirmDescription={`El logo "${logo.name || "sin nombre"}" se quitará de la página.`}
                  onConfirm={() => remove(logo.id)}
                  className="flex-1 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
