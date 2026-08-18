import { Product } from "@/lib/queries";
import { Button } from "@/components/ui/Button";
import { XCircleIcon } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/product/ProductGlyph";

export function CompareBar({
  products,
  onRemove,
  onClear,
  onOpenCompare,
}: {
  products: Product[];
  onRemove: (slug: string) => void;
  onClear: () => void;
  onOpenCompare: () => void;
}) {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border-strong bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/90">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {products.map((p) => (
            <div
              key={p.slug}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface py-1 pl-1 pr-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2">
                <ProductGlyph category={p.category} className="h-6 w-6" />
              </span>
              <span className="max-w-[120px] truncate text-xs font-medium text-ink-800">{p.name}</span>
              <button
                type="button"
                onClick={() => onRemove(p.slug)}
                aria-label={`Quitar ${p.name} de la comparación`}
                className="text-ink-400 hover:text-ink-800"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="hidden shrink-0 text-sm font-medium text-ink-500 hover:text-ink-800 sm:block"
        >
          Vaciar
        </button>
        <Button size="md" className="shrink-0" onClick={onOpenCompare} disabled={products.length < 2}>
          Comparar ({products.length})
        </Button>
      </div>
    </div>
  );
}
