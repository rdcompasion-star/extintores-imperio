import { Suspense } from "react";
import type { Metadata } from "next";
import "@/lib/bootstrap";
import { Container } from "@/components/ui/Container";
import { CatalogExplorer } from "@/components/product/CatalogExplorer";
import { listProducts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Catálogo de extintores",
  description:
    "Catálogo completo de extintores CO₂, Polvo Químico Seco (PQS ABC), Clase K y red húmeda. Filtra por agente, capacidad y clasificación. Certificación CESMEC.",
};

export default async function ProductosPage() {
  const products = await listProducts();
  const settings = await getSettings();

  return (
    <div className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold text-ink-950 sm:text-4xl">Catálogo de extintores</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500 sm:text-base">
            Filtra por tipo de agente, capacidad o clasificación para encontrar el extintor adecuado.
            Todos los precios se entregan por cotización directa.
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogExplorer products={products} whatsappNumber={settings.whatsappNumber} />
        </Suspense>
      </Container>
    </div>
  );
}
