import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { listMedia } from "@/lib/queries";

export default async function NuevoServicioPage() {
  const media = await listMedia();

  return (
    <div>
      <AdminPageHeader
        title="Nuevo servicio"
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Servicios", href: "/admin/servicios" },
          { label: "Nuevo" },
        ]}
      />
      <ServiceForm media={media} />
    </div>
  );
}
