import Link from "next/link";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServicesListClient } from "@/components/admin/ServicesListClient";
import { listServices } from "@/lib/queries";

export default async function ServiciosAdminPage() {
  const services = await listServices({ includeDrafts: true });

  return (
    <div>
      <AdminPageHeader
        title="Servicios"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Servicios" }]}
        action={
          <Link
            href="/admin/servicios/nuevo"
            className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          >
            + Nuevo servicio
          </Link>
        }
      />
      <ServicesListClient services={services} />
    </div>
  );
}
