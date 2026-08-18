import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { listMedia } from "@/lib/queries";

export default async function NuevoProductoPage() {
  const media = await listMedia();

  return (
    <div>
      <AdminPageHeader
        title="Nuevo producto"
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Productos", href: "/admin/productos" },
          { label: "Nuevo" },
        ]}
      />
      <ProductForm media={media} />
    </div>
  );
}
