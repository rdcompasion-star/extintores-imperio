import { notFound } from "next/navigation";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById, listMedia } from "@/lib/queries";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  const media = await listMedia();

  return (
    <div>
      <AdminPageHeader
        title={product.name}
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Productos", href: "/admin/productos" },
          { label: "Editar" },
        ]}
      />
      <ProductForm product={product} media={media} />
    </div>
  );
}
