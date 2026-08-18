import { formatCLP } from "@/lib/format";
import { formatDate } from "@/lib/format";
import { calculateQuote, calculateLineTotal } from "@/lib/quote-calculations";
import type { LocalQuoteItem } from "@/components/admin/quotes/QuoteItemsTable";
import type { DiscountType } from "@/lib/quote-constants";

export interface QuotePreviewData {
  number: string | null;
  issueDate: string;
  validUntil: string;
  seller: string;
  client: {
    name: string;
    rut: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    comuna: string;
    city: string;
    activity: string;
  };
  items: LocalQuoteItem[];
  discountType: DiscountType;
  discountValue: number;
  vatRate: number;
  observations: string;
  paymentTerms: string;
  deliveryTerms: string;
  dispatchTerms: string;
  warrantyTerms: string;
  extraTerms: string;
  companyName: string;
}

function discountLabel(type: DiscountType, value: number) {
  if (type === "percent") return `${value}%`;
  if (type === "amount") return formatCLP(value);
  return "—";
}

export function QuotePreview({ data }: { data: QuotePreviewData }) {
  const totals = calculateQuote({
    lines: data.items.map((i) => ({
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountType: i.discountType,
      discountValue: i.discountValue,
    })),
    globalDiscountType: data.discountType,
    globalDiscountValue: data.discountValue,
    vatRate: data.vatRate,
  });

  const terms = [
    { label: "Forma de pago", value: data.paymentTerms },
    { label: "Plazo de entrega", value: data.deliveryTerms },
    { label: "Despacho", value: data.dispatchTerms },
    { label: "Garantía", value: data.warrantyTerms },
    { label: "Información adicional", value: data.extraTerms },
  ].filter((t) => t.value.trim());

  return (
    <div className="rounded-xl border border-border bg-bg p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">{data.companyName}</p>
          <h3 className="text-lg font-semibold text-ink-950">Cotización {data.number ?? "(se generará al guardar)"}</h3>
        </div>
        <div className="text-right text-sm text-ink-500">
          <p>Fecha: {formatDate(data.issueDate)}</p>
          <p>Válida hasta: {formatDate(data.validUntil)}</p>
          <p>Vendedor: {data.seller || "—"}</p>
        </div>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">Cliente</p>
          <p className="text-sm font-medium text-ink-950">{data.client.name || "—"}</p>
          <p className="text-sm text-ink-500">RUT: {data.client.rut || "—"}</p>
          {data.client.contact && <p className="text-sm text-ink-500">Contacto: {data.client.contact}</p>}
          {data.client.phone && <p className="text-sm text-ink-500">Tel: {data.client.phone}</p>}
          {data.client.email && <p className="text-sm text-ink-500">{data.client.email}</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">Dirección</p>
          <p className="text-sm text-ink-500">{data.client.address || "—"}</p>
          <p className="text-sm text-ink-500">
            {[data.client.comuna, data.client.city].filter(Boolean).join(", ") || "—"}
          </p>
          {data.client.activity && <p className="text-sm text-ink-500">Giro: {data.client.activity}</p>}
        </div>
      </div>

      <div className="mb-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border-strong text-left text-xs font-semibold tracking-wide text-ink-400 uppercase">
              <th className="py-2 pr-2">Código</th>
              <th className="py-2 pr-2">Producto / Servicio</th>
              <th className="py-2 pr-2 text-right">Cant.</th>
              <th className="py-2 pr-2 text-right">Precio</th>
              <th className="py-2 pr-2 text-right">Desc.</th>
              <th className="py-2 pr-0 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.localId} className="border-b border-border">
                <td className="py-2 pr-2 text-ink-500">{item.code}</td>
                <td className="py-2 pr-2 text-ink-900">
                  {item.name} {item.sizeLabel ? `· ${item.sizeLabel}` : ""}
                </td>
                <td className="py-2 pr-2 text-right text-ink-900">{item.quantity}</td>
                <td className="py-2 pr-2 text-right text-ink-900">{formatCLP(item.unitPrice)}</td>
                <td className="py-2 pr-2 text-right text-ink-500">{discountLabel(item.discountType, item.discountValue)}</td>
                <td className="py-2 pr-0 text-right font-medium text-ink-950">
                  {formatCLP(
                    calculateLineTotal({
                      quantity: item.quantity,
                      unitPrice: item.unitPrice,
                      discountType: item.discountType,
                      discountValue: item.discountValue,
                    })
                  )}
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-ink-400">
                  Sin ítems agregados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-5 flex justify-end">
        <div className="w-full max-w-xs space-y-1.5 text-sm">
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
            <span>IVA {Math.round(data.vatRate * 100)}%</span>
            <span>{formatCLP(totals.vatAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border-strong pt-1.5 text-base font-bold text-ink-950">
            <span>TOTAL</span>
            <span>{formatCLP(totals.total)}</span>
          </div>
        </div>
      </div>

      {terms.length > 0 && (
        <div className="mb-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">Condiciones comerciales</p>
          <dl className="grid gap-1.5 text-sm sm:grid-cols-2">
            {terms.map((t) => (
              <div key={t.label} className="flex gap-2">
                <dt className="shrink-0 font-medium text-ink-700">{t.label}:</dt>
                <dd className="text-ink-500">{t.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {data.observations.trim() && (
        <div className="border-t border-border pt-4">
          <p className="mb-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">Observaciones</p>
          <p className="text-sm text-ink-500">{data.observations}</p>
        </div>
      )}
    </div>
  );
}
