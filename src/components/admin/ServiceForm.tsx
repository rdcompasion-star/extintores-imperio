"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/queries";
import type { Media } from "@/lib/media";
import type { CtaType } from "@/lib/site-config";
import { saveServiceAction } from "@/lib/actions/service-actions";
import { ImagePicker } from "@/components/admin/ImagePicker";

const inputClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700";
const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

const ctaTypeOptions: { value: CtaType; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp (mensaje)" },
  { value: "tel", label: "Llamar por teléfono" },
  { value: "email", label: "Enviar email" },
  { value: "internal", label: "Página del sitio (ej: /contacto)" },
  { value: "external", label: "Enlace externo" },
];

export function ServiceForm({ service, media }: { service?: Service; media: Media[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: service?.title ?? "",
    slug: service?.slug ?? "",
    summary: service?.summary ?? "",
    description: service?.description ?? "",
    ctaText: service?.ctaText ?? "Solicitar servicio",
    ctaType: service?.ctaType ?? ("whatsapp" as CtaType),
    ctaValue: service?.ctaValue ?? "",
    status: service?.status ?? ("draft" as "draft" | "published"),
  });
  const [image, setImage] = useState<{ id: number; src: string } | null>(
    service?.image ? { id: service.image.id, src: service.image.src } : null
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(status: "draft" | "published") {
    startTransition(async () => {
      await saveServiceAction(service?.id ?? null, {
        ...form,
        status,
        imageMediaId: image?.id ?? null,
      });
      setSaved(true);
      setTimeout(() => {
        router.push("/admin/servicios");
        router.refresh();
      }, 700);
    });
  }

  const ctaPlaceholder =
    form.ctaType === "whatsapp"
      ? "Mensaje que se enviará por WhatsApp"
      : form.ctaType === "tel"
        ? "+56 9 1234 5678"
        : form.ctaType === "email"
          ? "correo@ejemplo.com"
          : form.ctaType === "internal"
            ? "/contacto"
            : "https://...";

  return (
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Nombre del servicio</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>URL (slug)</label>
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="se genera automático si lo dejas vacío"
              className={inputClasses}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClasses}>Resumen corto (se muestra en tarjetas)</label>
          <input value={form.summary} onChange={(e) => update("summary", e.target.value)} className={inputClasses} />
        </div>
        <div className="mt-4">
          <label className={labelClasses}>Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-md border border-border-strong bg-surface p-3 text-[15px] text-ink-900"
          />
        </div>
        <div className="mt-4">
          <ImagePicker
            label="Imagen (opcional)"
            folder="servicios"
            value={image}
            onChange={setImage}
            initialLibrary={media}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Botón de acción</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Texto del botón</label>
            <input value={form.ctaText} onChange={(e) => update("ctaText", e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Acción</label>
            <select
              value={form.ctaType}
              onChange={(e) => update("ctaType", e.target.value as CtaType)}
              className={inputClasses}
            >
              {ctaTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Valor</label>
            <input
              value={form.ctaValue}
              onChange={(e) => update("ctaValue", e.target.value)}
              placeholder={ctaPlaceholder}
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-20 flex flex-col gap-2 sm:relative sm:bottom-0 sm:flex-row sm:justify-end sm:border-t sm:border-border sm:bg-bg sm:py-4">
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          disabled={pending}
          className="rounded-md border border-border-strong bg-surface px-6 py-3 text-[15px] font-semibold text-ink-900 hover:bg-surface-2 disabled:opacity-60"
        >
          Guardar como borrador
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("published")}
          disabled={pending}
          className="rounded-md bg-red-700 px-6 py-3 text-[15px] font-semibold text-white shadow-lg hover:bg-red-800 disabled:opacity-60 sm:shadow-none"
        >
          {saved ? "Guardado ✓" : pending ? "Guardando..." : "Publicar servicio"}
        </button>
      </div>
    </div>
  );
}
