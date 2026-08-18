"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AgentCategory, Product } from "@/lib/queries";
import { ProductFilters, FilterState, emptyFilterState } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CompareBar } from "@/components/product/CompareBar";
import { CompareModal } from "@/components/product/CompareModal";

export function CatalogExplorer({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  const searchParams = useSearchParams();
  const initialAgent = searchParams.get("agente") as AgentCategory | null;

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...emptyFilterState,
    agents: initialAgent ? [initialAgent] : [],
  }));
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.agents.length && !filters.agents.includes(p.category)) return false;
      if (filters.capacities.length && !filters.capacities.includes(p.capacityLabel)) return false;
      if (
        filters.classifications.length &&
        (!p.classification || !filters.classifications.includes(p.classification))
      )
        return false;
      return true;
    });
  }, [products, filters]);

  function toggleCompare(slug: string) {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }

  const compareProducts = products.filter((p) => compareSlugs.includes(p.slug));

  return (
    <div
      className={`grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] ${
        compareProducts.length > 0 ? "pb-24" : ""
      }`}
    >
      <ProductFilters filters={filters} setFilters={setFilters} resultCount={filtered.length} />

      <div>
        <p className="mb-4 text-sm text-ink-500">
          {filtered.length} producto{filtered.length === 1 ? "" : "s"} encontrado
          {filtered.length === 1 ? "" : "s"}
        </p>
        <ProductGrid
          products={filtered}
          whatsappNumber={whatsappNumber}
          compareEnabled
          compareSlugs={compareSlugs}
          onToggleCompare={toggleCompare}
        />
      </div>

      <CompareBar
        products={compareProducts}
        onRemove={(slug) => setCompareSlugs((prev) => prev.filter((s) => s !== slug))}
        onClear={() => setCompareSlugs([])}
        onOpenCompare={() => setCompareOpen(true)}
      />

      {compareOpen && compareProducts.length > 0 && (
        <CompareModal
          products={compareProducts}
          whatsappNumber={whatsappNumber}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
}
