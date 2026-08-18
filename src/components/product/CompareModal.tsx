import { Product } from "@/lib/queries";
import { CloseIcon } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/product/ProductGlyph";
import { ButtonLink } from "@/components/ui/Button";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "@/lib/site-config";

const rows: { label: string; get: (p: Product) => string }[] = [
  { label: "Agente", get: (p) => p.agent },
  { label: "Capacidad", get: (p) => p.capacityLabel },
  { label: "Clasificación", get: (p) => p.classification ?? "—" },
  { label: "Potencial de extinción", get: (p) => p.extinguishingRating ?? "—" },
  { label: "Concentración nominal", get: (p) => p.concentration ?? "—" },
  { label: "Masa descargado", get: (p) => p.dischargedWeight ?? "—" },
  { label: "Masa cargado", get: (p) => p.chargedWeight ?? "—" },
  { label: "Certificación", get: (p) => p.certification ?? "—" },
];

export function CompareModal({
  products,
  whatsappNumber,
  onClose,
}: {
  products: Product[];
  whatsappNumber: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-(--z-modal)">
      <button
        type="button"
        aria-label="Cerrar comparador"
        onClick={onClose}
        className="absolute inset-0 z-(--z-modal-backdrop) bg-ink-950/60"
      />
      <div className="absolute inset-x-0 bottom-0 top-6 z-(--z-modal) flex flex-col rounded-t-2xl bg-bg sm:inset-x-6 sm:top-12 sm:rounded-2xl lg:inset-x-16">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-ink-950">Comparar extintores</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2"
            aria-label="Cerrar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-36 text-left text-xs font-semibold uppercase tracking-wide text-ink-400" />
                  {products.map((p) => (
                    <th key={p.slug} className="min-w-[180px] px-3 pb-4 text-left align-top">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-2">
                        <ProductGlyph category={p.category} className="h-11 w-11" />
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-snug text-ink-950">{p.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-surface" : ""}>
                    <th scope="row" className="sticky left-0 px-3 py-3 text-left text-sm font-medium text-ink-600">
                      {row.label}
                    </th>
                    {products.map((p) => (
                      <td key={p.slug} className="px-3 py-3 font-mono text-sm text-ink-900">
                        {row.get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="px-3 py-4 text-left text-sm font-medium text-ink-600">
                    Cotizar
                  </th>
                  {products.map((p) => (
                    <td key={p.slug} className="px-3 py-4">
                      <ButtonLink
                        href={buildWhatsAppLink(whatsappNumber, buildProductWhatsAppMessage(p.name))}
                        external
                        size="md"
                      >
                        Cotizar
                      </ButtonLink>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
