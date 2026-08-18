import { notFound } from "next/navigation";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { getServiceById, listMedia } from "@/lib/queries";

export default async function EditarServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(Number(id));
  if (!service) notFound();

  const media = await listMedia();

  return (
    <div>
      <AdminPageHeader
        title={service.title}
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Servicios", href: "/admin/servicios" },
          { label: "Editar" },
        ]}
      />
      <ServiceForm service={service} media={media} />
    </div>
  );
}
