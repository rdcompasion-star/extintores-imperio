import Link from "next/link";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsListClient } from "@/components/admin/ProductsListClient";
import { listProducts } from "@/lib/queries";

export default async function ProductosPage() {
  const products = await listProducts({ includeDrafts: true });

  return (
    <div>
      <AdminPageHeader
        title="Productos"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Productos" }]}
        description={`${products.length} producto${products.length === 1 ? "" : "s"} en el catálogo.`}
        action={
          <div className="flex gap-2">
            <Link
              href="/admin/productos/papelera"
              className="rounded-md border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-2"
            >
              Papelera
            </Link>
            <Link
              href="/admin/productos/nuevo"
              className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              + Nuevo producto
            </Link>
          </div>
        }
      />
      <ProductsListClient products={products} />
    </div>
  );
}
