"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Quote, QuoteCatalogItem } from "@/lib/quote-queries";
import type { DiscountType, CatalogGroup } from "@/lib/quote-constants";
import { catalogGroupLabels } from "@/lib/quote-constants";
import { saveQuoteAction } from "@/lib/actions/quote-actions";
import { calculateQuote } from "@/lib/quote-calculations";
import { formatCLP } from "@/lib/format";
import { validateRut, formatRut } from "@/lib/rut";
import { validateQuoteForm } from "@/lib/quote-validation";
import { todayISO, addDaysISO } from "@/lib/quote-dates";
import { CatalogPicker } from "@/components/admin/quotes/CatalogPicker";
import { QuoteItemsTable, type LocalQuoteItem } from "@/components/admin/quotes/QuoteItemsTable";
import { QuotePreview } from "@/components/admin/quotes/QuotePreview";

const inputClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700";
const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${inputClasses} ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

function TextArea({
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-red-700"
      />
    </div>
  );
}

const steps = ["Cotización", "Cliente", "Ítems", "Descuento", "Condiciones", "Vista previa"];

let localIdSeq = 0;
function nextLocalId() {
  localIdSeq += 1;
  return `local-${Date.now()}-${localIdSeq}`;
}

export function QuoteEditor({
  catalogItems,
  quote,
  companyName,
  vatRate,
  quoteValidDays,
  defaultTerms,
}: {
  catalogItems: QuoteCatalogItem[];
  quote?: Quote;
  companyName: string;
  vatRate: number;
  quoteValidDays: number;
  defaultTerms: { payment: string; delivery: string; dispatch: string; warranty: string };
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [seller, setSeller] = useState(quote?.seller ?? "");
  const [issueDate, setIssueDate] = useState(quote?.issueDate ?? todayISO());
  const [validUntil, setValidUntil] = useState(
    quote?.validUntil ?? addDaysISO(todayISO(), quoteValidDays || 15)
  );

  const [client, setClient] = useState(
    quote?.client ?? {
      name: "",
      rut: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
      comuna: "",
      city: "",
      activity: "",
    }
  );
  const [rutTouched, setRutTouched] = useState(false);

  const [items, setItems] = useState<LocalQuoteItem[]>(
    quote?.items.map((i) => ({
      localId: nextLocalId(),
      catalogItemId: i.catalogItemId,
      kind: i.kind,
      code: i.code,
      name: i.name,
      sizeLabel: i.sizeLabel,
      unit: i.unit,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountType: i.discountType,
      discountValue: i.discountValue,
    })) ?? []
  );

  const [catalogMode, setCatalogMode] = useState<CatalogGroup>("general");
  const pickerItems = useMemo(
    () => catalogItems.filter((i) => i.catalogGroup === (catalogMode === "caf" ? "caf" : "general")),
    [catalogItems, catalogMode]
  );

  const [discountType, setDiscountType] = useState<DiscountType>(quote?.discountType ?? "none");
  const [discountValue, setDiscountValue] = useState(quote?.discountValue ?? 0);

  const [observations, setObservations] = useState(quote?.observations ?? "");
  const [paymentTerms, setPaymentTerms] = useState(quote?.paymentTerms ?? defaultTerms.payment);
  const [deliveryTerms, setDeliveryTerms] = useState(quote?.deliveryTerms ?? defaultTerms.delivery);
  const [dispatchTerms, setDispatchTerms] = useState(quote?.dispatchTerms ?? defaultTerms.dispatch);
  const [warrantyTerms, setWarrantyTerms] = useState(quote?.warrantyTerms ?? defaultTerms.warranty);
  const [extraTerms, setExtraTerms] = useState(quote?.extraTerms ?? "");

  const effectiveVatRate = quote?.vatRate ?? vatRate;

  const totals = useMemo(
    () =>
      calculateQuote({
        lines: items.map((i) => ({
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discountType: i.discountType,
          discountValue: i.discountValue,
        })),
        globalDiscountType: discountType,
        globalDiscountValue: discountValue,
        vatRate: effectiveVatRate,
      }),
    [items, discountType, discountValue, effectiveVatRate]
  );

  const rutValidation = validateRut(client.rut);
  const issues = useMemo(
    () =>
      validateQuoteForm({
        issueDate,
        validUntil,
        seller,
        client,
        items,
      }),
    [issueDate, validUntil, seller, client, items]
  );

  function addCatalogItem(catalogItem: QuoteCatalogItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.catalogItemId === catalogItem.id && i.discountType === "none");
      if (existing) {
        return prev.map((i) => (i.localId === existing.localId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          localId: nextLocalId(),
          catalogItemId: catalogItem.id,
          kind: catalogItem.kind,
          code: catalogItem.code,
          name: catalogItem.name,
          unit: catalogItem.unit,
          sizeLabel: catalogItem.sizeLabel,
          quantity: 1,
          unitPrice: catalogMode === "blank" ? 0 : catalogItem.netPrice,
          manualPrice: catalogMode === "blank",
          discountType: "none",
          discountValue: 0,
        },
      ];
    });
  }

  function updateItem(localId: string, patch: Partial<LocalQuoteItem>) {
    setItems((prev) => prev.map((i) => (i.localId === localId ? { ...i, ...patch } : i)));
  }

  function removeItem(localId: string) {
    setItems((prev) => prev.filter((i) => i.localId !== localId));
  }

  async function persist(nextStatus?: Quote["status"]) {
    setSaveError(null);
    setSaving(true);
    try {
      const result = await saveQuoteAction(quote?.id ?? null, {
        seller,
        issueDate,
        validUntil,
        client,
        items: items.map((i) => ({
          catalogItemId: i.catalogItemId,
          kind: i.kind,
          code: i.code,
          name: i.name,
          sizeLabel: i.sizeLabel ?? "",
          unit: i.unit,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discountType: i.discountType,
          discountValue: i.discountValue,
        })),
        discountType,
        discountValue,
        vatRate: effectiveVatRate,
        observations,
        paymentTerms,
        deliveryTerms,
        dispatchTerms,
        warrantyTerms,
        extraTerms,
        status: nextStatus ?? quote?.status ?? "borrador",
      });
      return result.id;
    } catch {
      setSaveError("No se pudo guardar la cotización. Intenta de nuevo.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    const id = await persist();
    if (id) {
      router.push(`/admin/cotizaciones/${id}`);
      router.refresh();
    }
  }

  async function handleGeneratePdf() {
    if (issues.length > 0) {
      setStep(steps.length - 1);
      return;
    }
    const id = await persist("enviada");
    if (id) {
      window.open(`/api/cotizaciones/${id}/pdf`, "_blank");
      router.push(`/admin/cotizaciones/${id}`);
      router.refresh();
    }
  }

  return (
    <div className="px-5 py-6 sm:px-8">
      {/* Indicador de pasos */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap ${
              i === step
                ? "bg-red-700 text-white"
                : i < step
                  ? "bg-red-50 text-red-700"
                  : "bg-surface-2 text-ink-500"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {step === 0 && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-5">
              <p className="text-xs text-ink-500">
                Número: {quote?.number ?? "se genera automáticamente al guardar"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fecha de la cotización" type="date" value={issueDate} onChange={setIssueDate} />
                <Field label="Fecha de vencimiento" type="date" value={validUntil} onChange={setValidUntil} />
              </div>
              <Field label="Vendedor / responsable" value={seller} onChange={setSeller} placeholder="Nombre del vendedor" />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nombre / Razón social"
                  value={client.name}
                  onChange={(v) => setClient((c) => ({ ...c, name: v }))}
                />
                <Field
                  label="RUT"
                  value={client.rut}
                  onChange={(v) => setClient((c) => ({ ...c, rut: v }))}
                  onBlur={() => {
                    setRutTouched(true);
                    setClient((c) => ({ ...c, rut: formatRut(c.rut) }));
                  }}
                  placeholder="12.345.678-9"
                  error={rutTouched && client.rut.trim() && !rutValidation.valid ? rutValidation.error : undefined}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Persona de contacto"
                  value={client.contact}
                  onChange={(v) => setClient((c) => ({ ...c, contact: v }))}
                />
                <Field
                  label="Teléfono"
                  value={client.phone}
                  onChange={(v) => setClient((c) => ({ ...c, phone: v }))}
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <Field
                label="Email"
                type="email"
                value={client.email}
                onChange={(v) => setClient((c) => ({ ...c, email: v }))}
              />
              <Field
                label="Dirección"
                value={client.address}
                onChange={(v) => setClient((c) => ({ ...c, address: v }))}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Comuna" value={client.comuna} onChange={(v) => setClient((c) => ({ ...c, comuna: v }))} />
                <Field label="Ciudad" value={client.city} onChange={(v) => setClient((c) => ({ ...c, city: v }))} />
                <Field
                  label="Giro / actividad"
                  value={client.activity}
                  onChange={(v) => setClient((c) => ({ ...c, activity: v }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-bg p-5">
                <label className={labelClasses}>Catálogo</label>
                <div className="mb-4 flex gap-2">
                  {(Object.keys(catalogGroupLabels) as CatalogGroup[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setCatalogMode(mode)}
                      className={`rounded-md px-3.5 py-2 text-sm font-medium ${
                        catalogMode === mode ? "bg-red-700 text-white" : "border border-border-strong bg-surface text-ink-700"
                      }`}
                    >
                      {catalogGroupLabels[mode]}
                    </button>
                  ))}
                </div>
                {catalogMode === "blank" && (
                  <p className="mb-3 text-xs text-ink-500">
                    Elige el producto para su nombre y código; el precio queda en blanco para completarlo a mano.
                  </p>
                )}
                <CatalogPicker items={pickerItems} onSelect={addCatalogItem} />
              </div>
              <QuoteItemsTable items={items} onChange={updateItem} onRemove={removeItem} />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-5">
              <p className="text-sm text-ink-500">
                Descuento aplicado sobre el subtotal de la cotización (después de los descuentos por ítem).
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>Tipo de descuento</label>
                  <select
                    value={discountType}
                    onChange={(e) => {
                      setDiscountType(e.target.value as DiscountType);
                      setDiscountValue(0);
                    }}
                    className={inputClasses}
                  >
                    <option value="none">Sin descuento</option>
                    <option value="percent">Porcentaje (%)</option>
                    <option value="amount">Monto fijo ($)</option>
                  </select>
                </div>
                <Field
                  label={discountType === "percent" ? "% de descuento" : discountType === "amount" ? "Monto de descuento" : "—"}
                  value={discountType === "none" ? "" : String(discountValue)}
                  onChange={(v) => setDiscountValue(Math.max(0, Number(v.replace(/[^0-9]/g, "")) || 0))}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-5">
              <Field label="Forma de pago" value={paymentTerms} onChange={setPaymentTerms} />
              <Field label="Plazo de entrega" value={deliveryTerms} onChange={setDeliveryTerms} />
              <Field label="Condiciones de despacho" value={dispatchTerms} onChange={setDispatchTerms} />
              <Field label="Garantía" value={warrantyTerms} onChange={setWarrantyTerms} />
              <TextArea label="Información adicional" value={extraTerms} onChange={setExtraTerms} />
              <TextArea
                label="Observaciones"
                value={observations}
                onChange={setObservations}
                placeholder="Ej: Entrega estimada según disponibilidad."
              />
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              {issues.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-red-700">
                    No se puede generar el PDF todavía:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                    {issues.map((issue) => (
                      <li key={issue.field}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <QuotePreview
                data={{
                  number: quote?.number ?? null,
                  issueDate,
                  validUntil,
                  seller,
                  client,
                  items,
                  discountType,
                  discountValue,
                  vatRate: effectiveVatRate,
                  observations,
                  paymentTerms,
                  deliveryTerms,
                  dispatchTerms,
                  warrantyTerms,
                  extraTerms,
                  companyName,
                }}
              />
            </div>
          )}

          {saveError && <p className="mt-3 text-sm text-red-700">{saveError}</p>}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-40"
            >
              Atrás
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar borrador"}
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                >
                  {step === steps.length - 2 ? "Ir a vista previa" : "Siguiente"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving || issues.length > 0}
                  onClick={handleGeneratePdf}
                  className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-40"
                >
                  {saving ? "Generando…" : "Generar PDF"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen lateral sticky */}
        <aside className="h-fit rounded-xl border border-border bg-bg p-5 lg:sticky lg:top-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-ink-400 uppercase">Resumen</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal</span>
              <span>{formatCLP(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>Descuento</span>
              <span>{totals.discountAmount > 0 ? `-${formatCLP(totals.discountAmount)}` : formatCLP(0)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>Neto</span>
              <span>{formatCLP(totals.net)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>IVA {Math.round(effectiveVatRate * 100)}%</span>
              <span>{formatCLP(totals.vatAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border-strong pt-2 text-base font-bold text-ink-950">
              <span>TOTAL</span>
              <span>{formatCLP(totals.total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-400">{items.length} ítem{items.length === 1 ? "" : "s"} agregado{items.length === 1 ? "" : "s"}</p>
        </aside>
      </div>
    </div>
  );
}
