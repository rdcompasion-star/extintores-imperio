"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/queries";
import type { Media } from "@/lib/media";
import { categoryLabels, type AgentCategory, type Presentation, type FireClassId } from "@/lib/product-constants";
import { saveProductAction } from "@/lib/actions/product-actions";
import { ImagePicker } from "@/components/admin/ImagePicker";

const inputClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700";
const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

const categoryOptions: AgentCategory[] = ["co2", "pqs-abc", "clase-k", "red-humeda"];
const presentationOptions: { value: Presentation; label: string }[] = [
  { value: "portatil", label: "Portátil" },
  { value: "rodante", label: "Rodante (carro)" },
  { value: "gabinete", label: "Gabinete / red húmeda" },
];
const fireClassOptions: FireClassId[] = ["A", "B", "C", "D", "K"];
const classificationOptions = ["", "ABC", "BC", "K"];

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  );
}

export function ProductForm({ product, media }: { product?: Product; media: Media[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? ("pqs-abc" as AgentCategory),
    presentation: product?.presentation ?? ("portatil" as Presentation),
    agent: product?.agent ?? "",
    capacityLabel: product?.capacityLabel ?? "",
    concentration: product?.concentration ?? "",
    extinguishingRating: product?.extinguishingRating ?? "",
    classification: product?.classification ?? "",
    dischargedWeight: product?.dischargedWeight ?? "",
    chargedWeight: product?.chargedWeight ?? "",
    certification: product?.certification ?? "",
    cabinet: product?.cabinet ?? "",
    hose: product?.hose ?? "",
    nozzle: product?.nozzle ?? "",
    reel: product?.reel ?? "",
    cylinder: product?.cylinder ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
    status: product?.status ?? ("draft" as "draft" | "published"),
  });
  const [fireClasses, setFireClasses] = useState<FireClassId[]>(product?.fireClasses ?? []);
  const [image, setImage] = useState<{ id: number; src: string } | null>(
    product?.image ? { id: product.image.id, src: product.image.src } : null
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleFireClass(id: FireClassId) {
    setFireClasses((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function parseCapacity(label: string) {
    const match = label.match(/[\d.]+/);
    const value = match ? parseFloat(match[0]) : 0;
    const unit = /lt|litro/i.test(label) ? "Lt" : "KG";
    return { value, unit };
  }

  function handleSubmit(status: "draft" | "published") {
    startTransition(async () => {
      const { value: capacityValue, unit: capacityUnit } = parseCapacity(form.capacityLabel);
      await saveProductAction(product?.id ?? null, {
        ...form,
        status,
        classification: form.classification || null,
        capacityValue,
        capacityUnit,
        categoryLabel: categoryLabels[form.category],
        fireClasses,
        imageMediaId: image?.id ?? null,
        gallery: [],
      });
      setSaved(true);
      setTimeout(() => {
        router.push("/admin/productos");
        router.refresh();
      }, 700);
    });
  }

  return (
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Información básica</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre del producto" value={form.name} onChange={(v) => update("name", v)} />
          <Field
            label="URL (slug)"
            value={form.slug}
            onChange={(v) => update("slug", v)}
            placeholder="se genera automático si lo dejas vacío"
          />
          <div>
            <label className={labelClasses}>Categoría</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as AgentCategory)}
              className={inputClasses}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Presentación</label>
            <select
              value={form.presentation}
              onChange={(e) => update("presentation", e.target.value as Presentation)}
              className={inputClasses}
            >
              {presentationOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClasses}>Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-md border border-border-strong bg-surface p-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
          />
        </div>
        <div className="mt-4">
          <ImagePicker
            label="Imagen principal"
            folder="productos"
            value={image}
            onChange={setImage}
            initialLibrary={media}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Especificaciones técnicas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Agente" value={form.agent} onChange={(v) => update("agent", v)} placeholder="Ej: Polvo Químico Seco (ABC)" />
          <Field label="Capacidad" value={form.capacityLabel} onChange={(v) => update("capacityLabel", v)} placeholder="Ej: 6 KG" />
          <Field label="Concentración nominal" value={form.concentration} onChange={(v) => update("concentration", v)} placeholder="Ej: 75%" />
          <Field label="Potencial de extinción" value={form.extinguishingRating} onChange={(v) => update("extinguishingRating", v)} placeholder="Ej: 6A - 40BC" />
          <div>
            <label className={labelClasses}>Clasificación</label>
            <select
              value={form.classification ?? ""}
              onChange={(e) => update("classification", e.target.value)}
              className={inputClasses}
            >
              {classificationOptions.map((c) => (
                <option key={c} value={c}>
                  {c || "Sin clasificación"}
                </option>
              ))}
            </select>
          </div>
          <Field label="Certificación" value={form.certification} onChange={(v) => update("certification", v)} placeholder="Ej: CESMEC" />
          <Field label="Masa descargado" value={form.dischargedWeight} onChange={(v) => update("dischargedWeight", v)} placeholder="Ej: 2.5 KG" />
          <Field label="Masa cargado" value={form.chargedWeight} onChange={(v) => update("chargedWeight", v)} placeholder="Ej: 8.5 KG" />
          <Field label="Gabinete (red húmeda)" value={form.cabinet} onChange={(v) => update("cabinet", v)} />
          <Field label="Manguera (red húmeda)" value={form.hose} onChange={(v) => update("hose", v)} />
          <Field label="Carrete (red húmeda)" value={form.reel} onChange={(v) => update("reel", v)} />
          <Field label="Pitón (red húmeda)" value={form.nozzle} onChange={(v) => update("nozzle", v)} />
          <Field label="Cilindro (Clase K)" value={form.cylinder} onChange={(v) => update("cylinder", v)} />
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Clases de fuego a las que aplica</label>
          <div className="flex flex-wrap gap-2">
            {fireClassOptions.map((fc) => (
              <button
                key={fc}
                type="button"
                onClick={() => toggleFireClass(fc)}
                className={`h-9 w-9 rounded-md text-sm font-semibold ${
                  fireClasses.includes(fc) ? "bg-red-700 text-white" : "bg-surface-2 text-ink-600"
                }`}
              >
                {fc}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Precio</h2>
        <Field
          label='Precio (déjalo vacío para mostrar "Consultar precio")'
          value={form.price}
          onChange={(v) => update("price", v)}
          placeholder="Ej: $45.000"
        />
      </section>

      <details className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <summary className="cursor-pointer text-base font-semibold text-ink-950">SEO (opcional)</summary>
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Título para Google" value={form.seoTitle} onChange={(v) => update("seoTitle", v)} />
          <div>
            <label className={labelClasses}>Descripción para Google</label>
            <textarea
              rows={2}
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
              className="w-full rounded-md border border-border-strong bg-surface p-3 text-[15px] text-ink-900"
            />
          </div>
        </div>
      </details>

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
          {saved ? "Guardado ✓" : pending ? "Guardando..." : "Publicar producto"}
        </button>
      </div>
    </div>
  );
}
