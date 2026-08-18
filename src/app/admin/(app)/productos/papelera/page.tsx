import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TrashListClient } from "@/components/admin/TrashListClient";
import { listTrashedProducts } from "@/lib/queries";

export default async function PapeleraPage() {
  const products = await listTrashedProducts();

  return (
    <div>
      <AdminPageHeader
        title="Papelera de productos"
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Productos", href: "/admin/productos" },
          { label: "Papelera" },
        ]}
        description="Los productos eliminados quedan aquí hasta que los restaures."
      />
      <TrashListClient products={products} />
    </div>
  );
}
