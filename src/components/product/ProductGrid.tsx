import { Product } from "@/lib/queries";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({
  products,
  whatsappNumber,
  compareEnabled,
  compareSlugs,
  onToggleCompare,
}: {
  products: Product[];
  whatsappNumber: string;
  compareEnabled?: boolean;
  compareSlugs?: string[];
  onToggleCompare?: (slug: string) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
        <p className="text-base font-semibold text-ink-900">No encontramos productos con esos filtros</p>
        <p className="mt-2 text-sm text-ink-500">Prueba limpiando algún filtro o consulta directamente con nosotros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          whatsappNumber={whatsappNumber}
          compareEnabled={compareEnabled}
          isComparing={compareSlugs?.includes(product.slug)}
          compareDisabled={
            compareEnabled && !compareSlugs?.includes(product.slug) && (compareSlugs?.length ?? 0) >= 3
          }
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
